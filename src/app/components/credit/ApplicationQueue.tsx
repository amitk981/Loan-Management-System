import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, ChevronRight, Clock, FileText, Plus, Search, Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { Shell } from '../layout/Shell';
import { StatusBadge } from '../shared/StatusBadge';
import { WorkbenchTabs } from '../shared/WorkbenchTabs';
import { EmptyTableState } from '../shared/TableStates';
import { creditIntakeTabs } from '../../data/roleNav';
import { AppModal } from '../shared/AppModal';
import { creditApplications } from '../../data/creditData';
import { formatCurrency } from '../../lib/format';

interface ApplicationQueueProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

// Aging cue against the SOP 2-day Credit TAT (audit DA-018), derived from the mock "submittedAgo".
function tatChip(submittedAgo: string): { label: string; color: string; bg: string } {
  if (submittedAgo.includes('h')) return { label: 'Day 1 of 2', color: 'var(--success-700)', bg: 'var(--success-50)' };
  const days = parseInt(submittedAgo, 10) || 1;
  if (days >= 2) return { label: `TAT breached · ${days}d`, color: 'var(--error-700)', bg: 'var(--error-50)' };
  return { label: `Day ${days} of 2`, color: 'var(--warning-700)', bg: 'var(--warning-50)' };
}

