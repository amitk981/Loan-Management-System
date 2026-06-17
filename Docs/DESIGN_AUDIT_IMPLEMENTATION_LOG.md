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

---

## Session — 2026-06-17 (IA + UI review pass · companion docs)

> Driven by the new `Docs/INFORMATION_ARCHITECTURE_REVIEW.md` (IA-01…IA-08) and `Docs/UI_REDESIGN_SCORECARD.md`.
> Baseline `npx vite build` ✅ green (1663 modules) before changes; ✅ green after. Live-verified in the running dev server (port 5188), logged in as Credit (Priya Deshmukh). No console errors.

### Conventions
- No new visual system, no UI-library migration. Reused tokens, `WorkbenchTabs`, the `?page=`/`?id=` router, and the existing breadcrumb API (`string[]`).
- Scope held to the brief's priority bands 1–3 (IA confusion → misleading route/tab behaviour → a11y/usability), which the codebase actually still exhibited; bands 5–8 items were already largely done in the prior pass and are carried as documented residue.

### Work entries

**IA-01 — Active nav state on hub tabs (High).**
- Problem: hub `WorkbenchTabs` are real `?page=` routes, but their keys are neither the sidebar door's `key` nor a listed `child`, so `Sidebar.isItemActive()` lit **no** door on `credit-dpd`, `cs-noc`, `treasury-reconciliation`, `sc-exceptions`, etc. — the "you are here" marker vanished on every hub tab/deep-link.
- Fix: added optional `match?: string[]` to `NavItem` (`data/roleNav.ts`); `isItemActive` now also matches `item.match`. Populated `match` on every hub door (credit Registers + Application Inbox; compliance Document Queue, KYC, Registers & Operations; sanction Approval Queue + Registers; treasury Repayments & Finance) with its full tab/deep-link key set (`layout/Sidebar.tsx`).
- Category: IA / navigation · active-state. Score (Navigation-fit, hub screens) **3 → 4**.
- Files: `src/app/data/roleNav.ts`, `src/app/components/layout/Sidebar.tsx`.
- Verified live: `credit-dpd`→"Registers & Reports", `credit-exceptions`→"Registers & Reports", `credit-search-member`→"Registers & Reports", `credit-pending`→"Application Inbox", and regressions held (`credit-dashboard`→"Dashboard", `credit-queue`→"Application Inbox"+child, `pipeline`→"Pipeline"). Exactly one door lit each time.

**IA-02 — Identity-carrying "Open File" shortcuts (High).**
- Problem: credit Loan Register & Active-Loans rows called `onNavigate('loan-file')` with **no id** → every row opened the fallback loan `LO00000090`, regardless of which borrower was clicked (misleading shortcut, regression vs the DA-001 store work).
- Fix: both row actions now navigate with the row id — `onNavigate(\`loan-file::${row.id}\`)` (`credit/CreditOperations.tsx`).
- Category: IA / dashboard-shortcut · action-feedback. Score (Action-feedback, S8) **bump**.
- Files: `src/app/components/credit/CreditOperations.tsx`.
- Verified live: clicking row `LO00000018` (in store) → `?page=loan-file&id=LO00000018` → "Loan File — LO00000018" (correct). Clicking `LO00000002` (not seeded) → `?id=LO00000002`, graceful fallback render — the documented IA-08 dataset gap, not a nav bug.

**IA-05 — Navigable breadcrumbs (Medium).**
- Problem: `Header` rendered breadcrumbs as inert `<span>`s; ancestor crumbs that name real destinations (Pipeline, Dashboard, Credit Assessment, My Loans, Notifications…) gave no up-navigation.
- Fix: `Header` maps known ancestor labels → a `?page=` target and renders those as keyboard-focusable buttons (`onNavigate`); the terminal crumb stays static with `aria-current="page"`. No call-site/API change — existing `string[]` breadcrumbs preserved.
- Category: UI / navigation · Nielsen user-control. WCAG 2.4.8 (location).
- Files: `src/app/components/layout/Header.tsx`.
- Verified live: clicking "Credit Assessment" crumb → `?page=credit-dashboard`.

### Verification results
- `npx vite build` — **green** before and after (1663 modules, ✓ ~2.6s). No `tsc` in project.
- Dev server (5188), logged in as Credit: active-state, breadcrumb, and id-routing all confirmed by `preview_eval`/`preview_snapshot`; `preview_console_logs` (errors) — **none**. Screenshot captured of `credit-dpd` with the Registers door lit.

