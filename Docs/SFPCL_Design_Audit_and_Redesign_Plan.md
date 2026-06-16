# SFPCL "WhatsLoan" — Design Audit, SOP Research & Redesign Plan

**Prepared for:** SFPCL Member Credit Portal (WhatsLoan) UI/UX
**Scope:** Audit of the current React prototype + research grounded in the two SOP documents + user journeys + system flow + a concrete plan to fix the "overwhelming / lacks direction" problem.
**Source documents studied:**
- `Final SOP - Loan Disbursement V10 (1).pdf` — the authoritative 33‑page master SOP (`SOP_SFPCL_LOANDISBURSEMENT v1.0`, 07‑08‑2025, under Section 378ZK, Companies Act 2013).
- `SFPCL_Loan Sanction- Doc & Disbursement-SOP_WhatsLoan-25052026.pdf` — the 12‑page visual deck that summarises the same process into 6 stages, an approval matrix, TAT, a default flow, a compliance framework, and the Top‑10 errors.

> The two PDFs describe **one** process from two altitudes. The 33‑page document is the law of the system; the 12‑page deck is the picture of it. "Implement every pixel" therefore means **the screens must faithfully encode every stage, role, artifact, gate and exception in the SOP** — not literally redraw the slides. This document maps each SOP element to a screen and then fixes how those screens are organised so they stop overwhelming the user.

---

## 0. Executive Summary

The prototype is **content‑complete but structurally overwhelming**. It already contains almost everything the SOP demands — six roles, the six‑stage lifecycle, the approval matrix, document workbench, DPD buckets, SAP/CDSL/RBL touch‑points, exception registers. The problem is not *missing* features; it is **too many doors and no clear path through them.**

Three root causes:

1. **Route & navigation bloat.** ~91 page keys (`src/app/routes.tsx`) — Credit alone exposes 21, Compliance 26 — but many collapse to a single mega‑component rendering near‑identical tables (`CreditOperations.tsx` handles 16 "pages"; `ComplianceOperations` handles 12). The user sees a giant menu where most items lead to the same shallow view. Lots of nouns ("registers", "logs", "operations"), almost no verbs ("approve this", "disburse this").

2. **Two design languages fighting inside one app.** The farmer surface uses a soft, rounded, gradient style (`farmer-panel`, 22px radii, hero gradients, `#1E88E5` blue). The back‑office uses a dense, heavy style (`rounded-lg`, `#FAFAF8` header bars, `font-weight: 900` everywhere, a *different* blue `#0C5FA5`). A documented token system exists (`Docs/SFPCL_LoanPlatform_Figma_DesignBrief.md`, `src/styles/theme.css`) but screens ignore it and hard‑code hex + magic numbers inline.

3. **No "what do I do next" altitude.** Dashboards stack three competing entry points (a red banner + `RoleCommandCenter` + an "Action Queue" + "Alerts" + "What you can do now"), so the single most important next action is buried among 15 equally‑weighted choices. The IA is organised around *data the system holds* rather than *the task the user owns right now.*

The fix is **not a rebuild.** It is (a) collapse the navigation to task‑first IA aligned to the SOP stages, (b) unify on the existing token system and one component kit, and (c) give every role a single, unambiguous "Today / Act now" focus. The roadmap below sequences this into quick wins (1–2 weeks) → IA restructure (2–4 weeks) → design‑system unification (3–5 weeks).

---

# PART A — What the SOP Actually Requires (Document Study)

This part is the ground truth. Every screen in the product should trace back to a row here.

## A.1 The organisation & legal frame
- SFPCL = farmer‑owned producer company: **769 individual shareholders + 48 FPCs**, ~8,500 direct members, 30,000+ farmers, 45,000 acres, 8 crops (grapes, tomato, citrus, mango, banana, sweetcorn, cashew, pomegranate).
- Lending is permitted under **Section 378ZK / 378ZJ, Companies Act 2013** — secured loans/advances to **members only**, 3 months–7 years. Lending to non‑members can invalidate producer‑company status. Loans to a director/relative require **General Meeting** approval.
- Statutory perimeter the UI must respect: **s.186** lending cap (60% of paid‑up capital + free reserves, or 100% of free reserves), **NBFC principal‑business test** (financial assets & income < 50%), **PMLA/CKYC** (re‑KYC every 2 yrs), **Maharashtra Stamp Act** (₹500 + notarisation on PoA & Loan Agreement), **Maharashtra money‑lending exemption** (confirm annually), **8‑year record retention** (no hard deletes).

## A.2 The five operating roles + borrower (mental models)

