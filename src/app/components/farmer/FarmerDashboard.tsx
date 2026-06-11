import { Plus, Download, FileText, TrendingUp, CreditCard, Leaf, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatsCard } from '../shared/StatsCard';
import { StatusBadge } from '../shared/StatusBadge';
import { LoanTracker } from '../shared/LoanTracker';
import { farmerDocuments, farmerEligibility, farmerLoan, farmerNotifications, farmerProfile, farmerTransactions } from '../../data/farmerData';

interface FarmerDashboardProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

const notifIcons: Record<string, { icon: string; bg: string }> = {
  repayment: { icon: '💰', bg: '#FEF3C7' },
  approval: { icon: '✅', bg: '#DCFCE7' },
  document: { icon: '📄', bg: '#DBEAFE' },
  overdue: { icon: '🔴', bg: '#FEE2E2' },
  info: { icon: '📢', bg: '#DBEAFE' },
  kyc: { icon: '🪪', bg: '#FEF3C7' },
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
      pageTitle={`${greeting}, ${farmerProfile.firstName} 👋`}
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
      {/* Active Loan Hero Card */}
      <button
        className="w-full text-left rounded-2xl p-6 mb-6 relative overflow-hidden transition-all hover:shadow-lg active:scale-[0.995]"
        onClick={() => onNavigate('farmer-active-loans')}
        style={{
          background: 'linear-gradient(135deg, #1A3C2A 0%, #2D7A4F 100%)',
          minHeight: '140px',
          cursor: 'pointer',
        }}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #1E88E5 0%, transparent 60%)' }} />
        <div className="relative flex items-center justify-between">
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '4px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>ACTIVE LOAN</div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', fontFamily: 'Roboto Mono' }}>{farmerLoan.id}</div>
            <div className="inline-flex mt-2 px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.75)', fontSize: '11px', fontWeight: 700 }}>{farmerLoan.tenure}</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Outstanding</div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'white', fontFamily: 'Inter, sans-serif', lineHeight: '42px' }}>
              {formatCurrency(farmerLoan.outstandingBalance)}
            </div>
            <div className="w-72 max-w-full h-1.5 rounded-full mx-auto mt-3" style={{ backgroundColor: 'rgba(255,255,255,0.20)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${repaidPct}%`, backgroundColor: 'rgba(255,255,255,0.85)' }} />
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginTop: '5px' }}>{formatCurrency(farmerLoan.totalRepaid)} of {formatCurrency(farmerLoan.sanctionedAmount)} repaid</div>
          </div>
          <div className="flex flex-col gap-3 items-end">
            <span
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: '#F59E0B', color: 'white', fontSize: '12px', fontWeight: 700 }}
            >
              <Clock size={12} /> Due: {farmerLoan.nextDueDate}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onNavigate('farmer-repayment'); }}
              className="px-4 py-2 rounded-lg transition-all hover:bg-white/20 active:scale-95"
              style={{ border: '1px solid rgba(255,255,255,0.4)', color: 'white', fontSize: '13px', fontWeight: 500 }}
            >
              Pay Now →
            </button>
          </div>
        </div>
      </button>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        <StatsCard
          title="Shares Held"
          value={`${farmerProfile.shares}`}
          subtitle={`Folio ${farmerProfile.folioNo}`}
          icon={<Leaf size={18} />}
          color="#2D7A4F"
          badge={{ text: '₹50,000 value', type: 'success' }}
          onClick={() => onNavigate('farmer-documents')}
        />
        <StatsCard
          title="Max Eligibility"
          value={formatCurrency(farmerEligibility.eligible)}
          subtitle={`${farmerProfile.shares} × ₹${farmerProfile.loanValuePerShare}`}
          icon={<TrendingUp size={18} />}
          color="#1E88E5"
          badge={{ text: 'Shares-based', type: 'info' }}
          onClick={() => onNavigate('farmer-apply')}
        />
        <StatsCard
          title="Total Repaid"
          value={formatCurrency(farmerLoan.totalRepaid)}
          icon={<CreditCard size={18} />}
          color="#22C55E"
          progress={repaidPct}
          onClick={() => onNavigate('farmer-repayment')}
        />
        <StatsCard
          title="Credit Status"
          value="Good Standing"
          subtitle="No defaults"
          icon={<ShieldCheck size={18} />}
          color="#22C55E"
          onClick={() => onNavigate('farmer-active-loans')}
        />
      </div>

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
            const nIcon = notifIcons[n.type] || notifIcons.info;
            return (
              <button key={`${n.type}-${n.time}`} className="w-full flex items-start gap-3 p-3 rounded-xl clickable-row text-left" onClick={() => onNavigate('notifications-center')}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: nIcon.bg }}
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
    </Shell>
  );
}
