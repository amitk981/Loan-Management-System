// Single source for the 6 SOP stage labels lives in lib/loanState (the state machine).
import { STAGES } from '../lib/loanState';
export const loanStages = STAGES;

export const auditTrailEvents = [
  ['10 Jun 2026 · 09:12', 'Farmer', 'Ramesh Patil', 'Stage 1', 'Application submitted', 'LO00000047', 'Reference issued and visible to Credit Team'],
  ['10 Jun 2026 · 09:17', 'Credit Officer', 'Amit Kulkarni', 'Stage 1', 'Application reference issued', 'LO00000047', 'New — Unreviewed inbox row created'],
  ['10 Jun 2026 · 12:40', 'Credit Manager', 'Amit Kulkarni', 'Stage 2', 'Submitted to Sanction Committee', 'LO00000047', 'Appraisal note locked after confirmation'],
  ['10 Jun 2026 · 14:05', 'Sanction Committee', 'S. Nair', 'Stage 3', 'Loan sanctioned', 'LO00000047', '7-point checklist complete; register updated'],
  ['10 Jun 2026 · 15:20', 'Company Secretary', 'Vikram Kulkarni', 'Stage 4', 'Document workspace opened', 'LO00000047', 'PoA → Tri-Party → SH-4 → Term Sheet flow started'],
  ['10 Jun 2026 · 16:30', 'Director', 'P. Desai', 'Stage 4', 'Director checklist sign-off', 'LO00000047', 'Final disbursement checklist signed'],
  ['10 Jun 2026 · 17:00', 'Finance Manager', 'Rajesh Kulkarni', 'Stage 5', 'Payment initiated', 'LO00000047', 'Maker action; sent to CFC queue'],
  ['10 Jun 2026 · 17:20', 'Finance Controller', 'CFC', 'Stage 5', 'Payment authorized', 'LO00000047', '2FA OTP completed'],
  ['10 Jun 2026 · 17:35', 'Finance Manager', 'Rajesh Kulkarni', 'Stage 5', 'SAP disbursement entry posted', 'LO00000047', 'SAP Doc 1400000234; farmer notified'],
  ['11 Jun 2026 · 10:42', 'Finance Manager', 'Rajesh Kulkarni', 'Stage 6', 'SAP repayment entry posted', 'LO00000031', 'Repayment confirmed; new balance ₹1,17,500'],
  ['12 Jun 2026 · 11:15', 'Company Secretary', 'Vikram Kulkarni', 'Stage 6', 'NOC issued', 'LO00000031', 'NOC delivered to farmer documents'],
  ['12 Jun 2026 · 15:10', 'Company Secretary', 'Vikram Kulkarni', 'Stage 6', 'Security returned', 'LO00000031', 'SH-4 and blank cheque returned'],
];

export const crossRoleNotifications = [
  { id: 'N-001', type: 'approval_required', priority: 'high', fromRole: 'Farmer', toRole: 'credit', loan: 'LO00000047', message: 'New application — Ramesh Patil — LO00000047 received', detail: 'Digital application submitted; appears in Credit Team inbox as New — Unreviewed.', cta: 'Review Application', route: 'credit-queue' },
  { id: 'N-002', type: 'approval_required', priority: 'high', fromRole: 'Credit Team', toRole: 'sanction', loan: 'LO00000091', message: 'New appraisal note ready — LO00000091 — Priya Shinde — ₹60,000', detail: 'Prepared by Amit Kulkarni; Days Waiting starts from stage entry timestamp.', cta: 'Review Application', route: 'sc-awaiting' },
  { id: 'N-003', type: 'document_action', priority: 'high', fromRole: 'Sanction Committee', toRole: 'compliance', loan: 'LO00000091', message: 'SC approved LO00000091 — begin documentation', detail: 'CS workspace auto-populated from application and appraisal note.', cta: 'Begin Documentation', route: 'cs-new-loan' },
  { id: 'N-004', type: 'approval_required', priority: 'high', fromRole: 'CS', toRole: 'sanction', loan: 'LO00000047', message: 'Document file complete — director checklist sign required', detail: 'CS signed Annexure H; second SC touchpoint per SOP §4.13.', cta: 'Sign Checklist', route: 'sc-final-signoff' },
  { id: 'N-005', type: 'system', priority: 'critical', fromRole: 'SC Director', toRole: 'treasury', loan: 'LO00000047', message: 'File released to Treasury — initiate disbursement', detail: 'All 5 Treasury pre-flight gates link to source records.', cta: 'Initiate Disbursement', route: 'treasury-disbursement' },
  { id: 'N-006', type: 'repayment', priority: 'medium', fromRole: 'Finance Manager', toRole: 'farmer', loan: 'LO00000031', message: 'Payment of ₹25,000 confirmed. Outstanding balance: ₹1,17,500.', detail: 'SAP Ref: 1400000235. Balance is updated after server-side SAP posting.', cta: 'View Updated Balance', route: 'farmer-payment-processing' },
  { id: 'N-007', type: 'compliance', priority: 'high', fromRole: 'Finance Manager', toRole: 'compliance', loan: 'LO00000031', message: 'LO00000031 — fully repaid — NOC eligible', detail: 'Principal Outstanding + Interest Outstanding = ₹0 after SAP posting.', cta: 'Issue NOC', route: 'cs-noc' },
  { id: 'N-008', type: 'info', priority: 'high', fromRole: 'CS', toRole: 'farmer', loan: 'LO00000031', message: 'NOC issued and delivered to your documents.', detail: 'SH-4 and security cheque return confirmation will follow from CS.', cta: 'Download NOC', route: 'farmer-noc-delivered' },
];

export const integrationRules = [
  ['CROSS-01', 'The 6-stage tracker is one shared component across roles; only labels and click behavior vary.'],
  ['CROSS-02', 'Loan IDs use Roboto Mono everywhere.'],
  ['CROSS-03', 'Loan status is real-time or max 5-minute polling; no stale role-specific state.'],
  ['CROSS-04', 'Director exclusion is enforced by routing/API, not only by UI.'],
  ['CROSS-05', 'Partial repayments apply to principal first, then interest.'],
  ['CROSS-07', 'Days Waiting = today minus stage-entry timestamp; it resets at each stage transition.'],
  ['CROSS-08', 'CS 15-document checklist and Treasury 5-gate pre-flight are visually distinct and owned by different roles.'],
  ['CROSS-10', 'Closed — NOC Issued is reflected across Farmer, Credit, CS, Treasury and SC records.'],
];