| Role | Composition (SOP §1.2) | Owns | Cannot do |
|------|------------------------|------|-----------|
| **Borrower** (Farmer / FPC) | individual shareholder or FPC | Apply, upload KYC, track status, repay, raise grievance | See anyone else's data |
| **Credit Assessment Team** | Credit Manager + Deputy Manager–Finance | Intake, completeness check, **Loan Appraisal Note (Annexure B)**, limit calc, Loan Request Register, DPD/MIS, interest invoices, rejection notes, SAP repayment posting | Approve or disburse |
| **Compliance Team** | Company Secretary + Compliance member | All legal docs (PoA, Tri‑Party, SH‑4, CDSL pledge, Term Sheet, Loan Agreement, Bank Verification, **Checklist/Annexure H**), stamping/notarisation, KYC cadence, NOC + security return, grievance register | Approve or disburse |
| **Sanction Committee** | CFO + 2 Executive Directors | Credit scrutiny (7 checks), approve/reject into **Credit Sanction Register (Annexure K/J)**, authority‑matrix counter‑signature, special‑case routing, sign Checklist, approve SH‑4/cheque invocation | Prepare appraisal or disburse |
| **Treasury Team** | Chief Financial Controller + Sr. Manager–Finance | SAP customer code (Annexure I), final verification, **RBL** payment initiate → CFC authorise/execute, disbursement advice, repayment receipts, monthly accruals, year‑end capitalisation | Approve loans |
| **Authorised signatory (legal docs)** | any one of CFO or 2 directors | Executes under **PoA** for stamping, SH‑4 & blank cheque custody | — |

## A.3 The six‑stage lifecycle (the spine of the product)

```
STAGE 1            STAGE 2              STAGE 3               STAGE 4               STAGE 5            STAGE 6
Initial Loan   →   Credit          →   Credit Scrutiny   →   Documentation     →   Loan          →   Monitoring &
Request            Assessment           & Approval            & Stamping             Disbursement       Repayment
(Borrower /        (Credit Team,        (Sanction Comm.,      (Compliance Team)     (Treasury Team)   (Credit + all)
 Credit Team)       TAT 2 days)          immediate)
```

**Stage 1 — Initial Loan Request.** Application form signed by **applicant + nominee**; folio & shares; required amount; nominee (Name/Age/Aadhaar/PAN/Gender — *not a minor*). KYC pack: PAN, Aadhaar, share certificates, 7/12 extract, crop plan, 6‑month bank statement. Deputy Manager–Finance checks completeness → issues **unique ref `LO00000001…`** (sequential) → enters Loan Request Register. Incomplete ⇒ returned with deficiency list (**Annexure L**).

**Stage 2 — Credit Assessment.** Deputy Manager prepares **Loan Appraisal Note**, Credit Manager reviews. **TAT = 2 days.** Eligibility (5 gates): (1) active member, (2) no existing default at SFPCL or subsidiary/associate, (3) land docs + KYC + bank stmt + crop plan submitted, (4) agrees to Term Sheet/Agreement, (5) purpose = crop/agriculture only. **Limit = MIN(** shares × 30% of per‑share valuation [currently ₹200/share] , land acres × scale‑of‑finance [₹20,000/acre] **)**. Fail any gate ⇒ Rejection Note.

**Stage 3 — Credit Scrutiny & Approval.** Sanction Committee runs **7 checks**: eligibility, amount within limit, purpose, compliance, past borrowing history, risk, documentation completeness. Decision + reason → **Credit Sanction Register**. **Authority matrix:** ≤ ₹5,00,000 ⇒ **CFO + 1 Director**; > ₹5,00,000 *or* exceeding member limit ⇒ **CFO + 2 Directors** + **Exception Register** entry. Special case: director/relative borrower ⇒ excluded from their own scrutiny **and** requires General‑Meeting approval (Sec 378ZK).

**Stage 4 — Documentation & Stamping.** Collect witness PAN/Aadhaar (witness must be an SFPCL shareholder), cancelled cheque (for SAP bank details), one **blank‑dated cheque** (security). Compliance prepares: **PoA** (₹500 stamp + notarised, in favour of CS), **Tri‑Party/Declaration** (SFPCL + borrower + subsidiary repayment deduction), **SH‑4** (physical shares, signed by applicant + witness) *or* **CDSL pledge** (demat: PRF→PSN→accept→created; invocation IRF; release URF), **Term Sheet** (13 fields), **Loan Agreement** (₹500 stamp + notarised), **Bank Verification Letter** (if signature mismatch) and **Checklist** (index). **Final approval chain:** CS reviews → Credit Manager → Sanction Committee signs Checklist → file to Treasury.

**Stage 5 — Disbursement.** SAP **Customer Code** created on approval (new only if first loan; Annexure I email to Sr. Manager–Finance). Sr. Manager–Finance does final verification → initiates payment via **RBL** → **Chief Financial Controller authorises/executes**. Loan register updated; disbursement advice to farmer. *Hard gate: the Checklist's four signatures (CS, Credit Manager, ≥1 SC member, Sr. Manager–Finance) + stamping must be complete before money moves.*

**Stage 6 — Monitoring & Repayment.** Two channels: **direct** (RTGS/NEFT → SAP entry next working day; *partial payment hits principal first, always*) and **subsidiary** (deducts from produce payment, transfers to SFPCL under tri‑party). Yearly interest invoices; monthly SAP accruals. **Unpaid interest by 30 April ⇒ capitalised into principal** + borrower intimation. Floating rate ⇒ rate change communicated by SMS/email. **DPD buckets 1–2y / 2–3y / 3y+** → quarterly CFO MIS; reminders quarterly beyond 1 year. **Default ladder:** miss → +3‑month grace → assess intentional/non‑intentional → non‑intentional gets +1‑year extension (note filed) → still unpaid ⇒ "Note for Non‑Payment" → SC decides SH‑4 / undated‑cheque invocation (**board approval required**). Full repayment ⇒ **NOC** issued + SH‑4 & blank cheque returned + file **archived 8 years**.

