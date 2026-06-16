# SFPCL WhatsLoan — Cross-Role Integration & Missing Connections
## Figma Design Gaps, Handoff Points & Platform-Level Improvements
**Document Type:** Integration Audit & Supplementary Design Specification
**Covers:** All 5 Role Prompts — Farmer · Credit Team · Compliance/CS · Sanction Committee · Treasury
**Reference:** SOP_SFPCL_LOANDISBURSEMENT v1.0 | WhatsLoan Platform v1.0
**Prepared:** June 2026

---

## HOW TO USE THIS DOCUMENT

Each role prompt was written in isolation to keep its scope clean. That isolation created **gaps at the seams** — the moments when one role hands work to the next. This document identifies every one of those seams, specifies what the handoff UI must look like on both sides, and captures platform-level components and rules that belong to no single role but must be consistent across all of them.

This document is the **sixth design file** — it sits alongside the five role files in the Figma project and should be referenced when designing any screen where a role receives work from, or sends work to, another role.

---

## PART A — DESIGN SYSTEM CONFLICTS TO RESOLVE

The five prompts were written by different authors and introduced minor inconsistencies in the design language. These must be resolved before the Figma file is structured, or every component will need rework.

---

### A-1: Typography — Two Font Stacks in Use

| Role Prompt | Heading Font Specified | Body Font | Mono Font |
|---|---|---|---|
| Farmer | Inter | Inter | Roboto Mono |
| Credit Team | **DM Sans Bold** | Inter | **JetBrains Mono** |
| Compliance/CS | **DM Sans Bold** | Inter | Roboto Mono |
| Sanction Committee | Inter Bold | Inter | Roboto Mono |
| Treasury | Inter | Inter | Roboto Mono |

**Problem:** Credit Team and CS prompts introduce DM Sans Bold and JetBrains Mono, which are absent from the global design brief. The brief specifies Inter for all weights and Roboto Mono for monospace.

**Resolution — One Font Stack for the Entire Platform:**

| Token | Font | Size | Weight | Usage |
|---|---|---|---|---|
| Headings (`display-xl` through `heading-sm`) | **Inter** | per token scale | 600–700 | All roles |
| Body (`body-lg` through `body-sm`) | **Inter** | per token scale | 400 | All roles |
| Labels (`label-md`, `label-sm`) | **Inter** | per token scale | 500 | All roles |
| Monospace (`mono-md`, `mono-sm`) | **Roboto Mono** | 14px / 12px | 400 | Loan IDs, amounts, PAN, Aadhaar, SAP codes |

DM Sans and JetBrains Mono are **not used**. In Figma: all text styles should already be created from the global brief. Credit Team and CS frames must switch to the platform-wide Inter stack. The visual difference is marginal — Inter Bold at 24px is equally professional.

---

### A-2: Semantic Color Values — Spot Differences

| Concern | Credit Team Prompt | Platform Brief / Others |
|---|---|---|
| Approved/Active green | `#2E7D32` | `#22C55E` (success-500) |
| Rejected/Error red | `#C62828` | `#EF4444` (error-500) |
| Info/Pending | `#1565C0` | `#3B82F6` (info-500) |
| Warning | `#E65100` (burnt orange) | `#F59E0B` (warning-500) |
| Sidebar green | `#1A3C2B` (extra B) | `#1A3C2A` (brand-primary) |
| WhatsLoan accent | `#0C5FA5` / `#3A8FD8` | `#1E88E5` (brand-accent) |

**Resolution:** Use the global design brief token values universally. Do not introduce the Credit Team's deeper hex variants — they will create visual inconsistency when a Credit Manager screen links to a Sanction Committee screen or a shared loan profile.

**Annotation 🔴:** Create a shared Figma library page `0-Design-System-Tokens` with all color styles defined once. Every frame across all role files links to this shared library. No hard-coded hex values in any component.

---

### A-3: Card Border Radius — Two Systems

| Prompt | Card Radius | Input Radius | Badge Radius |
|---|---|---|---|
| Global Brief | 16px (xl) cards | 8px inputs | 4px |
| Credit Team | 8px cards | 6px inputs | 4px |
| CS | 8px cards | — | 4px |

**Resolution:** Use the global brief radius tokens. `radius-xl: 16px` for stat cards and hero elements. `radius-md: 8px` for regular cards, panels, and inputs. The Credit Team's 8px cards are acceptable as `radius-md` panels (not stat cards) — this is a visual hierarchy difference, not a conflict.

---

## PART B — CROSS-ROLE HANDOFF POINTS (THE SEAMS)

These are the 8 moments where one role finishes work and another role picks it up. Each handoff currently has no design specification for how the **receiving role's screen** is updated, or what the **sending role's screen** shows as confirmation.

---

### HANDOFF 1: Farmer Submits Application → Credit Team Receives It

**Farmer side (FAR-F2 Success Screen):**
Currently shows a generic success state. It should also show:
- Application reference number `LO00000047` prominently (mono-md)
- Message: `"Your application has been received by our Credit Team. You'll hear back within 2 working days."` (body-md)
- Farmer's 6-stage tracker updated to: Stage 1 `"Application Submitted"` — active/green node
- **Missing:** No mention of what the farmer should expect next, or that the Credit Team will contact them if documents are missing

**Credit Team side (C-1 Dashboard / C-2 Application Inbox):**
- New application should appear in the inbox immediately (WebSocket push or max 5-min polling)
- Row added to Application Inbox table with status `"New — Unreviewed"` (info-500 pill)
- Notification bell: `"New application — Priya Shinde — LO000091 received"`
- **Missing from Credit Team prompt:** No specification for the "Add Manual Application" path — when a farmer applies offline (physically at the office). Needs its own entry flow in C-2, distinct from the digital application receipt.

