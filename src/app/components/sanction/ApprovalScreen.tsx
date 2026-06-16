import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, Printer, RotateCcw, XCircle } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from '../shared/StatusBadge';
import { AppModal } from '../shared/AppModal';
import { scReviewLoan, scScrutinyItems } from '../../data/sanctionData';
import { DirectorCaseBanner } from '../shared/CrossRoleComponents';
import { formatCurrency } from '../../lib/format';

interface ApprovalScreenProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

type Decision = 'approve' | 'reject' | 'return' | '';


export function ApprovalScreen({ onNavigate, activePage }: ApprovalScreenProps) {
  const isJoint = activePage === 'sc-joint';
  const [scrutiny, setScrutiny] = useState<boolean[]>(new Array(7).fill(false));
  const [decision, setDecision] = useState<Decision>('');
  const [approvedAmount, setApprovedAmount] = useState(String(isJoint ? 650000 : scReviewLoan.amount));
  const [comments, setComments] = useState('');
  const [registerChecked, setRegisterChecked] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [submitted, setSubmitted] = useState(false);

  const shareLimit = scReviewLoan.shares * 0.3 * scReviewLoan.navPerShare;
  const landLimit = scReviewLoan.landAcres * scReviewLoan.scaleOfFinance;
  const eligibleLimit = Math.min(shareLimit, landLimit);
  const allScrutinyDone = scrutiny.every(Boolean);
  const amountNum = Number(approvedAmount) || 0;
  const amountError = !isJoint && amountNum > scReviewLoan.amount;
  const commentsRequired = decision === 'reject' || decision === 'return';
  const canSubmit = allScrutinyDone && !!decision && registerChecked && !amountError && (!commentsRequired || comments.trim().length > 0);
  const isDirectorCase = scReviewLoan.borrower.includes('Ganesh') || scReviewLoan.borrower.includes('Vijay') || scReviewLoan.borrower.includes('Director');

  useEffect(() => {
    if (!showConfirm) return;
    setCountdown(3);
    const timer = window.setInterval(() => setCountdown(prev => Math.max(prev - 1, 0)), 1000);
    return () => window.clearInterval(timer);
  }, [showConfirm]);

  if (submitted) {
    return (
      <Shell activePage={activePage} onNavigate={onNavigate} breadcrumbs={['Sanction Committee', 'Decision Recorded']}>
        <div className="flex flex-col items-center justify-center min-h-80 text-center">
          <CheckCircle size={64} style={{ color: 'var(--success-500)', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--neutral-900)' }}>Decision Recorded</h2>
          <p style={{ fontSize: '14px', color: 'var(--neutral-500)', marginTop: '8px' }}>{scReviewLoan.id} · {formatCurrency(amountNum)} · {decision.toUpperCase()}</p>
          <div className="mt-5 p-4 rounded-lg text-left" style={{ backgroundColor: 'var(--success-50)', border: '1px solid var(--success-200)', fontSize: '13px', color: 'var(--success-700)', lineHeight: '22px' }}>
            {['Credit Sanction Register updated', 'CS Team notified', 'Farmer notification queued', 'Recorded by S. Nair (CFO)'].map(item => (
              <div key={item} className="flex items-center gap-2 py-1"><CheckCircle size={14} />{item}</div>
            ))}
          </div>
          <div className="flex gap-3 mt-6"><button onClick={() => onNavigate('sc-awaiting')} className="px-5 py-2.5 rounded-lg border border-[var(--neutral-200)]">Back to Approval Queue</button><button onClick={() => onNavigate('sc-register')} className="px-5 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--accent-sanction)', color: 'white' }}>View Sanction Register</button></div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Sanction Committee', isJoint ? 'Joint Approval' : 'Loan Review', scReviewLoan.id]}
      pageTitle={`Loan Review — ${isJoint ? 'LO00000096' : scReviewLoan.id} — ${isJoint ? 'Vijay More' : scReviewLoan.borrower} · ${formatCurrency(isJoint ? 650000 : scReviewLoan.amount)}`}
      pageSubtitle={`Submitted by: ${scReviewLoan.submittedBy} · ${scReviewLoan.submittedDate} · ${scReviewLoan.submittedAgo}`}
      actions={<div className="flex gap-2"><button onClick={() => onNavigate('sc-awaiting')} className="px-3 py-2 rounded-lg border border-[var(--neutral-200)] flex items-center gap-1.5" style={{ fontSize: '13px' }}><ArrowLeft size={14} /> Back</button><button className="px-3 py-2 rounded-lg border border-[var(--neutral-200)] flex items-center gap-1.5" style={{ fontSize: '13px' }}><Printer size={14} /> Print</button></div>}
    >
      {isDirectorCase && <div className="mb-5"><DirectorCaseBanner /></div>}
      {isJoint && (
        <div className="mb-5 p-4 rounded-lg" style={{ backgroundColor: 'var(--warning-100)', borderLeft: '4px solid var(--gold-500)' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--warning-700)' }}>Joint Approval Required — Amount Exceeds ₹5,00,000</div>
          <div className="grid grid-cols-3 gap-3 mt-3">
            {['S. Nair · CFO · Signed · 12-Oct-2025', 'R. Deshmukh · Director · Awaiting', 'V. Kulkarni · Director · Awaiting'].map((item, i) => <div key={item} className="p-2 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'white', fontSize: '12px', color: 'var(--neutral-700)', fontWeight: 700 }}><span className="w-2 h-2 rounded-full" style={{ backgroundColor: i === 0 ? 'var(--success-500)' : 'var(--warning-500)' }} />{item}</div>)}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--warning-700)', marginTop: '8px' }}>Current status: 1 of 3 signatures obtained. Loan cannot be disbursed until all 3 are recorded.</div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-5 space-y-4">
          <Panel title="Borrower Profile">
            <Info label="Name" value={scReviewLoan.borrower} />
            <Info label="Member" value={`Active since ${scReviewLoan.memberSince} · Folio ${scReviewLoan.folio}`} />
            <Info label="Location / Crop" value={`${scReviewLoan.village} · ${scReviewLoan.crop}`} />
            <Info label="KYC" value="PAN verified · Aadhaar verified · Re-KYC Due Nov 2027" />
          </Panel>
          <Panel title="Shareholding">
            <Info label="Shares held" value={`${scReviewLoan.shares}`} mono />
            <Info label="Share type" value={scReviewLoan.shareType} />
            <Info label="NAV per share" value={formatCurrency(scReviewLoan.navPerShare)} mono />
            <Info label="Total holding value" value={formatCurrency(scReviewLoan.shares * scReviewLoan.navPerShare)} mono />
          </Panel>
          <Panel title="Loan Eligibility Calculation">
            <Info label="Method 1" value={`${scReviewLoan.shares} shares × 30% × ₹2,000 = ${formatCurrency(shareLimit)}`} mono />
            <Info label="Method 2" value={`${scReviewLoan.landAcres} acres × ₹20,000 = ${formatCurrency(landLimit)}`} mono />
            <div className="col-span-2 p-4 rounded-lg" style={{ backgroundColor: 'var(--brand-light)', border: '1px solid var(--success-200)' }}>
              <div style={{ fontSize: '12px', color: 'var(--brand-secondary)', fontWeight: 700 }}>Eligible Limit: {formatCurrency(eligibleLimit)}</div>
              <div style={{ fontSize: '13px', color: 'var(--neutral-700)', marginTop: '4px' }}>Requested Amount: {formatCurrency(scReviewLoan.amount)} ← AT LIMIT</div>
            </div>
          </Panel>
          <Panel title="Loan Purpose & Prior History">
            <Info label="Purpose" value={scReviewLoan.purpose} />
            <Info label="Tenure / Repayment" value={`${scReviewLoan.tenure} · ${scReviewLoan.repaymentDate}`} />
            <Info label="Security" value={scReviewLoan.security} />
            <Info label="Prior loan" value={`${scReviewLoan.priorLoan.id} · ${formatCurrency(scReviewLoan.priorLoan.amount)} · Closed · 0 DPD`} />
          </Panel>
        </div>

        <div className="col-span-4 space-y-4">
          <Panel title="Appraisal Note">
            <Info label="Prepared by" value="Amit Kulkarni · Credit Manager" />
            <Info label="Recommendation" value={scReviewLoan.recommendation} />
            <Info label="Risk Summary" value="Clean prior history, land documents uploaded, amount equals land-based cap." />
            <Info label="Recommended Amount" value={formatCurrency(scReviewLoan.amount)} mono />
            <div className="col-span-2 p-3 rounded-lg" style={{ backgroundColor: 'var(--neutral-100)', fontSize: '13px', color: 'var(--neutral-700)', lineHeight: '20px' }}>{scReviewLoan.recommendationNote}</div>
          </Panel>
          <Panel title="Evidence">
            {['7/12 Extract uploaded', 'Crop Plan uploaded', '6 months Bank Statement uploaded', 'PoA prepared by CS', 'No Director/Relative borrower'].map(item => <div key={item} className="p-3 border-b border-[var(--neutral-200)] flex items-center gap-2" style={{ fontSize: '13px', color: 'var(--neutral-700)' }}><CheckCircle size={14} color="var(--success-500)" />{item}</div>)}
          </Panel>
        </div>

        <div className="col-span-3">
          <div className="bg-white rounded-lg border border-[var(--neutral-200)] sticky top-4 overflow-hidden" style={{ borderLeft: '4px solid var(--accent-sanction)' }}>
            <div className="p-4 border-b border-[var(--neutral-200)]">
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--neutral-900)' }}>Decision Panel</div>
              <div className="mt-2 space-y-2">
                {(isJoint ? ['S. Nair · CFO · Signed', 'R. Deshmukh · Director · Pending', 'V. Kulkarni · Director · Pending'] : ['S. Nair · CFO · You', 'R. Deshmukh · Director · Pending']).map((sig, i) => (
                  <div key={sig} className="px-2 py-1 rounded-full inline-flex mr-1" style={{ backgroundColor: i === 0 ? 'var(--success-100)' : 'var(--warning-100)', color: i === 0 ? 'var(--success-700)' : 'var(--warning-700)', fontSize: '11px', fontWeight: 700 }}>{sig}</div>
                ))}
              </div>
            </div>
            <div className="p-4">
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--neutral-900)', marginBottom: '10px' }}>7-Point Scrutiny Checklist</div>
              {scScrutinyItems.map(([label, note], i) => (
                <label key={label} className="block p-2 rounded-lg mb-2 cursor-pointer" style={{ backgroundColor: scrutiny[i] ? 'var(--success-50)' : 'white', border: '1px solid var(--neutral-200)' }}>
                  <div className="flex items-start gap-2">
                    <input aria-label={`Scrutiny point ${i + 1}: ${label}. Current state: ${scrutiny[i] ? 'Checked' : 'Unchecked'}`} type="checkbox" checked={scrutiny[i]} onChange={e => setScrutiny(prev => prev.map((v, idx) => idx === i ? e.target.checked : v))} style={{ accentColor: 'var(--success-500)', marginTop: '2px' }} />
                    <div><div style={{ fontSize: '12px', color: scrutiny[i] ? 'var(--success-700)' : 'var(--neutral-700)', fontWeight: 700 }}>{i + 1}. {label}</div><div style={{ fontSize: '11px', color: 'var(--neutral-500)', marginTop: '3px' }}>{note}</div></div>
                  </div>
                </label>
              ))}
              <div className="h-2 rounded-full my-3" style={{ backgroundColor: 'var(--neutral-200)' }}><div className="h-full rounded-full" style={{ width: `${(scrutiny.filter(Boolean).length / 7) * 100}%`, backgroundColor: 'var(--success-500)' }} /></div>
              <div style={{ fontSize: '12px', color: allScrutinyDone ? 'var(--success-700)' : 'var(--neutral-500)', fontWeight: 700 }}>{scrutiny.filter(Boolean)} of 7 {allScrutinyDone ? '✓ Ready to decide' : ''}</div>

              <div className="grid grid-cols-1 gap-2 mt-4">
                {[
                  { id: 'approve' as const, label: 'Approve', icon: <CheckCircle size={18} />, bg: 'var(--success-700)' },
                  { id: 'reject' as const, label: 'Reject', icon: <XCircle size={18} />, bg: 'var(--error-950)' },
                  { id: 'return' as const, label: 'Return for Clarification', icon: <RotateCcw size={18} />, bg: 'var(--navy-800)' },
                ].map(item => (
                  <button key={item.id} disabled={!allScrutinyDone} onClick={() => setDecision(item.id)} className="w-full px-3 py-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: allScrutinyDone ? item.bg : 'var(--neutral-200)', color: allScrutinyDone ? 'white' : 'var(--neutral-400)', opacity: decision && decision !== item.id ? 0.45 : 1, transform: decision === item.id ? 'scale(1.02)' : 'scale(1)', fontSize: '13px', fontWeight: 700, cursor: allScrutinyDone ? 'pointer' : 'not-allowed' }}>{item.icon}{item.label}</button>
                ))}
              </div>

              {decision === 'approve' && <div className="mt-4"><label style={{ fontSize: '12px', color: amountError ? 'var(--error-500)' : 'var(--neutral-700)', fontWeight: 700 }}>Approved Amount</label><input value={approvedAmount} onChange={e => setApprovedAmount(e.target.value)} className="w-full mt-1 px-3 rounded-lg border border-[var(--neutral-300)] text-right" style={{ height: '40px', fontSize: '16px', fontFamily: 'Roboto Mono' }} />{amountError && <div style={{ fontSize: '11px', color: 'var(--error-500)', marginTop: '4px' }}>Cannot exceed appraisal recommended amount of {formatCurrency(scReviewLoan.amount)}</div>}</div>}
              <div className="mt-4"><label style={{ fontSize: '12px', color: commentsRequired && !comments.trim() ? 'var(--error-500)' : 'var(--neutral-700)', fontWeight: 700 }}>SC Comments {commentsRequired && '(Required)'}</label><textarea value={comments} onChange={e => setComments(e.target.value)} rows={3} className="w-full mt-1 p-2 rounded-lg border border-[var(--neutral-300)]" placeholder="Required for Reject or Return; optional for Approve" style={{ fontSize: '13px' }} /></div>
              <label className="flex items-start gap-2 mt-4"><input type="checkbox" checked={registerChecked} onChange={e => setRegisterChecked(e.target.checked)} style={{ accentColor: 'var(--accent-sanction)', marginTop: '2px' }} /><span style={{ fontSize: '12px', color: 'var(--neutral-700)' }}>Record in Credit Sanction Register (mandatory)</span></label>
              <button disabled={!canSubmit} onClick={() => setShowConfirm(true)} className="w-full mt-4 py-3 rounded-lg font-medium" style={{ backgroundColor: canSubmit ? 'var(--accent-sanction)' : 'var(--neutral-400)', color: 'white', fontSize: '14px', cursor: canSubmit ? 'pointer' : 'not-allowed' }}>Submit Decision →</button>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <AppModal title="Confirm Sanction Committee Decision" subtitle={`${scReviewLoan.id} · ${scReviewLoan.borrower}`} icon={<CheckCircle size={18} />} onClose={() => setShowConfirm(false)} footer={<><button onClick={() => setShowConfirm(false)} className="px-4 py-2.5 rounded-lg border border-[var(--neutral-200)]">Cancel</button><button disabled={countdown > 0} onClick={() => { setShowConfirm(false); setSubmitted(true); }} className="px-4 py-2.5 rounded-lg font-medium" style={{ backgroundColor: countdown > 0 ? 'var(--neutral-400)' : 'var(--success-700)', color: 'white' }}>{countdown > 0 ? `Confirm in ${countdown}s` : 'Confirm & Record →'}</button></>}>
          <div style={{ fontSize: '13px', color: 'var(--neutral-700)', lineHeight: '22px' }}>
            Decision: <strong>{decision.toUpperCase()}</strong><br />Sanctioned Amount: <strong>{formatCurrency(amountNum)}</strong><br />Your authority: <strong>CFO</strong><br /><br />This decision will be recorded in the Credit Sanction Register, notify CS to begin documents, update the loan tracker, and be attributable to S. Nair as signing CFO.<br /><br /><span style={{ color: 'var(--error-500)', fontWeight: 700 }}>This action cannot be undone.</span>
          </div>
        </AppModal>
      )}
    </Shell>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return <div className="bg-white rounded-lg border border-[var(--neutral-200)] overflow-hidden"><div className="px-4 py-3 border-b border-[var(--neutral-200)]" style={{ backgroundColor: 'var(--neutral-100)', fontSize: '14px', fontWeight: 700, color: 'var(--neutral-900)' }}>{title}</div><div className="grid grid-cols-2 gap-0">{children}</div></div>;
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return <div className="p-3 border-b border-r border-[var(--neutral-200)]"><div style={{ fontSize: '11px', color: 'var(--neutral-400)', fontWeight: 700 }}>{label}</div><div style={{ fontSize: '13px', color: 'var(--neutral-900)', fontWeight: 700, marginTop: '4px', fontFamily: mono ? 'Roboto Mono' : 'inherit' }}>{value}</div></div>;
}
