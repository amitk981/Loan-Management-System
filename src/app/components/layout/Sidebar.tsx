import {
  LayoutDashboard, FileText, CreditCard, Files, Wallet, HeadphonesIcon,
  Inbox, BookOpen, BarChart3, AlertTriangle, Calendar, Building, ClipboardCheck,
  CheckSquare, PenTool, TrendingUp, DollarSign, Receipt, FileBarChart,
  Settings, UserCog, ScrollText, ShieldCheck, Plus, ChevronRight, Users,
  Calculator, Archive, Scale, Bell, Link2, Landmark, FileCheck, Download,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import type { NavItem } from '../../data/roleNav';
import { roleAccents, roleSectionLabels } from '../../data/roleNav';

interface SidebarProps {
  collapsed: boolean;
  activePage: string;
  onNavigate: (page: string) => void;
  expandedGroups: string[];
  onToggleGroup: (key: string) => void;
}

const farmerNav: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'My Dashboard', key: 'farmer-dashboard', i18nKey: 'nav.myDashboard', section: 'Today' },
  { icon: <FileText size={20} />, label: 'Apply for Loan', key: 'farmer-apply', i18nKey: 'nav.applyLoan', section: 'Today' },
  {
    icon: <CreditCard size={20} />,
    label: 'My Loan',
    key: 'farmer-active-loans',
    groupKey: 'farmer-loans',
    i18nKey: 'nav.myLoans',
    section: 'My Loan',
    children: [
      { label: 'Active Loan', key: 'farmer-active-loans' },
      { label: 'Loan History', key: 'farmer-loan-history' },
      { label: 'NOC & Closure', key: 'farmer-noc' },
    ],
  },
  { icon: <Files size={20} />, label: 'My Documents', key: 'farmer-documents', i18nKey: 'nav.myDocuments', section: 'My Loan' },
  { icon: <Wallet size={20} />, label: 'Make Payment', key: 'farmer-repayment', i18nKey: 'nav.repayment', section: 'Services' },
  { icon: <HeadphonesIcon size={20} />, label: 'Support', key: 'farmer-support', i18nKey: 'nav.support', section: 'Services' },
];

const creditNav: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', key: 'credit-dashboard', section: 'Today' },
  {
    icon: <Inbox size={20} />,
    label: 'Application Inbox',
    key: 'credit-queue',
    groupKey: 'credit-inbox',
    badge: 12,
    section: 'Intake',
    children: [
      { label: 'New Applications', key: 'credit-queue', badge: 12 },
      { label: 'Pending Appraisal', key: 'credit-pending' },
      { label: 'Returned / Incomplete', key: 'credit-returned' },
      { label: 'SC Tracker', key: 'credit-sc-queue' },
    ],
  },
  { icon: <FileCheck size={20} />, label: 'Appraisal Note', key: 'credit-review', section: 'Intake' },
  { icon: <Plus size={20} />, label: 'Manual Entry', key: 'credit-manual-entry', section: 'Intake' },
  {
    icon: <BookOpen size={20} />,
    label: 'Loan Register',
    key: 'credit-register',
    groupKey: 'credit-portfolio',
    section: 'Portfolio',
    children: [
      { label: 'Full Register', key: 'credit-register' },
      { label: 'Active Loans', key: 'credit-active-loans' },
      { label: 'All Applications', key: 'credit-all-apps' },
      { label: 'Repayments', key: 'credit-repayments' },
      { label: 'Interest Invoices', key: 'credit-interest-invoices' },
    ],
  },
  { icon: <BarChart3 size={20} />, label: 'DPD Monitoring', key: 'credit-dpd', section: 'Portfolio' },
  { icon: <AlertTriangle size={20} />, label: 'Defaults & Recovery', key: 'credit-defaults', section: 'Portfolio' },
  { icon: <TrendingUp size={20} />, label: 'Portfolio Analytics', key: 'credit-analytics', section: 'Portfolio' },
  { icon: <FileBarChart size={20} />, label: 'MIS Reports', key: 'credit-mis', section: 'Portfolio' },
  {
    icon: <Users size={20} />,
    label: 'Member Registry',
    key: 'credit-search-member',
    groupKey: 'credit-members',
    section: 'Tools',
    children: [
      { label: 'Search Member', key: 'credit-search-member' },
      { label: 'Member Profile', key: 'credit-member-profile' },
    ],
  },
  { icon: <Calculator size={20} />, label: 'Loan Calculator', key: 'credit-calculator', section: 'Tools' },
];

