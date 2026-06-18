import { useEffect, useState } from 'react';
import { Check, Upload, FileText, Eye, Download, AlertTriangle, CheckCircle2, Clock, User, ArrowRight, Lock, FileCheck, Pen, Stamp, Users, CircleDot, ShieldCheck, Package, ChevronRight } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from '../shared/StatusBadge';
import { GateBanner } from '../shared/GateBanner';
import { WorkbenchTabs } from '../shared/WorkbenchTabs';
import { complianceQueueTabs } from '../../data/roleNav';
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

type QueueStatus = 'awaiting-prep' | 'awaiting-review' | 'cs-signoff';

const queueLoans: { id: string; borrower: string; folio: string; amount: number; village: string; docsReady: number; docsTotal: number; queueStatus: QueueStatus; daysInQueue: number; priority: 'high' | 'medium' | 'low'; nextAction: string }[] = [
  { id: 'LO00000047', borrower: 'Ramesh Patil', folio: 'SH-04821', amount: 200000, village: 'Nashik', docsReady: 11, docsTotal: 15, queueStatus: 'awaiting-prep', daysInQueue: 3, priority: 'high', nextAction: 'Complete PoA stamping & notarisation' },
  { id: 'LO00000052', borrower: 'Anita Deshmukh', folio: 'SH-05102', amount: 350000, village: 'Pune', docsReady: 8, docsTotal: 15, queueStatus: 'awaiting-prep', daysInQueue: 1, priority: 'medium', nextAction: 'Upload KYC witness documents' },
  { id: 'LO00000055', borrower: 'Vikram Shinde', folio: 'SH-05230', amount: 150000, village: 'Satara', docsReady: 6, docsTotal: 15, queueStatus: 'awaiting-prep', daysInQueue: 5, priority: 'high', nextAction: 'Start Annexure H assembly' },
  { id: 'LO00000048', borrower: 'Sunita Jadhav', folio: 'SH-03412', amount: 100000, village: 'Pune', docsReady: 13, docsTotal: 15, queueStatus: 'awaiting-review', daysInQueue: 2, priority: 'medium', nextAction: 'Resolve bank signature mismatch' },
  { id: 'LO00000053', borrower: 'Manoj Kulkarni', folio: 'SH-04920', amount: 275000, village: 'Kolhapur', docsReady: 14, docsTotal: 15, queueStatus: 'awaiting-review', daysInQueue: 1, priority: 'low', nextAction: 'Verify SH-4 witness signature' },
  { id: 'LO00000049', borrower: 'Priya Gaikwad', folio: 'SH-05001', amount: 500000, village: 'Nashik', docsReady: 15, docsTotal: 15, queueStatus: 'cs-signoff', daysInQueue: 1, priority: 'high', nextAction: 'CS countersignature pending' },
  { id: 'LO00000054', borrower: 'Rahul Mane', folio: 'SH-05150', amount: 180000, village: 'Solapur', docsReady: 15, docsTotal: 15, queueStatus: 'cs-signoff', daysInQueue: 2, priority: 'medium', nextAction: 'Final checklist review' },
  { id: 'LO00000056', borrower: 'Kavita Bhosale', folio: 'SH-05310', amount: 420000, village: 'Sangli', docsReady: 15, docsTotal: 15, queueStatus: 'cs-signoff', daysInQueue: 0, priority: 'low', nextAction: 'CS countersignature pending' },
];

