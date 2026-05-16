#!/usr/bin/env node
/**
 * Per-route OG/Twitter tag report.
 *
 * Reuses the same static parser as scripts/check-social-head.mjs but
 * instead of failing the build, emits a JSON + HTML report listing
 * every required tag's status (ok / missing / mismatch / inherited)
 * and the actual value rendered into <head>. Use when debugging why
 * a specific share preview looks wrong on one platform vs another.
 *
 *   node scripts/report-social-head.mjs
 *
 * Outputs:
 *   reports/social-head.json   — machine-readable
 *   reports/social-head.html   — open in a browser; one table per route
 */
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const ROUTES_DIR = join(ROOT, "src/routes");
const ROOT_TSX = join(ROUTES_DIR, "__root.tsx");
const OUT_DIR = join(ROOT, "reports");

const ROUTES = [
  { path: "/", file: "index.tsx" },
  { path: "/medical", file: "medical.tsx" },
  { path: "/beauty", file: "beauty.tsx" },
  { path: "/solar", file: "solar.tsx" },
  { path: "/real-estate", file: "real-estate.tsx" },
  { path: "/construction", file: "construction.tsx" },
  { path: "/demo", file: "demo.tsx" },
];

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

const EXPECTED = {
  "property:og:image:width": "1200",
  "property:og:image:height": "630",
  "property:og:locale": "en_US",
  "property:og:locale:alternate": "es_US",
  "name:twitter:card": "summary_large_image",
};

