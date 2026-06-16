import { useState } from 'react';
import { Check, CheckCircle, Eye, Lock, Send, XCircle } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { GateBanner } from '../shared/GateBanner';
import { disbursementLoan, preflightGates } from '../../data/treasuryData';
import { formatCurrency } from '../../lib/format';

interface DisbursementScreenProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

const steps = [
  ['Pre-flight', 'Checklist'],
  ['Beneficiary', 'Verification'],
  ['Initiate', 'Payment'],
  ['Authorize', 'Payment'],
  ['SAP Entry', 'Confirm'],
  ['Complete', 'Done'],
];


export function DisbursementScreen({ onNavigate, activePage }: DisbursementScreenProps) {
  const [step, setStep] = useState(1);
  const [remarks, setRemarks] = useState(`Loan disbursement — SFPCL Member Credit — Ref: ${disbursementLoan.id}`);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [sapConfirmed, setSapConfirmed] = useState(false);
  const [gatesPassed, setGatesPassed] = useState(false); // Simulation toggle
  const mode = disbursementLoan.amount <= 200000 ? 'NEFT' : 'RTGS';

  const handleOtp = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    setOtp(prev => prev.map((d, idx) => idx === i ? val : d));
    if (val && i < 5) document.getElementById(`treasury-otp-${i + 1}`)?.focus();
  };

  return (
    <Shell activePage={activePage} onNavigate={onNavigate} breadcrumbs={['Treasury', 'Disbursement Queue', disbursementLoan.id]} pageTitle={`Disbursement — ${disbursementLoan.id}`} pageSubtitle={`${disbursementLoan.borrower} · ${formatCurrency(disbursementLoan.amount, true)}`}>
      <div className="sticky top-0 z-10 bg-white border border-[#EDEEF0] rounded-lg p-4 mb-5">
        <div className="flex items-start">
          {steps.map(([title, hint], i) => {
            const idx = i + 1;
            return (
              <div key={title} className="flex items-start flex-1">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: step > idx ? 'var(--success-500)' : step === idx ? 'var(--accent-treasury)' : 'var(--neutral-200)', color: step >= idx ? 'white' : 'var(--neutral-400)', fontWeight: 700 }}>{step > idx ? <Check size={15} /> : idx}</div>
                  <div style={{ fontSize: '12px', color: step >= idx ? 'var(--accent-treasury)' : 'var(--neutral-500)', fontWeight: step === idx ? 900 : 600, marginTop: 6 }}>{title}</div>
                  <div style={{ fontSize: '10px', color: 'var(--neutral-400)' }}>{hint}</div>
                </div>
                {i < steps.length - 1 && <div className="flex-1 h-1 mx-2 mt-4 rounded-full" style={{ backgroundColor: step > idx ? 'var(--success-500)' : 'var(--neutral-200)' }} />}
              </div>
            );
          })}
        </div>
      </div>

      {step === 1 && (
        <div className="grid grid-cols-5 gap-5">
          <div className="col-span-3 bg-white rounded-lg border border-[#EDEEF0] overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-[#EDEEF0] flex items-center justify-between">
              <div><h3 style={{ fontSize: 18, fontWeight: 700 }}>Pre-Disbursement Verification</h3><p style={{ fontSize: 13, color: 'var(--neutral-500)' }}><span style={{ fontFamily: 'Roboto Mono', color: 'var(--accent-treasury)' }}>{disbursementLoan.id}</span> · {disbursementLoan.borrower}</p></div>
              <label className="flex items-center gap-2 cursor-pointer bg-[#F7F8FA] px-3 py-1.5 rounded-lg border border-[#EDEEF0]">
                <input type="checkbox" checked={gatesPassed} onChange={e => setGatesPassed(e.target.checked)} style={{ accentColor: 'var(--success-500)' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--neutral-700)' }}>Simulate Gates Passed</span>
              </label>
            </div>
            
            {!gatesPassed && (
              <div className="p-4" style={{ borderBottom: '1px solid #FECACA' }}>
                <GateBanner
                  variant="blocked"
                  title="Disbursement blocked — Checklist not fully signed"
                  detail="SOP §4.13 / §5.3: funds cannot move until the Checklist carries all four signatures (CS, Credit Manager, Sanction Committee, Sr. Manager–Finance) and stamping is complete. Resolve the pending gate below to proceed."
                  action={{ label: 'Open Checklist', onClick: () => onNavigate('cs-signoff') }}
                />
              </div>
            )}

            <div className="p-5 space-y-3 flex-1">
              {preflightGates.map(([label, note, link], i) => {
                const isFailedGate = i === 4 && !gatesPassed;
                return (
                  <div key={label} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: isFailedGate ? '#FFFBEB' : 'var(--success-50)', borderLeft: `3px solid ${isFailedGate ? 'var(--warning-500)' : 'var(--success-500)'}` }}>
                    <CheckCircle size={22} style={{ color: isFailedGate ? 'var(--gold-500)' : 'var(--success-500)' }} />
                    <div className="flex-1"><div style={{ fontSize: 14, color: 'var(--neutral-900)', fontWeight: 800 }}>{label}</div><div style={{ fontSize: 12, color: 'var(--neutral-500)' }}>{isFailedGate ? 'Pending CS final sign-off' : note}</div></div>
                    <button style={{ fontSize: 12, color: 'var(--accent-treasury)', fontWeight: 800 }}>{link}</button>
                  </div>
                );
              })}
            </div>
            <div className="p-5 border-t border-[#EDEEF0] bg-[#F7F8FA]">
              <button disabled={!gatesPassed} onClick={() => setStep(2)} className="w-full py-3 rounded-lg font-semibold transition-all" style={{ backgroundColor: gatesPassed ? 'var(--accent-treasury)' : 'var(--neutral-400)', color: 'white', cursor: gatesPassed ? 'pointer' : 'not-allowed' }}>{gatesPassed ? 'Proceed to Beneficiary Verification →' : 'Blocked — Resolve Gates First'}</button>
            </div>
          </div>
          <LoanSummary />
        </div>
      )}

      {step === 2 && (
        <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 border border-[#EDEEF0]">
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Beneficiary Bank Account Verification</h3>
          <div className="border-2 border-[#EDEEF0] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#EDEEF0]" style={{ backgroundColor: 'var(--neutral-100)' }}><strong>Beneficiary Bank Details — {disbursementLoan.borrower}</strong><div style={{ fontSize: 12, color: 'var(--neutral-500)' }}>Source: Application Form (Cancelled Cheque)</div></div>
            <div className="grid grid-cols-2 gap-0">
              {[
                ['Account Holder Name', disbursementLoan.accountHolder],
                ['Bank Name', disbursementLoan.bank],
                ['Branch', disbursementLoan.branch],
                ['Account Number', disbursementLoan.account],
                ['IFSC Code', disbursementLoan.ifsc],
                ['Account Type', 'Savings'],
              ].map(([label, value]) => <Info key={label} label={label} value={value} mono={label.includes('Account') || label.includes('IFSC')} />)}
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--success-50)', color: 'var(--success-700)', fontSize: 13, fontWeight: 800 }}>✓ Matches cancelled cheque submitted</div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--info-50)', color: '#0E7490', fontSize: 13, fontWeight: 800 }}>✓ Penny drop verification passed</div>
            </div>
          </div>
          <div className="mt-4"><label style={{ fontSize: 13, fontWeight: 800 }}>Debit From (SFPCL Account)</label><select className="w-full mt-1 px-3 rounded-lg border border-[#D1D5DB] bg-white" style={{ height: 42 }}><option>SFPCL — RBL Bank · A/C XXXX-XXXX-8842 · Operating A/C</option></select><p style={{ fontSize: 12, color: 'var(--neutral-500)', marginTop: 5 }}>This is the company's designated disbursement account per SOP §5.3</p></div>
          <div className="flex gap-3 mt-5"><button onClick={() => setStep(1)} className="px-4 py-2.5 rounded-lg border border-[#EDEEF0]">← Back</button><button onClick={() => setStep(3)} className="flex-1 py-2.5 rounded-lg font-semibold" style={{ backgroundColor: 'var(--accent-treasury)', color: 'white' }}>Proceed to Payment Initiation →</button></div>
        </div>
      )}

      {step === 3 && (
        <div className="grid grid-cols-11 gap-5">
          <div className="col-span-6 bg-white rounded-lg p-5 border border-[#EDEEF0]">
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Initiate Payment</h3><p style={{ fontSize: 13, color: 'var(--neutral-500)', marginBottom: 16 }}>Initiated by: Sr. Manager – Finance · Maker role</p>
            <Field label="Disbursement Amount" value={formatCurrency(disbursementLoan.amount, true)} note="Sanctioned by CFO + Director — cannot be edited" mono large />
            <div className="mb-4">
              <label style={{ fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>Payment Mode <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F3F4F6', color: 'var(--neutral-500)', fontSize: 10 }}>Auto-selected</span></label>
              <div className="grid grid-cols-2 gap-3 mt-2" title="Payment mode is auto-selected based on loan amount (NEFT for ≤₹2L, RTGS for >₹2L)">
                {['NEFT', 'RTGS'].map(m => (
                  <div key={m} className="p-4 rounded-lg border-2 relative overflow-hidden" style={{ borderColor: mode === m ? 'var(--accent-treasury)' : 'var(--neutral-200)', backgroundColor: mode === m ? 'var(--info-50)' : 'var(--neutral-100)', opacity: mode === m ? 1 : 0.6, cursor: 'not-allowed' }}>
                    <strong>{m}</strong>
                    <div style={{ fontSize: 12, color: 'var(--neutral-500)' }}>{m === 'NEFT' ? 'Typically 2-4 hrs' : 'Same day'}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4"><label style={{ fontSize: 13, fontWeight: 800 }}>Transaction Remarks</label><input value={remarks} onChange={e => setRemarks(e.target.value.slice(0, 100))} className="w-full mt-1 px-3 rounded-lg border border-[#D1D5DB]" style={{ height: 42 }} /><div style={{ fontSize: 11, color: 'var(--neutral-500)', textAlign: 'right' }}>{remarks.length}/100</div></div>
            <Field label="Initiation Date & Time" value="10 Jun 2026 · 10:15 AM" />
            <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: 'var(--info-50)', color: '#0E7490', fontSize: 13, fontWeight: 800 }}>Chief Financial Controller authorization required</div>
            <div className="flex gap-3"><button onClick={() => setStep(2)} className="px-4 py-2.5 rounded-lg border border-[#EDEEF0]">← Back</button><button onClick={() => setStep(4)} className="flex-1 py-2.5 rounded-lg font-semibold" style={{ backgroundColor: 'var(--accent-treasury)', color: 'white' }}><Send size={15} style={{ display: 'inline', marginRight: 6 }} />Send to Finance Controller for Authorization →</button></div>
          </div>
          <div className="col-span-5 bg-[#F7F8FA] rounded-lg p-5 border border-[#EDEEF0] sticky top-24 self-start">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Payment Preview</h3>
            {[
              ['FROM', 'SFPCL · RBL Bank · XXXX-8842'],
              ['TO', `${disbursementLoan.borrower} · SBI · XXXX-4821`],
              ['AMOUNT', formatCurrency(disbursementLoan.amount, true)],
              ['MODE', mode],
              ['REF', disbursementLoan.id],
            ].map(([label, value]) => <Preview key={label} label={label} value={value} />)}
            <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'white', fontFamily: 'Roboto Mono', fontSize: 12, color: 'var(--neutral-700)' }}>Dr: Member Loan A/c ({disbursementLoan.id}) {formatCurrency(disbursementLoan.amount)}<br />Cr: RBL Bank A/c {formatCurrency(disbursementLoan.amount)}</div>
            <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--warning-100)', color: 'var(--warning-700)', fontSize: 13, fontWeight: 800 }}>⏳ Awaiting CFC Authorization</div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="max-w-3xl mx-auto bg-white rounded-lg p-6 border border-[#EDEEF0]">
          <div className="flex items-center gap-3 mb-4"><Lock size={24} style={{ color: 'var(--accent-treasury)' }} /><h3 style={{ fontSize: 18, fontWeight: 700 }}>Chief Financial Controller Authorization</h3></div>
          <div className="p-4 rounded-lg mb-5" style={{ backgroundColor: 'var(--info-50)', color: '#0E7490' }}>2FA is mandatory. Finance Manager cannot authorize own transaction. OTP expires in 4:32.</div>
          <div className="grid grid-cols-2 gap-3 mb-5">{[['Borrower', disbursementLoan.borrower], ['Amount', formatCurrency(disbursementLoan.amount, true)], ['Mode', mode], ['Initiated By', 'Rajesh Kulkarni']].map(([l, v]) => <Info key={l} label={l} value={v} />)}</div>
          <div className="flex justify-center gap-2 mb-5">{otp.map((digit, i) => <input key={i} id={`treasury-otp-${i}`} aria-label={`OTP digit ${i + 1}`} value={digit} onChange={e => handleOtp(i, e.target.value)} maxLength={1} className="text-center rounded-lg border border-[#D1D5DB]" style={{ width: 52, height: 56, fontSize: 22, fontFamily: 'Roboto Mono' }} />)}</div>
          <div className="grid grid-cols-2 gap-3"><button onClick={() => setStep(5)} className="py-3 rounded-lg font-semibold" style={{ backgroundColor: 'var(--success-500)', color: 'white' }}>Authorize & Execute Payment</button><button className="py-3 rounded-lg font-semibold" style={{ backgroundColor: 'var(--error-100)', color: 'var(--error-900)' }}><XCircle size={16} style={{ display: 'inline', marginRight: 6 }} />Reject / Hold</button></div>
        </div>
      )}

      {step === 5 && (
        <div className="max-w-3xl mx-auto bg-white rounded-lg p-6 border border-[#EDEEF0]">
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>SAP Entry Confirmation</h3><p style={{ fontSize: 13, color: 'var(--neutral-500)', marginBottom: 16 }}>Post the disbursement entry to maintain accurate financial records</p>
          <pre className="rounded-lg p-5 overflow-x-auto" style={{ backgroundColor: '#1A1A2E', color: 'white', fontFamily: 'Roboto Mono', fontSize: 13, lineHeight: '22px' }}>{`SAP Journal Entry — Auto-Generated
═══════════════════════════════════════
Transaction Code : FB01
Document Type    : ZL (Loan Disbursement)
Posting Date     : 10.06.2026
Company Code     : SFPCL
─────────────────────────────────────────
1  10001482  Member Loan A/c  Dr  ${formatCurrency(disbursementLoan.amount)}
   Customer: ${disbursementLoan.sapCode}
   Ref: ${disbursementLoan.id} · ${disbursementLoan.borrower}
2  11002001  RBL Bank A/c     Cr  ${formatCurrency(disbursementLoan.amount)}
─────────────────────────────────────────
Status: Pending Confirmation
Posted by: Rajesh Kulkarni`}</pre>
          <label className="flex gap-3 mt-5" style={{ fontSize: 13, color: 'var(--neutral-700)' }}><input type="checkbox" checked={sapConfirmed} onChange={e => setSapConfirmed(e.target.checked)} style={{ accentColor: 'var(--accent-treasury)' }} />I confirm the journal entry is accurate and the disbursement has been completed.</label>
          <div className="flex gap-3 mt-5"><button className="px-4 py-2.5 rounded-lg border border-[#EDEEF0]" style={{ color: 'var(--error-500)' }}>Report Discrepancy</button><button disabled={!sapConfirmed} onClick={() => setStep(6)} className="flex-1 py-2.5 rounded-lg font-semibold" style={{ backgroundColor: sapConfirmed ? 'var(--brand-secondary)' : 'var(--neutral-400)', color: 'white' }}>Confirm SAP Entry</button></div>
        </div>
      )}

      {step === 6 && (
        <div className="max-w-2xl mx-auto bg-white rounded-lg p-8 border-2 border-[#22C55E] text-center">
          <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-5" style={{ backgroundColor: 'var(--success-100)' }}><Check size={48} style={{ color: 'var(--success-500)' }} /></div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--success-500)' }}>Disbursement Complete!</h2>
          <p style={{ fontSize: 15, color: 'var(--neutral-700)', marginTop: 6 }}>{formatCurrency(disbursementLoan.amount, true)} disbursed to {disbursementLoan.borrower} · {disbursementLoan.id}</p>
          <div className="text-left p-4 rounded-lg mt-5" style={{ backgroundColor: 'var(--success-50)', border: '1px solid #BBF7D0' }}>
            {[
              ['Transaction Reference', 'TXN20260610-0047'],
              ['UTR Number', 'NEFT20260610-82910'],
              ['Beneficiary Account', 'SBI · XXXX-4821'],
              ['Disbursement Time', '10 Jun 2026 · 10:58 AM'],
              ['SAP Entry', 'Posted ✓'],
            ].map(([l, v]) => <Preview key={l} label={l} value={v} />)}
          </div>
          <div className="mt-5 space-y-2 text-left">{['Loan register updated (Active Loans)', 'Disbursement advice generated — farmer notified via SMS + app', 'Loan stage tracker updated: Stage 5 Disbursed', 'Farmer notification sent'].map(item => <div key={item} style={{ fontSize: 13, color: 'var(--success-700)', fontWeight: 700 }}>✓ {item}</div>)}</div>
          <div className="flex gap-3 mt-6"><button className="flex-1 py-2.5 rounded-lg" style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}>Download Disbursement Advice</button><button onClick={() => onNavigate('treasury-pending')} className="flex-1 py-2.5 rounded-lg border border-[#EDEEF0]">Go to Queue</button><button onClick={() => onNavigate('treasury-dashboard')} className="flex-1 py-2.5 rounded-lg border border-[#EDEEF0]">Dashboard</button></div>
        </div>
      )}
    </Shell>
  );
}

