#!/usr/bin/env node
/**
 * Build-time + optional live check for social-sharing <head> tags.
 *
 * For every public route we verify that the rendered <head> exposes the
 * full OpenGraph + Twitter + canonical + bilingual EN/ES surface that
 * social crawlers (Facebook, LinkedIn, Twitter/X, iMessage, WhatsApp,
 * Slack) and search engines rely on.
 *
 * Two modes:
 *
 *   1. Static (default) — parses each route's head() meta/links and
 *      merges in __root.tsx defaults (parent meta is inherited via
 *      property/name dedupe). Runs with zero network, fast, wired into
 *      `npm run build`.
 *
 *   2. Live — if CHECK_HEAD_URL is set (e.g. the published or preview
 *      origin), fetches each route over HTTP, parses the actual
 *      rendered <head>, and asserts the same required tags survive
 *      SSR + hydration. Run manually:
 *
 *        CHECK_HEAD_URL=https://agentesystems.lovable.app \
 *          node scripts/check-social-head.mjs
 *
 * EN/ES coverage rule: each route must declare `og:locale=en_US` and
 * `og:locale:alternate=es_US`, and either `description` or
 * `og:description` must contain a bilingual marker ("EN/ES" or
 * "bilingual"/"bilingüe") so the snippet renders meaningfully for
 * both Spanish- and English-speaking audiences.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const ROUTES_DIR = join(ROOT, "src/routes");
const ROOT_TSX = join(ROUTES_DIR, "__root.tsx");

const ROUTES = [
  { path: "/", file: "index.tsx" },
  { path: "/medical", file: "medical.tsx" },
  { path: "/beauty", file: "beauty.tsx" },
  { path: "/solar", file: "solar.tsx" },
  { path: "/real-estate", file: "real-estate.tsx" },
  { path: "/construction", file: "construction.tsx" },
];

// Required meta keys ("property:..." or "name:...") for any shareable
// route. og:image:secure_url is required for HTTPS-only crawlers
// (LinkedIn historically rejects images served over a mismatched scheme).
const REQUIRED_META = [
  "title",
  "name:description",
  "property:og:title",
  "property:og:description",
  "property:og:type",
  "property:og:url",
  "property:og:site_name",
  "property:og:locale",
  "property:og:locale:alternate",
  "property:og:image",
  "property:og:image:secure_url",
  "property:og:image:type",
  "property:og:image:width",
  "property:og:image:height",
  "property:og:image:alt",
  "name:twitter:card",
  "name:twitter:title",
  "name:twitter:description",
  "name:twitter:image",
  "name:twitter:image:alt",
];

const errors = [];
const warn = (route, msg) => errors.push(`[${route}] ${msg}`);

// ---------------------------------------------------------------------------
// Static parser: pull `meta: [ { ... }, ... ]` and `links: [ ... ]` blocks
// out of a route file's head() return value.
// ---------------------------------------------------------------------------
function extractArrayBlock(src, key) {
  // Find `<key>: [` then walk brackets to find the matching `]`.
  const re = new RegExp(`${key}\\s*:\\s*\\[`);
  const m = src.match(re);
  if (!m) return null;
  let i = m.index + m[0].length;
  let depth = 1;
  const start = i;
  while (i < src.length && depth > 0) {
    const ch = src[i];
    if (ch === "[") depth++;
    else if (ch === "]") depth--;
    i++;
  }
  return depth === 0 ? src.slice(start, i - 1) : null;
}

function splitObjectLiterals(body) {
  const out = [];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && start !== -1) {
        out.push(body.slice(start, i + 1));
        start = -1;
      }
    }
  }
  return out;
}

function parseMetaObject(src) {
  // Captures title, name, property, content, rel, href as either string
  // literals or bare identifiers (we only need to know the field exists
  // and, when it's a string, what value it holds).
  const strField = (key) => {
    const m = src.match(new RegExp(`${key}\\s*:\\s*"([^"]*)"`));
    return m ? m[1] : null;
  };
  const tplField = (key) => {
    const m = src.match(new RegExp(`${key}\\s*:\\s*\`([^\`]*)\``));
    return m ? m[1] : null;
  };
  const identField = (key) => {
    const m = src.match(new RegExp(`${key}\\s*:\\s*([A-Za-z_$][\\w$]*)\\s*[,}]`));
    return m ? m[1] : null;
  };
  return {
    title: strField("title") ?? tplField("title"),
    name: strField("name"),
    property: strField("property"),
    rel: strField("rel"),
    href: strField("href") ?? tplField("href") ?? identField("href"),
    content: strField("content") ?? tplField("content") ?? identField("content"),
  };
}

function keyOf(obj) {
  if (obj.title !== null && obj.title !== undefined) return "title";
  if (obj.property) return `property:${obj.property}`;
  if (obj.name) return `name:${obj.name}`;
  return null;
}

function parseHead(filePath) {
  const src = readFileSync(filePath, "utf8");
  const metaBody = extractArrayBlock(src, "meta");
  const linksBody = extractArrayBlock(src, "links");
  const meta = new Map();
  if (metaBody) {
    for (const lit of splitObjectLiterals(metaBody)) {
      const obj = parseMetaObject(lit);
      const k = keyOf(obj);
      if (k) meta.set(k, obj);
    }
  }
  const links = [];
  if (linksBody) {
    for (const lit of splitObjectLiterals(linksBody)) {
      links.push(parseMetaObject(lit));
    }
  }
  return { meta, links, src };
}

const rootHead = parseHead(ROOT_TSX);

for (const route of ROUTES) {
  const filePath = join(ROUTES_DIR, route.file);
  if (!existsSync(filePath)) {
    warn(route.path, `route file missing: src/routes/${route.file}`);
    continue;
  }
  const { meta, links } = parseHead(filePath);

  // Merge: root first, then route overrides (child wins, matching the
  // way TanStack Router dedupes by property/name).
  const effective = new Map([...rootHead.meta, ...meta]);

  for (const required of REQUIRED_META) {
    if (!effective.has(required)) {
      warn(route.path, `missing required head tag: ${required}`);
    }
  }

  // twitter:card must be summary_large_image on every leaf (root
  // defaults to summary for the bare logo; leaves must upgrade).
  const tw = effective.get("name:twitter:card");
  if (tw && tw.content && route.path !== "__root" && tw.content !== "summary_large_image") {
    warn(
      route.path,
      `twitter:card must be "summary_large_image" for leaf routes; got "${tw.content}"`,
    );
  }

  // EN/ES coverage.
  const locale = effective.get("property:og:locale")?.content;
  const alt = effective.get("property:og:locale:alternate")?.content;
  if (locale && locale !== "en_US") {
    warn(route.path, `og:locale must be "en_US"; got "${locale}"`);
  }
  if (alt && alt !== "es_US") {
    warn(route.path, `og:locale:alternate must be "es_US"; got "${alt}"`);
  }
  const desc =
    effective.get("name:description")?.content ??
    effective.get("property:og:description")?.content ??
    "";
  if (!/EN\/ES|biling[uü]e?|bilingual/i.test(desc)) {
    warn(
      route.path,
      `description / og:description has no bilingual EN/ES marker — social previews won't signal Spanish coverage`,
    );
  }

  // Canonical link must exist on leaf routes (and NOT on root, which is
  // covered by the canonical-dedupe rule).
  const canonical = links.find((l) => l.rel === "canonical");
  if (!canonical) {
    warn(route.path, `missing <link rel="canonical"> in leaf route head()`);
  } else if (canonical.href && !/^https?:\/\//.test(canonical.href) && !canonical.href.includes("URL") && !canonical.href.includes("ORIGIN")) {
    warn(route.path, `canonical href must be absolute; got "${canonical.href}"`);
  }
}

// ---------------------------------------------------------------------------
// Optional live check.
// ---------------------------------------------------------------------------
async function liveCheck(origin) {
  const stripTrailingSlash = (s) => (s.endsWith("/") ? s.slice(0, -1) : s);
  const base = stripTrailingSlash(origin);

  for (const route of ROUTES) {
    const url = `${base}${route.path}`;
    let html;
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (!res.ok) {
        warn(route.path, `live fetch failed: HTTP ${res.status} for ${url}`);
        continue;
      }
      html = await res.text();
    } catch (e) {
      warn(route.path, `live fetch error for ${url}: ${e.message}`);
      continue;
    }

    const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    const head = headMatch ? headMatch[1] : html;

    const hasMeta = (attr, value) =>
      new RegExp(
        `<meta[^>]*\\b${attr}\\s*=\\s*["']${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`,
        "i",
      ).test(head);

    for (const required of REQUIRED_META) {
      if (required === "title") {
        if (!/<title[^>]*>[^<]+<\/title>/i.test(head)) {
          warn(route.path, `[live] missing <title> at ${url}`);
        }
        continue;
      }
      const [kind, ...rest] = required.split(":");
      const key = rest.join(":");
      const attr = kind === "property" ? "property" : "name";
      if (!hasMeta(attr, key)) {
        warn(route.path, `[live] missing <meta ${attr}="${key}"> at ${url}`);
      }
    }

    if (!/<link[^>]*\brel\s*=\s*["']canonical["']/i.test(head)) {
      warn(route.path, `[live] missing <link rel="canonical"> at ${url}`);
    }
  }
}

const LIVE_ORIGIN = process.env.CHECK_HEAD_URL;
if (LIVE_ORIGIN) {
  await liveCheck(LIVE_ORIGIN);
}

if (errors.length === 0) {
  console.log(
    `[check-social-head] OK — ${ROUTES.length} routes have full OG/Twitter/canonical + EN/ES coverage${
      LIVE_ORIGIN ? ` (static + live @ ${LIVE_ORIGIN})` : ""
    }.`,
  );
  process.exit(0);
}

console.error(
  `[check-social-head] FAILED — ${errors.length} issue(s):\n` +
    errors.map((e, i) => `  ${i + 1}. ${e}`).join("\n"),
);
process.exit(1);