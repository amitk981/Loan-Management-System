import { ReactNode } from 'react';
import { X } from 'lucide-react';

export function AppModal({
  title,
  subtitle,
  icon,
  width = 480,
  onClose,
  children,
  footer,
  destructive = false,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  width?: number;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  destructive?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(18,21,26,0.48)' }} role="dialog" aria-modal="true" aria-labelledby="app-modal-title">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full" style={{ maxWidth: width }}>
        <div className="px-5 py-4 border-b border-[#EDEEF0] flex items-start gap-3">
          {icon && (
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: destructive ? '#FEE2E2' : '#E8F5E9', color: destructive ? '#EF4444' : '#1A3C2A' }}>
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div id="app-modal-title" style={{ fontSize: '16px', fontWeight: 700, color: '#12151A' }}>{title}</div>
            {subtitle && <div style={{ fontSize: '12px', color: '#9EA8B3', marginTop: '2px' }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} aria-label="Close modal" className="p-2 rounded-lg hover:bg-[#F7F8FA]">
            <X size={16} style={{ color: '#9EA8B3' }} />
          </button>
        </div>
        <div className="p-5">{children}</div>
        {footer && <div className="px-5 py-4 border-t border-[#EDEEF0] flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}
