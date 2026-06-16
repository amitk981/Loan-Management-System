# SFPCL WhatsLoan — Master Figma Design Prompt
### Combined Visual & UX Specification for the Complete Loan Management Platform
**Version:** 2.0 | **Prepared for:** Figma Design Team
**Platform:** Web Dashboard (1440px Desktop-First) + Responsive (768px Tablet, 375px Mobile)
**Reference:** SOP_SFPCL_LOANDISBURSEMENT v1.0 | WhatsLoan Platform v1.0
**Covers:** All 6 roles — Farmer · Credit Team · Compliance/CS · Sanction Committee · Treasury/Finance · Super Admin

---

## PART 1 — PROJECT CONTEXT & DESIGN PHILOSOPHY

### What is Being Built
A multi-role, web-based Loan Management System (LMS) for Sahyadri Farmers Producer Company Limited (SFPCL) — a farmer-owned organisation with 769 shareholders, 48 FPCs, and 30,000+ farmers across 45,000 acres of Maharashtra. The platform digitises the end-to-end lending lifecycle: loan application through credit assessment, sanction, documentation, disbursement, monitoring, and closure — all governed under Section 378ZK of the Companies Act, 2013.

### Design Philosophy: Five Principles
1. **Clarity over cleverness.** Many users are field officers or farmers with limited digital literacy. Complexity belongs in the backend, not the interface.
2. **Trust through structure.** Financial platforms earn trust through visual consistency, clean data hierarchies, and zero ambiguity in status indicators.
3. **Process fidelity.** The UI must mirror the 6-stage SOP exactly. No stage may be bypassed visually or functionally.
4. **Role-scoped views.** Each stakeholder sees only what they need to act on. Information is exposed progressively.
5. **Audit-ready.** Every action, approval, and status change must be visually traceable.

### The Six Role Mental Models (Design Against These)
| Role | They Think In | Their First Question Every Morning |
|---|---|---|
| Farmer | "My loan" | What stage is my loan at, and when do I pay next? |
| Credit Manager | "Queues + risk" | What needs my attention today, and what's at risk? |
| Company Secretary | "Checklists + calendars" | What documents are pending, what deadlines am I approaching? |
| CFO / Director | "Exceptions + totals" | What needs my signature, and what is our total lending exposure? |
| Finance / Treasury | "Transactions" | What do I need to pay out today, and what came in? |
| Super Admin | "Permissions + config" | Is the system behaving correctly? |

---

## PART 2 — BRAND IDENTITY & VISUAL LANGUAGE

### Logo Co-existence Rule
- **Sahyadri Farms:** Oval logo, deep forest green, leaf/seedling motif, tagline "Seeding goodness"
- **WhatsLoan:** Bold wordmark, teal-blue "W" chevron icon + "WhatsLoan" in dark navy
- **Header placement:** WhatsLoan as primary product brand (left); Sahyadri Farms as parent institution (right, smaller)
- **Login / onboarding:** Both centered, stacked vertically with a thin separator

### Brand Color Palette — Master Token Table
| Token | Hex | Usage |
|---|---|---|
| `brand-primary` | `#1A3C2A` | Sidebar, primary CTAs, headers |
| `brand-secondary` | `#2D7A4F` | Secondary buttons, hover states, active nav |
| `brand-accent` | `#1E88E5` | WhatsLoan accent, links, info states |
| `brand-light` | `#E8F5E9` | Card backgrounds, row highlights |
| `neutral-100` | `#F7F8FA` | Page canvas |
| `neutral-200` | `#EDEEF0` | Dividers, table borders, skeleton loaders |
| `neutral-400` | `#9EA8B3` | Placeholder text, disabled states |
| `neutral-700` | `#3D4450` | Body text, secondary labels |
| `neutral-900` | `#12151A` | Headings, high-emphasis text |
| `success-500` | `#22C55E` | Approved, Disbursed, Active, Clean |
| `success-100` | `#DCFCE7` | Success pill backgrounds |
| `warning-500` | `#F59E0B` | Pending, Under Review, Grace Period |
| `warning-100` | `#FEF3C7` | Warning pill backgrounds |
| `error-500` | `#EF4444` | Rejected, Default, Overdue |
| `error-100` | `#FEE2E2` | Error pill backgrounds |
| `info-500` | `#3B82F6` | Informational status, Doc Pending |
| `info-100` | `#DBEAFE` | Info pill backgrounds |
| `gold-500` | `#D97706` | Special case flags — Director/Relative borrower |

### Role-Specific Accent Colors (Avatar rings, role badges, nav elements)
| Role | Accent | Hex |
|---|---|---|
| Farmer / Borrower | `brand-accent` | `#1E88E5` |
| Credit Team | `brand-secondary` | `#2D7A4F` |
| Company Secretary | `brand-primary` | `#1A3C2A` |
| CFO / Director | Authority Purple | `#7C3AED` |
| Finance / Treasury | Cyan | `#0891B2` |

### CS Role Accent — Judicial Parchment System
Because the CS role handles legal instruments, introduce a secondary surface texture used **only** in document panels and compliance checklists:
- Document panel background: `#FDFAF4` (warm off-white — evokes paper)
- Document section headers: `#1A3C2A` (deep green, firm authority)
- Stamp/execution status badge: `#6D4C41` (dark brown — physical stamp metaphor)
- Stamp-complete indicator: small filled ink-stamp icon in `#6D4C41` replacing generic checkmarks inside document cards

### SC Role Accent — Authority Purple System
- SC avatar ring: 2px solid `#7C3AED`
- "Authority used" badge: `#7C3AED` bg, white text
- Decision panel header strip: `#7C3AED` left border (4px) on white card
- SC signature block on checklist: `#7C3AED` text, distinguishes from CS/Credit Manager signatures
- Decision outcome colors:
  - Approve: `#166534` bg, `#DCFCE7` text panel — firm green, not celebration green
  - Reject: `#7F1D1D` bg, `#FEE2E2` text panel — deep red, not error red
  - Return for Clarification: `#1E3A5F` bg, `#DBEAFE` text panel — considered blue

### Surface Elevation System
```
Level 0 → bg: neutral-100        Page canvas
Level 1 → bg: #FFFFFF            Cards, panels, table rows
Level 2 → bg: #FFFFFF + shadow-sm  Modals, drawers
Level 3 → bg: #FFFFFF + shadow-md  Dropdowns, popovers
```
Shadow tokens: `shadow-sm: 0 1px 3px rgba(0,0,0,0.08)` | `shadow-md: 0 4px 16px rgba(0,0,0,0.12)`

---

## PART 3 — DESIGN SYSTEM FOUNDATIONS

