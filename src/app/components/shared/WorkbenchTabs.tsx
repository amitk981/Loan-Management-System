export interface WorkbenchTab {
  key: string;
  label: string;
  badge?: string | number;
}

interface WorkbenchTabsProps {
  tabs: WorkbenchTab[];
  activeKey: string;
  onChange: (key: string) => void;
  accent?: string;
  className?: string;
}

export function WorkbenchTabs({ tabs, activeKey, onChange, accent = 'var(--brand-primary)', className = '' }: WorkbenchTabsProps) {
  return (
    <div className="mb-4">
    <div
      className={`shell-scroll flex items-center gap-0.5 overflow-x-auto bg-white border border-[var(--neutral-200)] rounded-xl px-1.5 py-1.5 ${className}`}
      role="tablist"
      aria-label="Section navigation"
      style={{ scrollbarWidth: 'thin', WebkitOverflowScrolling: 'touch' }}
    >
      {tabs.map(tab => {
        const isActive = activeKey === tab.key;
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all flex-shrink-0"
            style={{
              backgroundColor: isActive ? accent : 'transparent',
              color: isActive ? 'white' : 'var(--neutral-500)',
              fontSize: '13px',
              fontWeight: isActive ? 700 : 500,
            }}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span
                className="px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.22)' : 'var(--error-50)',
                  color: isActive ? 'white' : 'var(--error-600)',
                  fontSize: '10px',
                  fontWeight: 700,
                  border: isActive ? 'none' : '1px solid var(--error-200)',
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
    </div>
  );
}
