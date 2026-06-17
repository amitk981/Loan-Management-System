import { useState } from 'react';
import { Plus, Download, FileText, TrendingUp, Clock, ChevronRight, Bell, BadgeIndianRupee, CheckCircle2, AlertCircle, Info, IdCard, AlertOctagon, Percent, CalendarClock, Wallet } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from '../shared/StatusBadge';
import { GateBanner } from '../shared/GateBanner';
import { LoanTracker } from '../shared/LoanTracker';
import { useLanguage } from '../../context/LanguageContext';
import { farmerDocuments, farmerEligibility, farmerLoan, farmerNotifications, farmerProfile, farmerTransactions } from '../../data/farmerData';
import { formatCurrency } from '../../lib/format';

interface FarmerDashboardProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

const notifIcons: Record<string, { icon: JSX.Element; bg: string; color: string; page: string }> = {
  repayment: { icon: <BadgeIndianRupee size={15} />, bg: 'var(--warning-100)', color: 'var(--warning-700)', page: 'farmer-repayment' },
  approval: { icon: <CheckCircle2 size={15} />, bg: 'var(--success-100)', color: 'var(--success-700)', page: 'farmer-active-loans' },
  document: { icon: <FileText size={15} />, bg: 'var(--info-100)', color: 'var(--info-900)', page: 'farmer-documents' },
  overdue: { icon: <AlertCircle size={15} />, bg: 'var(--error-100)', color: 'var(--error-900)', page: 'farmer-repayment' },
  info: { icon: <Info size={15} />, bg: 'var(--info-100)', color: 'var(--info-900)', page: 'notifications-center' },
  kyc: { icon: <IdCard size={15} />, bg: 'var(--warning-100)', color: 'var(--warning-700)', page: 'farmer-apply' },
};

