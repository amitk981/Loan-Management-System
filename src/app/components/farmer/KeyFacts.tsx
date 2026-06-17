import { Percent, AlertTriangle, Receipt, CalendarClock, ShieldCheck, Scale, Info, ArrowRight } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { GateBanner } from '../shared/GateBanner';
import { useLanguage } from '../../context/LanguageContext';
import { farmerLoan } from '../../data/farmerData';

// Borrower-readable Key Facts / Term Sheet disclosure (audit DA-008).
// The SOP Term Sheet (§4.9, 13 fields) + Fair Practice Code require the rate, penal
// charges and key terms to be disclosed to the member in local language. This screen
// surfaces them in plain, translatable language — previously the Term Sheet was only a
// document tile with no readable rate/penal disclosure anywhere in the farmer flow.

interface KeyFactsProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

export function KeyFacts({ onNavigate, activePage }: KeyFactsProps) {
  const { t } = useLanguage();

  const facts: { icon: JSX.Element; label: string; value: string; note?: string }[] = [
    { icon: <Percent size={18} />, label: t('kf.interestRate', 'Interest rate'), value: farmerLoan.interestRate, note: `Floating — effective ${farmerLoan.interestRateEffective}. Rate changes are intimated by SMS / email.` },
    { icon: <AlertTriangle size={18} />, label: t('kf.penalInterest', 'Penal interest'), value: '2% p.a. additional', note: 'Charged on the overdue principal during the period it stays overdue.' },
    { icon: <Receipt size={18} />, label: t('kf.otherCharges', 'Other charges / fees'), value: '₹500 stamp + notarisation', note: 'Stamp duty on PoA and Loan Agreement (ad valorem under the Maharashtra Stamp Act); notarisation as applicable. No hidden charges.' },
    { icon: <CalendarClock size={18} />, label: t('kf.tenure', 'Tenure'), value: farmerLoan.tenure, note: `Repayment due ${farmerLoan.nextDueDate}. Partial repayments are applied to principal first, then interest.` },
    { icon: <ShieldCheck size={18} />, label: t('kf.security', 'Security'), value: 'Shares + undated cheque + NACH/ECS', note: 'SH-4 / CDSL pledge of your shares, one undated cheque, and a NACH/ECS auto-debit mandate. All are returned on full closure (NOC).' },
    { icon: <Scale size={18} />, label: t('kf.dispute', 'Dispute resolution'), value: 'Arbitration · Nashik', note: 'As set out in your Loan Agreement; you may also raise a grievance any time via Support.' },
  ];

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['My Loan', 'Key Facts']}
      pageTitle={t('kf.title', 'Key Facts Statement')}
      pageSubtitle={t('kf.subtitle', 'Your loan rate, charges and terms — in plain language')}
    >
      <div className="farmer-page">
        <div className="mb-5">
          <GateBanner
            variant="info"
            title={`${farmerLoan.id} · ${farmerLoan.purpose}`}
            detail="These are the key terms of your loan. By law (Fair Practice Code) SFPCL must show your interest rate and all charges clearly. If anything here is unclear, ask before you sign — your Credit Manager will explain."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {facts.map(f => (
            <div key={f.label} className="farmer-panel-tight p-4">
              <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--brand-primary)' }}>
                {f.icon}
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--neutral-550)' }}>{f.label}</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--neutral-950)' }}>{f.value}</div>
              {f.note && <div style={{ fontSize: '12px', color: 'var(--neutral-550)', marginTop: '4px', lineHeight: '18px' }}>{f.note}</div>}
            </div>
          ))}
        </div>

        {/* Interest capitalisation explainer (audit DA-009) */}
        <div className="mt-5 farmer-panel p-5">
          <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--warning-700)' }}>
            <Info size={16} />
            <span style={{ fontSize: '13px', fontWeight: 700 }}>What happens if interest is unpaid by 30 April</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--neutral-700)', lineHeight: '20px' }}>
            If your interest is not paid by 30 April of the next financial year, the unpaid interest is added to your principal,
            and the following year's interest is then charged on this revised (higher) principal. SFPCL informs you of this change
            by email / letter (SOP §6.1). Paying interest on time keeps your principal — and your total cost — lower.
          </p>
          <button
            onClick={() => onNavigate('farmer-repayment')}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '13px', fontWeight: 700 }}
          >
            {t('fd.payInstalment', 'Pay instalment')} <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </Shell>
  );
}
