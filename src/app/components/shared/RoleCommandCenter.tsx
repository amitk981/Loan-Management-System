import type { ReactNode } from 'react';
import { ArrowRight, Clock, ShieldCheck } from 'lucide-react';

interface RoleAction {
  label: string;
  detail: string;
  page: string;
  tone?: 'green' | 'blue' | 'purple' | 'cyan' | 'amber' | 'red' | 'neutral';
  badge?: string;
}

interface RoleCommandCenterProps {
  title: string;
  focus: string;
  primaryAction: RoleAction;
  secondaryActions: RoleAction[];
  metrics?: { label: string; value: string; tone?: RoleAction['tone'] }[];
  icon?: ReactNode;
  onNavigate: (page: string) => void;
}

const tones = {
  green: { bg: 'var(--brand-light)', fg: 'var(--brand-primary)', border: '#BBF7D0' },
  blue: { bg: 'var(--info-100)', fg: '#1E40AF', border: '#BFDBFE' },
  purple: { bg: '#EDE9FE', fg: '#7C3AED', border: '#DDD6FE' },
  cyan: { bg: '#E0F2FE', fg: '#0891B2', border: '#BAE6FD' },
  amber: { bg: 'var(--warning-100)', fg: '#92400E', border: '#FDE68A' },
  red: { bg: 'var(--error-100)', fg: '#991B1B', border: '#FECACA' },
  neutral: { bg: 'var(--neutral-100)', fg: 'var(--neutral-700)', border: 'var(--neutral-200)' },
};

function toneFor(tone: RoleAction['tone'] = 'green') {
  return tones[tone];
}

export function RoleCommandCenter({ title, focus, primaryAction, secondaryActions, metrics = [], icon, onNavigate }: RoleCommandCenterProps) {
  const primaryTone = toneFor(primaryAction.tone);

  return (
    <section className="mb-5 bg-white rounded-2xl border border-[#EDEEF0] overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div className="grid grid-cols-12">
        <button
          onClick={() => onNavigate(primaryAction.page)}
          className="col-span-5 p-5 text-left flex flex-col justify-between clickable-card"
          style={{ backgroundColor: primaryTone.bg, borderRight: '1px solid #EDEEF0', minHeight: 178 }}
        >
          <div>
            <div className="flex items-center gap-2 mb-3" style={{ color: primaryTone.fg }}>
              {icon || <ShieldCheck size={18} />}
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>{title}</span>
            </div>
            <h2 style={{ fontSize: 20, lineHeight: '28px', fontWeight: 800, color: 'var(--neutral-900)' }}>{focus}</h2>
            <div style={{ fontSize: 13, lineHeight: '20px', color: 'var(--neutral-700)', marginTop: 8 }}>{primaryAction.detail}</div>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: primaryTone.fg, color: 'white', fontSize: 13, fontWeight: 800, width: 'fit-content' }}>
            {primaryAction.label} <ArrowRight size={14} />
          </div>
        </button>

        <div className="col-span-7 p-4">
          <div className="grid grid-cols-3 gap-3 mb-3">
            {metrics.map(metric => {
              const metricTone = toneFor(metric.tone || 'neutral');
              return (
                <div key={metric.label} className="p-3 rounded-xl" style={{ backgroundColor: 'var(--neutral-100)', border: '1px solid #EDEEF0' }}>
                  <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 800 }}>{metric.label}</div>
                  <div style={{ fontSize: 19, color: metricTone.fg, fontWeight: 700, fontFamily: 'Roboto Mono', marginTop: 4 }}>{metric.value}</div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {secondaryActions.map(action => {
              const actionTone = toneFor(action.tone || 'neutral');
              return (
                <button
                  key={action.label}
                  onClick={() => onNavigate(action.page)}
                  className="p-3 rounded-xl text-left action-surface"
                  style={{ border: `1px solid ${actionTone.border}`, backgroundColor: actionTone.bg }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div style={{ fontSize: 13, color: actionTone.fg, fontWeight: 700 }}>{action.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--neutral-700)', lineHeight: '18px', marginTop: 3 }}>{action.detail}</div>
                    </div>
                    {action.badge && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.72)', color: actionTone.fg, fontSize: 11, fontWeight: 800 }}>
                        <Clock size={11} /> {action.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
