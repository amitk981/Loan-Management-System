# SFPCL Loan Platform — Finance / Treasury Role
## Figma Deep-Dive Design Prompt
### Document Reference: WhatsLoan × Sahyadri Farms | Treasury Team UI Specification
**Version:** 1.0 | **Role Scope:** Senior Manager – Finance + Chief Financial Controller
**Frame Prefix:** `T-` | **Role Color Accent:** `#0891B2` (Cyan) | **Canvas:** 1440px Desktop-first

---

## WHO THIS IS FOR — ROLE PRIMER

The Treasury/Finance role has **two distinct sub-personas** that share the same sidebar but operate at different permission levels:

| Sub-Role | Platform Label | Primary Job | Decision Authority |
|---|---|---|---|
| Senior Manager – Finance | **Finance Manager** | Initiate payments, create SAP codes, track repayments | Initiator (Maker) |
| Chief Financial Controller | **Finance Controller** | Authorize bank transfers, final payment sign-off | Authorizer (Checker) |

**Mental Model:** This user thinks in **transactions, not applications.** By the time work reaches Treasury, all approvals are done. Their world is: "What do I need to pay out today? What came in? Is SAP correct?" Every screen should feel like a clean financial operations console — precise, fast, and audit-proof.

**Core Anxiety:** Disbursing to the wrong account, posting an incorrect SAP entry, or missing a repayment receipt. Design must eliminate ambiguity at every step.

---

## SIDEBAR NAVIGATION — TREASURY TEAM

**Sidebar specs:** 240px expanded / 64px collapsed | bg: `#1A3C2A` (brand-primary) | accent ring: `#0891B2` (cyan)

**Role badge** in sidebar footer: Cyan pill — "Finance Manager" or "Finance Controller"

```
NAVIGATION ITEMS
─────────────────────────────
📊  Dashboard                    ← T-1
─────────────────────────────
💸  Disbursement Queue           ← T-2 parent
    └── ⏳ Pending Initiation    ← T-2a  [badge: count]
    └── 🔐 Pending Authorization ← T-2b  [badge: count, cyan]
    └── ✅ Disbursed Today       ← T-2c
─────────────────────────────
🏦  SAP Management               ← T-3 parent
    └── 👤 Customer Code Setup   ← T-3a
    └── 📒 SAP Entries Log       ← T-3b
─────────────────────────────
💰  Repayment Tracking           ← T-4 parent
    └── 📥 Incoming (Direct)     ← T-4a
    └── 🏢 Subsidiary Deductions ← T-4b
    └── 📈 Interest Accruals     ← T-4c
─────────────────────────────
📊  Financial Reports            ← T-5 parent
    └── 🔄 Bank Reconciliation   ← T-5a
    └── 📋 Ledger Summary        ← T-5b
    └── 📤 Export Centre         ← T-5c
─────────────────────────────
```

**Permission differentiation in nav:**
- Finance Manager: All items active
- Finance Controller: "Pending Authorization" highlighted with cyan dot; "Customer Code Setup" is read-only

---

## SCREEN T-1: FINANCE MANAGER DASHBOARD

**Frame name:** `T-1-Dashboard-Default`
**Canvas:** 1440×900 | **Layout:** Standard shell (56px header + 240px sidebar + content area)

---

### TOP HEADER (56px, bg: brand-primary)
- Left: Hamburger icon → WhatsLoan logo (white)
- Center: Breadcrumb — `Dashboard`
- Right: Search icon | Bell icon (notification badge) | Language toggle | Avatar + "Rajesh Kulkarni · Finance Manager" + cyan role ring

---

### PAGE HEADER BAND (48px, bg: white, border-bottom: neutral-200)
- Left: **"Treasury Operations"** (`heading-md`, neutral-900) + Sub: "Today: Wednesday, 10 Jun 2026" (`body-sm`, neutral-400)
- Right: **"+ Initiate Disbursement"** button (bg: `#0891B2` cyan, white text, radius-md) | "Refresh" ghost button (icon only)

---

### ROW 1 — KPI STAT CARDS (4-column grid, 16px gap)

Each card: bg white, radius-xl, shadow-sm, 16px padding, 120px height

**Card 1 — Pending Disbursements**
- Icon: 🏦 (cyan, 24px, bg: `#CFFAFE` circle)
- Label: `"Pending Disbursement"` (label-md, neutral-400)
- Value: `"₹8,42,000"` (display-lg, neutral-900, mono-md)
- Sub-line: `"4 loans awaiting initiation"` (body-sm, neutral-400)
- Bottom tag: orange pill `"2 urgent (>1 day)"` with ⚠️ icon

**Card 2 — Disbursed Today**
- Icon: ✅ (success-500, 24px, bg: `#DCFCE7` circle)
- Label: `"Disbursed Today"`
- Value: `"₹3,20,000"` (display-lg, success-500)
- Sub-line: `"2 transactions completed"`
- Bottom tag: green pill `"All SAP entries posted"`

**Card 3 — SAP Codes Pending**
- Icon: 🖥️ (info-500, 24px)
- Label: `"SAP Codes Pending"`
- Value: `"3"` (display-lg, info-500)
- Sub-line: `"Farmer profiles awaiting creation"`
- Bottom tag: blue pill `"Awaiting email from Credit Mgr"`

**Card 4 — Repayments Received Today**
- Icon: 📥 (brand-secondary, 24px)
- Label: `"Repayments Today"`
- Value: `"₹62,500"` (display-lg, brand-secondary)
- Sub-line: `"3 payments · 2 direct, 1 via subsidiary"`
- Bottom tag: amber pill `"1 entry pending SAP posting"`

---

### ROW 2 — DISBURSEMENT QUEUE (full-width card, 200px height)

**Card header:** "Disbursement Queue — Action Required" (`heading-sm`) + "View All" link (cyan)

**Table (compact 5 rows, showing top priority items):**

