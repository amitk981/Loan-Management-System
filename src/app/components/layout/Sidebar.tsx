import { ReactNode } from 'react';
import {
  LayoutDashboard, FileText, CreditCard, Files, Wallet, HeadphonesIcon,
  Inbox, Users, BookOpen, Calculator, BarChart3, AlertTriangle, Archive,
  Calendar, Building, ClipboardCheck, CheckSquare, Clock, PenTool, TrendingUp,
  DollarSign, Receipt, FileBarChart, Settings, UserCog, ScrollText,
  ShieldCheck, FileWarning, Plus, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface NavItem {
  icon: ReactNode;
  label: string;
  key: string;
  i18nKey?: string;
  children?: { label: string; key: string }[];
  badge?: number;
}

interface SidebarProps {
  collapsed: boolean;
  activePage: string;
  onNavigate: (page: string) => void;
  expandedGroups: string[];
  onToggleGroup: (key: string) => void;
}

const farmerNav: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'My Dashboard', key: 'farmer-dashboard', i18nKey: 'nav.myDashboard' },
  { icon: <FileText size={20} />, label: 'Apply for Loan', key: 'farmer-apply', i18nKey: 'nav.applyLoan' },
  {
    icon: <CreditCard size={20} />, label: 'My Loans', key: 'farmer-loans', i18nKey: 'nav.myLoans',
    children: [
      { label: 'Active Loans', key: 'farmer-active-loans' },
      { label: 'Loan History', key: 'farmer-loan-history' },
    ]
  },
  { icon: <Files size={20} />, label: 'My Documents', key: 'farmer-documents', i18nKey: 'nav.myDocuments' },
  { icon: <Wallet size={20} />, label: 'Make Payment', key: 'farmer-repayment', i18nKey: 'nav.repayment' },
  { icon: <HeadphonesIcon size={20} />, label: 'Support & Grievance', key: 'farmer-support', i18nKey: 'nav.support' },
  { icon: <ScrollText size={20} />, label: 'Lifecycle Handoffs', key: 'integration-overview' },
];

const creditNav: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', key: 'credit-dashboard' },
  { icon: <Inbox size={20} />, label: 'New Applications', key: 'credit-queue', badge: 12 },
  { icon: <Clock size={20} />, label: 'Under Review', key: 'credit-pending', badge: 5 },
  { icon: <FileText size={20} />, label: 'Pending Documents', key: 'credit-returned', badge: 3 },
  { icon: <Calculator size={20} />, label: 'Appraisal Queue', key: 'credit-review' },
  { icon: <CheckSquare size={20} />, label: 'Sanction Committee', key: 'credit-sc-queue', badge: 2 },
  { icon: <BookOpen size={20} />, label: 'Live Loans', key: 'credit-active-loans' },
  { icon: <Receipt size={20} />, label: 'Repayments', key: 'credit-repayments' },
  { icon: <BarChart3 size={20} />, label: 'DPD / Monitoring', key: 'credit-dpd' },
  { icon: <BookOpen size={20} />, label: 'Loan Register', key: 'credit-register' },
  { icon: <AlertTriangle size={20} />, label: 'Rejected Applications', key: 'credit-rejected' },
  { icon: <ScrollText size={20} />, label: 'Exception Register', key: 'credit-exceptions' },
  { icon: <FileBarChart size={20} />, label: 'Portfolio MIS', key: 'credit-mis' },
  { icon: <Receipt size={20} />, label: 'Interest Invoices', key: 'credit-interest-invoices' },
  { icon: <Plus size={20} />, label: 'Manual Application', key: 'credit-manual-entry' },
  { icon: <ScrollText size={20} />, label: 'Integration Map', key: 'integration-overview' },
];

