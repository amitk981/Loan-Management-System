import { Shell } from '../layout/Shell';
import { StatusBadge } from './StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { STAGES } from '../../lib/loanState';
import { formatCurrency } from '../../lib/format';
import { useLoans } from '../../data/loanStore';

// The Pipeline board: one shared view of every loan grouped by the 6 SOP stages.
// The loan (not the menu) is the object; clicking a card opens THAT loan's file (carries the id).
// Cards read the live loan store, so sanction decisions taken in the Loan File move cards here.
// Each role's owned stage is highlighted so they see "what's mine" at a glance.

interface PipelineProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

// Which role owns each stage column (for the highlight).
const STAGE_OWNER = ['farmer', 'credit', 'sanction', 'compliance', 'treasury', 'credit'];

export function Pipeline({ onNavigate, activePage }: PipelineProps) {
  const { user } = useAuth();
  const role = user?.role || 'credit';
  const loans = useLoans();

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Pipeline']}
      pageTitle="Loan Pipeline"
      pageSubtitle="Every loan across the six SOP stages — click any loan to open its file"
    >
      <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin' }}>
        {STAGES.map((label, i) => {
          const stage = i + 1;
          const cards = loans.filter(c => c.stage === stage);
          const mine = STAGE_OWNER[i] === role;
          return (
            <div key={label} className="flex-shrink-0" style={{ width: '260px' }}>
              <div
                className="rounded-t-xl px-4 py-3 flex items-center justify-between"
                style={{ backgroundColor: mine ? 'var(--brand-primary)' : 'var(--neutral-200)', color: mine ? 'white' : 'var(--neutral-700)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: mine ? 'rgba(255,255,255,0.22)' : 'white', fontSize: '11px', fontWeight: 700 }}>{stage}</span>
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>{label}</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, opacity: 0.8 }}>{cards.length}</span>
              </div>
              <div className="rounded-b-xl p-2 space-y-2 min-h-[120px]" style={{ backgroundColor: 'var(--neutral-100)', border: '1px solid var(--neutral-200)', borderTop: 'none' }}>
                {cards.length === 0 && (
                  <div className="text-center py-6" style={{ fontSize: '12px', color: 'var(--neutral-400)' }}>No loans</div>
                )}
                {cards.map(c => (
                  <button
                    key={c.id}
                    onClick={() => onNavigate(`loan-file::${c.id}`)}
                    className="w-full text-left bg-white rounded-lg p-3 border border-[var(--neutral-200)] clickable-card"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span style={{ fontSize: '12px', fontFamily: 'Roboto Mono', color: 'var(--brand-accent)', fontWeight: 500 }}>{c.id}</span>
                      <StatusBadge status={c.status} />
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral-900)' }}>{c.borrower}</div>
                    <div style={{ fontSize: '13px', fontFamily: 'Roboto Mono', color: 'var(--neutral-700)', marginTop: '2px' }}>{formatCurrency(c.requested)}</div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}
