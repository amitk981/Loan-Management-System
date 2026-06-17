# WhatsLoan — Information Architecture Review

> **Type:** Information-architecture & navigation audit (companion to `Docs/UI_REDESIGN_SCORECARD.md` and `Docs/DESIGN_AUDIT_LEDGER.md`).
> **Scope:** navigation structure · routes · submenus · tabs · page hierarchy · user flows · dashboard shortcuts · breadcrumbs / page titles · mobile navigation · role/persona access.
> **Reviewed commit baseline:** `d70583e` (branch `main`). **Review date:** 2026-06-17.
> **Method:** read the live router (`src/app/routes.tsx`), the per-role nav config (`src/app/data/roleNav.ts`), the chrome (`Shell`/`Sidebar`/`Header`), every hub component, and traced each `?page=` key by hand. IA principles applied: navigation matches goals/mental-models; every menu item is a meaningful destination; top-level = product areas; submenus only when they reduce complexity and map to real destinations; tabs for sibling views in one context; statuses/filters are not navigation unless URL-addressable; routes/titles/breadcrumbs/active-state stay consistent; mobile preserves the same IA with simpler presentation; role nav shows only what a role needs.
>
> **STATUS — pass complete (2026-06-17):** Pass I fixed IA-01 (active-state), IA-02 (id-less shortcuts), IA-05 (breadcrumbs), IA-06 (partial). **Pass II** then delivered the deferred items: IA-03 inner tabs are now URL-addressable (`?tab=`, survives refresh + back/forward), irreversible Approve/Reject now require confirmation, empty/not-found states were broadened, and admin rows carry identity when resolvable. Per-item resolution is in §4, ledger §20–§21, and the implementation log. Build green after both passes; behaviour live-verified on the dev server.

---

## 0. How navigation actually works here (the model under audit)

There is **no React-Router route tree for screens.** `routes.tsx` mounts one `Root` for `/` and `*`; everything else is a **custom URL-param router**:

- The destination lives in `?page=<key>` (≈91 keys). An optional `?id=<loanId>` carries loan identity.
- `navigate(target)` supports a `page::id` convention (`onNavigate('loan-file::LO00000089')`), `pushState`s `?page=&id=`, and updates React state. A `popstate` listener restores both on back/forward.
- `rolePages[role]` is an allow-list; unknown/disallowed pages **silently redirect** to the role default (`replaceState`) — there is no 404/empty destination.
- The left **Sidebar** is config-driven from `roleNav.ts` (`navByRole`), capped at a 5-item spine per role; some items carry `children` (submenu) that expand inline.
- **Hub pages** (`CreditOperations`, `ComplianceOperations`, `SanctionOperations`, `TreasuryOperations`, `DocumentWorkspace`, `KYCManagement`) map *many* `?page=` keys to *one* component and render a `WorkbenchTabs` strip. **Crucially, those tabs call `onNavigate` — so each tab is its own `?page=` value.** That means hub tabs are genuinely URL-addressable, survive refresh, and work with back/forward. This is the single most important (and correct) IA decision in the codebase.

**Implication for this audit:** the classic "tab not in the URL / refresh loses tab / back doesn't traverse tabs" failure mode is **already avoided for every hub tab**, because the hub tabs are routes. The real defects are narrower and are listed in §2.

---

## 1. Current navigation map

`Type` legend — **A** real route · **B** deep-linked tab/state (URL-addressable) · **C** internal page tab (local state) · **D** filter/status/tracker · **E** remove/flatten. `Unique?` = does this destination render something a sibling doesn't.

