export const csProfile = {
  name: 'Anjali Mehta',
  role: 'Company Secretary',
  initials: 'AM',
};

export const csKpis = [
  { title: 'Docs Pending Signature', value: '14', note: '2 overdue', status: 'Overdue', color: '#EF4444', page: 'cs-queue' },
  { title: 'Statutory Deadlines', value: '3', note: 'Next: Oct 15', status: 'Pending', color: '#F59E0B', page: 'cs-calendar' },
  { title: 'KYC Expiring (30 days)', value: '9', note: '4 overdue', status: 'Re-KYC Overdue', color: '#F59E0B', page: 'cs-kyc' },
  { title: 'NOC Queue', value: '2', note: 'Ready today', status: 'Ready for NOC', color: '#22C55E', page: 'cs-noc' },
];

export const csDocQueue = [
  { icon: '!', loan: 'LO00000091', borrower: 'Priya Shinde', action: 'PoA not yet notarised', detail: 'Overdue: 2 days', cta: 'Complete Now', page: 'cs-workspace', status: 'Overdue' },
  { icon: '→', loan: 'LO00000094', borrower: 'Narayan FPC', action: 'SH-4 pending signature', detail: 'Waiting: borrower', cta: 'Send Reminder', page: 'cs-sh4', status: 'Pending' },
  { icon: '→', loan: 'LO00000089', borrower: 'Rajesh Patil', action: 'Loan Agreement on stamp paper — awaiting CS sign', detail: 'Review required today', cta: 'Review & Sign', page: 'cs-agreement', status: 'Pending CS' },
  { icon: '✓', loan: 'LO00000082', borrower: 'Disbursed', action: 'NOC eligible — Full repayment confirmed', detail: 'Security return pending', cta: 'Issue NOC', page: 'cs-noc', status: 'Ready for NOC' },
];

export const csDeadlines = [
  { date: 'Oct 15', title: 'Maharashtra Stamp Act annual declaration due', severity: 'Critical', status: 'Overdue' },
  { date: 'Oct 22', title: 'NBFC ratio check — Q2 CFO note', severity: 'Upcoming', status: 'Pending' },
  { date: 'Nov 01', title: 'KYC renewal: 4 members — Re-KYC request not sent', severity: 'Upcoming', status: 'Pending' },
  { date: 'Nov 15', title: 'Stamp register audit — docs ready', severity: 'Scheduled', status: 'Verified' },
];

export const csChecklistBand = [
  { loan: 'LO00000093', borrower: 'Vijay More', docs: 'Complete', sign: 'Pending', status: 'Pending' },
  { loan: 'LO00000094', borrower: 'Narayan FPC', docs: 'SH-4 missing', sign: 'Blocked', status: 'Blocked' },
  { loan: 'LO00000095', borrower: 'Sunita Jadhav', docs: 'Complete', sign: 'Done', status: 'Verified' },
];

export const csWorkspaceLoan = {
  id: 'LO00000091',
  borrower: 'Priya Ramesh Shinde',
  shortName: 'Priya Shinde',
  folio: 'SH-2847',
  shares: 250,
  sanctionDate: '12-Oct-2025',
  amount: 60000,
  cfo: 'S. Nair',
  director: 'R. Deshmukh',
  village: 'Dindori, Nashik',
  security: 'Physical shares (SH-4)',
};

export const csDocumentChecklist = [
  { id: 'poa', label: 'PoA', status: 'Done', note: 'Notarised ✓ · Stamp ₹500 ✓' },
  { id: 'triparty', label: 'Tri-Party Agmt', status: 'Done', note: 'All 3 signed ✓' },
  { id: 'sh4', label: 'SH-4', status: 'Action Required', note: 'Witness sig missing' },
  { id: 'cdsl', label: 'CDSL Pledge', status: 'N/A', note: 'N/A (physical shares)' },
  { id: 'termsheet', label: 'Term Sheet', status: 'Pending', note: 'Not yet signed' },
  { id: 'agreement', label: 'Loan Agreement', status: 'Pending', note: 'Not yet drafted' },
  { id: 'bank', label: 'Bank Verify', status: 'Done', note: 'Skipped — signatures match' },
  { id: 'checklist', label: 'Checklist', status: 'Pending', note: 'Awaiting all docs' },
];

