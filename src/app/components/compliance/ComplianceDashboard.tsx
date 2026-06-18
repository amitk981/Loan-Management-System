import { AlertTriangle, ArrowRight, CalendarClock, FileClock, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from '../shared/StatusBadge';
import { RoleCommandCenter } from '../shared/RoleCommandCenter';
import { useAuth } from '../../context/AuthContext';
import { csDeadlines, csDocQueue } from '../../data/complianceData';

interface ComplianceDashboardProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

export function ComplianceDashboard({ onNavigate, activePage }: ComplianceDashboardProps) {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Compliance', 'Dashboard']}
      pageTitle="CS Dashboard"
      pageSubtitle={`${greeting}, ${user?.name || 'Company Secretary'} · ${user?.roleLabel || 'Compliance'}`}
    >
      {/* Single focus: RoleCommandCenter is the one prioritised worklist + CTA
          (a duplicate "14 files pending" banner competed for the same action). */}
      <RoleCommandCenter
        title="CS Workbench"
        focus="Finish documents blocking disbursement"
        primaryAction={{ label: 'Open pending documents', detail: '14 files need CS action. Start with notarisation and witness gaps.', page: 'cs-queue', tone: 'green', badge: '14' }}
        metrics={[
          { label: 'Docs', value: '14', tone: 'amber' },
          { label: 'KYC', value: '9', tone: 'blue' },
          { label: 'NOC', value: '2', tone: 'green' },
        ]}
        secondaryActions={[
          { label: 'Workspace', detail: 'Complete PoA, term sheet, agreement and checklist.', page: 'cs-workspace', tone: 'green' },
          { label: 'KYC renewals', detail: 'Send Re-KYC requests before expiry.', page: 'cs-kyc', tone: 'blue' },
          { label: 'Issue NOC', detail: 'Close fully repaid loans and return security.', page: 'cs-noc', tone: 'amber' },
          { label: 'Compliance calendar', detail: 'Resolve statutory deadlines and evidence.', page: 'cs-calendar', tone: 'neutral' },
        ]}
        onNavigate={onNavigate}
      />

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-7 bg-white rounded-xl border border-[var(--neutral-200)] overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: 'var(--cream-50)', borderBottom: '2px solid var(--neutral-200)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--brand-light)', color: 'var(--brand-primary)' }}>
                <FileClock size={16} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--brand-primary)' }}>Pending Documents</h3>
              <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '11px', fontWeight: 700, minWidth: '22px', textAlign: 'center' }}>{csDocQueue.length}</span>
            </div>
            <button onClick={() => onNavigate('cs-queue')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--accent-blue-50)]" style={{ fontSize: '12px', color: 'var(--brand-accent)', fontWeight: 700 }}>View all <ArrowRight size={12} /></button>
          </div>
          {csDocQueue.map((row, i) => {
            const color = row.icon === '!' ? 'var(--error-500)' : row.icon === '✓' ? 'var(--success-500)' : 'var(--brand-accent)';
            const RowIcon = row.icon === '!' ? AlertTriangle : row.icon === '✓' ? CheckCircle2 : ArrowRight;
            return (
              <button key={row.loan} onClick={() => onNavigate(row.page)} className="w-full px-5 py-4 flex items-center gap-4 text-left clickable-row" style={{ borderBottom: i < csDocQueue.length - 1 ? '1px solid var(--neutral-200)' : 'none' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}12`, color, border: `1px solid ${color}25` }}><RowIcon size={16} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span style={{ fontSize: '12px', fontFamily: 'Roboto Mono', color: 'var(--brand-accent)', fontWeight: 700 }}>{row.loan}</span>
                    <span style={{ fontSize: '14px', color: 'var(--neutral-900)', fontWeight: 700 }}>{row.borrower}</span>
                    <StatusBadge status={row.status} />
                  </div>
                  <div className="truncate" style={{ fontSize: '13px', color: 'var(--neutral-700)', marginTop: '3px', fontWeight: 500 }}>{row.action}</div>
                  <div className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-md" style={{ backgroundColor: 'var(--neutral-100)', fontSize: '11px', color: 'var(--neutral-500)', fontWeight: 500, border: '1px solid var(--neutral-200)' }}>{row.detail}</div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl flex-shrink-0 transition-colors" style={{ fontSize: '12px', color: 'var(--brand-accent)', fontWeight: 700, backgroundColor: 'var(--accent-blue-50)', border: '1px solid var(--info-200)' }}>{row.cta} <ArrowRight size={12} /></span>
              </button>
            );
          })}
        </div>

        <div className="col-span-5 bg-white rounded-xl border border-[var(--neutral-200)] overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: 'var(--cream-50)', borderBottom: '2px solid var(--neutral-200)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--error-50)', color: 'var(--error-500)' }}>
                <CalendarClock size={16} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--brand-primary)' }}>Upcoming Deadlines</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--error-50)', color: 'var(--error-700)', fontSize: '11px', fontWeight: 700, border: '1px solid var(--error-200)' }}>{csDeadlines.filter(d => d.severity === 'Critical').length} overdue</span>
          </div>
          <div className="p-4 space-y-3">
            {csDeadlines.map(item => {
              const sevColor = item.severity === 'Critical' ? 'var(--error-500)' : item.severity === 'Scheduled' ? 'var(--success-500)' : 'var(--warning-500)';
              const sevBorder = item.severity === 'Critical' ? 'var(--error-200)' : item.severity === 'Scheduled' ? 'var(--success-200)' : 'var(--warning-200)';
              const SevIcon = item.severity === 'Critical' ? ShieldAlert : item.severity === 'Scheduled' ? CheckCircle2 : CalendarClock;
              return (
              <button key={item.date} onClick={() => onNavigate('cs-calendar')} className="w-full p-3.5 rounded-xl flex gap-3 text-left clickable-row" style={{ backgroundColor: item.severity === 'Critical' ? 'var(--error-50)' : item.severity === 'Scheduled' ? 'var(--success-50)' : 'var(--warning-50)', border: `1px solid ${sevBorder}` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${sevColor}1A`, color: sevColor }}><SevIcon size={16} /></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div style={{ fontSize: '13px', color: 'var(--neutral-900)', fontWeight: 700 }}>{item.title}</div>
                    <span style={{ fontSize: '11px', color: sevColor, fontWeight: 700 }}>{item.date}</span>
                  </div>
                  <div className="mt-1.5"><StatusBadge status={item.status} /></div>
                </div>
              </button>
            );})}
            <div className="pt-4 mt-1 border-t-2 border-[var(--neutral-200)]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--success-50)', color: 'var(--success-500)' }}><CheckCircle2 size={13} /></div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--neutral-900)' }}>KYC Renewal</span>
                </div>
                <span className="px-2 py-0.5 rounded-full" style={{ fontSize: '11px', fontWeight: 700, backgroundColor: 'var(--success-50)', color: 'var(--success-600)' }}>739 / 769</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden mb-3" style={{ backgroundColor: 'var(--neutral-200)' }}>
                <div className="h-full rounded-full" style={{ width: '96%', backgroundColor: 'var(--success-500)' }} />
              </div>
              <div className="space-y-1 mb-3">
                {['Ganesh Thorat — 8 days', 'Meena Kulkarni — 12 days', '+7 more in 30d'].map(item => (
                  <button key={item} onClick={() => onNavigate('cs-kyc')} className="w-full text-left py-1.5 px-2.5 clickable-row rounded-lg flex items-center gap-2" style={{ fontSize: '12px', color: 'var(--neutral-700)' }}>
                    <AlertTriangle size={11} style={{ color: 'var(--warning-500)', flexShrink: 0 }} /> {item}
                  </button>
                ))}
              </div>
              <button onClick={() => onNavigate('cs-kyc')} className="w-full px-3 py-2 rounded-xl transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-1.5" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '12px', fontWeight: 700 }}>
                <ArrowRight size={13} /> Send Bulk Re-KYC
              </button>
            </div>
          </div>
        </div>
      </div>

    </Shell>
  );
}
