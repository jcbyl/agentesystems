import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

// Cache-Control policy for favicon/icon assets.
//
// Goal: make icon updates propagate reliably across Chrome, Safari, Firefox
// without users needing to hard-reload.
//
//   • Fingerprinted assets (`/assets/<name>-<hash>.<ext>`) — content-addressed,
//     so they can be cached forever. `immutable` tells the browser to skip
//     revalidation entirely on reload (huge Safari win — Safari otherwise
//     revalidates favicons aggressively).
//
//   • Unhashed icon paths that older installs may still request
//     (`/favicon-*.png`, `/apple-touch-icon*.png`, `/icon-*.png`) — short
//     cache + must-revalidate, so any change is picked up on the next visit.
//
//   • `/manifest.webmanifest` — handled by its own server route header.
//
// We only ADD a Cache-Control header when one is missing. The Cloudflare
// runtime / Vite plugin already set sensible defaults for hashed assets in
// most setups; this is defensive belt-and-suspenders so the behavior is
// identical in dev, preview, and prod.
const IMMUTABLE_ASSET_RE = /^\/assets\/[^/]+-[A-Za-z0-9_-]{6,}\.[a-z0-9]+$/i;
const SHORT_CACHE_ICON_RE =
  /^\/(?:favicon(?:[-.][\w-]*)?\.(?:png|ico|svg)|apple-touch-icon[\w-]*\.png|icon[-.][\w-]*\.png)$/i;

// Legacy icon paths at the site root that should fall back to the canonical
// Apple-style rounded icon. Catches old bookmarks, scrapers, link-preview
// bots, and stale HTML from previous deploys that still reference unhashed
// filenames. We rewrite them to the splat handler at
// `/api/icon-fallback/<name>`, which 302s to the right fingerprinted asset.
//
// `/favicon.ico` has its own dedicated route file and is intentionally
// excluded here so the rewrite doesn't shadow it.
const LEGACY_ICON_FALLBACK_RE =
  /^\/(?:favicon(?:-[\w-]*)?\.(?:png|svg)|apple-touch-icon(?:-precomposed)?(?:-[\w-]*)?\.png|icon-[\w-]+\.png)$/i;

function rewriteLegacyIconRequest(request: Request): Request {
  const url = new URL(request.url);
  if (!LEGACY_ICON_FALLBACK_RE.test(url.pathname)) return request;
  // Don't shadow the canonical assets emitted by Vite under /assets/.
  if (url.pathname.startsWith("/assets/")) return request;

  const name = url.pathname.replace(/^\/+/, "");
  const rewritten = new URL(`/api/icon-fallback/${name}`, url);
  rewritten.search = url.search;
  return new Request(rewritten.toString(), request);
}

function applyIconCacheHeaders(request: Request, response: Response): Response {
  if (response.status >= 400) return response;
  if (response.headers.has("cache-control")) return response;

  const pathname = new URL(request.url).pathname;

  let cacheControl: string | undefined;
  if (IMMUTABLE_ASSET_RE.test(pathname)) {
    cacheControl = "public, max-age=31536000, immutable";
  } else if (SHORT_CACHE_ICON_RE.test(pathname)) {
    cacheControl = "public, max-age=300, must-revalidate";
  }

  if (!cacheControl) return response;

  // Response headers are immutable once the body has been consumed by the
  // runtime — clone to be safe.
  const headers = new Headers(response.headers);
  headers.set("cache-control", cacheControl);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Cache-Control policy for HTML documents.
//
// SSR HTML is NOT content-addressed — the same URL (e.g. `/`, `/medical`)
// returns different markup every deploy as we ship copy, layout, and CTA
// updates (phone link, "Book a demo" button, etc.). If a browser or
// intermediate cache serves a stale HTML document, the user sees the old
// UI even though the underlying fingerprinted JS/CSS assets have changed.
//
// Force every HTML response to revalidate on each navigation:
//
//   • `no-cache` — the browser MAY keep a copy but MUST revalidate with
//     the origin before reusing it (sends a conditional GET).
//   • `no-store` — disables disk + memory cache entirely, defeats Back/
//     Forward Cache (bfcache) resurrection of stale HTML.
//   • `must-revalidate` — proxies/CDNs must honor the above instead of
//     serving stale on error.
//
// Fingerprinted JS/CSS/image assets keep their long-lived immutable cache
// from `applyIconCacheHeaders` / the Vite plugin defaults; only the HTML
// shell is forced fresh.
function applyHtmlCacheHeaders(response: Response): Response {
  if (response.status >= 400) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("text/html")) return response;
  // Respect any explicit Cache-Control the app set on purpose (e.g. error
  // pages, /api/* HTML). Only override the default-empty case.
  if (response.headers.has("cache-control")) return response;

  const headers = new Headers(response.headers);
  headers.set("cache-control", "no-store, no-cache, must-revalidate, max-age=0");
  headers.set("pragma", "no-cache");
  headers.set("expires", "0");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const rewritten = rewriteLegacyIconRequest(request);
      const response = await handler.fetch(rewritten, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      const withIconHeaders = applyIconCacheHeaders(request, normalized);
      return applyHtmlCacheHeaders(withIconHeaders);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