| Loan ID | Borrower | Amount | Stage | CS Sign | SAP Code | Waiting | Action |
|---|---|---|---|---|---|---|---|
| LO00000047 | Ramesh Patil | ₹2,00,000 | Pending Initiation | ✅ | SFCUST-0482 | 4 hrs | [Initiate →] |
| LO00000048 | Sahyadri Grape FPC | ₹5,00,000 | **Pending Auth** | ✅ | SFCUST-0483 | 2 hrs | [Awaiting CFC] |
| LO00000049 | Sunanda More | ₹1,50,000 | Pending Initiation | ✅ | SFCUST-0484 | **1 day 3hrs** 🔴 | [Initiate →] |
| LO00000050 | Prakash Shinde | ₹90,500 | SAP Code Pending | ⏳ | — | 6 hrs | [Create SAP] |

- Row height: 48px
- "Waiting" column: green if <4 hrs, amber if 4-8 hrs, red if >1 day
- LO IDs: `mono-md`, neutral-700
- Amounts: `mono-md`, right-aligned, neutral-900
- Action buttons: cyan ghost button, radius-sm, 28px height

---

### ROW 3 — TWO-COLUMN SECTION (60% / 40% split, 24px gap)

**Left (60%) — Repayment Activity Feed (card, scrollable, 240px height):**
- Header: "Today's Repayment Activity" + mini calendar icon
- List items (each 40px):
  - 🟢 `10:42 AM` — Ramesh Patil · LO00000031 · ₹25,000 received via NEFT · UTR: `UTIB2025060100823` · `[Post to SAP]`
  - 🟢 `09:15 AM` — Sahyadri PHC Ltd. (subsidiary) · LO00000028 · ₹37,500 deduction transferred · `Posted ✓`
  - 🟡 `08:30 AM` — Vilas Jadhav · LO00000022 · ₹10,000 received · UTR unconfirmed · `[Verify UTR]`
- Each row: Left timestamp (body-sm, neutral-400) | Name + Loan ID | Amount (mono-md) | UTR (mono-sm) | Action chip
- "View All Repayments" link (cyan, body-sm)

**Right (40%) — Interest Accruals Summary (card, 240px height):**
- Header: "Monthly Interest Accruals" + `"Jun 2026"` month label
- 3-row list:
  - Total interest accrued this month: `₹24,300` (mono-md, success-500)
  - Interest invoices pending issue: `7 loans` (amber)
  - Interest capitalized (30 Apr cutoff): `₹8,200 added to principal` (info-500)
- "Generate Interest Invoices" CTA button (brand-secondary, full-width, 36px)
- Note below: `body-sm`, neutral-400 — "Interest entries posted monthly per SOP §6.1"

---

### ROW 4 — FINANCIAL SNAPSHOT CHARTS (two-column, equal)

**Left — Disbursements vs Repayments (line chart, 200px height):**
- 12-month trend (Jul 2025–Jun 2026)
- Two lines: Cyan = Disbursements (₹) | Green = Repayments (₹)
- X-axis: Month labels abbreviated (Jul, Aug…)
- Y-axis: ₹ amounts in lakhs
- Hover tooltip: `"Apr 2026: Disbursed ₹6.2L | Repaid ₹4.8L"`
- Chart title: "₹ Flow — Last 12 Months" (heading-sm)

**Right — Outstanding Loan Portfolio Split (donut chart, 200px):**
- Segments: Principal Outstanding (brand-primary) | Interest Outstanding (cyan) | Overdue Interest (error-500)
- Center label: "₹42.6L Total" (heading-md, bold)
- Legend below: colored squares + labels + ₹ values
- Chart title: "Portfolio Composition"

---

## SCREEN T-2: DISBURSEMENT PROCESSING (6-STEP WORKFLOW)

