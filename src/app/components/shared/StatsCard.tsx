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
    success: { bg: '#DCFCE7', text: '#22C55E' },
    warning: { bg: '#FEF3C7', text: '#F59E0B' },
    error: { bg: '#FEE2E2', text: '#EF4444' },
    info: { bg: '#DBEAFE', text: '#3B82F6' },
  };

  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      className={`bg-white rounded-2xl p-5 border border-[#EDEEF0] text-left ${onClick ? 'clickable-card' : ''} ${className}`}
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <span style={{ fontSize: '13px', fontWeight: 500, color: '#9EA8B3', lineHeight: '18px' }}>{title}</span>
        {icon && (
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: color ? `${color}18` : '#E8F5E9' }}
          >
            <span style={{ color: color || '#2D7A4F' }}>{icon}</span>
          </div>
        )}
      </div>
      <div style={{ fontSize: '28px', fontWeight: 700, color: '#12151A', lineHeight: '36px', fontFamily: 'Inter, sans-serif' }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: '12px', color: '#9EA8B3', marginTop: '4px', lineHeight: '18px' }}>{subtitle}</div>
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
          <div className="h-1.5 bg-[#EDEEF0] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${progress}%`, backgroundColor: color || '#2D7A4F', transition: 'width 0.6s ease' }}
            />
          </div>
          <div style={{ fontSize: '11px', color: '#9EA8B3', marginTop: '4px' }}>{progress}% completed</div>
        </div>
      )}
    </Wrapper>
  );
}
