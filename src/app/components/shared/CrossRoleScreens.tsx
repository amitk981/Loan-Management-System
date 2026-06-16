import { useState } from 'react';
import { Archive, CheckCircle, FileText, Send, Upload } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from './StatusBadge';
import { AuditTrailPanel, DirectorCaseBanner, DocumentLinkList, HandoffCard, RoleAccessNote, S186LockBanner, UniversalStageTracker } from './CrossRoleComponents';
import { crossRoleNotifications, integrationRules } from '../../data/crossRoleData';
import { formatCurrency } from '../../lib/format';

interface CrossRoleScreenProps {
  onNavigate: (page: string) => void;
  activePage: string;
}


const pageMeta: Record<string, { title: string; subtitle: string }> = {
  'integration-overview': { title: 'Cross-Role Integration', subtitle: 'Handoffs and audit trail' },
  'credit-manual-entry': { title: 'Manual Loan Application Entry', subtitle: 'Offline applications' },
  'sc-final-signoff': { title: 'Final Checklist Sign-Off', subtitle: 'Release to Treasury' },
  'cs-new-loan': { title: 'Document Workspace', subtitle: 'New SC-approved loan' },
  'cs-archive-file': { title: 'Post-Disbursement Archive', subtitle: 'Archive document file' },
  'farmer-post-disbursement': { title: 'Active Loan', subtitle: 'Disbursement complete' },
  'farmer-payment-processing': { title: 'Payment Processing', subtitle: 'SAP posting pending' },
  'farmer-fully-repaid': { title: 'Fully Repaid', subtitle: 'Awaiting NOC' },
  'farmer-noc-delivered': { title: 'NOC Delivered', subtitle: 'Loan closed' },
  'shared-director-case': { title: 'Director / Relative Special Case', subtitle: 'GM approval path' },
  'shared-rate-change': { title: 'Interest Rate Change', subtitle: 'Broadcast controls' },
  'shared-s186-lock': { title: 's.186 Lending Lock', subtitle: 'Suspension states' },
  'shared-audit-trail': { title: 'Universal Audit Trail', subtitle: 'Internal and farmer-safe' },
  'shared-notifications': { title: 'Unified Notification Matrix', subtitle: 'Deep-link contract' },
};

