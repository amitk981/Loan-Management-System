import { useState } from 'react';
import { Check, Lock, FileText, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Shell } from '../layout/Shell';
import { StatusBadge } from './StatusBadge';
import { GateBanner } from './GateBanner';
import { UniversalStageTracker, AuditTrailPanel, RoleAccessNote } from './CrossRoleComponents';
import { WorkbenchTabs } from './WorkbenchTabs';
import { withGlossary } from './Abbr';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../lib/format';
import {
  type Loan, useLoan, getLoan, DEFAULT_LOAN_ID,
  eligibleLimit, shareLimitOf, landLimitOf, isOverLimit, authorityFor,
  approveLoan, rejectLoan,
} from '../../data/loanStore';

// The shared Loan File: ONE object every role opens, with role-gated tabs.
// Replaces the pattern of 20 sibling list pages per role (see audit §G.4).
// Each tab maps to a SOP stage; the role that owns that stage edits it, others read.
// The specific loan is resolved from the id in the URL (?id=) — every list/board row
// now opens its OWN loan, not a single hardcoded demo (audit DA-001).

interface LoanFileProps {
  onNavigate: (page: string) => void;
  activePage: string;
  activeLoanId?: string;
  activeTab?: string;
}

type TabKey = 'application' | 'appraisal' | 'sanction' | 'documents' | 'disbursement' | 'repayment' | 'audit';

const TABS: { key: TabKey; label: string; owner: string; stage: number }[] = [
  { key: 'application', label: 'Application', owner: 'farmer', stage: 1 },
  { key: 'appraisal', label: 'Appraisal', owner: 'credit', stage: 2 },
  { key: 'sanction', label: 'Sanction', owner: 'sanction', stage: 3 },
  { key: 'documents', label: 'Documents', owner: 'compliance', stage: 4 },
  { key: 'disbursement', label: 'Disbursement', owner: 'treasury', stage: 5 },
  { key: 'repayment', label: 'Repayment', owner: 'credit', stage: 6 },
  { key: 'audit', label: 'Audit', owner: 'all', stage: 0 },
];

// Which tab each role most likely wants to land on.
const ROLE_HOME: Record<string, TabKey> = {
  farmer: 'application', credit: 'appraisal', sanction: 'sanction',
  compliance: 'documents', treasury: 'disbursement', admin: 'audit',
};

