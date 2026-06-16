import type { ReactNode } from 'react';
import { AlertTriangle, Check, Clock, FileText, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { auditTrailEvents, loanStages } from '../../data/crossRoleData';

export function UniversalStageTracker({ currentStage = 5, compact = false }: { currentStage?: number; compact?: boolean }) {
  return (
    <div className={`bg-white rounded-lg border border-[#EDEEF0] ${compact ? 'p-3' : 'p-5'}`}>
      <div className="flex items-start">
        {loanStages.map((label, i) => {
          const stage = i + 1;
          const done = stage < currentStage;
          const active = stage === currentStage;
          return (
            <div key={label} className="flex items-start flex-1">
              <div className="flex flex-col items-center">
                <button
                  title={`${label} · ${done ? 'Completed' : active ? 'Active' : 'Upcoming'}`}
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: done ? '#22C55E' : active ? '#1A3C2A' : 'white', border: active || done ? '0' : '2px solid #D1D5DB', color: active || done ? 'white' : '#9EA8B3', fontWeight: 700, boxShadow: active ? '0 0 0 6px rgba(26,60,42,0.12)' : 'none' }}
                >
                  {done ? <Check size={16} /> : stage}
                </button>
                {!compact && <div style={{ fontSize: 12, color: active ? '#1A3C2A' : '#3D4450', fontWeight: active ? 900 : 700, textAlign: 'center', marginTop: 8, maxWidth: 96 }}>{label}</div>}
              </div>
              {i < loanStages.length - 1 && <div className="flex-1 h-1 mx-2 mt-4 rounded-full" style={{ backgroundColor: done ? '#22C55E' : '#EDEEF0', borderTop: done ? '0' : '1px dashed #D1D5DB' }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AuditTrailPanel({ farmerSafe = false }: { farmerSafe?: boolean }) {
  const visibleEvents = farmerSafe ? auditTrailEvents.filter(row => !['Credit Manager', 'Sanction Committee', 'Director'].includes(row[1])) : auditTrailEvents;
  return (
    <div className="bg-white rounded-lg border border-[#EDEEF0] overflow-hidden">
      <div className="px-5 py-3 border-b border-[#EDEEF0] flex items-center justify-between" style={{ backgroundColor: '#F7F8FA' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700 }}>Universal Loan Audit Trail</h3>
        <span style={{ fontSize: 12, color: '#6B7280' }}>{farmerSafe ? 'Farmer-safe view' : 'Full internal view'}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead><tr>{['Timestamp', 'Role', 'Actor', 'Stage', 'Action', 'Entity', 'Details'].map(h => <th key={h} className="px-4 py-3 text-left" style={{ fontSize: 11, color: '#9EA8B3', textTransform: 'uppercase' }}>{h}</th>)}</tr></thead>
          <tbody>{visibleEvents.map(row => <tr key={`${row[0]}-${row[4]}`} className="border-t border-[#EDEEF0]">{row.map((cell, i) => <td key={i} className="px-4 py-3" style={{ fontSize: 12, color: i === 5 ? '#1E88E5' : '#3D4450', fontFamily: i === 5 ? 'Roboto Mono' : 'inherit', fontWeight: i === 5 ? 900 : 600 }}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

export function DirectorCaseBanner({ blocked = false }: { blocked?: boolean }) {
  return (
    <div className="rounded-lg p-4 border" style={{ backgroundColor: '#FFFBEB', borderColor: '#F59E0B', color: '#92400E' }}>
      <div className="flex gap-3">
        <ShieldAlert size={20} />
        <div className="flex-1">
          <div style={{ fontSize: 14, fontWeight: 700 }}>{blocked ? 'Access Excluded — Director / Relative Borrower' : 'SPECIAL CASE — DIRECTOR / RELATIVE BORROWER'}</div>
          <p style={{ fontSize: 13, lineHeight: '20px', marginTop: 4 }}>{blocked ? 'You are excluded from reviewing this loan per Section 378ZK. Contact the CFO.' : 'This applicant is identified as a relative of R. Deshmukh. Per Section 378ZK, GM approval is required before sanction.'}</p>
          {!blocked && <div className="flex gap-2 mt-3"><button className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#1A3C2A', color: 'white', fontSize: 12, fontWeight: 800 }}>Upload GM Resolution</button><button className="px-3 py-1.5 rounded-lg border border-[#F59E0B]" style={{ fontSize: 12, fontWeight: 800 }}>Mark GM Pending</button></div>}
        </div>
      </div>
    </div>
  );
}

export function S186LockBanner({ audience }: { audience: 'sc' | 'credit' | 'farmer' }) {
  const text = audience === 'sc'
    ? 'LENDING SUSPENDED — s.186 limit reached. New loans cannot be sanctioned until Board passes a special resolution or exposure reduces.'
    : audience === 'credit'
      ? 'New loan approvals are suspended — s.186 statutory limit reached. Existing applications in queue are paused. Contact CFO.'
      : 'Your application is received and placed in a hold queue while a regulatory compliance matter is being processed.';
  return <div className="rounded-lg p-4 flex gap-3" style={{ backgroundColor: audience === 'farmer' ? '#FEF3C7' : '#FEF2F2', color: audience === 'farmer' ? '#92400E' : '#991B1B', border: `1px solid ${audience === 'farmer' ? '#FDE68A' : '#FECACA'}` }}><AlertTriangle size={20} /><strong style={{ fontSize: 13 }}>{text}</strong></div>;
}

export function HandoffCard({ title, from, to, children, action }: { title: string; from: string; to: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="bg-white rounded-lg p-5 border border-[#EDEEF0]">
      <div className="flex items-start justify-between gap-3">
        <div><h3 style={{ fontSize: 16, fontWeight: 700, color: '#12151A' }}>{title}</h3><div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>{from} → {to}</div></div>
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E0F2FE', color: '#0891B2' }}><Clock size={16} /></div>
      </div>
      <div style={{ fontSize: 13, color: '#3D4450', lineHeight: '21px', marginTop: 12 }}>{children}</div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function DocumentLinkList() {
  return (
    <div className="space-y-2">
      {['CS-signed checklist PDF', 'Credit appraisal note summary', 'Sanction register entry', '15-item document index', 'SAP customer code log entry'].map(item => (
        <button key={item} className="w-full flex items-center justify-between p-3 rounded-lg border border-[#EDEEF0] hover:bg-[#F7F8FA]">
          <span className="flex items-center gap-2" style={{ fontSize: 13, fontWeight: 800, color: '#3D4450' }}><FileText size={14} />{item}</span>
          <span style={{ fontSize: 12, color: '#0891B2', fontWeight: 700 }}>View →</span>
        </button>
      ))}
    </div>
  );
}

export function RoleAccessNote() {
  const { user } = useAuth();
  return <div className="p-3 rounded-lg" style={{ backgroundColor: '#F7F8FA', color: '#3D4450', fontSize: 12 }}>Access mode: <strong>{user?.roleLabel}</strong> · {user?.role === 'farmer' ? 'Own profile only, internal notes redacted.' : user?.role === 'credit' ? 'Editable application and member details.' : user?.role === 'compliance' ? 'KYC and compliance fields editable.' : 'Read-only unless role action is assigned.'}</div>;
}
