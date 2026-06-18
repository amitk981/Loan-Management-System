import { useState } from 'react';
import { CheckCircle, Download, FileText, BookText, FileSignature, AlertOctagon, Stamp, Archive, BarChart3, ArrowRight, CalendarRange, ShieldCheck, Clock, AlertTriangle, Package, CircleDot, MessageSquare, Send, Eye } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from '../shared/StatusBadge';
import { WorkbenchTabs } from '../shared/WorkbenchTabs';
import { complianceQueueTabs, complianceRegisterTabs } from '../../data/roleNav';
import { AppModal } from '../shared/AppModal';
import { complianceRows, grievanceRegister, nocQueue, stampRows } from '../../data/complianceData';
import { formatCurrency } from '../../lib/format';

interface ComplianceOperationsProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

const pageCopy: Record<string, { title: string; subtitle: string }> = {
  'cs-calendar': { title: 'Compliance Calendar', subtitle: 'Deadlines and evidence' },
  'cs-noc': { title: 'NOC Issuance Queue', subtitle: 'Fully repaid loans' },
  'cs-stamp': { title: 'Stamp Duty Register', subtitle: 'Stamp evidence register' },
  'cs-grievance': { title: 'Grievance Register', subtitle: 'Complaint TAT' },
  'cs-security-return': { title: 'Security Return Log', subtitle: 'SH-4, cheque and CDSL unpledge' },
  'cs-loan-register': { title: 'Loan Register (CS View)', subtitle: 'Legal file custody' },
  'cs-sanction-register': { title: 'Credit Sanction Register', subtitle: 'SC conditions' },
  'cs-exception-register': { title: 'Exception Register', subtitle: 'Document exceptions' },
  'cs-poa-register': { title: 'PoA Register', subtitle: 'Execution and custody' },
  'cs-archive': { title: 'Executed Documents Archive', subtitle: 'Closed legal files' },
  'cs-reports': { title: 'Compliance Status Report', subtitle: 'Compliance packs' },
  'cs-cdsl': { title: 'CDSL Pledge Tracker', subtitle: 'D-MAT share pledge lifecycle' },
};