### Typography Scale — SINGLE PLATFORM FONT STACK
> **Critical resolution:** All role prompts use a unified Inter + Roboto Mono stack. DM Sans and JetBrains Mono are NOT used anywhere. Use only the following:

| Token | Font | Size | Weight | Line-H | Usage |
|---|---|---|---|---|---|
| `display-xl` | Inter | 32px | 700 | 40px | Page heroes, empty states |
| `display-lg` | Inter | 24px | 700 | 32px | Modal titles, section headers |
| `heading-md` | Inter | 20px | 600 | 28px | Card titles, panel headers |
| `heading-sm` | Inter | 16px | 600 | 24px | Sub-section titles |
| `body-lg` | Inter | 15px | 400 | 22px | Primary body content |
| `body-md` | Inter | 14px | 400 | 20px | Table content, labels |
| `body-sm` | Inter | 12px | 400 | 18px | Meta info, timestamps |
| `label-md` | Inter | 13px | 500 | 18px | Form labels, table headers |
| `label-sm` | Inter | 11px | 500 | 16px | Badges, tags, chips |
| `mono-md` | Roboto Mono | 14px | 400 | 20px | Loan IDs, amounts, PAN, Aadhaar, SAP codes |
| `mono-sm` | Roboto Mono | 12px | 400 | 18px | Reference numbers, timestamps |

**Critical rules:**
- All currency amounts (₹) use `mono-md` or `mono-sm`, right-aligned
- Loan IDs (LO00000001 format) always in `mono-md`, neutral-700
- Document preview panels inside CS workspace use `Georgia` or serif font — distinguished from UI copy

### Spacing System
Base unit: 4px. Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96.
- Component internal padding: 16px (cards), 12px (compact cells), 20–24px (forms)
- Section gaps: 24–32px
- Page outer padding: 32px left/right on 1440px canvas

### Border Radius — Unified
- `radius-sm`: 4px — badges, chips, table cells
- `radius-md`: 8px — cards, inputs, buttons
- `radius-lg`: 12px — modals, panels, drawer headers
- `radius-xl`: 16px — stat cards, feature cards, hero cards
- `radius-full`: 9999px — avatars, toggles, status pills

> **Resolution note:** The Credit Team prompt specified 8px for cards and 6px for inputs. Adopt `radius-md: 8px` as the standard for regular cards and panels, and `radius-xl: 16px` for stat/hero cards. Inputs: 8px.

### Grid System
- Desktop (1440px): 12-column, 24px gutters, 32px margin
- Laptop (1280px): 12-column, 20px gutters, 24px margin
- Tablet (768px): 8-column, 16px gutters, 16px margin
- Sidebar (collapsed: 64px, expanded: 240px) is fixed; content area adapts

### Icon System
- **Phosphor Icons** throughout (outline in default state, fill in active state)
- Stroke weight: 1.5px consistently
- Standard sizes: 24px (navigation), 20px (sidebar), 16px (inline/button), 12px (chip/badge icons)

---

## PART 4 — GLOBAL LAYOUT ARCHITECTURE

### Shell Layout (All Authenticated Roles)
```
┌─────────────────────────────────────────────────────────┐
│  TOP HEADER (56px fixed, bg: brand-primary)             │
│  [Hamburger] [Breadcrumb] ... [Search] [Bell] [Profile] │
├──────────────┬──────────────────────────────────────────┤
│  SIDEBAR     │  CONTENT AREA                           │
│  240px or    │  ┌────────────────────────────────────┐ │
│  64px coll.  │  │ PAGE HEADER (48px, title + CTAs)   │ │
│              │  ├────────────────────────────────────┤ │
│              │  │ MAIN CONTENT (scrollable, 32px pad) │ │
│              │  └────────────────────────────────────┘ │
└──────────────┴──────────────────────────────────────────┘
```

### Top Header Specs (56px, bg: brand-primary)
- **Left:** Hamburger (24px, white) → sidebar toggle | WhatsLoan logo (white, 120px)
- **Center:** Contextual breadcrumb — white/60% inactive crumbs | white/100% current | "›" separator at white/40%
- **Right:** Language toggle [EN|मर|हि] (28×22px pills) | Help icon | Notification bell (red badge) | Avatar + Name + role badge + chevron dropdown
- Avatar: 32px circle, initials-based, role-color ring

### Sidebar Specs (240px expanded / 64px collapsed, bg: brand-primary)
- Logo area at top (48px)
- Nav items: 48px height each, 16px horizontal padding
- **Active state:** bg `brand-secondary`, 4px left border `brand-accent` (or role accent for SC/Treasury), text white
- **Hover:** bg white/10%
- Section dividers: white/20%, 10px uppercase label above group (letter-spacing: 0.08em)
- Bottom: User profile card (avatar + name + role badge) + Logout
- **Collapsed (64px):** icon-only, tooltips on hover (200ms delay, 160px wide, neutral-900 bg)
- **Farmer variant:** No sidebar — replaced by bottom tab bar on mobile (5 tabs: Home/Apply/My Loan/Docs/Support)

---

## PART 5 — THE 6-STAGE LOAN TRACKER (SHARED ACROSS ALL ROLES)

This is the single most important shared component. Every role sees it. Design it once, use it everywhere with role-specific rendering rules.

### Horizontal Tracker (Desktop — Default)
```
●────────────────●────────────────●────────────────●────────────────●────────────────●
1                2                3                4                5                6
Application      Credit           Sanction         Documentation    Disbursed        Closed
Submitted        Assessment       Approved
```

### Node States
- **Completed:** filled circle, success-500, white checkmark inside
- **Active (current):** filled circle, brand-primary, white stage number, subtle pulsing ring (1.5s ease-in-out, prefers-reduced-motion respected)
- **Upcoming:** hollow circle, neutral-300 border
- Connecting line: solid success-500 between completed nodes, dashed neutral-300 between future nodes

### Stage Icons (Phosphor)
| # | Stage Name | Icon |
|---|---|---|
| 1 | Application Submitted | `ClipboardText` |
| 2 | Credit Assessment | `MagnifyingGlass` |
| 3 | Sanction Approved | `Stamp` |
| 4 | Documentation | `FolderOpen` |
| 5 | Disbursed | `BankNote` |
| 6 | Closed / Active | `CheckCircle` |

### Click Behavior Per Role
- **Farmer:** Stage name + completion date only. No actor names shown.
- **Internal roles (Credit/CS/SC/Treasury):** Click completed node → mini tooltip: stage name, completed date, actor role + name, reference/note.
- **Vertical variant (mobile, Farmer only):** One node per row, 64px height, connecting line as left rail

### Frame Naming
`SHARED-StageTracker-Default` | `SHARED-StageTracker-Stage3-Active` | `SHARED-StageTracker-AllComplete` | `SHARED-StageTracker-Vertical-Mobile`

