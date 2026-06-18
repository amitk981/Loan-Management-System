import { Bell, CreditCard, ChevronDown, Download, FileText, User, Search, Users, CheckCircle, Calendar, ShieldAlert, DollarSign, Mail } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from './StatusBadge';
import { AuditTrailPanel, RoleAccessNote, UniversalStageTracker } from './CrossRoleComponents';
import { mockDocuments, mockLoans, mockNotifications, mockRepayments } from '../../data/mockData';
import { crossRoleNotifications } from '../../data/crossRoleData';
import { useAuth, UserRole } from '../../context/AuthContext';
import { formatCurrency } from '../../lib/format';

interface UtilityScreenProps {
  onNavigate: (page: string) => void;
  activePage: string;
}


export function NotificationsCenter({ onNavigate, activePage }: UtilityScreenProps) {
  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Notifications']}
      pageTitle="Notifications Center"
      pageSubtitle="Alerts and role tasks"
    >
      <div className="grid grid-cols-4 gap-5 mb-5">
        {[
          ['Unread', '7', 'var(--error-500)', 'notifications-center'],
          ['Credit Tasks', '2', 'var(--brand-primary)', 'shared-notifications'],
          ['Compliance Tasks', '3', 'var(--brand-secondary)', 'shared-notifications'],
          ['Treasury Tasks', '2', 'var(--accent-treasury)', 'shared-notifications'],
        ].map(([label, value, color, page]) => (
          <button key={label} onClick={() => onNavigate(page)} className="bg-white rounded-2xl p-4 border border-[var(--neutral-200)] text-left clickable-card">
            <div style={{ fontSize: '12px', color: 'var(--neutral-400)', fontWeight: 700 }}>{label}</div>
            <div style={{ fontSize: '28px', color, fontWeight: 700, fontFamily: 'Roboto Mono' }}>{value}</div>
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-[var(--neutral-200)] overflow-hidden">
        {crossRoleNotifications.map(item => (
          <button key={item.id} onClick={() => onNavigate(item.route)} className="w-full px-5 py-4 border-b border-[var(--neutral-200)] last:border-b-0 flex items-start gap-3 text-left clickable-row">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--info-100)' }}>
              <Bell size={16} style={{ color: 'var(--brand-accent)' }} />
            </div>
            <div className="flex-1">
              <div style={{ fontSize: '14px', color: 'var(--neutral-900)', fontWeight: 700 }}>{item.message}</div>
              <div style={{ fontSize: '13px', color: 'var(--neutral-700)', marginTop: '2px' }}>{item.detail}</div>
              <div style={{ fontSize: '11px', color: 'var(--neutral-400)', marginTop: '6px' }}>{item.fromRole} → {item.toRole} · {item.priority}</div>
            </div>
            <span className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--info-50)', color: 'var(--accent-treasury)', fontSize: '12px', fontWeight: 700 }}>{item.cta}</span>
          </button>
        ))}
      </div>
    </Shell>
  );
}