### 1.1 Farmer (Borrower / FPC)
| Item | Route (`?page=`) | Component | Type | Unique? | Problems |
|---|---|---|---|---|---|
| My Dashboard | `farmer-dashboard` | FarmerDashboard | A | Yes | — |
| Apply for Loan | `farmer-apply` | LoanApplication | A | Yes | — |
| My Loan ▸ Active Loan | `farmer-active-loans` | LoanStatus (tabbed) | A | Yes | Inner tabs (Overview/Docs/Repayment/Timeline) are local state — Option C, acceptable |
| My Loan ▸ Key Facts | `farmer-key-facts` | KeyFacts | A | Yes | — |
| My Loan ▸ Loan History | `farmer-loan-history` | LoanStatus (history branch) | A | Yes | — |
| My Loan ▸ My Documents | `farmer-documents` | LoanStatus (documents branch) | A | Yes | — |
| My Loan ▸ NOC & Closure | `farmer-noc` | LoanStatus (NOC branch) | A | Yes | — |
| Make Payment | `farmer-repayment` | RepaymentScreen | A | Yes | — |
| Support | `farmer-support` | SupportGrievance | A | Yes | — |

Farmer parent "My Loan" highlights for all 5 children (they are listed as `children`). **Clean.**

### 1.2 Credit Assessment Team
| Item | Route | Component | Type | Unique? | Problems |
|---|---|---|---|---|---|
| Dashboard | `credit-dashboard` | CreditDashboard | A | Yes | — |
| Pipeline | `pipeline` | Pipeline (shared) | A | Yes | — |
| Application Inbox ▸ New Applications | `credit-queue` | ApplicationQueue | A/B | Yes | — |
| Application Inbox ▸ Returned / Incomplete | `credit-returned` | CreditOperations | B | Yes | — |
| Application Inbox ▸ SC Tracker | `credit-sc-queue` | CreditOperations | B | Yes | — |
| Application Inbox ▸ Manual Entry | `credit-manual-entry` | CrossRoleScreens | A | Yes | — |
| Appraisal Note | `credit-review` | ApplicationReview | A | Yes | — |
| Registers & Reports (hub) | `credit-register` | CreditOperations | A | Yes | hub also hosts tabs → `credit-active-loans`, `credit-dpd`, `credit-defaults`, `credit-mis`, `credit-rejected`, `credit-exceptions` (all B, URL-addressable). **IA-01: none of these highlighted the sidebar** before this pass |
| (intake tab) Pending Appraisal | `credit-pending` | CreditOperations | B | Yes | reachable via intake tab strip; **IA-01** active-state |
| (deep link) Repayment Follow-up / Interest Invoices / Analytics / Member Search / Member Profile / All Apps | `credit-repayments`, `credit-interest-invoices`, `credit-analytics`, `credit-search-member`, `credit-member-profile`, `credit-all-apps` | CreditOperations | B | Yes | reachable from dashboard cards / global search; **IA-01** active-state |

### 1.3 Compliance (Company Secretary + officer)
| Item | Route | Component | Type | Unique? | Problems |
|---|---|---|---|---|---|
| CS Dashboard | `cs-dashboard` | ComplianceDashboard | A | Yes | — |
| Pipeline | `pipeline` | Pipeline | A | Yes | — |
| Document Queue ▸ All Pending | `cs-queue` | DocumentWorkspace | A/B | Yes | — |
| Document Queue ▸ Workspace Hub | `cs-workspace` | DocumentWorkspace | B | Yes | — |
| KYC & CDSL Pledge ▸ All Members | `cs-kyc` | KYCManagement | A/B | Yes | — |
| KYC & CDSL Pledge ▸ CDSL Pledge Tracker | `cs-cdsl` | ComplianceOperations | B | Yes | — |
| Registers & Operations (hub) | `cs-loan-register` | ComplianceOperations | A | Yes | hub tabs → `cs-sanction-register`, `cs-noc`, `cs-calendar`, `cs-stamp`, `cs-grievance`, `cs-reports` (B). **IA-01** |
| (queue/doc tabs) Awaiting Prep / Review / Sign-off / PoA / Tri-Party / SH-4 / Term Sheet / Agreement | `cs-awaiting-prep`, `cs-awaiting-review`, `cs-signoff`, `cs-poa`, `cs-triparty`, `cs-sh4`, `cs-termsheet`, `cs-agreement` | DocumentWorkspace | B | Yes | **IA-01** |

