# SFPCL WhatsLoan — Sanction Committee Role: Figma UI Deep-Dive Prompt

**Document:** Niche UI Specification for Figma Design
**Role:** Sanction Committee (CFO + Executive Directors)
**Platform:** Web Dashboard (Desktop Primary, Tablet Secondary)
**SOP Reference:** SOP_SFPCL_LOANDISBURSEMENT v1.0 — Stage 3 (primary), Stage 2 (partial read), Stage 6 (default escalation authority), Section 2 (s.186 limit, NBFC test)
**Design Partner Context:** This role has the highest decision authority in the entire platform. The CFO and Directors do not process loans — they judge them. They arrive at this screen with one question: *"Should SFPCL lend this person money, and at what risk?"* Every pixel of this interface should answer that question faster and with less ambiguity than any other role's screen.

---

## ROLE MENTAL MODEL

The Sanction Committee thinks in **exceptions and totals**. Their daily questions are:
1. *"What loan decisions are waiting for my signature right now — and how long have they been waiting?"*
2. *"Does this specific application clear all 7 scrutiny criteria, or does something feel off?"*
3. *"What is our total lending exposure, and are we approaching our statutory limits?"*
4. *"Has someone slipped a Director's relative through without a General Meeting resolution?"*

The SC interface must be the most **signal-rich, lowest-noise screen in the product**. These are senior executives with limited patience for visual clutter. Every piece of information visible must earn its place by answering one of the four questions above.

---

## 1. VISUAL IDENTITY — SC ROLE TREATMENT

### Shared Design System Tokens (from Global Brief)
- `brand-primary`: `#1A3C2A` — sidebar, primary CTAs
- `brand-secondary`: `#2D7A4F` — active nav, hover states
- `brand-accent`: `#1E88E5` — links, info callouts
- `brand-light`: `#E8F5E9` — card/row highlights
- `neutral-100`: `#F7F8FA` — page canvas
- `success-500`: `#22C55E` — Approved / Sanctioned / Clean
- `warning-500`: `#F59E0B` — Pending / Awaiting Co-sign / Borderline
- `error-500`: `#EF4444` — Rejected / Default / Overdue / Flagged
- `info-500`: `#3B82F6` — Returned for Clarification / Info states
- `gold-500`: `#D97706` — Director/Relative borrower flag, special cases

### SC-Role Color Accent — Authority Purple
The global brief specifies `#7C3AED` (purple) as the CFO/Director role accent. Use it deliberately:
- SC avatar ring: 2px solid `#7C3AED`
- "Authority used" badge on approvals: `#7C3AED` bg, white text
- Decision panel header strip: `#7C3AED` left border (4px) on white card
- SC signature block on checklist: `#7C3AED` text for the name, distinguishes from CS/Credit Manager signatures

### Decision-Specific Color System
The SC role introduces a tertiary color layer specifically for the three decision outcomes:
- **Approve:** `#166534` bg with `#DCFCE7` text panel → firm green, not celebration green
- **Reject:** `#7F1D1D` bg with `#FEE2E2` text panel → deep red, not error red
- **Return for Clarification:** `#1E3A5F` bg with `#DBEAFE` text panel → considered blue
- Each outcome has a distinct icon: `CheckCircle` (filled), `XCircle` (filled), `ArrowBendUpLeft` (outline)

### Typography (same scale, SC-specific emphasis)
- `Inter Bold` 24px: "Loan Review — LO00000091" page titles
- `Inter Semibold` 16px: section headers within the 3-column review screen
- `Roboto Mono` 14px: loan amounts, IDs, share counts — anything that requires precision reading
- `Inter Medium` 13px: 7-point checklist items, compliance flags
- `Inter Regular` 13px: supporting evidence text, credit officer notes
- Decision rationale text (when SC enters comments): `Inter Regular` 14px, neutral-700 — readable at a glance in audit log

---

## 2. NAVIGATION STRUCTURE — SC ROLE SIDEBAR

```
┌──────────────────────────────────────────┐
│  [Sahyadri Farms logo]                   │
│  [WhatsLoan wordmark]                    │
│  ───────────────────────────────────── ─ │
│  SC Dashboard                 HOME       │
│                                          │
│  ─── DECISIONS ───                       │
│  ○ Approval Queue             [7]        │
│    └─ Awaiting My Sign        [5]        │
│    └─ Joint Approval (>₹5L)   [2]        │
│  ○ Special Cases               [1]       │
│    └─ Director / Relative Loans          │
│  ○ Return for Clarification    [3]       │
│                                          │
│  ─── RECORDS ───                         │
│  ○ Credit Sanction Register              │
│  ○ Exception Register                    │
│  ○ Board Minutes Archive                 │
│                                          │
│  ─── PORTFOLIO ───                       │
│  ○ Portfolio Health                      │
│  ○ Exposure & Limits                     │
│    └─ s.186 Limit Tracker                │
│    └─ NBFC Threshold Monitor             │
│  ○ DPD / Default Summary                 │
│                                          │
│  ─── RECOVERY AUTHORITY ───              │
│  ○ Security Invocation Queue             │
│  ○ Default Escalations                   │
│                                          │
│  ─ bottom ─                              │
│  [SC Avatar] S. Nair · CFO               │
│  [Role: Sanction Committee]              │
│  ○ Settings  ○ SOP Reference             │
└──────────────────────────────────────────┘
```

**Sidebar details:**
- Section labels: `10px`, `#8FAF96`, uppercase, `letter-spacing: 0.08em`
- Approval Queue sub-items: slightly indented (12px left), `body-sm`, white/75%
- Badge pills: error-100/error-500 for approval queue (demands action); gold-100/gold-500 for special cases
- SC role badge under avatar name: `#7C3AED` pill, white text "CFO" or "Director"
- Director variant: same structure, `Awaiting My Sign` may show different count than CFO view (role-based filtering)

---

## 3. SCREEN 1 — SANCTION COMMITTEE DASHBOARD (Home)

### Purpose
The SC member's first screen after login. It must answer all four mental model questions within 10 seconds of landing. No navigation required to take the most urgent action.

