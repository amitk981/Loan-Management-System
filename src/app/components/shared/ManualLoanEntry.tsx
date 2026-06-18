import { useMemo, useState } from 'react';
import { Search, UserPlus, MapPin, ArrowRight, X, Users } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { RoleAccessNote, HandoffCard } from './CrossRoleComponents';
import { LoanApplicationForm, type Applicant } from '../farmer/LoanApplicationForm';
import { getLoans } from '../../data/loanStore';
import { farmerProfile } from '../../data/farmerData';

interface ManualLoanEntryProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

interface Member extends Applicant {
  id: string;
}

// Build a member directory from the shared loan register (unique borrowers) plus the demo
// member. The Credit Manager searches this before filing an offline application, so the
// manual entry is attached to a real member rather than re-keyed from scratch.
function useMemberDirectory(): Member[] {
  return useMemo(() => {
    const byFolio = new Map<string, Member>();
    const add = (m: Member) => { if (m.folioNo && !byFolio.has(m.folioNo)) byFolio.set(m.folioNo, m); };

    add({
      id: 'M-' + farmerProfile.folioNo,
      fullName: farmerProfile.fullName,
      mobile: farmerProfile.mobile,
      folioNo: farmerProfile.folioNo,
      village: farmerProfile.village,
      taluka: farmerProfile.taluka,
      district: farmerProfile.district,
      state: farmerProfile.state,
      shares: farmerProfile.shares,
      loanValuePerShare: farmerProfile.loanValuePerShare,
      landAcres: farmerProfile.landAcres,
      scaleOfFinance: farmerProfile.scaleOfFinance,
    });

    getLoans().forEach((l, idx) => {
      const [village, district] = (l.village || '').split(',').map(s => s.trim());
      add({
        id: 'M-' + (l.folio || l.id),
        fullName: l.borrower,
        mobile: `+91 9${String(80000000 + idx * 13577).slice(0, 9)}`,
        folioNo: l.folio || `SH-${1000 + idx}`,
        village: village || l.village || '—',
        taluka: village || '—',
        district: district || 'Nashik',
        state: 'Maharashtra',
        shares: l.shares,
        loanValuePerShare: l.valuationPerShare,
        landAcres: l.landAcres,
        scaleOfFinance: l.scaleOfFinance,
      });
    });

    return [...byFolio.values()].sort((a, b) => a.fullName.localeCompare(b.fullName));
  }, []);
}

function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

