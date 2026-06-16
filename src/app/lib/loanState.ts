// One home for loan status semantics (audit §F.1 + §G.6).
// Every status chip in the app resolves to one canonical state, which carries
// a stage (1-6 SOP stages) and a tone (the only place status colours are defined).

export type Tone = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'special';

/** The 6 SOP stages, in order (mirrors crossRoleData.loanStages). */
export const STAGES = [
  'Application Submitted',
  'Credit Assessment',
  'Sanction Approved',
  'Documentation',
  'Disbursed',
  'Closed',
] as const;

/** Canonical loan states (the state machine spine). */
export type LoanState =
  | 'draft' | 'submitted' | 'under_assessment' | 'returned'
  | 'appraised' | 'pending_sanction' | 'approved' | 'rejected'
  | 'documentation' | 'checklist_signed'
  | 'disbursement_pending' | 'disbursed' | 'active'
  | 'overdue' | 'grace' | 'extension' | 'non_recoverable' | 'recovery'
  | 'closed' | 'archived';

/** Which of the 6 stages each state belongs to. */
export const STAGE_OF_STATE: Record<LoanState, number> = {
  draft: 1, submitted: 1, returned: 1,
  under_assessment: 2, appraised: 2,
  pending_sanction: 3, approved: 3, rejected: 3,
  documentation: 4, checklist_signed: 4,
  disbursement_pending: 5, disbursed: 5,
  active: 6, overdue: 6, grace: 6, extension: 6, non_recoverable: 6, recovery: 6, closed: 6, archived: 6,
};

/** The single tone palette — derives every status chip's colours. */
export const TONE_STYLES: Record<Tone, { bg: string; text: string }> = {
  success: { bg: '#DCFCE7', text: '#166534' },
  warning: { bg: '#FEF3C7', text: '#92400E' },
  error: { bg: '#FEE2E2', text: '#991B1B' },
  info: { bg: '#DBEAFE', text: '#1E40AF' },
  neutral: { bg: '#EDEEF0', text: '#3D4450' },
  special: { bg: '#F3E8FF', text: '#7C3AED' },
};

/**
 * Maps every free-string status label used across the app to a tone.
 * This collapses the previous 96 ad-hoc bg/text colour pairs into 6 tones,
 * so status colour now has exactly one source of truth.
 */
export const STATUS_TONE: Record<string, Tone> = {
  // success / good
  Complete: 'success', 'Good Standing': 'success', Live: 'success', Active: 'success',
  'Active Member': 'success', Disbursed: 'success', Approved: 'success', Confirmed: 'success',
  Credited: 'success', Available: 'success', Executed: 'success', Verified: 'success',
  Matched: 'success', Posted: 'success', 'SAP Posted': 'success', Done: 'success',
  'On track': 'success', 'FY25 done': 'success', Paid: 'success', Resolved: 'success',
  'Fully Repaid': 'success', 'Transfer Complete': 'success', 'Fresh KYC': 'success', Low: 'success',
  // warning / pending
  'Under Assessment': 'warning', 'Pending Approval': 'warning', 'Awaiting SC Approval': 'warning',
  'On Hold': 'warning', Pending: 'warning', 'Pending Authorization': 'warning', 'Pending Initiation': 'warning',
  'Pending Review': 'warning', 'Pending CS': 'warning', 'Action Required': 'warning', Unpaid: 'warning',
  Returned: 'warning', 'Extension Granted': 'warning', Annotated: 'warning', 'Re-KYC Due Soon': 'warning',
  Unmatched: 'warning', Unposted: 'warning', 'GM Required': 'warning', 'Due Soon': 'warning',
  'Awaiting Signature': 'warning', '<30 days': 'warning', '30-60 days': 'warning',
  '9 due this qtr': 'warning', 'Existing ID used': 'warning', Medium: 'warning',
  // error / blocked
  Incomplete: 'error', 'Incomplete — PAN missing': 'error', Overdue: 'error', Rejected: 'error',
  Defaulted: 'error', 'Non-Recoverable': 'error', Blocked: 'error', Due: 'error',
  'Re-KYC Overdue': 'error', 'Due Oct 15': 'error', High: 'error',
  // info / in-flight
  'Application Received': 'info', 'Under Processing': 'info', 'Docs Preparation': 'info',
  Sent: 'info', 'Under SC Review': 'info', 'CKYC Linked': 'info', Processing: 'info',
  Ready: 'info', 'Pending Auth': 'info', Open: 'info',
  // special / governance
  'Special Case': 'special', 'GM Approval Required': 'special',
  // neutral
  'N/A': 'neutral', 'Q2 Due Nov': 'neutral', Closed: 'neutral', 'NOC Issued': 'neutral',
  Immutable: 'neutral', 'SAP Code Pending': 'neutral', 'SAP Pending': 'neutral', 'Not Started': 'neutral',
  'Not Generated': 'neutral', Upcoming: 'neutral', Draft: 'neutral', No: 'neutral', Inactive: 'neutral',
  'Closed — NOC Issued': 'neutral', 'Ready for Disbursement': 'success', 'Ready for NOC': 'success',
};

export function toneFor(status: string): Tone {
  return STATUS_TONE[status] ?? 'neutral';
}

export function styleFor(status: string): { bg: string; text: string } {
  return TONE_STYLES[toneFor(status)];
}
