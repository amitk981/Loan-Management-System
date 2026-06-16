import { Shell } from '../layout/Shell';
import { StatusBadge } from './StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { STAGES } from '../../lib/loanState';
import { formatCurrency } from '../../lib/format';

// The Pipeline board: one shared view of every loan grouped by the 6 SOP stages.
// The loan (not the menu) is the object; clicking a card opens the shared Loan File.
// Each role's owned stage is highlighted so they see "what's mine" at a glance.

interface PipelineProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

// Which role owns each stage column (for the highlight).
const STAGE_OWNER = ['farmer', 'credit', 'sanction', 'compliance', 'treasury', 'credit'];

interface Card { id: string; borrower: string; amount: number; status: string; stage: number }

const PIPELINE: Card[] = [
  { id: 'LO00000091', borrower: 'Priya Shinde', amount: 60000, status: 'Incomplete', stage: 1 },
  { id: 'LO00000092', borrower: 'Sunil Pawar', amount: 120000, status: 'Application Received', stage: 1 },
  { id: 'LO00000089', borrower: 'Rajesh Patil', amount: 95000, status: 'Under Assessment', stage: 2 },
  { id: 'LO00000090', borrower: 'Ganesh Thorat FPC', amount: 480000, status: 'Under Assessment', stage: 2 },
  { id: 'LO00000086', borrower: 'Narayan FPC', amount: 540000, status: 'Awaiting SC Approval', stage: 3 },
  { id: 'LO00000085', borrower: 'Meena Joshi', amount: 180000, status: 'Under SC Review', stage: 3 },
  { id: 'LO00000084', borrower: 'Anil Deshmukh', amount: 220000, status: 'Docs Preparation', stage: 4 },
  { id: 'LO00000083', borrower: 'Kavita Rane', amount: 300000, status: 'Awaiting Signature', stage: 4 },
  { id: 'LO00000082', borrower: 'Suresh More', amount: 150000, status: 'Pending Initiation', stage: 5 },
  { id: 'LO00000018', borrower: 'Narayan Patil', amount: 120000, status: 'Overdue', stage: 6 },
  { id: 'LO00000001', borrower: 'Ramesh Jadhav', amount: 60000, status: 'Active', stage: 6 },
];

export function Pipeline({ onNavigate, activePage }: PipelineProps) {
  const { user } = useAuth();
  const role = user?.role || 'credit';

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
          const cards = PIPELINE.filter(c => c.stage === stage);
          const mine = STAGE_OWNER[i] === role;
          return (
            <div key={label} className="flex-shrink-0" style={{ width: '260px' }}>
              <div
                className="rounded-t-xl px-4 py-3 flex items-center justify-between"
                style={{ backgroundColor: mine ? 'var(--brand-primary)' : 'var(--neutral-200)', color: mine ? 'white' : 'var(--neutral-700)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: mine ? 'rgba(255,255,255,0.22)' : '#FFFFFF', fontSize: '11px', fontWeight: 700 }}>{stage}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{label}</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, opacity: 0.8 }}>{cards.length}</span>
              </div>
              <div className="rounded-b-xl p-2 space-y-2 min-h-[120px]" style={{ backgroundColor: 'var(--neutral-100)', border: '1px solid #EDEEF0', borderTop: 'none' }}>
                {cards.length === 0 && (
                  <div className="text-center py-6" style={{ fontSize: '12px', color: 'var(--neutral-400)' }}>No loans</div>
                )}
                {cards.map(c => (
                  <button
                    key={c.id}
                    onClick={() => onNavigate('loan-file')}
                    className="w-full text-left bg-white rounded-lg p-3 border border-[#EDEEF0] clickable-card"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span style={{ fontSize: '12px', fontFamily: 'Roboto Mono', color: 'var(--brand-accent)', fontWeight: 600 }}>{c.id}</span>
                      <StatusBadge status={c.status} />
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--neutral-900)' }}>{c.borrower}</div>
                    <div style={{ fontSize: '13px', fontFamily: 'Roboto Mono', color: 'var(--neutral-700)', marginTop: '2px' }}>{formatCurrency(c.amount)}</div>
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
