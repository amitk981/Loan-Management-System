# Credit Dashboard — Visual Enhancement Ledger

Goal: make the Credit Dashboard (`CreditDashboard.tsx`) more intuitive, functionally richer,
and nicer overall. Constraint: no left-shadow cards anywhere; stay on `theme.css` tokens,
1 accent, ≤3 weights. Keep the shared `RoleCommandCenter` mostly untouched (used by all roles).

## Tasks
- [ ] T1 — Action Queue: header count pill + "View all", per-row priority accent bar, tinted icon, status badge, time-ago meta, chevron affordance.
- [ ] T2 — Alerts: header count pill, severity icons, "View all", keep tinted (non-shadow) cards.
- [ ] T3 — Portfolio Health: hero KPI tiles (Outstanding / Avg Loan / NPA / On-time), single stacked composition bar for the DPD buckets, richer bucket tiles with share %.
- [ ] T4 — Remove any shadow hovers (no-shadow rule); use border/translate affordances instead.
- [ ] T5 — Build gate green (`npx vite build`) + preview verification.

## Notes
- Screen renders from `src/app/components/credit/CreditDashboard.tsx`.
</content>