const complianceNav: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'CS Dashboard', key: 'cs-dashboard', section: 'Today' },
  {
    icon: <ClipboardCheck size={20} />,
    label: 'Document Queue',
    key: 'cs-queue',
    groupKey: 'cs-doc-queue',
    badge: 14,
    section: 'Documents',
    children: [
      { label: 'All Pending', key: 'cs-queue', badge: 14 },
      { label: 'Awaiting Preparation', key: 'cs-awaiting-prep' },
      { label: 'Awaiting Review', key: 'cs-awaiting-review' },
      { label: 'Awaiting CS Sign-off', key: 'cs-signoff', badge: 3 },
    ],
  },
  {
    icon: <PenTool size={20} />,
    label: 'Document Workspace',
    key: 'cs-workspace',
    groupKey: 'cs-doc-templates',
    section: 'Documents',
    children: [
      { label: 'Workspace Hub', key: 'cs-workspace' },
      { label: 'PoA Generator', key: 'cs-poa' },
      { label: 'Tri-Party Agreement', key: 'cs-triparty' },
      { label: 'SH-4 / CDSL', key: 'cs-sh4' },
      { label: 'Term Sheet', key: 'cs-termsheet' },
      { label: 'Loan Agreement', key: 'cs-agreement' },
    ],
  },
  {
    icon: <CheckSquare size={20} />,
    label: 'KYC & CKYC',
    key: 'cs-kyc',
    groupKey: 'cs-kyc-group',
    badge: 9,
    section: 'Compliance',
    children: [
      { label: 'All Members', key: 'cs-kyc' },
      { label: 'Pending KYC', key: 'cs-pending-kyc', badge: 4 },
      { label: 'Re-KYC Due', key: 'cs-rekyc', badge: 9 },
    ],
  },
  { icon: <Landmark size={20} />, label: 'CDSL Pledge Tracker', key: 'cs-cdsl', section: 'Compliance' },
  { icon: <FileText size={20} />, label: 'NOC Management', key: 'cs-noc', badge: 2, section: 'Compliance' },
  { icon: <Calendar size={20} />, label: 'Compliance Calendar', key: 'cs-calendar', badge: 3, section: 'Compliance' },
  { icon: <ShieldCheck size={20} />, label: 'Security Return', key: 'cs-security-return', section: 'Compliance' },
  {
    icon: <BookOpen size={20} />,
    label: 'Registers & Reports',
    key: 'cs-loan-register',
    groupKey: 'cs-registers',
    section: 'Registers',
    children: [
      { label: 'Loan Register', key: 'cs-loan-register' },
      { label: 'Sanction Register', key: 'cs-sanction-register' },
      { label: 'Stamp Duty Register', key: 'cs-stamp' },
      { label: 'PoA Register', key: 'cs-poa-register' },
      { label: 'Exception Register', key: 'cs-exception-register' },
      { label: 'Grievance Register', key: 'cs-grievance' },
      { label: 'Document Archive', key: 'cs-archive' },
      { label: 'Compliance Reports', key: 'cs-reports' },
    ],
  },
];