**Design needed (new frame):**
`C-2-ApplicationInbox-ManualEntry-Form` — A Credit Officer data-entry form to manually create a loan application record on behalf of a farmer who applied offline. Fields mirror the farmer application form but are entered by the Credit Officer. Should auto-assign a reference number and trigger the same downstream workflow.

---

### HANDOFF 2: Credit Team Submits Appraisal Note → Sanction Committee Receives It

**Credit Team side (C-3 Appraisal Note — "Submit to Sanction Committee" CTA):**
Currently shows a submit button. Missing:
- **Confirmation modal** before submission: `"You are submitting LO000091 to the Sanction Committee. The appraisal note will be locked and cannot be edited after submission. Confirm?"` + [Confirm] [Cancel]
- After confirmation: application row in Credit Team inbox moves to `"Submitted to SC"` status column
- A timestamp + `"Submitted by: [Credit Manager name]"` auto-appended to the appraisal note footer

**Sanction Committee side (SC-1 Dashboard / Approval Queue):**
- New item appears in `"Awaiting My Approval"` queue with entry timestamp
- Notification: `"New appraisal note ready — LO000091 — Priya Shinde — ₹60,000 — prepared by Amit Kulkarni"`
- **Missing:** The SC prompt does not specify the `"Days Waiting"` counter origin. It should start from the Credit Team submission timestamp, not the original application date.

**Design needed (shared rule):**
`"Days Waiting"` counter used in both Credit Team inbox and SC approval queue must share the same definition. Specify in a global annotation: `Days Waiting = (today's date) − (timestamp of stage entry)`. The counter resets when the item moves to the next stage.

---

### HANDOFF 3: SC Approves Loan → Compliance/CS Team Receives It

**SC side (SC-2 Success State — Approved):**
Currently shows a success micro-animation and a `"Go to Queue"` button. Missing:
- Explicit confirmation that CS team has been notified: `"Documentation team notified ✓"` (success-100 banner)
- No mention of the Credit Sanction Register being updated (it should show auto-update confirmation)

**CS side (CS-1 Dashboard — Doc Queue):**
Currently shows documents pending action. Missing:
- **What triggers a new item in the CS Document Queue?** The CS prompt says `"New loan approved by SC"` as a notification trigger, but does not define what the CS sees on first opening a newly-approved loan's Document Workspace.
- The Document Workspace (CS-2) should have an **initial state** for newly-arrived loans: all document tabs in `"Not Started"` state, with a clear `"Where to begin"` guidance strip at top: `"Start with PoA → then Tri-Party Agreement → then SH-4/CDSL → Term Sheet → Loan Agreement → Bank Verification → Checklist"` — an ordered flow indicator, not just a tab set.

**Design needed (new frame):**
`CS-2-DocumentWorkspace-NewLoan-Initial` — The zero state of the Document Workspace when a loan first arrives from SC approval. All tabs grey/pending with an ordered start guide.

