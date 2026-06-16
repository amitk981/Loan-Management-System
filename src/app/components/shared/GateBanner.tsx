import type { ReactNode } from 'react';
import { AlertOctagon, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

// The SOP "hard gate" pattern: every blocked action states the rule that blocks it
// AND the action required to unblock (see audit §G.6 + the SOP "Top 10 errors").
// One home for all 10 gates so they look and behave identically everywhere.

export type GateVariant = 'blocked' | 'warning' | 'info' | 'ok';

interface GateBannerProps {
  variant: GateVariant;
  title: string;
  /** What rule blocks this / what's required to unblock — plain language. */
  detail: ReactNode;
  /** Optional unblock action shown as a button. */
  action?: { label: string; onClick: () => void };
  className?: string;
}

const styles: Record<GateVariant, { bg: string; border: string; fg: string; icon: ReactNode; btn: string }> = {
  blocked: { bg: '#FEF2F2', border: '#FECACA', fg: '#991B1B', icon: <AlertOctagon size={18} />, btn: 'var(--error-500)' },
  warning: { bg: '#FFFBEB', border: '#FDE68A', fg: '#92400E', icon: <AlertTriangle size={18} />, btn: 'var(--gold-500)' },
  info: { bg: '#EFF6FF', border: '#BFDBFE', fg: '#1E40AF', icon: <Info size={18} />, btn: 'var(--brand-accent)' },
  ok: { bg: '#F0FDF4', border: '#BBF7D0', fg: '#166534', icon: <CheckCircle2 size={18} />, btn: 'var(--brand-primary)' },
};

export function GateBanner({ variant, title, detail, action, className = '' }: GateBannerProps) {
  const s = styles[variant];
  return (
    <div
      role={variant === 'blocked' ? 'alert' : 'status'}
      className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${className}`}
      style={{ backgroundColor: s.bg, borderColor: s.border }}
    >
      <div className="flex items-start gap-3">
        <span style={{ color: s.btn, flexShrink: 0, marginTop: 1 }}>{s.icon}</span>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: s.fg }}>{title}</div>
          <div style={{ fontSize: '12px', color: 'var(--neutral-700)', marginTop: '2px', lineHeight: '18px' }}>{detail}</div>
        </div>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 rounded-lg text-white flex-shrink-0"
          style={{ backgroundColor: s.btn, fontSize: '13px', fontWeight: 700 }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
