import { Banknote, CheckCircle, Monitor, RefreshCw, WalletCards } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from '../shared/StatusBadge';
import { flowTrend, repaymentFeed, treasuryKpis, treasuryProfile, treasuryQueue } from '../../data/treasuryData';

interface TreasuryDashboardProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

function formatCurrency(n: number, paise = false) {
  return '₹' + n.toLocaleString('en-IN') + (paise ? '.00' : '');
}

const kpiPages = ['treasury-pending', 'treasury-today', 'treasury-sap-codes', 'treasury-incoming'];

export function TreasuryDashboard({ onNavigate, activePage }: TreasuryDashboardProps) {
  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Treasury', 'Dashboard']}
      pageTitle="Treasury Operations"
      pageSubtitle={`Today: ${treasuryProfile.today}`}
      actions={
        <div className="flex items-center gap-2">
          <button onClick={() => onNavigate('treasury-disbursement')} className="px-4 py-2.5 rounded-lg font-semibold hover:shadow-md transition-all active:scale-[0.98]" style={{ backgroundColor: '#0891B2', color: 'white', fontSize: '14px' }}>+ Initiate Disbursement</button>
          <button aria-label="Refresh" className="w-10 h-10 rounded-lg border border-[#EDEEF0] flex items-center justify-center hover:bg-[#F7F8FA] transition-colors"><RefreshCw size={16} /></button>
        </div>
      }
    >
      <div className="grid grid-cols-4 gap-4 mb-5">
        {treasuryKpis.map((kpi, i) => (
          <button key={kpi.label} onClick={() => onNavigate(kpiPages[i] || 'treasury-pending')} className="bg-white rounded-xl p-4 border border-[#EDEEF0] text-left clickable-card" style={{ minHeight: 120 }}>
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: kpi.bg, color: kpi.color }}>
                {i === 0 ? <Banknote size={20} /> : i === 1 ? <CheckCircle size={20} /> : i === 2 ? <Monitor size={20} /> : <WalletCards size={20} />}
              </div>
              <span className="px-2 py-1 rounded-full" style={{ backgroundColor: i === 0 ? '#FEF3C7' : i === 3 ? '#FEF3C7' : '#F0FDF4', color: i === 0 || i === 3 ? '#D97706' : '#166534', fontSize: '11px', fontWeight: 700 }}>{kpi.tag}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#9EA8B3', marginTop: '12px', fontWeight: 600 }}>{kpi.label}</div>
            <div style={{ fontSize: '26px', color: i === 1 ? '#22C55E' : kpi.color, fontWeight: 800, fontFamily: 'Roboto Mono', marginTop: '2px' }}>{kpi.display}</div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#EDEEF0] overflow-hidden mb-5">
        <div className="px-5 py-3 border-b border-[#EDEEF0] flex items-center justify-between" style={{ backgroundColor: '#F7F8FA' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#12151A' }}>Disbursement Queue</h3>
          <button onClick={() => onNavigate('treasury-pending')} className="hover:text-[#067a96] transition-colors" style={{ fontSize: '13px', color: '#0891B2', fontWeight: 700 }}>View All</button>
        </div>
        <div className="table-scroll">
          <table className="w-full">
            <thead>
              <tr>{['Loan ID', 'Borrower', 'Amount', 'Stage', 'CS Sign', 'SAP Code', 'Waiting', 'Action'].map(h => <th key={h} className="px-4 py-3 text-left" style={{ fontSize: '11px', color: '#9EA8B3', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {treasuryQueue.map(row => (
                <tr key={row.id} className="border-t border-[#EDEEF0] clickable-row" onClick={() => onNavigate(row.page)}>
                  <td className="px-4 py-3" style={{ fontSize: '13px', fontFamily: 'Roboto Mono', color: '#0E7490', fontWeight: 700 }}>{row.id}</td>
                  <td className="px-4" style={{ fontSize: '13px', color: '#12151A', fontWeight: 600 }}>{row.borrower}</td>
                  <td className="px-4 text-right" style={{ fontSize: '13px', fontFamily: 'Roboto Mono', color: '#12151A', fontWeight: 700 }}>{formatCurrency(row.amount, true)}</td>
                  <td className="px-4"><StatusBadge status={row.stage} /></td>
                  <td className="px-4" style={{ color: row.csSign === '✓' ? '#22C55E' : '#D97706', fontWeight: 800 }}>{row.csSign}</td>
                  <td className="px-4" style={{ fontSize: '12px', fontFamily: 'Roboto Mono', color: row.sapCode ? '#12151A' : '#D97706' }}>{row.sapCode || '—'}</td>
                  <td className="px-4" style={{ fontSize: '12px', color: row.risk === 'red' ? '#EF4444' : row.risk === 'amber' ? '#D97706' : '#166534', fontWeight: 700 }}>{row.waiting}</td>
                  <td className="px-4"><button onClick={(e) => { e.stopPropagation(); onNavigate(row.page); }} className="px-3 py-1.5 rounded-lg transition-all hover:shadow-sm active:scale-95" style={{ backgroundColor: '#E0F2FE', color: '#0891B2', fontSize: '12px', fontWeight: 700 }}>{row.action} →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5 mb-5">
        <div className="col-span-3 bg-white rounded-xl border border-[#EDEEF0] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#EDEEF0] flex items-center justify-between" style={{ backgroundColor: '#F7F8FA' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Today's Repayments</h3>
            <button onClick={() => onNavigate('treasury-incoming')} className="hover:text-[#067a96] transition-colors" style={{ fontSize: '13px', color: '#0891B2', fontWeight: 700 }}>View All</button>
          </div>
          {repaymentFeed.map(item => (
            <button key={`${item.time}-${item.loan}`} className="w-full px-5 py-3 border-b border-[#EDEEF0] last:border-0 flex items-center gap-3 text-left clickable-row" onClick={() => onNavigate('treasury-incoming')}>
              <span className="w-14 flex-shrink-0" style={{ fontSize: '12px', color: '#6B7280' }}>{item.time}</span>
              <div className="flex-1 min-w-0 truncate" style={{ fontSize: '13px', color: '#12151A' }}><strong>{item.borrower}</strong> · <span style={{ fontFamily: 'Roboto Mono' }}>{item.loan}</span></div>
              <div style={{ fontSize: '13px', fontFamily: 'Roboto Mono', fontWeight: 800 }}>{formatCurrency(item.amount)}</div>
              <span className="px-2 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: item.posted ? '#DCFCE7' : '#E0F2FE', color: item.posted ? '#166534' : '#0891B2', fontSize: '11px', fontWeight: 700 }}>{item.action}</span>
            </button>
          ))}
        </div>
        <div className="col-span-2 bg-white rounded-xl p-5 border border-[#EDEEF0]">
          <div className="flex items-center justify-between mb-4"><h3 style={{ fontSize: '15px', fontWeight: 700 }}>Interest Accruals</h3><span style={{ fontSize: '12px', color: '#6B7280' }}>Jun 2026</span></div>
          {[
            ['Accrued this month', '₹24,300', '#22C55E'],
            ['Invoices pending', '7 loans', '#D97706'],
            ['Capitalized (30 Apr)', '₹8,200', '#1E88E5'],
          ].map(([label, value, color]) => <div key={label} className="flex items-center justify-between py-3 border-b border-[#EDEEF0]"><span style={{ fontSize: '13px', color: '#3D4450' }}>{label}</span><strong style={{ fontSize: '13px', color, fontFamily: 'Roboto Mono' }}>{value}</strong></div>)}
          <button onClick={() => onNavigate('treasury-interest')} className="w-full mt-4 py-2.5 rounded-lg font-semibold hover:shadow-sm transition-all active:scale-[0.98]" style={{ backgroundColor: '#2D7A4F', color: 'white', fontSize: '13px' }}>Generate Interest Invoices</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-xl p-5 border border-[#EDEEF0]">
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: 18 }}>₹ Flow — 12 Months</h3>
          <div className="flex items-end gap-2" style={{ height: 160 }}>
            {flowTrend.map(([m, d, r]) => <div key={m as string} className="flex-1 flex flex-col items-center justify-end gap-1"><div className="w-full rounded-t" style={{ height: `${Number(d) * 18}px`, backgroundColor: '#0891B2' }} /><div className="w-full rounded-t" style={{ height: `${Number(r) * 18}px`, backgroundColor: '#22C55E' }} /><span style={{ fontSize: '10px', color: '#6B7280' }}>{m}</span></div>)}
          </div>
          <div className="flex gap-4 mt-3" style={{ fontSize: '12px', color: '#3D4450' }}><span>■ Disbursements</span><span style={{ color: '#22C55E' }}>■ Repayments</span></div>
        </div>
        <button onClick={() => onNavigate('treasury-ledger')} className="bg-white rounded-xl p-5 border border-[#EDEEF0] text-left clickable-card">
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: 18 }}>Portfolio Composition</h3>
          <div className="flex items-center gap-6">
            <div className="w-40 h-40 rounded-full flex items-center justify-center" style={{ background: 'conic-gradient(#1A3C2A 0 70%, #0891B2 70% 92%, #EF4444 92% 100%)' }}>
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-center" style={{ fontSize: '18px', fontWeight: 800, color: '#12151A' }}>₹42.6L<br /><span style={{ fontSize: 11, color: '#6B7280', fontWeight: 400 }}>Total</span></div>
            </div>
            <div className="space-y-3" style={{ fontSize: '13px', color: '#3D4450' }}>
              <div><span style={{ color: '#1A3C2A' }}>■</span> Principal · ₹38.4L</div>
              <div><span style={{ color: '#0891B2' }}>■</span> Interest · ₹3.4L</div>
              <div><span style={{ color: '#EF4444' }}>■</span> Overdue · ₹0.8L</div>
            </div>
          </div>
        </button>
      </div>
    </Shell>
  );
}
