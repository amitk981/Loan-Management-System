import { useState } from 'react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from '../shared/StatusBadge';
import { RoleCommandCenter } from '../shared/RoleCommandCenter';
import { mockLoans, mockUsers, mockAuditLogs, portfolioDonut } from '../../data/mockData';
import { Bell, Edit, Search, ShieldCheck, Upload, UserPlus, UserX } from 'lucide-react';

interface AdminScreensProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

function formatCurrency(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

export function PortfolioOverview({ onNavigate, activePage }: AdminScreensProps) {
  const totalOutstanding = mockLoans.reduce((sum, loan) => sum + loan.outstandingPrincipal + loan.outstandingInterest, 0);
  const totalDisbursed = mockLoans.reduce((sum, loan) => sum + loan.sanctionedAmount, 0);
  const defaults = mockLoans.filter(loan => loan.status === 'Defaulted').length;

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Admin', 'Portfolio Overview']}
      pageTitle="CFO / Admin Portfolio Overview"
      pageSubtitle="Portfolio health and statutory headroom"
    >
      <div className="grid grid-cols-4 gap-5 mb-5">
        {[
          ['Total Sanctioned', formatCurrency(totalDisbursed), '#1A3C2A', 'admin-portfolio'],
          ['Outstanding', formatCurrency(totalOutstanding), '#0891B2', 'admin-portfolio'],
          ['Collection Efficiency', '82%', '#22C55E', 'admin-portfolio'],
          ['Defaults', defaults.toString(), '#EF4444', 'shared-audit-trail'],
        ].map(([label, value, color, page]) => (
          <button key={label} onClick={() => onNavigate(page)} className="bg-white rounded-2xl p-5 border border-[#EDEEF0] text-left clickable-card">
            <div style={{ fontSize: '12px', color: '#9EA8B3', fontWeight: 700 }}>{label}</div>
            <div style={{ fontSize: '26px', color, fontWeight: 700, fontFamily: 'Roboto Mono', marginTop: '6px' }}>{value}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3 bg-white rounded-2xl border border-[#EDEEF0] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#EDEEF0]" style={{ backgroundColor: '#F7F8FA' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#12151A' }}>Portfolio Register</h3>
          </div>
          <div className="table-scroll"><table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #EDEEF0' }}>
                {['Loan ID', 'Borrower', 'Sanctioned', 'Outstanding', 'DPD', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left" style={{ fontSize: '11px', color: '#9EA8B3', fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockLoans.map(loan => (
                <tr key={loan.id} onClick={() => onNavigate('member-loan-profile')} className="border-b border-[#EDEEF0] clickable-row">
                  <td className="px-4 py-3" style={{ fontSize: '13px', color: '#1E88E5', fontFamily: 'Roboto Mono' }}>{loan.id}</td>
                  <td className="px-4" style={{ fontSize: '13px', color: '#12151A', fontWeight: 600 }}>{loan.farmerName}</td>
                  <td className="px-4 text-right" style={{ fontSize: '13px', fontFamily: 'Roboto Mono' }}>{formatCurrency(loan.sanctionedAmount)}</td>
                  <td className="px-4 text-right" style={{ fontSize: '13px', fontFamily: 'Roboto Mono' }}>{formatCurrency(loan.outstandingPrincipal + loan.outstandingInterest)}</td>
                  <td className="px-4" style={{ fontSize: '13px', color: loan.dpd > 0 ? '#EF4444' : '#22C55E', fontWeight: 700 }}>{loan.dpd}</td>
                  <td className="px-4"><StatusBadge status={loan.status} /></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>

        <div className="col-span-2 space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-[#EDEEF0]">
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#12151A', marginBottom: '12px' }}>Portfolio Split</h3>
            {portfolioDonut.map(item => (
              <button key={item.name} onClick={() => onNavigate('admin-portfolio')} className="w-full mb-3 text-left p-1 rounded-lg clickable-row">
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontSize: '13px', color: '#3D4450', fontWeight: 600 }}>{item.name}</span>
                  <span style={{ fontSize: '13px', color: '#12151A', fontFamily: 'Roboto Mono' }}>{formatCurrency(item.value)}</span>
                </div>
                <div className="h-2 bg-[#EDEEF0] rounded-full">
                  <div className="h-full rounded-full" style={{ width: `${Math.round((item.value / 9000000) * 100)}%`, backgroundColor: item.color }} />
                </div>
              </button>
            ))}
          </div>
          <button onClick={() => onNavigate('admin-section186')} className="bg-white rounded-2xl p-5 border border-[#EDEEF0] text-left clickable-card">
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#12151A', marginBottom: '12px' }}>Statutory Headroom</h3>
            <div className="mb-3">
              <div className="flex justify-between mb-1"><span style={{ fontSize: '13px', color: '#3D4450' }}>Section 186 used</span><strong>62%</strong></div>
              <div className="h-2 bg-[#EDEEF0] rounded-full"><div className="h-full rounded-full" style={{ width: '62%', backgroundColor: '#1A3C2A' }} /></div>
            </div>
            <div>
              <div className="flex justify-between mb-1"><span style={{ fontSize: '13px', color: '#3D4450' }}>NBFC asset ratio</span><strong>42%</strong></div>
              <div className="h-2 bg-[#EDEEF0] rounded-full"><div className="h-full rounded-full" style={{ width: '42%', backgroundColor: '#F59E0B' }} /></div>
            </div>
          </button>
        </div>
      </div>
    </Shell>
  );
}

export function UserManagement({ onNavigate, activePage }: AdminScreensProps) {
  const [search, setSearch] = useState('');

  const filtered = mockUsers.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Admin', 'User Management']}
      pageTitle="User Management"
      pageSubtitle={`${mockUsers.length} users`}
      actions={
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold" style={{ backgroundColor: '#1A3C2A', color: 'white', fontSize: '14px' }}>
          <UserPlus size={14} /> Invite New User
        </button>
      }
    >
      <RoleCommandCenter
        title="Admin Control Room"
        focus="Keep access, limits and audit controls healthy"
        primaryAction={{ label: 'Review users', detail: 'Confirm role access and disable stale accounts before workflow actions are assigned.', page: 'admin-users', tone: 'green' }}
        metrics={[
          { label: 'Users', value: `${mockUsers.length}`, tone: 'green' },
          { label: 'Audit', value: 'Live', tone: 'blue' },
          { label: 'Limits', value: '62%', tone: 'amber' },
        ]}
        secondaryActions={[
          { label: 'Portfolio overview', detail: 'Review exposure, collection efficiency and defaults.', page: 'admin-portfolio', tone: 'blue' },
          { label: 'Audit log', detail: 'Inspect immutable workflow and access events.', page: 'admin-audit', tone: 'neutral' },
          { label: 'Configuration', detail: 'Maintain loan parameters and rate controls.', page: 'admin-config', tone: 'green' },
          { label: 'Compliance limits', detail: 'Watch Section 186 and NBFC thresholds.', page: 'admin-section186', tone: 'amber' },
        ]}
        onNavigate={onNavigate}
      />

      <div className="relative mb-4 max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9EA8B3' }} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search users by name or role..."
          className="w-full pl-9 pr-3 rounded-xl border border-[#D1D5DB] focus:outline-none focus:border-[#1A3C2A]"
          style={{ height: '40px', fontSize: '13px' }}
        />
      </div>

      <div className="bg-white rounded-2xl border border-[#EDEEF0] overflow-hidden table-scroll">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: '#F7F8FA', borderBottom: '1px solid #EDEEF0' }}>
              {['User ID', 'Name', 'Role', 'Email', 'Mobile', 'Status', 'Last Login', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3 text-left" style={{ fontSize: '11px', fontWeight: 500, color: '#9EA8B3', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id} onClick={() => onNavigate('admin-users')} className="border-b border-[#EDEEF0] clickable-row">
                <td className="px-5 py-4" style={{ fontSize: '12px', fontFamily: 'Roboto Mono', color: '#9EA8B3' }}>{user.id}</td>
                <td className="px-5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                      style={{ backgroundColor: '#2D7A4F' }}
                    >
                      {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#12151A' }}>{user.name}</div>
                  </div>
                </td>
                <td className="px-5" style={{ fontSize: '13px', color: '#3D4450' }}>{user.role}</td>
                <td className="px-5" style={{ fontSize: '13px', color: '#3D4450' }}>{user.email}</td>
                <td className="px-5" style={{ fontSize: '13px', fontFamily: 'Roboto Mono', color: '#3D4450' }}>{user.mobile}</td>
                <td className="px-5"><StatusBadge status={user.status === 'Active' ? 'Active Member' : 'Inactive'} /></td>
                <td className="px-5" style={{ fontSize: '13px', color: '#9EA8B3' }}>{user.lastLogin}</td>
                <td className="px-5">
                  <div className="flex items-center gap-2">
                    <button onClick={e => e.stopPropagation()} className="p-2 rounded-lg hover:bg-[#F7F8FA] transition-colors"><Edit size={14} style={{ color: '#9EA8B3' }} /></button>
                    <button onClick={e => e.stopPropagation()} className="p-2 rounded-lg hover:bg-[#FEE2E2] transition-colors"><UserX size={14} style={{ color: '#9EA8B3' }} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 bg-white rounded-2xl p-5 border border-[#EDEEF0]">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck size={16} style={{ color: '#1A3C2A' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#12151A' }}>Role Permission Matrix</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#F7F8FA', borderBottom: '1px solid #EDEEF0' }}>
                {['Feature', 'Farmer', 'Credit', 'CS', 'Sanction', 'Treasury', 'Admin'].map(h => (
                  <th key={h} className="px-3 py-2 text-left" style={{ fontSize: '11px', color: '#9EA8B3', fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Apply for loan', true, false, false, false, false, true],
                ['Prepare appraisal', false, true, false, false, false, true],
                ['Generate legal docs', false, false, true, false, false, true],
                ['Approve sanction', false, false, false, true, false, true],
                ['Initiate disbursement', false, false, false, false, true, true],
              ].map(row => (
                <tr key={row[0] as string} className="border-b border-[#EDEEF0]">
                  {row.map((cell, i) => (
                    <td key={i} className="px-3 py-2" style={{ fontSize: '13px', color: '#3D4450' }}>
                      {typeof cell === 'boolean' ? (
                        <input type="checkbox" defaultChecked={cell} style={{ accentColor: '#1A3C2A' }} />
                      ) : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}

export function AuditLog({ onNavigate, activePage }: AdminScreensProps) {
  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Admin', 'Audit Log']}
      pageTitle="System Audit Log"
      pageSubtitle="Immutable event log"
    >
      <div className="bg-white rounded-2xl p-4 border border-[#EDEEF0] mb-4 grid grid-cols-4 gap-3">
        {['User', 'Action Type', 'Date Range', 'Entity'].map((filter, i) => (
          <div key={filter}>
            <label className="block mb-1" style={{ fontSize: '12px', color: '#3D4450', fontWeight: 600 }}>{filter}</label>
            <input
              placeholder={i === 2 ? 'DD/MM/YYYY - DD/MM/YYYY' : `Filter ${filter.toLowerCase()}`}
              className="w-full px-3 rounded-xl border border-[#D1D5DB]"
              style={{ height: '36px', fontSize: '13px' }}
            />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-[#EDEEF0] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#EDEEF0]" style={{ backgroundColor: '#FEF3C7' }}>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} style={{ color: '#92400E' }} />
            <span style={{ fontSize: '13px', color: '#92400E', fontWeight: 600 }}>Immutable Audit Log</span>
          </div>
        </div>
        <div className="table-scroll"><table className="w-full">
          <thead>
            <tr style={{ backgroundColor: '#F7F8FA', borderBottom: '1px solid #EDEEF0' }}>
              {['Timestamp', 'User', 'Action', 'Entity', 'Old Value', 'New Value', 'IP Address'].map(h => (
                <th key={h} className="px-4 py-3 text-left" style={{ fontSize: '11px', fontWeight: 500, color: '#9EA8B3', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockAuditLogs.map(log => (
              <tr key={log.id} onClick={() => onNavigate('shared-audit-trail')} className="border-b border-[#EDEEF0] clickable-row">
                <td className="px-4 py-3.5" style={{ fontSize: '12px', fontFamily: 'Roboto Mono', color: '#9EA8B3', whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                <td className="px-4" style={{ fontSize: '13px', color: '#3D4450' }}>{log.user}</td>
                <td className="px-4">
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1A3C2A', backgroundColor: '#E8F5E9', padding: '2px 8px', borderRadius: '6px' }}>
                    {log.action}
                  </span>
                </td>
                <td className="px-4" style={{ fontSize: '13px', fontFamily: 'Roboto Mono', color: '#1E88E5' }}>{log.entity}</td>
                <td className="px-4" style={{ fontSize: '12px', color: '#9EA8B3' }}>{log.oldValue}</td>
                <td className="px-4" style={{ fontSize: '12px', color: '#22C55E', fontWeight: 500 }}>{log.newValue}</td>
                <td className="px-4" style={{ fontSize: '12px', fontFamily: 'Roboto Mono', color: '#9EA8B3' }}>{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
    </Shell>
  );
}

export function SystemConfig({ onNavigate, activePage }: AdminScreensProps) {
  const [scaleOfFinance, setScaleOfFinance] = useState(20000);
  const [shareValuation, setShareValuation] = useState(200);
  const [pledgePct, setPledgePct] = useState(30);
  const [baseRate, setBaseRate] = useState(12.5);
  const meta: Record<string, { title: string; subtitle: string; crumb: string }> = {
    'admin-config': {
      title: 'System Configuration',
      subtitle: 'Board-approved parameters · Changes require authorization',
      crumb: 'System Configuration',
    },
    'admin-section186': {
      title: 'Section 186 Tracker',
      subtitle: 'Headroom monitoring, board approval thresholds, and exception controls',
      crumb: 'Section 186 Tracker',
    },
    'admin-nbfc': {
      title: 'NBFC Principal Test',
      subtitle: 'Quarterly financial asset and income ratio monitoring',
      crumb: 'NBFC Principal Test',
    },
  };
  const page = meta[activePage] || meta['admin-config'];

  if (activePage === 'admin-section186') {
    return (
      <Shell activePage={activePage} onNavigate={onNavigate} breadcrumbs={['Admin', page.crumb]} pageTitle={page.title} pageSubtitle={page.subtitle}>
        <div className="grid grid-cols-4 gap-5 mb-5">
          {[
            ['Board Approved Limit', '₹1.80 Cr', '#1A3C2A'],
            ['Current Exposure', '₹1.12 Cr', '#0891B2'],
            ['Headroom', '₹68.0L', '#22C55E'],
            ['Usage', '62%', '#F59E0B'],
          ].map(([label, value, color]) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-[#EDEEF0]">
              <div style={{ fontSize: '12px', color: '#9EA8B3', fontWeight: 700 }}>{label}</div>
              <div style={{ fontSize: '26px', color, fontWeight: 700, fontFamily: 'Roboto Mono', marginTop: '6px' }}>{value}</div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#EDEEF0]">
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#12151A', marginBottom: '14px' }}>Section 186 Headroom Test</h3>
          {[
            { label: '60% of paid-up capital + free reserves', value: '₹1.45 Cr', used: 62, color: '#1A3C2A' },
            { label: '100% of free reserves alternative', value: '₹1.80 Cr', used: 50, color: '#1E88E5' },
            { label: 'Special resolution trigger buffer', value: '₹25.0L', used: 78, color: '#F59E0B' },
          ].map(item => (
            <div key={item.label} className="p-4 rounded-xl mb-3" style={{ backgroundColor: '#F7F8FA' }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: '13px', color: '#3D4450', fontWeight: 700 }}>{item.label}</span>
                <span style={{ fontSize: '13px', color: '#12151A', fontFamily: 'Roboto Mono', fontWeight: 700 }}>{item.value}</span>
              </div>
              <div className="h-2 bg-[#EDEEF0] rounded-full"><div className="h-full rounded-full" style={{ width: `${item.used}%`, backgroundColor: item.color }} /></div>
              <div style={{ fontSize: '12px', color: '#9EA8B3', marginTop: '6px' }}>{item.used}% used · alert CFO before breach</div>
            </div>
          ))}
        </div>
      </Shell>
    );
  }

  if (activePage === 'admin-nbfc') {
    return (
      <Shell activePage={activePage} onNavigate={onNavigate} breadcrumbs={['Admin', page.crumb]} pageTitle={page.title} pageSubtitle={page.subtitle}>
        <div className="grid grid-cols-3 gap-5 mb-5">
          {[
            ['Financial Assets / Total Assets', '42%', 'Warning at 45%', '#F59E0B'],
            ['Financial Income / Gross Income', '38%', 'Comfortable', '#22C55E'],
            ['Quarterly Certification', 'Pending', 'Due this month', '#EF4444'],
          ].map(([label, value, note, color]) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-[#EDEEF0]">
              <div style={{ fontSize: '12px', color: '#9EA8B3', fontWeight: 700 }}>{label}</div>
              <div style={{ fontSize: '30px', color, fontWeight: 700, fontFamily: 'Roboto Mono', marginTop: '8px' }}>{value}</div>
              <div style={{ fontSize: '12px', color: '#3D4450', marginTop: '6px' }}>{note}</div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-[#EDEEF0] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#EDEEF0]" style={{ backgroundColor: '#F7F8FA' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#12151A' }}>NBFC Principal Business Test Evidence</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #EDEEF0' }}>
                {['Quarter', 'Asset Ratio', 'Income Ratio', 'Prepared By', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left" style={{ fontSize: '11px', color: '#9EA8B3', fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Q1 FY26', '42%', '38%', 'Finance Controller', 'Pending'],
                ['Q4 FY25', '41%', '37%', 'Finance Controller', 'Approved'],
                ['Q3 FY25', '39%', '35%', 'Finance Controller', 'Approved'],
              ].map(row => (
                <tr key={row[0]} className="border-b border-[#EDEEF0]">
                  {row.slice(0, 4).map(cell => <td key={cell} className="px-4 py-4" style={{ fontSize: '13px', color: '#3D4450' }}>{cell}</td>)}
                  <td className="px-4"><StatusBadge status={row[4]} /></td>
                  <td className="px-4"><button className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#1A3C2A', color: 'white', fontSize: '12px', fontWeight: 700 }}>Upload Certificate</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Shell>
    );
  }

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Admin', page.crumb]}
      pageTitle={page.title}
      pageSubtitle={page.subtitle}
    >
      <div className="max-w-4xl space-y-5">
        <div className="bg-white rounded-2xl p-5 border border-[#EDEEF0]">
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#12151A', marginBottom: '16px' }}>Loan Parameters</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: '#F7F8FA' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#12151A' }}>Scale of Finance (₹/acre)</div>
                <div style={{ fontSize: '12px', color: '#9EA8B3' }}>Used in Method 2 loan limit calculation · Board approved</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={scaleOfFinance}
                  onChange={e => setScaleOfFinance(parseInt(e.target.value))}
                  className="w-28 px-3 rounded-xl border border-[#D1D5DB] text-right"
                  style={{ height: '40px', fontSize: '16px', fontFamily: 'Roboto Mono', fontWeight: 600 }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: '#F7F8FA' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#12151A' }}>Share Valuation (₹/share)</div>
                <div style={{ fontSize: '12px', color: '#9EA8B3' }}>Per AGM resolution · Requires Board approval to change</div>
              </div>
              <input
                type="number"
                value={shareValuation}
                onChange={e => setShareValuation(parseInt(e.target.value))}
                className="w-28 px-3 rounded-xl border border-[#D1D5DB] text-right"
                style={{ height: '40px', fontSize: '16px', fontFamily: 'Roboto Mono', fontWeight: 600 }}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: '#F7F8FA' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#12151A' }}>Pledge Percentage (%)</div>
                <div style={{ fontSize: '12px', color: '#9EA8B3' }}>Method 1: % of share NAV used for loan limit calculation</div>
              </div>
              <input
                type="number"
                value={pledgePct}
                onChange={e => setPledgePct(parseInt(e.target.value))}
                className="w-28 px-3 rounded-xl border border-[#D1D5DB] text-right"
                style={{ height: '40px', fontSize: '16px', fontFamily: 'Roboto Mono', fontWeight: 600 }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EDEEF0]">
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#12151A', marginBottom: '16px' }}>Interest Rate Management</h3>
          <div className="flex items-center justify-between p-4 rounded-xl mb-4" style={{ backgroundColor: '#F7F8FA' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#12151A' }}>Base Interest Rate (% p.a.)</div>
              <div style={{ fontSize: '12px', color: '#9EA8B3' }}>Current effective rate · Floating — changes with bank rates</div>
            </div>
            <input
              type="number"
              step="0.25"
              value={baseRate}
              onChange={e => setBaseRate(parseFloat(e.target.value))}
              className="w-28 px-3 rounded-xl border border-[#D1D5DB] text-right"
              style={{ height: '40px', fontSize: '16px', fontFamily: 'Roboto Mono', fontWeight: 600 }}
            />
          </div>
          <div className="border-t border-[#EDEEF0] pt-4">
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#12151A', marginBottom: '10px' }}>Rate Change Log</h4>
            {[
              ['01 Apr 2025', '12.50%', 'BM/FY25/Q4/12'],
              ['01 Oct 2024', '12.00%', 'BM/FY25/Q2/08'],
            ].map(([date, rate, ref]) => (
              <div key={date} className="flex items-center justify-between py-2 border-b border-[#EDEEF0] last:border-0">
                <span style={{ fontSize: '13px', color: '#3D4450' }}>{date}</span>
                <span style={{ fontSize: '13px', color: '#12151A', fontWeight: 700, fontFamily: 'Roboto Mono' }}>{rate}</span>
                <span style={{ fontSize: '12px', color: '#9EA8B3', fontFamily: 'Roboto Mono' }}>{ref}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-[#EDEEF0]">
            <div className="flex items-center justify-between mb-3">
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#12151A' }}>Section 186 Compliance</h3>
              <StatusBadge status="Verified" />
            </div>
            <div className="space-y-3">
              {[
                { label: '60% of paid-up capital + free reserves', value: '₹1.45 Cr', used: 62, color: '#1A3C2A' },
                { label: '100% of free reserves alternative', value: '₹1.80 Cr', used: 50, color: '#1E88E5' },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl" style={{ backgroundColor: '#F7F8FA' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ fontSize: '13px', color: '#3D4450', fontWeight: 600 }}>{item.label}</span>
                    <span style={{ fontSize: '13px', color: '#12151A', fontFamily: 'Roboto Mono', fontWeight: 700 }}>{item.value}</span>
                  </div>
                  <div className="h-2 bg-[#EDEEF0] rounded-full">
                    <div className="h-full rounded-full" style={{ width: `${item.used}%`, backgroundColor: item.color }} />
                  </div>
                  <div style={{ fontSize: '12px', color: '#9EA8B3', marginTop: '6px' }}>{item.used}% used · special resolution required before breach</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#EDEEF0]">
            <div className="flex items-center justify-between mb-3">
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#12151A' }}>NBFC Principal Test Monitor</h3>
              <StatusBadge status="Pending" />
            </div>
            <div className="space-y-3">
              {[
                { label: 'Financial assets / total assets', value: '42%', threshold: 'Warning at 45% · critical at 50%', color: '#F59E0B' },
                { label: 'Financial income / gross income', value: '38%', threshold: 'Warning at 45% · critical at 50%', color: '#22C55E' },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl" style={{ backgroundColor: '#F7F8FA' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ fontSize: '13px', color: '#3D4450', fontWeight: 600 }}>{item.label}</span>
                    <span style={{ fontSize: '18px', color: item.color, fontFamily: 'Roboto Mono', fontWeight: 700 }}>{item.value}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#9EA8B3' }}>{item.threshold}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-xl" style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A' }}>
              <div style={{ fontSize: '12px', color: '#92400E', fontWeight: 700 }}>Quarterly certification pending</div>
              <div style={{ fontSize: '12px', color: '#B45309', marginTop: '2px' }}>Alert CFO if either ratio approaches 45%.</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EDEEF0]">
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#12151A', marginBottom: '16px' }}>DPD Thresholds</h3>
          <div className="space-y-2">
            {[
              { label: 'Bucket 1: Warning (days)', value: '365–730', color: '#F59E0B' },
              { label: 'Bucket 2: At-Risk (days)', value: '730–1095', color: '#F97316' },
              { label: 'Bucket 3: Non-Recoverable (days)', value: '1095+', color: '#EF4444' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: '#F7F8FA' }}>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span style={{ fontSize: '13px', color: '#3D4450' }}>{item.label}</span>
                </div>
                <span style={{ fontSize: '14px', fontFamily: 'Roboto Mono', fontWeight: 600, color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EDEEF0]">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={16} style={{ color: '#1A3C2A' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#12151A' }}>SOP Compliance Matrix</h3>
          </div>
          <div className="mb-4 p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEE2E2', color: '#991B1B', fontWeight: 800 }}>!</div>
            <div>
              <div style={{ fontSize: '13px', color: '#991B1B', fontWeight: 700 }}>Annual money-lending exemption confirmation is pending</div>
              <div style={{ fontSize: '12px', color: '#7F1D1D', marginTop: '3px', lineHeight: '18px' }}>
                New application acceptance remains locked until CS uploads the Maharashtra money-lending exemption certificate and Admin marks the annual control confirmed.
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#F7F8FA', borderBottom: '1px solid #EDEEF0' }}>
                  {['Process Step', 'Control Type', 'Statute', 'Owner', 'Evidence', 'Exception Route'].map(h => (
                    <th key={h} className="px-3 py-2 text-left" style={{ fontSize: '11px', color: '#9EA8B3', fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Loan eligibility', 'Preventive', 'Companies Act s.378ZJ', 'Credit', 'Appraisal note', 'CFO exception register'],
                  ['KYC / AML', 'Preventive', 'PMLA + RBI KYC', 'CS', 'PAN/Aadhaar/CKYC', 'Application block'],
                  ['Stamp duty', 'Preventive', 'Maharashtra Stamp Act', 'CS', '₹500 stamp copy', 'Treasury hard block'],
                  ['Money-lending law', 'Detective', 'Maharashtra ML Reg. Act', 'Admin', 'Annual certificate', 'Board review'],
                  ['Data protection', 'Detective', 'IT Act', 'Admin', 'Quarterly access audit', 'Access suspension'],
                  ['Record retention', 'Detective', 'Companies Act', 'Admin', '8-year archive marker', 'Archive exception log'],
                ].map(row => (
                  <tr key={row[0]} className="border-b border-[#EDEEF0]">
                    {row.map(cell => <td key={cell} className="px-3 py-2" style={{ fontSize: '12px', color: '#3D4450' }}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EDEEF0]">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={16} style={{ color: '#1E88E5' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#12151A' }}>Notification Templates</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              'Application received',
              'Approval / rejection',
              'Disbursement advice',
              'Repayment reminder',
              'Interest invoice',
              'NOC issued',
              'Default grace period started',
              'KYC re-verification request',
            ].map(template => (
              <div key={template} className="p-3 rounded-xl flex items-center justify-between" style={{ backgroundColor: '#F7F8FA', border: '1px solid #EDEEF0' }}>
                <span style={{ fontSize: '13px', color: '#3D4450', fontWeight: 600 }}>{template}</span>
                <StatusBadge status="Active" />
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A' }}>
          <span style={{ fontSize: '16px' }}>⚠️</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#92400E' }}>Changes require Board authorization</div>
            <div style={{ fontSize: '12px', color: '#B45309', marginTop: '2px' }}>All parameter changes are logged in the audit trail and require CFO approval before taking effect.</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EDEEF0]">
          <div className="flex items-center gap-2 mb-3">
            <Upload size={16} style={{ color: '#D97706' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#12151A' }}>Board Resolution Upload</h3>
          </div>
          <div className="border-2 border-dashed rounded-xl p-5 flex items-center justify-center gap-2" style={{ borderColor: '#D1D5DB', backgroundColor: '#FAFAFA' }}>
            <Upload size={18} style={{ color: '#9EA8B3' }} />
            <span style={{ fontSize: '13px', color: '#3D4450' }}>Upload board resolution before saving parameter changes</span>
          </div>
        </div>

        <button className="w-full py-3 rounded-xl font-semibold" style={{ backgroundColor: '#1A3C2A', color: 'white', fontSize: '15px' }}>
          Save Configuration (Requires CFO Approval)
        </button>
      </div>
    </Shell>
  );
}
