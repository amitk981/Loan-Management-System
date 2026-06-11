import { useState } from 'react';
import { Archive, CheckCircle, FileText, Send, Upload } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from './StatusBadge';
import { AuditTrailPanel, DirectorCaseBanner, DocumentLinkList, HandoffCard, RoleAccessNote, S186LockBanner, UniversalStageTracker } from './CrossRoleComponents';
import { crossRoleNotifications, integrationRules } from '../../data/crossRoleData';

interface CrossRoleScreenProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

function formatCurrency(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  'integration-overview': { title: 'Cross-Role Integration', subtitle: 'Shared handoffs, notifications, audit trail and missing screens' },
  'credit-manual-entry': { title: 'Manual Loan Application Entry', subtitle: 'Credit Officer data-entry path for offline applications' },
  'sc-final-signoff': { title: 'Final Checklist Sign-Off', subtitle: 'Second SC action after CS document preparation · SOP §4.13' },
  'cs-new-loan': { title: 'Document Workspace — New Loan Initial State', subtitle: 'All document tabs start pending after SC approval' },
  'cs-archive-file': { title: 'Post-Disbursement Archive', subtitle: 'Checklist complete with Finance sign-off; archive document file' },
  'farmer-post-disbursement': { title: 'Active Loan — Disbursement Complete', subtitle: 'Farmer dashboard transition after Treasury confirms disbursement' },
  'farmer-payment-processing': { title: 'Payment Processing', subtitle: 'Repayment submitted; SAP posting pending next working day' },
  'farmer-fully-repaid': { title: 'Fully Repaid — Awaiting NOC', subtitle: 'Balance is zero; CS NOC workflow has been triggered' },
  'farmer-noc-delivered': { title: 'NOC Delivered', subtitle: 'Loan closed and security return confirmed' },
  'shared-director-case': { title: 'Director / Relative Special Case', subtitle: 'Reusable detection, GM upload and blocked director views' },
  'shared-rate-change': { title: 'Interest Rate Change Broadcast', subtitle: 'Admin confirmation and cross-role propagation' },
  'shared-s186-lock': { title: 's.186 Lending Lock', subtitle: 'System-wide lending suspension states' },
  'shared-audit-trail': { title: 'Universal Audit Trail', subtitle: 'Full and farmer-safe audit views' },
  'shared-notifications': { title: 'Unified Notification Matrix', subtitle: 'Every notification deep-links to the relevant entity' },
};

