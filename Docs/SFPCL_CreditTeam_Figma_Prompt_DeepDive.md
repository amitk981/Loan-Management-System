# SFPCL WhatsLoan — Credit Team Role: Figma UI Deep-Dive Prompt

**Document:** Niche UI Specification for Figma Design  
**Role:** Credit Assessment Team (Credit Manager + Deputy Manager – Finance)  
**Platform:** Web Dashboard (Desktop Primary, Tablet Secondary)  
**SOP Reference:** SOP_SFPCL_LOANDISBURSEMENT v1.0 — Stages 1, 2, 3 (primary), 5 (partial), 6 (monitoring)  
**Design Partner Context:** This is a working internal tool, not a marketing surface. The Credit Team user is a semi-technical finance professional processing 20–80 loan applications per month. Speed, auditability, and zero-error workflows are the non-negotiables.

---

## 1. VISUAL IDENTITY & DESIGN SYSTEM

### Brand DNA
- **Primary brand:** Sahyadri Farms / WhatsLoan co-branding
- **Sahyadri palette:** Deep forest green `#1A3C2B`, warm leaf green `#3D7A4F`, cream `#F7F4EE`
- **WhatsLoan accent:** Ocean blue `#0C5FA5`, sky `#3A8FD8`
- **Semantic colors:**
  - Approved/Active: `#2E7D32` (deep green)
  - Pending/In-Progress: `#F59E0B` (amber)
  - Rejected/Defaulted: `#C62828` (deep red)
  - Info/Neutral: `#1565C0` (indigo)
  - Warning/Exception: `#E65100` (burnt orange)
- **Surface:** Off-white `#FAFAF8`, card white `#FFFFFF`, sidebar `#1A3C2B`
- **Typography:**
  - Display / Headings: `DM Sans` Bold — clean, professional, legible at small sizes
  - Body / Labels: `Inter` Regular/Medium — standard for data-dense dashboards
  - Monospace (IDs, amounts, reference numbers): `JetBrains Mono` — for loan IDs like `LO00000047`, amounts like `₹2,40,000`
- **Border radius:** 8px cards, 6px inputs, 4px badges
- **Shadow:** `0 1px 3px rgba(0,0,0,0.08)` for cards; `0 4px 12px rgba(0,0,0,0.12)` for modals
- **Icon set:** Phosphor Icons or Lucide — consistent stroke weight `1.5px`

---

