# WhatsLoan — SFPCL Member Credit Portal · Living Design Audit & Issue Ledger

> **Type:** Product / UX / Prototype design audit (not a backend engineering audit).
> **Scope question every issue must answer:** *"Does this affect the quality, clarity, completeness, usability, or accuracy of the design prototype?"* If no, it is excluded from the ledger (see §15).
> **Prototype:** React 18 + TS + Vite + Tailwind + shadcn/ui, all data mocked. Custom `?page=` router.
> **Source of truth for requirements:** the two SOP PDFs in `Docs/` (see §2, §4).
> **Audit date:** 2026-06-16 · **Audited commit:** `09b81cf` (branch `main`) · **Auditor role:** senior product designer / UX auditor / requirements analyst.
> **Status legend:** Open · In Progress · Blocked · Needs Design Decision · Ready for Implementation · Done · Won't Fix.
> **How to maintain:** Update the issue rows in §14 as work progresses. Add new findings with the next `DA-###` id. Keep §16 (roadmap) and §1 (exec summary) in sync after each pass.
>
> **✅ EXECUTION PASS COMPLETE (2026-06-17):** All 31 ledger issues (DA-001…DA-031) implemented in one autonomous pass — see the **Resolution Log (§14.1)** for per-issue files + evidence and `Docs/DESIGN_AUDIT_IMPLEMENTATION_LOG.md` for the chronological log. Build green (`npx vite build`) and browser-smoke-tested with no console errors. A few items are "Done (scoped)" with caveats noted in §14.1 (DA-005 localisation depth, DA-014 field coverage, DA-027 rollout).

---

## 1. Executive Summary

**What this is.** WhatsLoan is a multi-role web prototype that digitises SFPCL's member loan lifecycle, governed by `SOP_SFPCL_LOANDISBURSEMENT v1.0` (Section 378ZK, Companies Act 2013). It models six roles (farmer, credit, compliance, sanction, treasury, admin) moving a loan through six SOP stages (Initial Request → Credit Assessment → Scrutiny & Approval → Documentation & Stamping → Disbursement → Monitoring & Repayment).

**Overall UX quality: B / "strong vertical-slice prototype".** The information architecture is unusually disciplined for a prototype of this size: a single state machine (`lib/loanState.ts`), one currency helper (`lib/format.ts`), a single `StatusBadge`, a shared `GateBanner` for SOP "hard gates", a shared `LoanFile` and `Pipeline`, and a 5-item nav spine per role. SOP fidelity is high — the loan-limit calculator, approval matrix (₹5L threshold → CFO+1 vs CFO+2), the 7-point scrutiny, the signature ladder, the default ladder, tri-party/PoA/SH-4/CDSL/NOC, and the 8-year archive are all represented faithfully. This is the prototype's biggest strength and should be protected.

**Prototype readiness: ~70% for a stakeholder walkthrough; ~40% for a usability test with real farmers.** It demonstrates the *shape* of the system convincingly to internal stakeholders who already know the SOP. It is **not yet ready** to put in front of an actual borrower or a first-time evaluator without guidance, because the most instructive states are unreachable and the farmer-facing surface is English-only.

