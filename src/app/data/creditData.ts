export const creditUser = {
  name: 'Amit Kulkarni',
  role: 'Credit Manager',
};

export const creditKpis = [
  { label: 'New Apps Today', value: '12', note: '+4 vs yesterday', tag: 'Ready for intake', color: '#0C5FA5' },
  { label: 'In Appraisal', value: '8', note: 'TAT: 1.2d', tag: '2 due today', color: '#F59E0B' },
  { label: 'Awaiting SC Approval', value: '3', note: 'Overdue: 1', tag: 'Follow up', color: '#E65100' },
  { label: 'Active Loans', value: '147', note: '₹1.84 Cr', tag: 'NPA 1.4%', color: '#2E7D32' },
];

export const creditApplications = [
  {
    id: 'LO00000091',
    name: 'Priya Ramesh Shinde',
    shortName: 'Priya Shinde',
    folio: 'SH-2847',
    shares: 250,
    memberSince: 'Apr 2021',
    village: 'Dindori, Nashik',
    crop: 'Grapes',
    mobile: '+91 94230 XXXXX',
    email: 'priya.s@gmail.com',
    amount: 60000,
    purpose: 'Drip irrigation setup',
    tenure: '12 months (Short-Term)',
    nominee: 'Suresh Shinde (Father)',
    status: 'Incomplete',
    submittedAgo: '2h ago',
    blocker: 'PAN missing',
    assignedToMe: true,
    documents: [
      { name: 'Aadhaar Card', state: 'Complete', detail: 'Uploaded 10:15 AM' },
      { name: 'PAN Card', state: 'Missing', detail: 'Request from farmer' },
      { name: 'Share Certificate', state: 'Complete', detail: 'Uploaded 10:16 AM' },
      { name: '7/12 Extract', state: 'Complete', detail: 'Uploaded 10:18 AM' },
      { name: 'Bank Statement (6mo)', state: 'Complete', detail: 'Uploaded 10:20 AM' },
      { name: 'Crop Plan', state: 'Pending Review', detail: 'Open & verify' },
    ],
  },
  {
    id: 'LO00000090',
    name: 'Ganesh Thorat Farmers Producer Company',
    shortName: 'Ganesh Thorat FPC',
    folio: 'SH-5122',
    shares: 2400,
    memberSince: 'Jun 2020',
    village: 'Ojhar, Niphad, Nashik',
    crop: 'Tomato',
    mobile: '+91 98220 XXXXX',
    email: 'ganesh.thorat.fpc@gmail.com',
    amount: 480000,
    purpose: 'Pack-house working capital',
    tenure: '12 months (Short-Term)',
    nominee: 'Board resolution attached',
    status: 'Complete',
    submittedAgo: '4h ago',
    blocker: 'Ready for appraisal',
    assignedToMe: false,
    documents: [
      { name: 'Aadhaar Card', state: 'Complete', detail: 'Uploaded' },
      { name: 'PAN Card', state: 'Complete', detail: 'AABCG1234D' },
      { name: 'Share Certificate', state: 'Complete', detail: 'Uploaded' },
      { name: '7/12 Extract', state: 'Complete', detail: 'Uploaded' },
      { name: 'Bank Statement (6mo)', state: 'Complete', detail: 'Verified' },
      { name: 'Crop Plan', state: 'Complete', detail: 'Verified' },
    ],
  },
  {
    id: 'LO00000089',
    name: 'Rajesh Patil',
    shortName: 'Rajesh Patil',
    folio: 'SH-3011',
    shares: 900,
    memberSince: 'Jan 2019',
    village: 'Igatpuri, Nashik',
    crop: 'Mango',
    mobile: '+91 97300 XXXXX',
    email: 'rajesh.patil@example.com',
    amount: 180000,
    purpose: 'Crop production',
    tenure: '12 months (Short-Term)',
    nominee: 'Vilas Patil (Father)',
    status: 'Overdue',
    submittedAgo: '2d ago',
    blocker: 'Appraisal note overdue 1d',
    assignedToMe: true,
    documents: [
      { name: 'Aadhaar Card', state: 'Complete', detail: 'Uploaded' },
      { name: 'PAN Card', state: 'Complete', detail: 'Uploaded' },
      { name: 'Share Certificate', state: 'Complete', detail: 'Uploaded' },
      { name: '7/12 Extract', state: 'Complete', detail: 'Uploaded' },
      { name: 'Bank Statement (6mo)', state: 'Pending Review', detail: 'Verify irregular credits' },
      { name: 'Crop Plan', state: 'Complete', detail: 'Uploaded' },
    ],
  },
];

