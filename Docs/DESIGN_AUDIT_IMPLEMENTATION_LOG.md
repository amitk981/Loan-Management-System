# Design Audit — Implementation Log

> Companion to `Docs/DESIGN_AUDIT_LEDGER.md`. Chronological record of the autonomous execution pass that resolves the ledger.
> Baseline build: `npx vite build` ✅ green (vite 6.3.5, 1657 modules) before any change.
> No `tsc` in the project; the build gate is `npx vite build`. OTP demo code stays `123456`.

---

## Session — 2026-06-17 (autonomous execution pass)

### Conventions for this pass
- Reuse existing tokens (`theme.css`), components, `StatusBadge`/`STATUS_TONE`, `GateBanner`, and SOP terminology. No new visual system.
- Navigation: extended the `?page=` router to also carry `?id=` so loan detail screens open a specific loan. Encoding: `onNavigate('loan-file::LO00000089')` (double-colon) — backward compatible (calls without `::` behave exactly as before).
- Assumptions made (documented in ledger): DA-010 share-value basis resolved to the **₹200/share value** (the SOP §2.3 "10% result"), shown as a value with a clarifying footnote rather than a bare "%"; DA-031 KYC cadence kept as **"every 2 years"** (re-KYC / biennial); WCAG target **AA**.

### Work entries (chronological)

**Wave 1 — Foundations (DA-001, DA-013 infra, DA-029).**
- Created `src/app/data/loanStore.ts`: reactive, id-keyed register of 12 loans with `useLoan`/`useLoans` (`useSyncExternalStore`) + mutators `approveLoan`/`rejectLoan`/`disburseLoan` + helpers `eligibleLimit`/`authorityFor`/`isOverLimit`.
- `routes.tsx`: navigation now carries `?id=` via the `target::id` convention (back-compatible); `activeLoanId` threaded through `props`. Mounted `<Toaster>` (sonner) in `Root`.
- `shared/LoanFile.tsx`: resolves the loan from the id (was hardcoded `appraisalLoan`); derives stage/limits/authority/over-limit from the store; status badge from `loan.status`.
- `shared/Pipeline.tsx`: reads `useLoans()`; cards navigate with the loan id; reflect live store state.
- Build: green.

**Wave 2 — A11y + contrast + tokens (DA-022, DA-025, DA-016, DA-017).**
- `layout/Shell.tsx`: global effect making non-native `.clickable-row`/`.clickable-card` keyboard-operable (MutationObserver sets tabindex/role; delegated Enter/Space → click).
- `styles/theme.css`: `--neutral-400` #9EA8B3→#6B7280, `--neutral-500`→#5B6472 (WCAG AA); added farmer/one-off tokens.
- `styles/globals.css`: farmer vars alias theme tokens; all raw hex → tokens; `font-weight:800`→700.
- Build: green.

**Wave 3 — State machine polish + reachable states (DA-019, DA-026, DA-002).**
- `lib/loanState.ts`: `TONE_STYLES` reference tokens.
- `shared/CrossRoleComponents.tsx`: stage-label weight 700/500.
- `farmer/FarmerDashboard.tsx`: Preview-state switcher; no-loan zero-state; overdue banner.
- Build: green.

**Wave 4 — i18n + login + reduced motion (DA-005, DA-004, DA-003, DA-024, DA-023).**
- `context/LanguageContext.tsx`: ~40 EN/मर/हि keys; `<html lang>` sync.
- `auth/LoginPage.tsx`: Admin pill; functional language toggle; localised login copy.
- `farmer/FarmerDashboard.tsx`: strings routed through `t()`.
- `styles/theme.css`: `prefers-reduced-motion` block. `shared/StatusBadge.tsx`: min 12px.
- Build: green.

**Wave 5 — Disclosure + apply integrity (DA-008, DA-009, DA-006, DA-007, DA-014, DA-015, DA-029).**
- `farmer/KeyFacts.tsx` (new) + routes/nav/search wiring: localised Key Facts disclosure + capitalisation explainer.
- `farmer/LoanApplication.tsx`: NACH/ECS upload + checklist item; optional guarantor block; controlled DOB/Address/Account/IFSC with per-step gating + masks; sequential reference id + submit toast.
- Build: green.

**Wave 6 — Feedback rollout (DA-013).**
- Toasts added to `LoanFile` (approve/reject), `DisbursementScreen` (authorize/SAP), `RepaymentScreen`, `SupportGrievance`, `KYCManagement`, `ApplicationReview`.
- Build: green.

**Wave 7 — Hubs, empty/loading/TAT, glossary, cleanups (DA-020, DA-021, DA-011, DA-012, DA-018, DA-027, DA-028, DA-030, DA-031).**
- `layout/Header.tsx`: hidden hub tabs added to search. `shared/WorkbenchTabs.tsx`: thin/touch scroll.
- `credit/ApplicationQueue.tsx`: loading skeletons + empty state + TAT chips. `compliance/KYCManagement.tsx`: empty state.
- `shared/Abbr.tsx` (new) + applied in `LoanFile`. `AuthContext` treasury title. `CLAUDE.md` doc refs. `complianceData.ts` KYC cadence.
- Build: green.

**Wave 8 — Runtime fix + verification.**
- Browser preview surfaced a runtime "Invalid hook call / multiple copies of React" crash from `sonner`'s `Toaster` (build was green; app crashed at runtime). Fixed by adding `resolve.dedupe: ['react','react-dom']` + `optimizeDeps.include` to `vite.config.ts`. Restarted dev server → **no console errors**.

### Verification results
- `npx vite build` — **green** at baseline and after every wave (final: 1660+ modules, ✓ built ~2.2s). No `tsc` in project.
- Browser smoke test (preview server, port 5188) — **no console errors** after the React-dedup fix. Confirmed live:
  - Login renders; **Admin pill present**; **language toggle works** (heading → "पुन्हा स्वागत आहे", `<html lang>`→`mr`).
  - Farmer dashboard **Preview-state switcher**: No-loan zero-state + Overdue banner reachable by click.
  - **Loan store id routing:** LO00000086 → Narayan FPC + over-limit gate + CFO+2; LO00000089 → Rajesh Patil (distinct loans, not one hardcoded object).
  - **Sanction approve (DA-013 headline):** clicking Approve on LO00000085 → status "Approved", action buttons hidden, and the **Pipeline card moved to the Documentation (Stage 4) column** — store mutation propagates across screens.

### Remaining caveats / blocked
- **No BLOCKED items.** Three "Done (scoped)":
  - **DA-005** — localisation covers farmer dashboard + login + Key Facts; deeper screens (full apply-wizard body, back-office tables) remain English. Framework + dictionary are in place for incremental rollout.
  - **DA-014** — per-step validation enforces representative required fields (Step 1 DOB/Address/nominee; Step 3 Account/IFSC). Pattern is extendable to remaining fields.
  - **DA-027** — glossary tooltips applied to Loan File documents + Key Facts plain-languages farmer-facing acronyms; broader rollout is incremental.
- **DA-010** resolved by documented assumption (₹200/share value, the SOP §2.3 "10%" basis); confirm with PO (Open Q §17).
- The `vite.config.ts` change (React dedupe) is additive and required for `sonner` at runtime; it removes nothing the "do not remove plugins" note protects.