### 1.4 Sanction Committee (CFO + Directors)
| Item | Route | Component | Type | Unique? | Problems |
|---|---|---|---|---|---|
| SC Dashboard | `sc-dashboard` | SanctionDashboard | A | Yes | — |
| Pipeline | `pipeline` | Pipeline | A | Yes | — |
| Approval Queue ▸ Awaiting Approval | `sc-awaiting` | SanctionOperations | A/B | Yes | — |
| Approval Queue ▸ Awaiting My Sign | `sc-my-sign` | SanctionOperations | B | Yes | — |
| Approval Queue ▸ Joint Approvals | `sc-joint` | ApprovalScreen | B | Yes | — |
| Approval Queue ▸ Special Cases | `sc-special-cases` | SanctionOperations | B | Yes | — |
| Approval Queue ▸ Returns | `sc-returns` | SanctionOperations | B | Yes | — |
| Approval Queue ▸ Final Sign-off | `sc-final-signoff` | CrossRoleScreens | A | Yes | — |
| Registers (hub) | `sc-register` | SanctionOperations | A | Yes | hub tabs → `sc-exceptions`, `sc-board`, `sc-security-invocation` (B). **IA-01** |
| Oversight ▸ Portfolio Health / Exposure & Limits / DPD Summary / Recovery Actions / Policy Settings | `sc-health`, `sc-exposure`, `sc-dpd`, `sc-default-escalations`, `sc-policy` | SanctionOperations | B | Yes | listed as `children` → already highlight |

### 1.5 Treasury (CFC + Sr Manager–Finance)
| Item | Route | Component | Type | Unique? | Problems |
|---|---|---|---|---|---|
| Dashboard | `treasury-dashboard` | TreasuryDashboard | A | Yes | — |
| Pipeline | `pipeline` | Pipeline | A | Yes | — |
| Disbursements ▸ Pending / Authorizations / Disbursed Today / Process Flow | `treasury-pending`, `treasury-auth`, `treasury-today`, `treasury-disbursement` | TreasuryOperations / DisbursementScreen | B | Yes | listed as `children` → highlight |
| SAP Management ▸ Customer Codes / SAP Entries Log / Ledger Summary | `treasury-sap-codes`, `treasury-sap-log`, `treasury-ledger` | TreasuryOperations | B | Yes | listed as `children` → highlight |
| Repayments & Finance (hub) | `treasury-incoming` | TreasuryOperations | A | Yes | hub tabs → `treasury-deductions`, `treasury-interest`, `treasury-reconciliation`, `treasury-reports`, `treasury-exports` (B). **IA-01** |

### 1.6 Admin
| Item | Route | Component | Type | Unique? | Problems |
|---|---|---|---|---|---|
| Control Center | `admin-portfolio` | PortfolioOverview | A | Yes | portfolio rows opened a generic borrower page without identity — **IA-02 (partial; see §2)** |
| User Management | `admin-users` | UserManagement | A | Yes | — |
| Audit Log | `admin-audit` | AuditLog | A | Yes | — |
| Configuration | `admin-config` | SystemConfig | A | Yes | — |
| Compliance Monitors ▸ s.186 Limits / NBFC Monitor / Integration Hub | `admin-section186`, `admin-nbfc`, `integration-overview` | SystemConfig / CrossRoleScreens | A | Yes | listed as `children` → highlight |

### 1.7 Cross-role / utility (reachable by all back-office roles)
| Item | Route | Component | Type | Notes |
|---|---|---|---|---|
| Loan File (shared) | `loan-file` (+`?id=`) | LoanFile | A | One object, 7 role-gated **internal** tabs (Option C local state) |
| Notifications | `notifications-center` | NotificationsCenter | A | — |
| My Workspace / Profile | `user-profile` | UserProfile | A | — |
| Borrower Lookup | `member-loan-profile` | MemberLoanProfile (farmer → redirected to profile) | A | — |

---

## 2. IA problems found

> Severity: **Critical / High / Medium / Low**. IDs `IA-0x` are cross-referenced by the ledger and implementation log.

