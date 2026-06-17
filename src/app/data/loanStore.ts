// One reactive, id-keyed home for every loan the prototype can open (audit DA-001/DA-002/DA-013/DA-029).
// Before this file, every list row and Pipeline card opened the SAME hardcoded `appraisalLoan`.
// Now navigation carries a loan id (?id=) and screens resolve the specific loan from here.
// A tiny pub/sub store lets role actions (approve / reject / disburse) mutate a loan so the
// Pipeline and Loan File reflect the decision — restoring "visibility of system status".

import { useSyncExternalStore } from 'react';

export interface Loan {
  id: string;
  borrower: string;
  category: string;
  purpose: string;
  source: string;
  risk: 'Low' | 'Medium' | 'High';
  shares: number;
  valuationPerShare: number;
  landAcres: number;
  scaleOfFinance: number;
  requested: number;
  /** 1-6 SOP stage (mirrors lib/loanState STAGE_OF_STATE). */
  stage: number;
  /** Free-string status that resolves through STATUS_TONE → StatusBadge. */
  status: string;
  /** Latest sanction decision, when one has been taken. */
  decision?: 'approved' | 'rejected';
  folio?: string;
  village?: string;
  crop?: string;
  nominee?: string;
}

const VPS = 200; // ₹200 per share — SOP §2.3 "10% of valuation" result (see ledger DA-010)
const SOF = 20000; // ₹20,000 per acre Scale of Finance cap — SOP §2.2

// Seed register. IDs and stages mirror the Pipeline columns so the board, the loan file,
// and every list now read one coherent register (DA-029).
const seed: Loan[] = [
  { id: 'LO00000091', borrower: 'Priya Shinde', category: 'Crop Production', purpose: 'Drip irrigation setup', source: 'Direct (RTGS/NEFT)', risk: 'Low', shares: 350, valuationPerShare: VPS, landAcres: 4, scaleOfFinance: SOF, requested: 60000, stage: 1, status: 'Incomplete', folio: 'SH-2847', village: 'Dindori, Nashik', crop: 'Grapes', nominee: 'Suresh Shinde (Father)' },
  { id: 'LO00000092', borrower: 'Sunil Pawar', category: 'Crop Production', purpose: 'Crop production & farm inputs', source: 'Direct (RTGS/NEFT)', risk: 'Low', shares: 700, valuationPerShare: VPS, landAcres: 7, scaleOfFinance: SOF, requested: 120000, stage: 1, status: 'Application Received', folio: 'SH-3190', village: 'Niphad, Nashik', crop: 'Tomato', nominee: 'Lata Pawar (Spouse)' },
  { id: 'LO00000089', borrower: 'Rajesh Patil', category: 'Crop Production', purpose: 'Crop production', source: 'Direct (RTGS/NEFT)', risk: 'Medium', shares: 900, valuationPerShare: VPS, landAcres: 6, scaleOfFinance: SOF, requested: 95000, stage: 2, status: 'Under Assessment', folio: 'SH-3011', village: 'Igatpuri, Nashik', crop: 'Mango', nominee: 'Vilas Patil (Father)' },
  { id: 'LO00000090', borrower: 'Ganesh Thorat FPC', category: 'Crop Production', purpose: 'Pack-house working capital', source: 'Tri-party subsidiary deduction', risk: 'Medium', shares: 2400, valuationPerShare: VPS, landAcres: 32, scaleOfFinance: SOF, requested: 480000, stage: 2, status: 'Under Assessment', folio: 'SH-5122', village: 'Ojhar, Niphad', crop: 'Tomato', nominee: 'Board resolution attached' },
  { id: 'LO00000086', borrower: 'Narayan FPC', category: 'Post-Harvest Activities', purpose: 'Cold storage expansion', source: 'Tri-party subsidiary deduction', risk: 'High', shares: 2200, valuationPerShare: VPS, landAcres: 30, scaleOfFinance: SOF, requested: 540000, stage: 3, status: 'Awaiting SC Approval', folio: 'SH-6004', village: 'Lasalgaon, Nashik', crop: 'Onion', nominee: 'Board resolution attached' },
  { id: 'LO00000085', borrower: 'Meena Joshi', category: 'Crop Production', purpose: 'Irrigation & infrastructure', source: 'Direct (RTGS/NEFT)', risk: 'Medium', shares: 1000, valuationPerShare: VPS, landAcres: 12, scaleOfFinance: SOF, requested: 180000, stage: 3, status: 'Under SC Review', folio: 'SH-4477', village: 'Dindori, Nashik', crop: 'Grapes', nominee: 'Ramesh Joshi (Spouse)' },
  { id: 'LO00000084', borrower: 'Anil Deshmukh', category: 'Crop Production', purpose: 'Crop production & farm inputs', source: 'Direct (RTGS/NEFT)', risk: 'Low', shares: 1200, valuationPerShare: VPS, landAcres: 14, scaleOfFinance: SOF, requested: 220000, stage: 4, status: 'Docs Preparation', folio: 'SH-2298', village: 'Sinnar, Nashik', crop: 'Pomegranate', nominee: 'Sunita Deshmukh (Spouse)' },
  { id: 'LO00000083', borrower: 'Kavita Rane', category: 'Farm Equipment Purchase', purpose: 'Farm equipment purchase', source: 'Direct (RTGS/NEFT)', risk: 'Low', shares: 1600, valuationPerShare: VPS, landAcres: 18, scaleOfFinance: SOF, requested: 300000, stage: 4, status: 'Awaiting Signature', folio: 'SH-3322', village: 'Chandwad, Nashik', crop: 'Grapes', nominee: 'Prakash Rane (Spouse)' },
  { id: 'LO00000082', borrower: 'Suresh More', category: 'Crop Production', purpose: 'Crop production', source: 'Direct (RTGS/NEFT)', risk: 'Low', shares: 800, valuationPerShare: VPS, landAcres: 9, scaleOfFinance: SOF, requested: 150000, stage: 5, status: 'Pending Initiation', folio: 'SH-2871', village: 'Yeola, Nashik', crop: 'Banana', nominee: 'Mangala More (Spouse)' },
  { id: 'LO00000047', borrower: 'Ramesh Patil', category: 'Crop Production', purpose: 'Crop Production', source: 'Tri-party subsidiary deduction', risk: 'Low', shares: 1000, valuationPerShare: VPS, landAcres: 12, scaleOfFinance: SOF, requested: 200000, stage: 6, status: 'Active', folio: 'SH-04821', village: 'Dindori, Nashik', crop: 'Grapes', nominee: 'Sunita Patil (Spouse)' },
  { id: 'LO00000018', borrower: 'Narayan Patil', category: 'Crop Production', purpose: 'Crop production', source: 'Direct (RTGS/NEFT)', risk: 'High', shares: 650, valuationPerShare: VPS, landAcres: 7, scaleOfFinance: SOF, requested: 120000, stage: 6, status: 'Overdue', folio: 'SH-1180', village: 'Kalwan, Nashik', crop: 'Onion', nominee: 'Sakhubai Patil (Spouse)' },
  { id: 'LO00000001', borrower: 'Ramesh Jadhav', category: 'Crop Production', purpose: 'Crop production', source: 'Tri-party subsidiary deduction', risk: 'Low', shares: 350, valuationPerShare: VPS, landAcres: 4, scaleOfFinance: SOF, requested: 60000, stage: 6, status: 'Active', folio: 'SH-0140', village: 'Dindori, Nashik', crop: 'Grapes', nominee: 'Anita Jadhav (Spouse)' },
];