## A.4 The 12 annexures → where each lives in the product

| Annexure | Document | Owning role / screen |
|---|---|---|
| A | Loan Application Form (Individual + FPO) | Farmer apply wizard / Credit manual entry |
| B | Loan Appraisal Note | Credit — Appraisal workspace |
| C | Power of Attorney (to CS) | Compliance — Document workbench |
| D | Declaration / Tri‑Party Agreement | Compliance — Document workbench |
| E | Term Sheet (13 fields) | Compliance — generates; SC + farmer sign |
| F | Loan Agreement | Compliance — Document workbench |
| G | Bank Verification Letter | Credit/Compliance — conditional |
| H | Checklist (index, 4 signatures) | Compliance → SC → Treasury sign‑off gate |
| I | SAP Customer‑Code Excel template | Treasury — SAP code creation |
| J | Board/Sanction Committee Register | Sanction — decision register |
| K | Grievance Form & Log | Compliance — grievance register |
| L | Rejection Note | Credit — rejection composer |

## A.5 The non‑negotiable gates (must be **hard blocks** in the UI)
These come directly from the SOP "Top 10 errors", the compliance matrix, and the maker‑checker rules. Each must show **the rule that blocks + the action to unblock.**
1. Non‑member or over per‑share cap ⇒ block application/sanction.
2. Missing PAN/Aadhaar/CKYC consent ⇒ block intake.
3. Incomplete appraisal (no income evidence / risk rating) ⇒ block submit‑to‑SC.
4. Missing witness signatures on Agreement/SH‑4 ⇒ block checklist finalisation.
5. **Disbursement before stamping/checklist signatures** ⇒ block disbursement (the single most important gate).
6. Wrong bank details in SAP ⇒ cancelled‑cheque vs entered details shown side‑by‑side for confirmation.
7. Missing year‑end interest invoice ⇒ task surfaced.
8. Re‑KYC not done in 2 years ⇒ block new application from that member.
9. SH‑4 / undated cheque invoked without board approval ⇒ block recovery action.
10. NOC delay on closure ⇒ task + ageing indicator.
Plus: **s.186 cap breach** blocks new sanction without board special resolution; **exception register entry** is mandatory before any deviation proceeds.

---

# PART B — Industry & Role Research

## B.1 What category this product belongs to
This is an **agri / FPC member‑lending Loan Management System (LMS)** — a niche between three established software categories:
- **Loan Origination Systems (LOS):** application → appraisal → sanction → documentation (Stages 1–4).
- **Loan Management / servicing systems:** disbursement, ledger, repayment, DPD, NPA, closure (Stages 5–6).
- **Co‑operative / FPC member systems:** shareholding, folio, member services, governance.

The closest real‑world analogues are co‑operative bank / NBFC‑MFI origination suites and FPC ERP add‑ons. The defining trait of this category is that **the workflow is a regulated, sequential, maker‑checker pipeline with mandatory documents and hard gates** — which is exactly what should drive the IA.

## B.2 How the industry designs these systems (patterns to adopt)
1. **Pipeline / stage board as the home object.** Mature LOS products front a **kanban or stage tracker** keyed to the canonical stages, not a generic dashboard. The loan (not the menu) is the primary object; everyone works the *same* loan from their stage's lens. → SFPCL's 6 stages should be the literal backbone of navigation and of every loan's detail view.
2. **Role‑scoped worklists ("my queue").** Each role lands on **one prioritised queue of items awaiting *their* action**, sorted by SLA/TAT breach risk. This is the antidote to "lacks direction."
3. **One loan, one file, many lenses.** A single **Loan Detail / Loan File** screen with tabs (Application · Appraisal · Sanction · Documents · Disbursement · Repayment · Audit) that every role opens; permissions hide/disable tabs. Avoids the current pattern of 20 sibling list pages.
4. **Maker‑checker made visible.** Approvals show *who signed, who is pending, what each signature means.* The SOP's "signatures on the checklist — what they signify" is a gift: render it literally as a signature ladder.
5. **Document generation + status chips.** Each legal artifact is a card with state (Not started → Drafted → Stamped → Notarised → Signed → Locked). The disbursement gate reads these states.
6. **Progressive disclosure for compliance.** s.186 / NBFC / stamp / re‑KYC monitors live in an **admin/compliance cockpit**, surfaced as alerts only when a threshold is near — not as 6 separate always‑visible menu items.
7. **Calm, dense, legible data design.** Financial back‑offices use restrained typography (1–2 weights), generous row height, monospaced numerals, and *colour reserved for status*. The current `font-weight: 900` everywhere and dual blues break this.
8. **Bilingual, low‑literacy front door.** For farmer‑facing screens: large tap targets, icons + Marathi/Hindi labels, status‑as‑plain‑language ("Your loan is active and in good standing"), one primary action per screen.