### IA-01 — Active nav state does not match the destination on hub tabs · **High** · FIXED
Every back-office hub exposes sibling views as `WorkbenchTabs` whose page-keys are *not* the sidebar door's own key and *not* listed as `children`. `Sidebar.isItemActive()` only matched `item.key` or a child key, so when you stood on `credit-dpd`, `cs-noc`, `treasury-reconciliation`, `sc-exceptions`, etc. (all reached by clicking a tab on the hub you arrived through), **no sidebar item was highlighted at all.** The page title and breadcrumb were correct, but the left nav lost its "you are here" marker — a textbook violation of *visibility of system status* and *consistency of active state*. Affected: credit (6+ tabs), compliance (12+), sanction (3+), treasury (5+).
- **Fix:** added an optional `match: string[]` to `NavItem`; `isItemActive` now also returns true when `item.match` includes the active page. Populated `match` on every hub door with its full set of tab/deep-link page-keys (`roleNav.ts`). The correct door now stays lit on every hub tab and deep link — desktop *and* the mobile bottom bar (which renders the same `navByRole`).

### IA-02 — Dashboard/list shortcuts open the loan file without identity · **High** · FIXED
After the loan-store work (DA-001) the Pipeline carries the loan id (`loan-file::<id>`), but the **Credit Registers/Active-Loans tables still called `onNavigate('loan-file')` with no id** (`CreditOperations.tsx:108` and `:247`). Result: clicking *any* row's "Open File" silently opened the fallback loan (`LO00000090`, Ganesh Thorat) instead of the row you clicked — a misleading shortcut.
- **Fix:** both row actions now navigate with the row id (`loan-file::${row.id}`). Rows whose id exists in the loan store (e.g. `LO00000018`, `LO00000083`, `LO00000085`, `LO00000089`, `LO00000091`) now open the *correct* loan; ids not yet seeded into the store fall back gracefully (no crash). *Caveat:* `creditData.loanRegister` and `mockData.mockLoans` (admin) are legacy datasets only partially aligned to `loanStore` — see IA-08.

### IA-03 — Inner page tabs are now URL-addressable via `?tab=` · **Done (pass II, 2026-06-17)**
Originally accepted: two screens kept their inner tabs in React local state —
- `LoanStatus` (farmer): Overview / Documents / Repayment / Timeline.
- `LoanFile` (shared): Application / Appraisal / Sanction / Documents / Disbursement / Repayment / Audit.

These are Option C internal tabs within one loan context, so living in local state was *allowed* — but it cost deep-linking, refresh survival, and back/forward traversal. **Pass II promoted them to URL-addressable state:** the URL-param router gained a third segment (`page::id::tab` → `?tab=`, popstate-restored), and both screens now drive their tab from the URL. The active tab label flows into the LoanFile breadcrumb/subtitle so title and breadcrumb match the destination. Verified live: `?tab=sanction` survived re-auth, tab clicks update the URL, and browser back restored both the URL and the selected tab. See ledger §21 / implementation log pass II.

### IA-04 — Page titles vs breadcrumbs · **Low** · consistent
Audited all `breadcrumbs={…}` call-sites and `pageTitles` in `roleNav.ts`. Titles and breadcrumbs **match their destinations**; hubs derive both from a single `pageCopy[activePage]` map, so a tab change updates title + breadcrumb together. No mismatch found. (Minor: `pageTitles` in `roleNav.ts` is an incomplete lookup table used only for header search hints; it is not the title source for hub pages, so its gaps are harmless.)

### IA-05 — Breadcrumbs were not navigable · **Medium** · FIXED
The `Header` rendered breadcrumbs as inert `<span>`s. The last crumb should stay static (you are there), but ancestor crumbs like *Pipeline*, *Dashboard*, *Credit Assessment*, *My Loans*, *Notifications* are real destinations and should be clickable up-navigation (Nielsen *user control & freedom*; standard breadcrumb behavior).
- **Fix:** `Header` now maps known ancestor crumb labels → a `?page=` target and renders those as buttons (keyboard-focusable, `onNavigate`); unmapped/last crumbs stay as text. No call-site changes — the existing `string[]` API is preserved.

