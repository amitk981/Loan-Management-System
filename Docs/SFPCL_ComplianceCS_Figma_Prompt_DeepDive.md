# SFPCL WhatsLoan — Company Secretary / Compliance Role: Figma UI Deep-Dive Prompt

**Document:** Niche UI Specification for Figma Design
**Role:** Compliance Team (Company Secretary + Compliance Officer)
**Platform:** Web Dashboard (Desktop Primary, Tablet Secondary)
**SOP Reference:** SOP_SFPCL_LOANDISBURSEMENT v1.0 — Stage 4 (primary), Stage 3 (partial), Stage 6 (NOC & closure), Section 2 (Statutory Compliance Calendar), Section 3 (Borrower Obligations)
**Design Partner Context:** This is the most document-intensive role in the entire platform. The CS/Compliance user is a legal-compliance professional whose every action creates a legally binding artifact. The platform must function as a document control system, a compliance calendar, and a signature orchestration tool — simultaneously. Speed matters, but zero-defect documentation matters more.

---

## ROLE MENTAL MODEL

The Company Secretary thinks in **checklists, calendars, and custody chains**. Their primary daily questions are:
1. *"What documents are incomplete, unsigned, or improperly stamped right now?"*
2. *"What statutory deadlines am I approaching?"*
3. *"Have I issued the NOC? Have I returned the SH-4 and blank cheque to the closed borrower?"*
4. *"Is the checklist signed off correctly before disbursement goes ahead?"*

The interface must reflect this mental model exactly. Every screen the CS opens should answer one of these four questions without requiring navigation.

---

## 1. VISUAL IDENTITY (Same Design System as Platform)

### Shared Tokens (from Global Brief)
- `brand-primary`: `#1A3C2A` — sidebar, primary CTAs
- `brand-secondary`: `#2D7A4F` — active nav, hover states
- `brand-accent`: `#1E88E5` — links, info callouts
- `brand-light`: `#E8F5E9` — card/row highlights
- `neutral-100`: `#F7F8FA` — page canvas
- `success-500`: `#22C55E` — Completed / Verified / NOC Issued
- `warning-500`: `#F59E0B` — Pending / Awaiting Signature / Expiring
- `error-500`: `#EF4444` — Missing / Overdue / Rejected
- `info-500`: `#3B82F6` — In-progress / Under Review
- `gold-500`: `#D97706` — Director/Relative borrower flag

### CS-Role Accent — Judicial Parchment System
Because this role is all about legal instruments, introduce a secondary surface texture used **only** within document panels and compliance checklists:
- Document panel background: `#FDFAF4` (warm off-white — evokes paper)
- Document section headers: `#1A3C2A` (deep green, firm authority)
- Stamp/execution status badge: `#6D4C41` (dark brown — physical stamp metaphor)
- Stamp-complete indicator: a small filled ink-stamp icon in `#6D4C41` replacing generic checkmarks inside document cards

### Typography (same scale, CS-specific emphasis)
- `DM Sans Bold` 24px: section headers ("Document Workspace", "Compliance Calendar")
- `Inter Medium` 14px: field labels, compliance area names
- `Roboto Mono` 13px: Loan IDs, folio numbers, PAN, stamp duty amounts (e.g. `₹500 stamp`)
- `Inter Regular` 13px: body notes, annotation text
- Legal document preview panels: `Georgia` or `Merriweather` 13px serif — distinguishes legal document content from UI copy

---

## 2. NAVIGATION STRUCTURE — CS ROLE SIDEBAR

```
┌─────────────────────────────────────┐
│  [Sahyadri Farms logo]              │
│  [WhatsLoan wordmark]               │
│  ─────────────────────────────────  │
│  CS Dashboard              HOME     │
│  ─── DOCUMENT MANAGEMENT ───        │
│  ○ Pending Document Queue  [14]     │
│  ○ Document Workspace               │
│  ○ Executed Documents Archive       │
│  ─── COMPLIANCE CALENDAR ───        │
│  ○ Statutory Deadlines      [3]     │
│  ○ KYC Renewal Tracker      [9]     │
│  ○ Re-KYC Due               [4]     │
│  ─── LOAN CLOSURE ───               │
│  ○ NOC Issuance Queue       [2]     │
│  ○ Security Return Log              │
│  ─── REGISTERS ───                  │
│  ○ Loan Register (CS View)          │
│  ○ Credit Sanction Register         │
│  ○ Exception Register               │
│  ○ Grievance Register               │
│  ─── LEGAL INSTRUMENTS ───          │
│  ○ Stamp Duty Tracker               │
│  ○ PoA Register                     │
│  ─── REPORTS ───                    │
│  ○ Compliance Status Report         │
│  ─ bottom ─                         │
│  [CS Avatar] Anjali Mehta · CS      │
│  ○ Settings                         │
│  ○ SOP Reference                    │
└─────────────────────────────────────┘
```

**Sidebar details:**
- Section labels: `10px`, `#8FAF96`, uppercase, `letter-spacing: 0.08em`
- Badge pills: amber `#F59E0B` text on `rgba(245,158,11,0.15)` for pending counts; red for overdue
- Active state: 4px left border `#3D7A4F`, bg `rgba(255,255,255,0.08)`
- Role label under avatar: `CS` in a small `#1A3C2A` pill badge

---

## 3. SCREEN 1 — CS DASHBOARD (Home)

### Purpose
The CS's morning view. Immediately surfaces: documents pending action, upcoming statutory deadlines, KYC renewals, and any loans ready for NOC issuance. Zero ambiguity about what needs to happen today.