const complianceNav: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'CS Dashboard', key: 'cs-dashboard' },
  { icon: <ClipboardCheck size={20} />, label: 'Pending Document Queue', key: 'cs-queue', badge: 14 },
  { icon: <PenTool size={20} />, label: 'Document Workspace', key: 'cs-workspace' },
  { icon: <Files size={20} />, label: 'Executed Documents Archive', key: 'cs-archive' },
  { icon: <Calendar size={20} />, label: 'Statutory Deadlines', key: 'cs-calendar', badge: 3 },
  { icon: <CheckSquare size={20} />, label: 'KYC Renewal Tracker', key: 'cs-kyc', badge: 9 },
  { icon: <AlertTriangle size={20} />, label: 'Re-KYC Due', key: 'cs-rekyc', badge: 4 },
  { icon: <FileText size={20} />, label: 'NOC Issuance Queue', key: 'cs-noc', badge: 2 },
  { icon: <Building size={20} />, label: 'Security Return Log', key: 'cs-security-return' },
  { icon: <BookOpen size={20} />, label: 'Loan Register (CS View)', key: 'cs-loan-register' },
  { icon: <ScrollText size={20} />, label: 'Credit Sanction Register', key: 'cs-sanction-register' },
  { icon: <AlertTriangle size={20} />, label: 'Exception Register', key: 'cs-exception-register' },
  { icon: <HeadphonesIcon size={20} />, label: 'Grievance Register', key: 'cs-grievance' },
  { icon: <BookOpen size={20} />, label: 'Stamp Duty Tracker', key: 'cs-stamp' },
  { icon: <PenTool size={20} />, label: 'PoA Register', key: 'cs-poa-register' },
  { icon: <FileBarChart size={20} />, label: 'Compliance Status Report', key: 'cs-reports' },
  { icon: <Inbox size={20} />, label: 'New SC-Approved Loan', key: 'cs-new-loan', badge: 1 },
  { icon: <Archive size={20} />, label: 'Archive Disbursed File', key: 'cs-archive-file' },
];

const sanctionNav: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'SC Dashboard', key: 'sc-dashboard' },
  { icon: <CheckSquare size={20} />, label: 'Approval Queue', key: 'sc-awaiting', badge: 7 },
  { icon: <PenTool size={20} />, label: 'Awaiting My Sign', key: 'sc-my-sign', badge: 5 },
  { icon: <Users size={20} />, label: 'Joint Approval (>₹5L)', key: 'sc-joint', badge: 2 },
  { icon: <AlertTriangle size={20} />, label: 'Special Cases', key: 'sc-special-cases', badge: 1 },
  { icon: <FileText size={20} />, label: 'Return for Clarification', key: 'sc-returns', badge: 3 },
  { icon: <BookOpen size={20} />, label: 'Credit Sanction Register', key: 'sc-register' },
  { icon: <AlertTriangle size={20} />, label: 'Exception Register', key: 'sc-exceptions' },
  { icon: <ScrollText size={20} />, label: 'Board Minutes Archive', key: 'sc-board' },
  { icon: <TrendingUp size={20} />, label: 'Portfolio Health', key: 'sc-health' },
  { icon: <BarChart3 size={20} />, label: 'Exposure & Limits', key: 'sc-exposure' },
  { icon: <AlertTriangle size={20} />, label: 'DPD / Default Summary', key: 'sc-dpd' },
  { icon: <ShieldCheck size={20} />, label: 'Security Invocation Queue', key: 'sc-security-invocation' },
  { icon: <FileWarning size={20} />, label: 'Default Escalations', key: 'sc-default-escalations' },
  { icon: <ClipboardCheck size={20} />, label: 'Final Checklist Sign-off', key: 'sc-final-signoff', badge: 1 },
  { icon: <ShieldCheck size={20} />, label: 'Director Case Rules', key: 'shared-director-case' },
];

const treasuryNav: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', key: 'treasury-dashboard' },
  {
    icon: <DollarSign size={20} />, label: 'Disbursement Queue', key: 'treasury-disburse', badge: 2,
    children: [
      { label: 'Pending Initiation', key: 'treasury-pending' },
      { label: 'Pending Authorization', key: 'treasury-auth' },
      { label: 'Disbursed Today', key: 'treasury-today' },
    ]
  },
  {
    icon: <Building size={20} />, label: 'SAP Management', key: 'treasury-sap',
    children: [
      { label: 'Customer Code Creation', key: 'treasury-sap-codes' },
      { label: 'SAP Entries Log', key: 'treasury-sap-log' },
    ]
  },
  {
    icon: <Receipt size={20} />, label: 'Repayment Tracking', key: 'treasury-repayment',
    children: [
      { label: 'Incoming (Direct)', key: 'treasury-incoming' },
      { label: 'Subsidiary Deductions', key: 'treasury-deductions' },
      { label: 'Interest Accruals', key: 'treasury-interest' },
    ]
  },
  {
    icon: <FileBarChart size={20} />, label: 'Financial Reports', key: 'treasury-reports',
    children: [
      { label: 'Bank Reconciliation', key: 'treasury-reconciliation' },
      { label: 'Ledger Summary', key: 'treasury-ledger' },
      { label: 'Export Centre', key: 'treasury-exports' },
    ]
  },
  { icon: <ScrollText size={20} />, label: 'Audit & Handoffs', key: 'shared-audit-trail' },
];

