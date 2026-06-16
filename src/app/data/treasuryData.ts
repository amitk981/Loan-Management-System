export const treasuryProfile = {
  manager: 'Rajesh Kulkarni',
  controller: 'Chief Financial Controller',
  today: 'Wednesday, 10 Jun 2026',
};

export const treasuryKpis = [
  { label: 'Pending Disbursement', value: 842000, display: '₹8,42,000', note: '4 loans awaiting initiation', tag: '2 urgent (>1 day)', color: '#0891B2', bg: '#CFFAFE' },
  { label: 'Disbursed Today', value: 320000, display: '₹3,20,000', note: '2 transactions completed', tag: 'All SAP entries posted', color: '#22C55E', bg: '#DCFCE7' },
  { label: 'SAP Codes Pending', value: 3, display: '3', note: 'Farmer profiles awaiting creation', tag: 'Awaiting email from Credit Mgr', color: '#1E88E5', bg: '#DBEAFE' },
  { label: 'Repayments Today', value: 62500, display: '₹62,500', note: '3 payments · 2 direct, 1 via subsidiary', tag: '1 entry pending SAP posting', color: '#2D7A4F', bg: '#E8F5E9' },
];

export const treasuryQueue = [
  { id: 'LO00000047', borrower: 'Ramesh Patil', amount: 200000, stage: 'Pending Initiation', csSign: '✓', sapCode: 'SFCUST-0482', waiting: '4 hrs', action: 'Initiate', page: 'treasury-disbursement', risk: 'amber' },
  { id: 'LO00000048', borrower: 'Sahyadri Grape FPC', amount: 500000, stage: 'Pending Auth', csSign: '✓', sapCode: 'SFCUST-0483', waiting: '2 hrs', action: 'Awaiting CFC', page: 'treasury-auth', risk: 'green' },
  { id: 'LO00000049', borrower: 'Sunanda More', amount: 150000, stage: 'Pending Initiation', csSign: '✓', sapCode: 'SFCUST-0484', waiting: '1 day 3hrs', action: 'Initiate', page: 'treasury-disbursement', risk: 'red' },
  { id: 'LO00000050', borrower: 'Prakash Shinde', amount: 90500, stage: 'SAP Code Pending', csSign: '⏳', sapCode: '', waiting: '6 hrs', action: 'Create SAP', page: 'treasury-sap-codes', risk: 'amber' },
];

export const repaymentFeed = [
  { time: '10:42 AM', borrower: 'Ramesh Patil', loan: 'LO00000031', amount: 25000, mode: 'NEFT', utr: 'UTIB2025060100823', action: 'Post to SAP', posted: false },
  { time: '09:15 AM', borrower: 'Sahyadri PHC Ltd.', loan: 'LO00000028', amount: 37500, mode: 'Subsidiary deduction', utr: 'SD20250610002', action: 'Posted ✓', posted: true },
  { time: '08:30 AM', borrower: 'Vilas Jadhav', loan: 'LO00000022', amount: 10000, mode: 'RTGS', utr: 'UTR unconfirmed', action: 'Verify UTR', posted: false },
];

export const flowTrend = [
  ['Jul', 3.8, 2.2], ['Aug', 4.1, 2.9], ['Sep', 3.4, 3.1], ['Oct', 5.2, 3.8],
  ['Nov', 4.8, 4.1], ['Dec', 5.7, 4.4], ['Jan', 4.2, 3.9], ['Feb', 5.4, 4.2],
  ['Mar', 6.0, 4.7], ['Apr', 6.2, 4.8], ['May', 5.1, 5.3], ['Jun', 3.2, 0.6],
];

export const disbursementLoan = {
  id: 'LO00000047',
  borrower: 'Ramesh Patil',
  accountHolder: 'RAMESH VISHWAS PATIL',
  folio: 'SH-04821',
  amount: 200000,
  type: 'Short-term (≤1 year)',
  purpose: 'Grape cultivation inputs',
  rate: '12% p.a. (Floating)',
  repaymentDate: '31 Mar 2027',
  sanctionDate: '09 Jun 2026',
  authority: 'CFO + Dir. P. Desai',
  bank: 'State Bank of India',
  branch: 'Nashik Main Branch',
  account: 'XXXX XXXX 4821',
  ifsc: 'SBIN0001234',
  sapCode: 'SFCUST-0482',
};

