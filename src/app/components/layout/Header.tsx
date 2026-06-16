import { useEffect, useRef, useState } from 'react';
import { Bell, Search, Menu, ChevronDown, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AppLanguage, useLanguage } from '../../context/LanguageContext';
import { mockNotifications } from '../../data/mockData';
import { crossRoleNotifications } from '../../data/crossRoleData';

interface HeaderProps {
  onMenuToggle: () => void;
  onNavigate: (page: string) => void;
  breadcrumbs?: string[];
}

export function Header({ onMenuToggle, onNavigate, breadcrumbs = [] }: HeaderProps) {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsRead, setNotificationsRead] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const roleNotifications = crossRoleNotifications.filter(n => n.toRole === user?.role || n.toRole === 'all');
  const rawUnreadCount = roleNotifications.length || mockNotifications.filter(n => !n.read && (n.role === user?.role || n.role === 'all')).length;
  const unreadCount = notificationsRead ? 0 : rawUnreadCount;

  const roleSearchItems: Record<string, { label: string; meta: string; page: string }[]> = {
    farmer: [
      { label: 'My Dashboard', meta: 'Loan hero, tracker and alerts', page: 'farmer-dashboard' },
      { label: 'My Active Loan', meta: 'Status, documents and repayment', page: 'farmer-active-loans' },
      { label: 'Apply for Loan', meta: '5-step application wizard', page: 'farmer-apply' },
      { label: 'Make Payment', meta: 'Direct transfer or subsidiary deduction', page: 'farmer-repayment' },
      { label: 'My Documents', meta: 'PoA, agreement, NOC downloads', page: 'farmer-documents' },
      { label: 'Support & Grievance', meta: 'Raise complaint or get help', page: 'farmer-support' },
    ],
    credit: [
      { label: 'New Applications', meta: 'Intake queue with filters', page: 'credit-queue' },
      { label: 'Appraisal Note', meta: 'Eligibility and risk assessment', page: 'credit-review' },
      { label: 'Manual Entry', meta: 'Offline application data entry', page: 'credit-manual-entry' },
      { label: 'Loan Register', meta: 'Full portfolio register', page: 'credit-register' },
      { label: 'DPD Monitoring', meta: 'Overdue buckets and default workflow', page: 'credit-dpd' },
      { label: 'SC Tracker', meta: 'Submitted to sanction committee', page: 'credit-sc-queue' },
      { label: 'Loan Calculator', meta: 'Share and land limit tool', page: 'credit-calculator' },
      { label: 'Member Search', meta: 'Borrower lookup and profile', page: 'credit-search-member' },
    ],
    compliance: [
      { label: 'Document Queue', meta: 'Pending preparation and sign-off', page: 'cs-queue' },
      { label: 'Document Workspace', meta: 'PoA through checklist tabs', page: 'cs-workspace' },
      { label: 'KYC Renewals', meta: 'Re-KYC due and overdue members', page: 'cs-kyc' },
      { label: 'NOC Queue', meta: 'Fully repaid closure workflow', page: 'cs-noc' },
      { label: 'Compliance Calendar', meta: 'Statutory deadlines and evidence', page: 'cs-calendar' },
      { label: 'CDSL Pledge Tracker', meta: 'D-MAT pledge lifecycle', page: 'cs-cdsl' },
      { label: 'Security Return', meta: 'SH-4 and cheque return log', page: 'cs-security-return' },
    ],
    sanction: [
      { label: 'Approval Queue', meta: '7-point scrutiny decisions', page: 'sc-awaiting' },
      { label: 'Joint Approvals', meta: 'Loans above ₹5L threshold', page: 'sc-joint' },
      { label: 'Final Sign-off', meta: 'Post-CS checklist release to Treasury', page: 'sc-final-signoff' },
      { label: 'Special Cases', meta: 'Director/relative GM approval', page: 'sc-special-cases' },
      { label: 'Portfolio Health', meta: 'DPD and exposure summary', page: 'sc-health' },
      { label: 'Recovery Actions', meta: 'Default escalation decisions', page: 'sc-default-escalations' },
    ],
    treasury: [
      { label: 'Disbursement Queue', meta: 'Initiate and authorize payments', page: 'treasury-pending' },
      { label: 'Disbursement Flow', meta: '6-step pre-flight to complete', page: 'treasury-disbursement' },
      { label: 'SAP Customer Codes', meta: 'Create SFCUST codes', page: 'treasury-sap-codes' },
      { label: 'Incoming Repayments', meta: 'Post UTR receipts to SAP', page: 'treasury-incoming' },
      { label: 'Bank Reconciliation', meta: 'Match statement to SAP', page: 'treasury-reconciliation' },
      { label: 'Interest Accruals', meta: 'Monthly and year-end invoices', page: 'treasury-interest' },
    ],
    admin: [
      { label: 'Portfolio Overview', meta: 'System-wide lending health', page: 'admin-portfolio' },
      { label: 'User Management', meta: 'Roles and permissions matrix', page: 'admin-users' },
      { label: 'Audit Log', meta: 'Immutable event trail', page: 'admin-audit' },
      { label: 'Configuration', meta: 'Rates, limits and parameters', page: 'admin-config' },
      { label: 's.186 Limits', meta: 'Lending capacity monitor', page: 'admin-section186' },
      { label: 'Integration Hub', meta: 'Cross-role handoff reference', page: 'integration-overview' },
    ],
  };

  const profilePage = 'user-profile';
  const profileLabel = user?.role === 'farmer' ? 'My Profile' : 'My Workspace';

  const searchResults = [
    ...(roleSearchItems[user?.role || 'farmer'] || roleSearchItems.farmer),
    ...(user?.role !== 'farmer' ? [{ label: 'Loan File', meta: 'Shared loan file — all 6 stages in one place', page: 'loan-file' }] : []),
    ...(user?.role !== 'farmer' ? [{ label: 'Borrower Lookup', meta: 'Search member and loan context', page: 'member-loan-profile' }] : []),
    { label: profileLabel, meta: user?.role === 'farmer' ? 'Your membership and loan details' : 'Your role scope and quick actions', page: profilePage },
    { label: 'Notifications', meta: 'Role alerts and pending tasks', page: 'notifications-center' },
  ].filter(item => {
    const q = searchQuery.toLowerCase();
    return !q || item.label.toLowerCase().includes(q) || item.meta.toLowerCase().includes(q);
  });

  const roleColors: Record<string, string> = {
    farmer: 'var(--brand-accent)',
    credit: 'var(--brand-secondary)',
    compliance: 'var(--brand-primary)',
    sanction: 'var(--accent-sanction)',
    treasury: 'var(--accent-treasury)',
    admin: 'var(--neutral-700)',
  };

  const initials = user?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';
  const roleColor = roleColors[user?.role || 'admin'];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 gap-4"
      style={{ height: '56px', backgroundColor: 'var(--brand-primary)' }}
    >
      <button
        onClick={onMenuToggle}
        aria-label="Toggle sidebar"
        className="text-white/70 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-2">
        <div
          className="font-bold text-white flex items-center gap-1.5"
          style={{ fontSize: '17px', letterSpacing: '-0.3px' }}
        >
          <span
            className="w-7 h-7 rounded-md flex items-center justify-center font-black text-sm"
            style={{ backgroundColor: 'var(--brand-accent)', color: 'white' }}
          >W</span>
          WhatsLoan
        </div>
      </div>

      <div className="flex-1 flex items-center">
        {breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1.5 ml-4" style={{ fontSize: '13px' }}>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-white/40">›</span>}
                <span className={i === breadcrumbs.length - 1 ? 'text-white' : 'text-white/50'}>
                  {crumb}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden xl:flex items-center gap-2 mr-2 px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)' }}>
          <span className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.14)', color: 'white', fontSize: '10px', fontWeight: 800 }}>SF</span>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.72)', fontWeight: 600 }}>Sahyadri Farms</span>
        </div>
        <div className="relative" ref={searchRef}>
          <button
            aria-label={t('app.search', 'Search loans and members')}
            title={t('app.search', 'Search loans and members')}
            className="text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
            onClick={() => { setShowSearch(!showSearch); setShowNotifications(false); setShowProfile(false); }}
          >
            <Search size={18} />
          </button>
          {showSearch && (
            <div
              className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-[#EDEEF0] w-96 z-50 overflow-hidden"
              style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.15)', animation: 'fadeIn 0.15s ease' }}
            >
              <div className="p-3 border-b border-[#EDEEF0]">
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9EA8B3]" />
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search loans, members, queues"
                    className="w-full pl-9 pr-3 rounded-lg border border-[#D1D5DB]"
                    style={{ height: 38, fontSize: 13 }}
                  />
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {searchResults.map(item => (
                  <button
                    key={item.page}
                    onClick={() => { onNavigate(item.page); setShowSearch(false); setSearchQuery(''); }}
                    className="w-full text-left px-4 py-3 border-b border-[#EDEEF0] hover:bg-[#F7F8FA]"
                  >
                    <div style={{ fontSize: 13, color: 'var(--neutral-900)', fontWeight: 700 }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--neutral-500)', marginTop: 2 }}>{item.meta}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={notifRef}>
          <button
            aria-label="Open notifications"
            className="text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 relative"
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: 'var(--error-500)', fontSize: '10px', fontWeight: 700 }}
              >
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div
              className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-[#EDEEF0] w-80 z-50 overflow-hidden"
              style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.15)', animation: 'fadeIn 0.15s ease' }}
            >
              <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
              <div className="px-4 py-3 border-b border-[#EDEEF0] flex items-center justify-between">
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--neutral-900)' }}>{t('app.notifications', 'Notifications')}</span>
                <button onClick={() => setNotificationsRead(true)} style={{ fontSize: '12px', color: 'var(--brand-accent)', cursor: 'pointer' }}>Mark all read</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {(roleNotifications.length ? roleNotifications.slice(0, 4) : mockNotifications.slice(0, 4)).map(n => {
                  const title = 'message' in n ? n.message : n.title;
                  const body = 'detail' in n ? n.detail : n.body;
                  const route = 'route' in n ? n.route : '';
                  return (
                    <button key={n.id} onClick={() => { if (route) onNavigate(route); setShowNotifications(false); }} className="w-full text-left px-4 py-3 border-b border-[#EDEEF0] hover:bg-[#F7F8FA] cursor-pointer transition-colors">
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--neutral-900)' }}>{title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--neutral-400)', marginTop: '2px' }}>{body}</div>
                      <div style={{ fontSize: '11px', color: 'var(--brand-accent)', marginTop: '4px' }}>{'cta' in n ? n.cta : n.time}</div>
                    </button>
                  );
                })}
              </div>
              <button onClick={() => { onNavigate('notifications-center'); setShowNotifications(false); }} className="w-full px-4 py-3 text-center hover:bg-[#F7F8FA] transition-colors" style={{ fontSize: '13px', color: 'var(--brand-accent)', cursor: 'pointer' }}>
                {t('app.viewAll', 'View all notifications')} →
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center rounded-lg overflow-hidden border border-white/20">
          {(['EN', 'मर', 'हि'] as AppLanguage[]).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              aria-label={`Switch language to ${l}`}
              aria-pressed={lang === l}
              className="px-2 py-1 transition-colors"
              style={{
                fontSize: '11px',
                fontWeight: 500,
                backgroundColor: lang === l ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: lang === l ? 'white' : 'rgba(255,255,255,0.5)',
              }}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-2 py-1.5 transition-colors"
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            aria-label="Open user profile menu"
            aria-expanded={showProfile}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
              style={{ backgroundColor: roleColor, boxShadow: `0 0 0 2px rgba(255,255,255,0.45), 0 0 0 4px ${roleColor}` }}
            >
              {initials}
            </div>
            <div className="text-left hidden sm:block">
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'white', lineHeight: '16px' }}>{user?.name}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: '14px' }}>{user?.roleLabel}</div>
            </div>
            <ChevronDown size={14} className="text-white/50" />
          </button>
          {showProfile && (
            <div
              className="absolute right-0 top-12 bg-white rounded-xl shadow-lg border border-[#EDEEF0] w-48 z-50 overflow-hidden"
              style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.15)', animation: 'fadeIn 0.15s ease' }}
            >
              <div className="px-4 py-3 border-b border-[#EDEEF0]">
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--neutral-900)' }}>{user?.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--neutral-400)' }}>{user?.roleLabel}</div>
              </div>
              <button onClick={() => { onNavigate(profilePage); setShowProfile(false); }} className="w-full px-4 py-2.5 flex items-center gap-2 hover:bg-[#F7F8FA] text-left transition-colors">
                <User size={14} className="text-[#9EA8B3]" />
                <span style={{ fontSize: '13px', color: 'var(--neutral-700)' }}>{profileLabel}</span>
              </button>
              {user?.role !== 'farmer' && (
                <button onClick={() => { onNavigate('member-loan-profile'); setShowProfile(false); }} className="w-full px-4 py-2.5 flex items-center gap-2 hover:bg-[#F7F8FA] text-left transition-colors">
                  <Search size={14} className="text-[#9EA8B3]" />
                  <span style={{ fontSize: '13px', color: 'var(--neutral-700)' }}>Borrower Lookup</span>
                </button>
              )}
              <button
                className="w-full px-4 py-2.5 flex items-center gap-2 hover:bg-[#F7F8FA] text-left border-t border-[#EDEEF0] transition-colors"
                onClick={() => { logout(); setShowProfile(false); }}
              >
                <LogOut size={14} className="text-[#EF4444]" />
                <span style={{ fontSize: '13px', color: 'var(--error-500)' }}>{t('app.logout', 'Logout')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
