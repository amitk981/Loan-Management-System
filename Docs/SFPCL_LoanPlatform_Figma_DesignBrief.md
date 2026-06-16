# SFPCL Loan Management Platform — Figma Design Brief
### Document Reference: WhatsLoan × Sahyadri Farms | Member Credit Administration & Settlement
**Version:** 1.0 | **Prepared for:** UI/UX Design Team | **Platform:** Web (Desktop-first, Responsive)

---

## TABLE OF CONTENTS

1. Project Context & Design Philosophy
2. Brand Identity & Visual Language
3. Design System Foundations
4. User Roles, Access Levels & Mental Models
5. Global Layout Architecture
6. Navigation Structure (Per Role)
7. Screen Inventory — Complete Breakdown
   - 7.1 Authentication Flows
   - 7.2 Farmer / Borrower Portal
   - 7.3 Credit Assessment Team (Credit Manager + Deputy Manager – Finance)
   - 7.4 Compliance Team (Company Secretary + Compliance Officer)
   - 7.5 Sanction Committee (CFO + Directors)
   - 7.6 Treasury Team (Sr. Manager – Finance + Chief Financial Controller)
   - 7.7 Super Admin
8. Cross-Role Shared Screens
9. Core Component Specifications
10. Data Visualization Guidelines
11. Form Design Standards
12. Status & Workflow Logic
13. Notification Architecture
14. Responsive Behavior
15. Accessibility & Localization
16. Figma File Structure Instructions
17. Annotation Standards

---

## 1. PROJECT CONTEXT & DESIGN PHILOSOPHY

### What is Being Built
A multi-role, web-based Loan Management System (LMS) for Sahyadri Farmers Producer Company Limited (SFPCL) — a farmer-owned organization with 769 shareholders, 48 FPCs, and 30,000+ farmers across 45,000 acres. The platform digitizes their end-to-end lending lifecycle: from loan application through credit assessment, sanction, documentation, disbursement, monitoring, and closure — all governed under Section 378ZK of the Companies Act, 2013.

### Design Philosophy
- **Clarity over cleverness:** Every screen must be immediately legible. Many users are field officers or farmers with limited digital literacy. Complexity belongs in the backend, not the interface.
- **Trust through structure:** Financial platforms earn trust through visual consistency, clean data hierarchies, and zero ambiguity in status indicators.
- **Process fidelity:** The UI must mirror the 6-stage SOP exactly. No stage may be bypassed visually or functionally.
- **Role-scoped views:** Each stakeholder sees only what they need to act on. Information is exposed progressively.
- **Audit-ready:** Every action, approval, and status change must be visually traceable.

---

## 2. BRAND IDENTITY & VISUAL LANGUAGE

### Logos (Both Must Co-Exist)
- **Sahyadri Farms**: Oval logo, deep forest green with leaf/seedling motif, tagline "Seeding goodness"
- **WhatsLoan**: Bold wordmark, teal-blue "W" chevron icon + "WhatsLoan" in dark navy
- **Placement rule:** Header → WhatsLoan as primary product brand (left); Sahyadri Farms as parent institution (right, smaller). On login/onboarding → both centered vertically stacked with a thin divider.

### Brand Color Palette

| Token Name         | Hex       | Usage                                              |
|--------------------|-----------|----------------------------------------------------|
| `brand-primary`    | `#1A3C2A` | Sidebar, primary CTAs, headers                     |
| `brand-secondary`  | `#2D7A4F` | Secondary buttons, hover states, active nav        |
| `brand-accent`     | `#1E88E5` | WhatsLoan brand accent, links, info states         |
| `brand-light`      | `#E8F5E9` | Card backgrounds, row highlights, tag backgrounds  |
| `neutral-100`      | `#F7F8FA` | Page backgrounds                                   |
| `neutral-200`      | `#EDEEF0` | Dividers, table borders, skeleton loaders          |
| `neutral-400`      | `#9EA8B3` | Placeholder text, disabled states                  |
| `neutral-700`      | `#3D4450` | Body text, secondary labels                        |
| `neutral-900`      | `#12151A` | Headings, high-emphasis text                       |
| `success-500`      | `#22C55E` | Approved, Disbursed, Active status                 |
| `success-100`      | `#DCFCE7` | Success pill backgrounds                           |
| `warning-500`      | `#F59E0B` | Pending, Under Review, Grace Period                |
| `warning-100`      | `#FEF3C7` | Warning pill backgrounds                           |
| `error-500`        | `#EF4444` | Rejected, Default, Overdue                         |
| `error-100`        | `#FEE2E2` | Error pill backgrounds                             |
| `info-500`         | `#3B82F6` | Informational status, Doc Pending                  |
| `info-100`         | `#DBEAFE` | Info pill backgrounds                              |
| `gold-500`         | `#D97706` | Special case flags (Director/Relative borrower)    |

### Surface Elevation System
```
Level 0 → bg: neutral-100  | Page canvas
Level 1 → bg: #FFFFFF      | Cards, panels, table rows
Level 2 → bg: #FFFFFF + shadow-sm | Modals, drawers
Level 3 → bg: #FFFFFF + shadow-md | Dropdowns, popovers
```
Shadow tokens: `shadow-sm: 0 1px 3px rgba(0,0,0,0.08)`, `shadow-md: 0 4px 16px rgba(0,0,0,0.12)`

---

## 3. DESIGN SYSTEM FOUNDATIONS

### Typography Scale
| Token         | Font     | Size | Weight | Line-H | Usage                       |
|---------------|----------|------|--------|--------|-----------------------------|
| `display-xl`  | Inter    | 32px | 700    | 40px   | Page heroes, empty states   |
| `display-lg`  | Inter    | 24px | 700    | 32px   | Modal titles, section heads |
| `heading-md`  | Inter    | 20px | 600    | 28px   | Card titles, panel headers  |
| `heading-sm`  | Inter    | 16px | 600    | 24px   | Sub-section titles          |
| `body-lg`     | Inter    | 15px | 400    | 22px   | Primary body content        |
| `body-md`     | Inter    | 14px | 400    | 20px   | Table content, labels       |
| `body-sm`     | Inter    | 12px | 400    | 18px   | Meta info, timestamps       |
| `label-md`    | Inter    | 13px | 500    | 18px   | Form labels, table headers  |
| `label-sm`    | Inter    | 11px | 500    | 16px   | Badges, tags, chips         |
| `mono-md`     | Roboto Mono | 14px | 400 | 20px  | Loan IDs, amounts, PAN, Aadhaar |
| `mono-sm`     | Roboto Mono | 12px | 400 | 18px  | Reference numbers           |

**Critical:** All currency amounts (₹) use `mono-md` or `mono-sm` with right-alignment. Loan IDs (LO00000001 format) always in `mono-md`, neutral-700.

### Spacing System
Base unit: 4px. Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96.
- Component internal padding: 16px (cards), 12px (compact cells), 20–24px (forms)
- Section gaps: 24–32px
- Page outer padding: 32px left/right on 1440px canvas

### Grid System
- **Desktop (1440px):** 12-column, 24px gutters, 32px margin
- **Laptop (1280px):** 12-column, 20px gutters, 24px margin
- **Tablet (768px):** 8-column, 16px gutters, 16px margin
- Sidebar (collapsed: 64px, expanded: 240px) is fixed; content area adapts.

### Border Radius
- `radius-sm`: 4px (badges, chips, table cells)
- `radius-md`: 8px (cards, inputs, buttons)
- `radius-lg`: 12px (modals, panels, drawer headers)
- `radius-xl`: 16px (stat cards, feature cards)
- `radius-full`: 9999px (avatar, toggle, status pill)

---

## 4. USER ROLES, ACCESS LEVELS & MENTAL MODELS

