import { AlertTriangle, ArrowRight, BellRing, Check, ChevronRight, Clock, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Shell } from '../layout/Shell';
import { StatusBadge } from '../shared/StatusBadge';
import { RoleCommandCenter } from '../shared/RoleCommandCenter';
import { formatCurrency } from '../../lib/format';

interface CreditDashboardProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

const actionQueue = [
  { icon: '!', loan: 'LO00000089', name: 'Rajesh Patil', note: 'Appraisal Note overdue 1d', status: 'Overdue', page: 'credit-review', color: 'var(--error-700)', priority: 'High', when: '1d overdue' },
  { icon: '→', loan: 'LO00000091', name: 'Priya Shinde', note: 'Docs incomplete — PAN missing', status: 'Incomplete', page: 'credit-queue', color: 'var(--warning-700)', priority: 'Medium', when: '2h ago' },
  { icon: '→', loan: 'LO00000086', name: 'Narayan FPC', note: 'Sent to SC — awaiting decision', status: 'Awaiting SC Approval', page: 'credit-sc-queue', color: 'var(--brand-accent-700)', priority: 'Tracking', when: '1d ago' },
  { icon: '✓', loan: 'LO00000082', name: 'Disbursed', note: 'Update loan register', status: 'Disbursed', page: 'credit-register', color: 'var(--success-600)', priority: 'Done', when: 'Today' },
];

const alerts = [
  { title: 'TAT Breach', body: 'LO00000076 — Appraisal due 2 days ago', color: 'var(--warning-800)', page: 'credit-review', Icon: Clock },
  { title: 'Default Flag', body: 'LO00000051 — Principal overdue 94 days', color: 'var(--error-700)', page: 'credit-dpd', Icon: ShieldAlert },
  { title: 'Re-KYC Due', body: '14 members — KYC expiring in 30d', color: 'var(--warning-500)', page: 'credit-all-apps', Icon: AlertTriangle },
];

const dpdData = [
  { label: 'Current', count: 127, pct: 86, color: 'var(--success-500)' },
  { label: '1-2yr', count: 12, pct: 8, color: 'var(--warning-500)' },
  { label: '2-3yr', count: 5, pct: 4, color: 'var(--warning-800)' },
  { label: '3yr+', count: 3, pct: 2, color: 'var(--error-500)' },
];

const healthStats = [
  { label: 'Outstanding', value: formatCurrency(18420000), tone: 'var(--brand-accent)' },
  { label: 'Avg Loan', value: formatCurrency(125306), tone: 'var(--neutral-700)' },
  { label: 'NPA Rate', value: '1.4%', tone: 'var(--error-700)' },
  { label: 'On-time', value: '94%', tone: 'var(--success-700)' },
];

