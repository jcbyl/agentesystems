#!/usr/bin/env node
/**
 * Build-time check: verifies that every required <link rel="icon"> and
 * <link rel="apple-touch-icon"> declaration in `src/routes/__root.tsx`
 *
 *   1. Has the correct `sizes` attribute
 *   2. Points its `href` at one of the canonical icon URL imports from
 *      `@/lib/icon-urls`
 *   3. Resolves to a real source file under `src/assets/icons/`
 *   4. Was actually emitted as a fingerprinted asset by Vite (i.e. shows
 *      up in `dist/<env>/.vite/manifest.json` with a hashed `file`)
 *
 * Runs after `vite build` so a regression — a dropped link tag, a wrong
 * `sizes`, a typo'd href import, or a missing icon source file that
 * silently fails to emit — fails the build instead of shipping silently
 * broken icon metadata that browsers fall back on legacy probes for.
 *
 * Exit codes:
 *   0 — all checks passed
 *   1 — one or more violations (full report on stderr)
 *
 * Run manually: `node scripts/check-icon-links.mjs`
 * Wired into `npm run build` via package.json.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const ROOT_TSX = join(ROOT, "src/routes/__root.tsx");
const ICON_URLS_TS = join(ROOT, "src/lib/icon-urls.ts");
const ICON_DIR = join(ROOT, "src/assets/icons");

// Every (rel, sizes, urlKey) triple the rendered HTML must declare. `sizes`
// of `null` means the link must not have a sizes attribute. `urlKey` matches
// the export from `src/lib/icon-urls.ts` the href must resolve to.
//
// If you legitimately need to add or remove an entry here, update both this
// list and `__root.tsx` in the same commit.
const REQUIRED_LINKS = [
  { rel: "icon", type: "image/png", sizes: "16x16", urlKey: "favicon16" },
  { rel: "icon", type: "image/png", sizes: "32x32", urlKey: "favicon32" },
  { rel: "apple-touch-icon", sizes: "152x152", urlKey: "appleTouch" },
  { rel: "apple-touch-icon", sizes: "167x167", urlKey: "appleTouch" },
  { rel: "apple-touch-icon", sizes: "180x180", urlKey: "appleTouch" },
  { rel: "apple-touch-icon-precomposed", sizes: "180x180", urlKey: "appleTouch" },
];

const errors = [];
const warn = (msg) => errors.push(msg);

// ---------------------------------------------------------------------------
// 1. Parse `src/lib/icon-urls.ts` to map exported key → source asset path.
// ---------------------------------------------------------------------------
const iconUrlsSrc = readFileSync(ICON_URLS_TS, "utf8");

// Captures `import favicon16Url from "../assets/icons/favicon-16.png?url";`
const importRe =
  /import\s+(\w+)\s+from\s+["']([^"']+\.png)(?:\?url)?["']/g;
const importToFile = new Map();
for (const m of iconUrlsSrc.matchAll(importRe)) {
  const [, ident, rel] = m;
  importToFile.set(ident, resolve(dirname(ICON_URLS_TS), rel));
}

// Captures the `ICON_URLS = { favicon16: favicon16Url, ... }` mapping.
const exportBlockMatch = iconUrlsSrc.match(/ICON_URLS\s*=\s*\{([^}]+)\}/);
if (!exportBlockMatch) {
  warn("could not locate ICON_URLS object literal in src/lib/icon-urls.ts");
}
const keyToImport = new Map();
if (exportBlockMatch) {
  for (const m of exportBlockMatch[1].matchAll(/(\w+)\s*:\s*(\w+)/g)) {
    keyToImport.set(m[1], m[2]);
  }
}

// ---------------------------------------------------------------------------
// 2. Parse `src/routes/__root.tsx` and extract every `links: [ ... ]` entry.
// ---------------------------------------------------------------------------
const rootSrc = readFileSync(ROOT_TSX, "utf8");
const linksMatch = rootSrc.match(/links:\s*\[([\s\S]*?)\n\s{4}\],/);
if (!linksMatch) {
  warn(
    "could not locate `links: [...]` block in src/routes/__root.tsx — head() shape changed?",
  );
}

// Split into individual `{ ... }` object literals at the array's top level.
function splitLinkObjects(body) {
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

function parseLinkObject(src) {
  // Lightweight parser: extracts string-valued fields (rel, type, sizes) and
  // the href identifier (when it's a bare identifier import, e.g. `href:
  // favicon16Url`). String hrefs like the inline SVG data URL or
  // "/manifest.webmanifest" are captured as { hrefLiteral: "..." }.
  const get = (key) => {
    const m = src.match(new RegExp(`${key}:\\s*"([^"]*)"`));
    return m ? m[1] : null;
  };
  const rel = get("rel");
  const type = get("type");
  const sizes = get("sizes");
  const hrefLiteral = get("href");
  const hrefIdentMatch = src.match(/href:\s*(\w+)\s*[,}]/);
  const hrefIdent = hrefIdentMatch ? hrefIdentMatch[1] : null;
  return { rel, type, sizes, hrefLiteral, hrefIdent };
}

const linkObjects = linksMatch
  ? splitLinkObjects(linksMatch[1]).map(parseLinkObject)
  : [];

// ---------------------------------------------------------------------------
// 3. Verify every REQUIRED_LINKS entry is present, matches `sizes`, and
//    points at the expected icon URL identifier.
// ---------------------------------------------------------------------------

// `__root.tsx` destructures `ICON_URLS` into local identifiers like
// `favicon16Url`, so build the expected identifier for each urlKey by
// reading the destructuring statement.
const destructureMatch = rootSrc.match(
  /const\s*\{\s*([^}]+)\}\s*=\s*\n?\s*ICON_URLS/,
);
const keyToLocalIdent = new Map();
if (destructureMatch) {
  for (const part of destructureMatch[1].split(",")) {
    const [k, v] = part.split(":").map((s) => s.trim());
    if (k) keyToLocalIdent.set(k, v ?? k);
  }
} else {
  warn(
    "could not find `const { ... } = ICON_URLS` destructuring in __root.tsx",
  );
}

for (const req of REQUIRED_LINKS) {
  const matches = linkObjects.filter(
    (l) =>
      l.rel === req.rel &&
      (req.type ? l.type === req.type : true) &&
      l.sizes === req.sizes,
  );
  if (matches.length === 0) {
    warn(
      `missing <link rel="${req.rel}"${
        req.type ? ` type="${req.type}"` : ""
      } sizes="${req.sizes}"> in __root.tsx — browsers will fall back to legacy probes for this size`,
    );
    continue;
  }
  const expectedIdent = keyToLocalIdent.get(req.urlKey);
  if (!expectedIdent) {
    warn(
      `__root.tsx does not destructure ICON_URLS.${req.urlKey} — required by rel="${req.rel}" sizes="${req.sizes}"`,
    );
    continue;
  }
  const hrefOk = matches.some((l) => l.hrefIdent === expectedIdent);
  if (!hrefOk) {
    warn(
      `<link rel="${req.rel}" sizes="${req.sizes}"> href must be \`${expectedIdent}\` (ICON_URLS.${req.urlKey}); got ${
        matches.map((m) => m.hrefIdent ?? `"${m.hrefLiteral}"`).join(", ")
      }`,
    );
  }
}

// ---------------------------------------------------------------------------
// 4. Verify every referenced icon source file exists on disk AND was emitted
//    as a fingerprinted asset by Vite (checked against the build manifest).
// ---------------------------------------------------------------------------
const referencedKeys = new Set(REQUIRED_LINKS.map((r) => r.urlKey));
for (const key of referencedKeys) {
  const importIdent = keyToImport.get(key);
  if (!importIdent) {
    warn(`ICON_URLS missing key "${key}"`);
    continue;
  }
  const file = importToFile.get(importIdent);
  if (!file) {
    warn(`icon-urls.ts has no import for identifier "${importIdent}" (key ${key})`);
    continue;
  }
  if (!existsSync(file)) {
    warn(`source icon file missing on disk: ${file} (ICON_URLS.${key})`);
  }
}

// Vite emits a manifest at `dist/<env>/.vite/manifest.json` for both the
// client and server builds. The client one is the source of truth for what
// the browser actually receives; fall back to the server manifest (which
// also lists static assets) if the client one isn't present yet.
const MANIFEST_CANDIDATES = [
  join(ROOT, "dist/client/.vite/manifest.json"),
  join(ROOT, "dist/server/.vite/manifest.json"),
];
const manifestPath = MANIFEST_CANDIDATES.find((p) => existsSync(p));

if (!manifestPath) {
  // No build output yet — this script is meant to run AFTER `vite build`.
  // Print a clear message but don't fail; CI invokes it post-build.
  console.warn(
    "[check-icon-links] no Vite manifest found at dist/client/.vite/manifest.json or dist/server/.vite/manifest.json — run `vite build` first; skipping emitted-asset check.",
  );
} else {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  for (const key of referencedKeys) {
    const importIdent = keyToImport.get(key);
    const file = importToFile.get(importIdent);
    if (!file) continue;
    const relFromRoot = file
      .replace(ROOT + "/", "")
      .replace(/\\/g, "/");
    const entry = manifest[relFromRoot];
    if (!entry) {
      warn(
        `Vite manifest missing entry for ${relFromRoot} (ICON_URLS.${key}) — asset wasn't emitted; href will 404 in prod`,
      );
      continue;
    }
    if (!/-[A-Za-z0-9_-]{6,}\.png$/.test(entry.file)) {
      warn(
        `emitted asset for ICON_URLS.${key} is not fingerprinted: ${entry.file}`,
      );
    }
    const emitted = join(ROOT, "dist/client", entry.file);
    if (!existsSync(emitted)) {
      warn(
        `Vite manifest references ${entry.file} for ICON_URLS.${key} but file is not on disk at dist/client/${entry.file}`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
if (errors.length === 0) {
  console.log(
    `[check-icon-links] OK — verified ${REQUIRED_LINKS.length} required <link> tags and ${referencedKeys.size} fingerprinted icon assets.`,
  );
  process.exit(0);
}

console.error(
  `[check-icon-links] FAILED — ${errors.length} issue(s):\n` +
    errors.map((e, i) => `  ${i + 1}. ${e}`).join("\n"),
);
process.exit(1);