**Frame names:**
- `T-2-Disbursement-Step1-Preflight`
- `T-2-Disbursement-Step2-BankVerify`
- `T-2-Disbursement-Step3-Initiate`
- `T-2-Disbursement-Step4-AuthPending`
- `T-2-Disbursement-Step4-AuthorizeView` (Finance Controller's view)
- `T-2-Disbursement-Step5-SAPEntry`
- `T-2-Disbursement-Step6-Complete`

---

### STEP PROGRESS NAVIGATOR (sticky, below page header)
**Full-width horizontal stepper, 64px height, bg: white, border-bottom: neutral-200**

```
●──────────────●──────────────●──────────────●──────────────●──────────────●
1              2              3              4              5              6
Pre-flight     Beneficiary    Initiate       Authorize      SAP Entry      Complete
Checklist      Verification   Payment        Payment        Confirm
```

- Active step: `#0891B2` filled circle + bold label
- Completed steps: `#22C55E` (success) filled circle + checkmark icon
- Future steps: neutral-300 circle + neutral-400 label
- Connecting line: gradient from success to active to neutral
- Under each step label: 1-line hint text in body-sm, neutral-400

---

### STEP 1 — PRE-FLIGHT CHECKLIST

**Frame:** `T-2-Disbursement-Step1-Preflight-AllClear`

**Page layout:** Left panel (60%) — checklist | Right panel (40%) — loan summary card

**Left Panel:**

**Section header:** "Pre-Disbursement Verification" (heading-md) + Loan ID `LO00000047` (mono-md, cyan) + Borrower: `Ramesh Patil` (body-lg)

**Checklist items (5 mandatory gates, each 56px height):**

Each row structure: [Status icon 24px] [Item label body-lg] [Verified by + timestamp body-sm, neutral-400] [Detail link]

1. ✅ **CS Signature on Checklist** — "Verified: Anita Sharma (CS) · 10 Jun 2026, 9:00 AM" · [View Checklist]
2. ✅ **Credit Manager Signature** — "Verified: Suresh Nair · 10 Jun 2026, 9:15 AM" · [View Appraisal Note]
3. ✅ **Sanction Committee Approval** — "CFO + 1 Director · 09 Jun 2026, 4:30 PM" · [View Sanction]
4. ✅ **All 15 Documents Present in File** — "15/15 complete · Last doc: Loan Agreement" · [View Docs]
5. 🟡 **SAP Customer Code Created** — "Code: SFCUST-0482 · Created: 10 Jun 2026, 9:45 AM" · [View in SAP Log]

- ✅ rows: success-100 bg, success-500 left border 3px, check icon
- 🟡 rows: warning-100 bg, warning-500 left border 3px, clock icon
- ✗ rows (if any): error-100 bg, error-500 left border, X icon + "Cannot proceed" note

**Annotation 🔴:** "All 5 gates must show ✅ before 'Proceed to Payment Initiation' button is enabled. Any ✗ stops disbursement."

**Bottom action:** `"Proceed to Beneficiary Verification →"` — full-width cyan button, 48px, disabled if any gate fails

---

**Right Panel — Loan Summary Card (sticky, bg: white, shadow-sm, radius-xl, 16px padding):**

Header: `"Loan Summary"` (heading-sm) + Stage badge: `"Stage 5: Disbursement"` (cyan pill)

```
Loan ID         LO00000047
Borrower        Ramesh Patil
Folio No.       SH-04821
Sanctioned Amt  ₹2,00,000
Loan Type       Short-term (≤1 year)
Purpose         Grape cultivation inputs
Interest Rate   12% p.a. (Floating)
Repayment Date  31 Mar 2027
Sanction Date   09 Jun 2026
Authority       CFO + Dir. P. Desai
```

Fields: left label (label-md, neutral-400) | right value (body-md, neutral-900)
Amount field: `mono-md`, neutral-900, right-aligned
Sanctioned amount: large treatment — `heading-sm`, neutral-900

Divider below → "Security"
- SH-4 Form: ✅ Held (physical)
- Blank Cheque: ✅ In custody
- PoA: ✅ Notarized

---

### STEP 2 — BENEFICIARY VERIFICATION

**Frame:** `T-2-Disbursement-Step2-BankVerify`

**Layout:** Centered content, max 800px

**Section: "Beneficiary Bank Account Verification"** (heading-md)

**Bank Details Card (border: 2px neutral-200, radius-xl, 24px padding):**

```
┌─────────────────────────────────────────────┐
│  Beneficiary Bank Details — Ramesh Patil    │
│  Source: Application Form (Cancelled Cheque)│
├─────────────────────────────────────────────┤
│  Account Holder Name   RAMESH VISHWAS PATIL │
│  Bank Name             State Bank of India  │
│  Branch                Nashik Main Branch   │
│  Account Number        ●●●●  ●●●●  4821    │ ← masked
│  IFSC Code             SBIN0001234          │
│  Account Type          Savings              │
├─────────────────────────────────────────────┤
│  ✅ Matches cancelled cheque submitted      │
│  ✅ Penny drop verification passed          │
│  Last verified: 10 Jun 2026, 08:00 AM       │
└─────────────────────────────────────────────┘
```

- "Matches cancelled cheque" → success-100 bg, success-500 text, checkmark icon
- "Penny drop verification passed" → info-100 bg (optional integration note annotation 🔵)
- Account number: `mono-md`, with "Unmask" eye icon (requires 2FA per annotation 🔴)

**SFPCL Debit Account Selector:**
Label: `"Debit From (SFPCL Account)"` (label-md)
Dropdown (selected state shown): `"SFPCL — RBL Bank · A/C XXXX-XXXX-8842 · Operating A/C"`
Sub-note: `body-sm`, neutral-400 — "This is the company's designated disbursement account per SOP §5.3"

**If signature mismatch flag exists (conditional, warning state):**
- warning-100 bg banner: "⚠️ Signature mismatch flagged during credit review. Bank Verification Letter / Borrower Declaration uploaded by CS. [View Document]"

**Bottom:** "Proceed to Payment Initiation →" (cyan button) | "← Back" (ghost)

---

### STEP 3 — PAYMENT INITIATION (Finance Manager view)

**Frame:** `T-2-Disbursement-Step3-Initiate`

**Layout:** Two-column (Left 55% payment form | Right 45% confirmation preview)

**Left — Payment Form:**

Header: "Initiate Payment" (heading-md) + Sub: "Initiated by: Sr. Manager – Finance · Maker role"

**Form fields (each 64px height with label above):**

- **Disbursement Amount**
  - Read-only field: `₹2,00,000` (`mono-md`, 24px font size, neutral-900)
  - Note below: `"Sanctioned by CFO + Director — cannot be edited"` (body-sm, neutral-400)
  - Annotation 🟡: "Amount pulled from Credit Sanction Register — hardcoded to approved figure"

- **Payment Mode** (auto-selected)
  - Radio cards: [NEFT] [RTGS]
  - NEFT card: selected if amount ≤ ₹2L | RTGS: selected if > ₹2L
  - Each card 80px height: Icon + Mode name + `"Typically 2-4 hrs"` or `"Same day"`
  - Annotation 🟡: "Auto-selects RTGS for amounts above ₹2,00,000 per standard banking practice"
  - Selected card: border `#0891B2` 2px, info-100 bg

- **Transaction Remarks**
  - Pre-filled: `"Loan disbursement — SFPCL Member Credit — Ref: LO00000047"`
  - Editable (max 100 chars)
  - Character counter: `"52/100"`

- **Initiation Date & Time**
  - Read-only: `"10 Jun 2026 · 10:15 AM"` (system timestamp)

- **Authorizing Role Required**
  - Read-only tag: `"Chief Financial Controller authorization required"` (info-500 pill)

**Submit row:**
- `"Send to Finance Controller for Authorization →"` — cyan full-width button, 48px
- "← Back" — ghost left
- Annotation 🔴: "Submission here moves transaction to CFC's authorization queue. Finance Manager cannot authorize own transaction."

---

**Right — Payment Preview Card (sticky, bg: neutral-100, radius-xl, 24px padding):**

Header: `"Payment Preview"` (heading-sm, neutral-900)

```
Transfer Details
─────────────────────────────────────────
FROM    SFPCL · RBL Bank · XXXX-8842
TO      Ramesh Patil · SBI · XXXX-4821
AMOUNT  ₹ 2,00,000.00
MODE    NEFT
REF     LO00000047
REMARKS Loan disbursement — SFPCL Member
        Credit — Ref: LO00000047
─────────────────────────────────────────
SAP Entry Preview
  Dr: Member Loan A/c (LO47)  ₹2,00,000
  Cr: RBL Bank A/c             ₹2,00,000
─────────────────────────────────────────
Status  ⏳ Awaiting CFC Authorization
```

- FROM/TO labels: label-sm, neutral-400
- Values: body-md, neutral-900
- AMOUNT: mono-md, 20px, neutral-900
- SAP entry preview: `mono-sm`, neutral-700
- Status row: warning-100 bg, warning-500 text

---

### STEP 4A — AUTHORIZATION QUEUE (Finance Controller's View)

**Frame:** `T-2-Disbursement-Step4-AuthorizeView-CFCQueue`

This is the **Chief Financial Controller's dedicated authorization screen.** Different from Finance Manager's view.

**Page Header:** `"Pending Payment Authorizations"` (heading-md) + `"2 pending · ₹7,00,000 total"` (body-sm, warning-500)

**Authorization Table (full-width, each row 72px):**

| | Loan ID | Borrower | Amount | Mode | Initiated By | Initiated At | Waiting | Action |
|---|---|---|---|---|---|---|---|---|
| 🔴 | LO000049 | Sunanda More | ₹1,50,000 | NEFT | R. Kulkarni | Yesterday 4PM | **22 hrs** | [Review & Authorize] |
| 🟡 | LO000047 | Ramesh Patil | ₹2,00,000 | NEFT | R. Kulkarni | Today 10:15 AM | 45 min | [Review & Authorize] |

- Waiting column: red if >12 hrs, amber if 4-12 hrs, green if <4 hrs
- Each row: hover bg neutral-100
- Row click = opens authorization panel (right drawer, 480px)
- [Review & Authorize] button: cyan, 32px height

---

**Authorization Detail Drawer (480px, right side):**

Header: `"Authorize Payment"` (heading-md) + Loan ID (mono-md, cyan) + Close ×

**Sections:**

**1. Disbursement Details (read-only grid):**
```
Borrower        Ramesh Patil
Loan ID         LO000047
Amount          ₹2,00,000
Mode            NEFT
From Account    SFPCL · RBL Bank · XXXX-8842
To Account      Ramesh Patil · SBI · XXXX-4821
Initiated By    Rajesh Kulkarni (Sr. Mgr. Finance)
```

**2. Document Verification Quick-links:**
- 3 icon links: [📄 View Sanction Note] [✅ View Checklist] [🏦 View SAP Preview]
- All open in new tab / modal

**3. Authorization Action:**
- Header: `"Chief Financial Controller Authorization"` (heading-sm)
- 2FA prompt: "Enter OTP sent to +91 98765 XXXXX to authorize" (6-digit OTP input boxes, 48×48px each)
- OTP timer: `"Resend in 55s"`
- Two large action buttons (48px height each):
  - **[✓ Authorize & Execute Payment]** — success-500 bg, white, full-width
  - **[✗ Reject / Hold]** — error-100 bg, error-500 text, full-width
- Annotation 🔴: "2FA is mandatory before authorization. OTP invalidates after 5 minutes. Each transaction requires fresh OTP."

**On Authorization Success:**
- Drawer closes
- Row updates: green badge `"Authorized ✓"` → moves to Step 5
- Toast (top-right): `"Payment authorized. Bank transfer initiated. Ref: TXN20260610-0047"` (success-500 border)

---

### STEP 5 — SAP ENTRY CONFIRMATION

**Frame:** `T-2-Disbursement-Step5-SAPEntry`

**Layout:** Centered, max 720px

Header: "SAP Entry Confirmation" (heading-md) + sub: "Post the disbursement entry to maintain accurate financial records"

**SAP Journal Entry Preview Card (bg: neutral-900, white text, `mono-md`, radius-xl, 24px padding — "terminal style"):**

```
SAP Journal Entry — Auto-Generated
═══════════════════════════════════════
Transaction Code : FB01
Document Type    : ZL (Loan Disbursement)
Posting Date     : 10.06.2026
Company Code     : SFPCL
─────────────────────────────────────────
Line  Account         Description         Amount
1     10001482        Member Loan A/c     Dr  ₹2,00,000
      (Customer: SFCUST-0482)
      (Ref: LO000047 · Ramesh Patil)
2     11002001        RBL Bank A/c        Cr  ₹2,00,000

─────────────────────────────────────────
Status: ⏳ Pending Confirmation
Posted by: Rajesh Kulkarni
═══════════════════════════════════════
```

- Font: `Roboto Mono`, 13px, white-on-dark
- Highlight Dr/Cr rows: Dr in cyan-400, Cr in success-400
- "Auto-Generated" label: label-sm, neutral-400 in normal mode; white/60% in dark card

**Confirmation checkbox:**
- Large checkbox (24×24px): `"I confirm the above journal entry is accurate and the disbursement of ₹2,00,000 to Ramesh Patil (A/C XXXX-4821) has been completed."`
- Required before confirm button activates

**Action row:**
- **"Confirm SAP Entry"** — brand-secondary full-width button, 48px, disabled until checkbox ticked
- **"Report Discrepancy"** — ghost button, error-500 text (opens issue form modal)

**Annotation 🟡:** "SAP entry should be confirmed same day as disbursement per SOP §5.3. Delays trigger alert to accounts head."

---

### STEP 6 — DISBURSEMENT COMPLETE

**Frame:** `T-2-Disbursement-Step6-Complete`

**Layout:** Centered celebration state, max 600px

**Success Illustration:** Simple SVG — green circle with white checkmark, 96px, subtle pulse animation ring

**Heading:** `"Disbursement Complete!"` (display-lg, success-500)
**Sub:** `"₹2,00,000 disbursed to Ramesh Patil · LO000047"` (heading-sm, neutral-700)

**Confirmation Details Card (border: success-500 2px, radius-xl, bg: success-100, 24px padding):**
```
Transaction Reference   TXN20260610-0047
UTR Number              NEFT20260610-82910
Disbursed Amount        ₹2,00,000.00
Beneficiary Account     SBI · XXXX-4821
Disbursement Time       10 Jun 2026 · 10:58 AM
SAP Entry               Posted ✓
```

**Auto-Actions Confirmed (checklist, each with success icon):**
- ✅ Loan register updated (Active Loans)
- ✅ Disbursement advice generated — farmer notified via SMS + app
- ✅ Loan stage tracker updated: Stage 5 "Disbursed" marked
- ✅ Farmer notification sent: `"Namaste Ramesh Ji, ₹2,00,000 credited to your SBI account..."`

**Action Buttons (horizontal, center-aligned):**
- `"Download Disbursement Advice (PDF)"` — brand-primary, 44px, download icon
- `"Go to Disbursement Queue"` — ghost, neutral-700
- `"Back to Dashboard"` — ghost, neutral-700

**Annotation 🟡:** "Disbursement Advice PDF should match Annexure format from SOP. Contains: Borrower name, loan ID, amount, account, date, reference number."

---

## SCREEN T-3a: SAP CUSTOMER CODE SETUP

**Frame:** `T-3-SAPCustomerCodeSetup-Default`

**Page Header:** "SAP Customer Code Creation" (heading-md) + "Requests from Credit Manager" (body-sm, neutral-400)

**Layout:** Two-column (Left 55% — creation form | Right 45% — creation log)

---

### LEFT — CODE CREATION FORM

**Incoming Request Banner (info-100 bg, info-500 left border 4px, radius-md, 16px padding):**
```
📧 Email Request Received
From: Suresh Nair (Credit Manager)  |  10 Jun 2026 · 09:30 AM
Loan ID: LO000050  |  Applicant: Prakash Shinde
"Please create SAP customer profile for above farmer."
[View Original Email]
```

**Form: "Create New SAP Customer Code"**
Sub-label: `"First-time applicant — new Customer ID required per SOP §5.1"` (body-sm, neutral-400)

Fields (each 56px, label above, 8px gap):

| Field | Type | Pre-filled? | Note |
|---|---|---|---|
| Farmer Full Name | Text (read-only) | ✅ `"Prakash Ramchandra Shinde"` | From application |
| Aadhaar Number | Text (masked) | ✅ `"XXXX-XXXX-3421"` | Read-only |
| PAN Number | Text | ✅ `"ABCPS1234F"` | Read-only |
| Address | Textarea | ✅ Village, Taluka, District, PIN | Editable |
| Email ID | Email input | ✅ `"prakash.s@gmail.com"` | Editable |
| Loan Application Number | Text (mono-md) | ✅ `"LO000050"` | Read-only |
| SAP Company Code | Dropdown | `"SFPCL"` | Read-only |
| Customer Account Group | Dropdown | `"Z001 — FPC Member Borrower"` | Pre-selected |

**Duplicate Check (inline):**
- Auto-checks on PAN entry: if existing code found → warning banner:
  `"⚠️ Customer SFCUST-0422 already exists for this PAN. This may be an existing borrower taking a second loan. Existing ID will be used — no new code required."`
  Annotation 🟠: "Do not create duplicate SAP customer IDs. If existing, use that ID for new loan."

**If new (no duplicate):**
- Button: `"Create SAP Customer Code"` — cyan, full-width 48px
- On creation: auto-generates preview `"SFCUST-XXXX"` (sequential)
- Success toast: `"Customer code SFCUST-0485 created. Email confirmation sent to Credit Manager."`

---

### RIGHT — SAP CREATION LOG

**Table header:** "Recent SAP Code Creations" (heading-sm)

| Date | Loan ID | Farmer Name | SAP Code | Created By | Status |
|---|---|---|---|---|---|
| 10 Jun | LO000047 | Ramesh Patil | SFCUST-0482 | R. Kulkarni | ✅ Active |
| 09 Jun | LO000048 | Sahyadri FPC | SFCUST-0483 | R. Kulkarni | ✅ Active |
| 09 Jun | LO000046 | Vilas Jadhav | (Duplicate detected) | R. Kulkarni | ⚠️ Existing |

- Status pills: success-100 "Active" or warning-100 "Existing ID used"
- Row click → opens SAP detail drawer

---

## SCREEN T-3b: SAP ENTRIES LOG

**Frame:** `T-3-SAPEntriesLog-Default`

**Purpose:** Full audit log of all SAP financial entries posted by Treasury team.

**Filter Bar (horizontal, above table, bg: white, 48px height):**
- Date range picker (DD/MM/YYYY — DD/MM/YYYY)
- Entry Type dropdown: All / Loan Disbursement / Repayment Receipt / Interest Accrual / Interest Capitalization
- Loan ID search (text input, mono-md)
- Farmer Name search
- Posted By dropdown
- [Apply Filters] cyan button | [Clear All] ghost

**Main Table (full-width):**

| Date | SAP Doc No. | Loan ID | Borrower | Entry Type | Dr Account | Cr Account | Amount | Posted By | Status |
|---|---|---|---|---|---|---|---|---|---|
| 10 Jun | 1400000234 | LO000047 | R. Patil | Disbursement | Loan A/c | RBL Bank | ₹2,00,000 | R. Kulkarni | ✅ Posted |
| 10 Jun | 1400000235 | LO000031 | R. Patil | Repayment | RBL Bank | Loan A/c | ₹25,000 | R. Kulkarni | ✅ Posted |
| 09 Jun | 1400000230 | LO000022 | V. Jadhav | Interest Accrual | Interest A/c | Accrued Liab. | ₹1,200 | R. Kulkarni | ⏳ Pending Review |

- SAP Doc No.: `mono-sm`, neutral-700
- Loan IDs: `mono-md`, cyan, hyperlink-style (click → open loan profile)
- Amounts: `mono-md`, right-aligned
- Dr/Cr Account: abbreviated (`body-sm`, neutral-700)
- Status: color pills

**Row Expand (click row → inline expand 80px):**
- Full Dr/Cr breakdown | Posting date | SAP transaction code | Remarks | "View in SAP" external link icon

**Export Button (top-right):** "Export CSV" | "Export PDF"

---

## SCREEN T-4a: REPAYMENT TRACKING — INCOMING PAYMENTS (DIRECT)

**Frame:** `T-4-Repayment-DirectPayments-Default`

**Page header:** "Incoming Repayments — Direct" + sub: "Farmers repaying directly via RTGS/NEFT"

**Summary Banner (full-width, neutral-900 bg, white text, 64px, radius-md):**
```
This Month's Collections:  ₹2,18,500 received  |  14 transactions  |  ₹43,200 pending SAP posting
```
- 3 stats separated by vertical dividers (white/20%)
- "₹43,200 pending" in warning-500

---

**Two-tab layout:**

**Tab 1: "Awaiting SAP Entry" (badge: 3)**

Table: unposted repayments needing same-day SAP entry

| Date | UTR No. | Farmer Name | Loan ID | Amount | Mode | Adj. (Principal) | Adj. (Interest) | Balance After | Action |
|---|---|---|---|---|---|---|---|---|---|
| 10 Jun | UTIB2025... | Ramesh Patil | LO000031 | ₹25,000 | NEFT | ₹25,000 | ₹0 | ₹1,17,500 | [Post to SAP] |
| 10 Jun | (UTR missing) | Vilas Jadhav | LO000022 | ₹10,000 | RTGS | — | — | — | [Verify UTR] ⚠️ |

- Annotation 🟡: "Repayment adjustment rule: partial payments applied to principal first, then interest — per SOP §6.1. System auto-calculates split."
- "Post to SAP" → opens SAP confirmation modal (compact version of Step 5)
- UTR missing row: error-100 bg, warning icon, [Verify UTR] opens text input for manual UTR entry

**"Post All to SAP" bulk button** (cyan, appears when ≥1 row selected with ☐ checkboxes)

---

**Tab 2: "Posted Payments" (history)**

Same columns minus Action, plus "SAP Doc No." column
- Filter by date range, farmer, loan ID
- Export CSV

---

**Repayment Allocation Logic Panel (expandable info card, info-100 bg, at top of tab):**
```
How Repayments Are Allocated:
1. Partial repayments → Principal first, then interest (SOP §6.1 — hardcoded)
2. If interest unpaid by 30 April → Added to principal for next FY (Interest Capitalization)
3. Full repayment → Triggers NOC workflow to Compliance Team
```
- Annotation 🟡: Link to SOP section for reference. This panel is collapsible.

---

## SCREEN T-4b: SUBSIDIARY DEDUCTIONS

**Frame:** `T-4-Repayment-SubsidiaryDeductions-Default`

**Purpose:** Track loan repayments collected by subsidiary (Sahyadri Farms Post Harvest Care Ltd.) on behalf of farmers and remitted to SFPCL.

**Page header:** "Subsidiary Deductions — Repayment Receipts" + sub: "Via Sahyadri Farms Post Harvest Care Limited (tri-party agreement)"

**How It Works — Info Banner (neutral-100 bg, brand-primary left border 4px, 80px height):**
```
🏢 Tri-Party Repayment Flow
Farmer sells produce → Subsidiary pays farmer → Subsidiary DEDUCTS loan repayment 
→ Transfers deducted amount to SFPCL → SFPCL posts to SAP
Each bank transaction must show Farmer Name + Loan ID for reconciliation.
```

**Main Table:**

| Statement Date | Farmer Name | Loan ID | Subsidiary Ref No. | Gross Produce Payment | Deduction Amount | Net to Farmer | Received by SFPCL | Reconciled | Action |
|---|---|---|---|---|---|---|---|---|---|
| 08 Jun | Ramesh Patil | LO000028 | SFPHC-06-0824 | ₹87,500 | ₹37,500 | ₹50,000 | ✅ 09 Jun | ✅ Matched | [View] |
| 05 Jun | Sunanda More | LO000035 | SFPHC-06-0819 | ₹54,000 | ₹20,000 | ₹34,000 | ⏳ Pending | ⏳ Unmatched | [Reconcile] |

- Deduction Amount: `mono-md`, brand-secondary (repayment color)
- "Received by SFPCL": success-100 "✅ Date" or warning-100 "⏳ Pending"
- "Reconciled": ✅ Matched or ⏳ Unmatched (reconcile = match bank statement to deduction record)

**[Reconcile] action (opens drawer, 480px):**
- Shows: Subsidiary bank transfer record vs SFPCL bank receipt
- "Match & Post to SAP" button
- Manual override with reason (if amounts differ slightly)
- Annotation 🟠: "Amounts must match within ₹1 tolerance. Any larger discrepancy must be escalated to CFO."

---

## SCREEN T-4c: INTEREST ACCRUALS

**Frame:** `T-4-InterestAccruals-Default`

**Page header:** "Interest Accrual Management" + sub: "Monthly accruals + Year-end invoice generation + Capitalization"

**Three-panel layout (tabs):**

---

**Tab 1: Monthly Accruals**

**Current Month Summary bar (full-width, neutral-900 bg, 56px):**
`"June 2026 — Accruing interest on 47 active loans · Total this month: ₹24,300"`

**Table:**

| Loan ID | Borrower | Principal O/S | Rate | Monthly Interest | Accrual Date | SAP Entry | Status |
|---|---|---|---|---|---|---|---|
| LO000031 | Ramesh Patil | ₹1,42,500 | 12% | ₹1,425 | 30 Jun | 1400000241 | ✅ Posted |
| LO000035 | Sunanda More | ₹80,000 | 12% | ₹800 | 30 Jun | — | ⏳ Pending |

- Monthly Interest = Principal × Rate / 12 (formula shown in column tooltip)
- "Generate All June Accruals" button (brand-secondary, 44px) — posts all pending accrual SAP entries in batch
- Annotation 🟡: "Credit Manager generates yearly invoices; Treasury posts monthly SAP accrual entries — per SOP §6.2"

---

**Tab 2: Year-End Interest Invoices**

**Period selector:** FY dropdown (2025-26 selected)

**Invoice Status Table:**

| Loan ID | Borrower | FY Interest Total | Invoice Generated | Invoice Date | Payment Status | Due By | Action |
|---|---|---|---|---|---|---|---|
| LO000031 | Ramesh Patil | ₹17,100 | ✅ Yes | 31 Mar 2026 | ✅ Paid | 30 Apr 2026 | [View Invoice] |
| LO000022 | Vilas Jadhav | ₹9,600 | ✅ Yes | 31 Mar 2026 | ❌ Unpaid | 30 Apr 2026 | [Capitalize →] |
| LO000035 | Sunanda More | ₹9,600 | ⏳ Pending | — | — | 30 Apr 2026 | [Generate] |

- "Capitalize →" action row: error-100 bg (unpaid past Apr 30 deadline)
- [Capitalize] → opens confirmation modal: "Add ₹9,600 unpaid interest to LO000022 principal. New principal: ₹89,600. Next FY interest calculated on ₹89,600."
- [Generate] → generates and emails invoice PDF to farmer
- Annotation 🔴: "Capitalization (adding unpaid interest to principal) only valid AFTER 30 April cutoff and AFTER company intimation letter sent to borrower — SOP §6.1"

---

**Tab 3: Interest Capitalization Log**

History of all capitalization entries with:
- Loan ID | Borrower | FY | Interest Capitalized | New Principal | Capitalization Date | SAP Entry | Intimation Sent

---

## SCREEN T-5a: BANK RECONCILIATION

**Frame:** `T-5-BankReconciliation-Default`

**Purpose:** Match SFPCL's bank statement entries against SAP-posted entries.

**Header:** "Bank Reconciliation — RBL Bank Operating A/C" + Period: "Jun 1 – Jun 10, 2026"

**Layout:** Full-width, 3-section vertical stack

**Section 1 — Reconciliation Summary (3 KPI tiles, full-width, 80px each):**
- Tile 1: "Bank Statement Total Credits: ₹3,82,500" (green)
- Tile 2: "SAP-Posted Total Credits: ₹3,82,500" (green)
- Tile 3: "Unreconciled Items: 1 (₹10,000)" (red) → links to unmatched section

**Section 2 — Matched Transactions (scrollable table, bg: success-100 rows):**
| Statement Date | Description | Statement Amount | SAP Entry | SAP Amount | Match |
|---|---|---|---|---|---|
| 10 Jun | NEFT/Ramesh Patil/LO47 | ₹25,000 | 1400000235 | ₹25,000 | ✅ |
| 09 Jun | NEFT/SFPHC/LO28 | ₹37,500 | 1400000228 | ₹37,500 | ✅ |

**Section 3 — Unmatched Items (error-100 bg, error-500 top border):**
| Date | Description | Amount | Likely Match | Action |
|---|---|---|---|---|
| 10 Jun | NEFT/VilasJ | ₹10,000 | LO000022? | [Match Manually] [Escalate] |

---

## COMPONENT SPECIFICATIONS (TREASURY-SPECIFIC)

### Component: Payment Amount Display
Used across all treasury screens wherever disbursement/repayment amounts appear:
```
₹ 2,00,000.00
```
- Font: `Roboto Mono`, 20px, neutral-900
- ₹ symbol: same size, neutral-700 (slightly lighter than amount)
- Always right-aligned in tables
- Always include paise (.00) for precision
- Negative / reversal amounts: error-500 color with −prefix

---

### Component: Transaction Status Pill

| Status | bg | text | icon |
|---|---|---|---|
| Pending Initiation | warning-100 | warning-500 | ⏳ |
| Pending Authorization | info-100 | info-500 | 🔐 |
| Authorized | brand-light | brand-secondary | ✅ |
| Transfer Complete | success-100 | success-500 | ✅ |
| SAP Pending | neutral-200 | neutral-700 | 🖥️ |
| SAP Posted | success-100 | success-500 | 📒 |
| Failed / Error | error-100 | error-500 | ❌ |

All pills: radius-full, 11px font, 500 weight, 4px horizontal padding, 20px height

---

### Component: SAP Entry Card (dark terminal style)
Used in Step 5 and SAP entries log detail:
- bg: `#1A1A2E` (near-black)
- Text: white, `Roboto Mono` 13px
- Line separators: white/20%
- Dr amounts: `#67E8F9` (cyan-300)
- Cr amounts: `#86EFAC` (green-300)
- Labels: white/60%
- radius-xl, 24px padding, shadow-md

---

### Component: Finance Controller Auth Modal
Used in Step 4 authorization:
- Modal size: 480×520px
- Header: "Authorization Required" + lock icon (cyan, 32px)
- Body: transaction summary (compact) + OTP input
- OTP: 6 boxes, 56×56px each, 8px gap, border neutral-200, focus: cyan ring
- Footer: [Authorize] success-500 | [Cancel] ghost
- Countdown: `"OTP expires in 4:32"` — body-sm, error-500 (turns red <60s)

---

### Component: Repayment Allocation Banner
Used in T-4a top of screen:
- bg: info-100
- Left border: info-500, 4px
- Icon: ℹ️ info-500
- Text: `body-sm`, neutral-700
- Collapsible: chevron icon (down/up), saves state in session
- radius-md, 16px padding

---

## MAKER-CHECKER ROLE DIFFERENTIATION TABLE

| Action | Finance Manager (Maker) | Finance Controller (Checker) |
|---|---|---|
| View Disbursement Queue | ✅ Full access | ✅ Full access |
| Initiate Payment | ✅ Can initiate | ❌ Cannot initiate |
| Authorize Payment | ❌ Cannot authorize own | ✅ Authorizes with 2FA OTP |
| Create SAP Code | ✅ Can create | 👁️ Read-only |
| Post SAP Entries | ✅ Can post | 👁️ Read-only |
| Post Repayment to SAP | ✅ Can post | 👁️ Visible |
| Authorize Capitalization | ❌ | ✅ Required |
| View Reports | ✅ Full | ✅ Full |
| Export Data | ✅ | ✅ |

Annotation 🔴: "Maker-Checker is a hard constraint from SOP §5.3. Finance Manager and Finance Controller cannot be the same person. System should enforce this at login — same user cannot hold both roles."

---

## NOTIFICATION TRIGGERS (TREASURY-SPECIFIC)

| Trigger | Notified Role | Channel | Priority |
|---|---|---|---|
| Loan sanction received from CS → ready for disbursement | Finance Manager | In-app + Email | 🔴 High |
| Payment awaiting CFC authorization >2 hrs | Finance Controller | In-app + SMS | 🔴 High |
| SAP entry pending posting (end of day) | Finance Manager | In-app + Email | 🟡 Medium |
| Repayment received — pending SAP entry | Finance Manager | In-app | 🟡 Medium |
| Subsidiary deduction transfer received | Finance Manager | In-app + Email | 🟡 Medium |
| Unreconciled bank item >24 hrs | Finance Manager + CFO | In-app + Email | 🔴 High |
| Interest capitalization due (post 30 Apr) | Finance Manager + CS | In-app + Email | 🟡 Medium |
| Monthly accruals not posted by 5th | Finance Manager | In-app | 🟡 Medium |

---

## EMPTY STATES

| Screen | Empty State Message | CTA |
|---|---|---|
| T-2 Disbursement Queue | 🎉 "No pending disbursements. All clear!" | "Back to Dashboard" |
| T-3a SAP Code Setup | "No SAP code requests from Credit Manager." | — |
| T-4a Direct Payments | "No direct repayments received today." | "Check Subsidiary Deductions" |
| T-4b Subsidiary | "No subsidiary deductions this period." | — |
| T-5a Reconciliation | "All transactions matched. Fully reconciled ✓" | "Export Statement" |

Empty states: centered, 200px illustration (minimal line-art, brand-primary palette), heading-md message, body-md sub-text, optional CTA button.

---

## FIGMA FRAME NAMING — TREASURY COMPLETE LIST

```
T-1-Dashboard-Default
T-1-Dashboard-DisburseAlert (warning state — urgent items)

T-2-Disbursement-Step1-Preflight-AllClear
T-2-Disbursement-Step1-Preflight-GateFailed (error state)
T-2-Disbursement-Step2-BankVerify
T-2-Disbursement-Step2-BankVerify-SignatureMismatch
T-2-Disbursement-Step3-Initiate
T-2-Disbursement-Step3-Initiate-Filled
T-2-Disbursement-Step4-AuthPending (Finance Manager view)
T-2-Disbursement-Step4-AuthorizeView-CFCQueue (CFC view)
T-2-Disbursement-Step4-AuthorizeView-OTPModal
T-2-Disbursement-Step5-SAPEntry
T-2-Disbursement-Step5-SAPEntry-Confirmed
T-2-Disbursement-Step6-Complete

T-3-SAPCustomerCodeSetup-Default
T-3-SAPCustomerCodeSetup-DuplicateDetected
T-3-SAPEntriesLog-Default
T-3-SAPEntriesLog-Filtered

T-4-Repayment-DirectPayments-Default
T-4-Repayment-DirectPayments-PostToSAP-Modal
T-4-Repayment-DirectPayments-UTRMissing
T-4-Repayment-SubsidiaryDeductions-Default
T-4-Repayment-SubsidiaryDeductions-ReconcileDrawer
T-4-InterestAccruals-Monthly
T-4-InterestAccruals-YearEnd
T-4-InterestAccruals-Capitalization-Modal

T-5-BankReconciliation-Default
T-5-BankReconciliation-Unmatched
T-5-LedgerSummary-Default
T-5-ExportCentre-Default
```

---

## ANNOTATION SUMMARY (TREASURY PAGE)

| Code | Type | Message |
|---|---|---|
| 🔴 T-ANO-01 | Critical | Maker-Checker: Finance Manager cannot authorize own payments. Hard system constraint. |
| 🔴 T-ANO-02 | Critical | All 5 preflight gates must be ✅ before Proceed button enables. |
| 🔴 T-ANO-03 | Critical | 2FA OTP mandatory for CFC authorization. No OTP = no transfer. |
| 🟡 T-ANO-04 | Business Rule | Amount auto-selects NEFT (<₹2L) or RTGS (>₹2L). User can override with reason. |
| 🟡 T-ANO-05 | Business Rule | Repayment allocation: Principal first, then interest. System enforces, not user. |
| 🟡 T-ANO-06 | Business Rule | Interest capitalization only valid post 30 April AND post intimation letter to borrower. |
| 🟡 T-ANO-07 | Business Rule | SAP accrual entries: monthly by Treasury. Interest invoices: yearly by Credit/Sales team. |
| 🔵 T-ANO-08 | API Note | SAP Customer Code format: SFCUST-XXXX. Sequential. Fetch next code from SAP API. |
| 🔵 T-ANO-09 | API Note | Penny drop verification: optional 3rd-party bank account validation API. |
| 🟠 T-ANO-10 | Edge Case | If borrower = Director or relative, gold-500 banner appears in Step 1 preflight. |
| 🟠 T-ANO-11 | Edge Case | Subsidiary deduction reconciliation: allow ₹1 tolerance. >₹1 mismatch → escalate to CFO. |
| 🟣 T-ANO-12 | Accessibility | OTP boxes: auto-advance focus on digit entry. ARIA role="textbox" with label per digit. |
| 🟣 T-ANO-13 | Accessibility | All currency amounts: aria-label must spell out number (e.g., "Two lakh rupees"). |

---

*End of SFPCL Finance/Treasury Role — Figma Deep-Dive Prompt*
*Document Reference: SOP_SFPCL_LOANDISBURSEMENT × WhatsLoan Platform v1.0*
*Screens Covered: 18 unique frames + state variants | Role: Treasury Team (Finance Manager + Finance Controller)*