export function ComplianceOperations({ onNavigate, activePage }: ComplianceOperationsProps) {
  const [selectedDay, setSelectedDay] = useState(15);
  const [calendarView, setCalendarView] = useState<'Month View' | 'Quarter View' | 'Year View'>('Month View');
  const [showNoc, setShowNoc] = useState(false);
  const meta = pageCopy[activePage] || pageCopy['cs-calendar'];
  const showRegisterTabs = complianceRegisterTabs.some(tab => tab.key === activePage);
  const showQueueTabs = complianceQueueTabs.some(tab => tab.key === activePage);

  const renderCalendar = () => {
    const dayMarkers: Record<number, { color: string; label: string }> = {
      15: { color: 'var(--error-500)', label: 'Overdue' },
      22: { color: 'var(--warning-500)', label: 'Upcoming' },
      31: { color: 'var(--warning-500)', label: 'Upcoming' },
      28: { color: 'var(--success-500)', label: 'Completed' },
    };
    return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4 mb-1">
        {([
          ['Overdue', 1, 'var(--error-500)', AlertTriangle],
          ['Due This Week', 2, 'var(--warning-500)', Clock],
          ['Upcoming (30d)', 4, 'var(--brand-accent)', CalendarRange],
          ['Completed', 8, 'var(--success-500)', ShieldCheck],
        ] as const).map(([label, count, color, Icon]) => (
          <div key={label} className="bg-white rounded-xl p-4 border border-[var(--neutral-200)] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}14`, color }}><Icon size={18} /></div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--neutral-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color, fontFamily: 'Roboto Mono', lineHeight: '28px' }}>{count}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-7 bg-white rounded-xl border border-[var(--neutral-200)] overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: 'var(--cream-50)', borderBottom: '2px solid var(--neutral-200)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--brand-light)', color: 'var(--brand-primary)' }}><CalendarRange size={16} /></div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-primary)' }}>October 2025</h3>
            </div>
            <div className="flex rounded-xl border border-[var(--neutral-200)] overflow-hidden">
              {(['Month View', 'Quarter View', 'Year View'] as const).map(label => <button key={label} onClick={() => setCalendarView(label)} className="px-3.5 py-2" style={{ backgroundColor: calendarView === label ? 'var(--brand-primary)' : 'white', color: calendarView === label ? 'white' : 'var(--neutral-700)', fontSize: '12px', fontWeight: 700 }}>{label}</button>)}
            </div>
          </div>
          <div className="p-5">
          <div className="grid grid-cols-7 gap-1.5">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d} className="text-center py-2" style={{ fontSize: '11px', color: 'var(--neutral-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{d}</div>)}
            {Array.from({ length: 35 }, (_, i) => i < 2 ? null : i - 1).map((day, i) => {
              const marker = day ? dayMarkers[day] : undefined;
              const isSelected = selectedDay === day;
              return <button key={i} disabled={!day} onClick={() => day && setSelectedDay(day)} className="rounded-xl p-2 min-h-16 text-left transition-all" style={{ border: isSelected ? '2px solid var(--brand-primary)' : '1px solid var(--neutral-200)', backgroundColor: isSelected ? 'var(--brand-light)' : day ? 'white' : 'var(--neutral-50)' }}>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? 'var(--brand-primary)' : 'var(--neutral-700)' }}>{day || ''}</span>
                  {marker && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: marker.color }} />}
                </div>
              </button>;
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-3" style={{ borderTop: '1px solid var(--neutral-200)' }}>
            {([['Overdue', 'var(--error-500)'], ['Upcoming', 'var(--warning-500)'], ['Completed', 'var(--success-500)'], ['Scheduled', 'var(--brand-accent)']] as const).map(([label, color]) => (
              <div key={label} className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} /><span style={{ fontSize: '11px', color: 'var(--neutral-500)', fontWeight: 500 }}>{label}</span></div>
            ))}
          </div>
          </div>
        </div>
        <div className="col-span-5 bg-white rounded-xl border border-[var(--neutral-200)] overflow-hidden">
          <div className="px-5 py-3.5" style={{ backgroundColor: 'var(--cream-50)', borderBottom: '2px solid var(--neutral-200)' }}>
            <div className="flex items-center gap-2">
              <CalendarRange size={14} style={{ color: 'var(--brand-accent)' }} />
              <span style={{ fontSize: '12px', color: 'var(--brand-accent)', fontWeight: 700 }}>Selected: Oct {selectedDay}</span>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--warning-500)' }} />
              <span className="px-2 py-0.5 rounded-md" style={{ fontSize: '11px', fontWeight: 700, backgroundColor: 'var(--warning-50)', color: 'var(--warning-600)', border: '1px solid var(--warning-200)' }}>Due in 3 days</span>
            </div>
            <h3 style={{ fontSize: '20px', color: 'var(--brand-primary)', fontWeight: 700, marginTop: '8px' }}>Maharashtra Stamp Act</h3>
            <p style={{ fontSize: '14px', color: 'var(--neutral-500)', marginTop: '4px' }}>Annual Declaration</p>
            <InfoGrid rows={[['Statute', 'Maharashtra Stamp Act, 1958'], ['Owner', 'Company Secretary'], ['Evidence Required', 'Annual declaration + stamp register'], ['Frequency', 'Annual']]} />
            <div className="mt-5 flex gap-3">
              <button className="px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors" style={{ border: '1px solid var(--neutral-200)', fontSize: '13px', fontWeight: 700, color: 'var(--neutral-700)' }}><Download size={14} /> Upload Evidence</button>
              <button className="px-4 py-2.5 rounded-xl font-medium flex items-center gap-2" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '13px' }}><CheckCircle size={14} /> Mark Complete</button>
            </div>
          </div>
        </div>
      </div>
      <DataCard title="Compliance Table" icon={<BookText size={16} />}>
        <SimpleTable headers={['Compliance Area', 'Requirement', 'Frequency', 'Owner', 'Status']}>
          {complianceRows.map(row => <tr key={row[0]} onClick={() => onNavigate('cs-calendar')} className="border-b border-[var(--neutral-200)] clickable-row">{row.slice(0, 4).map((cell, i) => <Cell key={i}>{cell}</Cell>)}<Cell><StatusBadge status={row[4]} /></Cell></tr>)}
        </SimpleTable>
      </DataCard>
    </div>
  );};

  const renderNoc = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4 mb-1">
        {([
          ['Ready for NOC', 1, 'var(--success-500)', ShieldCheck],
          ['Pending Security Return', 2, 'var(--warning-500)', Package],
          ['Issued This Month', 2, 'var(--brand-accent)', FileText],
        ] as const).map(([label, count, color, Icon]) => (
          <div key={label} className="bg-white rounded-xl p-4 border border-[var(--neutral-200)] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}14`, color }}><Icon size={18} /></div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--neutral-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color, fontFamily: 'Roboto Mono', lineHeight: '28px' }}>{count}</div>
            </div>
          </div>
        ))}
      </div>
      {nocQueue.slice(0, 1).map(row => (
        <div key={row.loan} className="bg-white rounded-xl border border-[var(--neutral-200)] overflow-hidden">
          <div className="px-5 py-4" style={{ backgroundColor: 'var(--cream-50)', borderBottom: '2px solid var(--neutral-200)' }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span style={{ fontSize: '14px', fontFamily: 'Roboto Mono', color: 'var(--brand-accent)', fontWeight: 700 }}>{row.loan}</span>
                  <span style={{ fontSize: '16px', color: 'var(--neutral-900)', fontWeight: 700 }}>{row.borrower}</span>
                  <span className="px-2.5 py-1 rounded-lg" style={{ fontSize: '13px', fontFamily: 'Roboto Mono', color: 'var(--brand-primary)', fontWeight: 700, backgroundColor: 'var(--brand-light)', border: '1px solid var(--success-200)' }}>{formatCurrency(row.amount)}</span>
                </div>
                <div className="flex items-center gap-2 mt-2" style={{ fontSize: '13px', color: 'var(--neutral-500)' }}>
                  <span>Repaid: <strong style={{ color: 'var(--success-600)' }}>{row.repaid}</strong></span>
                  <span>·</span>
                  <span>Confirmed by: {row.finance}</span>
                  <CheckCircle size={13} style={{ color: 'var(--success-500)' }} />
                </div>
              </div>
              <StatusBadge status={row.status} size="md" />
            </div>
          </div>
          <div className="p-5">
          <div className="grid grid-cols-2 gap-5">
            <Checklist title="Pre-NOC Checklist" items={['Full principal repaid', 'All interest invoices settled', 'No outstanding dues', 'SAP balance = ₹0']} done icon={<ShieldCheck size={15} style={{ color: 'var(--success-500)' }} />} count="4/4" />
            <div className="rounded-xl border border-[var(--neutral-200)] overflow-hidden">
              <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: 'var(--cream-50)', borderBottom: '1px solid var(--neutral-200)' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--warning-50)', color: 'var(--warning-500)' }}><Package size={14} /></div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-primary)' }}>Security Return</h4>
                <span className="ml-auto px-2 py-0.5 rounded-full" style={{ fontSize: '10px', fontWeight: 700, backgroundColor: 'var(--warning-50)', color: 'var(--warning-600)', border: '1px solid var(--warning-200)' }}>0/3</span>
              </div>
              <div className="p-4">
              {['SH-4 Form returned to borrower', 'Blank-dated cheque returned', 'CDSL Unpledge initiated (if D-MAT)'].map(item => <div key={item} className="flex items-center justify-between py-2.5 border-b border-[var(--neutral-200)] last:border-b-0"><span className="flex items-center gap-2" style={{ fontSize: '13px', color: 'var(--neutral-700)' }}><CircleDot size={13} style={{ color: 'var(--neutral-300)' }} /> {item}</span><button className="px-2.5 py-1.5 rounded-lg transition-colors hover:opacity-90" style={{ backgroundColor: 'var(--brand-light)', color: 'var(--brand-primary)', fontSize: '11px', fontWeight: 700, border: '1px solid var(--success-200)' }}>Mark Returned</button></div>)}
              </div>
            </div>
          </div>
          <div className="mt-5 p-4 rounded-xl flex items-center justify-between" style={{ backgroundColor: 'var(--success-50)', border: '1px solid var(--success-200)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'white', color: 'var(--brand-primary)' }}><FileText size={16} /></div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--neutral-900)' }}>NOC Document</div>
                <div style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>Generate and send to borrower</div>
              </div>
            </div>
            <button onClick={() => setShowNoc(true)} className="px-5 py-2.5 rounded-xl font-medium flex items-center gap-2" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}><FileText size={14} /> Generate NOC <ArrowRight size={14} /></button>
          </div>
          </div>
        </div>
      ))}
      <DataCard title="Recently Issued NOCs" icon={<Archive size={16} />}>
        <div className="divide-y divide-[var(--neutral-200)]">{nocQueue.slice(1).map(row => <button key={row.loan} onClick={() => onNavigate('cs-archive')} className="w-full text-left px-5 py-3.5 flex items-center gap-4 clickable-row">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--success-50)', color: 'var(--success-500)' }}><CheckCircle size={14} /></div>
          <div className="flex-1">
            <div className="flex items-center gap-2"><span style={{ fontSize: '12px', fontFamily: 'Roboto Mono', color: 'var(--brand-accent)', fontWeight: 700 }}>{row.loan}</span><span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--neutral-900)' }}>{row.borrower}</span></div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '2px' }}>NOC issued {row.repaid}</div>
          </div>
          <ArrowRight size={14} style={{ color: 'var(--neutral-300)' }} />
        </button>)}</div>
      </DataCard>
      {showNoc && <AppModal title="No-Objection Certificate" subtitle="Preview before issuing and archiving" icon={<FileText size={18} />} onClose={() => setShowNoc(false)} footer={<><button onClick={() => setShowNoc(false)} className="px-4 py-2.5 rounded-lg border border-[var(--neutral-200)]">Download PDF</button><button onClick={() => setShowNoc(false)} className="px-4 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}>Send to Borrower & Archive</button></>}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '13px', color: 'var(--neutral-900)', lineHeight: '22px', backgroundColor: 'var(--cream-50)', padding: '18px', border: '1px solid var(--neutral-200)' }}>
          <strong>NO-OBJECTION CERTIFICATE</strong><br /><br />Date: 11-Oct-2025<br /><br />To,<br />Shri. Rajesh Patil<br />Village: Peth, Nashik<br /><br />Ref: Loan No. LO00000082 | Amount: ₹80,000<br />Disbursed: 15-Oct-2024 | Repaid: 11-Oct-2025<br /><br />This is to certify that the above loan has been fully repaid. SFPCL has no further claim against you in respect of this loan. The Share Transfer Form (SH-4) and undated cheque held as security are hereby returned.<br /><br />Sd/-<br />Anjali Mehta<br />Company Secretary, SFPCL
        </div>
      </AppModal>}
    </div>
  );

  const renderStamp = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        {([
          ['Purchased', 284, 'var(--brand-accent)', Package],
          ['Used', 271, 'var(--success-500)', CheckCircle],
          ['Balance', 13, 'var(--warning-500)', AlertTriangle],
          ['Pending Affix', 2, 'var(--error-500)', Clock],
        ] as const).map(([label, count, color, Icon]) => (
          <div key={label} className="bg-white rounded-xl p-4 border border-[var(--neutral-200)] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}14`, color }}><Icon size={18} /></div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--neutral-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color, fontFamily: 'Roboto Mono', lineHeight: '28px' }}>{count}</div>
            </div>
          </div>
        ))}
      </div>
      <DataCard title="Stamp Duty Register — FY25-26" icon={<Stamp size={16} />} action={<button className="px-3.5 py-2 rounded-xl flex items-center gap-2" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '12px', fontWeight: 700 }}><Stamp size={13} /> + Record New Purchase</button>}>
        <SimpleTable headers={['Loan ID', 'Instrument', 'Stamp Val.', 'Affixed On', 'By', 'Status']}>
          {stampRows.map(row => <tr key={`${row[0]}-${row[1]}`} onClick={() => onNavigate('cs-stamp')} className="border-b border-[var(--neutral-200)] clickable-row">{row.slice(0, 5).map((cell, i) => <Cell key={i} mono={i === 0 || i === 2}>{cell}</Cell>)}<Cell><StatusBadge status={row[5]} /></Cell></tr>)}
        </SimpleTable>
      </DataCard>
    </div>
  );

  const renderGrievance = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {([
          ['Open', grievanceRegister.filter(r => r.status === 'Open' || r.status === 'In Progress').length, 'var(--warning-500)', AlertTriangle],
          ['Resolved', grievanceRegister.filter(r => r.status === 'Resolved' || r.status === 'Closed').length, 'var(--success-500)', CheckCircle],
          ['Avg TAT', '4.2d', 'var(--brand-accent)', Clock],
        ] as const).map(([label, count, color, Icon]) => (
          <div key={label} className="bg-white rounded-xl p-4 border border-[var(--neutral-200)] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}14`, color }}><Icon size={18} /></div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--neutral-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color, fontFamily: 'Roboto Mono', lineHeight: '28px' }}>{count}</div>
            </div>
          </div>
        ))}
      </div>
      <DataCard title="Grievance Register" icon={<MessageSquare size={16} />} action={<div className="flex items-center gap-2"><button className="px-3.5 py-2 rounded-xl flex items-center gap-2" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '12px', fontWeight: 700 }}><MessageSquare size={13} /> + New Grievance</button><button className="px-3.5 py-2 rounded-xl border border-[var(--neutral-200)] flex items-center gap-2" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--neutral-700)' }}><Download size={13} /> Export</button></div>}>
        <SimpleTable headers={['Ref', 'Description', 'Received', 'Status', 'TAT']}>
          {grievanceRegister.map(row => {
            const tatDays = parseInt(row.tat) || 0;
            const tatColor = tatDays > 7 ? 'var(--error-500)' : tatDays > 3 ? 'var(--warning-500)' : 'var(--success-500)';
            return <tr key={row.ref} onClick={() => onNavigate('cs-grievance')} className="border-b border-[var(--neutral-200)] clickable-row"><Cell mono>{row.ref}</Cell><Cell>{row.description}</Cell><Cell>{row.received}</Cell><Cell><StatusBadge status={row.status} /></Cell><td className="px-4 py-3"><div className="flex items-center gap-2"><span style={{ fontSize: '13px', fontWeight: 700, color: tatColor, fontFamily: 'Roboto Mono' }}>{row.tat}</span><div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--neutral-100)' }}><div className="h-full rounded-full" style={{ width: `${Math.min(100, (tatDays / 10) * 100)}%`, backgroundColor: tatColor }} /></div></div></td></tr>;
          })}
        </SimpleTable>
      </DataCard>
    </div>
  );

  const renderGenericRegister = () => (
    <div className="grid grid-cols-3 gap-5">
      {([
        ['Loan Register (CS View)', 'Custody and NOC status', 'cs-loan-register', BookText, 'var(--brand-accent)', 'var(--accent-blue-50)', '91 loans'],
        ['Credit Sanction Register', 'Authority and conditions', 'cs-sanction-register', FileSignature, 'var(--accent-sanction)', 'var(--accent-sanction-100)', '47 records'],
        ['Exception Register', 'GM approval and invocation', 'cs-exception-register', AlertOctagon, 'var(--warning-800)', 'var(--warning-50)', '3 exceptions'],
        ['PoA Register', 'Execution and custody', 'cs-poa-register', Stamp, 'var(--brand-primary)', 'var(--brand-light)', '88 PoAs'],
        ['Executed Documents Archive', 'Retention clock', 'cs-archive', Archive, 'var(--accent-treasury)', 'var(--info-50)', '156 files'],
        ['Compliance Status Report', 'KYC, stamp and NOC', 'cs-reports', BarChart3, 'var(--success-600)', 'var(--success-50)', 'Q3 ready'],
      ] as const).map(([title, note, page, Icon, color, tint, stat]) => (
        <button key={title} onClick={() => onNavigate(page)} className="group bg-white rounded-xl border border-[var(--neutral-200)] text-left clickable-card flex flex-col overflow-hidden">
          <div className="p-5 flex-1 w-full">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: tint, color, border: `1px solid ${color}20` }}><Icon size={22} /></div>
              <span className="px-2.5 py-1 rounded-lg" style={{ fontSize: '11px', fontWeight: 700, color, backgroundColor: tint, border: `1px solid ${color}20` }}>{stat}</span>
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--neutral-900)' }}>{title}</h3>
            <div style={{ fontSize: '13px', color: 'var(--neutral-500)', lineHeight: '20px', marginTop: '4px' }}>{note}</div>
          </div>
          <div className="w-full px-5 py-3.5 flex items-center justify-between" style={{ backgroundColor: 'var(--cream-50)', borderTop: '1px solid var(--neutral-200)' }}>
            <span className="inline-flex items-center gap-1.5" style={{ fontSize: '12px', fontWeight: 700, color }}><Download size={13} /> Generate</span>
            <ArrowRight size={14} color="var(--neutral-300)" className="transition-all group-hover:translate-x-1" />
          </div>
        </button>
      ))}
    </div>
  );

  const renderCdsl = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {([
          ['Active Pledges', 1, 'var(--success-500)', ShieldCheck],
          ['Pending Acceptance', 1, 'var(--warning-500)', Clock],
          ['Invoked / IRF', 1, 'var(--error-500)', AlertTriangle],
        ] as const).map(([label, count, color, Icon]) => (
          <div key={label} className="bg-white rounded-xl p-4 border border-[var(--neutral-200)] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}14`, color }}><Icon size={18} /></div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--neutral-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color, fontFamily: 'Roboto Mono', lineHeight: '28px' }}>{count}</div>
            </div>
          </div>
        ))}
      </div>
      <DataCard title="CDSL Pledge Lifecycle" icon={<Eye size={16} />} action={<button onClick={() => onNavigate('cs-workspace')} className="px-3.5 py-2 rounded-xl flex items-center gap-2" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '12px', fontWeight: 700 }}><FileText size={13} /> Open SH-4 Tab</button>}>
        <SimpleTable headers={['Loan ID', 'Borrower', 'PSN', 'Stage', 'DP Status', 'Action']}>
          {([
            ['LO00000047', 'Ramesh Patil', 'PSN-88421', 'Active', 'Pledgee DP Accepted', 'Initiate URF on repayment'],
            ['LO00000062', 'Sunita More', 'PSN-77210', 'Created', 'Awaiting acceptance', 'Follow with CDSL'],
            ['LO00000018', 'Narayan Patil', 'PSN-66102', 'Invoked', 'IRF filed', 'View invocation log'],
          ] as const).map(row => {
            const stageColor = row[3] === 'Active' ? 'var(--success-500)' : row[3] === 'Created' ? 'var(--warning-500)' : 'var(--error-500)';
            return (
            <tr key={row[0]} onClick={() => onNavigate('cs-sh4')} className="border-b border-[var(--neutral-200)] clickable-row">
              <Cell mono>{row[0]}</Cell>
              <Cell>{row[1]}</Cell>
              <Cell mono>{row[2]}</Cell>
              <td className="px-4 py-3"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ fontSize: '12px', fontWeight: 700, color: stageColor, backgroundColor: `${stageColor}14`, border: `1px solid ${stageColor}30` }}><CircleDot size={10} /> {row[3]}</span></td>
              <Cell>{row[4]}</Cell>
              <td className="px-4 py-3"><span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-accent)' }}>{row[5]}</span></td>
            </tr>);
          })}
        </SimpleTable>
        <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderTop: '1px solid var(--neutral-200)', backgroundColor: 'var(--cream-50)' }}>
          <AlertTriangle size={13} style={{ color: 'var(--warning-500)' }} />
          <span style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>Future shares clause auto-included. On default, IRF invocation requires SC authorization before CS executes.</span>
        </div>
      </DataCard>
    </div>
  );

  const renderSecurityReturn = () => (
    <DataCard title="Security Return Log" icon={<Package size={16} />} action={<button onClick={() => onNavigate('cs-noc')} className="px-3.5 py-2 rounded-xl flex items-center gap-2" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '12px', fontWeight: 700 }}><Send size={13} /> Open NOC Queue</button>}>
      <SimpleTable headers={['Loan ID', 'Borrower', 'SH-4', 'Blank Cheque', 'CDSL URF', 'Returned On', 'Status']}>
        {([
          ['LO00000082', 'Rajesh Patil', 'Returned', 'Returned', 'N/A', '11-Oct-2025', 'Complete'],
          ['LO00000047', 'Ramesh Patil', 'In custody', 'In custody', 'Pending', '—', 'Active loan'],
          ['LO00000031', 'Vilas Jadhav', 'Invoked', 'Presented', 'N/A', '02-Sep-2025', 'Recovery'],
        ] as const).map(row => (
          <tr key={row[0]} onClick={() => onNavigate('cs-noc')} className="border-b border-[var(--neutral-200)] clickable-row">
            {row.slice(0, 6).map((cell, i) => <Cell key={i} mono={i === 0}>{cell}</Cell>)}
            <Cell><StatusBadge status={row[6]} /></Cell>
          </tr>
        ))}
      </SimpleTable>
    </DataCard>
  );

  const renderContent = () => {
    if (activePage === 'cs-calendar') return renderCalendar();
    if (activePage === 'cs-noc') return renderNoc();
    if (activePage === 'cs-stamp') return renderStamp();
    if (activePage === 'cs-grievance') return renderGrievance();
    if (activePage === 'cs-cdsl') return renderCdsl();
    if (activePage === 'cs-security-return') return renderSecurityReturn();
    return renderGenericRegister();
  };

  return (
    <Shell activePage={activePage} onNavigate={onNavigate} breadcrumbs={['Compliance', meta.title]} pageTitle={meta.title} pageSubtitle={meta.subtitle} actions={<button onClick={() => onNavigate('cs-workspace')} className="px-4 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}>Open Document Workspace</button>}>
      {showQueueTabs && <WorkbenchTabs tabs={complianceQueueTabs} activeKey={activePage} onChange={onNavigate} accent="var(--brand-primary)" />}
      {showRegisterTabs && <WorkbenchTabs tabs={complianceRegisterTabs} activeKey={activePage} onChange={onNavigate} accent="var(--brand-primary)" />}
      {renderContent()}
    </Shell>
  );
}

