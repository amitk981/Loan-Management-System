import { useState } from 'react';
import { ChevronDown, FileText, MessageCircle, Phone, Send, Upload } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { StatusBadge } from '../shared/StatusBadge';

interface SupportGrievanceProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

const grievanceRows = [
  { id: 'GRV-2025-0018', category: 'Repayment Adjustment Dispute', loan: 'LO00000047', date: '08 Jun 2025', status: 'Open', tat: '2 days left' },
  { id: 'GRV-2025-0011', category: 'Documentation Issue', loan: 'LO00000047', date: '22 May 2025', status: 'Resolved', tat: 'Closed in 3 days' },
];

const categories = [
  'Interest Calculation Dispute',
  'Documentation Issue',
  'Repayment Adjustment Dispute',
  'Harassment / Recovery Conduct',
  'NOC Not Issued After Repayment',
  'Other',
];

export function SupportGrievance({ onNavigate, activePage }: SupportGrievanceProps) {
  const [category, setCategory] = useState(categories[2]);
  const [description, setDescription] = useState('');
  const [contactPreference, setContactPreference] = useState<'Call' | 'WhatsApp' | 'SMS'>('Call');
  const [openFaq, setOpenFaq] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Farmer Portal', 'Support & Help']}
      pageTitle="Support & Help"
      pageSubtitle="Raise complaints, ask for help, and track grievance tickets"
    >
      {submitted && (
        <div className="mb-5 p-4 rounded-2xl" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#166534' }}>Grievance submitted: GRV-2025-0047</div>
          <div style={{ fontSize: '13px', color: '#3D4450', marginTop: '4px' }}>The Company Secretary support desk will respond through {contactPreference} within the SLA.</div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          ['Call Support', '1800-123-7722', <Phone size={20} />],
          ['WhatsApp Help', '+91 98765 43210', <MessageCircle size={20} />],
          ['Visit Office', 'Dindori member desk', <FileText size={20} />],
          ['Track Tickets', `${grievanceRows.length} recent`, <ChevronDown size={20} />],
        ].map(([title, sub, icon]) => (
          <div key={title as string} className="bg-white rounded-2xl p-4 border border-[#EDEEF0]">
            <div style={{ color: '#1A3C2A', marginBottom: '10px' }}>{icon}</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#12151A' }}>{title}</div>
            <div style={{ fontSize: '12px', color: '#9EA8B3', marginTop: '4px' }}>{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-2 bg-white rounded-2xl p-5 border border-[#EDEEF0]">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} style={{ color: '#1A3C2A' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#12151A' }}>Raise a Grievance</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450' }}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 rounded-xl border border-[#D1D5DB] bg-white focus:outline-none" style={{ height: '44px', fontSize: '14px', color: '#12151A' }}>
                {categories.map(item => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450' }}>Linked Loan</label>
              <input value="LO00000047" readOnly className="w-full px-4 rounded-xl border border-[#EDEEF0] bg-[#F7F8FA]" style={{ height: '44px', fontSize: '14px', color: '#9EA8B3', fontFamily: 'Roboto Mono' }} />
            </div>
            <div>
              <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450' }}>Preferred Contact</label>
              <div className="flex gap-2">
                {(['Call', 'WhatsApp', 'SMS'] as const).map(item => (
                  <button key={item} onClick={() => setContactPreference(item)} className="px-3 py-1.5 rounded-full" style={{ backgroundColor: contactPreference === item ? '#1A3C2A' : '#F7F8FA', color: contactPreference === item ? 'white' : '#3D4450', fontSize: '12px', fontWeight: 700 }}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450' }}>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5} className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] focus:outline-none resize-none" style={{ fontSize: '14px', color: '#12151A' }} placeholder="Describe the issue in your own words..." />
            </div>
            <div className="border-2 border-dashed rounded-xl p-4 flex items-center gap-2" style={{ borderColor: '#D1D5DB', backgroundColor: '#FAFAFA' }}>
              <Upload size={18} style={{ color: '#9EA8B3' }} />
              <span style={{ fontSize: '13px', color: '#3D4450' }}>Attach supporting receipt, message, or document</span>
            </div>
            <button
              onClick={() => description.trim() && setSubmitted(true)}
              disabled={!description.trim()}
              className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              style={{ backgroundColor: description.trim() ? '#1A3C2A' : '#9EA8B3', color: 'white', fontSize: '14px', cursor: description.trim() ? 'pointer' : 'not-allowed' }}
            >
              <Send size={14} /> Submit Grievance
            </button>
          </div>
        </div>

        <div className="col-span-3 bg-white rounded-2xl border border-[#EDEEF0] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#EDEEF0]" style={{ backgroundColor: '#F7F8FA' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#12151A' }}>My Grievance Tickets</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #EDEEF0' }}>
                {['Ticket', 'Category', 'Loan', 'Submitted', 'Status', 'SLA'].map(h => (
                  <th key={h} className="px-4 py-3 text-left" style={{ fontSize: '11px', fontWeight: 500, color: '#9EA8B3', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grievanceRows.map(row => (
                <tr key={row.id} className="border-b border-[#EDEEF0]">
                  <td className="px-4 py-4" style={{ fontSize: '13px', fontFamily: 'Roboto Mono', color: '#1E88E5' }}>{row.id}</td>
                  <td className="px-4" style={{ fontSize: '13px', color: '#3D4450' }}>{row.category}</td>
                  <td className="px-4" style={{ fontSize: '13px', fontFamily: 'Roboto Mono', color: '#3D4450' }}>{row.loan}</td>
                  <td className="px-4" style={{ fontSize: '13px', color: '#3D4450' }}>{row.date}</td>
                  <td className="px-4"><StatusBadge status={row.status} /></td>
                  <td className="px-4" style={{ fontSize: '12px', color: row.status === 'Open' ? '#D97706' : '#22C55E', fontWeight: 600 }}>{row.tat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-5 bg-white rounded-2xl border border-[#EDEEF0] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#EDEEF0]" style={{ backgroundColor: '#F7F8FA' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#12151A' }}>Common Questions</h3>
        </div>
        {[
          { q: 'How do I know if my repayment was posted?', a: 'Open My Loans → Repayment. Bank-confirmed payments appear as Paid after Treasury posts the SAP entry, normally by the next working day.' },
          { q: 'Why is my loan request blocked?', a: 'Requests are blocked when the amount exceeds eligibility, KYC is incomplete, declarations are missing, or the purpose is outside the approved agriculture list.' },
          { q: 'When can I download NOC?', a: 'NOC is enabled only after full repayment, SH-4 return, blank cheque return, and CS sign-off are complete.' },
        ].map((item, i) => (
          <div key={item.q} className="border-b border-[#EDEEF0] last:border-b-0">
            <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="w-full px-5 py-4 flex items-center justify-between text-left">
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#12151A' }}>{item.q}</span>
              <ChevronDown size={16} style={{ color: '#9EA8B3', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 150ms ease' }} />
            </button>
            {openFaq === i && <div className="px-5 pb-4" style={{ fontSize: '13px', color: '#3D4450', lineHeight: '20px' }}>{item.a}</div>}
          </div>
        ))}
      </div>
    </Shell>
  );
}