const adminNav: NavItem[] = [
  { icon: <UserCog size={20} />, label: 'User Management', key: 'admin-users' },
  { icon: <BarChart3 size={20} />, label: 'Portfolio Overview', key: 'admin-portfolio' },
  { icon: <ScrollText size={20} />, label: 'Audit Log', key: 'admin-audit' },
  {
    icon: <Settings size={20} />, label: 'System Configuration', key: 'admin-config',
    children: [
      { label: 'Loan Parameters', key: 'admin-config' },
      { label: 'Section 186 Tracker', key: 'admin-section186' },
      { label: 'NBFC Principal Test', key: 'admin-nbfc' },
    ]
  },
  { icon: <AlertTriangle size={20} />, label: 'Rate Change Broadcast', key: 'shared-rate-change' },
  { icon: <FileWarning size={20} />, label: 's.186 Lending Lock', key: 'shared-s186-lock' },
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
  'Dashboard': 'nav.dashboard',
  'My Dashboard': 'nav.myDashboard',
  'Apply for Loan': 'nav.applyLoan',
  'My Loans': 'nav.myLoans',
  'Active Loans': 'nav.activeLoans',
  'Loan History': 'nav.loanHistory',
  'My Documents': 'nav.myDocuments',
  'Repayment': 'nav.repayment',
  'Make Payment': 'nav.repayment',
  'Support & Grievance': 'nav.support',
  'Application Inbox': 'nav.applicationInbox',
  'New Applications': 'nav.newApplications',
  'Pending Appraisal': 'nav.pendingAppraisal',
  'Returned / Incomplete': 'nav.returned',
  'Member Registry': 'nav.memberRegistry',
  'Search Member': 'nav.searchMember',
  'Member Profile': 'nav.memberProfile',
  'Loan Register': 'nav.loanRegister',
  'Loan Calculator': 'nav.loanCalculator',
  'Portfolio Analytics': 'nav.analytics',
  'DPD Report': 'nav.dpd',
  'DPD Summary': 'nav.dpd',
  'MIS Reports': 'nav.reports',
  'Defaults & Recovery': 'nav.defaults',
  'Document Queue': 'nav.documentQueue',
  'Document Templates': 'nav.templates',
  'KYC & CKYC': 'nav.kyc',
  'Compliance Calendar': 'nav.calendar',
  'NOC Management': 'nav.noc',
  'Stamp Duty Register': 'nav.stamp',
  'Compliance Reports': 'nav.reports',
  'Approval Queue': 'nav.approvalQueue',
  'Credit Sanction Register': 'nav.sanctionRegister',
  'Exception Register': 'nav.exceptions',
  'Board Minutes': 'nav.board',
  'Policy Settings': 'nav.policy',
  'Disbursement Queue': 'nav.disbursement',
  'SAP Management': 'nav.sap',
  'Incoming Payments': 'nav.incoming',
  'User Management': 'nav.userManagement',
  'Audit Log': 'nav.audit',
  'System Configuration': 'nav.config',
};

const roleSectionLabels: Record<string, string[]> = {
  farmer: ['Main', 'Applications', 'My Account', 'Payments', 'Help'],
  credit: ['Main', 'Applications', '', '', 'Processing', '', 'Active Loans', '', '', 'Records', '', '', 'Reports'],
  compliance: ['Main', 'Document Management', '', '', 'Compliance Calendar', '', '', 'Loan Closure', '', 'Registers', '', '', '', 'Legal Instruments', '', 'Reports', 'Cross-Role Handoffs'],
  sanction: ['Main', 'Decisions', '', '', '', '', 'Records', '', '', 'Portfolio', '', '', 'Recovery Authority', 'Cross-Role Sign-offs'],
  treasury: ['Main', 'Disbursements', 'SAP Management', 'Repayment Tracking', 'Reports', 'Audit'],
  admin: ['Administration', '', '', 'Platform Controls'],
};