export function LoanFile({ onNavigate, activePage, activeLoanId, activeTab }: LoanFileProps) {
  const { user } = useAuth();
  const role = user?.role || 'credit';
  const resolved = useLoan(activeLoanId);
  const loan = resolved ?? getLoan(DEFAULT_LOAN_ID)!;
  // True when an id was requested in the URL but no such loan exists in the store.
  const notFound = !!activeLoanId && !resolved;

  const shareLimit = shareLimitOf(loan);
  const landLimit = landLimitOf(loan);
  const eligible = eligibleLimit(loan);
  const overLimit = isOverLimit(loan);
  const authority = authorityFor(loan);
  const currentStage = loan.stage; // live stage from the shared register

  // The active tab lives in the URL (?tab=) so it survives refresh and works with
  // browser back/forward (IA-03). When no tab is set, fall back to the role's home
  // stage. Changing tab navigates — it does NOT hold local state — so the URL stays
  // the single source of truth for "which tab am I on".
  const urlTab = TABS.find(t => t.key === activeTab)?.key;
  const tab: TabKey = (urlTab ?? ROLE_HOME[role] ?? 'application') as TabKey;
  const setTab = (k: TabKey) => onNavigate(`loan-file::${loan.id}::${k}`);
  const activeTabLabel = TABS.find(t => t.key === tab)?.label ?? '';
  const owns = (t: TabKey) => {
    const owner = TABS.find(x => x.key === t)?.owner;
    return owner === 'all' || owner === role;
  };

  if (notFound) {
    return (
      <Shell
        activePage={activePage}
        onNavigate={onNavigate}
        breadcrumbs={['Pipeline', 'Loan File', activeLoanId!]}
        pageTitle="Loan File"
        pageSubtitle="Loan not found"
      >
        <div className="bg-white rounded-xl border border-[var(--neutral-200)] p-10 text-center max-w-lg mx-auto mt-6">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--warning-50)' }}>
            <FileText size={22} style={{ color: 'var(--gold-500)' }} />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--neutral-900)' }}>Loan {activeLoanId} not found</h2>
          <p style={{ fontSize: '14px', color: 'var(--neutral-500)', marginTop: '8px', lineHeight: '20px' }}>
            This loan reference is not in the register. It may have been archived, or the link may be out of date.
          </p>
          <button onClick={() => onNavigate('pipeline')} className="mt-5 px-4 py-2.5 rounded-lg font-medium inline-flex items-center gap-2" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}>
            Back to Pipeline <ArrowRight size={15} />
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Pipeline', 'Loan File', loan.id, activeTabLabel]}
      pageTitle={`Loan File — ${loan.id}`}
      pageSubtitle={`${loan.borrower} · ${loan.category} · ${activeTabLabel}`}
    >
      {/* Header: the shared object's identity + where it is in the 6 stages */}
      <div className="bg-white rounded-xl border border-[var(--neutral-200)] p-5 mb-5">
        <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div>
              <div style={{ fontSize: '12px', color: 'var(--neutral-400)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Requested</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--neutral-900)', fontFamily: 'Roboto Mono', lineHeight: '34px' }}>{formatCurrency(loan.requested)}</div>
            </div>
            <div className="h-10 w-px" style={{ backgroundColor: 'var(--neutral-200)' }} />
            <div>
              <div style={{ fontSize: '12px', color: 'var(--neutral-400)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Eligible limit</div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: overLimit ? 'var(--error-800)' : 'var(--success-700)', fontFamily: 'Roboto Mono' }}>{formatCurrency(eligible)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full" style={{ backgroundColor: authority.includes('2') ? 'var(--purple-100)' : 'var(--accent-blue-50)', color: authority.includes('2') ? 'var(--accent-sanction)' : 'var(--brand-accent-700)', fontSize: '12px', fontWeight: 700 }}>{authority}</span>
            <StatusBadge status={loan.status} size="md" />
          </div>
        </div>
        <UniversalStageTracker currentStage={currentStage} />
      </div>

      {overLimit && (
        <GateBanner
          className="mb-5"
          variant="warning"
          title="Requested amount exceeds the member's eligible limit"
          detail={`Eligible limit is ${formatCurrency(eligible)} (lower of shareholding ${formatCurrency(shareLimit)} and land ${formatCurrency(landLimit)}). Proceeding requires CFO + 2 Directors and a mandatory Exception Register entry (SOP §2.2 / Authority Matrix).`}
        />
      )}

      <WorkbenchTabs
        tabs={TABS.map(t => ({ key: t.key, label: t.label }))}
        activeKey={tab}
        onChange={(k) => setTab(k as TabKey)}
        accent="var(--brand-primary)"
      />

      {!owns(tab) && tab !== 'audit' && (
        <div className="mb-4"><RoleAccessNote /></div>
      )}

      {tab === 'application' && <ApplicationTab loan={loan} />}
      {tab === 'appraisal' && <AppraisalTab loan={loan} shareLimit={shareLimit} landLimit={landLimit} eligible={eligible} editable={owns('appraisal')} onNavigate={onNavigate} />}
      {tab === 'sanction' && <SanctionTab loan={loan} authority={authority} editable={owns('sanction')} />}
      {tab === 'documents' && <DocumentsTab editable={owns('documents')} onNavigate={onNavigate} />}
      {tab === 'disbursement' && <DisbursementTab editable={owns('disbursement')} onNavigate={onNavigate} />}
      {tab === 'repayment' && <RepaymentTab />}
      {tab === 'audit' && <AuditTrailPanel farmerSafe={role === 'farmer'} />}
    </Shell>
  );
}

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--neutral-200)] overflow-hidden">
      <div className="px-5 py-3 border-b border-[var(--neutral-200)] flex items-center justify-between" style={{ backgroundColor: 'var(--neutral-100)' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--neutral-900)' }}>{title}</h3>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4 py-2.5 border-b border-[var(--neutral-200)] last:border-0">
      <span style={{ fontSize: '13px', color: 'var(--neutral-500)' }}>{label}</span>
      <span style={{ fontSize: '13px', color: 'var(--neutral-900)', fontWeight: 500, fontFamily: mono ? 'Roboto Mono' : 'inherit', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function ApplicationTab({ loan }: { loan: Loan }) {
  const kyc = ['PAN Card', 'Aadhaar Card', 'Share Certificates', '7/12 Extract', 'Crop Plan', 'Bank Statement (6 mo)'];
  return (
    <div className="grid grid-cols-2 gap-5">
      <Card title="Applicant & Loan (Annexure A)">
        <Row label="Loan reference" value={loan.id} mono />
        <Row label="Borrower" value={loan.borrower} />
        <Row label="Shares held" value={`${loan.shares.toLocaleString('en-IN')} @ ₹${loan.valuationPerShare}`} mono />
        <Row label="Land under cultivation" value={`${loan.landAcres} acres`} />
        <Row label="Requested amount" value={formatCurrency(loan.requested)} mono />
        <Row label="Purpose" value={loan.purpose} />
        <Row label="Repayment source" value={loan.source} />
      </Card>
      <Card title="KYC pack">
        <div className="space-y-2">
          {kyc.map(d => (
            <div key={d} className="flex items-center justify-between p-2.5 rounded-lg" style={{ backgroundColor: 'var(--success-50)' }}>
              <span className="flex items-center gap-2" style={{ fontSize: '13px', color: 'var(--success-700)', fontWeight: 500 }}><Check size={15} /> {d}</span>
              <StatusBadge status="Verified" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AppraisalTab({ loan, shareLimit, landLimit, eligible, editable, onNavigate }: { loan: Loan; shareLimit: number; landLimit: number; eligible: number; editable: boolean; onNavigate: (p: string) => void }) {
  const gates = [
    'Active member of the FPC',
    'No existing default at SFPCL or subsidiary',
    'Land docs, KYC, bank statement & crop plan submitted',
    'Agrees to Term Sheet & Loan Agreement',
    'Purpose is crop production / agriculture only',
  ];
  return (
    <div className="grid grid-cols-2 gap-5">
      <Card title="Eligibility (5 gates — Annexure B)">
        <div className="space-y-2">
          {gates.map(g => (
            <label key={g} className="flex items-start gap-2.5 p-2.5 rounded-lg" style={{ backgroundColor: 'var(--neutral-100)' }}>
              <input type="checkbox" defaultChecked disabled={!editable} style={{ accentColor: 'var(--brand-primary)', marginTop: 2 }} />
              <span style={{ fontSize: '13px', color: 'var(--neutral-700)', lineHeight: '18px' }}>{g}</span>
            </label>
          ))}
        </div>
      </Card>
      <Card title="Loan limit (lower of the two)">
        <Row label="Shareholding-based" value={`${loan.shares.toLocaleString('en-IN')} × ₹${loan.valuationPerShare} = ${formatCurrency(shareLimit)}`} mono />
        <Row label="Land-based (scale of finance)" value={`${loan.landAcres} × ₹${loan.scaleOfFinance.toLocaleString('en-IN')} = ${formatCurrency(landLimit)}`} mono />
        <div className="mt-3 p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: 'var(--brand-primary)' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>Eligible limit</span>
          <span style={{ fontSize: '18px', color: 'white', fontWeight: 700, fontFamily: 'Roboto Mono' }}>{formatCurrency(eligible)}</span>
        </div>
        <Row label="Risk rating" value={loan.risk} />
        {editable && (
          <button onClick={() => onNavigate('credit-review')} className="mt-3 w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}>
            Open full appraisal note <ArrowRight size={15} />
          </button>
        )}
      </Card>
    </div>
  );
}

function SignatureLadder({ authority }: { authority: string }) {
  const needsTwo = authority.includes('2');
  const sigs = [
    { who: 'CFO', state: 'Signed' },
    { who: 'Director 1', state: 'Signed' },
    ...(needsTwo ? [{ who: 'Director 2', state: 'Pending' }] : []),
  ];
  return (
    <div className="space-y-2">
      {sigs.map(s => (
        <div key={s.who} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: s.state === 'Signed' ? 'var(--success-50)' : 'var(--warning-50)' }}>
          <span className="flex items-center gap-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-900)' }}>
            {s.state === 'Signed' ? <Check size={15} style={{ color: 'var(--success-500)' }} /> : <Lock size={15} style={{ color: 'var(--gold-500)' }} />} {s.who}
          </span>
          <StatusBadge status={s.state === 'Signed' ? 'Verified' : 'Awaiting Signature'} />
        </div>
      ))}
    </div>
  );
}

function SanctionTab({ loan, authority, editable }: { loan: Loan; authority: string; editable: boolean }) {
  const checks = ['Eligibility verification', 'Loan amount within limit', 'Purpose of loan', 'Compliance checks (Companies Act)', 'Past borrowing history', 'Risk assessment', 'Documentation completeness'];
  const decided = loan.decision;
  // Approve/Reject mutate the shared register irreversibly, so they require an
  // explicit second confirmation (Nielsen #5 — error prevention). Reject also
  // requires a written reason before it can be committed.
  const [pending, setPending] = useState<null | 'approve' | 'reject'>(null);
  const [reason, setReason] = useState('');
  const handleApprove = () => {
    approveLoan(loan.id);
    setPending(null);
    toast.success(`${loan.id} approved`, { description: `Recorded in the Credit Sanction Register (Annexure K). Moved to Stage 4 — Documentation. Authority: ${authority}.` });
  };
  const handleReject = () => {
    rejectLoan(loan.id);
    setPending(null);
    toast.error(`${loan.id} rejected`, { description: `Reason recorded; the Credit Team will issue a Rejection Note (Annexure L) to ${loan.borrower}.` });
  };
  return (
    <div className="grid grid-cols-2 gap-5">
      <Card title="Credit scrutiny (7 checks)">
        <div className="space-y-2">
          {checks.map(c => (
            <div key={c} className="flex items-center gap-2.5 p-2.5 rounded-lg" style={{ backgroundColor: 'var(--neutral-100)' }}>
              <Check size={15} style={{ color: 'var(--success-500)' }} />
              <span style={{ fontSize: '13px', color: 'var(--neutral-700)' }}>{c}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card title={`Authority: ${authority}`}>
        <SignatureLadder authority={authority} />
        {decided && (
          <div className="mt-4">
            <StatusBadge status={decided === 'approved' ? 'Approved' : 'Rejected'} size="md" />
          </div>
        )}
        {editable && !decided && !pending && (
          <div className="flex gap-2 mt-4">
            <button onClick={() => setPending('approve')} className="flex-1 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}>Approve</button>
            <button onClick={() => { setReason(''); setPending('reject'); }} className="flex-1 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--error-100)', color: 'var(--error-900)', fontSize: '14px' }}>Reject with reason</button>
          </div>
        )}
        {editable && !decided && pending === 'approve' && (
          <div className="mt-4 p-3 rounded-lg border" style={{ borderColor: 'var(--brand-primary)', backgroundColor: 'var(--accent-blue-50)' }} role="alertdialog" aria-label="Confirm approval">
            <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--neutral-900)' }}>Approve {loan.id} for {formatCurrency(loan.requested)}?</p>
            <p style={{ fontSize: '12px', color: 'var(--neutral-600)', marginTop: '4px', lineHeight: '18px' }}>This is recorded in the Credit Sanction Register and moves the loan to Stage 4 — Documentation. It cannot be undone here.</p>
            <div className="flex gap-2 mt-3">
              <button onClick={handleApprove} className="flex-1 py-2 rounded-lg font-medium" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '13px' }}>Confirm approval</button>
              <button onClick={() => setPending(null)} className="flex-1 py-2 rounded-lg font-medium" style={{ backgroundColor: 'var(--neutral-100)', color: 'var(--neutral-700)', fontSize: '13px' }}>Cancel</button>
            </div>
          </div>
        )}
        {editable && !decided && pending === 'reject' && (
          <div className="mt-4 p-3 rounded-lg border" style={{ borderColor: 'var(--error-500)', backgroundColor: 'var(--error-50)' }} role="alertdialog" aria-label="Confirm rejection">
            <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--neutral-900)' }}>Reject {loan.id}?</p>
            <label htmlFor="reject-reason" style={{ display: 'block', fontSize: '12px', color: 'var(--neutral-600)', marginTop: '8px' }}>Reason (required — included in the Rejection Note, Annexure L)</label>
            <textarea id="reject-reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={2} className="w-full mt-1 p-2 rounded-lg border" style={{ borderColor: 'var(--neutral-300)', fontSize: '13px', resize: 'vertical' }} placeholder="e.g. Requested amount exceeds eligible limit and no exception approved." />
            <div className="flex gap-2 mt-3">
              <button onClick={handleReject} disabled={!reason.trim()} className="flex-1 py-2 rounded-lg font-medium" style={{ backgroundColor: reason.trim() ? 'var(--error-500)' : 'var(--neutral-200)', color: reason.trim() ? 'white' : 'var(--neutral-400)', fontSize: '13px', cursor: reason.trim() ? 'pointer' : 'not-allowed' }}>Confirm rejection</button>
              <button onClick={() => setPending(null)} className="flex-1 py-2 rounded-lg font-medium" style={{ backgroundColor: 'var(--neutral-100)', color: 'var(--neutral-700)', fontSize: '13px' }}>Cancel</button>
            </div>
          </div>
        )}
        <p style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '10px', lineHeight: '18px' }}>Decision is recorded in the Credit Sanction Register (Annexure K). For loans above ₹5L the first signature locks "pending 2nd director".</p>
      </Card>
    </div>
  );
}

function DocStateCard({ name, state, note }: { name: string; state: string; note: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--neutral-200)]">
      <div className="flex items-center gap-2.5">
        <FileText size={16} style={{ color: 'var(--brand-primary)' }} />
        <div>
          <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-900)' }}>{withGlossary(name)}</div>
          <div style={{ fontSize: '11px', color: 'var(--neutral-400)' }}>{withGlossary(note)}</div>
        </div>
      </div>
      <StatusBadge status={state} />
    </div>
  );
}

