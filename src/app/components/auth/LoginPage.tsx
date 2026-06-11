import { useEffect, useState } from 'react';
import { Eye, EyeOff, ChevronRight, Smartphone, Lock, CheckCircle } from 'lucide-react';
import { useAuth, UserRole, mockUsers } from '../../context/AuthContext';

type RolePill = { id: UserRole; label: string; icon: string };
const rolePills: RolePill[] = [
  { id: 'farmer', label: 'Farmer / FPC', icon: '🌾' },
  { id: 'credit', label: 'Credit Team', icon: '📊' },
  { id: 'compliance', label: 'CS / Compliance', icon: '📋' },
  { id: 'sanction', label: 'Sanction Committee', icon: '✅' },
  { id: 'treasury', label: 'Finance / Treasury', icon: '💰' },
];

type LoginMethod = 'otp' | 'password';
type OTPState = 'input-mobile' | 'input-otp' | 'sending';
type AuthView = 'login' | 'reset';

const roleIllustrations: Record<UserRole, { title: string; subtitle: string; accent: string }> = {
  farmer: { title: 'Farmer Loan Portal', subtitle: 'Apply for loans, track status, manage repayments — all in one place.', accent: '#DDEDD7' },
  credit: { title: 'Credit Assessment', subtitle: 'Review applications, prepare appraisals, monitor portfolio health.', accent: '#BFE0FF' },
  compliance: { title: 'Compliance Portal', subtitle: 'Manage documents, KYC, compliance calendar, and NOC issuance.', accent: '#DDF5E6' },
  sanction: { title: 'Sanction Committee', subtitle: 'Review and approve loan applications with complete audit trail.', accent: '#E9D5FF' },
  treasury: { title: 'Finance & Treasury', subtitle: 'Initiate disbursements, manage SAP entries, track repayments.', accent: '#CFFAFE' },
  admin: { title: 'System Administration', subtitle: 'Manage users, roles, audit logs, and system configuration.', accent: '#EDEEF0' },
};

