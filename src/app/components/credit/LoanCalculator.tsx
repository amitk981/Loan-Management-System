import { useState } from 'react';
import { Calculator, RefreshCw } from 'lucide-react';
import { Shell } from '../layout/Shell';
import { formatCurrency } from '../../lib/format';

interface LoanCalculatorProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

export function LoanCalculator({ onNavigate, activePage }: LoanCalculatorProps) {
  const [shares, setShares] = useState(250);
  const [landAcres, setLandAcres] = useState(2.5);

  const shareValuation = 200;
  const scaleOfFinance = 20000;
  const method1 = shares * shareValuation * 0.3;
  const method2 = landAcres * scaleOfFinance;
  const eligible = Math.min(method1, method2);
  const limitingMethod = method1 <= method2 ? 'Method 1 (Shareholding-based)' : 'Method 2 (Land-based)';
  const isMethod1Limiting = method1 <= method2;


  const reset = () => { setShares(0); setLandAcres(0); };

  return (
    <Shell
      activePage={activePage}
      onNavigate={onNavigate}
      breadcrumbs={['Credit Assessment', 'Loan Calculator']}
      pageTitle="Loan Eligibility Calculator"
      pageSubtitle="SFPCL member loan limit calculation tool"
    >
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl p-6 border border-[#EDEEF0] mb-5">
          <div className="flex items-center gap-2 mb-5">
            <Calculator size={20} style={{ color: 'var(--brand-secondary)' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--neutral-900)' }}>Calculate Loan Eligibility</h3>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Method 1 */}
            <div className="p-5 rounded-2xl" style={{ backgroundColor: '#F0FDF4', border: '1px solid #DCFCE7' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '16px' }}>
                Method 1: Shareholding-Based
              </div>
              <div className="mb-4">
                <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: 500, color: 'var(--brand-secondary)' }}>Number of Shares</label>
                <input
                  type="number"
                  value={shares}
                  onChange={e => setShares(parseInt(e.target.value) || 0)}
                  className="w-full px-4 rounded-xl border border-[#A7F3D0] focus:outline-none bg-white"
                  style={{ height: '48px', fontSize: '20px', fontFamily: 'Roboto Mono', fontWeight: 600, color: 'var(--neutral-900)' }}
                />
              </div>

              <div className="p-3 rounded-xl mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}>
                <div style={{ fontSize: '12px', color: 'var(--neutral-400)' }}>Formula</div>
                <div style={{ fontSize: '14px', color: 'var(--neutral-900)', fontFamily: 'Roboto Mono', marginTop: '4px' }}>
                  [{shares} shares] × [₹{shareValuation} × 30%]
                </div>
                <div style={{ fontSize: '11px', color: 'var(--neutral-400)', marginTop: '2px' }}>Share valuation: ₹{shareValuation}/share (AGM 2024)</div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--brand-secondary)', fontWeight: 500, marginBottom: '4px' }}>Result</div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--success-500)', fontFamily: 'Roboto Mono' }}>
                  {formatCurrency(method1)}
                </div>
              </div>
              {isMethod1Limiting && (
                <div className="mt-4 p-3 rounded-xl flex items-center gap-2" style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}>
                  <span style={{ fontSize: '18px' }}>→</span>
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>Limiting method used for eligible amount</span>
                </div>
              )}
            </div>

            {/* Method 2 */}
            <div className="p-5 rounded-2xl" style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E40AF', marginBottom: '16px' }}>
                Method 2: Agricultural Land-Based
              </div>
              <div className="mb-4">
                <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: 500, color: 'var(--info-500)' }}>Land Area (acres)</label>
                <input
                  type="number"
                  value={landAcres}
                  step="0.25"
                  onChange={e => setLandAcres(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 rounded-xl border border-[#BFDBFE] focus:outline-none bg-white"
                  style={{ height: '48px', fontSize: '20px', fontFamily: 'Roboto Mono', fontWeight: 600, color: 'var(--neutral-900)' }}
                />
              </div>

              <div className="p-3 rounded-xl mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}>
                <div style={{ fontSize: '12px', color: 'var(--neutral-400)' }}>Formula</div>
                <div style={{ fontSize: '14px', color: 'var(--neutral-900)', fontFamily: 'Roboto Mono', marginTop: '4px' }}>
                  [{landAcres} acres] × [₹{scaleOfFinance.toLocaleString('en-IN')}/acre]
                </div>
                <div style={{ fontSize: '11px', color: 'var(--neutral-400)', marginTop: '2px' }}>Scale of Finance FY 2025-26</div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--info-500)', fontWeight: 500, marginBottom: '4px' }}>Result</div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--info-500)', fontFamily: 'Roboto Mono' }}>
                  {formatCurrency(method2)}
                </div>
              </div>
              {!isMethod1Limiting && (
                <div className="mt-4 p-3 rounded-xl flex items-center gap-2" style={{ backgroundColor: '#1E40AF', color: 'white' }}>
                  <span style={{ fontSize: '18px' }}>→</span>
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>Limiting method used for eligible amount</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Result Banner */}
        <div
          className="rounded-2xl p-6 mb-5 relative overflow-hidden"
          style={{ backgroundColor: 'var(--brand-primary)' }}
        >
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #1E88E5 0%, transparent 60%)' }} />
          <div className="relative flex items-center justify-between">
            <div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: 500, marginBottom: '4px' }}>MAXIMUM ELIGIBLE LOAN AMOUNT</div>
              <div style={{ fontSize: '48px', fontWeight: 700, color: 'white', fontFamily: 'Roboto Mono', lineHeight: '56px' }}>
                {formatCurrency(eligible)}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'var(--success-100)', fontSize: '12px', fontWeight: 500 }}
                >
                  ← Limiting: {limitingMethod}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Comparison</div>
              <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)' }}>M1: {formatCurrency(method1)}</div>
              <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)' }}>M2: {formatCurrency(method2)}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#EDEEF0] hover:bg-[#F7F8FA] transition-all"
            style={{ fontSize: '14px', color: 'var(--neutral-700)' }}
          >
            <RefreshCw size={14} /> Reset Calculator
          </button>
          <button
            className="flex-1 py-3 rounded-xl font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--brand-primary)', color: 'white', fontSize: '14px' }}
            onClick={() => onNavigate('credit-review')}
          >
            Use in Appraisal →
          </button>
        </div>

        <div className="mt-5 p-4 rounded-xl" style={{ backgroundColor: 'var(--warning-100)', border: '1px solid #FDE68A' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#92400E', marginBottom: '4px' }}>⚠️ Configurable Parameters (Super Admin only)</div>
          <div style={{ fontSize: '12px', color: '#92400E', lineHeight: '20px' }}>
            Share valuation: ₹{shareValuation}/share (Board approved, AGM 2024) · Scale of Finance: ₹{scaleOfFinance.toLocaleString('en-IN')}/acre (FY 2025-26) · Pledge %: 30% of NAV
          </div>
        </div>
      </div>
    </Shell>
  );
}