## B.3 Role mental models (what each person is really thinking)
- **Farmer:** *"How much can I get, where is my money, what do I owe, when is it due?"* → Wants reassurance and one button, not a portal.
- **Credit Manager / Deputy Manager:** *"What's breaching the 2‑day TAT? Is this borrower eligible and within limit? Send clean files to SC."* → Wants a triage queue + a structured appraisal form + the limit calculator inline.
- **Company Secretary / Compliance:** *"Which files need documents prepared, stamped, signed? What's due for re‑KYC? Any NOC overdue?"* → Wants a document factory with clear states and a compliance calendar.
- **Sanction Committee (CFO/Directors):** *"What needs my signature, at what authority level, and is anything an exception or a related‑party case?"* → Wants a decision queue with the full file in one view and the authority matrix enforced.
- **Treasury (CFC / Sr. Manager–Finance):** *"What is cleared to pay, are bank details verified, has the second signatory authorised?"* → Wants a disbursement queue with a pre‑flight checklist and a two‑step authorise.
- **Admin/CFO oversight:** *"Are we within s.186 and the NBFC test? Portfolio health? Audit trail?"* → Wants a compliance cockpit, not operational clutter.

---

# PART C — Current Prototype Audit

**Stack:** React 18 + TypeScript + Vite + Tailwind + shadcn/ui. Custom URL‑param router (`?page=`) in `src/app/routes.tsx`. Auth/Language via context. All data mocked under `src/app/data/*`. 36 feature components (~8,800 LOC).

### C.1 What's genuinely good (keep)
- **Domain coverage is excellent** — the prototype encodes the SOP faithfully (limit calc, authority levels, DPD buckets, default ladder, SAP/CDSL/RBL touch‑points, exception/sanction registers, NOC/security return). This is hard‑won and should be preserved.
- **Hard‑block thinking already exists** — e.g. `FarmerDashboard` KYC‑expired / active‑default banners, `LoanApplication` blocks submit until amount‑within‑limit + declarations + docs. The SOP's gates are partly modelled.
- **Bilingual scaffolding** — `LanguageContext` with EN/मर/हि toggle, `Noto Sans Devanagari` fonts.
- **A real design system is documented** — `Docs/SFPCL_LoanPlatform_Figma_DesignBrief.md` + `theme.css` define tokens, palette, elevation. The vocabulary exists; it's just not used consistently.
- **Accessibility seeds** — focus‑visible outlines, `aria-*` on nav, alt fallbacks (`ImageWithFallback`).

### C.2 Findings (by severity)

#### 🔴 Critical — these cause the "overwhelming / no direction" feeling
| # | Finding | Evidence | Impact |
|---|---------|----------|--------|
| C1 | **Route explosion.** ~91 page keys; Credit 21, Compliance 26, Sanction 16, Treasury 14. | `routes.tsx:52–79` | Menu is a wall; users can't tell what matters. |
| C2 | **Many routes → one mega‑component rendering similar tables.** `CreditOperations` switches 16 keys; `ComplianceOperations` 12; `SanctionOperations` 13; `TreasuryOperations` 12. | `routes.tsx:149,158,166,173`; `CreditOperations.tsx:257–268` | Distinct menu items lead to near‑duplicate views → perceived bloat, low payoff per click. |
| C3 | **No single "next action."** Dashboards stack red banner **+** `RoleCommandCenter` **+** Action Queue **+** Alerts **+** "What you can do now". | `CreditDashboard.tsx:50–115`; `FarmerDashboard.tsx:94–214` | 4–5 competing CTAs of equal weight; the one thing to do is invisible. |
| C4 | **Two design languages.** Farmer: soft, rounded `farmer-panel`, 22px radii, gradient heroes, blue `#1E88E5`. Back‑office: dense `rounded-lg`, `#FAFAF8` header bars, `font-weight:900`, blue `#0C5FA5`. | `FarmerDashboard.tsx:104–214` vs `CreditOperations.tsx:294–306` | App feels like two products; erodes trust the SOP design philosophy demands. |
| C5 | **IA is noun‑first, not task‑first.** Nav sells "Registers", "Operations", "SAP Management", "Reporting"; the SOP is a *task pipeline*. | `Sidebar.tsx:42–237` | Users must translate "my job right now" into "which register?" every time. |

#### 🟠 High
| # | Finding | Evidence |
|---|---------|----------|
| C6 | **Design tokens bypassed.** Colours, radii, spacing, font sizes hard‑coded as inline `style={{}}` hex/px across every screen; `theme.css` tokens largely unused. | e.g. `CreditOperations.tsx` passim; `Shell.tsx:37–93` inline `<style>` blob with responsive overrides. |
| C7 | **Font‑weight & colour inflation.** `fontWeight:900` used for body labels, table cells, headings alike; two blues, multiple greens, ad‑hoc status colours. | `CreditOperations.tsx:294,298,302,306` |
| C8 | **Responsive handled by a brittle CSS override blob** keyed to utility class names and even `[style*="font-size: 40px"]`. | `Shell.tsx:60–92` |
| C9 | **Sidebar density.** Up to 4 sections × multiple groups × children per role, all expandable, with badges — a lot of always‑present chrome. | `Sidebar.tsx:86–173`, `defaultExpandedGroups` |
| C10 | **Placeholder routes presented as real.** Several nav targets render the same operations component or a stub; counts like "1‑5 of 147" are static. | `CreditOperations.tsx:114` |

