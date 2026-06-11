import type { ReactNode } from 'react';
import { useState } from 'react';
import { Banknote, Building, CheckCircle, Download, FileBarChart, Receipt, ShieldCheck, Upload } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from '../shared/StatusBadge';
import { authRows, directRepayments, interestAccruals, reconciliationRows, sapCodeRequests, sapEntries, subsidiaryDeductions, treasuryQueue } from '../../data/treasuryData';

interface TreasuryOperationsProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

const pageCopy: Record<string, { title: string; subtitle: string }> = {
  'treasury-pending': { title: 'Pending Initiation', subtitle: 'Loans released by CS checklist and ready for payment initiation' },
  'treasury-auth': { title: 'Pending Payment Authorizations', subtitle: '2 pending · ₹7,00,000 total · Finance Controller queue' },
  'treasury-today': { title: 'Disbursed Today', subtitle: 'Completed payments with UTR and SAP journal references' },
  'treasury-sap-codes': { title: 'SAP Customer Code Creation', subtitle: 'Requests from Credit Manager' },
  'treasury-sap-log': { title: 'SAP Entries Log', subtitle: 'Audit log of disbursement, repayment, accrual and capitalization postings' },
  'treasury-incoming': { title: 'Incoming Repayments — Direct', subtitle: 'Farmers repaying directly via RTGS/NEFT' },
  'treasury-deductions': { title: 'Subsidiary Deductions — Repayment Receipts', subtitle: 'Via Sahyadri Farms Post Harvest Care Limited' },
  'treasury-interest': { title: 'Interest Accrual Management', subtitle: 'Monthly accruals + year-end invoices + capitalization' },
  'treasury-reconciliation': { title: 'Bank Reconciliation — RBL Bank Operating A/C', subtitle: 'Jun 1 – Jun 10, 2026' },
  'treasury-ledger': { title: 'Ledger Summary', subtitle: 'Loan ledger, bank ledger and SAP posting control totals' },
  'treasury-exports': { title: 'Export Centre', subtitle: 'CSV, PDF and board-pack exports for finance operations' },
  'treasury-reports': { title: 'Financial Reports', subtitle: 'Portfolio, collections, SAP and accrual reporting pack' },
};

function formatCurrency(n: number, paise = false) {
  return '₹' + n.toLocaleString('en-IN') + (paise ? '.00' : '');
}

function Metric({ label, value, note, color }: { label: string; value: string; note: string; color: string }) {
  return <div className="bg-white rounded-lg p-4 border border-[#EDEEF0]"><div style={{ fontSize: 12, color: '#9EA8B3', fontWeight: 800 }}>{label}</div><div style={{ fontSize: 25, color, fontWeight: 900, fontFamily: 'Roboto Mono', marginTop: 4 }}>{value}</div><div style={{ fontSize: 12, color: '#3D4450', marginTop: 4 }}>{note}</div></div>;
}