export function FarmerDashboard({ onNavigate, activePage }: FarmerDashboardProps) {
  const { t } = useLanguage();

  const repaidPct = Math.round((farmerLoan.totalRepaid / farmerLoan.sanctionedAmount) * 100);

  // Loan state is now reachable from the UI (audit DA-002) via the "Preview state"
  // control below, instead of a hardcoded const that required a code edit to demo.
  type DemoState = 'active' | 'under-processing' | 'overdue' | 'no-loan' | 'kyc-blocked' | 'default-blocked';
  const [demo, setDemo] = useState<DemoState>('active');
  const demoOptions: { key: DemoState; label: string }[] = [
    { key: 'active', label: 'Active' },
    { key: 'under-processing', label: 'Processing' },
    { key: 'overdue', label: 'Overdue' },
    { key: 'no-loan', label: 'No loan' },
    { key: 'kyc-blocked', label: 'KYC expired' },
    { key: 'default-blocked', label: 'In default' },
  ];

  const loanState = demo === 'under-processing' ? 'under-processing' : demo === 'no-loan' ? 'no-loan' : 'active';
  const isOverdue = demo === 'overdue';
  const kycExpired = demo === 'kyc-blocked';
  const hasActiveDefault = demo === 'default-blocked';
  const noLoan = demo === 'no-loan';

  const DemoSwitcher = () => (
    <div className="mb-4 flex items-center gap-2 flex-wrap p-2 rounded-xl" style={{ backgroundColor: 'var(--neutral-100)', border: '1px dashed var(--neutral-300)' }}>
      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--neutral-500)', textTransform: 'uppercase', letterSpacing: '0.06em', paddingLeft: 4 }}>{t('fd.previewState', 'Preview state')}</span>
      {demoOptions.map(opt => (
        <button
          key={opt.key}
          onClick={() => setDemo(opt.key)}
          aria-pressed={demo === opt.key}
          className="px-3 py-1 rounded-lg transition-colors"
          style={{ fontSize: '12px', fontWeight: 500, backgroundColor: demo === opt.key ? 'var(--brand-primary)' : 'white', color: demo === opt.key ? 'white' : 'var(--neutral-700)', border: '1px solid var(--neutral-200)' }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : hour < 21 ? 'Good evening' : 'Hello';

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Dashboard']}
      pageTitle={`${greeting}, ${farmerProfile.firstName}`}
      pageSubtitle={`Member since ${farmerProfile.memberSince} · Folio ${farmerProfile.folioNo}`}
      actions={
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all hover:shadow-md active:scale-[0.98]"
          style={{
            backgroundColor: kycExpired ? 'var(--neutral-400)' : hasActiveDefault ? 'var(--neutral-400)' : 'var(--brand-primary)',
            color: 'white',
            fontSize: '14px',
            cursor: kycExpired || hasActiveDefault ? 'not-allowed' : 'pointer',
          }}
          onClick={() => !kycExpired && !hasActiveDefault && onNavigate('farmer-apply')}
          title={
            kycExpired
              ? 'Your KYC expired on 15 Mar 2025. Contact your Credit Manager to renew.'
              : hasActiveDefault
              ? 'You have an active default on LO000022. Contact your Credit Manager before applying.'
              : 'Apply for a new loan'
          }
        >
          <Plus size={16} /> {t('fd.applyForLoan', 'Apply for Loan')}
          {(kycExpired || hasActiveDefault) && <AlertOctagon size={14} />}
        </button>
      }
    >
      <div className="farmer-page">
        <DemoSwitcher />
        {/* KYC Expiry / Default Hard Block Banners (SOP gates via shared GateBanner) */}
        {kycExpired && (
          <GateBanner
            className="mb-4"
            variant="blocked"
            title="KYC expired — new loan applications blocked"
            detail="Your KYC expired on 15 Mar 2025. Re-KYC is required every 2 years (SOP §KYC). Visit your Credit Manager at the SFPCL office to renew."
            action={{ label: 'Contact Office', onClick: () => onNavigate('farmer-support') }}
          />
        )}
        {hasActiveDefault && (
          <GateBanner
            className="mb-4"
            variant="blocked"
            title="Active default — new loan blocked"
            detail="You have an active default on LO000022. No new loan can be disbursed to a borrower with an existing default (SOP §6). Contact your Credit Manager before applying."
          />
        )}
        {noLoan ? (
          <div className="farmer-panel p-8 text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--brand-light)' }}>
              <TrendingUp size={28} style={{ color: 'var(--brand-primary)' }} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--neutral-950)' }}>{t('fd.noLoanTitle', "You don't have an active loan yet")}</h2>
            <p style={{ fontSize: '14px', color: 'var(--neutral-500)', marginTop: '6px', maxWidth: 460, marginLeft: 'auto', marginRight: 'auto', lineHeight: '21px' }}>
              You're eligible for up to {formatCurrency(farmerEligibility.eligible)} based on your shareholding and land. Start a 5-step application — most members finish in under 10 minutes.
            </p>
            <button onClick={() => onNavigate('farmer-apply')} className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px', fontWeight: 700 }}>
              <Plus size={16} /> {t('fd.startFirst', 'Start your first application')}
            </button>
          </div>
        ) : (
        <>
        <div className="mb-6 p-4 rounded-xl border flex items-center justify-between" style={{ backgroundColor: isOverdue ? 'var(--error-50)' : 'var(--success-50)', borderColor: isOverdue ? 'var(--error-200)' : 'var(--success-200)' }}>
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm" style={{ backgroundColor: isOverdue ? 'var(--error-500)' : 'var(--success-500)' }}>{isOverdue ? '!' : '✓'}</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: isOverdue ? 'var(--error-700)' : 'var(--success-700)' }}>{isOverdue ? t('fd.overdueTitle', 'Instalment overdue — please pay to avoid penalty interest') : t('fd.goodStanding', 'Your loan is Active & in Good Standing')}</div>
              <div style={{ fontSize: '12px', color: 'var(--neutral-700)', marginTop: '2px' }}>{isOverdue ? 'Your instalment of ₹19,500 was due 31 Mar 2027. A 3-month grace period applies before default review (SOP §6.2).' : 'Next instalment of ₹19,500 is due by 31 Mar 2027.'}</div>
            </div>
          </div>
          <button onClick={() => onNavigate('farmer-repayment')} className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: isOverdue ? 'var(--error-500)' : 'var(--brand-primary)', fontSize: '13px', fontWeight: 700 }}>{isOverdue ? t('fd.payOverdue', 'Pay overdue amount') : t('fd.payNow', 'Pay Now')}</button>
        </div>
        {/* Loan-at-a-glance KPI strip — principal/interest split + rate + next due */}
        {loanState === 'active' && (
          <section className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: t('fd.kpiPrincipal', 'Outstanding principal'), value: formatCurrency(farmerLoan.outstandingPrincipal), sub: `of ${formatCurrency(farmerLoan.sanctionedAmount)} sanctioned`, icon: <Wallet size={16} />, color: 'var(--brand-primary)' },
              { label: t('fd.kpiInterest', 'Interest accrued'), value: formatCurrency(farmerLoan.outstandingInterest), sub: t('fd.kpiInterestSub', 'Billed via FY invoice'), icon: <BadgeIndianRupee size={16} />, color: 'var(--accent-sanction)' },
              { label: t('fd.kpiRate', 'Interest rate'), value: '12% p.a.', sub: `Floating · eff. ${farmerLoan.interestRateEffective}`, icon: <Percent size={16} />, color: 'var(--gold-500)' },
              { label: t('fd.kpiNextDue', 'Next instalment'), value: farmerLoan.nextDueDate, sub: farmerLoan.dueIn, icon: <CalendarClock size={16} />, color: isOverdue ? 'var(--error-500)' : 'var(--success-500)' },
            ].map(kpi => (
              <div key={kpi.label} className="farmer-panel-tight p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${kpi.color}15`, color: kpi.color }}>{kpi.icon}</span>
                  <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--neutral-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{kpi.label}</span>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--neutral-950)', fontFamily: 'Roboto Mono' }}>{kpi.value}</div>
                <div style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '2px' }}>{kpi.sub}</div>
              </div>
            ))}
          </section>
        )}
        <section className="grid grid-cols-12 gap-5 mb-6">
          {/* Hero Card — conditionally rendered based on loan state */}
          {loanState === 'under-processing' ? (
            <div
              className="col-span-7 text-left p-7 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, var(--gray-700) 0%, var(--gray-600) 52%, var(--neutral-500) 100%)',
                color: 'white',
                borderRadius: '22px',
                boxShadow: '0 18px 42px rgba(55,65,81,0.22)',
              }}
            >
              <div className="relative z-10 flex flex-col h-full min-h-[250px]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.68)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>New Application</div>
                    <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.88)', fontFamily: 'Roboto Mono', marginTop: '4px' }}>LO00000053</div>
                  </div>
                  <StatusBadge status="Under Processing" />
                </div>
                <div className="mt-auto">
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.66)', fontWeight: 700 }}>Amount Requested</div>
                  <div style={{ fontSize: '48px', lineHeight: '58px', fontWeight: 700, color: 'white', letterSpacing: '0' }}>₹1,50,000</div>
                  {/* Animated processing indicator */}
                  <div className="flex items-center gap-2 mt-3">
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.72)' }}>Being reviewed by Credit Team</span>
                    <span className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <span key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: 'white', opacity: 0.5, animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite` }} />
                      ))}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-6">
                    <button
                      onClick={() => onNavigate('farmer-active-loans')}
                      className="px-5 py-2.5 rounded-xl"
                      style={{ backgroundColor: 'white', color: 'var(--gray-700)', fontSize: '14px', fontWeight: 700 }}
                    >
                      Track Status
                    </button>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.72)' }}>Submitted: 10 Jun 2026</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              role="button"
              tabIndex={0}
              aria-label="View active loan details"
              className="farmer-hero col-span-7 text-left p-7 relative overflow-hidden clickable-card"
              onClick={() => onNavigate('farmer-active-loans')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavigate('farmer-active-loans'); } }}
            >
              <div className="relative z-10 flex flex-col h-full min-h-[250px]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.68)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('fd.activeLoan', 'Active Loan')}</div>
                    <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.88)', fontFamily: 'Roboto Mono', marginTop: '4px' }}>{farmerLoan.id}</div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'var(--warning-500)', color: 'white', fontSize: '12px', fontWeight: 700 }}>
                    <Clock size={13} /> Due {farmerLoan.nextDueDate}
                  </span>
                </div>
                <div className="mt-auto">
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.66)', fontWeight: 700 }}>{t('fd.outstanding', 'Outstanding balance')}</div>
                  <div style={{ fontSize: '48px', lineHeight: '58px', fontWeight: 700, color: 'white', letterSpacing: '0' }}>{formatCurrency(farmerLoan.outstandingBalance)}</div>
                  <div className="w-full max-w-xl h-2 rounded-full mt-4" style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}>
                    <div className="h-full rounded-full" style={{ width: `${repaidPct}%`, backgroundColor: 'white' }} />
                  </div>
                  <div className="flex items-center justify-between max-w-xl mt-2" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.68)' }}>
                    <span>{formatCurrency(farmerLoan.totalRepaid)} {t('fd.repaid', 'repaid')}</span>
                    <span>{repaidPct}% {t('fd.complete', 'complete')}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-6">
                    <button
                      onClick={(e) => { e.stopPropagation(); onNavigate('farmer-repayment'); }}
                      className="px-5 py-2.5 rounded-xl"
                      style={{ backgroundColor: 'white', color: 'var(--green-900)', fontSize: '14px', fontWeight: 700 }}
                    >
                      {t('fd.payInstalment', 'Pay instalment')}
                    </button>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.72)' }}>Suggested payment: {formatCurrency(19500)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="col-span-5 farmer-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="farmer-kicker">{t('fd.borrowerCommand', 'Borrower Command')}</div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--neutral-950)', marginTop: '4px' }}>{t('fd.whatYouCanDo', 'What you can do now')}</h2>
              </div>
              <StatusBadge status="Good Standing" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: t('fd.trackLoan', 'Track loan'), detail: 'Stage, schedule, timeline', icon: <Clock size={18} />, page: 'farmer-active-loans', color: 'var(--blue-500)' },
                { label: t('fd.downloadFiles', 'Download files'), detail: 'Agreement, invoices, forms', icon: <FileText size={18} />, page: 'farmer-documents', color: 'var(--green-800)' },
                { label: t('fd.applyAgain', 'Apply again'), detail: `${formatCurrency(farmerEligibility.eligible)} eligible limit`, icon: <TrendingUp size={18} />, page: 'farmer-apply', color: 'var(--accent-sanction)' },
                { label: t('fd.askForHelp', 'Ask for help'), detail: 'Raise or track a ticket', icon: <Bell size={18} />, page: 'farmer-support', color: 'var(--gold-500)' },
              ].map(item => (
                <button key={item.label} onClick={() => onNavigate(item.page)} className="farmer-panel-tight p-4 text-left clickable-card" style={{ minHeight: '122px' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                    {item.icon}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--neutral-950)' }}>{item.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--neutral-550)', marginTop: '4px', lineHeight: '17px' }}>{item.detail}</div>
                </button>
              ))}
            </div>
          </div>
        </section>

      {/* Loan Journey Tracker */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-[var(--neutral-200)]">
        <div className="flex items-center justify-between mb-6">
          <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--neutral-900)' }}>{t('fd.loanJourney', 'Loan Journey')}</h3>
          <button
            onClick={() => onNavigate('farmer-active-loans')}
            className="flex items-center gap-1 transition-colors hover:text-[var(--brand-accent-700)]"
            style={{ fontSize: '13px', color: 'var(--brand-accent)', fontWeight: 500 }}
          >
            {t('fd.viewDetails', 'View Details')} <ChevronRight size={14} />
          </button>
        </div>
        <LoanTracker
          currentStage={6}
          completedDates={['10 Jan 2025', '12 Jan 2025', '13 Jan 2025', '14 Jan 2025', '15 Jan 2025', 'Active']}
          onStageClick={(stage) => onNavigate('farmer-active-loans')}
        />
      </div>

      {/* Two Column Row */}
      <div className="grid grid-cols-5 gap-5 mb-6">
        {/* Recent Transactions */}
        <div className="col-span-3 bg-white rounded-2xl p-5 shadow-sm border border-[var(--neutral-200)]">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--neutral-900)' }}>{t('fd.recentTransactions', 'Recent Transactions')}</h3>
            <button onClick={() => onNavigate('farmer-repayment')} className="flex items-center gap-1 hover:text-[var(--brand-accent-700)] transition-colors" style={{ fontSize: '13px', color: 'var(--brand-accent)' }}>{t('fd.viewAll', 'View All')} <ChevronRight size={14} /></button>
          </div>
          <div className="table-scroll">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--neutral-200)' }}>
                  {['Date', 'Type', 'Amount', 'Mode', 'Status'].map(h => (
                    <th key={h} className={`pb-2 ${h === 'Amount' ? 'text-right pr-4' : 'text-left'}`} style={{ fontSize: '11px', fontWeight: 500, color: 'var(--neutral-400)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {farmerTransactions.map((r, i) => (
                  <tr key={i} className="border-b border-[var(--neutral-200)] clickable-row" onClick={() => onNavigate('farmer-repayment')}>
                    <td className="py-3" style={{ fontSize: '13px', color: 'var(--neutral-700)' }}>{r.date}</td>
                    <td><span className="px-2 py-1 rounded-full" style={{ fontSize: '11px', backgroundColor: r.type === 'Disbursement' ? 'var(--info-100)' : 'var(--success-100)', color: r.type === 'Disbursement' ? 'var(--brand-accent)' : 'var(--success-500)', fontWeight: 700 }}>{r.type}</span></td>
                    <td className="pr-4" style={{ fontSize: '13px', fontFamily: 'Roboto Mono', color: r.sign === '+' ? 'var(--success-500)' : 'var(--neutral-700)', textAlign: 'right', whiteSpace: 'nowrap' }}>{r.sign}{formatCurrency(r.amount)}</td>
                    <td className="pl-1" style={{ fontSize: '12px', color: 'var(--neutral-400)' }}>{r.mode}</td>
                    <td><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* My Documents */}
        <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-[var(--neutral-200)]">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--neutral-900)' }}>{t('fd.documents', 'Documents')}</h3>
            <button onClick={() => onNavigate('farmer-documents')} className="flex items-center gap-1 hover:text-[var(--brand-accent-700)] transition-colors" style={{ fontSize: '13px', color: 'var(--brand-accent)' }}>{t('fd.viewAll', 'View All')} <ChevronRight size={14} /></button>
          </div>
          <div className="space-y-1">
            {farmerDocuments.slice(3, 9).map((doc, i) => (
              <button key={i} className="w-full flex items-center justify-between py-2.5 px-2 rounded-lg clickable-row text-left" onClick={() => onNavigate('farmer-documents')}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--brand-light)' }}>
                    <FileText size={14} style={{ color: 'var(--brand-secondary)' }} />
                  </div>
                    <span style={{ fontSize: '13px', color: 'var(--neutral-700)', fontWeight: 400 }}>{doc.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={doc.status} />
                  {doc.status === 'Available' && (
                    <span className="p-1.5 hover:bg-[var(--brand-light)] rounded-lg transition-colors">
                      <Download size={14} style={{ color: 'var(--brand-secondary)' }} />
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[var(--neutral-200)]">
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--neutral-900)' }}>{t('fd.recentAlerts', 'Recent Alerts')}</h3>
          <button onClick={() => onNavigate('notifications-center')} className="flex items-center gap-1 hover:text-[var(--brand-accent-700)] transition-colors" style={{ fontSize: '13px', color: 'var(--brand-accent)' }}>{t('fd.viewAll', 'View All')} <ChevronRight size={14} /></button>
        </div>
        <div className="space-y-1">
          {farmerNotifications.map(n => {
            const normalizedType = n.type.toLowerCase().includes('payment') ? 'repayment' : n.type.toLowerCase().includes('approved') ? 'approval' : n.type.toLowerCase().includes('invoice') ? 'document' : n.type.toLowerCase().includes('kyc') ? 'kyc' : 'info';
            const nIcon = notifIcons[normalizedType] || notifIcons.info;
            return (
              <button key={`${n.type}-${n.time}`} className="w-full flex items-start gap-3 p-3 rounded-xl clickable-row text-left" onClick={() => onNavigate(nIcon.page)}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: nIcon.bg, color: nIcon.color }}
                >
                  {nIcon.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate" style={{ fontSize: '14px', fontWeight: n.read ? 400 : 500, color: n.read ? 'var(--neutral-400)' : 'var(--neutral-900)' }}>{n.title}</div>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--neutral-400)', whiteSpace: 'nowrap' }}>{n.time}</span>
              </button>
            );
          })}
        </div>
      </div>
        </>
      )}
      </div>
    </Shell>
  );
}
