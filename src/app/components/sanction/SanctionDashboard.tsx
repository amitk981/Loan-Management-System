import { TrendingUp } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from '../shared/StatusBadge';
import { RoleCommandCenter } from '../shared/RoleCommandCenter';
import { useAuth } from '../../context/AuthContext';
import { scApprovalQueue, scPortfolio } from '../../data/sanctionData';
import { formatCurrency } from '../../lib/format';

interface SanctionDashboardProps {
  onNavigate: (page: string) => void;
  activePage: string;
}


export function SanctionDashboard({ onNavigate, activePage }: SanctionDashboardProps) {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Sanction Committee', 'Dashboard']}
      pageTitle={`${greeting}, ${user?.name || 'CFO'}`}
      pageSubtitle={`${user?.roleLabel || 'Sanction Committee'} · Review authority up to ₹5,00,000`}
      actions={<button onClick={() => onNavigate('sc-awaiting')} className="px-4 py-2.5 rounded-lg font-semibold hover:shadow-md transition-all active:scale-[0.98]" style={{ backgroundColor: '#7C3AED', color: 'white', fontSize: '14px' }}>Review Now →</button>}
    >
      <div className="mb-6 p-4 rounded-xl border border-[#DDD6FE] flex items-center justify-between" style={{ backgroundColor: '#F5F3FF' }}>
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-sm">✓</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#5B21B6' }}>7 Applications Awaiting Scrutiny Decision</div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-700)', marginTop: '2px' }}>CFO signature pending on 5 cases. Permissible lending headroom is ₹1.93 Crore (48% utilized).</div>
          </div>
        </div>
        <button onClick={() => onNavigate('sc-awaiting')} className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: '#7C3AED', fontSize: '13px', fontWeight: 700 }}>Start Scrutiny</button>
      </div>
      <RoleCommandCenter
        title="Decision Room"
        focus="Review applications waiting for your signature"
        primaryAction={{ label: 'Open approval queue', detail: '7 applications are waiting. Oldest case has crossed the 2-day mark.', page: 'sc-awaiting', tone: 'purple', badge: '7' }}
        metrics={[
          { label: 'Awaiting', value: '7', tone: 'red' },
          { label: 'Joint', value: '2', tone: 'amber' },
          { label: 'NPA', value: scPortfolio.npaRate, tone: 'red' },
        ]}
        secondaryActions={[
          { label: 'Joint approvals', detail: 'Loans above authority threshold need co-signature.', page: 'sc-joint', tone: 'purple' },
          { label: 'Special cases', detail: 'Director/relative applications need GM evidence.', page: 'sc-special-cases', tone: 'amber' },
          { label: 'Portfolio health', detail: 'Check exposure, capacity and overdue buckets.', page: 'sc-health', tone: 'blue' },
          { label: 'Recovery actions', detail: 'Authorize default escalation or security invocation.', page: 'sc-default-escalations', tone: 'red' },
        ]}
        onNavigate={onNavigate}
      />

      <div className="grid grid-cols-4 gap-5 mb-5">
        {[
          ['Active Portfolio', formatCurrency(scPortfolio.activePortfolio), `${scPortfolio.activeLoans} loans`, '#7C3AED', 'sc-health'],
          ['Sanctioned This Month', `${formatCurrency(scPortfolio.sanctionedThisMonth)}`, `${scPortfolio.sanctionedCount} loans`, 'var(--success-500)', 'sc-register'],
          ['Lending Capacity', `${formatCurrency(scPortfolio.lendingHeadroom)}`, `${scPortfolio.s186Used}% used`, 'var(--warning-500)', 'sc-exposure'],
          ['NPA Rate', scPortfolio.npaRate, scPortfolio.npaDelta, 'var(--error-500)', 'sc-dpd'],
        ].map(([label, value, note, color, page]) => (
          <button key={label} onClick={() => onNavigate(page)} className="bg-white rounded-xl p-5 border border-[#EDEEF0] text-left clickable-card">
            <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
            <div style={{ fontSize: label === 'Sanctioned This Month' ? '22px' : '26px', color, fontWeight: 800, fontFamily: 'Roboto Mono', marginTop: '8px' }}>{value}</div>
            {label === 'Lending Capacity' && <div className="h-2 rounded-full mt-3 mb-2" style={{ backgroundColor: 'var(--neutral-200)' }}><div className="h-full rounded-full transition-all" style={{ width: `${scPortfolio.s186Used}%`, backgroundColor: 'var(--warning-500)' }} /></div>}
            <div style={{ fontSize: '12px', color: 'var(--neutral-700)', marginTop: '4px' }}>{note}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-7 bg-white rounded-xl border border-[#EDEEF0] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#EDEEF0]" style={{ backgroundColor: 'var(--neutral-100)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--neutral-900)' }}>Approval Queue</h3>
          </div>
          {scApprovalQueue.map(item => {
            const appraisalStatus = item.appraisal === 'Eligible' ? 'Approved' : 'Medium';
            return (
              <button key={item.id} onClick={() => onNavigate(item.page)} className="w-full px-5 py-4 flex items-center gap-4 text-left border-b border-[#EDEEF0] last:border-b-0 clickable-row">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.priority === '!' ? 'var(--error-100)' : 'var(--info-100)', color: item.priority === '!' ? 'var(--error-500)' : 'var(--brand-accent)', fontWeight: 700 }}>{item.priority}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span style={{ fontSize: '13px', fontFamily: 'Roboto Mono', color: '#7C3AED', fontWeight: 700 }}>{item.id}</span>
                    <span style={{ fontSize: '14px', color: 'var(--neutral-900)', fontWeight: 700 }}>{item.borrower}</span>
                    <span style={{ fontSize: '14px', fontFamily: 'Roboto Mono', color: 'var(--neutral-900)', fontWeight: 700 }}>{formatCurrency(item.amount)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <StatusBadge status={appraisalStatus} />
                    <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: '#EDE9FE', color: '#7C3AED', fontSize: '11px', fontWeight: 700 }}>{item.authority}</span>
                    <span style={{ fontSize: '12px', color: item.waiting.includes('2') ? 'var(--error-500)' : 'var(--warning-500)', fontWeight: 700 }}>⏱ {item.waiting}</span>
                    {item.note && <span style={{ fontSize: '12px', color: 'var(--gold-500)', fontWeight: 700 }}>⚠ {item.note}</span>}
                  </div>
                </div>
                <span style={{ fontSize: '13px', color: '#7C3AED', fontWeight: 700 }}>Review →</span>
              </button>
            );
          })}
          <div className="p-4"><button onClick={() => onNavigate('sc-awaiting')} className="hover:text-[#5B21B6] transition-colors" style={{ fontSize: '13px', color: '#7C3AED', fontWeight: 700 }}>View All 7 →</button></div>
        </div>

        <div className="col-span-5 bg-white rounded-xl p-5 border border-[#EDEEF0]">
          <div className="flex items-center gap-2 mb-4"><TrendingUp size={17} color="#7C3AED" /><h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--neutral-900)' }}>Risk Snapshot</h3></div>
          {[
            ['Current (0 DPD)', '127 loans', '86.4%', 'var(--success-500)'],
            ['1-2 yrs overdue', '12 loans', '8.2%', 'var(--warning-500)'],
            ['2-3 yrs overdue', '5 loans', '3.4%', '#E65100'],
            ['3+ yrs overdue', '3 loans', '2.0%', 'var(--error-500)'],
          ].map(([label, count, pct, color]) => (
            <button key={label} onClick={() => onNavigate('sc-dpd')} className="w-full mb-4 text-left clickable-row rounded-lg p-1">
              <div className="flex items-center justify-between mb-1"><span style={{ fontSize: '13px', color: 'var(--neutral-700)', fontWeight: 600 }}>{label}</span><span style={{ fontSize: '13px', color: 'var(--neutral-900)', fontWeight: 700 }}>{count} · {pct}</span></div>
              <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--neutral-200)' }}><div className="h-full rounded-full transition-all" style={{ width: pct, backgroundColor: color }} /></div>
            </button>
          ))}
          <div className="mt-4 pt-4 border-t border-[#EDEEF0]">
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--neutral-900)', marginBottom: '8px' }}>Recent Decisions (7d)</div>
            <div className="grid grid-cols-4 gap-2">
              {['Approved: 14', 'Rejected: 2', 'Returned: 1', 'Avg TAT: 0.8d'].map(item => <div key={item} className="p-2 rounded-lg text-center" style={{ backgroundColor: 'var(--neutral-100)', fontSize: '12px', color: 'var(--neutral-700)', fontWeight: 700 }}>{item}</div>)}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