### Layout: 3-Zone Composition (1440px canvas)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  ZONE A — STATUS STRIP (4 KPI cards, full width)                           │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐  │
│  │ Docs Pending  │ │ Statutory     │ │ KYC Expiring  │ │ NOC Queue     │  │
│  │ Signature     │ │ Deadlines     │ │ (30 days)     │ │               │  │
│  │    14         │ │  3 upcoming   │ │    9 members  │ │   2 loans     │  │
│  │ 2 overdue →   │ │ Next: Oct 15  │ │ 4 overdue     │ │ Ready today   │  │
│  └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘  │
├────────────────────────────────────────────────────────────────────────────┤
│  ZONE B — MY DOC QUEUE (left 58%)    │  ZONE C — CALENDAR SIDEBAR (42%)   │
│                                       │                                    │
│  ┌────────────────────────────────┐   │  UPCOMING DEADLINES                │
│  │  PENDING DOCUMENT ACTIONS      │   │  ──────────────────────────────    │
│  │                                │   │  🔴 Oct 15 — Maharashtra Stamp     │
│  │  [!] LO00000091  Priya Shinde  │   │       Act annual declaration due   │
│  │      PoA not yet notarised     │   │                                    │
│  │      Overdue: 2 days           │   │  🟡 Oct 22 — NBFC ratio check      │
│  │      [Complete Now →]          │   │       Q2 — CFO to approve note     │
│  │  ─────────────────────────── ─ │   │                                    │
│  │  [→] LO00000094  Narayan FPC   │   │  🟡 Nov 01 — KYC renewal: 4 mbrs  │
│  │      SH-4 pending signature    │   │       Re-KYC request not sent      │
│  │      Waiting: borrower         │   │                                    │
│  │      [Send Reminder →]         │   │  🟢 Nov 15 — Stamp register audit  │
│  │  ─────────────────────────── ─ │   │       Scheduled — docs ready       │
│  │  [→] LO00000089  Rajesh Patil  │   │                                    │
│  │      Loan Agreement on stamp   │   │  KYC RENEWAL ALERTS                │
│  │      paper — awaiting CS sign  │   │  ──────────────────────────────    │
│  │      [Review & Sign →]         │   │  [!] Ganesh Thorat — 8 days left   │
│  │  ─────────────────────────── ─ │   │  [!] Meena Kulkarni — 12 days      │
│  │  [✓] LO00000082  Disbursed     │   │  [→] 7 more members due in 30d     │
│  │      NOC eligible — Full repay │   │      [Send Bulk Re-KYC Request]    │
│  │      [Issue NOC →]             │   │                                    │
│  └────────────────────────────────┘   │                                    │
├────────────────────────────────────────────────────────────────────────────┤
│  ZONE D — CHECKLIST SIGN-OFF TRACKER (full width, compact horizontal band) │
│                                                                            │
│  Loans awaiting CS checklist sign-off before disbursement:                │
│  LO00000093 · Vijay More       Docs: ✅ Complete   CS Sign: ⬜ Pending    │
│  LO00000094 · Narayan FPC      Docs: ⚠ SH-4 miss  CS Sign: ⬜ Blocked    │
│  LO00000095 · Sunita Jadhav    Docs: ✅ Complete   CS Sign: ✅ Done       │
│  [View All Pending Checklists →]                                           │
└────────────────────────────────────────────────────────────────────────────┘
```

**KPI Card anatomy:**
- Primary number: 32px `DM Sans Bold`, color-coded
- Subtitle: 11px `Inter Medium #6B7280`
- Critical sub-metric: colored pill at bottom (e.g., "2 overdue" in error-100/error-500)
- Hover: slight shadow lift, `→` link appears to full section

**Doc Queue row anatomy:**
- Priority icon: `!` red circle (overdue), `→` blue arrow (in-progress), `✓` green (ready for action)
- Loan ID: `Roboto Mono #0C5FA5`
- Borrower name: `Inter Medium`
- Action label: descriptive, specific (never "Pending" — always "PoA not yet notarised")
- CTA button: ghost variant, right-aligned, appears on hover → solid on focus
- Row expands on click to show document mini-preview

---

## 4. SCREEN 2 — DOCUMENT WORKSPACE (Core CS Screen)

### Purpose
The CS's primary working screen. For each approved loan, this is where all 8 legal documents are prepared, tracked, executed, stamped, and stored. This is the most complex and critical screen in the CS role.

### Layout: Tabbed Document Hub

```
┌────────────────────────────────────────────────────────────────────────────┐
│  PAGE HEADER                                                                │
│  Document Workspace  >  LO00000091  >  Priya Ramesh Shinde                │
│  Status: [● Documentation In Progress]  Sanction Approved: 12-Oct-2025    │
│  Approved Amount: ₹60,000  ·  CFO: S. Nair  ·  Director: R. Deshmukh     │
├───────────────────────┬────────────────────────────────────────────────────┤
│  DOCUMENT CHECKLIST   │  DOCUMENT DETAIL PANEL                             │
│  (left sidebar 280px) │  (main area, contextual per selection)             │
│                       │                                                    │
│  CHECKLIST PROGRESS   │  [Tab: PoA] [Tab: Tri-Party] [Tab: SH-4 / CDSL]  │
│  ██████░░░░  5/8 done │  [Tab: Term Sheet] [Tab: Loan Agmt] [Tab: Checks] │
│                       │  [Tab: Bank Verify] [Tab: Checklist]               │
│  ─── DOCUMENTS ───    │                                                    │
│  ✅ 1. PoA            │  [Selected Tab Content renders here — see §4.1]   │
│     Notarised ✓       │                                                    │
│     Stamp: ₹500 ✓     │                                                    │
│                       │                                                    │
│  ✅ 2. Tri-Party Agmt │                                                    │
│     All 3 signed ✓    │                                                    │
│                       │                                                    │
│  ⚠  3. SH-4           │                                                    │
│     Witness sig miss  │                                                    │
│     → Physical shares │                                                    │
│                       │                                                    │
│  ✅ 4. CDSL Pledge    │                                                    │
│     N/A (phys shares) │                                                    │
│                       │                                                    │
│  ⬜ 5. Term Sheet     │                                                    │
│     Not yet signed    │                                                    │
│                       │                                                    │
│  ⬜ 6. Loan Agreement │                                                    │
│     Not yet drafted   │                                                    │
│                       │                                                    │
│  ✅ 7. Bank Verify    │                                                    │
│     Not needed (sigs  │                                                    │
│     match) — skipped  │                                                    │
│                       │                                                    │
│  ⬜ 8. Checklist      │                                                    │
│     Awaiting all docs │                                                    │
│  ─────────────────── ─│                                                    │
│  [Submit for CS Sign] │                                                    │
│  (enabled when 8/8 ✅) │                                                    │
└───────────────────────┴────────────────────────────────────────────────────┘
```

**Checklist sidebar detail:**
- Progress bar: `#2D7A4F` fill on `#EDEEF0` track, percentage shown
- Each item: icon (✅ / ⚠ / ⬜ / N/A grey dash) + document name + one-line status
- Clicking any item loads it in the detail panel
- Blocked items show a lock icon if a prior document must be completed first
- "Submit for CS Sign" button: disabled (grey) until all 8 items resolved; enabled (brand-primary green) when ready

---

### 4.1 DOCUMENT TAB — POWER OF ATTORNEY (PoA)

```
┌────────────────────────────────────────────────────────────────┐
│  TAB: POWER OF ATTORNEY (POA)    Status: ● Execution Complete  │
├────────────────────────────────────────────────────────────────┤
│  INSTRUMENT DETAILS                                             │
│  ┌──────────────────────┬──────────────────────────────────┐   │
│  │ Grantor (Farmer)     │ Priya Ramesh Shinde               │   │
│  │ Grantee (CS)         │ Anjali Mehta, Company Secretary   │   │
│  │ Authorises           │ Sale of shares on loan default    │   │
│  │ Execution date       │ 13-Oct-2025                       │   │
│  │ Stamp paper value    │ ₹500                  [✅ Affixed] │   │
│  │ Notarisation         │ ✅ Notarised – Advocate R. Joshi   │   │
│  │ Signed by: Farmer    │ ✅ Priya Ramesh Shinde             │   │
│  │ Signed by: Nominee   │ ✅ Ramesh Shinde (Husband)         │   │
│  └──────────────────────┴──────────────────────────────────┘   │
│                                                                  │
│  DOCUMENT PREVIEW                    CUSTODY RECORD             │
│  ┌──────────────────────┐            Original: Physical file    │
│  │  [PDF Thumbnail]     │            Scanned: ✅ Uploaded       │
│  │  PoA_LO91_signed.pdf │            Location: Cabinet B-4      │
│  │  [View Full ↗]       │            Scanned by: Anjali Mehta  │
│  └──────────────────────┘            Date: 13-Oct-2025          │
│                                                                  │
│  [Edit Details]  [Re-upload Scan]  [View Audit Log]             │
└────────────────────────────────────────────────────────────────┘
```