### Layout: 4-Zone Composition (1440px canvas)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  PAGE HEADER                                                                │
│  "Good morning, S. Nair" · CFO    [Last login: Today 8:14 AM]              │
│  Authority Level: CFO + 1 Director (≤₹5L) | CFO + 2 Directors (>₹5L)     │
├────────────────────────────────────────────────────────────────────────────┤
│  ZONE A — DECISION ALERT STRIP (3 alert cards, full width)                  │
│  ┌────────────────────────┐ ┌──────────────────────┐ ┌───────────────────┐ │
│  │  ● AWAITING YOUR       │ │  ⚠ JOINT APPROVAL    │ │  🚨 SPECIAL CASES │ │
│  │    APPROVAL            │ │    REQUIRED (>₹5L)   │ │  Director/Relative│ │
│  │    5 loans             │ │    2 loans            │ │    1 loan         │ │
│  │    Oldest: 2 days      │ │    Oldest: 1 day      │ │  GM Res. pending  │ │
│  │    [Review Now →]      │ │    [Review Now →]     │ │  [View →]         │ │
│  └────────────────────────┘ └──────────────────────┘ └───────────────────┘ │
│  Card 1 bg: error-100 border-top: 3px error-500                             │
│  Card 2 bg: warning-100 border-top: 3px warning-500                         │
│  Card 3 bg: `rgba(217,119,6,0.08)` border-top: 3px gold-500                │
├────────────────────────────────────────────────────────────────────────────┤
│  ZONE B — PORTFOLIO SNAPSHOT (4 KPI cards)                                  │
│  ┌──────────────────┐ ┌──────────────────┐ ┌───────────────────┐ ┌────────┐ │
│  │ Active Portfolio │ │ Sanctioned       │ │ Lending Capacity  │ │ NPA    │ │
│  │                  │ │ This Month       │ │ (s.186 headroom)  │ │ Rate   │ │
│  │ ₹1,84,20,000     │ │ ₹28,60,000 (19) │ │ ₹62,40,000 left   │ │ 1.4%   │ │
│  │ 147 active loans │ │ +12% vs last mo. │ │ 74% used          │ │ ↑0.2%  │ │
│  └──────────────────┘ └──────────────────┘ └───────────────────┘ └────────┘ │
│  Card 3 — s.186 capacity shows a mini progress bar:                         │
│  ██████████████░░░░░░ 74% used  [Warn at 85%]                               │
├────────────────────────────────────────────────────────────────────────────┤
│  ZONE C — APPROVAL QUEUE (left 62%)  │  ZONE D — RISK SUMMARY (right 38%) │
│                                       │                                     │
│  MY APPROVAL QUEUE                    │  PORTFOLIO RISK SNAPSHOT            │
│  ─────────────────────────────────    │  ────────────────────────────────── │
│  [!] LO00000091  Priya Shinde         │  DPD DISTRIBUTION                   │
│      ₹60,000 · Short-term · Grapes    │                                     │
│      Appraisal: ✅ Eligible           │  Current (0 DPD)   127 loans        │
│      Authority: CFO + 1 Director      │  ████████████████████ 86.4%         │
│      Waiting: 1 day  [Review →]       │                                     │
│  ─────────────────────────────────    │  1–2 yrs overdue    12 loans        │
│  [!] LO00000094  Narayan FPC          │  ████ 8.2%                          │
│      ₹4,80,000 · Long-term · Grapes   │                                     │
│      Appraisal: ⚠ Borderline          │  2–3 yrs overdue    5 loans         │
│      Authority: CFO + 1 Director      │  ██ 3.4%                            │
│      Waiting: 2 days  [Review →]      │                                     │
│  ─────────────────────────────────    │  3+ yrs overdue     3 loans         │
│  [→] LO00000096  Vijay More           │  █ 2.0%                             │
│      ₹6,50,000 · Long-term            │                                     │
│      Appraisal: ✅ Eligible           │  ────────────────────────────────── │
│      Authority: CFO + 2 Directors     │  RECENT DECISIONS (last 7 days)     │
│      ⚠ Awaiting 2nd Director sign     │  Approved: 14    Rejected: 2        │
│      Waiting: 1 day  [Review →]       │  Returned: 1     Avg TAT: 0.8 days  │
│  [View All 7 →]                       │                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

**Zone A alert card anatomy:**
- Large count: 36px `DM Sans Bold`, role-appropriate color
- Sub-metric ("Oldest: 2 days"): 12px `Inter Medium`, neutral-600
- CTA: full-width ghost button at card bottom, hover fills with card's theme color
- Zero-state: card turns muted grey, "All clear" with a small checkmark

**Zone C queue row anatomy:**
- Priority icon: `!` red filled circle (oldest/most critical), `→` blue for standard
- Loan ID: `Roboto Mono #0C5FA5`, clickable → goes to full review screen
- Borrower name + amount: `Inter Medium`, prominent
- Appraisal eligibility badge: green "✅ Eligible" or amber "⚠ Borderline" or red "⚠ Concerns"
- Authority badge: `#7C3AED` pill — "CFO + 1 Dir" or "CFO + 2 Dir"
- Waiting duration: colour-coded — grey (< 1 day), amber (1–2 days), red (>2 days)
- `[Review →]` ghost button, right-aligned, appears on hover → fills on focus

---

## 4. SCREEN 2 — LOAN REVIEW & APPROVAL (Core SC Screen)

### Purpose
The SC member reads a complete loan case and records their decision. This is the most consequential screen in the entire platform — a decision taken here commits company funds and creates a legally-binding obligation. The layout must surface everything relevant to a credit decision in a single view, without requiring scrolling between panels.

### Layout: 3-Column Fixed (1440px canvas)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  PAGE HEADER                                                                │
│  Loan Review  >  LO00000091  >  Priya Ramesh Shinde  ·  ₹60,000           │
│  Submitted by: Amit Kulkarni (Credit Manager) · 12-Oct-2025 · 2 days ago  │
│  [← Back to Queue]                      [Flag as Special Case]  [Print]   │
├──────────────────────┬───────────────────────┬─────────────────────────────┤
│ COLUMN A             │ COLUMN B              │ COLUMN C                    │
│ LOAN SUMMARY         │ APPRAISAL NOTE        │ DECISION PANEL              │
│ (40% width)          │ (35% width)           │ (25% width, sticky)         │
│                      │                       │                             │
│ [see §4.1 below]     │ [see §4.2 below]      │ [see §4.3 below]            │
└──────────────────────┴───────────────────────┴─────────────────────────────┘
```

---

### 4.1 COLUMN A — LOAN SUMMARY (Scrollable)

All data here is read-only for the SC. It mirrors the Credit Team's appraisal input but formatted for executive-speed consumption.

```
┌──────────────────────────────────────────────────────┐
│  BORROWER PROFILE                                    │
│  ─────────────────────────────────────────────────   │
│  Priya Ramesh Shinde                                 │
│  ● Active Member since 2021 · Folio: SH-2847         │
│  📍 Dindori Taluka, Nashik  ·  🌿 Grape Farmer       │
│  Membership: Individual (not FPC)                    │
│                                                      │
│  KYC:   ✅ PAN verified  ✅ Aadhaar verified          │
│  Re-KYC: Due Nov 2027                                │
│                                                      │
│  SHAREHOLDING                                        │
│  ─────────────────────────────────────────────────   │
│  Shares held:        250                             │
│  Share type:         Physical                        │
│  Folio:              SH-2847                         │
│  NAV per share:      ₹2,000 (AGM: Mar 2025)          │
│  Total holding value:₹5,00,000                       │
│                                                      │
│  LOAN ELIGIBILITY CALCULATION                        │
│  ─────────────────────────────────────────────────   │
│  Method 1 (Shareholding-based):                      │
│  250 shares × 30% × ₹2,000 = ₹1,50,000              │
│                                                      │
│  Method 2 (Land-based, Scale of Finance):            │
│  3 acres × ₹20,000 = ₹60,000                         │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │  ELIGIBLE LIMIT:  ₹60,000                   │    │
│  │  (Lower of Method 1 and Method 2)           │    │
│  │  Requested Amount: ₹60,000 ← AT LIMIT      │    │
│  └─────────────────────────────────────────────┘    │
│  ⚠ Requested amount equals the eligible cap.        │
│  Credit Team has verified this is within policy.    │
│                                                      │
│  LOAN PURPOSE                                        │
│  ─────────────────────────────────────────────────   │
│  Purpose:   Grape cultivation                        │
│  Tenure:    Short-term (12 months)                   │
│  Repayment: 12-Oct-2026                              │
│  Interest:  12.5% p.a. (floating)                   │
│  Penalty:   18% p.a. on overdue                      │
│  Security:  SH-4 (physical) + Blank-dated cheque    │
│  PoA:       Prepared by CS — Anjali Mehta            │
│                                                      │
│  LAND DOCUMENTS                                      │
│  ─────────────────────────────────────────────────   │
│  7/12 Extract:     ✅ Uploaded  [View ↗]             │
│  Crop Plan:        ✅ Uploaded  [View ↗]             │
│  Bank Statement:   ✅ 6 months  [View ↗]             │
│  Land Area:        3 acres (Dindori, Survey 147/2)  │
│                                                      │
│  PRIOR LOAN HISTORY                                  │
│  ─────────────────────────────────────────────────   │
│  ┌──────────┬───────────┬────────────┬──────────┐   │
│  │ Loan ID  │ Amount    │ Repaid     │ DPD      │   │
│  │ LO000047 │ ₹40,000   │ ✅ Closed  │ 0 days   │   │
│  └──────────┴───────────┴────────────┴──────────┘   │
│  Track record: ✅ Clean — 1 prior loan, zero DPD    │
│  Repayment on-time: 100%                             │
│                                                      │
│  MEMBER ACTIVE STATUS                               │
│  ─────────────────────────────────────────────────   │
│  Status:   ✅ Active Member                          │
│  Criterion: Supplied produce for 4+ financial years │
│  Last supply: FY 2024-25 via Sahyadri Farms PHC Ltd │
│  Service confirmation: ✅ Verified by Credit Team   │
└──────────────────────────────────────────────────────┘
```

**Column A design details:**
- Section headers: `Inter Semibold` 13px, `#1A3C2A`, uppercase with `letter-spacing: 0.06em`
- Dividers: 1px `neutral-200`, 8px margin above/below
- The Eligible Limit box: `brand-light` bg `#E8F5E9`, 2px left border `success-500`, `Roboto Mono` for amounts
- "At Limit" warning: amber `#FEF3C7` bg pill next to the requested amount — draws SC's eye to the borderline scenario
- Prior loan table: compact, `body-sm`, no extra padding — this is summary data, not a full register
- Document "View ↗" links: open in a right-side document preview drawer (420px) without leaving the review screen

