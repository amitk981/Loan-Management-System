# SFPCL WhatsLoan — Farmer Role: Deep-Dive Figma Design Prompt
### Niche Illustration Guide for Borrower Portal (FAR screens)
**Scope:** Farmer / Borrower role only · Web (1440px desktop-first) + Mobile (375px)
**Reference SOP:** SOP_SFPCL_LOANDISBURSEMENT v1.0 · WhatsLoan Platform v1.0
**Last updated:** June 2026

---

## HOW TO USE THIS DOCUMENT

This prompt is a pixel-level specification for every Farmer-facing screen. It goes beyond the
top-level brief to describe exact component states, edge cases, real data examples,
micro-interaction behaviors, and annotation flags that Figma designers must capture.

Design these screens assuming the user is **Ramesh Patil, 42, grape farmer from Dindori
taluka, Nashik district, Maharashtra.** He owns 250 shares (Folio SH-04821), holds 3.5 acres
of cultivable land, and is applying for his second loan after successfully repaying his first
₹50,000 loan in 2023. His digital literacy is moderate — he uses WhatsApp daily but has
never used a web-based financial portal. **Design every label, tooltip, and empty state with
him in mind.**

---

## SECTION 1 — SHELL & NAVIGATION (FARMER VARIANT)

### 1.1 Top Header — Farmer-Specific Treatment

The global 56px header (bg: `#1A3C2A`) carries these farmer-specific customizations:

**Left cluster:**
- Hamburger icon (24×24px, Phosphor `List` icon, white)
- 8px gap
- WhatsLoan wordmark (white, 100px wide) — primary product brand
- 16px separator line (white/20%)
- Sahyadri Farms oval logo (white, 28px height) — institutional trust mark

**Center — Breadcrumb:**
- Home › My Loans › LO00000047
- Font: `body-sm` (12px, Inter), white/60% for inactive crumbs, white/100% for current
- "›" separator: white/40%
- Breadcrumb is contextually generated; on Dashboard it shows only "Dashboard"

**Right cluster (left to right):**
1. **Language toggle** — 3 pill chips: [EN] [मर] [हि]
   - Selected: bg white/20%, text white, radius-full
   - Unselected: text white/50%, no bg
   - Chip size: 28×22px, 4px radius, `label-sm`
2. **Help icon** — Phosphor `Question` outline, 20px, white/70%
   - Hover: white/100%
   - Click: opens contextual help drawer (460px right panel) with SOP-plain-language guide
3. **Notification bell** — Phosphor `Bell` outline, 20px, white/80%
   - Red badge (16px circle, white count `label-sm`): appears when unread count > 0
   - Badge max display: "9+" if count > 9
4. **Avatar + name** — 32px circle (initials "RP", bg `#1E88E5`/40%, white initials)
   - 8px gap
   - "Ramesh Patil" (`label-md`, white, 13px) — truncate at 14 chars
   - "Borrower" role badge (8px chip, `brand-accent` bg, white label, 6px radius)
   - Chevron-down (12px)
   - **Dropdown menu (240px, shadow-md, radius-md):**
     - Avatar + name + folio number (header row, non-clickable)
     - Divider
     - [My Profile] [KYC Status] [Change Password] [Language Settings]
     - Divider
     - [Logout] (error-500 text)

---

### 1.2 Sidebar — Farmer Role (240px expanded / 64px collapsed)

Background: `#1A3C2A` (brand-primary)
Width transition: 240ms ease-in-out

**Logo Area (48px height, 16px padding):**
- Collapsed: WhatsLoan "W" chevron icon (white, 24px)
- Expanded: Full WhatsLoan wordmark (white, 88px)

**Navigation Items (48px height each, 16px horizontal padding):**

```
Active state:
  bg: #2D7A4F (brand-secondary)
  left border: 3px solid #1E88E5 (brand-accent)
  icon: filled variant (Phosphor)
  text: white, body-md 500 weight

Hover state:
  bg: rgba(255,255,255,0.08)
  transition: 150ms ease

Default state:
  bg: transparent
  icon: outline variant
  text: rgba(255,255,255,0.75), body-md 400 weight
```

**Nav Items (in order):**

| Icon (Phosphor) | Label | Screen Code | Sub-items |
|-----------------|-------|-------------|-----------|
| `House` | My Dashboard | FAR-F1 | — |
| `PlusCircle` | Apply for Loan | FAR-F2 | — |
| `CurrencyInr` | My Loans | — | ↳ Active Loan (FAR-F3) ↳ Loan History (FAR-F8) |
| `FileText` | My Documents | FAR-F5 | — |
| `ArrowFatLineUp` | Make Payment | FAR-F4 | — |
| `HeadCircuit` | Support & Grievance | FAR-F6 | — |

**Sub-items appearance:**
- Indented 32px from left
- 40px height (compact)
- `body-sm` 12px, white/65%
- No left accent border; hover: white/8% bg
- Active sub-item: white/100% text, white/15% bg

**Bottom section (pinned to sidebar bottom, 16px padding):**
- Divider: white/15%
- Member card (64px height):
  - 36px avatar (initials "RP", `brand-accent`)
  - Expanded: "Ramesh Patil" (`body-sm` white) | "Folio: SH-04821" (`body-sm`, white/50%) | `mono-sm`
  - Collapsed: avatar only
- Logout button (48px, full width):
  - Icon: `SignOut` outline (20px, white/60%)
  - Text (expanded only): "Logout" (`body-md`, white/60%)
  - Hover: text/icon turn error-500

**🟡 Annotation: Sidebar collapsed state (64px) must still show icon-only navigation with tooltips on hover. Tooltip: 200ms delay, 160px max-width, bg neutral-900, white text, body-sm.**

---

## SECTION 2 — FAR-F1: FARMER DASHBOARD

### 2.1 Page Header Band (48px, bg white, border-bottom: 1px neutral-200)

```
Left:
  "Good morning, Ramesh 👋"          display-lg (24px, 700)   neutral-900
  "Member since 2019 · Folio SH-04821"  body-sm (12px)         neutral-400
  Vertical separator: 8px above/below, 16px gap between text lines

Right:
  [+ Apply for Loan]   Primary button   bg: brand-primary   radius-md
                       Phosphor Plus icon (16px) left of text
                       Disabled state: bg neutral-200, text neutral-400
                       (disabled only if active loan exists and policy disallows concurrent loans)
```

**Time-based greeting rule:**
- 5:00–11:59: "Good morning"
- 12:00–16:59: "Good afternoon"
- 17:00–20:59: "Good evening"
- 21:00–4:59: "Hello"
**🟠 Edge case: If user's first login ever, greeting is "Welcome to WhatsLoan, Ramesh 🌱" with a brief explainer tooltip on the main CTA.**

---

### 2.2 Hero Loan Card (Full-Width, 140px min-height)

**State A — Active Loan (most common state for repeat user):**

```
Container:
  bg: linear-gradient(135deg, #1A3C2A 0%, #2D7A4F 100%)
  radius-xl (16px)
  padding: 24px
  shadow-md

Layout: 3-column flex, vertically centered

LEFT COLUMN (flex-basis: 30%):
  "Active Loan"           label-sm (11px, 500)    rgba(255,255,255,0.60)
  "LO00000047"            mono-md (14px, 400)     rgba(255,255,255,0.85)
  "Disbursed: 15 Jan 2025"  body-sm               rgba(255,255,255,0.55)
  "Short-term · 12 months"  label-sm chip         rgba(255,255,255,0.20) bg
                                                  rgba(255,255,255,0.70) text
                                                  radius-full, 4px 8px padding

CENTER COLUMN (flex-basis: 40%, text-align: center):
  "Outstanding Balance"   label-sm                rgba(255,255,255,0.60)
  "₹1,42,500"             display-xl (32px, 700)  white
  "of ₹2,00,000 sanctioned" body-sm               rgba(255,255,255,0.55)
  
  Progress bar (full width, 6px height, radius-full):
    Track: rgba(255,255,255,0.20)
    Fill: rgba(255,255,255,0.85)
    Fill width: (repaid / sanctioned) × 100% = 28.75% filled
    "₹57,500 repaid" label below (body-sm, white/55%)

RIGHT COLUMN (flex-basis: 30%, text-align: right):
  Due date pill:
    bg: #F59E0B (warning-500)
    text: white, label-sm
    "Due: 30 Jun 2025"
    Phosphor Clock icon (12px) left
    radius-full, 6px 12px padding
  
  16px gap
  
  [Pay Now] ghost button:
    border: 1.5px solid rgba(255,255,255,0.50)
    text: white, body-md 500
    bg: rgba(255,255,255,0.08)
    radius-md
    hover: bg rgba(255,255,255,0.18)
    Phosphor ArrowRight icon (16px) right
    width: 120px
```

