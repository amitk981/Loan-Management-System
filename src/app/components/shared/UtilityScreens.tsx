import { Bell, CreditCard, Download, FileText, User } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from './StatusBadge';
import { AuditTrailPanel, RoleAccessNote, UniversalStageTracker } from './CrossRoleComponents';
import { mockDocuments, mockLoans, mockNotifications, mockRepayments } from '../../data/mockData';
import { crossRoleNotifications } from '../../data/crossRoleData';

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
      pageSubtitle="All role-based alerts, reminders, and system tasks"
    >
      <div className="grid grid-cols-4 gap-5 mb-5">
        {[
          ['Unread', '7', '#EF4444'],
          ['Credit Tasks', '2', '#1A3C2A'],
          ['Compliance Tasks', '3', '#2D7A4F'],
          ['Treasury Tasks', '2', '#0891B2'],
        ].map(([label, value, color]) => (
          <div key={label} className="bg-white rounded-2xl p-4 border border-[#EDEEF0]">
            <div style={{ fontSize: '12px', color: '#9EA8B3', fontWeight: 700 }}>{label}</div>
            <div style={{ fontSize: '28px', color, fontWeight: 700, fontFamily: 'Roboto Mono' }}>{value}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-[#EDEEF0] overflow-hidden">
        {crossRoleNotifications.map(item => (
          <div key={item.id} className="px-5 py-4 border-b border-[#EDEEF0] last:border-b-0 hover:bg-[#F7F8FA] flex items-start gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
              <Bell size={16} style={{ color: '#1E88E5' }} />
            </div>
            <div className="flex-1">
              <div style={{ fontSize: '14px', color: '#12151A', fontWeight: 700 }}>{item.message}</div>
              <div style={{ fontSize: '13px', color: '#3D4450', marginTop: '2px' }}>{item.detail}</div>
              <div style={{ fontSize: '11px', color: '#9EA8B3', marginTop: '6px' }}>{item.fromRole} → {item.toRole} · {item.priority}</div>
            </div>
            <button onClick={() => onNavigate(item.route)} className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#E0F2FE', color: '#0891B2', fontSize: '12px', fontWeight: 800 }}>{item.cta}</button>
          </div>
        ))}
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
      breadcrumbs={['Shared Workspace', 'Member / Loan Profile']}
      pageTitle="Member / Loan Profile"
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
                <div key={doc.id} className="flex items-center justify-between py-2 border-b border-[#EDEEF0] last:border-0">
                  <div className="flex items-center gap-2">
                    <FileText size={14} style={{ color: '#9EA8B3' }} />
                    <span style={{ fontSize: '13px', color: '#3D4450' }}>{doc.name}</span>
                  </div>
                  <StatusBadge status={doc.status} />
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-5 border border-[#EDEEF0]">
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#12151A', marginBottom: '12px' }}>Recent Payments</h3>
              {mockRepayments.slice(0, 5).map((payment, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[#EDEEF0] last:border-0">
                  <div>
                    <div style={{ fontSize: '13px', color: '#12151A', fontWeight: 600 }}>{payment.date}</div>
                    <div style={{ fontSize: '11px', color: '#9EA8B3' }}>{payment.mode || 'Scheduled'}</div>
                  </div>
                  <div className="text-right">
                    <div style={{ fontSize: '13px', color: '#12151A', fontWeight: 700, fontFamily: 'Roboto Mono' }}>₹{payment.total.toLocaleString('en-IN')}</div>
                    <StatusBadge status={payment.status} />
                  </div>
                </div>
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
