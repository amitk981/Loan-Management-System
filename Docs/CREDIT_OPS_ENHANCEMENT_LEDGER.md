# Credit Operations — Visual Enhancement Ledger

Goal: make the Credit Assessment screens (Loan Register, Active Loans, DPD Monitoring,
Defaults & Recovery, Rejected) more intuitive, functionally richer, and nicer overall.
Constraint: no left-shadow cards anywhere; stay on `theme.css` tokens, 1 accent, ≤3 weights.

## Tasks
- [x] T1 — Loan Register: portfolio summary strip (count / sanctioned value / on-time / overdue), live search, DPD colour pills, selected-row highlight.
- [x] T2 — Active Loans: summary strip + per-row repayment progress bar (red/amber/green by DPD).
- [x] T3 — DPD Monitoring buckets: richer cards with share-of-book bars; bucket filter chips + watchlist search; renamed "DPD Watchlist".
- [x] T4 — Defaults & Recovery: now a DISTINCT screen (was identical to DPD) — recovery KPIs, Cases-in-Recovery table with Recovery Stage, vertical recovery-workflow timeline bound to the selected case, search.
- [x] T5 — Rejected: KPI strip, reason rendered as warning chips, real action buttons.
- [x] T6 — Shared table polish: sticky header band, selected-row highlight, mono numerics via SimpleTable.
- [x] T7 — Build gate green (`npx vite build`).

## Follow-up requests (post-review)
- [x] R1 — Remove drop-shadow look on KPI cards: dropped coloured top-border (read as a raised/shadow edge); cards are flat with a left colour tick + status dot.
- [x] R2 — Removed the blue "Open Manual Entry" info strip on New Applications (`ApplicationQueue.tsx`).
- [x] R3 — Sticky workbench tabs: `WorkbenchTabs` now sticks to the top of the scroll area inside a full-bleed opaque band (upward box-shadow covers the page top-padding so no content peeks through). Applies to every role's hub.

## Notes
- Credit screens render from `src/app/components/credit/CreditOperations.tsx`; tabs from `src/app/components/shared/WorkbenchTabs.tsx`.
- No `shadow` utilities on cards; the only box-shadow is the sticky-band gap cover.
</content>