export const appraisalLoan = {
  id: 'LO00000090',
  borrower: 'Ganesh Thorat FPC',
  shares: 2400,
  valuationPerShare: 200,
  landAcres: 32,
  scaleOfFinance: 20000,
  requested: 480000,
  purpose: 'Pack-house working capital',
  category: 'Crop Production',
  source: 'Tri-party subsidiary deduction',
  bankAverage: 185000,
  risk: 'Medium',
  due: 'Due by 12 Jun 2026 · 1d 14h remaining',
};

export const sanctionQueue = [
  { id: 'LO00000090', name: 'Ganesh Thorat FPC', amount: 480000, submitted: '2h ago', level: 'CFO+1Dir', status: 'Pending' },
  { id: 'LO00000088', name: 'Ashok Wagh', amount: 120000, submitted: '1d ago', level: 'CFO+1Dir', status: 'Pending' },
  { id: 'LO00000085', name: 'Kamla Jagtap', amount: 80000, submitted: '3d ago', level: 'CFO+1Dir', status: 'Approved', csr: 'CSR-2025-0085' },
  { id: 'LO00000083', name: 'Vinayak FPC', amount: 750000, submitted: '4d ago', level: 'CFO+2Dir', status: 'Approved', csr: 'CSR-2025-0083' },
  { id: 'LO00000079', name: 'Suresh Bhagat', amount: 40000, submitted: '6d ago', level: 'CFO+1Dir', status: 'Rejected' },
];

export const loanRegister = [
  { id: 'LO00000001', borrower: 'Ramesh Jadhav', amount: 60000, disbursed: '04-Apr-24', stage: 'Active', dpd: 0, status: 'Active' },
  { id: 'LO00000002', borrower: 'Sunita FPC', amount: 400000, disbursed: '06-Apr-24', stage: 'Active', dpd: 0, status: 'Active' },
  { id: 'LO00000018', borrower: 'Narayan Patil', amount: 120000, disbursed: '12-May-24', stage: 'Active', dpd: 1247, status: 'Defaulted' },
  { id: 'LO00000051', borrower: 'Ganesh Thorat', amount: 80000, disbursed: '03-Jul-24', stage: 'Active', dpd: 31, status: 'Active' },
  { id: 'LO00000076', borrower: 'Priya Shinde', amount: 60000, disbursed: '14-Oct-24', stage: 'Active', dpd: 0, status: 'Active' },
];

export const dpdSummary = [
  { label: 'Current', loans: 127, amount: '₹1.52 Cr', color: '#2E7D32' },
  { label: '1-2 Years', loans: 12, amount: '₹18.4L', color: '#F59E0B' },
  { label: '2-3 Years', loans: 5, amount: '₹7.2L', color: '#E65100' },
  { label: '3+ Years', loans: 3, amount: '₹4.8L', color: '#C62828' },
  { label: 'NPA Rate', loans: 0, amount: '2.7%', color: '#1565C0' },
];

export const dpdRows = [
  { borrower: 'Narayan Patil', loan: 'LO00000018', amount: 120000, dpd: 1247, action: 'Non-Recoverable', note: 'Prepare Note for SC' },
  { borrower: 'Sambhaji Kale', loan: 'LO00000033', amount: 80000, dpd: 1142, action: 'Extension Granted', note: 'Extended: 12 months' },
  { borrower: 'Meena FPC', loan: 'LO00000041', amount: 360000, dpd: 1098, action: 'Under SC Review', note: 'Awaiting decision' },
];

export const interestInvoices = [
  { borrower: 'Priya Shinde', loan: 'LO00000076', principal: 60000, interest: 7200, status: 'Unpaid', action: 'Capitalise → Principal ₹67,200' },
  { borrower: 'Ashok Wagh', loan: 'LO00000088', principal: 120000, interest: 14400, status: 'Paid', action: 'View' },
  { borrower: 'Kamla Jagtap', loan: 'LO00000085', principal: 80000, interest: 9600, status: 'Sent', action: 'Resend' },
];

export const auditTrail = [
  ['25-May-25 11:42', 'Amit Kulkarni', 'Submitted Appraisal Note to SC'],
  ['25-May-25 14:30', 'SC (CFO + Dir.)', 'Approved — Amount: ₹80,000'],
  ['25-May-25 15:00', 'Compliance Team', 'Documents preparation started'],
  ['26-May-25 11:00', 'Amit Kulkarni', 'SAP code request sent'],
  ['26-May-25 13:30', 'Rohan Mehta', 'SAP Customer ID confirmed: 0000851'],
];