---

## PART 6 — ROLE-BY-ROLE SCREEN SPECIFICATIONS

---

### ROLE 1: FARMER / BORROWER PORTAL

**Design Persona:** Ramesh Patil, 42, grape farmer from Dindori Taluka, Nashik. Owns 250 shares (Folio SH-04821), 3.5 acres, second-time borrower. Uses WhatsApp daily but has never used a web-based financial portal. **Design every label, tooltip, and empty state with him in mind.**

#### FAR-F1 — Farmer Dashboard

**Page Header Band (48px, bg white, border-bottom neutral-200):**
- Left: "Good morning, Ramesh 👋" (`display-lg`) | "Member since 2019 · Folio SH-04821" (`body-sm`, neutral-400)
- Right: [+ Apply for Loan] primary button (brand-primary)
- Time-based greeting: 5–11:59 "Good morning" | 12–16:59 "Good afternoon" | 17–20:59 "Good evening" | 21–4:59 "Hello"
- First-ever login: "Welcome to WhatsLoan, Ramesh 🌱"

**Hero Loan Card (full-width, radius-xl, 140px min-height):**

State A — Active Loan:
- bg: `linear-gradient(135deg, #1A3C2A 0%, #2D7A4F 100%)`
- 3-column flex layout:
  - LEFT: "Active Loan" label (label-sm, white/60%) + "LO00000047" (mono-md, white/85%) + tenure chip
  - CENTER: "Outstanding Balance" label + "₹1,42,500" (display-xl, 32px, white) + progress bar (repaid %) + "₹57,500 repaid" sub
  - RIGHT: Due date pill (warning-500 bg) + [Pay Now] ghost button (white border, white text)

State B — Overdue: gradient shifts to `#3D1A1A → #7B2020`; error-500 due badge with pulsing ring animation

State C — No Active Loan: `brand-light` bg, dashed brand-secondary border, centered Plant icon + "Apply for First Loan →" CTA

State D — Under Processing: muted gradient, "Application Under Review" with animated 3-dot pulse, Stage badge

**Stat Cards Row (4-column, 1/4 grid):**
Each card: bg white, radius-xl, 16px padding, border neutral-200, shadow-sm
- Card 1 — Shares Held: `Certificate` icon, folio + share type, estimated value in success-500
- Card 2 — Max Loan Eligibility: `Coins` icon, value in success-500, "Updated Apr 2025" sub-label; hover tooltip explains both methods
- Card 3 — Total Repaid: `ArrowFatLineUp` icon, progress bar (repaid/sanctioned)
- Card 4 — Loan Standing: `ShieldCheck` icon, status dot (10px circle) + "Good Standing" / "Grace Period Active" / "Payment Overdue · N days" / "Account in Default"

**Journey Tracker Card:** Full-width. 6 horizontal nodes — same shared component above, but with larger node circles (32×32px), stage name + date below completed nodes, "Est. 2 days" info pill on current node.

**Two-Column Content Row (60/40 split):**
- Left 60%: Recent Transactions table (Date | Type chip | Amount | Mode | Status) — 5 rows, type chips colour-coded:
  - Disbursement → info-100/500
  - Principal Repayment → success-100/500
  - Interest Payment → warning-100/500
  - Penalty → error-100/500
  - Interest Capitalized → `#FEF3C7` / `#92400E`
- Right 40%: My Documents quick panel — icon + name + status badge (Available/Awaiting Signature/Processing/Not Generated) + download icon

**Notifications Feed (full-width card):** Icon circles + message + timestamp, unread in bold neutral-900, read in neutral-400. Types: interest invoice (info), payment reminder (warning), approval (success), document ready (success), overdue (error), re-KYC (warning), rate change (info).

#### FAR-F2 — Loan Application (Multi-Step Wizard, 5 Steps)

Wizard shell: 760px max-width centered. Desktop: left step sidebar (200px) + right form card. Step states: Completed (success-500 + checkmark) | Current (brand-primary filled) | Future (neutral-200 ring).

**Step 1 — Basic Details:** 2-column form grid. Pre-filled read-only fields with lock icon + tooltip. Nominee section (collapsible, "Required by SOP" label). Info banner: "Nominee must not be a minor."

**Step 2 — Shareholding & Loan Limit:** Read-only shareholding block (folio, shares, type, NAV). Loan Limit Calculator Panel (`brand-light` bg, 1.5px brand-secondary border):
- Method 1 Card + Method 2 Card side-by-side (white, radius-md, formula visual: three boxes connected by × and =)
- Final Result Banner (brand-primary bg, white text): "₹50,000" (display-xl) with "Method 1 applies (lower limit)" chip
- Loan Request section: amount input with max chip, purpose dropdown with emoji prefixes

**Step 3 — Land & Crop:** Upload zones (dashed border, hover: brand-light bg); Land Details dynamic table with "Add row" button; Bank account fields with IFSC lookup (validate → auto-fill branch + "Bank Verified ✅" chip).

**Step 4 — KYC Documents:** Progress bar (X of 5 documents). Applicant + Nominee KYC upload grids. Declarations (3 checkboxes). CKYC consent (brand-light bg card, mandatory — cannot submit without).

**Step 5 — Review & Submit:** Accordion sections with "Edit" link per section. Prominent loan summary card (brand-primary bg, white text, 3-column: Amount | Tenure | Purpose). Declaration banner. Submit button → loading spinner → Success screen (green checkmark animation, application reference in mono-md, "What happens next" 3-step guide).

#### FAR-F3 — Loan Status Detail (Tabbed)
Tabs: [Overview] [Documents] [Repayment] [Timeline] — 48px tab bar.

**Overview:** Loan summary card (5 data points). Journey tracker (vertical orientation with detailed status per step). Quick Actions (3 cards: Make Payment | Download Statement | View Agreement).

**Documents:** 3-col card grid. File type icon in colored circle. Status badge. [↓ Download] button disabled for "Not Generated" docs. Appraisal Note shows with "SUMMARY VIEW ONLY — Risk details redacted" watermark.

**Repayment:** Outstanding Amount hero (error-500 if overdue). Schedule table with highlighted current-due row (brand-light bg, brand-primary left border). Repayment Method info card with Direct Transfer / Via Subsidiary tabs. Bank account copy buttons. Reference field warning banner.

**Timeline:** Vertical activity feed. Role badges (role name, never personal name). Activity type icons in colored circles. Documents linked inline where applicable.

#### FAR-F4 — Make Payment
Two large radio cards: Direct Bank Transfer | Via Subsidiary Deduction. Bank details copy box (full account number visible here — only screen where this applies, annotate 🔴). Quick-fill buttons: [Next EMI] [Full Repayment] [Custom]. Allocation preview (Principal first, then Interest — auto-calculated). Confirmation modal required before submit.

