import { ArrowUpDown, FileSearch } from 'lucide-react';

export function EmptyTableState({ title, message }: { title: string; message: string }) {
  return (
    <div className="p-10 text-center">
      <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--brand-light)' }}>
        <FileSearch size={24} style={{ color: 'var(--brand-primary)' }} />
      </div>
      <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--neutral-900)' }}>{title}</div>
      <div style={{ fontSize: '13px', color: 'var(--neutral-700)', marginTop: '5px' }}>{message}</div>
    </div>
  );
}

export function SkeletonRows({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, row) => (
        <tr key={row} className="border-b border-[#EDEEF0]">
          {Array.from({ length: cols }).map((__, col) => (
            <td key={col} className="px-4 py-4">
              <div className="h-3 rounded-full animate-pulse" style={{ width: `${col === 0 ? 56 : 70 + ((row + col) % 3) * 18}%`, backgroundColor: 'var(--neutral-200)' }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function SortableHeader({
  label,
  active,
  direction,
  onClick,
}: {
  label: string;
  active?: boolean;
  direction?: 'asc' | 'desc';
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5" style={{ fontSize: '11px', fontWeight: 700, color: active ? 'var(--brand-primary)' : 'var(--neutral-400)', textTransform: 'uppercase' }}>
      {label}
      <ArrowUpDown size={12} style={{ opacity: active ? 1 : 0.45, transform: active && direction === 'desc' ? 'rotate(180deg)' : 'none' }} />
    </button>
  );
}