export function UserProfile({ onNavigate, activePage }: UtilityScreenProps) {
  const { user } = useAuth();
  if (!user) return null;

  if (user.role === 'farmer') {
    const loan = mockLoans[0];
    return (
      <Shell
        activePage={activePage}
        onNavigate={onNavigate}
        breadcrumbs={['My Account', 'Profile']}
        pageTitle="My Profile"
        pageSubtitle={`${user.name} · Folio ${user.folioNo || loan.folioNo} · Member since ${user.memberSince || '2019'}`}
        actions={<StatusBadge status="Active Member" size="md" />}
      >
        <div className="grid grid-cols-5 gap-5">
          <div className="col-span-2 bg-white rounded-2xl p-5 border border-[var(--neutral-200)]">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: 'var(--brand-accent)', fontSize: 18, fontWeight: 700 }}>
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div style={{ fontSize: 18, color: 'var(--neutral-900)', fontWeight: 700 }}>{user.name}</div>
                <div style={{ fontSize: 13, color: 'var(--neutral-500)', marginTop: 2 }}>{user.roleLabel}</div>
              </div>
            </div>
            {[
              ['Mobile', user.mobile],
              ['Email', user.email],
              ['Folio Number', user.folioNo || loan.folioNo],
              ['Village', loan.village],
              ['Shares Held', `${loan.shares}`],
            ].map(([label, value]) => (
              <div key={label} className="py-3 border-b border-[var(--neutral-200)] last:border-0">
                <div style={{ fontSize: 11, color: 'var(--neutral-400)', fontWeight: 700, textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontSize: 13, color: 'var(--neutral-900)', fontWeight: 700, marginTop: 4 }}>{value}</div>
              </div>
            ))}
          </div>
          <div className="col-span-3 space-y-5">
            <div className="bg-white rounded-2xl p-5 border border-[var(--neutral-200)]">
              <div style={{ fontSize: 12, color: 'var(--brand-accent)', fontWeight: 700, textTransform: 'uppercase' }}>Active Loan</div>
              <div style={{ fontSize: 20, color: 'var(--neutral-900)', fontWeight: 700, marginTop: 6, fontFamily: 'Roboto Mono' }}>{loan.id}</div>
              <div className="grid grid-cols-3 gap-3 mt-5">
                {[
                  ['Outstanding', formatCurrency(loan.outstandingPrincipal + loan.outstandingInterest)],
                  ['Sanctioned', formatCurrency(loan.sanctionedAmount)],
                  ['Status', loan.status],
                ].map(([label, value]) => (
                  <div key={label} className="p-3 rounded-xl" style={{ backgroundColor: 'var(--neutral-100)', border: '1px solid var(--neutral-200)' }}>
                    <div style={{ fontSize: 11, color: 'var(--neutral-500)', fontWeight: 700 }}>{label}</div>
                    <div style={{ fontSize: 16, color: 'var(--neutral-900)', fontWeight: 700, fontFamily: label !== 'Status' ? 'Roboto Mono' : 'inherit', marginTop: 4 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Track loan', page: 'farmer-active-loans', note: 'Status, schedule and timeline', icon: <Calendar size={18} />, color: 'var(--brand-primary)' },
                { label: 'Make payment', page: 'farmer-repayment', note: 'Pay instalment or upload UTR', icon: <CreditCard size={18} />, color: 'var(--success-500)' },
                { label: 'My documents', page: 'farmer-documents', note: 'Agreements, invoices and forms', icon: <FileText size={18} />, color: 'var(--brand-accent)' },
              ].map(item => (
                <button key={item.page} onClick={() => onNavigate(item.page)} className="bg-white rounded-2xl p-4 border border-[var(--neutral-200)] text-left clickable-card">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${item.color}15`, color: item.color }}>{item.icon}</div>
                  <div style={{ fontSize: 14, color: 'var(--neutral-900)', fontWeight: 700 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--neutral-700)', lineHeight: '18px', marginTop: 6 }}>{item.note}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  const profileMeta: Record<UserRole, {
      focus: string;
      scope: string;
      pages: { label: string; page: string; note: string }[];
      metrics: string[][];
    }> = {
      farmer: { focus: '', scope: '', pages: [], metrics: [] },
      credit: {
        focus: 'Application intake, appraisal quality and portfolio monitoring',
        scope: 'Can edit application details, prepare appraisal notes and monitor active loans.',
        pages: [
          { label: 'Open Intake', page: 'credit-queue', note: 'Verify new applications and document gaps' },
          { label: 'Prepare Appraisal', page: 'credit-review', note: 'Complete eligibility, risk and recommendation' },
          { label: 'Monitor DPD', page: 'credit-dpd', note: 'Review overdue buckets and recovery notes' },
        ],
        metrics: [['Open Applications', '12'], ['Under Review', '5'], ['SC Pending', '2']],
      },
      compliance: {
        focus: 'Legal file completion, KYC renewal and closure documentation',
        scope: 'Can prepare instruments, verify KYC, issue NOC and maintain registers.',
        pages: [
          { label: 'Document Queue', page: 'cs-queue', note: 'Resolve file blocks before disbursement' },
          { label: 'KYC Renewals', page: 'cs-kyc', note: 'Send requests and track expiry windows' },
          { label: 'NOC Queue', page: 'cs-noc', note: 'Close repaid loans and archive files' },
        ],
        metrics: [['Doc Queue', '14'], ['KYC Due', '9'], ['NOC', '2']],
      },
      sanction: {
        focus: 'Sanction decisions, exposure oversight and recovery authority',
        scope: 'Can approve, reject, return and authorize default action within authority rules.',
        pages: [
          { label: 'Approval Queue', page: 'sc-awaiting', note: 'Review applications awaiting decision' },
          { label: 'Joint Approvals', page: 'sc-joint', note: 'Co-sign loans above authority threshold' },
          { label: 'Portfolio Health', page: 'sc-health', note: 'Review exposure and overdue risk' },
        ],
        metrics: [['Awaiting', '7'], ['Joint', '2'], ['Special', '1']],
      },
      treasury: {
        focus: 'Disbursement execution, SAP posting and repayment reconciliation',
        scope: 'Can initiate payments, prepare SAP entries and reconcile receipts.',
        pages: [
          { label: 'Disbursements', page: 'treasury-pending', note: 'Initiate files released by CS' },
          { label: 'Authorizations', page: 'treasury-auth', note: 'Review payment authorization queue' },
          { label: 'Reconciliation', page: 'treasury-reconciliation', note: 'Clear bank/SAP mismatches' },
        ],
        metrics: [['Ready Files', '4'], ['Auth', '2'], ['SAP Gaps', '1']],
      },
      admin: {
        focus: 'Users, limits, configuration and audit controls',
        scope: 'Can manage access, monitor statutory limits and inspect immutable events.',
        pages: [
          { label: 'Users', page: 'admin-users', note: 'Manage accounts and role access' },
          { label: 'Portfolio', page: 'admin-portfolio', note: 'Review system-wide loan health' },
          { label: 'Audit Log', page: 'admin-audit', note: 'Inspect workflow and access records' },
        ],
        metrics: [['Users', '6'], ['Limits', '62%'], ['Audit', 'Live']],
      },
    };
  const meta = profileMeta[user.role];

  const roleColors: Record<string, { primary: string; gradient: string; light: string; accent: string }> = {
    credit: { primary: 'var(--brand-primary)', gradient: 'linear-gradient(135deg, #1a3c2a 0%, #2d6a4f 60%, #40916c 100%)', light: 'var(--brand-light)', accent: 'var(--brand-accent)' },
    compliance: { primary: 'var(--brand-primary)', gradient: 'linear-gradient(135deg, #1a3c2a 0%, #2d5a3f 60%, #357a55 100%)', light: 'var(--brand-light)', accent: 'var(--brand-secondary)' },
    sanction: { primary: 'var(--accent-sanction)', gradient: 'linear-gradient(135deg, #4a2c0a 0%, #7c4a1e 60%, #a56b35 100%)', light: '#fef3e2', accent: 'var(--accent-sanction)' },
    treasury: { primary: 'var(--accent-treasury)', gradient: 'linear-gradient(135deg, #0a2540 0%, #1a4a6e 60%, #2d6a9f 100%)', light: '#e8f4fd', accent: 'var(--accent-treasury)' },
    admin: { primary: 'var(--neutral-700)', gradient: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 60%, #44445e 100%)', light: 'var(--neutral-100)', accent: 'var(--neutral-700)' },
  };
  const rc = roleColors[user.role] || roleColors.credit;
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const quickActionIcons = [
    { icon: <Search size={20} />, color: rc.primary, bg: rc.light },
    { icon: <FileText size={20} />, color: rc.accent, bg: `${rc.accent}12` },
    { icon: <ShieldAlert size={20} />, color: 'var(--warning-600)', bg: 'var(--warning-100)' },
  ];

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Workspace', 'My Workspace']}
      pageTitle="My Workspace"
      pageSubtitle={`${user.name} · ${user.roleLabel}`}
    >
      {/* ── Hero Profile Header ── */}
      <div className="rounded-2xl overflow-hidden mb-6" style={{ background: rc.gradient, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
        <div className="px-8 py-7 flex items-center gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', fontSize: 26, fontWeight: 700, border: '2px solid rgba(255,255,255,0.2)' }}>
              {initials}
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#22c55e', border: '3px solid #1a3c2a' }}>
              <CheckCircle size={10} className="text-white" />
            </div>
          </div>

          {/* Name & Role */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1.5">
              <h2 style={{ fontSize: 24, fontWeight: 700, color: 'white', lineHeight: '30px' }}>{user.name}</h2>
              <span className="px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: 700, letterSpacing: '0.03em', border: '1px solid rgba(255,255,255,0.12)' }}>
                {user.roleLabel}
              </span>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: '22px', maxWidth: 560 }}>
              {meta.focus}
            </p>
          </div>

          {/* Status & ID */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.6)' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#86efac' }}>Active</span>
            </div>
            <div className="text-right">
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>USER ID</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 700, fontFamily: 'Roboto Mono' }}>{user.id}</div>
            </div>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="px-8 py-3 flex items-center gap-6" style={{ backgroundColor: 'rgba(0,0,0,0.15)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2">
            <Mail size={13} style={{ color: 'rgba(255,255,255,0.4)' }} />
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{user.email}</span>
          </div>
          <div style={{ width: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.1)' }} />
          <div className="flex items-center gap-2">
            <User size={13} style={{ color: 'rgba(255,255,255,0.4)' }} />
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{user.mobile}</span>
          </div>
          <div style={{ width: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.1)' }} />
          <div className="flex items-center gap-2">
            <Users size={13} style={{ color: 'rgba(255,255,255,0.4)' }} />
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Sahyadri Farms</span>
          </div>
        </div>
      </div>

      {/* ── Metrics Strip ── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {meta.metrics.map(([label, value], i) => {
          const colors = [
            { text: rc.primary, bg: rc.light, border: `${rc.primary}25`, dot: rc.primary },
            { text: 'var(--brand-accent)', bg: 'var(--accent-blue-50)', border: 'var(--accent-blue-50)', dot: 'var(--brand-accent)' },
            { text: 'var(--warning-600)', bg: 'var(--warning-100)', border: 'var(--warning-100)', dot: 'var(--warning-600)' },
          ][i % 3];
          return (
            <div key={label} className="bg-white rounded-xl p-5 border border-[var(--neutral-200)] relative overflow-hidden" style={{ transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}>
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--neutral-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.dot }} />
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: colors.text, fontFamily: 'Roboto Mono', lineHeight: '38px' }}>{value}</div>
              <div className="mt-2 inline-flex px-2.5 py-1 rounded-full" style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: colors.text }}>
                  {i === 0 ? 'In your queue' : i === 1 ? 'Needs attention' : 'Pending review'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Quick Actions + Info ── */}
      <div className="grid grid-cols-5 gap-5">
        {/* Quick actions — 3 cols */}
        <div className="col-span-3">
          <div className="flex items-center gap-2 mb-3">
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--neutral-900)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Quick Actions</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--neutral-200)' }} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {meta.pages.map((item, i) => {
              const qa = quickActionIcons[i % 3];
              return (
                <button key={item.page} onClick={() => onNavigate(item.page)} className="bg-white rounded-xl p-5 border border-[var(--neutral-200)] text-left group" style={{ transition: 'all 0.2s ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: qa.bg, color: qa.color }}>
                    {qa.icon}
                  </div>
                  <div style={{ fontSize: 15, color: 'var(--neutral-900)', fontWeight: 700, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--neutral-500)', lineHeight: '18px' }}>{item.note}</div>
                  <div className="mt-3 flex items-center gap-1" style={{ fontSize: 12, fontWeight: 700, color: qa.color }}>
                    Open <ChevronDown size={12} className="rotate-[-90deg]" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Role Info Panel — 2 cols */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--neutral-900)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Role Details</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--neutral-200)' }} />
          </div>

          {/* Access Scope */}
          <div className="bg-white rounded-xl p-5 border border-[var(--neutral-200)]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: rc.light, color: rc.primary }}>
                <ShieldAlert size={16} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--neutral-900)' }}>Access Scope</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--neutral-600)', lineHeight: '20px' }}>{meta.scope}</p>
          </div>

          {/* Session Info */}
          <div className="bg-white rounded-xl p-5 border border-[var(--neutral-200)]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-blue-50)', color: 'var(--brand-accent)' }}>
                <Calendar size={16} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--neutral-900)' }}>Session Info</span>
            </div>
            <div className="space-y-2.5">
              {[
                ['Last Login', 'Today, 10:32 AM'],
                ['Sessions (7d)', '12 active sessions'],
                ['Organization', 'Sahyadri Farms FPC Ltd.'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between">
                  <span style={{ fontSize: 12, color: 'var(--neutral-400)', fontWeight: 500 }}>{label}</span>
                  <span style={{ fontSize: 12, color: 'var(--neutral-800)', fontWeight: 700 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Audit Trail ── */}
      <div className="mt-6">
        <AuditTrailPanel farmerSafe={false} />
      </div>
    </Shell>
  );
}

const mockFarmers = {
  'Ramesh Patil': {
    name: 'Ramesh Patil',
    folioNo: 'SH-04821',
    village: 'Dindori, Nashik',
    status: 'Active Member',
    shares: 250,
    shareType: 'Physical (D-MAT pending)',
    shareValuation: '₹5,00,000 (₹2,000/share)',
    mobile: '9876543210',
    email: 'ramesh.patil@email.com',
    nominee: 'Sanjay Patil (Son)',
    crop: 'Grapes',
    landArea: '3.5 acres',
    bank: 'State Bank of India',
    bankAccount: 'XXXX XXXX 4821',
    ifsc: 'SBIN0001234',
    kycStatus: 'Verified · CKYC linked',
    reKycDue: 'Aug 2026',
    stage: 5,
    activeLoan: {
      id: 'LO00000047',
      amount: 200000,
      outstandingPrincipal: 142500,
      outstandingInterest: 0,
      nextDueDate: '31 Mar 2027',
      dpd: 0,
      riskRating: 'Low (A+)',
    },
    loans: [
      { id: 'LO00000047', amount: 200000, status: 'Active', dpd: 0, date: '10 Jun 2026' },
      { id: 'LO00000031', amount: 80000, status: 'Fully Repaid', dpd: 0, date: '15 Oct 2024' },
    ],
    complianceNotes: 'Special Case: Director relationship resolved via Board approval recorded on 09 Jun 2026.',
  },
  'Sunanda More': {
    name: 'Sunanda More',
    folioNo: 'SH-02941',
    village: 'Niphad, Nashik',
    status: 'Active Member',
    shares: 120,
    shareType: 'Physical',
    shareValuation: '₹2,40,000 (₹2,000/share)',
    mobile: '9876543222',
    email: 'sunanda.more@email.com',
    nominee: 'Asha More (Daughter)',
    crop: 'Tomato',
    landArea: '2.0 acres',
    bank: 'HDFC Bank',
    bankAccount: 'XXXX XXXX 7721',
    ifsc: 'HDFC0000123',
    kycStatus: 'Verified',
    reKycDue: 'Dec 2026',
    stage: 4,
    activeLoan: {
      id: 'LO00000049',
      amount: 150000,
      outstandingPrincipal: 150000,
      outstandingInterest: 0,
      nextDueDate: '30 Jun 2027',
      dpd: 0,
      riskRating: 'Medium (B)',
    },
    loans: [
      { id: 'LO00000049', amount: 150000, status: 'Pending Initiation', dpd: 0, date: '08 Jun 2026' },
    ],
    complianceNotes: 'Awaiting tri-party deduction consent form sign-off from Post Harvest Care division.',
  },
  'Vilas Jadhav': {
    name: 'Vilas Jadhav',
    folioNo: 'SH-01284',
    village: 'Pimpalgaon, Nashik',
    status: 'In Default ⚠️',
    shares: 80,
    shareType: 'Physical (Invoked)',
    shareValuation: '₹1,60,000 (₹2,000/share)',
    mobile: '9876543233',
    email: 'vilas.j@email.com',
    nominee: 'Sunita Jadhav (Wife)',
    crop: 'Pomegranate',
    landArea: '1.8 acres',
    bank: 'Bank of Baroda',
    bankAccount: 'XXXX XXXX 5678',
    ifsc: 'BARB0NASHIK',
    kycStatus: 'Re-KYC Overdue ⚠️',
    reKycDue: 'Expired Jan 2026',
    stage: 6,
    activeLoan: {
      id: 'LO00000022',
      amount: 120000,
      outstandingPrincipal: 120000,
      outstandingInterest: 9600,
      nextDueDate: '15 Mar 2024',
      dpd: 1247,
      riskRating: 'High (D)',
    },
    loans: [
      { id: 'LO00000022', amount: 120000, status: 'In Default', dpd: 1247, date: '12 Dec 2023' },
    ],
    complianceNotes: 'Security invocation authorized. Board approval recorded. CS to present undated cheque and execute SH-4 share transfer.',
  },
};

export function MemberLoanProfile({ onNavigate, activePage }: UtilityScreenProps) {
  const [selectedFarmerName, setSelectedFarmerName] = useState<keyof typeof mockFarmers>('Ramesh Patil');
  const [activeTab, setActiveTab] = useState<'personal' | 'shareholding' | 'loan-history' | 'kyc-docs' | 'compliance-notes'>('personal');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const farmer = mockFarmers[selectedFarmerName];
  const loan = farmer.activeLoan;

  const filteredFarmerNames = Object.keys(mockFarmers).filter(name =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Workspace', 'Borrower Lookup']}
      pageTitle="Borrower Lookup"
      pageSubtitle={`${farmer.name} · ${farmer.folioNo} · Active Loan: ${loan.id}`}
      actions={
        <div className="flex gap-2">
          <button onClick={() => onNavigate('shared-audit-trail')} className="px-3 py-2 rounded-lg border border-[var(--neutral-200)] hover:bg-[var(--neutral-100)]" style={{ fontSize: '13px', fontWeight: 700 }}>
            View Audit Log
          </button>
          <StatusBadge status={farmer.status} size="md" />
        </div>
      }
    >
      <div className="mb-5"><RoleAccessNote /></div>
      <div className="mb-5"><UniversalStageTracker currentStage={farmer.stage} /></div>

      {/* Search / Selection Selector */}
      <div className="bg-white rounded-2xl p-5 border border-[var(--neutral-200)] mb-5 shadow-sm relative">
        <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-[var(--neutral-400)]">Select Borrower Profile</label>
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--neutral-400)]" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setShowDropdown(true)}
              onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
              placeholder={`Current: ${farmer.name} (Type to lookup another shareholder)`}
              className="w-full pl-9 pr-4 rounded-xl border border-[var(--neutral-300)] focus:outline-none focus:border-[var(--brand-primary)]"
              style={{ height: '40px', fontSize: '14px' }}
            />
            {showDropdown && (
              <div className="absolute left-0 right-0 top-11 bg-white border border-[var(--neutral-200)] rounded-xl shadow-lg z-50 overflow-hidden max-h-48 overflow-y-auto">
                {filteredFarmerNames.length > 0 ? (
                  filteredFarmerNames.map(name => (
                    <button
                      key={name}
                      onClick={() => {
                        setSelectedFarmerName(name as keyof typeof mockFarmers);
                        setSearchQuery('');
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-[var(--neutral-100)] transition-colors border-b border-[var(--neutral-200)] last:border-0"
                      style={{ fontSize: '13px', color: 'var(--neutral-900)', fontWeight: 500 }}
                    >
                      {name} · Folio {mockFarmers[name as keyof typeof mockFarmers].folioNo}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-[var(--neutral-400)]">No shareholders found</div>
                )}
              </div>
            )}
          </div>
          {showDropdown && (
            <button
              onClick={() => setShowDropdown(false)}
              className="px-3 py-2 rounded-lg border border-[var(--neutral-200)] text-xs font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* Left column: Overview */}
        <div className="col-span-2 space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-[var(--neutral-200)] shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--brand-light)] text-[var(--brand-primary)] font-bold text-lg">
                {farmer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--neutral-900)' }}>{farmer.name}</div>
                <div style={{ fontSize: '13px', color: 'var(--neutral-400)' }}>{farmer.village} · Shareholder</div>
              </div>
            </div>
            {[
              ['Folio Number', farmer.folioNo],
              ['Mobile Phone', farmer.mobile],
              ['Email ID', farmer.email],
              ['Shares Value', farmer.shareValuation],
              ['Nominee', farmer.nominee],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b border-[var(--neutral-200)] last:border-0">
                <span style={{ fontSize: '12px', color: 'var(--neutral-400)', fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: '13px', color: 'var(--neutral-900)', fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[var(--neutral-200)] shadow-sm">
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--neutral-900)', marginBottom: '12px' }}>Eligibility Limits</h3>
            {[
              ['Shareholding-based Limit', formatCurrency(farmer.shares * 200)],
              ['Land Scale of Finance Limit', formatCurrency(farmer.landArea.includes('3.5') ? 350000 : farmer.landArea.includes('2.0') ? 200000 : 180000)],
              ['Final Eligible Limit', formatCurrency(farmer.shares * 200)],
              ['Current Outstanding', formatCurrency(loan.outstandingPrincipal + loan.outstandingInterest)],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-[var(--neutral-200)] last:border-0">
                <span style={{ fontSize: '12px', color: 'var(--neutral-400)' }}>{label}</span>
                <span style={{ fontSize: '13px', color: 'var(--neutral-900)', fontWeight: 700, fontFamily: 'Roboto Mono' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: 5-Tab Area */}
        <div className="col-span-3 space-y-5">
          <div className="bg-white rounded-2xl border border-[var(--neutral-200)] shadow-sm overflow-hidden">
            {/* Tabs Header */}
            <div className="flex border-b border-[var(--neutral-200)] bg-[var(--neutral-100)]">
              {[
                { id: 'personal', label: 'Personal Details' },
                { id: 'shareholding', label: 'Shareholding' },
                { id: 'loan-history', label: 'Loan History' },
                { id: 'kyc-docs', label: 'KYC Docs' },
                { id: 'compliance-notes', label: 'CS Notes' },
              ].map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className="flex-1 py-3 text-center border-b-2 font-medium transition-all hover:bg-white/50"
                    style={{
                      fontSize: '12.5px',
                      color: isActive ? 'var(--brand-primary)' : 'var(--neutral-500)',
                      borderColor: isActive ? 'var(--brand-primary)' : 'transparent',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div className="p-5">
              {activeTab === 'personal' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--neutral-400)] mb-2">Personal & Agriculture Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoField label="Crop Cultivated" value={farmer.crop} />
                    <InfoField label="Land Size" value={farmer.landArea} />
                    <InfoField label="Primary Bank" value={farmer.bank} />
                    <InfoField label="IFSC Code" value={farmer.ifsc} mono />
                    <InfoField label="Bank Account" value={farmer.bankAccount} mono />
                    <InfoField label="KYC Link Status" value={farmer.kycStatus} />
                  </div>
                </div>
              )}

              {activeTab === 'shareholding' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--neutral-400)] mb-2">Shareholding Structure</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <InfoField label="Total Shares Held" value={`${farmer.shares} shares`} />
                    <InfoField label="Share Type" value={farmer.shareType} />
                    <InfoField label="Estimated NAV Valuation" value={farmer.shareValuation} />
                    <InfoField label="Pledge Status" value={farmer.activeLoan.dpd > 0 ? 'Pledged (Restricted) 🔒' : 'Pledged ✅'} />
                  </div>
                  <div className="p-3 bg-[var(--neutral-100)] rounded-xl border border-[var(--neutral-200)] text-xs text-[var(--neutral-700)]">
                    <strong>Folio History:</strong> Share capital certificate issued on 15 Oct 2019. Checked by CS during loan intake. D-MAT transfer in progress.
                  </div>
                </div>
              )}

              {activeTab === 'loan-history' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--neutral-400)] mb-2">Loan History Table</h4>
                  <div className="table-scroll">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[var(--neutral-200)]">
                          <th className="pb-2 text-left text-xs font-bold uppercase text-[var(--neutral-400)]">Loan ID</th>
                          <th className="pb-2 text-right text-xs font-bold uppercase text-[var(--neutral-400)]">Amount</th>
                          <th className="pb-2 text-left text-xs font-bold uppercase text-[var(--neutral-400)]">Status</th>
                          <th className="pb-2 text-right text-xs font-bold uppercase text-[var(--neutral-400)]">DPD</th>
                          <th className="pb-2 text-left text-xs font-bold uppercase text-[var(--neutral-400)]">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {farmer.loans.map(lh => (
                          <tr key={lh.id} className="border-b border-[var(--neutral-200)] last:border-0 hover:bg-[var(--neutral-100)]">
                            <td className="py-2.5 text-sm font-medium text-[var(--brand-accent)] font-mono">{lh.id}</td>
                            <td className="py-2.5 text-sm text-right font-mono">{formatCurrency(lh.amount)}</td>
                            <td className="py-2.5 text-sm"><StatusBadge status={lh.status} /></td>
                            <td className="py-2.5 text-sm text-right font-mono" style={{ color: lh.dpd > 0 ? 'var(--error-500)' : 'var(--success-500)' }}>{lh.dpd} d</td>
                            <td className="py-2.5 text-sm text-[var(--neutral-700)]">{lh.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'kyc-docs' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--neutral-400)]">KYC Documents Checklist</h4>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--warning-100)] text-[var(--gold-500)]">Re-KYC: {farmer.reKycDue}</span>
                  </div>
                  {[
                    ['PAN Card', 'Verified ✓', 'AABCG1234D'],
                    ['Aadhaar Card', 'Verified ✓', 'XXXX-XXXX-4821'],
                    ['7/12 Land Extract', 'Verified ✓', 'Dated May 2026'],
                    ['Bank Cancelled Cheque', 'Verified ✓', 'SBI Main Branch'],
                  ].map(([doc, status, detail]) => (
                    <div key={doc} className="flex justify-between items-center p-2.5 bg-[var(--neutral-100)] rounded-xl border border-[var(--neutral-200)]">
                      <div>
                        <div className="text-xs font-bold text-[var(--neutral-900)]">{doc}</div>
                        <div className="text-xs text-[var(--neutral-400)] font-mono mt-0.5">{detail}</div>
                      </div>
                      <span className="text-xs font-bold text-[var(--success-500)]">{status}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'compliance-notes' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--neutral-400)] mb-2">Internal CS Compliance Notes</h4>
                  <div className="p-4 rounded-xl border-2" style={{ borderColor: farmer.activeLoan.dpd > 0 ? 'var(--error-100)' : 'var(--success-200)', backgroundColor: farmer.activeLoan.dpd > 0 ? 'var(--error-50)' : 'var(--success-50)' }}>
                    <div className="flex items-start gap-2">
                      <ShieldAlert size={16} className="mt-0.5" style={{ color: farmer.activeLoan.dpd > 0 ? 'var(--error-500)' : 'var(--success-500)' }} />
                      <div className="text-sm text-[var(--neutral-700)] leading-relaxed">
                        {farmer.complianceNotes}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-[var(--neutral-400)]">
                    Note: CS Compliance remarks are internal records and are strictly redacted from the Farmer Portal view.
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--neutral-200)] bg-white hover:bg-[var(--neutral-100)] transition-colors" style={{ fontSize: '13px', fontWeight: 700 }}>
              <Download size={14} /> Export Member Profile
            </button>
            {farmer.activeLoan.dpd > 90 && (
              <button onClick={() => onNavigate('credit-defaults')} className="px-4 py-2.5 rounded-xl bg-[var(--error-500)] text-white font-medium flex items-center gap-2 hover:bg-[var(--error-600)] transition-colors" style={{ fontSize: '13px' }}>
                Initiate Recovery Action
              </button>
            )}
          </div>
          <AuditTrailPanel />
        </div>
      </div>
    </Shell>
  );
}

function InfoField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="p-3 bg-[var(--neutral-100)] rounded-xl border border-[var(--neutral-200)]">
      <div className="text-xs font-bold text-[var(--neutral-400)] uppercase tracking-wider">{label}</div>
      <div className="text-sm font-medium text-[var(--neutral-900)] mt-1" style={{ fontFamily: mono ? 'Roboto Mono, monospace' : 'inherit' }}>{value}</div>
    </div>
  );
}