---

### 4.2 DOCUMENT TAB — SH-4 SHARE TRANSFER FORM

The most conditional document tab: renders differently based on share type.

```
┌────────────────────────────────────────────────────────────────┐
│  TAB: SHARE SECURITY              Status: ⚠ Action Required    │
├────────────────────────────────────────────────────────────────┤
│  SHARE TYPE TOGGLE (auto-detected from member registry)         │
│  ● Physical Shares (SH-4 Form)   ○ D-MAT Shares (CDSL Pledge) │
│                                                                  │
│  PHYSICAL SHARES — FORM SH-4                                    │
│  ┌──────────────────────┬──────────────────────────────────┐   │
│  │ Shareholder (Farmer) │ Priya Ramesh Shinde               │   │
│  │ Folio Number         │ SH-2847                          │   │
│  │ No. of Shares        │ 250 shares                        │   │
│  │ Form signed by       │ ✅ Borrower (Priya Shinde)        │   │
│  │ Witness signed by    │ ⚠ MISSING — required SFPCL mbr   │   │
│  │ Witness Folio No.    │ [Input field — validate folio]    │   │
│  │ Held in blank        │ ✅ Confirmed                       │   │
│  │ Custody location     │ [Dropdown: Cabinet / Safe]        │   │
│  └──────────────────────┴──────────────────────────────────┘   │
│                                                                  │
│  ⚠ WITNESS SIGNATURE REQUIRED                                   │
│  The witness must be a current SFPCL shareholder.               │
│  Enter their folio number to validate:                          │
│  Folio: [__________]  [Validate →]                              │
│                                                                  │
│  [Upload Signed SH-4]  [Download SH-4 Template]                 │
└────────────────────────────────────────────────────────────────┘
```

**D-MAT variant (when toggled or auto-selected):**

```
┌────────────────────────────────────────────────────────────────┐
│  TAB: SHARE SECURITY              Status: ● CDSL Pledge Active │
├────────────────────────────────────────────────────────────────┤
│  D-MAT SHARES — CDSL ONLINE PLEDGE                              │
│  ┌──────────────────────┬──────────────────────────────────┐   │
│  │ Pledgor BO Account   │ 1204720012345678                  │   │
│  │ Pledgee BO Account   │ SFPCL — 1201370000987654          │   │
│  │ No. of Shares        │ 250 shares                        │   │
│  │ Pledge Seq. No.(PSN) │ PSN-20251013-00087                │   │
│  │ PRF Submitted        │ ✅ 13-Oct-2025                    │   │
│  │ Pledge Status        │ ✅ Accepted by Pledgee DP         │   │
│  │ Loan Agmt Reference  │ LO00000091 (entered in PRF)       │   │
│  └──────────────────────┴──────────────────────────────────┘   │
│                                                                  │
│  PLEDGE LIFECYCLE TRACKER                                        │
│  ● Pledge Created   → ● Accepted   → ○ Active   → ○ Repaid?    │
│                                                                  │
│  Future Shares: ✅ Auto-pledge clause in Loan Agreement (§8.2)  │
│                                                                  │
│  On Loan Repayment: [Initiate Unpledge (URF)] — locked until   │
│  NOC is issued                                                   │
│                                                                  │
│  On Default:        [Invoke Pledge (IRF)] — requires SC         │
│                     Board approval before activation             │
└────────────────────────────────────────────────────────────────┘
```

---

### 4.3 DOCUMENT TAB — TERM SHEET

```
┌────────────────────────────────────────────────────────────────┐
│  TAB: TERM SHEET                  Status: ⬜ Awaiting Signature │
├────────────────────────────────────────────────────────────────┤
│  TERM SHEET DETAILS  (Ref: SOP §4.9 | Annexure E)              │
│  ┌──────────────────────┬──────────────────────────────────┐   │
│  │ Borrower             │ Priya Ramesh Shinde               │   │
│  │ Nominee              │ Ramesh Shinde                     │   │
│  │ Shares Held          │ 250 shares (Folio SH-2847)        │   │
│  │ Loan Facility        │ Short-term (≤1 year)              │   │
│  │ Loan Amount          │ ₹60,000                           │   │
│  │ Purpose              │ Grape cultivation — Dindori farm  │   │
│  │ Rate of Interest     │ 12.5% p.a. (floating)             │   │
│  │ Interest Tenure      │ 12 months                         │   │
│  │ Repayment Date       │ 12-Oct-2026                       │   │
│  │ Penalty Interest     │ 18% p.a. on overdue amounts       │   │
│  │ Processing Fee       │ ₹500 (one-time)                   │   │
│  │ Security             │ SH-4 Form + Undated Cheque        │   │
│  │ Dispute Resolution   │ Nashik Civil Court jurisdiction   │   │
│  └──────────────────────┴──────────────────────────────────┘   │
│                                                                  │
│  SIGNING AUTHORITY (per Approval Matrix)                        │
│  Loan ≤ ₹5,00,000: CFO signature required on Term Sheet         │
│  Status: [○ CFO: S. Nair — Signature Pending]                   │
│                                                                  │
│  Signed by Applicant:  ⬜ Pending  [Send to Borrower for Sign]  │
│  Signed by Nominee:    ⬜ Pending  [Included in same request]   │
│  Signed by CFO:        ⬜ Pending  [Forward to CFO queue →]     │
│                                                                  │
│  [Edit Term Sheet]  [Download PDF]  [Upload Signed Copy]        │
└────────────────────────────────────────────────────────────────┘
```

---

### 4.4 DOCUMENT TAB — LOAN AGREEMENT

