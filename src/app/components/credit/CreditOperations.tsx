import { useState } from 'react';
import { AlertTriangle, ChevronRight, Download, FileText, Mail, Search, Send, ShieldCheck } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from '../shared/StatusBadge';
import { WorkbenchTabs } from '../shared/WorkbenchTabs';
import { EmptyTableState } from '../shared/TableStates';
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
  const [dpdBucket, setDpdBucket] = useState('3+ Years');
  const [tableSearch, setTableSearch] = useState('');
  const [appSearch, setAppSearch] = useState('');
  const [appStatus, setAppStatus] = useState<'All' | 'Overdue' | 'Incomplete'>('All');
  const [scSearch, setScSearch] = useState('');
  const [scStatus, setScStatus] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const meta = pageCopy[activePage] || pageCopy['credit-register'];

  const renderApplications = () => {
    const rows = activePage === 'credit-returned'
      ? creditApplications.filter(app => app.status === 'Incomplete')
      : creditApplications.filter(app => app.status !== 'Complete');
    const totalReq = rows.reduce((s, r) => s + r.amount, 0);
    const overdueCnt = rows.filter(r => r.status === 'Overdue').length;
    const incompleteCnt = rows.filter(r => r.status === 'Incomplete').length;
    const kpis = activePage === 'credit-returned'
      ? [
          { label: 'Incomplete Files', value: String(rows.length), color: 'var(--warning-700)', bg: 'var(--warning-100)' },
          { label: 'Value Held', value: formatCurrency(totalReq), color: 'var(--brand-accent)', bg: 'var(--accent-blue-50)' },
          { label: 'Awaiting Borrower', value: `${incompleteCnt} notices`, color: 'var(--error-700)', bg: 'var(--error-50)' },
        ]
      : [
          { label: 'In Worklist', value: String(rows.length), color: 'var(--brand-accent)', bg: 'var(--accent-blue-50)' },
          { label: 'Value Requested', value: formatCurrency(totalReq), color: 'var(--success-700)', bg: 'var(--success-50)' },
          { label: 'TAT Overdue', value: String(overdueCnt), color: 'var(--error-700)', bg: 'var(--error-50)' },
        ];
    const term = appSearch.trim().toLowerCase();
    const showStatusFilter = activePage !== 'credit-returned';
    const viewRows = rows.filter(r => {
      const matchesTerm = !term || r.id.toLowerCase().includes(term) || r.shortName.toLowerCase().includes(term) || r.village.toLowerCase().includes(term) || r.folio.toLowerCase().includes(term);
      const matchesStatus = !showStatusFilter || appStatus === 'All' || r.status === appStatus;
      return matchesTerm && matchesStatus;
    });
    return (
      <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-lg p-4 border border-[var(--neutral-250)] flex items-center justify-between">
            <div>
              <div style={{ fontSize: '11px', color: 'var(--neutral-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k.label}</div>
              <div style={{ fontSize: '22px', color: 'var(--neutral-900)', fontWeight: 700, marginTop: '4px', fontFamily: 'Roboto Mono' }}>{k.value}</div>
            </div>
            <span className="w-9 h-9 rounded-full shrink-0" style={{ backgroundColor: k.bg, border: `2px solid ${k.color}` }} />
          </div>
        ))}
      </div>
      <DataCard
        title={activePage === 'credit-returned' ? 'Incomplete Files' : 'Appraisal Worklist'}
        action={
          <div className="flex items-center gap-2">
            <div className="relative"><Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" color="var(--neutral-500)" /><input value={appSearch} onChange={e => setAppSearch(e.target.value)} placeholder="Search LO# / name / village" className="pl-8 pr-3 rounded-md border border-[var(--neutral-300)] focus:border-[var(--brand-accent)] focus:outline-none" style={{ height: '34px', fontSize: '13px', width: '210px' }} /></div>
            <button onClick={() => onNavigate('credit-queue')} style={{ fontSize: '13px', color: 'var(--brand-accent)', fontWeight: 700 }}>Open Intake</button>
          </div>
        }
      >
        {showStatusFilter && (
          <div className="px-4 pt-3 pb-1 flex items-center gap-2 flex-wrap border-b border-[var(--neutral-250)]">
            <span style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: 700 }}>Status:</span>
            {(['All', 'Overdue', 'Incomplete'] as const).map(s => (
              <button key={s} onClick={() => setAppStatus(s)} className="px-3 py-1 rounded-full" style={{ backgroundColor: appStatus === s ? 'var(--brand-primary)' : 'white', color: appStatus === s ? 'white' : 'var(--neutral-700)', border: '1px solid var(--neutral-250)', fontSize: '12px', fontWeight: 700 }}>{s}</button>
            ))}
          </div>
        )}
        {rows.length === 0 ? (
          <EmptyTableState
            title={activePage === 'credit-returned' ? 'No incomplete files' : 'Worklist clear'}
            message={activePage === 'credit-returned' ? 'Every returned file has been completed. Nothing is waiting on the borrower.' : 'No applications are pending appraisal right now. New requests appear in the Intake inbox.'}
          />
        ) : viewRows.length === 0 ? (
          <div className="p-6 text-center" style={{ fontSize: '13px', color: 'var(--neutral-500)' }}>No applications match your search / filter.</div>
        ) : (
        <SimpleTable headers={['Loan ID', 'Borrower', 'Requested', 'Purpose', 'TAT / Blocker', 'Action']}>
          {viewRows.map(row => (
            <tr key={row.id} onClick={() => onNavigate(row.status === 'Incomplete' ? 'credit-queue' : 'credit-review')} className="border-b border-[var(--neutral-250)] clickable-row">
              <Cell mono blue>{row.id}</Cell>
              <Cell><strong>{row.shortName}</strong><br /><span style={{ color: 'var(--neutral-500)', fontSize: '12px' }}>{row.folio} · {row.village}</span></Cell>
              <Cell right mono>{formatCurrency(row.amount)}</Cell>
              <Cell>{row.purpose}</Cell>
              <Cell><StatusBadge status={row.status} /> <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--neutral-500)' }}>{row.blocker}</span></Cell>
              <Cell><button onClick={(e) => { e.stopPropagation(); onNavigate(row.status === 'Incomplete' ? 'credit-queue' : 'credit-review'); }} className="px-3 py-1.5 rounded-md" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '12px', fontWeight: 700 }}>{row.status === 'Incomplete' ? 'Request Docs' : 'Review'}</button></Cell>
            </tr>
          ))}
        </SimpleTable>
        )}
      </DataCard>
      </div>
    );
  };

  const renderSanctionQueue = () => {
    const selected = sanctionQueue.find(row => row.id === selectedSc) || sanctionQueue[2];
    const pendingCnt = sanctionQueue.filter(r => r.status === 'Pending').length;
    const approvedCnt = sanctionQueue.filter(r => r.status === 'Approved').length;
    const rejectedCnt = sanctionQueue.filter(r => r.status === 'Rejected').length;
    const approvedVal = sanctionQueue.filter(r => r.status === 'Approved').reduce((s, r) => s + r.amount, 0);
    const scKpis = [
      { label: 'Pending Decision', value: String(pendingCnt), color: 'var(--warning-700)', bg: 'var(--warning-100)' },
      { label: 'Approved', value: String(approvedCnt), color: 'var(--success-700)', bg: 'var(--success-50)' },
      { label: 'Rejected', value: String(rejectedCnt), color: 'var(--error-700)', bg: 'var(--error-50)' },
      { label: 'Approved Value', value: formatCurrency(approvedVal), color: 'var(--brand-accent)', bg: 'var(--accent-blue-50)' },
    ];
    const timeline = selected.status === 'Approved'
      ? [['Appraisal note submitted', 'done'], ['SC reviewed & deliberated', 'done'], [`Approved by ${selected.level}`, 'done'], ['CSR entry recorded', 'done'], ['Proceed to Documentation', 'next']]
      : selected.status === 'Rejected'
      ? [['Appraisal note submitted', 'done'], ['SC reviewed & deliberated', 'done'], ['Rejected by committee', 'fail'], ['Rejection note pending', 'next']]
      : [['Appraisal note submitted', 'done'], ['Queued for SC review', 'done'], [`Awaiting ${selected.level} decision`, 'next']];
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {scKpis.map(k => (
            <div key={k.label} className="bg-white rounded-lg p-4 border border-[var(--neutral-250)]">
              <div className="flex items-center justify-between gap-2">
                <span style={{ fontSize: '11px', color: 'var(--neutral-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k.label}</span>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: k.color }} />
              </div>
              <div style={{ fontSize: '22px', color: 'var(--neutral-900)', fontWeight: 700, marginTop: '4px', fontFamily: 'Roboto Mono' }}>{k.value}</div>
            </div>
          ))}
        </div>
        <DataCard
          title="Sanction Committee Queue"
          action={
            <div className="flex items-center gap-2">
              <div className="relative"><Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" color="var(--neutral-500)" /><input value={scSearch} onChange={e => setScSearch(e.target.value)} placeholder="Search LO# / name" className="pl-8 pr-3 rounded-md border border-[var(--neutral-300)] focus:border-[var(--brand-accent)] focus:outline-none" style={{ height: '34px', fontSize: '13px', width: '180px' }} /></div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md" style={{ backgroundColor: 'var(--accent-blue-50)', color: 'var(--brand-accent)', fontSize: '12px', fontWeight: 700 }}><Download size={13} /> Export CSV</button>
            </div>
          }
        >
          <div className="px-4 pt-3 pb-1 flex items-center gap-2 flex-wrap border-b border-[var(--neutral-250)]">
            <span style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: 700 }}>Status:</span>
            {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(s => (
              <button key={s} onClick={() => setScStatus(s)} className="px-3 py-1 rounded-full" style={{ backgroundColor: scStatus === s ? 'var(--brand-primary)' : 'white', color: scStatus === s ? 'white' : 'var(--neutral-700)', border: '1px solid var(--neutral-250)', fontSize: '12px', fontWeight: 700 }}>{s}</button>
            ))}
          </div>
          {(() => {
            const t = scSearch.trim().toLowerCase();
            const scRows = sanctionQueue.filter(r => (scStatus === 'All' || r.status === scStatus) && (!t || r.id.toLowerCase().includes(t) || r.name.toLowerCase().includes(t)));
            return scRows.length === 0 ? (
              <div className="p-6 text-center" style={{ fontSize: '13px', color: 'var(--neutral-500)' }}>No submissions match your search / filter.</div>
            ) : (
          <SimpleTable headers={['Loan ID', 'Name', 'Amount', 'Submitted', 'SC Level', 'Status']}>
            {scRows.map(row => (
              <tr key={row.id} onClick={() => setSelectedSc(row.id)} className="border-b border-[var(--neutral-250)] hover:bg-[var(--neutral-150)] cursor-pointer" style={{ backgroundColor: selectedSc === row.id ? 'var(--accent-blue-50)' : 'white' }}>
                <Cell mono blue>{row.id}</Cell>
                <Cell><strong>{row.name}</strong></Cell>
                <Cell right mono>{formatCurrency(row.amount)}</Cell>
                <Cell>{row.submitted}</Cell>
                <Cell><span className="px-2 py-1 rounded-full" style={{ backgroundColor: row.level === 'CFO+2Dir' ? 'var(--purple-100)' : 'var(--accent-blue-50)', color: row.level === 'CFO+2Dir' ? 'var(--accent-sanction)' : 'var(--brand-accent)', fontSize: '11px', fontWeight: 700 }}>{row.level}</span></Cell>
                <Cell><StatusBadge status={row.status} /></Cell>
              </tr>
            ))}
          </SimpleTable>
            );
          })()}
        </DataCard>
        <div className="bg-white rounded-lg p-5 border border-[var(--neutral-250)]">
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--neutral-900)' }}>Expanded Row: {selected.id} — {selected.name}</div>
          <div className="grid grid-cols-4 gap-3 mt-4">
            <Info label="SC Decision" value={selected.status.toUpperCase()} />
            <Info label="Approved by" value={selected.status === 'Approved' ? 'CFO + Dir. Sharma' : selected.status === 'Rejected' ? 'SC Rejected' : 'Pending'} />
            <Info label="Approved Amount" value={selected.status === 'Approved' ? formatCurrency(selected.amount) : '-'} mono />
            <Info label="CSR Entry" value={selected.csr || 'Pending'} mono />
          </div>
          <div className="mt-5 pt-4 border-t border-[var(--neutral-250)]">
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>Decision Timeline</div>
            <div className="flex flex-col sm:flex-row sm:items-start gap-0 sm:gap-2">
              {timeline.map(([label, state], i) => {
                const c = state === 'done' ? 'var(--success-600)' : state === 'fail' ? 'var(--error-700)' : 'var(--brand-accent)';
                return (
                  <div key={label} className="flex sm:flex-col items-center sm:flex-1 gap-2 sm:gap-2">
                    <div className="flex items-center w-full">
                      {i > 0 && <span className="hidden sm:block h-0.5 flex-1" style={{ backgroundColor: 'var(--neutral-250)' }} />}
                      <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: state === 'next' ? 'white' : c, border: `2px solid ${c}`, color: 'white', fontSize: '11px', fontWeight: 700 }}>{state === 'fail' ? '✕' : state === 'done' ? '✓' : i + 1}</span>
                      {i < timeline.length - 1 && <span className="hidden sm:block h-0.5 flex-1" style={{ backgroundColor: 'var(--neutral-250)' }} />}
                    </div>
                    <span className="text-left sm:text-center" style={{ fontSize: '12px', color: state === 'next' ? 'var(--neutral-900)' : 'var(--neutral-700)', fontWeight: state === 'next' ? 700 : 500 }}>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {selected.status === 'Approved' && <button className="mt-4 px-4 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}>Proceed to Documentation Stage →</button>}
          {selected.status === 'Rejected' && <button className="mt-4 px-4 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--error-700)', color: 'white', fontSize: '14px' }}>Prepare Rejection Note →</button>}
        </div>
      </div>
    );
  };

  const renderRegister = () => {
    const term = search.trim().toLowerCase();
    const rows = term
      ? loanRegister.filter(r => r.id.toLowerCase().includes(term) || r.borrower.toLowerCase().includes(term))
      : loanRegister;
    const sanctioned = loanRegister.reduce((s, r) => s + r.amount, 0);
    const overdue = loanRegister.filter(r => r.dpd > 0).length;
    const onTime = loanRegister.filter(r => r.dpd === 0).length;
    const registerKpis = [
      { label: 'Total Loans', value: '147', hint: 'on register', color: 'var(--brand-accent)', bg: 'var(--accent-blue-50)' },
      { label: 'Sanctioned Value', value: formatCurrency(sanctioned), hint: 'shown page', color: 'var(--success-700)', bg: 'var(--success-50)' },
      { label: 'On-time', value: String(onTime), hint: 'DPD 0', color: 'var(--success-700)', bg: 'var(--success-50)' },
      { label: 'Overdue', value: String(overdue), hint: 'needs follow-up', color: 'var(--error-700)', bg: 'var(--error-50)' },
    ];
    return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {registerKpis.map(k => <StatCard key={k.label} {...k} />)}
      </div>
      <DataCard title="Loan Register" action={<div className="flex items-center gap-2"><div className="relative"><Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" color="var(--neutral-500)" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by LO# / Name" className="pl-8 pr-3 rounded-md border border-[var(--neutral-300)] focus:border-[var(--brand-accent)] focus:outline-none" style={{ height: '34px', fontSize: '13px', width: '220px' }} /></div><button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md" style={{ backgroundColor: 'var(--accent-blue-50)', color: 'var(--brand-accent)', fontSize: '12px', fontWeight: 700 }}><Download size={13} /> Export</button></div>}>
        <SimpleTable headers={['#', 'Loan ID', 'Borrower', 'Amount', 'Disbursed', 'Stage', 'DPD', 'Action']}>
          {rows.map((row, i) => (
            <tr key={row.id} onClick={() => setSelectedLoan(row.id)} className="border-b border-[var(--neutral-250)] clickable-row" style={{ backgroundColor: selectedLoan === row.id ? 'var(--accent-blue-50)' : undefined }}>
              <Cell>{String(i + 1)}</Cell>
              <Cell mono blue>{row.id}</Cell>
              <Cell><strong>{row.borrower}</strong></Cell>
              <Cell right mono>{formatCurrency(row.amount)}</Cell>
              <Cell>{row.disbursed}</Cell>
              <Cell><StatusBadge status={row.stage} /></Cell>
              <Cell><DpdPill dpd={row.dpd} /></Cell>
              <Cell><button onClick={(e) => { e.stopPropagation(); onNavigate(`loan-file::${row.id}`); }} className="px-3 py-1.5 rounded-md inline-flex items-center gap-1" style={{ backgroundColor: 'var(--neutral-150)', color: 'var(--brand-accent)', fontSize: '12px', fontWeight: 700 }}>Open File <ChevronRight size={12} /></button></Cell>
            </tr>
          ))}
        </SimpleTable>
        {rows.length === 0 && <div className="p-6 text-center" style={{ fontSize: '13px', color: 'var(--neutral-500)' }}>No loans match “{search}”.</div>}
        <div className="p-4 border-t border-[var(--neutral-250)]" style={{ fontSize: '13px', color: 'var(--neutral-500)' }}>Showing {rows.length} of 147 · Selected drawer: {selectedLoan}</div>
      </DataCard>
    </div>
    );
  };

  const renderDpd = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {(() => {
          const totalLoans = dpdSummary.reduce((s, i) => s + i.loans, 0);
          return dpdSummary.map(item => {
            const isRate = item.loans === 0;
            const share = totalLoans ? Math.round((item.loans / totalLoans) * 100) : 0;
            return (
              <div key={item.label} className="bg-white rounded-lg p-4 border border-[var(--neutral-250)]" style={{ boxShadow: 'none' }}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1 h-3.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span style={{ fontSize: '11px', color: 'var(--neutral-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</span>
                  </span>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                </div>
                <div style={{ fontSize: '24px', color: item.color, fontWeight: 700, marginTop: '8px' }}>{isRate ? item.amount : `${item.loans} loans`}</div>
                {!isRate ? (
                  <>
                    <div style={{ fontSize: '13px', color: 'var(--neutral-700)', fontFamily: 'Roboto Mono', marginTop: '2px' }}>{item.amount}</div>
                    <div className="h-1.5 w-full rounded-full overflow-hidden mt-3" style={{ backgroundColor: 'var(--neutral-200)' }}>
                      <div className="h-full rounded-full" style={{ width: `${share}%`, backgroundColor: item.color }} />
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--neutral-500)', marginTop: '4px' }}>{share}% of book</div>
                  </>
                ) : (
                  <div style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '8px' }}>Within RBI norm (&lt;5%)</div>
                )}
              </div>
            );
          });
        })()}
      </div>
      <DataCard
        title="DPD Watchlist"
        action={
          <div className="flex items-center gap-2">
            <div className="relative"><Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" color="var(--neutral-500)" /><input value={tableSearch} onChange={e => setTableSearch(e.target.value)} placeholder="Search borrower / LO#" className="pl-8 pr-3 rounded-md border border-[var(--neutral-300)] focus:border-[var(--brand-accent)] focus:outline-none" style={{ height: '34px', fontSize: '13px', width: '200px' }} /></div>
            <button className="px-3 py-1.5 rounded-md" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '12px', fontWeight: 700 }}>Generate CFO MIS Report</button>
          </div>
        }
      >
        <div className="px-4 pt-3 pb-1 flex items-center gap-2 flex-wrap border-b border-[var(--neutral-250)]">
          <span style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: 700 }}>Bucket:</span>
          {dpdSummary.filter(b => b.loans > 0).map(b => (
            <button key={b.label} onClick={() => setDpdBucket(b.label)} className="px-3 py-1 rounded-full" style={{ backgroundColor: dpdBucket === b.label ? 'var(--brand-primary)' : 'white', color: dpdBucket === b.label ? 'white' : 'var(--neutral-700)', border: '1px solid var(--neutral-250)', fontSize: '12px', fontWeight: 700 }}>{b.label} · {b.loans}</button>
          ))}
        </div>
        <SimpleTable headers={['Borrower', 'Loan ID', 'Amount', 'DPD Days', 'Action Required', 'Action']}>
          {dpdRows.filter(r => { const t = tableSearch.trim().toLowerCase(); return !t || r.borrower.toLowerCase().includes(t) || r.loan.toLowerCase().includes(t); }).map(row => (
            <tr key={row.loan} onClick={() => setSelectedLoan(row.loan)} className="border-b border-[var(--neutral-250)] clickable-row" style={{ backgroundColor: selectedLoan === row.loan ? 'var(--accent-blue-50)' : undefined }}>
              <Cell><strong>{row.borrower}</strong></Cell>
              <Cell mono blue>{row.loan}</Cell>
              <Cell right mono>{formatCurrency(row.amount)}</Cell>
              <Cell><DpdPill dpd={row.dpd} /></Cell>
              <Cell><StatusBadge status={row.action} /><br /><span style={{ fontSize: '12px', color: 'var(--brand-accent)', fontWeight: 700 }}>{row.note}</span></Cell>
              <Cell><button onClick={(e) => { e.stopPropagation(); onNavigate('credit-defaults'); }} className="px-3 py-1.5 rounded-md inline-flex items-center gap-1" style={{ backgroundColor: 'var(--neutral-150)', color: 'var(--brand-accent)', fontSize: '12px', fontWeight: 700 }}>Recover <ChevronRight size={12} /></button></Cell>
            </tr>
          ))}
        </SimpleTable>
      </DataCard>
    </div>
  );

  const renderDefaults = () => {
    const defaulted = dpdRows;
    const term = tableSearch.trim().toLowerCase();
    const rows = term ? defaulted.filter(r => r.borrower.toLowerCase().includes(term) || r.loan.toLowerCase().includes(term)) : defaulted;
    const atRisk = defaulted.reduce((s, r) => s + r.amount, 0);
    const recoveryKpis = [
      { label: 'In Recovery', value: String(defaulted.length), hint: 'NPA cases', color: 'var(--error-700)', bg: 'var(--error-50)' },
      { label: 'Value at Risk', value: formatCurrency(atRisk), hint: 'outstanding', color: 'var(--warning-700)', bg: 'var(--warning-100)' },
      { label: 'Under SC Review', value: '1', hint: 'awaiting decision', color: 'var(--brand-accent)', bg: 'var(--accent-blue-50)' },
      { label: 'Extensions', value: '1', hint: 'granted', color: 'var(--success-700)', bg: 'var(--success-50)' },
    ];
    const selectedRow = defaulted.find(r => r.loan === selectedLoan) || defaulted[0];
    const steps = [
      { label: 'Missed payment detected — 12-Jan-2024', done: true },
      { label: '3-month grace period given — 15-Jan → 15-Apr-2024', done: true },
      { label: 'Non-payment assessed: Non-intentional (crop failure)', done: true },
      { label: '1-year extension granted — 20-Apr-2024 → 20-Apr-2025', done: true },
      { label: 'Extension expired — 20-Apr-2025 — still not repaid', done: false },
    ];
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{recoveryKpis.map(k => <StatCard key={k.label} {...k} />)}</div>
        <DataCard
          title="Cases in Recovery"
          action={<div className="relative"><Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" color="var(--neutral-500)" /><input value={tableSearch} onChange={e => setTableSearch(e.target.value)} placeholder="Search borrower / LO#" className="pl-8 pr-3 rounded-md border border-[var(--neutral-300)] focus:border-[var(--brand-accent)] focus:outline-none" style={{ height: '34px', fontSize: '13px', width: '200px' }} /></div>}
        >
          <SimpleTable headers={['Borrower', 'Loan ID', 'Outstanding', 'DPD Days', 'Recovery Stage', 'Action']}>
            {rows.map(row => (
              <tr key={row.loan} onClick={() => setSelectedLoan(row.loan)} className="border-b border-[var(--neutral-250)] clickable-row" style={{ backgroundColor: selectedLoan === row.loan ? 'var(--accent-blue-50)' : undefined }}>
                <Cell><strong>{row.borrower}</strong></Cell>
                <Cell mono blue>{row.loan}</Cell>
                <Cell right mono>{formatCurrency(row.amount)}</Cell>
                <Cell><DpdPill dpd={row.dpd} /></Cell>
                <Cell><StatusBadge status={row.action} /><br /><span style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>{row.note}</span></Cell>
                <Cell><button onClick={(e) => { e.stopPropagation(); setSelectedLoan(row.loan); }} className="px-3 py-1.5 rounded-md" style={{ backgroundColor: 'var(--neutral-150)', color: 'var(--brand-accent)', fontSize: '12px', fontWeight: 700 }}>Open Workflow</button></Cell>
              </tr>
            ))}
          </SimpleTable>
          {rows.length === 0 && <div className="p-6 text-center" style={{ fontSize: '13px', color: 'var(--neutral-500)' }}>No cases match “{tableSearch}”.</div>}
        </DataCard>
        <div className="bg-white rounded-lg p-5 border border-[var(--neutral-250)]">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--neutral-900)' }}>Recovery Workflow — {selectedRow.loan} · {selectedRow.borrower}</h3>
            <span className="inline-flex px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--error-50)', color: 'var(--error-700)', fontSize: '12px', fontWeight: 700 }}>{selectedRow.dpd} days overdue</span>
          </div>
          <div className="mt-4 space-y-0">
            {steps.map((s, i) => (
              <div key={s.label} className="flex items-start gap-3 pb-3">
                <div className="flex flex-col items-center">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: s.done ? 'var(--success-600)' : 'white', border: `2px solid ${s.done ? 'var(--success-600)' : 'var(--error-700)'}`, color: s.done ? 'white' : 'var(--error-700)', fontSize: '12px', fontWeight: 700 }}>{s.done ? '✓' : '!'}</span>
                  {i < steps.length - 1 && <span className="w-0.5 flex-1 mt-1" style={{ minHeight: '14px', backgroundColor: 'var(--neutral-250)' }} />}
                </div>
                <span style={{ fontSize: '13px', color: s.done ? 'var(--neutral-700)' : 'var(--neutral-900)', fontWeight: s.done ? 500 : 700, paddingTop: '3px' }}>{s.label}</span>
              </div>
            ))}
          </div>
          <textarea className="w-full mt-2 p-3 rounded-lg border border-[var(--neutral-300)] focus:border-[var(--brand-accent)] focus:outline-none" rows={4} style={{ fontSize: '13px' }} defaultValue={`Auto-draft note for non-payment: ${selectedRow.borrower}, ${selectedRow.loan}, sanctioned ${formatCurrency(selectedRow.amount)}, DPD ${selectedRow.dpd} days. Crop failure recorded; extension expired. Recommendation: submit to SC for action approval and review SH-4 / undated cheque invocation.`} />
          <div className="mt-3 flex gap-3 flex-wrap">
            <button className="px-4 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}>Submit to Sanction Committee</button>
            <button className="px-4 py-2.5 rounded-lg font-medium border border-[var(--neutral-250)]" style={{ color: 'var(--neutral-700)', fontSize: '14px' }}>Invoke SH-4 / Cheque</button>
          </div>
        </div>
      </div>
    );
  };

  const renderInvoices = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">{[['Generated', '89'], ['Sent', '76'], ['Paid', '61'], ['Unpaid post-30 Apr', '15']].map(([l, v]) => <Info key={l} label={l} value={v} />)}</div>
      <DataCard title="Interest Invoice Batch" action={<button className="px-3 py-1.5 rounded-md" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '12px', fontWeight: 700 }}>Generate All Invoices</button>}>
        <SimpleTable headers={['Borrower', 'Loan ID', 'Principal', 'Interest (yr)', 'Status', 'Action']}>
          {interestInvoices.map(row => (
            <tr key={row.loan} onClick={() => setSelectedLoan(row.loan)} className="border-b border-[var(--neutral-250)] clickable-row">
              <Cell><strong>{row.borrower}</strong></Cell><Cell mono blue>{row.loan}</Cell><Cell right mono>{formatCurrency(row.principal)}</Cell><Cell right mono>{formatCurrency(row.interest)}<br /><span style={{ fontSize: '11px', color: 'var(--neutral-500)' }}>(12% p.a.)</span></Cell><Cell><StatusBadge status={row.status} /></Cell><Cell><button className="px-3 py-1.5 rounded-md" style={{ backgroundColor: row.status === 'Unpaid' ? 'var(--warning-100)' : 'var(--accent-blue-50)', color: row.status === 'Unpaid' ? 'var(--warning-700)' : 'var(--brand-accent)', fontSize: '12px', fontWeight: 700 }}>{row.action}</button></Cell>
            </tr>
          ))}
        </SimpleTable>
      </DataCard>
      <div className="bg-white rounded-lg p-5 border border-[var(--neutral-250)]">
        <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Capitalization Workflow</h3>
        <p style={{ fontSize: '13px', color: 'var(--neutral-700)', lineHeight: '20px', marginTop: '8px' }}>Loans with unpaid interest past 30 April: 15 cases. Bulk capitalisation will add interest to principal, recalculate FY interest, generate intimation letters, and notify Sr. Manager-Finance for SAP accrual entries.</p>
        <button className="mt-4 px-4 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--warning-800)', color: 'white', fontSize: '14px' }}>Preview changes before confirming</button>
      </div>
    </div>
  );

  const renderSap = () => (
    <div className="bg-white rounded-lg p-6 border border-[var(--neutral-250)] max-w-4xl">
      <div className="flex items-center justify-between mb-5"><div><h3 style={{ fontSize: '18px', fontWeight: 700 }}>Create SAP Customer Code — LO00000090 — Ganesh Thorat FPC</h3><div style={{ fontSize: '13px', color: 'var(--neutral-500)', marginTop: '4px' }}>Status: SC Approved ✓ → SAP Code: Not yet created ⏳</div></div><Mail color="var(--brand-accent)" /></div>
      <InfoGrid rows={[
        ['Farmer Full Name', 'Ganesh Thorat Farmers Producer Company'],
        ['Aadhaar Number', 'XXXX XXXX 4821'],
        ['PAN Number', 'AABCG1234D'],
        ['Address', 'Village Ojhar, Tal. Niphad, Nashik - 422 209'],
        ['Email ID', 'ganesh.thorat.fpc@gmail.com'],
        ['Loan Application No.', appraisalLoan.id],
      ]} />
      <div className="mt-5 p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-150)', border: '1px solid var(--neutral-250)', fontSize: '13px', color: 'var(--neutral-700)', lineHeight: '22px' }}>
        Send to: Sr. Manager - Finance (Rohan Mehta) &lt;rmehta@sahyadrifarms.com&gt;<br />Cc: Credit Manager (auto)<br />Format: Excel attachment (Annexure I template) + email body
      </div>
      <div className="mt-5 flex gap-3"><button className="px-4 py-2.5 rounded-lg border border-[var(--neutral-250)]">Preview Email</button><button className="px-4 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}>Send Request →</button></div>
    </div>
  );

  const renderRecords = () => {
    const isExceptions = activePage === 'credit-exceptions';
    const rejectedKpis = isExceptions
      ? [
          { label: 'Open Exceptions', value: '2', hint: 'logged', color: 'var(--warning-700)', bg: 'var(--warning-100)' },
          { label: 'Immutable', value: '1', hint: 'GM-approved', color: 'var(--accent-sanction)', bg: 'var(--accent-sanction-100)' },
          { label: 'Annotated', value: '1', hint: 'CS-verified', color: 'var(--brand-accent)', bg: 'var(--accent-blue-50)' },
          { label: 'This FY', value: '11', hint: 'total raised', color: 'var(--neutral-700)', bg: 'var(--neutral-150)' },
        ]
      : [
          { label: 'Rejected', value: '2', hint: 'pending notes', color: 'var(--error-700)', bg: 'var(--error-50)' },
          { label: 'Purpose', value: '1', hint: 'out of scope', color: 'var(--warning-700)', bg: 'var(--warning-100)' },
          { label: 'KYC', value: '1', hint: 'incomplete', color: 'var(--warning-700)', bg: 'var(--warning-100)' },
          { label: 'This FY', value: '14', hint: 'total rejected', color: 'var(--neutral-700)', bg: 'var(--neutral-150)' },
        ];
    return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {rejectedKpis.map(k => <StatCard key={k.label} {...k} />)}
      </div>
      <DataCard title={isExceptions ? 'Exception Register' : 'Rejected Applications'}>
        <SimpleTable headers={isExceptions ? ['Type', 'Loan ID', 'Justification', 'Approver Ref', 'Status'] : ['Loan ID', 'Borrower', 'Reason', 'Channel', 'Action']}>
          {isExceptions ? [
            ['Calculation Override', 'LO00000083', 'Director borrower requires GM approval workflow.', 'GM-RES-2025-02', 'Immutable'],
            ['Bypass Check', 'LO00000051', 'Legacy loan imported with missing scanned cheque; physical custody verified.', 'CS-VERIFY-118', 'Annotated'],
          ].map(row => <tr key={row[1]} onClick={() => setSelectedLoan(row[1])} className="border-b border-[var(--neutral-250)] clickable-row">{row.map((cell, i) => <Cell key={i}>{cell}</Cell>)}</tr>)
          : [
            ['LO00000079', 'Suresh Bhagat', 'Purpose outside approved agriculture list', 'Email', 'Prepare Rejection Note'],
            ['LO00000072', 'Mohan Kale', 'KYC not completed after deficiency notice', 'Courier', 'View Register'],
          ].map(row => (
            <tr key={row[0]} onClick={() => setSelectedLoan(row[0])} className="border-b border-[var(--neutral-250)] clickable-row">
              <Cell mono blue>{row[0]}</Cell>
              <Cell><strong>{row[1]}</strong></Cell>
              <Cell><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--error-50)', color: 'var(--error-700)', fontSize: '12px', fontWeight: 700 }}><AlertTriangle size={12} /> {row[2]}</span></Cell>
              <Cell>{row[3]}</Cell>
              <Cell><button onClick={(e) => { e.stopPropagation(); }} className="px-3 py-1.5 rounded-md" style={{ backgroundColor: row[4].includes('Note') ? 'var(--brand-primary)' : 'var(--neutral-150)', color: row[4].includes('Note') ? 'white' : 'var(--brand-accent)', fontSize: '12px', fontWeight: 700 }}>{row[4]}</button></Cell>
            </tr>
          ))}
        </SimpleTable>
      </DataCard>
      <DataCard title="Audit Trail">
        <SimpleTable headers={['Timestamp', 'Actor', 'Action']}>{auditTrail.map(row => <tr key={row[0]} className="border-b border-[var(--neutral-250)]">{row.map((cell, i) => <Cell key={i}>{cell}</Cell>)}</tr>)}</SimpleTable>
      </DataCard>
    </div>
    );
  };

  const renderMember = () => (
    <div className="grid grid-cols-5 gap-5">
      <div className="col-span-2 bg-white rounded-lg p-5 border border-[var(--neutral-250)]">
        <div className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" color="var(--neutral-500)" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search member, folio, loan ID" className="w-full pl-9 rounded-md border border-[var(--neutral-300)]" style={{ height: '38px' }} /></div>
      </div>
      <div className="col-span-3 bg-white rounded-lg p-5 border border-[var(--neutral-250)]">
        <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Priya Ramesh Shinde</h3>
        <p style={{ fontSize: '13px', color: 'var(--neutral-500)', marginTop: '4px' }}>Member since April 2021 · Active ✓ · Dindori, Nashik · Grapes (3 acres)</p>
        <InfoGrid rows={[['Folio', 'SH-2847'], ['Shareholding', '250 shares'], ['Valuation', '₹2,000/share · Total ₹5,00,000'], ['Max loan share-based', '₹50,000'], ['Repayment track record', '95% on-time'], ['KYC Status', 'PAN ✓ Aadhaar ✓ Re-KYC Due Aug 2026']]} />
      </div>
    </div>
  );

  const renderMis = () => (
      <div className="grid grid-cols-3 gap-5">
      {['Quarterly Portfolio MIS', 'Section 186 Limit Monitor', 'NBFC Threshold Monitor'].map((title, i) => (
        <button key={title} onClick={() => onNavigate(i === 0 ? 'credit-mis' : 'shared-s186-lock')} className="bg-white rounded-lg p-5 border border-[var(--neutral-250)] text-left clickable-card">
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{title}</h3>
          <div className="mt-4 h-3 rounded-full" style={{ backgroundColor: 'var(--neutral-250)' }}><div className="h-full rounded-full" style={{ width: i === 0 ? '82%' : i === 1 ? '58%' : '40%', backgroundColor: i === 2 ? 'var(--warning-500)' : 'var(--success-600)' }} /></div>
          <div style={{ fontSize: '13px', color: 'var(--neutral-700)', marginTop: '12px' }}>{i === 2 ? '40% threshold watch' : 'Ready for export'}</div>
          <span className="inline-flex mt-4 px-3 py-1.5 rounded-md" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '12px', fontWeight: 700 }}>Generate</span>
        </button>
      ))}
    </div>
  );

  const renderActiveLoans = () => {
    const activeRows = loanRegister.filter(row => row.stage === 'Active' || row.stage === 'Disbursed');
    const sanctioned = activeRows.reduce((s, r) => s + r.amount, 0);
    const outstanding = activeRows.reduce((s, r) => s + Math.round(r.amount * 0.72), 0);
    const repaidPct = sanctioned ? Math.round(((sanctioned - outstanding) / sanctioned) * 100) : 0;
    const overdue = activeRows.filter(r => r.dpd > 0).length;
    const activeKpis = [
      { label: 'Active Loans', value: String(activeRows.length), hint: 'live portfolio', color: 'var(--brand-accent)', bg: 'var(--accent-blue-50)' },
      { label: 'Sanctioned', value: formatCurrency(sanctioned), hint: 'principal', color: 'var(--success-700)', bg: 'var(--success-50)' },
      { label: 'Outstanding', value: formatCurrency(outstanding), hint: `${repaidPct}% repaid`, color: 'var(--warning-700)', bg: 'var(--warning-100)' },
      { label: 'Overdue', value: String(overdue), hint: 'DPD > 0', color: 'var(--error-700)', bg: 'var(--error-50)' },
    ];
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {activeKpis.map(k => <StatCard key={k.label} {...k} />)}
        </div>
        <DataCard title="Active Loans" action={<button onClick={() => onNavigate('credit-dpd')} className="px-3 py-1.5 rounded-md" style={{ backgroundColor: 'var(--accent-blue-50)', color: 'var(--brand-accent)', fontSize: '12px', fontWeight: 700 }}>Open DPD Monitor</button>}>
          {activeRows.length === 0 ? (
            <EmptyTableState title="No active loans" message="No loans have been disbursed yet. Approved loans appear here once Treasury completes disbursement." />
          ) : (
          <SimpleTable headers={['Loan ID', 'Borrower', 'Sanctioned', 'Repayment Progress', 'DPD', 'Next Due', 'Action']}>
            {activeRows.map(row => {
              const out = Math.round(row.amount * 0.72);
              const pct = Math.round(((row.amount - out) / row.amount) * 100);
              return (
              <tr key={row.id} onClick={() => setSelectedLoan(row.id)} className="border-b border-[var(--neutral-250)] clickable-row" style={{ backgroundColor: selectedLoan === row.id ? 'var(--accent-blue-50)' : undefined }}>
                <Cell mono blue>{row.id}</Cell>
                <Cell><strong>{row.borrower}</strong></Cell>
                <Cell right mono>{formatCurrency(row.amount)}</Cell>
                <Cell>
                  <div className="min-w-[160px]">
                    <div className="flex items-center justify-between mb-1" style={{ fontSize: '11px', fontFamily: 'Roboto Mono', color: 'var(--neutral-500)' }}>
                      <span>{pct}% repaid</span><span>{formatCurrency(out)} left</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--neutral-200)' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: row.dpd > 90 ? 'var(--error-600)' : row.dpd > 0 ? 'var(--warning-500)' : 'var(--success-500)' }} />
                    </div>
                  </div>
                </Cell>
                <Cell><DpdPill dpd={row.dpd} currentLabel /></Cell>
                <Cell>{row.disbursed}</Cell>
                <Cell><button onClick={(e) => { e.stopPropagation(); onNavigate(`loan-file::${row.id}`); }} className="px-3 py-1.5 rounded-md inline-flex items-center gap-1" style={{ backgroundColor: 'var(--neutral-150)', color: 'var(--brand-accent)', fontSize: '12px', fontWeight: 700 }}>Open File <ChevronRight size={12} /></button></Cell>
              </tr>
              );
            })}
          </SimpleTable>
          )}
        </DataCard>
      </div>
    );
  };

  const renderContent = () => {
    if (activePage === 'credit-pending' || activePage === 'credit-returned' || activePage === 'credit-queue') return renderApplications();
    if (activePage === 'credit-sc-queue' || activePage === 'credit-all-apps') return renderSanctionQueue();
    if (activePage === 'credit-active-loans') return renderActiveLoans();
    if (activePage === 'credit-defaults') return renderDefaults();
    if (activePage === 'credit-dpd' || activePage === 'credit-analytics') return renderDpd();
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
      actions={<button onClick={() => onNavigate('credit-review')} className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}><ShieldCheck size={14} /> Open Appraisal Note</button>}
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
  return <div className="bg-white rounded-lg border border-[var(--neutral-250)] overflow-hidden"><div className="px-5 py-3 border-b border-[var(--neutral-250)] flex items-center justify-between" style={{ backgroundColor: 'var(--neutral-150)' }}><h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--neutral-900)' }}>{title}</h3>{action}</div>{children}</div>;
}

function SimpleTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return <div className="table-scroll"><table className="w-full"><thead><tr style={{ backgroundColor: 'var(--neutral-150)', borderBottom: '1px solid var(--neutral-250)' }}>{headers.map(h => <th key={h} className="px-4 py-3 text-left sticky top-0" style={{ fontSize: '11px', color: 'var(--neutral-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', backgroundColor: 'var(--neutral-150)' }}>{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}

function StatCard({ label, value, hint, color, bg }: { label: string; value: string; hint: string; color: string; bg: string }) {
  return (
    <div className="bg-white rounded-lg p-3 border border-[var(--neutral-250)] flex flex-col" style={{ boxShadow: 'none' }}>
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 min-w-0">
          <span className="w-1 h-3.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <span style={{ fontSize: '11px', color: 'var(--neutral-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
        </span>
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
      </div>
      <span style={{ fontSize: '22px', color: 'var(--neutral-900)', fontWeight: 700, marginTop: '4px', fontFamily: 'Roboto Mono' }}>{value}</span>
      <span className="inline-flex w-fit mt-1.5 px-2 py-0.5 rounded-full" style={{ backgroundColor: bg, color, fontSize: '11px', fontWeight: 700 }}>{hint}</span>
    </div>
  );
}

function DpdPill({ dpd, currentLabel }: { dpd: number; currentLabel?: boolean }) {
  if (dpd === 0) return <span className="inline-flex px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--success-50)', color: 'var(--success-700)', fontSize: '12px', fontWeight: 700 }}>{currentLabel ? 'Current' : '0 days'}</span>;
  const severe = dpd > 90;
  return <span className="inline-flex px-2.5 py-1 rounded-full" style={{ backgroundColor: severe ? 'var(--error-50)' : 'var(--warning-100)', color: severe ? 'var(--error-700)' : 'var(--warning-700)', fontSize: '12px', fontWeight: 700, fontFamily: 'Roboto Mono' }}>{dpd} days</span>;
}

function Cell({ children, mono, blue, right }: { children: React.ReactNode; mono?: boolean; blue?: boolean; right?: boolean }) {
  return <td className={`px-4 py-3 ${right ? 'text-right' : ''}`} style={{ fontSize: '13px', color: blue ? 'var(--brand-accent)' : 'var(--neutral-700)', fontFamily: mono ? 'Roboto Mono' : 'inherit', fontWeight: blue ? 700 : 500 }}>{children}</td>;
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return <div className="bg-white rounded-lg p-4 border border-[var(--neutral-250)]"><div style={{ fontSize: '11px', color: 'var(--neutral-500)', fontWeight: 700, textTransform: 'uppercase' }}>{label}</div><div style={{ fontSize: '18px', color: 'var(--neutral-900)', fontWeight: 700, marginTop: '6px', fontFamily: mono ? 'Roboto Mono' : 'inherit' }}>{value}</div></div>;
}

function InfoGrid({ rows }: { rows: string[][] }) {
  return <div className="grid grid-cols-2 gap-3 mt-5">{rows.map(([label, value]) => <Info key={label} label={label} value={value} mono={label.includes('No') || label.includes('Folio') || label.includes('PAN') || label.includes('Aadhaar')} />)}</div>;
}