function LoanSummary() {
  return (
    <div className="col-span-2 bg-white rounded-lg p-5 border border-[#EDEEF0] sticky top-24 self-start">
      <div className="flex items-center justify-between mb-4"><h3 style={{ fontSize: 15, fontWeight: 700 }}>Loan Summary</h3><span className="px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--info-50)', color: 'var(--accent-treasury)', fontSize: 11, fontWeight: 800 }}>Stage 5: Disbursement</span></div>
      {[
        ['Loan ID', disbursementLoan.id], ['Borrower', disbursementLoan.borrower], ['Folio No.', disbursementLoan.folio], ['Sanctioned Amt', formatCurrency(disbursementLoan.amount)], ['Loan Type', disbursementLoan.type], ['Purpose', disbursementLoan.purpose], ['Interest Rate', disbursementLoan.rate], ['Repayment Date', disbursementLoan.repaymentDate], ['Sanction Date', disbursementLoan.sanctionDate], ['Authority', disbursementLoan.authority],
      ].map(([label, value]) => <Preview key={label} label={label} value={value} />)}
      <div className="border-t border-[#EDEEF0] mt-4 pt-4" style={{ fontSize: 13, color: 'var(--success-700)', lineHeight: '24px' }}>✓ SH-4 Form held<br />✓ Blank cheque in custody<br />✓ PoA notarized</div>
    </div>
  );
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return <div className="p-3 border-b border-r border-[#EDEEF0]"><div style={{ fontSize: 11, color: 'var(--neutral-400)', fontWeight: 800 }}>{label}</div><div style={{ fontSize: 13, color: 'var(--neutral-900)', fontWeight: 800, marginTop: 4, fontFamily: mono ? 'Roboto Mono' : 'inherit' }}>{value}</div></div>;
}

function Field({ label, value, note, mono, large }: { label: string; value: string; note?: string; mono?: boolean; large?: boolean }) {
  return <div className="mb-4"><label style={{ fontSize: 13, fontWeight: 800 }}>{label}</label><div className="mt-1 px-3 rounded-lg border border-[#EDEEF0] bg-[#F7F8FA] flex items-center" style={{ height: large ? 56 : 42, fontFamily: mono ? 'Roboto Mono' : 'inherit', fontSize: large ? 24 : 14, fontWeight: 700 }}>{value}</div>{note && <div style={{ fontSize: 12, color: 'var(--neutral-500)', marginTop: 4 }}>{note}</div>}</div>;
}

function Preview({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4 py-2 border-b border-[#EDEEF0] last:border-0"><span style={{ fontSize: 11, color: 'var(--neutral-400)', fontWeight: 800 }}>{label}</span><span style={{ fontSize: 13, color: 'var(--neutral-900)', fontWeight: 800, textAlign: 'right', fontFamily: label.includes('AMOUNT') || label.includes('Reference') || label.includes('UTR') ? 'Roboto Mono' : 'inherit' }}>{value}</span></div>;
}