const queueStatusForPage: Record<string, QueueStatus | 'all'> = {
  'cs-queue': 'all',
  'cs-awaiting-prep': 'awaiting-prep',
  'cs-awaiting-review': 'awaiting-review',
  'cs-signoff': 'cs-signoff',
};

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
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [selectedQueueLoan, setSelectedQueueLoan] = useState<string | null>(null);

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
          return p + 5;
        });
      }, 100);
    } else {
      setHoldProgress(0);
    }
    return () => clearInterval(interval);
  }, [isHolding, canSubmit]);

  const workspaceCopy: Record<string, { title: string; subtitle: string }> = {
    'cs-workspace': { title: 'Document Workspace', subtitle: 'Tabbed legal file hub for approved loan documentation' },
    'cs-queue': { title: 'Pending Documents', subtitle: 'Document checklist, execution and custody actions pending CS attention' },
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

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Compliance', activePage.startsWith('cs-awaiting') || activePage === 'cs-signoff' || activePage === 'cs-queue' ? 'Pending Documents' : 'Document Templates', workspace.title]}
      pageTitle={workspace.title}
      pageSubtitle={showQueueTabs && !selectedQueueLoan ? workspace.subtitle : `${loan.id} · ${loan.farmerName} · ₹${csWorkspaceLoan.amount.toLocaleString('en-IN')}`}
      actions={
        (!showQueueTabs || selectedQueueLoan) ? (
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '13px', color: 'var(--neutral-400)' }}>5/8 core instruments done</span>
            <div className="w-32 h-2 bg-[var(--neutral-200)] rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: '62.5%', backgroundColor: 'var(--brand-secondary)' }} />
            </div>
          </div>
        ) : undefined
      }
    >
      {showQueueTabs && !selectedQueueLoan && <WorkbenchTabs tabs={complianceQueueTabs} activeKey={activePage} onChange={(p) => { setSelectedQueueLoan(null); onNavigate(p); }} accent="var(--brand-primary)" />}

      {/* Queue List View — shown when on queue tabs and no loan selected */}
      {showQueueTabs && !selectedQueueLoan && (() => {
        const filter = queueStatusForPage[activePage] || 'all';
        const filtered = filter === 'all' ? queueLoans : queueLoans.filter(l => l.queueStatus === filter);
        const counts = { prep: queueLoans.filter(l => l.queueStatus === 'awaiting-prep').length, review: queueLoans.filter(l => l.queueStatus === 'awaiting-review').length, signoff: queueLoans.filter(l => l.queueStatus === 'cs-signoff').length };
        const toneMap = { prep: { fg: 'var(--warning-600)', dot: 'var(--warning-500)' }, review: { fg: 'var(--info-600)', dot: 'var(--info-500)' }, signoff: { fg: 'var(--success-600)', dot: 'var(--success-500)' } };
        return (
          <>
            <div className="grid grid-cols-3 gap-4 mb-5">
              {[
                { label: 'Awaiting Prep', count: counts.prep, key: 'prep' as const, icon: Package, bg: 'var(--warning-50)', border: 'var(--warning-200)' },
                { label: 'Awaiting Review', count: counts.review, key: 'review' as const, icon: Eye, bg: 'var(--info-50)', border: 'var(--info-200)' },
                { label: 'CS Sign-off', count: counts.signoff, key: 'signoff' as const, icon: ShieldCheck, bg: 'var(--success-50)', border: 'var(--success-200)' },
              ].map(s => {
                const t = toneMap[s.key];
                const Icon = s.icon;
                return (
                  <div key={s.label} className="p-4 rounded-xl flex items-center gap-4" style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${t.dot}1A`, color: t.dot }}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--neutral-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                      <div style={{ fontSize: 26, color: t.fg, fontWeight: 700, fontFamily: 'Roboto Mono', lineHeight: '32px' }}>{s.count}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl border border-[var(--neutral-200)] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: 'var(--cream-50)', borderBottom: '2px solid var(--neutral-200)' }}>
                    {['Loan ID', 'Borrower', 'Amount', 'Docs', 'Days', 'Priority', 'Next Action', ''].map(h => (
                      <th key={h} className="text-left px-5 py-3.5" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--neutral-500)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(ql => {
                    const docPct = (ql.docsReady / ql.docsTotal) * 100;
                    const docColor = ql.docsReady === ql.docsTotal ? 'var(--success-500)' : docPct >= 80 ? 'var(--brand-secondary)' : 'var(--warning-500)';
                    return (
                    <tr key={ql.id} className="clickable-row group" onClick={() => setSelectedQueueLoan(ql.id)} style={{ cursor: 'pointer', borderBottom: '1px solid var(--neutral-200)' }}>
                      <td className="px-5 py-4" style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'Roboto Mono', color: 'var(--brand-primary)' }}>{ql.id}</td>
                      <td className="px-5 py-4">
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--neutral-900)' }}>{ql.borrower}</div>
                        <div style={{ fontSize: '11px', color: 'var(--neutral-400)', marginTop: '2px' }}>{ql.folio} · {ql.village}</div>
                      </td>
                      <td className="px-5 py-4" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--neutral-700)', fontFamily: 'Roboto Mono' }}>₹{ql.amount.toLocaleString('en-IN')}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-20 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--neutral-200)' }}>
                            <div className="h-full rounded-full transition-all" style={{ width: `${docPct}%`, backgroundColor: docColor }} />
                          </div>
                          <span style={{ fontSize: '12px', color: ql.docsReady === ql.docsTotal ? 'var(--success-600)' : 'var(--neutral-500)', fontWeight: 700, fontFamily: 'Roboto Mono' }}>{ql.docsReady}/{ql.docsTotal}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md" style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'Roboto Mono', backgroundColor: ql.daysInQueue >= 3 ? 'var(--error-50)' : 'var(--neutral-100)', color: ql.daysInQueue >= 3 ? 'var(--error-600)' : 'var(--neutral-500)' }}>
                          {ql.daysInQueue >= 3 && <Clock size={11} />}{ql.daysInQueue}d
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ fontSize: '11px', fontWeight: 700, backgroundColor: ql.priority === 'high' ? 'var(--error-50)' : ql.priority === 'medium' ? 'var(--warning-50)' : 'var(--neutral-100)', color: ql.priority === 'high' ? 'var(--error-600)' : ql.priority === 'medium' ? 'var(--warning-700)' : 'var(--neutral-500)', border: `1px solid ${ql.priority === 'high' ? 'var(--error-200)' : ql.priority === 'medium' ? 'var(--warning-200)' : 'var(--neutral-200)'}` }}>
                          <CircleDot size={9} />{ql.priority}
                        </span>
                      </td>
                      <td className="px-5 py-4" style={{ fontSize: '12px', color: 'var(--neutral-700)', fontWeight: 500 }}>{ql.nextAction}</td>
                      <td className="px-5 py-4"><ChevronRight size={16} style={{ color: 'var(--neutral-300)' }} className="transition-transform group-hover:translate-x-0.5" /></td>
                    </tr>
                  );})}
                </tbody>
              </table>
            </div>
          </>
        );
      })()}

      {/* Workspace View — shown when on doc tabs or a queue loan is selected */}
      {(!showQueueTabs || selectedQueueLoan) && (<>
      {selectedQueueLoan && (
        <button onClick={() => setSelectedQueueLoan(null)} className="mb-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ fontSize: '13px', color: 'var(--brand-primary)', backgroundColor: 'var(--brand-50)', border: '1px solid var(--brand-100)' }}>
          ← Back to queue
        </button>
      )}
      {activeTab === 'checklist' && (
        <>
          <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Documents', value: `${checkedCount}/15`, ready: allDocsChecked, note: allDocsChecked ? 'All file items present' : `${15 - checkedCount} pending`, icon: FileCheck, tab: 'checklist' as DocTab },
          { label: 'PoA Execution', value: poaStamped && poaNotarised ? 'Ready' : 'Blocked', ready: poaStamped && poaNotarised, note: '₹500 stamp + notary', icon: Stamp, tab: 'poa' as DocTab },
          { label: 'Loan Agreement', value: agreementStamped && agreementNotarised ? 'Ready' : 'Blocked', ready: agreementStamped && agreementNotarised, note: '₹500 stamp + notary', icon: Pen, tab: 'agreement' as DocTab },
          { label: 'Signatures', value: `${Object.values(signatures).filter(Boolean).length}/4`, ready: allSignaturesDone, note: 'CS → Credit → Sanction → Finance', icon: Users, tab: 'checklist' as DocTab },
        ].map(item => {
          const Icon = item.icon;
          return (
          <button key={item.label} onClick={() => setActiveTab(item.tab)} className="rounded-xl p-4 border-2 text-left clickable-card" style={{ backgroundColor: item.ready ? 'var(--success-50)' : 'white', borderColor: item.ready ? 'var(--success-200)' : 'var(--warning-200)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: item.ready ? 'var(--success-100)' : 'var(--warning-100)', color: item.ready ? 'var(--success-600)' : 'var(--warning-700)' }}>
                <Icon size={18} />
              </div>
              {item.ready && <CheckCircle2 size={18} style={{ color: 'var(--success-500)' }} />}
            </div>
            <div style={{ fontSize: '11px', color: item.ready ? 'var(--success-600)' : 'var(--warning-900)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
            <div style={{ fontSize: '22px', color: item.ready ? 'var(--success-700)' : 'var(--neutral-900)', fontWeight: 700, marginTop: '2px', fontFamily: 'Roboto Mono' }}>{item.value}</div>
            <div style={{ fontSize: '12px', color: item.ready ? 'var(--success-500)' : 'var(--neutral-500)', marginTop: '4px' }}>{item.note}</div>
          </button>
        );})}
      </div>

      <div className="rounded-xl p-4 mb-5 flex items-start gap-3" style={{ backgroundColor: 'var(--brand-light)', border: '1px solid var(--success-200)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: 'var(--success-100)', color: 'var(--brand-secondary)' }}>
          <ArrowRight size={16} />
        </div>
        <div>
          <div style={{ fontSize: '13px', color: 'var(--brand-primary)', fontWeight: 700 }}>
            Start here: PoA → Tri-Party → SH-4/CDSL → Term Sheet → Loan Agreement → Bank Verification → Checklist
          </div>
          <div style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '4px' }}>
            Work through each tab below. Treasury cannot disburse until checklist and CS sign-off are complete.
          </div>
        </div>
      </div>
      </>
      )}

      {/* Document Progress Tracker — Enhanced Stepper */}
      {(() => {
        const statusMap: Record<DocTab, string> = {
          poa: poaStamped && poaNotarised ? 'Ready' : 'Pending',
          triparty: 'Ready',
          sh4: shareType === 'physical' ? 'SH-4' : 'CDSL',
          termsheet: termSheetAuthorityComplete ? 'Ready' : 'Pending',
          agreement: agreementStamped && agreementNotarised && witnessConfirmed ? 'Ready' : 'Pending',
          bank: bankGateReady ? 'Ready' : 'Pending',
          checklist: 'In Progress',
        };
        const readyCount = docTabs.filter(t => ['Ready', 'SH-4', 'CDSL'].includes(statusMap[t.id])).length;
        const pct = Math.round((readyCount / docTabs.length) * 100);
        return (
        <div className="bg-white rounded-2xl p-5 mb-5 border border-[var(--neutral-200)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--neutral-900)' }}>Document stage progress</span>
              <span className="px-2.5 py-0.5 rounded-full" style={{ fontSize: '11px', fontWeight: 700, backgroundColor: pct === 100 ? 'var(--success-50)' : 'var(--brand-50)', color: pct === 100 ? 'var(--success-700)' : 'var(--brand-primary)' }}>{pct}% complete</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-500)' }}>{readyCount} of {docTabs.length} stages ready</span>
          </div>

          <div className="relative" style={{ padding: '0 12px' }}>
            {/* Connector line behind the nodes */}
            <div className="absolute" style={{ top: 20, left: 52, right: 52, height: 3, backgroundColor: 'var(--neutral-200)', borderRadius: 2, zIndex: 0 }} />
            <div className="absolute" style={{ top: 20, left: 52, height: 3, backgroundColor: 'var(--success-400)', borderRadius: 2, zIndex: 1, width: `${readyCount > 0 ? ((readyCount - 0.5) / (docTabs.length - 1)) * (100 - (104 / (docTabs.length * 14))) : 0}%`, transition: 'width 0.4s ease' }} />

            <div className="flex justify-between relative" style={{ zIndex: 2 }}>
              {docTabs.map((tab, i) => {
                const s = statusMap[tab.id];
                const ready = ['Ready', 'SH-4', 'CDSL'].includes(s);
                const inProgress = s === 'In Progress';
                const locked = tab.id === 'agreement' && !termSheetAuthorityComplete;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { if (!locked) setActiveTab(tab.id); }}
                    className="flex flex-col items-center transition-all group"
                    style={{ width: 90, opacity: locked ? 0.45 : 1, cursor: locked ? 'not-allowed' : 'pointer' }}
                    title={locked ? 'Locked until Term Sheet authority signatures are complete' : `${tab.label}: ${s}`}
                  >
                    {/* Node */}
                    <div
                      className="flex items-center justify-center transition-all"
                      style={{
                        width: active ? 42 : 38,
                        height: active ? 42 : 38,
                        borderRadius: '50%',
                        backgroundColor: ready ? 'var(--success-500)' : inProgress ? 'var(--brand-primary)' : active ? 'white' : 'var(--neutral-100)',
                        border: active && !ready && !inProgress ? '3px solid var(--brand-primary)' : ready ? '3px solid var(--success-600)' : inProgress ? '3px solid var(--brand-700)' : '2px solid var(--neutral-300)',
                        boxShadow: active ? '0 0 0 4px var(--brand-100)' : ready ? '0 2px 6px rgba(34,139,34,0.2)' : 'none',
                        color: ready || inProgress ? 'white' : active ? 'var(--brand-primary)' : 'var(--neutral-400)',
                        fontSize: '13px',
                        fontWeight: 700,
                      }}
                    >
                      {ready ? <Check size={18} strokeWidth={3} /> : locked ? <Lock size={14} /> : i + 1}
                    </div>

                    {/* Label */}
                    <span className="mt-2 text-center leading-tight" style={{
                      fontSize: '12px',
                      fontWeight: active ? 700 : 500,
                      color: active ? 'var(--brand-primary)' : ready ? 'var(--success-700)' : 'var(--neutral-700)',
                    }}>{tab.shortLabel}</span>

                    {/* Status pill */}
                    <span className="mt-1 px-2 py-0.5 rounded-full" style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      backgroundColor: ready ? 'var(--success-50)' : inProgress ? 'var(--brand-50)' : locked ? 'var(--neutral-100)' : 'var(--warning-50)',
                      color: ready ? 'var(--success-600)' : inProgress ? 'var(--brand-primary)' : locked ? 'var(--neutral-400)' : 'var(--warning-700)',
                    }}>
                      {locked ? 'Locked' : s}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        );
      })()}

      <div className="flex gap-5">
        {/* Main Content */}
        <div className="flex-1">
          {/* PoA Tab */}
          {activeTab === 'poa' && (
            <div className="bg-white rounded-2xl p-5 border border-[var(--neutral-200)]">
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
                  <label key={item.label} className="flex items-center justify-between p-3 rounded-xl border cursor-pointer" style={{ borderColor: item.checked ? 'var(--success-200)' : 'var(--neutral-200)', backgroundColor: item.checked ? 'var(--success-50)' : 'white' }}>
                    <span style={{ fontSize: '13px', color: 'var(--neutral-700)' }}>{item.label}</span>
                    <input type="checkbox" checked={item.checked} onChange={e => item.onChange(e.target.checked)} style={{ accentColor: 'var(--brand-primary)' }} />
                  </label>
                ))}
              </div>
              <div className="mb-4">
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-700)' }}>Upload Stamped PoA Copy</label>
                <div className="border-2 border-dashed rounded-xl p-4 flex items-center gap-2 cursor-pointer hover:border-[var(--brand-secondary)] hover:bg-[var(--success-50)] transition-all" style={{ borderColor: 'var(--neutral-300)' }}>
                  <Upload size={18} style={{ color: 'var(--neutral-400)' }} />
                  <span style={{ fontSize: '13px', color: 'var(--neutral-700)' }}>Drag or click to upload stamped copy</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  className="px-4 py-2.5 rounded-xl flex items-center gap-2"
                  style={{ backgroundColor: 'var(--neutral-100)', color: 'var(--neutral-700)', fontSize: '14px', border: '1px solid var(--neutral-200)' }}
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
            <div className="bg-white rounded-2xl p-5 border border-[var(--neutral-200)]">
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
                  <label key={item.key} className="p-3 rounded-xl border cursor-pointer" style={{ backgroundColor: termSheetSignatures[item.key] ? 'var(--success-50)' : item.required ? 'var(--warning-50)' : 'var(--neutral-100)', borderColor: termSheetSignatures[item.key] ? 'var(--success-200)' : 'var(--neutral-200)' }}>
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
                <button className="px-4 py-2.5 rounded-xl flex items-center gap-2" style={{ backgroundColor: 'var(--neutral-100)', color: 'var(--neutral-700)', fontSize: '14px', border: '1px solid var(--neutral-200)' }}>
                  <FileText size={14} /> Generate Term Sheet PDF
                </button>
                <button onClick={() => setTermSheetSigned(true)} className="px-4 py-2.5 rounded-xl font-medium" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}>
                  {termSheetSigned ? '✓ Signed' : 'Mark as Signed'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'triparty' && (
            <div className="bg-white rounded-2xl p-5 border border-[var(--neutral-200)]">
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
                    <input defaultValue={field.value} className="w-full px-3 rounded-xl border border-[var(--neutral-300)]" style={{ height: '40px', fontSize: '13px', color: 'var(--neutral-900)' }} />
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl mb-4" style={{ backgroundColor: 'var(--success-50)', border: '1px solid var(--success-200)' }}>
                <div style={{ fontSize: '13px', color: 'var(--success-700)', fontWeight: 700 }}>Deduction consent captured for subsidiary-mediated repayments.</div>
              </div>
              <button className="px-4 py-2.5 rounded-xl font-medium flex items-center gap-2" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}>
                <FileText size={14} /> Generate Tri-Party PDF
              </button>
            </div>
          )}

          {activeTab === 'sh4' && (
            <div className="bg-white rounded-2xl p-5 border border-[var(--neutral-200)]">
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--neutral-900)' }}>Share Security</h3>
                <div className="flex rounded-xl border border-[var(--neutral-200)] overflow-hidden">
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
                        <input defaultValue={value} className="w-full px-3 rounded-xl border border-[var(--neutral-300)]" style={{ height: '40px', fontSize: '13px', color: 'var(--neutral-900)' }} />
                      </div>
                    ))}
                  </div>
                  <label className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: witnessConfirmed ? 'var(--success-200)' : 'var(--warning-200)', backgroundColor: witnessConfirmed ? 'var(--success-50)' : 'var(--warning-50)' }}>
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
                    <div key={step} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: 'var(--neutral-100)', border: '1px solid var(--neutral-200)' }}>
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
            <div className="bg-white rounded-2xl p-5 border border-[var(--neutral-200)]">
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--neutral-900)' }}>Bank Verification Letter</h3>
                <StatusBadge status={bankSignatureMismatch ? 'Pending' : 'Verified'} />
              </div>
              <label className="flex items-center justify-between p-3 rounded-xl border mb-4" style={{ backgroundColor: bankSignatureMismatch ? 'var(--warning-50)' : 'var(--success-50)', borderColor: bankSignatureMismatch ? 'var(--warning-200)' : 'var(--success-200)' }}>
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
                        <input defaultValue={value} className="w-full px-3 rounded-xl border border-[var(--neutral-300)]" style={{ height: '40px', fontSize: '13px', color: 'var(--neutral-900)' }} />
                      </div>
                    ))}
                  </div>
                  <label className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: bankLetterReady ? 'var(--success-200)' : 'var(--neutral-200)', backgroundColor: bankLetterReady ? 'var(--success-50)' : 'white' }}>
                    <span style={{ fontSize: '13px', color: 'var(--neutral-700)' }}>Stamped bank letter received and uploaded</span>
                    <input type="checkbox" checked={bankLetterReady} onChange={e => setBankLetterReady(e.target.checked)} style={{ accentColor: 'var(--brand-primary)' }} />
                  </label>
                </div>
              ) : (
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--success-50)', border: '1px solid var(--success-200)', color: 'var(--success-700)', fontSize: '13px', fontWeight: 700 }}>
                  Bank verification letter is not required because no signature mismatch is flagged.
                </div>
              )}
            </div>
          )}

          {/* Checklist Tab */}
          {activeTab === 'checklist' && (
            <div className="bg-white rounded-2xl border border-[var(--neutral-200)] overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: 'var(--cream-50)', borderBottom: '2px solid var(--neutral-200)' }}>
                <div className="flex items-center gap-2.5">
                  <FileCheck size={17} style={{ color: 'var(--brand-primary)' }} />
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--brand-primary)' }}>Document Checklist (Annexure H)</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full" style={{ fontSize: '12px', fontWeight: 700, backgroundColor: checkedCount === checklistItems.length ? 'var(--success-50)' : 'var(--warning-50)', color: checkedCount === checklistItems.length ? 'var(--success-600)' : 'var(--warning-700)', border: `1px solid ${checkedCount === checklistItems.length ? 'var(--success-200)' : 'var(--warning-200)'}` }}>{checkedCount}/{checklistItems.length} verified</span>
                  <div className="w-28 h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--neutral-200)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${(checkedCount / 15) * 100}%`, backgroundColor: checkedCount === 15 ? 'var(--success-500)' : 'var(--brand-secondary)' }} />
                  </div>
                </div>
              </div>

              <div className="divide-y divide-[var(--neutral-200)]">
                {checklistItems.map((item, i) => {
                  const doc = mockDocuments[i];
                  return (
                    <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--neutral-100)] transition-colors">
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
                        <button className="p-1.5 hover:bg-[var(--neutral-200)] rounded-lg transition-all">
                          <Upload size={12} style={{ color: 'var(--neutral-400)' }} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Signature Blocks */}
              <div className="px-5 py-5 border-t-2 border-[var(--neutral-200)]" style={{ backgroundColor: 'var(--cream-50)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users size={16} style={{ color: 'var(--brand-primary)' }} />
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-primary)' }}>Required Signatures</h4>
                    <span className="px-2 py-0.5 rounded-full" style={{ fontSize: '10px', fontWeight: 700, backgroundColor: 'var(--neutral-200)', color: 'var(--neutral-500)' }}>{Object.values(signatures).filter(Boolean).length}/4</span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--neutral-400)', fontWeight: 500 }}>Sequential countersignature flow</span>
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
                  <GateBanner
                    className="mb-3"
                    variant="blocked"
                    title="Disbursement blocked — documentation incomplete"
                    detail="SOP §4: every document must be verified, PoA & Loan Agreement stamped/notarised (₹500), Term Sheet authority signatures complete, witness signatures captured, bank verification cleared, and all four checklist signatures present."
                  />
                )}
                {(() => {
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
            <div className="bg-white rounded-2xl p-5 border border-[var(--neutral-200)]">
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
                    <input defaultValue={field.value} className="w-full px-3 rounded-xl border border-[var(--neutral-300)] focus:outline-none" style={{ height: '40px', fontSize: '13px', color: 'var(--neutral-900)' }} />
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
                  <label key={item.label} className="flex items-center justify-between p-3 rounded-xl border cursor-pointer" style={{ borderColor: item.checked ? 'var(--success-200)' : 'var(--neutral-200)', backgroundColor: item.checked ? 'var(--success-50)' : 'white' }}>
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
            <div className="bg-white rounded-2xl p-8 border border-[var(--neutral-200)] flex flex-col items-center justify-center">
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
        <div className="w-[320px] flex-shrink-0">
          <div className="bg-white rounded-2xl border border-[var(--neutral-200)] sticky top-4 overflow-hidden">
            <div className="px-5 py-3 flex items-center gap-2" style={{ backgroundColor: 'var(--cream-50)', borderBottom: '1px solid var(--neutral-200)' }}>
              <FileText size={15} style={{ color: 'var(--brand-primary)' }} />
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-primary)' }}>Legal Document Preview</span>
            </div>
            <div className="p-4">
              <div className="mb-3 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--neutral-100)', fontSize: '12px', color: 'var(--neutral-500)', fontWeight: 500 }}>
                Viewing: <strong style={{ color: 'var(--neutral-700)' }}>{docTabs.find(t => t.id === activeTab)?.label || 'Checklist'}</strong>
              </div>
              <div
                className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center"
                style={{ height: '260px', borderColor: 'var(--neutral-200)', backgroundColor: 'var(--cream-50)' }}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--neutral-100)' }}>
                  <FileText size={24} style={{ color: 'var(--neutral-300)' }} />
                </div>
                <p style={{ fontSize: '13px', color: 'var(--neutral-400)', textAlign: 'center', fontWeight: 500 }}>
                  Generate a PDF to<br />preview it here
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors hover:bg-[var(--neutral-175)]" style={{ backgroundColor: 'var(--neutral-100)', fontSize: '13px', color: 'var(--neutral-700)', fontWeight: 500, border: '1px solid var(--neutral-200)' }}>
                  <Eye size={13} /> Preview
                </button>
                <button className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '13px', fontWeight: 500 }}>
                  <Download size={13} /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>)}
    </Shell>
  );
}