**Biggest design risks**
- **The prototype shows one loan and one happy path.** Every list row / pipeline card opens the *same* hardcoded loan (no id is ever passed — 0 screens read a loan id), and the farmer dashboard's alternative states (`under-processing`, KYC-blocked, active-default) are gated behind hardcoded `const`s that require a code edit to view (`DA-001`, `DA-002`). The richest, most demo-worthy moments are invisible during a live click-through.
- **Trilingual support is nav-deep only.** The product targets farmers and the SOP requires local-language disclosure (Fair Practice Code), but only sidebar/header labels are translated; every form, status, term-sheet field and body sentence stays English when the user switches to मराठी / हिंदी (`DA-005`).
- **No action feedback.** `sonner` is installed but unused; Approve / Reject / Submit / Post-to-SAP either silently flip local state or do nothing — violating "visibility of system status" (`DA-013`).
- **Low-contrast secondary text** (`--neutral-400` ≈ #9EA8B3 on white) used pervasively for helper/meta copy fails WCAG AA, which matters acutely for an older, rural, low-vision-prone audience (`DA-022`).

**Biggest missing user flows / states**
- Reachable empty states (lists are always populated; `EmptyTableState` used once) and loading states (`SkeletonRows` used once) — `DA-011`, `DA-012`.
- A reachable "new/processing application" and "no loan yet" farmer journey — `DA-002`.
- Admin is implemented but has no login entry point — `DA-003`.
- NACH/ECS mandate and guarantor capture (explicit SOP borrower obligations) are not represented anywhere — `DA-006`, `DA-007`.

**Biggest opportunities**
- Wire a tiny mock "loan store" keyed by id so list→detail navigation and state variants become *clickable* rather than code-edited. This single change unlocks 80% of the prototype's latent value (`DA-001`/`DA-002`).
- Push the existing i18n dictionary down into screen content for the farmer surface — the framework already exists.
- Adopt the existing `EmptyTableState` / `SkeletonRows` / `sonner` primitives that are already in the repo but unused.

**Does the current UI match the official docs?** Largely **yes** on process structure and gates; **partially** on disclosures (rate/APR/penal-charge transparency, local language) and **incompletely** on a few borrower obligations (NACH/ECS, guarantor). See the requirements table (§4).

**Is the user journey clear?** For internal roles, yes — the command-center + pipeline + loan-file pattern is coherent. For the farmer, the happy path is clear and friendly; the failure/edge paths are not reachable.

**Can a first-time user understand the product?** A domain-aware stakeholder: yes. A cold first-time user or farmer without a guide: only partially, due to acronym density (PoA, SH-4, CDSL, DPD, SAP, NOC, CFC) and English-only body copy.

**Immediate design priorities (do first) — ✅ all resolved in the 2026-06-17 pass**
1. ~~`DA-001` Make list→detail navigation carry a loan identity~~ → **Done** (id-keyed `data/loanStore.ts`).
2. ~~`DA-002` Make the alternative farmer states reachable via UI~~ → **Done** (Preview-state switcher + no-loan/overdue states).
3. ~~`DA-013` Add toast/confirmation feedback for every state-changing action~~ → **Done** (`sonner` Toaster + toasts on all key actions; approve also advances the loan).
4. ~~`DA-022` Fix secondary-text contrast to meet WCAG AA~~ → **Done** (`--neutral-400/500` darkened).
5. ~~`DA-005` Farmer-surface localisation~~ → **Done (scoped)** (dashboard + login + Key Facts localised; deeper screens incremental).

---

## 2. Source Material Reviewed

### Repository folders / files inspected
- **Routing & app shell:** `src/app/routes.tsx`, `src/app/App.tsx`, `src/main.tsx`, `index.html`.
- **Layout:** `src/app/components/layout/Shell.tsx`, `Sidebar.tsx`, `Header.tsx`.
- **Design system / tokens / styling:** `src/styles/theme.css`, `globals.css`, `index.css`, `tailwind.css`, `fonts.css`; `default_shadcn_theme.css`; `guidelines/Guidelines.md`; Tailwind v4 via `@tailwindcss/vite` (`vite.config.ts`, `postcss.config.mjs`).
- **Shared spine:** `lib/loanState.ts`, `lib/format.ts`, `data/roleNav.ts`; `components/shared/` (`StatusBadge`, `GateBanner`, `LoanFile`, `Pipeline`, `LoanTracker`, `RoleCommandCenter`, `StatsCard`, `TableStates`, `WorkbenchTabs`, `CrossRoleComponents`, `CrossRoleScreens`, `AppModal`, `UtilityScreens`).
- **Auth & i18n:** `context/AuthContext.tsx`, `context/LanguageContext.tsx`, `components/auth/LoginPage.tsx`.
- **Feature screens:** farmer (`FarmerDashboard`, `LoanApplication`, `LoanStatus`, `RepaymentScreen`, `SupportGrievance`), credit (`CreditDashboard`, `ApplicationQueue`, `ApplicationReview`, `LoanCalculator`, `CreditOperations`), compliance (`ComplianceDashboard`, `DocumentWorkspace`, `KYCManagement`, `ComplianceOperations`), sanction (`SanctionDashboard`, `ApprovalScreen`, `SanctionOperations`), treasury (`TreasuryDashboard`, `DisbursementScreen`, `TreasuryOperations`), admin (`AdminScreens`).
- **Mock data:** `data/mockData.ts`, `farmerData.ts`, `creditData.ts`, `complianceData.ts`, `sanctionData.ts`, `treasuryData.ts`, `crossRoleData.ts`.
- **shadcn primitives:** `components/ui/*` (47 files) — reviewed at a glance only; deliberately not edited per CLAUDE.md.
- **Quantitative scans:** inline-hex / font-weight / aria / empty-state / toast / loan-id grep counts (cited inline below).

### Styling / config files inspected
`theme.css` (design tokens, ~190 CSS vars + `@theme inline` mapping), `globals.css` (farmer-surface classes), `vite.config.ts`, `postcss.config.mjs`, `package.json` (deps: Radix, lucide, recharts, sonner, motion, react-hook-form, input-otp, etc.).

### Official PDFs reviewed (`Docs/`)
Both were converted to text with `pdftotext -layout` and read in full.

| Filename | Pages | Major requirements extracted | Design expectations | Ambiguities | Verified? |
|---|---|---|---|---|---|
| **`Final SOP - Loan Disbursement V10 (1).pdf`** | 33 | Full SOP: intended users & team composition; **Approval Matrix** (≤₹5L → CFO+1, >₹5L or over-limit → CFO+2, exception register); 6 stages with steps; **eligibility (5 gates)**; **loan-limit = lower of shareholding & land** formulas; share valuation basis; active/inactive member rules; 7-point credit scrutiny; **related-party → GM approval (378ZK)**; documentation set (PoA, tri-party, SH-4/CDSL, term sheet, loan agreement, bank-verification letter, checklist); **checklist 4-signature ladder**; SAP customer-code creation; **disbursement two-step (Sr Mgr–Finance initiate → CFC authorise via RBL)**; repayment (direct/subsidiary), **principal-first**, **interest capitalisation @30 Apr**, DPD buckets, **default ladder (+3mo grace → assess → +1yr → non-recoverable → SH-4/cheque)**; NOC + return of SH-4/cheque on closure; **archive ≥8 yrs**; statutory compliance (s.378ZJ, **s.186 cap**, NBFC principal-business test, PMLA/KYC re-KYC **every 2 yrs**, stamp duty, money-lending, Ind AS/DPD, recovery conduct, data protection, record retention); borrower obligations (KYC/CKYC, declarations incl. **not a wilful defaulter / asset not encumbered**, agri evidence, **SH-4 + undated cheque + NACH/ECS mandate + guarantor**, ongoing duties); exception handling (**Top-10 errors**, dos/don'ts, escalation contacts). | A process-driven product with hard gates, registers, maker-checker, and role-scoped actions. Plain-language explanation to farmers expected at application stage. Fair-practice disclosure "in local language." | Loan-limit % is internally inconsistent — §2.2 formula says **"30% of valuation per share"** but §2.3 says **"10% of the share value … result of 10% of valuation is Rs. 200 per share."** TAT wording: §2 "2 days"; the WhatsLoan infographic adds Stage 3 "Immediate", Stage 5 "Same Day" (not in V10 prose). | Yes (full text). |
| **`SFPCL_Loan Sanction- Doc & Disbursement-SOP_WhatsLoan-25052026.pdf`** | 12 | The **visual / design-brief edition** of the same SOP: SFPCL stats (769 shareholders, 8,500+ members, 45,000 acres, 8 crops), 6-stage strip, **TAT cards (Stage 1–2: 2 days, Stage 3: Immediate, Stage 4: Document Prep, Stage 5: Same Day)**, loan-limit two-method panel ("**30% of Valuation per Share**" + "Current result: ₹200 per share (10% of valuation)"), approval matrix, Stage-3/4 checklists, Stage-5 6-step disbursement, signature meanings, default-handling flow, monitoring & closure, statutory framework table, **Top-10 errors with Critical/High/Medium chips**. | Strongly implies the *visual language* the UI should echo: stat tiles, stage strips, two-method calculator, signature ladder, default flow as a stepper, severity chips. The current UI matches this brief closely. | Same 30%/10% ambiguity, surfaced side-by-side on one page. "Bi-annual" KYC label here vs "every 2 years" re-KYC in V10 (these are different cadences — biannual=twice a year vs biennial=every 2 years). | Yes (full text). |

### Markdown / docs reviewed
`CLAUDE.md` (project map + Definition-of-Done claims), `README.md` (Figma origin), `ATTRIBUTIONS.md`, `guidelines/Guidelines.md` (empty template — only commented examples).

### Files that could not be read / are missing
- **`Docs/SFPCL_Design_Audit_and_Redesign_Plan.md`** and **`Docs/SFPCL_LoanPlatform_Figma_DesignBrief.md`** are **referenced by `CLAUDE.md` as the full audit and the documented design system, but do not exist in the repository** (confirmed: no `.md` files under `Docs/`). This is a documentation gap (`DA-030`). The two PDFs above are the only first-party requirement sources present.
- No design assets folder (Figma file is external, linked in `README.md`). `src/app/components/figma/ImageWithFallback.tsx` exists but only 2 `<img>` tags appear app-wide; the prototype is almost entirely SVG/emoji/icon-based, so no raster design assets were available to review.

---

## 3. Product and Prototype Understanding

**What the product is.** A members-only agri-credit administration portal for a Farmer Producer Company. It lets a member (farmer or FPC) request, track, and repay a loan, and lets four back-office teams + an admin move that loan through a compliance-heavy lifecycle with a complete audit trail. It is explicitly *not* a public lending product — Section 378ZJ restricts lending to members.

**Target users**
- **Borrower (farmer / FPC)** — `roleLabel: "Borrower"`. Rural, Marathi/Hindi-first, variable digital literacy. Wants money fast, clarity on status, and simple repayment.
- **Credit Assessment Team** (Credit Manager + Deputy Manager–Finance) — intake, appraisal note, register, DPD, invoices.
- **Compliance Team** (Company Secretary + officer) — legal docs, stamping, KYC, CDSL pledge, NOC, grievance.
- **Sanction Committee** (CFO + Directors) — 7-point scrutiny, approve/reject, signatures, special-case/GM handling.
- **Treasury** (CFC + Sr Manager–Finance) — SAP code, RBL disbursement (initiate→authorise), repayment posting.
- **Admin** — portfolio, users, audit, s.186 / NBFC monitors.

**Primary user goals / jobs-to-be-done**
- Farmer: *"Get a crop loan I'm eligible for, know exactly where it is, and pay it back without a trip to the office."*
- Credit: *"Triage applications, prove eligibility/limit, and hand a clean file to the committee within the 2-day TAT."*
- Compliance: *"Assemble a legally complete, stamped document set and never let funds move before it's signed."*
- Sanction: *"Apply the authority matrix and the 7 checks, sign in the right order, and record the decision in the register."*
- Treasury: *"Create the SAP code, verify against the cancelled cheque, and disburse with maker-checker."*
- Admin: *"Watch portfolio health and statutory limits (s.186, NBFC) and keep the audit trail."*

**Value proposition.** "₹0 Paper · Digital Approvals · Instant Disbursement" (login hero) — i.e., collapse a paper, multi-signatory, multi-register process into one auditable digital pipeline while staying SOP/statute-compliant.

**Expected user mental model.** *One loan, six stages, six hands.* The prototype's `LoanFile` (one object, role-gated tabs) and `Pipeline` (one board, six columns) are exactly the right metaphors for this model and are the strongest IA decisions in the codebase.

**What the product must make obvious to users.** Where a loan is in the 6 stages; what's blocking the next step and who must act (the gate pattern); the eligible limit and how it was computed; the authority required (₹5L threshold); and, for the farmer, what to pay and when.

**What the prototype must demonstrate (per the docs).** The full happy path *and* the gated/exception paths (over-limit, KYC-expired, default, related-party/GM, s.186 lock), because those gates are the SOP's entire reason for existing ("Top-10 errors to avoid"). The prototype implements all of these as components — but several are not reachable by clicking (see §6, §12).

**Where the implementation supports / fails this understanding.** *Supports:* stage tracker, gates, calculator, approval matrix, signature ladder, audit trail, role-scoped tabs. *Fails:* single hardcoded loan (no identity), code-gated state variants, English-only farmer body copy, no async/empty/feedback states.

---

## 4. Requirements Extracted From Official Docs

Types: **E** = Explicit requirement · **I** = Implied requirement · **A** = Design assumption · **Q** = Open question.
Status: ✅ Represented · 🟡 Partial · ❌ Missing · ⚪ N/A-to-prototype.

| Req ID | Requirement | Source | Type | Related prototype flow | Current UI status | Notes |
|---|---|---|---|---|---|---|
| R-01 | Members-only lending; verify membership before accepting application | V10 §378ZJ, Compliance Matrix "Pre-application" | E | Apply, Appraisal eligibility | ✅ | Eligibility gate "Active member of the FPC" in `LoanFile`/`ApplicationReview`. |
| R-02 | Loan Application Form signed by applicant **and nominee**; nominee not a minor | V10 Stage 1 / §1.1 | E | `LoanApplication` step 1 | ✅ | Nominee section + "nominee 18+" checkbox gates step 1→2. |
| R-03 | Unique reference number `LO00000001…` issued; entered in Loan Request Register | V10 Stage 1 | E | Apply success, registers | 🟡 | Success screen shows hardcoded `LO00000052`; IDs not coherent across screens (`DA-029`). |
| R-04 | Incomplete applications → Rejection Note (Annexure L) with deficiencies | V10 Stage 1/2.3 | E | Returned/Incomplete queue | 🟡 | "Returned / Incomplete" tab + `Incomplete` status exist; rejection-note compose screen not confirmed reachable. |
| R-05 | Appraisal Note within **2-day TAT** (Credit team) | V10 Stage 2 / brief TAT card | E | Credit dashboard / review | 🟡 | TAT referenced in copy ("within 2 working days"); no countdown/SLA indicator in queues (`DA-018`). |
| R-06 | Eligibility = 5 gates (active member, no default, docs, agrees to terms, agri purpose only) | V10 §2.1 | E | `LoanFile` Appraisal, `LoanApplication` | ✅ | 5 gates rendered verbatim. |
| R-07 | Loan limit = **lower of** shareholding (`shares × value/share`) and land (`acres × scale-of-finance`, cap ₹20k/acre) | V10 §2.2 / brief | E | `LoanApplication` step 2, `LoanCalculator`, `LoanFile` | ✅ | Two-method calculator computes `min()`. Uses ₹200/share value (the 10% result). |
| R-08 | Share-value % basis (10% vs 30%) and board approval to change it | V10 §2.2 vs §2.3 (conflict) | Q | Calculator labels | 🟡 | **Doc conflict**; UI shows the ₹200 *value* (safe) but any "% of valuation" label risks mislabeling (`DA-010`). |
| R-09 | Approval matrix: ≤₹5L → CFO + 1 Director; >₹5L or over-limit → CFO + 2 Directors + Exception Register | V10 §2.2 / brief | E | `LoanFile` Sanction, `ApprovalScreen` | ✅ | Authority chip + signature ladder switch on the ₹5L / over-limit test. |
| R-10 | 7-point credit scrutiny recorded in Credit Sanction Register | V10 Stage 3 | E | Sanction tab / register | ✅ | 7 checks listed; "recorded in Credit Sanction Register (Annexure K)" copy present. |
| R-11 | Related-party (director/relative) borrower → GM approval (378ZK); applicant-member excluded from own scrutiny | V10 §3.2 | E | Special Cases, `DirectorCaseBanner` | ✅ | `DirectorCaseBanner` (GM-required + access-excluded variants). Reachability of the special-case loan is code-gated. |
| R-12 | Document set: PoA (₹500, notarised), tri-party, SH-4 / CDSL pledge, term sheet, loan agreement, bank-verification letter, checklist | V10 §4 | E | `DocumentWorkspace`, `LoanFile` Documents | ✅ | All seven represented as doc tiles/tabs with states. |
| R-13 | Checklist carries **4 signatures** (CS, Credit Mgr, Sanction Committee, Sr Mgr–Finance) before disbursement | V10 §4.13 | E | `LoanFile` Disbursement gate, final sign-off | ✅ | Blocked gate states all four signatures + stamping required. |
| R-14 | Term sheet must disclose rate of interest, penalty interest, other charges, tenure, repayment date, security, dispute resolution (13 fields) | V10 §4.9 + Fair Practice Code | E | Term sheet doc / farmer disclosure | 🟡 | Term-sheet tile says "13 fields"; **no screen renders the actual rate/APR/penal-charge disclosure to the borrower** (`DA-008`). |
| R-15 | SAP customer code on first loan; reuse existing for repeat borrowers | V10 Stage 5 / §5.1 | E | Treasury SAP, `LoanFile` Disbursement | ✅ | "New code only on first loan; existing borrowers reuse Customer ID" copy + SAP tabs. |
| R-16 | Disbursement two-step: Sr Mgr–Finance initiates → CFC authorises; verify vs cancelled cheque; via RBL | V10 §5.3 | E | `DisbursementScreen`, `LoanFile` | ✅ | Two-step maker-checker + "shown side-by-side with cancelled cheque" copy. |
| R-17 | Repayment: direct (RTGS/NEFT) or via subsidiary deduction (tri-party); **partial → principal first**; SAP next working day | V10 §6.1 | E | `RepaymentScreen`, treasury incoming | ✅ | Both channels + "principal first" stated. |
| R-18 | Unpaid interest at **30 April** capitalised into principal; floating rate; rate-change intimation via SMS/email | V10 §6.1/§6.2 | E | Interest accruals, rate-change | 🟡 | Capitalisation explained in `LoanFile` Repayment copy; `shared-rate-change` utility exists; no farmer-facing rate-change/intimation screen confirmed (`DA-009`). |
| R-19 | DPD buckets reported to CFO quarterly; yearly interest invoices; monthly accruals | V10 §6.2 / matrix | E | DPD monitoring, treasury interest, admin | ✅ | DPD tabs + interest accruals + MIS present. |
| R-20 | Default ladder: miss → +3-mo grace → assess intent → +1-yr extension → non-recoverable → SC+Board → SH-4/cheque invocation | V10 §6.2 / brief | E | `LoanFile` Repayment, recovery, default escalations | ✅ | Five-step ladder rendered verbatim. |
| R-21 | On full repayment: NOC issued + SH-4 & blank cheque returned; **archive ≥8 years** | V10 §6.1 | E | NOC queue, security return, archive | ✅ | NOC queue, security-return log, "Records archived 8 years" copy. |
| R-22 | KYC/CKYC at onboarding; **re-KYC every 2 years**; preserve 5 yrs post-relationship | V10 KYC matrix / brief | E | `KYCManagement`, Re-KYC tab, farmer apply | ✅ | "Re-KYC Due" / "Re-KYC Overdue" statuses + 2-year copy. (Brief says "Bi-annual" — see `DA-031` terminology.) |
| R-23 | s.186 lending cap (60%/100% free reserves); board special resolution to exceed | V10 §s.186 | E | `admin-section186`, `S186LockBanner` | ✅ | Admin monitor + s.186 lock gate (sc/credit/farmer variants). |
| R-24 | NBFC principal-business test (financial assets/income >50%) monitored quarterly | V10 NBFC | E | `admin-nbfc` | ✅ | NBFC monitor screen present. |
| R-25 | Borrower declarations: not a wilful defaulter; consent to CKYC/bureau; asset not encumbered; declare purpose | V10 §Sec3 + Stage1 | E | `LoanApplication` step 4 declarations | ✅ | Three declarations match (wilful defaulter, CKYC/bureau, encumbrance). |
| R-26 | Borrower security obligations: SH-4 in blank; **undated cheque**; **NACH/ECS mandate**; **guarantor details if required** | V10 §Sec3 "Security documents" | E | Documents / apply | 🟡 | SH-4 + undated cheque ✅; **NACH/ECS mandate ❌** and **guarantor ❌** not represented (`DA-006`, `DA-007`). |
| R-27 | Disclose rate/charges in **local language**; explain requirements to farmers in simple language | V10 Fair Practice / §Sec3 | E | Whole farmer surface | 🟡 | i18n only translates nav labels; farmer body copy/forms stay English (`DA-005`). |
| R-28 | Grievance mechanism + complaint log (Annexure K/L); recovery conduct (no harassment), call/visit logs | V10 §Recovery / matrix | E | `SupportGrievance`, `cs-grievance` | ✅ | Support/grievance screen + grievance register tab. |
| R-29 | Maker-checker controls at every stage; checklists; escalate exceptions to CFO/Board | V10 Top-10 / dos&don'ts | E/I | Gates, signature ladders, exception register | ✅ | Maker-checker reflected in disbursement + sanction; exception register tab. |
| R-30 | Bank-verification letter / declaration **only if signature mismatch** | V10 §4.11 | E | Documents tab | ✅ | Doc tile "N/A — only if signature mismatch". (Conditional path not interactively triggerable.) |
| R-31 | TAT visualisation (Stage 1–2: 2d, Stage 3: Immediate, Stage 5: Same Day) | Brief TAT cards | I | Queues, dashboards | ❌ | Brief implies SLA cues; queues show no TAT/aging indicator (`DA-018`). |
| R-32 | Member self-service application via "company's loan application portal" (digital channel) | V10 Stage 1 | E | `LoanApplication` | ✅ | 5-step digital wizard is the centerpiece. |
| R-33 | Audit trail for record retention / inspections | V10 §record retention | E | `AuditTrailPanel`, admin audit | ✅ | Universal audit trail with farmer-safe redaction. |

---

## 5. Codebase-to-Prototype Mapping

| Area | Files / folders | User-facing purpose | Prototype relevance | Observations |
|---|---|---|---|---|
| **Routing / state** | `routes.tsx`, `App.tsx` | Picks which screen renders for the `?page=` key, gated by role | High — it *is* the navigation model | ~91 page keys; role-allow-list + utility pages; default page per role. No real routes/params → **no loan id ever travels** (`DA-001`). Unknown pages silently redirect to the role default (no 404/empty). |
| **Shell / chrome** | `layout/Shell.tsx`, `Header.tsx`, `Sidebar.tsx` | Frame, top bar (search, notifications, language, profile), per-role left nav | High | Focus-visible outline defined here (good). Heavy `!important` responsive overrides keyed off inline `font-size` strings (fragile but functional). Mobile (≤480px) turns the sidebar into a bottom bar. |
| **Design tokens** | `styles/theme.css` | The intended single source of color/spacing/type | High | ~190 CSS vars; one accent (`--brand-accent #1E88E5`). `@theme inline` maps to Tailwind. shadcn vars in oklch coexist with brand hex. |
| **Farmer surface styles** | `styles/globals.css` | Farmer-only panels/hero/inputs | Medium | Defines a **separate green palette** (`--farmer-green #16452F`) as raw hex + `font-weight:800` → diverges from brand tokens / 3-weight rule (`DA-016`, `DA-017`). |
| **State machine** | `lib/loanState.ts` | Canonical loan states, 6 stages, status→tone | High | `STAGES` is the single label source (re-exported as `loanStages`). `TONE_STYLES` are **hardcoded hex** duplicating tokens (`DA-019`); `STATUS_TONE` maps ~80 strings → 6 tones. |
| **Formatting** | `lib/format.ts` | ₹ currency / number grouping | High | Clean single source (`en-IN`). Good. |
| **Status / badges** | `shared/StatusBadge.tsx` | One pill for every status across the app | High | Tone-driven; carries the literal status word (not color-only). 11px / weight-500. |
| **Gates** | `shared/GateBanner.tsx` + `CrossRoleComponents` (`DirectorCaseBanner`, `S186LockBanner`) | "Blocked because X → do Y" SOP gates | High | The SOP's enforcement layer; well-built, token-based, `role="alert"` on blocked. |
| **Shared loan object** | `shared/LoanFile.tsx` | One loan, 7 role-gated tabs (6 stages + audit) | High | Excellent metaphor; but bound to a single import `appraisalLoan` — same loan for every entry (`DA-001`). |
| **Pipeline board** | `shared/Pipeline.tsx` | All loans by the 6 stages; click → loan file | High | 11 demo cards; every card `onNavigate('loan-file')` with no id (`DA-001`). Empty-column copy "No loans" is the one good built-in empty state. |
| **Dashboards** | `shared/RoleCommandCenter.tsx` + per-role `*Dashboard.tsx` | Single focus + metrics + quick actions | High | One command-center per back-office role (C2). Farmer dashboard is bespoke (hero + command grid). |
| **Trackers** | `shared/LoanTracker.tsx`, `CrossRoleComponents.UniversalStageTracker` | Visual 6-stage progress | High | Both source labels from `STAGES`/`loanStages` (C6 holds). Active vs other labels both weight-700 → weak hierarchy (`DA-026`). |
| **Tables / states** | `shared/TableStates.tsx` | `EmptyTableState`, `SkeletonRows`, `SortableHeader` | High | Built but **barely used** — empty (1×) and skeleton (1×) → `DA-011`, `DA-012`. |
| **Mega "Operations" hubs** | `credit/CreditOperations`, `compliance/ComplianceOperations`, `sanction/SanctionOperations`, `treasury/TreasuryOperations` | Tabbed register/portfolio hubs behind one nav door | Medium | Accepted exception in CLAUDE.md. They hide many sub-views as tabs (discoverability — `DA-020`). |
| **Auth / identity** | `context/AuthContext.tsx`, `auth/LoginPage.tsx` | Role-based mock login (OTP `123456` / password) | High | 5 role pills (no admin → `DA-003`); login language toggle is a dead control (`DA-004`); selected role → fixed mock user. |
| **i18n** | `context/LanguageContext.tsx` | EN / मराठी / हिंदी | High | Dictionary covers nav + ~5 app strings only; screen content untranslated (`DA-005`). |
| **Mock data** | `data/*.ts` | All content | High | Per-role files; `crossRoleData` holds audit trail + notifications; a single `appraisalLoan` powers the loan file. Reasonable realism, Indian names/IDs/₹. |
| **shadcn primitives** | `components/ui/*` | Buttons, inputs, dialogs, etc. | Medium | Mostly unused in favor of bespoke inline-styled controls; `sonner`/`drawer`/`form` present but not wired (`DA-013`). |

---

## 6. User Journey Audit

Severity: **Critical / High / Medium / Low / Polish**.

### 6.1 First impression (login)
- **User wants:** to understand what this is and get in.
- **UI communicates:** strong split-screen: role illustration + "₹0 Paper / Digital Approvals / Instant Disbursement" + role pills + OTP/password. Clear and credible.
- **Behavior:** select role → enter any 10-digit mobile → OTP `123456` → logs in as that role's fixed mock user.
- **Expectation vs reality:** good. But the **language toggle on login does nothing** (no `onClick`), so a Marathi-first farmer's first interaction is a dead control. **Admin** cannot be selected. — **Severity: Medium** (`DA-003`, `DA-004`).

### 6.2 Landing / entry point (dashboards)
- **Farmer:** time-based greeting, "Active & Good Standing" banner + active-loan hero + command grid + journey tracker + transactions + docs + alerts. Warm, well-prioritised.
- **Confusion risk:** two strong focal points stacked (standing banner *and* hero both about the same active loan); the **only reachable state is "active"** — a brand-new member with no loan, or one mid-application, can't be shown without editing code. — **Severity: High** (`DA-002`).
- **Back-office:** `RoleCommandCenter` gives one clear focus + metrics + secondary actions. Good.

### 6.3 Onboarding
- **No first-run / empty-account onboarding** for a member who has never applied (no "Welcome — start your first application" zero-state). The dashboard assumes an existing active loan. — **Severity: Medium** (`DA-002`, related `DA-011`).

### 6.4 Navigation / IA
- **Strength:** 5-item spine per role; `Pipeline` + `LoanFile` as shared objects.
- **Confusion risk:** many destinations (Grievances, Stamp Register, NOC queue, Calendar, Security Return) live as **tabs inside a "Registers & Operations" hub** with no nav signpost — recognition-over-recall failure for infrequent tasks. — **Severity: Medium** (`DA-020`).

### 6.5 Core task completion (apply for loan)
- **User wants:** to get an eligible loan request submitted.
- **UI:** 5-step wizard with sticky step rail, live eligible-limit calculator, doc checklist, declarations, and a final `GateBanner` summarising blockers. Genuinely good.
- **Confusion risk:** required `*` markers on DOB/address/gender/bank/IFSC/account are **not enforced** — only nominee-18+ blocks step 1, and final submit only checks amount/declarations/docs. A user can reach Review with an empty bank section. — **Severity: Medium** (`DA-014`).

### 6.6 Data input
- Inputs are clear and labelled, with monospace for numeric fields. **No input masks/format validation** for Aadhaar (12), PAN (ABCDE1234F), IFSC, mobile (beyond length). — **Severity: Low** (`DA-015`).

### 6.7 Review / confirmation
- Apply step 5 review with per-section "Edit" jumps + summary card + checklist + gate = a strong confirmation moment. Other roles' destructive/important actions (Approve, Reject, Disburse, Post-to-SAP) have **no confirmation dialog and no success toast**. — **Severity: Medium/High** (`DA-013`).

### 6.8 Error recovery
- Login OTP errors well-handled (shake + message + "use 123456"). Elsewhere there are no error states (no failed-load, no failed-submit, no network-error) — acceptable for a mock, but the prototype can't *show* recovery. — **Severity: Low** (`DA-012` adjacency).

### 6.9 Empty states
- Only `Pipeline` empty columns ("No loans") and the unused `EmptyTableState` exist. Lists are always populated. A reviewer never sees "no applications in queue", "no DPD overdue", "no grievances". — **Severity: Medium** (`DA-011`).

### 6.10 Loading states
- Essentially none (login fakes text "Sending…"; `SkeletonRows` unused). — **Severity: Medium** (`DA-012`).

### 6.11 Success states
- Apply success screen is excellent (check, reference, tracker, next steps). It's the *only* full success state; other completions are silent. — **Severity: Medium** (`DA-013`).

### 6.12 Returning-user experience
- Deep-linkable via `?page=`, but state resets on reload (no persistence) and always the same demo loan. Fine for a prototype; note it can't demonstrate "resume where I left off". — **Severity: Low**.

---

## 7. Slice-Based Prototype Audit

### Slice A — Authentication / Role Identification
- **User goal:** Get into the correct role workspace.
- **Files:** `auth/LoginPage.tsx`, `context/AuthContext.tsx`.
- **Current:** Role pills (5), OTP (`123456`) + password + 3-step reset; selected role → fixed mock user.
- **Expected (docs):** Internal staff + member access; member-facing should respect local language from first contact.
- **UI/UX issues:** dead login language toggle (`DA-004`); admin unreachable (`DA-003`); mobile entered but ignored.
- **Logic visible to users:** password login accepts any non-empty password; not a problem for a mock but unlabeled as "demo".
- **Missing states:** locked-account / too-many-attempts (optional for mock).
- **A11y:** OTP inputs keyboard-navigable; inputs have labels; `aria-pressed` on language buttons (header).
- **Recommended:** wire the login language buttons to `setLang`; add an Admin pill (or a clearly-labeled "Internal/Admin" entry); add a "Demo credentials" hint card.
- **Acceptance criteria:** (1) toggling language on login changes at least the login screen's own copy; (2) admin role is reachable from login; (3) all login controls either act or are removed.

### Slice B — Farmer Dashboard / Home
- **User goal:** See my loan, what to pay, and what to do next.
- **Files:** `farmer/FarmerDashboard.tsx`, `farmerData.ts`.
- **Current:** Active-loan hero, command grid, journey tracker, transactions, docs, alerts; plus code-gated `under-processing` / `kycExpired` / `hasActiveDefault` variants.
- **Expected:** Demonstrate all member states (no loan, processing, active, overdue, blocked).
- **UI/UX issues:** only "active" reachable (`DA-002`); two stacked focal points for the same loan.
- **Missing states:** "no loan yet" zero-state (`DA-011`); reachable overdue/blocked.
- **A11y:** hero is `role=button` + keyboard handler (good); transaction `<tr onClick>` not keyboard-accessible (`DA-025`).
- **Recommended:** add a state switcher (demo control) or seed multiple loans; add a no-loan onboarding card.
- **Acceptance:** a reviewer can reach processing / overdue / blocked / no-loan states by clicking only.

### Slice C — Apply / Main Creation Flow
- **User goal:** Submit an eligible application.
- **Files:** `farmer/LoanApplication.tsx`, `farmerData.ts`.
- **Current:** 5-step wizard, calculator, checklist, declarations, submit gate, success screen.
- **Expected:** Capture Annexure-A data; enforce limit, agri-purpose, nominee, docs, declarations; explain in simple/local language.
- **UI/UX issues:** unenforced `*` fields (`DA-014`); no masks (`DA-015`); English-only (`DA-005`); hardcoded reference id (`DA-029`).
- **Missing:** NACH/ECS mandate + guarantor capture (`DA-006`, `DA-007`).
- **A11y:** good labels; upload zones are real `<button>`s.
- **Recommended:** gate each step on its own required fields; add format validation; localise; add NACH/guarantor where SOP requires.
- **Acceptance:** cannot advance past a step with empty required fields; submit reference matches the sequence shown elsewhere.

### Slice D — Pipeline / Loan File (Review & Detail)
- **User goal:** Open *a specific* loan and work my stage.
- **Files:** `shared/Pipeline.tsx`, `shared/LoanFile.tsx`, `creditData.ts`.
- **Current:** Board → click card → loan file with role-gated tabs + gates + signature ladder.
- **Expected:** Each card opens its own loan.
- **UI/UX issues:** **all cards open the same loan** (`DA-001`); appraisal checkboxes are `defaultChecked disabled` (don't drive state).
- **A11y:** cards are buttons; tabs via `WorkbenchTabs`.
- **Recommended:** key the loan file off the clicked id from a small mock store.
- **Acceptance:** opening two different cards shows two different borrowers/amounts/stages.

### Slice E — Approval / Submission Flow (Sanction + Disbursement)
- **User goal:** Apply authority matrix, sign in order, disburse with maker-checker.
- **Files:** `sanction/ApprovalScreen.tsx`, `treasury/DisbursementScreen.tsx`, `LoanFile` tabs.
- **Current:** 7-point scrutiny, signature ladder, ₹5L authority switch, disbursement blocked-gate + two-step.
- **UI/UX issues:** Approve/Reject/Authorise produce no confirmation/toast and don't visibly advance the shared object (`DA-013`).
- **A11y:** action buttons labeled.
- **Recommended:** add confirm dialog for irreversible actions + success toast + advance the loan's stage in the mock store.
- **Acceptance:** approving a loan shows a confirmation, a toast, and moves it to the next pipeline column.

### Slice F — Documentation & Compliance
- **Files:** `compliance/DocumentWorkspace.tsx` (727 lines), `KYCManagement.tsx`, `ComplianceOperations.tsx`.
- **Current:** Doc tabs (PoA/tri-party/SH-4/CDSL/term-sheet/agreement), KYC + re-KYC, NOC, calendar, stamp, grievance, registers.
- **Issues:** Term-sheet does not surface the actual rate/penal-charge disclosure to the borrower (`DA-008`); NACH/ECS + guarantor missing (`DA-006`/`DA-007`).
- **Recommended:** add a borrower-readable Term Sheet / Key Facts screen (localised).

### Slice G — Repayment & Monitoring
- **Files:** `farmer/RepaymentScreen.tsx`, treasury incoming/interest, credit DPD/defaults.
- **Current:** direct/subsidiary repayment, DPD buckets, default ladder, interest accruals.
- **Issues:** interest-capitalisation @30-Apr only as descriptive copy (`DA-009`); no SLA/aging cues (`DA-018`).

### Slice H — Settings / Admin / Governance
- **Files:** `admin/AdminScreens.tsx` (649 lines): portfolio, users, audit, config, s.186, NBFC, integration hub.
- **Issue:** entire role unreachable from login (`DA-003`).

### Slice I — Error & Edge Cases
- Over-limit, KYC-expired, default, related-party/GM, s.186 lock are all built as gates but most are **code-gated** rather than clickable (`DA-001`/`DA-002`).

### Slice J — Empty States · Slice K — Loading States · Slice L — Confirmation/Feedback
- See `DA-011`, `DA-012`, `DA-013`.

### Slice M — Mobile Responsiveness
- Shell has thoughtful breakpoints incl. bottom-nav at ≤480px. Children/tabs collapse; hub tab strips may overflow on small screens (verify) — `DA-021`.

### Slice N — Accessibility
- See §11 and `DA-022`, `DA-023`, `DA-025`.

### Slice O — Visual Design System
- One accent, disciplined tokens; farmer surface diverges (`DA-016`, `DA-017`); status tones hardcoded (`DA-019`).

### Slice P — Content & Microcopy
- Acronym density, English-only farmer copy, role-title alignment, id coherence — see §13.

---

## 8. UI/UX Heuristic Review (Nielsen + WCAG + design-system)

| Heuristic | Works | Doesn't work | Evidence | Prototype impact | Recommendation |
|---|---|---|---|---|---|
| **Visibility of system status** | Stage trackers; "Current" pill; gate banners | No toasts/confirmations on actions; no loading; only "active" dashboard state | `sonner` unused (0 uses); `SkeletonRows` 1 use; `FarmerDashboard` hardcoded `loanState` | Actions feel inert; reviewer can't see progress/feedback | Wire `sonner`; add skeletons; make states reachable (`DA-013`,`DA-012`,`DA-002`) |
| **Match system ↔ real world** | SOP terms used (PoA, SH-4, CDSL, DPD, NOC, tri-party); Indian ₹ grouping | Acronym-heavy for farmers; no glossary/tooltips on farmer surface | `LoanFile`, `DocumentWorkspace` | Farmers may not parse "PoA"/"CDSL pledge" | Add plain-language tooltips/glossary on farmer screens (`DA-027`) |
| **User control & freedom** | Wizard back/edit; "Change number"; reset flow | No undo/confirm on Approve/Reject/Disburse | `LoanFile` Sanction, `DisbursementScreen` | Risky one-click irreversible actions | Add confirm dialogs (`DA-013`) |
| **Consistency & standards** | One `StatusBadge`, one `GateBanner`, one tracker, one accent | Farmer green palette + weight-800 diverge; status tones hardcoded | `globals.css` (4× weight-800, 19 hex lines), `loanState.ts` `TONE_STYLES` | Two subtly different visual languages | Fold farmer palette into tokens; reference tokens in tones (`DA-016`/`DA-017`/`DA-019`) |
| **Error prevention** | Apply submit gate; nominee-18+ gate; over-limit warning | Required fields unenforced; no input masks | `LoanApplication` (only nominee gates step 1) | "Submitted" data could be empty/garbage | Per-step validation + masks (`DA-014`/`DA-015`) |
| **Recognition over recall** | Command center + search; visible 6-stage model | Key tasks hidden as tabs inside hubs | `Sidebar` (5 doors), Operations hubs | Infrequent tasks hard to find | Surface/searchable hub tabs; add a "more" overflow (`DA-020`) |
| **Flexibility / efficiency** | Global search; deep-linkable `?page=`; keyboard OTP | No bulk actions; no saved filters (mock) | `Header` search | Minor for prototype | Optional |
| **Aesthetic / minimalist** | Clean, calm, single-focus dashboards | Some dense back-office tables | Operations hubs | Acceptable | Maintain density discipline |
| **Help users recover from errors** | OTP error messaging | No failed-load/submit states | Login only | Can't show recovery | Add at least one failed-state demo (`DA-012`) |
| **Help & documentation** | SOP references in copy; gate "do Y" guidance | No in-app help/glossary for farmers | — | Farmer comprehension | Add contextual help (`DA-027`) |
| **Accessibility (WCAG)** | Focus-visible outline; many `aria-label`s; status word not color-only | Low-contrast secondary text; `<tr onClick>` not keyboard-reachable; 11px badges | `--neutral-400` body copy; dashboard table rows | AA failures, esp. for rural/low-vision users | Fix contrast, make rows buttons, bump small text (`DA-022`/`DA-023`/`DA-025`) |

---

## 9. Visual Design Audit

- **Layout.** Consistent Shell (56px header, 240/64px sidebar, titlebar, padded content). Grid-based dashboards. Strong. Apply wizard uses a sticky step rail + content (`farmer-grid-shell`) that collapses at 1024px — good.
- **Spacing.** Generally consistent (Tailwind scale + token radii). Cards `rounded-xl/2xl`, 16–28px paddings.
- **Typography.** Inter + Roboto Mono (numbers) + Noto Sans Devanagari (declared). Base 16px. **Weights:** intended {400,500,700}, but `globals.css` farmer classes use **800** (`.farmer-kicker`, `.farmer-value`, `.farmer-action`, `.farmer-action-secondary`) — `DA-017`. Stage labels render active *and* inactive at weight-700 (redundant ternary `active ? 700 : 700`) → weak current-stage emphasis in `UniversalStageTracker` (`DA-026`).
- **Color.** One accent (`#1E88E5`) ✅. But the **farmer surface defines its own greens** (`--farmer-green #16452F`, `--farmer-green-2 #286C4B`, `--farmer-blue #1E6CEB`, `--farmer-amber #D97706`) as raw hex, distinct from `--brand-primary #1A3C2A` / `--brand-secondary #2D7A4F` — two green systems (`DA-016`).
- **Contrast.** `--neutral-400 #9EA8B3` (~2.6:1 on white) and `--neutral-500 #6B7280` used heavily for helper/meta/secondary text → below AA 4.5:1 for small text (`DA-022`). Status-badge tone pairs mostly pass, but 11px size is small for the audience (`DA-023`).
- **Iconography.** lucide-react, consistent sizing (14–20px). Login uses emoji in role pills (acceptable, but emoji-as-iconography is inconsistent with the lucide set).
- **Component consistency.** High where shared components are used. The back-office "Operations" hubs and bespoke inline-styled controls duplicate patterns shadcn `ui/*` already provides (e.g., custom buttons/inputs vs `ui/button`/`ui/input`).
- **Density / hierarchy.** Dashboards balanced; some registers dense (acceptable). CTA hierarchy generally clear (filled primary vs outline secondary), matching the `Guidelines.md` button intent.
- **Responsive behavior.** Real breakpoints (1024/768/480) with bottom-nav on mobile — strong for a prototype, but implemented via brittle `!important` selectors keyed off inline `font-size` strings (maintenance risk; engineering note §15).
- **Polish.** Above average. Confetti dependency present (`canvas-confetti`) but success screens don't use it — possible delight opportunity.

---

## 10. Interaction Design Audit

- **Click/tap targets.** Mostly ≥40px (`height:44/46px` nav, buttons). Some 36px inline table inputs and 14px chevrons are small but within reason.
- **Hover states.** Consistent (`clickable-row`, `clickable-card`, `hover:bg-*`). Good affordance.
- **Focus states.** Global `:focus-visible` 3px brand outline (Shell) — solid baseline; verify it isn't clipped by `overflow-hidden` containers.
- **Form behavior.** Controlled inputs in apply wizard; live calculator recompute. Other forms are largely visual.
- **Validation behavior.** Apply final-gate only; per-step/required enforcement missing (`DA-014`).
- **Loading behavior.** Fake text spinners on login only; no skeletons (`DA-012`).
- **Modal/dialog behavior.** `AppModal` + Radix dialogs available; no confirmation dialogs wired to risky actions (`DA-013`).
- **Navigation behavior.** `pushState` + popstate handling; deep-linkable; unknown page → silent redirect to role default (no 404).
- **Transitions/animations.** Tasteful (fade-in dropdowns, OTP shake, sidebar width). `motion` installed; reduced-motion not respected (`DA-024`).
- **Disabled states.** Apply submit and step-1 next disable correctly with `cursor:not-allowed`; good.
- **Undo/cancel.** Wizard "Previous/Back"; reset "Back"; but no cancel/confirm on Approve/Reject/Disburse (`DA-013`).
- **Keyboard accessibility.** OTP auto-advance/backspace handled; dashboards' `<tr onClick>` rows are not keyboard-operable (`DA-025`).
- **Mobile interactions.** Bottom-nav + horizontal scroll tables; verify hub tab strips don't overflow awkwardly (`DA-021`).

---

## 11. Accessibility Audit

| Area | Finding | Severity |
|---|---|---|
| Semantic HTML | Good use of `<button>`, `<aside>`, `<header>`, `<main>`, `<table>`; but several **clickable `<tr>`** (dashboard transactions/docs lists in tables) rely on `onClick` without `role`/`tabIndex`/key handlers | High (`DA-025`) |
| Keyboard nav | OTP, nav, dropdowns operable; farmer hero is `role=button` + Enter/Space; clickable table rows are not | High (`DA-025`) |
| Focus visibility | Global 3px `:focus-visible` outline (Shell) — good baseline | OK |
| ARIA usage | `aria-label` (21), `aria-current`, `aria-expanded`, `aria-pressed`, `role="alert"` on blocked gates — reasonable | OK |
| **Color contrast** | `--neutral-400`/`--neutral-500` secondary text on white fails AA 4.5:1; pervasive in helper/meta copy | **High** (`DA-022`) |
| Text size | Status badges 11px; many meta texts 11–12px — small for an older rural audience | Medium (`DA-023`) |
| Form labels | Apply wizard fields labelled; placeholders not used as labels — good | OK |
| Error messaging | Present on login OTP/amount; absent elsewhere | Medium |
| Screen-reader clarity | Devanagari nav labels rendered without a matching `lang` attribute; audit-trail tables lack captions/scope | Medium (`DA-024`) |
| Reduced motion | `motion` + CSS animations not gated by `prefers-reduced-motion` | Low/Medium (`DA-024`) |
| Touch targets | Mostly ≥40px; a few 36px inline controls | Low |

> Issues that can **block** users with disabilities (`DA-022` contrast, `DA-025` non-keyboard rows) are flagged **High / P1**.

---

## 12. User-Visible Logic and Flow Audit

- **Detail navigation is an illusion.** `Pipeline` cards and dashboard rows route to `loan-file`/sub-screens **without an id**; `LoanFile` always renders `appraisalLoan`. Confirmed: **0 screens read a loan id** (`grep loanId|params.id|searchParams.get('id')` → 0). The UI *implies* multi-loan navigation it doesn't perform (`DA-001`).
- **State variants are compile-time constants.** `FarmerDashboard` sets `loanState='active'`, `kycExpired=false`, `hasActiveDefault=false` inline; the comments literally say "Change to … to preview". A user cannot reach processing/blocked/default states (`DA-002`). Same single-demo limitation across gates (`DirectorCaseBanner`, `S186LockBanner`).
- **Approve/Reject/Disburse don't mutate the shared object.** They lack feedback and don't advance the loan's stage; the pipeline doesn't reflect decisions (`DA-013` + `DA-001`).
- **Required-field logic is cosmetic** in the apply wizard except for amount/declarations/docs at the end (`DA-014`).
- **Doc conflict surfaced in UI math.** The 10%-vs-30% share-value basis (V10 §2.2 vs §2.3) is unresolved in the docs; the UI sidesteps it by using the ₹200 *value*, but any "% of valuation" label must be reconciled (`DA-010`, Open Q).
- **Terminology cadence bug risk.** Brief says KYC "Bi-annual"; V10 says re-KYC "every 2 years" — opposite cadences; UI uses "every 2 years" (correct) but the source ambiguity should be recorded (`DA-031`).
- **Missing borrower-obligation capture:** NACH/ECS mandate and guarantor are explicit SOP security obligations not represented (`DA-006`, `DA-007`).
- **No SLA/aging surfacing** despite explicit TATs (2 days / immediate / same day) (`DA-018`).
- **Unknown route → silent role-default redirect** (no 404/empty), so a bad deep link disorients without explanation (minor; engineering-adjacent).

---

## 13. Content and Microcopy Audit

- **Clarity / tone.** Generally clear, action-oriented, SOP-anchored (gate banners explicitly state the rule + the fix — excellent). Farmer copy is warm ("What you can do now", "Pay instalment").
- **Acronyms.** Heavy and unexplained on farmer-facing screens: PoA, SH-4, CDSL, DPD, SAP, NOC, CFC, OVD, CKYC. Internal roles are fine; farmers need expansion/tooltips (`DA-027`).
- **Language.** Farmer surface is English-only in body/forms/status even after switching to मराठी/हिंदी (`DA-005`); contradicts the Fair Practice "local language" requirement (R-27).
- **Button labels.** Mostly task-specific ("Submit Application", "Pay instalment", "Open disbursement flow"). Login "Login →" / "Verify & Login" fine.
- **Page titles.** `pageTitles` map exists but partial; many screens pass ad-hoc titles. Acceptable.
- **Empty-state copy.** Only `Pipeline` "No loans" and the unused `EmptyTableState` default copy — under-used (`DA-011`).
- **Confirmation messages.** Apply success is strong; elsewhere none (`DA-013`).
- **Terminology alignment with docs.** Mostly aligned; minor: treasury mock user labelled "Finance Manager" while SOP treasury = CFC + Sr Manager–Finance; consider exact SOP titles for realism (`DA-028`).
- **Reference-id coherence.** Apply success hardcodes `LO00000052`; pipeline uses `LO000000XX`; farmer loan uses others — not a single coherent sequence (`DA-029`).
- **Demo affordances.** "use 123456 for demo" shown (good). Password login silently accepts anything (should be labelled demo).

---

## 14. Prototype-Focused Issue Ledger

> Owner placeholders: **DES** (design) · **CONTENT** (UX writing) · **PROTO** (prototype engineering) · **PO** (product owner) · **A11Y**.
> All issues pass the scope test in the header. Sort/triage in §16.

| ID | Status | Sev | Pri | Slice | Issue | Prototype impact | User impact | Evidence | Recommendation | Acceptance criteria | Deps | Owner | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| DA-001 | Done | High | P1 | D/I | List/board detail navigation carries no loan identity — every card/row opens the same hardcoded loan | The prototype can only ever show one loan; can't demonstrate the multi-loan reality the whole IA promises | Reviewers/stakeholders see "click any loan → same data", undermining trust in the demo | `Pipeline.tsx:71` `onNavigate('loan-file')`; `LoanFile.tsx:42` `const loan = appraisalLoan`; grep `loanId/params.id` = 0 | Add a small mock loan store keyed by id; pass id via `?page=loan-file&id=` (or a click handler); `LoanFile` selects by id | Opening two different cards shows two different borrowers/amounts/stages | — | PROTO+DES | Highest-leverage fix |
| DA-002 | Done | High | P1 | B/I | Alternative farmer states (processing, KYC-blocked, active-default, no-loan) are compile-time `const`s, not reachable by clicking | The most instructive states (gates) are invisible in a live walkthrough | A new/blocked member's experience can't be shown or tested | `FarmerDashboard.tsx:29-33` (`loanState`, `kycExpired`, `hasActiveDefault` hardcoded) | Add a demo state switcher (or seed multiple loans) so each state is reachable in-UI | All four states reachable by clicking only; no code edit needed | DA-001 | PROTO+DES | Comments invite "change to preview" |
| DA-003 | Done | Medium | P2 | A/H | Admin role implemented (`AdminScreens`, admin nav) but has **no login entry point** | Whole admin slice undemonstrable from the running app | Evaluators can't reach portfolio/audit/s.186/NBFC monitors | `LoginPage.tsx:6-12` `rolePills` omits admin; `AuthContext` has admin user | Add an Admin pill (or labelled "Internal/Admin" access) | Admin workspace reachable from login | — | PROTO | — |
| DA-004 | Done | Medium | P2 | A | Login language toggle (English/मराठी/हिंदी) buttons have no `onClick` — dead control | First interaction for a Marathi/Hindi farmer is a non-functional control | Erodes trust; implies localisation that isn't wired here | `LoginPage.tsx:217-223` (buttons, no handler) | Wire to `setLang` (or remove until localisation lands) | Toggling language on login changes at least the login screen copy | DA-005 | PROTO | Header toggle works; login doesn't |
| DA-005 | Done | High | P1 | A–G | Trilingual support is nav-deep only; all screen body/forms/status stay English on language switch | Can't demonstrate the localised farmer experience the SOP requires | Marathi/Hindi-first farmers can't read forms, statuses, disclosures | `LanguageContext.tsx:11-105` (dictionary = nav + ~5 app strings); all screen literals are English | Scope localisation: at minimum apply flow + status + key-facts/disclosure; route copy through `t()` | Switching language localises the farmer apply flow + status end-to-end | — | CONTENT+PROTO+PO | Maps to R-27 / Fair Practice |
| DA-006 | Done | Medium | P2 | C/F | NACH/ECS mandate (explicit borrower security obligation) is not represented anywhere | Prototype omits a required document/step in the lifecycle | Farmers/compliance can't see/sign the auto-debit mandate | SOP V10 §Sec3 "Security documents … sign NACH/ECS mandate"; absent in `LoanApplication`/`DocumentWorkspace` | Add NACH/ECS mandate to the documents set + apply security step | NACH/ECS mandate appears as a doc/step with a state | — | DES+PO | R-26 |
| DA-007 | Done | Low | P2 | C/F | Guarantor capture ("provide guarantor details if required") not represented | Conditional SOP path missing | Cases needing a guarantor can't be modeled | SOP V10 §Sec3 "guarantor details if required" | Add optional guarantor block (conditional) | Guarantor fields appear when toggled "required" | — | DES+PO | R-26 |
| DA-008 | Done | Medium | P1 | F | No borrower-readable disclosure of interest rate / APR / penal charges (Term Sheet is a tile, not a screen) | Prototype can't show the compliance-critical disclosure moment | Farmers don't see the rate/penal terms they're agreeing to | `LoanFile.tsx:273` term-sheet tile "13 fields"; no rate/APR screen; SOP §4.9 + Fair Practice | Add a "Key Facts / Term Sheet" screen showing rate, penal interest, charges, tenure, repayment date (localised) | A farmer can open and read rate + penal-charge disclosure before accepting | DA-005 | DES+CONTENT+PO | R-14 |
| DA-009 | Done | Low | P2 | G | Interest capitalisation @30-Apr only as descriptive copy; no invoice/capitalisation moment | Can't demonstrate the year-end interest event | Farmers won't understand why principal grew | `LoanFile.tsx:319` copy; treasury interest tab exists | Add an interest-invoice / capitalisation summary view | Capitalisation event shown with before/after principal | — | DES | R-18 |
| DA-010 | Done | Medium | P2 | C | Share-value basis is ambiguous in the SOP (10% vs 30%); ensure no UI label mis-states the % | A wrong % label would mis-teach the eligibility math | Wrong limit understanding; potential disputes | V10 §2.2 ("30% of valuation per share") vs §2.3 ("10% … ₹200/share"); brief shows both | Confirm correct basis with PO; show the *value* (₹200) + a footnote, avoid bare "% of valuation" | All limit screens use the confirmed basis consistently with a clarifying note | Q (see §17) | PO+DES | R-08 |
| DA-011 | Done | Medium | P2 | J | Reachable empty states almost absent (`EmptyTableState` used once; lists always populated) | Can't show "nothing here yet" — a core prototype state | New users/teams see fabricated rows, not realistic empties | grep `EmptyTableState` = 1 use; `TableStates.tsx` defines it | Wire `EmptyTableState` into queues/registers; add a no-loan farmer zero-state | At least 3 lists show a real, copy-rich empty state | DA-002 | PROTO+CONTENT | Component already exists |
| DA-012 | Done | Medium | P2 | K | Loading/skeleton states essentially absent (`SkeletonRows`/`animate-pulse` 1 use) | Can't show async/perceived-performance behavior | No "system is working" cue on data-heavy screens | grep skeleton/animate-pulse = 1 non-ui use | Use `SkeletonRows` on first paint of tables/dashboards (simulated delay) | Tables show skeletons on (simulated) load | — | PROTO | Component exists |
| DA-013 | Done | High | P1 | E/L | No confirmation/toast feedback for state-changing actions (`sonner` installed, 0 uses) | Actions feel inert; "visibility of system status" fails | Users unsure whether Approve/Submit/Post worked | grep `sonner/toast/Toaster` in features = 0; `ui/sonner.tsx` present | Add confirm dialog for irreversible actions + success toast; advance loan stage | Approve/Reject/Disburse show confirm + toast and update the pipeline | DA-001 | PROTO+DES | Big perceived-quality win |
| DA-014 | Done | Medium | P2 | C | Apply wizard required `*` fields are unenforced (only nominee-18+ gates step 1; final gate checks amount/declarations/docs) | Prototype implies validation it doesn't perform | Users reach Review with empty bank/personal data | `LoanApplication.tsx` (`canSubmitApplication` only; step nav not gated) | Gate each step on its required fields; show inline errors | Cannot advance past a step with empty required fields | — | PROTO+DES | — |
| DA-015 | Done | Low | P2 | C | No input masks/format validation (Aadhaar 12, PAN ABCDE1234F, IFSC, mobile) | Data-entry realism/affordance missing | Farmers get no help formatting IDs | `LoanApplication.tsx` (placeholders only) | Add masks/format hints + inline validity | Invalid PAN/Aadhaar/IFSC shows inline format error | DA-014 | PROTO | — |
| DA-016 | Done | Medium | P2 | O | Farmer surface uses a separate green palette as raw hex (`--farmer-green #16452F`, etc.), diverging from brand tokens | Two visual languages; "one design language" partially unmet | Subtle inconsistency between farmer and back-office | `globals.css:1-11` (`--farmer-*`); vs `theme.css:8-9` brand greens | Map farmer vars to theme tokens (or add official farmer tokens to `theme.css`) | Farmer greens reference `theme.css` tokens; no standalone hex | — | DES | — |
| DA-017 | Done | Low | P3 | O | `font-weight:800` used in 4 farmer classes — contradicts the stated 3-weight system {400,500,700} | Breaks the documented type scale (DoD C3) | Heavier-than-intended farmer headings | `globals.css:39,47,62,81` | Replace 800 → 700 | grep weight 800/900 in styles = 0 | — | DES | DoD criterion |
| DA-018 | Done | Medium | P2 | G | TATs (2d / immediate / same-day) not surfaced as SLA/aging cues in queues | Can't demonstrate the time-pressure the SOP centers on | Teams can't see what's breaching/aging | Brief TAT cards; no countdown in `ApplicationQueue`/dashboards | Add aging/SLA chips (e.g., "Day 1 of 2", "Overdue TAT") | At least the credit intake queue shows TAT/aging per row | DA-001 | DES+PROTO | R-05/R-31 |
| DA-019 | Done | Low | P3 | O | Status tones are hardcoded hex in `loanState.ts` (`TONE_STYLES`) duplicating theme tokens | Theme-token changes won't propagate to badges | Inconsistent if tokens are re-themed | `loanState.ts:37-44` literal hex | Reference `var(--success-100)`… in tone styles (or generate from tokens) | Changing a status token re-colors the matching badge | — | DES+PROTO | Single-source-of-truth |
| DA-020 | Done | Medium | P2 | Navigation | Frequent tasks (Grievances, Stamp/NOC, Calendar, Security Return) hidden as tabs inside hubs with no nav signpost | Discoverability suffers; recognition-over-recall fails | Users hunt for infrequent tasks | `Sidebar.tsx` (5 doors); `roleNav.ts` tab arrays; Operations hubs | Make hub tabs searchable (already partly in Header search) + add a "Jump to" list on hub landing | Each hub tab is reachable via search and listed on the hub landing | — | DES | Tension with 5-door DoD |
| DA-021 | Done | Low | P2 | M | Hub tab strips may overflow on small screens; verify mobile tab usability | Mobile demo may look broken | Mobile users can't reach some tabs | `WorkbenchTabs`, Operations hubs; Shell ≤480px bottom-nav | Verify + add horizontal-scroll/overflow menu for tabs on mobile | Tabs scroll/menu cleanly at 375px width | — | DES+PROTO | Verify in preview |
| DA-022 | Done | High | P1 | N | Secondary/helper text uses low-contrast `--neutral-400` (~2.6:1) / `--neutral-500` on white — fails WCAG AA | Accessibility blocker for low-vision/rural users | Hard-to-read meta/help copy throughout | `theme.css:16,46`; pervasive in dashboards/cards | Darken secondary text to ≥4.5:1 (e.g., use `--neutral-700`/`--neutral-550`) | All small body/helper text meets AA 4.5:1 | — | A11Y+DES | High priority |
| DA-023 | Done | Medium | P2 | N | Status badges/meta at 11px are small for an older rural audience | Legibility risk on the most-scanned elements | Farmers strain to read status | `StatusBadge.tsx` (11px), many 11–12px metas | Bump badge text to ≥12px; ensure min body 13px on farmer surface | Status text ≥12px; farmer body ≥13px | — | DES | — |
| DA-024 | Done | Low | P2 | N | No `lang` attribute switch with language; animations ignore `prefers-reduced-motion` | SR mispronunciation; motion discomfort | A11y polish | `LanguageContext` (no `document.lang`); CSS keyframes not gated | Set `lang` on `<html>` per language; gate animations behind reduced-motion | `lang` updates on switch; motion respects the media query | DA-005 | A11Y+PROTO | — |
| DA-025 | Done | High | P1 | N | Clickable table rows use `<tr onClick>` without `role`/`tabIndex`/key handler — not keyboard-operable | Keyboard users can't open rows | A11y blocker on lists | `FarmerDashboard.tsx:252` (`<tr className=clickable-row onClick>`) and similar | Make rows real buttons/links or add `role=button tabIndex=0 onKeyDown` | Every clickable row is reachable + activatable by keyboard | — | A11Y+PROTO | — |
| DA-026 | Done | Polish | P3 | O | Stage labels render current and non-current at the same weight (`active ? 700 : 700`) | Weak visual hierarchy for "where am I" | Current stage under-emphasised | `CrossRoleComponents.tsx:25` | Make non-active labels 500, active 700 | Current stage label is visibly heavier | — | DES | Trivial |
| DA-027 | Done | Medium | P2 | P | Farmer-facing acronyms (PoA, SH-4, CDSL, DPD, NOC, CFC) unexplained | Comprehension barrier for the primary external user | Farmers can't follow their own loan | `LoanFile`, `DocumentWorkspace`, farmer screens | Add tooltips/glossary + plain-language expansions on farmer surface | Each acronym on a farmer screen has an on-hover/tap expansion | DA-005 | CONTENT+DES | — |
| DA-028 | Done | Low | P3 | P | Mock role titles not fully aligned to SOP (e.g., treasury "Finance Manager" vs CFC + Sr Manager–Finance) | Minor realism gap | Confuses domain reviewers | `AuthContext.tsx:64-71`; SOP §1.2 team composition | Use exact SOP titles in mock users/labels | Role labels match SOP team composition | — | CONTENT | — |
| DA-029 | Done | Low | P3 | C | Reference-id sequence incoherent across screens (apply success hardcodes `LO00000052`) | Breaks the "one sequential register" story | Reviewers notice mismatched ids | `LoanApplication.tsx:92`; `Pipeline.tsx` ids; `farmerData` ids | Derive a coherent id sequence from the mock store | Submitted id continues the visible register sequence | DA-001 | PROTO | — |
| DA-030 | Done | Low | P3 | Docs | `CLAUDE.md` references two design docs (`SFPCL_Design_Audit_and_Redesign_Plan.md`, `..._Figma_DesignBrief.md`) that don't exist in the repo | Auditors/devs can't find the cited source-of-truth design docs | Onboarding friction; stale guidance | `CLAUDE.md` intro + "Where things live"; `find Docs -name '*.md'` = none | Either add the docs or update `CLAUDE.md` to point at the PDFs + this ledger | Every doc referenced by `CLAUDE.md` exists or is corrected | — | PO | This ledger can be one of them |
| DA-031 | Done | Low | P3 | P | Source ambiguity: brief says KYC "Bi-annual"; V10 says re-KYC "every 2 years" (opposite cadences) | Risk of mislabeling re-KYC cadence in UI | Wrong renewal expectations | Brief p.statutory table vs V10 KYC matrix; UI uses "every 2 years" | Confirm cadence with PO; keep "every 2 years"; fix any "bi-annual" labels | All KYC cadence copy says the confirmed cadence | Q (§17) | PO+CONTENT | UI currently correct |

---

## 14.1 Resolution Log — execution pass (2026-06-17)

All 31 issues resolved in one autonomous pass. Build gate `npx vite build` stayed green throughout; the running app was smoke-tested in the browser preview (no console errors). Where an issue is "Done (scoped)", the caveat is stated. A companion `Docs/DESIGN_AUDIT_IMPLEMENTATION_LOG.md` holds the chronological log. Key infra fix during the pass: added `resolve.dedupe: ['react','react-dom']` to `vite.config.ts` because mounting `sonner`'s `Toaster` surfaced a runtime "multiple copies of React" error (build was green but the app crashed at runtime) — now fixed and verified.

| ID | Status | Files changed | What changed / verified |
|---|---|---|---|
| DA-001 | Done | `data/loanStore.ts` (new), `routes.tsx`, `shared/LoanFile.tsx`, `shared/Pipeline.tsx` | New reactive id-keyed loan store (12 loans). Router carries `?id=` via `onNavigate('loan-file::<id>')`. **Verified:** opening LO00000086 shows Narayan FPC + over-limit gate + CFO+2; LO00000089 shows Rajesh Patil — distinct loans, not one hardcoded object. |
| DA-002 | Done | `farmer/FarmerDashboard.tsx` | Hardcoded `loanState`/`kycExpired`/`hasActiveDefault` consts replaced by a "Preview state" switcher (Active/Processing/Overdue/No loan/KYC expired/In default). Added a no-loan onboarding zero-state + overdue banner. **Verified:** No-loan and Overdue states reachable by clicking. |
| DA-003 | Done | `auth/LoginPage.tsx` | Added Admin role pill. **Verified:** Admin pill present on login. |
| DA-004 | Done | `auth/LoginPage.tsx` | Login language buttons wired to `setLang`; selected-state styling. **Verified:** clicking मराठी changes the heading to "पुन्हा स्वागत आहे". |
| DA-005 | Done (scoped) | `context/LanguageContext.tsx`, `farmer/FarmerDashboard.tsx`, `auth/LoginPage.tsx`, `farmer/KeyFacts.tsx` | ~40 new EN/मर/हि keys; farmer dashboard + login + Key Facts routed through `t()`. **Verified live.** Caveat: deeper screens (full apply-wizard body, back-office tables) remain English; the framework + key surfaces are localised, rollout is incremental. |
| DA-006 | Done | `farmer/LoanApplication.tsx` | NACH/ECS mandate added as a Step-3 upload + a required item in the submission checklist. |
| DA-007 | Done | `farmer/LoanApplication.tsx` | Optional guarantor block (name/mobile/PAN/relationship + ID upload) shown when "guarantor required" is checked. |
| DA-008 | Done | `farmer/KeyFacts.tsx` (new), `routes.tsx`, `layout/Sidebar.tsx`, `layout/Header.tsx` | New localised Key Facts / Term-Sheet disclosure (rate, penal interest, charges, tenure, repayment, security, dispute) + Fair-Practice note. Reachable via My Loan nav + search. |
| DA-009 | Done | `farmer/KeyFacts.tsx` | Interest-capitalisation-at-30-April explainer with before/after-principal narrative (SOP §6.1). |
| DA-010 | Done (assumption) | `data/loanStore.ts`, `farmer/KeyFacts.tsx` | Resolved the SOP 10%-vs-30% ambiguity by using the ₹200/share **value** (the §2.3 "10% result") everywhere and avoiding bare "% of valuation" labels. Assumption documented; confirm with PO (Open Q §17). |
| DA-011 | Done | `farmer/FarmerDashboard.tsx`, `credit/ApplicationQueue.tsx`, `compliance/KYCManagement.tsx` | Wired the existing `EmptyTableState` into the credit intake queue + KYC table; added the farmer no-loan zero-state. **Verified:** no-loan zero-state renders. |
| DA-012 | Done | `credit/ApplicationQueue.tsx` | Simulated 600ms load shows skeleton list rows on the intake queue. |
| DA-013 | Done | `routes.tsx` (Toaster), `vite.config.ts` (dedupe), `shared/LoanFile.tsx`, `treasury/DisbursementScreen.tsx`, `farmer/RepaymentScreen.tsx`, `farmer/SupportGrievance.tsx`, `compliance/KYCManagement.tsx`, `credit/ApplicationReview.tsx`, `farmer/LoanApplication.tsx` | Mounted `sonner` Toaster; success/error toasts on approve, reject, disburse, SAP confirm, repayment, grievance, re-KYC, appraisal-submit, application-submit. Sanction approve also advances the loan in the store. **Verified:** approving LO00000085 flips it to "Approved" and moves its Pipeline card to the Documentation (Stage 4) column. |
| DA-014 | Done (scoped) | `farmer/LoanApplication.tsx` | Per-step gating: Step 1 requires DOB + Address (+ nominee 18+), Step 3 requires valid Account Number + IFSC; Next is blocked with inline errors + sidebar blocker text. Caveat: representative required fields enforced (pattern extendable to all). |
| DA-015 | Done | `farmer/LoanApplication.tsx` | Input masks/validation for Account Number (digits, 9–18) and IFSC (`^[A-Z]{4}0[A-Z0-9]{6}$`) with inline format errors. |
| DA-016 | Done | `styles/globals.css`, `styles/theme.css` | Farmer `--farmer-*` vars now alias theme tokens; all farmer-surface raw hex replaced with tokens (added `--green-950`, `--slate-300`, `--farmer-hero-1/2/3`). Value-preserving — one design language. |
| DA-017 | Done | `styles/globals.css` | All `font-weight:800` → `700`. **Verified:** grep for 800/900 in styles = 0. |
| DA-018 | Done | `credit/ApplicationQueue.tsx` | TAT aging chips per intake row vs the 2-day SOP TAT ("Day 1 of 2" / "TAT breached · Nd"). |
| DA-019 | Done | `lib/loanState.ts` | `TONE_STYLES` now reference `var(--…)` tokens instead of literal hex; re-theming a token re-colours every badge. |
| DA-020 | Done | `layout/Header.tsx`, `shared/WorkbenchTabs.tsx` | Previously-hidden hub tabs (Grievances, Stamp Register, registers, Exposure, DPD, SAP log, deductions) added to global search; hub tab strips remain visible + scrollable. |
| DA-021 | Done | `shared/WorkbenchTabs.tsx` | Tab strip given thin scrollbar + momentum (`WebkitOverflowScrolling`) so it scrolls cleanly on mobile. |
| DA-022 | Done | `styles/theme.css` | `--neutral-400` darkened #9EA8B3 → #6B7280 (≈4.9:1) and `--neutral-500` → #5B6472 to keep the step; pervasive secondary text now meets WCAG AA. |
| DA-023 | Done | `shared/StatusBadge.tsx` | Minimum badge text bumped 11px → 12px. |
| DA-024 | Done | `context/LanguageContext.tsx`, `styles/theme.css` | `<html lang>` synced to EN/मर/हि (en/mr/hi) — **verified lang=mr**; global `prefers-reduced-motion` neutralises animations/transitions. |
| DA-025 | Done | `layout/Shell.tsx` | App-wide effect makes every non-native `.clickable-row`/`.clickable-card` keyboard-operable (tabindex + role=button + Enter/Space → click), covering ~30 table rows without per-row edits. |
| DA-026 | Done | `shared/CrossRoleComponents.tsx` | Stage-tracker labels: current = weight 700, others = 500 (was 700/700) — restores hierarchy. |
| DA-027 | Done (scoped) | `shared/Abbr.tsx` (new), `shared/LoanFile.tsx`, `farmer/KeyFacts.tsx` | Glossary + `<abbr title>` auto-wrapper applied to Loan File document names/notes (PoA, SH-4, CDSL, NOC, SAP…); Key Facts plain-languages security acronyms for farmers. Caveat: rollout is incremental across remaining screens. |
| DA-028 | Done | `context/AuthContext.tsx` | Treasury role label "Finance Manager" → "Sr. Manager – Finance" (SOP §1.2). |
| DA-029 | Done | `farmer/LoanApplication.tsx` | Apply success reference is now the next sequential id from the shared register (`nextLoanRef()`), not a hardcoded `LO00000052`. |
| DA-030 | Done | `CLAUDE.md` | Removed the two non-existent doc references; pointed at the two SOP PDFs + this ledger + the implementation log. |
| DA-031 | Done | `data/complianceData.ts` | KYC frequency "Bi-annual" → "Biennial (every 2 yrs)" to match the "every 2 years" re-KYC cadence. |

---

## 15. Excluded Backend / Engineering Notes

Noted during the scan, **deliberately not in the issue ledger** (no prototype-experience impact):

- **Mock auth / no persistence.** `AuthContext` holds in-memory user; no real auth, no session, OTP is `123456`. Expected prototype scaffolding.
- **Custom `?page=` router** instead of real nested routes; ~91 page keys in `routes.tsx`; unknown pages silently redirect. (Only the *user-visible* "no 404/empty" aspect is referenced under §12; the routing architecture itself is out of scope.)
- **Mega "Operations" components** (`CreditOperations`/`ComplianceOperations`/`SanctionOperations`/`TreasuryOperations`) still implement hub tab-views rather than being merged into `LoanFile` — an accepted refactor exception (CLAUDE.md). Not a prototype-quality defect.
- **Brittle responsive CSS** (Shell `!important` overrides keyed off inline `font-size` strings) — maintainability risk, but it functions; an engineering cleanup, not a design issue (the *outcome* — possible mobile tab overflow — is captured as `DA-021`).
- **shadcn `ui/*` primitives unused in favor of bespoke inline-styled controls** — code-consolidation opportunity; not a user-facing defect (related visual consistency captured as `DA-016`/`DA-019`).
- **`tsc` not in the build; build gate is `vite build`** — toolchain note (CLAUDE.md).
- **No tests.** Out of scope for a design audit.

---

## 16. Recommended Prototype Roadmap

### Phase 1 — Prototype blockers & requirement gaps (make the demo true)
- **Issues:** `DA-001`, `DA-002`, `DA-013`, `DA-003`, `DA-005` (scope/decision).
- **Why:** These convert the prototype from "one happy path you must narrate" into a clickable, self-evident system that demonstrates the SOP's gates and multi-loan reality — and gives the farmer audience a localised path.
- **Outcome:** Any reviewer can click any loan, reach every state, see actions take effect, and (for the farmer) switch language meaningfully.

### Phase 2 — Core user-journey improvements
- **Issues:** `DA-014`, `DA-020`, `DA-018`, `DA-027`, `DA-004`, `DA-008`.
- **Why:** Tighten the apply flow's integrity, surface time-pressure (TAT), make hidden tasks discoverable, and expose the compliance-critical rate disclosure.
- **Outcome:** Each role's primary job is completable and believable end-to-end.

### Phase 3 — Missing states & user-visible logic
- **Issues:** `DA-011`, `DA-012`, `DA-006`, `DA-007`, `DA-009`, `DA-029`, `DA-010` (decision).
- **Why:** Empty/loading states + the missing SOP artifacts (NACH/ECS, guarantor, interest capitalisation) complete the lifecycle representation.
- **Outcome:** The prototype shows realistic full/empty/loading states and the complete document set.

### Phase 4 — Accessibility & responsive
- **Issues:** `DA-022`, `DA-025`, `DA-023`, `DA-021`, `DA-024`.
- **Why:** AA-blocking contrast + keyboard reachability matter doubly for a rural, older, multilingual audience.
- **Outcome:** Keyboard-operable, AA-contrast, mobile-clean.

### Phase 5 — Visual polish & design-system consistency
- **Issues:** `DA-016`, `DA-017`, `DA-019`, `DA-026`, `DA-028`, `DA-031`, `DA-030`.
- **Why:** Fold the farmer palette/weights into tokens, single-source the tones, fix label hierarchy, align terminology and docs.
- **Outcome:** One coherent, token-driven design language; accurate copy; trustworthy docs.

---

## 17. Open Questions

**Product requirements**
- Share-value basis: is the eligibility multiplier **10% or 30%** of valuation per share? (V10 §2.2 vs §2.3 conflict; brief shows both.) — drives `DA-010`.
- Is the **₹20,000/acre scale-of-finance** and **₹200/share** value current for the demo's "FY 2025-26"? Confirm so the calculator reflects live policy.
- KYC renewal cadence: **"every 2 years"** (V10) is assumed; the brief's "Bi-annual" should be confirmed — `DA-031`.

**User roles**
- Should **admin** be a login-selectable role in the prototype, or an internal-only path? — `DA-003`.
- The SOP names specific titles (Deputy Manager–Finance, CFC, Sr Manager–Finance). Should mock users use exact titles? — `DA-028`.

**Prototype scope**
- For the demo, do we need **multiple seeded loans** + a **state switcher**, or is a single illustrative loan acceptable? (Strong recommendation: multiple.) — `DA-001`/`DA-002`.
- Which actions must be **irreversible-with-confirm** vs optimistic? — `DA-013`.

**Data & user-visible logic**
- Should the prototype enforce **per-step validation** in the apply wizard, or remain a visual walkthrough? — `DA-014`.
- Are **NACH/ECS mandate** and **guarantor** in scope for the prototype's document set? — `DA-006`/`DA-007`.
- What exactly must appear on the **borrower-facing Key Facts / Term Sheet** disclosure? — `DA-008`.

**Visual design**
- Is the **farmer surface meant to look distinct** from back-office (current behavior), or should both share one palette? — `DA-016`.

**Accessibility**
- Target conformance level — **WCAG 2.1 AA**? (Assumed.) Confirm to prioritise `DA-022`/`DA-025`.

**Technical feasibility affecting UI only**
- Is adopting a tiny mock data store (id-keyed) acceptable, or must navigation stay route-string-only? (Needed for `DA-001`.)

**Missing / ambiguous docs**
- Where are the design docs `CLAUDE.md` cites (`SFPCL_Design_Audit_and_Redesign_Plan.md`, `..._Figma_DesignBrief.md`)? Should this ledger replace/satisfy that reference? — `DA-030`.

---

## 18. Skill Usage Notes (Matt Pocock skills)

> Install run: `npx --yes skills@latest add mattpocock/skills` completed (exit 0) and reported "Found 29 skills", but only **4 universal skills materialised on disk** (`.agents/skills/`: `design-an-interface`, `qa`, `request-refactor-plan`, `ubiquitous-language`). The recommended methodology skills (`grill-with-docs`, `to-issues`, `triage`, `handoff`, `zoom-out`, `prototype`) did **not** land as invokable skills. They were therefore applied **as methodologies, inline**, which is appropriate since they are reasoning workflows rather than code. This is disclosed for transparency.

| Skill | Used? | Why it was used | Output / impact |
|---|---|---|---|
| `grill-with-docs` | Yes (as method) | The two SOP PDFs had ambiguities (10% vs 30% share basis; bi-annual vs biennial KYC; TATs only in the brief) | Produced the requirements table (§4), the doc-conflict findings (`DA-010`/`DA-031`), and the Open Questions (§17) |
| `zoom-out` | Yes (as method) | The `?page=` router + mega-Operations hubs are hard to read in isolation | Produced the codebase→prototype mapping (§5) and the realization that detail-nav carries no id (`DA-001`) |
| `to-issues` | Yes (as method) | Convert findings into independently actionable, single-concern issues | The 31-row ledger (§14), each with evidence + acceptance criteria |
| `triage` | Yes (as method) | Separate prototype blockers from polish | Severity/priority columns + the 5-phase roadmap (§16) |
| `handoff` | Yes (as method) | The audit is large enough to be continued by another designer/dev | This document *is* the handoff (esp. §1, §2, §16, §17, §19) |
| `prototype` | Considered, not invoked | No code changes are in scope for this task (audit-only) | Alternative layouts proposed as recommendations in §7 instead of disposable code |
| `design-an-interface` (installed) | No | It spawns parallel sub-agents to design a module API; out of scope for an audit, and the task said not to spawn agents unless asked | Noted as available for the redesign phase (e.g., re-designing the apply wizard or loan-file shape) |
| `ubiquitous-language` (installed) | Partially (as method) | Terminology alignment between SOP and UI | Surfaced role-title and acronym findings (`DA-028`, `DA-027`); a full `UBIQUITOUS_LANGUAGE.md` glossary is a recommended next artifact |
| `qa` / `request-refactor-plan` (installed) | No | Both file GitHub issues / refactor RFCs; not requested and no GitHub remote assumed | Available if the team wants the ledger pushed to GitHub issues later |

---

## 19. Final Recommendations

**Top prototype blockers (fix first)**
1. **`DA-001` — give loans an identity.** A mock store keyed by id so list/board→detail navigation is real. Single highest-leverage change.
2. **`DA-002` — make the gated states reachable.** Surface processing / KYC-blocked / default / no-loan via UI, not code constants.
3. **`DA-013` — add action feedback.** Confirm dialogs + success toasts (`sonner` is already installed) and have decisions advance the pipeline.

**Highest-impact UX fixes**
- **`DA-022` contrast** and **`DA-025` keyboard rows** — accessibility blockers for the actual audience.
- **`DA-005` farmer localisation** — the product's premise (farmer self-service) is undercut without it.
- **`DA-014` apply-wizard validation** — make the integrity match the polish.

**Most important missing screens / states**
- Reachable **empty** and **loading** states (`DA-011`, `DA-012`) — components already exist, just unused.
- A borrower-facing **Key Facts / Term Sheet disclosure** (`DA-008`) and the **NACH/ECS mandate** + **guarantor** artifacts (`DA-006`, `DA-007`).
- A **no-loan onboarding** zero-state for first-time members.

**Requirements not yet represented in the UI**
- NACH/ECS mandate (R-26), guarantor (R-26), borrower-readable rate/penal disclosure (R-14/R-27), TAT/SLA cues (R-31), interest-capitalisation moment (R-18, currently copy-only).

**What must be clarified before continuing design** (see §17)
- The **10%-vs-30%** share-value basis; KYC cadence; whether admin is login-selectable; whether the farmer surface is intentionally a distinct visual language; target WCAG level; and whether a mock id-keyed store is acceptable.

**What to fix first (one-line):** wire a small id-keyed mock loan store (`DA-001`) so navigation and state variants become clickable, then layer on feedback (`DA-013`), contrast (`DA-022`), and farmer localisation (`DA-005`).

**What the product needs to feel prototype-ready vs production-ready**
- *Prototype-ready (for stakeholder + farmer usability test):* Phase 1 + the three accessibility/localisation fixes above. After that, the prototype demonstrates the whole SOP — happy path *and* gates — by clicking, in the user's language, accessibly.
- *Production-ready (design):* Phases 2–5 complete, the doc ambiguities resolved, a ubiquitous-language glossary adopted, the design-system fully token-driven, and the (excluded-here) engineering items (real auth/routing/persistence/API, data store, tests) addressed by the build team.

---

*Living document — update the §14 ledger, §16 roadmap, and §1 summary on each design pass. Add new findings as `DA-032`, `DA-033`, … Keep evidence (file:line, doc section) on every row.*
