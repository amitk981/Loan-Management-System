import { useMemo, useState } from 'react';
import { Search, AlertTriangle, ArrowRight, Layers, MapPin, Wallet } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from './StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { STAGES } from '../../lib/loanState';
import { formatCurrency } from '../../lib/format';
import { useLoans, type Loan, eligibleLimit, isOverLimit, authorityFor } from '../../data/loanStore';

// The Pipeline board: one shared view of every loan grouped by the 6 SOP stages.
// The loan (not the menu) is the object; clicking a card opens THAT loan's file (carries the id).
// Cards read the live loan store, so sanction decisions taken in the Loan File move cards here.
//
// This board is role-aware: each role owns one or more of the 6 stages, and the columns/cards
// surface the signals + the next action that THAT stakeholder cares about. The contextual action
// deep-links straight into the relevant Loan File tab (?tab=), so the board is a worklist, not
// just a picture.

interface PipelineProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

// Per-stage metadata: who owns it, the Loan File tab their work lives on, and the verb for
// the card's primary action when the viewer owns that stage.
const STAGE_META: { owner: string; tab: string; action: string; short: string }[] = [
  { owner: 'farmer', tab: 'application', action: 'Track application', short: 'Submitted' },
  { owner: 'credit', tab: 'appraisal', action: 'Open appraisal', short: 'Assessing' },
  { owner: 'sanction', tab: 'sanction', action: 'Review & decide', short: 'Deciding' },
  { owner: 'compliance', tab: 'documents', action: 'Prepare documents', short: 'Documenting' },
  { owner: 'treasury', tab: 'disbursement', action: 'Initiate disbursement', short: 'Disbursing' },
  { owner: 'credit', tab: 'repayment', action: 'Monitor repayment', short: 'Monitoring' },
];

const ROLE_LABEL: Record<string, string> = {
  farmer: 'Borrower', credit: 'Credit Team', sanction: 'Sanction Committee',
  compliance: 'Compliance', treasury: 'Treasury', admin: 'Admin',
};

function needsAttention(loan: Loan): boolean {
  return isOverLimit(loan) || loan.risk === 'High' || loan.status === 'Overdue' || loan.status === 'Defaulted';
}