export function CrossRoleScreens({ onNavigate, activePage }: CrossRoleScreenProps) {
  const meta = pageMeta[activePage] || pageMeta['integration-overview'];

  const renderManualEntry = () => (
    <div className="grid grid-cols-5 gap-5">
      <div className="col-span-3 bg-white rounded-lg p-5 border border-[#EDEEF0]">
        <h3 style={{ fontSize: 18, fontWeight: 900 }}>Create Application on Behalf of Farmer</h3>
        <p style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>Fields mirror the farmer application form. On submit, the same downstream workflow and reference number are generated.</p>
        <div className="grid grid-cols-2 gap-4 mt-5">
          {['Farmer full name', 'Folio number', 'Mobile number', 'Nominee name', 'Aadhaar', 'PAN', 'Village', 'Crop', 'Requested amount', 'Purpose'].map((field, i) => (
            <label key={field} style={{ fontSize: 12, color: '#3D4450', fontWeight: 800 }}>{field}<input className="w-full mt-1 px-3 rounded-lg border border-[#D1D5DB]" placeholder={i === 8 ? '₹' : field} style={{ height: 40, fontSize: 13 }} /></label>
          ))}
        </div>
        <div className="p-3 rounded-lg mt-4" style={{ backgroundColor: '#E0F2FE', color: '#0E7490', fontSize: 13, fontWeight: 800 }}>On save: reference number issued, Credit inbox row status = New — Unreviewed, farmer notification generated.</div>
        <button className="mt-4 px-4 py-2.5 rounded-lg font-semibold" style={{ backgroundColor: '#1A3C2A', color: 'white' }}>Create Application LO00000053</button>
      </div>
      <div className="col-span-2 space-y-4">
        <HandoffCard title="Offline Application Handoff" from="Credit Officer" to="Credit Inbox">Physical office applications must enter the same digital pipeline as farmer-submitted applications.</HandoffCard>
        <UniversalStageTracker currentStage={1} compact />
      </div>
    </div>
  );

  const renderScSignoff = () => (
    <div className="grid grid-cols-5 gap-5">
      <div className="col-span-3 bg-white rounded-lg border border-[#EDEEF0] overflow-hidden">
        <div className="p-5 border-b border-[#EDEEF0]" style={{ backgroundColor: '#F7F8FA' }}>
          <h3 style={{ fontSize: 18, fontWeight: 900 }}>LO00000047 · Ramesh Patil · {formatCurrency(200000)}</h3>
          <p style={{ fontSize: 13, color: '#6B7280' }}>CS signed checklist at 10 Jun 2026 · 16:05. Director sign-off releases file to Treasury.</p>
        </div>
        <div className="grid grid-cols-3 gap-3 p-5">
          {Array.from({ length: 15 }).map((_, i) => <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', fontSize: 12, color: '#166534', fontWeight: 800 }}>✓ Checklist item {i + 1}</div>)}
        </div>
        <div className="p-5 border-t border-[#EDEEF0]">
          <button className="w-full py-3 rounded-lg font-semibold" style={{ backgroundColor: '#7C3AED', color: 'white' }}>Sign Checklist — Final Disbursement Approval</button>
          <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: '#F0FDF4', color: '#166534', fontSize: 13, fontWeight: 800 }}>After signing: File released to Treasury. Senior Manager – Finance notified.</div>
        </div>
      </div>
      <div className="col-span-2"><HandoffCard title="Second SC Touchpoint" from="CS" to="SC Director → Treasury">This happens after CS document preparation, not during appraisal review. Routing: CS submits → SC Director signs → Treasury receives file.</HandoffCard></div>
    </div>
  );

  const renderCsNewLoan = () => (
    <div className="space-y-5">
      <div className="p-4 rounded-lg" style={{ backgroundColor: '#E0F2FE', borderLeft: '4px solid #0891B2', color: '#0E7490', fontSize: 13, fontWeight: 800 }}>Where to begin: Start with PoA → then Tri-Party Agreement → then SH-4/CDSL → Term Sheet → Loan Agreement → Bank Verification → Checklist.</div>
      <div className="grid grid-cols-7 gap-3">{['PoA', 'Tri-Party', 'SH-4/CDSL', 'Term Sheet', 'Loan Agreement', 'Bank Verify', 'Checklist'].map((tab, i) => <div key={tab} className="bg-white rounded-lg p-4 border border-[#EDEEF0]"><div className="w-8 h-8 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: i === 0 ? '#1A3C2A' : '#EDEEF0', color: i === 0 ? 'white' : '#9EA8B3', fontWeight: 900 }}>{i + 1}</div><strong style={{ fontSize: 13 }}>{tab}</strong><div className="mt-2"><StatusBadge status={i === 0 ? 'Ready' : 'Not Started'} /></div></div>)}</div>
      <HandoffCard title="SC → CS Data Auto-Populated" from="SC approval" to="CS Workspace">Borrower details, address, folio, nominee, share type, approved amount, interest rate, tenure, subsidiary and &gt;₹5L signature flags are carried forward automatically.</HandoffCard>
    </div>
  );

  const renderCsArchive = () => (
    <div className="grid grid-cols-5 gap-5">
      <div className="col-span-3 bg-white rounded-lg p-5 border border-[#EDEEF0]">
        <h3 style={{ fontSize: 18, fontWeight: 900 }}>LO000047 Disbursed — Archive Document File</h3>
        <p style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>Checklist now complete with CS + Credit Manager + SC + Finance signatures.</p>
        {['Company Secretary signed · 10 Jun 09:00', 'Credit Manager signed · 10 Jun 09:15', 'SC Director signed · 10 Jun 16:30', 'Senior Manager Finance signed · 10 Jun 17:35'].map(row => <div key={row} className="p-3 mt-3 rounded-lg" style={{ backgroundColor: '#F0FDF4', color: '#166534', fontSize: 13, fontWeight: 800 }}>✓ {row}</div>)}
        <button className="mt-5 px-4 py-2.5 rounded-lg font-semibold flex items-center gap-2" style={{ backgroundColor: '#1A3C2A', color: 'white' }}><Archive size={15} /> Archive Document File</button>
      </div>
      <HandoffCard title="Post-Disbursement Archive Trigger" from="Treasury" to="CS">CS receives: LO000047 disbursed — Checklist now complete with Finance sign-off. Archive document file.</HandoffCard>
    </div>
  );

  const renderFarmerStates = () => {
    const stateMap: Record<string, { stage: number; balance: string; title: string; note: string; status: string }> = {
      'farmer-post-disbursement': { stage: 5, balance: '₹2,00,000', title: 'Active Loan', note: 'Your loan of ₹2,00,000 has been disbursed to SBI account XXXX-4821. Repayment begins 31 Mar 2027.', status: 'Active' },
      'farmer-payment-processing': { stage: 6, balance: '₹1,17,500 (payment processing)', title: 'Payment Processing', note: 'Payment submitted. Balance updates after Treasury posts SAP entry next working day.', status: 'Processing' },
      'farmer-fully-repaid': { stage: 6, balance: '₹0', title: 'Fully Repaid — NOC Pending', note: 'Full repayment confirmed. CS has been notified to issue NOC.', status: 'Fully Repaid' },
      'farmer-noc-delivered': { stage: 6, balance: '₹0', title: 'Closed — NOC Issued', note: 'NOC delivered to My Documents. SH-4 and security cheque return confirmation recorded.', status: 'Closed — NOC Issued' },
    };
    const state = stateMap[activePage];
    return (
      <div className="space-y-5">
        <div className="rounded-lg p-6 text-white" style={{ background: 'linear-gradient(135deg, #1A3C2A, #2D7A4F)' }}>
          <div style={{ fontSize: 12, opacity: 0.75 }}>{state.title}</div>
          <div style={{ fontSize: 34, fontWeight: 900, fontFamily: 'Roboto Mono', marginTop: 8 }}>{state.balance}</div>
          <div style={{ fontSize: 14, marginTop: 8 }}>{state.note}</div>
          <div className="mt-4 inline-flex px-3 py-1.5 rounded-full" style={{ backgroundColor: '#F59E0B', fontSize: 12, fontWeight: 800 }}>Repayment due: 31 Mar 2027</div>
        </div>
        <UniversalStageTracker currentStage={state.stage} />
        <div className="bg-white rounded-lg p-5 border border-[#EDEEF0]"><StatusBadge status={state.status} size="md" /><p style={{ fontSize: 13, color: '#3D4450', marginTop: 12 }}>Notification and SMS trigger are recorded in the shared notification contract.</p></div>
      </div>
    );
  };

  const renderDirectorCase = () => (
    <div className="grid grid-cols-3 gap-5">
      <DirectorCaseBanner />
      <div className="bg-white rounded-lg p-5 border border-[#EDEEF0]"><h3 style={{ fontWeight: 900 }}>GM Resolution Upload</h3><button className="mt-4 w-full py-3 rounded-lg border-2 border-dashed border-[#D1D5DB] flex items-center justify-center gap-2"><Upload size={15} /> Upload Resolution PDF</button><textarea className="w-full mt-3 p-3 rounded-lg border border-[#D1D5DB]" rows={3} placeholder="Resolution reference and meeting date" /></div>
      <DirectorCaseBanner blocked />
    </div>
  );

  const renderRateChange = () => (
    <div className="max-w-2xl bg-white rounded-lg p-5 border border-[#EDEEF0]">
      <h3 style={{ fontSize: 18, fontWeight: 900 }}>Confirm Interest Rate Change</h3>
      <p style={{ fontSize: 13, color: '#3D4450', lineHeight: '22px', marginTop: 12 }}>Changing rate from 12% to 13% p.a. will affect 47 active loans effective 1 Jul 2026. Farmer notifications will be sent automatically. CS intimation letters must be prepared manually. Treasury accruals use the new rate from the effective date.</p>
      <div className="grid grid-cols-3 gap-3 mt-4">{['Farmer SMS + app banner', 'CS calendar task', 'Credit register update'].map(x => <div key={x} className="p-3 rounded-lg" style={{ backgroundColor: '#F0FDF4', color: '#166534', fontSize: 12, fontWeight: 800 }}>✓ {x}</div>)}</div>
      <div className="flex gap-3 mt-5"><button className="px-4 py-2.5 rounded-lg border border-[#EDEEF0]">Cancel</button><button className="px-4 py-2.5 rounded-lg font-semibold" style={{ backgroundColor: '#1A3C2A', color: 'white' }}>Confirm Rate Change</button></div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">{[
        ['Application → Credit', 'New — Unreviewed inbox row + notification'],
        ['Credit → SC', 'Appraisal lock modal + Days Waiting stage timestamp'],
        ['SC → CS', 'Documentation notified + new workspace zero state'],
        ['CS → SC → Treasury', 'Final checklist sign-off and release'],
        ['Treasury → Farmer/CS', 'Disbursement notification and archive trigger'],
        ['Repayment → SAP', 'Payment processing state then confirmed balance'],
        ['Full repayment → NOC', 'NOC queue + farmer document delivery'],
        ['Director case', 'GM resolution and excluded director routing'],
      ].map(([title, body]) => <HandoffCard key={title} title={title} from="Sender" to="Receiver">{body}</HandoffCard>)}</div>
      <UniversalStageTracker currentStage={5} />
      <div className="grid grid-cols-2 gap-5"><AuditTrailPanel /><div className="bg-white rounded-lg p-5 border border-[#EDEEF0]"><h3 style={{ fontSize: 15, fontWeight: 900 }}>Critical Integration Rules</h3>{integrationRules.map(([id, text]) => <div key={id} className="py-2 border-b border-[#EDEEF0]" style={{ fontSize: 13 }}><strong style={{ fontFamily: 'Roboto Mono', color: '#1E88E5' }}>{id}</strong> · {text}</div>)}</div></div>
    </div>
  );

  const renderNotifications = () => (
    <div className="bg-white rounded-lg border border-[#EDEEF0] overflow-hidden">
      <table className="w-full"><thead><tr>{['ID', 'Type', 'Priority', 'From', 'To', 'Loan', 'Message', 'CTA'].map(h => <th key={h} className="px-4 py-3 text-left" style={{ fontSize: 11, color: '#9EA8B3', textTransform: 'uppercase' }}>{h}</th>)}</tr></thead><tbody>{crossRoleNotifications.map(n => <tr key={n.id} className="border-t border-[#EDEEF0]"><td className="px-4 py-3" style={{ fontFamily: 'Roboto Mono', fontSize: 12 }}>{n.id}</td><td className="px-4 py-3" style={{ fontSize: 12 }}>{n.type}</td><td className="px-4 py-3"><StatusBadge status={n.priority === 'critical' ? 'High' : n.priority[0].toUpperCase() + n.priority.slice(1)} /></td><td className="px-4 py-3" style={{ fontSize: 12 }}>{n.fromRole}</td><td className="px-4 py-3" style={{ fontSize: 12 }}>{n.toRole}</td><td className="px-4 py-3" style={{ fontFamily: 'Roboto Mono', color: '#1E88E5', fontSize: 12 }}>{n.loan}</td><td className="px-4 py-3" style={{ fontSize: 12 }}>{n.message}</td><td className="px-4 py-3"><button onClick={() => onNavigate(n.route)} className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#E0F2FE', color: '#0891B2', fontSize: 12, fontWeight: 800 }}>{n.cta}</button></td></tr>)}</tbody></table>
    </div>
  );

  const renderContent = () => {
    if (activePage === 'credit-manual-entry') return renderManualEntry();
    if (activePage === 'sc-final-signoff') return renderScSignoff();
    if (activePage === 'cs-new-loan') return renderCsNewLoan();
    if (activePage === 'cs-archive-file') return renderCsArchive();
    if (activePage.startsWith('farmer-') && ['farmer-post-disbursement', 'farmer-payment-processing', 'farmer-fully-repaid', 'farmer-noc-delivered'].includes(activePage)) return renderFarmerStates();
    if (activePage === 'shared-director-case') return renderDirectorCase();
    if (activePage === 'shared-rate-change') return renderRateChange();
    if (activePage === 'shared-s186-lock') return <div className="space-y-4"><S186LockBanner audience="sc" /><S186LockBanner audience="credit" /><S186LockBanner audience="farmer" /></div>;
    if (activePage === 'shared-audit-trail') return <div className="grid grid-cols-2 gap-5"><AuditTrailPanel /><AuditTrailPanel farmerSafe /></div>;
    if (activePage === 'shared-notifications') return renderNotifications();
    return renderOverview();
  };

  return (
    <Shell activePage={activePage} onNavigate={onNavigate} breadcrumbs={['Cross-Role Integration', meta.title]} pageTitle={meta.title} pageSubtitle={meta.subtitle} actions={<button onClick={() => onNavigate('integration-overview')} className="px-4 py-2.5 rounded-lg font-semibold" style={{ backgroundColor: '#1A3C2A', color: 'white', fontSize: 14 }}><FileText size={15} style={{ display: 'inline', marginRight: 6 }} />Integration Map</button>}>
      <div className="mb-5"><RoleAccessNote /></div>
      {renderContent()}
    </Shell>
  );
}
