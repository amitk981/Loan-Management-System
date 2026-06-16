import { useEffect, useState } from 'react';
import { Check, Upload, FileText, Eye, Download, AlertTriangle } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from '../shared/StatusBadge';
import { WorkbenchTabs } from '../shared/WorkbenchTabs';
import { complianceDocTabs, complianceQueueTabs } from '../../data/roleNav';
import { mockLoans, mockDocuments } from '../../data/mockData';
import { csWorkspaceLoan } from '../../data/complianceData';

interface DocumentWorkspaceProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

type DocTab = 'poa' | 'triparty' | 'sh4' | 'termsheet' | 'agreement' | 'bank' | 'checklist';

const docTabs: { id: DocTab; label: string; shortLabel: string }[] = [
  { id: 'poa', label: 'Power of Attorney', shortLabel: 'PoA' },
  { id: 'triparty', label: 'Tri-Party Agreement', shortLabel: 'Tri-Party' },
  { id: 'sh4', label: 'SH-4 / CDSL Pledge', shortLabel: 'SH-4' },
  { id: 'termsheet', label: 'Term Sheet', shortLabel: 'Term Sheet' },
  { id: 'agreement', label: 'Loan Agreement', shortLabel: 'Loan Agr.' },
  { id: 'bank', label: 'Bank Verification', shortLabel: 'Bank' },
  { id: 'checklist', label: 'Checklist (Annexure H)', shortLabel: 'Checklist' },
];

const checklistItems = [
  'Loan Application Form (signed by applicant + nominee)',
  'KYC — Applicant (PAN, Aadhaar, Photo)',
  'KYC — Nominee',
  'KYC — Witness (PAN, Aadhaar + must be SFPCL shareholder)',
  'Share Certificates / CDSL D-MAT Statement',
  'Land Documents (7/12 Extract)',
  'Crop Plan',
  'Bank Statement (6 months)',
  'Cancelled Cheque',
  'Blank-dated Cheque (security, custody noted)',
  'Power of Attorney (stamped, notarised)',
  'Tri-Party Agreement',
  'SH-4 Form OR CDSL Pledge Confirmation',
  'Term Sheet (signed)',
  'Loan Agreement (stamped, notarised, witnessed)',
];

const signatureBlocks = [
  { role: 'Company Secretary', note: 'All documents verified & attached', color: 'var(--brand-primary)' },
  { role: 'Credit Manager', note: 'Loan limits reviewed & confirmed', color: 'var(--brand-secondary)' },
  { role: 'Sanction Committee Member', note: 'Final approval as per authority matrix', color: 'var(--accent-sanction)' },
  { role: 'Senior Manager – Finance', note: 'Loan disbursed to applicant\'s account', color: 'var(--accent-treasury)' },
];

