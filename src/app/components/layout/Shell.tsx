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

export function Shell({ children, activePage, onNavigate, breadcrumbs = [], pageTitle, pageSubtitle, actions }: ShellProps) {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    () => defaultExpandedGroups[user?.role || 'farmer'] || []
  );

  useEffect(() => {
    setExpandedGroups(defaultExpandedGroups[user?.role || 'farmer'] || []);
  }, [user?.role]);

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const sidebarWidth = sidebarCollapsed ? 64 : 240;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--neutral-100)', fontFamily: 'Inter, "Noto Sans Devanagari", sans-serif' }}>
      <style>{`
        button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, a:focus-visible {
          outline: 3px solid #1A3C2A;
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
        .clickable-row:hover { background-color: #F7F8FA; }
        .clickable-row:active { transform: scale(0.995); }
        .clickable-card { cursor: pointer; transition: all 0.2s ease; }
        .clickable-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); transform: translateY(-1px); }
        .clickable-card:active { transform: translateY(0); }
        /* Smooth table scroll wrapper */
        .table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .table-scroll::-webkit-scrollbar { height: 4px; }
        .table-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 2px; }
        @media (max-width: 1024px) {
          .app-shell-main { margin-left: 64px !important; }
          .app-sidebar { width: 64px !important; }
          .sidebar-label, .sidebar-section, .sidebar-children, .sidebar-badge, .sidebar-chevron, .sidebar-user { display: none !important; }
          .shell-content .grid-cols-5, .shell-content .grid-cols-4 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .shell-content .col-span-3, .shell-content .col-span-2 { grid-column: span 2 / span 2 !important; }
          .shell-content table { min-width: 760px; }
          .shell-content .sticky { position: static !important; }
        }
        @media (max-width: 768px) {
          .app-shell-main { margin-left: 64px !important; }
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
          .app-shell-main { margin-left: 0 !important; padding-bottom: 64px; }
          .app-sidebar { top: auto !important; right: 0 !important; bottom: 0 !important; width: 100% !important; height: 56px !important; flex-direction: row !important; overflow-x: auto !important; }
          .app-sidebar > div:first-child { display: flex !important; flex-direction: row !important; padding: 4px !important; overflow-x: auto !important; }
          .app-sidebar button { min-width: 54px !important; height: 48px !important; justify-content: center !important; padding-left: 12px !important; padding-right: 12px !important; }
          .app-sidebar .absolute.left-16 { display: none !important; }
          header { gap: 8px !important; padding-left: 8px !important; padding-right: 8px !important; }
          header .flex-1 .ml-4 { display: none !important; }
        }
      `}</style>
      <Header
        onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onNavigate={onNavigate}
        breadcrumbs={breadcrumbs}
      />
      <Sidebar
        collapsed={sidebarCollapsed}
        activePage={activePage}
        onNavigate={onNavigate}
        expandedGroups={expandedGroups}
        onToggleGroup={toggleGroup}
      />
      <main
        className="app-shell-main transition-all duration-300"
        style={{
          marginLeft: `${sidebarWidth}px`,
          marginTop: '56px',
          height: 'calc(100vh - 56px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {(pageTitle || actions) && (
          <div
            className="shell-titlebar flex items-center justify-between px-8 bg-white border-b border-[#EDEEF0] flex-shrink-0"
            style={{ minHeight: '64px' }}
          >
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--neutral-900)', lineHeight: '28px' }}>
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