#### FAR-F7 — NOC Issued (Loan Closure)
One-time celebration screen. Confetti burst (green + gold CSS keyframes). Large checkmark circle. Summary box (success-100). Documents returned checklist. [Download NOC] primary button. 🔴 Annotation: NOC screen is one-time — do not show confetti again on revisit.

#### Farmer Mobile Adaptations
- Bottom tab bar (56px): [🏠 Home] [📝 Apply] [💰 My Loan] [📄 Docs] [☎️ Support]
- All cards full-width and stacked
- Hero card portrait layout
- Stat cards: 2×2 grid
- Journey tracker: horizontal scroll container (scroll-snap, each stage card 120px wide)
- Forms: all single-column, tap-to-upload with camera option

---

### ROLE 2: CREDIT ASSESSMENT TEAM (Credit Manager + Deputy Manager – Finance)

#### C-1 — Credit Manager Dashboard

**KPI Strip (4 cards):**
- "New Apps Today" with delta vs yesterday
- "In Appraisal" with TAT (turn-around time)
- "Awaiting SC Approval" with overdue flag
- "Active Loans" with portfolio total

**Zone B — My Action Queue (left 55%):** Priority icons: `!` red circle (overdue/TAT breach), `→` blue arrow (in-progress), `✓` green (complete). Loan ID in mono-md cyan. Status chips. TAT breach = red badge.

**Zone C — Alerts (right 45%):** TAT breach alert, default flags, re-KYC due notices.

**Zone D — Portfolio Health Bar:** DPD bucket distribution as horizontal bar segments. NPA rate, avg loan size.

#### C-2 — Application Intake & Review
Master-detail split (35% list / 65% detail panel). List: filter tabs + status chips. Detail panel: 3 sections — Applicant Details, Loan Request, KYC Document Checklist.

**KYC Checklist item states:**
- ✅ Complete: green icon + filename link + timestamp
- ❌ Missing: red icon + "Missing" badge + [Request from Farmer] inline action
- ⏳ Pending Review: amber icon, Deputy can verify inline

**"Send Deficiency Notice" flow:** Modal with auto-detected missing items, channel selector (Email/SMS/WhatsApp), Marathi + English tabs.

**Manual Entry path (offline applications):** Dedicated `C-2-ManualEntry-Form` — Credit Officer data-entry form, all fields from farmer application, auto-assigns reference number.

#### C-3 — Loan Appraisal Note (Core Workflow — Most Premium Screen)

**Layout:** Left panel (60%) application data | Right panel (40%) appraisal note builder (sticky) | Live Eligibility Calculator in left panel sidebar.

**Step wizard structure (4 steps: Eligibility Check → Loan Limit → Risk Assessment → Recommendation):**

Live Eligibility Calculator (persistent sidebar within form):
- Shares Held input × ₹200 = Limit A (auto-computed, info-500)
- Land area input × ₹20,000 = Limit B (auto-computed, info-500)
- Final eligible: `min(A, B)` — highlighted callout box with brand-primary border
- Comparison bar: requested vs eligible amount

**Eligibility Result Callout:**
```
✅ ELIGIBLE LOAN AMOUNT
Shareholding limit: ₹50,000  (250 × ₹200)
Land-based limit:   ₹60,000  (3 acres × ₹20k)
Final Eligible:     ₹50,000  ← lower of two
Requested:          ₹60,000  ← exceeds by ₹10k
⚠ Amount will be revised to ₹50,000 at sanction
```
Border: 2px solid brand-secondary. Background: `#F0F7F2`.

**Submit to SC confirmation modal:** "This will notify the Sanction Committee. The appraisal note will be locked. Confirm?" [Confirm] [Cancel] — with timestamp appended to note footer.

**TAT Warning:** Amber progress bar + "Due by [Date + Time] — 1d 14h remaining" in page sub-header.

#### C-4 — Sanction Committee Tracker
Full-width table. SC Level pills: `CFO+1Dir` blue (≤₹5L) | `CFO+2Dir` purple (>₹5L) | `General Meeting Required` orange (Director case). Row expand shows SC decision detail + [Proceed to Documentation Stage →].

#### C-5 — Loan Register
Master register, comprehensive filters. DPD column color-coded: 0 = green | 1–2yr = amber | 2–3yr = orange | 3yr+ = red. Row click → Loan Detail Drawer (480px, vertical stepper timeline + repayment history + security status + action buttons).

#### C-6 — DPD Monitoring & Portfolio Health
Portfolio Summary Strip (5 cards: Current, 1–2yr, 2–3yr, 3yr+, NPA Rate). Default Workflow Panel per selected row: checkable timeline (Grace period → Assessment → Extension → Escalation). Non-Payment Note auto-draft editable memo.

---

### ROLE 3: COMPLIANCE / COMPANY SECRETARY

**Design Soul:** The CS role is where agriculture meets the law. The Document Workspace should feel like opening a physical legal file folder — warm `#FDFAF4` paper tone, serif font inside document previews, stamp-icon treatment on completed instruments.

#### CS-1 — CS Dashboard

**KPI Strip (4 cards):** Docs Pending Signature | Statutory Deadlines | KYC Expiring (30 days) | NOC Queue.

**Zone B — My Document Queue (left 58%):** Priority icons same as Credit Team. Action labels must be specific and descriptive — never "Pending" — always "PoA not yet notarised" or "SH-4 witness signature missing". CTA buttons ghost on hover → solid on focus. Rows expand on click to show document mini-preview.

**Zone C — Calendar Sidebar (right 42%):** Upcoming deadlines with 🔴/🟡/🟢/🔵 indicators. KYC renewal alerts.

**Zone D — Checklist Sign-off Tracker:** Full-width compact band showing loans awaiting CS sign-off before disbursement.

#### CS-2 — Document Workspace (Core CS Screen — The Most Complex and Critical)

**Initial state for new SC-approved loans:** All tabs grey/pending. An ordered "Where to begin" guidance strip at top: `PoA → Tri-Party → SH-4/CDSL → Term Sheet → Loan Agreement → Bank Verification → Checklist`.

**Layout:** Left sidebar (280px) document checklist + right main area with tabs.

**Checklist sidebar:** Progress bar (brand-secondary fill). Each item: icon (✅/⚠/⬜/N/A grey dash) + document name + one-line status. Blocked items show lock icon. "Submit for CS Sign" button disabled (grey) until all 8 resolved → enabled (brand-primary) when ready.

**Document tabs (7 tabs):** PoA | Tri-Party | SH-4/CDSL | Term Sheet | Loan Agreement | Bank Verification | Master Checklist

