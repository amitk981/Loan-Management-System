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
  /** Optional secondary action (e.g. "mark pending"), shown as an outline button. */
  secondaryAction?: { label: string; onClick: () => void };
  className?: string;
}

const styles: Record<GateVariant, { bg: string; border: string; fg: string; icon: ReactNode; btn: string }> = {
  blocked: { bg: 'var(--error-50)', border: 'var(--error-200)', fg: 'var(--error-900)', icon: <AlertOctagon size={18} />, btn: 'var(--error-500)' },
  warning: { bg: 'var(--warning-50)', border: 'var(--warning-200)', fg: 'var(--warning-700)', icon: <AlertTriangle size={18} />, btn: 'var(--gold-500)' },
  info: { bg: 'var(--info-25)', border: 'var(--info-200)', fg: 'var(--info-900)', icon: <Info size={18} />, btn: 'var(--brand-accent)' },
  ok: { bg: 'var(--success-50)', border: 'var(--success-200)', fg: 'var(--success-700)', icon: <CheckCircle2 size={18} />, btn: 'var(--brand-primary)' },
};

export function GateBanner({ variant, title, detail, action, secondaryAction, className = '' }: GateBannerProps) {
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
      {(action || secondaryAction) && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="px-4 py-2 rounded-lg"
              style={{ border: `1px solid ${s.btn}`, color: s.fg, fontSize: '13px', fontWeight: 700, backgroundColor: 'transparent' }}
            >
              {secondaryAction.label}
            </button>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className="px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: s.btn, fontSize: '13px', fontWeight: 700 }}
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
