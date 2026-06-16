import { Plus, Download, FileText, TrendingUp, Clock, ChevronRight, Bell, BadgeIndianRupee, CheckCircle2, AlertCircle, Info, IdCard, AlertOctagon } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from '../shared/StatusBadge';
import { GateBanner } from '../shared/GateBanner';
import { LoanTracker } from '../shared/LoanTracker';
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

  const repaidPct = Math.round((farmerLoan.totalRepaid / farmerLoan.sanctionedAmount) * 100);

  // Simulated loan state — in real app this comes from API
  // States: 'active' | 'under-processing' | 'overdue' | 'no-loan'
  const loanState = 'active'; // Change to 'under-processing' to preview that state

  // KYC expiry check (simulated — in real app would be dynamic)
  const kycExpired = false; // Set to true to see the blocked state
  const hasActiveDefault = false; // Set to true to see the duplicate loan block

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
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all hover:shadow-md active:scale-[0.98]"
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
          <Plus size={16} /> Apply for Loan
          {(kycExpired || hasActiveDefault) && <AlertOctagon size={14} />}
        </button>
      }
    >
      <div className="farmer-page">
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
        <div className="mb-6 p-4 rounded-xl border border-[#BBF7D0] flex items-center justify-between" style={{ backgroundColor: 'var(--success-50)' }}>
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#22C55E] text-white flex items-center justify-center font-bold text-sm">✓</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--success-700)' }}>Your loan is Active & in Good Standing</div>
              <div style={{ fontSize: '12px', color: 'var(--neutral-700)', marginTop: '2px' }}>Next instalment of ₹19,500 is due by 31 Mar 2027.</div>
            </div>
          </div>
          <button onClick={() => onNavigate('farmer-repayment')} className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: 'var(--brand-primary)', fontSize: '13px', fontWeight: 700 }}>Pay Now</button>
        </div>
        <section className="grid grid-cols-12 gap-5 mb-6">
          {/* Hero Card — conditionally rendered based on loan state */}
          {loanState === 'under-processing' ? (
            <div
              className="col-span-7 text-left p-7 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #374151 0%, #4B5563 52%, #6B7280 100%)',
                color: 'white',
                borderRadius: '22px',
                boxShadow: '0 18px 42px rgba(55,65,81,0.22)',
              }}
            >
              <div className="relative z-10 flex flex-col h-full min-h-[250px]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.68)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>New Application</div>
                    <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.88)', fontFamily: 'Roboto Mono', marginTop: '4px' }}>LO00000053</div>
                  </div>
                  <StatusBadge status="Under Processing" />
                </div>
                <div className="mt-auto">
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.66)', fontWeight: 700 }}>Amount Requested</div>
                  <div style={{ fontSize: '48px', lineHeight: '58px', fontWeight: 850, color: 'white', letterSpacing: '0' }}>₹1,50,000</div>
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
                      style={{ backgroundColor: 'white', color: '#374151', fontSize: '14px', fontWeight: 850 }}
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
                    <div style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.68)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Active Loan</div>
                    <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.88)', fontFamily: 'Roboto Mono', marginTop: '4px' }}>{farmerLoan.id}</div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'var(--warning-500)', color: 'white', fontSize: '12px', fontWeight: 800 }}>
                    <Clock size={13} /> Due {farmerLoan.nextDueDate}
                  </span>
                </div>
                <div className="mt-auto">
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.66)', fontWeight: 700 }}>Outstanding balance</div>
                  <div style={{ fontSize: '48px', lineHeight: '58px', fontWeight: 850, color: 'white', letterSpacing: '0' }}>{formatCurrency(farmerLoan.outstandingBalance)}</div>
                  <div className="w-full max-w-xl h-2 rounded-full mt-4" style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}>
                    <div className="h-full rounded-full" style={{ width: `${repaidPct}%`, backgroundColor: 'white' }} />
                  </div>
                  <div className="flex items-center justify-between max-w-xl mt-2" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.68)' }}>
                    <span>{formatCurrency(farmerLoan.totalRepaid)} repaid</span>
                    <span>{repaidPct}% complete</span>
                  </div>
                  <div className="flex items-center gap-3 mt-6">
                    <button
                      onClick={(e) => { e.stopPropagation(); onNavigate('farmer-repayment'); }}
                      className="px-5 py-2.5 rounded-xl"
                      style={{ backgroundColor: 'white', color: '#16452F', fontSize: '14px', fontWeight: 850 }}
                    >
                      Pay instalment
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
                <div className="farmer-kicker">Borrower Command</div>
                <h2 style={{ fontSize: '20px', fontWeight: 850, color: '#111827', marginTop: '4px' }}>What you can do now</h2>
              </div>
              <StatusBadge status="Good Standing" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Track loan', detail: 'Stage, schedule, timeline', icon: <Clock size={18} />, page: 'farmer-active-loans', color: '#1E6CEB' },
                { label: 'Download files', detail: 'Agreement, invoices, forms', icon: <FileText size={18} />, page: 'farmer-documents', color: '#286C4B' },
                { label: 'Apply again', detail: `${formatCurrency(farmerEligibility.eligible)} eligible limit`, icon: <TrendingUp size={18} />, page: 'farmer-apply', color: 'var(--accent-sanction)' },
                { label: 'Ask for help', detail: 'Raise or track a ticket', icon: <Bell size={18} />, page: 'farmer-support', color: 'var(--gold-500)' },
              ].map(item => (
                <button key={item.label} onClick={() => onNavigate(item.page)} className="farmer-panel-tight p-4 text-left clickable-card" style={{ minHeight: '122px' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                    {item.icon}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 850, color: '#111827' }}>{item.label}</div>
                  <div style={{ fontSize: '12px', color: '#667085', marginTop: '4px', lineHeight: '17px' }}>{item.detail}</div>
                </button>
              ))}
            </div>
          </div>
        </section>

      {/* Loan Journey Tracker */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-[#EDEEF0]">
        <div className="flex items-center justify-between mb-6">
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--neutral-900)' }}>Loan Journey</h3>
          <button
            onClick={() => onNavigate('farmer-active-loans')}
            className="flex items-center gap-1 transition-colors hover:text-[#1565C0]"
            style={{ fontSize: '13px', color: 'var(--brand-accent)', fontWeight: 500 }}
          >
            View Details <ChevronRight size={14} />
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
        <div className="col-span-3 bg-white rounded-2xl p-5 shadow-sm border border-[#EDEEF0]">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--neutral-900)' }}>Recent Transactions</h3>
            <button onClick={() => onNavigate('farmer-repayment')} className="flex items-center gap-1 hover:text-[#1565C0] transition-colors" style={{ fontSize: '13px', color: 'var(--brand-accent)' }}>View All <ChevronRight size={14} /></button>
          </div>
          <div className="table-scroll">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #EDEEF0' }}>
                  {['Date', 'Type', 'Amount', 'Mode', 'Status'].map(h => (
                    <th key={h} className="pb-2 text-left" style={{ fontSize: '11px', fontWeight: 500, color: 'var(--neutral-400)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {farmerTransactions.map((r, i) => (
                  <tr key={i} className="border-b border-[#EDEEF0] clickable-row" onClick={() => onNavigate('farmer-repayment')}>
                    <td className="py-3" style={{ fontSize: '13px', color: 'var(--neutral-700)' }}>{r.date}</td>
                    <td><span className="px-2 py-1 rounded-full" style={{ fontSize: '11px', backgroundColor: r.type === 'Disbursement' ? 'var(--info-100)' : 'var(--success-100)', color: r.type === 'Disbursement' ? 'var(--brand-accent)' : 'var(--success-500)', fontWeight: 700 }}>{r.type}</span></td>
                    <td style={{ fontSize: '13px', fontFamily: 'Roboto Mono', color: r.sign === '+' ? 'var(--success-500)' : 'var(--neutral-700)', textAlign: 'right' }}>{r.sign}{formatCurrency(r.amount)}</td>
                    <td style={{ fontSize: '12px', color: 'var(--neutral-400)' }}>{r.mode}</td>
                    <td><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* My Documents */}
        <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-[#EDEEF0]">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--neutral-900)' }}>Documents</h3>
            <button onClick={() => onNavigate('farmer-documents')} className="flex items-center gap-1 hover:text-[#1565C0] transition-colors" style={{ fontSize: '13px', color: 'var(--brand-accent)' }}>View All <ChevronRight size={14} /></button>
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
                    <span className="p-1.5 hover:bg-[#E8F5E9] rounded-lg transition-colors">
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
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EDEEF0]">
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--neutral-900)' }}>Recent Alerts</h3>
          <button onClick={() => onNavigate('notifications-center')} className="flex items-center gap-1 hover:text-[#1565C0] transition-colors" style={{ fontSize: '13px', color: 'var(--brand-accent)' }}>View All <ChevronRight size={14} /></button>
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
                  <div className="truncate" style={{ fontSize: '14px', fontWeight: n.read ? 400 : 600, color: n.read ? 'var(--neutral-400)' : 'var(--neutral-900)' }}>{n.title}</div>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--neutral-400)', whiteSpace: 'nowrap' }}>{n.time}</span>
              </button>
            );
          })}
        </div>
      </div>
      </div>
    </Shell>
  );
}