**Tab: Power of Attorney**
- Instrument Details table (Grantor, Grantee, stamp value with ✅ chip, notarisation status)
- Document Preview (PDF thumbnail) + Custody Record (cabinet location, scanned by, date)
- stamp-icon (Phosphor `Stamp`, `#6D4C41`) replacing generic checkmarks on completed documents

**Tab: Share Security (SH-4)**
Conditional rendering based on share type:
- Physical Shares: SH-4 form fields. Witness folio validation (must be current SFPCL shareholder). Upload signed SH-4.
- D-MAT Shares (CDSL): Pledge lifecycle tracker (Created → Accepted → Active → Repaid). PSN field. Future shares clause note. On Repayment: [Initiate Unpledge (URF)]. On Default: [Invoke Pledge (IRF)] locked until SC authorises.

**Tab: Term Sheet**
All 13 SOP fields auto-populated from loan data. Signing authority auto-detects: loan >₹5L adds CFO + 2 Director signature blocks. Status per signatory with [Forward to queue] actions.

**Tab: Loan Agreement**
6-item checklist (stamp paper / draft / notarisation / applicant signed / witness signed / uploaded). [Generate from Template →] pulls all 23+ auto-fill fields. Dependency note: "Loan Agreement must be executed AFTER Term Sheet is signed."

**Tab: Bank Verification (Conditional)**
Normal state: "Signatures match — NOT REQUIRED." Mismatch state: side-by-side signature comparison (PAN vs cheque). Two resolution paths: Option A — Bank Verification Letter | Option B — Declaration on Stamp Paper.

