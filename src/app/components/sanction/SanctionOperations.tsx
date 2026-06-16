import type { ReactNode } from 'react';
import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from '../shared/StatusBadge';
import { WorkbenchTabs } from '../shared/WorkbenchTabs';
import { sanctionPortfolioTabs, sanctionWorkbenchTabs } from '../../data/roleNav';
import { defaultEscalation, sanctionRegister, scApprovalQueue, scExceptions, scPortfolio, specialCase } from '../../data/sanctionData';
import { formatCurrency } from '../../lib/format';

interface SanctionOperationsProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

const pageCopy: Record<string, { title: string; subtitle: string }> = {
  'sc-awaiting': { title: 'Approval Queue', subtitle: 'Loans ready for scrutiny' },
  'sc-my-sign': { title: 'Awaiting My Sign', subtitle: 'Pending CFO decisions' },
  'sc-special-cases': { title: 'Special Cases', subtitle: 'Director and relative applications' },
  'sc-returns': { title: 'Return for Clarification', subtitle: 'Return reasons' },
  'sc-register': { title: 'Credit Sanction Register', subtitle: 'Decision record' },
  'sc-exceptions': { title: 'Exception Register', subtitle: 'Policy deviations' },
  'sc-board': { title: 'Board Minutes Archive', subtitle: 'Resolution references' },
  'sc-health': { title: 'Portfolio Health & Exposure', subtitle: 'Q3 FY 2025-26' },
  'sc-exposure': { title: 'Exposure & Limits', subtitle: 's.186 and NBFC monitor' },
  'sc-dpd': { title: 'DPD / Default Summary', subtitle: 'Default ageing' },
  'sc-security-invocation': { title: 'Security Invocation Queue', subtitle: 'Recovery authority' },
  'sc-default-escalations': { title: 'Default Escalations', subtitle: 'SC recovery actions' },
  'sc-policy': { title: 'Policy Settings', subtitle: 'Authority matrix' },
};