```
┌────────────────────────────────────────────────────────────────┐
│  TAB: LOAN AGREEMENT              Status: ⬜ Not Yet Drafted   │
├────────────────────────────────────────────────────────────────┤
│  INSTRUMENT REQUIREMENTS  (Ref: SOP §4.10 | Annexure F)        │
│                                                                  │
│  ⬜  Stamp paper procured      ₹500 non-judicial stamp paper    │
│  ⬜  Agreement drafted         Based on Annexure F template     │
│  ⬜  Notarisation complete     Advocate / Notary signature req. │
│  ⬜  Signed by applicant       Priya Ramesh Shinde              │
│  ⬜  Signed by witness         SFPCL shareholder (folio req.)   │
│  ⬜  Original uploaded         Scanned + physical custody       │
│                                                                  │
│  [Generate from Template →]  ← pulls all data from this loan   │
│                                                                  │
│  TEMPLATE PREVIEW (auto-populated fields)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  THIS LOAN AGREEMENT is entered into on ______ between   │  │
│  │  Sahyadri Farmers Producer Company Limited, a company    │  │
│  │  incorporated under... [Priya Ramesh Shinde, farmer,     │  │
│  │  resident of Dindori, Nashik...] for a sum of ₹60,000   │  │
│  │  subject to the terms herein...                          │  │
│  │  [Click "Generate" to auto-fill all 23 fields]           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Note: Loan Agreement must be executed AFTER Term Sheet         │
│  is signed. Current Term Sheet status: ⬜ Pending.             │
│                                                                  │
│  [Generate Agreement PDF]  [Upload Stamped Signed Copy]         │
└────────────────────────────────────────────────────────────────┘
```

---

### 4.5 DOCUMENT TAB — BANK VERIFICATION LETTER

Conditional: only relevant when signature mismatch is flagged.

```
┌────────────────────────────────────────────────────────────────┐
│  TAB: BANK VERIFICATION LETTER    Status: ✅ Resolved / N/A   │
├────────────────────────────────────────────────────────────────┤
│  SIGNATURE VERIFICATION CHECK  (Ref: SOP §4.11 | Annexure G)  │
│                                                                  │
│  Signature Match Status:   ✅ Signatures match across docs      │
│  ─────────────────────────────────────────────────────────      │
│  PAN Card signature     ⊡ [thumb]    vs  Cheque signature ⊡    │
│  Reviewed by: Credit Assessment Team  ·  Date: 12-Oct-2025     │
│                                                                  │
│  ✅ Bank Verification Letter: NOT REQUIRED                      │
│  Reason: Signatures consistent across PAN, Aadhaar, and cheque │
│  Verified by: Credit Manager                                    │
│                                                                  │
│  ─────────────────────────────────────────────────────────      │
│  If mismatch is detected (edit to trigger this flow):           │
│  Option A: [Request Bank Verification Letter from Bank]         │
│  Option B: [Request Declaration on Stamp Paper from Borrower]  │
└────────────────────────────────────────────────────────────────┘
```

**Mismatch variant (when flagged by Credit Team):**

```
┌────────────────────────────────────────────────────────────────┐
│  TAB: BANK VERIFICATION LETTER    Status: ⚠ Mismatch Detected │
├────────────────────────────────────────────────────────────────┤
│  ⚠ SIGNATURE MISMATCH — ACTION REQUIRED                        │
│                                                                  │
│  SIDE-BY-SIDE COMPARISON                                        │
│  ┌─────────────────────────┬─────────────────────────┐         │
│  │  PAN Card Signature     │  Cheque Signature        │         │
│  │  [Signature image]      │  [Signature image]       │         │
│  │  Source: Uploaded KYC   │  Source: Blank cheque    │         │
│  └─────────────────────────┴─────────────────────────┘         │
│  Flagged by: Amit Kulkarni (Credit Mgr)  ·  12-Oct-2025        │
│                                                                  │
│  SELECT RESOLUTION PATH:                                        │
│  ○ Option A — Bank Verification Letter                          │
│    Require bank stamp + authorised signature confirming         │
│    cheque signature belongs to account holder.                  │
│    [Generate Letter Request →]                                  │
│                                                                  │
│  ○ Option B — Declaration on Stamp Paper                        │
│    Borrower self-declares signature is their own.               │
│    Non-judicial stamp paper. CS to notarise.                    │
│    [Generate Declaration Template →]                            │
│                                                                  │
│  Resolution Deadline: 15-Oct-2025 (disbursement blocked until) │
└────────────────────────────────────────────────────────────────┘
```

---

### 4.6 DOCUMENT TAB — MASTER CHECKLIST (Index)

```
┌────────────────────────────────────────────────────────────────┐
│  TAB: MASTER CHECKLIST            Status: ⬜ CS Sign Pending   │
│  Ref: SOP §4.12 | Annexure H      Final Sign-off Document     │
├────────────────────────────────────────────────────────────────┤
│  DOCUMENT INDEX — LO00000091                                    │
│  ┌───┬─────────────────────────────┬──────────┬────────────┐   │
│  │ # │ Document                    │ Status   │ Custody    │   │
│  ├───┼─────────────────────────────┼──────────┼────────────┤   │
│  │ 1 │ Loan Application Form       │ ✅ Done  │ Scanned    │   │
│  │ 2 │ KYC – Borrower (PAN+Adhaar) │ ✅ Done  │ Physical   │   │
│  │ 3 │ KYC – Nominee               │ ✅ Done  │ Physical   │   │
│  │ 4 │ KYC – Witness               │ ✅ Done  │ Physical   │   │
│  │ 5 │ Cancelled Cheque            │ ✅ Done  │ Physical   │   │
│  │ 6 │ Blank-dated Cheque          │ ✅ Done  │ Safe A-12  │   │
│  │ 7 │ Power of Attorney           │ ✅ Done  │ Physical   │   │
│  │ 8 │ Tri-Party Agreement         │ ✅ Done  │ Physical   │   │
│  │ 9 │ Share Transfer Form SH-4    │ ⚠ Witn. │ Pending    │   │
│  │10 │ Term Sheet                  │ ⬜ Sign  │ Pending    │   │
│  │11 │ Loan Agreement              │ ⬜ Draft │ Pending    │   │
│  │12 │ Bank Verification Letter    │ ✅ N/A   │ —          │   │
│  └───┴─────────────────────────────┴──────────┴────────────┘   │
│                                                                  │
│  APPROVAL SIGNATURES TRACKER                                    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Company Secretary (CS)         ⬜ Pending               │    │
│  │   Certifies: All docs verified & attached               │    │
│  │ Credit Manager                 ⬜ Pending               │    │
│  │   Certifies: Loan limits reviewed                       │    │
│  │ Sanction Committee (Director)  ⬜ Pending               │    │
│  │   Certifies: Final approval per authority matrix        │    │
│  │ Sr. Manager – Finance          ⬜ Pending               │    │
│  │   Certifies: Loan disbursed to applicant account        │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  [Sign Checklist as CS]  ← enabled only when 12/12 resolved    │
└────────────────────────────────────────────────────────────────┘
```

**CS Sign action — modal:**
```
┌───────────────────────────────────────────────────┐
│  CONFIRM CS SIGN-OFF                               │
│                                                    │
│  By signing this checklist, you certify that:     │
│  ✓ All required documents are attached            │
│  ✓ Stamp duties have been correctly affixed       │
│  ✓ Notarisations are complete                     │
│  ✓ Witness signatures are from SFPCL shareholders │
│  ✓ KYC documents are valid and on file            │
│                                                    │
│  Loan: LO00000091 | Borrower: Priya Ramesh Shinde  │
│  Amount: ₹60,000                                  │
│                                                    │
│  [Cancel]                     [Sign & Submit →]   │
└───────────────────────────────────────────────────┘
```

