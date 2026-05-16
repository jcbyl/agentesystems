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
  { path: "/demo", file: "demo.tsx" },
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
const warn = (route, msg, loc = {}) => {
  errors.push({ route, msg, file: loc.file ?? null, line: loc.line ?? null });
};

// Best-effort: find the 1-based line number of the first occurrence of
// `needle` (a tag string like "og:image:width") in `src`. Used to point
// CI annotations at the offending meta entry, not just the file.
function findLine(src, needle) {
  if (!src || !needle) return null;
  const idx = src.indexOf(needle);
  if (idx === -1) return null;
  return src.slice(0, idx).split("\n").length;
}



// Exact dimensions every share image must declare. 1200x630 is the
// canonical OG/Twitter summary_large_image size — Facebook, LinkedIn,
// Slack, iMessage, and X all render this 1.91:1 ratio without
// re-cropping. Any drift breaks one or more of those previews.
const REQUIRED_OG_IMAGE_WIDTH = "1200";
const REQUIRED_OG_IMAGE_HEIGHT = "630";
const ALLOWED_OG_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function validateImageTags(route, effective, { src, file } = {}) {
  const get = (k) => effective.get(k)?.content ?? null;
  const ogImage = get("property:og:image");
  const ogSecure = get("property:og:image:secure_url");
  const ogType = get("property:og:image:type");
  const ogW = get("property:og:image:width");
  const ogH = get("property:og:image:height");
  const twImage = get("name:twitter:image");
  const at = (tag) =>
    file ? { file, line: findLine(src, tag) ?? 1 } : {};

  if (ogImage && !/^https:\/\//.test(ogImage)) {
    warn(route, `og:image must be an absolute https:// URL; got "${ogImage}"`, at("og:image"));
  }
  if (ogSecure && !/^https:\/\//.test(ogSecure)) {
    warn(route, `og:image:secure_url must be https://; got "${ogSecure}"`, at("og:image:secure_url"));
  }
  if (ogImage && ogSecure && ogImage !== ogSecure) {
    warn(
      route,
      `og:image:secure_url must equal og:image (LinkedIn/Slack reject mismatched URLs); got og:image="${ogImage}" vs secure_url="${ogSecure}"`,
      at("og:image:secure_url"),
    );
  }
  if (ogW && ogW !== REQUIRED_OG_IMAGE_WIDTH) {
    warn(route, `og:image:width must be exactly "${REQUIRED_OG_IMAGE_WIDTH}"; got "${ogW}"`, at("og:image:width"));
  }
  if (ogH && ogH !== REQUIRED_OG_IMAGE_HEIGHT) {
    warn(route, `og:image:height must be exactly "${REQUIRED_OG_IMAGE_HEIGHT}"; got "${ogH}"`, at("og:image:height"));
  }
  if (ogType && !ALLOWED_OG_IMAGE_TYPES.has(ogType)) {
    warn(
      route,
      `og:image:type must be one of ${[...ALLOWED_OG_IMAGE_TYPES].join(", ")}; got "${ogType}"`,
      at("og:image:type"),
    );
  }
  if (ogImage && ogType) {
    const extMatch = ogImage.match(/\.(jpe?g|png|webp)(?:\?|#|$)/i);
    if (extMatch) {
      const ext = extMatch[1].toLowerCase();
      const expected =
        ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
      if (ogType !== expected) {
        warn(
          route,
          `og:image:type "${ogType}" does not match og:image extension ".${ext}" (expected "${expected}")`,
          at("og:image:type"),
        );
      }
    }
  }
  if (ogImage && twImage && ogImage !== twImage) {
    warn(
      route,
      `twitter:image must equal og:image so X and OG previews stay in sync; got og:image="${ogImage}" vs twitter:image="${twImage}"`,
      at("twitter:image"),
    );
  }
  if (twImage && !/^https:\/\//.test(twImage)) {
    warn(route, `twitter:image must be an absolute https:// URL; got "${twImage}"`, at("twitter:image"));
  }
}

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
  // Resolve `const FOO = "..."` / template-literal string constants so we
  // can dereference `content: DESC_EN` back to the underlying text.
  const consts = new Map();
  for (const m of src.matchAll(/\bconst\s+([A-Z_][A-Z0-9_]*)\s*=\s*"([^"]*)"/g)) {
    consts.set(m[1], m[2]);
  }
  for (const m of src.matchAll(/\bconst\s+([A-Z_][A-Z0-9_]*)\s*=\s*`([^`]*)`/g)) {
    if (!consts.has(m[1])) consts.set(m[1], m[2]);
  }
  // Two-line `const FOO =\n  "..."` form used by some routes.
  for (const m of src.matchAll(/\bconst\s+([A-Z_][A-Z0-9_]*)\s*=\s*\n\s*"([^"]*)"/g)) {
    if (!consts.has(m[1])) consts.set(m[1], m[2]);
  }
  const metaBody = extractArrayBlock(src, "meta");
  const linksBody = extractArrayBlock(src, "links");
  const meta = new Map();
  if (metaBody) {
    for (const lit of splitObjectLiterals(metaBody)) {
      const obj = parseMetaObject(lit);
      // Resolve identifier content to its string value (best-effort).
      if (obj.content && /^[A-Za-z_$][\w$]*$/.test(obj.content) && consts.has(obj.content)) {
        obj.content = consts.get(obj.content);
      }
      // Resolve `${DESC_EN} | ${DESC_ES}` style template literals.
      if (obj.content && obj.content.includes("${")) {
        obj.content = obj.content.replace(/\$\{([A-Za-z_$][\w$]*)\}/g, (_, id) =>
          consts.get(id) ?? `\${${id}}`,
        );
      }
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
  const relFile = `src/routes/${route.file}`;
  if (!existsSync(filePath)) {
    warn(route.path, `route file missing: ${relFile}`, { file: relFile, line: 1 });
    continue;
  }
  const { meta, links, src: routeSrc } = parseHead(filePath);
  const locFor = (tag) => ({ file: relFile, line: findLine(routeSrc, tag) ?? 1 });

  // Merge: root first, then route overrides (child wins, matching the
  // way TanStack Router dedupes by property/name).
  const effective = new Map([...rootHead.meta, ...meta]);

  for (const required of REQUIRED_META) {
    if (!effective.has(required)) {
      warn(route.path, `missing required head tag: ${required}`, { file: relFile, line: 1 });
    }
  }

  // twitter:card must be summary_large_image on every leaf (root
  // defaults to summary for the bare logo; leaves must upgrade).
  const tw = effective.get("name:twitter:card");
  if (tw && tw.content && route.path !== "__root" && tw.content !== "summary_large_image") {
    warn(
      route.path,
      `twitter:card must be "summary_large_image" for leaf routes; got "${tw.content}"`,
      locFor("twitter:card"),
    );
  }

  validateImageTags(route.path, effective, { src: routeSrc, file: relFile });

  // EN/ES coverage.
  const locale = effective.get("property:og:locale")?.content;
  const alt = effective.get("property:og:locale:alternate")?.content;
  if (locale && locale !== "en_US") {
    warn(route.path, `og:locale must be "en_US"; got "${locale}"`, locFor("og:locale"));
  }
  if (alt && alt !== "es_US") {
    warn(route.path, `og:locale:alternate must be "es_US"; got "${alt}"`, locFor("og:locale:alternate"));
  }
  const desc =
    effective.get("name:description")?.content ??
    effective.get("property:og:description")?.content ??
    "";
  if (!/EN\/ES|biling[uü]e?|bilingual/i.test(desc)) {
    warn(
      route.path,
      `description / og:description has no bilingual EN/ES marker — social previews won't signal Spanish coverage`,
      locFor("description"),
    );
  }

  // Canonical link must exist on leaf routes (and NOT on root, which is
  // covered by the canonical-dedupe rule).
  const canonical = links.find((l) => l.rel === "canonical");
  if (!canonical) {
    warn(route.path, `missing <link rel="canonical"> in leaf route head()`, { file: relFile, line: 1 });
  } else if (canonical.href && !/^https?:\/\//.test(canonical.href) && !canonical.href.includes("URL") && !canonical.href.includes("ORIGIN")) {
    warn(route.path, `canonical href must be absolute; got "${canonical.href}"`, locFor("canonical"));
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

    // Live image-tag validation: extract content="..." for each image
    // meta and run the same cross-tag checks as the static pass.
    const liveContent = (attr, value) => {
      const re = new RegExp(
        `<meta[^>]*\\b${attr}\\s*=\\s*["']${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*\\bcontent\\s*=\\s*["']([^"']*)["']`,
        "i",
      );
      const m = head.match(re);
      return m ? m[1] : null;
    };
    const liveEffective = new Map();
    const liveSet = (k, v) => v !== null && liveEffective.set(k, { content: v });
    liveSet("property:og:image", liveContent("property", "og:image"));
    liveSet("property:og:image:secure_url", liveContent("property", "og:image:secure_url"));
    liveSet("property:og:image:type", liveContent("property", "og:image:type"));
    liveSet("property:og:image:width", liveContent("property", "og:image:width"));
    liveSet("property:og:image:height", liveContent("property", "og:image:height"));
    liveSet("name:twitter:image", liveContent("name", "twitter:image"));
    validateImageTags(`live ${route.path}`, liveEffective);

    // For live mode we can additionally HEAD the image URL and verify
    // it actually responds with the declared content-type over HTTPS.
    const ogImage = liveEffective.get("property:og:image")?.content;
    const ogType = liveEffective.get("property:og:image:type")?.content;
    if (ogImage) {
      try {
        const imgRes = await fetch(ogImage, { method: "HEAD", redirect: "follow" });
        if (!imgRes.ok) {
          warn(route.path, `[live] og:image fetch failed: HTTP ${imgRes.status} for ${ogImage}`);
        } else {
          const ct = imgRes.headers.get("content-type") ?? "";
          if (ogType && !ct.toLowerCase().startsWith(ogType.toLowerCase())) {
            warn(
              route.path,
              `[live] og:image content-type "${ct}" does not match declared og:image:type "${ogType}"`,
            );
          }
        }
      } catch (e) {
        warn(route.path, `[live] og:image HEAD error for ${ogImage}: ${e.message}`);
      }
    }
  }
}

