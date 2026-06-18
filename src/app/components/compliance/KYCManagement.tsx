import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Download, Search, Send, AlertCircle, Clock, CalendarRange, ShieldCheck } from 'lucide-react';
import { EmptyTableState } from '../shared/TableStates';
import { Shell } from '../layout/Shell';
import { StatusBadge } from '../shared/StatusBadge';
import { WorkbenchTabs } from '../shared/WorkbenchTabs';
import { complianceKycTabs } from '../../data/roleNav';
import { AppModal } from '../shared/AppModal';
import { kycRenewals } from '../../data/complianceData';

interface KYCManagementProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

export function KYCManagement({ onNavigate, activePage }: KYCManagementProps) {
  const [status, setStatus] = useState<'All' | 'Overdue' | '<30 days' | '30-60 days' | '>60 days' | 'Current'>('All');
  const [type, setType] = useState<'All' | 'Individual' | 'FPC'>('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [requestMember, setRequestMember] = useState<typeof kycRenewals[number] | null>(null);

  const rows = useMemo(() => kycRenewals.filter(row => {
    const term = search.toLowerCase();
    const matchSearch = !term || row.name.toLowerCase().includes(term) || row.folio.toLowerCase().includes(term);
    const matchStatus = status === 'All' || row.status === status;
    const matchType = type === 'All' || row.type === type;
    return matchSearch && matchStatus && matchType;
  }), [search, status, type]);

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Compliance', 'KYC Renewal Tracker']}
      pageTitle="KYC Renewal Tracker"
      pageSubtitle="Member renewal cycle"
      actions={<button className="px-4 py-2.5 rounded-lg font-medium flex items-center gap-2" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}><Download size={14} /> Export CSV</button>}
    >
      <WorkbenchTabs tabs={complianceKycTabs} activeKey={activePage} onChange={onNavigate} accent="var(--brand-primary)" />
      <div className="bg-white rounded-xl p-5 border border-[var(--neutral-200)] mb-4">
        <div className="flex flex-wrap gap-2 mb-3.5">
          <span style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: 700, alignSelf: 'center', minWidth: '48px' }}>Status:</span>
          {(['All', 'Overdue', '<30 days', '30-60 days', '>60 days', 'Current'] as const).map(item => (
            <button key={item} onClick={() => setStatus(item)} className="px-3.5 py-1.5 rounded-full transition-colors" style={{ backgroundColor: status === item ? 'var(--brand-primary)' : 'var(--neutral-100)', color: status === item ? 'white' : 'var(--neutral-700)', fontSize: '12px', fontWeight: 700, border: status === item ? '1px solid var(--brand-primary)' : '1px solid var(--neutral-200)' }}>{item}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center pt-3" style={{ borderTop: '1px solid var(--neutral-200)' }}>
          <span style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: 700, minWidth: '48px' }}>Type:</span>
          {(['All', 'Individual', 'FPC'] as const).map(item => (
            <button key={item} onClick={() => setType(item)} className="px-3.5 py-1.5 rounded-full transition-colors" style={{ backgroundColor: type === item ? 'var(--brand-accent)' : 'var(--neutral-100)', color: type === item ? 'white' : 'var(--neutral-700)', fontSize: '12px', fontWeight: 700, border: type === item ? '1px solid var(--brand-accent)' : '1px solid var(--neutral-200)' }}>{item}</button>
          ))}
          <div className="relative ml-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" color="var(--neutral-400)" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, folio, or village..." className="pl-9 pr-3 rounded-xl border border-[var(--neutral-200)] focus:outline-none focus:border-[var(--brand-accent)]" style={{ height: '38px', fontSize: '13px', minWidth: '280px', backgroundColor: 'var(--neutral-50)' }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        {([
          ['Overdue (expired)', 4, 'var(--error-500)', 'Overdue', AlertCircle],
          ['<30 days', 9, 'var(--warning-500)', '<30 days', Clock],
          ['30-60 days', 17, 'var(--warning-800)', '30-60 days', CalendarRange],
          ['Current (>60 days)', 739, 'var(--success-500)', 'Current', ShieldCheck],
        ] as const).map(([label, value, color, nextStatus, Icon]) => {
          const total = 769;
          return (
          <button key={label} onClick={() => setStatus(nextStatus as typeof status)} className="bg-white rounded-xl p-4 border-2 text-left clickable-card transition-all" style={{ borderColor: status === nextStatus ? color : 'var(--neutral-200)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}14`, color }}><Icon size={18} /></div>
              {status === nextStatus && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
            <div style={{ fontSize: '28px', color, fontWeight: 700, marginTop: '2px', fontFamily: 'Roboto Mono', lineHeight: '34px' }}>{value}</div>
            <div className="h-2 rounded-full overflow-hidden mt-3" style={{ backgroundColor: 'var(--neutral-100)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${Math.max(4, (value / total) * 100)}%`, backgroundColor: color }} />
            </div>
          </button>
        );})}
      </div>

      {selected.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg mb-4" style={{ backgroundColor: 'var(--brand-primary)' }}>
          <span style={{ fontSize: '13px', color: 'white' }}>{selected.length} selected</span>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '13px' }}><Send size={12} /> Send Bulk Re-KYC Request</button>
          <button className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '13px' }}>Download Due List</button>
          <button onClick={() => setSelected([])} style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', marginLeft: 'auto' }}>Deselect</button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[var(--neutral-200)] overflow-hidden table-scroll">
        <table className="w-full">
          <thead><tr style={{ backgroundColor: 'var(--cream-50)', borderBottom: '2px solid var(--neutral-200)' }}>
            <th className="px-4 py-3.5"><input type="checkbox" onChange={e => setSelected(e.target.checked ? rows.map(r => r.folio) : [])} style={{ accentColor: 'var(--brand-primary)' }} /></th>
            {['Member', 'Name', 'KYC Date', 'Expiry', 'Days Left', 'Status', 'Action'].map(h => <th key={h} className="px-4 py-3.5 text-left" style={{ fontSize: '11px', color: 'var(--neutral-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>)}
          </tr></thead>
          <tbody>{rows.length === 0 && (
            <tr><td colSpan={7}><EmptyTableState title="No members match" message="No KYC records for this filter. Clear the search or choose a different status/type." /></td></tr>
          )}{rows.map(row => (
            <tr key={row.folio} onClick={() => setRequestMember(row)} className="border-b border-[var(--neutral-200)] clickable-row">
              <td className="px-4 py-4"><input type="checkbox" checked={selected.includes(row.folio)} onClick={e => e.stopPropagation()} onChange={() => setSelected(prev => prev.includes(row.folio) ? prev.filter(id => id !== row.folio) : [...prev, row.folio])} style={{ accentColor: 'var(--brand-primary)' }} /></td>
              <td className="px-4" style={{ fontSize: '13px', fontFamily: 'Roboto Mono', color: 'var(--brand-accent)', fontWeight: 700 }}>{row.folio}</td>
              <td className="px-4" style={{ fontSize: '14px', color: 'var(--neutral-900)', fontWeight: 700 }}>{row.name}</td>
              <td className="px-4" style={{ fontSize: '13px', color: 'var(--neutral-700)' }}>{row.kycDate}</td>
              <td className="px-4" style={{ fontSize: '13px', color: 'var(--neutral-700)' }}>{row.expiry}</td>
              <td className="px-4">
                {(() => { const c = row.daysLeft < 0 ? 'var(--error-500)' : row.daysLeft < 30 ? 'var(--warning-500)' : 'var(--warning-800)'; const pct = Math.max(6, Math.min(100, ((60 - row.daysLeft) / 60) * 100)); return (
                  <div style={{ minWidth: 72 }}>
                    <div style={{ fontSize: '13px', color: c, fontWeight: 700 }}>{row.daysLeft} days</div>
                    <div className="h-1 rounded-full overflow-hidden mt-1" style={{ backgroundColor: 'var(--neutral-100)' }}><div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: c }} /></div>
                  </div>
                ); })()}
              </td>
              <td className="px-4"><StatusBadge status={row.status} /></td>
              <td className="px-4"><button onClick={(e) => { e.stopPropagation(); setRequestMember(row); }} className="px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors" style={{ backgroundColor: row.daysLeft < 0 ? 'var(--error-50)' : 'var(--brand-light)', color: row.daysLeft < 0 ? 'var(--error-500)' : 'var(--brand-primary)', fontSize: '12px', fontWeight: 700, border: `1px solid ${row.daysLeft < 0 ? 'var(--error-200)' : 'var(--success-200)'}` }}><Send size={11} /> Send</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {requestMember && (
        <AppModal
          title="Send Re-KYC Request"
          subtitle={`${requestMember.name} (${requestMember.folio}) · Expired: ${requestMember.expiry}`}
          icon={<Send size={18} />}
          onClose={() => setRequestMember(null)}
          footer={<><button onClick={() => setRequestMember(null)} className="px-4 py-2.5 rounded-lg border border-[var(--neutral-200)]">Cancel</button><button onClick={() => { const m = requestMember; setRequestMember(null); toast.success('Re-KYC request sent', { description: m ? `${m.name} (${m.folio}) notified to refresh KYC (re-KYC every 2 years).` : 'Member notified to refresh KYC.' }); }} className="px-4 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}>Send Request</button></>}
        >
          <div style={{ fontSize: '13px', color: 'var(--neutral-700)', lineHeight: '20px' }}>
            Send via: SMS, Email, or Both<br /><br />
            Dear {requestMember.name.split(' ')[0]}, your KYC with SFPCL is due for renewal. Please contact your nearest office or visit the WhatsLoan portal to upload updated PAN + Aadhaar. Reference: {requestMember.folio}
          </div>
        </AppModal>
      )}
    </Shell>
  );
}
