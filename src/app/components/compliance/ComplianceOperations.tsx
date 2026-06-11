import { useState } from 'react';
import { CheckCircle, Download, FileText, Search, ShieldCheck } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from '../shared/StatusBadge';
import { AppModal } from '../shared/AppModal';
import { complianceRows, grievanceRegister, nocQueue, stampRows } from '../../data/complianceData';

interface ComplianceOperationsProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

const pageCopy: Record<string, { title: string; subtitle: string }> = {
  'cs-calendar': { title: 'Compliance Calendar', subtitle: 'Current: Q2 FY 2025-26 · Statutory deadlines and evidence tracking' },
  'cs-noc': { title: 'NOC Issuance Queue', subtitle: 'Ref: SOP §6.1 · Loans with full repayment confirmed awaiting CS action' },
  'cs-stamp': { title: 'Stamp Duty Register', subtitle: 'Ref: Maharashtra Stamp Act 1958 · Non-judicial stamp evidence register' },
  'cs-grievance': { title: 'Grievance Register', subtitle: 'Ref: SOP §6, Annexure K / Annexure L · Track complaints and TAT' },
  'cs-security-return': { title: 'Security Return Log', subtitle: 'Track SH-4, blank cheque and CDSL unpledge return after closure' },
  'cs-loan-register': { title: 'Loan Register (CS View)', subtitle: 'CS-relevant legal file and custody status across loans' },
  'cs-sanction-register': { title: 'Credit Sanction Register', subtitle: 'SC approvals, conditions and authority matrix records' },
  'cs-exception-register': { title: 'Exception Register', subtitle: 'Director borrower, security invocation and document exceptions' },
  'cs-poa-register': { title: 'PoA Register', subtitle: 'Power of Attorney execution, custody and invocation readiness' },
  'cs-archive': { title: 'Executed Documents Archive', subtitle: 'Closed legal files and 8-year retention clocks' },
  'cs-reports': { title: 'Compliance Status Report', subtitle: 'KYC, stamp, NOC, register and archive reports' },
};

function formatCurrency(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

export function ComplianceOperations({ onNavigate, activePage }: ComplianceOperationsProps) {
  const [selectedDay, setSelectedDay] = useState(15);
  const [showNoc, setShowNoc] = useState(false);
  const meta = pageCopy[activePage] || pageCopy['cs-calendar'];

  const renderCalendar = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-7 bg-white rounded-lg p-5 border border-[#EDEEF0]">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#12151A' }}>October 2025</h3>
            <div className="flex rounded-lg border border-[#EDEEF0] overflow-hidden">
              {['Month View', 'Quarter View', 'Year View'].map((label, i) => <button key={label} className="px-3 py-1.5" style={{ backgroundColor: i === 0 ? '#1A3C2A' : 'white', color: i === 0 ? 'white' : '#3D4450', fontSize: '12px', fontWeight: 800 }}>{label}</button>)}
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
          {complianceRows.map(row => <tr key={row[0]} className="border-b border-[#EDEEF0]">{row.slice(0, 4).map((cell, i) => <Cell key={i}>{cell}</Cell>)}<Cell><StatusBadge status={row[4]} /></Cell></tr>)}
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
            <span style={{ fontSize: '13px', color: '#6B7280', marginLeft: '14px' }}>Delivery: Email to borrower / Physical courier / Both</span>
          </div>
        </div>
      ))}
      <DataCard title="Recently Issued NOCs">
        <div className="p-4 space-y-2">{nocQueue.slice(1).map(row => <div key={row.loan} style={{ fontSize: '13px', color: '#3D4450' }}>{row.loan} · {row.borrower} · NOC issued {row.repaid} · Archive: active</div>)}</div>
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
        {stampRows.map(row => <tr key={`${row[0]}-${row[1]}`} className="border-b border-[#EDEEF0]">{row.slice(0, 5).map((cell, i) => <Cell key={i} mono={i === 0 || i === 2}>{cell}</Cell>)}<Cell><StatusBadge status={row[5]} /></Cell></tr>)}
      </SimpleTable>
    </DataCard>
  );

  const renderGrievance = () => (
    <DataCard title="Grievance Register" action={<div className="flex items-center gap-2"><button className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#E8F5E9', color: '#1A3C2A', fontSize: '12px', fontWeight: 800 }}>+ New Grievance</button><button className="px-3 py-1.5 rounded-lg border border-[#EDEEF0]" style={{ fontSize: '12px' }}>Export</button></div>}>
      <SimpleTable headers={['Ref', 'Description', 'Received', 'Status', 'TAT']}>
        {grievanceRegister.map(row => <tr key={row.ref} className="border-b border-[#EDEEF0]"><Cell mono>{row.ref}</Cell><Cell>{row.description}</Cell><Cell>{row.received}</Cell><Cell><StatusBadge status={row.status} /></Cell><Cell>{row.tat}</Cell></tr>)}
      </SimpleTable>
    </DataCard>
  );

  const renderGenericRegister = () => (
    <div className="grid grid-cols-3 gap-5">
      {[
        ['Loan Register (CS View)', 'Documentation status, custody chain, NOC status'],
        ['Credit Sanction Register', 'Authority matrix and SC conditions'],
        ['Exception Register', 'Director borrower, GM approval and security invocation'],
        ['PoA Register', 'Execution, custody, scan and invocation readiness'],
        ['Executed Documents Archive', 'NOC issued, archive expiry and 8-year retention'],
        ['Compliance Status Report', 'KYC, stamp duty, NOC and statutory report packs'],
      ].map(([title, note]) => (
        <div key={title} className="bg-white rounded-lg p-5 border border-[#EDEEF0]">
          <FileText size={18} color="#1A3C2A" />
          <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#12151A', marginTop: '12px' }}>{title}</h3>
          <p style={{ fontSize: '13px', color: '#3D4450', lineHeight: '20px', marginTop: '8px' }}>{note}</p>
          <button className="mt-4 px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#E8F5E9', color: '#1A3C2A', fontSize: '12px', fontWeight: 800 }}><Download size={13} style={{ display: 'inline', marginRight: 6 }} />Generate</button>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    if (activePage === 'cs-calendar') return renderCalendar();
    if (activePage === 'cs-noc') return renderNoc();
    if (activePage === 'cs-stamp') return renderStamp();
    if (activePage === 'cs-grievance') return renderGrievance();
    return renderGenericRegister();
  };

  return (
    <Shell activePage={activePage} onNavigate={onNavigate} breadcrumbs={['Compliance', meta.title]} pageTitle={meta.title} pageSubtitle={meta.subtitle} actions={<button onClick={() => onNavigate('cs-workspace')} className="px-4 py-2.5 rounded-lg font-semibold" style={{ backgroundColor: '#1A3C2A', color: 'white', fontSize: '14px' }}>Open Document Workspace</button>}>
      {renderContent()}
    </Shell>
  );
}

function DataCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return <div className="bg-white rounded-lg border border-[#EDEEF0] overflow-hidden"><div className="px-5 py-3 border-b border-[#EDEEF0] flex items-center justify-between" style={{ backgroundColor: '#FDFAF4' }}><h3 style={{ fontSize: '15px', fontWeight: 900, color: '#1A3C2A' }}>{title}</h3>{action}</div>{children}</div>;
}

function SimpleTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return <table className="w-full"><thead><tr>{headers.map(h => <th key={h} className="px-4 py-3 text-left" style={{ fontSize: '11px', color: '#9EA8B3', fontWeight: 800, textTransform: 'uppercase' }}>{h}</th>)}</tr></thead><tbody>{children}</tbody></table>;
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
