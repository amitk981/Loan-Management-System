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
    <div
      className={`flex items-center gap-1 overflow-x-auto bg-white border border-[#EDEEF0] rounded-xl px-2 py-1.5 mb-5 ${className}`}
      role="tablist"
      aria-label="Section navigation"
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
              color: isActive ? 'white' : 'var(--neutral-700)',
              fontSize: '13px',
              fontWeight: isActive ? 700 : 500,
            }}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span
                className="px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.22)' : 'var(--error-100)',
                  color: isActive ? 'white' : '#991B1B',
                  fontSize: '10px',
                  fontWeight: 800,
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
