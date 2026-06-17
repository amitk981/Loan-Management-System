# WhatsLoan — UI Redesign Scorecard

> **Type:** Screen-by-screen UI evaluation (companion to `Docs/INFORMATION_ARCHITECTURE_REVIEW.md` and `Docs/DESIGN_AUDIT_LEDGER.md`).
> **Frameworks:** (1) Nielsen's 10 usability heuristics; (2) WCAG 2.2 AA; (3) the project's own design system — `src/styles/theme.css` tokens, `lib/loanState.ts` tones, shared `StatusBadge`/`GateBanner`/`WorkbenchTabs`/`LoanTracker`/`TableStates`, the 5-item nav spine; (4) Material Design 3 for hierarchy / touch targets / state layers / mobile-first; (5) domain references — enterprise dashboard patterns for the back-office, consumer-app patterns for the farmer surface.
> **No UI-library migration.** Every recommendation is an improvement to the existing components/tokens. Review date: 2026-06-17, baseline `d70583e`.
>
> **Scoring:** 1 = broken/blocking · 2 = weak · 3 = acceptable · 4 = good · 5 = exemplary. Dimensions: Clarity · Trust · Task-fit · Info-hierarchy · Visual-hierarchy · Accessibility · Mobile · Action-feedback · Empty/Error/Loading · Language/Content · Consistency · Navigation-fit · Completion-confidence.

---

## 0. Scope & scoring summary

Average across 13 dimensions, **after** this pass's changes (▲ = improved this pass via the IA fixes, mostly Navigation-fit + Action-feedback):

| # | Screen / workflow | Avg | Lowest dims (watch) |
|---|---|---|---|
| S1 | Login / role identification | 4.2 | demo-credential labelling |
| S2 | Farmer Dashboard / Home | 4.1 | mobile two-focal-points |
| S3 | Apply for Loan (5-step wizard) | 4.5 ▲ | trustworthy step rail + upload feedback; localisation depth remains |
| S4 | Loan Status / Detail (farmer) | 3.9 ▲ | inner tabs now deep-linked (IA-03) |
| S5 | Pipeline (shared board) | 4.7 ▲ | role-aware KPIs + signals + per-stakeholder action; h-scroll on mobile |
| S6 | Loan File (shared detail) | 4.5 ▲ | tab now in URL; not-found state added |
| S7 | Credit Inbox / Appraisal | 4.0 | dense tables on mobile |
| S8 | Credit Registers hub (DPD/MIS/…) | 3.9 ▲ | active-state (fixed), table density |
| S9 | Compliance Document Workspace | 3.8 | acronym density |
| S10 | KYC & CDSL | 3.9 | — |
| S11 | Sanction Approval / Decision | 4.3 ▲ | irreversible-action confirm now added |
| S12 | Treasury Disbursement / Finance | 4.0 ▲ | active-state (fixed) |
| S13 | Admin Portfolio / Users / Audit | 3.8 | row identity (IA-08) |
| S14 | Empty / Loading / Error states | 3.6 ▲ | +Credit table empties, +LoanFile not-found |
| S15 | Mobile (cross-cutting) | 3.7 ▲ | hub-tab discoverability |

**Headline:** a strong, internally consistent system (one accent, token-driven, shared primitives). The weakest band is **empty/loading/error coverage** and **mobile discoverability of hub tabs**. This pass's code changes lifted **Navigation-fit** materially (active-state now correct everywhere) and **Action-feedback** on credit row navigation (right loan opens). Deeper localisation, per-step masks, and broader skeleton/empty coverage remain incremental (carried in the ledger).

---

## 1. Per-screen scorecards

