import { useState } from 'react';
import { Download, CreditCard, FileText, Info, FileCheck, Banknote, Clock, Copy } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from '../shared/StatusBadge';
import { LoanTracker } from '../shared/LoanTracker';
import { AppModal } from '../shared/AppModal';
import { farmerDocuments, farmerLoan, farmerLoanHistory, farmerProfile, farmerRepaymentSchedule, farmerTimeline } from '../../data/farmerData';

interface LoanStatusProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

type LoanTab = 'overview' | 'documents' | 'repayment' | 'timeline';

function formatCurrency(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

function DocCard({ doc, onOpen }: { doc: typeof farmerDocuments[number]; onOpen: (doc: typeof farmerDocuments[number]) => void }) {
  const available = doc.status === 'Available';
  return (
    <div onClick={() => onOpen(doc)} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen(doc)} className="bg-white rounded-2xl p-5 border border-[#EDEEF0] shadow-sm text-left clickable-card">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEE2E2' }}>
          <FileText size={18} style={{ color: '#EF4444' }} />
        </div>
        <StatusBadge status={doc.status} />
      </div>
      <div style={{ fontSize: '14px', fontWeight: 700, color: '#12151A', marginTop: '12px', minHeight: '38px' }}>{doc.name}</div>
      <div style={{ fontSize: '12px', color: '#9EA8B3', marginTop: '4px' }}>{doc.date === '—' ? 'Not generated yet' : `Generated ${doc.date}`}</div>
      {doc.redacted && (
        <div className="mt-3 p-2 rounded-lg" style={{ backgroundColor: '#FEF3C7', color: '#92400E', fontSize: '11px', lineHeight: '16px' }}>
          Summary view only. Risk details redacted per SOP.
        </div>
      )}
      <button
        disabled={!available}
        onClick={(e) => { e.stopPropagation(); onOpen(doc); }}
        className="w-full mt-4 py-2 rounded-xl flex items-center justify-center gap-2"
        style={{ backgroundColor: available ? '#E8F5E9' : '#F7F8FA', color: available ? '#1A3C2A' : '#9EA8B3', fontSize: '13px', fontWeight: 700, cursor: available ? 'pointer' : 'not-allowed' }}
      >
        <Download size={14} /> {available ? 'Download' : 'Unavailable'}
      </button>
    </div>
  );
}