---

### 4.2 COLUMN B — APPRAISAL NOTE (Scrollable)

The Credit Manager's work product. The SC reads this to understand the credit officer's reasoning before making their own decision.

```
┌──────────────────────────────────────────────────────┐
│  LOAN APPRAISAL NOTE                                 │
│  Prepared by: Amit Kulkarni (Credit Manager)         │
│  Reviewed by: Seema Patil (Deputy Mgr – Finance)     │
│  Date: 12-Oct-2025  ·  Ref: LAN-LO91-2025           │
│                                                      │
│  ELIGIBILITY CHECKLIST                               │
│  ─────────────────────────────────────────────────   │
│  ┌───┬─────────────────────────────────┬──────────┐  │
│  │ 1 │ Active SFPCL Member             │ ✅ Yes   │  │
│  │ 2 │ No existing default (any SFPCL) │ ✅ Clean │  │
│  │ 3 │ Land docs + KYC + bank stmt     │ ✅ Done  │  │
│  │ 4 │ Agrees to Term Sheet terms      │ ✅ Yes   │  │
│  │ 5 │ Purpose: crop / agriculture     │ ✅ Yes   │  │
│  └───┴─────────────────────────────────┴──────────┘  │
│  Overall Eligibility:  ✅ ELIGIBLE                    │
│                                                      │
│  RISK ASSESSMENT                                     │
│  ─────────────────────────────────────────────────   │
│  Risk Rating:   🟢 LOW RISK                          │
│                                                      │
│  Risk factors considered:                            │
│  • Repayment capacity: ✅ Bank stmt shows regular    │
│    monthly inflows (avg ₹22,000/month over 6 mo.)   │
│  • Market risk: ✅ Grape market stable in Nashik     │
│    region; buyer relationships with SFPCL PHC        │
│  • Operational risk: ✅ Farmer has 4 years of SFPCL  │
│    transaction history — no disputes                 │
│  • Collateral quality: ✅ Physical shares SH-2847    │
│    + blank-dated cheque obtained                     │
│  • Concentration risk: ✅ Below portfolio exposure   │
│    limits for individual farmer lending              │
│                                                      │
│  LOAN AMOUNT ASSESSMENT                              │
│  ─────────────────────────────────────────────────   │
│  Recommended Amount:  ₹60,000                        │
│  Requested Amount:    ₹60,000                        │
│  Within eligible cap: ✅ Yes (at cap, not above)     │
│  Note: Amount is at the land-based limit. Share-     │
│  based limit allows ₹1,50,000 but land-based limit  │
│  of ₹60,000 governs per SOP §2.2.                   │
│                                                      │
│  COMPLIANCE CHECK                                    │
│  ─────────────────────────────────────────────────   │
│  Director/Relative borrower:  ✅ No                  │
│  Existing SFPCL default:      ✅ No                  │
│  s.186 portfolio headroom:    ✅ ₹62.4L remaining    │
│  NBFC threshold:              ✅ Far below 50%        │
│                                                      │
│  CREDIT MANAGER RECOMMENDATION                       │
│  ─────────────────────────────────────────────────   │
│  ┌─────────────────────────────────────────────┐    │
│  │  RECOMMEND APPROVAL                         │    │
│  │  Amount: ₹60,000  ·  Tenure: 12 months      │    │
│  │  Authority: CFO + 1 Director                │    │
│  │                                             │    │
│  │  "Priya Shinde has a clean track record     │    │
│  │  with SFPCL. Purpose is aligned with FPC    │    │
│  │  objectives. Land documentation is clear.   │    │
│  │  No concerns at this time."                 │    │
│  │                                             │    │
│  │  — Amit Kulkarni, Credit Manager            │    │
│  │    12-Oct-2025, 11:30 AM                    │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
│  DOCUMENT STATUS SUMMARY (from CS)                  │
│  ─────────────────────────────────────────────────   │
│  PoA:            ✅ Notarised                         │
│  Tri-Party:      ✅ Executed                          │
│  SH-4:           ⚠ Witness signature pending         │
│  Term Sheet:     ⬜ Awaiting CFO sign                 │
│  Loan Agreement: ⬜ Not yet drafted                   │
│  Note: Document prep continues in parallel.          │
│  SC approval is on application merits. Disbursement  │
│  is gated behind full doc completion.                │
└──────────────────────────────────────────────────────┘
```

**Column B design details:**
- Header: muted dark green `#1A3C2A` band (48px) with white text — anchors the column visually as the "official" document
- Eligibility checklist table: alternating row shading `neutral-100` / `white`, `body-sm`
- Risk rating badge: `🟢 LOW RISK` large, `success-100` bg, `success-500` text — or `🟡 MEDIUM`, `⚠ HIGH` variants
- Credit Manager recommendation box: `#FDFAF4` (paper tone) bg, 2px left border `#2D7A4F`, serif `Georgia` 13px for the quote text — makes it feel like a signed document, not a form field
- "Amit Kulkarni, Credit Manager" attribution: `Roboto Mono` 12px, neutral-500
- Borderline flags: if any eligibility item is amber/red, entire column header strip shifts from dark green → amber, warning the SC before they start reading

---

### 4.3 COLUMN C — DECISION PANEL (Sticky, Full Height)

The most operationally critical UI in the entire product. The SC cannot submit a decision without completing all 7 checklist items. The panel stays fixed even as Columns A and B scroll.

```
┌─────────────────────────────────────────┐
│  SANCTION COMMITTEE DECISION            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│  LO00000091  ·  ₹60,000                 │
│  Authority: CFO + 1 Director            │
│  [S. Nair · CFO]  [● Signed]            │
│  [R. Deshmukh · Director]  [○ Pending]  │
│                                         │
│  ─────────────────────────────────────  │
│  7-POINT SCRUTINY CHECKLIST             │
│  (All must be confirmed to proceed)     │
│  ─────────────────────────────────────  │
│                                         │
│  1  ☐  Eligibility Verified             │
│        Member active, no default        │
│                                         │
│  2  ☐  Loan Amount Within Limits        │
│        Shares + land limits checked     │
│                                         │
│  3  ☐  Purpose Aligned with FPC Objects │
│        Crop / agriculture only          │
│                                         │
│  4  ☐  Companies Act Compliance Passed  │
│        s.378ZJ, s.186, AoA reviewed     │
│                                         │
│  5  ☐  Past Borrowing History Reviewed  │
│        DPD = 0, prior loans checked     │
│                                         │
│  6  ☐  Risk Assessment Considered       │
│        Market, operational, collateral  │
│                                         │
│  7  ☐  Documentation Complete           │
│        All KYC + land docs present      │
│                                         │
│  Progress: ░░░░░░░ 0 of 7               │
│  ─────────────────────────────────────  │
│                                         │
│  SC DECISION                            │
│  (Enabled only when all 7 are checked)  │
│  ─────────────────────────────────────  │
│                                         │
│  [  ✓ APPROVE  ]  [  ✗ REJECT  ]       │
│  [  ↩ RETURN FOR CLARIFICATION  ]       │
│                                         │
│  (Decision buttons greyed-out until     │
│   all 7 checklist items are ticked)     │
│                                         │
│  ─────────────────────────────────────  │
│  [Approved Amount]  ₹60,000   (editable)│
│  [SC Comments]      [_______________]   │
│  Mandatory for Reject / Return          │
│                                         │
│  ─────────────────────────────────────  │
│  ☐  Record in Credit Sanction Register  │
│     (Mandatory — cannot submit without) │
│                                         │
│  [Submit Decision →]                    │
│  (Final button — see §4.4 for modal)    │
└─────────────────────────────────────────┘
```