### Remaining caveats (documented, not blocking)
- **IA-03** — `LoanStatus`/`LoanFile` inner tabs stay in local state (Option C internal tabs); not deep-linked. Loan id is already in the URL, so `?tab=` deep-linking is a clean future enhancement.
- **IA-06** — infrequent hub tabs (Stamp/NOC/Grievance/…) have no sidebar door by design (5-item spine); reachable via Header search + lit parent door. A hub "section index" card grid is the documented next step.
- **IA-07** — unknown `?page=` silently redirects to role default; no 404/empty destination (acceptable for a closed prototype).
- **IA-08** — `creditData.loanRegister` and admin `mockData.mockLoans` are only partially keyed to `loanStore`, so IA-02 is "correct-or-graceful-fallback". Converging on the store as the single register is the next data task (continuation of DA-029). Admin portfolio rows were deliberately **left** on `member-loan-profile` rather than routed to `loan-file::id` with mostly-missing ids (would have produced a silently-wrong loan — exactly the misleading-shortcut anti-pattern).

---

## IA + UI implementation pass II (2026-06-17) — IA-03, decision-confirm, empty/error coverage, admin row identity

> This second pass picks up the items the first IA pass deliberately deferred (priority bands 3–6 of the brief). Each change was implemented, the build kept green, and the behaviour live-verified on the dev server (5188) via `preview_eval`/`preview_snapshot`/`preview_screenshot`. In-memory auth does not persist across a hard reload, so "refresh survival" was verified end-to-end by re-authenticating with the deep-link URL still present (the URL params drive initial state on mount).

**IA-03 — Deep-link inner tabs via `?tab=` (was: Accepted → now Done).**
- Problem: `LoanFile` and farmer `LoanStatus` inner tabs were React local state. A deep link could not target "the Appraisal tab of loan X"; refresh reset to the role's home tab; browser back/forward did not traverse tab changes. This was the one outstanding acceptance-criteria gap ("tabs used as destinations are reflected in the URL; refresh keeps the selected tab/state; back/forward works for tab changes").
- Fix:
  - Extended the URL-param router (`routes.tsx`) with a third navigation segment — `page::id::tab` → `?tab=`. All older `page` / `page::id` calls keep working unchanged (`split('::')`). Added `readTabFromUrl()`, an `activeTab` state, popstate restoration, and `activeTab` on the shared props.
  - `LoanFile` now derives its active tab from `?tab=` (controlled, no local state); changing tab navigates (`loan-file::${id}::${tab}`). The active tab label is appended to the breadcrumb and page subtitle so title/breadcrumb match the destination.
  - `LoanStatus` (farmer) Overview/Documents/Repayment/Timeline tab is likewise URL-driven; `setActiveTab` navigates (`${activePage}::::${tab}`), keeping every existing `setActiveTab(...)` call-site working.
- Category: IA / route-tab behaviour · Nielsen visibility-of-system-status · WCAG 2.4.5 (multiple ways).
- Files: `src/app/routes.tsx`, `src/app/components/shared/LoanFile.tsx`, `src/app/components/farmer/LoanStatus.tsx`.
- Verified live: loaded `?page=loan-file&id=LO00000089&tab=sanction`, re-authenticated → the **Sanction** tab was selected (not the role default Appraisal) — proves refresh survival. Clicking **Appraisal** changed the URL to `&tab=appraisal`; `history.back()` returned the URL to `&tab=sanction` AND re-selected the Sanction tab — proves back/forward traversal.