const sanctionNav: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'SC Dashboard', key: 'sc-dashboard', section: 'Today' },
  {
    icon: <CheckSquare size={20} />,
    label: 'Approval Queue',
    key: 'sc-awaiting',
    groupKey: 'sc-decisions',
    badge: 7,
    section: 'Decisions',
    children: [
      { label: 'Awaiting Approval', key: 'sc-awaiting', badge: 7 },
      { label: 'Awaiting My Sign', key: 'sc-my-sign', badge: 5 },
      { label: 'Joint Approvals', key: 'sc-joint', badge: 2 },
      { label: 'Special Cases', key: 'sc-special-cases', badge: 1 },
      { label: 'Returns', key: 'sc-returns' },
      { label: 'Final Sign-off', key: 'sc-final-signoff', badge: 2 },
    ],
  },
  { icon: <BookOpen size={20} />, label: 'Sanction Register', key: 'sc-register', section: 'Decisions' },
  { icon: <AlertTriangle size={20} />, label: 'Exception Register', key: 'sc-exceptions', section: 'Decisions' },
  { icon: <TrendingUp size={20} />, label: 'Portfolio Health', key: 'sc-health', section: 'Oversight' },
  { icon: <Scale size={20} />, label: 'Exposure & Limits', key: 'sc-exposure', section: 'Oversight' },
  { icon: <BarChart3 size={20} />, label: 'DPD Summary', key: 'sc-dpd', section: 'Oversight' },
  { icon: <ShieldCheck size={20} />, label: 'Recovery Actions', key: 'sc-default-escalations', section: 'Oversight' },
  { icon: <Archive size={20} />, label: 'Board Minutes', key: 'sc-board', section: 'Governance' },
  { icon: <Settings size={20} />, label: 'Policy Settings', key: 'sc-policy', section: 'Governance' },
];

const treasuryNav: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', key: 'treasury-dashboard', section: 'Today' },
  {
    icon: <DollarSign size={20} />,
    label: 'Disbursements',
    key: 'treasury-pending',
    groupKey: 'treasury-disburse',
    badge: 2,
    section: 'Disbursements',
    children: [
      { label: 'Pending Initiation', key: 'treasury-pending', badge: 2 },
      { label: 'Authorizations', key: 'treasury-auth', badge: 2 },
      { label: 'Disbursed Today', key: 'treasury-today' },
      { label: 'Process Flow', key: 'treasury-disbursement' },
    ],
  },
  {
    icon: <Building size={20} />,
    label: 'SAP Management',
    key: 'treasury-sap-codes',
    groupKey: 'treasury-sap',
    section: 'Disbursements',
    children: [
      { label: 'Customer Codes', key: 'treasury-sap-codes' },
      { label: 'SAP Entries Log', key: 'treasury-sap-log' },
    ],
  },
  {
    icon: <Receipt size={20} />,
    label: 'Repayments',
    key: 'treasury-incoming',
    groupKey: 'treasury-finance',
    section: 'Finance',
    children: [
      { label: 'Incoming Payments', key: 'treasury-incoming' },
      { label: 'Subsidiary Deductions', key: 'treasury-deductions' },
      { label: 'Interest Accruals', key: 'treasury-interest' },
      { label: 'Reconciliation', key: 'treasury-reconciliation' },
    ],
  },
  { icon: <BookOpen size={20} />, label: 'Ledger Summary', key: 'treasury-ledger', section: 'Reporting' },
  { icon: <FileBarChart size={20} />, label: 'Financial Reports', key: 'treasury-reports', section: 'Reporting' },
  { icon: <Download size={20} />, label: 'Export Centre', key: 'treasury-exports', section: 'Reporting' },
];

const adminNav: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Control Center', key: 'admin-portfolio', section: 'Today' },
  { icon: <UserCog size={20} />, label: 'User Management', key: 'admin-users', section: 'Controls' },
  { icon: <ScrollText size={20} />, label: 'Audit Log', key: 'admin-audit', section: 'Controls' },
  { icon: <Settings size={20} />, label: 'Configuration', key: 'admin-config', section: 'Controls' },
  { icon: <ShieldCheck size={20} />, label: 's.186 Limits', key: 'admin-section186', section: 'Compliance' },
  { icon: <Scale size={20} />, label: 'NBFC Monitor', key: 'admin-nbfc', section: 'Compliance' },
  { icon: <Link2 size={20} />, label: 'Integration Hub', key: 'integration-overview', section: 'Compliance' },
];