**Decision Panel — deep component specs:**

**7-Point Checklist Items:**
- Unchecked: `Inter Medium` 13px, neutral-700, plain checkbox `□`
- On hover: checkbox outline turns `#2D7A4F`; row gets subtle `brand-light` bg
- On check: checkbox → `✓` filled `success-500`; item text turns `success-700`; item gets light `#F0FDF4` bg tint
- Each item has an expandable remarks field (chevron right of label):
  - Clicking chevron expands a 1-line text input: "Add note (optional)"
  - If SC checks ✗ (to flag a concern) — the input becomes mandatory, field border turns `error-500`
  - ✗ on any item disables Approve, forces either Reject or Return for Clarification
- Progress bar (below item 7): fills left-to-right with `success-500` as each item is checked; turns full green and shows "7 of 7 ✓ Ready to decide" when complete

**Decision Buttons (3 large cards, side-by-side row):**
When disabled (< 7 items checked):
- All three: `neutral-200` bg, `neutral-400` text, `not-allowed` cursor
- Tooltip on hover: "Complete all 7 checklist items to enable"

When enabled (7/7 checked):
- Approve: `#166534` bg, white text, `CheckCircle` icon (20px filled), hover: darker `#14532D`
- Reject: `#7F1D1D` bg, white text, `XCircle` icon (20px filled), hover: darker `#6B1919`
- Return: `#1E3A5F` bg, white text, `ArrowBendUpLeft` icon, hover: darker `#1A3355`

Selecting a decision:
- Selected card: 3px inset ring matching the decision color, slight scale-up `transform: scale(1.02)`
- The other two cards: fade to 40% opacity

**Approved Amount field:**
- Appears only when Approve is selected
- Pre-filled with appraisal recommended amount
- Editable: SC may reduce but not increase beyond appraisal cap
- If SC enters value above recommended cap: inline error `"Cannot exceed appraisal recommended amount of ₹60,000"`
- `Roboto Mono` 16px, right-aligned, ₹ prefix fixed

**SC Comments field:**
- 3-line textarea, `Inter Regular` 14px
- Placeholder: "Required for Reject or Return; optional for Approve"
- On Reject/Return selection: border turns `error-500`, label turns `error-500`, "Required" annotation appears

**Co-signer status (top of panel — Authority section):**
- Each signatory shown as a pill: `[Name · Role]` + `[● Signed]` or `[○ Pending]`
- `● Signed`: `success-500` dot + "Signed [date]"
- `○ Pending`: `warning-500` dot + "Awaiting signature"
- For loans >₹5L: 3 signatories shown (CFO + 2 Directors)
- For loans ≤₹5L: 2 signatories (CFO + 1 Director)
- When current SC user is the logged-in actor: their pill shows `[You]` tag

---

### 4.4 SUBMISSION CONFIRMATION MODAL

A full-overlay confirmation modal appears when `[Submit Decision]` is clicked. This is the point of no return — the design must communicate that weight.

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │                                                  │   │
│  │  CONFIRM SANCTION COMMITTEE DECISION             │   │
│  │  ─────────────────────────────────────────────   │   │
│  │                                                  │   │
│  │  [For APPROVE state — green header band]         │   │
│  │  Loan: LO00000091 · Priya Ramesh Shinde           │   │
│  │  Decision: ✓ APPROVE                             │   │
│  │  Sanctioned Amount: ₹60,000                      │   │
│  │  Your authority: CFO                             │   │
│  │                                                  │   │
│  │  This decision will:                             │   │
│  │  ● Be recorded in the Credit Sanction Register   │   │
│  │  ● Notify the Compliance Team to begin docs      │   │
│  │  ● Unlock the Document Workspace for CS role     │   │
│  │  ● Update the 6-stage tracker for this loan      │   │
│  │  ● Be attributable to you as the signing CFO     │   │
│  │                                                  │   │
│  │  This action cannot be undone.                   │   │
│  │                                                  │   │
│  │  [Cancel — go back]   [Confirm & Record →]       │   │
│  │  (secondary, text)    (primary, 3px delay)       │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Modal design details:**
- Backdrop: `rgba(0,0,0,0.60)` — heavier than standard modal backdrop to communicate gravity
- Modal width: 520px, `radius-lg` (12px), `shadow-md` deep
- Header band (48px): colour-coded by decision — `#166534` (Approve) / `#7F1D1D` (Reject) / `#1E3A5F` (Return)
- "This action cannot be undone" line: `Inter Medium` 13px, `error-500` — concise, factual
- `[Confirm & Record →]` button: 3-second enforced delay before it becomes clickable (shows a progress ring filling around the button, 3px track); this is intentional friction — prevents accidental double-click
- On confirm: button replaces with a spinner for ~1.5s while API processes, then screen transitions

**Post-decision screen (success state):**
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│           ✓                                          │
│    (large success icon, 64px, success-500)           │
│                                                      │
│   Decision Recorded                                  │
│   LO00000091 · ₹60,000 · APPROVED                   │
│                                                      │
│   Credit Sanction Register: Updated ✅               │
│   CS Team notified: Yes ✅                            │
│   Farmer notification queued: Yes ✅                  │
│   Recorded by: S. Nair (CFO) · 13-Oct-2025 · 10:22  │
│                                                      │
│   [Back to Approval Queue]   [View Sanction Register]│
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 5. SCREEN 3 — JOINT APPROVAL SCREEN (Loans > ₹5,00,000)

### Purpose
For loans above ₹5 lakhs, the SOP requires CFO + **2 Directors** to sign off. This screen manages the sequencing of that joint decision — one SC member may act first, and the screen communicates to the second what has already been assessed.

### Layout: Same 3-Column as SC-2, with Joint Approval Overlay

```
┌────────────────────────────────────────────────────────────────────────────┐
│  ⚠ JOINT APPROVAL REQUIRED — AMOUNT EXCEEDS ₹5,00,000                    │
│  This loan requires: CFO + 2 Directors (all three must sign)              │
│  ─────────────────────────────────────────────────────────────────────── │
│  [S. Nair · CFO]          ✅ Signed · 12-Oct-2025 · Recommended Approve  │
│  [R. Deshmukh · Director] ○ Awaiting — Notified 12-Oct-2025              │
│  [V. Kulkarni · Director] ○ Awaiting — Notified 12-Oct-2025              │
│                                                                            │
│  Current status: 1 of 3 signatures obtained. 2 more required.            │
└────────────────────────────────────────────────────────────────────────────┘
│  [Same 3-column layout below — Columns A and B identical to SC-2]         │
│                                                                            │
│  COLUMN C — DECISION PANEL (modified for joint approval)                  │
│  ─────────────────────────────────────────────────────────────────────── │
│  FIRST SIGNATORY VIEW (CFO, who is already signed):                       │
│  "You have recorded your decision: ✓ APPROVE · ₹6,50,000"                │
│  "Awaiting 2nd and 3rd signatures from Directors."                        │
│  [Withdraw my decision ←] (ghost, available within 24hr of signing)       │
│                                                                            │
│  SECOND SIGNATORY VIEW (Director opening same screen):                    │
│  "CFO S. Nair has approved this loan. Please review and add your          │
│   signature. The CFO's 7-point checklist notes are shown below."          │
│  [View CFO's checklist notes ▾] (expandable)                              │
│  Then: full 7-point checklist + Decision buttons for the Director         │
│  Director cannot overrule CFO — they can only Approve or Return.          │
│  To Reject: must be discussed and CFO must withdraw first.                │
└────────────────────────────────────────────────────────────────────────────┘
```

**Joint approval header banner:**
- `gold-500` left border (4px), `warning-100` bg
- Each signatory shown as a horizontal row of pill-chips
- Signed: `success-100` bg, green dot, name, date
- Awaiting: `neutral-200` bg, amber dot, name, "Notified [date]"
- A status line below: "1 of 3 signatures — loan cannot be disbursed until all 3 are recorded"

**Director's view of an already-partially-signed loan:**
- CFO's checklist visible in read-only mode with their annotations
- The Director's own 7-point checklist is a fresh instance (they must independently verify)
- A subtle notice: "Note: Both you and the CFO must be in agreement for this loan to proceed to documentation. Disagreements require SC deliberation before final entry."

