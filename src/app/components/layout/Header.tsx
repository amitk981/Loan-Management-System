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
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const roleNotifications = crossRoleNotifications.filter(n => n.toRole === user?.role || n.toRole === 'all');
  const unreadCount = roleNotifications.length || mockNotifications.filter(n => !n.read && (n.role === user?.role || n.role === 'all')).length;

  const roleColors: Record<string, string> = {
    farmer: '#1E88E5',
    credit: '#2D7A4F',
    compliance: '#1A3C2A',
    sanction: '#7C3AED',
    treasury: '#0891B2',
    admin: '#3D4450',
  };

  const initials = user?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';
  const roleColor = roleColors[user?.role || 'admin'];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 gap-4"
      style={{ height: '56px', backgroundColor: '#1A3C2A' }}
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
            style={{ backgroundColor: '#1E88E5', color: 'white' }}
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
        <button aria-label={t('app.search', 'Search loans and members')} title={t('app.search', 'Search loans and members')} className="text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
          <Search size={18} />
        </button>

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
                style={{ backgroundColor: '#EF4444', fontSize: '10px', fontWeight: 700 }}
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
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#12151A' }}>{t('app.notifications', 'Notifications')}</span>
                <span style={{ fontSize: '12px', color: '#1E88E5', cursor: 'pointer' }}>Mark all read</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {(roleNotifications.length ? roleNotifications.slice(0, 4) : mockNotifications.slice(0, 4)).map(n => {
                  const title = 'message' in n ? n.message : n.title;
                  const body = 'detail' in n ? n.detail : n.body;
                  const route = 'route' in n ? n.route : '';
                  return (
                    <button key={n.id} onClick={() => { if (route) onNavigate(route); setShowNotifications(false); }} className="w-full text-left px-4 py-3 border-b border-[#EDEEF0] hover:bg-[#F7F8FA] cursor-pointer transition-colors">
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#12151A' }}>{title}</div>
                      <div style={{ fontSize: '12px', color: '#9EA8B3', marginTop: '2px' }}>{body}</div>
                      <div style={{ fontSize: '11px', color: '#1E88E5', marginTop: '4px' }}>{'cta' in n ? n.cta : n.time}</div>
                    </button>
                  );
                })}
              </div>
              <button onClick={() => { onNavigate('notifications-center'); setShowNotifications(false); }} className="w-full px-4 py-3 text-center hover:bg-[#F7F8FA] transition-colors" style={{ fontSize: '13px', color: '#1E88E5', cursor: 'pointer' }}>
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
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#12151A' }}>{user?.name}</div>
                <div style={{ fontSize: '12px', color: '#9EA8B3' }}>{user?.roleLabel}</div>
              </div>
              <button onClick={() => { onNavigate('member-loan-profile'); setShowProfile(false); }} className="w-full px-4 py-2.5 flex items-center gap-2 hover:bg-[#F7F8FA] text-left transition-colors">
                <User size={14} className="text-[#9EA8B3]" />
                <span style={{ fontSize: '13px', color: '#3D4450' }}>{t('app.profile', 'My Profile')}</span>
              </button>
              <button
                className="w-full px-4 py-2.5 flex items-center gap-2 hover:bg-[#F7F8FA] text-left border-t border-[#EDEEF0] transition-colors"
                onClick={() => { logout(); setShowProfile(false); }}
              >
                <LogOut size={14} className="text-[#EF4444]" />
                <span style={{ fontSize: '13px', color: '#EF4444' }}>{t('app.logout', 'Logout')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
