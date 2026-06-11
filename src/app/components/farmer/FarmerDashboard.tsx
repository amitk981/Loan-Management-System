import { Plus, Download, FileText, TrendingUp, Clock, ChevronRight, Bell, BadgeIndianRupee, CheckCircle2, AlertCircle, Info, IdCard } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from '../shared/StatusBadge';
import { LoanTracker } from '../shared/LoanTracker';
import { farmerDocuments, farmerEligibility, farmerLoan, farmerNotifications, farmerProfile, farmerTransactions } from '../../data/farmerData';

interface FarmerDashboardProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

const notifIcons: Record<string, { icon: JSX.Element; bg: string; color: string; page: string }> = {
  repayment: { icon: <BadgeIndianRupee size={15} />, bg: '#FEF3C7', color: '#92400E', page: 'farmer-repayment' },
  approval: { icon: <CheckCircle2 size={15} />, bg: '#DCFCE7', color: '#166534', page: 'farmer-active-loans' },
  document: { icon: <FileText size={15} />, bg: '#DBEAFE', color: '#1E40AF', page: 'farmer-documents' },
  overdue: { icon: <AlertCircle size={15} />, bg: '#FEE2E2', color: '#991B1B', page: 'farmer-repayment' },
  info: { icon: <Info size={15} />, bg: '#DBEAFE', color: '#1E40AF', page: 'notifications-center' },
  kyc: { icon: <IdCard size={15} />, bg: '#FEF3C7', color: '#92400E', page: 'farmer-apply' },
};

export function FarmerDashboard({ onNavigate, activePage }: FarmerDashboardProps) {
  const formatCurrency = (n: number) =>
    '₹' + n.toLocaleString('en-IN');

  const repaidPct = Math.round((farmerLoan.totalRepaid / farmerLoan.sanctionedAmount) * 100);

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
          style={{ backgroundColor: '#1A3C2A', color: 'white', fontSize: '14px' }}
          onClick={() => onNavigate('farmer-apply')}
        >
          <Plus size={16} /> Apply for Loan
        </button>
      }
    >
      <div className="farmer-page">
        <section className="grid grid-cols-12 gap-5 mb-6">
          <button
            className="farmer-hero col-span-7 text-left p-7 relative overflow-hidden clickable-card"
            onClick={() => onNavigate('farmer-active-loans')}
          >
            <div className="relative z-10 flex flex-col h-full min-h-[250px]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.68)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Active Loan</div>
                  <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.88)', fontFamily: 'Roboto Mono', marginTop: '4px' }}>{farmerLoan.id}</div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ backgroundColor: '#F59E0B', color: 'white', fontSize: '12px', fontWeight: 800 }}>
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
          </button>

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
                { label: 'Apply again', detail: `${formatCurrency(farmerEligibility.eligible)} eligible limit`, icon: <TrendingUp size={18} />, page: 'farmer-apply', color: '#7C3AED' },
                { label: 'Ask for help', detail: 'Raise or track a ticket', icon: <Bell size={18} />, page: 'farmer-support', color: '#D97706' },
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
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#12151A' }}>Loan Journey</h3>
          <button
            onClick={() => onNavigate('farmer-active-loans')}
            className="flex items-center gap-1 transition-colors hover:text-[#1565C0]"
            style={{ fontSize: '13px', color: '#1E88E5', fontWeight: 500 }}
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
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#12151A' }}>Recent Transactions</h3>
            <button onClick={() => onNavigate('farmer-repayment')} className="flex items-center gap-1 hover:text-[#1565C0] transition-colors" style={{ fontSize: '13px', color: '#1E88E5' }}>View All <ChevronRight size={14} /></button>
          </div>
          <div className="table-scroll">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #EDEEF0' }}>
                  {['Date', 'Type', 'Amount', 'Mode', 'Status'].map(h => (
                    <th key={h} className="pb-2 text-left" style={{ fontSize: '11px', fontWeight: 500, color: '#9EA8B3', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {farmerTransactions.map((r, i) => (
                  <tr key={i} className="border-b border-[#EDEEF0] clickable-row" onClick={() => onNavigate('farmer-repayment')}>
                    <td className="py-3" style={{ fontSize: '13px', color: '#3D4450' }}>{r.date}</td>
                    <td><span className="px-2 py-1 rounded-full" style={{ fontSize: '11px', backgroundColor: r.type === 'Disbursement' ? '#DBEAFE' : '#DCFCE7', color: r.type === 'Disbursement' ? '#1E88E5' : '#22C55E', fontWeight: 700 }}>{r.type}</span></td>
                    <td style={{ fontSize: '13px', fontFamily: 'Roboto Mono', color: r.sign === '+' ? '#22C55E' : '#3D4450', textAlign: 'right' }}>{r.sign}{formatCurrency(r.amount)}</td>
                    <td style={{ fontSize: '12px', color: '#9EA8B3' }}>{r.mode}</td>
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
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#12151A' }}>Documents</h3>
            <button onClick={() => onNavigate('farmer-documents')} className="flex items-center gap-1 hover:text-[#1565C0] transition-colors" style={{ fontSize: '13px', color: '#1E88E5' }}>View All <ChevronRight size={14} /></button>
          </div>
          <div className="space-y-1">
            {farmerDocuments.slice(3, 9).map((doc, i) => (
              <button key={i} className="w-full flex items-center justify-between py-2.5 px-2 rounded-lg clickable-row text-left" onClick={() => onNavigate('farmer-documents')}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
                    <FileText size={14} style={{ color: '#2D7A4F' }} />
                  </div>
                    <span style={{ fontSize: '13px', color: '#3D4450', fontWeight: 400 }}>{doc.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={doc.status} />
                  {doc.status === 'Available' && (
                    <span className="p-1.5 hover:bg-[#E8F5E9] rounded-lg transition-colors">
                      <Download size={14} style={{ color: '#2D7A4F' }} />
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
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#12151A' }}>Recent Alerts</h3>
          <button onClick={() => onNavigate('notifications-center')} className="flex items-center gap-1 hover:text-[#1565C0] transition-colors" style={{ fontSize: '13px', color: '#1E88E5' }}>View All <ChevronRight size={14} /></button>
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
                  <div className="truncate" style={{ fontSize: '14px', fontWeight: n.read ? 400 : 600, color: n.read ? '#9EA8B3' : '#12151A' }}>{n.title}</div>
                </div>
                <span style={{ fontSize: '11px', color: '#9EA8B3', whiteSpace: 'nowrap' }}>{n.time}</span>
              </button>
            );
          })}
        </div>
      </div>
      </div>
    </Shell>
  );
}