export function ApplicationQueue({ onNavigate, activePage }: ApplicationQueueProps) {
  const [search, setSearch] = useState('');
  // Brief simulated load so the prototype demonstrates a loading state (audit DA-012).
  const [loading, setLoading] = useState(true);
  useEffect(() => { const id = window.setTimeout(() => setLoading(false), 600); return () => window.clearTimeout(id); }, []);
  const [filter, setFilter] = useState<'All' | 'Today' | 'Incomplete' | 'Assigned to me'>('All');
  const [selectedId, setSelectedId] = useState(creditApplications[0].id);
  // On narrow screens the master/detail panes stack — this toggles which is on top.
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
  const [showNotice, setShowNotice] = useState(false);
  const [noticeSent, setNoticeSent] = useState(false);
  const [noticeLang, setNoticeLang] = useState<'English' | 'Marathi'>('English');
  // Reviewer can verify / request resubmission / accept a re-upload. We keep the
  // overrides locally (data is mocked) keyed by `${appId}::${docName}` so the
  // checklist, progress bar and "ready for appraisal" gate all react live.
  const [docOverrides, setDocOverrides] = useState<Record<string, string>>({});
  const [reviewDocName, setReviewDocName] = useState<string | null>(null);
  const selected = creditApplications.find(app => app.id === selectedId) || creditApplications[0];
  const docState = (docName: string, original: string) => docOverrides[`${selected.id}::${docName}`] ?? original;
  const setDoc = (docName: string, state: string) => setDocOverrides(prev => ({ ...prev, [`${selected.id}::${docName}`]: state }));
  // Documents with effective (override-aware) states for rendering and gating.
  const docs = selected.documents.map(doc => ({ ...doc, state: docState(doc.name, doc.state) }));
  const missingDocs = docs.filter(doc => doc.state === 'Missing');
  const completeDocs = docs.filter(doc => doc.state === 'Complete');
  const canAssign = docs.every(doc => doc.state === 'Complete');
  const kycPct = Math.round((completeDocs.length / docs.length) * 100);
  const reviewDoc = reviewDocName ? docs.find(d => d.name === reviewDocName) || null : null;

  const filtered = useMemo(() => creditApplications.filter(app => {
    const term = search.toLowerCase();
    const matchesSearch = !term || app.name.toLowerCase().includes(term) || app.id.toLowerCase().includes(term) || app.village.toLowerCase().includes(term);
    const matchesFilter = filter === 'All' || (filter === 'Today' && app.submittedAgo.includes('h')) || (filter === 'Incomplete' && app.status === 'Incomplete') || (filter === 'Assigned to me' && app.assignedToMe);
    return matchesSearch && matchesFilter;
  }), [filter, search]);

  const openApp = (id: string) => { setSelectedId(id); setMobileView('detail'); };

  // Derived intake KPIs for the at-a-glance stat strip.
  const totalCount = creditApplications.length;
  const incompleteCount = creditApplications.filter(a => a.status === 'Incomplete').length;
  const breachedCount = creditApplications.filter(a => !a.submittedAgo.includes('h') && (parseInt(a.submittedAgo, 10) || 0) >= 2).length;
  const totalRequested = creditApplications.reduce((sum, a) => sum + a.amount, 0);
  const initials = (selected.shortName || selected.name).split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Credit Assessment', 'New Applications']}
      pageTitle="New Applications"
      pageSubtitle="Intake and appraisal assignment"
      actions={
        <button onClick={() => onNavigate('credit-manual-entry')} className="px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}>
          <Plus size={15} /> <span className="hidden sm:inline">Add Manual</span><span className="sm:hidden">Add</span>
        </button>
      }
    >
      <WorkbenchTabs tabs={creditIntakeTabs} activeKey={activePage} onChange={onNavigate} accent="var(--brand-primary)" />
      {noticeSent && (
        <div className="mb-4 p-3 rounded-lg flex items-start gap-2" style={{ backgroundColor: 'var(--success-50)', border: '1px solid var(--success-200)', color: 'var(--success-700)', fontSize: '13px', fontWeight: 700 }}>
          <Check size={16} className="shrink-0 mt-0.5" />
          <span>Deficiency notice sent for {selected.id}. Status logged as Notified — awaiting resubmission.</span>
        </div>
      )}
      <div className="mb-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'In Intake', value: String(totalCount), hint: `${filtered.length} in view`, color: 'var(--brand-accent)', bg: 'var(--accent-blue-50)' },
          { label: 'Incomplete', value: String(incompleteCount), hint: 'awaiting docs', color: 'var(--warning-700)', bg: 'var(--warning-100)' },
          { label: 'TAT Breached', value: String(breachedCount), hint: '2-day Credit TAT', color: 'var(--error-700)', bg: 'var(--error-50)' },
          { label: 'Requested', value: formatCurrency(totalRequested), hint: 'total this view', color: 'var(--success-700)', bg: 'var(--success-50)' },
        ].map(kpi => (
          <div key={kpi.label} className="rounded-lg p-3 border flex flex-col" style={{ backgroundColor: 'white', borderColor: 'var(--neutral-250)' }}>
            <div className="flex items-center justify-between gap-2">
              <span style={{ fontSize: '11px', color: 'var(--neutral-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{kpi.label}</span>
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: kpi.color }} />
            </div>
            <span style={{ fontSize: '22px', color: 'var(--neutral-900)', fontWeight: 700, marginTop: '4px', fontFamily: 'Roboto Mono' }}>{kpi.value}</span>
            <span className="inline-flex w-fit mt-1.5 px-2 py-0.5 rounded-full" style={{ backgroundColor: kpi.bg, color: kpi.color, fontSize: '11px', fontWeight: 700 }}>{kpi.hint}</span>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg border border-[var(--neutral-250)] overflow-hidden">
        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:min-h-[680px]">
          {/* List pane — full width on mobile, hidden when a detail is open there */}
          <div className={`${mobileView === 'detail' ? 'hidden' : 'flex'} lg:flex flex-col lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[var(--neutral-250)]`}>
            <div className="p-4 border-b border-[var(--neutral-250)]" style={{ backgroundColor: 'var(--neutral-150)' }}>
              <div className="relative mb-3">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--neutral-500)' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name / ID / village" aria-label="Search applications" className="w-full pl-9 pr-8 rounded-md border border-[var(--neutral-300)] focus:border-[var(--brand-accent)] focus:outline-none" style={{ height: '38px', fontSize: '13px' }} />
                {search && (
                  <button onClick={() => setSearch('')} aria-label="Clear search" className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 hover:bg-[var(--neutral-200)]" style={{ color: 'var(--neutral-500)' }}><X size={14} /></button>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['All', 'Today', 'Incomplete', 'Assigned to me'] as const).map(item => (
                  <button key={item} onClick={() => setFilter(item)} aria-pressed={filter === item} className="px-3 py-1.5 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1" style={{ backgroundColor: filter === item ? 'var(--brand-primary)' : 'white', color: filter === item ? 'white' : 'var(--neutral-700)', border: '1px solid var(--neutral-250)', fontSize: '12px', fontWeight: 700 }}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="lg:max-h-[600px] overflow-y-auto flex-1">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-4 border-b border-[var(--neutral-250)]">
                    <div className="h-3 w-24 rounded-full animate-pulse mb-2.5" style={{ backgroundColor: 'var(--neutral-200)' }} />
                    <div className="h-3 w-40 rounded-full animate-pulse mb-2" style={{ backgroundColor: 'var(--neutral-200)' }} />
                    <div className="h-2.5 w-32 rounded-full animate-pulse" style={{ backgroundColor: 'var(--neutral-200)' }} />
                  </div>
                ))
              ) : filtered.length === 0 ? (
                <EmptyTableState title="No applications match" message="Try clearing the search or switching the filter to 'All'." />
              ) : (
                filtered.map(app => {
                  const tat = tatChip(app.submittedAgo);
                  const isActive = selected.id === app.id;
                  return (
                    <button key={app.id} onClick={() => openApp(app.id)} className="w-full p-4 text-left border-b border-[var(--neutral-250)] hover:bg-[var(--neutral-150)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2" style={{ backgroundColor: isActive ? 'var(--accent-blue-50)' : 'white', borderLeft: isActive ? '3px solid var(--brand-accent)' : '3px solid transparent' }}>
                      <div className="flex items-center justify-between gap-2">
                        <span style={{ fontSize: '13px', fontFamily: 'Roboto Mono', color: 'var(--brand-accent)', fontWeight: 700 }}>{app.id}</span>
                        <StatusBadge status={app.status} />
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--neutral-900)', fontWeight: 700, marginTop: '6px' }}>{app.shortName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '3px' }}>{app.village} · {formatCurrency(app.amount)} req.</div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: tat.bg, color: tat.color, fontSize: '11px', fontWeight: 700 }}><Clock size={10} /> {tat.label}</span>
                        <span style={{ fontSize: '12px', color: app.status === 'Overdue' ? 'var(--error-700)' : 'var(--neutral-500)', fontWeight: 700 }}>{app.blocker} · {app.submittedAgo}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Detail pane — full width on mobile, shown when a row is opened there */}
          <div className={`${mobileView === 'list' ? 'hidden' : 'block'} lg:block lg:col-span-8 overflow-y-auto`}>
            <div className="p-4 sm:p-5">
              <button onClick={() => setMobileView('list')} className="lg:hidden inline-flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--neutral-150)', border: '1px solid var(--neutral-250)', color: 'var(--neutral-700)', fontSize: '13px', fontWeight: 700 }}>
                <ArrowLeft size={15} /> Back to list
              </button>

              <div className="rounded-lg p-4 mb-5" style={{ background: 'linear-gradient(180deg, var(--neutral-150), white)', border: '1px solid var(--neutral-250)' }}>
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '15px', fontWeight: 700 }}>{initials}</div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--neutral-500)', fontWeight: 700, letterSpacing: '0.04em' }}>APPLICATION · {selected.id}</div>
                      <div style={{ fontSize: '18px', color: 'var(--neutral-900)', fontWeight: 700 }}>{selected.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '1px' }}>{selected.village} · {selected.crop} · {formatCurrency(selected.amount)} requested</div>
                    </div>
                  </div>
                  <StatusBadge status={selected.status === 'Incomplete' ? `Incomplete — ${selected.blocker}` : selected.status} size="md" />
                </div>
              </div>

              <Section title="Applicant Details">
                <InfoGrid items={[
                  ['Name', selected.name],
                  ['Folio No.', selected.folio],
                  ['Shares Held', `${selected.shares} shares`],
                  ['Member Since', selected.memberSince],
                  ['Village', selected.village],
                  ['Crop', selected.crop],
                  ['Mobile', selected.mobile],
                ]} />
              </Section>

              <Section title="Loan Request">
                <InfoGrid items={[
                  ['Amount Requested', formatCurrency(selected.amount)],
                  ['Purpose', selected.purpose],
                  ['Tenure Requested', selected.tenure],
                  ['Nominee', selected.nominee],
                ]} />
              </Section>

              <div className="mb-5">
                <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
                  <h3 style={{ fontSize: '14px', color: 'var(--neutral-900)', fontWeight: 700 }}>KYC Document Checklist</h3>
                  <span style={{ fontSize: '12px', color: canAssign ? 'var(--success-700)' : 'var(--neutral-500)', fontWeight: 700 }}>{completeDocs.length} of {selected.documents.length} verified</span>
                </div>
                <div className="h-1.5 w-full rounded-full mb-3 overflow-hidden" style={{ backgroundColor: 'var(--neutral-200)' }} role="progressbar" aria-valuenow={kycPct} aria-valuemin={0} aria-valuemax={100} aria-label="KYC completion">
                  <div className="h-full rounded-full transition-all" style={{ width: `${kycPct}%`, backgroundColor: canAssign ? 'var(--success-500)' : 'var(--warning-500)' }} />
                </div>
                <div className="space-y-2">
                  {docs.map(doc => {
                    const stateColor = doc.state === 'Complete' ? 'var(--success-600)' : doc.state === 'Missing' ? 'var(--error-700)' : 'var(--warning-500)';
                    const icon = doc.state === 'Complete' ? <Check size={15} /> : doc.state === 'Missing' ? <X size={15} /> : <Clock size={15} />;
                    const cta = doc.state === 'Complete' ? 'Review' : doc.state === 'Missing' ? 'Upload' : 'Verify';
                    return (
                      <button key={doc.name} onClick={() => setReviewDocName(doc.name)} className="w-full flex items-center gap-3 p-3 rounded-lg text-left action-surface transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2" style={{ backgroundColor: `${stateColor}10`, border: `1px solid ${stateColor}22` }}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${stateColor}18`, color: stateColor }}>{icon}</div>
                        <div className="flex-1 min-w-0">
                          <div style={{ fontSize: '13px', color: 'var(--neutral-900)', fontWeight: 700 }}>{doc.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>{doc.detail}</div>
                        </div>
                        <StatusBadge status={doc.state} />
                        <span className="inline-flex items-center gap-0.5 shrink-0" style={{ fontSize: '12px', color: 'var(--brand-accent)', fontWeight: 700 }}>{cta} <ChevronRight size={13} /></span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 border-t border-[var(--neutral-250)] pt-5 sticky bottom-0 bg-white">
                <button onClick={() => setShowNotice(true)} disabled={missingDocs.length === 0} className="px-4 py-2.5 rounded-lg font-medium transition-colors disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ backgroundColor: missingDocs.length ? 'var(--warning-100)' : 'var(--neutral-175)', color: missingDocs.length ? 'var(--warning-700)' : 'var(--gray-400b)', fontSize: '13px' }}>Send Deficiency Notice</button>
                <button onClick={() => toast.success(`${selected.id} marked complete — ready for appraisal`)} disabled={!canAssign} className="px-4 py-2.5 rounded-lg font-medium transition-colors disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ backgroundColor: canAssign ? 'var(--accent-blue-50)' : 'var(--neutral-175)', color: canAssign ? 'var(--brand-accent)' : 'var(--gray-400b)', fontSize: '13px' }}>Mark Complete</button>
                <button onClick={() => onNavigate('credit-review')} disabled={!canAssign} title={canAssign ? undefined : 'Resolve all KYC items before assigning to appraisal'} className="sm:ml-auto px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-1 transition-colors disabled:cursor-not-allowed hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ backgroundColor: canAssign ? 'var(--brand-primary)' : 'var(--gray-400b)', color: 'white', fontSize: '13px' }}>Assign to Appraisal <ChevronRight size={15} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showNotice && (
        <AppModal
          title="Send Deficiency Notice"
          subtitle={`${selected.id} · ${missingDocs.map(doc => doc.name).join(', ') || 'No missing mandatory items'}`}
          icon={<Send size={18} />}
          onClose={() => setShowNotice(false)}
          footer={<><button onClick={() => setShowNotice(false)} className="px-4 py-2.5 rounded-lg border border-[var(--neutral-250)]" style={{ fontSize: '14px' }}>Cancel</button><button onClick={() => { setNoticeSent(true); setShowNotice(false); toast.success(`Deficiency notice sent to ${selected.shortName}`); }} className="px-4 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}>Preview → Send</button></>}
        >
          <div className="space-y-4">
            <div className="flex gap-2">
              {(['English', 'Marathi'] as const).map(lang => <button key={lang} onClick={() => setNoticeLang(lang)} aria-pressed={noticeLang === lang} className="px-3 py-1.5 rounded-full" style={{ backgroundColor: noticeLang === lang ? 'var(--brand-primary)' : 'var(--neutral-175)', color: noticeLang === lang ? 'white' : 'var(--neutral-700)', fontSize: '12px', fontWeight: 700 }}>{lang}</button>)}
            </div>
            <textarea rows={7} className="w-full p-3 rounded-lg border border-[var(--neutral-300)] focus:border-[var(--brand-accent)] focus:outline-none" style={{ fontSize: '13px', color: 'var(--neutral-900)', lineHeight: '20px' }} defaultValue={noticeLang === 'English' ? `Dear ${selected.shortName}, your loan application ${selected.id} is missing: ${missingDocs.map(doc => doc.name).join(', ')}. Please upload the document to continue processing.` : `${selected.shortName}, आपल्या ${selected.id} कर्ज अर्जासाठी ${missingDocs.map(doc => doc.name).join(', ')} आवश्यक आहे. कृपया कागदपत्र अपलोड करा.`} />
          </div>
        </AppModal>
      )}

      {reviewDoc && (
        <AppModal
          title={`Review Document — ${reviewDoc.name}`}
          subtitle={`${selected.id} · ${selected.shortName}`}
          icon={<FileText size={18} />}
          onClose={() => setReviewDocName(null)}
          footer={
            reviewDoc.state === 'Complete' ? (
              <>
                <button onClick={() => { setDoc(reviewDoc.name, 'Missing'); setReviewDocName(null); toast.message(`${reviewDoc.name} marked for resubmission`); }} className="px-4 py-2.5 rounded-lg border border-[var(--neutral-250)]" style={{ fontSize: '14px', color: 'var(--error-700)' }}>Request Resubmission</button>
                <button onClick={() => setReviewDocName(null)} className="px-4 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}>Done</button>
              </>
            ) : (
              <>
                <button onClick={() => { setShowNotice(true); setReviewDocName(null); }} className="px-4 py-2.5 rounded-lg border border-[var(--neutral-250)]" style={{ fontSize: '14px' }}>Send Notice to Farmer</button>
                <button onClick={() => { setDoc(reviewDoc.name, 'Complete'); setReviewDocName(null); toast.success(`${reviewDoc.name} verified`); }} className="px-4 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--success-600)', color: 'white', fontSize: '14px' }}>Accept &amp; Verify</button>
              </>
            )
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span style={{ fontSize: '13px', color: 'var(--neutral-500)' }}>{reviewDoc.detail}</span>
              <StatusBadge status={reviewDoc.state} />
            </div>
            {/* Mock document preview surface */}
            <div className="rounded-lg border border-[var(--neutral-250)] flex flex-col items-center justify-center text-center" style={{ height: '220px', backgroundColor: 'var(--neutral-150)' }}>
              {reviewDoc.state === 'Missing' ? (
                <>
                  <X size={28} style={{ color: 'var(--error-700)' }} />
                  <div style={{ fontSize: '13px', color: 'var(--neutral-700)', fontWeight: 700, marginTop: '8px' }}>No file on record</div>
                  <div style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '2px' }}>Upload a scan/photo or request it from the farmer.</div>
                </>
              ) : (
                <>
                  <FileText size={28} style={{ color: 'var(--brand-accent)' }} />
                  <div style={{ fontSize: '13px', color: 'var(--neutral-700)', fontWeight: 700, marginTop: '8px' }}>{reviewDoc.name.replace(/\s+/g, '_').toLowerCase()}.pdf</div>
                  <div style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '2px' }}>{reviewDoc.detail}</div>
                  <button onClick={() => toast.message('Opening document viewer…')} className="mt-3 px-3 py-1.5 rounded-md" style={{ backgroundColor: 'var(--accent-blue-50)', color: 'var(--brand-accent)', fontSize: '12px', fontWeight: 700 }}>Open full view</button>
                </>
              )}
            </div>
            {/* Upload / resubmit control — simulated for the prototype */}
            <label className="flex items-center justify-between gap-3 p-3 rounded-lg border border-dashed border-[var(--neutral-300)] cursor-pointer" style={{ backgroundColor: 'white' }}>
              <span className="flex items-center gap-2" style={{ fontSize: '13px', color: 'var(--neutral-700)', fontWeight: 700 }}>
                <Plus size={15} /> {reviewDoc.state === 'Missing' ? 'Upload document' : 'Replace / re-upload'}
              </span>
              <input type="file" className="hidden" onChange={() => { setDoc(reviewDoc.name, 'Pending Review'); toast.success(`${reviewDoc.name} uploaded — ready to verify`); }} />
              <span style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>PDF / JPG · max 5 MB</span>
            </label>
          </div>
        </AppModal>
      )}
    </Shell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 style={{ fontSize: '14px', color: 'var(--neutral-900)', fontWeight: 700, marginBottom: '10px' }}>{title}</h3>
      <div className="rounded-lg border border-[var(--neutral-250)] overflow-hidden">{children}</div>
    </div>
  );
}

function InfoGrid({ items }: { items: string[][] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="grid grid-cols-2 border-b sm:border-r border-[var(--neutral-250)] last:border-b-0">
          <div className="p-3" style={{ backgroundColor: 'var(--neutral-150)', fontSize: '12px', color: 'var(--neutral-500)', fontWeight: 700 }}>{label}</div>
          <div className="p-3" style={{ fontSize: '13px', color: 'var(--neutral-900)', fontWeight: 700, fontFamily: label.includes('Amount') || label.includes('Folio') || label.includes('Mobile') ? 'Roboto Mono' : 'inherit' }}>{value}</div>
        </div>
      ))}
    </div>
  );
}