export function DocumentWorkspace({ onNavigate, activePage }: DocumentWorkspaceProps) {
  const loan = {
    ...mockLoans[0],
    id: csWorkspaceLoan.id,
    farmerName: csWorkspaceLoan.borrower,
    folioNo: csWorkspaceLoan.folio,
    shares: csWorkspaceLoan.shares,
    sanctionedAmount: csWorkspaceLoan.amount,
    purpose: 'Drip irrigation setup',
    tenure: 'Short-term (12 months)',
  };
  const routeTabMap: Record<string, DocTab> = {
    'cs-workspace': 'poa',
    'cs-queue': 'checklist',
    'cs-poa': 'poa',
    'cs-triparty': 'triparty',
    'cs-sh4': 'sh4',
    'cs-termsheet': 'termsheet',
    'cs-agreement': 'agreement',
    'cs-awaiting-prep': 'checklist',
    'cs-awaiting-review': 'bank',
    'cs-signoff': 'checklist',
  };
  const [activeTab, setActiveTab] = useState<DocTab>(routeTabMap[activePage] || 'checklist');
  const [checkedDocs, setCheckedDocs] = useState<boolean[]>(
    checklistItems.map((_, i) => mockDocuments[i]?.status === 'Verified' || mockDocuments[i]?.status === 'Ready')
  );
  const [signatures, setSignatures] = useState({ cs: false, cm: false, sc: false, finance: false });
  const [poaStatus, setPoaStatus] = useState('Pending');
  const [termSheetSigned, setTermSheetSigned] = useState(false);
  const [poaStamped, setPoaStamped] = useState(false);
  const [poaNotarised, setPoaNotarised] = useState(false);
  const [agreementStamped, setAgreementStamped] = useState(false);
  const [agreementNotarised, setAgreementNotarised] = useState(false);
  const [shareType, setShareType] = useState<'physical' | 'demat'>('physical');
  const [bankSignatureMismatch, setBankSignatureMismatch] = useState(true);
  const [bankLetterReady, setBankLetterReady] = useState(false);
  const [witnessConfirmed, setWitnessConfirmed] = useState(false);
  const [termSheetSignatures, setTermSheetSignatures] = useState({ cfo: false, director1: false, director2: false });

  const allDocsChecked = checkedDocs.every(Boolean);
  const legalDocsExecuted = poaStamped && poaNotarised && agreementStamped && agreementNotarised;
  const allSignaturesDone = Object.values(signatures).every(Boolean);
  const termSheetAuthorityComplete = loan.sanctionedAmount > 500000
    ? termSheetSignatures.cfo && termSheetSignatures.director1 && termSheetSignatures.director2
    : termSheetSignatures.cfo && termSheetSignatures.director1;
  const securityReady = shareType === 'physical' || shareType === 'demat';
  const bankGateReady = !bankSignatureMismatch || bankLetterReady;
  const canSubmit = allDocsChecked && legalDocsExecuted && allSignaturesDone && termSheetAuthorityComplete && witnessConfirmed && securityReady && bankGateReady;

  const toggleDoc = (i: number) => {
    const updated = [...checkedDocs];
    updated[i] = !updated[i];
    setCheckedDocs(updated);
  };

  const checkedCount = checkedDocs.filter(Boolean).length;

  useEffect(() => {
    setActiveTab(routeTabMap[activePage] || 'checklist');
  }, [activePage]);

  const workspaceCopy: Record<string, { title: string; subtitle: string }> = {
    'cs-workspace': { title: 'Document Workspace', subtitle: 'Tabbed legal file hub for approved loan documentation' },
    'cs-queue': { title: 'Pending Document Queue', subtitle: 'Document checklist, execution and custody actions pending CS attention' },
    'cs-awaiting-prep': { title: 'Awaiting Preparation', subtitle: 'Start document assembly and complete Annexure H evidence' },
    'cs-awaiting-review': { title: 'Awaiting Review', subtitle: 'Resolve bank verification and execution exceptions before sign-off' },
    'cs-signoff': { title: 'Awaiting CS Sign-off', subtitle: 'Final checklist and countersignature gate before Treasury release' },
    'cs-poa': { title: 'PoA Generator', subtitle: 'Prepare, stamp, notarise, and upload Power of Attorney' },
    'cs-triparty': { title: 'Tri-Party Agreement', subtitle: 'Subsidiary deduction consent and repayment routing agreement' },
    'cs-sh4': { title: 'SH-4 / CDSL Forms', subtitle: 'Physical SH-4 custody or D-MAT pledge lifecycle tracking' },
    'cs-termsheet': { title: 'Term Sheet', subtitle: 'CFO and Director signature authority gate' },
    'cs-agreement': { title: 'Loan Agreement', subtitle: 'Stamped, notarised, and witnessed agreement execution' },
  };
  const workspace = workspaceCopy[activePage] || { title: `Document Workspace — ${loan.id}`, subtitle: `${loan.farmerName} · Stage 4: Documentation in Progress` };
  const showQueueTabs = complianceQueueTabs.some(tab => tab.key === activePage);
  const showDocTabs = complianceDocTabs.some(tab => tab.key === activePage);

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Compliance', activePage.startsWith('cs-awaiting') || activePage === 'cs-signoff' ? 'Document Queue' : 'Document Templates', workspace.title]}
      pageTitle={workspace.title}
      pageSubtitle={`${loan.id} · ${loan.farmerName} · ₹${csWorkspaceLoan.amount.toLocaleString('en-IN')}`}
      actions={
        <div className="flex items-center gap-3">
          <span style={{ fontSize: '13px', color: 'var(--neutral-400)' }}>5/8 core instruments done</span>
          <div className="w-32 h-2 bg-[#EDEEF0] rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: '62.5%', backgroundColor: 'var(--brand-secondary)' }} />
          </div>
        </div>
      }
    >
      {showQueueTabs && <WorkbenchTabs tabs={complianceQueueTabs} activeKey={activePage} onChange={onNavigate} accent="var(--brand-primary)" />}
      {showDocTabs && <WorkbenchTabs tabs={complianceDocTabs} activeKey={activePage} onChange={onNavigate} accent="var(--brand-primary)" />}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Documents', value: `${checkedCount}/15`, ready: allDocsChecked, note: allDocsChecked ? 'All file items present' : `${15 - checkedCount} pending` },
          { label: 'PoA Execution', value: poaStamped && poaNotarised ? 'Ready' : 'Blocked', ready: poaStamped && poaNotarised, note: '₹500 stamp + notary' },
          { label: 'Loan Agreement', value: agreementStamped && agreementNotarised ? 'Ready' : 'Blocked', ready: agreementStamped && agreementNotarised, note: '₹500 stamp + notary' },
          { label: 'Signatures', value: `${Object.values(signatures).filter(Boolean).length}/4`, ready: allSignaturesDone, note: 'CS → Credit → Sanction → Finance' },
        ].map(item => (
          <button key={item.label} onClick={() => setActiveTab(item.label === 'Documents' || item.label === 'Signatures' ? 'checklist' : item.label === 'PoA Execution' ? 'poa' : 'agreement')} className="rounded-xl p-4 border text-left clickable-card" style={{ backgroundColor: item.ready ? 'var(--success-50)' : '#FFFBEB', borderColor: item.ready ? 'var(--success-200)' : 'var(--warning-200)' }}>
            <div style={{ fontSize: '11px', color: item.ready ? '#16A34A' : '#B45309', fontWeight: 700, textTransform: 'uppercase' }}>{item.label}</div>
            <div style={{ fontSize: '20px', color: item.ready ? 'var(--success-700)' : 'var(--warning-700)', fontWeight: 700, marginTop: '4px' }}>{item.value}</div>
            <div style={{ fontSize: '12px', color: item.ready ? 'var(--success-500)' : '#B45309', marginTop: '2px' }}>{item.note}</div>
          </button>
        ))}
      </div>

      <div className="rounded-xl p-4 mb-5 border border-[#EDEEF0]" style={{ backgroundColor: 'var(--success-50)' }}>
        <div style={{ fontSize: '13px', color: 'var(--success-700)', fontWeight: 700 }}>
          Start here: PoA → Tri-Party → SH-4/CDSL → Term Sheet → Loan Agreement → Bank Verification → Checklist
        </div>
        <div style={{ fontSize: '12px', color: 'var(--neutral-700)', marginTop: '6px' }}>
          Work through each tab below. Treasury cannot disburse until checklist and CS sign-off are complete.
        </div>
      </div>

      {/* Document Progress Tracker */}
      <div className="bg-white rounded-2xl p-4 mb-5 border border-[#EDEEF0]">
        <div className="flex items-center gap-2 overflow-x-auto">
          {docTabs.map((tab, i) => {
            const statusMap: Record<DocTab, string> = {
              poa: poaStamped && poaNotarised ? 'Ready' : 'Pending',
              triparty: 'Ready',
              sh4: shareType === 'physical' ? 'SH-4' : 'CDSL',
              termsheet: termSheetAuthorityComplete ? 'Ready' : 'Pending',
              agreement: agreementStamped && agreementNotarised && witnessConfirmed ? 'Ready' : 'Pending',
              bank: bankGateReady ? 'Ready' : 'Pending',
              checklist: 'In Progress',
            };
            const s = statusMap[tab.id];
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'agreement' && !termSheetAuthorityComplete) return;
                  setActiveTab(tab.id);
                }}
                className="flex flex-col items-center flex-shrink-0 px-3 py-2 rounded-xl transition-all"
                style={{
                  backgroundColor: activeTab === tab.id ? 'var(--brand-primary)' : 'var(--neutral-100)',
                  border: activeTab === tab.id ? 'none' : '1px solid #EDEEF0',
                  opacity: tab.id === 'agreement' && !termSheetAuthorityComplete ? 0.5 : 1,
                  cursor: tab.id === 'agreement' && !termSheetAuthorityComplete ? 'not-allowed' : 'pointer'
                }}
                title={tab.id === 'agreement' && !termSheetAuthorityComplete ? 'Locked until Term Sheet authority signatures are complete' : ''}
              >
                <span style={{ fontSize: '12px', fontWeight: activeTab === tab.id ? 500 : 400, color: activeTab === tab.id ? 'white' : 'var(--neutral-700)' }}>
                  {tab.shortLabel}
                </span>
                <span
                  className="mt-1"
                  style={{
                    fontSize: '10px',
                    color: s === 'Ready' ? 'var(--success-500)' : s === 'Pending' ? 'var(--warning-500)' : activeTab === tab.id ? 'rgba(255,255,255,0.6)' : 'var(--neutral-400)',
                    fontWeight: 500,
                  }}
                >
                  {s}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-5">
        {/* Main Content */}
        <div className="flex-1">
          {/* PoA Tab */}
          {activeTab === 'poa' && (
            <div className="bg-white rounded-2xl p-5 border border-[#EDEEF0]">
              <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--neutral-900)', marginBottom: '16px' }}>Power of Attorney</h3>
              <div className="grid grid-cols-2 gap-4 mb-5">
                {[
                  { label: 'Borrower Name', value: loan.farmerName, readonly: true },
                  { label: 'Folio Number', value: loan.folioNo, readonly: true },
                  { label: 'Date of Execution', value: '', readonly: false },
                  { label: 'Notary Name', value: '', readonly: false },
                ].map((field, i) => (
                  <div key={i}>
                    <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-700)' }}>{field.label}</label>
                    <input
                      type="text"
                      defaultValue={field.value}
                      readOnly={field.readonly}
                      className="w-full px-4 rounded-xl border focus:outline-none"
                      style={{
                        height: '40px',
                        fontSize: '14px',
                        borderColor: field.readonly ? 'var(--neutral-200)' : 'var(--neutral-300)',
                        backgroundColor: field.readonly ? 'var(--neutral-100)' : 'white',
                        color: field.readonly ? 'var(--neutral-400)' : 'var(--neutral-900)',
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl mb-4 flex items-center gap-2" style={{ backgroundColor: 'var(--warning-100)' }}>
                <AlertTriangle size={15} color="var(--warning-700)" />
                <span style={{ fontSize: '13px', color: 'var(--warning-700)' }}>₹500 stamp paper required for PoA execution</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: 'Stamp duty paid', checked: poaStamped, onChange: setPoaStamped },
                  { label: 'Notarised copy received', checked: poaNotarised, onChange: setPoaNotarised },
                ].map(item => (
                  <label key={item.label} className="flex items-center justify-between p-3 rounded-xl border cursor-pointer" style={{ borderColor: item.checked ? 'var(--success-200)' : 'var(--neutral-200)', backgroundColor: item.checked ? 'var(--success-50)' : '#FFFFFF' }}>
                    <span style={{ fontSize: '13px', color: 'var(--neutral-700)' }}>{item.label}</span>
                    <input type="checkbox" checked={item.checked} onChange={e => item.onChange(e.target.checked)} style={{ accentColor: 'var(--brand-primary)' }} />
                  </label>
                ))}
              </div>
              <div className="mb-4">
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-700)' }}>Upload Stamped PoA Copy</label>
                <div className="border-2 border-dashed rounded-xl p-4 flex items-center gap-2 cursor-pointer hover:border-[#2D7A4F] hover:bg-[#F0FDF4] transition-all" style={{ borderColor: 'var(--neutral-300)' }}>
                  <Upload size={18} style={{ color: 'var(--neutral-400)' }} />
                  <span style={{ fontSize: '13px', color: 'var(--neutral-700)' }}>Drag or click to upload stamped copy</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  className="px-4 py-2.5 rounded-xl flex items-center gap-2"
                  style={{ backgroundColor: 'var(--neutral-100)', color: 'var(--neutral-700)', fontSize: '14px', border: '1px solid #EDEEF0' }}
                >
                  <Eye size={14} /> Generate Draft PDF
                </button>
                <button
                  onClick={() => { setPoaStatus('Executed'); setPoaStamped(true); setPoaNotarised(true); }}
                  className="px-4 py-2.5 rounded-xl font-medium flex items-center gap-2"
                  style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}
                >
                  <Check size={14} /> Mark as Executed
                </button>
              </div>
            </div>
          )}

          {/* Term Sheet Tab */}
          {activeTab === 'termsheet' && (
            <div className="bg-white rounded-2xl p-5 border border-[#EDEEF0]">
              <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--neutral-900)', marginBottom: '16px' }}>Term Sheet</h3>
              <div className="grid grid-cols-2 gap-4">
                  {[
                  { label: '1. Borrower Name', value: loan.farmerName, readonly: true },
                  { label: '2. Nominee Name', value: 'Sanjay Patil', readonly: false },
                  { label: '3. Shares Held', value: `${loan.shares} shares · Physical`, readonly: true },
                  { label: '4. Facility Type', value: loan.tenure, readonly: true },
                  { label: '5. Loan Amount', value: `₹${loan.sanctionedAmount.toLocaleString('en-IN')}`, readonly: true },
                  { label: '6. Purpose', value: loan.purpose, readonly: true },
                  { label: '7. Rate of Interest', value: `${loan.interestRate}% p.a. (Floating)`, readonly: false },
                  { label: '8. Tenure', value: loan.tenure, readonly: false },
                  { label: '9. Repayment Date', value: '30 Jun 2025', readonly: false },
                  { label: '10. Penalty Interest', value: '2% over applicable rate', readonly: false },
                  { label: '11. Other Charges', value: 'Stamping / notary at actuals', readonly: false },
                  { label: '12. Security', value: 'SFPCL shares + blank cheque', readonly: false },
                  { label: '13. Dispute Resolution', value: 'Arbitration · Nashik Jurisdiction', readonly: false },
                ].map((field, i) => (
                  <div key={i}>
                    <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: 500, color: 'var(--neutral-700)' }}>{field.label}</label>
                    <input
                      defaultValue={field.value}
                      readOnly={field.readonly}
                      className="w-full px-3 rounded-xl border focus:outline-none"
                      style={{
                        height: '40px',
                        fontSize: '13px',
                        borderColor: field.readonly ? 'var(--neutral-200)' : 'var(--neutral-300)',
                        backgroundColor: field.readonly ? 'var(--neutral-100)' : 'white',
                        color: field.readonly ? 'var(--neutral-400)' : 'var(--neutral-900)',
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-xl" style={{ backgroundColor: 'var(--info-100)' }}>
                <span style={{ fontSize: '12px', color: 'var(--info-900)' }}>Term Sheet authority gate: {loan.sanctionedAmount > 500000 ? 'CFO + exactly 2 Directors required' : 'CFO + 1 Director required'}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { key: 'cfo' as const, label: 'CFO Signature', required: true },
                  { key: 'director1' as const, label: 'Director 1 Signature', required: true },
                  { key: 'director2' as const, label: 'Director 2 Signature', required: loan.sanctionedAmount > 500000 },
                ].map(item => (
                  <label key={item.key} className="p-3 rounded-xl border cursor-pointer" style={{ backgroundColor: termSheetSignatures[item.key] ? 'var(--success-50)' : item.required ? '#FFFBEB' : 'var(--neutral-100)', borderColor: termSheetSignatures[item.key] ? 'var(--success-200)' : 'var(--neutral-200)' }}>
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: '12px', color: 'var(--neutral-700)', fontWeight: 500 }}>{item.label}</span>
                      <input
                        type="checkbox"
                        checked={termSheetSignatures[item.key]}
                        disabled={!item.required}
                        onChange={e => setTermSheetSignatures(prev => ({ ...prev, [item.key]: e.target.checked }))}
                        style={{ accentColor: 'var(--brand-primary)' }}
                      />
                    </div>
                    <div style={{ fontSize: '11px', color: item.required ? 'var(--gold-500)' : 'var(--neutral-400)', marginTop: '4px' }}>{item.required ? 'Required' : 'Not required for this amount'}</div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button className="px-4 py-2.5 rounded-xl flex items-center gap-2" style={{ backgroundColor: 'var(--neutral-100)', color: 'var(--neutral-700)', fontSize: '14px', border: '1px solid #EDEEF0' }}>
                  <FileText size={14} /> Generate Term Sheet PDF
                </button>
                <button onClick={() => setTermSheetSigned(true)} className="px-4 py-2.5 rounded-xl font-medium" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}>
                  {termSheetSigned ? '✓ Signed' : 'Mark as Signed'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'triparty' && (
            <div className="bg-white rounded-2xl p-5 border border-[#EDEEF0]">
              <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--neutral-900)', marginBottom: '16px' }}>Tri-Party Agreement</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                  { label: 'Borrower', value: loan.farmerName },
                  { label: 'Subsidiary', value: 'Sahyadri Post Harvest Care Ltd.' },
                  { label: 'Recovery Route', value: 'Subsidiary deduction consent' },
                  { label: 'Loan Ref', value: loan.id },
                  { label: 'Sanction Amount', value: `₹${loan.sanctionedAmount.toLocaleString('en-IN')}` },
                  { label: 'Execution Status', value: 'Ready for signatures' },
                ].map(field => (
                  <div key={field.label}>
                    <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: 500, color: 'var(--neutral-700)' }}>{field.label}</label>
                    <input defaultValue={field.value} className="w-full px-3 rounded-xl border border-[#D1D5DB]" style={{ height: '40px', fontSize: '13px', color: 'var(--neutral-900)' }} />
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl mb-4" style={{ backgroundColor: 'var(--success-50)', border: '1px solid #BBF7D0' }}>
                <div style={{ fontSize: '13px', color: 'var(--success-700)', fontWeight: 700 }}>Deduction consent captured for subsidiary-mediated repayments.</div>
              </div>
              <button className="px-4 py-2.5 rounded-xl font-medium flex items-center gap-2" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}>
                <FileText size={14} /> Generate Tri-Party PDF
              </button>
            </div>
          )}

          {activeTab === 'sh4' && (
            <div className="bg-white rounded-2xl p-5 border border-[#EDEEF0]">
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--neutral-900)' }}>Share Security</h3>
                <div className="flex rounded-xl border border-[#EDEEF0] overflow-hidden">
                  {(['physical', 'demat'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setShareType(type)}
                      className="px-4 py-2"
                      style={{ backgroundColor: shareType === type ? 'var(--brand-primary)' : 'white', color: shareType === type ? 'white' : 'var(--neutral-700)', fontSize: '13px', fontWeight: 500 }}
                    >
                      {type === 'physical' ? 'Physical SH-4' : 'D-MAT CDSL'}
                    </button>
                  ))}
                </div>
              </div>

              {shareType === 'physical' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      ['Share Certificate Nos.', 'SC-04821-A to SC-04821-D'],
                      ['SH-4 Custody Receipt', 'SH4-CUST-04821'],
                      ['Witness Name', 'Ajay Pawar'],
                      ['Witness Folio', 'SH-01942'],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: 500, color: 'var(--neutral-700)' }}>{label}</label>
                        <input defaultValue={value} className="w-full px-3 rounded-xl border border-[#D1D5DB]" style={{ height: '40px', fontSize: '13px', color: 'var(--neutral-900)' }} />
                      </div>
                    ))}
                  </div>
                  <label className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: witnessConfirmed ? 'var(--success-200)' : 'var(--warning-200)', backgroundColor: witnessConfirmed ? 'var(--success-50)' : '#FFFBEB' }}>
                    <span style={{ fontSize: '13px', color: 'var(--neutral-700)', fontWeight: 500 }}>Witness is an existing SFPCL shareholder and has signed SH-4</span>
                    <input type="checkbox" checked={witnessConfirmed} onChange={e => setWitnessConfirmed(e.target.checked)} style={{ accentColor: 'var(--brand-primary)' }} />
                  </label>
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    ['1. PRF submitted to DP', 'Done', 'var(--success-500)'],
                    ['2. PSN generated', 'PSN-2025-04821', 'var(--brand-accent)'],
                    ['3. Pledgee DP acceptance', 'Pending', 'var(--warning-500)'],
                    ['4. IRF invocation form', 'Locked until default + board approval', 'var(--neutral-400)'],
                    ['5. URF / auto-unpledge release', 'Locked until NOC', 'var(--neutral-400)'],
                  ].map(([step, status, color]) => (
                    <div key={step} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: 'var(--neutral-100)', border: '1px solid #EDEEF0' }}>
                      <span style={{ fontSize: '13px', color: 'var(--neutral-700)', fontWeight: 500 }}>{step}</span>
                      <span style={{ fontSize: '12px', color, fontWeight: 700 }}>{status}</span>
                    </div>
                  ))}
                  <button className="px-4 py-2.5 rounded-xl font-medium" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}>Confirm CDSL Pledge Acceptance</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bank' && (
            <div className="bg-white rounded-2xl p-5 border border-[#EDEEF0]">
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--neutral-900)' }}>Bank Verification Letter</h3>
                <StatusBadge status={bankSignatureMismatch ? 'Pending' : 'Verified'} />
              </div>
              <label className="flex items-center justify-between p-3 rounded-xl border mb-4" style={{ backgroundColor: bankSignatureMismatch ? '#FFFBEB' : 'var(--success-50)', borderColor: bankSignatureMismatch ? 'var(--warning-200)' : 'var(--success-200)' }}>
                <span style={{ fontSize: '13px', color: 'var(--neutral-700)', fontWeight: 500 }}>Signature mismatch raised on cancelled cheque</span>
                <input type="checkbox" checked={bankSignatureMismatch} onChange={e => setBankSignatureMismatch(e.target.checked)} style={{ accentColor: 'var(--brand-primary)' }} />
              </label>
              {bankSignatureMismatch ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      ['Bank Branch', `${loan.bank} · Nashik`],
                      ['Account Number', loan.bankAccount],
                      ['IFSC', loan.ifsc],
                      ['Officer Name', 'Branch Operations Manager'],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: 500, color: 'var(--neutral-700)' }}>{label}</label>
                        <input defaultValue={value} className="w-full px-3 rounded-xl border border-[#D1D5DB]" style={{ height: '40px', fontSize: '13px', color: 'var(--neutral-900)' }} />
                      </div>
                    ))}
                  </div>
                  <label className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: bankLetterReady ? 'var(--success-200)' : 'var(--neutral-200)', backgroundColor: bankLetterReady ? 'var(--success-50)' : 'white' }}>
                    <span style={{ fontSize: '13px', color: 'var(--neutral-700)' }}>Stamped bank letter received and uploaded</span>
                    <input type="checkbox" checked={bankLetterReady} onChange={e => setBankLetterReady(e.target.checked)} style={{ accentColor: 'var(--brand-primary)' }} />
                  </label>
                </div>
              ) : (
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--success-50)', border: '1px solid #BBF7D0', color: 'var(--success-700)', fontSize: '13px', fontWeight: 700 }}>
                  Bank verification letter is not required because no signature mismatch is flagged.
                </div>
              )}
            </div>
          )}

          {/* Checklist Tab */}
          {activeTab === 'checklist' && (
            <div className="bg-white rounded-2xl border border-[#EDEEF0] overflow-hidden">
              <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: 'var(--neutral-100)', borderBottom: '1px solid #EDEEF0' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'var(--neutral-900)' }}>Document Checklist (Annexure H)</h3>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '13px', color: 'var(--neutral-400)' }}>{checkedCount} / {checklistItems.length} verified</span>
                  <div className="w-24 h-2 bg-[#EDEEF0] rounded-full">
                    <div className="h-full rounded-full" style={{ width: `${(checkedCount / 15) * 100}%`, backgroundColor: 'var(--success-500)' }} />
                  </div>
                </div>
              </div>

              <div className="divide-y divide-[#EDEEF0]">
                {checklistItems.map((item, i) => {
                  const doc = mockDocuments[i];
                  return (
                    <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-[#F7F8FA] transition-colors">
                      <input
                        type="checkbox"
                        checked={checkedDocs[i] || false}
                        onChange={() => toggleDoc(i)}
                        className="w-4 h-4 rounded flex-shrink-0"
                        style={{ accentColor: 'var(--brand-primary)' }}
                      />
                      <div className="flex-1 min-w-0">
                        <div style={{ fontSize: '13px', color: 'var(--neutral-700)' }}>
                          <span style={{ color: 'var(--neutral-400)', fontFamily: 'Roboto Mono', marginRight: '6px' }}>
                            {String(i + 1).padStart(2, '0')}.
                          </span>
                          {item}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {doc && <StatusBadge status={doc.status} />}
                        {doc?.date && <span style={{ fontSize: '11px', color: 'var(--neutral-400)' }}>{doc.date}</span>}
                        <button className="p-1.5 hover:bg-[#EDEEF0] rounded-lg transition-all">
                          <Upload size={12} style={{ color: 'var(--neutral-400)' }} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Signature Blocks */}
              <div className="px-5 py-5 border-t-2 border-[#EDEEF0]" style={{ backgroundColor: 'var(--neutral-100)' }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--neutral-900)' }}>Required Signatures</h4>
                  <span style={{ fontSize: '12px', color: 'var(--neutral-400)' }}>Sequential countersignature flow</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {signatureBlocks.map((block, i) => {
                    const sigKey = ['cs', 'cm', 'sc', 'finance'][i] as keyof typeof signatures;
                    const isSigned = signatures[sigKey];
                    const priorSigned = i === 0 || signatures[['cs', 'cm', 'sc', 'finance'][i - 1] as keyof typeof signatures];
                    return (
                      <div
                        key={i}
                        className="p-4 rounded-xl border-2 transition-all"
                        style={{
                          borderColor: isSigned ? block.color : 'var(--neutral-200)',
                          backgroundColor: isSigned ? `${block.color}08` : 'white',
                        }}
                      >
                        <div style={{ fontSize: '12px', fontWeight: 500, color: block.color }}>{block.role}</div>
                        <div style={{ fontSize: '11px', color: 'var(--neutral-400)', marginTop: '2px' }}>{block.note}</div>
                        <div className="flex items-center justify-between mt-3">
                          {isSigned ? (
                            <span className="flex items-center gap-1.5" style={{ fontSize: '12px', color: 'var(--success-500)', fontWeight: 500 }}>
                              <Check size={12} /> Signed {new Date().toLocaleDateString('en-IN')}
                            </span>
                          ) : (
                            <span style={{ fontSize: '12px', color: 'var(--neutral-400)' }}>Not yet signed</span>
                          )}
                          {!isSigned && (
                            <button
                              disabled={!priorSigned || (i === 0 && (!allDocsChecked || !legalDocsExecuted))}
                              onClick={() => setSignatures(prev => ({ ...prev, [sigKey]: true }))}
                              className="px-3 py-1 rounded-lg text-white"
                              style={{ backgroundColor: priorSigned && (i > 0 || (allDocsChecked && legalDocsExecuted)) ? block.color : 'var(--neutral-400)', fontSize: '11px', fontWeight: 500, cursor: priorSigned && (i > 0 || (allDocsChecked && legalDocsExecuted)) ? 'pointer' : 'not-allowed' }}
                            >
                              Sign Off
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="px-5 pb-5">
                {!canSubmit && (
                  <div className="mb-3 p-3 rounded-xl flex gap-2" style={{ backgroundColor: 'var(--warning-100)', border: '1px solid #FDE68A' }}>
                    <AlertTriangle size={14} style={{ color: 'var(--warning-500)', marginTop: '2px' }} />
                    <div style={{ fontSize: '12px', color: 'var(--warning-700)', lineHeight: '18px' }}>
                      Disbursement is blocked until every document is verified, PoA and Loan Agreement are stamped/notarised, Term Sheet authority signatures are complete, witness signatures are captured, bank verification is cleared, and all four checklist signatures are complete.
                    </div>
                  </div>
                )}
                {(() => {
                  const [isHolding, setIsHolding] = useState(false);
                  const [holdProgress, setHoldProgress] = useState(0);

                  useEffect(() => {
                    let interval: any;
                    if (isHolding && canSubmit) {
                      interval = setInterval(() => {
                        setHoldProgress(p => {
                          if (p >= 100) {
                            clearInterval(interval);
                            onNavigate('cs-queue');
                            return 100;
                          }
                          return p + 5; // 2 seconds to 100
                        });
                      }, 100);
                    } else {
                      setHoldProgress(0);
                    }
                    return () => clearInterval(interval);
                  }, [isHolding, canSubmit]);

                  return (
                    <button
                      disabled={!canSubmit}
                      onMouseDown={() => setIsHolding(true)}
                      onMouseUp={() => setIsHolding(false)}
                      onMouseLeave={() => setIsHolding(false)}
                      className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all relative overflow-hidden"
                      style={{
                        backgroundColor: canSubmit ? 'var(--brand-primary)' : 'var(--neutral-400)',
                        color: 'white',
                        fontSize: '15px',
                        cursor: canSubmit ? 'pointer' : 'not-allowed',
                      }}
                    >
                      {/* Hold progress bar background */}
                      <div className="absolute top-0 left-0 h-full" style={{ width: `${holdProgress}%`, backgroundColor: 'rgba(255,255,255,0.2)', transition: 'width 0.1s linear' }} />
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {holdProgress > 0 && holdProgress < 100 ? 'Keep holding...' : 'Hold to Release Complete File to Treasury →'}
                      </span>
                    </button>
                  );
                })()}
                {!canSubmit && (
                  <p style={{ fontSize: '12px', color: 'var(--neutral-400)', textAlign: 'center', marginTop: '6px' }}>
                    {!allDocsChecked ? `${15 - checkedCount} documents still pending` : !legalDocsExecuted ? 'Stamping and notarisation still pending' : !termSheetAuthorityComplete ? 'Term Sheet CFO / Director signatures pending' : !witnessConfirmed ? 'Witness signature capture pending' : !bankGateReady ? 'Bank verification letter pending' : 'All four signatures required before treasury release'}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Loan Agreement Tab */}
          {activeTab === 'agreement' && (
            <div className="bg-white rounded-2xl p-5 border border-[#EDEEF0]">
              <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--neutral-900)', marginBottom: '16px' }}>Loan Agreement Execution</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                  { label: 'Borrower', value: loan.farmerName },
                  { label: 'Agreement Amount', value: `₹${loan.sanctionedAmount.toLocaleString('en-IN')}` },
                  { label: 'Witness Shareholder ID', value: 'SH-01942' },
                  { label: 'Execution Date', value: '15 Jan 2025' },
                ].map(field => (
                  <div key={field.label}>
                    <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: 500, color: 'var(--neutral-700)' }}>{field.label}</label>
                    <input defaultValue={field.value} className="w-full px-3 rounded-xl border border-[#D1D5DB] focus:outline-none" style={{ height: '40px', fontSize: '13px', color: 'var(--neutral-900)' }} />
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl mb-4" style={{ backgroundColor: 'var(--warning-100)' }}>
                <div style={{ fontSize: '13px', color: 'var(--warning-700)', fontWeight: 500 }}>Hard gate: ₹500 stamp paper and notarisation are mandatory before checklist sign-off.</div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: '₹500 stamp certificate recorded', checked: agreementStamped, onChange: setAgreementStamped },
                  { label: 'Notarised agreement uploaded', checked: agreementNotarised, onChange: setAgreementNotarised },
                  { label: 'Witness signature captured and shareholder folio validated', checked: witnessConfirmed, onChange: setWitnessConfirmed },
                ].map(item => (
                  <label key={item.label} className="flex items-center justify-between p-3 rounded-xl border cursor-pointer" style={{ borderColor: item.checked ? 'var(--success-200)' : 'var(--neutral-200)', backgroundColor: item.checked ? 'var(--success-50)' : '#FFFFFF' }}>
                    <span style={{ fontSize: '13px', color: 'var(--neutral-700)' }}>{item.label}</span>
                    <input type="checkbox" checked={item.checked} onChange={e => item.onChange(e.target.checked)} style={{ accentColor: 'var(--brand-primary)' }} />
                  </label>
                ))}
              </div>
              <button
                onClick={() => { setAgreementStamped(true); setAgreementNotarised(true); }}
                className="px-4 py-2.5 rounded-xl font-medium flex items-center gap-2"
                style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}
              >
                <Check size={14} /> Mark Agreement Executed
              </button>
            </div>
          )}

          {/* Default placeholder for other tabs */}
          {!['poa', 'triparty', 'sh4', 'termsheet', 'agreement', 'bank', 'checklist'].includes(activeTab) && (
            <div className="bg-white rounded-2xl p-8 border border-[#EDEEF0] flex flex-col items-center justify-center">
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📄</div>
              <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--neutral-900)', marginBottom: '8px' }}>
                {docTabs.find(t => t.id === activeTab)?.label}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--neutral-400)' }}>Document preparation workspace · Click "Generate Draft PDF" to begin</p>
              <button className="mt-5 px-5 py-2.5 rounded-xl font-medium" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}>
                Generate Draft PDF
              </button>
            </div>
          )}
        </div>

        {/* Right Preview Panel */}
        <div className="w-[560px] flex-shrink-0">
          <div className="bg-white rounded-2xl border border-[#EDEEF0] p-5 sticky top-4">
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '12px' }}>Legal Document Preview</div>
            <div
              className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center"
              style={{ height: '300px', borderColor: 'var(--neutral-200)', backgroundColor: '#FDFAF4', fontFamily: 'Georgia, serif' }}
            >
              <FileText size={40} style={{ color: 'var(--neutral-200)' }} />
              <p style={{ fontSize: '13px', color: 'var(--neutral-400)', marginTop: '8px', textAlign: 'center' }}>
                Generate a PDF to preview it here
              </p>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5" style={{ backgroundColor: 'var(--neutral-100)', fontSize: '13px', color: 'var(--neutral-700)', border: '1px solid #EDEEF0' }}>
                <Eye size={13} /> Preview
              </button>
              <button className="flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '13px' }}>
                <Download size={13} /> Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
