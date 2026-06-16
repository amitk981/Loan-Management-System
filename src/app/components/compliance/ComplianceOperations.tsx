import { useState } from 'react';
import { CheckCircle, Download, FileText, Search, ShieldCheck } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from '../shared/StatusBadge';
import { WorkbenchTabs } from '../shared/WorkbenchTabs';
import { complianceQueueTabs, complianceRegisterTabs } from '../../data/roleNav';
import { AppModal } from '../shared/AppModal';
import { complianceRows, grievanceRegister, nocQueue, stampRows } from '../../data/complianceData';

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

function formatCurrency(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

export function ComplianceOperations({ onNavigate, activePage }: ComplianceOperationsProps) {
  const [selectedDay, setSelectedDay] = useState(15);
  const [calendarView, setCalendarView] = useState<'Month View' | 'Quarter View' | 'Year View'>('Month View');
  const [showNoc, setShowNoc] = useState(false);
  const meta = pageCopy[activePage] || pageCopy['cs-calendar'];
  const showRegisterTabs = complianceRegisterTabs.some(tab => tab.key === activePage);
  const showQueueTabs = complianceQueueTabs.some(tab => tab.key === activePage);

  const renderCalendar = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-7 bg-white rounded-lg p-5 border border-[#EDEEF0]">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#12151A' }}>October 2025</h3>
            <div className="flex rounded-lg border border-[#EDEEF0] overflow-hidden">
              {(['Month View', 'Quarter View', 'Year View'] as const).map(label => <button key={label} onClick={() => setCalendarView(label)} className="px-3 py-1.5" style={{ backgroundColor: calendarView === label ? '#1A3C2A' : 'white', color: calendarView === label ? 'white' : '#3D4450', fontSize: '12px', fontWeight: 800 }}>{label}</button>)}
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d} className="text-center py-2" style={{ fontSize: '11px', color: '#9EA8B3', fontWeight: 800 }}>{d}</div>)}
            {Array.from({ length: 35 }, (_, i) => i < 2 ? null : i - 1).map((day, i) => {
              const marker = day === 15 ? '🔴' : day === 22 || day === 31 ? '🟡' : day === 28 ? '🟢' : '';
              return <button key={i} disabled={!day} onClick={() => day && setSelectedDay(day)} className="rounded-lg p-2 min-h-16 text-left" style={{ border: selectedDay === day ? '2px solid #1A3C2A' : '1px solid #EDEEF0', backgroundColor: day ? 'white' : '#F7F8FA' }}><div style={{ fontSize: '13px', fontWeight: 800, color: '#3D4450' }}>{day || ''} {marker}</div></button>;
            })}
          </div>
          <div className="mt-3" style={{ fontSize: '12px', color: '#6B7280' }}>🔴 Overdue / Critical · 🟡 Upcoming within 14 days · 🟢 Completed · 🔵 Scheduled</div>
        </div>
        <div className="col-span-5 bg-white rounded-lg p-5 border border-[#EDEEF0]">
          <div style={{ fontSize: '12px', color: '#9EA8B3', fontWeight: 800 }}>Selected: Oct {selectedDay}</div>
          <h3 style={{ fontSize: '20px', color: '#1A3C2A', fontWeight: 900, marginTop: '10px' }}>Maharashtra Stamp Act</h3>
          <p style={{ fontSize: '14px', color: '#3D4450', lineHeight: '22px', marginTop: '8px' }}>Annual Declaration</p>
          <InfoGrid rows={[['Statute', 'Maharashtra Stamp Act, 1958'], ['Owner', 'Company Secretary'], ['Evidence Required', 'Annual declaration + stamp register'], ['Frequency', 'Annual'], ['Status', 'Due in 3 days']]} />
          <div className="mt-5 flex gap-3"><button className="px-3 py-2 rounded-lg border border-[#EDEEF0]">Upload Evidence</button><button className="px-3 py-2 rounded-lg font-semibold" style={{ backgroundColor: '#1A3C2A', color: 'white' }}>Mark Complete</button></div>
        </div>
      </div>
      <DataCard title="Compliance Table">
        <SimpleTable headers={['Compliance Area', 'Requirement', 'Frequency', 'Owner', 'Status']}>
          {complianceRows.map(row => <tr key={row[0]} onClick={() => onNavigate('cs-calendar')} className="border-b border-[#EDEEF0] clickable-row">{row.slice(0, 4).map((cell, i) => <Cell key={i}>{cell}</Cell>)}<Cell><StatusBadge status={row[4]} /></Cell></tr>)}
        </SimpleTable>
      </DataCard>
    </div>
  );

  const renderNoc = () => (
    <div className="space-y-5">
      {nocQueue.slice(0, 1).map(row => (
        <div key={row.loan} className="bg-white rounded-lg p-5 border border-[#EDEEF0]">
          <div className="flex items-start justify-between">
            <div>
              <div style={{ fontSize: '18px', fontFamily: 'Roboto Mono', color: '#1E88E5', fontWeight: 900 }}>{row.loan} · {row.borrower} · {formatCurrency(row.amount)} · Repaid: {row.repaid}</div>
              <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '8px' }}>Repayment confirmed by: {row.finance} · SAP confirmed ✅</div>
            </div>
            <StatusBadge status={row.status} size="md" />
          </div>
          <div className="grid grid-cols-2 gap-5 mt-5">
            <Checklist title="Pre-NOC Checklist" items={['Full principal repaid', 'All interest invoices settled', 'No outstanding dues', 'SAP balance = ₹0']} done />
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#FDFAF4', border: '1px solid #EDEEF0' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 900, color: '#1A3C2A', marginBottom: '10px' }}>Security Return</h4>
              {['SH-4 Form returned to borrower', 'Blank-dated cheque returned', 'CDSL Unpledge initiated (if D-MAT)'].map(item => <div key={item} className="flex items-center justify-between py-2"><span style={{ fontSize: '13px', color: '#3D4450' }}>□ {item}</span><button className="px-2 py-1 rounded-md" style={{ backgroundColor: '#E8F5E9', color: '#1A3C2A', fontSize: '11px', fontWeight: 800 }}>Mark Returned</button></div>)}
            </div>
          </div>
          <div className="mt-5 p-4 rounded-lg" style={{ backgroundColor: '#F7F8FA', border: '1px solid #EDEEF0' }}>
            <div style={{ fontSize: '14px', fontWeight: 900, color: '#12151A', marginBottom: '10px' }}>NOC Document</div>
            <button onClick={() => setShowNoc(true)} className="px-4 py-2.5 rounded-lg font-semibold" style={{ backgroundColor: '#1A3C2A', color: 'white', fontSize: '14px' }}>Generate NOC →</button>
          </div>
        </div>
      ))}
      <DataCard title="Recently Issued NOCs">
        <div className="p-4 space-y-2">{nocQueue.slice(1).map(row => <button key={row.loan} onClick={() => onNavigate('cs-archive')} className="w-full text-left p-3 rounded-lg clickable-row" style={{ fontSize: '13px', color: '#3D4450' }}>{row.loan} · {row.borrower} · NOC issued {row.repaid}</button>)}</div>
      </DataCard>
      {showNoc && <AppModal title="No-Objection Certificate" subtitle="Preview before issuing and archiving" icon={<FileText size={18} />} onClose={() => setShowNoc(false)} footer={<><button onClick={() => setShowNoc(false)} className="px-4 py-2.5 rounded-lg border border-[#EDEEF0]">Download PDF</button><button onClick={() => setShowNoc(false)} className="px-4 py-2.5 rounded-lg font-semibold" style={{ backgroundColor: '#1A3C2A', color: 'white' }}>Send to Borrower & Archive</button></>}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '13px', color: '#12151A', lineHeight: '22px', backgroundColor: '#FDFAF4', padding: '18px', border: '1px solid #EDEEF0' }}>
          <strong>NO-OBJECTION CERTIFICATE</strong><br /><br />Date: 11-Oct-2025<br /><br />To,<br />Shri. Rajesh Patil<br />Village: Peth, Nashik<br /><br />Ref: Loan No. LO00000082 | Amount: ₹80,000<br />Disbursed: 15-Oct-2024 | Repaid: 11-Oct-2025<br /><br />This is to certify that the above loan has been fully repaid. SFPCL has no further claim against you in respect of this loan. The Share Transfer Form (SH-4) and undated cheque held as security are hereby returned.<br /><br />Sd/-<br />Anjali Mehta<br />Company Secretary, SFPCL
        </div>
      </AppModal>}
    </div>
  );

  const renderStamp = () => (
    <DataCard title="Stamp Inventory Summary: Total purchased FY25-26: 284 · Used: 271 · Balance: 13" action={<button className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#1A3C2A', color: 'white', fontSize: '12px', fontWeight: 800 }}>+ Record New Stamp Purchase</button>}>
      <SimpleTable headers={['Loan ID', 'Instrument', 'Stamp Val.', 'Affixed On', 'By', 'Status']}>
        {stampRows.map(row => <tr key={`${row[0]}-${row[1]}`} onClick={() => onNavigate('cs-stamp')} className="border-b border-[#EDEEF0] clickable-row">{row.slice(0, 5).map((cell, i) => <Cell key={i} mono={i === 0 || i === 2}>{cell}</Cell>)}<Cell><StatusBadge status={row[5]} /></Cell></tr>)}
      </SimpleTable>
    </DataCard>
  );

  const renderGrievance = () => (
    <DataCard title="Grievance Register" action={<div className="flex items-center gap-2"><button className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#E8F5E9', color: '#1A3C2A', fontSize: '12px', fontWeight: 800 }}>+ New Grievance</button><button className="px-3 py-1.5 rounded-lg border border-[#EDEEF0]" style={{ fontSize: '12px' }}>Export</button></div>}>
      <SimpleTable headers={['Ref', 'Description', 'Received', 'Status', 'TAT']}>
        {grievanceRegister.map(row => <tr key={row.ref} onClick={() => onNavigate('cs-grievance')} className="border-b border-[#EDEEF0] clickable-row"><Cell mono>{row.ref}</Cell><Cell>{row.description}</Cell><Cell>{row.received}</Cell><Cell><StatusBadge status={row.status} /></Cell><Cell>{row.tat}</Cell></tr>)}
      </SimpleTable>
    </DataCard>
  );

  const renderGenericRegister = () => (
    <div className="grid grid-cols-3 gap-5">
      {[
        ['Loan Register (CS View)', 'Custody and NOC status', 'cs-loan-register'],
        ['Credit Sanction Register', 'Authority and conditions', 'cs-sanction-register'],
        ['Exception Register', 'GM approval and invocation', 'cs-exception-register'],
        ['PoA Register', 'Execution and custody', 'cs-poa-register'],
        ['Executed Documents Archive', 'Retention clock', 'cs-archive'],
        ['Compliance Status Report', 'KYC, stamp and NOC', 'cs-reports'],
      ].map(([title, note, page]) => (
        <button key={title} onClick={() => onNavigate(page)} className="bg-white rounded-lg p-5 border border-[#EDEEF0] text-left clickable-card">
          <FileText size={18} color="#1A3C2A" />
          <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#12151A', marginTop: '12px' }}>{title}</h3>
          <div style={{ fontSize: '13px', color: '#3D4450', lineHeight: '20px', marginTop: '8px' }}>{note}</div>
          <span className="inline-flex mt-4 px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#E8F5E9', color: '#1A3C2A', fontSize: '12px', fontWeight: 800 }}><Download size={13} style={{ marginRight: 6 }} />Generate</span>
        </button>
      ))}
    </div>
  );

  const renderCdsl = () => (
    <DataCard title="CDSL Pledge Lifecycle" action={<button onClick={() => onNavigate('cs-workspace')} className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#1A3C2A', color: 'white', fontSize: '12px', fontWeight: 800 }}>Open SH-4 Tab</button>}>
      <SimpleTable headers={['Loan ID', 'Borrower', 'PSN', 'Stage', 'DP Status', 'Action']}>
        {[
          ['LO00000047', 'Ramesh Patil', 'PSN-88421', 'Active', 'Pledgee DP Accepted', 'Initiate URF on repayment'],
          ['LO00000062', 'Sunita More', 'PSN-77210', 'Created', 'Awaiting acceptance', 'Follow with CDSL'],
          ['LO00000018', 'Narayan Patil', 'PSN-66102', 'Invoked', 'IRF filed', 'View invocation log'],
        ].map(row => (
          <tr key={row[0]} onClick={() => onNavigate('cs-sh4')} className="border-b border-[#EDEEF0] clickable-row">
            {row.map((cell, i) => <Cell key={i} mono={i === 0 || i === 2}>{cell}</Cell>)}
          </tr>
        ))}
      </SimpleTable>
      <div className="p-4 border-t border-[#EDEEF0]" style={{ fontSize: '13px', color: '#3D4450' }}>Future shares clause auto-included. On default, IRF invocation requires SC authorization before CS executes.</div>
    </DataCard>
  );

  const renderSecurityReturn = () => (
    <DataCard title="Security Return Log" action={<button onClick={() => onNavigate('cs-noc')} className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#1A3C2A', color: 'white', fontSize: '12px', fontWeight: 800 }}>Open NOC Queue</button>}>
      <SimpleTable headers={['Loan ID', 'Borrower', 'SH-4', 'Blank Cheque', 'CDSL URF', 'Returned On', 'Status']}>
        {[
          ['LO00000082', 'Rajesh Patil', 'Returned', 'Returned', 'N/A', '11-Oct-2025', 'Complete'],
          ['LO00000047', 'Ramesh Patil', 'In custody', 'In custody', 'Pending', '—', 'Active loan'],
          ['LO00000031', 'Vilas Jadhav', 'Invoked', 'Presented', 'N/A', '02-Sep-2025', 'Recovery'],
        ].map(row => (
          <tr key={row[0]} onClick={() => onNavigate('cs-noc')} className="border-b border-[#EDEEF0] clickable-row">
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
    <Shell activePage={activePage} onNavigate={onNavigate} breadcrumbs={['Compliance', meta.title]} pageTitle={meta.title} pageSubtitle={meta.subtitle} actions={<button onClick={() => onNavigate('cs-workspace')} className="px-4 py-2.5 rounded-lg font-semibold" style={{ backgroundColor: '#1A3C2A', color: 'white', fontSize: '14px' }}>Open Document Workspace</button>}>
      {showQueueTabs && <WorkbenchTabs tabs={complianceQueueTabs} activeKey={activePage} onChange={onNavigate} accent="#1A3C2A" />}
      {showRegisterTabs && <WorkbenchTabs tabs={complianceRegisterTabs} activeKey={activePage} onChange={onNavigate} accent="#1A3C2A" />}
      {renderContent()}
    </Shell>
  );
}

function DataCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return <div className="bg-white rounded-lg border border-[#EDEEF0] overflow-hidden"><div className="px-5 py-3 border-b border-[#EDEEF0] flex items-center justify-between" style={{ backgroundColor: '#FDFAF4' }}><h3 style={{ fontSize: '15px', fontWeight: 900, color: '#1A3C2A' }}>{title}</h3>{action}</div>{children}</div>;
}

function SimpleTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return <div className="table-scroll"><table className="w-full"><thead><tr>{headers.map(h => <th key={h} className="px-4 py-3 text-left" style={{ fontSize: '11px', color: '#9EA8B3', fontWeight: 800, textTransform: 'uppercase' }}>{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}

function Cell({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return <td className="px-4 py-3" style={{ fontSize: '13px', color: '#3D4450', fontFamily: mono ? 'Roboto Mono' : 'inherit', fontWeight: mono ? 800 : 500 }}>{children}</td>;
}

function InfoGrid({ rows }: { rows: string[][] }) {
  return <div className="grid grid-cols-2 gap-3 mt-4">{rows.map(([label, value]) => <div key={label} className="p-3 rounded-lg" style={{ backgroundColor: '#F7F8FA', border: '1px solid #EDEEF0' }}><div style={{ fontSize: '11px', color: '#9EA8B3', fontWeight: 800 }}>{label}</div><div style={{ fontSize: '13px', color: '#12151A', fontWeight: 700, marginTop: '4px' }}>{value}</div></div>)}</div>;
}

function Checklist({ title, items, done }: { title: string; items: string[]; done?: boolean }) {
  return <div className="p-4 rounded-lg" style={{ backgroundColor: '#FDFAF4', border: '1px solid #EDEEF0' }}><h4 style={{ fontSize: '14px', fontWeight: 900, color: '#1A3C2A', marginBottom: '10px' }}>{title}</h4>{items.map(item => <div key={item} className="flex items-center gap-2 py-2" style={{ fontSize: '13px', color: '#3D4450' }}>{done ? <CheckCircle size={15} color="#22C55E" /> : '□'} {item}</div>)}</div>;
}
