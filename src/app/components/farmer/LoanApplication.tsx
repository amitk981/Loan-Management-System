import { useState } from 'react';
import { Check, Upload, ChevronRight, ChevronLeft, Plus, Trash2, Calculator } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { UniversalStageTracker } from '../shared/CrossRoleComponents';
import { farmerEligibility, farmerProfile } from '../../data/farmerData';

interface LoanApplicationProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

const steps = [
  { id: 1, label: 'Basic Details' },
  { id: 2, label: 'Shareholding' },
  { id: 3, label: 'Land & Crop' },
  { id: 4, label: 'KYC Upload' },
  { id: 5, label: 'Review & Submit' },
];

interface LandParcel {
  survey: string; village: string; area: string; crop: string; season: string;
}

export function LoanApplication({ onNavigate, activePage }: LoanApplicationProps) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [shares, setShares] = useState(farmerProfile.shares);
  const [landAcres, setLandAcres] = useState(farmerProfile.landAcres);
  const [requestedAmount, setRequestedAmount] = useState('');
  const [purpose, setPurpose] = useState('Crop Production & Farm Inputs');
  const [nomineeAdult, setNomineeAdult] = useState(false);
  const [landParcels, setLandParcels] = useState<LandParcel[]>([
    { survey: '123/1', village: farmerProfile.village, area: String(farmerProfile.landAcres), crop: 'Grapes', season: '2025-26' },
  ]);
  const [declarations, setDeclarations] = useState({ d1: false, d2: false, d3: false });
  const [reviewDocs, setReviewDocs] = useState([
    { name: 'PAN Card', uploaded: true },
    { name: 'Aadhaar Card', uploaded: true },
    { name: '7/12 Extract', uploaded: true },
    { name: 'Crop Plan', uploaded: false },
    { name: 'Bank Statement', uploaded: true },
    { name: 'Cancelled Cheque', uploaded: true },
    { name: 'Passport Photo', uploaded: true },
    { name: 'Nominee KYC', uploaded: false },
  ]);

  const shareValuation = farmerProfile.loanValuePerShare;
  const scaleOfFinance = farmerProfile.scaleOfFinance;
  const method1 = shares * shareValuation * 0.3;
  const method2 = landAcres * scaleOfFinance;
  const eligibleLimit = Math.min(method1, method2);
  const reqAmount = parseFloat(requestedAmount) || 0;
  const allDeclarationsChecked = Object.values(declarations).every(Boolean);
  const missingDocs = reviewDocs.filter(doc => !doc.uploaded);
  const amountWithinLimit = reqAmount > 0 && reqAmount <= eligibleLimit;
  const canSubmitApplication = amountWithinLimit && allDeclarationsChecked && missingDocs.length === 0;

  const formatCurrency = (n: number) => '₹' + n.toLocaleString('en-IN');

  const addLandParcel = () => {
    setLandParcels([...landParcels, { survey: '', village: '', area: '', crop: '', season: '' }]);
  };

  const handleSubmit = () => {
    if (!canSubmitApplication) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Shell activePage={activePage} onNavigate={onNavigate} breadcrumbs={['Farmer Portal', 'Application Submitted']}>
        <div className="flex flex-col items-center justify-center min-h-96 text-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: '#DCFCE7' }}
          >
            <Check size={48} style={{ color: '#22C55E' }} />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#12151A', marginBottom: '8px' }}>Application Submitted!</h2>
          <p style={{ fontSize: '15px', color: '#9EA8B3', marginBottom: '16px' }}>Your application has been received by our Credit Team. You'll hear back within 2 working days.</p>
          <div
            className="px-6 py-4 rounded-2xl mb-6"
            style={{ backgroundColor: '#E8F5E9', border: '1px solid #DCFCE7' }}
          >
            <div style={{ fontSize: '12px', color: '#2D7A4F', fontWeight: 500, marginBottom: '4px' }}>Application Reference</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#1A3C2A', fontFamily: 'Roboto Mono' }}>LO00000052</div>
          </div>
          <div className="w-full max-w-3xl mb-5"><UniversalStageTracker currentStage={1} /></div>
          <p style={{ fontSize: '14px', color: '#3D4450', marginBottom: '24px' }}>
            If documents are missing, the Credit Team will contact you through app notification, SMS, or phone before assessment continues.
          </p>
          <div className="flex gap-3">
            <button
              className="px-5 py-2.5 rounded-xl border border-[#EDEEF0] transition-all hover:bg-[#F7F8FA]"
              style={{ fontSize: '14px', color: '#3D4450' }}
              onClick={() => onNavigate('farmer-dashboard')}
            >
              Back to Dashboard
            </button>
            <button
              className="px-5 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: '#1A3C2A', color: 'white', fontSize: '14px' }}
              onClick={() => onNavigate('farmer-active-loans')}
            >
              View Application Status →
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Farmer Portal', 'New Loan Application']}
      pageTitle="Apply for Loan"
      pageSubtitle="Complete the 5-step application form"
    >
      {/* Step Indicator */}
      <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-[#EDEEF0]">
        <div className="flex items-center">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                  style={{
                    backgroundColor: step > s.id ? '#1A3C2A' : step === s.id ? '#2D7A4F' : '#EDEEF0',
                    color: step >= s.id ? 'white' : '#9EA8B3',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  {step > s.id ? <Check size={16} /> : s.id}
                </div>
                <div
                  className="mt-1 text-center"
                  style={{ fontSize: '11px', fontWeight: step === s.id ? 600 : 400, color: step >= s.id ? '#1A3C2A' : '#9EA8B3', whiteSpace: 'nowrap' }}
                >
                  {s.label}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div
                  className="flex-1 h-0.5 mx-2 mb-5"
                  style={{ backgroundColor: step > s.id ? '#1A3C2A' : '#EDEEF0' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Step 1: Basic Details */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EDEEF0]">
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#12151A', marginBottom: '4px' }}>Tell us about yourself</h2>
            <p style={{ fontSize: '14px', color: '#9EA8B3', marginBottom: '24px' }}>Step 1 of 5 — Basic personal details</p>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450' }}>Full Name</label>
                <div className="relative">
                  <input value={farmerProfile.fullName} readOnly className="w-full px-4 rounded-xl border border-[#EDEEF0] bg-[#F7F8FA] pr-10" style={{ height: '44px', fontSize: '14px', color: '#9EA8B3' }} />
                  <span className="absolute right-3 top-3" style={{ color: '#9EA8B3' }}>🔒</span>
                </div>
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450' }}>Mobile Number</label>
                <input value={farmerProfile.mobile} readOnly className="w-full px-4 rounded-xl border border-[#EDEEF0] bg-[#F7F8FA]" style={{ height: '44px', fontSize: '14px', color: '#9EA8B3', fontFamily: 'Roboto Mono' }} />
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450' }}>Date of Birth <span style={{ color: '#EF4444' }}>*</span></label>
                <input type="date" className="w-full px-4 rounded-xl border border-[#D1D5DB] focus:outline-none focus:border-[#1A3C2A]" style={{ height: '44px', fontSize: '14px', color: '#12151A' }} />
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450' }}>Alternate Mobile</label>
                <input type="tel" placeholder="Optional" className="w-full px-4 rounded-xl border border-[#D1D5DB] focus:outline-none focus:border-[#1A3C2A]" style={{ height: '44px', fontSize: '14px', color: '#12151A' }} />
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450' }}>Email Address</label>
                <input type="email" placeholder="Optional" className="w-full px-4 rounded-xl border border-[#D1D5DB] focus:outline-none focus:border-[#1A3C2A]" style={{ height: '44px', fontSize: '14px', color: '#12151A' }} />
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450' }}>Gender <span style={{ color: '#EF4444' }}>*</span></label>
                <select className="w-full px-4 rounded-xl border border-[#D1D5DB] focus:outline-none focus:border-[#1A3C2A] bg-white" style={{ height: '44px', fontSize: '14px', color: '#12151A' }}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450' }}>Residential Address <span style={{ color: '#EF4444' }}>*</span></label>
                <textarea rows={3} className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] focus:outline-none focus:border-[#1A3C2A] resize-none" style={{ fontSize: '14px', color: '#12151A' }} placeholder="Enter your full address..." />
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450' }}>Village / Taluka <span style={{ color: '#EF4444' }}>*</span></label>
                <input type="text" defaultValue={`${farmerProfile.village} / ${farmerProfile.taluka}`} className="w-full px-4 rounded-xl border border-[#D1D5DB] focus:outline-none focus:border-[#1A3C2A]" style={{ height: '44px', fontSize: '14px', color: '#12151A' }} />
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450' }}>District / State <span style={{ color: '#EF4444' }}>*</span></label>
                <select className="w-full px-4 rounded-xl border border-[#D1D5DB] focus:outline-none focus:border-[#1A3C2A] bg-white" style={{ height: '44px', fontSize: '14px', color: '#12151A' }}>
                  <option>{farmerProfile.district}, {farmerProfile.state}</option>
                  <option>Pune, Maharashtra</option>
                  <option>Aurangabad, Maharashtra</option>
                </select>
              </div>
            </div>

            {/* Nominee Section */}
            <div className="mt-6 pt-5 border-t border-[#EDEEF0]">
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#12151A' }}>Nominee Details</h3>
                <span className="px-2 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: '#FEF3C7', color: '#F59E0B' }}>Required by SOP</span>
              </div>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { label: 'Nominee Full Name', type: 'text', placeholder: 'Enter nominee name' },
                  { label: 'Nominee Aadhaar Number', type: 'text', placeholder: 'XXXX XXXX XXXX' },
                  { label: 'PAN Number', type: 'text', placeholder: 'ABCDE1234F' },
                  { label: 'Relationship', type: 'select' },
                ].map((field, i) => (
                  <div key={i}>
                    <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450' }}>{field.label} <span style={{ color: '#EF4444' }}>*</span></label>
                    {field.type === 'select' ? (
                      <select className="w-full px-4 rounded-xl border border-[#D1D5DB] focus:outline-none focus:border-[#1A3C2A] bg-white" style={{ height: '44px', fontSize: '14px', color: '#12151A' }}>
                        <option>Spouse</option><option>Son</option><option>Daughter</option><option>Father</option><option>Mother</option>
                      </select>
                    ) : (
                      <input type={field.type} placeholder={field.placeholder} className="w-full px-4 rounded-xl border border-[#D1D5DB] focus:outline-none focus:border-[#1A3C2A]" style={{ height: '44px', fontSize: '14px', color: '#12151A', fontFamily: field.label.includes('Aadhaar') || field.label.includes('PAN') ? 'Roboto Mono' : 'inherit' }} />
                    )}
                  </div>
                ))}
              </div>
              <label className="flex items-start gap-2 mt-3 p-3 rounded-xl" style={{ backgroundColor: nomineeAdult ? '#F0FDF4' : '#FEF3C7', border: `1px solid ${nomineeAdult ? '#BBF7D0' : '#FDE68A'}` }}>
                <input type="checkbox" checked={nomineeAdult} onChange={e => setNomineeAdult(e.target.checked)} className="mt-0.5" style={{ accentColor: '#1A3C2A' }} />
                <span style={{ fontSize: '12px', color: nomineeAdult ? '#166534' : '#92400E', lineHeight: '18px' }}>I confirm nominee age is 18+ and supporting KYC evidence is available. Nominee minors are blocked by SOP.</span>
              </label>
            </div>
            
            {/* KYC Expiry Block */}
            <div className="mt-6 pt-5 border-t border-[#EDEEF0]">
              <div className="p-4 rounded-xl flex gap-3" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
                <div style={{ fontSize: '24px' }}>⚠️</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#991B1B', marginBottom: '4px' }}>Re-KYC Required (SOP Block)</div>
                  <div style={{ fontSize: '13px', color: '#991B1B', lineHeight: '20px' }}>
                    Your last KYC verification was completed more than 2 years ago. As per SOP, you must complete the Re-KYC process with the Compliance team before submitting a new loan application.
                  </div>
                  <button className="mt-3 px-4 py-2 rounded-lg font-semibold" style={{ backgroundColor: '#EF4444', color: 'white', fontSize: '12px' }}>
                    Initiate Re-KYC Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Shareholding */}
        {step === 2 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EDEEF0]">
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#12151A', marginBottom: '4px' }}>Shareholding & Loan Limit</h2>
            <p style={{ fontSize: '14px', color: '#9EA8B3', marginBottom: '24px' }}>Step 2 of 5 — Your shareholding details and eligibility</p>

            {/* Shareholding Info */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Folio Number', value: farmerProfile.folioNo, mono: true },
                  { label: 'Shares Held', value: `${shares} shares`, mono: false },
                  { label: 'Share Type', value: `${farmerProfile.shareType} (D-MAT pending)`, mono: false },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl" style={{ backgroundColor: '#F7F8FA', border: '1px solid #EDEEF0' }}>
                  <div style={{ fontSize: '11px', fontWeight: 500, color: '#9EA8B3', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#12151A', fontFamily: item.mono ? 'Roboto Mono' : 'inherit' }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Calculator Panel */}
            <div className="rounded-2xl p-5 mb-6" style={{ backgroundColor: '#E8F5E9', border: '1px solid #C6E8D0' }}>
              <div className="flex items-center gap-2 mb-4">
                <Calculator size={18} style={{ color: '#2D7A4F' }} />
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1A3C2A' }}>Loan Limit Calculator</h3>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-white rounded-xl p-4">
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A3C2A', marginBottom: '12px' }}>Method 1: Shareholding-Based</div>
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="number"
                      value={shares}
                      onChange={e => setShares(parseInt(e.target.value) || 0)}
                      className="w-20 px-2 rounded-lg border border-[#D1D5DB] text-center focus:outline-none focus:border-[#1A3C2A]"
                      style={{ height: '36px', fontSize: '14px', fontFamily: 'Roboto Mono' }}
                    />
                    <span style={{ fontSize: '12px', color: '#9EA8B3' }}>shares × ₹{shareValuation} × 30%</span>
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: '#22C55E', fontFamily: 'Roboto Mono' }}>
                    {formatCurrency(method1)}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9EA8B3', marginTop: '4px' }}>Based on AGM 2024 valuation</div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A3C2A', marginBottom: '12px' }}>Method 2: Agricultural Land-Based</div>
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="number"
                      value={landAcres}
                      step="0.5"
                      onChange={e => setLandAcres(parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 rounded-lg border border-[#D1D5DB] text-center focus:outline-none focus:border-[#1A3C2A]"
                      style={{ height: '36px', fontSize: '14px', fontFamily: 'Roboto Mono' }}
                    />
                    <span style={{ fontSize: '12px', color: '#9EA8B3' }}>acres × ₹{scaleOfFinance.toLocaleString('en-IN')}/acre</span>
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: '#22C55E', fontFamily: 'Roboto Mono' }}>
                    {formatCurrency(method2)}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9EA8B3', marginTop: '4px' }}>Scale of Finance — FY 2025-26</div>
                </div>
              </div>
              <div
                className="mt-4 p-4 rounded-xl flex items-center justify-between"
                style={{ backgroundColor: '#1A3C2A' }}
              >
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Your Maximum Eligible Loan Amount</span>
                <span style={{ fontSize: '24px', fontWeight: 700, color: 'white', fontFamily: 'Roboto Mono' }}>
                  {formatCurrency(eligibleLimit)}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#2D7A4F', marginTop: '8px' }}>
                Lower of Method 1 ({formatCurrency(method1)}) and Method 2 ({formatCurrency(method2)}). Dashboard eligibility: {formatCurrency(farmerEligibility.eligible)}. Final amount subject to Credit Assessment review.
              </p>
            </div>

            {/* Loan Request */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450' }}>Required Loan Amount <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="number"
                  value={requestedAmount}
                  onChange={e => setRequestedAmount(e.target.value)}
                  placeholder={`Max: ${formatCurrency(eligibleLimit)}`}
                  className="w-full px-4 rounded-xl border border-[#D1D5DB] focus:outline-none focus:border-[#1A3C2A]"
                  style={{ height: '44px', fontSize: '14px', color: '#12151A', fontFamily: 'Roboto Mono' }}
                />
                {reqAmount > eligibleLimit && (
                  <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>⚠️ Amount exceeds eligible limit of {formatCurrency(eligibleLimit)}</p>
                )}
              </div>
              <div>
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450' }}>Purpose of Loan <span style={{ color: '#EF4444' }}>*</span></label>
                <select value={purpose} onChange={e => setPurpose(e.target.value)} className="w-full px-4 rounded-xl border border-[#D1D5DB] focus:outline-none focus:border-[#1A3C2A] bg-white" style={{ height: '44px', fontSize: '14px', color: '#12151A' }}>
                  <option>Crop Production & Farm Inputs</option>
                  <option>Farm Equipment Purchase</option>
                  <option>Irrigation & Infrastructure</option>
                  <option>Post-Harvest Activities</option>
                  <option>Other Agriculture Activity</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450' }}>Purpose Declaration</label>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#166534', marginBottom: '4px' }}>Controlled SOP purpose selected</div>
                  <div style={{ fontSize: '13px', color: '#3D4450', lineHeight: '20px' }}>
                    This application will be processed under the selected category: <strong>{purpose}</strong>. Free-text purposes are disabled to keep the loan file aligned with the approved agriculture-purpose list.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Land & Crop */}
        {step === 3 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EDEEF0]">
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#12151A', marginBottom: '4px' }}>Agricultural Profile</h2>
            <p style={{ fontSize: '14px', color: '#9EA8B3', marginBottom: '24px' }}>Step 3 of 5 — Land, crop, and bank details</p>

            {/* Upload zones */}
            {[
              { label: '7/12 Extract (Satbara)', note: 'PDF or JPG · Max 5MB', required: true },
              { label: 'Crop Plan', note: 'PDF or JPG · Max 5MB', required: true },
              { label: 'Bank Statement (Last 6 months)', note: 'PDF · Max 10MB', required: true },
            ].map((zone, i) => (
              <div key={i} className="mb-4">
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450' }}>
                  {zone.label} {zone.required && <span style={{ color: '#EF4444' }}>*</span>}
                </label>
                <div
                  className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:border-[#2D7A4F] hover:bg-[#F0FDF4]"
                  style={{ borderColor: '#D1D5DB', padding: '20px', backgroundColor: '#FAFAFA' }}
                >
                  <Upload size={24} style={{ color: '#9EA8B3' }} />
                  <span style={{ fontSize: '13px', color: '#3D4450' }}>Drag files here or <span style={{ color: '#1E88E5' }}>click to browse</span></span>
                  <span style={{ fontSize: '11px', color: '#9EA8B3' }}>{zone.note}</span>
                </div>
              </div>
            ))}

            {/* Land Parcels Table */}
            <div className="mt-5 pt-5 border-t border-[#EDEEF0]">
              <div className="flex items-center justify-between mb-3">
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#12151A' }}>Land Parcels</h3>
                <button onClick={addLandParcel} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all" style={{ backgroundColor: '#E8F5E9', color: '#2D7A4F', fontSize: '13px', fontWeight: 500 }}>
                  <Plus size={14} /> Add Land Parcel
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: '#F7F8FA', borderBottom: '1px solid #EDEEF0' }}>
                      {['Survey No.', 'Village', 'Area (acres)', 'Crop', 'Season', ''].map(h => (
                        <th key={h} className="px-3 py-2 text-left" style={{ fontSize: '11px', fontWeight: 500, color: '#9EA8B3' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {landParcels.map((parcel, i) => (
                      <tr key={i} className="border-b border-[#EDEEF0]">
                        {(['survey', 'village', 'area', 'crop', 'season'] as const).map(field => (
                          <td key={field} className="px-2 py-2">
                            <input
                              value={parcel[field]}
                              onChange={e => {
                                const updated = [...landParcels];
                                updated[i] = { ...updated[i], [field]: e.target.value };
                                setLandParcels(updated);
                              }}
                              className="w-full px-2 rounded-lg border border-[#EDEEF0] focus:outline-none focus:border-[#1A3C2A]"
                              style={{ height: '36px', fontSize: '13px', color: '#12151A' }}
                            />
                          </td>
                        ))}
                        <td className="px-2">
                          <button onClick={() => setLandParcels(landParcels.filter((_, j) => j !== i))}>
                            <Trash2 size={14} style={{ color: '#EF4444' }} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bank Details */}
            <div className="mt-5 pt-5 border-t border-[#EDEEF0]">
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#12151A', marginBottom: '16px' }}>Bank Account Details</h3>
              <div className="grid grid-cols-2 gap-4">
                {['Account Holder Name', 'Bank Name', 'Account Number', 'IFSC Code', 'Branch Name'].map((label, i) => (
                  <div key={i}>
                    <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450' }}>{label} <span style={{ color: '#EF4444' }}>*</span></label>
                    <input type="text" className="w-full px-4 rounded-xl border border-[#D1D5DB] focus:outline-none focus:border-[#1A3C2A]" style={{ height: '44px', fontSize: '14px', color: '#12151A', fontFamily: label.includes('IFSC') || label.includes('Account Number') ? 'Roboto Mono' : 'inherit' }} />
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450' }}>Upload Cancelled Cheque <span style={{ color: '#EF4444' }}>*</span></label>
                <div className="border-2 border-dashed rounded-xl p-5 flex items-center gap-3 cursor-pointer hover:border-[#2D7A4F] transition-colors" style={{ borderColor: '#D1D5DB' }}>
                  <Upload size={20} style={{ color: '#9EA8B3' }} />
                  <span style={{ fontSize: '13px', color: '#3D4450' }}>Upload scanned copy of cancelled cheque</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: KYC */}
        {step === 4 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EDEEF0]">
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#12151A', marginBottom: '4px' }}>Identity Verification</h2>
            <p style={{ fontSize: '14px', color: '#9EA8B3', marginBottom: '24px' }}>Step 4 of 5 — KYC documents and declarations</p>

            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#12151A', marginBottom: '12px' }}>Applicant KYC</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: 'PAN Card', note: 'JPG/PDF · Max 5MB · Self-attested copy required', required: true },
                { label: 'Aadhaar Card', note: 'JPG/PDF · Max 5MB', required: true },
                { label: 'Share Certificates', note: 'JPG/PDF · Max 10MB · For physical shares only', required: false },
                { label: 'Passport Photo', note: 'JPG only · Max 500KB', required: true },
              ].map((doc, i) => (
                <div key={i}>
                  <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450' }}>
                    {doc.label} {doc.required && <span style={{ color: '#EF4444' }}>*</span>}
                  </label>
                  <div className="border-2 border-dashed rounded-xl p-4 flex items-center gap-2 cursor-pointer hover:border-[#2D7A4F] hover:bg-[#F0FDF4] transition-all" style={{ borderColor: '#D1D5DB' }}>
                    <Upload size={18} style={{ color: '#9EA8B3' }} />
                    <div>
                      <span style={{ fontSize: '13px', color: '#3D4450' }}>Upload {doc.label}</span>
                      <div style={{ fontSize: '11px', color: '#9EA8B3' }}>{doc.note}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#12151A', marginBottom: '12px' }}>Nominee KYC</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {['PAN Card (Nominee)', 'Aadhaar Card (Nominee)', 'Passport Photo (Nominee)'].map((label, i) => (
                <div key={i}>
                  <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450' }}>{label} <span style={{ color: '#EF4444' }}>*</span></label>
                  <div className="border-2 border-dashed rounded-xl p-4 flex items-center gap-2 cursor-pointer hover:border-[#2D7A4F] hover:bg-[#F0FDF4] transition-all" style={{ borderColor: '#D1D5DB' }}>
                    <Upload size={18} style={{ color: '#9EA8B3' }} />
                    <span style={{ fontSize: '13px', color: '#3D4450' }}>Upload {label}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-5 border-t border-[#EDEEF0]">
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#12151A', marginBottom: '12px' }}>Declarations</h3>
              <div className="space-y-3">
                {[
                  { key: 'd1' as const, text: 'I declare that I am not a wilful defaulter and have no pending dues with any financial institution.' },
                  { key: 'd2' as const, text: 'I consent to CKYC and credit bureau enquiries as required for loan processing.' },
                  { key: 'd3' as const, text: 'I declare that the pledged asset (shares) is not already encumbered or pledged elsewhere.' },
                ].map(decl => (
                  <label key={decl.key} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={declarations[decl.key]}
                      onChange={e => setDeclarations({ ...declarations, [decl.key]: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded"
                      style={{ accentColor: '#1A3C2A' }}
                    />
                    <span style={{ fontSize: '13px', color: '#3D4450', lineHeight: '20px' }}>{decl.text}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {step === 5 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EDEEF0]">
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#12151A', marginBottom: '4px' }}>Review & Submit</h2>
            <p style={{ fontSize: '14px', color: '#9EA8B3', marginBottom: '24px' }}>Step 5 of 5 — Review all details before submitting</p>

            {/* Loan Summary Card */}
            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: '#1A3C2A' }}>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '12px', fontWeight: 500 }}>LOAN SUMMARY</div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Requested Amount</div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: 'white', fontFamily: 'Roboto Mono' }}>{requestedAmount ? formatCurrency(parseFloat(requestedAmount)) : '₹—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Eligible Limit</div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: '#DCFCE7', fontFamily: 'Roboto Mono' }}>{formatCurrency(eligibleLimit)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Purpose</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: 'white' }}>{purpose}</div>
                </div>
              </div>
            </div>

            {/* Accordion sections */}
            {[
                  { title: 'Personal Details', content: `Name: ${farmerProfile.fullName} · Mobile: ${farmerProfile.mobile} · Village: ${farmerProfile.village}, ${farmerProfile.district}` },
              { title: 'Shareholding Details', content: `Folio: SH-04821 · ${shares} shares · Share Type: Physical` },
              { title: 'Land Details', content: `${landAcres} acres · ${landParcels.length} parcel(s) registered` },
              { title: 'Bank Account', content: 'Account verified · RBL Bank · IFSC: RBLS0000234' },
            ].map((section, i) => (
              <div key={i} className="mb-3 p-4 rounded-xl border border-[#EDEEF0] flex items-center justify-between">
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#12151A' }}>{section.title}</div>
                  <div style={{ fontSize: '13px', color: '#9EA8B3', marginTop: '2px' }}>{section.content}</div>
                </div>
                <button style={{ fontSize: '13px', color: '#1E88E5' }}>Edit</button>
              </div>
            ))}

            {/* Document Checklist */}
            <div className="mt-5 pt-5 border-t border-[#EDEEF0]">
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#12151A', marginBottom: '12px' }}>Document Checklist</h3>
              <div className="grid grid-cols-2 gap-2">
                {reviewDocs.map((doc, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      const updated = [...reviewDocs];
                      updated[i] = { ...updated[i], uploaded: !updated[i].uploaded };
                      setReviewDocs(updated);
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg text-left"
                    style={{ backgroundColor: doc.uploaded ? '#F0FDF4' : '#FEF2F2' }}
                  >
                    <span style={{ color: doc.uploaded ? '#22C55E' : '#EF4444', fontSize: '16px' }}>{doc.uploaded ? '✓' : '✗'}</span>
                    <span style={{ fontSize: '13px', color: doc.uploaded ? '#1A3C2A' : '#EF4444' }}>{doc.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 p-4 rounded-xl" style={{ backgroundColor: canSubmitApplication ? '#F0FDF4' : '#FEF3C7', border: `1px solid ${canSubmitApplication ? '#BBF7D0' : '#FDE68A'}` }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: canSubmitApplication ? '#166534' : '#92400E', marginBottom: '4px' }}>
                {canSubmitApplication ? 'Ready for submission' : 'Submission blocked by SOP checks'}
              </div>
              {!canSubmitApplication && (
                <div style={{ fontSize: '12px', color: '#92400E', lineHeight: '18px', marginBottom: '8px' }}>
                  {!amountWithinLimit && 'Enter a requested amount within the calculated eligible limit. '}
                  {!allDeclarationsChecked && 'Complete all mandatory declarations. '}
                  {missingDocs.length > 0 && `Upload required documents: ${missingDocs.map(d => d.name).join(', ')}.`}
                </div>
              )}
              <p style={{ fontSize: '13px', color: '#3D4450', lineHeight: '20px' }}>
                By submitting, you agree to the Loan Terms and authorize SFPCL to verify your details, conduct credit bureau enquiries, and process this application per Section 378ZK of the Companies Act, 2013.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full mt-5 py-3 rounded-xl font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2"
              disabled={!canSubmitApplication}
              style={{ backgroundColor: canSubmitApplication ? '#1A3C2A' : '#9EA8B3', color: 'white', fontSize: '15px', cursor: canSubmitApplication ? 'pointer' : 'not-allowed' }}
            >
              Submit Application →
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-5">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onNavigate('farmer-dashboard')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#EDEEF0] transition-all hover:bg-[#F7F8FA]"
            style={{ fontSize: '14px', color: '#3D4450' }}
          >
            <ChevronLeft size={16} /> {step > 1 ? 'Previous' : 'Back to Dashboard'}
          </button>
          {step < 5 && (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !nomineeAdult}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: step === 1 && !nomineeAdult ? '#9EA8B3' : '#1A3C2A', color: 'white', fontSize: '14px', cursor: step === 1 && !nomineeAdult ? 'not-allowed' : 'pointer' }}
            >
              Next: {steps[step].label} <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </Shell>
  );
}