export function Sidebar({ collapsed, activePage, onNavigate, expandedGroups, onToggleGroup }: SidebarProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navItems = navByRole[user?.role || 'farmer'] || farmerNav;
  const sectionLabels = roleSectionLabels[user?.role || 'farmer'] || [];

  return (
    <aside
      className="app-sidebar fixed left-0 top-14 bottom-0 z-40 flex flex-col transition-all duration-300 overflow-hidden"
      style={{
        width: collapsed ? '64px' : '240px',
        backgroundColor: '#1A3C2A',
      }}
    >
      <div className="flex-1 overflow-y-auto py-3 shell-scroll" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.12) transparent' }}>
        {navItems.map((item, index) => {
          const isActive = activePage === item.key || item.children?.some(c => c.key === activePage);
          const isExpanded = expandedGroups.includes(item.key);
          const itemLabel = t(item.i18nKey || labelI18nKeys[item.label] || `nav.${item.key}`, item.label);

          return (
            <div key={item.key}>
              {!collapsed && sectionLabels[index] && (
                <div className="sidebar-section px-4 pt-3 pb-1">
                  <div style={{ height: '1px', backgroundColor: index === 0 ? 'transparent' : 'rgba(255,255,255,0.18)', marginBottom: '8px' }} />
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.38)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {sectionLabels[index]}
                  </div>
                </div>
              )}
              <button
                className="w-full flex items-center gap-3 px-4 transition-all group relative hover:bg-white/10"
                style={{
                  height: '48px',
                  backgroundColor: isActive ? '#2D7A4F' : 'transparent',
                  borderLeft: isActive ? '3px solid #1E88E5' : '3px solid transparent',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
                }}
                onClick={() => {
                  if (item.children) {
                    onToggleGroup(item.key);
                  } else {
                    onNavigate(item.key);
                  }
                }}
                title={collapsed ? itemLabel : undefined}
                aria-label={item.children ? `${itemLabel} menu` : itemLabel}
                aria-current={isActive ? 'page' : undefined}
                aria-expanded={item.children ? isExpanded : undefined}
              >
                <span className="flex-shrink-0" style={{ opacity: isActive ? 1 : 0.75 }} aria-hidden="true">
                  {item.icon}
                </span>
                {!collapsed && (
                  <>
                    <span className="sidebar-label flex-1 text-left" style={{ fontSize: '14px', fontWeight: isActive ? 600 : 400, lineHeight: '20px' }}>
                      {itemLabel}
                    </span>
                    {item.badge && (
                      <span
                        className="sidebar-badge w-5 h-5 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: '#EF4444', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.children && (
                      <ChevronRight
                        size={14}
                        className="sidebar-chevron flex-shrink-0 transition-transform"
                        style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', opacity: 0.5 }}
                      />
                    )}
                  </>
                )}
                {collapsed && (
                  <div className="absolute left-16 bg-[#12151A] text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none shadow-lg">
                    {itemLabel}
                  </div>
                )}
              </button>

              {!collapsed && item.children && isExpanded && (
                <div className="sidebar-children" style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}>
                  {item.children.map(child => {
                    const isChildActive = activePage === child.key;
                    const childLabel = t(labelI18nKeys[child.label] || `nav.${child.key}`, child.label);
                    return (
                      <button
                        key={child.key}
                        className="w-full text-left py-2.5 pl-14 pr-4 transition-colors hover:bg-white/8"
                        style={{
                          fontSize: '13px',
                          color: isChildActive ? 'white' : 'rgba(255,255,255,0.55)',
                          fontWeight: isChildActive ? 500 : 400,
                          backgroundColor: isChildActive ? 'rgba(45,122,79,0.4)' : 'transparent',
                        }}
                        onClick={() => onNavigate(child.key)}
                        aria-current={isChildActive ? 'page' : undefined}
                        aria-label={childLabel}
                      >
                        {childLabel}
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
        <div
          className="sidebar-user px-3 py-3 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.1)' }}
        >
          <div className="flex items-center gap-2 p-2 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
              style={{ backgroundColor: '#2D7A4F' }}
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
          </div>
        </div>
      )}
    </aside>
  );
}