**SC → CS data passed (define explicitly for Figma annotation):**
The CS Document Workspace auto-populates fields from the loan application and appraisal note. Define what data flows:
- Borrower name, address, folio number, nominee details → auto-fill in PoA and Loan Agreement
- Share type (Physical vs D-MAT) from member registry → determines SH-4 tab vs CDSL tab visibility
- Approved loan amount, interest rate, tenure → auto-fill in Term Sheet
- Subsidiary company (from farmer's supply chain registration) → auto-fill in Tri-Party Agreement
- `"Loan >₹5L flag"` → auto-adds CFO + 2 Director signature blocks to Term Sheet

---

### HANDOFF 4: CS Completes Document File → Returns to SC for Final Approval

**CS side (CS-2 Checklist Tab — "Submit Complete File to Sanction Committee" CTA):**
The CS prompt specifies this button is disabled until all 15 docs are checked + CS signature. Missing:
- After CS signs and submits: the file goes back to SC for "final approval of the loan and for further loan disbursement" per SOP §4.13. This **second SC touchpoint** is entirely missing from the SC prompt.
- The SC receives the complete document file, a director signs the checklist, and then releases it to Treasury.

**SC side — Missing Screen:**
The SC prompt covers Stage 3 (initial sanction) but does not cover the **Stage 4 final checklist sign-off** that sends the file to Treasury. This is a distinct action from the initial approval. A dedicated screen or modal is needed:

**Design needed (new frame):**
`SC-9-DocumentChecklist-FinalSignOff` — A lightweight screen (not the full 3-column review) showing:
- Loan ID + Borrower + Approved Amount (read-only banner)
- CS checklist (all 15 items, read-only) with CS's sign-off timestamp
- Single action: Director signs the checklist `"[Sign Checklist — Final Disbursement Approval]"` — purple SC button
- Annotation 🟡: `"This is the second SC action per SOP §4.13. It occurs after CS document preparation, not during the appraisal review. Routing: CS submits → SC Director signs → Treasury receives file."`

---

### HANDOFF 5: SC Signs Checklist → Treasury Receives Disbursement File

**SC side (SC-9 new frame above):**
After Director signs the checklist, confirmation: `"File released to Treasury. Senior Manager – Finance has been notified."` (success banner)

**Treasury side (T-1 Dashboard / T-2 Disbursement Queue):**
Currently shows `"Pending Disbursement"` queue. Missing:
- What information arrives when a new file enters the Treasury queue? Treasury needs to be able to verify all 5 pre-flight checklist items without navigating away from the disbursement screen.
- **The 5 pre-flight gates in T-2 Step 1 must link to the actual source documents** — not just show a green ✅ badge. Each gate should have a `[View →]` link:
  - CS signature → opens CS-signed checklist PDF in a modal
  - Credit Manager signature → opens appraisal note summary
  - SC signature → opens sanction register entry
  - Documents count → opens document index (15-item list with status)
  - SAP code → opens SAP creation log entry

**Design needed (enhanced frame):**
`T-2-Disbursement-Step1-Preflight-WithDocLinks` — Same as existing Step 1 spec but each gate row includes a right-aligned `[View Document]` text link (cyan, body-sm) that opens the relevant record in a read-only modal.

---

### HANDOFF 6: Treasury Disburses → Farmer is Notified + CS Archives

**Treasury side (T-2 Step 6 Complete):**
Currently shows auto-actions confirmed with checkmarks. The two receiving-side experiences are not specified:

**Farmer side — Disbursement notification:**
The Farmer prompt (FAR-F3 Loan Detail — Timeline tab) lists `"Disbursed"` as a timeline node. Missing:
- What does the farmer's dashboard look like the **moment** disbursement completes?
- The hero loan card on FAR-F1 must transition from `"Under Process"` state to `"Active Loan"` state, with:
  - New outstanding balance displayed: `"₹2,00,000"` (since nothing repaid yet)
  - Disbursement date shown
  - `"Repayment due: [first due date from term sheet]"` pill
  - An in-app notification: `"Your loan of ₹2,00,000 has been disbursed to your SBI account XXXX-4821. Repayment begins [date]."`
  - An SMS is also triggered (mention in annotation but don't design the SMS)

**CS side — Post-disbursement archive trigger:**
The CS prompt mentions archiving at loan closure (8-year rule) but not the post-disbursement archival of the document file. Per SOP §4.13, the Senior Manager – Finance's signature on the checklist completes the document set. At that point:
- CS should receive a notification: `"LO000047 disbursed — Checklist now complete with Finance sign-off. Archive document file."`
- CS action: A one-click `"Archive File"` button on the loan's Document Workspace, which moves the file from `"Active"` to `"Archived (Disbursed)"` status — still accessible, just filed.

**Design needed (new frame):**
`CS-2-DocumentWorkspace-PostDisbursement-Archive` — The Document Workspace after disbursement, showing the complete 4-signature checklist (CS + Credit Manager + SC + Finance) with an `"Archive Document File"` CTA.

---

### HANDOFF 7: Farmer Makes Repayment → Treasury Posts → Credit Team Updates Loan Register

**Farmer side (FAR-F4 Make Payment):**
Currently ends with a success state showing the UTR reference. Missing:
- **What does the farmer see on their loan detail after the repayment is recorded?**
- The outstanding balance on FAR-F3 and FAR-F1 hero card should update after SAP posting (next working day per SOP). Until it updates, a `"Payment processing"` intermediate state is needed:
  - Hero card: Amount shows `"₹1,17,500 (payment processing)"` with an amber clock icon
  - Once SAP entry is confirmed: balance updates to `₹1,17,500` and the clock icon disappears

**Treasury side (T-4a Direct Payments):**
Currently has `"Post to SAP"` action. Missing:
- After posting, the SAP doc number should be written back to the payment record (visible in the table row)
- A trigger should fire to the Credit Team: `"Repayment posted — LO000031 — ₹25,000 — SAP Ref: 1400000235"`

**Credit Team side (C-4 Loan Register):**
When Treasury posts the SAP entry, the Credit Manager's Loan Register should auto-update:
- Outstanding Principal reduced
- Last Payment Date updated
- DPD reset if it was in arrears
- The Credit Manager prompt specifies a SAP notification: `"[SAP Confirmed] Customer Code created for..."` — this pattern should extend to repayment confirmations

**Design needed (shared notification spec):**
Define a `"Repayment Confirmed"` notification type that fires to both Farmer and Credit Manager when Treasury posts the SAP repayment entry. Format:
- To Farmer: `"Payment of ₹25,000 confirmed. Outstanding balance: ₹1,17,500. Ref: SAP-1400000235"` (in-app + SMS)
- To Credit Manager: `"Repayment posted — Ramesh Patil — LO000031 — ₹25,000 — New balance: ₹1,17,500"` (in-app)

---

### HANDOFF 8: Farmer Fully Repays → CS Issues NOC → Farmer Receives NOC

**Treasury side (T-4a):**
When outstanding balance hits ₹0 after a SAP repayment entry, Treasury should see:
- Row changes status to `"Fully Repaid"` (success-500 pill)
- Automatic trigger to CS: `"LO000031 — fully repaid — NOC eligible"` notification + queue item added to CS NOC queue
- The Treasury prompt does not mention this trigger. Add annotation 🟡: `"Full repayment detection: when Principal Outstanding + Interest Outstanding = ₹0 after SAP posting, auto-trigger NOC eligibility flag to CS."`

**CS side (CS-5 NOC Queue):**
The CS prompt covers NOC generation but missing:
- The NOC must be digitally delivered to the farmer via the platform — not just generated as a PDF for the CS to manually email
- After generating the NOC, CS clicks `"Send to Farmer"` → the farmer receives the document in their FAR-F5 Documents section AND via email

**Farmer side (FAR-F7 NOC Screen):**
The farmer prompt covers the NOC receipt screen. Missing:
- The farmer should also see the loan move from `"Active"` to `"Closed"` in their loan history (FAR-F8)
- The hero card on FAR-F1 should show an empty state with a `"View Closed Loans"` link (not the confetti screen again — per the farmer prompt's annotation)
- Security return confirmation: When SH-4 and blank cheque are physically returned to the farmer, CS logs this in the Security Return Log. The farmer should receive a confirmation notification: `"Your share transfer form (SH-4) and security cheque have been returned. Your loan is fully closed."`

---

## PART C — SHARED COMPONENTS NOT SPECIFIED IN ANY ROLE PROMPT

These components are referenced or implied in multiple role prompts but never fully specified. They must be designed once and shared across all roles.

---

### C-1: The Universal Loan Audit Trail

Every role prompt mentions an audit trail but each defines it differently. This needs one shared specification.

**Shared Audit Trail Panel**
Available as a right-drawer (480px) from any screen where a Loan ID appears. Accessible by Credit Team (full), CS (full), SC (read-only), Treasury (read-only), Farmer (restricted version — no internal notes or risk scores).

**Columns:** Timestamp | Role | Actor Name | Stage | Action | Entity | Details

**All events captured:**
| Event | Actor Role | Stage |
|---|---|---|
| Application submitted | Farmer | Stage 1 |
| Application reference issued | Credit Officer | Stage 1 |
| Appraisal Note prepared | Credit Officer | Stage 2 |
| Appraisal Note reviewed | Credit Manager | Stage 2 |
| Submitted to Sanction Committee | Credit Manager | Stage 2 |
| SC review opened | CFO / Director | Stage 3 |
| 7-point checklist completed | CFO / Director | Stage 3 |
| Loan sanctioned / rejected / returned | CFO / Director | Stage 3 |
| Credit Sanction Register updated | System (auto) | Stage 3 |
| CS Document Workspace opened | CS | Stage 4 |
| Each document executed (PoA, SH-4, etc.) | CS | Stage 4 |
| Director checklist sign-off | Director | Stage 4 |
| SAP Customer Code created | Finance Manager | Stage 5 |
| Disbursement pre-flight verified | Finance Manager | Stage 5 |
| Payment initiated | Finance Manager | Stage 5 |
| Payment authorized | Finance Controller | Stage 5 |
| SAP disbursement entry posted | Finance Manager | Stage 5 |
| Disbursement advice sent to farmer | System (auto) | Stage 5 |
| Repayment received | Treasury / Subsidiary | Stage 6 |
| SAP repayment entry posted | Finance Manager | Stage 6 |
| Interest accrual posted | Finance Manager | Stage 6 |
| Interest capitalized | Finance Manager | Stage 6 |
| Default grace period started | System (auto) | Stage 6 |
| Extension granted | Credit Manager | Stage 6 |
| Security invocation authorized | SC | Stage 6 |
| Full repayment confirmed | Treasury | Stage 6 |
| NOC issued | CS | Stage 6 |
| Security returned (SH-4 + cheque) | CS | Stage 6 |
| Documents archived (8-year) | CS | Stage 6 |

**Farmer-restricted view:** Excludes internal notes, risk scores, SC deliberation comments, and Credit Manager internal appraisal remarks. Shows only public-facing status transitions.

**Frame naming:** `SHARED-AuditTrail-FullView` | `SHARED-AuditTrail-FarmerView`

---

### C-2: The Universal 6-Stage Loan Tracker

Every role sees this tracker but in different contexts. It needs one shared design, used across all roles with role-specific rendering rules.

**Tracker anatomy (horizontal, 6 nodes):**
```
●────────────────●────────────────●────────────────●────────────────●────────────────●
1                2                3                4                5                6
Application      Credit           Sanction         Documentation    Disbursed        Closed
Submitted        Assessment       Approved
```

**Node states:**
- `Completed`: filled circle, success-500, white checkmark inside
- `Active` (current stage): filled circle, brand-primary, white stage number inside, subtle pulsing ring animation
- `Upcoming`: hollow circle, neutral-300 border
- Connecting line: solid success-500 between completed nodes, dashed neutral-300 between future nodes

**Per-node click behavior (all roles except Farmer):**
Click any completed node → opens a mini panel showing: who acted at that stage, what was decided, timestamp. Farmer version: shows only stage name + completion date — no actor details.

**Responsive behavior:**
- Desktop (1440): Full horizontal with labels below each node
- Tablet: Horizontal, labels hidden, tooltip on hover
- Mobile (Farmer only): Vertical stepper (one node per row)

**Frame naming:** `SHARED-StagTracker-Default` | `SHARED-StageTracker-Stage3-Active` | `SHARED-StageTracker-AllComplete` | `SHARED-StageTracker-Vertical-Mobile`

---

### C-3: The Universal Member / Loan Profile Page

Specified in the design brief as a shared screen. Each role prompt references it but none defines it completely. The Credit Team prompt gives the best version (the contextual farmer profile sidebar). Here is the complete shared spec:

**Access:** Credit Team (edit), CS (edit KYC fields only), SC (read-only), Treasury (read-only), Farmer (own profile only)

**Page Header (80px):**
- Left: 48px avatar (initials, role-color bg) | Member Name (heading-md) | `"Active Member ✅"` or `"Inactive ⚠️"` badge
- Row 2: Member ID (mono-sm) | Folio No. (mono-sm) | `"Member since [year]"` (body-sm, neutral-400) | Crop type + village (body-sm, neutral-400)
- Right: `"View Audit Log"` ghost button | `"New Loan →"` primary button (Credit Team only)

**Five Tabs:**
1. **Personal Details** — name, address, contact, nominee details (editable by Credit Team)
2. **Shareholding** — shares owned, current NAV, D-MAT vs Physical, pledge status, folio history
3. **Loan History** — table: all loans, amounts, dates, status, DPD, repayment track record
4. **KYC Documents** — PAN, Aadhaar, land records, bank statement, CKYC identifier, re-KYC due date
5. **Compliance Notes** — internal notes added by CS (not visible to Farmer), special case flags, GM resolution status

**Frame naming:**
`SHARED-MemberProfile-PersonalTab-CreditView`
`SHARED-MemberProfile-ShareholdingTab`
`SHARED-MemberProfile-LoanHistoryTab`
`SHARED-MemberProfile-KYCTab-CSEdit`
`SHARED-MemberProfile-ComplianceTab`

---

### C-4: The Director/Relative Special Case — Multi-Role Flow

The director-as-borrower scenario is mentioned in every role prompt but the **cross-role flow** is never specified end to end.

**How it flows across roles:**

**Stage 1 — Detection (Credit Team, C-3 Appraisal Note):**
When the Credit Manager checks the `"Active member of FPC"` eligibility item, a system flag triggers if the borrower's member ID matches a Director record. A `gold-500` warning banner appears:
```
⚠️ SPECIAL CASE — DIRECTOR / RELATIVE BORROWER
This applicant is identified as [Director Name] / a relative of [Director Name].
Per Section 378ZK, this loan requires approval at a General Meeting before sanction.
[ Upload GM Resolution ] [ Learn More ]
```
The Credit Manager cannot submit to SC until a GM resolution is uploaded OR the system receives a confirmed `"GM Approval Pending"` flag with a scheduled date.

**Stage 2 — SC Routing (Sanction Committee, SC-4):**
The SC sees the same gold-500 flag. The affected Director's account is automatically blocked from viewing or acting on this loan (system-enforced per SOP §3.2). The remaining SC members see a modified approval queue item labelled `"Special Case — GM Required"`.

- If GM resolution uploaded: SC reviews normally (minus affected Director)
- If not: loan stays in `"Special Case — Blocked"` status until GM resolves

**Stage 3 — CS Compliance Note (CS, CS-EC1):**
After GM approval, CS logs the resolution in the loan's Compliance Notes tab (Member Profile). The Document Workspace adds an extra tab: `"GM Resolution"` — for uploading and archiving the resolution document.

**Design needed — 3 new cross-role frames:**
- `SHARED-DirectorCase-DetectionBanner` (reusable banner component used in C-3, SC-4, CS-EC1)
- `SHARED-DirectorCase-GMResolution-Upload` (modal, usable from Credit Team and CS contexts)
- `SHARED-DirectorCase-BlockedDirectorView` (what the affected Director sees when they try to access the loan: `"You are excluded from reviewing this loan per Section 378ZK. Contact the CFO."`)

---

### C-5: The Notification Architecture — Unified Specification

Each role prompt lists notification triggers in isolation. Consolidated here as the platform-wide notification contract. All notifications route through a single system.

**Global Notification Structure:**
Each notification object contains:
- `id` — unique
- `type` — one of: `approval_required | document_action | repayment | compliance | system | info`
- `priority` — `critical | high | medium | low`
- `from_role` — who triggered it
- `to_role` — who receives it (can be multiple)
- `loan_id` — linked entity
- `message` — short (bell dropdown)
- `detail` — long (full notifications page)
- `cta_label` + `cta_route` — action button

**Master Notification Matrix (all cross-role events):**

| Trigger | From Role | To Role(s) | Priority | CTA |
|---|---|---|---|---|
| Application submitted | Farmer | Credit Team | High | Review Application |
| Application incomplete — docs missing | Credit Team | Farmer | Medium | Complete Documents |
| Appraisal Note submitted to SC | Credit Team | Sanction Committee | High | Review Application |
| SC Decision: Approved | SC | CS Team, Credit Team, Farmer | High | Begin Documentation / View Status |
| SC Decision: Rejected | SC | Credit Team, Farmer | High | View Reason |
| SC Decision: Returned | SC | Credit Team | High | Revise Appraisal |
| Document file ready — submitted to SC | CS | Sanction Committee | High | Sign Checklist |
| Director checklist signed — to Treasury | SC / Director | Finance Manager | Critical | Initiate Disbursement |
| SAP code created | Finance Manager | Credit Manager | Medium | Confirm |
| Disbursement initiated | Finance Manager | Finance Controller | Critical | Authorize Payment |
| Payment authorized | Finance Controller | Finance Manager | High | Confirm SAP Entry |
| Disbursement complete | Finance Manager | Farmer, CS, Credit Manager | High | View Loan Details |
| Repayment received (direct) | System/Bank | Finance Manager | Medium | Post to SAP |
| Repayment posted to SAP | Finance Manager | Credit Manager, Farmer | Medium | View Updated Balance |
| Subsidiary deduction transferred | Subsidiary (System) | Finance Manager | Medium | Reconcile |
| DPD 365 days reached | System | Credit Manager, CFO | High | Review Default |
| Grace period expiring in 7 days | System | Credit Manager, CFO | Critical | Take Action |
| Extension granted | Credit Manager | Farmer, CFO | Medium | View New Terms |
| Security invocation authorized | SC | CS | Critical | Execute Invocation |
| Full repayment confirmed | Finance Manager | CS, Credit Manager, Farmer | High | Issue NOC |
| NOC issued | CS | Farmer | High | Download NOC |
| KYC expiry in 14 days | System | CS, Credit Team, Farmer | High | Renew KYC |
| Interest rate changed | System | Farmer (all active loans) | High | View New Rate |
| s.186 limit at 85% | System | CFO | Critical | Review Exposure |
| NBFC ratio at 40% | System | CFO | Critical | Review Ratios |

**Annotation 🔴:** Every notification that triggers a navigation (CTA) must deep-link directly to the relevant entity — not to a dashboard. `"Review Application"` → opens the specific loan in the recipient's queue, pre-selected. Never route to a generic list.

---

### C-6: The Interest Rate Change Propagation

The Farmer prompt mentions an interest rate change banner. The CS prompt mentions interest disclosure. The Credit Team prompt mentions a `"Rate Change"` notification. Treasury manages floating rate accruals. No single prompt defines what happens when the rate changes across the system.

**Rate Change Flow (platform-wide):**

1. **Trigger:** Admin updates the interest rate in System Configuration (Super Admin screen A-3)
2. **System identifies:** All active loans with floating rate (all loans per SOP)
3. **CS action required:** CS must send written intimation to each affected borrower per SOP §6.1. The CS Compliance Calendar should show `"Interest Rate Change Intimation — [N] letters pending"` as a new compliance task.
4. **Farmer notification:** In-app banner (interest rate change type) + SMS trigger
5. **Credit Team notification:** Bell notification + the Loan Register should auto-reflect the new rate for all active loans from the effective date
6. **Treasury:** Interest accrual entries from the effective date forward use the new rate automatically (annotation for SAP integration)

**Design needed (new frame):**
`SHARED-RateChange-AdminBroadcast-Modal` — When the Super Admin saves a new interest rate, a confirmation modal appears: `"Changing rate from 12% to 13% p.a. will affect [47] active loans effective [date]. Farmer notifications will be sent automatically. CS intimation letters must be prepared manually. Confirm?"` [Confirm Rate Change] [Cancel]

---

### C-7: The s.186 Limit — System-Wide Lending Lock

The Sanction Committee prompt specifies an s.186 monitor but the system-wide consequence of hitting the cap is only partially specified.

**When s.186 limit is reached (100% used):**
- **SC screen:** A full-width `error-500` banner on ALL SC screens: `"⛔ LENDING SUSPENDED — s.186 limit reached. New loans cannot be sanctioned until Board passes a special resolution or outstanding loans reduce the exposure below the cap. Board Secretary has been notified."`
- **Credit Team screen:** A warning banner on the Dashboard and Application Inbox: `"⚠️ New loan approvals are suspended — s.186 statutory limit reached. Existing applications in queue are paused. Contact CFO."`
- **Farmer portal:** If a farmer submits a new application while the limit is active, the submission succeeds (application is received) but immediately shows a status: `"Your application is received and placed in a hold queue. We are currently processing a regulatory compliance matter and will resume processing within [X days]. You will be notified."`
- **Admin trigger:** The Super Admin can toggle `"Lending Suspended"` status manually, with a mandatory reason field. This toggle is visible to CFO only.

**Frame naming:**
`SHARED-s186Lock-SCBanner` | `SHARED-s186Lock-CreditTeamBanner` | `SHARED-s186Lock-FarmerHoldStatus`

---

## PART D — MISSING SCREENS INVENTORY

A consolidated list of all screens that are implied or referenced across the five role prompts but never designed.

| Screen ID | Description | Primary Role | Triggered By | Status |
|---|---|---|---|---|
| C-2-ManualEntry-Form | Credit Officer manually enters offline application | Credit Team | Farmer applies physically at office | Missing |
| SC-9-DocumentChecklist-FinalSignOff | SC Director signs checklist post-CS documentation | Sanction Committee | CS submits complete document file | Missing |
| CS-2-DocumentWorkspace-NewLoan-Initial | First-open state of Document Workspace for new SC-approved loan | CS | SC approval received | Missing |
| CS-2-DocumentWorkspace-PostDisbursement-Archive | Archive trigger view after Finance sign-off completes checklist | CS | Disbursement confirmed by Treasury | Missing |
| T-2-Step1-WithDocLinks | Preflight checklist with clickable document verification links | Treasury | Opening any new disbursement file | Missing |
| SHARED-AuditTrail-FullView | Universal audit trail drawer, all roles | All | Any Loan ID click | Missing |
| SHARED-AuditTrail-FarmerView | Farmer-safe audit trail (internal details redacted) | Farmer | Loan status screen | Missing |
| SHARED-StageTracker-Vertical-Mobile | Mobile vertical stage tracker | Farmer (Mobile) | FAR-F3 Loan Detail (mobile) | Missing |
| SHARED-MemberProfile-5tabs | Fully specced shared member profile page (all 5 tabs) | Credit Team, CS, SC, Treasury | Member name click | Missing |
| SHARED-DirectorCase-DetectionBanner | Gold warning banner component for director-as-borrower | Credit Team, SC, CS | Borrower match against director registry | Missing |
| SHARED-DirectorCase-GMResolution-Upload | GM resolution upload modal | Credit Team, CS | Director case detected | Missing |
| SHARED-DirectorCase-BlockedView | View shown to excluded Director trying to access their relative's loan | Sanction Committee | System routing check | Missing |
| SHARED-RateChange-AdminBroadcast-Modal | Rate change confirmation modal with affected loans count | Super Admin | Interest rate update | Missing |
| SHARED-s186Lock-SCBanner | System-wide lending suspension banner | SC | s.186 threshold breach | Missing |
| SHARED-s186Lock-CreditTeamBanner | Same banner for Credit Team context | Credit Team | s.186 threshold breach | Missing |
| FAR-F1-PostDisbursement-Transition | Dashboard state immediately after disbursement completes | Farmer | Treasury confirms disbursement | Missing |
| FAR-F1-RepaymentProcessing | Intermediate state: payment submitted but SAP not yet posted | Farmer | FAR-F4 payment submission | Missing |
| FAR-F3-FullyRepaid-BeforeNOC | Loan detail state after full repayment, before NOC | Farmer | Treasury confirms full repayment | Missing |
| FAR-F5-NOC-Delivered | Documents screen after NOC is delivered by CS | Farmer | CS sends NOC via platform | Missing |

---

## PART E — PROTOTYPE FLOWS THAT CROSS ROLE BOUNDARIES

Each role prompt defines its own prototype flow but stops at the role boundary. These cross-role flows must be built in Figma as connected flows spanning multiple role pages.

---

### FLOW X-1: Complete Loan Lifecycle (End-to-End)
The master prototype. One continuous flow through all 6 stages.

```
[FARMER]
FAR-F2-Application-Step1 → Step2 → Step3 → Step4 → Step5 → Success
  ↓ Application submitted notification
[CREDIT TEAM]
C-2-ApplicationInbox-NewItem → C-3-AppraisalNote-Preparation → C-3-Submit-ConfirmModal
  ↓ Submitted to SC notification
[SANCTION COMMITTEE]
SC-1-Dashboard-NewItem → SC-2-ReviewScreen → SC-2-Checklist-Complete → SC-2-Approve
  ↓ Approved notification → CS + Farmer
[FARMER]
FAR-F1-Dashboard-LoanUnderProcess → (Stage 3 node turns green on tracker)
[COMPLIANCE / CS]
CS-2-DocumentWorkspace-NewLoan-Initial → PoA → TriParty → SH4 → TermSheet → LoanAgreement → Checklist-CSSignoff
  ↓ File submitted to SC for checklist sign
[SANCTION COMMITTEE]
SC-9-DocumentChecklist-FinalSignOff → Director Signs → Release to Treasury
  ↓ File released notification
[TREASURY]
T-2-Step1-Preflight-AllClear → Step2-BankVerify → Step3-Initiate → Step4-AuthorizeModal → Step5-SAPConfirm → Step6-Complete
  ↓ Disbursement complete notification → Farmer + CS + Credit Team
[FARMER]
FAR-F1-Dashboard-PostDisbursement-ActiveLoan (hero card updated)
```

---

### FLOW X-2: Repayment → Balance Update → Full Repayment → NOC

```
[FARMER]
FAR-F4-MakePayment-DirectTransfer → Submit → FAR-F1-RepaymentProcessing
  ↓ Payment received notification
[TREASURY]
T-4a-DirectPayments-AwaitingSAP → Post to SAP
  ↓ SAP confirmed notification → Farmer + Credit Team
[FARMER]
FAR-F1-Dashboard-ActiveLoan (balance updated to ₹1,17,500)
[CREDIT TEAM]
C-4-LoanRegister (Outstanding Principal auto-updated, Last Payment Date updated)
  ↓ --- [some months later] ---
[TREASURY]
T-4a-DirectPayments (final payment received) → Post to SAP → Full repayment flag
  ↓ NOC eligible trigger → CS
[CS]
CS-5-NOCQueue-NewItem → CS-5-GenerateNOC-Preview → Send to Farmer
  ↓ NOC delivered notification
[FARMER]
FAR-F5-Documents (NOC appears) → FAR-F7-NOC-Issued → FAR-F8-LoanHistory (Closed status)
```

---

### FLOW X-3: Default → Escalation → SC Invocation → CS Execution

```
[CREDIT TEAM]
C-4-LoanRegister-DPDAlert → C-6-DPDReport-1YrBucket (Vilas Jadhav flagged)
  Credit Manager sends payment reminder → 3-month grace period starts
  ↓ (3 months pass) ↓
  Grace period expires → Assess intentionality: Non-Intentional selected
  → Extension granted → Extension Note prepared and saved
  ↓ (1 year extension passes, still unpaid) ↓
  C-4 status → "Non-Recoverable" → "Note for Non-Payment" prepared
  ↓ Escalation notification → SC
[SANCTION COMMITTEE]
SC-8-DefaultEscalation-PendingDecision → SC reviews Note for Non-Payment
  Decision: Invoke SH-4 + Undated Cheque
  "Board approval recorded" checkbox
  ↓ Invocation authorization notification → CS
[CS]
CS-EC2-SecurityInvocation-SH4Path → CS executes share transfer under PoA authority
  CS-EC2-SecurityInvocation-ChequePresentation → CS presents undated cheque
  Recovery logged in Recovery Log
  ↓ If recovery amount received → CS-5 NOC flow (partial closure or adjusted closure)
```

---

### FLOW X-4: Director-as-Borrower Special Case

```
[CREDIT TEAM — C-3-AppraisalNote]
Director flag detected → SHARED-DirectorCase-DetectionBanner appears
Credit Manager uploads GM resolution OR marks "GM Pending"
  ↓ (if GM Pending) ↓
  Application moves to "Special Case — GM Required" status in queue
  ↓ (GM held, resolution passed) ↓
  SHARED-DirectorCase-GMResolution-Upload → resolution uploaded
  Appraisal Note unlocked → Submit to SC
[SANCTION COMMITTEE — SC-4]
Special Case item in queue (gold badge)
Affected Director's account: SHARED-DirectorCase-BlockedView
Remaining SC members review → standard 7-point checklist → Approve
  ↓ Post-approval flow follows standard handoff sequence
```

---

## PART F — GLOBAL ANNOTATION FLAGS (CROSS-ROLE)

These annotations don't belong to any single role's Figma page. Place them on a shared `10-Integration-Notes` page in the Figma file.

### 🔴 Critical Integration Rules
1. **CROSS-01:** The 6-stage status tracker must be the same visual component across all roles and the Farmer portal. Do not create role-specific variants with different node styles. Only the label visibility and click behavior differ per role.
2. **CROSS-02:** Loan IDs (LO00000001 format) must appear in Roboto Mono across every role's screen without exception. This is a platform-wide visual anchor for auditability.
3. **CROSS-03:** A loan's status must be updated in real time (WebSocket or max 5-min polling). A Credit Manager and a Farmer looking at the same loan simultaneously must see the same stage. No stale state.
4. **CROSS-04:** The Director exclusion rule (s.378ZK) must be enforced at the routing layer — not just the UI layer. The UI displays the blocked state, but the API must also refuse to return loan data to the excluded Director. The UI block alone is insufficient.
5. **CROSS-05:** Partial repayment allocation (Principal first, then Interest) is a system rule, not a user choice. No role's screen should allow a user to override this allocation order.

### 🟡 Business Rule Annotations (Cross-Role)
1. **CROSS-06:** The loan amount visible to the Farmer in the hero card and loan detail must always match the `approved_amount` from the Credit Sanction Register — not the `requested_amount` from the application.
2. **CROSS-07:** The "Days Waiting" counter shown in the Credit Team inbox, SC approval queue, and CS document queue all measure the same thing (time since stage entry) but are shown to different roles. They must share the same source field — not be independently calculated.
3. **CROSS-08:** The 15-document checklist in CS (Stage 4) and the 5-gate pre-flight check in Treasury (Stage 5) are different checklists with different owners. Treasury's pre-flight confirms the CS process completed — it does not re-verify each document. Design them visually differently so they are never confused.
4. **CROSS-09:** Interest rate on any loan screen must always show with `"(Floating)"` label and `"Effective from: [date]"` sub-text. This applies to Farmer, Credit Team, CS Term Sheet, and Treasury accruals — all contexts.
5. **CROSS-10:** The NOC is the final artifact of a loan's lifecycle. Every role that has visibility into loan status should reflect the `"Closed — NOC Issued"` final state: Farmer FAR-F8, Credit Team C-4 Loan Register, CS-5 NOC log, Treasury T-3b SAP Entries Log, SC Credit Sanction Register.

### 🔵 Technical / API Annotations (Cross-Role)
1. **CROSS-11:** Status transitions must be API-driven, not client-side. When Treasury posts a repayment to SAP, the status change (and all triggered notifications) originates from the server. No role's frontend should independently update loan status.
2. **CROSS-12:** All document PDFs (PoA, Loan Agreement, Term Sheet, Disbursement Advice, NOC) should be stored in a document management system accessible via an API. URLs to these PDFs are returned in loan detail API responses and rendered inline in the relevant screens.
3. **CROSS-13:** The SAP Customer Code (SFCUST-XXXX) created by Treasury must be returned to the Credit Team's loan detail view. The Credit Manager should be able to see the SAP Customer ID on the loan profile — useful for tracking repayment entries.
4. **CROSS-14:** GM Resolution document (Director special case) must be treated as a compliance record — stored, timestamped, and accessible in audit logs. It is not a regular document upload; it should be stored in the Compliance Notes tab of the Member Profile.

### 🟠 Edge Cases (Cross-Role)
1. **CROSS-15:** If a farmer reapplies after a rejection — what happens to the old application record? It should remain in the Credit Team's `"Rejected Applications"` list as a permanent record, and the new application should reference the old one: `"Previous application: LO000088 — Rejected [date] — Reason: [code]"`. The farmer's profile should show this history too.
2. **CROSS-16:** If the same farmer has two loans (rare, CFO-override case noted in Farmer prompt): the Credit Team Loan Register, CS Document Queue, and Treasury Disbursement Queue must all correctly display both loans without collision. All Loan IDs remain unique; the SAP Customer ID is shared (one customer per farmer, multiple loan documents).
3. **CROSS-17:** If a stamp paper purchase fails or the CS runs out of ₹500 stamp paper during document preparation, the CS Document Workspace should show a blocking warning on the PoA and Loan Agreement tabs: `"₹500 stamp paper unavailable. Contact office manager before proceeding."` This state is not covered in any role prompt.

---

## PART G — FIGMA FILE STRUCTURE — INTEGRATION ADDITIONS

Add the following pages/frames to the existing Figma file structure defined in the design brief:

```
📄 10. Cross-Role Integration (NEW PAGE)
   → SHARED-AuditTrail-FullView
   → SHARED-AuditTrail-FarmerView
   → SHARED-StageTracker-AllStates (6 states)
   → SHARED-StageTracker-Vertical-Mobile
   → SHARED-MemberProfile-AllTabs (5 tabs)
   → SHARED-DirectorCase-DetectionBanner
   → SHARED-DirectorCase-GMResolution-Upload
   → SHARED-DirectorCase-BlockedView
   → SHARED-RateChange-AdminBroadcast-Modal
   → SHARED-s186Lock-SCBanner
   → SHARED-s186Lock-CreditTeamBanner
   → SHARED-s186Lock-FarmerHoldStatus
   → SHARED-NotificationMatrix-Reference (documentation frame, not a UI frame)

📄 11. Missing Screens (NEW PAGE)
   → C-2-ManualEntry-Form
   → SC-9-DocumentChecklist-FinalSignOff
   → CS-2-DocumentWorkspace-NewLoan-Initial
   → CS-2-DocumentWorkspace-PostDisbursement-Archive
   → T-2-Step1-WithDocLinks
   → FAR-F1-PostDisbursement-Transition
   → FAR-F1-RepaymentProcessing
   → FAR-F3-FullyRepaid-BeforeNOC
   → FAR-F5-NOC-Delivered

📄 12. Prototype Flows — Cross-Role (NEW PAGE)
   → Flow X-1: Complete Lifecycle (all 6 roles)
   → Flow X-2: Repayment → NOC
   → Flow X-3: Default → Invocation
   → Flow X-4: Director Special Case
```

**Annotation 🟣 Accessibility (Cross-Role):**
All cross-role transitions (notifications that link to another role's screen) must not break the user's keyboard focus position. Deep-link navigation must place focus on the relevant entity (e.g., the loan row in the queue) when the user arrives from a notification CTA. This applies across all 5 roles.

---

*End of SFPCL WhatsLoan — Cross-Role Integration & Missing Connections Document*
*Document: SFPCL_CrossRole_Integration_Improvements.md*
*Companion files: All 5 role deep-dive prompts + SFPCL_LoanPlatform_Figma_DesignBrief.md*
*New frames identified: 19 missing screens + 12 shared components = 31 additional frames*
*Total platform frames (revised estimate): ~65 (original brief) + ~31 (this document) = ~96 frames*