const navByRole: Record<string, NavItem[]> = {
  farmer: farmerNav,
  credit: creditNav,
  compliance: complianceNav,
  sanction: sanctionNav,
  treasury: treasuryNav,
  admin: adminNav,
};

const labelI18nKeys: Record<string, string> = {
  Dashboard: 'nav.dashboard',
  'My Dashboard': 'nav.myDashboard',
  'Apply for Loan': 'nav.applyLoan',
  'My Loan': 'nav.myLoans',
  'My Documents': 'nav.myDocuments',
  'Make Payment': 'nav.repayment',
  Support: 'nav.support',
  'Application Inbox': 'nav.applicationInbox',
  'Loan Register': 'nav.loanRegister',
  'DPD Monitoring': 'nav.dpd',
  'MIS Reports': 'nav.reports',
  'Document Queue': 'nav.documentQueue',
  'Document Workspace': 'nav.workspace',
  'KYC & CKYC': 'nav.kyc',
  'NOC Management': 'nav.noc',
  'Compliance Calendar': 'nav.calendar',
  'Registers & Reports': 'nav.reports',
  'Approval Queue': 'nav.approvalQueue',
  'Joint Approvals': 'nav.jointApprovals',
  'Special Cases': 'nav.specialCases',
  'Portfolio Health': 'nav.portfolioHealth',
  'Sanction Register': 'nav.sanctionRegister',
  'Recovery Actions': 'nav.recovery',
  Disbursements: 'nav.disbursement',
  Authorizations: 'nav.authorizations',
  'SAP Management': 'nav.sap',
  Repayments: 'nav.incoming',
  Reconciliation: 'nav.reconciliation',
  'Control Center': 'nav.controlCenter',
  'User Management': 'nav.userManagement',
  'Audit Log': 'nav.audit',
  Configuration: 'nav.config',
  's.186 Limits': 'nav.limits',
};

function groupId(item: NavItem) {
  return item.groupKey || item.key;
}

function isItemActive(item: NavItem, activePage: string) {
  return activePage === item.key || item.children?.some(c => c.key === activePage) || false;
}