---

## 5. SCREEN 3 — COMPLIANCE CALENDAR

### Purpose
The CS's statutory compliance view. Surfaces deadlines from multiple frameworks (Companies Act, PMLA, Maharashtra Stamp Act, RBI KYC, Maharashtra ML Act) in a single calendar with clear ownership and evidence tracking.

### Layout: Calendar + Compliance Table

```
┌────────────────────────────────────────────────────────────────────────────┐
│  PAGE HEADER: Compliance Calendar                                           │
│  [Month View] [Quarter View] [Year View]   Current: Q2 FY 2025-26         │
├────────────────────────────────────────────────────────────────────────────┤
│  CALENDAR GRID (left 60%)              │  COMPLIANCE DETAIL (right 40%)   │
│                                         │                                   │
│  OCTOBER 2025                           │  [Selected: Oct 15]               │
│  ┌───┬───┬───┬───┬───┬───┬───┐         │  ─────────────────────────────    │
│  │Mon│Tue│Wed│Thu│Fri│Sat│Sun│         │  MAHARASHTRA STAMP ACT            │
│  ├───┼───┼───┼───┼───┼───┼───┤         │  Annual Declaration               │
│  │   │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │         │                                   │
│  ├───┼───┼───┼───┼───┼───┼───┤         │  Statute: Maharashtra Stamp       │
│  │ 7 │ 8 │ 9 │10 │11 │12 │13 │         │  Act, 1958                        │
│  ├───┼───┼───┼───┼───┼───┼───┤         │  Owner: Company Secretary         │
│  │14 │🔴15│16 │17 │18 │19 │20 │         │  Evidence Required: Annual        │
│  ├───┼───┼───┼───┼───┼───┼───┤         │  declaration + stamp register     │
│  │21 │🟡22│23 │24 │25 │26 │27 │         │  Frequency: Annual                │
│  ├───┼───┼───┼───┼───┼───┼───┤         │  Status: ⚠ Due in 3 days         │
│  │28 │29 │30 │🟡31│   │   │   │         │                                   │
│  └───┴───┴───┴───┴───┴───┴───┘         │  [Upload Evidence]                │
│  🔴 = Overdue / Critical               │  [Mark Complete]                   │
│  🟡 = Upcoming (within 14 days)        │  [View History →]                  │
│  🟢 = Completed                         │                                   │
│  🔵 = Scheduled / Recurring            │                                   │
└────────────────────────────────────────┴───────────────────────────────────┘
```

**Compliance Table below calendar:**

```
┌──────────────────┬───────────────────────┬────────────┬─────────┬──────────┐
│ Compliance Area  │ Requirement            │ Frequency  │ Owner   │ Status   │
├──────────────────┼───────────────────────┼────────────┼─────────┼──────────┤
│ Producer Co.     │ Loan register + member │ Ongoing    │ CS      │ ✅ Live  │
│ Lending          │ cap monitoring         │            │         │          │
├──────────────────┼───────────────────────┼────────────┼─────────┼──────────┤
│ Loan Limits      │ s.186 — 60%/100% free  │ Quarterly  │ CFO     │ ⬜ Q2   │
│ (s.186)          │ reserves tracker       │            │         │ Due Nov  │
├──────────────────┼───────────────────────┼────────────┼─────────┼──────────┤
│ NBFC Test        │ Asset/income ratio     │ Quarterly  │ CFO     │ ⬜ Q2   │
│                  │ <50% financial assets  │            │         │ Due Nov  │
├──────────────────┼───────────────────────┼────────────┼─────────┼──────────┤
│ KYC / AML        │ PMLA 2002 — re-KYC    │ Bi-annual  │ Credit  │ ⚠ 9 due │
│                  │ every 2 years          │ per member │ Head    │ this qtr │
├──────────────────┼───────────────────────┼────────────┼─────────┼──────────┤
│ Stamp Duty       │ Maharashtra Stamp Act  │ At exec.   │ CS      │ ✅ On   │
│ Documentation    │ ₹500 — PoA + Loan Agmt│            │         │ track    │
├──────────────────┼───────────────────────┼────────────┼─────────┼──────────┤
│ Money-lending    │ Maha. ML Reg. Act —   │ Annual     │ CS      │ 🔴 Due  │
│ Laws             │ confirm exemption      │            │         │ Oct 15   │
├──────────────────┼───────────────────────┼────────────┼─────────┼──────────┤
│ Accounting &     │ DPD reports, Ind AS    │ Monthly /  │ Accts   │ ✅ Sep  │
│ Reporting        │ accrual, board MIS     │ Quarterly  │ Head    │ done     │
├──────────────────┼───────────────────────┼────────────┼─────────┼──────────┤
│ Data Protection  │ IT Act — role-based    │ Quarterly  │ IT + CS │ ⬜ Q3   │
│ & Access         │ SAP access review      │            │         │ Due Dec  │
├──────────────────┼───────────────────────┼────────────┼─────────┼──────────┤
│ Record Retention │ Companies Act — 8yr    │ Annual     │ CS +    │ ✅ FY25 │
│ & Audit          │ physical + electronic  │ audit      │ Auditor │ done     │
└──────────────────┴───────────────────────┴────────────┴─────────┴──────────┘
```

**Row interaction:** Clicking any row expands an inline panel with: statute citation, last evidence upload, evidence required, escalation contact, and history of past compliance events.

---

## 6. SCREEN 4 — KYC RENEWAL TRACKER

### Purpose
Track all 769+ member KYC records against their 2-year renewal cycle. Surface members approaching or past their re-KYC date. Enable bulk communication to trigger self-service renewal.

### Layout: Filter + Table + Action Panel

```
┌────────────────────────────────────────────────────────────────────────────┐
│  PAGE HEADER: KYC Renewal Tracker           [Bulk Actions ▾]  [Export CSV]│
├────────────────────────────────────────────────────────────────────────────┤
│  FILTER BAR                                                                 │
│  Status: [All] [Overdue] [< 30 days] [30-60 days] [> 60 days] [Current]  │
│  Type:   [All] [Individual] [FPC]      Search: [Name / Folio / Village]    │
├─────────────────────────────────────────────────────────────────────────────┤
│  KYC STATUS STRIP                                                            │
│  🔴 Overdue (expired): 4  │  🟡 <30 days: 9  │  🟠 30-60 days: 17          │
│  🟢 Current (>60 days): 739 members                                          │
├─────────┬────────────────────┬────────────┬────────────┬────────────┬──────┤
│ Member  │ Name               │ KYC Date   │ Expiry     │ Days Left  │ Act  │
├─────────┼────────────────────┼────────────┼────────────┼────────────┼──────┤
│ SH-0091 │ Ganesh Thorat      │ 01-Oct-23  │ 01-Oct-25  │ 🔴 -8 days │[Send]│
│ SH-0143 │ Meena Kulkarni     │ 15-Oct-23  │ 15-Oct-25  │ 🔴 -2 days │[Send]│
│ SH-0312 │ Vijay More         │ 01-Nov-23  │ 01-Nov-25  │ 🟡 17 days │[Send]│
│ SH-0458 │ Priya Shinde       │ 20-Nov-23  │ 20-Nov-25  │ 🟡 29 days │[Send]│
│ SH-2847 │ Narayan FPC        │ 15-Dec-23  │ 15-Dec-25  │ 🟠 61 days │[Send]│
│ ...     │ ...                │ ...        │ ...        │ ...        │ ...  │
├─────────┴────────────────────┴────────────┴────────────┴────────────┴──────┤
│  ☐ Select all visible  |  [Send Bulk Re-KYC Request]  [Download Due List]  │
└────────────────────────────────────────────────────────────────────────────┘
```