function DataCard({ title, action, children, icon }: { title: string; action?: React.ReactNode; children: React.ReactNode; icon?: React.ReactNode }) {
  return <div className="bg-white rounded-xl border border-[var(--neutral-200)] overflow-hidden"><div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: 'var(--cream-50)', borderBottom: '2px solid var(--neutral-200)' }}><div className="flex items-center gap-2.5">{icon && <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--brand-light)', color: 'var(--brand-primary)' }}>{icon}</div>}<h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--brand-primary)' }}>{title}</h3></div>{action}</div>{children}</div>;
}

function SimpleTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return <div className="table-scroll"><table className="w-full"><thead><tr style={{ backgroundColor: 'var(--cream-50)' }}>{headers.map(h => <th key={h} className="px-4 py-3.5 text-left" style={{ fontSize: '11px', color: 'var(--neutral-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}

function Cell({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return <td className="px-4 py-3" style={{ fontSize: '13px', color: 'var(--neutral-700)', fontFamily: mono ? 'Roboto Mono' : 'inherit', fontWeight: mono ? 700 : 500 }}>{children}</td>;
}

function InfoGrid({ rows }: { rows: string[][] }) {
  return <div className="grid grid-cols-2 gap-3 mt-4">{rows.map(([label, value]) => <div key={label} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--neutral-100)', border: '1px solid var(--neutral-200)' }}><div style={{ fontSize: '11px', color: 'var(--neutral-400)', fontWeight: 700 }}>{label}</div><div style={{ fontSize: '13px', color: 'var(--neutral-900)', fontWeight: 700, marginTop: '4px' }}>{value}</div></div>)}</div>;
}

function Checklist({ title, items, done, icon, count }: { title: string; items: string[]; done?: boolean; icon?: React.ReactNode; count?: string }) {
  return <div className="rounded-xl border border-[var(--neutral-200)] overflow-hidden">
    <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: 'var(--cream-50)', borderBottom: '1px solid var(--neutral-200)' }}>
      {icon || <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--success-50)', color: 'var(--success-500)' }}><CheckCircle size={14} /></div>}
      <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-primary)' }}>{title}</h4>
      {count && <span className="ml-auto px-2 py-0.5 rounded-full" style={{ fontSize: '10px', fontWeight: 700, backgroundColor: 'var(--success-50)', color: 'var(--success-600)', border: '1px solid var(--success-200)' }}>{count}</span>}
    </div>
    <div className="p-4">{items.map(item => <div key={item} className="flex items-center gap-2.5 py-2" style={{ fontSize: '13px', color: 'var(--neutral-700)' }}>{done ? <CheckCircle size={15} color="var(--success-500)" /> : <CircleDot size={15} color="var(--neutral-300)" />} {item}</div>)}</div>
  </div>;
}
