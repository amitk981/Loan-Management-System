# WhatsLoan — SFPCL Member Credit Portal (project map)

A multi-role web prototype that digitises SFPCL's member loan lifecycle, governed by
`SOP_SFPCL_LOANDISBURSEMENT v1.0` (Section 378ZK, Companies Act 2013). Read
`Docs/SFPCL_Design_Audit_and_Redesign_Plan.md` for the full audit, SOP study, user
journeys, system flow, and the redesign plan. The two SOP PDFs live in `Docs/`.

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
- `src/styles/theme.css` — **design tokens (the intended source of truth)**
- `Docs/SFPCL_LoanPlatform_Figma_DesignBrief.md` — the documented design system

## Known tangles (see the audit doc for the plan to fix them)
- **Route bloat:** ~91 page keys; Credit 21 / Compliance 26 / Sanction 16. Many map to one
  mega-component (`CreditOperations` renders 16 "pages"). Goal: task-first IA, ≤5 nav items/role.
- **Two design languages:** soft farmer surface vs dense back-office; tokens bypassed.
- **`formatCurrency` is redefined in 18 files** → should be one shared util.
- **1,481 inline `style={{}}` blocks, 2,517 hardcoded hex** → migrate to `theme.css` tokens.
- **102× `fontWeight: 900`** and two blues (`#1E88E5` vs `#0C5FA5`) → ≤3 weights, one accent.
- No real Loan File object yet → the fix is one shared, tabbed Loan File all roles open.

## Conventions to hold (so the AI stays a help, not a hazard)
- One home per job: shared `formatCurrency`, one `StatusBadge` driven by a status enum.
- Use `theme.css` tokens, not inline hex. One accent (`#1E88E5`), ≤3 type weights.
- Status strings should map to the loan state machine (see audit doc §F.1).
- A codebase "checkup" skill is installed at `.claude/skills/vibe-check` — invoke it for
  health passes; methodology in its `references/CODE-CHECKUP.md` and `KEEPING-CODE-NAVIGABLE.md`.
