#!/usr/bin/env node
/**
 * Static SEO sanity check — fails CI when critical SEO issues appear.
 *
 * Verifies, with zero network:
 *   - public/robots.txt exists and allows crawling + references sitemap
 *   - public/llms.txt exists with H1
 *   - src/routes/sitemap[.]xml.ts exists
 *   - every public route has a title ≤ 60 chars and description ≤ 160 chars
 *   - every public route declares a canonical link
 *   - every public route declares og:title, og:description, og:url, og:image
 *
 * Errors are emitted as GitHub workflow annotations so they show up
 * inline in the PR "Files changed" tab.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const ROUTES_DIR = join(ROOT, "src/routes");
const IS_CI = !!process.env.GITHUB_ACTIONS;

const ROUTES = [
  { path: "/", file: "index.tsx" },
  { path: "/medical", file: "medical.tsx" },
  { path: "/beauty", file: "beauty.tsx" },
  { path: "/solar", file: "solar.tsx" },
  { path: "/real-estate", file: "real-estate.tsx" },
  { path: "/construction", file: "construction.tsx" },
  { path: "/demo", file: "demo.tsx" },
];

const MAX_TITLE = 60;
const MAX_DESC = 160;

const errors = [];
function fail(file, msg, line = 1) {
  errors.push({ file, line, msg });
  if (IS_CI) {
    console.log(`::error file=${file},line=${line},title=SEO check::${msg}`);
  }
}

// --- root-level files ---
const robots = join(ROOT, "public/robots.txt");
if (!existsSync(robots)) {
  fail("public/robots.txt", "robots.txt is missing");
} else {
  const txt = readFileSync(robots, "utf8");
  if (!/User-agent:\s*\*/i.test(txt)) fail("public/robots.txt", "missing 'User-agent: *' block");
  if (/Disallow:\s*\/\s*$/m.test(txt)) fail("public/robots.txt", "blocks entire site with 'Disallow: /'");
  if (!/Sitemap:\s*https?:\/\//i.test(txt)) fail("public/robots.txt", "missing 'Sitemap:' directive");
}

const llms = join(ROOT, "public/llms.txt");
if (!existsSync(llms)) {
  fail("public/llms.txt", "llms.txt is missing");
} else {
  const txt = readFileSync(llms, "utf8");
  if (!/^#\s+\S/m.test(txt)) fail("public/llms.txt", "llms.txt missing H1 site name");
}

const sitemap = join(ROOT, "src/routes/sitemap[.]xml.ts");
if (!existsSync(sitemap)) fail("src/routes/sitemap[.]xml.ts", "sitemap route is missing");

// --- per-route checks ---
function extractString(src, varName) {
  const re = new RegExp(`(?:const|let)\\s+${varName}\\s*=\\s*\`([^\`]+)\`|(?:const|let)\\s+${varName}\\s*=\\s*"((?:[^"\\\\]|\\\\.)*)"`);
  const m = src.match(re);
  return m ? (m[1] ?? m[2]) : null;
}

function hasMeta(src, key, value) {
  // e.g. { property: "og:image" ...} or { name: "twitter:card" ...}
  const re = new RegExp(`(?:property|name):\\s*"${key.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}"`);
  return re.test(src);
}

function hasCanonical(src) {
  return /rel:\s*"canonical"/.test(src);
}

for (const route of ROUTES) {
  const path = join(ROUTES_DIR, route.file);
  if (!existsSync(path)) {
    fail(`src/routes/${route.file}`, `route file missing for ${route.path}`);
    continue;
  }
  const src = readFileSync(path, "utf8");
  const rel = `src/routes/${route.file}`;

  const title = extractString(src, "TITLE_EN") || (src.match(/title:\s*"([^"]+)"/) || [])[1];
  const desc = extractString(src, "DESC_EN") || extractString(src, "DESC");

  if (!title) fail(rel, `[${route.path}] missing page title`);
  else if (title.length > MAX_TITLE)
    fail(rel, `[${route.path}] title is ${title.length} chars (> ${MAX_TITLE}): "${title}"`);

  if (!desc) fail(rel, `[${route.path}] missing description constant (DESC_EN/DESC)`);
  else if (desc.length > MAX_DESC)
    fail(rel, `[${route.path}] description is ${desc.length} chars (> ${MAX_DESC})`);

  for (const k of ["og:title", "og:description", "og:url", "og:image"]) {
    if (!hasMeta(src, k)) fail(rel, `[${route.path}] missing ${k}`);
  }
  if (!hasCanonical(src)) fail(rel, `[${route.path}] missing <link rel="canonical">`);
}

if (errors.length) {
  console.error(`\nSEO check FAILED — ${errors.length} issue(s):`);
  for (const e of errors) console.error(`  ${e.file}: ${e.msg}`);
  process.exit(1);
}
console.log(`OK — SEO basics pass on ${ROUTES.length} routes (titles ≤${MAX_TITLE}, descriptions ≤${MAX_DESC}, robots/llms/sitemap present).`);