---

## 6. SCREEN 4 — SPECIAL CASES SCREEN (Director / Relative Borrower)

### Purpose
When a Director or their relative applies for a loan (Section 378ZK, Companies Act 2013), standard SC scrutiny is insufficient. The General Meeting must approve it. This screen manages that exceptional flow.

```
┌────────────────────────────────────────────────────────────────────────────┐
│  PAGE HEADER: Special Cases — Director / Relative Applications             │
│  These loans require General Meeting approval before SC decision.          │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │  🚨 SPECIAL CASE — GM APPROVAL REQUIRED                             │ │
│  │  ─────────────────────────────────────────────────────────────────   │ │
│  │  Loan: LO00000099  ·  Borrower: Meena Deshmukh                      │ │
│  │  Relationship: Relative of Executive Director (R. Deshmukh)         │ │
│  │  Amount Requested: ₹1,20,000                                        │ │
│  │  Application date: 10-Oct-2025                                      │ │
│  │                                                                      │ │
│  │  Legal basis: Companies Act 2013, Section 378ZK                     │ │
│  │  Requirement: Prior approval of Members in General Meeting          │ │
│  │  Scrutiny: Only by SC members excluding R. Deshmukh                │ │
│  │                                                                      │ │
│  │  STATUS TRACKER                                                      │ │
│  │  ─────────────────────────────────────────────────────────────────   │ │
│  │  ✅ Application received                                             │ │
│  │  ✅ Special case flag raised (by Credit Manager)                    │ │
│  │  ✅ R. Deshmukh excluded from SC deliberations (system-enforced)    │ │
│  │  ⬜ General Meeting resolution obtained   [Upload GM Resolution ↑]  │ │
│  │  ⬜ GM resolution verified by CS                                     │ │
│  │  ⬜ SC review (CFO + remaining directors, excluding R. Deshmukh)    │ │
│  │  ⬜ SC decision recorded                                             │ │
│  │                                                                      │ │
│  │  Current blocker: GM resolution not yet uploaded.                   │ │
│  │  Disbursement is LOCKED until step 4 is complete.                   │ │
│  │                                                                      │ │
│  │  Participating SC members (R. Deshmukh excluded):                   │ │
│  │  [S. Nair · CFO ✓]   [V. Kulkarni · Director ✓]                    │ │
│  │                                                                      │ │
│  │  [Upload GM Resolution]  [Request CS to Verify]  [View Audit Log]   │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

**Special case card design:**
- Card border: 2px solid `gold-500`, top bar: 4px `gold-500`
- Status tracker: vertical step indicator (circle nodes, connecting line)
  - Done: filled `success-500` circle + strikethrough text
  - Current blocker: pulsing `warning-500` circle + bold text
  - Locked future: empty `neutral-300` circle + greyed text
- "R. Deshmukh excluded" row: system-enforced banner — not a checkbox. Tooltip: "This exclusion is automatic and cannot be overridden."
- The review screen (if SC opens this loan for full review) renders the same 3-column layout from SC-2, but with a persistent top banner: "R. Deshmukh is excluded from this decision. Only CFO S. Nair and Director V. Kulkarni may sign."

---

## 7. SCREEN 5 — CREDIT SANCTION REGISTER

### Purpose
The permanent, immutable record of every SC decision. Auditable, filterable, exportable. The SC can search past decisions but cannot edit them — every entry is a sealed record.

```
┌────────────────────────────────────────────────────────────────────────────┐
│  PAGE HEADER: Credit Sanction Register          [Export CSV]  [Export PDF] │
│  Complete record of all sanction decisions       Search: [_______________] │
├────────────────────────────────────────────────────────────────────────────┤
│  FILTER BAR                                                                 │
│  Date: [From: __ ] [To: __ ]   Decision: [All] [Approved] [Rejected]      │
│  Authority: [All] [CFO+1Dir] [CFO+2Dir]  Amount: [< ₹5L] [≥ ₹5L]         │
│  Exception flag: [All] [Flagged only]                                       │
├──────────┬──────────────┬──────────────┬──────────┬───────────┬────────────┤
│ Date     │ Loan ID      │ Borrower     │ Amount   │ Decision  │ Authority  │
├──────────┼──────────────┼──────────────┼──────────┼───────────┼────────────┤
│13-Oct-25 │ LO00000091   │ Priya Shinde │ ₹60,000  │ ✅ Apprvd │ CFO+1Dir   │
│12-Oct-25 │ LO00000090   │ Vijay More   │ ₹6,50,000│ ✅ Apprvd │ CFO+2Dir   │
│11-Oct-25 │ LO00000089   │ Narayan FPC  │ ₹2,00,000│ ↩ Return  │ CFO+1Dir   │
│09-Oct-25 │ LO00000088   │ Ganesh Thorat│ ₹80,000  │ ✅ Apprvd │ CFO+1Dir   │
│07-Oct-25 │ LO00000087   │ Sunita Jadhav│ ₹40,000  │ ✗ Reject  │ CFO+1Dir   │
│          │              │              │          │           │            │
├──────────┴──────────────┴──────────────┴──────────┴───────────┴────────────┤
│  Showing 5 of 412 records  |  [← Prev]  Page 1 of 83  [Next →]            │
└────────────────────────────────────────────────────────────────────────────┘
```

**Expanded row (on click):**
```
┌──────────────────────────────────────────────────────────────────────────┐
│  LO00000091 · Priya Ramesh Shinde · ₹60,000 · APPROVED · 13-Oct-2025    │
│  ──────────────────────────────────────────────────────────────────────  │
│  Signed by:   S. Nair (CFO) · 13-Oct-2025 · 10:22 AM                    │
│               R. Deshmukh (Director) · 13-Oct-2025 · 11:05 AM           │
│  7-Point checklist: All 7 items confirmed                                 │
│  SC Comments: "Clean track record. Amount at land-based limit.           │
│                Recommend short-term approval."                           │
│  Sanctioned Amount: ₹60,000 (equals appraisal recommended amount)       │
│  Exception flag: None                                                    │
│  Sanction Note Ref: LAN-LO91-2025                                        │
│  [View Full Appraisal Note]  [View Audit Log]                            │
└──────────────────────────────────────────────────────────────────────────┘
```

**Table design details:**
- Decision column: colored pills — `success-100/500` (Approved), `error-100/500` (Rejected), `info-100/500` (Returned)
- Exception flag column (not shown in default view, appears when filter is applied): `gold-500` flag icon
- Rows: immutable — no edit icon anywhere; `cursor: default` on all cells except Loan ID (which is a link)
- Row hover: `brand-light` bg tint `#E8F5E9`

---

## 8. SCREEN 6 — EXCEPTION REGISTER

### Purpose
All deviations from standard policy — loans above limits (with joint approval rationale), Director-relative cases, any SC overrides — are recorded here. Linked to the Credit Sanction Register entry.

```
┌────────────────────────────────────────────────────────────────────────────┐
│  PAGE HEADER: Exception Register             [Export]   [+ Log Exception]  │
│  Deviations from standard policy — immutable, each entry time-stamped     │
├────────────────────────────────────────────────────────────────────────────┤
│  TYPE FILTER: [All] [Limit Exceeded] [Special Approval] [Director Case]   │
│               [Policy Override] [Extension Granted]                        │
├──────────┬────────────┬──────────────────────────────┬───────────┬────────┤
│ Date     │ Loan ID    │ Exception Type               │ Approver  │ Status │
├──────────┼────────────┼──────────────────────────────┼───────────┼────────┤
│13-Oct-25 │ LO000090   │ Amount exceeds ₹5L — Joint   │ CFO+2Dir  │ ✅     │
│          │            │ approval obtained             │           │        │
│10-Oct-25 │ LO000099   │ Director's relative applicant │ CFO+Dir   │ ⬜ GM  │
│          │            │ — GM resolution pending       │ (excl.)   │ pend.  │
│05-Sep-25 │ LO000081   │ Extension granted — non-      │ CFO       │ ✅     │
│          │            │ intentional default (+1yr)    │           │        │
└──────────┴────────────┴──────────────────────────────┴───────────┴────────┘
```