#### 🟡 Medium
| # | Finding | Evidence |
|---|---------|----------|
| C11 | Custom `?page=` router instead of real routes ⇒ no deep‑link hierarchy, no nested layouts, breadcrumb is a prop array. | `routes.tsx:81–117`, `Shell.tsx` |
| C12 | Mixed numeric formatting / currency helpers duplicated per file (`formatCurrency` redefined in many components). | multiple |
| C13 | Status vocabulary not centralised — `StatusBadge` exists but statuses are passed as free strings (`'Incomplete'`, `'Under Processing'`, `'Awaiting SC Approval'`). | `StatusBadge`, callers |
| C14 | Empty/loading/error states inconsistently present (`TableStates` exists but isn't used everywhere). | `shared/TableStates.tsx` |
| C15 | Accessibility gaps on clickable `<div>` rows, colour‑only status meaning, tooltip‑only disabled reasons. | various |

### C.3 The structural picture (why it overwhelms, quantified)
```
Role        Nav menu items   Distinct real screens   Ratio of "doors" to "rooms"
Credit            ~21                 ~8                       2.6 : 1
Compliance        ~26                 ~6                       4.3 : 1   ← worst
Sanction          ~16                 ~6                       2.7 : 1
Treasury          ~14                 ~5                       2.8 : 1
Farmer             ~6                 ~6                       1.0 : 1   ← the only calm role
```
The farmer surface (1:1) is the only part that feels directed. Every back‑office role has **2.6–4.3× more menu entries than actual destinations.** That gap *is* the overwhelm.

---

# PART D — Root‑Cause Analysis: Why It Feels Overwhelming & Directionless

1. **The menu models the database, not the job.** Users think in tasks ("approve the loans waiting for me"); the nav offers data stores ("Sanction Register", "Exception Register", "Board Minutes"). Every interaction starts with a translation tax.
2. **Everything is equally loud.** `font-weight:900`, full‑saturation status colours, multiple cards per row, badges on most nav items. When everything shouts, nothing leads. There is no visual hierarchy that says *this first, that later.*
3. **Redundant entry points.** The same destination is reachable from a banner, a command‑center tile, an action‑queue row, an alert, and the sidebar. Choice overload, not capability.
4. **Breadth presented before depth.** The product reveals all 91 doors up front instead of revealing depth as the user commits to a task. Progressive disclosure is inverted.
5. **No shared object.** Because there's no single "Loan File" that all roles open, each role got its own pile of list pages — multiplying screens instead of sharing one.
6. **Inconsistency reads as instability.** Two design languages + bypassed tokens make the system feel unfinished, which makes users hesitant — the opposite of the "trust through structure" goal in the design brief.

---

# PART E — User Journeys (end‑to‑end, mapped to the SOP)

> Notation: **[Role]** does **action** → *system gate* → handoff. Each journey is what the redesigned product should make feel like a single guided path.

## E.1 Farmer — "I need a crop loan" (happy path)
1. **Farmer** opens app → Dashboard shows either *"Apply for a loan"* (no active loan) or the active‑loan hero. One primary action.
2. Taps **Apply** → *gate: KYC valid? not in default? active member?* If blocked, a plain‑language banner explains why + who to contact (already modelled in `FarmerDashboard`).
3. Wizard (keep 5 steps, simplify copy): Basic + Nominee (≥18) → Shareholding (live limit calc) → Land & Crop + bank + cancelled cheque → KYC upload → Review. Live eligibility summary at top.
4. Submit → **ref `LO000000xx`** + 6‑stage tracker at Stage 1. Plain message: "We'll respond within 2 working days."
5. Receives SMS/app updates as the loan advances; can always see *which of the 6 stages* it's in and what's pending from them.
6. On disbursement: advice + "money sent" + repayment schedule appears.
7. Repayment: one **Pay** button (direct) or sees subsidiary deductions automatically applied; running balance; next due date; DPD indicator if late.
8. On closure: **NOC** download + confirmation SH‑4/cheque returned.

## E.2 Credit Assessment — "Clear my queue within TAT"
1. Land on **My Work**: one list of applications awaiting *me*, sorted by **TAT risk** (overdue first). Single focus banner: "Oldest appraisal is overdue by 1 day."
2. Open an application → **Loan File → Appraisal tab**: borrower context, the 5 eligibility gates as checkboxes, the **limit calculator** inline (MIN of share/land), risk rating, income evidence, notes.
3. *Gate:* can't "Submit to SC" until eligibility complete + amount ≤ limit + appraisal fields filled.
4. Incomplete file ⇒ **Request documents** (Annexure L deficiency list) → moves to "Returned" sub‑state; borrower notified.
5. Submit → loan moves to Stage 3; appears in SC queue; Credit can track it under "Submitted / awaiting SC."
6. Post‑disbursement servicing (Stage 6): DPD monitor, interest invoices, SAP repayment posting, default‑note drafting — all reached from the **same Loan File**, not separate menus.

## E.3 Compliance — "Run the document factory"
1. Land on **My Work**: files where SC approved and documents are needed, plus re‑KYC due and NOC due.
2. Open Loan File → **Documents tab**: each artifact (PoA, Tri‑Party, SH‑4/CDSL, Term Sheet, Loan Agreement, Bank Verification, Checklist) is a card with a state machine (Draft → Stamped → Notarised → Signed → Locked). One‑click generate pre‑filled from loan data.
3. *Gates:* PoA & Loan Agreement must be Stamped **and** Notarised (₹500); SH‑4 if physical / CDSL confirmation if demat; witness must be a shareholder.
4. CS signs the **Checklist** → routes to Sanction Committee for signature → Treasury.
5. Side duties from a **Compliance cockpit** (not the per‑loan path): re‑KYC calendar, grievance register, stamp register, security‑return log, NOC issuance, the annual money‑lending confirmation.

## E.4 Sanction Committee — "Decide what needs my signature"
1. Land on **Decisions**: items awaiting *my* signature, grouped by authority level (≤₹5L: CFO+1; >₹5L/over‑limit: CFO+2) and flagged for **exceptions / related‑party**.
2. Open Loan File → **Sanction tab**: appraisal note + full doc package + limits + history + risk in **one view**. The 7 scrutiny checks as a checklist.
3. Approve/Reject with mandatory reason → writes Credit Sanction Register. For >₹5L, first signature **locks "pending 2nd director"**; second director sees the first decision before signing. Both required to release.
4. Special case (director/relative): banner blocks normal flow → "General Meeting approval required (Sec 378ZK)" until CS uploads the GM resolution.
5. Later, signs the **Checklist** at Stage 4; and reviews "Note for Non‑Payment" → votes SH‑4/cheque invocation (records board approval) at Stage 6.

## E.5 Treasury — "Pay what's cleared, safely"
1. Land on **Disbursements**: only loans whose **Checklist is fully signed + stamped** appear (hard gate enforced upstream).
2. Open → **Disbursement tab** pre‑flight: SAP customer code (create via Annexure I if first loan), **cancelled‑cheque vs entered bank details side‑by‑side** for confirmation, approved amount pre‑filled.
3. Two‑step: **Sr. Manager–Finance initiates** (RBL) → **Chief Financial Controller authorises/executes.** Both signatures visible.
4. Disbursement advice auto‑generated → farmer notified; loan register updated; loan enters Stage 6.
5. Servicing: post repayment receipts to SAP (next working day), monthly accruals, **year‑end capitalisation** preview/confirm.

## E.6 Cross‑cutting journeys
- **Rejection** (any stage 2–3): reason recorded → Annexure L to borrower → borrower may re‑apply after fixing.
- **Exception**: any deviation (over limit, step bypass, partial KYC) ⇒ mandatory Exception Register entry w/ justification + approver before proceeding.
- **Default ladder** (Stage 6): miss → +3mo grace → intent assessment → +1yr extension (non‑intentional) → Note for Non‑Payment → SC + board → invocation.
- **Compliance cadence**: re‑KYC (2y), s.186 (quarterly), NBFC test (quarterly), money‑lending confirmation (annual), stamp at execution, 8‑year retention.

---

# PART F — System Flow (the whole machine)

## F.1 Loan state machine (single source of truth for status everywhere)
```
draft → submitted → under_assessment → (returned ↺) 
      → appraised → pending_sanction → (rejected ⊗)
      → approved → documentation → checklist_signed
      → disbursement_pending → disbursed → active
      → [repaying ⇄ overdue → grace → extension → non_recoverable → recovery]
      → closed → archived(8y)
```
Every status chip in the UI should map to exactly one of these states (fixes C13). The 6 SOP stages are a *view* over these states:
- Stage 1 = draft/submitted/returned · Stage 2 = under_assessment/appraised · Stage 3 = pending_sanction/approved/rejected · Stage 4 = documentation/checklist_signed · Stage 5 = disbursement_pending/disbursed · Stage 6 = active/overdue/…/closed.

## F.2 Handoff & gate map
```
Borrower ──application──▶ Credit ──appraisal(TAT 2d)──▶ Sanction ──decision+CSR──▶ Compliance
   ▲                                                       │(authority matrix)        │(docs+stamp)
   │SMS/email at each transition                           ▼                          ▼
   └──────────── disbursement advice ◀── Treasury ◀──Checklist 4 signatures(HARD GATE)─┘
                                            │ Sr.Mgr initiate → CFC authorise (RBL)
                                            ▼
                                     Stage 6 servicing: DPD · invoices · accruals · default ladder · NOC
```
**Hard gates on the wire** (cannot pass without): completeness+KYC (1→2), eligibility+limit (2→3), authority‑matrix signatures + exception entry if needed (3), stamping+notarisation+witness (4), **checklist 4 signatures** (4→5), bank‑detail match + two‑step authorise (5), board approval for invocation (6).

## F.3 Notifications (status‑driven, never manual)
Triggered by state transitions: application received (ref#), approval/rejection, disbursement advice, repayment reminder (T‑30d), interest invoice, rate change, re‑KYC request, NOC issued, grace started, extension granted, capitalisation event. Channels: SMS + email (farmer, Marathi), in‑app task per role.

## F.4 Integrations (already represented; keep as service boundaries)
**SAP** (customer code Annexure I, journal entries, accruals), **CDSL** (PRF/PSN, IRF, URF), **RBL** (RTGS/NEFT out, statement polling, UTR), **SMS/WhatsApp** (Marathi notifications).

---

# PART G — Comprehensive Design Plan (the fix)

The strategy in one line: **collapse doors, share one loan file, lead with one task, unify the look.**

## G.1 New Information Architecture (task‑first, SOP‑aligned)
Replace the per‑role pile of registers with **a small, stable spine** plus a shared object.

**Global spine (every back‑office role):**
1. **Today / My Work** — the single prioritised worklist of items awaiting *my* action (SLA‑sorted). This is the landing page and the cure for "no direction."
2. **Pipeline** — the 6‑stage board (kanban or table grouped by stage); the shared view of all loans.
3. **Loan File** — the shared detail object (tabs gated by role): Application · Appraisal · Sanction · Documents · Disbursement · Repayment · Audit.
4. **Registers & Reports** — *one* destination with tabs (collapses today's 6–8 separate register menu items).
5. **Compliance Cockpit** (CS/Admin) — re‑KYC calendar, s.186, NBFC, stamp, money‑lending, grievance, security return — surfaced as alerts.

**Per‑role landing = the same spine, filtered:**

| Role | "Today / My Work" shows | Primary verb |
|------|------------------------|--------------|
| Credit | Apps awaiting appraisal, sorted by TAT breach | *Appraise* |
| Compliance | Files needing docs / stamping / signature; re‑KYC & NOC due | *Prepare & sign* |
| Sanction | Loans awaiting my signature, grouped by authority level | *Decide* |
| Treasury | Loans cleared to pay (checklist signed) | *Disburse* |
| Admin | Threshold alerts (s.186/NBFC/KYC) + portfolio health | *Oversee* |

**Net effect:** every role drops from ~14–26 menu items to **~5**, and the 2.6–4.3:1 door‑to‑room ratio collapses toward 1:1 — because sibling list pages become **tabs on Registers** or **lenses on the Pipeline**, not top‑level menu entries.

## G.2 Navigation redesign (concrete)
- **Sidebar:** max 5 items per role, no nested‑group sprawl by default. Keep the role accent strip. Badges only on "Today" (count of my pending actions) and time‑critical queues — not on every item.
- **Kill duplicate entry points.** One dashboard focus card = the single next action. Demote Alerts to a secondary column; remove the redundant "What you can do now" grid (its links live in the sidebar). Remove `RoleCommandCenter` *or* the Action Queue — not both.
- **Breadcrumbs from real routes.** Move to nested routes (`/loans/:id/appraisal`) so deep links, back button, and breadcrumbs work without the prop‑array hack (C11).
- **Global search stays** (it's good) but indexes loans/members/queues consistently.

## G.3 The "Today" page pattern (applies to all back‑office roles)
```
┌───────────────────────────────────────────────────────────────┐
│  ▌ ONE FOCUS CARD: "Appraise LO00000089 — overdue 1 day"  [Go] │  ← the single next action
├───────────────────────────────────────────────────────────────┤
│  My queue (sorted by SLA)            3 metrics: New 12 · Rev 5 · SC 2 │
│  ─ LO…91  Priya Shinde   PAN missing      Request docs →            │
│  ─ LO…86  Narayan FPC    awaiting SC       Track →                  │
│  …                                                                  │
├───────────────────────────────────────────────────────────────┤
│  Alerts (secondary, muted)   |   Portfolio snapshot (one row)       │
└───────────────────────────────────────────────────────────────┘
```
Rules: exactly **one** primary CTA above the fold; queue is the hero; everything else is secondary/muted. This single change removes most of the "overwhelming" feeling.

## G.4 The shared "Loan File" (collapses dozens of pages into one)
One screen, tabbed, permission‑aware. Header: loan ref, borrower, amount, **6‑stage tracker**, current status chip, authority level. Tabs:
- **Application** (Annexure A data, KYC pack, nominee)
- **Appraisal** (Annexure B: 5 gates, limit calc, risk, evidence) — *editable by Credit*
- **Sanction** (7 checks, decision, signature ladder, CSR entry, exception) — *editable by SC*
- **Documents** (PoA/Tri‑Party/SH‑4/CDSL/Term Sheet/Agreement/BVL/Checklist, each a state card) — *editable by Compliance*
- **Disbursement** (SAP code, bank‑detail match, two‑step authorise) — *editable by Treasury*
- **Repayment** (ledger, schedule, DPD, invoices, default ladder)
- **Audit** (immutable trail)

This is the highest‑leverage move: it turns "20 list pages per role" into "one list (Pipeline) + one detail (Loan File)."

## G.5 Design‑system unification (one language)
Adopt the documented tokens (`theme.css` / design brief) as the **only** source; ban inline hex/px in feature code.
- **Colour:** one primary `#1A3C2A`, one secondary `#2D7A4F`, **one** accent `#1E88E5` (retire `#0C5FA5`). Status colours reserved strictly for status (success/warning/error/info/gold per brief). Backgrounds neutral; colour earns attention.
- **Type:** Inter + Noto Sans Devanagari; **two** weights for 95% of UI (400 body, 600 emphasis); 700 only for page titles. Retire `font-weight:900`. Monospace numerals for money/IDs only.
- **Radius/elevation:** one radius scale (e.g. 8/12/16) and one shadow scale. Pick *either* the soft farmer style *or* a single shared card style — recommend a **calm shared card** (12px radius, subtle border, 1 shadow level) used everywhere; let the farmer hero be the *only* gradient flourish.
- **Spacing:** 4‑pt scale; standard page padding; standard table row height (e.g. 44px) and header.
- **Components:** one `StatusBadge` driven by the **state machine enum** (F.1), one `DataTable` (with built‑in empty/loading/error from `TableStates`), one `StageTracker`, one `SignatureLadder`, one `DocumentStateCard`, one `MetricCard`, one `GateBanner` (the "blocked because X, do Y" pattern). Build once in `shared/`, delete the per‑file reimplementations.
- **Responsive:** replace the `Shell.tsx` CSS‑override blob (C8) with token‑driven responsive components / Tailwind breakpoints.

## G.6 Status & gate system (make the SOP visible)
- Centralise the **status enum** and render every chip from it (fixes C13).
- Build a single **`GateBanner`**: "🔒 Disbursement blocked — Checklist not fully signed (2 of 4). Required: Sanction Committee signature." Reuse for all 10 SOP gates (A.5). This is both UX and compliance.
- **Signature ladder** component renders the authority matrix and "what each signature signifies" directly (Stage 4 checklist, Stage 3 counter‑signature, Stage 5 two‑step).

## G.7 Farmer surface (keep calm, tighten)
Already the best part. Keep the one‑hero / one‑action model. Changes: align its tokens to the unified system (so it stops looking like a different app), keep the gradient hero as the single flourish, ensure every status is plain‑language + bilingual, and make the 6‑stage tracker the same component used in the back‑office (shared object, shared truth).

## G.8 Phased roadmap

**Phase 0 — Foundations (parallel, ~1 wk).** Lock tokens in `theme.css`; codify the status enum + state machine; build the shared component kit (StatusBadge, DataTable+TableStates, StageTracker, GateBanner, SignatureLadder, DocumentStateCard, MetricCard). No screen changes yet.

**Phase 1 — Quick wins / "stop the overwhelm" (~1–2 wks).**
- Collapse each role's sidebar to ≤5 items; move sibling registers under a tabbed **Registers** page; demote duplicate dashboard CTAs to one focus card. (Pure IA/nav; high perceived impact, low risk.)
- Retire `font-weight:900` and the second blue globally (find‑replace + token map).
- Add `GateBanner` to the disbursement and submit‑to‑SC gates.

**Phase 2 — Shared Loan File + Pipeline (~2–4 wks).** Introduce real nested routes; build the Pipeline board and the tabbed Loan File; migrate the mega‑operations components' content into Loan‑File tabs. Delete redundant list pages as their content moves.

**Phase 3 — Role landings + Compliance cockpit (~2–3 wks).** Rebuild each "Today / My Work" to the G.3 pattern; assemble the Compliance/Admin cockpit (s.186, NBFC, re‑KYC, stamp, grievance, security return, money‑lending) as alert‑driven cards.

**Phase 4 — Polish & a11y (~1–2 wks).** Token‑driven responsive; replace the Shell override blob; full keyboard/contrast pass; empty/loading/error states everywhere; bilingual copy review.

## G.9 Definition of done (how we know it's fixed)
- Every role's primary nav ≤ 5 items; door‑to‑room ratio ≈ 1:1.
- Every back‑office role lands on **one** prioritised worklist with **one** primary CTA above the fold.
- One design language: zero inline hex in feature components; ≤3 type weights; one accent.
- One shared Loan File reachable by all roles; sibling list pages gone.
- All 10 SOP gates render as `GateBanner` with rule + unblock action.
- Every status chip maps to the single state machine; the 6‑stage tracker is one shared component used farmer + back‑office.

---

## Appendix — Quick‑win checklist (do these first)
1. Sidebar to ≤5 items/role; registers → tabs.
2. One dashboard focus card; remove duplicate CTA grids.
3. Kill `font-weight:900`; retire `#0C5FA5` → `#1E88E5`.
4. Centralise status enum + `StatusBadge`.
5. `GateBanner` on disbursement + submit‑to‑SC.
6. Move `formatCurrency` + tokens to shared utils; stop redefining per file.
7. Wire `TableStates` (empty/loading/error) into every table.
8. Align farmer tokens to the unified palette (one accent, one card style).

---
*This document is the research + plan. The next deliverable can be (a) a clickable IA/nav map, (b) the shared component‑kit spec, or (c) a screen‑by‑screen redline of the top 6 screens — say which and I'll produce it.*
