import { useMemo, useState } from 'react';
import { Download, Search, Send } from 'lucide-react';
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
      actions={<button className="px-4 py-2.5 rounded-lg font-semibold flex items-center gap-2" style={{ backgroundColor: '#1A3C2A', color: 'white', fontSize: '14px' }}><Download size={14} /> Export CSV</button>}
    >
      <WorkbenchTabs tabs={complianceKycTabs} activeKey={activePage} onChange={onNavigate} accent="#1A3C2A" />
      <div className="bg-white rounded-lg p-4 border border-[#EDEEF0] mb-4">
        <div className="flex flex-wrap gap-2 mb-3">
          <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 800, alignSelf: 'center' }}>Status:</span>
          {(['All', 'Overdue', '<30 days', '30-60 days', '>60 days', 'Current'] as const).map(item => (
            <button key={item} onClick={() => setStatus(item)} className="px-3 py-1.5 rounded-full" style={{ backgroundColor: status === item ? '#1A3C2A' : '#F7F8FA', color: status === item ? 'white' : '#3D4450', fontSize: '12px', fontWeight: 800 }}>{item}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 800 }}>Type:</span>
          {(['All', 'Individual', 'FPC'] as const).map(item => (
            <button key={item} onClick={() => setType(item)} className="px-3 py-1.5 rounded-full" style={{ backgroundColor: type === item ? '#1E88E5' : '#F7F8FA', color: type === item ? 'white' : '#3D4450', fontSize: '12px', fontWeight: 800 }}>{item}</button>
          ))}
          <div className="relative ml-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" color="#9EA8B3" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Name / Folio / Village" className="pl-9 pr-3 rounded-lg border border-[#D1D5DB]" style={{ height: '36px', fontSize: '13px', minWidth: '260px' }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        {[
          ['Overdue (expired)', '4', '#EF4444', 'Overdue'],
          ['<30 days', '9', '#F59E0B', '<30 days'],
          ['30-60 days', '17', '#E65100', '30-60 days'],
          ['Current (>60 days)', '739', '#22C55E', 'Current'],
        ].map(([label, value, color, nextStatus]) => (
          <button key={label} onClick={() => setStatus(nextStatus as typeof status)} className="bg-white rounded-lg p-4 border border-[#EDEEF0] text-left clickable-card">
            <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 800 }}>{label}</div>
            <div style={{ fontSize: '26px', color, fontWeight: 900, marginTop: '5px' }}>{value}</div>
          </button>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg mb-4" style={{ backgroundColor: '#1A3C2A' }}>
          <span style={{ fontSize: '13px', color: 'white' }}>{selected.length} selected</span>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '13px' }}><Send size={12} /> Send Bulk Re-KYC Request</button>
          <button className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '13px' }}>Download Due List</button>
          <button onClick={() => setSelected([])} style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', marginLeft: 'auto' }}>Deselect</button>
        </div>
      )}

      <div className="bg-white rounded-lg border border-[#EDEEF0] overflow-hidden table-scroll">
        <table className="w-full">
          <thead><tr style={{ backgroundColor: '#F7F8FA', borderBottom: '1px solid #EDEEF0' }}>
            <th className="px-4 py-3"><input type="checkbox" onChange={e => setSelected(e.target.checked ? rows.map(r => r.folio) : [])} style={{ accentColor: '#1A3C2A' }} /></th>
            {['Member', 'Name', 'KYC Date', 'Expiry', 'Days Left', 'Status', 'Action'].map(h => <th key={h} className="px-4 py-3 text-left" style={{ fontSize: '11px', color: '#9EA8B3', fontWeight: 800, textTransform: 'uppercase' }}>{h}</th>)}
          </tr></thead>
          <tbody>{rows.map(row => (
            <tr key={row.folio} onClick={() => setRequestMember(row)} className="border-b border-[#EDEEF0] clickable-row">
              <td className="px-4 py-4"><input type="checkbox" checked={selected.includes(row.folio)} onClick={e => e.stopPropagation()} onChange={() => setSelected(prev => prev.includes(row.folio) ? prev.filter(id => id !== row.folio) : [...prev, row.folio])} style={{ accentColor: '#1A3C2A' }} /></td>
              <td className="px-4" style={{ fontSize: '13px', fontFamily: 'Roboto Mono', color: '#1E88E5', fontWeight: 800 }}>{row.folio}</td>
              <td className="px-4" style={{ fontSize: '14px', color: '#12151A', fontWeight: 700 }}>{row.name}</td>
              <td className="px-4" style={{ fontSize: '13px', color: '#3D4450' }}>{row.kycDate}</td>
              <td className="px-4" style={{ fontSize: '13px', color: '#3D4450' }}>{row.expiry}</td>
              <td className="px-4" style={{ fontSize: '13px', color: row.daysLeft < 0 ? '#EF4444' : row.daysLeft < 30 ? '#F59E0B' : '#E65100', fontWeight: 900 }}>{row.daysLeft < 0 ? `${row.daysLeft} days` : `${row.daysLeft} days`}</td>
              <td className="px-4"><StatusBadge status={row.status} /></td>
              <td className="px-4"><button onClick={(e) => { e.stopPropagation(); setRequestMember(row); }} className="px-3 py-1.5 rounded-lg flex items-center gap-1.5" style={{ backgroundColor: row.daysLeft < 0 ? '#FEE2E2' : '#E8F5E9', color: row.daysLeft < 0 ? '#EF4444' : '#1A3C2A', fontSize: '12px', fontWeight: 800 }}><Send size={11} /> Send</button></td>
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
          footer={<><button onClick={() => setRequestMember(null)} className="px-4 py-2.5 rounded-lg border border-[#EDEEF0]">Cancel</button><button onClick={() => setRequestMember(null)} className="px-4 py-2.5 rounded-lg font-semibold" style={{ backgroundColor: '#1A3C2A', color: 'white' }}>Send Request</button></>}
        >
          <div style={{ fontSize: '13px', color: '#3D4450', lineHeight: '20px' }}>
            Send via: SMS, Email, or Both<br /><br />
            Dear {requestMember.name.split(' ')[0]}, your KYC with SFPCL is due for renewal. Please contact your nearest office or visit the WhatsLoan portal to upload updated PAN + Aadhaar. Reference: {requestMember.folio}
          </div>
        </AppModal>
      )}
    </Shell>
  );
}