export const preflightGates = [
  ['CS Signature on Checklist', 'Verified: Anita Sharma (CS) · 10 Jun 2026, 9:00 AM', 'View Checklist'],
  ['Credit Manager Signature', 'Verified: Suresh Nair · 10 Jun 2026, 9:15 AM', 'View Appraisal Note'],
  ['Sanction Committee Approval', 'CFO + 1 Director · 09 Jun 2026, 4:30 PM', 'View Sanction'],
  ['All 15 Documents Present in File', '15/15 complete · Last doc: Loan Agreement', 'View Docs'],
  ['SAP Customer Code Created', 'Code: SFCUST-0482 · Created: 10 Jun 2026, 9:45 AM', 'View in SAP Log'],
];

export const authRows = [
  { loan: 'LO000049', borrower: 'Sunanda More', amount: 150000, mode: 'NEFT', by: 'R. Kulkarni', at: 'Yesterday 4PM', waiting: '22 hrs', risk: 'red' },
  { loan: 'LO000047', borrower: 'Ramesh Patil', amount: 200000, mode: 'NEFT', by: 'R. Kulkarni', at: 'Today 10:15 AM', waiting: '45 min', risk: 'amber' },
];

export const sapCodeRequests = [
  { loan: 'LO000050', borrower: 'Prakash Ramchandra Shinde', aadhaar: 'XXXX-XXXX-3421', pan: 'ABCPS1234F', code: 'Pending', status: 'Pending' },
  { loan: 'LO000047', borrower: 'Ramesh Patil', aadhaar: 'XXXX-XXXX-1234', pan: 'ABCDE1234F', code: 'SFCUST-0482', status: 'Active' },
  { loan: 'LO000046', borrower: 'Vilas Jadhav', aadhaar: 'XXXX-XXXX-5678', pan: 'GHIPK4567L', code: 'SFCUST-0422', status: 'Existing ID used' },
];

export const sapEntries = [
  { date: '10 Jun', doc: '1400000234', loan: 'LO000047', borrower: 'R. Patil', type: 'Disbursement', dr: 'Loan A/c', cr: 'RBL Bank', amount: 200000, by: 'R. Kulkarni', status: 'SAP Posted' },
  { date: '10 Jun', doc: '1400000235', loan: 'LO000031', borrower: 'R. Patil', type: 'Repayment', dr: 'RBL Bank', cr: 'Loan A/c', amount: 25000, by: 'R. Kulkarni', status: 'SAP Posted' },
  { date: '09 Jun', doc: '1400000230', loan: 'LO000022', borrower: 'V. Jadhav', type: 'Interest Accrual', dr: 'Interest A/c', cr: 'Accrued Liab.', amount: 1200, by: 'R. Kulkarni', status: 'Pending Review' },
];

export const directRepayments = [
  { date: '10 Jun', utr: 'UTIB2025...', borrower: 'Ramesh Patil', loan: 'LO000031', amount: 25000, mode: 'NEFT', principal: 25000, interest: 0, balance: 117500, status: 'Unposted' },
  { date: '10 Jun', utr: 'UTR missing', borrower: 'Vilas Jadhav', loan: 'LO000022', amount: 10000, mode: 'RTGS', principal: 0, interest: 0, balance: 0, status: 'UTR Missing' },
];

export const subsidiaryDeductions = [
  { date: '08 Jun', borrower: 'Ramesh Patil', loan: 'LO000028', ref: 'SFPHC-06-0824', gross: 87500, deduction: 37500, net: 50000, received: '09 Jun', reconciled: 'Matched' },
  { date: '05 Jun', borrower: 'Sunanda More', loan: 'LO000035', ref: 'SFPHC-06-0819', gross: 54000, deduction: 20000, net: 34000, received: 'Pending', reconciled: 'Unmatched' },
];

export const interestAccruals = [
  { loan: 'LO000031', borrower: 'Ramesh Patil', principal: 142500, rate: '12%', interest: 1425, date: '30 Jun', sap: '1400000241', status: 'SAP Posted' },
  { loan: 'LO000035', borrower: 'Sunanda More', principal: 80000, rate: '12%', interest: 800, date: '30 Jun', sap: '-', status: 'SAP Pending' },
];

export const reconciliationRows = [
  { date: '10 Jun', desc: 'NEFT/Ramesh Patil/LO47', statement: 25000, sap: '1400000235', sapAmount: 25000, match: true },
  { date: '09 Jun', desc: 'NEFT/SFPHC/LO28', statement: 37500, sap: '1400000228', sapAmount: 37500, match: true },
  { date: '10 Jun', desc: 'NEFT/VilasJ', statement: 10000, sap: 'LO000022?', sapAmount: 0, match: false },
];
