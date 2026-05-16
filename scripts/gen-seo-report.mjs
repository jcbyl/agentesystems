#!/usr/bin/env node
// Regenerates seo-audit.csv + seo-audit.html with a per-page score and status
// summary at the top. Source of truth = the FINDINGS table below.
// Run: node scripts/gen-seo-report.mjs

import { writeFileSync, mkdirSync, existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

const SITE = "https://agentesystems.lovable.app";

const PAGES = [
  { url: "/", name: "Home" },
  { url: "/real-estate", name: "Real Estate vertical" },
  { url: "/construction", name: "Construction vertical" },
  { url: "/solar", name: "Solar vertical" },
  { url: "/medical", name: "Medical vertical" },
  { url: "/beauty", name: "Beauty vertical" },
  { url: "/demo", name: "Demo" },
];

const CHECKS = [
  { id: "lint:page_basics",                 label: "Page basics are set",                  category: "viewport",        state: "passing", notes: "Mobile viewport + default language set in __root.tsx." },
  { id: "lint:indexing",                    label: "Site is indexable",                    category: "indexing",        state: "passing", notes: "No noindex meta — search engines can include the page." },
  { id: "agent_metadata:metadata_quality",  label: "Page titles and descriptions length",  category: "meta_title",      state: "fixed",   notes: "Titles/descriptions tightened on /, /beauty, /medical, /solar (re-scan pending)." },
  { id: "agent_metadata:social_preview",    label: "Social link previews look good",       category: "social",          state: "passing", notes: "Specific, descriptive OG/Twitter tags with absolute image URLs." },
  { id: "agent_metadata:structured_data",   label: "Pages have schema for rich results",   category: "structured_data", state: "fixed",   notes: "WebSite/Organization on home; Service + FAQPage JSON-LD on vertical pages." },
  { id: "http:index",                       label: "Home page is reachable",               category: "indexing",        state: "passing", notes: "/ returns HTTP 200." },
  { id: "http:robots",                      label: "Crawler rules present",                category: "robots",          state: "fixed",   notes: "/robots.txt now allows crawl and references the sitemap." },
  { id: "http:sitemap",                     label: "Sitemap is present",                   category: "sitemap",         state: "fixed",   notes: "/sitemap.xml lists all public routes." },
  { id: "http:llms_txt",                    label: "AI summary present",                   category: "ai_readiness",    state: "fixed",   notes: "/llms.txt published at site root." },
];

const WEIGHT = { passing: 1, fixed: 1, failing: 0, ignored: null };

function scorePage(rows) {
  let healthy = 0, scored = 0, failing = 0;
  for (const r of rows) {
    const w = WEIGHT[r.state];
    if (w === null || w === undefined) continue;
    scored += 1;
    healthy += w;
    if (r.state === "failing") failing += 1;
  }
  const pct = scored === 0 ? 100 : Math.round((healthy / scored) * 100);
  let grade = "A", status = "Healthy";
  const pending = rows.filter((r) => r.state === "fixed").length;
  if (failing > 0) { status = "Needs attention"; grade = pct >= 80 ? "B" : pct >= 60 ? "C" : pct >= 40 ? "D" : "F"; }
  else if (pending > 0) { grade = "A−"; status = "Healthy (rescan pending)"; }
  return { pct, grade, status, failing, scored, healthy };
}

const STATE_COLOR = { passing: "#16a34a", fixed: "#0891b2", failing: "#dc2626", ignored: "#64748b" };
const STATUS_COLOR = { "Healthy": "#16a34a", "Healthy (rescan pending)": "#0891b2", "Needs attention": "#dc2626" };

const rows = [];
const perPage = [];
for (const page of PAGES) {
  const pageRows = CHECKS.map((c) => ({
    url: SITE + (page.url === "/" ? "/" : page.url),
    page: page.name,
    finding_id: c.id,
    finding: c.label,
    category: c.category,
    state: c.state,
    notes: c.notes,
  }));
  rows.push(...pageRows);
  perPage.push({ ...page, fullUrl: SITE + (page.url === "/" ? "/" : page.url), score: scorePage(pageRows) });
}

const totals = {
  passing: rows.filter((r) => r.state === "passing").length,
  fixed:   rows.filter((r) => r.state === "fixed").length,
  failing: rows.filter((r) => r.state === "failing").length,
  total:   rows.length,
};
const overall = scorePage(rows);

// --- History snapshot + diff vs. previous run --------------------------------
const HISTORY_DIRS = ["public/reports/history", "/mnt/documents/seo-history"];
const runId = new Date().toISOString().replace(/[:.]/g, "-"); // filesystem-safe
const runIso = new Date().toISOString();

const snapshot = {
  runId,
  generatedAt: runIso,
  site: SITE,
  overall,
  totals,
  pages: perPage.map((p) => ({ url: p.fullUrl, name: p.name, score: p.score })),
  findings: rows,
};

function listSnapshots(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json") && f !== "index.json")
    .sort(); // ISO timestamps sort chronologically
}

// Load the most recent prior snapshot for diffing (before writing the new one).
let previous = null;
for (const dir of HISTORY_DIRS) {
  const files = listSnapshots(dir);
  if (files.length > 0) {
    try { previous = JSON.parse(readFileSync(join(dir, files[files.length - 1]), "utf8")); break; }
    catch { /* ignore corrupt snapshot */ }
  }
}

// Per-URL diff
function diffPages(prev, curr) {
  const prevByUrl = new Map((prev?.pages ?? []).map((p) => [p.url, p]));
  const prevFindings = new Map();
  for (const f of prev?.findings ?? []) prevFindings.set(`${f.url}|${f.finding_id}`, f);

  const out = [];
  for (const p of curr.pages) {
    const before = prevByUrl.get(p.url);
    const beforePct = before?.score.pct ?? null;
    const delta = beforePct == null ? null : p.score.pct - beforePct;
    const transitions = [];
    for (const f of curr.findings.filter((r) => r.url === p.url)) {
      const prevF = prevFindings.get(`${f.url}|${f.finding_id}`);
      if (!prevF) transitions.push({ kind: "added", finding_id: f.finding_id, finding: f.finding, to: f.state });
      else if (prevF.state !== f.state) transitions.push({ kind: "changed", finding_id: f.finding_id, finding: f.finding, from: prevF.state, to: f.state });
    }
    // Removed findings (present before, missing now)
    for (const [key, prevF] of prevFindings) {
      if (!key.startsWith(p.url + "|")) continue;
      const still = curr.findings.some((r) => r.url === p.url && r.finding_id === prevF.finding_id);
      if (!still) transitions.push({ kind: "removed", finding_id: prevF.finding_id, finding: prevF.finding, from: prevF.state });
    }
    out.push({ url: p.url, name: p.name, beforePct, afterPct: p.score.pct, delta, transitions });
  }
  return out;
}

const diff = previous ? diffPages(previous, snapshot) : null;
const changedPages = diff ? diff.filter((d) => d.transitions.length > 0 || (d.delta ?? 0) !== 0) : [];

function csvEscape(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
const csvLines = [];
csvLines.push("# Per-page summary");
csvLines.push(["URL","Page","Score","Grade","Status","Failing","Checks"].join(","));
for (const p of perPage) {
  csvLines.push([p.fullUrl, p.name, `${p.score.pct}%`, p.score.grade, p.score.status, p.score.failing, p.score.scored].map(csvEscape).join(","));
}
csvLines.push("");
csvLines.push("# Detailed findings");
csvLines.push(["URL","Page","Finding ID","Finding","Category","Status","Notes"].join(","));
for (const r of rows) {
  csvLines.push([r.url, r.page, r.finding_id, r.finding, r.category, r.state, r.notes].map(csvEscape).join(","));
}

function badge(text, color) {
  return `<span style="display:inline-block;padding:2px 8px;border-radius:999px;background:${color};color:#fff;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em">${text}</span>`;
}
function scoreRing(pct, color, size = 56) {
  const C = 113.1;
  const off = C - (C * pct) / 100;
  return `<svg width="${size}" height="${size}" viewBox="0 0 44 44" aria-label="${pct}%">
    <circle cx="22" cy="22" r="18" fill="none" stroke="#e2e8f0" stroke-width="4"/>
    <circle cx="22" cy="22" r="18" fill="none" stroke="${color}" stroke-width="4"
      stroke-dasharray="${C}" stroke-dashoffset="${off}" stroke-linecap="round"
      transform="rotate(-90 22 22)"/>
    <text x="22" y="26" text-anchor="middle" font-size="12" font-weight="700" fill="#0f172a">${pct}</text>
  </svg>`;
}
function ringColor(pct, failing) {
  if (failing > 0) return "#dc2626";
  if (pct >= 95) return "#16a34a";
  if (pct >= 80) return "#0891b2";
  return "#f59e0b";
}

const summaryCards = perPage.map((p) => {
  const color = ringColor(p.score.pct, p.score.failing);
  const statusBadge = badge(p.score.status, STATUS_COLOR[p.score.status] ?? "#64748b");
  return `<div class="card">
    <div class="ring">${scoreRing(p.score.pct, color)}</div>
    <div class="meta">
      <div class="ptitle">${p.name}</div>
      <div class="purl"><a href="${p.fullUrl}">${p.fullUrl}</a></div>
      <div class="prow"><span class="grade" style="color:${color}">Grade ${p.score.grade}</span> · ${statusBadge}</div>
      <div class="muted">${p.score.healthy}/${p.score.scored} checks healthy · ${p.score.failing} failing</div>
    </div>
  </div>`;
}).join("");

const tableRows = rows.map((r) => `<tr>
  <td><a href='${r.url}'>${r.url}</a><div class='muted'>${r.page}</div></td>
  <td>${r.finding}<div class='muted'>${r.category} · <code>${r.finding_id}</code></div></td>
  <td>${badge(r.state, STATE_COLOR[r.state] ?? "#64748b")}</td>
  <td class='muted'>${r.notes}</td>
</tr>`).join("");

// --- Changes-since-last-run block (HTML) ------------------------------------
function arrow(delta) {
  if (delta == null) return `<span style="color:#64748b">new</span>`;
  if (delta > 0) return `<span style="color:#16a34a">▲ +${delta}</span>`;
  if (delta < 0) return `<span style="color:#dc2626">▼ ${delta}</span>`;
  return `<span style="color:#64748b">— 0</span>`;
}
function transitionLine(t) {
  if (t.kind === "added")   return `<li>+ <strong>${t.finding}</strong> added (${badge(t.to, STATE_COLOR[t.to] ?? "#64748b")})</li>`;
  if (t.kind === "removed") return `<li>− <strong>${t.finding}</strong> removed (was ${badge(t.from, STATE_COLOR[t.from] ?? "#64748b")})</li>`;
  return `<li>↻ <strong>${t.finding}</strong>: ${badge(t.from, STATE_COLOR[t.from] ?? "#64748b")} → ${badge(t.to, STATE_COLOR[t.to] ?? "#64748b")}</li>`;
}
let changesBlock = "";
if (!previous) {
  changesBlock = `<h2>Changes since last run</h2>
    <div class="card" style="display:block"><div class="muted">This is the first recorded run — future runs will diff against it.</div></div>`;
} else if (changedPages.length === 0) {
  changesBlock = `<h2>Changes since last run</h2>
    <div class="card" style="display:block"><div class="muted">No changes since <code>${previous.generatedAt}</code>. All ${diff.length} pages identical.</div></div>`;
} else {
  const items = changedPages.map((d) => `<div class="card" style="display:block">
      <div class="prow"><strong>${d.name}</strong> · <a href="${d.url}">${d.url}</a></div>
      <div class="muted" style="margin:4px 0 8px">Score: ${d.beforePct ?? "—"}% → ${d.afterPct}% ${arrow(d.delta)}</div>
      ${d.transitions.length ? `<ul style="margin:0;padding-left:20px;font-size:13px;line-height:1.8">${d.transitions.map(transitionLine).join("")}</ul>` : `<div class="muted">No finding-level changes.</div>`}
    </div>`).join("");
  changesBlock = `<h2>Changes since last run <span style="font-size:11px;color:#64748b;text-transform:none;letter-spacing:0">vs ${previous.generatedAt}</span></h2>
    <div class="grid">${items}</div>`;
}

const overallColor = ringColor(overall.pct, overall.failing);

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>SEO Audit — Agente.Systems</title>
<style>
  :root { color-scheme: light; }
  body { font: 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 32px; background: #f8fafc; color: #0f172a; }
  .wrap { max-width: 1100px; margin: 0 auto; }
  h1 { font-size: 24px; margin: 0 0 4px; }
  h2 { font-size: 16px; margin: 32px 0 12px; text-transform: uppercase; letter-spacing: .06em; color: #475569; }
  .sub { color: #475569; margin: 0 0 24px; }
  .hero { display: flex; gap: 24px; align-items: center; background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px 24px; margin-bottom: 24px; }
  .hero .meta .label { font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: #64748b; }
  .hero .meta .big-grade { font-size: 28px; font-weight: 700; margin: 2px 0 8px; }
  .stats { display: flex; gap: 12px; flex-wrap: wrap; }
  .stat { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 14px; min-width: 90px; }
  .stat .n { font-size: 18px; font-weight: 700; }
  .stat .l { font-size: 10px; text-transform: uppercase; letter-spacing: .06em; color: #64748b; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 12px; }
  .card { display: flex; gap: 14px; background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; align-items: center; }
  .card .ring { flex: 0 0 auto; }
  .card .meta { flex: 1; min-width: 0; }
  .card .ptitle { font-weight: 600; }
  .card .purl { font-size: 12px; margin: 2px 0 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .card .prow { display: flex; gap: 8px; align-items: center; margin-bottom: 4px; }
  .card .grade { font-weight: 700; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.04); }
  th, td { text-align: left; padding: 12px 14px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
  th { background: #f1f5f9; font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: #475569; }
  tr:last-child td { border-bottom: none; }
  .muted { color: #64748b; font-size: 12px; margin-top: 2px; }
  a { color: #0369a1; text-decoration: none; }
  a:hover { text-decoration: underline; }
  code { font-family: ui-monospace, Menlo, monospace; font-size: 11px; background: #f1f5f9; padding: 1px 5px; border-radius: 4px; }
</style></head><body><div class="wrap">
<h1>SEO Audit — Agente.Systems</h1>
<p class="sub">${PAGES.length} routes × ${CHECKS.length} checks = ${rows.length} rows · Generated ${new Date().toISOString().slice(0,10)}.</p>

<div class="hero">
  <div class="big">${scoreRing(overall.pct, overallColor, 96)}</div>
  <div class="meta">
    <div class="label">Overall site score</div>
    <div class="big-grade" style="color:${overallColor}">${overall.pct}% · ${overall.failing > 0 ? "Needs attention" : "Healthy"}</div>
    <div class="stats">
      <div class="stat"><div class="n">${totals.passing}</div><div class="l">Passing</div></div>
      <div class="stat"><div class="n">${totals.fixed}</div><div class="l">Fixed</div></div>
      <div class="stat"><div class="n">${totals.failing}</div><div class="l">Failing</div></div>
      <div class="stat"><div class="n">${totals.total}</div><div class="l">Total</div></div>
    </div>
  </div>
</div>

<h2>Per-page summary</h2>
<div class="grid">${summaryCards}</div>

${changesBlock}

<h2>Detailed findings</h2>
<table>
  <thead><tr><th>URL</th><th>Finding</th><th>Status</th><th>Notes</th></tr></thead>
  <tbody>${tableRows}</tbody>
</table>

<h2>Run history</h2>
<p class="muted">All runs are saved as JSON snapshots under <code>/reports/history/</code>. <a href="/reports/history/index.html">Browse all runs →</a></p>
</div></body></html>`;

const OUT = [
  "/mnt/documents/seo-audit.csv",
  "/mnt/documents/seo-audit.html",
  "public/reports/seo-audit.csv",
  "public/reports/seo-audit.html",
];
for (const path of OUT) {
  const dir = dirname(path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(path, path.endsWith(".csv") ? csvLines.join("\n") + "\n" : html);
}

// --- Write snapshot + history index -----------------------------------------
for (const dir of HISTORY_DIRS) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${runId}.json`), JSON.stringify(snapshot, null, 2));
}

const allRuns = listSnapshots("public/reports/history")
  .map((f) => {
    try { return JSON.parse(readFileSync(join("public/reports/history", f), "utf8")); }
    catch { return null; }
  })
  .filter(Boolean)
  .reverse(); // newest first

const indexRows = allRuns.map((s, i) => {
  const prev = allRuns[i + 1];
  const delta = prev ? s.overall.pct - prev.overall.pct : null;
  return `<tr>
    <td><code>${s.generatedAt}</code></td>
    <td>${s.overall.pct}% ${arrow(delta)}</td>
    <td>${s.totals.passing}/${s.totals.fixed}/${s.totals.failing}</td>
    <td><a href="./${s.runId}.json">snapshot.json</a></td>
  </tr>`;
}).join("");

const historyHtml = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>SEO Audit — Run History</title>
<style>body{font:14px/1.5 -apple-system,sans-serif;margin:0;padding:32px;background:#f8fafc;color:#0f172a}.wrap{max-width:900px;margin:0 auto}h1{font-size:22px;margin:0 0 16px}table{width:100%;border-collapse:collapse;background:white;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.04)}th,td{text-align:left;padding:10px 14px;border-bottom:1px solid #f1f5f9}th{background:#f1f5f9;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#475569}code{font-family:ui-monospace,Menlo,monospace;font-size:12px;background:#f1f5f9;padding:1px 5px;border-radius:4px}a{color:#0369a1}</style>
</head><body><div class="wrap">
<h1>SEO Audit — Run History (${allRuns.length})</h1>
<p><a href="/reports/seo-audit.html">← Back to latest report</a></p>
<table><thead><tr><th>Run</th><th>Overall</th><th>Pass/Fixed/Fail</th><th>Snapshot</th></tr></thead><tbody>${indexRows}</tbody></table>
</div></body></html>`;
writeFileSync("public/reports/history/index.html", historyHtml);
writeFileSync("/mnt/documents/seo-history/index.html", historyHtml);

console.log(`Wrote ${OUT.length} report files. Overall ${overall.pct}% · ${totals.failing} failing.`);
for (const p of perPage) console.log(`  ${p.name.padEnd(28)} ${String(p.score.pct).padStart(3)}%  ${p.score.grade.padEnd(3)} ${p.score.status}`);
console.log(`Snapshot saved: ${runId}.json · ${allRuns.length} run(s) total · ${previous ? `${changedPages.length} page(s) changed since previous run` : "first run"}.`);
