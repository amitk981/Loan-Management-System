import { styleFor } from '../../lib/loanState';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

// Colour now comes from one place: the tone palette in lib/loanState.ts.
// Callers still pass a status string; the tone resolver maps it to a colour.
export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const { bg, text } = styleFor(status);
  // Minimum 12px even at 'sm' so status — the most-scanned element — stays legible
  // for the older, rural audience (audit DA-023).
  const padding = size === 'sm' ? '2px 8px' : '4px 12px';
  const fontSize = size === 'sm' ? '12px' : '13px';

  return (
    <span
      style={{
        backgroundColor: bg,
        color: text,
        padding,
        borderRadius: '9999px',
        fontSize,
        fontWeight: 500,
        display: 'inline-flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        lineHeight: '16px',
      }}
    >
      {status}
    </span>
  );
}
