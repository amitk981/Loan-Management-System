# Design Enhancement Ledger — Loan File & related screens

Goal: make each screen more intuitive, functionally richer and visually nicer.
Constraint: **no left-accent / left-shadow cards anywhere**. Use `theme.css` tokens only,
one accent (`#1E88E5`), ≤3 type weights {400,500,700}. Build gate: `npx vite build` green.

Legend: ⬜ todo · 🔄 in progress · ✅ done

## Loan File — `src/app/components/shared/LoanFile.tsx`
- ✅ T1 — Header: add a journey progress meter (stage X of 6 + % bar) and member context chips (shares, land, risk) so the top tells the whole story at a glance.
- ✅ T2 — Application tab: KYC pack gets a "N of N verified" summary header with a progress bar; rows get an Annexure caption + cleaner two-column rhythm.
- ✅ T3 — Appraisal tab: visual limit-comparison bars (shareholding vs land) with the binding limit highlighted; a requested-vs-eligible utilisation gauge.
- ✅ T4 — Sanction tab: signature ladder becomes a numbered step rail; scrutiny checks get a completed-count header.
- ✅ T5 — Documents tab: progress summary (verified / pending / total) + per-card status accent dot; clearer grouping.
- ✅ T6 — Disbursement tab: two-step initiate→authorise rail; SAP + bank cards enriched with status pills.
- ✅ T7 — Repayment tab: DPD bucket meter + numbered default ladder with connectors.
- ✅ T8 — Shared `Card`/`Row` polish: section caption support, hover affordance, no shadows.

## Verification
- ✅ V1 — `npx vite build` stays green.
</content>