function DocumentsTab({ editable, onNavigate }: { editable: boolean; onNavigate: (p: string) => void }) {
  const docs = [
    ['Power of Attorney', 'Verified', '₹500 stamp · notarised'],
    ['Tri-Party Agreement', 'Verified', 'SFPCL + borrower + subsidiary'],
    ['SH-4 / CDSL pledge', 'Pending', 'Physical shares → SH-4'],
    ['Term Sheet', 'Awaiting Signature', '13 fields · applicant + nominee'],
    ['Loan Agreement', 'Pending', '₹500 stamp · notarised'],
    ['Bank Verification Letter', 'N/A', 'Only if signature mismatch'],
    ['Checklist (Annexure H)', 'Pending CS', 'Index · 4 signatures'],
  ] as const;
  return (
    <Card title="Legal documents (Stage 4)" action={editable ? <button onClick={() => onNavigate('cs-workspace')} style={{ fontSize: '13px', color: 'var(--brand-accent-700)', fontWeight: 700 }}>Open document workspace →</button> : undefined}>
      <div className="grid grid-cols-2 gap-3">
        {docs.map(([name, state, note]) => <DocStateCard key={name} name={name} state={state} note={note} />)}
      </div>
    </Card>
  );
}

function DisbursementTab({ editable, onNavigate }: { editable: boolean; onNavigate: (p: string) => void }) {
  return (
    <div className="space-y-5">
      <GateBanner
        variant="blocked"
        title="Disbursement locked — Checklist not fully signed"
        detail="Funds cannot move until the Checklist carries all four signatures (CS, Credit Manager, Sanction Committee, Sr. Manager–Finance) and stamping is complete (SOP §4.13 / §5.3)."
        action={editable ? { label: 'Open disbursement flow', onClick: () => onNavigate('treasury-disbursement') } : undefined}
      />
      <div className="grid grid-cols-2 gap-5">
        <Card title="SAP customer code (Annexure I)">
          <Row label="Status" value="Not yet created" />
          <Row label="Customer ID" value="— (created on approval)" mono />
          <p style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '10px' }}>New code only on first loan; existing borrowers reuse their Customer ID.</p>
        </Card>
        <Card title="Bank details (match cancelled cheque)">
          <Row label="Account holder" value="—" />
          <Row label="Account / IFSC" value="Pending verification" mono />
          <p style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '10px' }}>Entered details are shown side-by-side with the cancelled cheque before transfer. Two-step: Sr. Manager–Finance initiates → CFC authorises.</p>
        </Card>
      </div>
    </div>
  );
}

function RepaymentTab() {
  return (
    <div className="grid grid-cols-2 gap-5">
      <Card title="Schedule & DPD">
        <Row label="Tenure" value="Long term" />
        <Row label="Next due" value="—" />
        <Row label="DPD bucket" value="Current" />
        <p style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '10px' }}>Partial repayments apply to principal first. Unpaid interest at 30 April is capitalised into principal (SOP §6).</p>
      </Card>
      <Card title="Default ladder (SOP §6.2)">
        <div className="space-y-2">
          {['Miss → +3-month grace', 'Assess intentional / non-intentional', 'Non-intentional → +1-year extension', 'Still unpaid → Note for Non-Payment', 'SC + Board → SH-4 / cheque invocation'].map((s, i) => (
            <div key={s} className="flex items-center gap-2.5" style={{ fontSize: '13px', color: 'var(--neutral-700)' }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--neutral-200)', fontSize: '11px', fontWeight: 700, color: 'var(--neutral-500)' }}>{i + 1}</span>
              {s}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
