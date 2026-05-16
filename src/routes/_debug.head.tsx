import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";

/**
 * Hidden head/meta inspector. Not linked from the UI; reach it via
 * /_debug/head?path=/demo. Renders the target route inside a same-origin
 * iframe and reads its computed <head> after load, so you see exactly
 * the tags TanStack Router resolved (root + leaf merge, dynamic effects
 * like the i18n locale/alt rewrites in src/lib/i18n.tsx, anything
 * injected by ScriptOnce, etc.) — no devtools, no view-source needed.
 *
 * noindex: kept out of crawlers via the route's own head() and an
 * explicit deny in scripts/check-social-head.mjs allowlist (this route
 * is not in the ROUTES list, so the check skips it).
 */
const Search = z.object({
  path: z.string().startsWith("/").default("/"),
});

export const Route = createFileRoute("/_debug/head")({
  validateSearch: Search.parse,
  head: () => ({
    meta: [
      { title: "Head inspector (debug)" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: HeadDebugPage,
});

type Row = {
  kind: "title" | "meta" | "link" | "script";
  key: string;
  attrs: Record<string, string>;
  text?: string;
};

const ROUTES = ["/", "/demo", "/medical", "/beauty", "/solar", "/construction", "/real-estate"];

function HeadDebugPage() {
  const { path } = Route.useSearch();
  const navigate = Route.useNavigate();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [loadedPath, setLoadedPath] = useState<string>("");
  const [filter, setFilter] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Re-read whenever the iframe finishes loading.
  const handleLoad = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) {
      setError("Could not read iframe document (cross-origin?).");
      return;
    }
    setError(null);
    // Defer one frame so any client effects (i18n locale/alt) have
    // committed before we snapshot.
    requestAnimationFrame(() => {
      const out: Row[] = [];
      const titleEl = doc.querySelector("title");
      if (titleEl) {
        out.push({ kind: "title", key: "title", attrs: {}, text: titleEl.textContent ?? "" });
      }
      doc.head.querySelectorAll("meta").forEach((el) => {
        const attrs: Record<string, string> = {};
        for (const a of Array.from(el.attributes)) attrs[a.name] = a.value;
        const key = attrs.property
          ? `property=${attrs.property}`
          : attrs.name
            ? `name=${attrs.name}`
            : attrs.charset
              ? "charset"
              : attrs["http-equiv"]
                ? `http-equiv=${attrs["http-equiv"]}`
                : "meta";
        out.push({ kind: "meta", key, attrs });
      });
      doc.head.querySelectorAll("link").forEach((el) => {
        const attrs: Record<string, string> = {};
        for (const a of Array.from(el.attributes)) attrs[a.name] = a.value;
        out.push({ kind: "link", key: `rel=${attrs.rel ?? "?"}`, attrs });
      });
      doc.head.querySelectorAll('script[type="application/ld+json"]').forEach((el) => {
        out.push({
          kind: "script",
          key: "ld+json",
          attrs: { type: "application/ld+json" },
          text: el.textContent ?? "",
        });
      });
      setRows(out);
      setLoadedPath(path);
    });
  };

  // Inspector lives inside the same SPA. If the user picks the same
  // path the iframe is already on, force a reload to re-snapshot.
  useEffect(() => {
    const f = iframeRef.current;
    if (!f) return;
    const target = path + (path.includes("?") ? "&" : "?") + "_debug_t=" + Date.now();
    if (f.src.endsWith(path) || !f.src) f.src = target;
  }, [path]);

  const filtered = useMemo(() => {
    if (!filter.trim()) return rows;
    const q = filter.toLowerCase();
    return rows.filter(
      (r) =>
        r.key.toLowerCase().includes(q) ||
        (r.text ?? "").toLowerCase().includes(q) ||
        Object.values(r.attrs).some((v) => v.toLowerCase().includes(q)),
    );
  }, [rows, filter]);

  const grouped = useMemo(() => {
    const og = filtered.filter((r) => r.attrs.property?.startsWith("og:"));
    const tw = filtered.filter((r) => r.attrs.name?.startsWith("twitter:"));
    const canonical = filtered.filter((r) => r.kind === "link" && r.attrs.rel === "canonical");
    const ld = filtered.filter((r) => r.kind === "script");
    const used = new Set([...og, ...tw, ...canonical, ...ld]);
    const rest = filtered.filter((r) => !used.has(r));
    return { og, tw, canonical, ld, rest };
  }, [filtered]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-muted/30 px-4 py-3">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <span className="rounded bg-foreground/10 px-2 py-0.5 text-xs font-mono uppercase tracking-wide">
              debug
            </span>
            <h1 className="text-base font-semibold">Head inspector</h1>
          </div>
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <label className="text-xs text-muted-foreground">Route</label>
            <select
              value={ROUTES.includes(path) ? path : "__custom"}
              onChange={(e) => {
                if (e.target.value !== "__custom") navigate({ search: { path: e.target.value } });
              }}
              className="rounded border border-border bg-background px-2 py-1 text-sm"
            >
              {ROUTES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
              {!ROUTES.includes(path) && <option value="__custom">{path}</option>}
            </select>
            <input
              value={path}
              onChange={(e) => navigate({ search: { path: e.target.value || "/" } })}
              className="w-44 rounded border border-border bg-background px-2 py-1 text-sm font-mono"
              placeholder="/route"
            />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="ml-auto w-48 rounded border border-border bg-background px-2 py-1 text-sm"
              placeholder="Filter tags…"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-[1fr,360px]">
        <div className="space-y-4">
          {error && (
            <div className="rounded border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm">
              {error}
            </div>
          )}
          <div className="text-xs text-muted-foreground">
            Showing tags from <code className="font-mono">{loadedPath || "(loading…)"}</code> · {rows.length} total
          </div>

          <Section title="OpenGraph" rows={grouped.og} />
          <Section title="Twitter" rows={grouped.tw} />
          <Section title="Canonical" rows={grouped.canonical} />
          <Section title="JSON-LD" rows={grouped.ld} renderText />
          <Section title="Other head tags" rows={grouped.rest} startCollapsed />
        </div>

        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Live preview</div>
          <iframe
            ref={iframeRef}
            onLoad={handleLoad}
            title="head-inspect-target"
            className="h-[560px] w-full rounded border border-border bg-background"
          />
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  rows,
  renderText,
  startCollapsed,
}: {
  title: string;
  rows: Row[];
  renderText?: boolean;
  startCollapsed?: boolean;
}) {
  if (rows.length === 0) return null;
  return (
    <details open={!startCollapsed} className="rounded border border-border">
      <summary className="cursor-pointer select-none px-3 py-2 text-sm font-semibold">
        {title} <span className="text-muted-foreground">({rows.length})</span>
      </summary>
      <div className="divide-y divide-border">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[minmax(140px,200px),1fr] gap-3 px-3 py-2 text-xs">
            <div className="font-mono text-muted-foreground break-all">{r.key}</div>
            <div className="break-all">
              {renderText && r.text ? (
                <pre className="whitespace-pre-wrap font-mono text-[11px]">{tryPretty(r.text)}</pre>
              ) : r.attrs.content !== undefined ? (
                <span className="font-mono">{r.attrs.content}</span>
              ) : r.attrs.href !== undefined ? (
                <span className="font-mono">{r.attrs.href}</span>
              ) : r.text ? (
                <span className="font-mono">{r.text}</span>
              ) : (
                <span className="font-mono text-muted-foreground">
                  {Object.entries(r.attrs).map(([k, v]) => `${k}="${v}"`).join(" ")}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}

function tryPretty(s: string) {
  try {
    return JSON.stringify(JSON.parse(s), null, 2);
  } catch {
    return s;
  }
}