---

## 9. SCREEN 7 — PORTFOLIO HEALTH & EXPOSURE

### Purpose
The SC's strategic view. Quarterly MIS presentation to CFO from Credit Manager is formatted here. Also contains the s.186 limit tracker (lending capacity) and NBFC threshold monitor.

### Layout: 3-Section Stacked Dashboard

```
┌────────────────────────────────────────────────────────────────────────────┐
│  PAGE HEADER: Portfolio Health & Exposure         [Last refreshed: Today]  │
│                            [Download Board Pack PDF]  [Q3 FY 2025-26]     │
├────────────────────────────────────────────────────────────────────────────┤
│  SECTION A — DPD DISTRIBUTION (full-width card)                             │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  PORTFOLIO AT RISK — DAYS PAST DUE BUCKETS                         │   │
│  │                                                                     │   │
│  │  Current (0 DPD):    127 loans  ₹1,56,40,000  ████████████ 84.9%  │   │
│  │  1–2 years overdue:   12 loans  ₹  14,80,000  ████ 8.0%           │   │
│  │  2–3 years overdue:    5 loans  ₹   7,20,000  ██ 3.9%             │   │
│  │  3+ years overdue:     3 loans  ₹   5,80,000  █ 3.2%              │   │
│  │                                                                     │   │
│  │  Total Portfolio: ₹1,84,20,000  ·  147 loans  ·  Avg: ₹1,25,306   │   │
│  │  NPA Rate: 1.4%  ·  [View DPD Detail →]                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├────────────────────────────────────────────────────────────────────────────┤
│  SECTION B — STATUTORY LIMIT TRACKER (2-card row)                          │
│                                                                             │
│  ┌───────────────────────────────────────┐  ┌──────────────────────────┐   │
│  │  s.186 LENDING CAPACITY               │  │  NBFC PRINCIPAL BUSINESS  │   │
│  │                                       │  │  TEST MONITOR             │   │
│  │  Paid-up Capital:     ₹4,20,00,000    │  │                           │   │
│  │  Free Reserves:       ₹2,10,00,000    │  │  Financial Assets /       │   │
│  │  Securities Premium:  ₹     0         │  │  Total Assets             │   │
│  │  ─────────────────────────────────    │  │  ████████░░░░ 38% ✅      │   │
│  │  60% limit:         ₹3,78,00,000      │  │  Threshold: 50%           │   │
│  │  100% free reserves:₹2,10,00,000      │  │  Headroom: 12%            │   │
│  │  Permissible limit: ₹3,78,00,000      │  │                           │   │
│  │  (higher of the two)                  │  │  Income from Fin. Assets / │  │
│  │                                       │  │  Total Income             │   │
│  │  Current deployed:  ₹1,84,20,000      │  │  ██████░░░░░░ 31% ✅      │   │
│  │  Headroom:          ₹1,93,80,000      │  │  Threshold: 50%           │   │
│  │  ████████████░░░░░░ 48.7% used        │  │  Headroom: 19%            │   │
│  │                                       │  │                           │   │
│  │  ✅ Well within limit                  │  │  ✅ NBFC registration NOT │   │
│  │  ⚠ Warning threshold: 85%            │  │  required at current       │   │
│  │  🔴 Action required:  100%            │  │  ratios                    │   │
│  └───────────────────────────────────────┘  └──────────────────────────┘   │
│                                                                             │
├────────────────────────────────────────────────────────────────────────────┤
│  SECTION C — RECENT DECISIONS SUMMARY (compact table)                      │
│  Last 30 days: Approved 47  |  Rejected 6  |  Returned 3  |  Avg TAT 0.9d │
└────────────────────────────────────────────────────────────────────────────┘
```

**s.186 Limit Card design details:**
- Progress bar: `success-500` fill (≤ 70%), `warning-500` fill (70–84%), `error-500` fill (≥ 85%)
- At 85%: orange warning banner appears above the card: "⚠ Approaching s.186 lending limit. Board note required before sanctioning further loans."
- At 100%: red banner: "🔴 s.186 limit reached. All new sanctions require special Board resolution."
- Headroom figure: always shown prominently in `Roboto Mono` — this is the number the CFO uses to decide whether to approve borderline applications

**NBFC Monitor Card:**
- Two gauge bars (Financial Assets ratio + Income ratio)
- Colour: `success-500` when both < 40%, `warning-500` when either 40–49%, `error-500` when either ≥ 50%
- Alert at 40%: "Approaching NBFC registration threshold — CFO action required"
- Tooltip on each bar: "Source: Last audited balance sheet + current-period estimates"

---

## 10. SCREEN 8 — DEFAULT ESCALATION & SECURITY INVOCATION AUTHORITY

### Purpose
When the Credit Assessment Team escalates a non-recovering loan to the SC, this screen presents the full default case and allows the SC to authorise security invocation (SH-4 sale, undated cheque presentation, or CDSL IRF).

```
┌────────────────────────────────────────────────────────────────────────────┐
│  PAGE HEADER: Default Escalations & Recovery Authority                      │
│  Loans escalated by Credit Assessment Team for SC action                   │
├────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  ESCALATION CASE                              ⚠ SC DECISION REQUIRED│  │
│  │  Loan: LO00000018  ·  Vijay More  ·  ₹1,20,000 outstanding          │  │
│  │  ─────────────────────────────────────────────────────────────────   │  │
│  │  DEFAULT TIMELINE                                                    │  │
│  │  ✅ Original repayment due:      15-Mar-2024                         │  │
│  │  ✅ 3-month grace period expired: 15-Jun-2024 — unpaid               │  │
│  │  ✅ Non-intentional assessment:  Credit Team assessed — crop loss    │  │
│  │  ✅ 1-year extension granted:    Expired 15-Jun-2025 — still unpaid  │  │
│  │  ✅ Non-payment note prepared:   09-Oct-2025 — shared to SC          │  │
│  │  ⬜ SC decision: Pending your action                                  │  │
│  │                                                                      │  │
│  │  CREDIT TEAM ASSESSMENT NOTE                                         │  │
│  │  "Vijay More's crop loss was weather-related in FY24. Extension      │  │
│  │   granted. Now FY26, income resumed but repayment not made.          │  │
│  │   Pattern has shifted to intentional avoidance. Recovery via         │  │
│  │   subsidiary deduction not possible — no active produce supply.      │  │
│  │   Recommend security invocation."                                    │  │
│  │   — Amit Kulkarni, Credit Manager · 09-Oct-2025                     │  │
│  │                                                                      │  │
│  │  SECURITY AVAILABLE                                                  │  │
│  │  SH-4 Form:      ✅ Held in custody — Safe A-09 (250 shares)        │  │
│  │  Blank Cheque:   ✅ Held — ₹1,20,000 to be filled in                │  │
│  │  CDSL Pledge:    N/A (physical shares)                               │  │
│  │                                                                      │  │
│  │  SC DECISION                                                         │  │
│  │  ─────────────────────────────────────────────────────────────────   │  │
│  │  Select action to authorise:                                         │  │
│  │                                                                      │  │
│  │  ○ Invoke SH-4 — initiate share transfer proceedings                │  │
│  │  ○ Present undated cheque — fill amount ₹1,20,000 + present to bank │  │
│  │  ○ Both — simultaneous invocation                                    │  │
│  │  ○ Grant further discretionary extension (state reason)             │  │
│  │                                                                      │  │
│  │  SC Authorisation Notes (mandatory): [____________________________]  │  │
│  │  Record in Exception Register: ☐ (mandatory checkbox)               │  │
│  │                                                                      │  │
│  │  [Authorise Selected Action →] — triggers CS invocation workflow    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 11. EDGE CASE SCREENS

### 11.1 — RETURN FOR CLARIFICATION FLOW

When the SC sends a loan back to the Credit Team, the return reason must be specific and actionable.

```
┌────────────────────────────────────────────────────────────────────────────┐
│  RETURN FOR CLARIFICATION — LO00000089 · Narayan FPC                       │
├────────────────────────────────────────────────────────────────────────────┤
│  RETURN REASONS (select all that apply):                                    │
│  ☐ Income evidence insufficient — request 3 more months of bank statements│
│  ☐ Land documents missing — 7/12 extract not uploaded                      │
│  ☐ Loan purpose unclear — request detailed end-use description             │
│  ☐ FPC membership not verified — active member status unclear              │
│  ☐ Prior default with associate company — requires clarification           │
│  ☐ Other (describe below)                                                   │
│                                                                             │
│  Additional Instructions to Credit Team:                                   │
│  [_____________________________________________________________________]   │
│                                                                             │
│  Returned by: S. Nair (CFO) · Expected resubmission within: [3 days ▾]   │
│                                                                             │
│  [Cancel]                              [Return Application →]              │
└────────────────────────────────────────────────────────────────────────────┘
```

---

### 11.2 — s.186 LIMIT WARNING BANNER (System-Wide)

When total outstanding loans reach 85% of the permissible limit:

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ⚠ LENDING LIMIT ADVISORY — s.186 Companies Act, 2013                  │
│  SFPCL's outstanding loans have reached 85% of the permissible           │
│  lending cap (₹3,78,00,000). Current outstanding: ₹3,21,30,000          │
│  Remaining headroom: ₹56,70,000                                          │
│                                                                           │
│  Any new loan sanctioned that would breach the 100% limit requires       │
│  a prior Board resolution with special approval.                         │
│                                                                           │
│  [Acknowledge]     [View Limit Calculation]     [Request Board Note]     │
└──────────────────────────────────────────────────────────────────────────┘
```