**Decision confirmation on irreversible Approve/Reject (Nielsen #5 — error prevention).**
- Problem: `LoanFile` SanctionTab committed irreversible loan-store mutations (`approveLoan`/`rejectLoan`) on a single click; no confirmation, and "Reject with reason" captured no reason. S11 completion-confidence flagged this.
- Fix: a two-step confirm rendered inline in the SanctionTab (idiom-matching the surrounding inline-token styling rather than pulling in the shadcn radix dialog). Approve shows a "Confirm approval / Cancel" panel; Reject shows a required reason textarea with "Confirm rejection" disabled until a reason is entered. Both panels carry `role="alertdialog"` + `aria-label`.
- Category: UI / feedback · error-prevention · completion-confidence.
- Files: `src/app/components/shared/LoanFile.tsx`.
- Verified live (logged in as Sanction/CFO on `LO00000086`, stage 3, undecided): "Reject with reason" → `role="alertdialog"` "Confirm rejection" with reason field, Confirm **disabled** while empty, **enabled** after typing a reason; "Cancel" restored the Approve/Reject buttons without mutating the store. Treasury's "Authorize & Execute Payment" was left as-is — it already sits at the end of a 5-step maker-checker flow.

**Empty/error-state coverage (priority band 5).**
- `LoanFile` now distinguishes "id requested but not in the store" from "no id" and renders a real **Loan-not-found** state (icon, explanation, "Back to Pipeline") instead of silently falling back to the demo loan. This also makes the admin row-identity change below safe.
- Credit `CreditOperations` filtered tables (Appraisal Worklist / Returned-Incomplete, and Active Loans) now render `EmptyTableState` with task-specific copy when the filter yields no rows, instead of an empty `<tbody>`.
- Category: UI / empty-error-loading states.
- Files: `src/app/components/shared/LoanFile.tsx`, `src/app/components/credit/CreditOperations.tsx`.
- Verified live: `?page=loan-file&id=LO99999999` rendered "Loan LO99999999 not found" with the recovery button (screenshot captured).

**Admin portfolio row identity (IA-02 / IA-08 follow-through).**
- Problem: admin Portfolio Register rows opened `member-loan-profile` with no identity. The first pass deliberately did NOT route them to `loan-file::id` because most admin `mockLoans` ids (5 of 6) are absent from `loanStore` — that would have opened the wrong loan.
- Fix: now that LoanFile has a graceful not-found state, rows route to the canonical Loan File **only when the id resolves in the store** (`getLoan(id)`), else they keep the borrower-lookup fallback. Strict improvement, no regression; converges further as the datasets align (IA-08).
- Files: `src/app/components/admin/AdminScreens.tsx`.

### Verification results (pass II)
- `npx vite build` — **green** (vite 6.3.5, 1663 modules, ✓ ~3.5s). No `tsc` in project.
- Dev server (5188): IA-03 deep-link survival + back/forward, not-found state, and the reject-confirmation gating all confirmed via `preview_eval`/`preview_snapshot`/`preview_screenshot`. No console errors observed.

### Remaining caveats (pass II)
- **IA-07** (unknown `?page=` silent redirect) and **IA-06** (hub-tab discoverability) are unchanged — still accepted/mitigated as before.
- **IA-08** data convergence is still the underlying open item; the admin change is resolve-or-fallback, not always-resolve, until `mockLoans`/`loanRegister` are keyed to `loanStore`.
- `LoanFile`/`LoanStatus` `?tab=` deep-linking is now done; other inner-tab screens (e.g. `MemberLoanProfile`) still use local state — low value, not converted.

---

## Farmer Apply-wizard + Pipeline enrichment (2026-06-17, pass II continued)

**Pipeline board — role-aware redesign (`shared/Pipeline.tsx`).**
- Problem: the board showed identical, info-thin cards for every role — no totals, no signals, no actions. "Basic."
- Fix: a role-aware KPI strip (in-pipeline count+value, my-queue for the role's owned stage(s), needs-attention, disbursed value), search + "my queue only" focus, per-column owner label + ₹ total, card signal chips (over-limit / high-risk / sanction authority CFO+1 vs CFO+2) + location, and a contextual primary action (Open appraisal / Review & decide / Prepare documents / Initiate disbursement / Monitor repayment) that **deep-links into the owner's Loan File tab** (`loan-file::id::tab`, reusing the IA-03 `?tab=` work).
- Verified live as Credit: KPIs (12 / ₹25,25,000; my-queue 5 across Stage 2 & 6; attention 2), "my queue only" → Stage 2 + 6 only, "Open appraisal" → `?page=loan-file&id=LO00000089&tab=appraisal`. No new console errors. Build green (1663 modules).
- Caveat: no per-loan "days in stage / SLA" — the store has no timestamps, so all signals shown are real (eligibility, risk, authority, status, location); aging would need a timestamped loan model.

**Apply-for-Loan wizard — trustworthy rail + upload feedback (`farmer/LoanApplication.tsx`).**
- Problem 1: the step rail marked steps "Completed" from the page pointer (`step > id`), so jumping to step 5 falsely showed steps 2–4 as done. Problem 2: upload dropzones gave no confirmation after a file was "uploaded" (Nielsen #1 visibility-of-system-status).
- Fix 1: a real per-step completion model derived from the existing validation booleans (`step1Valid`, `amountWithinLimit`, `step3Valid` = account 9–18 digits + valid IFSC, `allDeclarationsChecked`, `canSubmitApplication`), an overall progress bar + "N/5 done", and signal-rich per-step status lines ("₹50,000 within limit", "Bank details needed", "2 docs pending").
- Fix 2: every dropzone (Step 3 land/bank docs, cancelled cheque, NACH/ECS; Step 4 applicant + nominee KYC) now reflects `reviewDocs[*].uploaded` — green border + `FileCheck` + "Uploaded — tap to replace".
- Verified live as Farmer: filling DOB+address flipped Step 1 → "Details captured" and progress 1/5 → 2/5; uploading Crop Plan turned its zone green and dropped both the "Documents" KPI (6/9 → 7/9) and the rail's "3 docs pending" → "2 docs pending". Build green (1663 modules); no new console errors.
- Scorecard S3 (Apply) Info-hierarchy 4→5 / Action-feedback bump; S5 (Pipeline) Task-fit →5.

---

## Responsive navigation — off-canvas mobile drawer (2026-06-17, pass III)

**Problem.** Below 1024px the shared shell degraded badly: the sidebar shrank to a
64px **unlabeled icon rail** (tablet), then on phones (<480px) became a cramped
horizontal-scrolling **bottom icon bar** with all labels, sections, badges and the
user card hidden via `display:none` overrides. Nav was effectively unusable on a
phone — no labels, no sub-items, no role/section context.

**Fix (layout/Shell.tsx, layout/Sidebar.tsx, layout/Header.tsx).**
- Shell now tracks `isMobile` (`< 1024px`, via a `resize` listener) and a `mobileOpen`
  drawer state. Below the breakpoint the sidebar renders as a **full-label 280px
  off-canvas drawer** that slides in over a dimmed backdrop; at ≥1024px the original
  desktop collapse (240↔64px) is unchanged.
- Drawer UX niceties: tap-backdrop / Esc / route-change all close it; body scroll is
  locked while open; the header hamburger swaps to an **X** (`aria-expanded`) only in
  the mobile-open state; every drawer nav tap auto-closes the drawer.
- The old `@media` sidebar-rail / bottom-bar hacks were deleted; the responsive grid +
  typography reflow rules (multi-col → single col, large headings scaled down) were kept.
  Breadcrumbs hide < 1024px (the drawer is the wayfinding surface there).

**Verified live.** Mobile (375px): hamburger opens a labeled drawer with backdrop, X
closes it, content reflows to a single column full-width. Desktop (1280px, after a real
resize event): 240px labeled sidebar + content margin restored, multi-column grid intact.
`npx vite build` green (1663 modules); no console errors. Note: the preview harness
doesn't auto-dispatch `resize`, so the breakpoint switch was confirmed by dispatching one
manually — real browsers fire it natively on viewport change.

---

## Credit · New Applications (Application Queue) — responsive master-detail + intake polish

**Problem.** The intake screen (`credit/ApplicationQueue.tsx`) used a fixed 12-col
master/detail grid (`col-span-4` list + `col-span-8` detail) that did not reflow below
the desktop breakpoint — on phone/tablet the two panes collided into an unreadable sliver.
KYC progress was implicit (a flat list), primary actions gave no feedback, and several
controls lacked focus/hover/disabled affordances.

**Fix (credit/ApplicationQueue.tsx).**
- **Responsive master-detail.** Panes now stack: `flex flex-col lg:grid lg:grid-cols-12`.
  Below `lg`, a `mobileView` state (`'list' | 'detail'`) shows one pane at a time — tapping
  an application opens the detail with a **"← Back to list"** button; both panes show
  side-by-side at ≥1024px. `InfoGrid` collapses 2-col → 1-col on mobile.
- **KYC progress made explicit.** Added an `X of N verified` count + an amber/green
  progress bar (`role=progressbar`, ARIA values) above the document checklist.
- **Action feedback & states.** `Mark Complete`, document `Request`, and deficiency-notice
  send now fire `sonner` toasts; `Assign to Appraisal` shows a "resolve KYC first" tooltip
  while disabled; the footer action bar is `sticky bottom-0`. Complete docs are no longer
  pointlessly clickable (disabled), missing docs show a `Request →` affordance.
- **A11y / interaction polish.** `aria-pressed` on filter + language toggles, `aria-label`
  on search, a clear-search (×) button, focus-visible outlines, hover brightness on
  primary buttons, and a truncation-safe flex on doc rows. The "Add Manual" label
  shortens to "Add" on `<sm`.

**Verified live.** Logged in as Credit (OTP 123456), `?page=credit-queue`.
Mobile (375px): list shows 3 cards / detail hidden; tapping a card hides the list and
shows the detail with a visible Back button and a 67% (4-of-6) KYC bar. Desktop (1280px):
both panes render (`list:flex`, `detail:block`), selected row carries the blue accent
border, progress bar + sticky footer actions confirmed by screenshot. `npx vite build`
green (1663 modules); no console errors.