**Re-KYC request action — single member:**
Clicking `[Send]` opens a small modal:
```
┌────────────────────────────────────────────────┐
│  SEND RE-KYC REQUEST                           │
│  Member: Ganesh Thorat (SH-0091)               │
│  KYC Expired: 01-Oct-2025 (8 days ago)         │
│                                                 │
│  Send via: ● SMS   ○ Email   ○ Both            │
│  Message preview:                               │
│  "Dear Ganesh, your KYC with SFPCL is due for  │
│   renewal. Please contact your nearest office   │
│   or visit the WhatsLoan portal to upload       │
│   updated PAN + Aadhaar. Reference: SH-0091"   │
│                                                 │
│  [Cancel]              [Send Request]          │
└────────────────────────────────────────────────┘
```

---

## 7. SCREEN 5 — NOC ISSUANCE QUEUE

### Purpose
The final step of a loan's lifecycle. The CS issues a No-Objection Certificate to the borrower on full repayment, simultaneously returning the SH-4 form and blank-dated cheque held as security.

### Layout: Queue + Action Panel

```
┌────────────────────────────────────────────────────────────────────────────┐
│  PAGE HEADER: NOC Issuance Queue            Ref: SOP §6.1                  │
│  Loans with full repayment confirmed — awaiting CS action                  │
├────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ LO00000082  ·  Rajesh Patil  ·  ₹80,000  ·  Repaid: 11-Oct-2025    │  │
│  │                                                                      │  │
│  │  Repayment confirmed by:  Sr. Manager Finance  ·  SAP confirmed ✅  │  │
│  │                                                                      │  │
│  │  PRE-NOC CHECKLIST                                                   │  │
│  │  ✅ Full principal repaid     ✅ All interest invoices settled        │  │
│  │  ✅ No outstanding dues        ✅ SAP balance = ₹0                   │  │
│  │                                                                      │  │
│  │  SECURITY RETURN                                                     │  │
│  │  □ SH-4 Form returned to borrower   [Mark Returned]                 │  │
│  │  □ Blank-dated cheque returned      [Mark Returned]                 │  │
│  │  □ CDSL Unpledge initiated (if D-MAT) [Initiate URF]                │  │
│  │                                                                      │  │
│  │  NOC DOCUMENT                                                        │  │
│  │  [Generate NOC →]  ← auto-populates from loan record                │  │
│  │                                                                      │  │
│  │  Delivery:  ● Email to borrower   ○ Physical courier   ○ Both       │  │
│  │                                                                      │  │
│  │  [Issue NOC & Archive Loan →]  ← triggers 8-year archive clock      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  RECENTLY ISSUED NOCs                                                        │
│  LO000067 · Sunita Jadhav · NOC issued 05-Oct-2025 · Archive: active       │
│  LO000054 · Kiran FPC · NOC issued 01-Sep-2025 · Archive: active           │
└────────────────────────────────────────────────────────────────────────────┘
```

**NOC Generation modal preview:**
```
┌────────────────────────────────────────────────────────────┐
│  NO-OBJECTION CERTIFICATE                                  │
│  ──────────────────────────────────────────────           │
│  Date: 11-Oct-2025                                         │
│                                                            │
│  To,                                                       │
│  Shri. Rajesh Patil                                        │
│  Village: Peth, Nashik                                     │
│                                                            │
│  Ref: Loan No. LO00000082 | Amount: ₹80,000               │
│  Disbursed: 15-Oct-2024 | Repaid: 11-Oct-2025             │
│                                                            │
│  This is to certify that the above loan has been          │
│  fully repaid. SFPCL has no further claim against         │
│  you in respect of this loan. The Share Transfer          │
│  Form (SH-4) and undated cheque held as security          │
│  are hereby returned.                                      │
│                                                            │
│  Sd/-                                                      │
│  Anjali Mehta                                              │
│  Company Secretary, SFPCL                                  │
│  ──────────────────────────────────────────────           │
│  [Download PDF]         [Send to Borrower & Archive]      │
└────────────────────────────────────────────────────────────┘
```

---

## 8. SCREEN 6 — STAMP DUTY TRACKER

### Purpose
Tracks stamp duty affixed on each instrument (PoA and Loan Agreement both require ₹500 non-judicial stamp paper). Maintains a register of e-stamps purchased and instruments stamped for audit purposes.

### Layout: Register Table