### IA-06 — Many infrequent destinations are reachable only as hub tabs (recognition-over-recall) · **Medium (mitigated)**
Tasks such as Stamp Register, NOC Queue, Compliance Calendar, Grievances, Exception Register, Security Invocation live as tabs inside "Registers & Operations" with no sidebar signpost. Keeping the spine at 5 items is the right call (the prior pass deliberately collapsed 20 doors → 5), so the answer is **not** to re-add nav doors. Mitigations already present and verified: (a) global Header **search** indexes the hidden hub tabs; (b) hub landing pages list their tabs explicitly. The IA-01 fix further helps by keeping the parent door lit so users know which hub they are inside. Remaining recommendation (documented, not yet built): a hub landing "section index" card grid. 

### IA-07 — Unknown route → silent redirect, no 404/empty destination · **Low (accepted)**
A disallowed `?page=` is silently rewritten to the role default. Fine for a closed prototype; a real app would show a "not found / no access" state. Documented.

### IA-08 — Three loan datasets not fully keyed to the loan store · **Medium (data, not nav)**
`loanStore` (12 loans), `creditData.loanRegister` (14), and `mockData.mockLoans` (admin, 6) overlap only partially. This is why IA-02's fix is "correct-or-graceful-fallback" rather than "always-correct". Converging on the store as the single register is the right long-term move (continuation of DA-029); out of scope for an IA pass but logged so the shortcut behaviour is honest.

### Fake-depth checklist (explicitly tested)
| Check | Result |
|---|---|
| Multiple menu/submenu items → same route | **None.** Every child has a distinct `?page=`. |
| Submenu items open same page, only switch a tab | True **but intentional & URL-addressable** (each is its own route that renders a different hub tab) — this is Option B done correctly, not fake depth. |
| Tabs not reflected in URL | **None remaining.** Hub tabs were already `?page=`; LoanStatus/LoanFile inner tabs are now `?tab=` (IA-03 done). |
| Refresh loses selected tab | **None.** Hub tabs and the now-`?tab=` inner tabs all survive refresh. |
| Back/forward across tab changes | Works (popstate handler) for hub tabs **and** the inner `?tab=` tabs. |
| Active nav state ≠ visible page/tab | **IA-01** — fixed. |
| Dashboard shortcuts → generic page instead of specific state | **IA-02** — fixed (credit). Admin portfolio rows: see IA-08. |
| Mobile nav structure ≠ desktop | Same `navByRole` config drives both; mobile collapses to a bottom icon bar of the same 5 doors. Submenu children & sections are hidden on the narrowest breakpoint (≤480px) — reachable via search. Same IA, simpler presentation. **Consistent.** |
| Breadcrumb/title ≠ destination | None (IA-04); breadcrumbs now also navigable (IA-05). |

---

## 3. Recommended IA (by role) + rationale

The existing 5-item spine per role is sound and is **kept**. Recommendations are corrective, not structural.

- **All back-office roles:** the hub door must stay highlighted for every tab it owns → **implemented via `match[]`** (IA-01). Rationale: a tab is a sibling view *within* a hub context; the hub is the destination, the tab is the sub-state, so the hub door is the correct active marker.
- **Credit:** keep `Registers & Reports` as the single portfolio hub (Loan Register / Active Loans / DPD / Defaults / MIS / Rejected / Exceptions as tabs = Option B). Member Search & Loan Calculator stay out of the spine, reached via search/tools — correct. Row "Open File" must carry identity → **implemented** (IA-02).
- **Compliance:** keep Document Queue, KYC & CDSL, and Registers & Operations as the three working hubs. NOC/Calendar/Stamp/Grievance as register tabs = Option B (URL-addressable) — keep.
- **Sanction:** keep Approval Queue (decision tabs), Registers, and Oversight. Oversight children already highlight; Registers tabs now highlight via `match[]`.
- **Treasury:** keep Disbursements, SAP Management, Repayments & Finance. Finance tabs now highlight via `match[]`.
- **Admin:** unchanged spine; converge portfolio rows on the loan store later (IA-08).
- **Farmer:** unchanged — already clean.