**State B — Overdue Loan:**
- Replace warning pill with: bg `#EF4444` (error-500), text "OVERDUE · 47 days", Phosphor Warning icon
- Hero gradient shifts: `#3D1A1A` → `#7B2020` (deep red tones)
- Pay Now button becomes: bg error-500, white text, "Pay Now — Overdue" (urgent)
- **🔴 Annotation: Show red pulsing ring (4px, error-500, 1.5s loop) on overdue badge to draw attention.**

**State C — No Active Loan (Empty State):**
```
bg: brand-light (#E8F5E9)
border: 1.5px dashed #2D7A4F
radius-xl
padding: 32px
text-align: center

  Phosphor Plant icon (48px, brand-secondary)
  "No active loan"    heading-md    neutral-700
  "Apply for a loan to get started. Your eligibility is already calculated."
                      body-md       neutral-400    max-width: 360px  margin: auto
  
  [Apply for First Loan →]   brand-primary button   margin-top: 16px
```

**State D — Loan under Processing (Post-application, Pre-disbursement):**
- Gradient same as active but muted: `#1A3C2A` → `#1C4A36`
- Center: "Application Under Review" (heading-sm, white)
  - "LO00000052" (mono-md)
  - Animated 3-dot pulse indicator (brand-accent color, 8px dots)
- Right: Stage badge "Stage 2 of 6 — Credit Assessment" (info-100 bg, info-500 text, `label-sm`)

---

### 2.3 Stat Cards Row (4-column, 1/4 grid, 16px gaps)

**Card structure (all 4 cards):**
```
bg: white
radius-xl (16px)
padding: 20px
border: 1px solid neutral-200
shadow-sm

  Icon container: 40×40px, radius-md, brand-light bg
    Phosphor icon: 20px, brand-secondary
  
  12px gap below icon
  
  Value: heading-md (20px, 600) neutral-900
  Label: body-sm (12px) neutral-400
  
  Optional sub-line: body-sm neutral-400
  Optional progress/change indicator
```

**Card 1 — Shares Held**
- Icon: `Certificate` (Phosphor)
- Value: `250` (heading-md)
- Label: "Shares Held"
- Sub: "Folio SH-04821 · Physical"
- Bottom: "₹50,000 estimated value" (body-sm, success-500)
- **🟡 Annotation: "Estimated value = Shares × NAV. Pulled from latest AGM API. If valuation stale (>12 months since AGM), show amber dot."**

**Card 2 — Max Loan Eligibility**
- Icon: `Coins` (Phosphor)
- Value: `₹15,000` (heading-md, success-500)
- Label: "Max Eligible Loan"
- Sub: "Based on 250 shares × ₹200"
- Bottom row: tiny info chip "Shares-based limit applies" (brand-accent bg/10%, brand-accent text)
- Tap/hover tooltip: "You're eligible for the lower of: Shareholding limit (₹15,000) or Land limit (₹70,000). Shareholding limit applies here."
- **🟡 Annotation: This number must update dynamically when new AGM valuation is published. Show "Updated Apr 2025" sub-label in neutral-400.**

**Card 3 — Total Repaid**
- Icon: `ArrowFatLineUp` (Phosphor, success-500)
- Value: `₹57,500` (heading-md, success-500)
- Label: "Total Repaid"
- Progress bar (6px, radius-full): 28.75% filled (success-500 fill, neutral-200 track)
- Sub: "₹1,42,500 outstanding"

**Card 4 — Loan Standing**
- Icon: `ShieldCheck` (Phosphor, success-500)
- Value: "Good Standing" (heading-sm, 16px, success-500)
- Label: "Credit Status"
- Sub: "No defaults on record"
- Status dot (10px circle, success-500) left of "Good Standing"
- **States:**
  - Good: success-500 dot, "Good Standing"
  - Grace period active: warning-500 dot, "Grace Period Active"
  - Overdue: error-500 dot, "Payment Overdue · 47 days"
  - Default: error-500 dot (pulsing), "Account in Default"

---

### 2.4 Loan Journey Tracker (Full-Width Card)

```
Card:
  bg: white
  radius-xl
  padding: 24px
  border: 1px neutral-200

Header row:
  "My Loan Journey"   heading-sm   neutral-900   left
  "LO00000047"        mono-sm      neutral-400   right (with copy icon)
```

**6-Node Horizontal Progress Bar:**

Node width: distribute evenly across full width minus 48px padding.
Connecting line between nodes: 2px, neutral-200 (incomplete) or brand-secondary (complete).

Each node:
```
Circle: 32×32px
  - Completed: bg brand-secondary, Phosphor CheckCircle fill icon (16px, white)
  - Current: bg white, border 2.5px brand-accent, brand-accent pulsing ring
             animation: pulse 1.5s ease-in-out infinite (opacity 0.4 → 0)
  - Future: bg neutral-100, border 2px neutral-200, neutral-400 inner dot (8px)

Below circle (centered):
  Stage name: body-sm (12px, 500), neutral-700 (completed/current) / neutral-400 (future)
  Date: body-sm (11px), neutral-400 — shown only for completed stages
  Expected: "Est. 2 days" label in info-100 pill for current stage
```

**Stage definitions (matching SOP exactly):**

| # | Stage Name | Icon | Example Date |
|---|-----------|------|-------------|
| 1 | Application Submitted | `ClipboardText` | 10 Jan 2025 |
| 2 | Credit Assessment | `MagnifyingGlass` | 12 Jan 2025 |
| 3 | Sanctioned | `Stamp` | 13 Jan 2025 |
| 4 | Documentation | `FolderOpen` | 14 Jan 2025 |
| 5 | Disbursed | `BankNote` | 15 Jan 2025 |
| 6 | Closed / Active | `CheckCircle` | Active |

**For Ramesh's example (current = Stage 5 Disbursed, Stage 6 Active):**
Stages 1–5: completed (brand-secondary circles, green connecting lines)
Stage 6: Current — pulsing ring, "Active since 15 Jan 2025"
No future stages (this is the final active state)

**Hover on any completed node:**
Tooltip (shadow-md, 200px wide, radius-md):
- Stage name (label-md, bold)
- "Completed on [date]"
- "By: [Role name]" (e.g., "By: Credit Officer")
- Optional: approval reference / note

**🟡 Annotation: If loan is in default or grace period, inject a 7th node "Recovery" between Stage 6 and end, with error-500 styling. This node only appears programmatically when DPD > 365 days.**

---

### 2.5 Two-Column Content Row (60 / 40 split)

#### Left Column (60%) — Recent Transactions

```
Card:
  bg: white  radius-xl  padding: 20px  border: 1px neutral-200

Header:
  "Recent Transactions"  heading-sm  neutral-900
  "View All →"           body-sm link  brand-accent (right-aligned)

Table (no outer border, inner row dividers only):
  Row height: 52px
  Columns:
    Date        body-sm mono  neutral-400   80px
    Type        label-sm chip              140px
    Amount      mono-md                    100px right-aligned
    Mode        body-sm       neutral-400   80px
    Status      label-sm pill              80px

  Max 5 rows shown; 6th+ row fades out
```

**Type chips (label-sm, radius-full, 4px 10px padding):**
- "Disbursement" → bg info-100, text info-500
- "Principal Repayment" → bg success-100, text success-500
- "Interest Payment" → bg warning-100, text warning-500
- "Penalty" → bg error-100, text error-500
- "Interest Capitalized" → bg `#FEF3C7` (warning-100), text `#92400E`

**Amount display:**
- Disbursements: `+₹2,00,000` in success-500
- Repayments made: `-₹57,500` in neutral-700
- Penalties: `-₹2,100` in error-500

**Sample rows for Ramesh:**
```
15 Jan 2025   Disbursement         +₹2,00,000   NEFT       Credited
31 Mar 2025   Principal Repayment  -₹20,000     RTGS       Confirmed
30 Apr 2025   Interest Payment     -₹18,000     Subsidiary  Confirmed
31 May 2025   Principal Repayment  -₹17,500     RTGS       Confirmed
30 Jun 2025   Principal Repayment  -₹2,000      RTGS       Pending
```

---

#### Right Column (40%) — My Documents Quick Panel