```
┌────────────────────────────────────────────────────────────────────────────┐
│  PAGE HEADER: Stamp Duty Register         Ref: Maharashtra Stamp Act 1958  │
│  [+ Record New Stamp Purchase]    [Export Register]    Search: [_________] │
├────────────────────────────────────────────────────────────────────────────┤
│  STAMP INVENTORY SUMMARY                                                    │
│  Total stamps purchased (FY 25-26): 284   ·   Used: 271   ·   Balance: 13 │
├──────────┬───────────────────┬───────────┬────────────┬───────┬────────────┤
│ Loan ID  │ Instrument        │ Stamp Val.│ Affixed On │ By    │ Status     │
├──────────┼───────────────────┼───────────┼────────────┼───────┼────────────┤
│ LO000091 │ Power of Attorney │ ₹500      │ 13-Oct-25  │ CS    │ ✅ Done    │
│ LO000091 │ Loan Agreement    │ ₹500      │ ⬜ Pending │ CS    │ ⬜ Pending │
│ LO000089 │ Power of Attorney │ ₹500      │ 10-Oct-25  │ CS    │ ✅ Done    │
│ LO000089 │ Loan Agreement    │ ₹500      │ 10-Oct-25  │ CS    │ ✅ Done    │
│ LO000094 │ Power of Attorney │ ₹500      │ 14-Oct-25  │ CS    │ ✅ Done    │
│ LO000094 │ Loan Agreement    │ ₹500      │ ⬜ Pending │ CS    │ ⬜ Pending │
└──────────┴───────────────────┴───────────┴────────────┴───────┴────────────┘
│  Showing 6 of 271 records   [← Prev]  Page 1 of 46  [Next →]              │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. SCREEN 7 — GRIEVANCE REGISTER

### Purpose
The CS maintains the company's grievance register. Members can lodge complaints through the portal; the CS logs resolution and TAT.

```
┌────────────────────────────────────────────────────────────────────────────┐
│  PAGE HEADER: Grievance Register    Ref: SOP §6, Annexure K (Annexure L)  │
│  [+ New Grievance (Manual)]    [Export]    [Unresolved: 2]                 │
├────────────┬─────────────────────────┬────────────┬──────────┬────────────┤
│ Ref        │ Description             │ Received   │ Status   │ TAT        │
├────────────┼─────────────────────────┼────────────┼──────────┼────────────┤
│ GR-2025-12 │ Priya Shinde — Loan     │ 10-Oct-25  │ ⚠ Open  │ 3 days     │
│            │ amount not yet disbursed│            │          │ (SLA: 5d)  │
├────────────┼─────────────────────────┼────────────┼──────────┼────────────┤
│ GR-2025-11 │ Rajesh Patil — Interest │ 01-Oct-25  │ ✅ Rslvd │ 4 days     │
│            │ rate not communicated   │            │          │            │
├────────────┼─────────────────────────┼────────────┼──────────┼────────────┤
│ GR-2025-10 │ Ganesh Thorat — SH-4    │ 20-Sep-25  │ ✅ Rslvd │ 2 days     │
│            │ not returned after NOC  │            │          │            │
└────────────┴─────────────────────────┴────────────┴──────────┴────────────┘
```

---

## 10. EDGE CASE SCREENS

### 10.1 — DIRECTOR / RELATIVE AS BORROWER (Special Case)

Triggered automatically when the borrower's member record is flagged as a Director or Director's relative.

```
┌────────────────────────────────────────────────────────────────┐
│  ⚠ SPECIAL CASE — DIRECTOR / RELATIVE APPLICANT              │
│  ─────────────────────────────────────────────────────────     │
│  Member: Ramesh Deshmukh (Director, SFPCL Board)              │
│  Relationship: Self — Executive Director                       │
│  Legal Reference: Companies Act 2013, Section 378ZK           │
│                                                                 │
│  MANDATORY REQUIREMENTS:                                       │
│  □  Loan scrutiny by remaining SC members ONLY                │
│     (Ramesh Deshmukh excluded from decision)                  │
│  □  Prior approval of Members in a General Meeting            │
│     required before loan may be granted                       │
│  □  GM resolution must be uploaded before document            │
│     workspace is unlocked                                      │
│                                                                 │
│  Current Status: ⬜ Awaiting GM Resolution Upload              │
│                                                                 │
│  [Upload GM Resolution →]                                      │
│  Disbursement and document prep are BLOCKED until complete.   │
└────────────────────────────────────────────────────────────────┘
```

---

### 10.2 — DEFAULT ESCALATION — SH-4 / UNDATED CHEQUE INVOCATION

The CS receives an authorised instruction from the Sanction Committee to invoke the SH-4 or present the undated cheque for recovery.

```
┌────────────────────────────────────────────────────────────────┐
│  SECURITY INVOCATION — SC AUTHORISED               ⚠ CRITICAL │
│  Loan: LO00000018  |  Borrower: Vijay More                     │
│  Board Approval Ref: SC-MIN-2025-31  |  Date: 09-Oct-2025     │
│                                                                 │
│  INVOCATION CHECKLIST                                          │
│  ✅ 3-month grace period expired                               │
│  ✅ 1-year extension expired                                   │
│  ✅ Non-payment note prepared by Credit Assessment Team        │
│  ✅ Sanction Committee decision recorded in SC Register        │
│  ✅ Board approval documented                                  │
│                                                                 │
│  SELECT ACTION:                                                 │
│  ○ Present undated cheque for recovery                         │
│    Amount to fill: ₹[auto-calc: ₹1,20,000 outstanding]        │
│    [Prepare Cheque Presentation Letter]                        │
│                                                                 │
│  ○ Invoke SH-4 (physical shares) — initiate share transfer    │
│    [Prepare Share Transfer Notice to Borrower]                 │
│                                                                 │
│  ○ Invoke CDSL pledge (D-MAT shares) — submit IRF to DP       │
│    [Generate Invocation Request Form (IRF)]                    │
│                                                                 │
│  ⚠ Every action here is IRREVERSIBLE and logged in the        │
│  Exception Register with SC authorization reference.           │
└────────────────────────────────────────────────────────────────┘
```

---

### 10.3 — LOAN CLOSED: 8-YEAR ARCHIVE TRIGGER

```
┌────────────────────────────────────────────────────────────────┐
│  LOAN CLOSED — ARCHIVE INITIATED                  ✅ NOC Issued│
│  Loan: LO00000082  |  Borrower: Rajesh Patil                   │
│  NOC Issued: 11-Oct-2025                                       │
│  Archive Expiry: 11-Oct-2033 (8 years from NOC date)           │
│                                                                 │
│  DOCUMENT CUSTODY ON CLOSURE                                   │
│  Physical File: ✅ Cabinet D-8, Row 3                          │
│  Scanned Copies: ✅ Digital archive uploaded (12 docs)         │
│  SH-4 / Blank Cheque: ✅ Returned to borrower                  │
│  CDSL Unpledge: N/A (physical shares)                          │
│                                                                 │
│  Archive Status: 🟢 Active — destroys Oct 2033                 │
│  [View Archive Record]  [Download Closure Summary]             │
└────────────────────────────────────────────────────────────────┘
```

---

## 11. CONTEXTUAL LOAN FILE PANEL (Slides from right, 440px)

Available anywhere a Loan ID is clicked within CS workflows. Shows CS-relevant snapshot.

```
┌──────────────────────────────────────────────────┐
│  LO00000091 — PRIYA RAMESH SHINDE               │
│  ● Documentation In Progress                    │
│  ─────────────────────────────────────────────   │
│  Loan Amount:   ₹60,000                         │
│  Approved:      12-Oct-2025                     │
│  Authority:     CFO (S. Nair) + Dir. (R. Desh.) │
│  Purpose:       Grape cultivation, Dindori       │
│                                                  │
│  DOCUMENT STATUS SNAPSHOT                       │
│  PoA:           ✅ Executed & notarised          │
│  Tri-Party:     ✅ All signed                    │
│  SH-4:          ⚠ Witness signature missing      │
│  Term Sheet:    ⬜ Awaiting CFO sign             │
│  Loan Agreement:⬜ Not yet drafted              │
│  Checklist:     ⬜ Incomplete                    │
│                                                  │
│  SECURITY DETAILS                               │
│  Share type:    Physical (SH-4)                 │
│  Blank cheque:  ✅ Received, Safe A-14           │
│  Cancelled chq: ✅ Received, IFSC verified       │
│                                                  │
│  COMPLIANCE FLAGS                               │
│  KYC – Borrower: ✅ Valid till Nov 2027          │
│  KYC – Nominee:  ✅ Valid till Nov 2027          │
│  Special Case:   None                           │
│                                                  │
│  [Open Document Workspace]  [Audit Log →]       │
└──────────────────────────────────────────────────┘
```

---

## 12. AUDIT LOG — CS VIEW

All CS actions are immutable and exportable.

```
[Timestamp]           [Actor]              [CS Action]
13-Oct-25 09:30       Anjali Mehta (CS)    Document Workspace opened — LO91
13-Oct-25 09:45       Anjali Mehta (CS)    PoA executed — stamp affixed ₹500
13-Oct-25 10:00       Anjali Mehta (CS)    PoA scan uploaded — Cabinet B-4
13-Oct-25 10:15       Anjali Mehta (CS)    Tri-party agreement signed
13-Oct-25 11:00       Anjali Mehta (CS)    SH-4 flagged — witness sig missing
13-Oct-25 11:05       Anjali Mehta (CS)    Reminder sent to borrower re: witness
14-Oct-25 09:00       Anjali Mehta (CS)    Blank-dated cheque logged — Safe A-14
14-Oct-25 09:30       Anjali Mehta (CS)    Term Sheet forwarded to CFO queue
```
Immutable. Export as PDF for statutory audit.

---

## 13. NOTIFICATION TYPES — CS ROLE

| Trigger | Notification | Priority |
|---|---|---|
| New loan approved by SC | "LO00000091 approved — begin document prep" | 🟡 High |
| Stamp paper running low (<5 in stock) | "Stamp paper inventory low — reorder" | 🟡 Medium |
| KYC expiry within 14 days | "Ganesh Thorat — KYC expires in 8 days" | 🔴 Critical |
| Loan fully repaid (SAP confirmed) | "LO00000082 fully repaid — issue NOC" | 🟡 High |
| SC authorises security invocation | "⚠ Board approved invocation — LO000018" | 🔴 Critical |
| Director borrower application received | "⚠ GM approval required — Deshmukh loan" | 🔴 Critical |
| Re-KYC request accepted by member | "Priya Shinde completed re-KYC — verify" | 🟢 Info |
| Compliance deadline 7 days out | "ML Act declaration due in 7 days" | 🟡 Medium |
| Disbursement complete (for records) | "LO000091 disbursed — archive checklist" | 🟢 Info |

---

## 14. FIGMA FILE STRUCTURE — CS ROLE

```
SFPCL — WhatsLoan — CS / Compliance Role/
├── 🎨 Design System/ (shared — reference from Credit Team file)
├── 📐 Wireframes (Lo-fi)/
│   └── All 7 screens + edge cases
├── 🖥 Desktop Designs (Hi-fi)/
│   ├── CS-1 — Dashboard (Home)
│   ├── CS-2 — Document Workspace
│   │   ├── CS-2a — PoA Tab
│   │   ├── CS-2b — Tri-Party Tab
│   │   ├── CS-2c — SH-4 Tab (Physical)
│   │   ├── CS-2d — CDSL Pledge Tab (D-MAT)
│   │   ├── CS-2e — Term Sheet Tab
│   │   ├── CS-2f — Loan Agreement Tab
│   │   ├── CS-2g — Bank Verify Tab (Match)
│   │   ├── CS-2h — Bank Verify Tab (Mismatch - Side by Side)
│   │   └── CS-2i — Master Checklist Tab + Sign-off Modal
│   ├── CS-3 — Compliance Calendar
│   ├── CS-4 — KYC Renewal Tracker + Re-KYC Request Modal
│   ├── CS-5 — NOC Issuance Queue + NOC Preview
│   ├── CS-6 — Stamp Duty Register
│   ├── CS-7 — Grievance Register
│   ├── CS-EC1 — Director Borrower Special Case Banner
│   ├── CS-EC2 — Security Invocation Screen (SH-4 / Cheque / CDSL)
│   └── CS-EC3 — Loan Closure + 8-Year Archive Trigger
├── 🔍 Contextual Panels/
│   ├── Loan File Panel (right-drawer, 440px)
│   └── Audit Log View
├── 📱 Tablet Responsive/
│   └── Key screens: Dashboard, Document Workspace, KYC Tracker
└── 📋 Prototype Flows/
    ├── Flow A: Approved Loan → Full Document Prep → CS Sign-off
    ├── Flow B: Loan Repaid → NOC Issue → Archive
    ├── Flow C: KYC Expiry → Bulk Re-KYC Request
    ├── Flow D: Signature Mismatch → Bank Letter Resolution
    └── Flow E: Director Borrower → GM Resolution Upload → Unlock
