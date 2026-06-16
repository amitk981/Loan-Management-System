import { RefreshCw } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from '../shared/StatusBadge';
import { RoleCommandCenter } from '../shared/RoleCommandCenter';
import { treasuryProfile, treasuryQueue } from '../../data/treasuryData';
import { formatCurrency } from '../../lib/format';

interface TreasuryDashboardProps {
  onNavigate: (page: string) => void;
  activePage: string;
}


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
      <div className="mb-6 p-4 rounded-xl border border-[#BAE6FD] flex items-center justify-between" style={{ backgroundColor: '#F0F9FF' }}>
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-[#0284C7] text-white flex items-center justify-center font-bold text-sm">ℹ</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0369A1' }}>Disbursement Queue: 2 Files Ready for Payment</div>
            <div style={{ fontSize: '12px', color: '#3D4450', marginTop: '2px' }}>1 file is blocked due to missing SAP Customer Code. Process pending codes first.</div>
          </div>
        </div>
        <button onClick={() => onNavigate('treasury-sap-codes')} className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: '#0891B2', fontSize: '13px', fontWeight: 700 }}>Create SAP Codes</button>
      </div>
      <RoleCommandCenter
        title="Treasury Console"
        focus="Process payment files without SAP gaps"
        primaryAction={{ label: 'Open disbursement queue', detail: '2 files are waiting. Authorize or initiate before the end-of-day cut-off.', page: 'treasury-pending', tone: 'cyan', badge: '2' }}
        metrics={[
          { label: 'Ready', value: '4', tone: 'cyan' },
          { label: 'Auth', value: '2', tone: 'amber' },
          { label: 'SAP Gaps', value: '1', tone: 'red' },
        ]}
        secondaryActions={[
          { label: 'Authorize payments', detail: 'Review maker entries and OTP authorize.', page: 'treasury-auth', tone: 'amber' },
          { label: 'Create SAP code', detail: 'Resolve customer code requests before disbursement.', page: 'treasury-sap-codes', tone: 'cyan' },
          { label: 'Post repayments', detail: 'Match UTRs and post receipts to SAP.', page: 'treasury-incoming', tone: 'green' },
          { label: 'Reconcile bank', detail: 'Clear unmatched statement items.', page: 'treasury-reconciliation', tone: 'red' },
        ]}
        onNavigate={onNavigate}
      />

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

    </Shell>
  );
}
