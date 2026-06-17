import { useState } from 'react';
import { Check, Upload, ChevronRight, ChevronLeft, Plus, Trash2, Calculator, ShieldCheck, FileCheck, Wallet, BadgeIndianRupee } from 'lucide-react';
import { toast } from 'sonner';
import { Shell } from '../layout/Shell';
import { UniversalStageTracker } from '../shared/CrossRoleComponents';
import { GateBanner } from '../shared/GateBanner';
import { farmerEligibility, farmerProfile } from '../../data/farmerData';
import { getLoans } from '../../data/loanStore';
import { formatCurrency } from '../../lib/format';

// Next sequential reference from the shared register, so the submitted id is coherent
// with every other screen instead of a hardcoded constant (audit DA-029).
function nextLoanRef(): string {
  const max = getLoans().reduce((m, l) => {
    const n = parseInt(l.id.replace(/\D/g, ''), 10);
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return 'LO' + String(max + 1).padStart(8, '0');
}

interface LoanApplicationProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

const steps = [
  { id: 1, label: 'Basic Details' },
  { id: 2, label: 'Shareholding' },
  { id: 3, label: 'Land & Crop' },
  { id: 4, label: 'KYC Upload' },
  { id: 5, label: 'Review & Submit' },
];

interface LandParcel {
  survey: string; village: string; area: string; crop: string; season: string;
}

export function LoanApplication({ onNavigate, activePage }: LoanApplicationProps) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submittedRef, setSubmittedRef] = useState('');
  const [shares, setShares] = useState(farmerProfile.shares);
  const [landAcres, setLandAcres] = useState(farmerProfile.landAcres);
  const [requestedAmount, setRequestedAmount] = useState(String(farmerEligibility.eligible));
  const [purpose, setPurpose] = useState('Crop Production & Farm Inputs');
  const [nomineeAdult, setNomineeAdult] = useState(true);
  const [rekycRequested, setRekycRequested] = useState(false);
  const [landParcels, setLandParcels] = useState<LandParcel[]>([
    { survey: '123/1', village: farmerProfile.village, area: String(farmerProfile.landAcres), crop: 'Grapes', season: '2025-26' },
  ]);
  const [declarations, setDeclarations] = useState({ d1: false, d2: false, d3: false });
  // Per-step required fields, now actually enforced (audit DA-014).
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  // Guarantor is optional unless the member declares one is required (SOP §Sec3) — audit DA-007.
  const [guarantorRequired, setGuarantorRequired] = useState(false);
  const [reviewDocs, setReviewDocs] = useState([
    { name: 'PAN Card', uploaded: true },
    { name: 'Aadhaar Card', uploaded: true },
    { name: '7/12 Extract', uploaded: true },
    { name: 'Crop Plan', uploaded: false },
    { name: 'Bank Statement', uploaded: true },
    { name: 'Cancelled Cheque', uploaded: true },
    { name: 'NACH/ECS Mandate', uploaded: false }, // SOP §Sec3 security obligation (audit DA-006)
    { name: 'Passport Photo', uploaded: true },
    { name: 'Nominee KYC', uploaded: false },
  ]);

  const shareValuation = farmerProfile.loanValuePerShare;
  const scaleOfFinance = farmerProfile.scaleOfFinance;
  const method1 = shares * shareValuation;
  const method2 = landAcres * scaleOfFinance;
  const eligibleLimit = Math.min(method1, method2);
  const reqAmount = parseFloat(requestedAmount) || 0;
  const allDeclarationsChecked = Object.values(declarations).every(Boolean);
  const missingDocs = reviewDocs.filter(doc => !doc.uploaded);
  const amountWithinLimit = reqAmount > 0 && reqAmount <= eligibleLimit;
  // Per-step validity (audit DA-014) — Next is blocked until each step's required fields are filled.
  const ifscValid = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
  const accountValid = accountNumber.length >= 9 && accountNumber.length <= 18;
  const step1Valid = nomineeAdult && dob.trim() !== '' && address.trim() !== '';
  const step3Valid = accountValid && ifscValid;
  const stepValid = (s: number) => (s === 1 ? step1Valid : s === 3 ? step3Valid : true);
  const canSubmitApplication = amountWithinLimit && allDeclarationsChecked && missingDocs.length === 0;

  // Real per-step completion (not the page pointer) so the rail is trustworthy:
  // a step shows a green tick only when its own required fields/checks actually pass.
  const stepDone: Record<number, boolean> = {
    1: step1Valid,
    2: amountWithinLimit,
    3: step3Valid,
    4: allDeclarationsChecked,
    5: canSubmitApplication,
  };
  const doneCount = Object.values(stepDone).filter(Boolean).length;
  const progressPct = Math.round((doneCount / steps.length) * 100);
  // Short, signal-rich status line per step (uses only real state).
  const stepStatus = (id: number, isActive: boolean): string => {
    if (stepDone[id]) {
      return id === 2 ? `${formatCurrency(reqAmount)} within limit`
        : id === 3 ? 'Bank & land captured'
        : id === 4 ? 'Declarations signed'
        : id === 5 ? 'Ready to submit'
        : 'Details captured';
    }
    if (id === 2) return reqAmount > eligibleLimit ? 'Amount over limit' : 'Set loan amount';
    if (id === 3) return 'Bank details needed';
    if (id === 4) return 'Declarations pending';
    if (id === 5) return missingDocs.length ? `${missingDocs.length} doc${missingDocs.length > 1 ? 's' : ''} pending` : 'Final checks';
    if (id === 1) return 'DOB, address & nominee';
    return isActive ? 'Current section' : 'Not started';
  };
  const isUploaded = (name: string) => reviewDocs.find(d => d.name === name)?.uploaded ?? false;


  const addLandParcel = () => {
    setLandParcels([...landParcels, { survey: '', village: '', area: '', crop: '', season: '' }]);
  };

  const markDocUploaded = (name: string) => {
    setReviewDocs(docs => docs.map(doc => doc.name === name ? { ...doc, uploaded: true } : doc));
  };

  const handleSubmit = () => {
    if (!canSubmitApplication) return;
    const ref = nextLoanRef();
    setSubmittedRef(ref);
    setSubmitted(true);
    toast.success('Application submitted', { description: `Reference ${ref} created. The Credit Team will respond within the 2-day TAT.` });
  };

  if (submitted) {
    return (
      <Shell activePage={activePage} onNavigate={onNavigate} breadcrumbs={['Farmer Portal', 'Application Submitted']}>
        <div className="flex flex-col items-center justify-center min-h-96 text-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: 'var(--success-100)' }}
          >
            <Check size={48} style={{ color: 'var(--success-500)' }} />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--neutral-900)', marginBottom: '8px' }}>Application Submitted!</h2>
          <p style={{ fontSize: '15px', color: 'var(--neutral-400)', marginBottom: '16px' }}>Your application has been received by our Credit Team. You'll hear back within 2 working days.</p>
          <div
            className="px-6 py-4 rounded-2xl mb-6"
            style={{ backgroundColor: 'var(--brand-light)', border: '1px solid var(--success-100)' }}
          >
            <div style={{ fontSize: '12px', color: 'var(--brand-secondary)', fontWeight: 500, marginBottom: '4px' }}>Application Reference</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--brand-primary)', fontFamily: 'Roboto Mono' }}>{submittedRef || 'LO00000052'}</div>
          </div>
          <div className="w-full max-w-3xl mb-5"><UniversalStageTracker currentStage={1} /></div>
          <p style={{ fontSize: '14px', color: 'var(--neutral-700)', marginBottom: '24px' }}>
            If documents are missing, the Credit Team will contact you through app notification, SMS, or phone before assessment continues.
          </p>
          <div className="flex gap-3">
            <button
              className="px-5 py-2.5 rounded-xl border border-[var(--neutral-200)] transition-all hover:bg-[var(--neutral-100)]"
              style={{ fontSize: '14px', color: 'var(--neutral-700)' }}
              onClick={() => onNavigate('farmer-dashboard')}
            >
              Back to Dashboard
            </button>
            <button
              className="px-5 py-2.5 rounded-xl font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}
              onClick={() => onNavigate('farmer-active-loans')}
            >
              View Application Status →
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Farmer Portal', 'New Loan Application']}
      pageTitle="Apply for Loan"
      pageSubtitle="Complete the 5-step application form"
    >
      <div className="farmer-page">
        <section className="farmer-panel p-5 mb-6">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Eligible Limit', value: formatCurrency(eligibleLimit), helper: 'Lower of shares and land limit', icon: <Wallet size={15} />, color: 'var(--brand-primary)' },
              { label: 'Requested', value: requestedAmount ? formatCurrency(reqAmount) : 'Not entered', helper: amountWithinLimit ? 'Within SOP limit' : 'Needs correction', icon: <BadgeIndianRupee size={15} />, color: amountWithinLimit ? 'var(--accent-sanction)' : 'var(--error-500)' },
              { label: 'Documents', value: `${reviewDocs.length - missingDocs.length}/${reviewDocs.length}`, helper: missingDocs.length ? `${missingDocs.length} pending` : 'Complete', icon: <FileCheck size={15} />, color: missingDocs.length ? 'var(--warning-500)' : 'var(--success-500)' },
              { label: 'Declarations', value: allDeclarationsChecked ? 'Complete' : 'Pending', helper: allDeclarationsChecked ? 'Ready for final review' : 'Required before submit', icon: <ShieldCheck size={15} />, color: allDeclarationsChecked ? 'var(--success-500)' : 'var(--warning-500)' },
            ].map(stat => (
              <div key={stat.label} className="farmer-panel-tight p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>{stat.icon}</span>
                  <span className="farmer-kicker">{stat.label}</span>
                </div>
                <div className="farmer-value" style={{ fontSize: '22px', lineHeight: '28px', color: stat.label === 'Requested' && !amountWithinLimit ? 'var(--error-800)' : 'var(--neutral-950)' }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: 'var(--neutral-550)', marginTop: '5px' }}>{stat.helper}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="farmer-grid-shell">
          <aside className="farmer-panel p-4 sticky top-4">
            <div className="flex items-center justify-between mb-2">
              <div className="farmer-kicker">Application Steps</div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--green-900)' }}>{doneCount}/{steps.length} done</span>
            </div>
            {/* Overall progress — real completion across the 5 steps */}
            <div className="h-1.5 rounded-full mb-4 overflow-hidden" style={{ backgroundColor: 'var(--gray-150b)' }}>
              <div className="h-full rounded-full" style={{ width: `${progressPct}%`, backgroundColor: 'var(--green-900)', transition: 'width 0.3s ease' }} />
            </div>
            <div className="space-y-2">
              {steps.map(s => {
                const isActive = step === s.id;
                const complete = stepDone[s.id];
                return (
                  <button
                    key={s.id}
                    onClick={() => setStep(s.id)}
                    aria-current={isActive ? 'step' : undefined}
                    className="w-full flex items-center gap-3 rounded-xl p-3 text-left"
                    style={{ backgroundColor: isActive ? 'var(--brand-light)' : 'transparent', border: `1px solid ${isActive ? 'var(--green-200c)' : 'transparent'}` }}
                  >
                    <span className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: complete ? 'var(--green-900)' : isActive ? 'var(--brand-light)' : 'var(--gray-150b)', color: complete ? 'white' : isActive ? 'var(--green-900)' : 'var(--gray-450)', fontSize: '13px', fontWeight: 700, border: !complete && isActive ? '1.5px solid var(--green-900)' : 'none' }}>
                      {complete ? <Check size={15} /> : s.id}
                    </span>
                    <span className="min-w-0">
                      <span style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: isActive ? 'var(--green-900)' : 'var(--neutral-950)' }}>{s.label}</span>
                      <span className="flex items-center gap-1.5" style={{ fontSize: '12px', color: complete ? 'var(--success-700)' : isActive ? 'var(--neutral-700)' : 'var(--neutral-550)', marginTop: '2px' }}>
                        {complete && <Check size={11} />}{stepStatus(s.id, isActive)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-5 p-4 rounded-xl" style={{ backgroundColor: 'var(--gray-50b)', border: '1px solid var(--gray-200b)' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--neutral-950)' }}>Current blocker</div>
              <div style={{ fontSize: '12px', color: 'var(--neutral-550)', lineHeight: '18px', marginTop: '5px' }}>
                {step === 1 && !step1Valid ? 'Enter Date of Birth and Address, and confirm nominee is 18+.' : step === 3 && !step3Valid ? 'Enter a valid Account Number and IFSC.' : step === 5 && !canSubmitApplication ? 'Finish documents, declarations, and amount checks.' : 'No blocker on this step.'}
              </div>
            </div>
          </aside>

          <main>
        {/* Step 1: Basic Details */}
        {step === 1 && (
          <div className="farmer-panel p-7">
            <h2 style={{ fontSize: '20px', fontWeight: 500, color: 'var(--neutral-900)', marginBottom: '4px' }}>Tell us about yourself</h2>
            <p style={{ fontSize: '14px', color: 'var(--neutral-400)', marginBottom: '24px' }}>Step 1 of 5 — Basic personal details</p>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-700)' }}>Full Name</label>
                <div className="relative">
                  <input value={farmerProfile.fullName} readOnly className="w-full px-4 rounded-xl border border-[var(--neutral-200)] bg-[var(--neutral-100)] pr-10" style={{ height: '44px', fontSize: '14px', color: 'var(--neutral-400)' }} />
                  <ShieldCheck className="absolute right-3 top-3" size={16} style={{ color: 'var(--neutral-400)' }} />
                </div>
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-700)' }}>Mobile Number</label>
                <input value={farmerProfile.mobile} readOnly className="w-full px-4 rounded-xl border border-[var(--neutral-200)] bg-[var(--neutral-100)]" style={{ height: '44px', fontSize: '14px', color: 'var(--neutral-400)', fontFamily: 'Roboto Mono' }} />
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-700)' }}>Date of Birth <span style={{ color: 'var(--error-500)' }}>*</span></label>
                <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full px-4 rounded-xl border border-[var(--neutral-300)] focus:outline-none focus:border-[var(--brand-primary)]" style={{ height: '44px', fontSize: '14px', color: 'var(--neutral-900)' }} />
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-700)' }}>Alternate Mobile</label>
                <input type="tel" placeholder="Optional" className="w-full px-4 rounded-xl border border-[var(--neutral-300)] focus:outline-none focus:border-[var(--brand-primary)]" style={{ height: '44px', fontSize: '14px', color: 'var(--neutral-900)' }} />
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-700)' }}>Email Address</label>
                <input type="email" placeholder="Optional" className="w-full px-4 rounded-xl border border-[var(--neutral-300)] focus:outline-none focus:border-[var(--brand-primary)]" style={{ height: '44px', fontSize: '14px', color: 'var(--neutral-900)' }} />
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-700)' }}>Gender <span style={{ color: 'var(--error-500)' }}>*</span></label>
                <select className="w-full px-4 rounded-xl border border-[var(--neutral-300)] focus:outline-none focus:border-[var(--brand-primary)] bg-white" style={{ height: '44px', fontSize: '14px', color: 'var(--neutral-900)' }}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-700)' }}>Residential Address <span style={{ color: 'var(--error-500)' }}>*</span></label>
                <textarea rows={3} value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[var(--neutral-300)] focus:outline-none focus:border-[var(--brand-primary)] resize-none" style={{ fontSize: '14px', color: 'var(--neutral-900)' }} placeholder="Enter your full address..." />
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-700)' }}>Village / Taluka <span style={{ color: 'var(--error-500)' }}>*</span></label>
                <input type="text" defaultValue={`${farmerProfile.village} / ${farmerProfile.taluka}`} className="w-full px-4 rounded-xl border border-[var(--neutral-300)] focus:outline-none focus:border-[var(--brand-primary)]" style={{ height: '44px', fontSize: '14px', color: 'var(--neutral-900)' }} />
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-700)' }}>District / State <span style={{ color: 'var(--error-500)' }}>*</span></label>
                <select className="w-full px-4 rounded-xl border border-[var(--neutral-300)] focus:outline-none focus:border-[var(--brand-primary)] bg-white" style={{ height: '44px', fontSize: '14px', color: 'var(--neutral-900)' }}>
                  <option>{farmerProfile.district}, {farmerProfile.state}</option>
                  <option>Pune, Maharashtra</option>
                  <option>Aurangabad, Maharashtra</option>
                </select>
              </div>
            </div>

            {/* Nominee Section */}
            <div className="mt-6 pt-5 border-t border-[var(--neutral-200)]">
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--neutral-900)' }}>Nominee Details</h3>
                <span className="px-2 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: 'var(--warning-100)', color: 'var(--warning-500)' }}>Required by SOP</span>
              </div>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { label: 'Nominee Full Name', type: 'text', placeholder: 'Enter nominee name' },
                  { label: 'Nominee Aadhaar Number', type: 'text', placeholder: 'XXXX XXXX XXXX' },
                  { label: 'PAN Number', type: 'text', placeholder: 'ABCDE1234F' },
                  { label: 'Relationship', type: 'select' },
                ].map((field, i) => (
                  <div key={i}>
                    <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-700)' }}>{field.label} <span style={{ color: 'var(--error-500)' }}>*</span></label>
                    {field.type === 'select' ? (
                      <select className="w-full px-4 rounded-xl border border-[var(--neutral-300)] focus:outline-none focus:border-[var(--brand-primary)] bg-white" style={{ height: '44px', fontSize: '14px', color: 'var(--neutral-900)' }}>
                        <option>Spouse</option><option>Son</option><option>Daughter</option><option>Father</option><option>Mother</option>
                      </select>
                    ) : (
                      <input type={field.type} placeholder={field.placeholder} className="w-full px-4 rounded-xl border border-[var(--neutral-300)] focus:outline-none focus:border-[var(--brand-primary)]" style={{ height: '44px', fontSize: '14px', color: 'var(--neutral-900)', fontFamily: field.label.includes('Aadhaar') || field.label.includes('PAN') ? 'Roboto Mono' : 'inherit' }} />
                    )}
                  </div>
                ))}
              </div>
              <label className="flex items-start gap-2 mt-3 p-3 rounded-xl" style={{ backgroundColor: nomineeAdult ? 'var(--success-50)' : 'var(--warning-100)', border: `1px solid ${nomineeAdult ? 'var(--success-200)' : 'var(--warning-200)'}` }}>
                <input type="checkbox" checked={nomineeAdult} onChange={e => setNomineeAdult(e.target.checked)} className="mt-0.5" style={{ accentColor: 'var(--brand-primary)' }} />
                <span style={{ fontSize: '12px', color: nomineeAdult ? 'var(--success-700)' : 'var(--warning-700)', lineHeight: '18px' }}>I confirm nominee age is 18+ and supporting KYC evidence is available. Nominee minors are blocked by SOP.</span>
              </label>
            </div>
            
            {/* KYC Status */}
            <div className="mt-6 pt-5 border-t border-[var(--neutral-200)]">
              <div className="p-4 rounded-xl flex gap-3" style={{ backgroundColor: rekycRequested ? 'var(--warning-100)' : 'var(--success-50)', border: `1px solid ${rekycRequested ? 'var(--warning-200)' : 'var(--success-200)'}` }}>
                <ShieldCheck size={24} style={{ color: rekycRequested ? 'var(--warning-700)' : 'var(--success-700)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: rekycRequested ? 'var(--warning-700)' : 'var(--success-700)', marginBottom: '4px' }}>
                    {rekycRequested ? 'Re-KYC request sent' : 'KYC active for this application'}
                  </div>
                  <div style={{ fontSize: '13px', color: rekycRequested ? 'var(--warning-700)' : 'var(--success-700)', lineHeight: '20px' }}>
                    {rekycRequested ? 'Compliance will refresh your KYC before the Credit Team starts assessment.' : 'PAN, Aadhaar, and member records are available. You can still request a KYC refresh if details have changed.'}
                  </div>
                  <button onClick={() => setRekycRequested(true)} className="mt-3 px-4 py-2 rounded-lg font-medium" style={{ backgroundColor: rekycRequested ? 'var(--warning-500)' : 'var(--brand-primary)', color: 'white', fontSize: '12px' }}>
                    {rekycRequested ? 'Request Sent' : 'Request KYC Update'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Shareholding */}
        {step === 2 && (
          <div className="farmer-panel p-7">
            <h2 style={{ fontSize: '20px', fontWeight: 500, color: 'var(--neutral-900)', marginBottom: '4px' }}>Shareholding & Loan Limit</h2>
            <p style={{ fontSize: '14px', color: 'var(--neutral-400)', marginBottom: '24px' }}>Step 2 of 5 — Your shareholding details and eligibility</p>

            {/* Shareholding Info */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Folio Number', value: farmerProfile.folioNo, mono: true },
                  { label: 'Shares Held', value: `${shares} shares`, mono: false },
                  { label: 'Share Type', value: `${farmerProfile.shareType} (D-MAT pending)`, mono: false },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl" style={{ backgroundColor: 'var(--neutral-100)', border: '1px solid var(--neutral-200)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--neutral-400)', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--neutral-900)', fontFamily: item.mono ? 'Roboto Mono' : 'inherit' }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Calculator Panel */}
            <div className="rounded-2xl p-5 mb-6" style={{ backgroundColor: 'var(--brand-light)', border: '1px solid var(--green-100b)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Calculator size={18} style={{ color: 'var(--brand-secondary)' }} />
                <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'var(--brand-primary)' }}>Loan Limit Calculator</h3>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-white rounded-xl p-4">
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--brand-primary)', marginBottom: '12px' }}>Method 1: Shareholding-Based</div>
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="number"
                      value={shares}
                      onChange={e => setShares(parseInt(e.target.value) || 0)}
                      className="w-20 px-2 rounded-lg border border-[var(--neutral-300)] text-center focus:outline-none focus:border-[var(--brand-primary)]"
                      style={{ height: '36px', fontSize: '14px', fontFamily: 'Roboto Mono' }}
                    />
                    <span style={{ fontSize: '12px', color: 'var(--neutral-400)' }}>shares × ₹{shareValuation}</span>
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--success-500)', fontFamily: 'Roboto Mono' }}>
                    {formatCurrency(method1)}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--neutral-400)', marginTop: '4px' }}>Based on AGM 2024 valuation</div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--brand-primary)', marginBottom: '12px' }}>Method 2: Agricultural Land-Based</div>
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="number"
                      value={landAcres}
                      step="0.5"
                      onChange={e => setLandAcres(parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 rounded-lg border border-[var(--neutral-300)] text-center focus:outline-none focus:border-[var(--brand-primary)]"
                      style={{ height: '36px', fontSize: '14px', fontFamily: 'Roboto Mono' }}
                    />
                    <span style={{ fontSize: '12px', color: 'var(--neutral-400)' }}>acres × ₹{scaleOfFinance.toLocaleString('en-IN')}/acre</span>
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--success-500)', fontFamily: 'Roboto Mono' }}>
                    {formatCurrency(method2)}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--neutral-400)', marginTop: '4px' }}>Scale of Finance — FY 2025-26</div>
                </div>
              </div>
              <div
                className="mt-4 p-4 rounded-xl flex items-center justify-between"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Your Maximum Eligible Loan Amount</span>
                <span style={{ fontSize: '24px', fontWeight: 700, color: 'white', fontFamily: 'Roboto Mono' }}>
                  {formatCurrency(eligibleLimit)}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--brand-secondary)', marginTop: '8px' }}>
                Lower of Method 1 ({formatCurrency(method1)}) and Method 2 ({formatCurrency(method2)}). Dashboard eligibility: {formatCurrency(farmerEligibility.eligible)}. Final amount subject to Credit Assessment review.
              </p>
            </div>

            {/* Loan Request */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-700)' }}>Required Loan Amount <span style={{ color: 'var(--error-500)' }}>*</span></label>
                <input
                  type="number"
                  value={requestedAmount}
                  onChange={e => setRequestedAmount(e.target.value)}
                  placeholder={`Max: ${formatCurrency(eligibleLimit)}`}
                  className="w-full px-4 rounded-xl border border-[var(--neutral-300)] focus:outline-none focus:border-[var(--brand-primary)]"
                  style={{ height: '44px', fontSize: '14px', color: 'var(--neutral-900)', fontFamily: 'Roboto Mono' }}
                />
                {reqAmount > eligibleLimit && (
                  <p style={{ fontSize: '12px', color: 'var(--error-500)', marginTop: '4px' }}>Amount exceeds eligible limit of {formatCurrency(eligibleLimit)}</p>
                )}
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-700)' }}>Purpose of Loan <span style={{ color: 'var(--error-500)' }}>*</span></label>
                <select value={purpose} onChange={e => setPurpose(e.target.value)} className="w-full px-4 rounded-xl border border-[var(--neutral-300)] focus:outline-none focus:border-[var(--brand-primary)] bg-white" style={{ height: '44px', fontSize: '14px', color: 'var(--neutral-900)' }}>
                  <option>Crop Production & Farm Inputs</option>
                  <option>Farm Equipment Purchase</option>
                  <option>Irrigation & Infrastructure</option>
                  <option>Post-Harvest Activities</option>
                  <option>Other Agriculture Activity</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-700)' }}>Purpose Declaration</label>
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--success-50)', border: '1px solid var(--success-200)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--success-700)', marginBottom: '4px' }}>Controlled SOP purpose selected</div>
                  <div style={{ fontSize: '13px', color: 'var(--neutral-700)', lineHeight: '20px' }}>
                    This application will be processed under the selected category: <strong>{purpose}</strong>. Free-text purposes are disabled to keep the loan file aligned with the approved agriculture-purpose list.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Land & Crop */}
        {step === 3 && (
          <div className="farmer-panel p-7">
            <h2 style={{ fontSize: '20px', fontWeight: 500, color: 'var(--neutral-900)', marginBottom: '4px' }}>Agricultural Profile</h2>
            <p style={{ fontSize: '14px', color: 'var(--neutral-400)', marginBottom: '24px' }}>Step 3 of 5 — Land, crop, and bank details</p>

            {/* Upload zones */}
              {[
              { label: '7/12 Extract (Satbara)', note: 'PDF or JPG · Max 5MB', required: true, doc: '7/12 Extract' },
              { label: 'Crop Plan', note: 'PDF or JPG · Max 5MB', required: true, doc: 'Crop Plan' },
              { label: 'Bank Statement (Last 6 months)', note: 'PDF · Max 10MB', required: true, doc: 'Bank Statement' },
            ].map((zone, i) => (
              <div key={i} className="mb-4">
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-700)' }}>
                  {zone.label} {zone.required && <span style={{ color: 'var(--error-500)' }}>*</span>}
                </label>
                <button
                  type="button"
                  onClick={() => markDocUploaded(zone.doc)}
                  className="w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:border-[var(--brand-secondary)] hover:bg-[var(--success-50)]"
                  style={{ borderColor: isUploaded(zone.doc) ? 'var(--success-500)' : 'var(--neutral-300)', padding: '20px', backgroundColor: isUploaded(zone.doc) ? 'var(--success-50)' : 'var(--neutral-60)' }}
                >
                  {isUploaded(zone.doc) ? <FileCheck size={24} style={{ color: 'var(--success-500)' }} /> : <Upload size={24} style={{ color: 'var(--neutral-400)' }} />}
                  <span style={{ fontSize: '13px', color: isUploaded(zone.doc) ? 'var(--success-700)' : 'var(--neutral-700)', fontWeight: isUploaded(zone.doc) ? 700 : 400 }}>
                    {isUploaded(zone.doc) ? 'Uploaded — tap to replace' : <>Drag files here or <span style={{ color: 'var(--brand-accent)' }}>click to browse</span></>}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--neutral-400)' }}>{zone.note}</span>
                </button>
              </div>
            ))}

            {/* Land Parcels Table */}
            <div className="mt-5 pt-5 border-t border-[var(--neutral-200)]">
              <div className="flex items-center justify-between mb-3">
                <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'var(--neutral-900)' }}>Land Parcels</h3>
                <button onClick={addLandParcel} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all" style={{ backgroundColor: 'var(--brand-light)', color: 'var(--brand-secondary)', fontSize: '13px', fontWeight: 500 }}>
                  <Plus size={14} /> Add Land Parcel
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--neutral-100)', borderBottom: '1px solid var(--neutral-200)' }}>
                      {['Survey No.', 'Village', 'Area (acres)', 'Crop', 'Season', ''].map(h => (
                        <th key={h} className="px-3 py-2 text-left" style={{ fontSize: '11px', fontWeight: 500, color: 'var(--neutral-400)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {landParcels.map((parcel, i) => (
                      <tr key={i} className="border-b border-[var(--neutral-200)]">
                        {(['survey', 'village', 'area', 'crop', 'season'] as const).map(field => (
                          <td key={field} className="px-2 py-2">
                            <input
                              value={parcel[field]}
                              onChange={e => {
                                const updated = [...landParcels];
                                updated[i] = { ...updated[i], [field]: e.target.value };
                                setLandParcels(updated);
                              }}
                              className="w-full px-2 rounded-lg border border-[var(--neutral-200)] focus:outline-none focus:border-[var(--brand-primary)]"
                              style={{ height: '36px', fontSize: '13px', color: 'var(--neutral-900)' }}
                            />
                          </td>
                        ))}
                        <td className="px-2">
                          <button onClick={() => setLandParcels(landParcels.filter((_, j) => j !== i))}>
                            <Trash2 size={14} style={{ color: 'var(--error-500)' }} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bank Details */}
            <div className="mt-5 pt-5 border-t border-[var(--neutral-200)]">
              <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'var(--neutral-900)', marginBottom: '16px' }}>Bank Account Details</h3>
              <div className="grid grid-cols-2 gap-4">
                {['Account Holder Name', 'Bank Name'].map((label, i) => (
                  <div key={i}>
                    <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-700)' }}>{label} <span style={{ color: 'var(--error-500)' }}>*</span></label>
                    <input type="text" className="w-full px-4 rounded-xl border border-[var(--neutral-300)] focus:outline-none focus:border-[var(--brand-primary)]" style={{ height: '44px', fontSize: '14px', color: 'var(--neutral-900)' }} />
                  </div>
                ))}
                <div>
                  <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-700)' }}>Account Number <span style={{ color: 'var(--error-500)' }}>*</span></label>
                  <input type="text" inputMode="numeric" value={accountNumber} onChange={e => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 18))} placeholder="Digits only" className="w-full px-4 rounded-xl border focus:outline-none focus:border-[var(--brand-primary)]" style={{ height: '44px', fontSize: '14px', color: 'var(--neutral-900)', fontFamily: 'Roboto Mono', borderColor: accountNumber && accountNumber.length < 9 ? 'var(--error-500)' : 'var(--neutral-300)' }} />
                  {accountNumber !== '' && accountNumber.length < 9 && <p style={{ fontSize: '12px', color: 'var(--error-500)', marginTop: '4px' }}>Account number looks too short (9–18 digits).</p>}
                </div>
                <div>
                  <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-700)' }}>IFSC Code <span style={{ color: 'var(--error-500)' }}>*</span></label>
                  <input type="text" value={ifsc} onChange={e => setIfsc(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11))} placeholder="ABCD0123456" className="w-full px-4 rounded-xl border focus:outline-none focus:border-[var(--brand-primary)]" style={{ height: '44px', fontSize: '14px', color: 'var(--neutral-900)', fontFamily: 'Roboto Mono', borderColor: ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc) ? 'var(--error-500)' : 'var(--neutral-300)' }} />
                  {ifsc !== '' && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc) && <p style={{ fontSize: '12px', color: 'var(--error-500)', marginTop: '4px' }}>IFSC format: 4 letters, 0, then 6 characters.</p>}
                </div>
                <div>
                  <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-700)' }}>Branch Name <span style={{ color: 'var(--error-500)' }}>*</span></label>
                  <input type="text" className="w-full px-4 rounded-xl border border-[var(--neutral-300)] focus:outline-none focus:border-[var(--brand-primary)]" style={{ height: '44px', fontSize: '14px', color: 'var(--neutral-900)' }} />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-700)' }}>Upload Cancelled Cheque <span style={{ color: 'var(--error-500)' }}>*</span></label>
                  <button type="button" onClick={() => markDocUploaded('Cancelled Cheque')} className="w-full border-2 border-dashed rounded-xl p-5 flex items-center gap-3 cursor-pointer hover:border-[var(--brand-secondary)] transition-colors" style={{ borderColor: isUploaded('Cancelled Cheque') ? 'var(--success-500)' : 'var(--neutral-300)', backgroundColor: isUploaded('Cancelled Cheque') ? 'var(--success-50)' : 'transparent' }}>
                    {isUploaded('Cancelled Cheque') ? <FileCheck size={20} style={{ color: 'var(--success-500)' }} /> : <Upload size={20} style={{ color: 'var(--neutral-400)' }} />}
                    <span style={{ fontSize: '13px', color: isUploaded('Cancelled Cheque') ? 'var(--success-700)' : 'var(--neutral-700)', fontWeight: isUploaded('Cancelled Cheque') ? 700 : 400 }}>{isUploaded('Cancelled Cheque') ? 'Cancelled cheque uploaded' : 'Upload scanned copy of cancelled cheque'}</span>
                  </button>
                </div>
                <div>
                  <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-700)' }}>NACH / ECS Auto-Debit Mandate <span style={{ color: 'var(--error-500)' }}>*</span></label>
                  <button type="button" onClick={() => markDocUploaded('NACH/ECS Mandate')} className="w-full border-2 border-dashed rounded-xl p-5 flex items-center gap-3 cursor-pointer hover:border-[var(--brand-secondary)] transition-colors" style={{ borderColor: isUploaded('NACH/ECS Mandate') ? 'var(--success-500)' : 'var(--neutral-300)', backgroundColor: isUploaded('NACH/ECS Mandate') ? 'var(--success-50)' : 'transparent' }}>
                    {isUploaded('NACH/ECS Mandate') ? <FileCheck size={20} style={{ color: 'var(--success-500)' }} /> : <Upload size={20} style={{ color: 'var(--neutral-400)' }} />}
                    <span style={{ fontSize: '13px', color: isUploaded('NACH/ECS Mandate') ? 'var(--success-700)' : 'var(--neutral-700)', fontWeight: isUploaded('NACH/ECS Mandate') ? 700 : 400 }}>{isUploaded('NACH/ECS Mandate') ? 'NACH/ECS mandate uploaded' : <>Sign &amp; upload NACH/ECS mandate (security per SOP)</>}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Guarantor — optional unless required (SOP §Sec3) — audit DA-007 */}
            <div className="mt-5 pt-5 border-t border-[var(--neutral-200)]">
              <label className="flex items-start gap-2 mb-3 cursor-pointer">
                <input type="checkbox" checked={guarantorRequired} onChange={e => setGuarantorRequired(e.target.checked)} className="mt-0.5" style={{ accentColor: 'var(--brand-primary)' }} />
                <span style={{ fontSize: '13px', color: 'var(--neutral-700)', lineHeight: '20px' }}>A guarantor is required for this loan (the Credit Team will advise if applicable).</span>
              </label>
              {guarantorRequired && (
                <div className="grid grid-cols-2 gap-4">
                  {['Guarantor Name', 'Guarantor Mobile', 'Guarantor PAN', 'Relationship to Applicant'].map((label, i) => (
                    <div key={i}>
                      <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-700)' }}>{label} <span style={{ color: 'var(--error-500)' }}>*</span></label>
                      <input type="text" className="w-full px-4 rounded-xl border border-[var(--neutral-300)] focus:outline-none focus:border-[var(--brand-primary)]" style={{ height: '44px', fontSize: '14px', color: 'var(--neutral-900)', fontFamily: label.includes('PAN') ? 'Roboto Mono' : 'inherit' }} />
                    </div>
                  ))}
                  <div className="col-span-2">
                    <button type="button" onClick={() => markDocUploaded('Cancelled Cheque')} className="w-full border-2 border-dashed rounded-xl p-4 flex items-center gap-2 cursor-pointer hover:border-[var(--brand-secondary)] transition-colors" style={{ borderColor: 'var(--neutral-300)' }}>
                      <Upload size={18} style={{ color: 'var(--neutral-400)' }} />
                      <span style={{ fontSize: '13px', color: 'var(--neutral-700)' }}>Upload guarantor ID &amp; consent</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: KYC */}
        {step === 4 && (
          <div className="farmer-panel p-7">
            <h2 style={{ fontSize: '20px', fontWeight: 500, color: 'var(--neutral-900)', marginBottom: '4px' }}>Identity Verification</h2>
            <p style={{ fontSize: '14px', color: 'var(--neutral-400)', marginBottom: '24px' }}>Step 4 of 5 — KYC documents and declarations</p>

            <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'var(--neutral-900)', marginBottom: '12px' }}>Applicant KYC</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                { label: 'PAN Card', note: 'JPG/PDF · Max 5MB · Self-attested copy required', required: true, doc: 'PAN Card' },
                { label: 'Aadhaar Card', note: 'JPG/PDF · Max 5MB', required: true, doc: 'Aadhaar Card' },
                { label: 'Share Certificates', note: 'JPG/PDF · Max 10MB · For physical shares only', required: false, doc: 'Share Certificates' },
                { label: 'Passport Photo', note: 'JPG only · Max 500KB', required: true, doc: 'Passport Photo' },
              ].map((doc, i) => (
                <div key={i}>
                  <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-700)' }}>
                    {doc.label} {doc.required && <span style={{ color: 'var(--error-500)' }}>*</span>}
                  </label>
                  <button type="button" onClick={() => markDocUploaded(doc.doc)} className="w-full border-2 border-dashed rounded-xl p-4 flex items-center gap-2 cursor-pointer hover:border-[var(--brand-secondary)] hover:bg-[var(--success-50)] transition-all text-left" style={{ borderColor: isUploaded(doc.doc) ? 'var(--success-500)' : 'var(--neutral-300)', backgroundColor: isUploaded(doc.doc) ? 'var(--success-50)' : 'transparent' }}>
                    {isUploaded(doc.doc) ? <FileCheck size={18} style={{ color: 'var(--success-500)' }} /> : <Upload size={18} style={{ color: 'var(--neutral-400)' }} />}
                    <div>
                      <span style={{ fontSize: '13px', color: isUploaded(doc.doc) ? 'var(--success-700)' : 'var(--neutral-700)', fontWeight: isUploaded(doc.doc) ? 700 : 400 }}>{isUploaded(doc.doc) ? `${doc.label} uploaded` : `Upload ${doc.label}`}</span>
                      <div style={{ fontSize: '11px', color: 'var(--neutral-400)' }}>{doc.note}</div>
                    </div>
                  </button>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'var(--neutral-900)', marginBottom: '12px' }}>Nominee KYC</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {['PAN Card (Nominee)', 'Aadhaar Card (Nominee)', 'Passport Photo (Nominee)'].map((label, i) => (
                <div key={i}>
                  <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-700)' }}>{label} <span style={{ color: 'var(--error-500)' }}>*</span></label>
                  <button type="button" onClick={() => markDocUploaded('Nominee KYC')} className="w-full border-2 border-dashed rounded-xl p-4 flex items-center gap-2 cursor-pointer hover:border-[var(--brand-secondary)] hover:bg-[var(--success-50)] transition-all text-left" style={{ borderColor: isUploaded('Nominee KYC') ? 'var(--success-500)' : 'var(--neutral-300)', backgroundColor: isUploaded('Nominee KYC') ? 'var(--success-50)' : 'transparent' }}>
                    {isUploaded('Nominee KYC') ? <FileCheck size={18} style={{ color: 'var(--success-500)' }} /> : <Upload size={18} style={{ color: 'var(--neutral-400)' }} />}
                    <span style={{ fontSize: '13px', color: isUploaded('Nominee KYC') ? 'var(--success-700)' : 'var(--neutral-700)', fontWeight: isUploaded('Nominee KYC') ? 700 : 400 }}>{isUploaded('Nominee KYC') ? `${label} uploaded` : `Upload ${label}`}</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-5 border-t border-[var(--neutral-200)]">
              <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'var(--neutral-900)', marginBottom: '12px' }}>Declarations</h3>
              <div className="space-y-3">
                {[
                  { key: 'd1' as const, text: 'I declare that I am not a wilful defaulter and have no pending dues with any financial institution.' },
                  { key: 'd2' as const, text: 'I consent to CKYC and credit bureau enquiries as required for loan processing.' },
                  { key: 'd3' as const, text: 'I declare that the pledged asset (shares) is not already encumbered or pledged elsewhere.' },
                ].map(decl => (
                  <label key={decl.key} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={declarations[decl.key]}
                      onChange={e => setDeclarations({ ...declarations, [decl.key]: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded"
                      style={{ accentColor: 'var(--brand-primary)' }}
                    />
                    <span style={{ fontSize: '13px', color: 'var(--neutral-700)', lineHeight: '20px' }}>{decl.text}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {step === 5 && (
          <div className="farmer-panel p-7">
            <h2 style={{ fontSize: '20px', fontWeight: 500, color: 'var(--neutral-900)', marginBottom: '4px' }}>Review & Submit</h2>
            <p style={{ fontSize: '14px', color: 'var(--neutral-400)', marginBottom: '24px' }}>Step 5 of 5 — Review all details before submitting</p>

            {/* Loan Summary Card */}
            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: 'var(--brand-primary)' }}>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '12px', fontWeight: 500 }}>LOAN SUMMARY</div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Requested Amount</div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: 'white', fontFamily: 'Roboto Mono' }}>{requestedAmount ? formatCurrency(parseFloat(requestedAmount)) : '₹—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Eligible Limit</div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--success-100)', fontFamily: 'Roboto Mono' }}>{formatCurrency(eligibleLimit)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Purpose</div>
                  <div style={{ fontSize: '16px', fontWeight: 500, color: 'white' }}>{purpose}</div>
                </div>
              </div>
            </div>

            {/* Accordion sections */}
            {[
                  { title: 'Personal Details', content: `Name: ${farmerProfile.fullName} · Mobile: ${farmerProfile.mobile} · Village: ${farmerProfile.village}, ${farmerProfile.district}`, editStep: 1 },
              { title: 'Shareholding Details', content: `Folio: SH-04821 · ${shares} shares · Share Type: Physical`, editStep: 2 },
              { title: 'Land Details', content: `${landAcres} acres · ${landParcels.length} parcel(s) registered`, editStep: 3 },
              { title: 'Bank Account', content: 'Account verified · RBL Bank · IFSC: RBLS0000234', editStep: 3 },
            ].map((section, i) => (
              <div key={i} className="mb-3 p-4 rounded-xl border border-[var(--neutral-200)] flex items-center justify-between">
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--neutral-900)' }}>{section.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--neutral-400)', marginTop: '2px' }}>{section.content}</div>
                </div>
                <button onClick={() => setStep(section.editStep)} style={{ fontSize: '13px', color: 'var(--brand-accent)', fontWeight: 700 }}>Edit</button>
              </div>
            ))}

            {/* Document Checklist */}
            <div className="mt-5 pt-5 border-t border-[var(--neutral-200)]">
              <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'var(--neutral-900)', marginBottom: '12px' }}>Document Checklist</h3>
              <div className="grid grid-cols-2 gap-2">
                {reviewDocs.map((doc, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      const updated = [...reviewDocs];
                      updated[i] = { ...updated[i], uploaded: !updated[i].uploaded };
                      setReviewDocs(updated);
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg text-left"
                    style={{ backgroundColor: doc.uploaded ? 'var(--success-50)' : 'var(--error-50)' }}
                  >
                    {doc.uploaded ? <FileCheck size={16} style={{ color: 'var(--success-500)' }} /> : <Upload size={16} style={{ color: 'var(--error-500)' }} />}
                    <span style={{ fontSize: '13px', color: doc.uploaded ? 'var(--brand-primary)' : 'var(--error-500)' }}>{doc.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <GateBanner
                variant={canSubmitApplication ? 'ok' : 'warning'}
                title={canSubmitApplication ? 'Ready for submission' : 'Submission blocked by SOP checks'}
                detail={canSubmitApplication
                  ? 'All eligibility, document and declaration checks pass. You can submit.'
                  : [
                      !amountWithinLimit && 'Enter a requested amount within the calculated eligible limit.',
                      !allDeclarationsChecked && 'Complete all mandatory declarations.',
                      missingDocs.length > 0 && `Upload required documents: ${missingDocs.map(d => d.name).join(', ')}.`,
                    ].filter(Boolean).join(' ')}
              />
              <p className="mt-3 px-1" style={{ fontSize: '13px', color: 'var(--neutral-700)', lineHeight: '20px' }}>
                By submitting, you agree to the Loan Terms and authorize SFPCL to verify your details, conduct credit bureau enquiries, and process this application per Section 378ZK of the Companies Act, 2013.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full mt-5 py-3 rounded-xl font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2"
              disabled={!canSubmitApplication}
              style={{ backgroundColor: canSubmitApplication ? 'var(--brand-primary)' : 'var(--neutral-400)', color: 'white', fontSize: '15px', cursor: canSubmitApplication ? 'pointer' : 'not-allowed' }}
            >
              Submit Application →
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-5">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onNavigate('farmer-dashboard')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--neutral-200)] transition-all hover:bg-[var(--neutral-100)]"
            style={{ fontSize: '14px', color: 'var(--neutral-700)' }}
          >
            <ChevronLeft size={16} /> {step > 1 ? 'Previous' : 'Back to Dashboard'}
          </button>
          {step < 5 && (
            <button
              onClick={() => stepValid(step) && setStep(step + 1)}
              disabled={!stepValid(step)}
              title={!stepValid(step) ? 'Complete the required fields marked * on this step to continue.' : undefined}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: !stepValid(step) ? 'var(--neutral-400)' : 'var(--brand-primary)', color: 'white', fontSize: '14px', cursor: !stepValid(step) ? 'not-allowed' : 'pointer' }}
            >
              Next: {steps[step].label} <ChevronRight size={16} />
            </button>
          )}
        </div>
          </main>
        </div>
      </div>
    </Shell>
  );
}