```

---

## 15. FIGMA FRAME NAMING (CS Role Convention)

```
CS-[ScreenCode]-[ScreenName]-[TabOrState]
Examples:
CS-1-Dashboard-Default
CS-2-DocumentWorkspace-SH4Tab-PhysicalShares
CS-2-DocumentWorkspace-SH4Tab-DMATPledge
CS-2-DocumentWorkspace-BankVerify-MismatchActive
CS-2-DocumentWorkspace-Checklist-CS-SignoffModal
CS-3-ComplianceCalendar-October-2025
CS-4-KYCTracker-Overdue-Filter
CS-5-NOCQueue-GenerateNOC-Preview
CS-EC1-DirectorBorrower-GMApprovalRequired
CS-EC2-SecurityInvocation-SH4Path
CS-EC3-LoanClosure-ArchiveTriggered
```

---

## DESIGN SOUL NOTE FOR THE FIGMA DESIGNER

The Company Secretary role is where agriculture meets the law. Every document the CS touches — the PoA, the SH-4, the notarised Loan Agreement — is a physical artifact with legal weight. The screen must feel like a **command centre for a meticulous professional**, not a generic form-filler.

The single biggest risk in this screen: the CS misses a required step or signs off a checklist with an incomplete document set. Design against this with obsessive visual hierarchy — **completed items recede, pending items demand attention, blocked items explain why they are blocked.** Never use colour as the only signal. Every red badge has a text label. Every ⚠ has an action button.

The signature of this role's design: the Document Workspace tabs should feel like opening a **physical legal file folder** — the warm `#FDFAF4` paper-tone background, the serif typeface inside document previews, the stamp-icon treatment on completed instruments. This tactile metaphor grounds the interface in the CS's real-world workflow without being kitsch.

One bold choice: the **Master Checklist tab** (CS-2i) should be the most visually distinct screen in the entire product. When the CS is about to sign off and unlock a ₹60,000 disbursement, the UI should shift into a solemn, focused mode — a centered modal overlay, white-on-dark-green header "FINAL SIGN-OFF", each of the four signature rows rendered with clear weight, and the final "Sign & Submit" button large, green, with a 2-second delay to prevent misclicks. This screen is not designed for speed. It is designed for certainty.

---
*Generated from SOP_SFPCL_LOANDISBURSEMENT v1.0 | WhatsLoan × Sahyadri Farms | CS / Compliance Role*
*Companion to: SFPCL_CreditTeam_Figma_Prompt_DeepDive.md | SFPCL_FarmerRole_Figma_Prompt_DeepDive.md*
