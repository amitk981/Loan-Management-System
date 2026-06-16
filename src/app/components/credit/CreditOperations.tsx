import { useState } from 'react';
import { AlertTriangle, Download, FileText, Mail, Search, Send, ShieldCheck } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from '../shared/StatusBadge';
import { WorkbenchTabs } from '../shared/WorkbenchTabs';
import { creditIntakeTabs, creditWorkbenchTabs } from '../../data/roleNav';
import { appraisalLoan, auditTrail, creditApplications, dpdRows, dpdSummary, interestInvoices, loanRegister, sanctionQueue } from '../../data/creditData';
import { formatCurrency } from '../../lib/format';

interface CreditOperationsProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

const pageCopy: Record<string, { title: string; subtitle: string }> = {
  'credit-pending': { title: 'Under Review', subtitle: 'Appraisal worklist' },
  'credit-returned': { title: 'Pending Documents', subtitle: 'Incomplete borrower files' },
  'credit-sc-queue': { title: 'Sanction Committee Queue', subtitle: 'Submitted applications' },
  'credit-active-loans': { title: 'Active Loans', subtitle: 'Live portfolio with repayment status' },
  'credit-repayments': { title: 'Repayment Follow-up', subtitle: 'SAP posting and balance updates' },
  'credit-dpd': { title: 'DPD Monitoring', subtitle: 'Overdue buckets and MIS' },
  'credit-register': { title: 'Loan Register', subtitle: 'Updated 11:42 AM' },
  'credit-rejected': { title: 'Rejected Applications', subtitle: 'Rejection records' },
  'credit-exceptions': { title: 'Exception Register', subtitle: 'Overrides and bypasses' },
  'credit-mis': { title: 'Portfolio MIS', subtitle: 'Board and CFO packs' },
  'credit-interest-invoices': { title: 'Interest Invoices', subtitle: 'FY 2024-25 batch' },
  'credit-search-member': { title: 'Member Search', subtitle: 'Borrower context' },
  'credit-member-profile': { title: 'Member Profile', subtitle: 'Borrower profile' },
  'credit-defaults': { title: 'Defaults & Recovery', subtitle: 'Stage 6 workflow' },
  'credit-analytics': { title: 'Portfolio Analytics', subtitle: 'Risk concentration' },
  'credit-all-apps': { title: 'All Applications', subtitle: 'Complete application history' },
};