### S1 — Login / Role identification (`auth/LoginPage.tsx`)
| Dim | Score | Note |
|---|---|---|
| Clarity | 5 | Split-screen, clear value prop, role pills. |
| Trust | 4 | Credible; "demo" framing could be more explicit. |
| Task-fit | 5 | OTP `123456` / password, reset flow. |
| Info-hierarchy | 4 | — |
| Visual-hierarchy | 4 | — |
| Accessibility | 4 | OTP keyboard nav, `aria-pressed` on lang; focus-visible global. |
| Mobile | 4 | Stacks reasonably. |
| Action-feedback | 4 | OTP error shake + message. |
| Empty/Error/Loading | 4 | Login error well handled; fake "Sending…". |
| Language/Content | 4 | Login copy localised (prior pass); Admin pill present. |
| Consistency | 4 | Emoji pills diverge from lucide set. |
| Navigation-fit | 5 | — |
| Completion-confidence | 5 | — |
**Top fixes:** add a "Demo credentials" hint card; replace emoji pills with lucide+role colour for icon consistency.

### S2 — Farmer Dashboard (`farmer/FarmerDashboard.tsx`)
| Dim | Score | Note |
|---|---|---|
| Clarity | 4 | Warm, prioritised; greeting + hero + grid. |
| Trust | 5 | "Good Standing" + journey tracker. |
| Task-fit | 4 | Pay / track / apply all one tap. |
| Info-hierarchy | 3 | Two focal points (standing banner + hero) compete on the same loan. |
| Visual-hierarchy | 4 | — |
| Accessibility | 4 | Hero is `role=button`+keys; clickable rows enhanced app-wide (Shell). |
| Mobile | 3 | Stacked hero + grid gets long; fine but heavy. |
| Action-feedback | 4 | Preview-state switcher makes states reachable (prior pass). |
| Empty/Error/Loading | 4 | No-loan zero-state + overdue banner reachable. |
| Language/Content | 4 | Routed through `t()`. |
| Consistency | 4 | Farmer palette now aliases tokens. |
| Navigation-fit | 5 | Specific shortcuts (apply/repay/docs). |
| Completion-confidence | 4 | — |
**Top fixes:** merge the standing banner into the hero on mobile to remove the duplicate focal point.

### S3 — Apply for Loan (`farmer/LoanApplication.tsx`)
| Dim | Score | Note |
|---|---|---|
| Clarity | 4 | 5-step rail, live limit calculator, checklist. |
| Trust | 5 | Eligibility gate + over-limit warning. |
| Task-fit | 5 | Annexure-A capture incl. NACH/ECS + guarantor (prior pass). |
| Info-hierarchy | 4 | — |
| Visual-hierarchy | 4 | — |
| Accessibility | 4 | Labelled inputs; upload zones are buttons. |
| Mobile | 4 | Rail collapses at 1024px. |
| Action-feedback | 5 ▲ | Submit toast + sequential reference id; **upload dropzones now confirm "Uploaded ✓" (was: no feedback after upload)**; doc-count KPI + rail "docs pending" update live. |
| Empty/Error/Loading | 4 | Submit gate summarises blockers via GateBanner. |
| Information-hierarchy | 5 ▲ | **Step rail now shows real per-step completion + an overall progress bar + signal-rich status ("₹50,000 within limit", "2 docs pending"), instead of a misleading pointer-based "Completed/Not started".** |
| Language/Content | 3 | Body copy still mostly English (DA-005 scoped). |
| Consistency | 4 | — |
| Navigation-fit | 5 | Per-section Edit jumps. |
| Completion-confidence | 5 | Strong success screen; rail makes "what's left" obvious. |
**Top fixes:** push i18n into wizard body copy (remaining); input masks already present on account/IFSC.

### S4 — Loan Status / Detail (`farmer/LoanStatus.tsx`)
| Dim | Score | Note |
|---|---|---|
| Clarity | 4 | Overview/Docs/Repayment/Timeline tabs. |
| Trust | 4 | LoanTracker + schedule. |
| Task-fit | 4 | — |
| Info-hierarchy | 4 | — |
| Visual-hierarchy | 4 | — |
| Accessibility | 3 | Tab buttons OK; table rows enhanced globally. |
| Mobile | 3 | Wide schedule table scrolls. |
| Action-feedback | 4 | Payment modal confirms. |
| Empty/Error/Loading | 3 | Document search has an empty state; others assume data. |
| Language/Content | 3 | English body. |
| Consistency | 4 | — |
| Navigation-fit | 3 → 4 ▲ | **Inner tab is now URL-addressable (`?tab=`) — survives refresh + back/forward (IA-03).** |
| Completion-confidence | 4 | — |
**Top fixes:** localise body copy (remaining).