export function SanctionOperations({ onNavigate, activePage }: SanctionOperationsProps) {
  const [queueFilter, setQueueFilter] = useState('All');
  const [registerFilter, setRegisterFilter] = useState('All');
  const [exceptionFilter, setExceptionFilter] = useState('All');
  const meta = pageCopy[activePage] || pageCopy['sc-register'];
  const showDecisionTabs = sanctionWorkbenchTabs.some(tab => tab.key === activePage);
  const showPortfolioTabs = sanctionPortfolioTabs.some(tab => tab.key === activePage);

  const renderSpecial = () => (
    <div className="bg-white rounded-lg p-5 border-2" style={{ borderColor: 'var(--gold-500)', borderTopWidth: 4 }}>
      <div className="flex items-start justify-between">
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--warning-700)' }}>Special Case — GM Approval Required</h3>
          <p style={{ fontSize: '13px', color: 'var(--neutral-700)', marginTop: '8px' }}>Loan: {specialCase.loan} · Borrower: {specialCase.borrower} · Amount Requested: {formatCurrency(specialCase.amount)}</p>
          <p style={{ fontSize: '13px', color: 'var(--neutral-700)', marginTop: '4px' }}>Relationship: {specialCase.relationship} · Application date: {specialCase.applicationDate}</p>
          <p style={{ fontSize: '13px', color: 'var(--warning-700)', marginTop: '12px', fontWeight: 700 }}>Legal basis: Companies Act 2013, Section 378ZK. R. Deshmukh is excluded from deliberations automatically.</p>
        </div>
        <StatusBadge status="GM Required" size="md" />
      </div>
      <div className="mt-5 space-y-3">
        {['Application received', 'Special case flag raised (by Credit Manager)', 'R. Deshmukh excluded from SC deliberations (system-enforced)', 'General Meeting resolution obtained', 'GM resolution verified by CS', 'SC review excluding R. Deshmukh', 'SC decision recorded'].map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: i < 3 ? 'var(--success-100)' : i === 3 ? 'var(--warning-100)' : 'var(--neutral-200)', color: i < 3 ? 'var(--success-700)' : i === 3 ? 'var(--warning-700)' : 'var(--neutral-400)', fontWeight: 700 }}>{i < 3 ? '✓' : i + 1}</div>
            <div style={{ fontSize: '13px', color: i > 3 ? 'var(--neutral-400)' : 'var(--neutral-700)', fontWeight: i === 3 ? 700 : 500 }}>{step}</div>
            {i === 3 && <button className="ml-auto px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '12px', fontWeight: 700 }}>Upload GM Resolution ↑</button>}
          </div>
        ))}
      </div>
      <div className="mt-5 p-4 rounded-lg" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', color: 'var(--warning-700)', fontSize: '13px', fontWeight: 700 }}>Current blocker: GM resolution not yet uploaded. Disbursement is locked until step 4 is complete.</div>
    </div>
  );

  const renderRegister = () => (
    <DataCard title="Credit Sanction Register" action={<div className="flex gap-2"><button className="px-3 py-1.5 rounded-lg border border-[#EDEEF0]">Export CSV</button><button className="px-3 py-1.5 rounded-lg border border-[#EDEEF0]">Export PDF</button></div>}>
      <div className="p-4 border-b border-[#EDEEF0] flex gap-2 flex-wrap">{['All', 'Approved', 'Rejected', 'Returned', 'CFO+1Dir', 'CFO+2Dir', 'Flagged only'].map(f => <button key={f} onClick={() => setRegisterFilter(f)} className="px-3 py-1.5 rounded-full" style={{ backgroundColor: registerFilter === f ? 'var(--accent-sanction)' : 'var(--neutral-100)', color: registerFilter === f ? 'white' : 'var(--neutral-700)', fontSize: '12px', fontWeight: 700 }}>{f}</button>)}</div>
      <SimpleTable headers={['Date', 'Loan ID', 'Borrower', 'Amount', 'Decision', 'Authority']}>
        {sanctionRegister.map(row => <tr key={row.loan} onClick={() => onNavigate('sc-register')} className="border-b border-[#EDEEF0] clickable-row"><Cell>{row.date}</Cell><Cell mono blue>{row.loan}</Cell><Cell>{row.borrower}</Cell><Cell mono right>{formatCurrency(row.amount)}</Cell><Cell><StatusBadge status={row.decision} /></Cell><Cell>{row.authority}</Cell></tr>)}
      </SimpleTable>
      <div className="p-4 border-t border-[#EDEEF0]" style={{ fontSize: '13px', color: 'var(--neutral-700)' }}><strong>Expanded row example:</strong> LO00000091 signed by S. Nair (CFO) and R. Deshmukh (Director). 7-point checklist all confirmed. Sanction Note Ref: LAN-LO91-2025. Rows are immutable.</div>
    </DataCard>
  );

  const renderApprovalQueue = () => (
    <DataCard title={activePage === 'sc-my-sign' ? 'Awaiting S. Nair Signature' : 'Sanction Committee Approval Queue'} action={<button className="px-3 py-1.5 rounded-lg border border-[#EDEEF0]">Sort: Oldest first</button>}>
      <div className="p-4 border-b border-[#EDEEF0] flex gap-2 flex-wrap">
        {['All', 'CFO + 1 Director', 'Joint >₹5L', 'Borderline', 'Oldest first'].map(f => (
          <button key={f} onClick={() => setQueueFilter(f)} className="px-3 py-1.5 rounded-full" style={{ backgroundColor: queueFilter === f ? 'var(--accent-sanction)' : 'var(--neutral-100)', color: queueFilter === f ? 'white' : 'var(--neutral-700)', fontSize: '12px', fontWeight: 700 }}>{f}</button>
        ))}
      </div>
      <SimpleTable headers={['Priority', 'Loan ID', 'Borrower', 'Amount', 'Appraisal', 'Authority', 'Waiting', 'Action']}>
        {scApprovalQueue.map(row => (
          <tr key={row.id} onClick={() => onNavigate(row.page)} className="border-b border-[#EDEEF0] clickable-row">
            <Cell>{row.priority}</Cell>
            <Cell mono blue>{row.id}</Cell>
            <Cell>{row.borrower}</Cell>
            <Cell mono right>{formatCurrency(row.amount)}</Cell>
            <Cell><StatusBadge status={row.appraisal === 'Borderline' ? 'Medium' : 'Complete'} /></Cell>
            <Cell>{row.authority}</Cell>
            <Cell>{row.waiting}</Cell>
            <Cell><button onClick={(e) => { e.stopPropagation(); onNavigate(row.page); }} className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--accent-sanction)', color: 'white', fontSize: '12px', fontWeight: 700 }}>{row.page === 'sc-joint' ? 'Open Joint Sign' : 'Review'}</button></Cell>
          </tr>
        ))}
      </SimpleTable>
      <div className="p-4 border-t border-[#EDEEF0]" style={{ fontSize: '13px', color: 'var(--neutral-700)' }}>Hard rule: SC cannot submit a decision until all seven scrutiny checks are completed and the Credit Sanction Register checkbox is confirmed.</div>
    </DataCard>
  );

  const renderExceptions = () => (
    <DataCard title="Exception Register" action={<button className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--accent-sanction)', color: 'white', fontSize: '12px', fontWeight: 700 }}>+ Log Exception</button>}>
      <div className="p-4 border-b border-[#EDEEF0] flex gap-2 flex-wrap">{['All', 'Limit Exceeded', 'Special Approval', 'Director Case', 'Policy Override', 'Extension Granted'].map(f => <button key={f} onClick={() => setExceptionFilter(f)} className="px-3 py-1.5 rounded-full" style={{ backgroundColor: exceptionFilter === f ? 'var(--accent-sanction)' : 'var(--neutral-100)', color: exceptionFilter === f ? 'white' : 'var(--neutral-700)', fontSize: '12px', fontWeight: 700 }}>{f}</button>)}</div>
      <SimpleTable headers={['Date', 'Loan ID', 'Exception Type', 'Approver', 'Status']}>
        {scExceptions.map(row => <tr key={row.loan} onClick={() => onNavigate('sc-exceptions')} className="border-b border-[#EDEEF0] clickable-row"><Cell>{row.date}</Cell><Cell mono blue>{row.loan}</Cell><Cell>{row.type}</Cell><Cell>{row.approver}</Cell><Cell><StatusBadge status={row.status} /></Cell></tr>)}
      </SimpleTable>
    </DataCard>
  );

  const renderPortfolio = () => (
    <div className="space-y-5">
      <DataCard title="Portfolio at Risk — Days Past Due Buckets" action={<button className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--accent-sanction)', color: 'white', fontSize: '12px', fontWeight: 700 }}>Download Board Pack PDF</button>}>
        <div className="p-5 space-y-4">
          {[
            ['Current (0 DPD)', '127 loans', '₹1,56,40,000', 84.9, 'var(--success-500)'],
            ['1-2 years overdue', '12 loans', '₹14,80,000', 8.0, 'var(--warning-500)'],
            ['2-3 years overdue', '5 loans', '₹7,20,000', 3.9, '#E65100'],
            ['3+ years overdue', '3 loans', '₹5,80,000', 3.2, 'var(--error-500)'],
          ].map(([label, loans, amount, pct, color]) => <button key={label as string} onClick={() => onNavigate('sc-dpd')} className="w-full text-left p-2 rounded-lg clickable-row"><div className="flex items-center justify-between mb-1"><span style={{ fontSize: '13px', fontWeight: 700 }}>{label}</span><span style={{ fontSize: '13px', fontFamily: 'Roboto Mono' }}>{loans} · {amount}</span></div><div className="h-3 rounded-full" style={{ backgroundColor: 'var(--neutral-200)' }}><div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color as string }} /></div></button>)}
          <div style={{ fontSize: '13px', color: 'var(--neutral-700)', fontWeight: 700 }}>Total Portfolio: {formatCurrency(scPortfolio.activePortfolio)} · 147 loans · Avg: ₹1,25,306 · NPA Rate: 1.4%</div>
        </div>
      </DataCard>
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-lg p-5 border border-[#EDEEF0]">
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>s.186 Lending Capacity</h3>
          <Info label="Paid-up Capital" value="₹4,20,00,000" />
          <Info label="Free Reserves" value="₹2,10,00,000" />
          <Info label="Permissible limit" value="₹3,78,00,000 (higher of two)" />
          <Info label="Current deployed" value={formatCurrency(scPortfolio.activePortfolio)} />
          <Info label="Headroom" value="₹1,93,80,000" />
          <div className="h-3 rounded-full mt-4" style={{ backgroundColor: 'var(--neutral-200)' }}><div className="h-full rounded-full" style={{ width: '48.7%', backgroundColor: 'var(--success-500)' }} /></div>
          <div style={{ fontSize: '13px', color: 'var(--success-700)', fontWeight: 700, marginTop: '8px' }}>Well within limit · warning threshold 85%</div>
        </div>
        <div className="bg-white rounded-lg p-5 border border-[#EDEEF0]">
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>NBFC Principal Business Test Monitor</h3>
          {[
            ['Financial Assets / Total Assets', '38%', '12% headroom'],
            ['Income from Financial Assets / Total Income', '31%', '19% headroom'],
          ].map(([label, pct, note]) => <div key={label} className="mt-4"><div className="flex justify-between" style={{ fontSize: '13px', fontWeight: 700 }}><span>{label}</span><span>{pct}</span></div><div className="h-3 rounded-full mt-1" style={{ backgroundColor: 'var(--neutral-200)' }}><div className="h-full rounded-full" style={{ width: pct, backgroundColor: 'var(--success-500)' }} /></div><div style={{ fontSize: '12px', color: 'var(--neutral-700)', marginTop: '4px' }}>{note} · Threshold 50%</div></div>)}
          <div className="mt-5 p-3 rounded-lg" style={{ backgroundColor: 'var(--success-50)', color: 'var(--success-700)', fontSize: '13px', fontWeight: 700 }}>NBFC registration not required at current ratios</div>
        </div>
      </div>
    </div>
  );

  const renderDefault = () => (
    <div className="bg-white rounded-lg p-5 border border-[#EDEEF0]">
      <div className="flex items-start justify-between"><div><h3 style={{ fontSize: '18px', fontWeight: 700 }}>Escalation Case — SC Decision Required</h3><p style={{ fontSize: '13px', color: 'var(--neutral-700)', marginTop: '6px' }}>Loan: {defaultEscalation.loan} · {defaultEscalation.borrower} · {formatCurrency(defaultEscalation.outstanding)} outstanding</p></div><StatusBadge status="Pending Approval" size="md" /></div>
      <div className="grid grid-cols-2 gap-5 mt-5">
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-100)' }}>{['Original repayment due: 15-Mar-2024', '3-month grace period expired: 15-Jun-2024', 'Non-intentional assessment: crop loss', '1-year extension expired: 15-Jun-2025', 'Non-payment note prepared: 09-Oct-2025'].map(x => <div key={x} style={{ fontSize: '13px', color: 'var(--neutral-700)', padding: '7px 0' }}>✅ {x}</div>)}</div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--warning-100)', color: 'var(--warning-700)', fontSize: '13px', lineHeight: '22px' }}>{defaultEscalation.note}<br /><br />— Amit Kulkarni, Credit Manager · 09-Oct-2025</div>
      </div>
      <div className="mt-5 p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-100)', border: '1px solid #EDEEF0' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>Select action to authorise</h4>
        {['Invoke SH-4 — initiate share transfer proceedings', 'Present undated cheque — fill ₹1,20,000 + present to bank', 'Both — simultaneous invocation', 'Grant further discretionary extension'].map(a => <label key={a} className="block py-2" style={{ fontSize: '13px', color: 'var(--neutral-700)' }}><input name="action" type="radio" style={{ accentColor: 'var(--accent-sanction)', marginRight: 8 }} />{a}</label>)}
        <textarea className="w-full mt-3 p-3 rounded-lg border border-[#D1D5DB]" rows={3} placeholder="SC Authorisation Notes (mandatory)" />
        <label className="flex gap-2 mt-3" style={{ fontSize: '13px', color: 'var(--neutral-700)' }}><input type="checkbox" style={{ accentColor: 'var(--accent-sanction)' }} />Record in Exception Register</label>
        <button className="mt-4 px-4 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--accent-sanction)', color: 'white' }}>Authorise Selected Action →</button>
      </div>
    </div>
  );

  const renderReturns = () => (
    <div className="bg-white rounded-lg p-5 border border-[#EDEEF0] max-w-4xl">
      <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Return for Clarification — LO00000089 · Narayan FPC</h3>
      {['Income evidence insufficient — request 3 more months of bank statements', 'Land documents missing — 7/12 extract not uploaded', 'Loan purpose unclear — request detailed end-use description', 'FPC membership not verified', 'Prior default with associate company', 'Other'].map(r => <label key={r} className="block py-2" style={{ fontSize: '13px', color: 'var(--neutral-700)' }}><input type="checkbox" style={{ accentColor: 'var(--accent-sanction)', marginRight: 8 }} />{r}</label>)}
      <textarea className="w-full mt-3 p-3 rounded-lg border border-[#D1D5DB]" rows={4} placeholder="Additional instructions to Credit Team" />
      <div className="mt-4" style={{ fontSize: '13px', color: 'var(--neutral-500)' }}>Returned by: S. Nair (CFO) · Expected resubmission within: 3 days</div>
      <button className="mt-4 px-4 py-2.5 rounded-lg font-medium" style={{ backgroundColor: '#1E3A5F', color: 'white' }}>Return Application →</button>
    </div>
  );

  const renderContent = () => {
    if (activePage === 'sc-awaiting' || activePage === 'sc-my-sign') return renderApprovalQueue();
    if (activePage === 'sc-special-cases') return renderSpecial();
    if (activePage === 'sc-returns') return renderReturns();
    if (activePage === 'sc-exceptions') return renderExceptions();
    if (activePage === 'sc-health' || activePage === 'sc-exposure' || activePage === 'sc-dpd') return renderPortfolio();
    if (activePage === 'sc-security-invocation' || activePage === 'sc-default-escalations') return renderDefault();
    if (activePage === 'sc-board' || activePage === 'sc-policy') return renderGeneric(onNavigate);
    return renderRegister();
  };

  return (
    <Shell activePage={activePage} onNavigate={onNavigate} breadcrumbs={['Sanction Committee', meta.title]} pageTitle={meta.title} pageSubtitle={meta.subtitle} actions={<button onClick={() => onNavigate('sc-awaiting')} className="px-4 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--accent-sanction)', color: 'white', fontSize: '14px' }}>Open Approval Queue</button>}>
      {showDecisionTabs && <WorkbenchTabs tabs={sanctionWorkbenchTabs} activeKey={activePage} onChange={onNavigate} accent="var(--accent-sanction)" />}
      {showPortfolioTabs && <WorkbenchTabs tabs={sanctionPortfolioTabs} activeKey={activePage} onChange={onNavigate} accent="var(--accent-sanction)" />}
      {renderContent()}
    </Shell>
  );
}