export function CreditOperations({ onNavigate, activePage }: CreditOperationsProps) {
  const [selectedSc, setSelectedSc] = useState('LO00000085');
  const [selectedLoan, setSelectedLoan] = useState('LO00000018');
  const [search, setSearch] = useState('');
  const meta = pageCopy[activePage] || pageCopy['credit-register'];

  const renderApplications = () => {
    const rows = activePage === 'credit-returned'
      ? creditApplications.filter(app => app.status === 'Incomplete')
      : creditApplications.filter(app => app.status !== 'Complete');
    return (
      <DataCard title={activePage === 'credit-returned' ? 'Incomplete Files' : 'Appraisal Worklist'} action={<button onClick={() => onNavigate('credit-queue')} style={{ fontSize: '13px', color: 'var(--brand-accent)', fontWeight: 800 }}>Open Intake</button>}>
        <SimpleTable headers={['Loan ID', 'Borrower', 'Requested', 'Purpose', 'TAT / Blocker', 'Action']}>
          {rows.map(row => (
            <tr key={row.id} onClick={() => onNavigate(row.status === 'Incomplete' ? 'credit-queue' : 'credit-review')} className="border-b border-[#E5E7EB] clickable-row">
              <Cell mono blue>{row.id}</Cell>
              <Cell><strong>{row.shortName}</strong><br /><span style={{ color: '#6B7280', fontSize: '12px' }}>{row.folio} · {row.village}</span></Cell>
              <Cell right mono>{formatCurrency(row.amount)}</Cell>
              <Cell>{row.purpose}</Cell>
              <Cell><StatusBadge status={row.status} /> <span style={{ marginLeft: '8px', fontSize: '12px', color: '#6B7280' }}>{row.blocker}</span></Cell>
              <Cell><button onClick={(e) => { e.stopPropagation(); onNavigate(row.status === 'Incomplete' ? 'credit-queue' : 'credit-review'); }} className="px-3 py-1.5 rounded-md" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '12px', fontWeight: 700 }}>{row.status === 'Incomplete' ? 'Request Docs' : 'Review'}</button></Cell>
            </tr>
          ))}
        </SimpleTable>
      </DataCard>
    );
  };

  const renderSanctionQueue = () => {
    const selected = sanctionQueue.find(row => row.id === selectedSc) || sanctionQueue[2];
    return (
      <div className="space-y-5">
        <DataCard title="Sanction Committee Queue" action={<button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md" style={{ backgroundColor: '#E8F1FA', color: 'var(--brand-accent)', fontSize: '12px', fontWeight: 800 }}><Download size={13} /> Export CSV</button>}>
          <SimpleTable headers={['Loan ID', 'Name', 'Amount', 'Submitted', 'SC Level', 'Status']}>
            {sanctionQueue.map(row => (
              <tr key={row.id} onClick={() => setSelectedSc(row.id)} className="border-b border-[#E5E7EB] hover:bg-[#FAFAF8] cursor-pointer" style={{ backgroundColor: selectedSc === row.id ? '#E8F1FA' : 'white' }}>
                <Cell mono blue>{row.id}</Cell>
                <Cell><strong>{row.name}</strong></Cell>
                <Cell right mono>{formatCurrency(row.amount)}</Cell>
                <Cell>{row.submitted}</Cell>
                <Cell><span className="px-2 py-1 rounded-full" style={{ backgroundColor: row.level === 'CFO+2Dir' ? '#F3E8FF' : '#E8F1FA', color: row.level === 'CFO+2Dir' ? '#7C3AED' : 'var(--brand-accent)', fontSize: '11px', fontWeight: 800 }}>{row.level}</span></Cell>
                <Cell><StatusBadge status={row.status} /></Cell>
              </tr>
            ))}
          </SimpleTable>
        </DataCard>
        <div className="bg-white rounded-lg p-5 border border-[#E5E7EB]">
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--neutral-900)' }}>Expanded Row: {selected.id} — {selected.name}</div>
          <div className="grid grid-cols-4 gap-3 mt-4">
            <Info label="SC Decision" value={selected.status.toUpperCase()} />
            <Info label="Approved by" value={selected.status === 'Approved' ? 'CFO + Dir. Sharma' : selected.status === 'Rejected' ? 'SC Rejected' : 'Pending'} />
            <Info label="Approved Amount" value={selected.status === 'Approved' ? formatCurrency(selected.amount) : '-'} mono />
            <Info label="CSR Entry" value={selected.csr || 'Pending'} mono />
          </div>
          {selected.status === 'Approved' && <button className="mt-4 px-4 py-2.5 rounded-lg font-semibold" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}>Proceed to Documentation Stage →</button>}
          {selected.status === 'Rejected' && <button className="mt-4 px-4 py-2.5 rounded-lg font-semibold" style={{ backgroundColor: '#C62828', color: 'white', fontSize: '14px' }}>Prepare Rejection Note →</button>}
        </div>
      </div>
    );
  };

  const renderRegister = () => (
    <DataCard title="Loan Register" action={<div className="flex items-center gap-2"><input placeholder="Search by LO# / Name / Village" className="px-3 rounded-md border border-[#D1D5DB]" style={{ height: '34px', fontSize: '13px' }} /><button className="px-3 py-1.5 rounded-md" style={{ backgroundColor: '#E8F1FA', color: 'var(--brand-accent)', fontSize: '12px', fontWeight: 800 }}>Export ↓</button></div>}>
      <SimpleTable headers={['#', 'Loan ID', 'Borrower', 'Amount', 'Disbursed', 'Stage', 'DPD', 'Action']}>
        {loanRegister.map((row, i) => (
          <tr key={row.id} onClick={() => setSelectedLoan(row.id)} className="border-b border-[#E5E7EB] clickable-row">
            <Cell>{String(i + 1)}</Cell>
            <Cell mono blue>{row.id}</Cell>
            <Cell><strong>{row.borrower}</strong></Cell>
            <Cell right mono>{formatCurrency(row.amount)}</Cell>
            <Cell>{row.disbursed}</Cell>
            <Cell><StatusBadge status={row.stage} /></Cell>
            <Cell><span style={{ color: row.dpd > 90 ? '#C62828' : row.dpd > 0 ? 'var(--warning-500)' : '#2E7D32', fontWeight: 700 }}>{row.dpd ? `${row.dpd} days` : '0'}</span></Cell>
            <Cell><button onClick={(e) => { e.stopPropagation(); onNavigate('loan-file'); }} className="px-3 py-1.5 rounded-md" style={{ backgroundColor: '#FAFAF8', color: 'var(--brand-accent)', fontSize: '12px', fontWeight: 800 }}>Open File</button></Cell>
          </tr>
        ))}
      </SimpleTable>
      <div className="p-4 border-t border-[#E5E7EB]" style={{ fontSize: '13px', color: '#6B7280' }}>Showing 1-5 of 147 · Selected drawer: {selectedLoan}</div>
    </DataCard>
  );

  const renderDpd = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-5 gap-4">
        {dpdSummary.map(item => (
          <div key={item.label} className="bg-white rounded-lg p-4 border border-[#E5E7EB]">
            <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 800 }}>{item.label}</div>
            <div style={{ fontSize: '24px', color: item.color, fontWeight: 700, marginTop: '6px' }}>{item.loans ? `${item.loans} loans` : item.amount}</div>
            {item.loans > 0 && <div style={{ fontSize: '13px', color: 'var(--neutral-700)', fontFamily: 'Roboto Mono', marginTop: '4px' }}>{item.amount}</div>}
          </div>
        ))}
      </div>
      <DataCard title="DPD Table: Filter 3+ Years" action={<button className="px-3 py-1.5 rounded-md" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '12px', fontWeight: 800 }}>Generate CFO MIS Report</button>}>
        <SimpleTable headers={['Borrower', 'Loan ID', 'Amount', 'DPD Days', 'Action Required']}>
          {dpdRows.map(row => (
            <tr key={row.loan} onClick={() => setSelectedLoan(row.loan)} className="border-b border-[#E5E7EB] clickable-row">
              <Cell><strong>{row.borrower}</strong></Cell>
              <Cell mono blue>{row.loan}</Cell>
              <Cell right mono>{formatCurrency(row.amount)}</Cell>
              <Cell><span style={{ color: '#C62828', fontWeight: 700 }}>{row.dpd} d</span></Cell>
              <Cell><StatusBadge status={row.action} /><br /><span style={{ fontSize: '12px', color: 'var(--brand-accent)', fontWeight: 800 }}>{row.note}</span></Cell>
            </tr>
          ))}
        </SimpleTable>
      </DataCard>
      <div className="bg-white rounded-lg p-5 border border-[#E5E7EB]">
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--neutral-900)' }}>Default Workflow Panel — LO00000018</h3>
        {['Missed payment detected — 12-Jan-2024', '3-month grace period given — 15-Jan-2024 → 15-Apr-2024', 'Non-payment assessed: Non-intentional (crop failure noted)', '1-year extension granted — 20-Apr-2024 → 20-Apr-2025', 'Extension period expired — 20-Apr-2025 — still not repaid'].map((item, i) => (
          <div key={item} className="flex items-center gap-3 py-2"><span style={{ color: i < 4 ? '#2E7D32' : '#C62828', fontWeight: 700 }}>{i < 4 ? '✓' : '✕'}</span><span style={{ fontSize: '13px', color: 'var(--neutral-700)' }}>{item}</span></div>
        ))}
        <textarea className="w-full mt-3 p-3 rounded-lg border border-[#D1D5DB]" rows={5} defaultValue="Auto-draft note for non-payment: Narayan Patil, LO00000018, sanctioned ₹1,20,000, DPD 1247 days. Crop failure recorded; extension expired. Recommendation: submit to SC for action approval and review SH-4 / undated cheque invocation." />
        <button className="mt-3 px-4 py-2.5 rounded-lg font-semibold" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}>Submit to Sanction Committee for action approval</button>
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">{[['Generated', '89'], ['Sent', '76'], ['Paid', '61'], ['Unpaid post-30 Apr', '15']].map(([l, v]) => <Info key={l} label={l} value={v} />)}</div>
      <DataCard title="Interest Invoice Batch" action={<button className="px-3 py-1.5 rounded-md" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '12px', fontWeight: 800 }}>Generate All Invoices</button>}>
        <SimpleTable headers={['Borrower', 'Loan ID', 'Principal', 'Interest (yr)', 'Status', 'Action']}>
          {interestInvoices.map(row => (
            <tr key={row.loan} onClick={() => setSelectedLoan(row.loan)} className="border-b border-[#E5E7EB] clickable-row">
              <Cell><strong>{row.borrower}</strong></Cell><Cell mono blue>{row.loan}</Cell><Cell right mono>{formatCurrency(row.principal)}</Cell><Cell right mono>{formatCurrency(row.interest)}<br /><span style={{ fontSize: '11px', color: '#6B7280' }}>(12% p.a.)</span></Cell><Cell><StatusBadge status={row.status} /></Cell><Cell><button className="px-3 py-1.5 rounded-md" style={{ backgroundColor: row.status === 'Unpaid' ? 'var(--warning-100)' : '#E8F1FA', color: row.status === 'Unpaid' ? '#92400E' : 'var(--brand-accent)', fontSize: '12px', fontWeight: 800 }}>{row.action}</button></Cell>
            </tr>
          ))}
        </SimpleTable>
      </DataCard>
      <div className="bg-white rounded-lg p-5 border border-[#E5E7EB]">
        <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Capitalization Workflow</h3>
        <p style={{ fontSize: '13px', color: 'var(--neutral-700)', lineHeight: '20px', marginTop: '8px' }}>Loans with unpaid interest past 30 April: 15 cases. Bulk capitalisation will add interest to principal, recalculate FY interest, generate intimation letters, and notify Sr. Manager-Finance for SAP accrual entries.</p>
        <button className="mt-4 px-4 py-2.5 rounded-lg font-semibold" style={{ backgroundColor: '#E65100', color: 'white', fontSize: '14px' }}>Preview changes before confirming</button>
      </div>
    </div>
  );

  const renderSap = () => (
    <div className="bg-white rounded-lg p-6 border border-[#E5E7EB] max-w-4xl">
      <div className="flex items-center justify-between mb-5"><div><h3 style={{ fontSize: '18px', fontWeight: 700 }}>Create SAP Customer Code — LO00000090 — Ganesh Thorat FPC</h3><div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>Status: SC Approved ✓ → SAP Code: Not yet created ⏳</div></div><Mail color="var(--brand-accent)" /></div>
      <InfoGrid rows={[
        ['Farmer Full Name', 'Ganesh Thorat Farmers Producer Company'],
        ['Aadhaar Number', 'XXXX XXXX 4821'],
        ['PAN Number', 'AABCG1234D'],
        ['Address', 'Village Ojhar, Tal. Niphad, Nashik - 422 209'],
        ['Email ID', 'ganesh.thorat.fpc@gmail.com'],
        ['Loan Application No.', appraisalLoan.id],
      ]} />
      <div className="mt-5 p-4 rounded-lg" style={{ backgroundColor: '#FAFAF8', border: '1px solid #E5E7EB', fontSize: '13px', color: 'var(--neutral-700)', lineHeight: '22px' }}>
        Send to: Sr. Manager - Finance (Rohan Mehta) &lt;rmehta@sahyadrifarms.com&gt;<br />Cc: Credit Manager (auto)<br />Format: Excel attachment (Annexure I template) + email body
      </div>
      <div className="mt-5 flex gap-3"><button className="px-4 py-2.5 rounded-lg border border-[#E5E7EB]">Preview Email</button><button className="px-4 py-2.5 rounded-lg font-semibold" style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}>Send Request →</button></div>
    </div>
  );

  const renderRecords = () => (
    <div className="space-y-5">
      <DataCard title={activePage === 'credit-exceptions' ? 'Exception Register' : 'Rejected Applications'}>
        <SimpleTable headers={activePage === 'credit-exceptions' ? ['Type', 'Loan ID', 'Justification', 'Approver Ref', 'Status'] : ['Loan ID', 'Borrower', 'Reason', 'Channel', 'Action']}>
          {(activePage === 'credit-exceptions' ? [
            ['Calculation Override', 'LO00000083', 'Director borrower requires GM approval workflow.', 'GM-RES-2025-02', 'Immutable'],
            ['Bypass Check', 'LO00000051', 'Legacy loan imported with missing scanned cheque; physical custody verified.', 'CS-VERIFY-118', 'Annotated'],
          ] : [
            ['LO00000079', 'Suresh Bhagat', 'Purpose outside approved agriculture list', 'Email', 'Prepare Rejection Note'],
            ['LO00000072', 'Mohan Kale', 'KYC not completed after deficiency notice', 'Courier', 'View Register'],
          ]).map(row => <tr key={row[1]} onClick={() => setSelectedLoan(row[1])} className="border-b border-[#E5E7EB] clickable-row">{row.map((cell, i) => <Cell key={i}>{cell}</Cell>)}</tr>)}
        </SimpleTable>
      </DataCard>
      <DataCard title="Audit Trail">
        <SimpleTable headers={['Timestamp', 'Actor', 'Action']}>{auditTrail.map(row => <tr key={row[0]} className="border-b border-[#E5E7EB]">{row.map((cell, i) => <Cell key={i}>{cell}</Cell>)}</tr>)}</SimpleTable>
      </DataCard>
    </div>
  );

  const renderMember = () => (
    <div className="grid grid-cols-5 gap-5">
      <div className="col-span-2 bg-white rounded-lg p-5 border border-[#E5E7EB]">
        <div className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" color="#6B7280" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search member, folio, loan ID" className="w-full pl-9 rounded-md border border-[#D1D5DB]" style={{ height: '38px' }} /></div>
      </div>
      <div className="col-span-3 bg-white rounded-lg p-5 border border-[#E5E7EB]">
        <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Priya Ramesh Shinde</h3>
        <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>Member since April 2021 · Active ✓ · Dindori, Nashik · Grapes (3 acres)</p>
        <InfoGrid rows={[['Folio', 'SH-2847'], ['Shareholding', '250 shares'], ['Valuation', '₹2,000/share · Total ₹5,00,000'], ['Max loan share-based', '₹50,000'], ['Repayment track record', '95% on-time'], ['KYC Status', 'PAN ✓ Aadhaar ✓ Re-KYC Due Aug 2026']]} />
      </div>
    </div>
  );

  const renderMis = () => (
      <div className="grid grid-cols-3 gap-5">
      {['Quarterly Portfolio MIS', 'Section 186 Limit Monitor', 'NBFC Threshold Monitor'].map((title, i) => (
        <button key={title} onClick={() => onNavigate(i === 0 ? 'credit-mis' : 'shared-s186-lock')} className="bg-white rounded-lg p-5 border border-[#E5E7EB] text-left clickable-card">
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{title}</h3>
          <div className="mt-4 h-3 rounded-full" style={{ backgroundColor: '#E5E7EB' }}><div className="h-full rounded-full" style={{ width: i === 0 ? '82%' : i === 1 ? '58%' : '40%', backgroundColor: i === 2 ? 'var(--warning-500)' : '#2E7D32' }} /></div>
          <div style={{ fontSize: '13px', color: 'var(--neutral-700)', marginTop: '12px' }}>{i === 2 ? '40% threshold watch' : 'Ready for export'}</div>
          <span className="inline-flex mt-4 px-3 py-1.5 rounded-md" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '12px', fontWeight: 800 }}>Generate</span>
        </button>
      ))}
    </div>
  );

  const renderActiveLoans = () => {
    const activeRows = loanRegister.filter(row => row.stage === 'Active' || row.stage === 'Disbursed');
    return (
      <DataCard title="Active Loans" action={<button onClick={() => onNavigate('credit-dpd')} className="px-3 py-1.5 rounded-md" style={{ backgroundColor: '#E8F1FA', color: 'var(--brand-accent)', fontSize: '12px', fontWeight: 800 }}>Open DPD Monitor</button>}>
        <SimpleTable headers={['Loan ID', 'Borrower', 'Sanctioned', 'Outstanding', 'DPD', 'Next Due', 'Action']}>
          {activeRows.map(row => (
            <tr key={row.id} onClick={() => setSelectedLoan(row.id)} className="border-b border-[#E5E7EB] clickable-row">
              <Cell mono blue>{row.id}</Cell>
              <Cell><strong>{row.borrower}</strong></Cell>
              <Cell right mono>{formatCurrency(row.amount)}</Cell>
              <Cell right mono>{formatCurrency(Math.round(row.amount * 0.72))}</Cell>
              <Cell><span style={{ color: row.dpd > 90 ? '#C62828' : row.dpd > 0 ? 'var(--warning-500)' : '#2E7D32', fontWeight: 700 }}>{row.dpd ? `${row.dpd} days` : 'Current'}</span></Cell>
              <Cell>{row.disbursed}</Cell>
              <Cell><button onClick={(e) => { e.stopPropagation(); onNavigate('loan-file'); }} className="px-3 py-1.5 rounded-md" style={{ backgroundColor: '#FAFAF8', color: 'var(--brand-accent)', fontSize: '12px', fontWeight: 800 }}>Open File</button></Cell>
            </tr>
          ))}
        </SimpleTable>
      </DataCard>
    );
  };

  const renderContent = () => {
    if (activePage === 'credit-pending' || activePage === 'credit-returned' || activePage === 'credit-queue') return renderApplications();
    if (activePage === 'credit-sc-queue' || activePage === 'credit-all-apps') return renderSanctionQueue();
    if (activePage === 'credit-active-loans') return renderActiveLoans();
    if (activePage === 'credit-dpd' || activePage === 'credit-defaults' || activePage === 'credit-analytics') return renderDpd();
    if (activePage === 'credit-interest-invoices') return renderInvoices();
    if (activePage === 'credit-repayments') return renderSap();
    if (activePage === 'credit-rejected' || activePage === 'credit-exceptions') return renderRecords();
    if (activePage === 'credit-search-member' || activePage === 'credit-member-profile') return renderMember();
    if (activePage === 'credit-mis') return renderMis();
    return renderRegister();
  };

  const showIntakeTabs = creditIntakeTabs.some(tab => tab.key === activePage);
  const showWorkbenchTabs = creditWorkbenchTabs.some(tab => tab.key === activePage);

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Credit Assessment', meta.title]}
      pageTitle={meta.title}
      pageSubtitle={meta.subtitle}
      actions={<button onClick={() => onNavigate('credit-review')} className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}><ShieldCheck size={14} /> Open Appraisal Note</button>}
    >
      {showIntakeTabs && (
        <WorkbenchTabs tabs={creditIntakeTabs} activeKey={activePage} onChange={onNavigate} accent="var(--brand-primary)" />
      )}
      {showWorkbenchTabs && (
        <WorkbenchTabs tabs={creditWorkbenchTabs} activeKey={activePage} onChange={onNavigate} accent="var(--brand-primary)" />
      )}
      {renderContent()}
    </Shell>
  );
}

function DataCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden"><div className="px-5 py-3 border-b border-[#E5E7EB] flex items-center justify-between" style={{ backgroundColor: '#FAFAF8' }}><h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--neutral-900)' }}>{title}</h3>{action}</div>{children}</div>;
}

function SimpleTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return <div className="table-scroll"><table className="w-full"><thead><tr>{headers.map(h => <th key={h} className="px-4 py-3 text-left" style={{ fontSize: '11px', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}

function Cell({ children, mono, blue, right }: { children: React.ReactNode; mono?: boolean; blue?: boolean; right?: boolean }) {
  return <td className={`px-4 py-3 ${right ? 'text-right' : ''}`} style={{ fontSize: '13px', color: blue ? 'var(--brand-accent)' : 'var(--neutral-700)', fontFamily: mono ? 'Roboto Mono' : 'inherit', fontWeight: blue ? 800 : 500 }}>{children}</td>;
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return <div className="bg-white rounded-lg p-4 border border-[#E5E7EB]"><div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>{label}</div><div style={{ fontSize: '18px', color: 'var(--neutral-900)', fontWeight: 700, marginTop: '6px', fontFamily: mono ? 'Roboto Mono' : 'inherit' }}>{value}</div></div>;
}

function InfoGrid({ rows }: { rows: string[][] }) {
  return <div className="grid grid-cols-2 gap-3 mt-5">{rows.map(([label, value]) => <Info key={label} label={label} value={value} mono={label.includes('No') || label.includes('Folio') || label.includes('PAN') || label.includes('Aadhaar')} />)}</div>;
}