export function LoanStatus({ onNavigate, activePage }: LoanStatusProps) {
  const initialTab: LoanTab = activePage === 'farmer-documents' ? 'documents' : 'overview';
  const [activeTab, setActiveTab] = useState<LoanTab>(initialTab);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [documentModal, setDocumentModal] = useState<typeof farmerDocuments[number] | null>(null);
  const [uploadModal, setUploadModal] = useState(false);
  const [docFilter, setDocFilter] = useState('All Loans');
  const [docSearch, setDocSearch] = useState('');
  const documentResultModal = documentModal && (
    <AppModal
      title={documentModal.status === 'Available' ? `${documentModal.name} ready` : `${documentModal.name} not generated`}
      subtitle={`${documentModal.group} · ${documentModal.type}`}
      icon={<FileText size={18} />}
      onClose={() => setDocumentModal(null)}
      footer={
        <>
          <button onClick={() => setDocumentModal(null)} className="px-4 py-2.5 rounded-xl border border-[#EDEEF0]" style={{ fontSize: '14px' }}>Close</button>
          {documentModal.status === 'Available' && (
            <button onClick={() => setDocumentModal(null)} className="px-4 py-2.5 rounded-xl font-semibold" style={{ backgroundColor: '#1A3C2A', color: 'white', fontSize: '14px' }}>Download PDF</button>
          )}
        </>
      }
    >
      <div style={{ fontSize: '13px', color: '#3D4450', lineHeight: '20px' }}>
        {documentModal.status === 'Available'
          ? `${documentModal.name} was generated on ${documentModal.date}. In this prototype, Download PDF confirms the action and returns you to the document list.`
          : 'This document becomes available after full repayment, SH-4 return, blank cheque return, and CS sign-off.'}
      </div>
    </AppModal>
  );
  const uploadDocumentModal = uploadModal && (
    <AppModal
      title="Upload document"
      subtitle="Receipt, letter, or supporting file"
      icon={<FileText size={18} />}
      onClose={() => setUploadModal(false)}
      footer={
        <>
          <button onClick={() => setUploadModal(false)} className="px-4 py-2.5 rounded-xl border border-[#EDEEF0]" style={{ fontSize: '14px' }}>Cancel</button>
          <button onClick={() => setUploadModal(false)} className="px-4 py-2.5 rounded-xl font-semibold" style={{ backgroundColor: '#1A3C2A', color: 'white', fontSize: '14px' }}>Attach File</button>
        </>
      }
    >
      <button onClick={() => setUploadModal(false)} className="w-full border-2 border-dashed rounded-xl p-6 text-center hover:bg-[#F0FDF4]" style={{ borderColor: '#D1D5DB', backgroundColor: '#FAFAFA', fontSize: '13px', color: '#3D4450' }}>
        Choose a document to add it to the farmer loan file.
      </button>
    </AppModal>
  );

  if (activePage === 'farmer-noc') {
    return (
      <Shell activePage={activePage} onNavigate={onNavigate} breadcrumbs={['My Loans', farmerLoan.id, 'NOC Issued']}>
        <div className="relative min-h-[560px] flex items-center justify-center overflow-hidden">
          <div className="w-full max-w-xl text-center bg-white rounded-2xl p-8 border border-[#EDEEF0] shadow-sm">
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center" style={{ backgroundColor: '#22C55E', color: 'white' }}>
              <FileCheck size={42} />
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#12151A', marginTop: '24px' }}>Loan Repaid</h2>
            <div className="mt-6 p-5 rounded-2xl text-left" style={{ backgroundColor: '#F0FDF4', border: '1px solid #22C55E' }}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['Loan ID', farmerLoan.id],
                  ['Total Paid', '₹2,24,000'],
                  ['Tenure', '12 months'],
                  ['Closed on', '15 Jan 2026'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div style={{ fontSize: '11px', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>{label}</div>
                    <div style={{ fontSize: '16px', color: '#12151A', fontWeight: 700, marginTop: '4px', fontFamily: label === 'Loan ID' || label === 'Total Paid' ? 'Roboto Mono' : 'inherit' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 text-left">
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#12151A', marginBottom: '8px' }}>The following have been returned to you:</div>
              {['SH-4 Form (returned by CS team)', 'Blank-dated Cheque (returned by CS team)'].map(item => (
                <button key={item} onClick={() => onNavigate('farmer-documents')} className="w-full text-left p-2 rounded-lg clickable-row" style={{ fontSize: '14px', color: '#166534', marginTop: '6px' }}>{item}</button>
              ))}
            </div>
            <div className="mt-7 flex items-center justify-center gap-3">
              <button onClick={() => setDocumentModal({ name: 'NOC', type: 'PDF', status: 'Available', date: '15 Jan 2026', group: 'Receipts' })} className="px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2" style={{ backgroundColor: '#1A3C2A', color: 'white', fontSize: '14px' }}>
                <Download size={15} /> Download NOC
              </button>
              <button onClick={() => onNavigate('farmer-dashboard')} className="px-5 py-2.5 rounded-xl" style={{ color: '#1A3C2A', fontSize: '14px', fontWeight: 700 }}>Back to Dashboard</button>
            </div>
          </div>
        </div>
        {documentResultModal}
      </Shell>
    );
  }

  if (activePage === 'farmer-loan-history') {
    const totalBorrowed = farmerLoanHistory.reduce((sum, row) => sum + row.sanctioned, 0);
    const totalRepaid = farmerLoanHistory.reduce((sum, row) => sum + row.repaid, 0);
    return (
      <Shell activePage={activePage} onNavigate={onNavigate} breadcrumbs={['My Loans', 'Loan History']} pageTitle="Loan History" pageSubtitle="Past and active loans">
        <div className="grid grid-cols-3 gap-5 mb-5">
          {[
            ['Total Borrowed', formatCurrency(totalBorrowed), '#1A3C2A', 'farmer-active-loans'],
            ['Total Repaid', formatCurrency(totalRepaid), '#22C55E', 'farmer-repayment'],
            ['Active Loans', '1', '#1E88E5', 'farmer-active-loans'],
          ].map(([label, value, color, page]) => (
            <button key={label} onClick={() => onNavigate(page)} className="bg-white rounded-2xl p-5 border border-[#EDEEF0] text-left clickable-card">
              <div style={{ fontSize: '12px', color: '#9EA8B3', fontWeight: 700 }}>{label}</div>
              <div style={{ fontSize: '26px', color, fontWeight: 700, fontFamily: 'Roboto Mono', marginTop: '6px' }}>{value}</div>
            </button>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-[#EDEEF0] overflow-hidden table-scroll">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#F7F8FA', borderBottom: '1px solid #EDEEF0' }}>
                {['Loan ID', 'Sanctioned', 'Disbursed', 'Repaid', 'Tenure', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left" style={{ fontSize: '11px', color: '#9EA8B3', fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {farmerLoanHistory.map(row => (
                <tr key={row.id} onClick={() => onNavigate('farmer-active-loans')} className="border-b border-[#EDEEF0] clickable-row">
                  <td className="px-5 py-4" style={{ fontSize: '13px', color: row.status === 'Active' ? '#1E88E5' : '#9EA8B3', fontFamily: 'Roboto Mono', textDecoration: row.status === 'Closed' ? 'line-through' : 'none' }}>{row.id}</td>
                  <td className="px-5 text-right" style={{ fontSize: '13px', fontFamily: 'Roboto Mono' }}>{formatCurrency(row.sanctioned)}</td>
                  <td className="px-5" style={{ fontSize: '13px', color: '#3D4450' }}>{row.disbursed}</td>
                  <td className="px-5 text-right" style={{ fontSize: '13px', fontFamily: 'Roboto Mono' }}>{formatCurrency(row.repaid)}</td>
                  <td className="px-5" style={{ fontSize: '13px', color: '#3D4450' }}>{row.tenure}</td>
                  <td className="px-5"><StatusBadge status={row.status} /></td>
                  <td className="px-5"><button onClick={(e) => { e.stopPropagation(); onNavigate('farmer-active-loans'); }} style={{ fontSize: '13px', color: '#1E88E5', fontWeight: 700 }}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Shell>
    );
  }

  if (activePage === 'farmer-documents') {
    const visibleDocuments = farmerDocuments.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(docSearch.toLowerCase()) || doc.group.toLowerCase().includes(docSearch.toLowerCase());
      const matchesFilter = docFilter === 'All Loans' || docFilter === farmerLoan.id || docFilter === farmerLoan.previousLoanId;
      return matchesSearch && matchesFilter;
    });
    return (
      <Shell activePage={activePage} onNavigate={onNavigate} breadcrumbs={['My Documents']} pageTitle="My Documents" pageSubtitle="Loan documents">
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          {['All Loans', farmerLoan.id, farmerLoan.previousLoanId].map((item, i) => (
            <button key={item} onClick={() => setDocFilter(item)} className="px-3 py-1.5 rounded-full" style={{ backgroundColor: docFilter === item ? '#1A3C2A' : '#F7F8FA', color: docFilter === item ? 'white' : '#3D4450', fontSize: '13px', fontWeight: 700 }}>{item}</button>
          ))}
          <input value={docSearch} onChange={(e) => setDocSearch(e.target.value)} placeholder="Search documents..." className="ml-auto px-3 rounded-xl border border-[#D1D5DB]" style={{ height: '36px', fontSize: '13px', minWidth: '240px' }} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {visibleDocuments.map(doc => <DocCard key={doc.name} doc={doc} onOpen={setDocumentModal} />)}
          <button onClick={() => setUploadModal(true)} className="rounded-2xl p-5 border-2 border-dashed border-[#D1D5DB] hover:bg-[#E8F5E9] text-center">
            <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center" style={{ backgroundColor: '#E8F5E9', color: '#1A3C2A', fontSize: '28px' }}>+</div>
            <div style={{ fontSize: '14px', color: '#12151A', fontWeight: 700, marginTop: '12px' }}>Upload a Document</div>
            <div style={{ fontSize: '12px', color: '#9EA8B3', marginTop: '4px' }}>Add receipts, letters, or other loan documents</div>
          </button>
        </div>
        {visibleDocuments.length === 0 && (
          <div className="mt-5 p-5 rounded-2xl text-center" style={{ backgroundColor: '#F7F8FA', border: '1px solid #EDEEF0', color: '#6B7280', fontSize: '13px' }}>
            No documents match this search.
          </div>
        )}
        {documentResultModal}
        {uploadDocumentModal}
      </Shell>
    );
  }

  const tabs: { id: LoanTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'documents', label: 'Documents' },
    { id: 'repayment', label: 'Repayment' },
    { id: 'timeline', label: 'Timeline' },
  ];

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['My Loans', farmerLoan.id]}
      pageTitle={`Loan Details — ${farmerLoan.id}`}
      pageSubtitle={`${farmerLoan.status} · ${farmerLoan.tenure} · Disbursed ${farmerLoan.disbursedDate}`}
      actions={<StatusBadge status={farmerLoan.status} size="md" />}
    >
      <div className="flex items-center gap-6 mb-5 bg-white border border-[#EDEEF0] rounded-xl px-4">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="py-3" style={{ fontSize: '14px', fontWeight: 700, color: activeTab === tab.id ? '#1A3C2A' : '#3D4450', borderBottom: activeTab === tab.id ? '2px solid #1A3C2A' : '2px solid transparent' }}>{tab.label}</button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-[#EDEEF0]">
            <div className="grid grid-cols-5 gap-4">
              {[
                ['Sanctioned Amount', formatCurrency(farmerLoan.sanctionedAmount), ''],
                ['Outstanding', formatCurrency(farmerLoan.outstandingBalance), ''],
                ['Interest Rate', farmerLoan.interestRate, 'Floating · Updated Apr 2025'],
                ['Tenure', '12 months', 'Short-term'],
                ['Next Due', farmerLoan.nextDueDate, farmerLoan.dueIn],
              ].map(([label, value, sub]) => (
                <div key={label}>
                  <div style={{ fontSize: '11px', color: '#9EA8B3', fontWeight: 700, marginBottom: '6px' }}>{label}</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: label === 'Next Due' ? '#F59E0B' : '#12151A', fontFamily: label.includes('Amount') || label === 'Outstanding' ? 'Roboto Mono' : 'inherit' }}>{value}</div>
                  {sub && <div style={{ fontSize: '12px', color: '#9EA8B3', marginTop: '4px' }}>{sub}</div>}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#EDEEF0]">
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#12151A', marginBottom: '20px' }}>Loan Journey</h3>
            <LoanTracker currentStage={6} completedDates={['10 Jan 2025', '12 Jan 2025', '13 Jan 2025', '14 Jan 2025', '15 Jan 2025', 'Active since 15 Jan 2025']} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              ['Make Payment', 'Pay now via RTGS/NEFT', <CreditCard size={24} />],
              ['Download Statement', 'PDF, last updated today', <Download size={24} />],
              ['View Agreement', 'Loan Agreement PDF', <FileCheck size={24} />],
            ].map(([title, sub, icon]) => (
              <button key={title as string} onClick={() => title === 'Make Payment' ? onNavigate('farmer-repayment') : setActiveTab('documents')} className="bg-white rounded-2xl p-5 border border-[#EDEEF0] text-left clickable-card">
                <div style={{ color: '#1E88E5', marginBottom: '10px' }}>{icon}</div>
                <div style={{ fontSize: '15px', color: '#12151A', fontWeight: 700 }}>{title}</div>
                <div style={{ fontSize: '12px', color: '#9EA8B3', marginTop: '4px' }}>{sub}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'documents' && <div className="grid grid-cols-3 gap-4">{farmerDocuments.slice(0, 8).map(doc => <DocCard key={doc.name} doc={doc} onOpen={setDocumentModal} />)}</div>}

      {activeTab === 'repayment' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-[#EDEEF0] flex items-center justify-between">
            <div>
              <div style={{ fontSize: '12px', color: '#9EA8B3', fontWeight: 700 }}>Outstanding Balance</div>
              <div style={{ fontSize: '32px', color: '#12151A', fontWeight: 700, fontFamily: 'Roboto Mono' }}>{formatCurrency(farmerLoan.outstandingBalance)}</div>
              <div className="w-80 max-w-full h-2 bg-[#EDEEF0] rounded-full mt-3"><div className="h-full rounded-full" style={{ width: '28.75%', backgroundColor: '#22C55E' }} /></div>
              <div style={{ fontSize: '12px', color: '#9EA8B3', marginTop: '6px' }}>{formatCurrency(farmerLoan.totalRepaid)} repaid of {formatCurrency(farmerLoan.sanctionedAmount)}</div>
            </div>
            <div className="text-right">
              <div style={{ fontSize: '12px', color: '#9EA8B3', fontWeight: 700 }}>Next Payment Due</div>
              <div style={{ fontSize: '20px', color: '#F59E0B', fontWeight: 700 }}>{farmerLoan.nextDueDate}</div>
              <div style={{ fontSize: '12px', color: '#9EA8B3', marginTop: '4px' }}>{farmerLoan.dueIn}</div>
              <button onClick={() => setShowPaymentModal(true)} className="mt-3 px-5 py-2.5 rounded-xl font-semibold" style={{ backgroundColor: '#1A3C2A', color: 'white', fontSize: '14px' }}>Pay Now</button>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#EDEEF0] overflow-hidden table-scroll">
            <div className="px-5 py-3 border-b border-[#EDEEF0]" style={{ backgroundColor: '#F7F8FA' }}><h3 style={{ fontSize: '15px', fontWeight: 700 }}>Repayment Schedule</h3></div>
            <table className="w-full">
              <thead><tr>{['Due Date', 'Principal (₹)', 'Interest (₹)', 'Total (₹)', 'Status'].map(h => <th key={h} className="px-5 py-3 text-left" style={{ fontSize: '11px', color: '#9EA8B3', textTransform: 'uppercase' }}>{h}</th>)}</tr></thead>
              <tbody>{farmerRepaymentSchedule.map(row => (
                <tr key={row.dueDate} onClick={() => row.status === 'Due Soon' && setShowPaymentModal(true)} className="border-b border-[#EDEEF0] clickable-row" style={{ backgroundColor: row.status === 'Due Soon' ? '#E8F5E9' : 'white', borderLeft: row.status === 'Due Soon' ? '3px solid #1A3C2A' : '3px solid transparent' }}>
                  <td className="px-5 py-3" style={{ fontSize: '13px', color: row.status === 'Paid' ? '#9EA8B3' : '#3D4450' }}>{row.dueDate}</td>
                  <td className="px-5 text-right" style={{ fontSize: '13px', fontFamily: 'Roboto Mono' }}>{formatCurrency(row.principal)}</td>
                  <td className="px-5 text-right" style={{ fontSize: '13px', fontFamily: 'Roboto Mono' }}>{formatCurrency(row.interest)}</td>
                  <td className="px-5 text-right" style={{ fontSize: '13px', fontFamily: 'Roboto Mono', fontWeight: 700 }}>{formatCurrency(row.total)}</td>
                  <td className="px-5"><StatusBadge status={row.status} /></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="bg-white rounded-2xl p-6 border border-[#EDEEF0]">
          <div className="mb-5">
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#12151A' }}>Loan Activity Timeline</h3>
            <div style={{ fontSize: '13px', color: '#9EA8B3', marginTop: '3px' }}>Loan activity</div>
          </div>
          {farmerTimeline.map((item, i) => (
            <button key={`${item.date}-${item.action}`} onClick={() => item.doc && setActiveTab('documents')} className="w-full flex gap-4 pb-5 text-left">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: i < 5 ? '#DCFCE7' : '#DBEAFE', color: i < 5 ? '#166534' : '#1E40AF' }}>
                {i < 5 ? <FileCheck size={15} /> : <Banknote size={15} />}
              </div>
              <div className="flex-1 rounded-xl border border-[#EDEEF0] p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="px-2 py-1 rounded-full" style={{ backgroundColor: '#E8F5E9', color: '#1A3C2A', fontSize: '11px', fontWeight: 700 }}>{item.role}</span>
                  <span style={{ fontSize: '12px', color: '#9EA8B3', fontFamily: 'Roboto Mono' }}>{item.date}</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#12151A', marginTop: '8px' }}>{item.action}</div>
                <div style={{ fontSize: '13px', color: '#3D4450', marginTop: '4px', lineHeight: '20px' }}>{item.detail}</div>
                {item.doc && <span className="mt-3 flex items-center gap-1.5" style={{ fontSize: '12px', color: '#1E88E5', fontWeight: 700 }}><Download size={12} /> {item.doc}</span>}
              </div>
            </button>
          ))}
        </div>
      )}

      {showPaymentModal && (
        <AppModal title="Confirm Payment" subtitle={`${formatCurrency(2000)} · Direct Transfer · ${farmerLoan.id}`} icon={<CreditCard size={18} />} onClose={() => setShowPaymentModal(false)} footer={<><button onClick={() => setShowPaymentModal(false)} className="px-4 py-2.5 rounded-xl border border-[#EDEEF0]" style={{ fontSize: '14px' }}>Cancel</button><button onClick={() => { setShowPaymentModal(false); onNavigate('farmer-repayment'); }} className="px-4 py-2.5 rounded-xl font-semibold" style={{ backgroundColor: '#1A3C2A', color: 'white', fontSize: '14px' }}>Continue</button></>}>
          <div style={{ fontSize: '13px', color: '#3D4450', lineHeight: '20px' }}>This opens the full Make Payment flow. SFPCL will verify and confirm payment before posting it to your loan ledger.</div>
        </AppModal>
      )}

      {documentResultModal}
      {uploadDocumentModal}
    </Shell>
  );
}
