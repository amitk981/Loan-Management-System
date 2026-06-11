import { Bell, CreditCard, Download, FileText, User } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from './StatusBadge';
import { AuditTrailPanel, RoleAccessNote, UniversalStageTracker } from './CrossRoleComponents';
import { mockDocuments, mockLoans, mockNotifications, mockRepayments } from '../../data/mockData';
import { crossRoleNotifications } from '../../data/crossRoleData';
import { useAuth, UserRole } from '../../context/AuthContext';

interface UtilityScreenProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

function formatCurrency(n: number) {
  return '₹' + n.toLocaleString('en-IN');
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
          ['Unread', '7', '#EF4444', 'notifications-center'],
          ['Credit Tasks', '2', '#1A3C2A', 'shared-notifications'],
          ['Compliance Tasks', '3', '#2D7A4F', 'shared-notifications'],
          ['Treasury Tasks', '2', '#0891B2', 'shared-notifications'],
        ].map(([label, value, color, page]) => (
          <button key={label} onClick={() => onNavigate(page)} className="bg-white rounded-2xl p-4 border border-[#EDEEF0] text-left clickable-card">
            <div style={{ fontSize: '12px', color: '#9EA8B3', fontWeight: 700 }}>{label}</div>
            <div style={{ fontSize: '28px', color, fontWeight: 700, fontFamily: 'Roboto Mono' }}>{value}</div>
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-[#EDEEF0] overflow-hidden">
        {crossRoleNotifications.map(item => (
          <button key={item.id} onClick={() => onNavigate(item.route)} className="w-full px-5 py-4 border-b border-[#EDEEF0] last:border-b-0 flex items-start gap-3 text-left clickable-row">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
              <Bell size={16} style={{ color: '#1E88E5' }} />
            </div>
            <div className="flex-1">
              <div style={{ fontSize: '14px', color: '#12151A', fontWeight: 700 }}>{item.message}</div>
              <div style={{ fontSize: '13px', color: '#3D4450', marginTop: '2px' }}>{item.detail}</div>
              <div style={{ fontSize: '11px', color: '#9EA8B3', marginTop: '6px' }}>{item.fromRole} → {item.toRole} · {item.priority}</div>
            </div>
            <span className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#E0F2FE', color: '#0891B2', fontSize: '12px', fontWeight: 800 }}>{item.cta}</span>
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
          <div className="col-span-2 bg-white rounded-2xl p-5 border border-[#EDEEF0]">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#1E88E5', fontSize: 18, fontWeight: 900 }}>
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div style={{ fontSize: 18, color: '#12151A', fontWeight: 800 }}>{user.name}</div>
                <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{user.roleLabel}</div>
              </div>
            </div>
            {[
              ['Mobile', user.mobile],
              ['Email', user.email],
              ['Folio Number', user.folioNo || loan.folioNo],
              ['Village', loan.village],
              ['Shares Held', `${loan.shares}`],
            ].map(([label, value]) => (
              <div key={label} className="py-3 border-b border-[#EDEEF0] last:border-0">
                <div style={{ fontSize: 11, color: '#9EA8B3', fontWeight: 800, textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontSize: 13, color: '#12151A', fontWeight: 700, marginTop: 4 }}>{value}</div>
              </div>
            ))}
          </div>
          <div className="col-span-3 space-y-5">
            <div className="bg-white rounded-2xl p-5 border border-[#EDEEF0]">
              <div style={{ fontSize: 12, color: '#1E88E5', fontWeight: 900, textTransform: 'uppercase' }}>Active Loan</div>
              <div style={{ fontSize: 20, color: '#12151A', fontWeight: 800, marginTop: 6, fontFamily: 'Roboto Mono' }}>{loan.id}</div>
              <div className="grid grid-cols-3 gap-3 mt-5">
                {[
                  ['Outstanding', formatCurrency(loan.outstandingPrincipal + loan.outstandingInterest)],
                  ['Sanctioned', formatCurrency(loan.sanctionedAmount)],
                  ['Status', loan.status],
                ].map(([label, value]) => (
                  <div key={label} className="p-3 rounded-xl" style={{ backgroundColor: '#F7F8FA', border: '1px solid #EDEEF0' }}>
                    <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 800 }}>{label}</div>
                    <div style={{ fontSize: 16, color: '#12151A', fontWeight: 900, fontFamily: label !== 'Status' ? 'Roboto Mono' : 'inherit', marginTop: 4 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Track loan', page: 'farmer-active-loans', note: 'Status, schedule and timeline' },
                { label: 'Make payment', page: 'farmer-repayment', note: 'Pay instalment or upload UTR' },
                { label: 'My documents', page: 'farmer-documents', note: 'Agreements, invoices and forms' },
              ].map(item => (
                <button key={item.page} onClick={() => onNavigate(item.page)} className="bg-white rounded-2xl p-4 border border-[#EDEEF0] text-left clickable-card">
                  <div style={{ fontSize: 14, color: '#12151A', fontWeight: 800 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: '#3D4450', lineHeight: '18px', marginTop: 6 }}>{item.note}</div>
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

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Workspace', 'My Workspace']}
      pageTitle="My Workspace"
      pageSubtitle={`${user.name} · ${user.roleLabel}`}
      actions={<StatusBadge status="Active" size="md" />}
    >
        <div className="grid grid-cols-5 gap-5">
          <div className="col-span-2 bg-white rounded-2xl p-5 border border-[#EDEEF0]">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#1A3C2A', fontSize: 18, fontWeight: 900 }}>
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div style={{ fontSize: 18, color: '#12151A', fontWeight: 800 }}>{user.name}</div>
                <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{user.roleLabel}</div>
              </div>
            </div>
            {[
              ['User ID', user.id],
              ['Email', user.email],
              ['Mobile', user.mobile],
              ['Access Scope', meta.scope],
            ].map(([label, value]) => (
              <div key={label} className="py-3 border-b border-[#EDEEF0] last:border-0">
                <div style={{ fontSize: 11, color: '#9EA8B3', fontWeight: 800, textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontSize: 13, color: '#12151A', fontWeight: 700, marginTop: 4, lineHeight: '20px' }}>{value}</div>
              </div>
            ))}
          </div>

          <div className="col-span-3 space-y-5">
            <div className="bg-white rounded-2xl p-5 border border-[#EDEEF0]">
              <div style={{ fontSize: 12, color: '#1A3C2A', fontWeight: 900, textTransform: 'uppercase' }}>Role Focus</div>
              <div style={{ fontSize: 20, color: '#12151A', fontWeight: 800, marginTop: 6 }}>{meta.focus}</div>
              <div className="grid grid-cols-3 gap-3 mt-5">
                {meta.metrics.map(([label, value]) => (
                  <div key={label} className="p-3 rounded-xl" style={{ backgroundColor: '#F7F8FA', border: '1px solid #EDEEF0' }}>
                    <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 800 }}>{label}</div>
                    <div style={{ fontSize: 22, color: '#1A3C2A', fontWeight: 900, fontFamily: 'Roboto Mono', marginTop: 4 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {meta.pages.map(item => (
                <button key={item.page} onClick={() => onNavigate(item.page)} className="bg-white rounded-2xl p-4 border border-[#EDEEF0] text-left clickable-card">
                  <div style={{ fontSize: 14, color: '#12151A', fontWeight: 800 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: '#3D4450', lineHeight: '18px', marginTop: 6 }}>{item.note}</div>
                </button>
              ))}
            </div>

            <AuditTrailPanel farmerSafe={false} />
          </div>
        </div>
    </Shell>
  );
}

export function MemberLoanProfile({ onNavigate, activePage }: UtilityScreenProps) {
  const loan = mockLoans[0];

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Workspace', 'Borrower Lookup']}
      pageTitle="Borrower Lookup"
      pageSubtitle={`${loan.farmerName} · ${loan.folioNo} · ${loan.id}`}
      actions={<div className="flex gap-2"><button onClick={() => onNavigate('shared-audit-trail')} className="px-3 py-2 rounded-lg border border-[#EDEEF0]" style={{ fontSize: '13px', fontWeight: 800 }}>View Audit Log</button><StatusBadge status={loan.status} size="md" /></div>}
    >
      <div className="mb-5"><RoleAccessNote /></div>
      <div className="mb-5"><UniversalStageTracker currentStage={5} /></div>
      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-2 space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-[#EDEEF0]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8F5E9', color: '#1A3C2A' }}>
                <User size={22} />
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#12151A' }}>{loan.farmerName}</div>
                <div style={{ fontSize: '13px', color: '#9EA8B3' }}>{loan.village} · Active shareholder</div>
              </div>
            </div>
            {[
              ['Folio Number', loan.folioNo],
              ['Shares Held', `${loan.shares}`],
              ['Land Area', `${loan.landAcres} acres`],
              ['Bank', `${loan.bank} · ${loan.bankAccount}`],
              ['KYC', 'Verified · CKYC linked'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-[#EDEEF0] last:border-0">
                <span style={{ fontSize: '12px', color: '#9EA8B3' }}>{label}</span>
                <span style={{ fontSize: '13px', color: '#12151A', fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#EDEEF0]">
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#12151A', marginBottom: '12px' }}>Eligibility Snapshot</h3>
            {[
              ['Shareholding Limit', formatCurrency(loan.method1Limit)],
              ['Land Limit', formatCurrency(loan.method2Limit)],
              ['Eligible Limit', formatCurrency(loan.eligibleLimit)],
              ['Current Outstanding', formatCurrency(loan.outstandingPrincipal + loan.outstandingInterest)],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-[#EDEEF0] last:border-0">
                <span style={{ fontSize: '12px', color: '#9EA8B3' }}>{label}</span>
                <span style={{ fontSize: '13px', color: '#12151A', fontWeight: 700, fontFamily: 'Roboto Mono' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-3 space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-[#EDEEF0]">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={17} style={{ color: '#1A3C2A' }} />
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#12151A' }}>Loan Summary</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                ['Sanctioned', formatCurrency(loan.sanctionedAmount)],
                ['Outstanding Principal', formatCurrency(loan.outstandingPrincipal)],
                ['Outstanding Interest', formatCurrency(loan.outstandingInterest)],
                ['Next Due', loan.nextDueDate],
                ['DPD', `${loan.dpd} days`],
                ['Risk Rating', loan.riskRating],
              ].map(([label, value]) => (
                <div key={label} className="p-3 rounded-xl" style={{ backgroundColor: '#F7F8FA', border: '1px solid #EDEEF0' }}>
                  <div style={{ fontSize: '11px', color: '#9EA8B3', fontWeight: 700 }}>{label}</div>
                  <div style={{ fontSize: '14px', color: '#12151A', fontWeight: 700, marginTop: '4px' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-[#EDEEF0]">
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#12151A', marginBottom: '12px' }}>Documents</h3>
              {mockDocuments.slice(0, 6).map(doc => (
                <button key={doc.id} onClick={() => onNavigate('shared-audit-trail')} className="w-full flex items-center justify-between py-2 border-b border-[#EDEEF0] last:border-0 clickable-row text-left">
                  <div className="flex items-center gap-2">
                    <FileText size={14} style={{ color: '#9EA8B3' }} />
                    <span style={{ fontSize: '13px', color: '#3D4450' }}>{doc.name}</span>
                  </div>
                  <StatusBadge status={doc.status} />
                </button>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-5 border border-[#EDEEF0]">
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#12151A', marginBottom: '12px' }}>Recent Payments</h3>
              {mockRepayments.slice(0, 5).map((payment, i) => (
                <button key={i} onClick={() => onNavigate('shared-audit-trail')} className="w-full flex items-center justify-between py-2 border-b border-[#EDEEF0] last:border-0 clickable-row text-left">
                  <div>
                    <div style={{ fontSize: '13px', color: '#12151A', fontWeight: 600 }}>{payment.date}</div>
                    <div style={{ fontSize: '11px', color: '#9EA8B3' }}>{payment.mode || 'Scheduled'}</div>
                  </div>
                  <div className="text-right">
                    <div style={{ fontSize: '13px', color: '#12151A', fontWeight: 700, fontFamily: 'Roboto Mono' }}>₹{payment.total.toLocaleString('en-IN')}</div>
                    <StatusBadge status={payment.status} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ backgroundColor: '#E8F5E9', color: '#1A3C2A', fontSize: '13px', fontWeight: 700 }}>
            <Download size={14} /> Export Member Profile
          </button>
          <AuditTrailPanel />
        </div>
      </div>
    </Shell>
  );
}
