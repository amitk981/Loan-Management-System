# Pipeline Enhancement Ledger

Goal: Make the Loan Pipeline board more intuitive, functionally richer, and visually
nicer. Constraint: **no left-accent / left-shadow stripe cards anywhere.**

## Tasks
- [x] T1 — Removed the left-border accent stripe; owned cards now use a full brand border (no left stripe anywhere). Column header uses a thin top-accent rule on white instead of a heavy fill.
- [x] T2 — Added borrower avatar (initials) with a stable, calm tint per name.
- [x] T3 — Added a per-card 6-segment mini lifecycle tracker showing stage position.
- [x] T4 — Added an amount-vs-limit utilisation bar (green / amber / red by load).
- [x] T5 — Enhanced column headers: numbered chip, count pill, owner + value, "your stage" dot — no heavy fills.
- [x] T6 — Improved KPI strip with icon chips and clearer hierarchy.
- [x] T7 — Board polish: subtle column tinting kept; calmer borders.
- [x] T8 — Verified: `npx vite build` green, no console errors, screenshot confirms layout.

## Log
- Created ledger. Starting implementation.
- Implemented T1–T7 in `src/app/components/shared/Pipeline.tsx`.
- T8: build green (built in 2.30s); logged in as Credit Team, pipeline renders correctly — avatars, utilisation bars, stage trackers, top-accent headers all visible. Done.