function renderGeneric(onNavigate: (page: string) => void) {
  return <div className="grid grid-cols-3 gap-5">{[
    ['Board Minutes Archive', 'sc-board'],
    ['Policy Authority Matrix', 'sc-policy'],
    ['SOP Reference', 'shared-audit-trail'],
  ].map(([title, page]) => <button key={title} onClick={() => onNavigate(page)} className="bg-white rounded-lg p-5 border border-[#EDEEF0] text-left clickable-card"><FileText size={18} color="var(--accent-sanction)" /><h3 style={{ fontSize: '15px', fontWeight: 700, marginTop: '12px' }}>{title}</h3><div style={{ fontSize: '13px', color: 'var(--neutral-700)', lineHeight: '20px', marginTop: '8px' }}>Resolution references and authority rules.</div><span className="inline-flex mt-4 px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#EDE9FE', color: 'var(--accent-sanction)', fontSize: '12px', fontWeight: 700 }}><Download size={13} style={{ marginRight: 6 }} />Export</span></button>)}</div>;
}

function DataCard({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return <div className="bg-white rounded-lg border border-[#EDEEF0] overflow-hidden"><div className="px-5 py-3 border-b border-[#EDEEF0] flex items-center justify-between" style={{ backgroundColor: 'var(--neutral-100)' }}><h3 style={{ fontSize: '15px', fontWeight: 700 }}>{title}</h3>{action}</div>{children}</div>;
}

function SimpleTable({ headers, children }: { headers: string[]; children: ReactNode }) {
  return <div className="table-scroll"><table className="w-full"><thead><tr>{headers.map(h => <th key={h} className="px-4 py-3 text-left" style={{ fontSize: '11px', color: 'var(--neutral-400)', fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}

function Cell({ children, mono, blue, right }: { children: ReactNode; mono?: boolean; blue?: boolean; right?: boolean }) {
  return <td className={`px-4 py-3 ${right ? 'text-right' : ''}`} style={{ fontSize: '13px', color: blue ? 'var(--brand-accent)' : 'var(--neutral-700)', fontFamily: mono ? 'Roboto Mono' : 'inherit', fontWeight: blue ? 700 : 500 }}>{children}</td>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between py-2 border-b border-[#EDEEF0]"><span style={{ fontSize: '13px', color: 'var(--neutral-500)' }}>{label}</span><span style={{ fontSize: '13px', color: 'var(--neutral-900)', fontFamily: 'Roboto Mono', fontWeight: 700 }}>{value}</span></div>;
}