export function CrossRoleScreens({ onNavigate, activePage }: CrossRoleScreenProps) {
  const meta = pageMeta[activePage] || pageMeta['integration-overview'];

  const renderManualEntry = () => (
    <div className="grid grid-cols-5 gap-5">
      <div className="col-span-3 bg-white rounded-lg p-5 border border-[var(--neutral-200)]">
        <h3 style={{ fontSize: 18, fontWeight: 700 }}>Create Application on Behalf of Farmer</h3>
        <div className="grid grid-cols-2 gap-4 mt-5">
          {['Farmer full name', 'Folio number', 'Mobile number', 'Nominee name', 'Aadhaar', 'PAN', 'Village', 'Crop', 'Requested amount', 'Purpose'].map((field, i) => (
            <label key={field} style={{ fontSize: 12, color: 'var(--neutral-700)', fontWeight: 700 }}>{field}<input className="w-full mt-1 px-3 rounded-lg border border-[var(--neutral-300)]" placeholder={i === 8 ? '₹' : field} style={{ height: 40, fontSize: 13 }} /></label>
          ))}
        </div>
        <button className="mt-4 px-4 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}>Create Application LO00000053</button>
      </div>
      <div className="col-span-2 space-y-4">
        <HandoffCard title="Offline Application Handoff" from="Credit Officer" to="Credit Inbox">Physical office applications must enter the same digital pipeline as farmer-submitted applications.</HandoffCard>
        <UniversalStageTracker currentStage={1} compact />
      </div>
    </div>
  );

  const renderScSignoff = () => {
    const checklistItems = [
      'Appraisal Note Approved', 'Term Sheet Signed', 'Loan Agreement Executed', 'Demand Promissory Note',
      'Hypothecation Deed', 'SH-4 Transfer Form (Blank)', 'Blank Security Cheque', 'Power of Attorney (Notarized)',
      'Borrower KYC (PAN/Aadhaar)', 'Bank Verification (Penny Drop)', 'Land Extract (7/12 & 8A)',
      'NOC from existing lenders', 'Guarantor signatures (if any)', 'CIBIL / Default check refresh', 'CS Sign-off Certificate'
    ];
    return (
      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3 bg-white rounded-lg border border-[var(--neutral-200)] overflow-hidden">
          <div className="p-5 border-b border-[var(--neutral-200)]" style={{ backgroundColor: 'var(--neutral-100)' }}>
            <div className="flex justify-between items-center">
               <h3 style={{ fontSize: 18, fontWeight: 700 }}>Final Pre-Disbursement Sign-off</h3>
               <StatusBadge status="Awaiting SC Final" size="md" />
            </div>
            <p style={{ fontSize: 14, color: 'var(--neutral-700)', marginTop: 4 }}><strong>LO00000047</strong> · Ramesh Patil · {formatCurrency(200000)}</p>
          </div>
          <div className="p-5">
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Document Checklist Verified by CS</h4>
            <div className="grid grid-cols-2 gap-3">
              {checklistItems.map((item, i) => (
                <div key={i} className="p-3 rounded-lg flex items-start gap-2" style={{ backgroundColor: 'var(--success-50)', border: '1px solid var(--success-200)', fontSize: 12, color: 'var(--success-700)', fontWeight: 700 }}>
                  <CheckCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-5 border-t border-[var(--neutral-200)]">
            <label className="flex items-start gap-2 mb-4">
               <input type="checkbox" style={{ accentColor: 'var(--accent-sanction)', marginTop: 3 }} />
               <span style={{ fontSize: 13, color: 'var(--neutral-700)' }}>I confirm that the above document file is complete and legally executed. I authorize the release of {formatCurrency(200000)} to the Treasury queue.</span>
            </label>
            <button className="w-full py-3 rounded-lg font-medium flex justify-center items-center gap-2" style={{ backgroundColor: 'var(--accent-sanction)', color: 'white' }}>
               <FileText size={16} /> Sign Checklist & Release to Treasury
            </button>
            <div className="mt-3 p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'var(--info-50)', color: 'var(--accent-treasury-700)', fontSize: 12, fontWeight: 700 }}>
               <Send size={14} /> After signing: File released to Treasury. Senior Manager – Finance notified.
            </div>
          </div>
        </div>
        <div className="col-span-2 space-y-4">
          <HandoffCard title="Second SC Touchpoint" from="CS" to="SC Director → Treasury">This happens after CS document preparation, not during appraisal review. Routing: CS submits → SC Director signs → Treasury receives file.</HandoffCard>
          <div className="bg-white rounded-lg p-5 border border-[var(--neutral-200)]">
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Signatory Details</h4>
            <div className="space-y-3">
               <div><div style={{ fontSize: 11, color: 'var(--neutral-500)', fontWeight: 700 }}>Authority</div><div style={{ fontSize: 13, fontWeight: 700 }}>S. Nair (CFO)</div></div>
               <div><div style={{ fontSize: 11, color: 'var(--neutral-500)', fontWeight: 700 }}>IP Address</div><div style={{ fontSize: 13, fontFamily: 'Roboto Mono' }}>192.168.1.44</div></div>
               <div><div style={{ fontSize: 11, color: 'var(--neutral-500)', fontWeight: 700 }}>Timestamp</div><div style={{ fontSize: 13 }}>Current Time</div></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCsNewLoan = () => (
    <div className="space-y-5">
      <div className="bg-white rounded-lg p-8 border border-[var(--neutral-200)] text-center max-w-3xl mx-auto mt-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--success-50)', color: 'var(--success-700)' }}>
          <FileText size={32} />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>New Document File Generated</h2>
        <p style={{ fontSize: 15, color: 'var(--neutral-500)', marginBottom: 24, lineHeight: '24px' }}>
          SC has sanctioned <strong>₹2,00,000</strong> for <strong>Ramesh Patil</strong> (LO00000047).<br />
          Data has been securely imported from the sanctioned application. You can now begin generating the legal documents.
        </p>

        <div className="text-left bg-[var(--neutral-100)] rounded-lg p-5 mb-6 border border-[var(--neutral-200)]">
          <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', color: 'var(--neutral-500)' }}>Recommended Workflow Sequence</h4>
          <div className="space-y-3">
             <div className="flex gap-3"><div className="w-6 h-6 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center flex-shrink-0" style={{ fontSize: 11, fontWeight: 700 }}>1</div><div><div style={{ fontSize: 14, fontWeight: 700 }}>Generate Core Legal Documents</div><div style={{ fontSize: 13, color: 'var(--neutral-500)' }}>Print Power of Attorney, Term Sheet, and Tri-Party Agreement for signatures.</div></div></div>
             <div className="flex gap-3"><div className="w-6 h-6 rounded-full bg-[var(--neutral-200)] text-[var(--neutral-500)] flex items-center justify-center flex-shrink-0" style={{ fontSize: 11, fontWeight: 700 }}>2</div><div><div style={{ fontSize: 14, fontWeight: 700 }}>Lock Term Sheet</div><div style={{ fontSize: 13, color: 'var(--neutral-500)' }}>Once Term Sheet is signed by Borrower & SC Director, the system unlocks the Loan Agreement.</div></div></div>
             <div className="flex gap-3"><div className="w-6 h-6 rounded-full bg-[var(--neutral-200)] text-[var(--neutral-500)] flex items-center justify-center flex-shrink-0" style={{ fontSize: 11, fontWeight: 700 }}>3</div><div><div style={{ fontSize: 14, fontWeight: 700 }}>Final Checklist & Sign-off</div><div style={{ fontSize: 13, color: 'var(--neutral-500)' }}>Upload executed copies, complete the 15-point checklist, and release file to Treasury.</div></div></div>
          </div>
        </div>

        <button onClick={() => onNavigate('cs-workspace')} className="px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 mx-auto transition-all hover:opacity-90" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: 15 }}>
          Open Workspace & Generate Docs →
        </button>
      </div>

      <HandoffCard title="SC → CS Data Auto-Populated" from="SC approval" to="CS Workspace">Borrower details, address, folio, nominee, share type, approved amount, interest rate, tenure, subsidiary and &gt;₹5L signature flags are carried forward automatically.</HandoffCard>
    </div>
  );

  const renderCsArchive = () => (
    <div className="grid grid-cols-5 gap-5">
      <div className="col-span-3 bg-white rounded-lg p-5 border border-[var(--neutral-200)]">
        <h3 style={{ fontSize: 18, fontWeight: 700 }}>LO000047 Disbursed — Archive Document File</h3>
        {['Company Secretary signed · 10 Jun 09:00', 'Credit Manager signed · 10 Jun 09:15', 'SC Director signed · 10 Jun 16:30', 'Senior Manager Finance signed · 10 Jun 17:35'].map(row => <button key={row} onClick={() => onNavigate('shared-audit-trail')} className="w-full text-left p-3 mt-3 rounded-lg clickable-row" style={{ backgroundColor: 'var(--success-50)', color: 'var(--success-700)', fontSize: 13, fontWeight: 700 }}>{row}</button>)}
        <button className="mt-5 px-4 py-2.5 rounded-lg font-medium flex items-center gap-2" style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}><Archive size={15} /> Archive Document File</button>
      </div>
      <HandoffCard title="Post-Disbursement Archive Trigger" from="Treasury" to="CS">CS receives: LO000047 disbursed — Checklist now complete with Finance sign-off. Archive document file.</HandoffCard>
    </div>
  );

  const renderFarmerStates = () => {
    const stateMap: Record<string, { stage: number; balance: string; title: string; note: string; status: string; actions: string[] }> = {
      'farmer-post-disbursement': { stage: 5, balance: '₹2,00,000', title: 'Active Loan', note: 'Your loan of ₹2,00,000 has been disbursed to SBI account XXXX-4821. Repayment begins 31 Mar 2027.', status: 'Active', actions: ['Make Payment', 'View Statement'] },
      'farmer-payment-processing': { stage: 6, balance: '₹1,17,500', title: 'Payment Processing', note: 'Payment submitted. Balance updates after Treasury posts SAP entry next working day.', status: 'Processing', actions: ['View Receipt'] },
      'farmer-fully-repaid': { stage: 6, balance: '₹0', title: 'Fully Repaid — NOC Pending', note: 'Full repayment confirmed. CS has been notified to issue NOC.', status: 'Fully Repaid', actions: ['View Statement'] },
      'farmer-noc-delivered': { stage: 6, balance: '₹0', title: 'Closed — NOC Issued', note: 'NOC delivered to My Documents. SH-4 and security cheque return confirmation recorded.', status: 'Closed — NOC Issued', actions: ['Download NOC', 'View Statement'] },
    };
    const state = stateMap[activePage];
    return (
      <div className="space-y-5 max-w-md mx-auto mt-8">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[var(--neutral-200)]">
          <div className="p-6 text-white" style={{ background: state.status.includes('Closed') || state.status.includes('Repaid') ? 'linear-gradient(135deg, var(--green-700c), var(--green-500b))' : state.status === 'Processing' ? 'linear-gradient(135deg, var(--teal-800), var(--teal-600))' : 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))' }}>
            <div className="flex justify-between items-start">
               <div style={{ fontSize: 13, opacity: 0.9, fontWeight: 700 }}>{state.title}</div>
               <div className="px-2 py-1 rounded-full bg-white/20" style={{ fontSize: 11, fontWeight: 700 }}>LO00000047</div>
            </div>
            <div style={{ fontSize: 42, fontWeight: 700, fontFamily: 'Roboto Mono', marginTop: 12, marginBottom: 4 }}>{state.balance}</div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>Outstanding Principal</div>
            
            <div className="mt-6 pt-5 border-t border-white/20">
              <div style={{ fontSize: 14, lineHeight: '22px' }}>{state.note}</div>
              {state.status === 'Active' && <div className="mt-3 inline-flex px-3 py-1.5 rounded-full bg-[var(--warning-500)] text-white" style={{ fontSize: 12, fontWeight: 700 }}>Repayment due: 31 Mar 2027</div>}
            </div>
          </div>
          
          <div className="p-4 bg-[var(--neutral-100)]">
             <div className="grid grid-cols-2 gap-3">
               {state.actions.map((action, i) => (
                 <button key={action} className="py-2.5 rounded-xl font-medium transition-all hover:opacity-90" style={{ backgroundColor: i === 0 && (state.status === 'Active' || action === 'Download NOC') ? 'var(--brand-primary)' : 'white', color: i === 0 && (state.status === 'Active' || action === 'Download NOC') ? 'white' : 'var(--neutral-700)', border: i === 0 && (state.status === 'Active' || action === 'Download NOC') ? 'none' : '1px solid var(--neutral-200)', fontSize: 13, boxShadow: i === 0 && (state.status === 'Active' || action === 'Download NOC') ? '0 4px 6px -1px rgba(26, 60, 42, 0.1)' : 'none' }}>
                   {action}
                 </button>
               ))}
             </div>
          </div>
        </div>
        <UniversalStageTracker currentStage={state.stage} />
        <button onClick={() => onNavigate('shared-notifications')} className="w-full bg-white rounded-xl p-4 border border-[var(--neutral-200)] text-left clickable-card flex justify-between items-center"><StatusBadge status={state.status} size="md" /><span style={{ fontSize: 13, color: 'var(--brand-accent)', fontWeight: 700 }}>View Notification →</span></button>
      </div>
    );
  };

  const renderDirectorCase = () => (
    <div className="grid grid-cols-3 gap-5">
      <DirectorCaseBanner />
      <div className="bg-white rounded-lg p-5 border border-[var(--neutral-200)]"><h3 style={{ fontWeight: 700 }}>GM Resolution Upload</h3><button className="mt-4 w-full py-3 rounded-lg border-2 border-dashed border-[var(--neutral-300)] flex items-center justify-center gap-2"><Upload size={15} /> Upload Resolution PDF</button><textarea className="w-full mt-3 p-3 rounded-lg border border-[var(--neutral-300)]" rows={3} placeholder="Resolution reference and meeting date" /></div>
      <DirectorCaseBanner blocked />
    </div>
  );

  const renderRateChange = () => (
    <div className="max-w-2xl bg-white rounded-lg p-5 border border-[var(--neutral-200)]">
      <h3 style={{ fontSize: 18, fontWeight: 700 }}>Confirm Interest Rate Change</h3>
      <div className="grid grid-cols-3 gap-3 mt-4">{['Farmer SMS + app banner', 'CS calendar task', 'Credit register update'].map(x => <button key={x} onClick={() => onNavigate('shared-notifications')} className="p-3 rounded-lg text-left clickable-row" style={{ backgroundColor: 'var(--success-50)', color: 'var(--success-700)', fontSize: 12, fontWeight: 700 }}>{x}</button>)}</div>
      <div className="flex gap-3 mt-5"><button className="px-4 py-2.5 rounded-lg border border-[var(--neutral-200)]">Cancel</button><button className="px-4 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}>Confirm Rate Change</button></div>
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
      ].map(([title, body]) => <button key={title} onClick={() => onNavigate('shared-audit-trail')} className="text-left"><HandoffCard title={title} from="Sender" to="Receiver">{body}</HandoffCard></button>)}</div>
      <UniversalStageTracker currentStage={5} />
      <div className="grid grid-cols-2 gap-5"><AuditTrailPanel /><div className="bg-white rounded-lg p-5 border border-[var(--neutral-200)]"><h3 style={{ fontSize: 15, fontWeight: 700 }}>Critical Integration Rules</h3>{integrationRules.map(([id, text]) => <div key={id} className="py-2 border-b border-[var(--neutral-200)]" style={{ fontSize: 13 }}><strong style={{ fontFamily: 'Roboto Mono', color: 'var(--brand-accent)' }}>{id}</strong> · {text}</div>)}</div></div>
    </div>
  );

  const renderNotifications = () => (
    <div className="bg-white rounded-lg border border-[var(--neutral-200)] overflow-hidden">
      <div className="table-scroll"><table className="w-full"><thead><tr>{['ID', 'Type', 'Priority', 'From', 'To', 'Loan', 'Message', 'CTA'].map(h => <th key={h} className="px-4 py-3 text-left" style={{ fontSize: 11, color: 'var(--neutral-400)', textTransform: 'uppercase' }}>{h}</th>)}</tr></thead><tbody>{crossRoleNotifications.map(n => <tr key={n.id} onClick={() => onNavigate(n.route)} className="border-t border-[var(--neutral-200)] clickable-row"><td className="px-4 py-3" style={{ fontFamily: 'Roboto Mono', fontSize: 12 }}>{n.id}</td><td className="px-4 py-3" style={{ fontSize: 12 }}>{n.type}</td><td className="px-4 py-3"><StatusBadge status={n.priority === 'critical' ? 'High' : n.priority[0].toUpperCase() + n.priority.slice(1)} /></td><td className="px-4 py-3" style={{ fontSize: 12 }}>{n.fromRole}</td><td className="px-4 py-3" style={{ fontSize: 12 }}>{n.toRole}</td><td className="px-4 py-3" style={{ fontFamily: 'Roboto Mono', color: 'var(--brand-accent)', fontSize: 12 }}>{n.loan}</td><td className="px-4 py-3" style={{ fontSize: 12 }}>{n.message}</td><td className="px-4 py-3"><button onClick={(e) => { e.stopPropagation(); onNavigate(n.route); }} className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--info-50)', color: 'var(--accent-treasury)', fontSize: 12, fontWeight: 700 }}>{n.cta}</button></td></tr>)}</tbody></table></div>
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
    <Shell activePage={activePage} onNavigate={onNavigate} breadcrumbs={['Cross-Role Integration', meta.title]} pageTitle={meta.title} pageSubtitle={meta.subtitle} actions={<button onClick={() => onNavigate('integration-overview')} className="px-4 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: 14 }}><FileText size={15} style={{ display: 'inline', marginRight: 6 }} />Integration Map</button>}>
      <div className="mb-5"><RoleAccessNote /></div>
      {renderContent()}
    </Shell>
  );
}
