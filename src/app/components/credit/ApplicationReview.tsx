import { useState } from 'react';
import { toast } from 'sonner';
import { AlertTriangle, Check, Send, ShieldCheck } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { AppModal } from '../shared/AppModal';
import { StatusBadge } from '../shared/StatusBadge';
import { GateBanner } from '../shared/GateBanner';
import { appraisalLoan } from '../../data/creditData';
import { DirectorCaseBanner } from '../shared/CrossRoleComponents';
import { formatCurrency } from '../../lib/format';

interface ApplicationReviewProps {
  onNavigate: (page: string) => void;
  activePage: string;
}


export function ApplicationReview({ onNavigate, activePage }: ApplicationReviewProps) {
  const [step, setStep] = useState(1);
  const [shares, setShares] = useState(appraisalLoan.shares);
  const [landAcres, setLandAcres] = useState(appraisalLoan.landAcres);
  const [requested, setRequested] = useState(appraisalLoan.requested);
  const [riskRating, setRiskRating] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [recommendation, setRecommendation] = useState('Recommend approval at revised eligible limit');
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const shareLimit = shares * appraisalLoan.valuationPerShare;
  const landLimit = landAcres * appraisalLoan.scaleOfFinance;
  const eligible = Math.min(shareLimit, landLimit);
  const exceeds = requested > eligible;
  const isDirectorCase = appraisalLoan.borrower.includes('Ganesh') || appraisalLoan.borrower.includes('Director');

  if (submitted) {
    return (
      <Shell activePage={activePage} onNavigate={onNavigate} breadcrumbs={['Credit Assessment', 'Submitted to SC']}>
        <div className="flex flex-col items-center justify-center min-h-80 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: 'var(--success-100)', color: 'var(--success-600)' }}>
            <Check size={42} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--neutral-900)' }}>Appraisal Note Submitted</h2>
          <p style={{ fontSize: '14px', color: 'var(--neutral-500)', marginTop: '6px' }}>{appraisalLoan.id} is now Submitted to SC. Appraisal note locked, timestamp appended, and Days Waiting counter reset from this stage-entry time.</p>
          <button onClick={() => onNavigate('credit-sc-queue')} className="mt-6 px-5 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}>Open Sanction Committee Queue</button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Credit Assessment', 'Appraisal Queue', appraisalLoan.id]}
      pageTitle={`Prepare Appraisal Note — ${appraisalLoan.id} — ${appraisalLoan.borrower}`}
      pageSubtitle={appraisalLoan.due}
      actions={<StatusBadge status="Under Assessment" size="md" />}
    >
      {isDirectorCase && <div className="mb-5"><DirectorCaseBanner /></div>}
      <div className="mb-5 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--warning-100)' }}>
        <div className="h-full" style={{ width: '62%', backgroundColor: 'var(--warning-500)' }} />
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-3 space-y-4">
          <div className="bg-white rounded-lg border border-[var(--neutral-250)] overflow-hidden">
            {[
              [1, 'Eligibility Check'],
              [2, 'Loan Limit Calc'],
              [3, 'Risk Assessment'],
              [4, 'Recommendation'],
            ].map(([id, label]) => (
              <button key={id} onClick={() => setStep(id as number)} className="w-full px-4 py-3 flex items-center gap-3 text-left border-b border-[var(--neutral-250)] last:border-b-0" style={{ backgroundColor: step === id ? 'var(--accent-blue-50)' : 'white' }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: step === id ? 'var(--brand-accent)' : Number(id) < step ? 'var(--success-600)' : 'var(--neutral-175)', color: step === id || Number(id) < step ? 'white' : 'var(--neutral-500)', fontSize: '12px', fontWeight: 700 }}>{Number(id) < step ? '✓' : id}</span>
                <span style={{ fontSize: '13px', color: step === id ? 'var(--brand-accent)' : 'var(--neutral-700)', fontWeight: 700 }}>{label}</span>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-lg p-4 border border-[var(--neutral-250)] sticky top-4">
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px' }}>Live Eligibility Calc</div>
            <CalcInput label="Shares Held" value={shares} onChange={setShares} suffix="shares" />
            <Metric label="Valuation / share" value={`₹${appraisalLoan.valuationPerShare.toLocaleString('en-IN')}`} />
            <Metric label="Limit (shares)" value={formatCurrency(shareLimit)} color="var(--brand-accent)" />
            <CalcInput label="Land (acres)" value={landAcres} onChange={setLandAcres} suffix="acres" step={0.25} />
            <Metric label="Scale of Finance" value="₹20,000/acre" />
            <Metric label="Limit (land)" value={formatCurrency(landLimit)} color="var(--brand-accent)" />
            <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--green-50c)', border: '2px solid var(--green-700b)' }}>
              <div style={{ fontSize: '11px', color: 'var(--success-600)', fontWeight: 700 }}>ELIGIBLE LIMIT</div>
              <div style={{ fontSize: '28px', color: 'var(--brand-primary)', fontWeight: 700, fontFamily: 'Roboto Mono' }}>{formatCurrency(eligible)}</div>
              <div style={{ fontSize: '11px', color: 'var(--neutral-500)' }}>Lower of share and land limits</div>
            </div>
          </div>
        </div>

        <div className="col-span-9 bg-white rounded-lg border border-[var(--neutral-250)] p-6">
          {step === 1 && (
            <div className="space-y-5">
              <StepTitle title="Step 1: Borrower Eligibility Check" />
              <Panel title="1.1 Member Status Verification">
                <Field label="Active Member?" value="Yes" type="radio" />
                <Field label="Years supplying produce" value="4 yrs" />
                <Field label="Supplying to" value="SFPCL" />
                <Field label="Source verified from" value="Share Register" />
              </Panel>
              <Panel title="1.2 Existing Loan Default Check">
                <Field label="Any existing default in SFPCL?" value="No" type="radio" />
                <Field label="Any default in subsidiary co.?" value="No" type="radio" />
                <Field label="Outstanding loans (current)" value="₹0" mono />
              </Panel>
              <Panel title="1.3 Loan Purpose Compliance">
                <Field label="Stated purpose" value={appraisalLoan.purpose} />
                <Field label="Category" value={appraisalLoan.category} />
              </Panel>
              <Panel title="1.4 Nominee Eligibility">
                <Field label="Nominee Name" value="Board resolution attached" />
                <Field label="Is nominee minor?" value="No" type="radio" />
                <Field label="Aadhaar verified?" value="Yes" />
              </Panel>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <StepTitle title="Step 2: Loan Limit Calculation" />
              <div className="grid grid-cols-3 gap-4">
                <AmountBox label="Shareholding limit" value={shareLimit} note={`${shares} × ₹200`} />
                <AmountBox label="Land-based limit" value={landLimit} note={`${landAcres} acres × ₹20k`} />
                <AmountBox label="Final eligible amount" value={eligible} note="Lower of two" highlight />
              </div>
              <div>
                {exceeds ? (
                  <GateBanner
                    variant="warning"
                    title={`Requested exceeds eligible limit by ${formatCurrency(requested - eligible)}`}
                    detail={`Over-limit cases need CFO + 2 Directors and a mandatory Exception Register entry (Authority Matrix, SOP §2.2). Amount will be revised to ${formatCurrency(eligible)} at sanction unless an exception is recorded.`}
                  />
                ) : (
                  <GateBanner variant="ok" title="Requested amount is within eligible limit" detail="Standard authority applies for this loan amount." />
                )}
                <div className="mt-3 flex items-center gap-3">
                  <input type="number" value={requested} onChange={e => setRequested(Number(e.target.value) || 0)} className="px-3 rounded-md border border-[var(--neutral-300)]" style={{ height: '40px', fontFamily: 'Roboto Mono', fontSize: '15px' }} />
                  <span style={{ fontSize: '13px', color: 'var(--neutral-700)' }}>Requested amount</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <StepTitle title="Step 3: Risk Assessment" />
              <Panel title="Repayment and Crop Risk">
                <Field label="Repayment source" value={appraisalLoan.source} />
                <Field label="Bank statement average" value={formatCurrency(appraisalLoan.bankAverage)} mono />
                <Field label="Irregularity flag" value="No critical irregularity" />
                <Field label="Crop risk" value="Medium — tomato price volatility" />
              </Panel>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--neutral-700)', fontWeight: 700 }}>Risk Mitigation Notes</label>
                <textarea className="w-full mt-2 p-3 rounded-lg border border-[var(--neutral-300)]" rows={4} defaultValue="Repayment routed through tri-party subsidiary deduction. Bank average supports short-term working capital cycle. Crop price risk mitigated through existing Sahyadri procurement relationship." />
              </div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--neutral-700)', fontWeight: 700, marginBottom: '8px' }}>Overall Risk Rating</div>
                <div className="flex gap-2">
                  {(['Low', 'Medium', 'High'] as const).map(rating => (
                    <button key={rating} onClick={() => setRiskRating(rating)} className="px-4 py-2 rounded-lg" style={{ backgroundColor: riskRating === rating ? (rating === 'Low' ? 'var(--success-100)' : rating === 'Medium' ? 'var(--warning-100)' : 'var(--error-100)') : 'var(--neutral-175)', color: riskRating === rating ? (rating === 'Low' ? 'var(--success-600)' : rating === 'Medium' ? 'var(--warning-700)' : 'var(--error-700)') : 'var(--neutral-500)', fontSize: '13px', fontWeight: 700 }}>{rating}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <StepTitle title="Step 4: Recommendation" />
              <div className="grid grid-cols-3 gap-4">
                <AmountBox label="Recommended amount" value={eligible} note={exceeds ? 'Revised to eligible limit' : 'As requested'} highlight />
                <div className="p-4 rounded-lg border border-[var(--neutral-250)]"><div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: 700 }}>Tenure</div><div style={{ fontSize: '17px', fontWeight: 700, marginTop: '6px' }}>Short-term (≤1 year)</div></div>
                <div className="p-4 rounded-lg border border-[var(--neutral-250)]"><div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: 700 }}>Interest Rate</div><div style={{ fontSize: '17px', fontWeight: 700, marginTop: '6px' }}>12% p.a. floating</div></div>
              </div>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--neutral-700)', fontWeight: 700 }}>Remarks for SC</label>
                <textarea value={recommendation} onChange={e => setRecommendation(e.target.value)} className="w-full mt-2 p-3 rounded-lg border border-[var(--neutral-300)]" rows={5} />
              </div>
              <div className="flex justify-end gap-3">
                <button className="px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 border border-[var(--neutral-250)]" style={{ color: 'var(--error-900)', fontSize: '14px' }}>Prepare Rejection Note</button>
                <button onClick={() => setShowSubmit(true)} className="px-5 py-2.5 rounded-lg font-medium flex items-center gap-2" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}><Send size={15} /> Submit to Sanction Committee</button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-5 border-t border-[var(--neutral-250)]">
            <button onClick={() => step > 1 ? setStep(step - 1) : onNavigate('credit-queue')} className="px-4 py-2.5 rounded-lg border border-[var(--neutral-250)]" style={{ fontSize: '14px' }}>{step > 1 ? 'Previous' : 'Back to Intake'}</button>
            {step < 4 && <button onClick={() => setStep(step + 1)} className="px-4 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}>Next →</button>}
          </div>
        </div>
      </div>

      {showSubmit && (
        <AppModal
          title={`Submit ${appraisalLoan.id} to the Sanction Committee?`}
          subtitle="The appraisal note will be locked and cannot be edited after submission."
          icon={<ShieldCheck size={18} />}
          onClose={() => setShowSubmit(false)}
          footer={<><button onClick={() => setShowSubmit(false)} className="px-4 py-2.5 rounded-lg border border-[var(--neutral-250)]" style={{ fontSize: '14px' }}>Cancel</button><button onClick={() => { setShowSubmit(false); setSubmitted(true); toast.success(`${appraisalLoan.id} submitted to Sanction Committee`, { description: 'Appraisal note locked; Days Waiting reset from this stage-entry time.' }); }} className="px-4 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}>Confirm</button></>}
        >
          <div className="flex gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--warning-100)', color: 'var(--warning-700)', fontSize: '13px', lineHeight: '20px' }}>
            <AlertTriangle size={16} /> Confirming will move the Credit inbox row to Submitted to SC and append Submitted by: Amit Kulkarni with the current timestamp.
          </div>
        </AppModal>
      )}
    </Shell>
  );
}

