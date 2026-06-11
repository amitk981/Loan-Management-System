import { useState } from 'react';

interface LoanTrackerProps {
  currentStage: number;
  compact?: boolean;
  completedDates?: string[];
  onStageClick?: (stage: number) => void;
}

const stages = [
  { name: 'Application Submitted', icon: '📝' },
  { name: 'Credit Assessment', icon: '🔍' },
  { name: 'Sanctioned', icon: '✅' },
  { name: 'Documentation', icon: '📋' },
  { name: 'Disbursed', icon: '💸' },
  { name: 'Active / Closed', icon: '🔒' },
];

export function LoanTracker({ currentStage, compact = false, completedDates = [], onStageClick }: LoanTrackerProps) {
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);

  if (compact) {
    return (
      <div className="flex items-center gap-0">
        {stages.map((stage, i) => {
          const isDone = i < currentStage;
          const isCurrent = i === currentStage - 1;
          return (
            <div key={i} className="flex items-center">
              <button
                className="relative group"
                title={stage.name}
                onClick={() => onStageClick?.(i + 1)}
                style={{ cursor: onStageClick ? 'pointer' : 'default' }}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                    isDone
                      ? 'bg-[#22C55E] border-[#22C55E]'
                      : isCurrent
                      ? 'border-[#1A3C2A] bg-white'
                      : 'bg-[#EDEEF0] border-[#EDEEF0]'
                  }`}
                  style={isCurrent ? { boxShadow: '0 0 0 3px rgba(26,60,42,0.15)' } : undefined}
                />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#12151A] text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none transition-opacity" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                  {stage.name}
                  {completedDates[i] && <div className="text-white/60 mt-0.5">{completedDates[i]}</div>}
                </div>
              </button>
              {i < stages.length - 1 && (
                <div
                  className="h-0.5 w-6"
                  style={{ backgroundColor: isDone ? '#22C55E' : '#EDEEF0' }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between w-full">
      {stages.map((stage, i) => {
        const isDone = i < currentStage;
        const isCurrent = i === currentStage - 1;
        const isHovered = hoveredStage === i;
        return (
          <button
            key={i}
            className="flex flex-col items-center flex-1 relative group"
            onClick={() => onStageClick?.(i + 1)}
            onMouseEnter={() => setHoveredStage(i)}
            onMouseLeave={() => setHoveredStage(null)}
            style={{ cursor: isDone || onStageClick ? 'pointer' : 'default' }}
          >
            {i < stages.length - 1 && (
              <div
                className="absolute top-5 left-1/2 w-full h-0.5 z-0"
                style={{
                  backgroundColor: isDone ? '#22C55E' : '#EDEEF0',
                  backgroundImage: !isDone && !isCurrent ? 'repeating-linear-gradient(90deg, #D1D5DB 0 4px, transparent 4px 8px)' : 'none',
                }}
              />
            )}
            <div
              className={`relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm transition-all ${
                isDone
                  ? 'bg-[#22C55E] border-[#22C55E] text-white'
                  : isCurrent
                  ? 'border-[#1A3C2A] bg-white shadow-md'
                  : 'bg-[#F7F8FA] border-[#EDEEF0] text-[#9EA8B3]'
              }`}
              style={{
                ...(isCurrent ? { boxShadow: '0 0 0 4px rgba(26,60,42,0.12), 0 2px 8px rgba(0,0,0,0.1)' } : {}),
                ...(isHovered && isDone ? { transform: 'scale(1.1)', boxShadow: '0 4px 12px rgba(34,197,94,0.3)' } : {}),
              }}
            >
              {isDone ? '✓' : stage.icon}
            </div>
            <div className="mt-2 text-center">
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: isCurrent ? 600 : 400,
                  color: isDone ? '#166534' : isCurrent ? '#1A3C2A' : '#9EA8B3',
                  lineHeight: '18px',
                }}
              >
                {stage.name}
              </div>
              {completedDates[i] && (
                <div style={{ fontSize: '11px', color: '#9EA8B3', marginTop: '2px' }}>
                  {completedDates[i]}
                </div>
              )}
              {isCurrent && (
                <div
                  className="mt-1 px-2 py-0.5 rounded-full inline-flex"
                  style={{ backgroundColor: '#1A3C2A', color: 'white', fontSize: '10px', fontWeight: 600 }}
                >
                  Current
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