### S5 — Pipeline (`shared/Pipeline.tsx`)
| Dim | Score | Note |
|---|---|---|
| Clarity | 5 | Six columns = the six SOP stages; owned column highlighted. |
| Trust | 5 | Live store; sanction decisions move cards. |
| Task-fit | 5 | Click card → that loan's file (carries id). |
| Info-hierarchy | 4 | — |
| Visual-hierarchy | 4 | — |
| Accessibility | 4 | Cards are buttons; count badges. |
| Mobile | 3 | Horizontal scroll board (acceptable for a kanban). |
| Action-feedback | 5 | Cards reflect mutations. |
| Empty/Error/Loading | 5 | Per-column "No loans" empty state. |
| Language/Content | 4 | Stage labels single-sourced from `STAGES`. |
| Consistency | 5 | — |
| Navigation-fit | 5 | The model's spine. |
| Completion-confidence | 4 | — |
| Task-fit | 5 ▲ | **Redesigned (2026-06-17): role-aware KPI strip (in-pipeline / my-queue / needs-attention / disbursed value), search, "my queue only" focus, per-column owner + value totals, card signal chips (over-limit / high-risk / sanction authority), and a contextual primary action that deep-links to the owner's Loan File tab (`?tab=`).** |
**Top fixes:** none blocking; consider a single-column accordion at ≤480px.

### S6 — Loan File (`shared/LoanFile.tsx`)
| Dim | Score | Note |
|---|---|---|
| Clarity | 5 | One object, role-gated tabs, stage tracker. |
| Trust | 5 | Authority chip + gates + audit tab. |
| Task-fit | 5 | Each role lands on its stage; over-limit gate. |
| Info-hierarchy | 4 | — |
| Visual-hierarchy | 4 | — |
| Accessibility | 4 | WorkbenchTabs have `role=tablist/tab`. |
| Mobile | 4 | Tab strip scrolls. |
| Action-feedback | 5 | Approve/Reject toast + store mutation. |
| Empty/Error/Loading | 4 → 5 ▲ | **Unresolved `?id=` now shows a real Loan-not-found state (recovery → Pipeline)**, not a silent fallback. |
| Language/Content | 4 | Glossary tooltips on doc acronyms. |
| Consistency | 5 | — |
| Navigation-fit | 4 → 5 ▲ | **Active tab now in URL (`?tab=`), alongside the loan id; breadcrumb/subtitle reflect it.** |
| Completion-confidence | 5 → 5 | Approve/Reject now require explicit confirmation (see S11). |
**Top fixes:** none blocking.

### S7 — Credit Inbox / Appraisal (`credit/ApplicationQueue.tsx`, `ApplicationReview.tsx`)
| Dim | Score | Note |
|---|---|---|
| Clarity | 4 | Intake tabs + TAT chips. |
| Trust | 4 | Eligibility/appraisal note. |
| Task-fit | 4 | — |
| Info-hierarchy | 4 | — |
| Visual-hierarchy | 4 | — |
| Accessibility | 4 | — |
| Mobile | 3 | Dense table. |
| Action-feedback | 4 | Skeletons + toast (prior pass). |
| Empty/Error/Loading | 4 | Loading skeleton + empty state present. |
| Language/Content | 4 | — |
| Consistency | 4 | — |
| Navigation-fit | 5 | — |
| Completion-confidence | 4 | — |

