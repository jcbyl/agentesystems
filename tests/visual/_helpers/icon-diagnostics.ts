import { test as base, expect, type TestInfo } from "@playwright/test";

/**
 * Per-link diagnostic recorder shared by the icon test suites
 * (favicon, redirects, hydration, cache-stability).
 *
 * During a test, call `record({ ... })` for every icon URL inspected.
 * On test failure (or when explicitly requested), `flush(testInfo)` prints
 * a fixed-width table to stdout and attaches the same table to the
 * Playwright report as a "icon-diagnostics" attachment so it shows up in
 * the HTML report next to the failing test.
 *
 * The recorder is intentionally tolerant — every field is optional so
 * specs can fill in whatever they discovered (e.g. `redirects.spec`
 * fills `finalUrl`, `cache-stability.spec` fills two `cacheControl`
 * snapshots, etc.).
 */

export type IconDiagnosticRow = {
  rel?: string;
  sizes?: string;
  href?: string;
  finalUrl?: string;
  status?: number | string;
  contentType?: string;
  cacheControl?: string;
  /** Free-form note appended to the row's last column (e.g. "no-cache fetch"). */
  note?: string;
};

const COLUMNS: { key: keyof IconDiagnosticRow; label: string; max: number }[] = [
  { key: "rel", label: "rel", max: 32 },
  { key: "sizes", label: "sizes", max: 10 },
  { key: "href", label: "href", max: 60 },
  { key: "finalUrl", label: "final URL", max: 60 },
  { key: "status", label: "status", max: 6 },
  { key: "contentType", label: "content-type", max: 36 },
  { key: "cacheControl", label: "cache-control", max: 48 },
  { key: "note", label: "note", max: 40 },
];

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  if (max <= 1) return s.slice(0, max);
  return s.slice(0, max - 1) + "…";
}

function cellOf(row: IconDiagnosticRow, key: keyof IconDiagnosticRow): string {
  const v = row[key];
  if (v === undefined || v === null || v === "") return "—";
  return String(v);
}

function renderTable(rows: IconDiagnosticRow[]): string {
  if (rows.length === 0) return "(no icon rows recorded)";

  // Compute actual column widths from data, bounded by max.
  const widths = COLUMNS.map((c) =>
    Math.min(
      c.max,
      Math.max(
        c.label.length,
        ...rows.map((r) => truncate(cellOf(r, c.key), c.max).length),
      ),
    ),
  );

  const pad = (s: string, w: number) => s + " ".repeat(Math.max(0, w - s.length));
  const sep = "+" + widths.map((w) => "-".repeat(w + 2)).join("+") + "+";
  const renderRow = (cells: string[]) =>
    "| " + cells.map((c, i) => pad(c, widths[i]!)).join(" | ") + " |";

  const lines: string[] = [];
  lines.push(sep);
  lines.push(renderRow(COLUMNS.map((c) => c.label)));
  lines.push(sep);
  for (const r of rows) {
    lines.push(
      renderRow(COLUMNS.map((c, i) => truncate(cellOf(r, c.key), widths[i]!))),
    );
  }
  lines.push(sep);
  return lines.join("\n");
}

export function createIconDiagnostics() {
  const rows: IconDiagnosticRow[] = [];

  return {
    record(row: IconDiagnosticRow) {
      rows.push(row);
    },
    rowCount() {
      return rows.length;
    },
    /**
     * Print + attach the table. Call from `afterEach` so it fires on
     * failure; harmless if called when there are no rows.
     */
    async flush(testInfo: TestInfo, opts: { onlyOnFailure?: boolean } = {}) {
      const failed =
        testInfo.status !== testInfo.expectedStatus &&
        testInfo.status !== "skipped";
      if (opts.onlyOnFailure !== false && !failed) return;
      if (rows.length === 0) return;

      const table = renderTable(rows);
      const banner =
        `\n=== icon-diagnostics: ${testInfo.title} ===\n` +
        `${rows.length} link(s) recorded\n${table}\n`;

      console.log(banner);
      await testInfo.attach("icon-diagnostics", {
        body: banner,
        contentType: "text/plain",
      });
    },
  };
}

export type IconDiagnostics = ReturnType<typeof createIconDiagnostics>;

/**
 * `test` variant that exposes a `diag` fixture. The fixture creates a
 * recorder before the test, then on teardown calls `flush(testInfo)` —
 * which prints + attaches the per-link table only when the test failed.
 *
 * Usage:
 *   import { test, expect } from "./_helpers/icon-diagnostics";
 *   test("...", async ({ page, diag }) => { diag.record({...}); ... });
 */
export const test = base.extend<{ diag: IconDiagnostics }>({
  diag: async ({}, use, testInfo) => {
    const d = createIconDiagnostics();
    await use(d);
    await d.flush(testInfo);
  },
});

export { expect };
