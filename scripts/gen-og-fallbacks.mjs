#!/usr/bin/env node
/**
 * Build-time generator for per-route og:image fallbacks.
 *
 * For every leaf route registered in ROUTES we deterministically render
 * a 1200×630 PNG seeded from the route's slug + vertical label, and
 * write it to public/og-fallback/<slug>.png. Routes that ship a
 * bespoke og:image still use that image; routes that don't (e.g.
 * `/demo`) get the seeded fallback instead of inheriting the sitewide
 * default, so every share preview is unique to the page.
 *
 * Seed strategy: a 32-bit FNV-1a hash of the slug picks the hue of the
 * primary gradient stop, and a phase offset shifts the second stop.
 * Same slug always produces the same image — safe for caching, and
 * cheap to diff in code review (only changes when the routes list or
 * design tokens change).
 *
 * Renderer: SVG → PNG via @resvg/resvg-js (pure WASM, devDep only —
 * never bundled into the worker runtime).
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { createHash } from "node:crypto";
import { Resvg } from "@resvg/resvg-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = join(ROOT, "public/og-fallback");
const MANIFEST_OUT = join(ROOT, "src/lib/og-fallback-manifest.ts");

// Keep in sync with src/lib/og-fallback.ts. Each entry corresponds to a
// leaf route under src/routes/. `title` and `vertical` are the
// human-readable strings rendered on the card; `slug` is the filename.
export const ROUTES = [
  { slug: "home",          title: "Agente.Systems",        vertical: "Bilingual AI agents · EN/ES" },
  { slug: "demo",          title: "Book a demo",           vertical: "Agente.Systems · EN/ES" },
  { slug: "medical",       title: "Grace",                 vertical: "Medical practices" },
  { slug: "beauty",        title: "Bella",                 vertical: "Beauty & wellness" },
  { slug: "solar",         title: "Sol",                   vertical: "Solar installers" },
  { slug: "construction",  title: "Construction agent",    vertical: "Contractors & builders" },
  { slug: "real-estate",   title: "Real-estate agent",     vertical: "Brokerages & teams" },
];

// FNV-1a 32-bit. Tiny, dependency-free, deterministic across platforms.
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h >>> 0;
}

function paletteFor(slug) {
  const h = fnv1a(slug);
  const hue = h % 360;
  // Brand-locked anchor: every card carries the coral accent so the
  // sitewide identity reads at a glance, but the surrounding gradient
  // rotates per slug for visual differentiation.
  return {
    hue,
    bg1: `hsl(${hue} 55% 18%)`,
    bg2: `hsl(${(hue + 40) % 360} 60% 10%)`,
    accent: "#E84118", // coral, matches theme-color in __root.tsx
  };
}

function escapeXml(s) {
  return String(s).replace(/[<>&"']/g, (c) => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;",
  }[c]));
}

function svgFor({ slug, title, vertical }) {
  const p = paletteFor(slug);
  // 1200x630 — the canonical OG/Twitter summary_large_image size.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${p.bg1}"/>
      <stop offset="100%" stop-color="${p.bg2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="85%" cy="15%" r="60%">
      <stop offset="0%" stop-color="${p.accent}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${p.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <!-- coral underline stripe, anchors brand identity across all fallbacks -->
  <rect x="80" y="540" width="160" height="6" fill="${p.accent}"/>
  <text x="80" y="180" fill="#ffffff" font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="36" font-weight="600" opacity="0.85">
    Agente.Systems
  </text>
  <text x="80" y="360" fill="#ffffff" font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="112" font-weight="800" letter-spacing="-3">
    ${escapeXml(title)}
  </text>
  <text x="80" y="430" fill="#ffffff" font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="40" font-weight="500" opacity="0.85">
    ${escapeXml(vertical)}
  </text>
  <text x="80" y="520" fill="#ffffff" font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="26" font-weight="500" opacity="0.7">
    WhatsApp-native · Live in 24 hours
  </text>
</svg>`;
}

function render(route) {
  const svg = svgFor(route);
  const resvg = new Resvg(svg, {
    background: "#0a0a0a",
    fitTo: { mode: "width", value: 1200 },
    font: { loadSystemFonts: true },
  });
  return resvg.render().asPng();
}

function sameAsExisting(filePath, buf) {
  if (!existsSync(filePath)) return false;
  try {
    const cur = readFileSync(filePath);
    if (cur.length !== buf.length) return false;
    return cur.equals(buf);
  } catch {
    return false;
  }
}

mkdirSync(OUT_DIR, { recursive: true });
let written = 0;
let unchanged = 0;
// Content-hash manifest. Consumed by src/lib/og-fallback.ts to append
// ?v=<hash> to every fallback URL, so Facebook/LinkedIn/Slack/X
// re-fetch the card whenever the PNG bytes change (their scrapers
// cache the URL itself for days/weeks).
const manifest = {};
for (const route of ROUTES) {
  const out = join(OUT_DIR, `${route.slug}.png`);
  const png = render(route);
  manifest[route.slug] = createHash("sha256").update(png).digest("hex").slice(0, 10);
  if (sameAsExisting(out, png)) {
    unchanged++;
    continue;
  }
  writeFileSync(out, png);
  written++;
}

// Emit a TS module so both client and server code get a typed,
// build-time-stable map. Re-written every build; safe to commit.
const manifestTs =
  `// AUTO-GENERATED by scripts/gen-og-fallbacks.mjs — do not edit by hand.\n` +
  `// Maps each fallback slug to a short sha256 of its PNG bytes; used as\n` +
  `// a ?v= cache-buster on og:image URLs so social scrapers refresh\n` +
  `// when the image changes.\n` +
  `export const OG_FALLBACK_HASHES = ${JSON.stringify(manifest, null, 2)} as const;\n`;
const prevManifest = existsSync(MANIFEST_OUT) ? readFileSync(MANIFEST_OUT, "utf8") : "";
if (prevManifest !== manifestTs) writeFileSync(MANIFEST_OUT, manifestTs);

console.log(
  `[gen-og-fallbacks] ${ROUTES.length} routes · ${written} written · ${unchanged} unchanged → public/og-fallback/`,
);