### S8 — Credit Registers hub (`credit/CreditOperations.tsx`)
| Dim | Score | Before → After |
|---|---|---|
| Clarity | 4 | — |
| Trust | 4 | — |
| Task-fit | 4 | — |
| Info-hierarchy | 4 | — |
| Visual-hierarchy | 4 | — |
| Accessibility | 4 | — |
| Mobile | 3 | Dense tables scroll. |
| Action-feedback | 4 | **Open File now opens the clicked loan (was: always default).** ▲ |
| Empty/Error/Loading | 3 | Tables assume data. |
| Language/Content | 4 | — |
| Consistency | 4 | — |
| Navigation-fit | 3 → 4 | **Sidebar door now stays lit on every hub tab (IA-01).** ▲ |
| Completion-confidence | 4 | — |
**Top fixes:** add `EmptyTableState` to the DPD/Rejected tables; converge `loanRegister` ids onto the loan store (IA-08).

### S9 — Compliance Document Workspace (`compliance/DocumentWorkspace.tsx`, `ComplianceOperations.tsx`)
| Dim | Score | Note |
|---|---|---|
| Clarity | 4 | Doc tabs PoA→Agreement. |
| Trust | 4 | Sign-off gates. |
| Task-fit | 4 | — |
| Info-hierarchy | 3 | Acronym density (PoA/SH-4/CDSL). |
| Visual-hierarchy | 4 | — |
| Accessibility | 4 | — |
| Mobile | 3 | — |
| Action-feedback | 4 | — |
| Empty/Error/Loading | 3 | — |
| Language/Content | 3 | Acronyms; glossary only partial. |
| Consistency | 4 | — |
| Navigation-fit | 3 → 4 | **Registers & Operations door now lit on its tabs (IA-01).** ▲ |
| Completion-confidence | 4 | — |

### S10 — KYC & CDSL (`compliance/KYCManagement.tsx`)
| Dim | Score | Note |
|---|---|---|
| Clarity | 4 | Due/Overdue tabs. |
| Empty/Error/Loading | 4 | Empty state added (prior pass). |
| Action-feedback | 4 | Toast. |
| Navigation-fit | 4 ▲ | KYC door lit on its tabs (IA-01). |
| (others) | 4 | — |

