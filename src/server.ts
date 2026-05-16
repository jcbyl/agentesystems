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
  /^\/(?:favicon[-.][\w-]*\.(?:png|ico|svg)|apple-touch-icon[\w-]*\.png|icon[-.][\w-]*\.png)$/i;

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

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      return applyIconCacheHeaders(request, normalized);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
