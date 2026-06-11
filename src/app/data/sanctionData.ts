export const scProfile = {
  name: 'S. Nair',
  role: 'CFO',
  authority: 'CFO + 1 Director (≤₹5L) | CFO + 2 Directors (>₹5L)',
  lastLogin: 'Today 8:14 AM',
};

export const scAlerts = [
  { title: 'Awaiting Your Approval', value: '5 loans', note: 'Oldest: 2 days', page: 'sc-awaiting', color: '#EF4444', bg: '#FEE2E2' },
  { title: 'Joint Approval Required (>₹5L)', value: '2 loans', note: 'Oldest: 1 day', page: 'sc-joint', color: '#F59E0B', bg: '#FEF3C7' },
  { title: 'Special Cases', value: '1 loan', note: 'GM Res. pending', page: 'sc-special-cases', color: '#D97706', bg: 'rgba(217,119,6,0.08)' },
];

export const scPortfolio = {
  activePortfolio: 18420000,
  activeLoans: 147,
  sanctionedThisMonth: 2860000,
  sanctionedCount: 19,
  lendingHeadroom: 6240000,
  s186Used: 74,
  npaRate: '1.4%',
  npaDelta: '+0.2%',
};

export const scApprovalQueue = [
  { id: 'LO00000091', borrower: 'Priya Shinde', amount: 60000, tenure: 'Short-term', crop: 'Grapes', appraisal: 'Eligible', authority: 'CFO + 1 Dir', waiting: '1 day', page: 'sc-review', priority: '!' },
  { id: 'LO00000094', borrower: 'Narayan FPC', amount: 480000, tenure: 'Long-term', crop: 'Grapes', appraisal: 'Borderline', authority: 'CFO + 1 Dir', waiting: '2 days', page: 'sc-review', priority: '!' },
  { id: 'LO00000096', borrower: 'Vijay More', amount: 650000, tenure: 'Long-term', crop: 'Mixed', appraisal: 'Eligible', authority: 'CFO + 2 Dir', waiting: '1 day', page: 'sc-joint', priority: '→', note: 'Awaiting 2nd Director sign' },
];

export const scReviewLoan = {
  id: 'LO00000091',
  borrower: 'Priya Ramesh Shinde',
  submittedBy: 'Amit Kulkarni (Credit Manager)',
  submittedDate: '12-Oct-2025',
  submittedAgo: '2 days ago',
  amount: 60000,
  folio: 'SH-2847',
  memberSince: '2021',
  village: 'Dindori Taluka, Nashik',
  crop: 'Grape Farmer',
  membership: 'Individual',
  shares: 250,
  shareType: 'Physical',
  navPerShare: 2000,
  landAcres: 3,
  survey: '147/2',
  scaleOfFinance: 20000,
  purpose: 'Grape cultivation',
  tenure: 'Short-term (12 months)',
  repaymentDate: '12-Oct-2026',
  interest: '12.5% p.a. (floating)',
  penalty: '18% p.a. on overdue',
  security: 'SH-4 (physical) + Blank-dated cheque',
  poa: 'Prepared by CS — Anjali Mehta',
  priorLoan: { id: 'LO000047', amount: 40000, status: 'Closed', dpd: 0 },
  recommendation: 'Approve',
  recommendationNote: 'Clean track record. Amount at land-based limit. Recommend short-term approval.',
};

export const scScrutinyItems = [
  ['Eligibility Verified', 'Member active, KYC and loan cap verified'],
  ['Loan Amount Within Permissible Limits', 'Requested amount equals eligible cap'],
  ['Purpose Aligned with Company Objectives', 'Grape cultivation and farm activity'],
  ['Compliance Checks Passed', 'Companies Act and internal policy checks clear'],
  ['Past Borrowing History Reviewed', 'DPD = 0, prior loans checked'],
  ['Risk Assessment Considered', 'Market, operational, collateral risk reviewed'],
  ['Documentation Complete', 'All KYC + land documents present'],
];

export const sanctionRegister = [
  { date: '13-Oct-25', loan: 'LO00000091', borrower: 'Priya Shinde', amount: 60000, decision: 'Approved', authority: 'CFO+1Dir', exception: 'None' },
  { date: '12-Oct-25', loan: 'LO00000090', borrower: 'Vijay More', amount: 650000, decision: 'Approved', authority: 'CFO+2Dir', exception: 'Limit Exceeded' },
  { date: '11-Oct-25', loan: 'LO00000089', borrower: 'Narayan FPC', amount: 200000, decision: 'Returned', authority: 'CFO+1Dir', exception: 'None' },
  { date: '09-Oct-25', loan: 'LO00000088', borrower: 'Ganesh Thorat', amount: 80000, decision: 'Approved', authority: 'CFO+1Dir', exception: 'None' },
  { date: '07-Oct-25', loan: 'LO00000087', borrower: 'Sunita Jadhav', amount: 40000, decision: 'Rejected', authority: 'CFO+1Dir', exception: 'None' },
];

export const scExceptions = [
  { date: '13-Oct-25', loan: 'LO000090', type: 'Amount exceeds ₹5L — Joint approval obtained', approver: 'CFO+2Dir', status: 'Approved' },
  { date: '10-Oct-25', loan: 'LO000099', type: "Director's relative applicant — GM resolution pending", approver: 'CFO+Dir (excl.)', status: 'GM Pending' },
  { date: '05-Sep-25', loan: 'LO000081', type: 'Extension granted — non-intentional default (+1yr)', approver: 'CFO', status: 'Approved' },
];

export const specialCase = {
  loan: 'LO00000099',
  borrower: 'Meena Deshmukh',
  relationship: 'Relative of Executive Director (R. Deshmukh)',
  amount: 120000,
  applicationDate: '10-Oct-2025',
};

export const defaultEscalation = {
  loan: 'LO00000018',
  borrower: 'Vijay More',
  outstanding: 120000,
  note: "Vijay More's crop loss was weather-related in FY24. Extension granted. Now FY26, income resumed but repayment not made. Pattern has shifted to intentional avoidance. Recovery via subsidiary deduction not possible — no active produce supply. Recommend security invocation.",
};