const LIVE_ORIGIN = process.env.CHECK_HEAD_URL;
if (LIVE_ORIGIN) {
  await liveCheck(LIVE_ORIGIN);
}

const IS_GITHUB = process.env.GITHUB_ACTIONS === "true";

function emitGithubAnnotations(items) {
  // GitHub workflow command spec:
  // ::error file={path},line={n},title={t}::{message}
  // Multiline messages must escape %, \r, \n.
  const esc = (s) =>
    String(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
  for (const e of items) {
    const parts = [];
    if (e.file) parts.push(`file=${e.file}`);
    if (e.line) parts.push(`line=${e.line}`);
    parts.push(`title=social-head: ${esc(e.route)}`);
    const prefix = `::error ${parts.join(",")}::`;
    process.stdout.write(`${prefix}[${e.route}] ${esc(e.msg)}\n`);
  }
}

if (errors.length === 0) {
  console.log(
    `[check-social-head] OK — ${ROUTES.length} routes have full OG/Twitter/canonical + EN/ES coverage${
      LIVE_ORIGIN ? ` (static + live @ ${LIVE_ORIGIN})` : ""
    }.`,
  );
  process.exit(0);
}

if (IS_GITHUB) emitGithubAnnotations(errors);

console.error(
  `[check-social-head] FAILED — ${errors.length} issue(s):\n` +
    errors
      .map((e, i) => {
        const where = e.file ? ` (${e.file}${e.line ? `:${e.line}` : ""})` : "";
        return `  ${i + 1}. [${e.route}]${where} ${e.msg}`;
      })
      .join("\n"),
);
process.exit(1);