export function Pipeline({ onNavigate, activePage }: PipelineProps) {
  const { user } = useAuth();
  const role = user?.role || 'credit';
  const loans = useLoans();
  const [query, setQuery] = useState('');
  const [mineOnly, setMineOnly] = useState(false);

  // Stages this role owns (credit owns 2 — Assessment + Monitoring).
  const ownedStages = useMemo(
    () => STAGE_META.map((m, i) => (m.owner === role ? i + 1 : 0)).filter(Boolean),
    [role],
  );
  const ownsAnyStage = ownedStages.length > 0;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return loans.filter(l =>
      !q || l.id.toLowerCase().includes(q) || l.borrower.toLowerCase().includes(q) || (l.village || '').toLowerCase().includes(q),
    );
  }, [loans, query]);

  // KPI strip.
  const totalValue = filtered.reduce((s, l) => s + l.requested, 0);
  const myQueue = filtered.filter(l => ownedStages.includes(l.stage));
  const attention = filtered.filter(needsAttention);

  const visibleStages = STAGES.map((_, i) => i + 1).filter(s => !mineOnly || ownedStages.includes(s));

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Pipeline']}
      pageTitle="Loan Pipeline"
      pageSubtitle={`Every loan across the six SOP stages — ${ROLE_LABEL[role] || role} view`}
    >
      {/* KPI strip — the numbers each stakeholder opens the board to check */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <Kpi label="In pipeline" value={String(filtered.length)} sub={formatCurrency(totalValue)} icon={<Layers size={16} />} />
        <Kpi
          label={ownsAnyStage ? 'In my queue' : 'Awaiting action'}
          value={String(myQueue.length)}
          sub={ownsAnyStage ? `Stage ${ownedStages.join(' & ')} · ${ROLE_LABEL[role]}` : 'No stage owned by this role'}
          icon={<ArrowRight size={16} />}
          accent={myQueue.length > 0}
        />
        <Kpi label="Needs attention" value={String(attention.length)} sub="High risk · over-limit · overdue" icon={<AlertTriangle size={16} />} warn={attention.length > 0} />
        <Kpi label="Disbursed value" value={formatCurrency(filtered.filter(l => l.stage >= 5).reduce((s, l) => s + l.requested, 0))} sub={`${filtered.filter(l => l.stage >= 5).length} loans live`} icon={<Wallet size={16} />} />
      </div>

      {/* Toolbar — search + focus-my-queue */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by loan ID, borrower or village…"
            className="w-full rounded-lg border border-[var(--neutral-300)] pl-9 pr-3"
            style={{ height: '38px', fontSize: '13px' }}
            aria-label="Search the pipeline"
          />
        </div>
        {ownsAnyStage && (
          <button
            onClick={() => setMineOnly(v => !v)}
            aria-pressed={mineOnly}
            className="rounded-lg px-3 flex items-center gap-2"
            style={{
              height: '38px', fontSize: '13px', fontWeight: 500,
              backgroundColor: mineOnly ? 'var(--brand-primary)' : 'white',
              color: mineOnly ? 'white' : 'var(--neutral-700)',
              border: `1px solid ${mineOnly ? 'var(--brand-primary)' : 'var(--neutral-300)'}`,
            }}
          >
            <ArrowRight size={14} /> My queue only
          </button>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin' }}>
        {visibleStages.map(stage => {
          const i = stage - 1;
          const label = STAGES[i];
          const meta = STAGE_META[i];
          const cards = filtered.filter(c => c.stage === stage);
          const colValue = cards.reduce((s, c) => s + c.requested, 0);
          const mine = meta.owner === role;
          return (
            <div key={label} className="flex-shrink-0 flex flex-col" style={{ width: '296px' }}>
              {/* Column header — a thin owner-coloured top rule reads the stage without a heavy fill */}
              <div
                className="rounded-t-xl px-4 pt-3 pb-2.5 bg-white"
                style={{ borderTop: `3px solid ${mine ? 'var(--brand-primary)' : 'var(--neutral-300)'}`, border: `1px solid ${mine ? 'var(--brand-primary)' : 'var(--neutral-200)'}`, borderBottom: 'none' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: mine ? 'var(--brand-primary)' : 'var(--neutral-200)', color: mine ? 'white' : 'var(--neutral-700)', fontSize: '12px', fontWeight: 700 }}>{stage}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--neutral-900)' }}>{label}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full" style={{ fontSize: '12px', fontWeight: 700, backgroundColor: mine ? 'var(--brand-light)' : 'var(--neutral-100)', color: mine ? 'var(--brand-primary)' : 'var(--neutral-700)' }}>{cards.length}</span>
                </div>
                <div className="flex items-center justify-between mt-2" style={{ fontSize: '11px', color: 'var(--neutral-500)' }}>
                  <span className="flex items-center gap-1" style={{ fontWeight: 500 }}>
                    {mine && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--brand-primary)' }} />}
                    {mine ? 'Your stage' : ROLE_LABEL[meta.owner]}
                  </span>
                  <span style={{ fontFamily: 'Roboto Mono' }}>{formatCurrency(colValue)}</span>
                </div>
              </div>

              {/* Column body */}
              <div className="rounded-b-xl p-2 space-y-2 flex-1 min-h-[140px]" style={{ backgroundColor: mine ? 'var(--brand-light)' : 'var(--neutral-100)', border: `1px solid ${mine ? 'var(--brand-primary)' : 'var(--neutral-200)'}`, borderTop: 'none' }}>
                {cards.length === 0 && (
                  <div className="text-center py-8 px-3" style={{ fontSize: '12px', color: 'var(--neutral-400)', lineHeight: '18px' }}>
                    {query ? 'No loans match your search' : `No loans in ${meta.short.toLowerCase()}`}
                  </div>
                )}
                {cards.map(c => (
                  <PipelineCard key={c.id} loan={c} stage={stage} mine={mine} action={meta.action} tab={meta.tab} onNavigate={onNavigate} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}

function Kpi({ label, value, sub, icon, accent, warn }: { label: string; value: string; sub: string; icon: React.ReactNode; accent?: boolean; warn?: boolean }) {
  const ring = warn ? 'var(--error-500)' : accent ? 'var(--brand-primary)' : 'var(--neutral-200)';
  const tint = warn ? 'var(--error-500)' : accent ? 'var(--brand-primary)' : 'var(--neutral-500)';
  const chipBg = warn ? 'var(--error-100)' : accent ? 'var(--brand-light)' : 'var(--neutral-100)';
  return (
    <div className="bg-white rounded-xl p-4 border" style={{ borderColor: ring }}>
      <div className="flex items-center gap-2.5">
        <span className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: '32px', height: '32px', backgroundColor: chipBg, color: tint }}>{icon}</span>
        <span style={{ fontSize: '11px', color: 'var(--neutral-500)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--neutral-900)', marginTop: '8px', lineHeight: '28px' }}>{value}</div>
      <div style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '2px' }}>{sub}</div>
    </div>
  );
}

function Chip({ tone, children }: { tone: 'error' | 'warning' | 'special' | 'neutral'; children: React.ReactNode }) {
  const map = {
    error: { bg: 'var(--error-100)', fg: 'var(--error-900)' },
    warning: { bg: 'var(--warning-100)', fg: 'var(--warning-700)' },
    special: { bg: 'var(--purple-100)', fg: 'var(--accent-sanction)' },
    neutral: { bg: 'var(--neutral-200)', fg: 'var(--neutral-700)' },
  }[tone];
  return <span className="px-1.5 py-0.5 rounded" style={{ backgroundColor: map.bg, color: map.fg, fontSize: '10px', fontWeight: 700 }}>{children}</span>;
}

function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

// Stable, calm avatar tint derived from the borrower name (no new accents — neutral/brand family).
function avatarTint(name: string): { bg: string; fg: string } {
  const palette = [
    { bg: 'var(--brand-light)', fg: 'var(--brand-primary)' },
    { bg: 'var(--accent-sanction-100)', fg: 'var(--accent-sanction)' },
    { bg: 'var(--success-50)', fg: 'var(--success-700)' },
    { bg: 'var(--neutral-200)', fg: 'var(--neutral-700)' },
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

function PipelineCard({ loan, stage, mine, action, tab, onNavigate }: { loan: Loan; stage: number; mine: boolean; action: string; tab: string; onNavigate: (p: string) => void }) {
  const over = isOverLimit(loan);
  const authority = authorityFor(loan);
  const twoDir = authority.includes('2');
  const limit = eligibleLimit(loan);
  const util = limit > 0 ? Math.min(loan.requested / limit, 1.15) : 0;
  const utilColor = over ? 'var(--error-500)' : util > 0.85 ? 'var(--warning-500)' : 'var(--success-500)';
  const tint = avatarTint(loan.borrower);
  return (
    <div
      className="bg-white rounded-lg border clickable-card"
      style={{ borderColor: mine ? 'var(--brand-primary)' : 'var(--neutral-200)' }}
    >
      <button onClick={() => onNavigate(`loan-file::${loan.id}`)} className="w-full text-left p-3">
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontSize: '12px', fontFamily: 'Roboto Mono', color: 'var(--brand-accent)', fontWeight: 500 }}>{loan.id}</span>
          <StatusBadge status={loan.status} />
        </div>

        {/* Borrower identity row — avatar + name + category */}
        <div className="flex items-center gap-2.5">
          <span className="flex-shrink-0 flex items-center justify-center rounded-full" style={{ width: '34px', height: '34px', backgroundColor: tint.bg, color: tint.fg, fontSize: '12px', fontWeight: 700 }}>
            {initials(loan.borrower)}
          </span>
          <div className="min-w-0">
            <div className="truncate" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--neutral-900)' }}>{loan.borrower}</div>
            <div className="truncate" style={{ fontSize: '11px', color: 'var(--neutral-500)' }}>{loan.category}</div>
          </div>
        </div>

        {/* Amount + eligibility */}
        <div className="flex items-baseline justify-between mt-2.5">
          <span style={{ fontSize: '15px', fontFamily: 'Roboto Mono', fontWeight: 700, color: 'var(--neutral-900)' }}>{formatCurrency(loan.requested)}</span>
          <span style={{ fontSize: '11px', color: over ? 'var(--error-800)' : 'var(--neutral-500)' }}>
            limit {formatCurrency(limit)}
          </span>
        </div>

        {/* Utilisation bar — how much of the eligible limit this request consumes */}
        <div className="mt-1.5 rounded-full overflow-hidden" style={{ height: '5px', backgroundColor: 'var(--neutral-200)' }}>
          <div className="h-full rounded-full" style={{ width: `${Math.min(util, 1) * 100}%`, backgroundColor: utilColor }} />
        </div>

        {/* Mini lifecycle tracker — position across the 6 SOP stages at a glance */}
        <div className="flex items-center gap-1 mt-2.5" aria-label={`Stage ${stage} of 6`}>
          {STAGES.map((_, idx) => (
            <span
              key={idx}
              className="flex-1 rounded-full"
              style={{ height: '3px', backgroundColor: idx < stage ? 'var(--brand-primary)' : 'var(--neutral-200)' }}
            />
          ))}
        </div>

        {/* Signal chips — the risk/governance flags each stakeholder scans for */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
          {over && <Chip tone="error">Over limit</Chip>}
          {loan.risk === 'High' && <Chip tone="warning">High risk</Chip>}
          {stage === 3 && <Chip tone={twoDir ? 'special' : 'neutral'}>{authority}</Chip>}
          <span className="flex items-center gap-1" style={{ fontSize: '10px', color: 'var(--neutral-400)' }}>
            <MapPin size={10} /> {loan.village || '—'}
          </span>
        </div>
      </button>

      {/* Contextual action — only for the stakeholder who owns this stage; deep-links to their tab */}
      {mine && (
        <div className="px-3 pb-3">
          <button
            onClick={() => onNavigate(`loan-file::${loan.id}::${tab}`)}
            className="w-full py-1.5 rounded-md flex items-center justify-center gap-1.5"
            style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '12px', fontWeight: 700 }}
          >
            {action} <ArrowRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