| Role | Platform Label | Primary Job-to-be-Done | Color Accent |
|------|---------------|----------------------|--------------|
| Farmer / FPC | **Borrower** | Apply, track status, repay | `brand-accent` (#1E88E5) |
| Credit Manager | **Credit Manager** | Review apps, prepare appraisal notes, monitor portfolio | `brand-secondary` |
| Deputy Manager – Finance | **Credit Officer** | Data entry, appraisal note drafting | `brand-secondary` |
| Company Secretary | **Company Secretary** | Document prep, compliance, KYC, NOC | `brand-primary` |
| Compliance Officer | **Compliance Officer** | Document verification support | `brand-primary` |
| CFO | **CFO** | Approval authority, portfolio oversight | `#7C3AED` (purple) |
| Executive Director | **Director** | Co-approval for loans >₹5L | `#7C3AED` |
| Senior Manager – Finance | **Finance Manager** | Disbursement initiation, SAP entries | `#0891B2` (cyan) |
| Chief Financial Controller | **Finance Controller** | Final payment authorization | `#0891B2` |
| Super Admin | **System Admin** | User management, audit logs, configuration | neutral-900 |

### Mental Model Mapping
- **Borrower:** Thinks in "my loan" — wants to know: what stage am I at, how much do I owe, when is my next payment
- **Credit Manager:** Thinks in "queues" — wants: what needs my attention today, what's at risk
- **Company Secretary:** Thinks in "checklists and compliance calendars" — wants: what documents are pending, what's overdue for renewal
- **CFO/Director:** Thinks in "exceptions and totals" — wants: what needs my signature, portfolio exposure, who is defaulting
- **Finance/Treasury:** Thinks in "transactions" — wants: what payments do I need to initiate/confirm, what is outstanding in SAP

---

## 5. GLOBAL LAYOUT ARCHITECTURE

### Shell Layout (All Authenticated Roles)
```
┌─────────────────────────────────────────────────────────┐
│  TOP HEADER (56px fixed)                                │
│  [Sidebar Toggle] [Breadcrumb] ... [Search] [Notif] [Profile] │
├──────────┬──────────────────────────────────────────────┤
│ SIDEBAR  │  CONTENT AREA                               │
│ (240px   │  ┌────────────────────────────────────────┐ │
│  or 64px │  │ PAGE HEADER (title + CTAs)             │ │
│  collapsed│  │ 48px                                   │ │
│)         │  ├────────────────────────────────────────┤ │
│          │  │ MAIN CONTENT                           │ │
│          │  │ (scrollable, 32px padding)             │ │
│          │  └────────────────────────────────────────┘ │
└──────────┴──────────────────────────────────────────────┘
```

### Top Header Specs (56px, bg: brand-primary)
- Left: Hamburger menu icon (24px) → Sidebar toggle | WhatsLoan logo (white, 120px wide)
- Center: Contextual breadcrumb trail (text: white/60%, separator: ›, current: white/100%)
- Right: [Global Search icon] [Notification bell + red badge] [Language toggle: EN/मर/हि] [Avatar + Name dropdown]
- Avatar: 32px circle, initials-based, role-color ring

### Sidebar Specs (240px expanded / 64px collapsed, bg: brand-primary, dark)
- Logo area at top (48px height)
- Navigation items: 48px height each, 16px horizontal padding
- Active state: bg `brand-secondary`, left border 3px `brand-accent`, text white
- Hover: bg white/10%
- Icons: 20px, Phosphor Icons or Heroicons (outline style in normal, fill in active)
- Section dividers: white/20%, small 10px label above group
- Bottom: User profile card (avatar + name + role badge) + Logout

### Content Area Specs
- Page Header: 48px, bg white, border-bottom neutral-200
  - Left: Page title (`heading-md`) + optional subtitle (`body-sm`, neutral-400)
  - Right: Primary action button + secondary actions
- Content: 32px padding on all sides, neutral-100 bg, scrollable

---

## 6. NAVIGATION STRUCTURE (PER ROLE)

### Borrower (Farmer Portal) Sidebar
```
📊 My Dashboard
📝 Apply for Loan
💰 My Loans
  └── Active Loans
  └── Loan History
📄 My Documents
💳 Repayment
📞 Support & Grievance
```

### Credit Assessment Team Sidebar
```
📊 Dashboard
📥 Application Inbox
  └── New Applications
  └── Pending Appraisal
  └── Returned/Incomplete
👥 Member Registry
  └── Search Member
  └── Member Profile
📋 Loan Register
  └── Active Loans
  └── All Applications
🧮 Loan Calculator
📊 Portfolio Analytics
  └── DPD Report
  └── MIS Reports
⚠️ Defaults & Recovery
```

### Company Secretary / Compliance Team Sidebar
```
📊 Dashboard
📋 Document Queue
  └── Awaiting Preparation
  └── Awaiting Review
  └── Awaiting CS Sign-off
🗂️ Document Templates
  └── PoA Generator
  └── Tri-Party Agreement
  └── SH-4 Forms
  └── Term Sheet
  └── Loan Agreement
✅ KYC & CKYC
  └── Pending KYC
  └── Re-KYC Due
📜 Compliance Calendar
  └── Stamp Duty Register
  └── Board Approvals
  └── Annual Renewals
🏦 CDSL Pledge Tracker
📝 NOC Management
📋 Compliance Reports
```

### Sanction Committee Sidebar
```
📊 Dashboard
✍️ Approval Queue
  └── Awaiting My Approval
  └── Joint Approval Required
📋 Credit Sanction Register
🚨 Exception Register
📊 Portfolio Overview
  └── Portfolio Health
  └── Exposure Reports
  └── DPD Summary
📋 Board Minutes
⚙️ Policy Settings
```

### Treasury / Finance Team Sidebar
```
📊 Dashboard
💸 Disbursement Queue
  └── Pending Initiation
  └── Pending Authorization
  └── Disbursed Today
🏦 SAP Management
  └── Customer Code Creation
  └── SAP Entries Log
💰 Repayment Tracking
  └── Incoming Payments
  └── Subsidiary Deductions
📊 Financial Reports
  └── Interest Accruals
  └── Bank Reconciliation
  └── Ledger Summary
```

---

## 7. SCREEN INVENTORY — COMPLETE BREAKDOWN

---

### 7.1 AUTHENTICATION FLOWS

#### Screen A-1: Login Page
**Canvas size:** 1440×900 | **Layout:** Split-screen (50/50)

**Left Panel (bg: brand-primary, dark green):**
- Top: Sahyadri Farms oval logo (white, 120px)
- Center: Illustrated visual — farmer receiving money digitally (abstract line-art style, white/cream palette, 300px width)
- Below: 3 feature callout chips: "₹0 Paper | Digital Approvals | Instant Disbursement"
- Bottom: WhatsLoan logo (white) + tagline "Agri Credit, Simplified"

**Right Panel (bg: white):**
- Top right: Language selector tabs [English | मराठी | हिंदी]
- Card (centered, 400px wide):
  - Heading: "Welcome Back" (`display-lg`, neutral-900)
  - Sub: "Log in to your loan portal" (`body-md`, neutral-400)
  - **Role Selector:** Horizontal pills row (5 pills, single-select):
    - [Farmer] [Credit Team] [CS / Compliance] [Sanction Committee] [Finance / Treasury]
    - Selected: bg brand-primary, text white, radius-full
    - Unselected: border neutral-200, text neutral-700
  - Mobile Number field (with +91 flag prefix dropdown)
  - Send OTP button → morphs to OTP input (6 boxes, `mono-md`)
  - "Or login with credentials" toggle → shows Username/Password variant
  - Checkbox: Remember this device (30 days)
  - Login CTA: Full-width, bg brand-primary, "Login →"
  - "Forgot Password?" text link (neutral-400)
  - Bottom: Privacy Policy | Terms | Help links

**Interaction notes:** Role selector changes the illustration on the left panel to match role persona. OTP auto-submits on 6th digit entry. Invalid OTP shakes the input boxes.

#### Screen A-2: OTP Verification (Full Page)
- Centered card, 480px wide
- Masked mobile number shown
- 6-input OTP boxes (48×48px each, 8px gap)
- 60-second countdown timer + "Resend OTP" (greyed until timer ends)
- "Change number" link

#### Screen A-3: Password Reset Flow
- Step 1: Mobile + OTP verification
- Step 2: New Password + Confirm (with strength meter: 4-segment bar)
- Password rules shown as green checkmarks as typed

---

### 7.2 FARMER / BORROWER PORTAL

#### Screen F-1: Farmer Dashboard
**Layout:** Content area, no split panels

**Page Header:**
- "Good morning, Ramesh Patil 👋" (`display-lg`)
- Subtitle: "Member since 2019 · Folio No. SH-04821" (`body-sm`, neutral-400)
- Right: "Apply for Loan" button (brand-primary, with + icon)

**Row 1 — Active Loan Hero Card (full width, bg: brand-primary gradient, white text, radius-xl, 140px height):**
- Left cluster: "Active Loan" label (label-sm, white/60%) | Loan ID (mono-md, white) | "Disbursed: 15 Jan 2025"
- Center: Outstanding Amount "₹1,42,500" (display-xl, white) | "of ₹2,00,000 sanctioned" (body-sm, white/60%)
- Right cluster: Next Repayment pill (warning-500 bg, "Due: 30 Jun 2025") | "Pay Now" ghost button (white border)
- If no active loan: Empty state card with "Apply for your first loan →" CTA

**Row 2 — 4 Stat Cards (4-column grid):**
- Card 1: "Shares Held" — count (e.g., 250 shares) | "₹50,000 valuation"
- Card 2: "Max Loan Eligibility" — ₹15,000 (lower of two limits) | "Based on shares & land"
- Card 3: "Total Repaid" — ₹57,500 | progress bar
- Card 4: "CIBIL / Credit Status" — Green "Good Standing" badge

**Row 3 — Loan Journey Tracker (full width card):**
- 6-node horizontal progress bar with connecting lines
- Nodes: [Application Submitted] [Credit Assessment] [Sanctioned] [Documentation] [Disbursed] [Closed]
- Each node: circle icon (filled = done, ring = current, empty = future) + stage name below + date if completed
- Current stage: pulsing ring animation, tooltip with "Expected by: X date"

**Row 4 — Two-Column Layout:**
- Left (60%): "Recent Transactions" table (Date | Type | Amount | Mode | Status) — last 5 rows with "View All" link
- Right (40%): "My Documents" quick list (icon + doc name + status badge + Download button) — PoA, Term Sheet, Loan Agreement, NOC

**Row 5 — Notifications Feed (card, full width):**
- Title: "Recent Alerts"
- List of notification items: icon + message + timestamp (e.g., "Interest invoice for FY 2025-26 generated — ₹18,000")

---

#### Screen F-2: New Loan Application — Multi-Step Wizard
**Layout:** Centered card (720px wide), step indicator at top, left-side step sidebar on desktop

**Step Indicator (top, horizontal):**
5 steps shown as: [●──●──○──○──○] with step names below:
Step 1: Basic Details | Step 2: Shareholding | Step 3: Land & Crop | Step 4: KYC Upload | Step 5: Review

---

**Step 1 — Basic Details:**
- Heading: "Tell us about yourself"
- Form fields (2-column grid):
  - Full Name (pre-filled from profile, read-only with lock icon)
  - Date of Birth (date picker)
  - Gender (radio: Male / Female / Other)
  - Mobile Number (pre-filled, read-only)
  - Alternate Mobile
  - Email (optional)
  - Address (textarea, 3 lines)
  - Village / Taluka / District / State (cascading dropdowns)
  - PIN Code
- Nominee Section (collapsible, with "Required by SOP" tooltip):
  - Nominee Name | Age | Gender | Aadhaar Number | PAN | Relationship
  - Note: "Nominee must not be a minor"
- "Next: Shareholding Details →" CTA

**Step 2 — Shareholding & Loan Limit:**
- Heading: "Your Shareholding Details"
- Read-only fields (pulled from registry):
  - Folio Number | Number of Shares Held | Share Type (Physical/D-MAT)
  - Current Share Valuation (₹X per share, based on latest AGM)
- **Loan Limit Calculator Panel (highlighted box, bg brand-light):**
  - Method 1: "Shareholding-based Limit"
    - Formula shown visually: `[Shares] × [30% × ₹Valuation/share]`
    - Live result: "₹___"
  - Method 2: "Agricultural Land-based Limit (Scale of Finance)"
    - Input: Land area under cultivation (acres, number input with stepper)
    - Formula: `[Acres] × ₹20,000`
    - Live result: "₹___"
  - Result banner: "Your Maximum Eligible Loan Amount: ₹___ " (lower of both, success-500 bg, white text)
  - Footnote: "Final amount subject to Credit Assessment Team review"
- Loan Request:
  - "Required Loan Amount" (number input, max = calculated limit, error if exceeded)
  - "Purpose of Loan" (dropdown: Crop Production / Farm Inputs / Equipment / Other Agriculture)
  - Purpose Description (textarea, 150 char max)

**Step 3 — Land & Crop Details:**
- Heading: "Your Agricultural Profile"
- Land Documents:
  - "Upload 7/12 Extract (Satbara)" — drag-and-drop zone
  - "Upload Crop Plan" — drag-and-drop zone
  - "Upload Bank Statement (Last 6 months)" — drag-and-drop zone
- Land Details table (add-row interface):
  - Columns: Survey Number | Village | Area (acres) | Crop | Season
  - "+ Add Land Parcel" button below
- Bank Account Details:
  - Account Holder Name | Bank Name | Account Number | IFSC Code | Branch
  - "Upload Cancelled Cheque" — drag-and-drop zone
  - Account verified badge (appears after IFSC lookup)

**Step 4 — KYC Documents:**
- Heading: "Identity Verification"
- Applicant KYC Section:
  - PAN Card — upload zone (accepts JPG/PDF, 5MB max) + "Self-attested copy required" note
  - Aadhaar Card — upload zone
  - Share Certificates — upload zone (if physical shares)
  - Passport Photo — upload zone (JPG only, max 500KB)
- Nominee KYC Section (identical structure, labeled clearly)
- Declarations Section (3 checkboxes with full text):
  - ☐ I declare I am not a wilful defaulter
  - ☐ I consent to CKYC/bureau enquiries
  - ☐ The asset is not already encumbered
- CKYC Consent (mandatory checkbox with link to full text)

**Step 5 — Review & Submit:**
- Full summary of all entered data in accordion sections (collapsible)
- "Edit" link on each section header
- Loan Summary card (prominent): Amount | Purpose | Estimated Limit | Share Details
- Document Checklist: each doc uploaded shown with green ✓ or red ✗ if missing
- Declaration banner (neutral bg): "By submitting, you agree to the Loan Terms and authorize SFPCL to verify your details"
- "Submit Application" CTA (full width, brand-primary)
- On submit: Loading state → Success screen:
  - Large green checkmark animation
  - "Application Submitted!" heading
  - "Your Application Reference: LO00000047" (`mono-md`, large)
  - Estimated turnaround: "Credit team will review within 2 working days"
  - "View Application Status →" and "Back to Dashboard" buttons

---

#### Screen F-3: Loan Status Detail Page
- Loan ID + title in header
- Tabbed layout: [Overview] [Documents] [Repayment] [Timeline]

**Overview Tab:**
- Loan Summary card (amount, disbursement date, tenure, interest rate — floating label with tooltip)
- 6-stage journey tracker (same as dashboard but larger, vertical layout with detailed status per step)
- Quick Actions: "Make Payment" | "Download Statement" | "View Agreement"

**Documents Tab:**
- Grid of document cards (icon + name + status + date + download link)
- Documents: Application Form, KYC Bundle, Appraisal Note, Term Sheet, Loan Agreement, PoA, SH-4/CDSL Receipt, Disbursement Advice

**Repayment Tab:**
- Next payment highlight card
- Repayment schedule table (columns: Due Date | Principal | Interest | Total | Status)
- Payment history table
- "Pay Now" button → opens repayment modal with RTGS/NEFT details

**Timeline Tab:**
- Vertical activity feed: every action with timestamp, actor role, and brief note
- E.g., "Application Submitted by Farmer · 10 Jan 2025, 11:42 AM"
- "Appraisal Note Prepared · Credit Officer · 12 Jan 2025, 3:15 PM"

---

#### Screen F-4: Repayment Screen
- Outstanding Amount (large, error-500 if overdue, success if on-track)
- Repayment Method selector: [Direct Bank Transfer (RTGS/NEFT)] [Via Subsidiary Deduction]
- For Direct Transfer: Show company bank details (Account Name, Account No, IFSC, Bank — copy buttons)
- Payment Amount input (pre-filled with minimum due, editable)
- Note: "Partial payments will first be adjusted against principal" (info banner)
- Upload Payment Confirmation (UTR receipt)
- Submit button

---

### 7.3 CREDIT ASSESSMENT TEAM

#### Screen C-1: Credit Manager Dashboard
**4 KPI Cards (Row 1):**
- "Applications Today" — count with delta vs yesterday (↑3)
- "Pending Appraisal" — count with warning badge if >5
- "Approved This Month" — count + ₹ total disbursed
- "Portfolio at Risk (DPD 1yr+)" — count + red badge

**Row 2 — Application Pipeline (Kanban Columns, horizontal scroll):**
- Columns: [Received (N)] [Appraisal In Progress (N)] [Submitted to Sanction (N)] [Approved (N)] [Docs Pending (N)] [Disbursed (N)]
- Each card (200px wide, 120px height): Loan ID | Farmer Name | ₹Amount | Days in Stage (badge: green <2, orange 2-3, red >3) | Priority flag
- Click card → opens application detail drawer (right-side panel, 480px)

**Row 3 — Two-Column:**
- Left: "Overdue Attention" list — loans awaiting appraisal >2 days (TAT breach alert)
- Right: "Quick Stats" — chart showing applications by status (donut), current month trend (sparkline)

**Row 4 — Recent Activity Feed**

---

#### Screen C-2: Application Inbox / Queue
**Layout:** List view (full-width table with filter sidebar, 280px)

**Filter Sidebar:**
- Search by name / loan ID / folio number
- Status filter (multi-select checkboxes)
- Application Date range (date picker)
- Amount range (dual-handle slider: ₹0 — ₹5L+)
- Loan Type (Short-term / Long-term)
- Days in queue (1-2 days / 3-5 days / >5 days)
- Clear All Filters link

**Main Table:**
- Columns: [☐ Select] [Loan ID] [Applicant Name] [Folio No.] [Applied Amount] [Method 1 Limit] [Method 2 Limit] [Eligible Limit] [Purpose] [Applied Date] [Days Pending] [Status] [Actions]
- Column widths balanced; Amount columns right-aligned with ₹ prefix
- Status: Color-coded pill badges
- Days Pending: Red if >2 (TAT rule)
- Actions column: [Review] [Assign to Officer] […more]
- Row hover: light neutral-100 bg
- Pagination: 20 rows per page default, selector for 20/50/100

**Bulk Actions bar (appears on selection):** Assign | Export | Archive

---

#### Screen C-3: Application Review & Appraisal Note Preparation
**Layout:** 2-panel split — Left (60%): Application data | Right (40%): Appraisal Note builder

**Left Panel — Application Data (scrollable):**
- Header: Loan ID + Farmer Name + Status badge + "Back to Queue" link
- Section 1: Borrower Details (all basic info, read-only)
- Section 2: Nominee Details
- Section 3: Shareholding & Loan Limits:
  - Both methods calculated and displayed with visual comparison bar
  - "Eligible Amount: ₹X (lower of Method 1: ₹A and Method 2: ₹B)" — prominent callout box
- Section 4: KYC Documents (thumbnail grid with "Verified ✓" or "Flag ⚠️" buttons per doc)
- Section 5: Bank Details + Cancelled Cheque preview
- Section 6: Loan History (table of past loans if any — dates, amounts, repayment status)

**Right Panel — Loan Appraisal Note (sticky, white card):**
- Header: "Loan Appraisal Note" + auto-filled: Note No., Date, Credit Officer Name
- **Eligibility Checklist (5 items, each with ✓/✗ toggle + notes field):**
  1. ☐ Active member of FPC
  2. ☐ No existing default (company + subsidiary)
  3. ☐ Land docs + KYC + bank statement + crop plan submitted
  4. ☐ Agrees to Term Sheet & Loan Agreement
  5. ☐ Loan purpose: crop production / agriculture only
- **Risk Rating Section:**
  - Risk Rating: dropdown (Low / Medium / High)
  - Repayment Capacity: textarea
  - Risk Remarks: textarea
- **Recommended Amount:** Number input (max = eligible limit)
- **Recommended Tenure:** Short-term (1 yr) / Long-term (>1 yr) toggle
- **Credit Officer Recommendation:** Approve / Flag for Review / Reject radio
- **Comments:** Rich text (250 chars)
- Actions: [Save Draft] [Submit to Sanction Committee →]
- Warning banner if any eligibility check is unchecked before submit
- **Rejection path:** If recommending rejection → "Prepare Rejection Note" button opens modal with reason selector + textarea → generates downloadable Rejection Note (Annexure L format)

---

#### Screen C-4: Loan Register
- Full-width table with comprehensive filters
- Columns: Loan ID | Farmer Name | Sanctioned Amount | Disbursed Date | Tenure | Outstanding Principal | Outstanding Interest | DPD (days) | DPD Bucket | Status | Last Payment Date | Next Due
- DPD Bucket column color-coded: 0 = green, 1-2yr = amber, 2-3yr = orange, 3yr+ = red
- Export: CSV / PDF buttons
- "Generate Quarterly MIS" button → triggers report generation

---

#### Screen C-5: Loan Limit Calculator (Standalone Tool)
- Large centered card, 640px wide
- Title: "Loan Eligibility Calculator"
- Two sections side by side:
  - **Method 1: Shareholding-Based**
    - Input: Number of Shares (number field)
    - Display: Current share valuation (₹200/share — shown with "Based on AGM 2024" note)
    - Formula visualization: `[250 shares] × [₹200 × 30%] = ₹15,000`
    - Result: Large number, success-500
  - **Method 2: Agricultural Land-Based**
    - Input: Land area (acres, decimal input)
    - Display: Current Scale of Finance (₹20,000/acre — shown with "FY 2025-26" note)
    - Formula: `[2.5 acres] × ₹20,000 = ₹50,000`
    - Result: Large number, success-500
- **Final Result Banner (full width, brand-primary):**
  - "Maximum Eligible Amount: ₹15,000 (lower of Method 1)"
  - Arrow callout highlighting which method was the limiting factor
- "Reset" and "Use in Application" buttons

---

#### Screen C-6: DPD Report & Portfolio Analytics
**Layout:** Dashboard-style, tabs at top

**Tab 1 — DPD Summary:**
- 3 large stat cards: "1–2 Years DPD (₹ + Count)" | "2–3 Years DPD" | "3+ Years DPD"
- Grouped bar chart: DPD trend over last 4 quarters
- Filterable table of DPD loans with "Send Reminder" action per row

**Tab 2 — Portfolio Health:**
- Donut chart: Performing vs At-Risk vs Default portfolio split
- Line chart: Monthly disbursements vs repayments (last 12 months)
- Heatmap: Borrowers by village/cluster showing repayment behavior

**Tab 3 — MIS Report Generator:**
- Date range selector
- Report type checkboxes (DPD Report / Active Loans / Defaults / Interest Summary)
- Generate PDF / Generate Excel buttons

---

### 7.4 COMPLIANCE TEAM (COMPANY SECRETARY)

#### Screen CS-1: Company Secretary Dashboard
**KPI Cards (Row 1, 4 cards):**
- "Documents Awaiting Preparation" — count + avg days waiting
- "Awaiting My Sign-off" — count with urgent badge
- "Re-KYC Due This Month" — count (members needing periodic KYC renewal)
- "Compliance Items Overdue" — count with red badge

**Row 2 — Compliance Calendar Widget (full width card):**
- Month view calendar
- Color-coded events: Blue = KYC renewals | Green = Stamp duty activities | Orange = Board approvals | Red = Overdue
- Click event → opens compliance item detail panel

**Row 3 — Two columns:**
- Left: "Document Queue" — prioritized list with stage + days waiting
- Right: "Recent Compliance Actions" — activity feed

---

#### Screen CS-2: Document Preparation Queue
**Layout:** Similar to application inbox — filter sidebar + main list

**Columns:** [Loan ID] [Farmer Name] [Stage] [Documents Required] [Documents Ready] [Days Since Sanction] [Assigned To] [Actions]

**Documents Required** shown as mini progress chips: `PoA ✓ | TriParty ✓ | SH-4 ⏳ | TermSheet ✗ | LoanAgreement ✗ | Checklist ✗`

---

#### Screen CS-3: Document Preparation Workspace
**Layout:** Full-width, tabbed document types | Right-side Preview panel (560px)

**Header:**
- Loan ID + Farmer Name + Stage badge
- Document progress tracker: 8 steps (as listed in SOP Stage 4)

**Document Tabs (horizontal tabs under header):**
[PoA] [Tri-Party Agreement] [SH-4 / CDSL Pledge] [Term Sheet] [Loan Agreement] [Bank Verification] [Checklist]

**Each Tab Content:**

**PoA Tab:**
- Auto-populated fields (from application data):
  - Borrower name, address, nominee details, share details
- Editable fields: Date of execution, Notary details
- Stamp paper: "₹500 stamp paper required" — upload zone for stamped copy
- Notarization: Date + Notary Name fields
- Status toggle: "Pending" / "Ready for Execution" / "Executed"
- "Generate Draft PDF" button → opens document preview in right panel
- "Mark as Executed" button (requires upload of signed copy)

**Tri-Party Agreement Tab:**
- Auto-populated parties: SFPCL + Borrower + [Subsidiary selector dropdown]
- Key clauses shown as fillable fields (payment deduction %, effective date)
- Signatory details for all 3 parties
- Same generation + execution flow

**SH-4 Tab:**
- Applicable only if shares NOT in D-MAT (conditional rendering based on share type from profile)
- Fields: Share certificate numbers, folio no., transferor/transferee, witness name + folio
- If D-MAT: "CDSL Pledge Process" sub-tab:
  - Step-by-step pledge status tracker (5 sub-steps from SOP 4.6)
  - PSN (Pledge Sequence Number) field
  - Acceptance status from Pledgee DP
  - "Future shares pledge" auto-clause note

**Term Sheet Tab:**
- Structured form with all 13 SOP-specified fields:
  1. Borrower Details (auto-fill)
  2. Nominee Details (auto-fill)
  3. Share Details (auto-fill)
  4. Facility Type: Short-term (≤1 yr) / Long-term radio
  5. Loan Amount (₹, from approved amount)
  6. Purpose
  7. Rate of Interest (floating % field + "Floating rate — changes with bank rates" note)
  8. Tenure of Interest
  9. Repayment Date (date picker)
  10. Penalty Interest (% field)
  11. Other Charges/Fees (add-row interface)
  12. Security (multi-checkbox: SH-4 / CDSL Pledge / Blank Cheque / PoA)
  13. Dispute Resolution (dropdown: Arbitration / Jurisdiction selector)
- Signatories: Applicant + Nominee signature blocks
- If loan >₹5L: Additional CFO + 2 Director signature blocks auto-appear
- "Generate Term Sheet PDF" button

**Loan Agreement Tab:**
- Similar to Term Sheet with full legal contract structure
- ₹500 stamp paper required flag
- Witness section: Name + Folio Number (must be existing SFPCL shareholder)
- Notarization block
- "Generate Agreement PDF" → preview in right panel

**Bank Verification Letter Tab:**
- Conditional: visible only if "Signature Mismatch" flag was raised in credit review
- Two options presented as cards:
  - Option 1: Bank Verification Letter (upload stamped letter from bank)
  - Option 2: Borrower Declaration on Stamp Paper (upload scanned declaration)
- Status: Pending / Received

**Checklist Tab (Annexure H):**
- Full index of all documents with checkbox + status + date + who verified
- Documents list (12 items from SOP):
  1. Loan Application Form (signed by applicant + nominee)
  2. KYC — Applicant (PAN, Aadhaar, Photo)
  3. KYC — Nominee
  4. KYC — Witness (PAN, Aadhaar + must be SFPCL shareholder)
  5. Share Certificates / CDSL D-MAT Statement
  6. Land Documents (7/12 Extract)
  7. Crop Plan
  8. Bank Statement (6 months)
  9. Cancelled Cheque
  10. Blank-dated Cheque (security, custody noted)
  11. Power of Attorney (stamped, notarised)
  12. Tri-Party Agreement
  13. SH-4 Form OR CDSL Pledge Confirmation
  14. Term Sheet (signed)
  15. Loan Agreement (stamped, notarised, witnessed)
- Each row: ☐ Checkbox | Document Name | Status badge | Upload zone | Verified By | Date
- **Signature Section (bottom of checklist — 4 signature blocks):**
  - Company Secretary: "All documents verified & attached" — Sign + Date
  - Credit Manager: "Loan limits reviewed & confirmed" — Sign + Date
  - Sanction Committee Member: "Final approval as per authority matrix" — Sign + Date
  - Senior Manager – Finance: "Loan disbursed to applicant's account" — Sign + Date
- "Submit Complete File to Sanction Committee" CTA (disabled until all 15 docs checked + CS signature)

---

#### Screen CS-4: KYC & CKYC Management
**Layout:** List view with filter

- Table: Member Name | Folio | KYC Date | Re-KYC Due | Status | Action
- Status pills: Fresh KYC / Re-KYC Due Soon (≤30 days) / Re-KYC Overdue / CKYC Linked
- "Send Re-KYC Reminder" bulk action
- Click row → KYC Detail drawer: all docs + CKYC identifier + verification history

---

#### Screen CS-5: NOC Management
- Table of loans ready for NOC (fully repaid)
- "Generate NOC" button per row → previews NOC document
- NOC template: Borrower name, Loan ID, Full repayment date, Release of SH-4/Pledge/Blank Cheque confirmation
- "Issued NOC" status + download link
- Archive trigger: "Mark documents for 8-year archival"

---

### 7.5 SANCTION COMMITTEE (CFO + DIRECTORS)

#### Screen SC-1: Sanction Committee Dashboard
**Personalized header:** "Welcome, [Name] · CFO" or "Welcome, [Name] · Executive Director"

**Row 1 — Alert Cards (3 cards, full color):**
- "Awaiting Your Approval" — large number, error-500 bg if >0, with "Oldest: 3 days" note
- "Joint Approval Needed (>₹5L)" — count, gold-500 bg
- "Special Cases (Director/Relative)" — count, gold-500 bg with special handling note

**Row 2 — Portfolio Snapshot (4 KPI cards):**
- Total Active Portfolio (₹ value)
- Loans Sanctioned This Month (count + ₹)
- Current NPA / At-Risk
- Available Lending Capacity (vs s.186 limit, shown as progress bar: used vs 60%/100% of reserves)

**Row 3 — Approval Queue Table (compact, top 10 items):**
- [Loan ID] [Applicant] [Amount] [Appraisal Score] [Days Waiting] [Required Authority] [Action]
- Required Authority: "CFO + 1 Dir" or "CFO + 2 Dir" badges
- Quick [Review & Decide] CTA per row

---

#### Screen SC-2: Loan Review & Approval Screen
**Layout:** Full-page, 3-column (Left: App Data 40% | Center: Appraisal Note 35% | Right: Decision Panel 25%)

**Left Column — Loan Summary:**
- All borrower + loan details in accordion sections (same data as credit officer screen, read-only for CFO)
- Loan limit calculation (both methods displayed)
- Past loan history (table)

**Center Column — Appraisal Note:**
- Credit officer's completed appraisal note
- Eligibility checklist with color-coded results
- Risk rating badge (Low/Medium/High)
- Credit Officer recommendation + comments
- "Prepared by: [Name] on [Date]" footer

**Right Column — Decision Panel (sticky, white, shadow-md):**
- Title: "Sanction Committee Decision"
- Authority being used: "CFO + 1 Director" (highlighted, or "CFO + 2 Directors" for >₹5L)
- **7-Point Scrutiny Checklist (required pre-decision):**
  1. ☐ Eligibility Verified
  2. ☐ Loan Amount Within Permissible Limits
  3. ☐ Purpose Aligned with Company Objectives
  4. ☐ Compliance Checks Passed (Companies Act)
  5. ☐ Past Borrowing History Reviewed
  6. ☐ Risk Assessment Considered
  7. ☐ Documentation Complete
  - Each item: Toggle ✓/✗ with optional remarks field (expands on ✗)
- **Special Case Warning Banner (gold-500 bg):** Appears conditionally if borrower = Director / relative. Text: "⚠️ This loan requires General Meeting approval per Sec. 378ZK. Please ensure resolution is attached."
- **Decision:**
  - [✓ Approve] [✗ Reject] [↩ Return for Clarification] — 3 large radio-style cards
  - Approved Amount field (editable, max = appraisal recommended amount)
  - Comments (mandatory for Reject/Return)
  - Special conditions (optional text field for conditional approvals)
- "Record in Credit Sanction Register" checkbox (mandatory before submit)
- [Submit Decision] CTA

**On Approval:** Celebratory micro-animation (subtle) + notification sent to CS team + status updates to 6-stage tracker

**On Rejection:** Red status update + Rejection Note auto-generated + farmer notification queued

---

#### Screen SC-3: Credit Sanction Register
- Full-width table: all sanction decisions with complete details
- Columns: Date | Loan ID | Borrower | Amount Sanctioned | Authority | Decision | Sanction Note Ref | Exception Flag
- Filterable by date range, authority, amount
- Exception Register link: shows all cases that exceeded limits or had special approvals

---

### 7.6 TREASURY TEAM

#### Screen T-1: Finance Manager Dashboard
**Row 1 — 4 KPI Cards:**
- "Pending Disbursement" — count + ₹ total
- "Disbursed Today" — count + ₹ total
- "SAP Codes Pending Creation" — count
- "Repayments Received Today" — count + ₹

**Row 2 — Disbursement Queue Table:**
- Loan ID | Borrower | Amount | CS Signed | Sanction Date | SAP Code | Bank Details | Auth Status | Actions

---

#### Screen T-2: Disbursement Processing Screen
**Layout:** Step-by-step vertical workflow (6 steps from SOP Stage 5)

**Step 1 — Pre-flight Checklist:**
- Checklist mirroring Stage 5 SOP:
  - ☐ CS signature on checklist: [VERIFIED]
  - ☐ Credit Manager signature: [VERIFIED]
  - ☐ Sanction Committee signature: [VERIFIED]
  - ☐ All 15 documents present in file
  - ☐ SAP Customer Code created: [CODE: SFCUST-0482]
- "Proceed to Payment Initiation" button (disabled until all checked)

**Step 2 — Beneficiary Verification:**
- Farmer bank details card (pulled from application):
  - Account Name | Bank | Account Number (masked: XXXX-XXXX-4821) | IFSC | Branch
  - "Matches cancelled cheque" green badge
  - "Verify with Bank" button (if needed)
  - SFPCL RBL Bank debit account selector (dropdown of authorized accounts)

**Step 3 — Payment Initiation (by Senior Manager – Finance):**
- Amount to disburse (read-only, from approval)
- Payment mode: NEFT / RTGS (auto-selected based on amount: >₹2L = RTGS)
- Remarks field: "Loan disbursement — Ref: LO00000047"
- "Initiate Payment" → sends to Chief Financial Controller queue

**Step 4 — Authorization (by Chief Financial Controller):**
- Dedicated screen for CFC: shows pending transfers
- Borrower details + amount + SAP entry details
- [Authorize Payment] button → triggers bank transfer
- Two-factor auth required at this step (OTP to CFC's registered mobile)

**Step 5 — SAP Entry Confirmation:**
- Auto-generated SAP journal entry preview
- Loan Account (Dr.) | Bank Account (Cr.) | Amount
- SAP Transaction Code reference
- "Confirm SAP Entry" button

**Step 6 — Disbursement Complete:**
- Success state with confirmation details
- Auto-actions triggered:
  - Loan register updated ✓
  - Disbursement advice generated for farmer ✓
  - 6-stage tracker updated to "Disbursed" ✓
  - Farmer notification sent ✓
- "Download Disbursement Advice" button (PDF)

---

#### Screen T-3: Repayment Tracking
**Tabs:** [Incoming Payments (Direct)] [Subsidiary Deductions] [Interest Accruals]

**Direct Payments Tab:**
- Table: Date | UTR No. | Farmer Name | Loan ID | Amount Received | Mode | Adjustments (Principal / Interest) | Remaining Balance
- "Post to SAP" action per unposted entry (SAP entry next working day rule)

**Subsidiary Deductions Tab:**
- Per subsidiary (Sahyadri Farms Post Harvest Care Ltd.) — deduction transactions
- Farmer Name | Loan ID | Transaction Date | Gross Payment | Deduction Amount | Net to Farmer | SFPCL Receipt Status

**Interest Accruals Tab:**
- Monthly accrual entries by loan
- Year-end interest invoice generation button per loan
- Overdue interest capitalization (adds unpaid interest to principal after 30 April)

---

#### Screen T-4: Default Handling Workflow
**Layout:** Per-loan workflow view triggered from DPD report

**Header:** Loan ID + Farmer Name + DPD indicator (red, days overdue)

**Default Timeline (vertical stepper):**
Step 1: Missed Scheduled Payment (date)
Step 2: 3-Month Grace Period — [Active / Expired]
  - Countdown: "Grace period expires in X days"
  - Action: "Send Payment Reminder" button
Step 3: Payment Status Assessment — [Intentional] / [Non-Intentional] (radio with required notes)
Step 4 (if Non-Intentional): 1-Year Extension — [Grant Extension] button → opens extension note form
Step 5: Post-Extension Status — [Still Unpaid] → triggers "Treat as Non-Recoverable"
Step 6: Sanction Committee Decision
  - "Invoke SH-4 / CDSL Pledge" → opens share sale workflow
  - "Present Undated Cheque" → tracks cheque presentation

**Extension Note Form (modal):**
- Reason for Extension (textarea)
- New Repayment Date
- Approved by (Credit Manager auto-populated)
- "Save Extension Note (documents in loan file)" checkbox

---

### 7.7 SUPER ADMIN

#### Screen A-1: User Management
- Table: User Name | Role | Email | Mobile | Status | Last Login | Actions (Edit / Deactivate)
- "Invite New User" → multi-step form: Role selector → Details → Assign permissions
- Role-based permission matrix view (toggle grid: Role × Feature)

#### Screen A-2: Audit Log
- Immutable event log: Timestamp | User | Action | Entity (Loan ID) | Old Value | New Value | IP Address
- Filters: User, Action Type, Date Range, Entity

#### Screen A-3: System Configuration
- Loan Parameters: Scale of Finance per acre (₹ input, "Board approved" note) | Share valuation percentage (10% default, "Requires Board approval to change" tooltip)
- Interest Rate Management: Base rate | Current effective rate | Rate change log
- Notification Templates: Email / SMS templates per trigger event
- DPD Thresholds: Configure bucket boundaries

---

## 8. CROSS-ROLE SHARED SCREENS

### Member / Loan Profile Page
Accessible by Credit Team, CS, CFO, Treasury (read-only for most, edit for Credit Team):
- Profile header: Photo | Name | Member ID | Folio | Active Status badge | "Active Member" / "Inactive" tag
- Tabs: [Personal Details] [Shareholding] [Loan History] [KYC Docs] [Compliance Notes]
- Shareholding tab: Shares owned | Valuation history | D-MAT vs Physical split | Pledge status
- Loan History: Table of all loans with amounts, dates, repayment status

### Notifications Center
- Bell icon → dropdown (top 5 items) → "View All" → full notifications page
- Full page: Tabs [All] [Approvals] [Disbursements] [Repayments] [Compliance] [System]
- Each notification: Icon (role-color) | Title | Body preview | Timestamp | "Mark Read" | Action button
- Bulk: "Mark All Read"

### Help / Grievance Screen
- FAQ accordion (organized by role and process stage)
- "Raise a Complaint" form: Category | Description | Attachment | Submit → creates ticket in CS grievance log (Annexure K)
- Ticket tracking table for submitted grievances

---

## 9. CORE COMPONENT SPECIFICATIONS

### Status Badge Pills (label-sm, radius-full)
| Status Label           | Background  | Text Color  | Usage |
|-----------------------|-------------|-------------|-------|
| Application Received  | info-100    | info-500    | Stage 1 |
| Under Assessment      | warning-100 | warning-500 | Stage 2 |
| Pending Approval      | warning-100 | #D97706     | Stage 3 |
| Docs Preparation      | info-100    | info-500    | Stage 4 |
| Disbursed             | success-100 | success-500 | Stage 5 |
| Active                | success-100 | success-500 | Stage 6 |
| Closed / NOC Issued   | neutral-200 | neutral-700 | Closed |
| Rejected              | error-100   | error-500   | Any stage |
| Returned              | warning-100 | warning-500 | Any stage |
| Defaulted             | error-100   | #991B1B     | Stage 6 |
| Extension Granted     | gold bg     | gold text   | Stage 6 |
| Special Case ⚠️       | gold-500 bg | white       | Stage 3 |

### Loan Amount Display Component
- Always: ₹ symbol + number with comma formatting + right-aligned
- Large (hero): 32px Inter Bold, neutral-900
- Table cell: 14px Roboto Mono, right-aligned, neutral-700
- Overdue/at-risk: error-500 color
- Tooltip on hover showing breakdown (Principal + Interest = Total)

### 6-Stage Progress Tracker Component
**Horizontal (compact, for tables/cards):**
- 6 dots connected by lines (3px), current = pulsing ring, done = filled brand-primary, future = neutral-200
- Hover any dot: tooltip with stage name + date

**Vertical (detailed, for loan detail pages):**
- Each stage: Icon + Stage Name + Status + Date + Actor name + Brief note
- Expandable to show sub-steps per stage

### Document Upload Zone Component
- Border: 2px dashed neutral-300, radius-md, padding 32px
- Center: Upload icon (40px, neutral-400) + "Drag files here or click to browse"
- Accepted formats + max size shown in label-sm neutral-400
- Hover: border brand-secondary, bg brand-light
- With file: Thumbnail/icon + filename + size + remove button
- Error: border error-500 + error message below

### Maker-Checker Approval Component (reusable)
- Two distinct action blocks side by side
- Left (Maker — Credit Manager): "Reviewed & Prepared by" + Name + Date + Signature placeholder
- Right (Checker — Sanction Committee): "Reviewed & Sanctioned by" + Name + Date + Signature placeholder
- Status overlay once both done: "✓ Both approvals complete"

### Data Table Component Standards
- Header row: bg neutral-100, label-md (600 weight), neutral-700, 44px height
- Data row: bg white, body-md, neutral-900, 48px height
- Hover row: bg neutral-50
- Selected row: bg brand-light, left border 3px brand-primary
- Zebra striping: Optional (use only for very data-dense tables)
- Empty state: Centered illustration + message + optional CTA
- Loading state: Skeleton rows (animated pulse)
- Sorting: Caret icons in header (▲▼), active column header text = brand-primary

### Confirmation Modal
- Width: 480px, radius-lg, shadow-md
- Icon (top center): 48px, color matches action type
- Title: heading-md
- Body: body-md, neutral-700
- Footer: Right-aligned [Cancel (secondary)] [Confirm (primary or error color)]
- Destructive actions (Reject, Invoke SH-4): Confirm button = error-500, requires typing "CONFIRM" in input

---

## 10. DATA VISUALIZATION GUIDELINES

### Chart Library: Use Recharts or Chart.js style approach in Figma

**Portfolio Donut Chart:**
- 3 segments: Performing (success-500) | At Risk DPD (warning-500) | Default (error-500)
- Center: Total portfolio ₹ amount
- Legend: below, horizontal

**DPD Aging Bar Chart:**
- Grouped bars per quarter
- Color: 1-2yr (warning-500) | 2-3yr (orange) | 3yr+ (error-500)
- Y-axis: ₹ amount or count toggle
- Tooltips with exact values

**Monthly Disbursement vs Repayment Line Chart:**
- Two lines: Disbursement (brand-primary) | Repayment (brand-accent)
- Area fill below lines (10% opacity)
- Grid lines: neutral-200

**Application Pipeline Funnel:**
- Horizontal funnel from Received → Disbursed
- Width proportional to count
- Conversion rate shown between stages as %

### Chart Containers
- White card bg, shadow-sm, radius-xl
- Chart title: heading-sm, left-aligned, 16px top padding
- Legend: inline with color swatches
- "Export" icon button: top-right of each chart

---

## 11. FORM DESIGN STANDARDS

### Input Field States
- **Default:** border-1 neutral-300, bg white, placeholder neutral-400
- **Focus:** border-2 brand-primary, ring-2 brand-light (4px spread, 2px blur)
- **Filled:** border-1 neutral-400, bg white
- **Error:** border-2 error-500, bg error-100/20%, error message below (body-sm, error-500)
- **Disabled:** border neutral-200, bg neutral-100, text neutral-400, cursor not-allowed
- **Read-only:** bg neutral-50, text neutral-700, lock icon (16px) at right

### Input Heights
- Default input: 40px
- Textarea: min 96px, resizable
- Select/Dropdown: 40px

### Form Labels
- Position: Above input, label-md, neutral-700
- Required indicator: asterisk (*) in error-500, inline after label
- Help tooltip: ⓘ icon (16px, neutral-400), hover reveals explanation

### Multi-Step Form Progress
- Top: Step indicator bar (node + line pattern, 48px height)
- Current step: brand-primary fill node, larger (20px)
- Completed: brand-primary fill with checkmark
- Future: neutral-300 ring
- Step names: body-sm below each node
- Progress line: fills brand-primary left-to-right as steps complete

---

## 12. STATUS & WORKFLOW LOGIC

### Loan Stage Transitions (Design must enforce these states)
```
[Received] → [Under Assessment: TAT 2 days]
           → [Incomplete: returned with rejection note]
[Under Assessment] → [Submitted to Sanction Committee]
[Submitted to SC] → [Sanctioned / Rejected]
                  → [Returned for Clarification]
[Sanctioned] → [Documentation in Progress]
[Documentation] → [Ready for Disbursement: all 15 docs + 4 signatures]
[Ready for Disbursement] → [Disbursed: same day]
[Disbursed] → [Active: monitoring begins]
[Active] → [Closed: full repayment + NOC issued]
         → [Defaulted: after grace + extension exhausted]
```

### Stage Gate Rules (enforce in UI as disabled states):
- "Submit to Sanction" button: disabled unless all 5 eligibility criteria checked in Appraisal Note
- "Submit Complete File to SC" button: disabled unless all 15 documents checked + CS sign-off
- "Initiate Payment" button: disabled unless all 4 signatures on checklist
- "Authorize Payment": disabled unless SM-Finance has initiated
- "Issue NOC": disabled unless loan balance = ₹0 and all dues settled

---

## 13. NOTIFICATION ARCHITECTURE

### Trigger → Recipient → Channel Mapping

| Event | Recipients | Channel |
|-------|-----------|---------|
| New application submitted | Credit Manager | In-app + Email |
| Appraisal submitted to SC | CFO + Directors | In-app + Email |
| Loan approved by SC | CS, Credit Manager, Farmer | In-app + Email + SMS |
| Loan rejected | Farmer, Credit Manager | In-app + Email + SMS |
| Documents ready for disbursement | SM-Finance | In-app + Email |
| Disbursement complete | Farmer, Credit Manager | In-app + SMS |
| Interest invoice generated | Farmer | In-app + Email + SMS |
| DPD 365 days reached | Credit Manager, CFO | In-app + Email |
| Re-KYC due in 30 days | Credit Manager + Member | In-app + SMS |
| Grace period expiring (7 days) | Credit Manager, CFO | In-app + Email |
| Loan fully repaid | CS, Credit Manager, Farmer | In-app + Email |

### Notification Bell Badge
- Red circular badge, white count number, 16px circle
- Count = unread notifications
- Badge disappears when all read

### In-App Toast Notifications
- Success: success-500 left border, 4px, white bg, shadow-sm, slide-in from top-right
- Error: error-500 left border
- Warning: warning-500 left border
- Info: info-500 left border
- Auto-dismiss: 4 seconds (errors: stay until dismissed)

---

## 14. RESPONSIVE BEHAVIOR

### Breakpoint Strategy
| Breakpoint | Width     | Layout Behavior |
|------------|-----------|-----------------|
| Desktop XL | 1440px+   | Full layout, expanded sidebar |
| Desktop    | 1280px    | Full layout, collapsible sidebar |
| Laptop     | 1024px    | Sidebar auto-collapsed to 64px |
| Tablet     | 768px     | Bottom tab nav replaces sidebar |
| Mobile     | 375px     | Single-column, drawer nav, simplified tables |

**Note:** Primary design in Figma must be at 1440px. Create responsive variants at 1280, 768, and 375px for key flows (Dashboard, Application Form, Approval Screen, Disbursement).

### Mobile-Specific Adaptations
- Farmer portal: Full mobile-first treatment (farmers likely on smartphones)
- Admin/Internal roles: Tablet + desktop only (office use)
- Tables on mobile: Convert to card-per-row layout with key fields shown
- Multi-step forms: One step per screen on mobile
- Approval action: Large touch targets (min 48px height) on tablet/mobile

---

## 15. ACCESSIBILITY & LOCALIZATION

### Accessibility Standards (WCAG 2.1 AA)
- Color contrast: Minimum 4.5:1 for body text, 3:1 for large text
- Focus states: Visible ring on all interactive elements (3px brand-primary ring)
- Screen reader: All icons must have aria-labels; all form fields labeled
- Error states: Never rely on color alone — always include text + icon
- Keyboard navigation: Tab order must follow logical reading order

### Localization
- Language toggle: [EN] [मराठी] [हिंदी] — persists across sessions
- Marathi/Hindi: Same layouts, font stack adds Noto Sans Devanagari
- Numbers/currency: Locale-aware (₹1,42,500 in Indian numbering system)
- Dates: DD/MM/YYYY format throughout (Indian convention)
- Right-to-left: Not required

---

## 16. FIGMA FILE STRUCTURE INSTRUCTIONS

### Page Organization
```
📄 0. Cover Page (project name, version, date, team)
📄 1. Design System
   → Colors | Typography | Spacing | Icons | Grid
📄 2. Components Library
   → Atoms (buttons, inputs, badges, icons)
   → Molecules (cards, tables, forms, modals)
   → Organisms (header, sidebar, dashboard sections)
📄 3. Auth Flows
📄 4. Borrower Portal
📄 5. Credit Assessment Team
📄 6. Company Secretary / Compliance
📄 7. Sanction Committee
📄 8. Treasury / Finance Team
📄 9. Admin
📄 10. Shared Components & Flows
📄 11. Mobile Responsive (key screens)
📄 12. Prototype Flows (link all screens)
```

### Frame Naming Convention
```
[Role]-[ScreenCode]-[ScreenName]-[State]
Examples:
FAR-F1-Dashboard-Default
FAR-F2-LoanApplication-Step2-Filled
CS-3-DocumentWorkspace-SH4Tab-DMATActive
SC-2-ApprovalScreen-SpecialCase
T-2-Disbursement-Step4-AuthPending
```

### Component Naming
- Follow Atomic Design: Atom/Button/Primary/Default, Atom/Badge/Status/Approved
- Variants: Use Figma Variants for all state permutations
- Auto-layout: Apply to all components; no manual spacing
- Styles: All colors, typography, and effects as Figma Styles (not hard-coded)

### Prototype Flows to Build
1. Complete borrower journey: Login → Apply → Track → View Approval → Repay
2. Credit Manager: Receive app → Appraisal → Submit to SC
3. CS: Document prep → Checklist sign-off → Submit for disbursement
4. CFO: Approve loan with 7-point checklist
5. Finance: Initiate + Authorize disbursement → Confirm SAP
6. Default handling: Missed payment → Grace period → Extension → SH-4 invoke

---

## 17. ANNOTATION STANDARDS

### When to Annotate in Figma
Use sticky note annotations for:
- Business rule explanations (e.g., "TAT breach: warn if application in this stage >2 days per SOP")
- Conditional logic (e.g., "This tab appears only if share type = Physical, from member registry")
- API/integration notes (e.g., "Fetch share valuation from company AGM records API")
- Accessibility notes (e.g., "Focus trap required in this modal")
- Edge cases (e.g., "If borrower = Director, display gold warning banner before proceeding to approval")

### Annotation Color Codes
- 🟡 Yellow sticky: Business rule / SOP reference
- 🔵 Blue sticky: Technical / API note
- 🟠 Orange sticky: Edge case / exception
- 🟣 Purple sticky: Accessibility note
- 🔴 Red sticky: Critical — must not miss

---

## APPENDIX: KEY NUMBERS & RULES FOR DESIGNER REFERENCE

| Parameter | Value | Note |
|-----------|-------|------|
| Loan application reference format | LO00000001 | Sequential, never reused |
| Credit Assessment TAT | 2 working days | SOP Stage 2 — show warning indicator if breached |
| Approval TAT | Same day | SOP Stage 3 |
| Disbursement TAT | Same day after docs | SOP Stage 5 |
| Max loan limit (shares) | Shares × (30% × NAV/share) | Current: ₹200/share |
| Max loan limit (land) | Land (acres) × ₹20,000 | Capped per FY |
| Eligible amount | Lower of above two | Hard rule — enforce in calculator |
| Approval authority (≤₹5L) | CFO + 1 Director | Maker-checker |
| Approval authority (>₹5L) | CFO + 2 Directors | Joint approval |
| Loan tenure definition | ≤1 year = Short-term | >1 year = Long-term |
| Grace period on default | 3 months from due date | Then assess intentionality |
| Extension (non-intentional) | +1 year | Documented in extension note |
| DPD bucket 1 | 1–2 years | Warning color |
| DPD bucket 2 | 2–3 years | Orange color |
| DPD bucket 3 | 3+ years | Red color, non-recoverable |
| KYC refresh cycle | Every 2 years | Show re-KYC due date |
| Record retention | 8 years post-closure | Archive trigger on NOC issue |
| Stamp paper value | ₹500 | PoA + Loan Agreement |
| Witness requirement | Must be SFPCL shareholder | Validate folio number |
| Partial repayment order | Principal first, then interest | Hardcoded rule |
| Interest capitalization | If unpaid by 30 April | Adds to principal for next FY |
| Legal basis | Section 378ZK, Companies Act 2013 | 3 months to 7 years loans |

---

*End of Figma Design Brief — SFPCL Loan Management Platform*
*Document Reference: SOP_SFPCL_LOANDISBURSEMENT × WhatsLoan Platform v1.0*
*Total Screens to Design: ~65 unique screens across 6 roles + responsive variants*