**Tab: Master Checklist (CS-2i — THE Most Visually Distinct Screen)**
Full 12-item document index table (# | Document | Status | Custody). Four-signature approval block (CS | Credit Manager | SC Director | Sr. Manager Finance). [Sign Checklist as CS] button — enabled only when 12/12 resolved.

**CS Sign-off modal — SOLEMN, FOCUSED MODE:**
This modal is not designed for speed. It is designed for certainty. Implementation:
- Centered modal overlay, white-on-dark-green header "FINAL SIGN-OFF"
- Each of the four signature rows rendered with clear visual weight
- Declaration checklist (all docs attached, stamps affixed, notarisations complete, witness from SFPCL shareholders, KYC valid)
- Final "Sign & Submit →" button: large, brand-primary, with a **2-second hover-hold delay** to prevent misclicks

#### CS-3 — Compliance Calendar
Calendar grid (left 60%) with colour-coded events + Compliance Detail panel (right 40% — statute citation, owner, evidence required, history). Compliance table below with row-expand for full details.

#### CS-4 — KYC Renewal Tracker
Filter bar: [All] [Overdue] [<30 days] [30-60 days] [>60 days]. Status strip: 🔴 Overdue (expired) | 🟡 <30 days | 🟠 30-60 days | 🟢 Current. Table with Days Left column colour-coded. [Send] → Re-KYC request modal (SMS/Email/Both toggle, message preview).

#### CS-5 — NOC Issuance Queue
Pre-NOC checklist (full repayment confirmed, all interest settled, SAP balance = ₹0). Security Return section (SH-4 returned ☐, Blank cheque returned ☐, CDSL URF if applicable). NOC generation → delivery selector → [Issue NOC & Archive Loan →] triggers 8-year archive clock.

**NOC preview modal:** Formal document layout with SFPCL letterhead format, borrower address, loan reference, certification text, CS signature block.

#### CS Edge Case Screens
**Director/Relative Borrower (CS-EC1):** Gold-500 bordered card, step tracker showing blocked states. "Disbursement is LOCKED until GM Resolution uploaded."

**Security Invocation (CS-EC2):** Invocation Checklist (all items must be ✅). Three selection paths: SH-4 share transfer | Undated cheque presentation | CDSL IRF. ⚠ "Every action here is IRREVERSIBLE and logged in Exception Register."

**8-Year Archive Trigger (CS-EC3):** Closure confirmation with document custody confirmation, archive expiry date (NOC date + 8 years).

---

### ROLE 4: SANCTION COMMITTEE (CFO + Executive Directors)

**Design Soul:** The Sanction Committee screen is the judicial chamber of WhatsLoan. These are senior executives with limited patience for visual clutter. Every piece of information visible must earn its place. The 3-column review screen is the centrepiece — the designer's job is to make it effortless for a CFO to scan Columns A and B in 60 seconds and arrive at Column C ready to tick 7 boxes and commit ₹60,000 of member capital.

#### SC-1 — SC Dashboard

**Zone A — Decision Alert Strip (3 alert cards):**
- Card 1 "Awaiting Your Approval": error-100 border-top 3px error-500, large count, "Oldest: 2 days"
- Card 2 "Joint Approval Required (>₹5L)": warning-100 / warning-500
- Card 3 "Special Cases (Director/Relative)": gold-500 toned bg

Each card: zero-state turns muted grey with "All clear ✓" checkmark.

**Zone B — Portfolio Snapshot (4 KPI cards):**
Active Portfolio | Sanctioned This Month | Lending Capacity with s.186 progress bar | NPA Rate.

s.186 capacity mini progress bar: `████████████░░░░░░ 74% used [Warn at 85%]`

**Zone C — Approval Queue (left 62%):** Queue row anatomy: priority icon `!` (red, oldest) or `→` (blue, standard). Authority badge: `#7C3AED` pill "CFO + 1 Dir" or "CFO + 2 Dir". Waiting duration: grey (<1 day), amber (1–2 days), red (>2 days).

**Zone D — Risk Summary (right 38%):** DPD distribution with percentage bars. Recent decisions 7-day summary.

#### SC-2 — Loan Review & Approval (The Core SC Screen — 3 Columns Fixed)

**COLUMN A (40%) — Loan Summary (Scrollable, Read-Only)**
Section headers: Inter Semibold 13px, brand-primary, uppercase letter-spacing. Dividers: 1px neutral-200. Eligible Limit box: brand-light bg, 2px left border success-500, Roboto Mono for amounts. "At Limit" warning: amber pill. Prior loan table: compact body-sm. Document "View ↗" links: open in right-side preview drawer (420px) without leaving screen.

**COLUMN B (35%) — Appraisal Note (Scrollable)**
Dark green header band (48px, brand-primary, white text) — anchors as the "official document." Eligibility checklist: alternating row shading. Risk rating badge: large, `🟢 LOW RISK` / `🟡 MEDIUM` / `⚠ HIGH`. Credit Manager recommendation box: `#FDFAF4` paper tone bg, 2px left border brand-secondary, **Georgia serif font** for the quoted recommendation text — makes it feel like a signed document.

Borderline detection: if any eligibility item is amber/red, entire Column B header strip shifts from dark green → amber, warning SC before they start reading.

**COLUMN C (25%) — Decision Panel (STICKY, Full Height, Never Wider Than 25%)**

Column C is the action area. The evidence (Columns A and B) should always dominate the visual field. SC must read before they decide.

Authority section (top): Co-signer pills per loan type. `● Signed`: success-500 dot. `○ Pending`: warning-500 dot. `[You]` tag on current user's pill.

**7-Point Scrutiny Checklist (hard-coded from SOP §3.1 — all must be ✓ before decision buttons activate):**
1. Eligibility Verified
2. Loan Amount Within Permissible Limits
3. Purpose Aligned with Company Objectives
4. Companies Act Compliance Passed
5. Past Borrowing History Reviewed
6. Risk Assessment Considered
7. Documentation Complete

Checklist interaction:
- Unchecked: neutral-700, plain checkbox
- Hover: brand-secondary checkbox outline, brand-light bg row tint
- Checked: success-500 filled ✓, success-700 text, `#F0FDF4` row bg
- Each item: expandable remarks field (chevron right)
- ✗ on any item: disables Approve, forces Reject or Return; notes field becomes mandatory
- Progress bar fills success-500 as items checked

**The Three Decision Buttons — LARGEST INTERACTIVE ELEMENTS IN THE ENTIRE PRODUCT:**
When disabled: neutral-200 bg, neutral-400 text, "Complete all 7 checklist items to enable" tooltip.
When enabled (7/7): simultaneous animation into active state — not one by one. This is the deliberate moment.
- Approve: `#166534` bg, white text, `CheckCircle` icon (20px filled)
- Reject: `#7F1D1D` bg, white text, `XCircle` icon (20px filled)
- Return: `#1E3A5F` bg, white text, `ArrowBendUpLeft` icon

Selected card: 3px inset ring + `transform: scale(1.02)`. Other two: fade to 40% opacity.

#### SC-2 — Submission Confirmation Modal (Point of No Return)
- Backdrop: `rgba(0,0,0,0.60)` — heavier than standard
- Modal width: 520px
- Header band (48px): colour-coded by decision
- "This action cannot be undone." in Inter Medium 13px, error-500
- **[Confirm & Record →] button: 3-second enforced delay** (progress ring filling around button, 3px track). This is intentional friction — prevents misclicks. 🔴 Critical: this delay is mandatory, not optional UX polish.

**Post-decision success state:** Large success icon, confirmation details, auto-actions list (CS notified ✓, Farmer notification queued ✓, Register updated ✓).

#### SC-3 — Joint Approval Screen (Loans > ₹5L)
Gold-500 banner: "JOINT APPROVAL REQUIRED — AMOUNT EXCEEDS ₹5,00,000." Signatory status strip. First signatory view shows their recorded decision + "Withdraw" ghost (available within 24hr). Second signatory view shows first signatory's checklist notes + their own independent 7-point checklist.

#### SC-4 — Special Cases (Director / Relative Borrower)
Gold-500 bordered card with vertical step tracker. Affected director's account: shows blocked view screen. Participating SC members labeled. Upload GM Resolution gate.

#### SC-7 — Portfolio Health & Exposure
s.186 capacity progress bar: success-500 (≤70%), warning-500 (70–84%), error-500 (≥85%). At 85%: orange advisory banner across all SC screens. At 100%: red "Lending Suspended" banner locks all new approvals. NBFC test: dual gauge bars (Financial Assets ratio + Income ratio), alert at 40%.

---

### ROLE 5: TREASURY / FINANCE TEAM (Finance Manager + Finance Controller)

**Design Soul:** This user thinks in transactions, not applications. Every screen should feel like a clean financial operations console — precise, fast, and audit-proof. Core anxiety: disbursing to the wrong account, posting an incorrect SAP entry, missing a repayment. Design must eliminate ambiguity at every step.

**Maker-Checker distinction:** Finance Manager (initiates) cannot authorize their own transactions. Finance Controller (authorizes) has 2FA OTP requirement.

#### T-1 — Finance Manager Dashboard
Cyan (`#0891B2`) role accent throughout. Page Header: "Treasury Operations" + current date. [+ Initiate Disbursement] in cyan.

**KPI Cards:**
- Pending Disbursement (with "N urgent >1 day" orange pill)
- Disbursed Today (with "All SAP entries posted" green pill)
- SAP Codes Pending
- Repayments Received Today

**Disbursement Queue table:** "Waiting" column colour-coded (green <4hr, amber 4-8hr, red >1 day). Cyan ghost [Initiate →] and [Awaiting CFC] buttons.

**Repayment Activity Feed:** Timestamp | Name + Loan ID | Amount (mono-md) | UTR (mono-sm) | [Post to SAP] action chip.

**Financial Snapshot Charts:** Disbursements vs Repayments 12-month line chart (cyan = disbursements, green = repayments). Outstanding Portfolio Split donut chart.

#### T-2 — Disbursement Processing (6-Step Workflow)

**Step Progress Navigator (sticky, 64px, full-width):** 6-node horizontal stepper. Active: cyan filled circle. Completed: success-500. Future: neutral-300. Each step has a 1-line hint in body-sm below the label.

**Step 1 — Pre-flight Checklist:**
5 mandatory gates (each 56px, structure: status icon + label + verified-by + timestamp + document link):
1. CS Signature on Checklist
2. Credit Manager Signature
3. Sanction Committee Approval
4. All 15 Documents Present
5. SAP Customer Code Created

✅ rows: success-100 bg + 3px success-500 left border. ✗ rows: error-100 bg + "Cannot proceed" note. All 5 must show ✅ before "Proceed" button enables.

Right panel (sticky): Loan Summary Card with security details (SH-4 status, blank cheque, PoA).

**Step 2 — Beneficiary Verification:** Bank details card showing masked account number (eye icon to unmask requires 2FA 🔴). "Matches cancelled cheque ✅" chip. SFPCL debit account selector.

**Step 3 — Payment Initiation (Finance Manager):** Disbursement amount read-only (pulled from Credit Sanction Register — hardcoded). Payment mode auto-selects (NEFT ≤₹2L, RTGS >₹2L). Transaction remarks pre-filled. Payment Preview Card (right, sticky): dual-entry SAP preview in `terminal-style dark card` (bg neutral-900, white Roboto Mono text, cyan Dr amounts, green Cr amounts).

**Step 4 — Authorization (Finance Controller View):** Authorization Queue table with waiting-time colour codes. Authorization Drawer (480px): transaction summary + document quick-links + **2FA OTP 6-box input (56×56px each)**. OTP timer countdown turning red <60s. [Authorize & Execute] success-500 | [Reject/Hold] error-100/500.

**Step 5 — SAP Entry Confirmation:** Terminal-style dark card (`#1A1A2E` bg). Dr/Cr lines in cyan-300/green-300. Confirmation checkbox required before button activates. [Report Discrepancy] ghost button with error text.

**Step 6 — Complete:** Pulse animation ring on checkmark. Transaction Reference + UTR displayed. Auto-actions confirmed checklist (Loan register updated ✓, Disbursement advice generated ✓, Farmer notification sent ✓).

#### T-3 — SAP Management
**T-3a Customer Code Setup:** Incoming request banner (info-100). Duplicate check on PAN entry → warning if existing code found. On creation: auto-generates SFCUST-XXXX format.

**T-3b SAP Entries Log:** Full audit table with Dr/Cr accounts, SAP doc numbers. Row expand shows full journal detail. Export CSV/PDF.

#### T-4 — Repayment Tracking
**T-4a Direct Payments:** Summary banner (neutral-900 bg, white, total collections + pending SAP entries). Two tabs: Awaiting SAP Entry | Posted Payments. Allocation Logic expandable info card: "Partial repayments → Principal first, then interest (SOP §6.1)."

**T-4b Subsidiary Deductions:** How It Works banner (tri-party flow explained). Reconciliation logic: match within ₹1 tolerance.

**T-4c Interest Accruals:** Three tabs — Monthly Accruals | Year-End Invoices | Capitalization Log. [Capitalize] action row (error-100 bg) triggers confirmation modal with new principal preview.

---

## PART 7 — CROSS-ROLE SHARED COMPONENTS

### Shared Component: Universal Audit Trail Panel
Right-drawer (480px), accessible via any Loan ID click. All events from all 6 stages captured.

Access by role:
- Credit Team: Full view
- CS: Full view
- SC/Treasury: Read-only
- Farmer: Restricted — no internal notes, risk scores, or SC deliberation comments; only public status transitions

Columns: Timestamp | Role | Actor Name | Stage | Action | Entity | Details

Frame naming: `SHARED-AuditTrail-FullView` | `SHARED-AuditTrail-FarmerView`

### Shared Component: Universal Member / Loan Profile Page
5 tabs: Personal Details | Shareholding | Loan History | KYC Documents | Compliance Notes (CS-only tab, not visible to Farmer).

Access: Credit Team (edit) | CS (KYC fields only) | SC/Treasury (read-only) | Farmer (own profile, limited).

Profile header: 48px avatar | Member Name (heading-md) | Active/Inactive badge | Member ID (mono-sm) | Folio | Crop + village.

### Shared Component: Director/Relative Special Case Banner
Gold-500 left border (4px), warning-100 bg, reusable. Used in: C-3 Appraisal Note, SC-4 Special Cases, CS-EC1.
Three related frames:
- `SHARED-DirectorCase-DetectionBanner`
- `SHARED-DirectorCase-GMResolution-Upload` (modal)
- `SHARED-DirectorCase-BlockedView` (what excluded Director sees)

### Shared Component: s.186 Lending Lock
System-wide banners when lending is suspended:
- SC screens: Full-width error-500 banner "⛔ LENDING SUSPENDED"
- Credit Team screens: Warning-500 banner
- Farmer portal: Application received but shows "Hold Queue" status state

### Status Badge Pill System (Unified)
| Status Label | Background | Text | Usage |
|---|---|---|---|
| Application Received | info-100 | info-500 | Stage 1 |
| Under Assessment | warning-100 | warning-500 | Stage 2 |
| Pending Approval | warning-100 | `#D97706` | Stage 3 |
| Docs Preparation | info-100 | info-500 | Stage 4 |
| Disbursed | success-100 | success-500 | Stage 5 |
| Active | success-100 | success-500 | Stage 6 |
| Closed / NOC Issued | neutral-200 | neutral-700 | Closed |
| Rejected | error-100 | error-500 | Any stage |
| Returned | warning-100 | warning-500 | Any stage |
| Defaulted | error-100 | `#991B1B` | Stage 6 |
| Extension Granted | gold bg/10% | gold-500 | Stage 6 |
| Special Case ⚠️ | gold-500 bg | white | Stage 3 |

---

## PART 8 — AUTHENTICATION FLOWS

### A-1 — Login Page (1440×900, split-screen 50/50)
Left panel (brand-primary bg): Sahyadri Farms logo | Line-art illustration (farmer receiving digital payment) | 3 feature chips | WhatsLoan + tagline. Right panel (white): Language tabs | Role Selector (5 pills: Farmer/Credit Team/CS/SC/Finance) | Mobile + OTP or Username/Password toggle | Checkbox "Remember device".

Role selector changes left panel illustration to match role persona.

### A-2 — OTP Verification
6-input OTP boxes (48×48px each, 8px gap), 60-second countdown + "Resend OTP" (greyed until end). Auto-submits on 6th digit.

### A-3 — Password Reset
Step 1: Mobile + OTP | Step 2: New Password + Confirm with strength meter (4-segment bar, green checkmarks per rule).

---

## PART 9 — SUPER ADMIN

### A-1 User Management
Role × Feature permission matrix view (toggle grid). Invite New User: multi-step form.

### A-2 Audit Log (Immutable)
Timestamp | User | Action | Entity | Old Value | New Value | IP Address. Filters: User, Action Type, Date Range, Entity.

### A-3 System Configuration
- Loan Parameters: Scale of Finance per acre | Share valuation percentage (10% default, "Board approval required to change" tooltip)
- Interest Rate Management: base rate + current effective rate + change log
- Rate Change Broadcast Modal: "Changing rate from 12% to 13% will affect [47] active loans. Farmer notifications will be sent automatically. CS intimation letters must be prepared manually. Confirm?" — with affected-loan count prominently displayed
- DPD Thresholds: bucket boundary configuration

---

## PART 10 — DATA VISUALIZATION GUIDELINES

### Chart Style
**Portfolio Donut:** 3 segments: Performing (success-500) | At Risk (warning-500) | Default (error-500). Center: total ₹ amount.

**DPD Aging Bar:** Grouped bars per quarter. Colors: 1–2yr (warning-500) | 2–3yr (orange) | 3yr+ (error-500).

**Monthly Disbursement vs Repayment Line:** Two lines, area fill below at 10% opacity. Grid lines: neutral-200. Hover tooltips with exact values.

**Application Pipeline Funnel:** Horizontal funnel from Received → Disbursed, width proportional to count, conversion % between stages.

**Chart containers:** White card bg, shadow-sm, radius-xl. Chart title heading-sm left-aligned. "Export" icon top-right of each chart.

---

## PART 11 — FORM DESIGN STANDARDS

### Input States
- Default: border-1 neutral-300, bg white, placeholder neutral-400
- Focus: border-2 brand-primary, ring-2 brand-light (4px spread, 2px blur)
- Error: border-2 error-500, bg error-100/20%, error message below (body-sm + Phosphor Warning icon)
- Disabled: neutral-200 border, neutral-100 bg, neutral-400 text, cursor not-allowed
- Read-only: neutral-50 bg, neutral-700 text, Phosphor Lock icon at right edge

### Multi-Step Form Progress
- Current step: brand-primary filled circle (20px), brand-primary text (600)
- Completed: brand-primary filled + checkmark
- Future: neutral-300 ring, neutral-400 text
- Progress line: fills brand-primary left-to-right as steps complete

---

## PART 12 — RESPONSIVE BEHAVIOR

| Breakpoint | Width | Layout |
|---|---|---|
| Desktop XL | 1440px+ | Full layout, expanded sidebar |
| Desktop | 1280px | Full layout, collapsible sidebar |
| Laptop | 1024px | Sidebar auto-collapsed to 64px |
| Tablet | 768px | Bottom tab nav replaces sidebar |
| Mobile | 375px | Single-column, drawer nav, simplified tables |

**Mobile-specific:**
- Farmer portal: Full mobile-first treatment
- Admin/Internal roles: Tablet + desktop only
- Tables → card-per-row layout on mobile
- Multi-step forms → one step per screen on mobile
- Minimum touch target: 48px height for all CTAs

---

## PART 13 — ACCESSIBILITY & LOCALIZATION

### WCAG 2.1 AA
- Color contrast: 4.5:1 minimum for body text, 3:1 for large text
- Focus states: 3px brand-primary ring on all interactive elements
- Errors: never rely on color alone — always text + icon
- Screen reader: all icons with aria-labels, all form fields with labels
- Keyboard navigation: logical tab order

### Localization
- Language toggle: [EN] [मराठी] [हिंदी] — persists across sessions
- Marathi/Hindi: Noto Sans Devanagari added to font stack for body text only; headings remain Inter
- Numbers: Indian numbering system (₹1,42,500)
- Dates: DD/MM/YYYY throughout
- Pulsing animations: must respect `prefers-reduced-motion`

---

## PART 14 — FIGMA FILE STRUCTURE

```
📄 0. Cover Page
📄 1. Design System (Tokens, Typography, Spacing, Icons, Grid)
📄 2. Components Library (Atoms → Molecules → Organisms)
📄 3. Auth Flows
📄 4. Borrower Portal (FAR- frames)
📄 5. Credit Assessment Team (C- frames)
📄 6. Company Secretary / Compliance (CS- frames)
📄 7. Sanction Committee (SC- frames)
📄 8. Treasury / Finance Team (T- frames)
📄 9. Admin (A- frames)
📄 10. Cross-Role Integration (SHARED- frames, missing screens, integration notes)
📄 11. Mobile Responsive (MOB- frames, key flows)
📄 12. Prototype Flows (cross-role connected flows)
```

### Frame Naming Convention
`[Role]-[ScreenCode]-[ScreenName]-[State]`
Examples:
- `FAR-F1-Dashboard-ActiveLoan`
- `CS-2-DocumentWorkspace-SH4Tab-PhysicalShares`
- `SC-2-ReviewScreen-Checklist-Complete`
- `T-2-Disbursement-Step4-AuthorizeView-OTPModal`
- `SHARED-StageTracker-Stage3-Active`
- `SHARED-DirectorCase-DetectionBanner`

### Component Naming
- Follow Atomic Design: `Atom/Button/Primary/Default`, `Atom/Badge/Status/Approved`
- Use Figma Variants for all state permutations
- Auto-layout on all components — no manual spacing
- All colors, typography, and effects as Figma Styles — no hard-coded values

---

## PART 15 — ANNOTATION STANDARDS

| Color | Type | When to Use |
|---|---|---|
| 🟡 Yellow | Business Rule | SOP references, eligibility logic, calculation rules |
| 🔵 Blue | Technical / API | API endpoint notes, data sources, integration points |
| 🟠 Orange | Edge Case | Special conditions, exception flows, rare scenarios |
| 🟣 Purple | Accessibility | Focus states, ARIA labels, keyboard navigation |
| 🔴 Red | Critical | Must-not-miss requirements, hard system constraints |

---

## APPENDIX: KEY NUMBERS & BUSINESS RULES FOR DESIGNER REFERENCE

| Parameter | Value | Design Implication |
|---|---|---|
| Loan ID format | LO00000001 (sequential) | Always mono-md, never reuse |
| Credit Assessment TAT | 2 working days | Show amber warning if breached |
| Max loan limit (shares) | Shares × (30% × NAV/share) | Current: ₹200/share effective limit |
| Max loan limit (land) | Land (acres) × ₹20,000 | FY capped |
| Eligible amount | Lower of above two | Hard rule — enforce in all calculators |
| Approval authority ≤₹5L | CFO + 1 Director | Blue pill |
| Approval authority >₹5L | CFO + 2 Directors | Purple pill |
| Grace period on default | 3 months from due date | Show countdown |
| Extension (non-intentional) | +1 year | Gold "Extension Granted" pill |
| DPD bucket 1 | 1–2 years | Amber color |
| DPD bucket 2 | 2–3 years | Orange color |
| DPD bucket 3 | 3+ years | Red, non-recoverable |
| KYC refresh cycle | Every 2 years | Show re-KYC due date, alert at 30 days |
| Record retention | 8 years post-closure | Archive trigger on NOC issue |
| Stamp paper value | ₹500 | PoA + Loan Agreement each |
| Witness requirement | Must be SFPCL shareholder | Validate folio number inline |
| Partial repayment order | Principal first, then interest | Hardcoded — no user override |
| Interest capitalization | If unpaid by 30 April | Adds to principal for next FY |
| Interest rate display | Always with "(Floating)" label | All roles, all screens |
| NOC triggers | Archive clock start | 8 years from NOC date |

---

## TOTAL FRAME COUNT (ESTIMATE)

| Role | Desktop Frames | Mobile/Tablet | Total |
|---|---|---|---|
| Auth Flows | 5 | — | 5 |
| Farmer Portal | ~35 | ~15 | ~50 |
| Credit Team | ~18 | ~4 | ~22 |
| Compliance/CS | ~22 | ~4 | ~26 |
| Sanction Committee | ~28 | ~5 | ~33 |
| Treasury/Finance | ~22 | — | ~22 |
| Super Admin | ~6 | — | ~6 |
| Shared/Cross-Role | ~25 | ~6 | ~31 |
| **Total** | **~161** | **~34** | **~195** |

---

*SFPCL WhatsLoan — Master Figma Design Prompt v2.0*
*Synthesised from: Design Brief + 5 Role Deep-Dive Prompts + Cross-Role Integration Document*
*Reference: SOP_SFPCL_LOANDISBURSEMENT v1.0 | Platform v1.0*