## 2. GLOBAL LAYOUT — DESKTOP SHELL

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SIDEBAR (240px, dark green #1A3C2B)    │  TOPBAR (56px, white, shadow)    │
│  ─────────────────────────────────────  │  ─────────────────────────────── │
│  [Sahyadri Farms logo + WhatsLoan]       │  [Page Title]  [Search] [Bell]  │
│                                          │  [Credit Manager: Amit Kulkarni] │
│  NAVIGATION GROUPS:                      │                                  │
│  ○ Dashboard (Home)                      │                                  │
│  ─── APPLICATIONS ───                    │  MAIN CONTENT AREA               │
│  ○ New Applications        [badge: 12]   │  (fills remaining width)         │
│  ○ Under Review            [badge: 5]    │                                  │
│  ○ Pending Documents       [badge: 3]    │                                  │
│  ─── PROCESSING ───                      │                                  │
│  ○ Appraisal Queue                       │                                  │
│  ○ Sanction Committee      [badge: 2]    │                                  │
│  ─── ACTIVE LOANS ───                    │                                  │
│  ○ Live Loans                            │                                  │
│  ○ Repayments                            │                                  │
│  ○ DPD / Monitoring                      │                                  │
│  ─── RECORDS ───                         │                                  │
│  ○ Loan Register                         │                                  │
│  ○ Rejected Applications                 │                                  │
│  ○ Exception Register                    │                                  │
│  ─── REPORTS ───                         │                                  │
│  ○ Portfolio MIS                         │                                  │
│  ○ Interest Invoices                     │                                  │
│                                          │                                  │
│  ─ bottom ─                              │                                  │
│  ○ Settings                              │                                  │
│  ○ Help / SOP Reference                  │                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Sidebar detail:**
- Active nav item: left border accent `#3D7A4F` (4px), bg `rgba(255,255,255,0.08)`
- Badge pills: amber `#F59E0B` text on `rgba(245,158,11,0.15)` bg
- Section labels (APPLICATIONS, PROCESSING, etc.): uppercase, `10px`, `#8FAF96`, letter-spacing `0.08em`
- User avatar at bottom with role label: `Credit Manager`

---

## 3. SCREEN 1 — CREDIT MANAGER DASHBOARD (Home)

### Purpose
Landing view after login. Gives the Credit Manager an instant read on pipeline health, pending actions, and portfolio risk — without any navigation.

### Layout: 4-zone composition

```
┌────────────────────────────────────────────────────────────────────────────┐
│  ZONE A — KPI STRIP (full width, 4 metric cards)                           │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│  │ New Apps     │ │ In Appraisal │ │ Awaiting SC  │ │ Active Loans │     │
│  │ Today        │ │              │ │ Approval     │ │              │     │
│  │    12        │ │     8        │ │     3        │ │     147      │     │
│  │ ↑4 vs yest.  │ │ TAT: 1.2d   │ │ Overdue: 1  │ │ ₹1.84 Cr     │     │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘     │
├────────────────────────────────────────────────────────────────────────────┤
│  ZONE B — MY ACTION QUEUE (left 55%) │ ZONE C — ALERTS (right 45%)        │
│                                       │                                    │
│  Priority Task List:                  │  ⚠ TAT Breach Alert               │
│  [ ! ] LO00000089 — Rajesh Patil     │  LO00000076 — Appraisal Note due   │
│        Appraisal Note overdue 1d     │  2 days ago. Escalate to CFO?      │
│  [ → ] LO00000091 — Priya Shinde     │                                    │
│        Docs incomplete — PAN missing  │  🔴 Default Flag                   │
│  [ → ] LO00000086 — Narayan FPC      │  LO00000051 — Ganesh Thorat        │
│        Sent to SC — awaiting decision │  Principal overdue 94 days         │
│  [ ✓ ] LO00000082 — Disbursed        │                                    │
│        Update loan register           │  📋 Re-KYC Due                     │
│                                       │  14 members — KYC expiring in 30d  │
├────────────────────────────────────────────────────────────────────────────┤
│  ZONE D — PORTFOLIO HEALTH BAR (full width, compact)                       │
│  DPD Buckets:  Current ████████████████████ 127  │ 1-2yr ████ 12          │
│                2-3yr ██ 5  │  3yr+ █ 3                                     │
│  Total Outstanding: ₹1,84,20,000  │  Avg Loan: ₹1,25,306  │ NPA: 1.4%   │
└────────────────────────────────────────────────────────────────────────────┘
```

**KPI Card anatomy:**
- Large number: 32px `DM Sans Bold`, color-coded (green if on track, amber if flagged)
- Subtitle label: 11px `Inter Medium`, `#6B7280`
- Delta indicator: tiny arrow + number, green/red
- Bottom tag: most critical sub-metric in a colored pill

**Action Queue row anatomy:**
- Priority icon (left): `!` red for overdue, `→` blue for in-progress, `✓` green for complete
- Loan ID: monospace `JetBrains Mono`, `#0C5FA5`, clickable
- Farmer/FPC name: `Inter Medium`, black
- Status chip: colored badge (Overdue/Pending Docs/Awaiting SC/Disbursed)
- Right: `Open →` ghost button, appears on hover

---

## 4. SCREEN 2 — APPLICATION INTAKE & REVIEW

### Purpose
The Credit Manager receives a new loan application (submitted via farmer portal or offline). This screen is where they verify completeness, assign a reference number, and trigger appraisal.

### Layout: Master-Detail (split view)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  PAGE HEADER: "New Applications"  [Search by name/ID/village]  [+ Add Manual]│
├─────────────────────────────┬────────────────────────────────────────────────┤
│  APPLICATION LIST (left 35%)│  APPLICATION DETAIL PANEL (right 65%)          │
│                             │                                                  │
│  Filter bar:                │  ┌─────────────────────────────────────────┐    │
│  [All] [Today] [Incomplete] │  │ APPLICATION: LO00000091                  │    │
│  [Assigned to me]           │  │ Status: ● Incomplete — PAN missing       │    │
│                             │  └─────────────────────────────────────────┘    │
│  ─────────────────────────  │                                                  │
│  ● LO00000091               │  SECTION A — APPLICANT DETAILS                  │
│  Priya Shinde               │  ┌────────────────┬──────────────────────────┐  │
│  Nashik · ₹60,000 req.      │  │ Name           │ Priya Ramesh Shinde      │  │
│  ● Incomplete  2h ago       │  │ Folio No.      │ SH-2847                  │  │
│  ─────────────────────────  │  │ Shares Held    │ 250 shares               │  │
│  ● LO00000090               │  │ Member Since   │ Apr 2021                 │  │
│  Ganesh Thorat FPC          │  │ Village        │ Dindori, Nashik          │  │
│  Nashik · ₹4,80,000 req.    │  │ Crop           │ Grapes                   │  │
│  ● Complete  4h ago         │  │ Mobile         │ +91 94230 XXXXX          │  │
│  ─────────────────────────  │  └────────────────┴──────────────────────────┘  │
│  ● LO00000089               │                                                  │
│  Rajesh Patil               │  SECTION B — LOAN REQUEST                        │
│  Igatpuri · ₹1,80,000 req.  │  ┌──────────────────────────────────────────┐  │
│  ● Overdue  2d ago          │  │ Amount Requested    ₹60,000               │  │
│                             │  │ Purpose             Drip irrigation setup │  │
│                             │  │ Tenure Requested    12 months (Short-Term)│  │
│                             │  │ Nominee             Suresh Shinde (Father)│  │
│                             │  └──────────────────────────────────────────┘  │
│                             │                                                  │
│                             │  SECTION C — KYC DOCUMENT CHECKLIST             │
│                             │  ┌──────────────────────────────────────┐       │
│                             │  │ ✅ Aadhaar Card         Uploaded      │       │
│                             │  │ ❌ PAN Card              Missing       │ ←red │
│                             │  │ ✅ Share Certificate     Uploaded      │       │
│                             │  │ ✅ 7/12 Extract          Uploaded      │       │
│                             │  │ ✅ Bank Statement (6mo)  Uploaded      │       │
│                             │  │ ⏳ Crop Plan              Pending review│       │
│                             │  └──────────────────────────────────────┘       │
│                             │                                                  │
│                             │  ─────────────────────────────────────────      │
│                             │  [Send Deficiency Notice]  [Mark Complete]       │
│                             │  [Assign to Appraisal →]                         │
└─────────────────────────────┴────────────────────────────────────────────────┘
```

**Document Checklist Item states:**
- ✅ Complete: green icon, filename link (clickable preview), timestamp
- ❌ Missing: red icon, "Missing" badge, `[Request from Farmer]` inline action button
- ⏳ Pending Review: amber icon, Deputy Manager can open & verify inline

**"Send Deficiency Notice" flow:**
- Opens a modal pre-populated with missing items (auto-detected)
- Channel selector: Email / SMS / WhatsApp
- Editable message body in Marathi + English tabs
- Preview → Send → Status logged as "Notified — awaiting resubmission"

**"Assign to Appraisal" button:**
- Only active when all mandatory docs are ✅
- Triggers status change to `Appraisal Queue`
- Creates audit log entry with timestamp + Credit Manager name

---

## 5. SCREEN 3 — LOAN APPRAISAL NOTE (Core Credit Workflow)

### Purpose
The Deputy Manager – Finance prepares the Loan Appraisal Note. This is the most critical data-entry screen in the Credit Team workflow. Every field here feeds the Sanction Committee's decision.

### Layout: Wizard with 4 steps + Live Eligibility Calculator sidebar

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  "Prepare Appraisal Note — LO00000090 — Ganesh Thorat FPC"                  │
│  TAT Warning: Due by [Date + Time] — 1d 14h remaining [amber progress bar]  │
├──────────────────────────┬───────────────────────────────────────────────────┤
│  STEP NAVIGATOR (left)   │  FORM CONTENT AREA (right 68%)                   │
│                          │                                                    │
│  Step 1                  │  ══ STEP 1: BORROWER ELIGIBILITY CHECK ══         │
│  ● Eligibility Check ←   │                                                    │
│  Step 2                  │  1.1 Member Status Verification                    │
│  ○ Loan Limit Calc       │  ┌───────────────────────────────────────────┐    │
│  Step 3                  │  │ Active Member?          ● Yes  ○ No        │    │
│  ○ Risk Assessment       │  │ Years supplying produce  [____] yrs        │    │
│  Step 4                  │  │ Supplying to            [SFPCL ▼]          │    │
│  ○ Recommendation        │  │ Source verified from    [Share Register ▼] │    │
│                          │  └───────────────────────────────────────────┘    │
│  ─────────────────────   │                                                    │
│  LIVE ELIGIBILITY CALC   │  1.2 Existing Loan Default Check                   │
│  ┌───────────────────┐   │  ┌───────────────────────────────────────────┐    │
│  │ Shares Held       │   │  │ Any existing default in SFPCL?  ● No ○ Yes│    │
│  │ [____] shares     │   │  │ Any default in subsidiary co.?  ● No ○ Yes│    │
│  │                   │   │  │ Outstanding loans (current)?    ₹[______] │    │
│  │ Valuation/share   │   │  └───────────────────────────────────────────┘    │
│  │ ₹2,000 (auto)     │   │                                                    │
│  │                   │   │  1.3 Loan Purpose Compliance                        │
│  │ Limit (shares)    │   │  ┌───────────────────────────────────────────┐    │
│  │ ₹[auto-calc]      │   │  │ Stated purpose   [Drip irrigation setup  ]│    │
│  │                   │   │  │ Category         ● Crop Production         │    │
│  │ Land (acres)      │   │  │                  ○ Allied Activity         │    │
│  │ [____] acres      │   │  │                  ○ Non-agricultural ✗      │    │
│  │                   │   │  └───────────────────────────────────────────┘    │
│  │ Scale of Finance  │   │                                                    │
│  │ ₹20,000/acre      │   │  1.4 Nominee Eligibility                           │
│  │                   │   │  ┌───────────────────────────────────────────┐    │
│  │ Limit (land)      │   │  │ Nominee Name      Suresh Shinde            │    │
│  │ ₹[auto-calc]      │   │  │ Is nominee minor? ● No (DOB: 12/03/1965)  │    │
│  │ ─────────────     │   │  │ Aadhaar verified? ✅                       │    │
│  │ ELIGIBLE LIMIT    │   │  └───────────────────────────────────────────┘    │
│  │ ₹ [LOWER OF 2]    │   │                                                    │
│  │ (highlighted)     │   │  ─────────────────────────────────────────         │
│  └───────────────────┘   │  [Save Draft]               [Next: Loan Limit →]  │
└──────────────────────────┴───────────────────────────────────────────────────┘
```

**Step 2 — Loan Limit Calculation:**
- All inputs auto-populated from application; Deputy Manager can override with reason
- Shares held × ₹200 = Limit A (auto-computed, shown in blue)
- Land area × ₹20,000 = Limit B (auto-computed, shown in blue)
- Final eligible: `min(A, B)` — shown in a callout box with green border
- Requested amount vs eligible amount: shown as a comparison bar
- If requested > eligible: red warning + "Amount will be revised to ₹X" tooltip

**Step 3 — Risk Assessment:**
- Repayment source: `[Tri-party subsidiary deduction ▼]` or `[Direct RTGS]`
- Bank statement summary: 6-month average balance, irregularity flag
- Crop risk toggle: High/Medium/Low (pre-filled from crop type + season)
- Field: "Risk Mitigation Notes" (free text, required)
- Overall risk rating: `Low / Medium / High` radio — auto-suggested based on inputs

**Step 4 — Recommendation:**
- Recommended amount: auto-filled (editable)
- Tenure: `Short-term (≤1 year)` / `Long-term (>1 year)` — select
- Interest rate field: floating, pre-filled from current rate config
- Remarks for SC: free text
- Submit action: `[Submit to Sanction Committee]`
  - Confirmation dialog: "This will notify the Sanction Committee. The Credit Sanction Register will be updated. Confirm?"
  - On confirm: status → `Awaiting SC Approval`, email trigger to SC members

---

## 6. SCREEN 4 — SANCTION COMMITTEE TRACKER

### Purpose
Credit Manager tracks what's pending SC decision, can view the sanction register, and follows up. Does NOT approve — only the SC does — but this screen is the Credit Manager's window into that process.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  "Sanction Committee Queue"                              [Export CSV]         │
│  Filter: [Pending ▼] [All Amounts ▼] [This Month ▼]                          │
├──────────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ LOAN ID     NAME              AMOUNT      SUBMITTED   SC LEVEL  STATUS │  │
│  ├────────────────────────────────────────────────────────────────────────┤  │
│  │ LO00000090  Ganesh Thorat FPC ₹4,80,000  2h ago      CFO+2Dir   ⏳ Pending│
│  │ LO00000088  Ashok Wagh        ₹1,20,000  1d ago      CFO+1Dir   ⏳ Pending│
│  │ LO00000085  Kamla Jagtap      ₹80,000    3d ago      CFO+1Dir   ✅ Approved│
│  │ LO00000083  Vinayak FPC       ₹7,50,000  4d ago      CFO+2Dir   ✅ Approved│
│  │ LO00000079  Suresh Bhagat     ₹40,000    6d ago      CFO+1Dir   ❌ Rejected│
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  [Row click → Expand SC decision detail panel below]                          │
├──────────────────────────────────────────────────────────────────────────────┤
│  EXPANDED ROW: LO00000085 — Kamla Jagtap                                      │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │ SC Decision: APPROVED  │ Approved by: CFO + Dir. Sharma  │ 3d ago        ││
│  │ Approved Amount: ₹80,000  │ Tenure: Short-term (12 months)               ││
│  │ Conditions: None  │ Rate: 12% p.a. floating                              ││
│  │ Credit Sanction Register Entry: CSR-2025-0085 [View entry ↗]             ││
│  │                                                                            ││
│  │ [Proceed to Documentation Stage →]                                        ││
│  └──────────────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────────┘
```

**SC Level indicator design:**
- `CFO+1Dir`: blue pill (≤₹5 lakh)
- `CFO+2Dir`: purple pill (>₹5 lakh or limit exception)
- `General Meeting Required`: orange pill (Director/relative borrower — special case per s.378ZK)

**Rejected application expand:**
- Shows rejection reason from SC
- `[Prepare Rejection Note →]` button — opens pre-filled rejection note template
- Channel to send: Email / Courier toggle
- Log rejection in Loan Request Register

---

## 7. SCREEN 5 — LOAN REGISTER (Audit & Record View)

### Purpose
The master register of all loans — Credit Manager's single source of truth. Corresponds to the physical Loan Request Register maintained in Excel per the SOP. This is the digital version.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  "Loan Register"  │ Total: 147 loans │ Last updated: Today 11:42 AM          │
│  [Search by LO# / Name / Village]  [Filter: Status ▼] [Year ▼]  [Export ↓]  │
├───┬──────────────┬────────────────┬──────────┬────────────┬──────┬──────────┤
│ # │ Loan ID      │ Borrower       │ Amount   │ Disbursed  │Stage │ DPD      │
├───┼──────────────┼────────────────┼──────────┼────────────┼──────┼──────────┤
│ 1 │ LO00000001   │ Ramesh Jadhav  │ ₹60,000  │ 04-Apr-24  │Active│ 0        │
│ 2 │ LO00000002   │ Sunita FPC     │ ₹4,00,000│ 06-Apr-24  │Active│ 0        │
│ 3 │ LO00000018   │ Narayan Patil  │ ₹1,20,000│ 12-May-24  │Active│ 94 days  │
│   │              │                │          │            │      │ [🔴 HIGH] │
│ 4 │ LO00000051   │ Ganesh Thorat  │ ₹80,000  │ 03-Jul-24  │Active│ 31 days  │
│   │              │                │          │            │      │ [🟡 MED]  │
│ 5 │ LO00000076   │ Priya Shinde   │ ₹60,000  │ 14-Oct-24  │Active│ 0        │
├───┴──────────────┴────────────────┴──────────┴────────────┴──────┴──────────┤
│  Pagination: [← Prev] 1 2 3 … 15 [Next →]   Showing 1–10 of 147            │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Row click → Loan Detail Drawer (slides in from right, 480px wide):**
- Full loan timeline (vertical stepper): Application → Appraisal → SC Approval → Documentation → Disbursed → Repayments
- Each step: timestamp, who actioned it, any notes
- Repayment history table: Date / Amount / Principal / Interest / Balance
- Security documents: SH-4 status, CDSL pledge status, blank cheque (held/returned)
- "DPD Classification" section with bucket badge
- Action buttons: `[Generate Interest Invoice]`, `[Send Reminder SMS]`, `[Issue NOC]` (only if fully repaid), `[Flag for Default Review]`

---

## 8. SCREEN 6 — DPD MONITORING & PORTFOLIO HEALTH

### Purpose
Credit Manager classifies loans into DPD buckets quarterly, generates the MIS for CFO, and triggers the default handling workflow per SOP Stage 6.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  "DPD Monitoring — Q1 FY 2025-26"        [Generate CFO MIS Report]           │
├──────────────────────────────────────────────────────────────────────────────┤
│  PORTFOLIO SUMMARY STRIP                                                       │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│  │ Current    │ │ 1-2 Years  │ │ 2-3 Years  │ │ 3+ Years   │ │ NPA Rate   │ │
│  │ 127 loans  │ │ 12 loans   │ │ 5 loans    │ │ 3 loans    │ │   2.7%     │ │
│  │ ₹1.52 Cr   │ │ ₹18.4L     │ │ ₹7.2L      │ │ ₹4.8L      │ │            │ │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘ └────────────┘ │
├──────────────────────────────────────────────────────────────────────────────┤
│  DPD TABLE: [Filter: 3+ Years ▼]                                              │
│  ┌───────────────┬────────────┬─────────┬──────────┬──────────────────────┐  │
│  │ Borrower      │ Loan ID    │ Amount  │ DPD Days │ Action Required      │  │
│  ├───────────────┼────────────┼─────────┼──────────┼──────────────────────┤  │
│  │ Narayan Patil │ LO00000018 │₹1,20,000│ 1247 d   │ [Non-Recoverable]    │  │
│  │               │            │         │          │ → Prepare Note for SC│  │
│  ├───────────────┼────────────┼─────────┼──────────┼──────────────────────┤  │
│  │ Sambhaji Kale │ LO00000033 │ ₹80,000 │ 1142 d   │ [Extension Granted]  │  │
│  │               │            │         │          │ Extended: 12 months  │  │
│  ├───────────────┼────────────┼─────────┼──────────┼──────────────────────┤  │
│  │ Meena FPC     │ LO00000041 │₹3,60,000│ 1098 d   │ [Under SC Review]    │  │
│  └───────────────┴────────────┴─────────┴──────────┴──────────────────────┘  │
├──────────────────────────────────────────────────────────────────────────────┤
│  DEFAULT WORKFLOW PANEL (appears when a row is selected)                       │
│                                                                                │
│  LO00000018 — Narayan Patil — ₹1,20,000 — DPD: 1247 days                    │
│                                                                                │
│  [Default Handling Timeline — per SOP]                                        │
│  ✅ Missed payment detected         12-Jan-2024                                │
│  ✅ 3-month grace period given      15-Jan-2024 → 15-Apr-2024                 │
│  ✅ Non-payment assessed: Non-intentional (crop failure noted)                 │
│  ✅ 1-year extension granted        20-Apr-2024 → 20-Apr-2025                 │
│  ❌ Extension period expired        20-Apr-2025 — still not repaid            │
│  → [Prepare Note for Non-Payment → Submit to SC]                              │
│                                                                                │
│  "Note for Non-Payment" — auto-draft:                                         │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ [Editable memo body — pre-populated with dates, amounts, borrower      │  │
│  │  details, and assessment of intentional vs non-intentional default.    │  │
│  │  Includes recommendation: Invoke SH-4 / Invoke undated cheque]        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│  [Submit to Sanction Committee for action approval]                            │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. SCREEN 7 — INTEREST INVOICE GENERATION

### Purpose
Credit Manager generates yearly interest invoices per SOP Stage 6.2. Also handles the interest capitalization workflow (if farmer doesn't pay by 30 April, interest is added to principal).

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  "Interest Invoices — FY 2024-25"   [Generate All Invoices]  [Export Batch] │
├──────────────────────────────────────────────────────────────────────────────┤
│  STATUS STRIP: Generated: 89 │ Sent: 76 │ Paid: 61 │ Unpaid (post-30 Apr): 15│
├──────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┬────────────┬──────────┬──────────────┬────────┬───────────┐ │
│  │ Borrower    │ Loan ID    │Principal │ Interest (yr)│ Status │ Action    │ │
│  ├─────────────┼────────────┼──────────┼──────────────┼────────┼───────────┤ │
│  │ Priya Shinde│ LO00000076 │ ₹60,000  │ ₹7,200       │ Unpaid │[Capitalise]│
│  │             │            │ (revised)│ (12% p.a.)   │        │→ Principal│ │
│  │             │            │          │              │        │  ₹67,200  │ │
│  ├─────────────┼────────────┼──────────┼──────────────┼────────┼───────────┤ │
│  │ Ashok Wagh  │ LO00000088 │₹1,20,000 │ ₹14,400      │ Paid ✅│[View]     │ │
│  └─────────────┴────────────┴──────────┴──────────────┴────────┴───────────┘ │
├──────────────────────────────────────────────────────────────────────────────┤
│  CAPITALIZATION WORKFLOW                                                       │
│  Loans with unpaid interest past 30 April — 15 cases                         │
│  [Bulk Capitalise All]  — will:                                               │
│  1. Add outstanding interest to principal for each loan                       │
│  2. Recalculate new FY interest on revised principal                         │
│  3. Generate intimation letters (Email/SMS) to all affected borrowers         │
│  4. Post SAP accrual entries via notification to Sr. Manager–Finance         │
│  [Preview changes before confirming]                                           │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. SCREEN 8 — SAP CUSTOMER CODE REQUEST FORM

### Purpose
Once SC approval is received, Credit Manager prepares and sends the formal email to Senior Manager – Finance requesting SAP Customer Code creation (per SOP 5.1). This screen automates that email.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  "Create SAP Customer Code — LO00000090 — Ganesh Thorat FPC"                │
│  Status: SC Approved ✅  →  SAP Code: Not yet created ⏳                    │
├──────────────────────────────────────────────────────────────────────────────┤
│  [Auto-populated from application — verify before sending]                    │
│                                                                                │
│  Farmer's Full Name      Ganesh Thorat Farmers Producer Company               │
│  Aadhaar Number          XXXX XXXX 4821 [masked]                             │
│  PAN Number              AABCG1234D                                           │
│  Address                 Village Ojhar, Tal. Niphad, Nashik – 422 209         │
│  Email ID                ganesh.thorat.fpc@gmail.com                          │
│  Loan Application No.    LO00000090                                           │
│                                                                                │
│  ─────────────────────────────────────────────────────────────────────────   │
│  Send to: Sr. Manager – Finance (Rohan Mehta) <rmehta@sahyadrifarms.com>      │
│  Cc: Credit Manager (auto)                                                    │
│  Format: Excel attachment (Annexure I template) + email body                  │
│                                                                                │
│  [Preview Email]   [Send Request →]                                           │
│                                                                                │
│  After sending:                                                                │
│  ⏳ Awaiting SAP confirmation from Sr. Manager–Finance                        │
│  [Mark as: SAP Code Received — enter Customer ID: ___________]                │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 11. MICRO-INTERACTIONS & COMPONENT DETAILS

### Loan ID Badge
```
[ LO00000090 ]
```
- Font: `JetBrains Mono 12px`
- Color: `#0C5FA5` on `#E8F1FA` background
- Clickable: navigates to full loan detail
- Copy icon appears on hover

### Status Pipeline (horizontal stepper, used across screens)
```
[●] Application  →  [●] Appraisal  →  [●] SC Review  →  [○] Documentation  →  [○] Disbursed  →  [○] Repaying
```
- Completed: filled green circle, green connector line
- Current: filled amber circle, pulsing ring
- Upcoming: empty grey circle, grey connector

### Eligibility Result Callout (in appraisal form)
```
┌─────────────────────────────────────────────────────┐
│  ✅ ELIGIBLE LOAN AMOUNT                             │
│                                                       │
│  Shareholding limit:     ₹50,000  (250 × ₹200)      │
│  Land-based limit:       ₹60,000  (3 acres × ₹20k)  │
│                                                       │
│  Final Eligible Amount:  ₹50,000  ← lower of two    │
│  Requested:              ₹60,000  ← exceeds by ₹10k │
│                                                       │
│  ⚠ Amount will be revised to ₹50,000 at sanction    │
└─────────────────────────────────────────────────────┘
```
Border: 2px solid `#3D7A4F`. Background: `#F0F7F2`.

### Rejection Note Composer
- Pre-filled template referencing SOP Annexure L
- Mandatory: reason code dropdown (15 standard reasons + "Other")
- Mandatory: suggested resubmission criteria
- Channel: Email / Courier radio
- Saved to: Rejection Register + Loan file

### Re-KYC Reminder Widget (on dashboard)
- Shows members whose KYC expires within 60 days
- Color: amber warning at 60 days, red at 14 days
- One-click: `[Send Re-KYC Request]` per member

### Exception Register Entry
- Triggered automatically when Credit Manager overrides a calculation or bypasses a check
- Required fields: Exception type, justification (free text, min 50 chars), approver reference
- Every entry immutable — cannot be deleted, only annotated

---

## 12. FARMER PROFILE SIDEBAR (Contextual Panel)

Appears anywhere a borrower name is clicked. Slides in from right, 420px.

```
┌────────────────────────────────────────────────┐
│  PRIYA RAMESH SHINDE                            │
│  Member since: April 2021 · Active ✅           │
│                                                  │
│  📍 Dindori, Nashik  ·  🌿 Grapes (3 acres)     │
│  📱 +91 94230 XXXXX  ·  ✉ priya.s@gmail.com    │
│                                                  │
│  SHAREHOLDING                                    │
│  Folio: SH-2847  ·  250 shares                  │
│  Valuation: ₹2,000/share  ·  Total: ₹5,00,000  │
│  Max loan (share-based): ₹50,000                 │
│                                                  │
│  LOAN HISTORY                                    │
│  ┌──────────┬──────────┬────────┬─────────┐     │
│  │ LO#      │ Amount   │ Status │ DPD     │     │
│  │ LO000047 │ ₹40,000  │ Closed │ 0       │     │
│  │ LO000091 │ ₹60,000  │ Active │ 0       │     │
│  └──────────┴──────────┴────────┴─────────┘     │
│                                                  │
│  REPAYMENT TRACK RECORD                          │
│  ███████████████████░ 95% on-time                │
│                                                  │
│  KYC STATUS                                      │
│  PAN: ✅  Aadhaar: ✅  Re-KYC: Due Aug 2026      │
│                                                  │
│  [View Full Profile]  [New Loan →]               │
└────────────────────────────────────────────────┘
```

---

## 13. NOTIFICATION & AUDIT TRAIL SYSTEM

### Notification Bell (top bar):
Types of notifications the Credit Manager receives:
- `[SC Decision]` LO00000085 Approved — proceed to documentation
- `[Doc Received]` Priya Shinde uploaded PAN card — application now complete
- `[SAP Confirmed]` Customer Code created for Ganesh Thorat — CID: 0000892
- `[Default Alert]` LO00000018 DPD crossed 1,000 days — review required
- `[Rate Change]` Interest rate updated to 12.5% — 23 active loans affected

### Audit Log (accessible from any loan's detail view):
```
[Timestamp]           [Actor]              [Action]
25-May-25 11:42       Amit Kulkarni        Submitted Appraisal Note to SC
25-May-25 14:30       SC (CFO + Dir.)      Approved — Amount: ₹80,000
25-May-25 15:00       Compliance Team      Documents preparation started
26-May-25 10:15       CS                   PoA executed and notarised
26-May-25 11:00       Amit Kulkarni        SAP code request sent
26-May-25 13:30       Rohan Mehta          SAP Customer ID confirmed: 0000851
26-May-25 14:00       Sr. Mgr Finance      Disbursement initiated — ₹80,000
26-May-25 14:45       Sr. Mgr Finance      Payment confirmed via RBL Bank
```
Immutable. Export as PDF for audit.

---

## 14. RESPONSIVE NOTES (TABLET)

- Sidebar collapses to icon-only (48px) with tooltip labels
- Master-detail splits become full-screen modals on tablet
- Loan Register table: columns pin Loan ID + Status; others scroll horizontally
- KPI strip: 2×2 grid instead of 4-column strip
- Appraisal Note wizard: steps become a top stepper bar, form fills full width

---

## 15. EDGE CASE SCREENS TO DESIGN

1. **Special Case — Director as Borrower:** Form shows prominent banner: "⚠ This borrower is a Director / relative. General Meeting approval required per s.378ZK. SC approval will be marked pending until GM resolution is uploaded."

2. **Section 186 Limit Breach Warning:** When total outstanding loans near 60% of paid-up capital + free reserves, dashboard shows a system-wide warning banner with remaining headroom.

3. **NBFC Threshold Monitor** (Reports section): Quarterly asset/income ratio tracker with a gauge showing distance from 50% threshold. Alerts CFO at 40%.

4. **Empty State — No Applications Today:** Clean illustration (farmer with fields), CTA: `[Check Farmer Portal ↗]` or `[Add Manual Application]`.

5. **Signature Mismatch Workflow:** In Document Review, if signature flag is raised, shows a side-by-side comparison panel (PAN signature / cheque signature) with options: Bank Verification Letter request OR Declaration on stamp paper — both as guided flows.

---

## 16. FIGMA FILE STRUCTURE RECOMMENDATION

```
SFPCL — WhatsLoan — Credit Team Role/
├── 🎨 Design System/
│   ├── Color Tokens
│   ├── Typography Scale
│   ├── Component Library (Buttons, Inputs, Badges, Cards, Tables)
│   └── Icons (Phosphor set)
├── 📐 Wireframes (Lo-fi)/
│   └── All 8 screens + edge cases
├── 🖥 Desktop Designs (Hi-fi)/
│   ├── 01 — Dashboard (Home)
│   ├── 02 — Application Intake & Review
│   ├── 03 — Appraisal Note Wizard (4 steps)
│   ├── 04 — Sanction Committee Tracker
│   ├── 05 — Loan Register
│   ├── 06 — DPD Monitoring & Portfolio Health
│   ├── 07 — Interest Invoice Generation
│   ├── 08 — SAP Customer Code Request
│   ├── EC1 — Director Borrower Special Case
│   ├── EC2 — Section 186 Limit Warning
│   └── EC3 — Signature Mismatch Flow
├── 📱 Tablet Responsive/
│   └── Key screens adapted
└── 📋 Prototype Flows/
    ├── Flow A: New Application → Appraisal → SC Submit
    ├── Flow B: SC Approved → SAP Code → Disbursement Hand-off
    └── Flow C: DPD Alert → Default Note → SC Escalation
```

---

## DESIGN SOUL NOTE FOR THE FIGMA DESIGNER

This is not a consumer banking app — it is an operations tool used by a Credit Manager who processes loans for farmers who grow grapes, tomatoes, and mangoes in Maharashtra. The system must feel trustworthy, audit-ready, and fast. Every screen should help the user answer one question quickly: **"What do I need to do next, and is anything at risk?"**

The Sahyadri green is a brand asset but also a semantic choice — it grounds the product in agriculture without being folksy. Use it with discipline. The one bold design choice: the Loan Appraisal Note wizard should feel like the most premium, considered experience in the product — this is where errors cost money, so give it space, clarity, and the live eligibility calculator as a persistent thinking partner.

---
*Generated from SOP_SFPCL_LOANDISBURSEMENT v1.0 | WhatsLoan × Sahyadri Farms | Credit Team Role*