export function Sidebar({ collapsed, activePage, onNavigate, expandedGroups, onToggleGroup }: SidebarProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navItems = navByRole[user?.role || 'farmer'] || farmerNav;
  const accent = roleAccents[user?.role || 'farmer'] || '#1E88E5';
  let lastSection = '';

  const handleParentClick = (item: NavItem) => {
    const gid = groupId(item);
    if (item.children && !expandedGroups.includes(gid)) {
      onToggleGroup(gid);
    }
    onNavigate(item.key);
  };

  return (
    <aside
      className="app-sidebar fixed left-0 top-14 bottom-0 z-40 flex flex-col transition-all duration-300 overflow-hidden"
      style={{
        width: collapsed ? '64px' : '240px',
        backgroundColor: '#1A3C2A',
      }}
    >
      <div className="flex-1 overflow-y-auto py-2 shell-scroll" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.12) transparent' }}>
        {navItems.map((item, index) => {
          const gid = groupId(item);
          const isActive = isItemActive(item, activePage);
          const isExpanded = expandedGroups.includes(gid) || (item.children && isActive);
          const itemLabel = t(item.i18nKey || labelI18nKeys[item.label] || `nav.${item.key}`, item.label);
          const showSection = !collapsed && item.section && item.section !== lastSection;
          if (showSection) lastSection = item.section!;

          return (
            <div key={`${item.key}-${index}`}>
              {showSection && (
                <div className="sidebar-section px-4 pt-4 pb-1.5">
                  {index > 0 && (
                    <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.14)', marginBottom: '10px' }} />
                  )}
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.38)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {item.section}
                  </div>
                </div>
              )}
              <div
                className="w-full flex items-center transition-all group relative"
                style={{
                  height: '46px',
                  backgroundColor: isActive ? 'rgba(45,122,79,0.55)' : 'transparent',
                  borderLeft: isActive ? `3px solid ${accent}` : '3px solid transparent',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.68)',
                }}
              >
                <button
                  className="flex-1 h-full flex items-center gap-3 px-4 hover:bg-white/10 transition-all"
                  onClick={() => {
                    if (item.children) {
                      handleParentClick(item);
                    } else {
                      onNavigate(item.key);
                    }
                  }}
                  title={collapsed ? itemLabel : undefined}
                  aria-label={item.children ? `${itemLabel} menu` : itemLabel}
                  aria-current={isActive ? 'page' : undefined}
                  aria-expanded={item.children ? isExpanded : undefined}
                >
                  <span className="flex-shrink-0" style={{ opacity: isActive ? 1 : 0.72 }} aria-hidden="true">
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <>
                      <span className="sidebar-label flex-1 text-left truncate" style={{ fontSize: '13.5px', fontWeight: isActive ? 600 : 400, lineHeight: '20px' }}>
                        {itemLabel}
                      </span>
                      {item.badge ? (
                        <span
                          className="sidebar-badge min-w-5 h-5 px-1 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: '#EF4444', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </>
                  )}
                </button>
                {!collapsed && item.children && (
                  <button
                    type="button"
                    className="sidebar-chevron flex-shrink-0 p-2 mr-1 rounded hover:bg-white/10"
                    onClick={() => onToggleGroup(gid)}
                    aria-label={isExpanded ? `Collapse ${itemLabel}` : `Expand ${itemLabel}`}
                  >
                    <ChevronRight
                      size={14}
                      className="transition-transform"
                      style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', opacity: 0.55 }}
                    />
                  </button>
                )}
                {collapsed && (
                  <div className="absolute left-16 bg-[#12151A] text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none shadow-lg">
                    {itemLabel}
                  </div>
                )}
              </div>

              {!collapsed && item.children && isExpanded && (
                <div className="sidebar-children pb-1" style={{ backgroundColor: 'rgba(0,0,0,0.12)' }}>
                  {item.children.map(child => {
                    const isChildActive = activePage === child.key;
                    const childLabel = t(labelI18nKeys[child.label] || `nav.${child.key}`, child.label);
                    return (
                      <button
                        key={child.key}
                        className="w-full text-left py-2 pl-12 pr-3 transition-colors hover:bg-white/8 flex items-center justify-between gap-2"
                        style={{
                          fontSize: '12.5px',
                          color: isChildActive ? 'white' : 'rgba(255,255,255,0.52)',
                          fontWeight: isChildActive ? 600 : 400,
                          backgroundColor: isChildActive ? 'rgba(45,122,79,0.35)' : 'transparent',
                          borderLeft: isChildActive ? `2px solid ${accent}` : '2px solid transparent',
                        }}
                        onClick={() => onNavigate(child.key)}
                        aria-current={isChildActive ? 'page' : undefined}
                        aria-label={childLabel}
                      >
                        <span className="truncate">{childLabel}</span>
                        {child.badge ? (
                          <span className="min-w-4 h-4 px-1 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EF4444', color: 'white', fontSize: '9px', fontWeight: 800 }}>
                            {child.badge}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!collapsed && (
        <div className="sidebar-footer px-3 py-3 border-t space-y-2" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          {user?.role !== 'farmer' && (
            <button
              onClick={() => onNavigate('notifications-center')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/8 transition-colors text-left"
              style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}
            >
              <Bell size={15} />
              <span>Notifications</span>
            </button>
          )}
          <button
            onClick={() => onNavigate('user-profile')}
            className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-white/8 transition-colors text-left"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
              style={{ backgroundColor: accent, boxShadow: `0 0 0 2px rgba(255,255,255,0.2)` }}
            >
              {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'white', lineHeight: '16px' }} className="truncate">
                {user?.name}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: '14px' }} className="truncate">
                {user?.roleLabel}
              </div>
            </div>
          </button>
        </div>
      )}
    </aside>
  );
}