function RoleLineArt({ color }: { color: string }) {
  return (
    <svg width="300" height="220" viewBox="0 0 300 220" role="img" aria-label="Farmer receiving digital loan illustration">
      <rect x="42" y="76" width="216" height="96" rx="26" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.22)" />
      <path d="M82 126c18-20 38-20 56 0 18 20 38 20 56 0" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <circle cx="86" cy="82" r="26" fill="none" stroke={color} strokeWidth="4" />
      <path d="M66 112c13-12 27-18 42-18 13 0 26 5 38 15" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <rect x="178" y="58" width="58" height="86" rx="12" fill="none" stroke={color} strokeWidth="4" />
      <path d="M192 82h30M192 100h30M192 118h18" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <path d="M113 156c20-18 52-18 74 0M132 66c18-18 42-18 60 0" stroke="rgba(255,255,255,0.45)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="232" cy="162" r="20" fill="none" stroke="#FDE68A" strokeWidth="4" />
      <path d="M223 162h18M232 153v18" stroke="#FDE68A" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function LoginPage() {
  const { login } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('otp');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpState, setOtpState] = useState<OTPState>('input-mobile');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpError, setOtpError] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetIdentity, setResetIdentity] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirm, setResetConfirm] = useState('');

  const illustration = roleIllustrations[selectedRole];

  useEffect(() => {
    if (otpState !== 'input-otp' || otpTimer <= 0) return;
    const timer = window.setTimeout(() => setOtpTimer(t => Math.max(0, t - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [otpState, otpTimer]);

  const handleSendOTP = () => {
    if (mobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpState('input-otp');
      setOtpTimer(60);
    }, 1000);
  };

  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
    if (newOtp.every(d => d !== '')) {
      if (newOtp.join('') === '123456') {
        handleLogin();
      } else {
        setError('Invalid OTP. Please enter the 6-digit demo code 123456.');
        setOtpError(true);
        window.setTimeout(() => setOtpError(false), 600);
      }
    }
  };

  const handleLogin = () => {
    if (loginMethod === 'otp' && otpState === 'input-otp' && otp.join('') !== '123456') {
      setError('Invalid OTP. Please enter the 6-digit demo code 123456.');
      setOtpError(true);
      window.setTimeout(() => setOtpError(false), 600);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const user = mockUsers[selectedRole];
      login(user);
    }, 800);
  };

  const resendOtp = () => {
    if (otpTimer > 0) return;
    setOtp(['', '', '', '', '', '']);
    setError('');
    setOtpTimer(60);
  };

  const resetStrength = [
    resetPassword.length >= 8,
    /[A-Z]/.test(resetPassword),
    /\d/.test(resetPassword),
    /[^A-Za-z0-9]/.test(resetPassword),
  ];
  const resetStrengthCount = resetStrength.filter(Boolean).length;

  const handlePasswordLogin = () => {
    if (!password) { setError('Please enter your password'); return; }
    setLoading(true);
    setTimeout(() => {
      const user = mockUsers[selectedRole];
      login(user);
    }, 800);
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes otp-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .otp-shake { animation: otp-shake 0.45s ease-in-out; }
      `}</style>
      {/* Left Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-between py-12 px-10"
        style={{ backgroundColor: '#1A3C2A' }}
      >
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-lg" style={{ backgroundColor: '#1E88E5' }}>W</div>
            <span style={{ fontSize: '20px', fontWeight: 700, color: 'white', letterSpacing: '-0.3px' }}>WhatsLoan</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <span className="text-white text-xs">SF</span>
            </div>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Sahyadri Farms</span>
          </div>
        </div>

        <div className="flex flex-col items-center text-center max-w-sm">
          <div className="mb-8">
            <RoleLineArt color={illustration.accent} />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'white', lineHeight: '36px', marginBottom: '12px' }}>
            {illustration.title}
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.65)', lineHeight: '24px' }}>
            {illustration.subtitle}
          </p>

          <div className="flex items-center gap-3 mt-10">
            {['₹0 Paper', 'Digital Approvals', 'Instant Disbursement'].map((chip, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 500,
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
          Agri Credit, Simplified
          <br />
          <span style={{ fontSize: '11px' }}>SFPCL Loan Management Platform</span>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm">
          <div className="flex justify-end mb-6">
            <div className="flex items-center rounded-lg border border-[#EDEEF0] overflow-hidden">
              {['English', 'मराठी', 'हिंदी'].map((l, i) => (
                <button key={i} className="px-3 py-1.5" style={{ fontSize: '12px', color: '#3D4450' }}>{l}</button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#12151A', lineHeight: '36px', marginBottom: '6px' }}>
              {authView === 'reset' ? 'Reset Password' : 'Welcome Back'}
            </h1>
            <p style={{ fontSize: '14px', color: '#9EA8B3' }}>
              {authView === 'reset' ? 'Complete the 3-step reset flow' : 'Log in to your loan portal'}
            </p>
          </div>

          {/* Role Selector */}
          <div className="mb-6">
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450', display: 'block', marginBottom: '8px' }}>
              Select your role
            </label>
            <div className="flex flex-wrap gap-2">
              {rolePills.map(role => (
                <button
                  key={role.id}
                  onClick={() => { setSelectedRole(role.id); setOtpState('input-mobile'); setOtp(['','','','','','']); setError(''); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all"
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    backgroundColor: selectedRole === role.id ? '#1A3C2A' : 'white',
                    color: selectedRole === role.id ? 'white' : '#3D4450',
                    border: selectedRole === role.id ? '1px solid #1A3C2A' : '1px solid #EDEEF0',
                  }}
                >
                  <span>{role.icon}</span>
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {authView === 'reset' ? (
            <div>
              <div className="flex items-center justify-between mb-5">
                {[1, 2, 3].map(s => (
                  <div key={s} className="flex items-center flex-1">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: resetStep >= s ? '#1A3C2A' : '#EDEEF0',
                        color: resetStep >= s ? 'white' : '#9EA8B3',
                        fontSize: '13px',
                        fontWeight: 700,
                      }}
                    >
                      {resetStep > s ? <CheckCircle size={14} /> : s}
                    </div>
                    {s < 3 && <div className="flex-1 h-0.5 mx-2" style={{ backgroundColor: resetStep > s ? '#1A3C2A' : '#EDEEF0' }} />}
                  </div>
                ))}
              </div>

              {resetStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450', display: 'block', marginBottom: '6px' }}>Registered mobile or employee ID</label>
                    <input
                      value={resetIdentity}
                      onChange={e => setResetIdentity(e.target.value)}
                      placeholder="Mobile / Employee ID"
                      className="w-full px-4 rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:border-[#1A3C2A]"
                      style={{ height: '44px', fontSize: '14px', color: '#12151A' }}
                    />
                  </div>
                  <button
                    disabled={!resetIdentity.trim()}
                    onClick={() => setResetStep(2)}
                    className="w-full rounded-xl flex items-center justify-center gap-2 font-semibold"
                    style={{ height: '44px', backgroundColor: resetIdentity.trim() ? '#1A3C2A' : '#9EA8B3', color: 'white', fontSize: '14px', cursor: resetIdentity.trim() ? 'pointer' : 'not-allowed' }}
                  >
                    Send Reset OTP <ChevronRight size={16} />
                  </button>
                </div>
              )}

              {resetStep === 2 && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: '#F7F8FA' }}>
                    <div style={{ fontSize: '13px', color: '#3D4450' }}>Reset OTP sent to registered channel</div>
                    <div style={{ fontSize: '11px', color: '#9EA8B3', marginTop: '2px' }}>Use demo code 123456</div>
                  </div>
                  <input
                    value={resetCode}
                    onChange={e => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 rounded-xl border border-[#D1D5DB] text-center focus:outline-none focus:ring-2 focus:border-[#1A3C2A]"
                    style={{ height: '52px', fontSize: '22px', color: '#12151A', fontFamily: 'Roboto Mono', letterSpacing: '8px' }}
                  />
                  <div className="flex gap-3">
                    <button onClick={() => setResetStep(1)} className="flex-1 rounded-xl border border-[#EDEEF0]" style={{ height: '44px', fontSize: '14px', color: '#3D4450' }}>Back</button>
                    <button
                      disabled={resetCode !== '123456'}
                      onClick={() => setResetStep(3)}
                      className="flex-1 rounded-xl font-semibold"
                      style={{ height: '44px', backgroundColor: resetCode === '123456' ? '#1A3C2A' : '#9EA8B3', color: 'white', fontSize: '14px', cursor: resetCode === '123456' ? 'pointer' : 'not-allowed' }}
                    >
                      Verify OTP
                    </button>
                  </div>
                </div>
              )}

              {resetStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450', display: 'block', marginBottom: '6px' }}>New password</label>
                    <input
                      type="password"
                      value={resetPassword}
                      onChange={e => setResetPassword(e.target.value)}
                      placeholder="Create new password"
                      className="w-full px-4 rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:border-[#1A3C2A]"
                      style={{ height: '44px', fontSize: '14px', color: '#12151A' }}
                    />
                    <div className="grid grid-cols-4 gap-1 mt-2">
                      {[0, 1, 2, 3].map(i => (
                        <div key={i} className="h-1.5 rounded-full" style={{ backgroundColor: i < resetStrengthCount ? ['#EF4444', '#F59E0B', '#1E88E5', '#22C55E'][Math.max(0, resetStrengthCount - 1)] : '#EDEEF0' }} />
                      ))}
                    </div>
                    <div style={{ fontSize: '11px', color: '#9EA8B3', marginTop: '4px' }}>8 chars, uppercase, number, special character</div>
                  </div>
                  <input
                    type="password"
                    value={resetConfirm}
                    onChange={e => setResetConfirm(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full px-4 rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:border-[#1A3C2A]"
                    style={{ height: '44px', fontSize: '14px', color: '#12151A' }}
                  />
                  <button
                    disabled={resetStrengthCount < 4 || resetPassword !== resetConfirm}
                    onClick={() => { setAuthView('login'); setLoginMethod('password'); setResetStep(1); setPassword(resetPassword); }}
                    className="w-full rounded-xl font-semibold"
                    style={{ height: '44px', backgroundColor: resetStrengthCount === 4 && resetPassword === resetConfirm ? '#1A3C2A' : '#9EA8B3', color: 'white', fontSize: '14px', cursor: resetStrengthCount === 4 && resetPassword === resetConfirm ? 'pointer' : 'not-allowed' }}
                  >
                    Update Password
                  </button>
                </div>
              )}

              <div className="text-center mt-4">
                <button onClick={() => { setAuthView('login'); setError(''); }} style={{ fontSize: '12px', color: '#1E88E5' }}>
                  Back to login
                </button>
              </div>
            </div>
          ) : (
            <>
          {/* Login Method Toggle */}
          <div className="flex items-center gap-2 mb-5">
            <button
              onClick={() => setLoginMethod('otp')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
              style={{
                fontSize: '13px',
                fontWeight: 500,
                backgroundColor: loginMethod === 'otp' ? '#E8F5E9' : 'transparent',
                color: loginMethod === 'otp' ? '#1A3C2A' : '#9EA8B3',
              }}
            >
              <Smartphone size={14} /> OTP Login
            </button>
            <button
              onClick={() => setLoginMethod('password')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
              style={{
                fontSize: '13px',
                fontWeight: 500,
                backgroundColor: loginMethod === 'password' ? '#E8F5E9' : 'transparent',
                color: loginMethod === 'password' ? '#1A3C2A' : '#9EA8B3',
              }}
            >
              <Lock size={14} /> Password Login
            </button>
          </div>

          {loginMethod === 'otp' ? (
            <div>
              {otpState === 'input-mobile' && (
                <div className="mb-4">
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450', display: 'block', marginBottom: '6px' }}>
                    Mobile Number <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div className="flex gap-2">
                    <div
                      className="flex items-center gap-2 px-3 rounded-xl border border-[#D1D5DB] bg-white"
                      style={{ height: '44px', fontSize: '14px', color: '#3D4450' }}
                    >
                      🇮🇳 +91
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      value={mobile}
                      onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 10-digit number"
                      className="flex-1 px-4 rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:border-[#1A3C2A]"
                      style={{ height: '44px', fontSize: '14px', color: '#12151A' }}
                    />
                  </div>
                  {error && <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '6px' }}>{error}</p>}
                  <button
                    className="w-full mt-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all"
                    style={{
                      height: '44px',
                      backgroundColor: '#1A3C2A',
                      color: 'white',
                      fontSize: '14px',
                      opacity: loading ? 0.7 : 1,
                    }}
                    onClick={handleSendOTP}
                    disabled={loading}
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'} <ChevronRight size={16} />
                  </button>
                </div>
              )}

              {otpState === 'input-otp' && (
                <div>
                  <div className="mb-2 p-3 rounded-xl" style={{ backgroundColor: '#F7F8FA' }}>
                    <p style={{ fontSize: '13px', color: '#3D4450' }}>
                      OTP sent to <span style={{ fontFamily: 'Roboto Mono', fontWeight: 600 }}>+91 ****{mobile.slice(-4)}</span>
                    </p>
                    <button
                      style={{ fontSize: '12px', color: '#1E88E5', marginTop: '2px' }}
                      onClick={() => setOtpState('input-mobile')}
                    >
                      Change number
                    </button>
                  </div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450', display: 'block', marginBottom: '8px' }}>
                    Enter OTP <span style={{ fontSize: '11px', color: '#9EA8B3', fontWeight: 400 }}>(use 123456 for demo)</span>
                  </label>
                  <div className={`flex gap-2 justify-between mb-4 ${otpError ? 'otp-shake' : ''}`}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOTPChange(i, e.target.value)}
                        className="border rounded-xl text-center focus:outline-none focus:ring-2 focus:border-[#1A3C2A] transition-all"
                        style={{
                          width: '48px',
                          height: '52px',
                          fontSize: '22px',
                          fontFamily: 'Roboto Mono, monospace',
                          fontWeight: 600,
                          color: '#12151A',
                          borderColor: otpError ? '#EF4444' : '#D1D5DB',
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Backspace' && !digit && i > 0) {
                            document.getElementById(`otp-${i - 1}`)?.focus();
                          }
                        }}
                      />
                    ))}
                  </div>
                  <button
                    className="w-full rounded-xl flex items-center justify-center gap-2 font-semibold transition-all"
                    style={{ height: '44px', backgroundColor: '#1A3C2A', color: 'white', fontSize: '14px', opacity: loading ? 0.7 : 1 }}
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Verify & Login'} <ChevronRight size={16} />
                  </button>
                  {error && <p style={{ fontSize: '12px', color: '#EF4444', textAlign: 'center', marginTop: '8px' }}>{error}</p>}
                  <div style={{ fontSize: '12px', color: '#9EA8B3', textAlign: 'center', marginTop: '12px' }}>
                    {otpTimer > 0 ? (
                      <>Resend OTP in <span style={{ fontFamily: 'Roboto Mono', color: '#1A3C2A', fontWeight: 600 }}>{otpTimer}s</span></>
                    ) : (
                      <button onClick={resendOtp} style={{ color: '#1E88E5', fontWeight: 600 }}>Resend OTP</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450', display: 'block', marginBottom: '6px' }}>
                  Username / Employee ID
                </label>
                <input
                  type="text"
                  placeholder="Enter username"
                  className="w-full px-4 rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:border-[#1A3C2A]"
                  style={{ height: '44px', fontSize: '14px', color: '#12151A' }}
                />
              </div>
              <div className="mb-4 relative">
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#3D4450', display: 'block', marginBottom: '6px' }}>
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 pr-12 rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:border-[#1A3C2A]"
                  style={{ height: '44px', fontSize: '14px', color: '#12151A' }}
                />
                <button
                  className="absolute right-4 top-9"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ color: '#9EA8B3' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && <p style={{ fontSize: '12px', color: '#EF4444', marginBottom: '8px' }}>{error}</p>}
              <button
                className="w-full rounded-xl flex items-center justify-center gap-2 font-semibold transition-all"
                style={{ height: '44px', backgroundColor: '#1A3C2A', color: 'white', fontSize: '14px', opacity: loading ? 0.7 : 1 }}
                onClick={handlePasswordLogin}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login →'}
              </button>
              <div className="text-center mt-3">
                <button onClick={() => { setAuthView('reset'); setError(''); }} style={{ fontSize: '12px', color: '#1E88E5' }}>Forgot Password?</button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 mt-5">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              className="w-4 h-4 rounded"
              style={{ accentColor: '#1A3C2A' }}
            />
            <label htmlFor="remember" style={{ fontSize: '13px', color: '#3D4450' }}>Remember this device for 30 days</label>
          </div>

          <div className="mt-8 pt-6 border-t border-[#EDEEF0] text-center">
            <div className="flex items-center justify-center gap-4">
              {['Privacy Policy', 'Terms of Use', 'Help'].map((link, i) => (
                <a key={i} href="#" style={{ fontSize: '12px', color: '#9EA8B3' }}>{link}</a>
              ))}
            </div>
            <p style={{ fontSize: '11px', color: '#9EA8B3', marginTop: '8px' }}>
              SFPCL Loan Management v1.0 · Powered by WhatsLoan
            </p>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
