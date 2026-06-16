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
      <div className="mb-6 p-4 rounded-xl border border-[#FDE68A] flex items-center justify-between" style={{ backgroundColor: '#FFFBEB' }}>
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-[#F59E0B] text-white flex items-center justify-center font-bold text-sm">!</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#92400E' }}>14 Files Pending Documentation</div>
            <div style={{ fontSize: '12px', color: '#3D4450', marginTop: '2px' }}>Next priority: Notarise PoA and Loan Agreement for Ramesh Patil (LO00000047).</div>
          </div>
        </div>
        <button onClick={() => onNavigate('cs-workspace')} className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: '#1A3C2A', fontSize: '13px', fontWeight: 700 }}>Open Workspace</button>
      </div>
      <RoleCommandCenter
        title="CS Workbench"
        focus="Finish documents blocking disbursement"
        primaryAction={{ label: 'Open document queue', detail: '14 files need CS action. Start with notarisation and witness gaps.', page: 'cs-queue', tone: 'green', badge: '14' }}
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
        <div className="col-span-7 bg-white rounded-xl border border-[#EDEEF0] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#EDEEF0]" style={{ backgroundColor: '#FDFAF4' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1A3C2A' }}>Pending Document Actions</h3>
          </div>
          {csDocQueue.map(row => {
            const color = row.icon === '!' ? '#EF4444' : row.icon === '✓' ? '#22C55E' : '#1E88E5';
            return (
              <button key={row.loan} onClick={() => onNavigate(row.page)} className="w-full px-5 py-4 flex items-center gap-4 text-left border-b border-[#EDEEF0] last:border-b-0 clickable-row">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}18`, color, fontWeight: 700 }}>{row.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span style={{ fontSize: '13px', fontFamily: 'Roboto Mono', color: '#1E88E5', fontWeight: 700 }}>{row.loan}</span>
                    <span style={{ fontSize: '14px', color: '#12151A', fontWeight: 700 }}>{row.borrower}</span>
                    <StatusBadge status={row.status} />
                  </div>
                  <div className="truncate" style={{ fontSize: '13px', color: '#3D4450', marginTop: '3px', fontWeight: 500 }}>{row.action}</div>
                </div>
                <span style={{ fontSize: '12px', color: '#1E88E5', fontWeight: 700 }}>{row.cta} →</span>
              </button>
            );
          })}
        </div>

        <div className="col-span-5 bg-white rounded-xl border border-[#EDEEF0] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#EDEEF0]" style={{ backgroundColor: '#FDFAF4' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1A3C2A' }}>Upcoming Deadlines</h3>
          </div>
          <div className="p-4 space-y-3">
            {csDeadlines.map(item => (
              <button key={item.date} onClick={() => onNavigate('cs-calendar')} className="w-full p-3 rounded-lg flex gap-3 text-left clickable-row" style={{ backgroundColor: item.severity === 'Critical' ? '#FEF2F2' : item.severity === 'Scheduled' ? '#F0FDF4' : '#FFFBEB', border: '1px solid #EDEEF0' }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: item.severity === 'Critical' ? '#EF4444' : item.severity === 'Scheduled' ? '#22C55E' : '#F59E0B' }} />
                <div className="flex-1">
                  <div style={{ fontSize: '13px', color: '#12151A', fontWeight: 700 }}>{item.date} — {item.title}</div>
                  <div className="mt-1"><StatusBadge status={item.status} /></div>
                </div>
              </button>
            ))}
            <div className="pt-3 border-t border-[#EDEEF0]">
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#12151A', marginBottom: '6px' }}>KYC Renewal</div>
              {['Ganesh Thorat — 8 days', 'Meena Kulkarni — 12 days', '+7 more in 30d'].map(item => (
                <button key={item} onClick={() => onNavigate('cs-kyc')} className="w-full text-left py-1.5 clickable-row rounded" style={{ fontSize: '13px', color: '#3D4450', padding: '4px 8px' }}>⚠ {item}</button>
              ))}
              <button onClick={() => onNavigate('cs-kyc')} className="mt-2 px-3 py-1.5 rounded-lg transition-all hover:shadow-sm active:scale-[0.98]" style={{ backgroundColor: '#1A3C2A', color: 'white', fontSize: '12px', fontWeight: 700 }}>Send Bulk Re-KYC</button>
            </div>
          </div>
        </div>
      </div>

    </Shell>
  );
}