let loans: Loan[] = seed;
const listeners = new Set<() => void>();
function emit() { listeners.forEach(l => l()); }
function subscribe(cb: () => void) { listeners.add(cb); return () => { listeners.delete(cb); }; }

export function getLoans(): Loan[] { return loans; }
export function getLoan(id: string | undefined | null): Loan | undefined {
  if (!id) return undefined;
  return loans.find(l => l.id === id);
}

/** The default loan a screen opens when no id is supplied (back-compat with old links). */
export const DEFAULT_LOAN_ID = 'LO00000090';

export function eligibleLimit(loan: Loan): number {
  return Math.min(loan.shares * loan.valuationPerShare, loan.landAcres * loan.scaleOfFinance);
}
export function shareLimitOf(loan: Loan): number { return loan.shares * loan.valuationPerShare; }
export function landLimitOf(loan: Loan): number { return loan.landAcres * loan.scaleOfFinance; }
export function isOverLimit(loan: Loan): boolean { return loan.requested > eligibleLimit(loan); }
/** Authority per SOP §2.2 Approval Matrix. */
export function authorityFor(loan: Loan): string {
  return loan.requested > 500000 || isOverLimit(loan) ? 'CFO + 2 Directors' : 'CFO + 1 Director';
}

function patch(id: string, next: Partial<Loan>) {
  loans = loans.map(l => (l.id === id ? { ...l, ...next } : l));
  emit();
}

/** SC approves: advance Stage 3 → Stage 4 (Documentation). */
export function approveLoan(id: string) {
  patch(id, { decision: 'approved', stage: 4, status: 'Docs Preparation' });
}
/** SC rejects: record decision, stay at Stage 3 with a Rejected status. */
export function rejectLoan(id: string) {
  patch(id, { decision: 'rejected', status: 'Rejected' });
}
/** Treasury completes disbursement: Stage 5 → Stage 6 (Active). */
export function disburseLoan(id: string) {
  patch(id, { stage: 6, status: 'Active' });
}
/** Generic forward step used by demo flows. */
export function advanceStage(id: string) {
  const loan = getLoan(id);
  if (loan) patch(id, { stage: Math.min(6, loan.stage + 1) });
}

// ---- React bindings (useSyncExternalStore keeps snapshots stable between mutations) ----
export function useLoans(): Loan[] {
  return useSyncExternalStore(subscribe, getLoans, getLoans);
}
export function useLoan(id: string | undefined | null): Loan | undefined {
  return useSyncExternalStore(subscribe, () => getLoan(id), () => getLoan(id));
}
