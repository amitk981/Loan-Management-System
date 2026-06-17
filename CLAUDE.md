# WhatsLoan — SFPCL Member Credit Portal (project map)

A multi-role web prototype that digitises SFPCL's member loan lifecycle, governed by
`SOP_SFPCL_LOANDISBURSEMENT v1.0` (Section 378ZK, Companies Act 2013). The two SOP PDFs
are the source of truth and live in `Docs/`:
- `Docs/Final SOP - Loan Disbursement V10 (1).pdf` — the full 33-page SOP.
- `Docs/SFPCL_Loan Sanction- Doc & Disbursement-SOP_WhatsLoan-25052026.pdf` — the visual brief.

For the living UX/prototype audit, issue ledger, and the execution log, read
`Docs/DESIGN_AUDIT_LEDGER.md` and `Docs/DESIGN_AUDIT_IMPLEMENTATION_LOG.md`.

## Stack
React 18 + TypeScript + Vite + Tailwind + shadcn/ui. All data is **mocked** (`src/app/data/`).
Custom URL-param router (`?page=`) — no real nested routes yet.

## The 6 SOP stages (the spine of everything)
1 Initial Loan Request → 2 Credit Assessment (TAT 2d) → 3 Credit Scrutiny & Approval →
4 Documentation & Stamping → 5 Loan Disbursement → 6 Monitoring & Repayment.

## The 6 roles (consistent names — use these everywhere)
- **farmer** (Borrower / FPC) — apply, track, repay, grievance
- **credit** (Credit Assessment Team) — intake, appraisal note, register, DPD, invoices
- **compliance** (Company Secretary + officer) — legal docs, stamping, KYC, NOC, grievance
- **sanction** (Sanction Committee: CFO + Directors) — scrutiny, approve/reject, signatures
- **treasury** (CFC + Sr. Manager–Finance) — SAP code, RBL disbursement, repayment posting
- **admin** — portfolio, users, audit, s.186 / NBFC monitors

## Where things live
- `src/app/routes.tsx` — role→page routing + the `?page=` state (the ~91 page keys live here)
- `src/app/components/layout/` — `Shell` (page frame), `Sidebar` (per-role nav), `Header`
- `src/app/components/<role>/` — feature screens per role
- `src/app/components/shared/` — cross-role components (StatusBadge, LoanTracker, TableStates…)
- `src/app/components/ui/` — shadcn primitives (don't edit casually)
- `src/app/data/` — mock data per role
- `src/styles/theme.css` — **design tokens (the source of truth)**; `src/styles/globals.css` farmer surface aliases these tokens
- `Docs/DESIGN_AUDIT_LEDGER.md` — the living UX/prototype audit + issue ledger (the documented design system reference)

## Enhancement pass — done (branch `enhance/vibe-check-pass`)
- ✅ **`formatCurrency` centralised** → `src/app/lib/format.ts` (was 18 copies).
- ✅ **Loan state machine** → `src/app/lib/loanState.ts` (canonical states, stage map, 6-tone
  palette). `StatusBadge` now resolves status→tone (was 96 ad-hoc colour pairs).
- ✅ **One accent + calm weights:** retired second blue `#0C5FA5`→`#1E88E5`; 102× `fontWeight:900`→700.
- ✅ **Token migration:** ~92% of inline quoted hex → `var(--token)` from `theme.css`
  (1,609 literals across components; value-preserving).
- ✅ **`GateBanner`** (`shared/GateBanner.tsx`) — SOP "blocked because X → do Y"; wired into
  disbursement, farmer KYC/default, and over-limit appraisal gates.
- ✅ **Calmer sidebar:** only the primary task-group expands; register groups collapsed to
  single hub links (sub-registers are tabs on the hub page, not nav doors).
- ✅ **Shared Loan File** (`shared/LoanFile.tsx`, route `loan-file`) — one object, role-gated
  tabs for the 6 stages; the hub for "open a loan" (register/active-loans/search/Pipeline).
- ✅ **Pipeline board** (`shared/Pipeline.tsx`, route `pipeline`) — all loans by the 6 stages;
  nav item for every back-office role; cards open the Loan File.
- ✅ **One dashboard focus:** removed Credit's duplicate banner (RoleCommandCenter is the focus).
- ✅ **a11y:** FarmerDashboard hero is now `<div role=button>` (no invalid nested buttons).

## Definition of Done — all six criteria met (final pass)
- **C1 nav ≤5:** every role's sidebar = exactly 5 items; sibling registers are tabs on hubs.
- **C2 one focus:** every back-office dashboard leads with a single `RoleCommandCenter`.
- **C3 one design language:** 0 inline hex in feature components (all → `theme.css` tokens),
  exactly 3 weights {400,500,700}, one accent (`#1E88E5`).
- **C4 shared Loan File:** `shared/LoanFile.tsx` is the one detail object; lists/Pipeline open it.
- **C5 gates:** every SOP gate renders via `shared/GateBanner.tsx` (8 screens, incl. s.186 + GM).
- **C6 status/stage:** `StatusBadge` resolves via `lib/loanState.ts` tones; the 6 stage labels
  are single-sourced from `STAGES` (used by both LoanTracker + UniversalStageTracker).

## Accepted exceptions (deliberately not done)
- **Mega-component deletion:** `CreditOperations`/`ComplianceOperations`/`SanctionOperations`/
  `TreasuryOperations` still implement the hub tab-views (now ≤5 nav doors, not 20). Physically
  merging their content into Loan File tabs and deleting them is a large refactor left for later.
- **shadcn `ui/` primitives** keep their own hex/weights (don't edit casually).
- Build gate: `npx vite build` must stay green (no `tsc` in the project). OTP for the demo
  login is `123456`.

## Conventions to hold (so the AI stays a help, not a hazard)
- One home per job: shared `formatCurrency`, one `StatusBadge` driven by a status enum.
- Use `theme.css` tokens, not inline hex. One accent (`#1E88E5`), ≤3 type weights.
- Status strings should map to the loan state machine (see audit doc §F.1).
- A codebase "checkup" skill is installed at `.claude/skills/vibe-check` — invoke it for
  health passes; methodology in its `references/CODE-CHECKUP.md` and `KEEPING-CODE-NAVIGABLE.md`.