// ---- parser (kept in sync with scripts/check-social-head.mjs) -----------
function extractArrayBlock(src, key) {
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
    if (ch === "{") { if (depth === 0) start = i; depth++; }
    else if (ch === "}") { depth--; if (depth === 0 && start !== -1) { out.push(body.slice(start, i + 1)); start = -1; } }
  }
  return out;
}
function parseMetaObject(src) {
  const strField = (k) => { const m = src.match(new RegExp(`${k}\\s*:\\s*"([^"]*)"`)); return m ? m[1] : null; };
  const tplField = (k) => { const m = src.match(new RegExp(`${k}\\s*:\\s*\`([^\`]*)\``)); return m ? m[1] : null; };
  const identField = (k) => { const m = src.match(new RegExp(`${k}\\s*:\\s*([A-Za-z_$][\\w$]*)\\s*[,}]`)); return m ? m[1] : null; };
  return {
    title: strField("title") ?? tplField("title"),
    name: strField("name"),
    property: strField("property"),
    rel: strField("rel"),
    href: strField("href") ?? tplField("href") ?? identField("href"),
    content: strField("content") ?? tplField("content") ?? identField("content"),
  };
}
function keyOf(o) {
  if (o.title !== null && o.title !== undefined) return "title";
  if (o.property) return `property:${o.property}`;
  if (o.name) return `name:${o.name}`;
  return null;
}
function parseHead(filePath) {
  const src = readFileSync(filePath, "utf8");
  const consts = new Map();
  for (const m of src.matchAll(/\bconst\s+([A-Z_][A-Z0-9_]*)\s*=\s*"([^"]*)"/g)) consts.set(m[1], m[2]);
  for (const m of src.matchAll(/\bconst\s+([A-Z_][A-Z0-9_]*)\s*=\s*`([^`]*)`/g)) { if (!consts.has(m[1])) consts.set(m[1], m[2]); }
  for (const m of src.matchAll(/\bconst\s+([A-Z_][A-Z0-9_]*)\s*=\s*\n\s*"([^"]*)"/g)) { if (!consts.has(m[1])) consts.set(m[1], m[2]); }
  const metaBody = extractArrayBlock(src, "meta");
  const meta = new Map();
  if (metaBody) {
    for (const lit of splitObjectLiterals(metaBody)) {
      const o = parseMetaObject(lit);
      if (o.content && /^[A-Za-z_$][\w$]*$/.test(o.content) && consts.has(o.content)) o.content = consts.get(o.content);
      if (o.content && o.content.includes("${")) o.content = o.content.replace(/\$\{([A-Za-z_$][\w$]*)\}/g, (_, id) => consts.get(id) ?? `\${${id}}`);
      const k = keyOf(o);
      if (k) meta.set(k, o);
    }
  }
  return { meta, ownKeys: new Set(meta.keys()) };
}

// ---- build the report --------------------------------------------------
const rootHead = parseHead(ROOT_TSX);

function classify(key, entry, isOwn) {
  if (!entry) return { status: "missing", actual: null };
  const actual = entry.title ?? entry.content ?? null;
  const expected = EXPECTED[key];
  if (expected && actual !== expected) {
    return { status: "mismatch", actual, expected, source: isOwn ? "route" : "inherited" };
  }
  // image cross-checks
  return { status: "ok", actual, source: isOwn ? "route" : "inherited" };
}

const report = {
  generatedAt: new Date().toISOString(),
  expectedWidth: EXPECTED["property:og:image:width"],
  expectedHeight: EXPECTED["property:og:image:height"],
  routes: [],
};

for (const route of ROUTES) {
  const filePath = join(ROUTES_DIR, route.file);
  const relFile = `src/routes/${route.file}`;
  if (!existsSync(filePath)) {
    report.routes.push({ path: route.path, file: relFile, missingFile: true, tags: [] });
    continue;
  }
  const { meta, ownKeys } = parseHead(filePath);
  const effective = new Map([...rootHead.meta, ...meta]);

  const tags = REQUIRED_META.map((key) => ({
    key,
    ...classify(key, effective.get(key), ownKeys.has(key)),
  }));

  // Cross-tag image consistency findings.
  const crossFindings = [];
  const ogImage = effective.get("property:og:image")?.content;
  const ogSecure = effective.get("property:og:image:secure_url")?.content;
  const twImage = effective.get("name:twitter:image")?.content;
  const ogType = effective.get("property:og:image:type")?.content;
  if (ogImage && ogSecure && ogImage !== ogSecure) {
    crossFindings.push({ kind: "secure_url_mismatch", ogImage, ogSecure });
  }
  if (ogImage && twImage && ogImage !== twImage) {
    crossFindings.push({ kind: "twitter_image_mismatch", ogImage, twImage });
  }
  if (ogImage && !/^https:\/\//.test(ogImage)) {
    crossFindings.push({ kind: "og_image_not_https", ogImage });
  }
  if (ogImage && ogType) {
    const extMatch = ogImage.match(/\.(jpe?g|png|webp)(?:\?|#|$)/i);
    if (extMatch) {
      const ext = extMatch[1].toLowerCase();
      const expected = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
      if (ogType !== expected) crossFindings.push({ kind: "og_image_type_mismatch", ogType, expected, ext });
    }
  }

  report.routes.push({
    path: route.path,
    file: relFile,
    tags,
    crossFindings,
    counts: {
      ok: tags.filter((t) => t.status === "ok").length,
      missing: tags.filter((t) => t.status === "missing").length,
      mismatch: tags.filter((t) => t.status === "mismatch").length,
    },
  });
}

// ---- emit outputs ------------------------------------------------------
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, "social-head.json"), JSON.stringify(report, null, 2));

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const badge = (status) =>
  `<span class="b b-${status}">${status}</span>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/>
<title>Social-head report — ${esc(report.generatedAt)}</title>
<style>
  :root { color-scheme: light dark; }
  body { font: 14px/1.5 ui-sans-serif, system-ui, -apple-system, sans-serif; margin: 24px; max-width: 1100px; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  .meta { color: #666; margin-bottom: 24px; }
  details { border: 1px solid #e2e2e2; border-radius: 8px; padding: 12px 16px; margin-bottom: 12px; }
  details[open] { background: #fafafa; }
  summary { cursor: pointer; font-weight: 600; display: flex; gap: 12px; align-items: center; }
  summary code { background: #eef; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
  th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #eee; vertical-align: top; }
  th { color: #555; font-weight: 500; }
  td.val { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; word-break: break-all; }
  .b { display: inline-block; padding: 1px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; }
  .b-ok { background: #d4f7dc; color: #056b2e; }
  .b-missing { background: #ffd9d9; color: #8a0000; }
  .b-mismatch { background: #fde7b3; color: #7a4a00; }
  .src-inherited { color: #888; font-style: italic; }
  .x { color: #8a0000; margin-top: 8px; }
  .x ul { margin: 4px 0 0 16px; padding: 0; }
</style></head><body>
<h1>Social-head report</h1>
<div class="meta">Generated ${esc(report.generatedAt)} · required image size <strong>${esc(report.expectedWidth)}×${esc(report.expectedHeight)}</strong> · ${report.routes.length} routes</div>
${report.routes.map((r) => `
  <details ${r.counts && (r.counts.missing + r.counts.mismatch) > 0 ? "open" : ""}>
    <summary>
      <code>${esc(r.path)}</code>
      <span style="color:#666">${esc(r.file)}</span>
      ${r.counts ? `${badge("ok")} ${r.counts.ok}` : ""}
      ${r.counts && r.counts.missing ? `${badge("missing")} ${r.counts.missing}` : ""}
      ${r.counts && r.counts.mismatch ? `${badge("mismatch")} ${r.counts.mismatch}` : ""}
    </summary>
    ${r.missingFile ? `<p class="x">Route file is missing.</p>` : `
      <table>
        <thead><tr><th>Tag</th><th>Status</th><th>Source</th><th>Value</th><th>Expected</th></tr></thead>
        <tbody>
          ${r.tags.map((t) => `
            <tr>
              <td><code>${esc(t.key)}</code></td>
              <td>${badge(t.status)}</td>
              <td class="src-${esc(t.source ?? "")}">${esc(t.source ?? "—")}</td>
              <td class="val">${esc(t.actual ?? "—")}</td>
              <td class="val">${esc(t.expected ?? "")}</td>
            </tr>`).join("")}
        </tbody>
      </table>
      ${r.crossFindings.length ? `
        <div class="x"><strong>Cross-tag findings</strong><ul>
          ${r.crossFindings.map((f) => `<li>${esc(JSON.stringify(f))}</li>`).join("")}
        </ul></div>` : ""}
    `}
  </details>`).join("")}
</body></html>`;

writeFileSync(join(OUT_DIR, "social-head.html"), html);

const totals = report.routes.reduce(
  (a, r) => ({
    missing: a.missing + (r.counts?.missing ?? 0),
    mismatch: a.mismatch + (r.counts?.mismatch ?? 0),
    cross: a.cross + (r.crossFindings?.length ?? 0),
  }),
  { missing: 0, mismatch: 0, cross: 0 },
);
console.log(
  `[report-social-head] wrote reports/social-head.{json,html} — ` +
    `${report.routes.length} routes · ${totals.missing} missing · ${totals.mismatch} mismatched · ${totals.cross} cross-tag findings`,
);