```
Card:
  bg: white  radius-xl  padding: 20px  border: 1px neutral-200

Header:
  "My Documents"  heading-sm  neutral-900
  "View All →"    body-sm link  brand-accent

Document list (vertical, 6 items max):
  Row height: 44px
  
  [ FileIcon (20px) ]  [ Doc Name (body-md, neutral-700) ]  [ Status ]  [ ↓ ]
  
  Doc name truncates at 18 chars with tooltip for full name
```

**Document Status Badges (label-sm, radius-full):**
- "Available" → success-100, success-500 text
- "Awaiting Signature" → warning-100, warning-500 text
- "Processing" → info-100, info-500 text
- "Not Generated" → neutral-200, neutral-400 text

**Download button (↓):**
- Phosphor `DownloadSimple` icon, 16px, neutral-400
- Hover: brand-secondary
- Disabled (not generated): neutral-200

**Documents listed (Ramesh's case):**
| Icon | Document | Status |
|------|----------|--------|
| `FilePdf` | Loan Agreement | Available |
| `FilePdf` | Term Sheet | Available |
| `FileDoc` | Disbursement Advice | Available |
| `FilePdf` | KYC Acknowledgement | Available |
| `FileDoc` | NOC | Not Generated |
| `FilePdf` | Interest Invoice FY25-26 | Available |

**🟡 Annotation: NOC row is greyed out and non-downloadable until Compliance Team marks loan as fully repaid and issues NOC (triggers FAR-F7 screen).**

---

### 2.6 Notifications Feed (Full-Width Card)

```
Card:
  bg: white  radius-xl  padding: 20px  border: 1px neutral-200

Header:
  "Recent Alerts"     heading-sm  neutral-900
  Notification count badge: "3 unread" (brand-accent bg/10%, brand-accent text, label-sm)
  "Mark all read" text link (right-aligned, neutral-400, body-sm)

List items (vertical, max 4 shown):
  Row height: auto (min 56px)
  Left: Notification type icon in 32×32 colored circle
  Right: message + timestamp
```

**Notification types:**
```
Interest Invoice:    bg info-100     icon: FileInvoice (info-500)
Payment Reminder:    bg warning-100  icon: Bell (warning-500)
Loan Approved:       bg success-100  icon: CheckCircle (success-500)
Document Ready:      bg success-100  icon: FileText (success-500)
Overdue Warning:     bg error-100    icon: Warning (error-500)
Re-KYC Due:          bg warning-100  icon: IdentificationCard (warning-500)
Interest Rate Change: bg info-100    icon: Percent (info-500)
```

**Sample notifications (Ramesh's case):**
1. 🟢 (success) "Your interest invoice for FY 2025-26 is ready — ₹18,000" · 2 days ago
2. 🟡 (warning) "Repayment reminder: ₹19,500 due on 30 Jun 2025" · 5 days ago
3. 🔵 (info) "Interest rate revised to 12% p.a. effective 1 Apr 2025" · 12 days ago
4. 🟢 (success) "Loan LO00000047 disbursed successfully — ₹2,00,000" · 5 months ago (dimmed, read)

**Unread notifications: bold title text, neutral-900 (vs read: neutral-400)**

---

## SECTION 3 — FAR-F2: LOAN APPLICATION WIZARD

### 3.1 Wizard Shell

```
Page layout:
  Max-width centered container: 760px
  Left side panel (200px): Step navigator (desktop only)
  Right: Active step form card (white, radius-xl, padding: 32px, shadow-sm)

Step indicator (top horizontal bar on mobile, left sidebar on desktop):
  5 steps: Basic Details | Shareholding | Land & Crop | KYC Upload | Review & Submit

Desktop left panel:
  Title: "New Loan Application"  heading-sm  neutral-900
  Sub: "Application LO-Draft-04"  mono-sm    neutral-400
  Divider
  
  Steps list (vertical):
    Completed: Phosphor CheckCircle fill (success-500) + green text (body-md 500)
    Current:   Filled circle with step number (brand-primary bg, white number) + brand-primary text (600)
    Future:    Empty circle (neutral-200 border) + neutral-400 text (400)
    
    Connector line between steps: 32px height, 1px, neutral-200 (future) / success-500 (past)
```

---

### 3.2 Step 1 — Basic Details

**Header inside form card:**
```
"Step 1 of 5"     label-sm   neutral-400
"Tell us about yourself"   display-lg  neutral-900   margin-bottom: 4px
"Pre-filled fields are pulled from your member profile"  body-md  neutral-400
```

**Form layout: 2-column grid (gap: 16px), collapsing to 1-column on mobile**

**Field specifications:**

```
Label style: label-md (13px, 500, neutral-700)
Required asterisk: error-500, same size
Input height: 44px
Radius: radius-md (8px)
Border: 1.5px solid neutral-200
Focus: 2px brand-primary ring (box-shadow: 0 0 0 3px rgba(26,60,42,0.15))
Error: border error-500, error message below (12px, error-500, Phosphor Warning icon)
Read-only: bg neutral-100, neutral-400 text, lock icon inside right edge
Placeholder: neutral-400
```

**Fields (in order, 2-col layout where noted):**

Row 1 (2-col):
- **Full Name** — read-only, pre-filled "Ramesh Vilas Patil", lock icon, tooltip: "Name from member registry. Contact SFPCL to update."
- **Date of Birth** — date picker, DD/MM/YYYY, max: today - 18 years, Phosphor CalendarBlank icon right

Row 2 (2-col):
- **Gender** — radio group (horizontal chips): [Male ●] [Female] [Other], 44px height chips
- **Mobile Number** — read-only, "+91 98765 43210", lock icon

Row 3 (2-col):
- **Alternate Mobile** — optional, phone number format, +91 prefix
- **Email Address** — optional, type="email", placeholder "For disbursement advice"

Row 4 (full-width):
- **Current Address** — textarea (3 rows), 44px min-height, character count (150 max) at bottom-right

Row 5 (2-col, then 2-col below):
- **Village** — text input
- **Taluka** — dropdown (Maharashtra talukas, searchable)
- **District** — auto-filled from taluka (read-only after taluka selected), Nashik
- **State** — auto-filled "Maharashtra" (read-only)

Row 6 (2-col):
- **PIN Code** — 6-digit, validated, auto-fills district on valid entry

**Nominee Section (collapsible):**
```
Section header (collapsible toggle):
  Phosphor UserCircle icon (20px, brand-secondary)
  "Nominee Details"   heading-sm   neutral-900
  "(Required by SFPCL SOP)"   label-sm   neutral-400
  Phosphor CaretDown / CaretUp toggle (right)
  
When expanded:
  Info banner (info-100 bg, info-500 left border 3px, radius-md, body-sm):
    "ℹ️ Nominee must not be a minor. All nominee KYC is mandatory."

Fields (2-col grid):
  Nominee Full Name    |  Relationship to Applicant (dropdown)
  Age (number, min 18) |  Gender (radio chips)
  Aadhaar Number (12-digit, mono-md, masked after entry: XXXX XXXX 1234)
  PAN (10-char, uppercase, mono-md)
```

**Navigation footer (sticky bottom of form card):**
```
Left: Empty (Step 1 has no Back)
Right: [Next: Shareholding Details →]   primary button   brand-primary
       Disabled if required fields incomplete
       Tooltip on hover when disabled: "Please fill all required fields"
```

---

### 3.3 Step 2 — Shareholding & Loan Limit

**Header:**
```
"Step 2 of 5"
"Your Shareholding Details"
"Your loan eligibility is calculated from your share holdings and farm size."
```

**Shareholding Info Block (read-only, bg neutral-100, radius-md, padding: 16px):**
```
3-col grid:
  [Folio Number: SH-04821]  [Shares Held: 250]  [Share Type: Physical]
  
  Below: Current NAV per share:
    "₹2,000 per share"   heading-sm  neutral-900
    "Based on AGM 2024 (Audited)"  body-sm  neutral-400
    "10% loan rate = ₹200 per share"  label-sm  brand-secondary
```

**Loan Limit Calculator Panel (highlighted, bg: #E8F5E9, border: 1.5px solid #2D7A4F, radius-xl, padding: 24px):**

```
Title: "Calculate Your Loan Limit"   heading-sm  brand-primary

Two methods side by side (2-col, gap: 24px):

Method 1 Card (bg white, radius-md, padding: 16px, shadow-sm):
  "📊 Method 1: Shareholding"   label-sm  neutral-700  margin-bottom: 12px
  
  Formula visual (3 boxes connected by × and = symbols):
    [250 shares] × [₹200 / share] = [₹50,000]
    
    Box style: bg brand-light, radius-sm, padding: 8px 12px, border: 1px neutral-200
    Box labels below each:    "Shares Held"  "Loan Rate/Share"   "Method 1 Limit"
    Editable: Only Shares Held if user adds more shares (note: for display, all read-only here)
  
  Result: "₹50,000"   display-lg (24px)  success-500

Method 2 Card (bg white, radius-md, padding: 16px, shadow-sm):
  "🌾 Method 2: Agricultural Land"  label-sm  neutral-700
  
  Land input row:
    "Land under cultivation:"   label-md
    Number input (56px wide, 44px height)
    "acres"   body-md   neutral-400   right of input
    Stepper (+/-) arrows on input
  
  Formula:
    [3.5 acres] × [₹20,000/acre] = [₹70,000]
    (updates live as user types land area)
  
  Result: "₹70,000"   display-lg  success-500
  "Based on FY 2025-26 Scale of Finance"  body-sm  neutral-400

Divider (full width, neutral-200)

Final Result Banner (bg brand-primary, radius-lg, padding: 16px 24px):
  Left: "✅ Your Maximum Eligible Loan Amount"  label-md  white/80%
  Center: "₹50,000"   display-xl (32px, 700)   white
  Right: Arrow callout chip: "Method 1 applies (lower limit)"  label-sm
         bg rgba(255,255,255,0.20)  white text  radius-full
  
  Below: "Final amount subject to Credit Assessment Team review"  body-sm  white/60%
```

**Loan Request Section:**
```
"How much would you like to borrow?"   heading-sm  neutral-900

Loan Amount field:
  ₹ prefix (mono-md, neutral-700)
  Number input (full-width, 52px height)
  Right: "Max: ₹50,000" chip (neutral-100, neutral-700, radius-full)
  
  Validation: If typed amount > max:
    Border turns error-500
    Error message: "Amount exceeds your eligible limit of ₹50,000"
    Field auto-corrects to max on blur? No — let user edit
  
  If amount ≤ max: success-500 checkmark appears right of field

"Purpose of Loan" dropdown (full-width):
  Options:
    🌱 Crop Production & Farm Inputs (most common — shown first)
    🚜 Farm Equipment Purchase
    💧 Irrigation & Infrastructure
    🌾 Post-Harvest Activities
    📦 Other Agriculture Activity
  
  Each option has an emoji prefix and description below in smaller text

"Purpose Description" textarea (optional, 150 chars max):
  Placeholder: "Briefly describe how you plan to use this loan (optional)"
  Character count: live, bottom-right, neutral-400 → warning-500 at 130+
```

---

### 3.4 Step 3 — Land & Crop Details

**Header:**
```
"Step 3 of 5"
"Your Agricultural Profile"
"Upload your land records and tell us about your crops."
```

**Land Documents Upload Section:**

```
Section label: "Land & Financial Documents"   heading-sm

3 upload zones (stacked, full-width):

Upload zone anatomy:
  Border: 1.5px dashed neutral-300
  bg: neutral-100
  radius-md
  padding: 24px
  text-align: center
  
  Icon: Phosphor UploadSimple (32px, brand-secondary)
  Primary text: "[Document name]"   body-md 500  neutral-700
  Sub: "Drag & drop or click to browse"   body-sm  neutral-400
  Allowed types: "PDF or JPG · Max 5MB"   label-sm  neutral-400
  
  Hover state: bg brand-light, dashed border brand-secondary, cursor pointer
  
  File uploaded state:
    bg: success-100
    Border: success-500 solid 1.5px
    Replace upload icon with: file type icon (PDF: FilePdf, img: Image) 32px success-500
    File name (body-md, neutral-700, truncated with tooltip)
    File size (body-sm, neutral-400)
    Remove button: Phosphor X (16px, neutral-400, hover: error-500), right side

Upload zones:
  1. "7/12 Extract (Satbara)" — "Official land record from Maharashtra land records department"
  2. "Crop Plan" — "Your planned crops for this season"
  3. "Bank Statement (Last 6 months)" — "Most recent statement from your primary bank account"
```

**Land Details Table (dynamic rows):**

```
Table header row (bg neutral-50, 40px):
  Survey No. | Village | Area (acres) | Crop | Season | Actions

Data rows (min 1, max 10):
  Survey No.: text input (mono-md)
  Village:    text input
  Area:       decimal input + "acres" suffix (readonly unit)
  Crop:       dropdown (Grapes / Tomatoes / Citrus / Mangoes / Bananas / Sweetcorn / Cashews / Pomegranates / Other)
  Season:     dropdown (Kharif / Rabi / Zaid / Year-round)
  Actions:    Phosphor Trash icon (16px, neutral-400, hover: error-500)

"+ Add Another Land Parcel" button:
  variant: outline  brand-secondary
  icon: Plus (16px)  left
  full-width
  44px height

Total area summary below table:
  "Total area under cultivation: 3.5 acres"  body-md  neutral-700  bold
```

**Bank Account Details:**

```
Section header: "Bank Account for Disbursement"   heading-sm

Fields (2-col):
  Account Holder Name (read-only — same as applicant name)
  Bank Name (dropdown with search — all scheduled banks)
  Account Number (mono-md, 44px height, 12-18 digits)
  Confirm Account Number (separate field, cross-validates)
  IFSC Code (mono-md, uppercase, 11 chars, with bank lookup)
  Branch Name (auto-filled from IFSC, read-only with edit override)

IFSC lookup behavior:
  Type IFSC → "Verifying..." spinner → 
  Valid: branch name auto-fills, green "Bank Verified ✅" chip appears
  Invalid: error border + "Invalid IFSC code. Please check and retry."

Cancelled Cheque upload zone:
  Same anatomy as land document zones above
  Note banner: "ℹ️ Cancelled cheque must show your name, account number and IFSC clearly."
```

---

### 3.5 Step 4 — KYC Documents

**Header:**
```
"Step 4 of 5"
"Identity Verification"
"Upload clear, self-attested copies of your documents."
```

**KYC Progress Bar:**
```
"3 of 5 documents uploaded"   body-sm  neutral-400
Progress bar: 3/5 = 60%, brand-secondary fill, neutral-200 track, 6px height, radius-full
```

**Applicant KYC Section:**

```
Section label: "Your Documents"   heading-sm  neutral-900
Sub: "Sign the documents and write 'Self-attested' before uploading"   body-sm  warning-500
     (info banner: bg warning-100, left-border warning-500, radius-md)

Document upload grid (2-col):
  PAN Card:
    Upload zone (compact, 120px height)
    Below: "Self-attested copy required"  label-sm  neutral-400
    Below: "PAN: ABCDE1234F"  mono-sm  success-500  (if already in profile)
    
  Aadhaar Card:
    Upload zone (compact, 120px height)  
    Below: "Self-attested copy required"  label-sm
    Masking note: "Your Aadhaar number is stored securely"  label-sm  neutral-400
    
  Share Certificates:
    Upload zone
    Below: "Required for physical share holders"  label-sm  neutral-400
    Conditional: Hidden if share type = D-MAT (with note: "Not needed for D-MAT shares ✓")
  
  Passport Photo:
    Upload zone (square, 120×120px)
    Note: "JPG only · Max 500KB · White background preferred"
    Live preview: circular crop preview after upload
```

**Nominee KYC Section:**
```
Section label: "Nominee's Documents"   heading-sm  neutral-900
(Same structure as above but labeled for nominee)

Nominee name shown in header: "For: [Nominee Name]" (auto-filled from Step 1)
```

**Declarations Section:**

```
Section label: "Declarations & Consent"   heading-sm  neutral-900

Checkbox items (3, full-width, 52px min-height each):
  Layout: checkbox (20×20px, brand-primary when checked) + full text + info icon
  
  ☐ "I declare that I am not a wilful defaulter and have no outstanding loans with 
     other institutions that I have not disclosed."
     
  ☐ "I consent to SFPCL verifying my details with CKYC registry and credit bureaus."
     [View CKYC Terms]  link
     
  ☐ "The property / asset being financed is not already encumbered or pledged elsewhere."

CKYC Consent (mandatory, distinct styling):
  bg brand-light, border 1.5px brand-secondary, radius-md, padding: 16px
  Checkbox (20px, brand-primary)
  "I give consent for CKYC registration and data sharing as per RBI guidelines."
  [Read Full CKYC Terms]  text link  brand-accent
  
  ⚠️ Note below: "This consent is mandatory to proceed."  label-sm  neutral-400
```

---

### 3.6 Step 5 — Review & Submit

**Header:**
```
"Step 5 of 5"
"Review Your Application"
"Please check all details before submitting."
```

**Review Accordion Sections (5 panels, default all collapsed):**

```
Each accordion panel:
  Header: 48px, bg neutral-50, border-bottom neutral-200
    Left: Phosphor icon (20px, brand-secondary) + section name (heading-sm, neutral-900)
    Right: "Edit ✏️" text button (brand-accent) + Caret toggle
  
  Expanded body: white bg, padding: 20px, 2-col data grid

Panel 1: "Personal Details"
  Full Name | Date of Birth | Gender | Mobile | Address

Panel 2: "Nominee Details"
  Nominee Name | Age | Relationship | Aadhaar (masked) | PAN (masked)

Panel 3: "Shareholding & Loan Request"
  Folio Number | Shares Held | Method 1 Limit | Method 2 Limit | Eligible Limit
  Requested Amount: "₹50,000"  (prominent, heading-md, success-500)
  Purpose: "Crop Production"

Panel 4: "Land & Bank Details"
  Total land: 3.5 acres | Survey numbers | Bank: SBI Dindori Branch | IFSC

Panel 5: "Documents Uploaded"
  Checklist grid (2-col):
    ✅ PAN Card              ✅ Aadhaar Card
    ✅ Share Certificate     ✅ Passport Photo
    ✅ 7/12 Extract          ✅ Crop Plan
    ✅ Bank Statement        ✅ Cancelled Cheque
    ✅ Nominee PAN           ✅ Nominee Aadhaar
    
    ✅ = Phosphor CheckCircle (success-500)
    ✗  = Phosphor XCircle (error-500) → Clicking navigates to that step
```

**Loan Summary Card (prominent, full-width, bg brand-primary, white text, radius-xl, 100px height):**
```
3-column:
  Left:   "Loan Requested"   label-sm  white/60%
          "₹50,000"          display-lg (28px)  white

  Center: "Tenure"           label-sm  white/60%
          "Short-term (12 months)"  heading-sm  white
          "At current ₹200/share valuation"  body-sm  white/50%

  Right:  "Purpose"          label-sm  white/60%
          "Crop Production"  heading-sm  white
          "Grapes · 3.5 acres"  body-sm  white/50%
```

**Declaration Banner (full-width, bg neutral-100, border-left 3px brand-secondary, radius-md, padding: 16px):**
```
"By submitting, you authorize Sahyadri Farmers Producer Company Limited to verify your 
details, contact your nominees, and process your application as per the loan terms. 
Your shares will serve as security for this loan."
body-sm  neutral-700
```

**Submit Button (full-width, 52px height, bg brand-primary, white, heading-sm):**
```
"Submit Application →"
Disabled state: bg neutral-200, neutral-400 text
  Tooltip: "Please complete all required sections"

Loading state (post-click, 2–3 seconds):
  Button width collapses to 52×52px circle
  Spinner replaces text (white, 20px, 360°/0.8s)
  Background dims with overlay (rgba 0,0,0,0.4)
```

**Success Screen (replaces wizard content after loading):**
```
Container: centered, 480px max-width, text-align: center, padding: 48px

Animation: Lottie green checkmark (or CSS: scale 0→1, 400ms ease-out)
  bg circle: success-100 (80px circle)
  Check icon: success-500

"Application Submitted!" (display-xl, 32px, neutral-900)  margin-top: 24px
"We've received your loan application."  body-lg  neutral-400  margin-top: 8px

Reference box (bg brand-light, border 1.5px brand-secondary, radius-md, padding: 16px):
  "Your Application Reference Number"  label-sm  neutral-400
  "LO00000052"   mono-md (24px, 600)   brand-primary   margin: 8px auto
  [Copy]  icon button  Phosphor Copy  brand-secondary

Timeline expectation:
  "⏱ What happens next?"  heading-sm  neutral-900  margin-top: 24px
  
  Vertical steps (3 items):
    1. Phosphor MagnifyingGlass (success-500) · "Credit team reviews in 2 working days" · "Stage 2"
    2. Phosphor Stamp (neutral-400) · "Sanction Committee approves" · "Stage 3"
    3. Phosphor BankNote (neutral-400) · "Loan disbursed to your account" · "Stage 5"

Buttons (side by side):
  [View Application Status →]  primary  brand-primary
  [Back to Dashboard]          outline  brand-secondary  neutral text
```

---

## SECTION 4 — FAR-F3: LOAN STATUS DETAIL PAGE

### 4.1 Page Header & Tab Bar

```
Breadcrumb: My Loans › LO00000047
Page title: "Loan Details — LO00000047"   display-lg
Subtitle: "Active · Short-term · Disbursed 15 Jan 2025"  body-sm  neutral-400
Status badge: "Active"  bg success-100  text success-500  label-sm  radius-full

Tab bar (48px, bg white, border-bottom neutral-200):
  [Overview] [Documents] [Repayment] [Timeline]
  
  Active tab: brand-primary text, 2px brand-primary underline (bottom)
  Hover: brand-secondary text
  body-md 500 weight, 16px horizontal padding
```

---

### 4.2 Overview Tab

**Top: Loan Summary Card (full-width, bg white, border neutral-200, radius-xl, padding: 24px)**
```
5-column data grid:
  [Sanctioned Amount]  [Outstanding]  [Interest Rate]  [Tenure]  [Next Due]
  
  Each cell:
    Label: label-sm  neutral-400
    Value: heading-md (20px, 600)  neutral-900
    Sub (optional): body-sm  neutral-400

Values:
  Sanctioned Amount: "₹2,00,000"
  Outstanding: "₹1,42,500" (error-500 if overdue, else neutral-900)
  Interest Rate: "12% p.a." + tooltip "Floating rate · Updated Apr 2025"  Phosphor Info icon
  Tenure: "12 months" + "Short-term"  label chip
  Next Due: "30 Jun 2025" + "In 20 days"  body-sm  warning-500
```

**Journey Tracker (same as dashboard, but vertical layout on this page):**
```
Vertical orientation (left rail, 40px wide):
  Connected circles for each stage (same styling as dashboard, but vertical)
  Each stage: circle + stage name (right, heading-sm) + date below name (body-sm, neutral-400)
  
  For current / upcoming stages: "Expected within 2 days" tooltip on hover
  Height of each node: 64px  
  Connector: 1px line between circles (neutral-200 future, brand-secondary past)
```

**Quick Actions Row (3 cards):**
```
3 equal cards (shadow-sm, radius-md, padding: 16px each, bg white, border neutral-200):

  [Make Payment]          [Download Statement]       [View Agreement]
  Phosphor ArrowFatLine   Phosphor FilePdf           Phosphor FileText
  (brand-accent, 24px)    (brand-secondary, 24px)    (brand-secondary, 24px)
  "Make Payment"          "Download Statement"       "View Agreement"
  heading-sm neutral-900  heading-sm neutral-900     heading-sm neutral-900
  "Pay now via RTGS/NEFT" "PDF, last updated today"  "Loan Agreement PDF"
  body-sm neutral-400     body-sm neutral-400        body-sm neutral-400
```

---

### 4.3 Documents Tab

```
Grid: 3-col (gap: 16px), collapses to 2-col on tablet, 1-col on mobile

Document card anatomy:
  bg: white  radius-xl  border: 1px neutral-200  padding: 20px  shadow-sm

  Top: File type icon (40×40px, in colored circle, radius-md)
    PDF: FilePdf (error-100 bg, error-500 icon)
    Word/Doc: FileDoc (info-100 bg, info-500 icon)
    Image: Image (warning-100 bg, warning-500 icon)
  
  Name: body-md 500  neutral-900  margin-top: 12px  line-clamp: 2
  Date: "Generated 15 Jan 2025"  body-sm  neutral-400  margin-top: 4px
  Status badge: (same pills as earlier)
  
  Bottom: [↓ Download]  outline button  brand-secondary  full-width  36px height
          Disabled + tooltip for "Not Generated" status
```

**Documents to show (8 cards):**

| Doc Name | Type | Status | Date |
|----------|------|--------|------|
| Loan Application Form | PDF | Available | 10 Jan 2025 |
| KYC Bundle | PDF | Available | 10 Jan 2025 |
| Loan Appraisal Note | PDF | Available | 12 Jan 2025 |
| Term Sheet | PDF | Available | 13 Jan 2025 |
| Loan Agreement | PDF | Available | 14 Jan 2025 |
| Power of Attorney | PDF | Available | 14 Jan 2025 |
| Disbursement Advice | PDF | Available | 15 Jan 2025 |
| NOC | PDF | Not Generated | — |

**🟡 Annotation: Appraisal Note visible to farmer but redacted — show only: "Application reviewed and recommended for approval by Credit Officer on 12 Jan 2025". Detailed risk rating not shown to borrower.**

---

### 4.4 Repayment Tab

**Outstanding Amount Hero:**
```
Card (full-width, bg white, border neutral-200, radius-xl, padding: 24px):
  Left:
    "Outstanding Balance"  label-sm  neutral-400
    "₹1,42,500"  display-xl (32px)  neutral-900 (error-500 if overdue)
    Progress bar: Repaid / Sanctioned ratio
    "₹57,500 repaid of ₹2,00,000"  body-sm  neutral-400
    
  Right:
    "Next Payment Due"  label-sm  neutral-400
    "30 Jun 2025"  heading-md  warning-500
    "In 20 days"  body-sm  neutral-400
    [Pay Now]  button  brand-primary  120px wide
```

**Repayment Schedule Table:**
```
Table title: "Repayment Schedule"  heading-sm

Columns: Due Date | Principal (₹) | Interest (₹) | Total (₹) | Status

All amounts: mono-md, right-aligned
Status pills:
  Paid: success-100 / success-500 text
  Due Soon (within 30 days): warning-100 / warning-500 text  
  Overdue: error-100 / error-500 text
  Upcoming: neutral-100 / neutral-400 text

Paid rows: neutral-300 text (muted)
Current due row: highlighted (brand-light bg, brand-primary left border 3px)
Footer: Total row (bold, bg neutral-50)

Sample data (annual interest ₹24,000 / 12 = ₹2,000/month):
  15 Jan 2025  ₹20,000  ₹2,000  ₹22,000  Paid
  28 Feb 2025  ₹0       ₹2,000  ₹2,000   Paid
  31 Mar 2025  ₹17,500  ₹2,000  ₹19,500  Paid
  30 Apr 2025  ₹0       ₹2,000  ₹2,000   Paid  (interest invoice date)
  31 May 2025  ₹20,000  ₹2,000  ₹22,000  Paid
  30 Jun 2025  ₹0       ₹2,000  ₹2,000   Due Soon   ← highlighted row
```

**Repayment Method Info Card:**
```
bg brand-light  border 1.5px brand-secondary  radius-md  padding: 16px

"How to repay your loan"  heading-sm  brand-primary

Tab toggle: [Direct Transfer] [Via Sahyadri Subsidiary]

Direct Transfer tab:
  Info list (4 rows, icon + label + value + copy button):
    🏦 Bank: RBL Bank
    👤 Account Name: Sahyadri Farmers Producer Company Limited
    🔢 Account Number: 409002XXXXXXXX  [Copy]
    🏷️ IFSC: RATN0000XXX  [Copy]
    📝 Reference: "Use your Loan ID: LO00000047"  (bold instruction)
  
  Warning banner: "Always use your loan ID as payment reference. Payments without reference 
  may not be credited to your account."  warning-100 bg  warning-500 border

Via Subsidiary tab:
  "Your loan repayment is being deducted from your produce payments via Sahyadri Farms 
  Post Harvest Care Limited as per your Tri-party Agreement."
  
  Most recent deduction:
    "₹19,500 deducted on 31 May 2025"  body-md  success-500
    "Reference: SFPHCL-RTGS-4521"  mono-sm  neutral-400
```

**Upload Confirmation section:**
```
"Upload Payment Confirmation (Optional)"  heading-sm  neutral-700

Upload zone (compact):
  "Drop UTR receipt here"  body-sm
  "PDF or JPG · UTR number will be auto-extracted"

UTR Number field: mono-md  12-digit number  optional
```

---

### 4.5 Timeline Tab

```
Title: "Loan Activity Timeline"  heading-sm
Sub: "Complete audit trail of your loan"  body-sm  neutral-400

Filter: [All] [Approvals] [Payments] [Documents] [System]  (chip filters, brand-accent active)
```

**Activity Feed (vertical, full-width):**
```
Each item:
  Left: 40px wide column
    - Date connector line (1px, neutral-200, full height)
    - Activity icon in 32×32px colored circle (overlaying line)
  
  Right: card (bg white, border neutral-200, radius-md, padding: 16px, margin-left: 16px)
    Role badge: label-sm chip (role color)
    Action title: body-md 500 neutral-900
    Detail: body-sm neutral-400
    Timestamp: body-sm mono  neutral-400  (right-aligned, "10 Jan 2025 · 11:42 AM")
    
    Optional: document chip (file icon + name + download link)
```

**Sample timeline items (Ramesh's LO00000047):**
```
✅ 10 Jan 2025, 11:42 AM  | "Borrower"     | "Application submitted"
   "LO00000047 created — ₹2,00,000 requested for Crop Production"

🔍 12 Jan 2025, 3:15 PM  | "Credit Officer"| "Appraisal Note prepared"
   "Loan Appraisal Note prepared and submitted to Sanction Committee"
   [Appraisal Note.pdf ↓]  (redacted view only)

✅ 13 Jan 2025, 10:05 AM  | "CFO"          | "Loan sanctioned"
   "Loan sanctioned for ₹2,00,000 — CFO + Director approval"
   "CFO + Director: Priya Mehta"

📄 14 Jan 2025, 2:45 PM  | "CS"           | "Documents prepared"
   "Term Sheet, Loan Agreement, PoA, SH-4 prepared and signed"
   "Stamp duty paid — Ref: E-STAMP-MH-2025-XXXX"

💸 15 Jan 2025, 11:00 AM | "Finance Team" | "Loan disbursed"
   "₹2,00,000 transferred via NEFT — UTR: RBLN25015XXXXXXXXX"
   "SAP Customer ID: C-00014521"

💰 31 Mar 2025, 3:00 PM  | "System"       | "Payment received"
   "₹19,500 received — ₹17,500 Principal + ₹2,000 Interest"
   "Mode: RTGS · UTR: SBININ25090XXXXXXXXX"

💰 30 Apr 2025, 9:00 AM  | "System"       | "Interest invoice generated"
   "Interest invoice for FY 2025-26 generated — ₹18,000 outstanding"
   [Interest Invoice FY25-26.pdf ↓]

💰 31 May 2025, 5:30 PM  | "System"       | "Payment received"
   "₹22,000 received via RTGS — Principal + Interest"
```

---

## SECTION 5 — FAR-F4: REPAYMENT / MAKE PAYMENT SCREEN

```
Page: Full-content page (not modal)
Layout: Centered max-width 640px

Header:
  "Make a Payment"  display-lg  neutral-900
  "Loan LO00000047 — Outstanding ₹1,42,500"  body-md  neutral-400
```

**Outstanding Summary (compact card, brand-primary bg, radius-xl, white text):**
```
3 data points:
  Outstanding Principal: ₹1,20,500
  Outstanding Interest:  ₹22,000
  Total Due:             ₹1,42,500  (heading-md, white)
  
Note: "Partial payments are first applied to principal, then interest (SOP Rule)"
body-sm  white/70%
```

**Payment Method Selector:**
```
Two large radio card options (full-width each, stacked):

Card 1: [○] Direct Bank Transfer (RTGS / NEFT)
  Phosphor ArrowsLeftRight icon (24px, brand-secondary)
  "Transfer directly to SFPCL's RBL Bank account"  body-sm  neutral-400
  "Best for: one-time or large repayments"  label-sm  neutral-400

Card 2: [○] Via Sahyadri Subsidiary Deduction
  Phosphor ArrowFatLineDown icon (24px, brand-accent)
  "Repayment automatically deducted from your produce payment"  body-sm  neutral-400
  "Active agreement with Sahyadri Farms Post Harvest Care Ltd"  label-sm  success-500
  ✅ "Tri-party agreement active"  chip

Selected card: border 2px brand-primary, bg brand-light, radio filled
Unselected: border 1.5px neutral-200, bg white
```

**For Direct Transfer (shown when Card 1 selected):**
```
Bank Details box (bg neutral-100, radius-md, padding: 16px):
  Each row: label (label-sm, neutral-400) | value (mono-md, neutral-900) | [Copy] icon
  
  Account Name:   Sahyadri Farmers Producer Company Limited
  Account No.:    409002XXXXXXXX  (full number shown — not masked)
  IFSC:           RATN0000XXX
  Bank:           RBL Bank, Nashik Branch
  Reference:      LO00000047 (in error-500 bold — must use this exact reference)

Payment Amount field:
  Label: "Payment Amount"  label-md
  ₹ prefix  |  Number input  |  "Min: ₹2,000"  neutral-400 right
  
  Quick fill buttons (row below field):
    [₹19,500 — Next EMI]  [₹1,42,500 — Full Repayment]  [Custom]
  
  Allocation preview (appears when amount entered, bg brand-light, radius-md, padding: 12px):
    Amount entered: ₹19,500
    ├── Principal: ₹17,500
    └── Interest:  ₹2,000
    (proportional per SOP rule: principal first, then interest)

UTR / Reference Number field:
  "Enter UTR number after transfer"  label-md
  mono-md input, 12-digit, optional
  "You can add this later from the Timeline tab"  body-sm  neutral-400

Confirmation Upload:
  Mini upload zone: "Upload payment receipt (optional)"  drag-drop, PDF/JPG
```

**Submit Button:**
```
[Confirm Payment →]  primary  brand-primary  full-width  52px

On click:
  1. Show confirmation modal (460px):
     "Confirm Payment"  heading-md
     Summary: "₹19,500 · Direct Transfer · LO00000047"
     Warning: "This marks the payment as submitted. SFPCL will verify and confirm."
     [Cancel]  [Confirm & Submit]

  2. Success toast (top-right):
     ✅ "Payment of ₹19,500 submitted for LO00000047"
     body-sm  success-500  bg white  shadow-sm
     4 second auto-dismiss
```

---

## SECTION 6 — FAR-F5: MY DOCUMENTS PAGE

**Full-page document vault for the farmer:**

```
Page header:
  "My Documents"  display-lg
  Sub: "All documents related to your loans are stored here"  body-md  neutral-400

Filter row:
  [All Loans] [LO00000047] [LO00000031]  — tab filters per loan
  
  Secondary filter chips: [All] [Agreements] [KYC] [Invoices] [Receipts] [Disbursement]
  
  Search input (240px): "Search documents..."  Phosphor MagnifyingGlass (left icon)
```

**Document Grid (3-col desktop, 2-col tablet, 1-col mobile):**
Same document card anatomy as FAR-F3 Documents Tab, but with:
- Loan ID badge on each card (top-right, mono-sm, brand-accent bg/10%, brand-accent text)
- Multiple loans' documents all visible in one vault

**Upload Own Documents button:**
```
Dashed card (same width as doc card):
  Phosphor Plus (40px, brand-secondary)
  "Upload a Document"  body-md 500  neutral-700
  "Add receipts, letters, or other loan documents"  body-sm  neutral-400
  Hover: bg brand-light
```

---

## SECTION 7 — FAR-F6: SUPPORT & GRIEVANCE

```
Page header:
  "Support & Help"  display-lg
  "LO00000047 queries · Loan-related questions · Grievance filing"  body-md  neutral-400
```

**Help Tiles (2×2 grid, equal cards):**
```
Card 1: "Frequently Asked Questions"
  Phosphor Question (32px, brand-secondary)
  "Find answers to common loan questions"  body-sm
  [Browse FAQs →]  link

Card 2: "Contact Us"
  Phosphor Phone (32px, brand-accent)
  "Call: 1800-XXX-XXXX · Mon–Sat 9am–6pm"  body-sm
  [Call Now]  link

Card 3: "Send a Message"
  Phosphor ChatCircle (32px, brand-secondary)
  "Write to our credit team"  body-sm
  [Start Chat →]  link

Card 4: "File a Grievance"
  Phosphor WarningCircle (32px, warning-500)
  "Formal complaint as per SOP guidelines"  body-sm
  [File Grievance →]  link (opens FAR-F6-Grievance sub-page)
```

**Grievance Form (sub-page or bottom-drawer):**
```
Loan Reference: auto-filled (LO00000047), dropdown if multiple loans
Grievance Type: dropdown
  - Interest Calculation Dispute
  - Documentation Issue
  - Repayment Adjustment Dispute
  - Harassment / Recovery Conduct
  - NOC Not Issued After Repayment
  - Other

Description: textarea (500 chars max)
Upload Evidence (optional): upload zone (PDF/JPG)
Contact Preference: [Phone] [Email] [In-Person]

Submit → "Grievance ID: GRV-2025-0047 generated. CS team will respond within 5 working days."
```

---

## SECTION 8 — FAR-F7: NOC ISSUED SCREEN (LOAN CLOSURE)

```
Triggered when: CS team issues NOC and marks loan as Closed

Full-page celebration state (only shown once; subsequent visits go to Loan History):

Centered, 560px max-width:

  Animation: Confetti burst (CSS keyframes, green + gold particles, 3s duration)
  
  Large checkmark circle: 80px, success-500 bg, white Phosphor CheckCircle fill icon
  
  "Loan Repaid! 🎉"  display-xl  neutral-900  margin-top: 24px
  
  "Congratulations, Ramesh. You have successfully repaid LO00000047."  body-lg  neutral-400
  
  Summary box (bg success-100, border success-500, radius-xl, padding: 24px):
    Loan ID: LO00000047  |  Total Paid: ₹2,24,000  |  Tenure: 12 months
    Closed on: 15 Jan 2026
  
  Documents returned:
    "The following have been returned to you:"
    ✅ SH-4 Form (returned by CS team)
    ✅ Blank-dated Cheque (returned by CS team)
    
  [Download NOC →]  primary  brand-primary  brand-secondary icon
  [Back to Dashboard]  text link
```

---

## SECTION 9 — FAR-F8: LOAN HISTORY PAGE

```
Page: "Loan History"  display-lg
Sub: "All your past and active loans with Sahyadri Farms"

Table (full-width):
  Columns: Loan ID | Sanctioned | Disbursed | Repaid | Tenure | Status | Actions
  
  LO00000031 | ₹50,000 | 10 Mar 2023 | ₹50,000 | 12 months | Closed (success) | View
  LO00000047 | ₹2,00,000 | 15 Jan 2025 | ₹57,500 | 12 months | Active (info)   | View
  
  "Closed" rows: neutral-300 text, strikethrough on Loan ID
  "Active" rows: normal weight, brand-accent loan ID text

Summary cards (top, 3-col):
  Total Borrowed: ₹2,50,000
  Total Repaid: ₹1,07,500
  Active Loans: 1
```

---

## SECTION 10 — MOBILE VARIANT (375px) — KEY ADAPTATIONS

### 10.1 Mobile Navigation

```
Bottom tab bar (56px, bg white, border-top neutral-200, shadow-md):
  5 tabs: [🏠 Home] [📝 Apply] [💰 My Loan] [📄 Docs] [☎️ Support]
  
  Active: icon + label in brand-primary, 2px brand-primary top border on tab
  Inactive: icon + label in neutral-400
  Icon: 24px Phosphor, filled when active
  Label: label-sm (11px)
  
  "Apply" tab: brand-primary bg circle (+) button (48×48px, floating-style) centers on tab bar
  Notification dot on "My Loan" if there's a payment due
```

**No sidebar on mobile** — sidebar is replaced entirely by bottom tabs + top header.

### 10.2 Mobile Dashboard

```
Card layout: all cards full-width, stacked vertically
Hero card: same content, portrait layout (stacked 2-row instead of 3-col)
Stat cards: 2×2 grid (2 cards per row)
Journey tracker: horizontal scroll container (scroll-snap), each stage card 120px wide
```

### 10.3 Mobile Loan Application

```
One step per screen (not wizard on single page)
Step indicator: compact horizontal dots (5 dots, current filled brand-primary)
"Back" and "Next" buttons: sticky bottom, full-width, stacked (Next on top, Back text link below)

Forms: all single-column (no 2-col grid on mobile)
Upload zones: tap-to-upload (no drag/drop), native camera option shown: "📷 Take a photo"
```

### 10.4 Mobile Documents

```
Document list (card-per-row format, not grid):
  Each card: file icon (left) + doc name + date + status + download icon (right)
  Row height: 64px, full-width
  Swipe-left to reveal [Download] quick action (slide-in, 80px, brand-secondary bg)
```

---

## SECTION 11 — COMPONENT EDGE CASES & STATES (FARMER ROLE)

### 11.1 Empty States

| Screen | Empty State Message | CTA |
|--------|-------------------|-----|
| Dashboard (no loan) | "No active loan. Apply to get started." | Apply for Loan |
| Loan History (first-time) | "No previous loans. Your loan history will appear here." | Apply for Loan |
| Documents (no docs yet) | "Documents will appear here after your loan is processed." | — |
| Notifications (all read) | "You're all caught up! No new alerts." | — |
| Timeline (empty) | "Activity will appear here once your loan is processed." | — |

### 11.2 Error States

| Scenario | Error Treatment |
|----------|---------------|
| Network failure on document upload | Toast: "Upload failed. Check your connection and try again." + Retry button |
| Application save draft failure | Banner under form: "Couldn't save draft. Your inputs are safe — retry or continue." |
| Loan amount exceeds limit | Inline error: red border + "₹50,000 is your maximum eligible amount." |
| IFSC not found | Inline: "We couldn't find this IFSC. Double check or enter branch manually." |
| Session timeout | Modal: "Your session has expired. Please log in again." + [Login] button |

### 11.3 Conditional / Special States

**Re-KYC Due Banner:**
```
When: KYC documents older than 2 years
Placement: below page header (full-width, dismissable)
bg: warning-100  border-bottom: 2px warning-500
Phosphor IdentificationCard icon (20px, warning-500)
"Your KYC is due for renewal. Update before [Date] to continue using loan services."
[Update KYC →]  warning-500 text button  (right)
[Remind me later]  neutral text button  (right, secondary)
```

**Interest Rate Change Banner:**
```
bg: info-100  border-bottom: 2px info-500
"Interest rate updated to 13% p.a. effective 1 Jul 2025. Your repayments will change accordingly."
[View Revised Schedule →]  info-500 text button
```

**Grace Period Active State:**
```
Hero card: gradient shift → warning tone (#3B2800 → #78450A)
Outstanding badge turns: bg warning-500, text white, "Grace Period — 47 days remaining"
Additional banner below hero: "You are in a grace period. Pay before [date] to avoid further action."
```

---

## SECTION 12 — FIGMA ANNOTATION FLAGS (FARMER ROLE)

These sticky-note annotations must be placed in the Figma file on the relevant frame:

### 🟡 Business Rule Annotations (Yellow)
1. F1: "Loan limit calculation auto-refreshes post-AGM. Trigger: new share valuation API published."
2. F2 Step 2: "Land area input must accept decimals (0.5 to 50 acres). Validate: can't exceed 50 acres without manual review flag."
3. F2 Step 2: "Eligible amount = LOWER of Method 1 and Method 2. Hard-coded. Not user-overridable."
4. F2 Step 4: "CKYC consent is mandatory. Form cannot submit without it. No bypass."
5. F3 Timeline: "Actor label must always show role, never personal name. 'Credit Officer', not 'Priya Sharma'."
6. F4: "Partial repayment: System always adjusts Principal first, then Interest. Show allocation preview."
7. F6: "Grievance form must auto-attach Loan ID. CS team receives notification within 5 min of submission."

### 🔵 Technical / API Annotations (Blue)
1. F1 Card 2 (Max Eligibility): "API: GET /api/members/{folio}/loan-limit — returns both methods + lower."
2. F2 Step 2 (NAV per share): "API: GET /api/share-valuation/current — returns ₹X per share + AGM date."
3. F2 Step 3 (IFSC lookup): "API: GET /api/ifsc/{code} — 3rd party IFSC validation service."
4. F1 Hero Card: "WebSocket subscription: loan/{id}/status-update — real-time status push."
5. F3 Repayment Tab: "Interest accrual posted by Credit Manager monthly (SAP). API: GET /api/loans/{id}/schedule."

### 🟠 Edge Case Annotations (Orange)
1. F1: "If farmer has 2 active loans (rare exception per SOP — CFO override required): show both hero cards as a carousel with dots indicator."
2. F2 Step 1: "If nominee age input = < 18, show error: 'Nominee must not be a minor (SOP 1.1 requirement)'. Block proceed."
3. F3 Documents: "Appraisal Note download shown to farmer with watermark 'SUMMARY VIEW ONLY — Risk details redacted per SOP'."
4. F4: "If farmer types UTR that already exists in system, warn: 'This UTR may already be recorded. Please verify before resubmitting.'"
5. F2 Step 5: "If any mandatory document has ✗ status — Submit button stays disabled with tooltip listing missing docs by name."

### 🟣 Accessibility Annotations (Purple)
1. F1 Journey Tracker: "Each stage node must have aria-label='Stage [N]: [Name], [Status]'. Pulsing animation must respect prefers-reduced-motion."
2. F2 All steps: "Error messages must be associated with their input via aria-describedby, not just color."
3. F4 Pay Now: "Destructive actions (submit payment) require a confirmation step. Never single-click to charge."
4. All screens: "Language toggle persists in localStorage and cookie. Hindi/Marathi: apply Noto Sans Devanagari to body text only; headings remain Inter."

### 🔴 Critical Must-Not-Miss (Red)
1. F2 Step 1: "Nominee must be validated as NOT a minor before Step 5 submission. Backend validation + frontend age check."
2. F1 / F3: "Do not show Credit Assessment appraisal risk rating, rejection reasons, or committee discussion notes to farmer."
3. F4: "Never show full bank account number without masking (show only last 4 digits) EXCEPT on the Make Payment screen where farmer needs to verify the destination."
4. F7 NOC Screen: "NOC screen is one-time. After farmer dismisses or navigates away, it becomes part of regular Loan History view (closed status). Do not show confetti again on revisit."

---

## SECTION 13 — FRAME NAMING CONVENTION (FARMER PORTAL)

Following the standard from the design brief:

```
FAR-F1-Dashboard-Default
FAR-F1-Dashboard-ActiveLoan
FAR-F1-Dashboard-OverdueLoan
FAR-F1-Dashboard-NoLoan
FAR-F1-Dashboard-LoanUnderProcess

FAR-F2-Application-Step1-Empty
FAR-F2-Application-Step1-Filled
FAR-F2-Application-Step2-Empty
FAR-F2-Application-Step2-LimitCalculated
FAR-F2-Application-Step3-DocsUploaded
FAR-F2-Application-Step4-KYCComplete
FAR-F2-Application-Step5-Review
FAR-F2-Application-Success

FAR-F3-LoanDetail-Overview-Active
FAR-F3-LoanDetail-Overview-Overdue
FAR-F3-LoanDetail-Documents
FAR-F3-LoanDetail-Repayment
FAR-F3-LoanDetail-Timeline

FAR-F4-MakePayment-DirectTransfer
FAR-F4-MakePayment-ViaSubsidiary
FAR-F4-MakePayment-Confirmation
FAR-F4-MakePayment-Success

FAR-F5-Documents-All
FAR-F5-Documents-Filtered

FAR-F6-Support-Default
FAR-F6-Support-GrievanceForm
FAR-F6-Support-GrievanceSubmitted

FAR-F7-NOC-Issued

FAR-F8-LoanHistory

--- Mobile ---

MOB-FAR-F1-Dashboard-Default
MOB-FAR-F2-Application-Step1 through Step5
MOB-FAR-F3-LoanDetail-Overview
MOB-FAR-F3-LoanDetail-Repayment
```

Total Farmer frames: ~35 desktop + ~15 mobile = **~50 frames**

---

## SECTION 14 — PROTOTYPE FLOW (FARMER JOURNEY)

Link the following prototype flow in Figma (Smart Animate, 300ms ease):

```
LOGIN → FAR-F1-Dashboard (Active Loan state)
  ↓ Click "Apply for Loan"
FAR-F2 Step 1 → Step 2 → Step 3 → Step 4 → Step 5 → Success Screen
  ↓ "View Application Status"
FAR-F3-LoanDetail-Overview (Under Process state)
  ↓ Tab: Repayment
FAR-F3-LoanDetail-Repayment
  ↓ "Pay Now"
FAR-F4-MakePayment-DirectTransfer
  ↓ Submit → Confirmation Modal → Success Toast
FAR-F1-Dashboard (updated balance reflected)
  ↓ Loan Fully Repaid (time-skip annotation)
FAR-F7-NOC-Issued
  ↓ Download NOC
FAR-F8-LoanHistory (Closed loan)
```

---

*End of SFPCL Farmer Role — Deep-Dive Figma Prompt*
*Document: FAR-Portal-DesignSpec-v1.0 | Reference: SOP_SFPCL_LOANDISBURSEMENT v1.0*
*Frames to design: ~50 | Priority flow: Dashboard → Apply → Track → Pay → NOC*
