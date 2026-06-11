export const farmerProfile = {
  firstName: 'Ramesh',
  fullName: 'Ramesh Vilas Patil',
  displayName: 'Ramesh Patil',
  age: 42,
  folioNo: 'SH-04821',
  memberSince: '2019',
  village: 'Dindori',
  taluka: 'Dindori',
  district: 'Nashik',
  state: 'Maharashtra',
  mobile: '+91 98765 43210',
  shares: 250,
  shareType: 'Physical',
  navPerShare: 2000,
  loanValuePerShare: 200,
  landAcres: 3.5,
  scaleOfFinance: 20000,
};

export const farmerLoan = {
  id: 'LO00000047',
  previousLoanId: 'LO00000031',
  sanctionedAmount: 200000,
  outstandingPrincipal: 120500,
  outstandingInterest: 22000,
  outstandingBalance: 142500,
  totalRepaid: 57500,
  disbursedDate: '15 Jan 2025',
  nextDueDate: '30 Jun 2025',
  dueIn: 'In 20 days',
  tenure: 'Short-term (12 months)',
  interestRate: '12% p.a.',
  purpose: 'Crop Production',
  crop: 'Grapes',
  status: 'Active',
  stage: 6,
  sapCustomerId: 'C-00014521',
};

export const farmerEligibility = {
  method1: farmerProfile.shares * farmerProfile.loanValuePerShare * 0.3,
  method2: farmerProfile.landAcres * farmerProfile.scaleOfFinance,
  get eligible() {
    return Math.min(this.method1, this.method2);
  },
  limitingMethod: 'Method 1 applies (lower limit)',
};

export const farmerDocuments = [
  { name: 'Loan Application Form', type: 'PDF', status: 'Available', date: '10 Jan 2025', group: 'Agreements' },
  { name: 'KYC Bundle', type: 'PDF', status: 'Available', date: '10 Jan 2025', group: 'KYC' },
  { name: 'Loan Appraisal Note', type: 'PDF', status: 'Available', date: '12 Jan 2025', group: 'Agreements', redacted: true },
  { name: 'Term Sheet', type: 'PDF', status: 'Available', date: '13 Jan 2025', group: 'Agreements' },
  { name: 'Loan Agreement', type: 'PDF', status: 'Available', date: '14 Jan 2025', group: 'Agreements' },
  { name: 'Power of Attorney', type: 'PDF', status: 'Available', date: '14 Jan 2025', group: 'Agreements' },
  { name: 'Disbursement Advice', type: 'PDF', status: 'Available', date: '15 Jan 2025', group: 'Disbursement' },
  { name: 'Interest Invoice FY25-26', type: 'PDF', status: 'Available', date: '30 Apr 2025', group: 'Invoices' },
  { name: 'NOC', type: 'PDF', status: 'Not Generated', date: '—', group: 'Receipts' },
];

export const farmerTransactions = [
  { date: '15 Jan 2025', type: 'Disbursement', amount: 200000, mode: 'NEFT', status: 'Credited', sign: '+' },
  { date: '31 Mar 2025', type: 'Principal Repayment', amount: 20000, mode: 'RTGS', status: 'Confirmed', sign: '-' },
  { date: '30 Apr 2025', type: 'Interest Payment', amount: 18000, mode: 'Subsidiary', status: 'Confirmed', sign: '-' },
  { date: '31 May 2025', type: 'Principal Repayment', amount: 17500, mode: 'RTGS', status: 'Confirmed', sign: '-' },
  { date: '30 Jun 2025', type: 'Principal Repayment', amount: 2000, mode: 'RTGS', status: 'Pending', sign: '-' },
];

export const farmerRepaymentSchedule = [
  { dueDate: '15 Jan 2025', principal: 20000, interest: 2000, total: 22000, status: 'Paid' },
  { dueDate: '28 Feb 2025', principal: 0, interest: 2000, total: 2000, status: 'Paid' },
  { dueDate: '31 Mar 2025', principal: 17500, interest: 2000, total: 19500, status: 'Paid' },
  { dueDate: '30 Apr 2025', principal: 0, interest: 2000, total: 2000, status: 'Paid' },
  { dueDate: '31 May 2025', principal: 20000, interest: 2000, total: 22000, status: 'Paid' },
  { dueDate: '30 Jun 2025', principal: 0, interest: 2000, total: 2000, status: 'Due Soon' },
];

export const farmerTimeline = [
  { date: '10 Jan 2025 · 11:42 AM', role: 'Borrower', action: 'Application submitted', detail: 'LO00000047 created — ₹2,00,000 requested for Crop Production' },
  { date: '12 Jan 2025 · 3:15 PM', role: 'Credit Officer', action: 'Appraisal Note prepared', detail: 'Loan Appraisal Note prepared and submitted to Sanction Committee', doc: 'Appraisal Note.pdf' },
  { date: '13 Jan 2025 · 10:05 AM', role: 'CFO', action: 'Loan sanctioned', detail: 'Loan sanctioned for ₹2,00,000 — CFO + Director approval' },
  { date: '14 Jan 2025 · 2:45 PM', role: 'CS', action: 'Documents prepared', detail: 'Term Sheet, Loan Agreement, PoA, SH-4 prepared and signed' },
  { date: '15 Jan 2025 · 11:00 AM', role: 'Finance Team', action: 'Loan disbursed', detail: '₹2,00,000 transferred via NEFT — UTR: RBLN25015XXXXXXXXX' },
  { date: '31 Mar 2025 · 3:00 PM', role: 'System', action: 'Payment received', detail: '₹19,500 received — ₹17,500 Principal + ₹2,000 Interest' },
  { date: '30 Apr 2025 · 9:00 AM', role: 'System', action: 'Interest invoice generated', detail: 'Interest invoice for FY 2025-26 generated — ₹18,000 outstanding', doc: 'Interest Invoice FY25-26.pdf' },
  { date: '31 May 2025 · 5:30 PM', role: 'System', action: 'Payment received', detail: '₹22,000 received via RTGS — Principal + Interest' },
];

export const farmerNotifications = [
  { type: 'Interest Invoice', title: 'Your interest invoice for FY 2025-26 is ready — ₹18,000', time: '2 days ago', read: false },
  { type: 'Payment Reminder', title: 'Repayment reminder: ₹19,500 due on 30 Jun 2025', time: '5 days ago', read: false },
  { type: 'Interest Rate Change', title: 'Interest rate revised to 12% p.a. effective 1 Apr 2025', time: '12 days ago', read: false },
  { type: 'Loan Approved', title: 'Loan LO00000047 disbursed successfully — ₹2,00,000', time: '5 months ago', read: true },
];

export const farmerLoanHistory = [
  { id: 'LO00000031', sanctioned: 50000, disbursed: '10 Mar 2023', repaid: 50000, tenure: '12 months', status: 'Closed' },
  { id: 'LO00000047', sanctioned: 200000, disbursed: '15 Jan 2025', repaid: 57500, tenure: '12 months', status: 'Active' },
];