export const complianceRows = [
  ['Producer Co. Lending', 'Loan register + member cap monitoring', 'Ongoing', 'CS', 'Live'],
  ['Loan Limits (s.186)', '60%/100% free reserves tracker', 'Quarterly', 'CFO', 'Q2 Due Nov'],
  ['NBFC Test', 'Asset/income ratio <50%', 'Quarterly', 'CFO', 'Q2 Due Nov'],
  ['KYC / AML', 'PMLA 2002 — re-KYC every 2 years', 'Bi-annual', 'Credit Head', '9 due this qtr'],
  ['Stamp Duty Documentation', 'Maharashtra Stamp Act — ₹500 PoA + Loan Agreement', 'At execution', 'CS', 'On track'],
  ['Money-lending Laws', 'Confirm exemption', 'Annual', 'CS', 'Due Oct 15'],
  ['Record Retention', 'Companies Act — 8-year physical + electronic archive', 'Annual', 'CS + Auditor', 'FY25 done'],
];

export const kycRenewals = [
  { folio: 'SH-0091', name: 'Ganesh Thorat', type: 'Individual', kycDate: '01-Oct-23', expiry: '01-Oct-25', daysLeft: -8, status: 'Overdue' },
  { folio: 'SH-0143', name: 'Meena Kulkarni', type: 'Individual', kycDate: '15-Oct-23', expiry: '15-Oct-25', daysLeft: -2, status: 'Overdue' },
  { folio: 'SH-0312', name: 'Vijay More', type: 'Individual', kycDate: '01-Nov-23', expiry: '01-Nov-25', daysLeft: 17, status: '<30 days' },
  { folio: 'SH-0458', name: 'Priya Shinde', type: 'Individual', kycDate: '20-Nov-23', expiry: '20-Nov-25', daysLeft: 29, status: '<30 days' },
  { folio: 'SH-2847', name: 'Narayan FPC', type: 'FPC', kycDate: '15-Dec-23', expiry: '15-Dec-25', daysLeft: 61, status: '30-60 days' },
];

export const nocQueue = [
  { loan: 'LO00000082', borrower: 'Rajesh Patil', amount: 80000, repaid: '11-Oct-2025', finance: 'Sr. Manager Finance', sap: true, sh4: false, cheque: false, cdsl: 'N/A', status: 'Ready for NOC' },
  { loan: 'LO00000067', borrower: 'Sunita Jadhav', amount: 60000, repaid: '05-Oct-2025', finance: 'Sr. Manager Finance', sap: true, sh4: true, cheque: true, cdsl: 'N/A', status: 'NOC Issued' },
  { loan: 'LO00000054', borrower: 'Kiran FPC', amount: 250000, repaid: '01-Sep-2025', finance: 'Sr. Manager Finance', sap: true, sh4: true, cheque: true, cdsl: 'Released', status: 'NOC Issued' },
];

export const stampRows = [
  ['LO000091', 'Power of Attorney', '₹500', '13-Oct-25', 'CS', 'Done'],
  ['LO000091', 'Loan Agreement', '₹500', 'Pending', 'CS', 'Pending'],
  ['LO000089', 'Power of Attorney', '₹500', '10-Oct-25', 'CS', 'Done'],
  ['LO000089', 'Loan Agreement', '₹500', '10-Oct-25', 'CS', 'Done'],
  ['LO000094', 'Power of Attorney', '₹500', '14-Oct-25', 'CS', 'Done'],
  ['LO000094', 'Loan Agreement', '₹500', 'Pending', 'CS', 'Pending'],
];

export const grievanceRegister = [
  { ref: 'GR-2025-12', description: 'Priya Shinde — Loan amount not yet disbursed', received: '10-Oct-25', status: 'Open', tat: '3 days (SLA: 5d)' },
  { ref: 'GR-2025-11', description: 'Rajesh Patil — Interest rate not communicated', received: '01-Oct-25', status: 'Resolved', tat: '4 days' },
  { ref: 'GR-2025-10', description: 'Ganesh Thorat — SH-4 not returned after NOC', received: '20-Sep-25', status: 'Resolved', tat: '2 days' },
];
