import type { ReactNode } from 'react';
import { Check, Clock, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GateBanner } from './GateBanner';
import { auditTrailEvents, loanStages } from '../../data/crossRoleData';

export function UniversalStageTracker({ currentStage = 5, compact = false }: { currentStage?: number; compact?: boolean }) {
  return (
    <div className={`bg-white rounded-lg border border-[var(--neutral-200)] ${compact ? 'p-3' : 'p-5'}`}>
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
                  style={{ backgroundColor: done ? 'var(--success-500)' : active ? 'var(--brand-primary)' : 'white', border: active || done ? '0' : '2px solid var(--neutral-300)', color: active || done ? 'white' : 'var(--neutral-400)', fontWeight: 700, boxShadow: active ? '0 0 0 6px rgba(26,60,42,0.12)' : 'none' }}
                >
                  {done ? <Check size={16} /> : stage}
                </button>
                {!compact && <div style={{ fontSize: 12, color: active ? 'var(--brand-primary)' : 'var(--neutral-700)', fontWeight: active ? 700 : 700, textAlign: 'center', marginTop: 8, maxWidth: 96 }}>{label}</div>}
              </div>
              {i < loanStages.length - 1 && <div className="flex-1 h-1 mx-2 mt-4 rounded-full" style={{ backgroundColor: done ? 'var(--success-500)' : 'var(--neutral-200)', borderTop: done ? '0' : '1px dashed var(--neutral-300)' }} />}
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
    <div className="bg-white rounded-lg border border-[var(--neutral-200)] overflow-hidden">
      <div className="px-5 py-3 border-b border-[var(--neutral-200)] flex items-center justify-between" style={{ backgroundColor: 'var(--neutral-100)' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700 }}>Universal Loan Audit Trail</h3>
        <span style={{ fontSize: 12, color: 'var(--neutral-500)' }}>{farmerSafe ? 'Farmer-safe view' : 'Full internal view'}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead><tr>{['Timestamp', 'Role', 'Actor', 'Stage', 'Action', 'Entity', 'Details'].map(h => <th key={h} className="px-4 py-3 text-left" style={{ fontSize: 11, color: 'var(--neutral-400)', textTransform: 'uppercase' }}>{h}</th>)}</tr></thead>
          <tbody>{visibleEvents.map(row => <tr key={`${row[0]}-${row[4]}`} className="border-t border-[var(--neutral-200)]">{row.map((cell, i) => <td key={i} className="px-4 py-3" style={{ fontSize: 12, color: i === 5 ? 'var(--brand-accent)' : 'var(--neutral-700)', fontFamily: i === 5 ? 'Roboto Mono' : 'inherit', fontWeight: i === 5 ? 700 : 500 }}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

export function DirectorCaseBanner({ blocked = false }: { blocked?: boolean }) {
  // SOP gate #1 (related-party): director/relative borrower needs GM approval (Sec 378ZK).
  return (
    <GateBanner
      variant={blocked ? 'blocked' : 'warning'}
      title={blocked ? 'Access excluded — Director / Relative borrower' : 'Special case — Director / Relative borrower'}
      detail={blocked
        ? 'You are excluded from reviewing this loan per Section 378ZK. Contact the CFO.'
        : 'This applicant is a relative of R. Deshmukh. Per Section 378ZK, General-Meeting approval is required before sanction.'}
      action={blocked ? undefined : { label: 'Upload GM Resolution', onClick: () => {} }}
      secondaryAction={blocked ? undefined : { label: 'Mark GM Pending', onClick: () => {} }}
    />
  );
}

export function S186LockBanner({ audience }: { audience: 'sc' | 'credit' | 'farmer' }) {
  // SOP gate (s.186): lending cap reached → block new sanctions without board special resolution.
  const detail = audience === 'sc'
    ? 'New loans cannot be sanctioned until the Board passes a special resolution or exposure reduces.'
    : audience === 'credit'
      ? 'New loan approvals are suspended — existing applications in queue are paused. Contact the CFO.'
      : 'Your application is received and placed in a hold queue while a regulatory compliance matter is processed.';
  return (
    <GateBanner
      variant={audience === 'farmer' ? 'warning' : 'blocked'}
      title={audience === 'farmer' ? 'Application on hold' : 'Lending suspended — s.186 limit reached'}
      detail={detail}
    />
  );
}

export function HandoffCard({ title, from, to, children, action }: { title: string; from: string; to: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="bg-white rounded-lg p-5 border border-[var(--neutral-200)]">
      <div className="flex items-start justify-between gap-3">
        <div><h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--neutral-900)' }}>{title}</h3><div style={{ fontSize: 12, color: 'var(--neutral-500)', marginTop: 4 }}>{from} → {to}</div></div>
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--info-50)', color: 'var(--accent-treasury)' }}><Clock size={16} /></div>
      </div>
      <div style={{ fontSize: 13, color: 'var(--neutral-700)', lineHeight: '21px', marginTop: 12 }}>{children}</div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function DocumentLinkList() {
  return (
    <div className="space-y-2">
      {['CS-signed checklist PDF', 'Credit appraisal note summary', 'Sanction register entry', '15-item document index', 'SAP customer code log entry'].map(item => (
        <button key={item} className="w-full flex items-center justify-between p-3 rounded-lg border border-[var(--neutral-200)] hover:bg-[var(--neutral-100)]">
          <span className="flex items-center gap-2" style={{ fontSize: 13, fontWeight: 700, color: 'var(--neutral-700)' }}><FileText size={14} />{item}</span>
          <span style={{ fontSize: 12, color: 'var(--accent-treasury)', fontWeight: 700 }}>View →</span>
        </button>
      ))}
    </div>
  );
}

export function RoleAccessNote() {
  const { user } = useAuth();
  return <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--neutral-100)', color: 'var(--neutral-700)', fontSize: 12 }}>Access mode: <strong>{user?.roleLabel}</strong> · {user?.role === 'farmer' ? 'Own profile only, internal notes redacted.' : user?.role === 'credit' ? 'Editable application and member details.' : user?.role === 'compliance' ? 'KYC and compliance fields editable.' : 'Read-only unless role action is assigned.'}</div>;
}