export function TreasuryOperations({ onNavigate, activePage }: TreasuryOperationsProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const meta = pageCopy[activePage] || pageCopy['treasury-pending'];

  const renderDisbursements = () => {
    if (activePage === 'treasury-auth') {
      return (
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-8 bg-white rounded-lg border border-[#EDEEF0] overflow-hidden">
            <Header icon={<ShieldCheck size={16} />} title="Authorization Queue" action={<StatusBadge status="Pending Authorization" />} />
            <SimpleTable headers={['', 'Loan ID', 'Borrower', 'Amount', 'Mode', 'Initiated By', 'Initiated At', 'Waiting', 'Action']}>
              {authRows.map(row => <tr key={row.loan} className="border-b border-[#EDEEF0] hover:bg-[#F7F8FA]"><Cell>{row.risk === 'red' ? '🔴' : '🟡'}</Cell><Cell mono blue>{row.loan}</Cell><Cell>{row.borrower}</Cell><Cell mono right>{formatCurrency(row.amount, true)}</Cell><Cell>{row.mode}</Cell><Cell>{row.by}</Cell><Cell>{row.at}</Cell><Cell><strong style={{ color: row.risk === 'red' ? '#EF4444' : '#D97706' }}>{row.waiting}</strong></Cell><Cell><button className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#0891B2', color: 'white', fontSize: 12, fontWeight: 800 }}>Review & Authorize</button></Cell></tr>)}
            </SimpleTable>
          </div>
          <div className="col-span-4 bg-white rounded-lg p-5 border border-[#EDEEF0]">
            <h3 style={{ fontSize: 18, fontWeight: 900 }}>Authorize Payment</h3><p style={{ fontSize: 13, color: '#0891B2', fontFamily: 'Roboto Mono' }}>LO000047</p>
            {[
              ['Borrower', 'Ramesh Patil'], ['Amount', '₹2,00,000.00'], ['Mode', 'NEFT'], ['From Account', 'SFPCL · RBL · XXXX-8842'], ['To Account', 'Ramesh Patil · SBI · XXXX-4821'], ['Initiated By', 'Rajesh Kulkarni'],
            ].map(([l, v]) => <Info key={l} label={l} value={v} />)}
            <div className="grid grid-cols-3 gap-2 my-4">{['View Sanction', 'View Checklist', 'SAP Preview'].map(x => <button key={x} className="p-2 rounded-lg border border-[#EDEEF0]" style={{ fontSize: 11, fontWeight: 800 }}>{x}</button>)}</div>
            <p style={{ fontSize: 13, color: '#3D4450', fontWeight: 800 }}>Enter OTP sent to +91 98765 XXXXX</p>
            <div className="flex gap-2 mt-2 mb-3">{otp.map((d, i) => <input key={i} aria-label={`OTP digit ${i + 1}`} value={d} onChange={e => setOtp(prev => prev.map((x, idx) => idx === i ? e.target.value.slice(-1) : x))} className="text-center rounded-lg border border-[#D1D5DB]" style={{ width: 42, height: 46, fontFamily: 'Roboto Mono' }} />)}</div>
            <button className="w-full py-3 rounded-lg font-semibold" style={{ backgroundColor: '#22C55E', color: 'white' }}>Authorize & Execute Payment</button>
            <button className="w-full py-3 rounded-lg font-semibold mt-2" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>Reject / Hold</button>
          </div>
        </div>
      );
    }

    const rows = activePage === 'treasury-today'
      ? treasuryQueue.filter(row => row.id === 'LO00000048').map(row => ({ ...row, stage: 'Transfer Complete', action: 'NEFT20260610-82910' }))
      : treasuryQueue;

    return (
      <div className="space-y-5">
        <div className="grid grid-cols-4 gap-5">
          <Metric label="Ready Files" value="4" note="Released by CS checklist" color="#0891B2" />
          <Metric label="Pending Authorization" value="2" note="CFC authorization required" color="#F59E0B" />
          <Metric label="Disbursed Today" value="₹3.2L" note="UTR and SAP posted" color="#22C55E" />
          <Metric label="Blocked" value="1" note="SAP code missing" color="#EF4444" />
        </div>
        <DataCard title="Disbursement Control Queue" action={<button onClick={() => onNavigate('treasury-disbursement')} className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#0891B2', color: 'white', fontSize: 12, fontWeight: 800 }}>Process Selected</button>}>
          <SimpleTable headers={['Loan ID', 'Borrower', 'Amount', 'Stage', 'CS Sign', 'SAP Code', 'Waiting', 'Action']}>
            {rows.map(row => <tr key={`${row.id}-${row.stage}`} className="border-b border-[#EDEEF0] hover:bg-[#F7F8FA]"><Cell mono blue>{row.id}</Cell><Cell>{row.borrower}</Cell><Cell mono right>{formatCurrency(row.amount, true)}</Cell><Cell><StatusBadge status={row.stage} /></Cell><Cell>{row.csSign}</Cell><Cell mono>{row.sapCode || 'Pending'}</Cell><Cell>{row.waiting}</Cell><Cell><button onClick={() => onNavigate(row.page)} className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: row.sapCode ? '#0891B2' : '#EDEEF0', color: row.sapCode ? 'white' : '#6B7280', fontSize: 12, fontWeight: 800 }}>{row.action}</button></Cell></tr>)}
          </SimpleTable>
        </DataCard>
      </div>
    );
  };

  const renderSap = () => {
    if (activePage === 'treasury-sap-log') {
      return (
        <DataCard title="SAP Financial Entries" action={<div className="flex gap-2"><button className="px-3 py-1.5 rounded-lg border border-[#EDEEF0]">Export CSV</button><button className="px-3 py-1.5 rounded-lg border border-[#EDEEF0]">Export PDF</button></div>}>
          <div className="p-4 border-b border-[#EDEEF0] grid grid-cols-5 gap-2">{['Date range', 'Entry type', 'Loan ID', 'Farmer name', 'Posted by'].map(f => <input key={f} placeholder={f} className="px-3 rounded-lg border border-[#D1D5DB]" style={{ height: 36, fontSize: 12 }} />)}</div>
          <SimpleTable headers={['Date', 'SAP Doc No.', 'Loan ID', 'Borrower', 'Entry Type', 'Dr Account', 'Cr Account', 'Amount', 'Posted By', 'Status']}>
            {sapEntries.map(row => <tr key={row.doc} className="border-b border-[#EDEEF0] hover:bg-[#F7F8FA]"><Cell>{row.date}</Cell><Cell mono>{row.doc}</Cell><Cell mono blue>{row.loan}</Cell><Cell>{row.borrower}</Cell><Cell>{row.type}</Cell><Cell>{row.dr}</Cell><Cell>{row.cr}</Cell><Cell mono right>{formatCurrency(row.amount, true)}</Cell><Cell>{row.by}</Cell><Cell><StatusBadge status={row.status} /></Cell></tr>)}
          </SimpleTable>
          <div className="m-4 rounded-lg p-4" style={{ backgroundColor: '#1A1A2E', color: 'white', fontFamily: 'Roboto Mono', fontSize: 12 }}>Expanded row: FB01 · Posting Date 10.06.2026 · Remarks: Loan disbursement — SFPCL Member Credit · View in SAP ↗</div>
        </DataCard>
      );
    }

    return (
      <div className="grid grid-cols-11 gap-5">
        <div className="col-span-5 bg-white rounded-lg p-5 border border-[#EDEEF0]">
          <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: '#E0F2FE', borderLeft: '4px solid #0891B2', fontSize: 13, color: '#0E7490' }}>Email Request Received · From: Suresh Nair · 10 Jun 2026 · 09:30 AM · Loan ID: LO000050 · Applicant: Prakash Shinde</div>
          <h3 style={{ fontSize: 16, fontWeight: 900 }}>Create New SAP Customer Code</h3><p style={{ fontSize: 12, color: '#6B7280', marginBottom: 12 }}>First-time applicant — new Customer ID required per SOP §5.1</p>
          {[
            ['Farmer Full Name', 'Prakash Ramchandra Shinde'], ['Aadhaar Number', 'XXXX-XXXX-3421'], ['PAN Number', 'ABCPS1234F'], ['Address', 'Village Pimpalgaon, Taluka Niphad, Nashik 422209'], ['Email ID', 'prakash.s@gmail.com'], ['Loan Application Number', 'LO000050'], ['SAP Company Code', 'SFPCL'], ['Customer Account Group', 'Z001 — FPC Member Borrower'],
          ].map(([label, value]) => <div key={label} className="mb-3"><label style={{ fontSize: 12, color: '#3D4450', fontWeight: 800 }}>{label}</label><input readOnly value={value} className="w-full mt-1 px-3 rounded-lg border border-[#D1D5DB] bg-[#F7F8FA]" style={{ height: 38, fontSize: 13 }} /></div>)}
          <div className="p-3 rounded-lg mb-3" style={{ backgroundColor: '#FEF3C7', color: '#92400E', fontSize: 13, fontWeight: 800 }}>Duplicate check: No existing SAP customer ID found for PAN ABCPS1234F.</div>
          <button className="w-full py-3 rounded-lg font-semibold" style={{ backgroundColor: '#0891B2', color: 'white' }}>Create SAP Customer Code</button>
        </div>
        <div className="col-span-6"><DataCard title="Recent SAP Code Creations"><SimpleTable headers={['Loan ID', 'Farmer Name', 'Aadhaar', 'PAN', 'SAP Code', 'Status']}>{sapCodeRequests.map(row => <tr key={row.loan} className="border-b border-[#EDEEF0]"><Cell mono blue>{row.loan}</Cell><Cell>{row.borrower}</Cell><Cell mono>{row.aadhaar}</Cell><Cell mono>{row.pan}</Cell><Cell mono>{row.code}</Cell><Cell><StatusBadge status={row.status} /></Cell></tr>)}</SimpleTable></DataCard></div>
      </div>
    );
  };

  const renderRepayments = () => {
    if (activePage === 'treasury-deductions') {
      return (
        <div className="space-y-5">
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F8FA', borderLeft: '4px solid #1A3C2A', fontSize: 13, color: '#3D4450' }}><strong>Tri-Party Repayment Flow:</strong> Farmer sells produce → Subsidiary deducts repayment → transfers to SFPCL → SFPCL posts to SAP. Amounts must match within ₹1 tolerance.</div>
          <DataCard title="Subsidiary Deduction Queue"><SimpleTable headers={['Statement Date', 'Farmer Name', 'Loan ID', 'Subsidiary Ref', 'Gross Payment', 'Deduction', 'Net to Farmer', 'Received', 'Reconciled', 'Action']}>{subsidiaryDeductions.map(row => <tr key={row.ref} className="border-b border-[#EDEEF0]"><Cell>{row.date}</Cell><Cell>{row.borrower}</Cell><Cell mono blue>{row.loan}</Cell><Cell mono>{row.ref}</Cell><Cell mono right>{formatCurrency(row.gross)}</Cell><Cell mono right>{formatCurrency(row.deduction)}</Cell><Cell mono right>{formatCurrency(row.net)}</Cell><Cell>{row.received}</Cell><Cell><StatusBadge status={row.reconciled} /></Cell><Cell><button className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: row.reconciled === 'Matched' ? '#EDEEF0' : '#0891B2', color: row.reconciled === 'Matched' ? '#3D4450' : 'white', fontSize: 12, fontWeight: 800 }}>{row.reconciled === 'Matched' ? 'View' : 'Reconcile'}</button></Cell></tr>)}</SimpleTable></DataCard>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <div className="rounded-lg p-4" style={{ backgroundColor: '#12151A', color: 'white', fontSize: 16, fontWeight: 900 }}>This Month's Collections: ₹2,18,500 received | 14 transactions | <span style={{ color: '#F59E0B' }}>₹43,200 pending SAP posting</span></div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: '#E0F2FE', borderLeft: '4px solid #0891B2', fontSize: 13, color: '#0E7490' }}>Repayment allocation is hardcoded: partial repayments apply to principal first, then interest. Full repayment triggers NOC workflow to Compliance.</div>
        <DataCard title="Awaiting SAP Entry" action={<button className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#0891B2', color: 'white', fontSize: 12, fontWeight: 800 }}>Post All to SAP</button>}>
          <SimpleTable headers={['Date', 'UTR No.', 'Farmer Name', 'Loan ID', 'Amount', 'Mode', 'Principal Adj.', 'Interest Adj.', 'Balance After', 'Action']}>
            {directRepayments.map(row => <tr key={row.loan} className="border-b border-[#EDEEF0]" style={{ backgroundColor: row.status === 'UTR Missing' ? '#FEF2F2' : 'white' }}><Cell>{row.date}</Cell><Cell mono>{row.utr}</Cell><Cell>{row.borrower}</Cell><Cell mono blue>{row.loan}</Cell><Cell mono right>{formatCurrency(row.amount)}</Cell><Cell>{row.mode}</Cell><Cell mono right>{row.principal ? formatCurrency(row.principal) : '-'}</Cell><Cell mono right>{row.interest ? formatCurrency(row.interest) : '-'}</Cell><Cell mono right>{row.balance ? formatCurrency(row.balance) : '-'}</Cell><Cell><button className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: row.status === 'UTR Missing' ? '#FEF3C7' : '#0891B2', color: row.status === 'UTR Missing' ? '#92400E' : 'white', fontSize: 12, fontWeight: 800 }}>{row.status === 'UTR Missing' ? 'Verify UTR' : 'Post to SAP'}</button></Cell></tr>)}
          </SimpleTable>
        </DataCard>
      </div>
    );
  };

  const renderInterest = () => (
    <div className="space-y-5">
      <div className="rounded-lg p-4" style={{ backgroundColor: '#12151A', color: 'white', fontWeight: 900 }}>June 2026 — Accruing interest on 47 active loans · Total this month: ₹24,300</div>
      <DataCard title="Monthly Accruals" action={<button className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#2D7A4F', color: 'white', fontSize: 12, fontWeight: 800 }}>Generate All June Accruals</button>}>
        <SimpleTable headers={['Loan ID', 'Borrower', 'Principal O/S', 'Rate', 'Monthly Interest', 'Accrual Date', 'SAP Entry', 'Status']}>{interestAccruals.map(row => <tr key={row.loan} className="border-b border-[#EDEEF0]"><Cell mono blue>{row.loan}</Cell><Cell>{row.borrower}</Cell><Cell mono right>{formatCurrency(row.principal)}</Cell><Cell>{row.rate}</Cell><Cell mono right>{formatCurrency(row.interest)}</Cell><Cell>{row.date}</Cell><Cell mono>{row.sap}</Cell><Cell><StatusBadge status={row.status} /></Cell></tr>)}</SimpleTable>
      </DataCard>
      <div className="grid grid-cols-2 gap-5">
        <DataCard title="Year-End Interest Invoices"><SimpleTable headers={['Loan ID', 'Interest', 'Status', 'Due By', 'Action']}><tr><Cell mono blue>LO000031</Cell><Cell mono>₹17,100</Cell><Cell><StatusBadge status="Paid" /></Cell><Cell>30 Apr 2026</Cell><Cell>View Invoice</Cell></tr><tr style={{ backgroundColor: '#FEF2F2' }}><Cell mono blue>LO000022</Cell><Cell mono>₹9,600</Cell><Cell><StatusBadge status="Unpaid" /></Cell><Cell>30 Apr 2026</Cell><Cell>Capitalize →</Cell></tr></SimpleTable></DataCard>
        <DataCard title="Capitalization Guardrail"><div className="p-5" style={{ fontSize: 13, color: '#3D4450', lineHeight: '22px' }}>Capitalization is valid only after 30 April cutoff and after intimation letter is sent to borrower. Finance Controller authorization is required before posting the SAP capitalization entry.</div></DataCard>
      </div>
    </div>
  );

  const renderReconciliation = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-5"><Metric label="Bank Statement Total Credits" value="₹3,82,500" note="RBL statement credits" color="#22C55E" /><Metric label="SAP-Posted Total Credits" value="₹3,82,500" note="SAP receipts posted" color="#22C55E" /><Metric label="Unreconciled Items" value="1" note="₹10,000 likely LO000022" color="#EF4444" /></div>
      <DataCard title="Matched and Unmatched Transactions"><SimpleTable headers={['Statement Date', 'Description', 'Statement Amount', 'SAP Entry', 'SAP Amount', 'Match', 'Action']}>{reconciliationRows.map(row => <tr key={row.desc} className="border-b border-[#EDEEF0]" style={{ backgroundColor: row.match ? '#F0FDF4' : '#FEF2F2' }}><Cell>{row.date}</Cell><Cell>{row.desc}</Cell><Cell mono right>{formatCurrency(row.statement)}</Cell><Cell mono>{row.sap}</Cell><Cell mono right>{row.sapAmount ? formatCurrency(row.sapAmount) : '-'}</Cell><Cell>{row.match ? '✓' : 'Unmatched'}</Cell><Cell>{row.match ? 'Matched' : <button className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#EF4444', color: 'white', fontSize: 12, fontWeight: 800 }}>Match Manually</button>}</Cell></tr>)}</SimpleTable></DataCard>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-5"><Metric label="Total Disbursed" value="₹42.6L" note="Loan portfolio total" color="#0891B2" /><Metric label="Outstanding" value="₹38.4L" note="Principal outstanding" color="#1A3C2A" /><Metric label="Collection Efficiency" value="91%" note="Current FY" color="#22C55E" /><Metric label="SAP Open Items" value="3" note="Posting exceptions" color="#F59E0B" /></div>
      <div className="grid grid-cols-3 gap-5">{['Bank Reconciliation Report', 'Ledger Summary', 'Disbursement Advice Export', 'SAP Posting Audit', 'Interest Accrual Pack', 'Subsidiary Deduction Report', 'Quarterly CFO MIS', 'Export Centre Bundle', 'NOC / Closure Register'].map(report => <div key={report} className="bg-white rounded-lg p-5 border border-[#EDEEF0]"><FileBarChart size={18} color="#0891B2" /><h3 style={{ fontSize: 14, fontWeight: 900, marginTop: 12 }}>{report}</h3><p style={{ fontSize: 13, color: '#3D4450', minHeight: 40, marginTop: 8 }}>Finance-ready export with audit references, SAP status and transaction totals.</p><button className="mt-3 px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#E0F2FE', color: '#0891B2', fontSize: 12, fontWeight: 800 }}><Download size={13} style={{ display: 'inline', marginRight: 6 }} />Generate</button></div>)}</div>
    </div>
  );

  const renderContent = () => {
    if (activePage === 'treasury-sap-codes' || activePage === 'treasury-sap-log') return renderSap();
    if (activePage === 'treasury-incoming' || activePage === 'treasury-deductions') return renderRepayments();
    if (activePage === 'treasury-interest') return renderInterest();
    if (activePage === 'treasury-reconciliation') return renderReconciliation();
    if (activePage === 'treasury-ledger' || activePage === 'treasury-exports' || activePage === 'treasury-reports') return renderReports();
    return renderDisbursements();
  };

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Treasury', meta.title]}
      pageTitle={meta.title}
      pageSubtitle={meta.subtitle}
      actions={<button onClick={() => onNavigate('treasury-disbursement')} className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold" style={{ backgroundColor: '#0891B2', color: 'white', fontSize: 14 }}><Banknote size={14} /> Open Disbursement Flow</button>}
    >
      {renderContent()}
    </Shell>
  );
}

function Header({ icon, title, action }: { icon: ReactNode; title: string; action?: ReactNode }) {
  return <div className="px-5 py-3 border-b border-[#EDEEF0] flex items-center justify-between" style={{ backgroundColor: '#F7F8FA' }}><div className="flex items-center gap-2" style={{ color: '#0891B2' }}>{icon}<h3 style={{ fontSize: 15, fontWeight: 900, color: '#12151A' }}>{title}</h3></div>{action}</div>;
}

function DataCard({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return <div className="bg-white rounded-lg border border-[#EDEEF0] overflow-hidden"><Header icon={<Receipt size={16} />} title={title} action={action} />{children}</div>;
}

function SimpleTable({ headers, children }: { headers: string[]; children: ReactNode }) {
  return <table className="w-full"><thead><tr>{headers.map(h => <th key={h} className="px-4 py-3 text-left" style={{ fontSize: 11, color: '#9EA8B3', fontWeight: 800, textTransform: 'uppercase' }}>{h}</th>)}</tr></thead><tbody>{children}</tbody></table>;
}

function Cell({ children, mono, blue, right }: { children: ReactNode; mono?: boolean; blue?: boolean; right?: boolean }) {
  return <td className={`px-4 py-3 ${right ? 'text-right' : ''}`} style={{ fontSize: 13, color: blue ? '#0E7490' : '#3D4450', fontFamily: mono ? 'Roboto Mono' : 'inherit', fontWeight: blue ? 900 : 600 }}>{children}</td>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between py-2 border-b border-[#EDEEF0]"><span style={{ fontSize: 12, color: '#6B7280' }}>{label}</span><span style={{ fontSize: 12, color: '#12151A', fontWeight: 800, textAlign: 'right' }}>{value}</span></div>;
}
