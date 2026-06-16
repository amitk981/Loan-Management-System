import { useState } from 'react';
import { CheckCircle, Copy, Info, Landmark, Receipt, Upload } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { AppModal } from '../shared/AppModal';
import { farmerLoan } from '../../data/farmerData';
import { formatCurrency } from '../../lib/format';

interface RepaymentScreenProps {
  onNavigate: (page: string) => void;
  activePage: string;
}


export function RepaymentScreen({ onNavigate, activePage }: RepaymentScreenProps) {
  const [method, setMethod] = useState<'direct' | 'subsidiary'>('direct');
  const [amount, setAmount] = useState('19500');
  const [utr, setUtr] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [receiptUploaded, setReceiptUploaded] = useState(false);

  const paymentAmount = parseFloat(amount) || 0;
  const principalAllocation = Math.min(paymentAmount, farmerLoan.outstandingPrincipal);
  const interestAllocation = Math.min(Math.max(paymentAmount - principalAllocation, 0), farmerLoan.outstandingInterest);
  const unallocated = Math.max(paymentAmount - principalAllocation - interestAllocation, 0);
  const canSubmit = paymentAmount > 0 && (method === 'subsidiary' || utr.trim().length >= 6);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const bankDetails = [
    { label: 'Account Name', value: 'Sahyadri Farmers Producer Company Limited', key: 'name' },
    { label: 'Account Number', value: '409002XXXXXXXX', key: 'acc' },
    { label: 'IFSC Code', value: 'RATN0000XXX', key: 'ifsc' },
    { label: 'Bank Name', value: 'RBL Bank', key: 'bank' },
  ];

  if (submitted) {
    return (
      <Shell activePage={activePage} onNavigate={onNavigate} breadcrumbs={['Farmer Portal', 'Payment Submitted']}>
        <div className="flex flex-col items-center justify-center min-h-80 text-center">
          <CheckCircle size={64} style={{ color: 'var(--success-500)', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--neutral-900)', marginBottom: '8px' }}>Payment Confirmation Received</h2>
          <p style={{ fontSize: '14px', color: 'var(--neutral-400)' }}>SFPCL will verify and post this payment to loan {farmerLoan.id} within 1 working day.</p>
          <button
            className="mt-6 px-6 py-2.5 rounded-xl font-semibold"
            style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}
            onClick={() => onNavigate('farmer-dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Farmer Portal', 'Make Payment']}
      pageTitle="Make a Payment"
      pageSubtitle={`Loan ${farmerLoan.id} · Outstanding ${formatCurrency(farmerLoan.outstandingBalance)}`}
    >
      <div className="farmer-page grid grid-cols-12 gap-6 items-start">
        <div className="col-span-8">
        <div className="farmer-hero p-6 mb-6">
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginBottom: '6px' }}>TOTAL OUTSTANDING</div>
          <div style={{ fontSize: '40px', fontWeight: 700, color: 'white', fontFamily: 'Roboto Mono' }}>{formatCurrency(farmerLoan.outstandingBalance)}</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginTop: '4px' }}>
            Principal: {formatCurrency(farmerLoan.outstandingPrincipal)} + Interest: {formatCurrency(farmerLoan.outstandingInterest)}
          </div>
          <div className="mt-4 flex gap-3 flex-wrap">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)' }}>Suggested Due</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#FCD34D', fontFamily: 'Roboto Mono' }}>₹19,500</div>
            </div>
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)' }}>Due Date</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'white' }}>{farmerLoan.nextDueDate}</div>
            </div>
          </div>
        </div>

        <div className="farmer-panel p-5 mb-5">
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--neutral-900)', marginBottom: '12px' }}>Payment Method</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'direct' as const, label: 'Direct Transfer', subtitle: 'NEFT / RTGS to SFPCL account', icon: <Landmark size={20} /> },
              { id: 'subsidiary' as const, label: 'Subsidiary Deduction', subtitle: 'Deduct from Sahyadri Post Harvest payout', icon: <Receipt size={20} /> },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className="p-4 rounded-xl border-2 text-left transition-all"
                style={{ borderColor: method === m.id ? 'var(--brand-primary)' : 'var(--neutral-200)', backgroundColor: method === m.id ? 'var(--success-50)' : 'white' }}
              >
                <div style={{ color: 'var(--brand-primary)', marginBottom: '8px' }}>{m.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--neutral-900)' }}>{m.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--neutral-400)', marginTop: '2px' }}>{m.subtitle}</div>
              </button>
            ))}
          </div>
        </div>

        {method === 'direct' && (
          <div className="farmer-panel p-5 mb-5">
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--neutral-900)', marginBottom: '12px' }}>SFPCL Bank Details</h3>
            <div className="space-y-3">
              {bankDetails.map(detail => (
                <div key={detail.key} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: 'var(--neutral-100)' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--neutral-400)', fontWeight: 600 }}>{detail.label}</div>
                    <div style={{ fontSize: '14px', color: 'var(--neutral-900)', fontFamily: detail.key === 'acc' || detail.key === 'ifsc' ? 'Roboto Mono' : 'inherit', fontWeight: 600 }}>{detail.value}</div>
                  </div>
                  <button onClick={() => copyToClipboard(detail.value, detail.key)} className="p-2 rounded-lg hover:bg-[#EDEEF0] transition-all">
                    {copied === detail.key ? <CheckCircle size={14} style={{ color: 'var(--success-500)' }} /> : <Copy size={14} style={{ color: 'var(--neutral-400)' }} />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="farmer-panel p-5 mb-5">
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--neutral-900)', marginBottom: '12px' }}>Payment Details</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--neutral-700)' }}>Amount</label>
              <input value={amount} onChange={e => setAmount(e.target.value)} type="number" className="w-full px-4 rounded-xl border border-[#D1D5DB] focus:outline-none focus:border-[#1A3C2A]" style={{ height: '48px', fontSize: '22px', fontFamily: 'Roboto Mono', fontWeight: 700, color: 'var(--neutral-900)' }} />
            </div>
            <div>
              <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--neutral-700)' }}>UTR / Reference</label>
              <input value={utr} onChange={e => setUtr(e.target.value)} disabled={method === 'subsidiary'} placeholder={method === 'subsidiary' ? 'Generated by subsidiary posting' : 'Enter UTR number'} className="w-full px-4 rounded-xl border border-[#D1D5DB] disabled:bg-[#F7F8FA]" style={{ height: '48px', fontSize: '14px', fontFamily: 'Roboto Mono', color: 'var(--neutral-900)' }} />
            </div>
          </div>
          <div className="flex gap-2 mb-4 flex-wrap">
            {[2000, 19500, farmerLoan.outstandingBalance].map(value => (
              <button key={value} onClick={() => setAmount(String(value))} className="px-3 py-1.5 rounded-full" style={{ backgroundColor: 'var(--brand-light)', color: 'var(--brand-primary)', fontSize: '12px', fontWeight: 700 }}>
                {formatCurrency(value)}
              </button>
            ))}
          </div>
          <div className="p-3 rounded-xl flex items-start gap-2 mb-4" style={{ backgroundColor: 'var(--info-100)', border: '1px solid #BFDBFE' }}>
            <Info size={14} style={{ color: 'var(--info-500)', marginTop: '2px', flexShrink: 0 }} />
            <p style={{ fontSize: '12px', color: 'var(--info-900)', lineHeight: '18px' }}>Payments are allocated first to principal, then to interest. This preview updates as you edit the amount.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              ['Principal', principalAllocation],
              ['Interest', interestAllocation],
              ['Excess / Advance', unallocated],
            ].map(([label, value]) => (
              <div key={label as string} className="p-3 rounded-xl" style={{ backgroundColor: 'var(--neutral-100)', border: '1px solid #EDEEF0' }}>
                <div style={{ fontSize: '11px', color: 'var(--neutral-400)', fontWeight: 700 }}>{label}</div>
                <div style={{ fontSize: '18px', color: 'var(--neutral-900)', fontWeight: 700, fontFamily: 'Roboto Mono', marginTop: '4px' }}>{formatCurrency(value as number)}</div>
              </div>
            ))}
          </div>
          {method === 'direct' && (
            <button type="button" onClick={() => setReceiptUploaded(true)} className="w-full mt-4 border-2 border-dashed rounded-xl p-4 flex items-center gap-2 text-left hover:bg-[#F0FDF4]" style={{ borderColor: receiptUploaded ? 'var(--success-500)' : 'var(--neutral-300)', backgroundColor: receiptUploaded ? 'var(--success-50)' : '#FAFAFA' }}>
              {receiptUploaded ? <CheckCircle size={18} style={{ color: 'var(--success-500)' }} /> : <Upload size={18} style={{ color: 'var(--neutral-400)' }} />}
              <span style={{ fontSize: '13px', color: receiptUploaded ? 'var(--success-700)' : 'var(--neutral-700)', fontWeight: receiptUploaded ? 700 : 400 }}>
                {receiptUploaded ? 'Receipt attached for verification' : 'Upload UTR screenshot or payment receipt'}
              </span>
            </button>
          )}
        </div>

        <button
          onClick={() => setShowConfirm(true)}
          disabled={!canSubmit}
          className="w-full py-3 rounded-xl font-semibold transition-all hover:opacity-90"
          style={{ backgroundColor: canSubmit ? 'var(--brand-primary)' : 'var(--neutral-400)', color: 'white', fontSize: '15px', cursor: canSubmit ? 'pointer' : 'not-allowed' }}
        >
          Review Payment Confirmation
        </button>
        </div>

        <aside className="col-span-4 farmer-panel p-5 sticky top-4">
          <div className="farmer-kicker">Payment Preview</div>
          <div className="mt-3 space-y-3">
            {[
              ['Amount', formatCurrency(paymentAmount)],
              ['Method', method === 'direct' ? 'Direct Transfer' : 'Subsidiary Deduction'],
              ['Principal', formatCurrency(principalAllocation)],
              ['Interest', formatCurrency(interestAllocation)],
              ['Reference', method === 'subsidiary' ? 'Auto generated' : utr || 'Pending'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3 py-2 border-b border-[#E4E7EC] last:border-b-0">
                <span style={{ fontSize: '12px', color: '#667085', fontWeight: 700 }}>{label}</span>
                <span style={{ fontSize: '13px', color: '#111827', fontWeight: 850, textAlign: 'right', fontFamily: label === 'Amount' || label === 'Principal' || label === 'Interest' ? 'Roboto Mono' : 'inherit' }}>{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 p-4 rounded-xl" style={{ backgroundColor: canSubmit ? 'var(--success-50)' : '#FFF7ED', border: `1px solid ${canSubmit ? 'var(--success-200)' : '#FED7AA'}` }}>
            <div style={{ fontSize: '13px', fontWeight: 850, color: canSubmit ? 'var(--success-700)' : '#9A3412' }}>
              {canSubmit ? 'Ready to review' : 'Reference needed'}
            </div>
            <div style={{ fontSize: '12px', color: '#667085', lineHeight: '18px', marginTop: '5px' }}>
              {canSubmit ? 'Submit after checking the allocation and bank reference.' : 'Enter a UTR of at least 6 characters, or choose subsidiary deduction.'}
            </div>
          </div>
        </aside>
      </div>

      {showConfirm && (
        <AppModal
          title="Confirm Payment"
          subtitle={`${formatCurrency(paymentAmount)} · ${method === 'direct' ? 'Direct Transfer' : 'Subsidiary Deduction'} · ${farmerLoan.id}`}
          icon={<Receipt size={18} />}
          onClose={() => setShowConfirm(false)}
          footer={
            <>
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2.5 rounded-xl border border-[#EDEEF0]" style={{ fontSize: '14px' }}>Edit</button>
              <button onClick={() => { setShowConfirm(false); setSubmitted(true); }} className="px-4 py-2.5 rounded-xl font-semibold" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}>Submit</button>
            </>
          }
        >
          <div className="space-y-2" style={{ fontSize: '13px', color: 'var(--neutral-700)', lineHeight: '20px' }}>
            <div>Principal allocation: <strong>{formatCurrency(principalAllocation)}</strong></div>
            <div>Interest allocation: <strong>{formatCurrency(interestAllocation)}</strong></div>
            {unallocated > 0 && <div>Advance/excess: <strong>{formatCurrency(unallocated)}</strong></div>}
            {method === 'direct' && <div>Receipt: <strong>{receiptUploaded ? 'Attached' : 'Not attached'}</strong></div>}
            <div>SFPCL will verify this before posting it to your ledger.</div>
          </div>
        </AppModal>
      )}
    </Shell>
  );
}