export function ManualLoanEntry({ onNavigate, activePage }: ManualLoanEntryProps) {
  const members = useMemberDirectory();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Member | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(m =>
      m.fullName.toLowerCase().includes(q) ||
      m.folioNo.toLowerCase().includes(q) ||
      m.village.toLowerCase().includes(q) ||
      m.mobile.toLowerCase().includes(q),
    );
  }, [members, query]);

  // Once a member is chosen (or a fresh non-member entry started), hand off to the SAME
  // 5-step wizard the farmer uses, prefilled and in editable 'credit' mode.
  if (selected) {
    return (
      <LoanApplicationForm
        onNavigate={onNavigate}
        activePage={activePage}
        mode="credit"
        applicant={selected}
        breadcrumbs={['Cross-Role Integration', 'Manual Loan Application Entry', selected.fullName]}
        pageTitle="Manual Loan Application Entry"
        pageSubtitle={`Filing on behalf of ${selected.fullName}`}
        onFirstStepBack={() => setSelected(null)}
        firstStepBackLabel="Back to Member Search"
        topSlot={
          <div className="space-y-4">
            <RoleAccessNote />
            <div className="bg-white rounded-lg p-4 border border-[var(--neutral-200)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center rounded-full" style={{ width: 40, height: 40, backgroundColor: 'var(--brand-light)', color: 'var(--brand-primary)', fontSize: 14, fontWeight: 700 }}>{initials(selected.fullName)}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--neutral-900)' }}>{selected.fullName}</div>
                  <div style={{ fontSize: 12, color: 'var(--neutral-500)' }}>
                    <span style={{ fontFamily: 'Roboto Mono' }}>{selected.folioNo}</span> · {selected.village}, {selected.district} · {selected.mobile}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg" style={{ fontSize: 13, fontWeight: 500, color: 'var(--brand-primary)', border: '1px solid var(--neutral-300)' }}>
                <X size={14} /> Change member
              </button>
            </div>
          </div>
        }
      />
    );
  }

  const blankApplicant: Member = {
    id: 'M-NEW', fullName: '', mobile: '', folioNo: '', village: '', taluka: '', district: 'Nashik', state: 'Maharashtra',
    shares: farmerProfile.shares, loanValuePerShare: farmerProfile.loanValuePerShare, landAcres: farmerProfile.landAcres, scaleOfFinance: farmerProfile.scaleOfFinance,
  };

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Cross-Role Integration', 'Manual Loan Application Entry']}
      pageTitle="Manual Loan Application Entry"
      pageSubtitle="Find the member, then file their offline application"
    >
      <div className="mb-5"><RoleAccessNote /></div>

      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3">
          <div className="bg-white rounded-lg p-5 border border-[var(--neutral-200)]">
            <div className="flex items-center gap-2 mb-1">
              <Users size={18} style={{ color: 'var(--brand-primary)' }} />
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Find the member</h3>
            </div>
            <p style={{ fontSize: 13, color: 'var(--neutral-500)', marginBottom: 16 }}>Search by name, folio, village, or mobile. The offline application is attached to this member.</p>

            <div className="relative mb-4">
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoFocus
                placeholder="Search members…"
                className="w-full rounded-lg border border-[var(--neutral-300)] pl-9 pr-3 focus:outline-none focus:border-[var(--brand-primary)]"
                style={{ height: 42, fontSize: 14 }}
                aria-label="Search members"
              />
            </div>

            <div className="space-y-2" style={{ maxHeight: 460, overflowY: 'auto' }}>
              {results.length === 0 && (
                <div className="text-center py-10 px-4" style={{ fontSize: 13, color: 'var(--neutral-500)' }}>
                  No member matches “{query}”. Use “Create new member entry” to file for a member not yet in the register.
                </div>
              )}
              {results.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelected(m)}
                  className="w-full text-left rounded-lg border border-[var(--neutral-200)] p-3 flex items-center justify-between hover:border-[var(--brand-primary)] transition-colors clickable-row"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex-shrink-0 flex items-center justify-center rounded-full" style={{ width: 38, height: 38, backgroundColor: 'var(--brand-light)', color: 'var(--brand-primary)', fontSize: 13, fontWeight: 700 }}>{initials(m.fullName)}</span>
                    <div className="min-w-0">
                      <div className="truncate" style={{ fontSize: 14, fontWeight: 700, color: 'var(--neutral-900)' }}>{m.fullName}</div>
                      <div className="flex items-center gap-2 truncate" style={{ fontSize: 12, color: 'var(--neutral-500)' }}>
                        <span style={{ fontFamily: 'Roboto Mono' }}>{m.folioNo}</span>
                        <span className="flex items-center gap-1"><MapPin size={11} /> {m.village}, {m.district}</span>
                      </div>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 flex-shrink-0" style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-primary)' }}>
                    Select <ArrowRight size={14} />
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setSelected(blankApplicant)}
              className="w-full mt-4 py-3 rounded-lg border-2 border-dashed border-[var(--neutral-300)] flex items-center justify-center gap-2 hover:border-[var(--brand-primary)] transition-colors"
              style={{ fontSize: 13, fontWeight: 500, color: 'var(--neutral-700)' }}
            >
              <UserPlus size={16} /> Create new member entry
            </button>
          </div>
        </div>

        <div className="col-span-2 space-y-4">
          <HandoffCard title="Offline Application Handoff" from="Credit Officer" to="Credit Inbox">
            Physical office applications must enter the same digital pipeline as farmer-submitted applications. Search the member first so the file is keyed to the right folio.
          </HandoffCard>
          <div className="bg-white rounded-lg p-5 border border-[var(--neutral-200)]">
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>How manual entry works</h4>
            <div className="space-y-3">
              {[
                ['1', 'Find the member', 'Search and select the existing member, or create a new entry.'],
                ['2', 'Complete the 5-step form', 'The same application wizard the farmer fills — prefilled and editable.'],
                ['3', 'Create the application', 'It enters the pipeline at Stage 1, identical to a self-submitted application.'],
              ].map(([n, t, d]) => (
                <div key={n} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: 11, fontWeight: 700 }}>{n}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--neutral-900)' }}>{t}</div>
                    <div style={{ fontSize: 12, color: 'var(--neutral-500)', lineHeight: '18px' }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
