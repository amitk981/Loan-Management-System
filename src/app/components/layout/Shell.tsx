import { useEffect, useState, ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { defaultExpandedGroups } from '../../data/roleNav';

interface ShellProps {
  children: ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  breadcrumbs?: string[];
  pageTitle?: string;
  pageSubtitle?: string;
  actions?: ReactNode;
}

const MOBILE_BREAKPOINT = 1024;

export function Shell({ children, activePage, onNavigate, breadcrumbs = [], pageTitle, pageSubtitle, actions }: ShellProps) {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Below the breakpoint the sidebar becomes an off-canvas drawer (full labels,
  // backdrop, slide-in) instead of a cramped icon rail. `isMobile` drives the
  // whole layout switch; `mobileOpen` is the drawer's open state.
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    () => defaultExpandedGroups[user?.role || 'farmer'] || []
  );

  useEffect(() => {
    setExpandedGroups(defaultExpandedGroups[user?.role || 'farmer'] || []);
  }, [user?.role]);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Close the drawer whenever the route changes, and lock body scroll while open.
  useEffect(() => { setMobileOpen(false); }, [activePage]);
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [mobileOpen]);

  // Esc closes the drawer.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  // Make non-native clickable rows/cards keyboard-operable app-wide (audit DA-025).
  // Native <button>/<a>/<input> already handle Enter/Space, so we only enhance
  // synthesized clickables (e.g. <tr className="clickable-row" onClick>) — adding
  // tabindex + role=button and synthesizing a click on Enter/Space.
  useEffect(() => {
    const NATIVE = new Set(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA']);
    const enhance = () => {
      document.querySelectorAll<HTMLElement>('.clickable-row, .clickable-card').forEach(el => {
        if (NATIVE.has(el.tagName)) return;
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
        if (!el.getAttribute('role')) el.setAttribute('role', 'button');
      });
    };
    enhance();
    const mo = new MutationObserver(enhance);
    mo.observe(document.body, { childList: true, subtree: true });
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || NATIVE.has(el.tagName)) return;
      if (!el.classList.contains('clickable-row') && !el.classList.contains('clickable-card')) return;
      if (e.target !== el) return; // let nested controls handle their own keys
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { mo.disconnect(); document.removeEventListener('keydown', onKey); };
  }, []);

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const sidebarWidth = isMobile ? 0 : sidebarCollapsed ? 64 : 240;

  const handleMenuToggle = () => {
    if (isMobile) setMobileOpen(o => !o);
    else setSidebarCollapsed(c => !c);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--neutral-100)', fontFamily: 'Inter, "Noto Sans Devanagari", sans-serif' }}>
      <style>{`
        button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, a:focus-visible {
          outline: 3px solid var(--brand-primary);
          outline-offset: 2px;
        }
        /* Custom scrollbar */
        .shell-scroll::-webkit-scrollbar { width: 6px; }
        .shell-scroll::-webkit-scrollbar-track { background: transparent; }
        .shell-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 3px; }
        .shell-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.22); }
        .shell-scroll { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.12) transparent; }
        /* Interactive row styles */
        .clickable-row { cursor: pointer; transition: all 0.15s ease; }
        .clickable-row:hover { background-color: var(--neutral-100); }
        .clickable-row:active { transform: scale(0.995); }
        .clickable-card { cursor: pointer; transition: all 0.2s ease; }
        .clickable-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); transform: translateY(-1px); }
        .clickable-card:active { transform: translateY(0); }
        /* Smooth table scroll wrapper */
        .table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .table-scroll::-webkit-scrollbar { height: 4px; }
        .table-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 2px; }
        /* Drawer slide + backdrop fade */
        .sidebar-backdrop { animation: backdropIn 0.2s ease; }
        @keyframes backdropIn { from { opacity: 0; } to { opacity: 1; } }
        /* Below the breakpoint the sidebar is an off-canvas drawer; main content
           takes the full width and the grids/typography reflow to a single column. */
        @media (max-width: 1024px) {
          .app-shell-main { margin-left: 0 !important; }
          .shell-content .grid-cols-5, .shell-content .grid-cols-4 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .shell-content .col-span-3, .shell-content .col-span-2 { grid-column: span 2 / span 2 !important; }
          .shell-content table { min-width: 760px; }
          .shell-content .sticky { position: static !important; }
          .breadcrumbs-bar { display: none !important; }
        }
        @media (max-width: 768px) {
          .shell-titlebar { min-height: 64px !important; height: auto !important; padding: 12px 16px !important; align-items: flex-start !important; gap: 12px; flex-direction: column; }
          .shell-titlebar > div:last-child { width: 100%; flex-wrap: wrap; }
          .shell-content { padding: 16px !important; overflow-x: auto; }
          .shell-content .flex.gap-5 { flex-direction: column; }
          .shell-content .w-64, .shell-content .w-72, .shell-content .w-\\[560px\\] { width: 100% !important; }
          .shell-content .grid-cols-5, .shell-content .grid-cols-4, .shell-content .grid-cols-3, .shell-content .grid-cols-2 { grid-template-columns: minmax(0, 1fr) !important; }
          .shell-content .col-span-5, .shell-content .col-span-4, .shell-content .col-span-3, .shell-content .col-span-2 { grid-column: span 1 / span 1 !important; }
          .shell-content .rounded-2xl { border-radius: 12px !important; }
          .shell-content [style*="font-size: 40px"] { font-size: 30px !important; line-height: 38px !important; }
          .shell-content [style*="font-size: 32px"] { font-size: 26px !important; line-height: 34px !important; }
        }
        @media (max-width: 480px) {
          .shell-content { padding: 12px !important; }
          .shell-titlebar h1 { font-size: 18px !important; line-height: 24px !important; }
          header { gap: 8px !important; padding-left: 8px !important; padding-right: 8px !important; }
        }
      `}</style>
      <Header
        onMenuToggle={handleMenuToggle}
        onNavigate={onNavigate}
        breadcrumbs={breadcrumbs}
        menuOpen={isMobile && mobileOpen}
      />
      {isMobile && mobileOpen && (
        <div
          className="sidebar-backdrop fixed inset-0 z-40"
          style={{ top: '56px', backgroundColor: 'rgba(0,0,0,0.45)' }}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <Sidebar
        collapsed={!isMobile && sidebarCollapsed}
        activePage={activePage}
        onNavigate={onNavigate}
        expandedGroups={expandedGroups}
        onToggleGroup={toggleGroup}
        mobile={isMobile}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <main
        className="app-shell-main transition-all duration-300"
        style={{
          marginLeft: `${sidebarWidth}px`,
          marginTop: '56px',
          height: 'calc(100vh - 56px)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {(pageTitle || actions) && (
          <div
            className="shell-titlebar flex items-center justify-between px-8 bg-white border-b border-[var(--neutral-200)] flex-shrink-0 sticky top-0 z-10"
            style={{ minHeight: '64px' }}
          >
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 500, color: 'var(--neutral-900)', lineHeight: '28px' }}>
                {pageTitle}
              </h1>
              {pageSubtitle && (
                <p style={{ fontSize: '12px', color: 'var(--neutral-400)', lineHeight: '18px' }}>{pageSubtitle}</p>
              )}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </div>
        )}
        <div className="shell-content shell-scroll p-8 flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