function StepTitle({ title }: { title: string }) {
  return <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--neutral-900)' }}>{title}</h3>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-lg border border-[var(--neutral-250)] overflow-hidden"><div className="px-4 py-2.5" style={{ backgroundColor: 'var(--neutral-150)', fontSize: '13px', fontWeight: 700 }}>{title}</div><div className="grid grid-cols-2 gap-0">{children}</div></div>;
}

function Field({ label, value, mono, type }: { label: string; value: string; mono?: boolean; type?: string }) {
  return <div className="p-4 border-t border-r border-[var(--neutral-250)]"><div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: 700 }}>{label}</div><div style={{ fontSize: '14px', color: 'var(--neutral-900)', fontWeight: 700, marginTop: '5px', fontFamily: mono ? 'Roboto Mono' : 'inherit' }}>{type === 'radio' ? `● ${value}` : value}</div></div>;
}

function CalcInput({ label, value, onChange, suffix, step = 1 }: { label: string; value: number; onChange: (n: number) => void; suffix: string; step?: number }) {
  return <label className="block mb-3"><span style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: 700 }}>{label}</span><div className="flex items-center gap-2 mt-1"><input type="number" step={step} value={value} onChange={e => onChange(Number(e.target.value) || 0)} className="w-full px-3 rounded-md border border-[var(--neutral-300)]" style={{ height: '36px', fontSize: '14px', fontFamily: 'Roboto Mono' }} /><span style={{ fontSize: '11px', color: 'var(--neutral-500)' }}>{suffix}</span></div></label>;
}

function Metric({ label, value, color = 'var(--neutral-900)' }: { label: string; value: string; color?: string }) {
  return <div className="flex items-center justify-between py-2 border-b border-[var(--neutral-250)]"><span style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>{label}</span><span style={{ fontSize: '13px', color, fontWeight: 700, fontFamily: 'Roboto Mono' }}>{value}</span></div>;
}

function AmountBox({ label, value, note, highlight }: { label: string; value: number; note: string; highlight?: boolean }) {
  return <div className="p-4 rounded-lg" style={{ backgroundColor: highlight ? 'var(--green-50c)' : 'var(--neutral-150)', border: `1px solid ${highlight ? 'var(--green-700b)' : 'var(--neutral-250)'}` }}><div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: 700 }}>{label}</div><div style={{ fontSize: '22px', color: highlight ? 'var(--brand-primary)' : 'var(--brand-accent)', fontWeight: 700, fontFamily: 'Roboto Mono', marginTop: '6px' }}>{formatCurrency(value)}</div><div style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '4px' }}>{note}</div></div>;
}
