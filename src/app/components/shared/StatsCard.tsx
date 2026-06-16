import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  color?: string;
  badge?: { text: string; type: 'success' | 'warning' | 'error' | 'info' };
  progress?: number;
  className?: string;
  onClick?: () => void;
}

export function StatsCard({ title, value, subtitle, icon, color, badge, progress, className = '', onClick }: StatsCardProps) {
  const badgeColors = {
    success: { bg: 'var(--success-100)', text: 'var(--success-500)' },
    warning: { bg: 'var(--warning-100)', text: 'var(--warning-500)' },
    error: { bg: 'var(--error-100)', text: 'var(--error-500)' },
    info: { bg: 'var(--info-100)', text: 'var(--info-500)' },
  };

  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      className={`bg-white rounded-2xl p-5 border border-[var(--neutral-200)] text-left ${onClick ? 'clickable-card' : ''} ${className}`}
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      <div className="flex items-start justify-between mb-3">
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-400)', lineHeight: '18px' }}>{title}</span>
        {icon && (
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: color ? `${color}18` : 'var(--brand-light)' }}
          >
            <span style={{ color: color || 'var(--brand-secondary)' }}>{icon}</span>
          </div>
        )}
      </div>
      <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--neutral-900)', lineHeight: '36px', fontFamily: 'Inter, sans-serif' }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: '12px', color: 'var(--neutral-400)', marginTop: '4px', lineHeight: '18px' }}>{subtitle}</div>
      )}
      {badge && (
        <span
          className="inline-flex items-center mt-2 px-2 py-0.5 rounded-full"
          style={{ fontSize: '11px', fontWeight: 500, backgroundColor: badgeColors[badge.type].bg, color: badgeColors[badge.type].text }}
        >
          {badge.text}
        </span>
      )}
      {progress !== undefined && (
        <div className="mt-3">
          <div className="h-1.5 bg-[var(--neutral-200)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${progress}%`, backgroundColor: color || 'var(--brand-secondary)', transition: 'width 0.6s ease' }}
            />
          </div>
          <div style={{ fontSize: '11px', color: 'var(--neutral-400)', marginTop: '4px' }}>{progress}% completed</div>
        </div>
      )}
    </Wrapper>
  );
}