This banner: `warning-100` bg, `warning-500` left border (4px, full height), sticks below the top header on ALL SC screens when threshold is breached. Dismissing it with `[Acknowledge]` logs the dismissal in audit with timestamp and actor.

---

### 11.3 — APPROVAL QUEUE EMPTY STATE

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│           ✅                                                 │
│   (large checkmark illustration, 64px, success-500)          │
│                                                              │
│   All Clear                                                  │
│   No loans are waiting for your approval.                    │
│                                                              │
│   Last decision: LO00000091 approved · 13-Oct-2025 · 10:22  │
│                                                              │
│   [View Credit Sanction Register]    [Portfolio Overview]    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 11.4 — TABLET RESPONSIVE (Compact Decision Mode)

For SC members reviewing loans on an iPad (board room, field visit):

```
3-column layout collapses to a vertical accordion:
  ▶ Loan Summary (collapsed by default, tap to expand)
  ▶ Appraisal Note (collapsed by default)
  ▼ Decision Panel (expanded by default — this is the primary action)

Decision panel on tablet:
  - 7-point checklist: full-width, larger touch targets (48px per row)
  - Decision buttons: stacked vertically (Approve top, Reject middle, Return bottom)
  - Each button: 56px height, full-width, clear label + icon
  - Confirmation modal: full-screen takeover on tablet (not partial overlay)
```

---

## 12. NOTIFICATION TYPES — SC ROLE

| Trigger | Notification | Priority |
|---|---|---|
| New application submitted to SC queue | "LO00000091 awaiting your approval — ₹60,000" | 🔴 High |
| Application waiting > 2 days | "⚠ TAT breach — LO00000091 has been waiting 2 days" | 🔴 Critical |
| Joint approval required — 2nd signatory needed | "LO00000096 (₹6.5L) — CFO signed. Your signature required." | 🔴 High |
| Director/relative loan flagged | "⚠ Special case — Meena Deshmukh. GM resolution required." | 🔴 Critical |
| Default escalation received | "LO00000018 escalated for security invocation authority" | 🔴 Critical |
| s.186 limit at 85% | "⚠ Lending cap at 85% — review before next sanction" | 🟡 Medium |
| s.186 limit at 100% | "🔴 Lending cap reached — Board resolution required" | 🔴 Critical |
| NBFC threshold reaches 40% | "NBFC ratio alert — approaching registration threshold" | 🟡 Medium |
| Extension granted log | "Extension approved — LO000058 logged in Exception Register" | 🟢 Info |
| CS sign-off complete | "LO000091 — CS signed checklist. Proceeding to disbursement." | 🟢 Info |
| Loan fully disbursed | "LO000091 disbursed — ₹60,000 · Record updated" | 🟢 Info |

---

## 13. AUDIT LOG — SC VIEW

Every SC action is immutable and exportable to PDF.

```
[Timestamp]           [Actor]                 [SC Action]
12-Oct-25 09:15       S. Nair (CFO)            Opened review — LO00000091
12-Oct-25 09:44       S. Nair (CFO)            Completed 7-point checklist (all ✓)
12-Oct-25 09:45       S. Nair (CFO)            Decision: APPROVE · ₹60,000
12-Oct-25 09:45       S. Nair (CFO)            Recorded in Credit Sanction Register
12-Oct-25 09:45       System                  CS Team notified — document prep triggered
12-Oct-25 10:05       R. Deshmukh (Director)   Co-signed approval — LO00000091 (CFO+1Dir)
12-Oct-25 11:20       S. Nair (CFO)            Opened review — LO00000096 (>₹5L)
12-Oct-25 11:35       S. Nair (CFO)            Decision: APPROVE · ₹6,50,000 (1/3 sigs)
12-Oct-25 14:10       R. Deshmukh (Director)   Decision: APPROVE — LO000096 (2/3 sigs)
12-Oct-25 15:30       V. Kulkarni (Director)   Decision: APPROVE — LO000096 (3/3 sigs done)
```

Immutable. Export to PDF for board records and statutory audit.

---

## 14. FIGMA FILE STRUCTURE — SC ROLE

```
SFPCL — WhatsLoan — Sanction Committee Role/
├── 🎨 Design System/ (shared — reference from global brief)
├── 📐 Wireframes (Lo-fi)/
│   └── All 8 screens + edge cases
├── 🖥 Desktop Designs (Hi-fi)/
│   ├── SC-1 — Dashboard (Home)
│   │   ├── SC-1-Dashboard-Default (queue populated)
│   │   └── SC-1-Dashboard-AllClear (empty queue)
│   ├── SC-2 — Loan Review & Approval
│   │   ├── SC-2-ReviewScreen-ColA-ColB-ColC-Default
│   │   ├── SC-2-ReviewScreen-Checklist-Incomplete (0-6 items)
│   │   ├── SC-2-ReviewScreen-Checklist-Complete (7/7 — decisions enabled)
│   │   ├── SC-2-ReviewScreen-DecisionSelected-Approve
│   │   ├── SC-2-ReviewScreen-DecisionSelected-Reject
│   │   ├── SC-2-ReviewScreen-DecisionSelected-Return
│   │   ├── SC-2-ConfirmationModal-Approve
│   │   ├── SC-2-ConfirmationModal-Reject
│   │   ├── SC-2-SuccessState-Approved
│   │   └── SC-2-SuccessState-Rejected
│   ├── SC-3 — Joint Approval Screen (>₹5L)
│   │   ├── SC-3-JointApproval-FirstSignatory-View
│   │   └── SC-3-JointApproval-SecondSignatory-View
│   ├── SC-4 — Special Cases (Director/Relative)
│   │   ├── SC-4-SpecialCase-GMResolutionPending
│   │   └── SC-4-SpecialCase-GMResolutionUploaded-ReadyForReview
│   ├── SC-5 — Credit Sanction Register
│   │   ├── SC-5-Register-Default
│   │   └── SC-5-Register-RowExpanded
│   ├── SC-6 — Exception Register
│   ├── SC-7 — Portfolio Health & Exposure
│   │   ├── SC-7-Portfolio-Green (all within limits)
│   │   ├── SC-7-Portfolio-Warning (s.186 at 85%)
│   │   └── SC-7-Portfolio-Critical (s.186 at 100%)
│   ├── SC-8 — Default Escalation & Security Invocation
│   ├── SC-EC1 — Return for Clarification Flow
│   ├── SC-EC2 — s.186 Warning Banner (across all screens)
│   └── SC-EC3 — Tablet Compact Decision Mode
├── 🔍 Contextual Panels/
│   ├── Document Preview Drawer (right, 420px — opens from Column A doc links)
│   └── Audit Log View (full-page, accessible from any loan)
├── 📱 Tablet Responsive/
│   └── SC-2 Tablet — Vertical Accordion Decision View
└── 📋 Prototype Flows/
    ├── Flow A: Dashboard → Queue → Full Review → Approve → Post-Decision
    ├── Flow B: >₹5L Review → Joint Approval → 2nd Signatory → Complete
    ├── Flow C: Review → Return for Clarification → Back to Queue
    ├── Flow D: Director Case → Special Case Screen → GM Upload → Review
    └── Flow E: Default Escalation → SC Authorises Invocation
```