export function CreditDashboard({ onNavigate, activePage }: CreditDashboardProps) {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Credit Assessment', 'Dashboard']}
      pageTitle={`${greeting}, ${user?.name || 'Credit Manager'}`}
      pageSubtitle={user?.roleLabel || 'Credit Assessment'}
      actions={
        <button onClick={() => onNavigate('credit-queue')} className="px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:shadow-md transition-all active:scale-[0.98]" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}>
          New Applications <ArrowRight size={15} />
        </button>
      }
    >
      {/* Single focus: the RoleCommandCenter below already surfaces the overdue
          appraisal as its primary action — a duplicate red banner here was
          competing for the same attention (see audit §G.2 "kill duplicate entry points"). */}
      <RoleCommandCenter
        title="Credit Workbench"
        focus="Clear the oldest appraisal first"
        primaryAction={{ label: 'Open appraisal', detail: 'LO00000089 is overdue by 1 day and should be resolved before new intake.', page: 'credit-review', tone: 'green', badge: 'Overdue' }}
        metrics={[
          { label: 'New', value: '12', tone: 'blue' },
          { label: 'Review', value: '5', tone: 'amber' },
          { label: 'SC', value: '2', tone: 'purple' },
        ]}
        secondaryActions={[
          { label: 'Intake queue', detail: 'Verify new applications and request missing documents.', page: 'credit-queue', tone: 'blue' },
          { label: 'SC tracker', detail: 'Follow decisions already submitted for sanction.', page: 'credit-sc-queue', tone: 'purple' },
          { label: 'Monitor DPD', detail: 'Review overdue borrowers and default notes.', page: 'credit-dpd', tone: 'red' },
          { label: 'Loan register', detail: 'Search active loans and update records.', page: 'credit-register', tone: 'neutral' },
        ]}
        onNavigate={onNavigate}
      />

      <div className="grid grid-cols-11 gap-5 mb-5">
        <div className="col-span-6 bg-white rounded-xl border border-[var(--neutral-250)] overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--neutral-250)]" style={{ backgroundColor: 'var(--neutral-150)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--neutral-900)' }}>Action Queue</h3>
          </div>
          {actionQueue.map(item => (
            <button key={item.loan} onClick={() => onNavigate(item.page)} className="w-full px-5 py-4 flex items-center gap-4 text-left border-b border-[var(--neutral-250)] last:border-b-0 clickable-row">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.color}18`, color: item.color, fontWeight: 700 }}>{item.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span style={{ fontSize: '13px', fontFamily: 'Roboto Mono', color: 'var(--brand-accent)', fontWeight: 700 }}>{item.loan}</span>
                  <span style={{ fontSize: '14px', color: 'var(--neutral-900)', fontWeight: 500 }}>{item.name}</span>
                  <StatusBadge status={item.status} />
                </div>
                <div className="truncate" style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '3px' }}>{item.note}</div>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--brand-accent)', fontWeight: 700 }}>Open →</span>
            </button>
          ))}
        </div>

        <div className="col-span-5 bg-white rounded-xl border border-[var(--neutral-250)] overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--neutral-250)]" style={{ backgroundColor: 'var(--neutral-150)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--neutral-900)' }}>Alerts</h3>
          </div>
          <div className="p-4 space-y-3">
            {alerts.map(alert => (
              <button key={alert.title} onClick={() => onNavigate(alert.page)} className="w-full p-4 rounded-lg flex gap-3 text-left clickable-row" style={{ backgroundColor: `${alert.color}0A`, border: `1px solid ${alert.color}22` }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: alert.color }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: alert.color }}>{alert.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--neutral-700)', marginTop: '2px' }}>{alert.body}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 border border-[var(--neutral-250)]">
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--neutral-900)' }}>Portfolio Health</h3>
          <button onClick={() => onNavigate('credit-dpd')} className="hover:text-[var(--brand-accent-700)] transition-colors" style={{ fontSize: '13px', color: 'var(--brand-accent)', fontWeight: 700 }}>DPD Monitoring →</button>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {dpdData.map(d => (
            <button key={d.label} onClick={() => onNavigate('credit-dpd')} className="p-3 rounded-lg text-left clickable-row" style={{ backgroundColor: 'var(--neutral-150)' }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: 500 }}>{d.label}</span>
                <span style={{ fontSize: '18px', color: d.color, fontWeight: 700 }}>{d.count}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--neutral-200)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${d.pct}%`, backgroundColor: d.color }} />
              </div>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-6" style={{ fontSize: '13px', color: 'var(--neutral-700)' }}>
          <span>Outstanding: <strong style={{ fontFamily: 'Roboto Mono' }}>₹1,84,20,000</strong></span>
          <span>Avg Loan: <strong style={{ fontFamily: 'Roboto Mono' }}>₹1,25,306</strong></span>
          <span>NPA: <strong style={{ color: 'var(--error-700)' }}>1.4%</strong></span>
          <span className="ml-auto flex items-center gap-1" style={{ color: 'var(--success-600)', fontWeight: 700 }}><Check size={14} /> Synced 11:42 AM</span>
        </div>
      </div>
    </Shell>
  );
}
