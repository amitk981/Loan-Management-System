import { useMemo, useState } from 'react';
import { Check, Clock, FileText, Plus, Search, Send, X } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from '../shared/StatusBadge';
import { WorkbenchTabs } from '../shared/WorkbenchTabs';
import { creditIntakeTabs } from '../../data/roleNav';
import { AppModal } from '../shared/AppModal';
import { creditApplications } from '../../data/creditData';
import { formatCurrency } from '../../lib/format';

interface ApplicationQueueProps {
  onNavigate: (page: string) => void;
  activePage: string;
}


export function ApplicationQueue({ onNavigate, activePage }: ApplicationQueueProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Today' | 'Incomplete' | 'Assigned to me'>('All');
  const [selectedId, setSelectedId] = useState(creditApplications[0].id);
  const [showNotice, setShowNotice] = useState(false);
  const [noticeSent, setNoticeSent] = useState(false);
  const [noticeLang, setNoticeLang] = useState<'English' | 'Marathi'>('English');
  const selected = creditApplications.find(app => app.id === selectedId) || creditApplications[0];
  const missingDocs = selected.documents.filter(doc => doc.state === 'Missing');
  const canAssign = selected.documents.every(doc => doc.state === 'Complete');

  const filtered = useMemo(() => creditApplications.filter(app => {
    const term = search.toLowerCase();
    const matchesSearch = !term || app.name.toLowerCase().includes(term) || app.id.toLowerCase().includes(term) || app.village.toLowerCase().includes(term);
    const matchesFilter = filter === 'All' || (filter === 'Today' && app.submittedAgo.includes('h')) || (filter === 'Incomplete' && app.status === 'Incomplete') || (filter === 'Assigned to me' && app.assignedToMe);
    return matchesSearch && matchesFilter;
  }), [filter, search]);

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Credit Assessment', 'New Applications']}
      pageTitle="New Applications"
      pageSubtitle="Intake and appraisal assignment"
      actions={
        <button onClick={() => onNavigate('credit-manual-entry')} className="px-4 py-2.5 rounded-lg font-semibold flex items-center gap-2" style={{ backgroundColor: '#1A3C2A', color: 'white', fontSize: '14px' }}>
          <Plus size={15} /> Add Manual
        </button>
      }
    >
      <WorkbenchTabs tabs={creditIntakeTabs} activeKey={activePage} onChange={onNavigate} accent="#1A3C2A" />
      {noticeSent && (
        <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534', fontSize: '13px', fontWeight: 700 }}>
          Deficiency notice sent for {selected.id}. Status logged as Notified — awaiting resubmission.
        </div>
      )}
      <div className="mb-4 p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: '#E0F2FE', border: '1px solid #BAE6FD', color: '#0E7490', fontSize: '13px', fontWeight: 800 }}>
        <span>{filtered.length} applications in view</span>
        <button onClick={() => onNavigate('credit-manual-entry')} className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#0891B2', color: 'white', fontSize: '12px' }}>Open Manual Entry</button>
      </div>

      <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
        <div className="grid grid-cols-12 min-h-[680px]">
          <div className="col-span-4 border-r border-[#E5E7EB]">
            <div className="p-4 border-b border-[#E5E7EB]" style={{ backgroundColor: '#FAFAF8' }}>
              <div className="relative mb-3">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name / ID / village" className="w-full pl-9 pr-3 rounded-md border border-[#D1D5DB]" style={{ height: '38px', fontSize: '13px' }} />
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['All', 'Today', 'Incomplete', 'Assigned to me'] as const).map(item => (
                  <button key={item} onClick={() => setFilter(item)} className="px-3 py-1.5 rounded-full" style={{ backgroundColor: filter === item ? '#1A3C2A' : 'white', color: filter === item ? 'white' : '#3D4450', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: 700 }}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="max-h-[548px] overflow-y-auto">
              {filtered.map(app => (
                <button key={app.id} onClick={() => setSelectedId(app.id)} className="w-full p-4 text-left border-b border-[#E5E7EB] hover:bg-[#FAFAF8]" style={{ backgroundColor: selected.id === app.id ? '#E8F1FA' : 'white' }}>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: '13px', fontFamily: 'Roboto Mono', color: '#1E88E5', fontWeight: 800 }}>{app.id}</span>
                    <StatusBadge status={app.status} />
                  </div>
                  <div style={{ fontSize: '14px', color: '#12151A', fontWeight: 800, marginTop: '6px' }}>{app.shortName}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '3px' }}>{app.village} · {formatCurrency(app.amount)} req.</div>
                  <div style={{ fontSize: '12px', color: app.status === 'Overdue' ? '#C62828' : '#6B7280', marginTop: '6px', fontWeight: 700 }}>{app.blocker} · {app.submittedAgo}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-8 p-5 overflow-y-auto">
            <div className="rounded-lg p-4 mb-5" style={{ backgroundColor: '#FAFAF8', border: '1px solid #E5E7EB' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 700 }}>APPLICATION</div>
                  <div style={{ fontSize: '22px', color: '#12151A', fontWeight: 700, fontFamily: 'Roboto Mono' }}>{selected.id}</div>
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

            <Section title="KYC Document Checklist">
              <div className="space-y-2">
                {selected.documents.map(doc => {
                  const stateColor = doc.state === 'Complete' ? '#2E7D32' : doc.state === 'Missing' ? '#C62828' : '#F59E0B';
                  const icon = doc.state === 'Complete' ? <Check size={15} /> : doc.state === 'Missing' ? <X size={15} /> : <Clock size={15} />;
                  return (
                    <button key={doc.name} onClick={() => doc.state === 'Missing' && setShowNotice(true)} className="w-full flex items-center gap-3 p-3 rounded-lg text-left action-surface" style={{ backgroundColor: `${stateColor}10`, border: `1px solid ${stateColor}22` }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: `${stateColor}18`, color: stateColor }}>{icon}</div>
                      <div className="flex-1">
                        <div style={{ fontSize: '13px', color: '#12151A', fontWeight: 800 }}>{doc.name}</div>
                        <div style={{ fontSize: '12px', color: '#6B7280' }}>{doc.detail}</div>
                      </div>
                      <StatusBadge status={doc.state} />
                      {doc.state === 'Missing' && <span style={{ fontSize: '12px', color: '#1E88E5', fontWeight: 800 }}>Request</span>}
                    </button>
                  );
                })}
              </div>
            </Section>

            <div className="flex gap-3 border-t border-[#E5E7EB] pt-5">
              <button onClick={() => setShowNotice(true)} disabled={missingDocs.length === 0} className="px-4 py-2.5 rounded-lg font-semibold" style={{ backgroundColor: missingDocs.length ? '#FEF3C7' : '#F3F4F6', color: missingDocs.length ? '#92400E' : '#9CA3AF', fontSize: '13px' }}>Send Deficiency Notice</button>
              <button disabled={!canAssign} className="px-4 py-2.5 rounded-lg font-semibold" style={{ backgroundColor: canAssign ? '#E8F1FA' : '#F3F4F6', color: canAssign ? '#1E88E5' : '#9CA3AF', fontSize: '13px' }}>Mark Complete</button>
              <button onClick={() => onNavigate('credit-review')} disabled={!canAssign} className="ml-auto px-4 py-2.5 rounded-lg font-semibold" style={{ backgroundColor: canAssign ? '#1A3C2A' : '#9CA3AF', color: 'white', fontSize: '13px' }}>Assign to Appraisal →</button>
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
          footer={<><button onClick={() => setShowNotice(false)} className="px-4 py-2.5 rounded-lg border border-[#E5E7EB]" style={{ fontSize: '14px' }}>Cancel</button><button onClick={() => { setNoticeSent(true); setShowNotice(false); }} className="px-4 py-2.5 rounded-lg font-semibold" style={{ backgroundColor: '#1A3C2A', color: 'white', fontSize: '14px' }}>Preview → Send</button></>}
        >
          <div className="space-y-4">
            <div className="flex gap-2">
              {(['English', 'Marathi'] as const).map(lang => <button key={lang} onClick={() => setNoticeLang(lang)} className="px-3 py-1.5 rounded-full" style={{ backgroundColor: noticeLang === lang ? '#1A3C2A' : '#F3F4F6', color: noticeLang === lang ? 'white' : '#3D4450', fontSize: '12px', fontWeight: 700 }}>{lang}</button>)}
            </div>
            <textarea rows={7} className="w-full p-3 rounded-lg border border-[#D1D5DB]" style={{ fontSize: '13px', color: '#12151A', lineHeight: '20px' }} defaultValue={noticeLang === 'English' ? `Dear ${selected.shortName}, your loan application ${selected.id} is missing: ${missingDocs.map(doc => doc.name).join(', ')}. Please upload the document to continue processing.` : `${selected.shortName}, आपल्या ${selected.id} कर्ज अर्जासाठी ${missingDocs.map(doc => doc.name).join(', ')} आवश्यक आहे. कृपया कागदपत्र अपलोड करा.`} />
          </div>
        </AppModal>
      )}
    </Shell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 style={{ fontSize: '14px', color: '#12151A', fontWeight: 700, marginBottom: '10px' }}>{title}</h3>
      <div className="rounded-lg border border-[#E5E7EB] overflow-hidden">{children}</div>
    </div>
  );
}

function InfoGrid({ items }: { items: string[][] }) {
  return (
    <div className="grid grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="grid grid-cols-2 border-b border-r border-[#E5E7EB] last:border-b-0">
          <div className="p-3" style={{ backgroundColor: '#FAFAF8', fontSize: '12px', color: '#6B7280', fontWeight: 700 }}>{label}</div>
          <div className="p-3" style={{ fontSize: '13px', color: '#12151A', fontWeight: 700, fontFamily: label.includes('Amount') || label.includes('Folio') || label.includes('Mobile') ? 'Roboto Mono' : 'inherit' }}>{value}</div>
        </div>
      ))}
    </div>
  );
}