---

## 15. FIGMA FRAME NAMING (SC Role Convention)

```
SC-[ScreenCode]-[ScreenName]-[State]
Examples:
SC-1-Dashboard-Default
SC-1-Dashboard-AllClear
SC-2-ReviewScreen-Checklist-Incomplete
SC-2-ReviewScreen-Checklist-Complete
SC-2-ReviewScreen-Approve-Selected
SC-2-ReviewScreen-Reject-Selected
SC-2-ConfirmationModal-Approve
SC-2-SuccessState-Approved
SC-3-JointApproval-FirstSig-CFOView
SC-3-JointApproval-SecondSig-DirectorView
SC-4-SpecialCase-GMPending
SC-4-SpecialCase-ReadyForReview
SC-5-Register-Default
SC-7-Portfolio-s186Warning-85pct
SC-7-Portfolio-NBFCAlert-40pct
SC-8-DefaultEscalation-PendingDecision
SC-EC2-s186Banner-AllScreens
SC-Tab-ReviewScreen-VerticalAccordion
```

---

## 16. FIGMA ANNOTATION FLAGS — SC ROLE

### 🟡 Business Rule Annotations (Yellow)
1. SC-2 Decision Panel: "7-point checklist is hard-coded from SOP §3.1. Cannot be reduced or skipped. All 7 must be ✓ before any decision button activates."
2. SC-2 Approved Amount: "SC may reduce the approved amount below the appraisal recommendation but cannot increase above it. Enforce max validation on input."
3. SC-3 Joint Approval: "For loans >₹5L, all three parties (CFO + 2 Directors) must sign independently. System must prevent disbursement until 3/3 are recorded."
4. SC-4 Special Cases: "Exclusion of the related director is system-enforced — it is not a user preference and cannot be overridden by any role, including the CFO."
5. SC-7 s.186: "Permissible limit = HIGHER of (60% of paid-up capital + free reserves + securities premium) OR (100% of free reserves + securities premium). Recalculate quarterly."
6. SC-8 Default: "SH-4 or undated cheque invocation requires Board approval. This screen records that approval. CS receives the trigger only after this form is submitted."

### 🔵 Technical / API Annotations (Blue)
1. SC-2 Column A: "API: GET /api/loans/{id}/full-summary — returns all borrower, eligibility, and prior loan data."
2. SC-2 Column B: "API: GET /api/loans/{id}/appraisal-note — returns Credit Manager's completed note in structured JSON."
3. SC-2 Decision submit: "API: POST /api/sanctions/{loanId}/decision — body: {decision, approvedAmount, comments, checklistNotes, signatoryId}. Returns sanction register ref."
4. SC-3 Joint Approval: "System must track individual signatory state per loan. Third signatory completing triggers automatic CS notification webhook."
5. SC-7 s.186 tracker: "API: GET /api/compliance/s186-limit — computed from latest approved balance sheet. Refreshes quarterly."
6. SC-7 NBFC monitor: "API: GET /api/compliance/nbfc-ratio — two ratios: financial_assets_pct and financial_income_pct. Alert at ≥ 40%."

### 🟠 Edge Case Annotations (Orange)
1. SC-2: "If borrower has an active loan at another SFPCL associate company, show a yellow flag in Column A: 'Cross-company exposure — verify with Credit Team before approving.'"
2. SC-3: "If second Director is unavailable (leave, travel), the loan stays in queue. Do not allow CFO to override the joint requirement. Show: 'Awaiting 2nd Director — contact R. Deshmukh.'"
3. SC-2: "If Credit Manager appraisal note is older than 7 days, show an amber banner in Column B: 'Appraisal Note is 7+ days old. Market conditions may have changed. Verify with Credit Team.'"
4. SC-4: "If the Director themselves attempts to open the special case screen for their own relative's loan, the system must show: 'You are excluded from this review per s.378ZK. Contact CFO.'"
5. SC-7: "If NBFC ratio exceeds 50%: lock all new approvals system-wide. Show: 'New loans cannot be sanctioned until NBFC registration is completed or financial ratios are restored below threshold.'"

### 🟣 Accessibility Annotations (Purple)
1. SC-2 Checklist: "Each checklist item toggle must have aria-label: 'Scrutiny point [N]: [Name]. Current state: [Checked/Unchecked].' Never rely on colour alone."
2. SC-2 Decision buttons: "Three decision cards must be keyboard-navigable. Tab order: Approve → Reject → Return. Enter key selects. Escape deselects."
3. SC-2 Confirmation modal: "Focus trap required inside modal. Tab cycles through Cancel and Confirm buttons only. Escape closes modal only before 3-second countdown completes."
4. SC-7 Progress bars: "All DPD bars must include aria-valuenow, aria-valuemin, aria-valuemax and a text label with the same value for screen readers."

### 🔴 Critical Must-Not-Miss (Red)
1. SC-2: "The [Submit Decision] button must NOT be a single-click action. The confirmation modal with 3-second delay is mandatory — not optional UX polish. This prevents mis-taps on tablets."
2. SC-3: "Joint approval signatures must be stored as individual records, each with signatoryId + timestamp. A combined 'both approved' record is insufficient for audit."
3. SC-4: "Director exclusion from their own relative's loan is legally required by s.378ZK. The system must enforce this at the routing layer — the director must not even see the full appraisal note for that loan."
4. SC-5: "Credit Sanction Register rows are IMMUTABLE after submission. No edit, delete, or overwrite. Only annotations/notes may be added to an existing row."
5. SC-2: "Never show the SC the Credit Manager's internal risk-scoring algorithm weights or raw scores — only the summarised eligibility outcome and recommendation. Internal scoring models are confidential."

---

## DESIGN SOUL NOTE FOR THE FIGMA DESIGNER

The Sanction Committee screen is the **judicial chamber** of the WhatsLoan platform. Everyone else processes; these people decide. The visual language should carry that weight.

The 3-column review screen is the centrepiece of this role — and its central design challenge is information hierarchy within a fixed-width panel. Column C (the decision panel) is the action, but Columns A and B are the evidence. The designer's job is to make it effortless for a CFO to scan Columns A and B in 60 seconds and arrive at Column C with enough confidence to tick 7 boxes and commit ₹60,000 of member capital.

**The signature design move for this role:** the 7-point checklist in Column C should not look like a form. It should look like a **judicial checklist** — each item slightly weighty, with the progress bar at the bottom filling like a verdict being reached. When item 7 is checked and the bar turns solid green, the three decision buttons should animate into their enabled state simultaneously (not one by one) — a small, deliberate moment that signals: *the case is ready for your verdict*.

The decision buttons themselves (Approve / Reject / Return) should be the **largest interactive elements in the entire product** — not because the SC needs help finding them, but because the visual weight of the button must match the weight of the action. A ₹60,000 decision should not be made by clicking a small ghost button. It should feel like laying a hand on the scale.

One intentional constraint: Column C is **never wider than 25% of the canvas**. The evidence (Columns A and B) should always dominate the visual field. The SC must read before they decide.

---
*Generated from SOP_SFPCL_LOANDISBURSEMENT v1.0 | WhatsLoan × Sahyadri Farms | Sanction Committee Role*
*Companion to: SFPCL_CreditTeam_Figma_Prompt_DeepDive.md | SFPCL_ComplianceCS_Figma_Prompt_DeepDive.md | SFPCL_FarmerRole_Figma_Prompt_DeepDive.md*
*Frames to design: ~28 desktop + ~5 tablet = ~33 frames | Priority flow: Dashboard → Review → 7-Point Checklist → Decision → Post-Decision*
