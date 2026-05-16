# Comparison Table Visual Regression

Catches layout drift in the VS Lindy comparison table across the breakpoints
defined in `src/styles.css`:

| Viewport | Tests                                    |
| -------- | ---------------------------------------- |
| 900px    | 3-col layout, full spacing               |
| 768px    | 3-col layout, tightened (<=900) spacing  |
| 640px    | Boundary — 2-col collapse rule triggers  |
| 375px    | Mobile 2-col (Feature → Agente)          |

## First-time setup

```bash
bun run test:visual:install   # downloads Chromium (one-time, ~150 MB)
bun run test:visual           # first run records baselines into __snapshots__/
```

## Day-to-day

```bash
bun run test:visual           # runs all 4 viewports, fails on visual diff
bun run test:visual:update    # accept current rendering as the new baseline
```

Snapshots are checked into git under
`tests/visual/compare-table.spec.ts-snapshots/`.
Review the diff in `playwright-report/` (auto-opens via `npx playwright show-report`).

## What the test does

1. Loads `/`, forces EN locale + `vs Lindy` view via localStorage.
2. Disables all CSS + framer-motion animations for determinism.
3. Scrolls `#compare` into view.
4. Snapshots the `#compare` section and diffs vs baseline
   (tolerance: 0.5% pixel ratio for anti-aliasing drift).