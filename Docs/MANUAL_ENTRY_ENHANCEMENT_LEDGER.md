# Manual Loan Application Entry — Enhancement Ledger

Goal: Replace the bare 2-column form on `credit-manual-entry` with the **same rich
5-step application wizard the farmer uses**, preceded by a **farmer search step** so the
Credit Manager picks an existing member before creating the entry on their behalf.

## Tasks
- [x] T1 — Extracted the farmer wizard into embeddable `farmer/LoanApplicationForm.tsx`, parameterised by `mode` + `applicant` prefill + Shell config. Farmer behaviour preserved.
- [x] T2 — `farmer/LoanApplication.tsx` is now a thin wrapper over the shared form (no visual change).
- [x] T3 — Built `shared/ManualLoanEntry.tsx`: member-search gate (name / folio / village / mobile) sourced from the loan register; selecting a member renders the wizard prefilled with editable name/mobile; "Create new member entry" supports off-register members.
- [x] T4 — Routed `credit-manual-entry` to `ManualLoanEntry` in `routes.tsx` (intercepts before the CrossRoleScreens catch-all).
- [x] T5 — Mode-specific success view ("Application Created", Create Another / Open Application Inbox) and step-1 back → member search.
- [x] T6 — No left-stripe cards. `npx vite build` green; verified in browser: search list renders, selecting Meena Joshi loads the prefilled wizard (₹2,00,000 eligible from her shares/land), Change-member banner present, no runtime console errors.

## Log
- Created ledger. Mapped farmer wizard (`farmer/LoanApplication.tsx`) and member directory (`loanStore` seed).
- Implemented T1–T5; build green (2.24s).
- T6 verification: screenshots confirm the search gate and the prefilled credit-mode wizard. Done.