### S11 — Sanction Approval / Decision (`sanction/ApprovalScreen.tsx`, `SanctionOperations.tsx`)
| Dim | Score | Note |
|---|---|---|
| Clarity | 4 | 7-point scrutiny, signature ladder. |
| Trust | 5 | ₹5L authority switch, exception register. |
| Task-fit | 4 | — |
| Action-feedback | 4 | Toast on decision (prior pass). |
| Empty/Error/Loading | 3 | — |
| Navigation-fit | 4 ▲ | Registers door lit on tabs (IA-01). |
| Completion-confidence | 4 → 5 ▲ | **Approve/Reject in the Loan File now require a second confirmation; reject demands a written reason before it commits (Nielsen #5).** |
| (others) | 4 | — |

### S12 — Treasury Disbursement / Finance (`treasury/DisbursementScreen.tsx`, `TreasuryOperations.tsx`)
| Dim | Score | Note |
|---|---|---|
| Clarity | 4 | Two-step maker-checker. |
| Trust | 5 | Cancelled-cheque verification. |
| Task-fit | 4 | — |
| Action-feedback | 4 | Authorize/SAP toast. |
| Navigation-fit | 3 → 4 | **Repayments & Finance door lit on its tabs (IA-01).** ▲ |
| (others) | 4 | — |

### S13 — Admin Portfolio / Users / Audit (`admin/AdminScreens.tsx`)
| Dim | Score | Note |
|---|---|---|
| Clarity | 4 | Portfolio donut, registers. |
| Trust | 4 | Immutable audit log. |
| Task-fit | 4 | — |
| Action-feedback | 3 | Portfolio row → borrower page without identity (IA-08 dataset gap). |
| Empty/Error/Loading | 3 | — |
| Navigation-fit | 4 | — |
| (others) | 4 | — |
**Top fixes:** key admin `mockLoans` to the loan store, then open the Loan File with identity (IA-08).

### S14 — Empty / Loading / Error states (cross-cutting, `shared/TableStates.tsx`)
| Dim | Score | Note |
|---|---|---|
| Empty/Error/Loading | 3 → 4 ▲ | `EmptyTableState`/`SkeletonRows` now also cover Credit's Appraisal-Worklist/Returned and Active-Loans tables, plus a LoanFile **not-found** state for unresolved `?id=`. Some back-office register tables still assume data; no failed-load/network-error demo yet. |
**Top fixes:** extend `EmptyTableState` to the remaining compliance/treasury register tables; add one failed-load/error demo.

### S15 — Mobile (cross-cutting, `layout/Shell.tsx`)
| Dim | Score | Note |
|---|---|---|
| Mobile | 3 → 4 | Real breakpoints (1024/768/480) + bottom nav at ≤480px; **active-state fix now lights the correct bottom-bar door on hub tabs** ▲. Hub-tab children hidden on narrowest breakpoint → reach via search (IA-06). |
**Top fixes:** expose hub tabs on mobile (e.g. a horizontally-scrolling sub-tab row already present on hub pages — verify it isn't clipped); consider a "more" sheet.

---

## 2. Heuristic / WCAG roll-up (what this pass changed)

| Heuristic / criterion | Before | After this pass |
|---|---|---|
| Visibility of system status (Nielsen #1) | Active nav lost on hub tabs; credit rows opened wrong loan | Active door always correct (IA-01); credit rows open the clicked loan (IA-02) |
| User control & freedom (Nielsen #3) | Breadcrumbs inert | Ancestor breadcrumbs are clickable up-navigation (IA-05) |
| Consistency & standards (Nielsen #4) | Active-state inconsistent across hubs | Uniform `isItemActive` rule (key/children/match) |
| WCAG 2.2 — 2.4.8 Location / 3.2.3 Consistent navigation | "You are here" ambiguous on hubs | Sidebar + breadcrumb now jointly disambiguate location |
| Error prevention (Nielsen #5) | Approve/Reject committed on one click; reject captured no reason | **Pass II:** inline `role="alertdialog"` confirm; reject requires a written reason before commit |
| WCAG 2.2 — 2.4.5 Multiple ways / refresh + back-forward | Inner loan tabs lost on refresh, invisible to history | **Pass II:** `?tab=` makes them deep-linkable, refresh-safe, history-traversable (IA-03) |
| Help users recognise/recover from errors (Nielsen #9) | Unresolved `?id=` silently opened the demo loan | **Pass II:** explicit Loan-not-found state with a recovery action |
| Carried forward (documented, not yet done) | — | input masks (DA-015), deeper i18n (DA-005), failed-load/error demo, remaining table empties, `loanStore` convergence (IA-08) |

---

## 3. Implementation priority (delivered vs deferred)

**Delivered in pass I** (priorities 1–2 — IA confusion + misleading route/tab behaviour):
1. Active-nav-state on hub tabs — `Sidebar.tsx` (`match[]`).
2. Identity-carrying credit "Open File" shortcuts — `CreditOperations.tsx`.
3. Clickable breadcrumbs — `Header.tsx`.

**Delivered in pass II** (priorities 3–6 — route/tab behaviour, usability blockers, primary-workflow clarity, empty/error states):
4. Inner-tab deep-linking via `?tab=` (IA-03) — `routes.tsx`, `LoanFile.tsx`, `LoanStatus.tsx`. Survives refresh + back/forward (live-verified).
5. Confirmation on irreversible Approve/Reject, with required reason on reject — `LoanFile.tsx`.
6. Broader empty/error coverage: Credit table empties + LoanFile not-found state — `CreditOperations.tsx`, `LoanFile.tsx`.
7. Admin portfolio rows carry identity when the id resolves in the store — `AdminScreens.tsx`.

**Deferred (documented in ledger, lower priority bands 7–8):** input masks (Aadhaar/PAN/IFSC), deeper localisation of body copy, failed-load/network-error demo, remaining compliance/treasury table empties, `loanStore` dataset convergence (IA-08), mobile hub-tab discoverability sheet. Each is logged with a rationale.

Verification: see §5 of the IA review and the implementation log (pass II). `npx vite build` green after all changes; IA-03 deep-link, not-found state, and reject-confirmation live-verified on the dev server.