### A–E classification of every distinctive item type
| Item / pattern | Decision | Why |
|---|---|---|
| Dashboards, Apply, Pipeline, Loan File, Calculator, Notifications, Profile, Manual Entry, Final Sign-off | **A — real route** | Distinct workflows/screens. |
| Hub tabs (DPD, NOC, Reconciliation, Exception Register, Term Sheet, SC tabs, …) | **B — deep-linked tab** | Sibling views in one hub context; already `?page=` addressable, survive refresh & back/forward. |
| LoanStatus & LoanFile inner tabs (Overview/Appraisal/…) | **B — deep-linked tab** (pass II) | Sub-views inside one loan context, now URL-addressable via `?tab=` so they survive refresh and back/forward. |
| Pipeline columns, DPD buckets, status pills, KYC "Due/Overdue", Returned/Incomplete | **D — filter/status/tracker** | Workflow conditions, not destinations. Pipeline = the tracker surface; statuses render through `StatusBadge`. (`credit-returned` keeps a route because it is a curated worklist, not a raw status filter.) |
| Duplicate nav doors for sibling registers (the old 20-door pattern) | **E — flattened** | Already collapsed to 5 doors + hub tabs by the prior pass; this audit confirms no fake depth remains. |

---

## 4. Implementation decisions (what actually changed in this pass)

| Decision | Detail | Files |
|---|---|---|
| **Real routes kept** | All `A` items above; no routes removed. | — |
| **Deep-linked tabs reinforced** | Hub tabs already were `?page=` routes; added `match[]` so the owning sidebar door reflects them. | `src/app/data/roleNav.ts`, `src/app/components/layout/Sidebar.tsx` |
| **Inner tabs promoted to `?tab=`** | LoanStatus & LoanFile inner tabs are now URL-addressable (pass II) — survive refresh + back/forward. | `routes.tsx`, `shared/LoanFile.tsx`, `farmer/LoanStatus.tsx` |
| **Filters/trackers** | Pipeline columns & DPD buckets stay as trackers/filters (not nav). No change needed. | — |
| **Removed / flattened** | Nothing new to flatten — the 5-door spine was already the flattened state; this pass confirms it and fixes its active-state. | — |
| **Shortcuts corrected** | Credit register/active-loan row "Open File" now carries the loan id. | `src/app/components/credit/CreditOperations.tsx` |
| **Breadcrumbs** | Ancestor crumbs are now clickable up-navigation. | `src/app/components/layout/Header.tsx` |

---

## 5. Verification checklist & results

| Check | How verified | Result |
|---|---|---|
| Unique destinations | Hand-traced every `?page=` key → component + render branch | ✅ no two nav/submenu items render an identical default view |
| Refresh keeps tab/state | Hub tabs are `?page=` → reload restores | ✅ for all hub tabs; ⚠️ Option-C inner tabs reset (accepted, IA-03) |
| Browser back/forward across tabs | `popstate` handler in `routes.tsx` restores page+id | ✅ |
| Active nav state matches destination | `isItemActive` now checks key/children/**match** | ✅ verified for credit/compliance/sanction/treasury hub tabs + deep links |
| Page title / breadcrumb accuracy | Reviewed all `breadcrumbs=` + hub `pageCopy` | ✅ match; breadcrumbs now navigable |
| Mobile nav consistency | Same `navByRole`; bottom bar at ≤480px | ✅ same IA, simpler presentation |
| Dashboard shortcut accuracy | Audited `onNavigate(` in dashboards + hubs | ✅ credit row "Open File" fixed; dashboard cards already target specific pages |
| Build | `npx vite build` | ✅ green after changes (see implementation log) |

**Honest residue (not blocking):** IA-03 (inner tabs not deep-linked), IA-06 (hub-tab discoverability — mitigated by search + lit parent door), IA-07 (no 404 state), IA-08 (legacy datasets not fully store-keyed). All are documented above and in the ledger; none introduces a navigation correctness bug.
