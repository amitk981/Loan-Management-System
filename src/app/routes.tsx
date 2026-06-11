import { useEffect, useState } from 'react';
import { createBrowserRouter } from 'react-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { LoginPage } from './components/auth/LoginPage';
import { MemberLoanProfile, NotificationsCenter } from './components/shared/UtilityScreens';
import { CrossRoleScreens } from './components/shared/CrossRoleScreens';

// Farmer
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { LoanApplication } from './components/farmer/LoanApplication';
import { LoanStatus } from './components/farmer/LoanStatus';
import { RepaymentScreen } from './components/farmer/RepaymentScreen';
import { SupportGrievance } from './components/farmer/SupportGrievance';

// Credit
import { CreditDashboard } from './components/credit/CreditDashboard';
import { ApplicationQueue } from './components/credit/ApplicationQueue';
import { ApplicationReview } from './components/credit/ApplicationReview';
import { LoanCalculator } from './components/credit/LoanCalculator';
import { CreditOperations } from './components/credit/CreditOperations';

// Compliance
import { ComplianceDashboard } from './components/compliance/ComplianceDashboard';
import { DocumentWorkspace } from './components/compliance/DocumentWorkspace';
import { KYCManagement } from './components/compliance/KYCManagement';
import { ComplianceOperations } from './components/compliance/ComplianceOperations';

// Sanction
import { SanctionDashboard } from './components/sanction/SanctionDashboard';
import { ApprovalScreen } from './components/sanction/ApprovalScreen';
import { SanctionOperations } from './components/sanction/SanctionOperations';

// Treasury
import { TreasuryDashboard } from './components/treasury/TreasuryDashboard';
import { DisbursementScreen } from './components/treasury/DisbursementScreen';
import { TreasuryOperations } from './components/treasury/TreasuryOperations';

// Admin
import { UserManagement, AuditLog, SystemConfig, PortfolioOverview } from './components/admin/AdminScreens';

// App root with internal navigation state
const defaultPages: Record<string, string> = {
  farmer: 'farmer-dashboard',
  credit: 'credit-dashboard',
  compliance: 'cs-dashboard',
  sanction: 'sc-dashboard',
  treasury: 'treasury-dashboard',
  admin: 'admin-users',
};

const rolePages: Record<string, string[]> = {
  farmer: ['farmer-dashboard', 'farmer-apply', 'farmer-active-loans', 'farmer-loan-history', 'farmer-documents', 'farmer-repayment', 'farmer-support', 'farmer-noc'],
  credit: ['credit-dashboard', 'credit-queue', 'credit-pending', 'credit-returned', 'credit-review', 'credit-sc-queue', 'credit-active-loans', 'credit-repayments', 'credit-dpd', 'credit-register', 'credit-rejected', 'credit-exceptions', 'credit-mis', 'credit-interest-invoices', 'credit-calculator', 'credit-search-member', 'credit-member-profile', 'credit-analytics', 'credit-defaults', 'credit-all-apps'],
  compliance: ['cs-dashboard', 'cs-queue', 'cs-workspace', 'cs-archive', 'cs-awaiting-prep', 'cs-awaiting-review', 'cs-signoff', 'cs-poa', 'cs-triparty', 'cs-sh4', 'cs-termsheet', 'cs-agreement', 'cs-kyc', 'cs-pending-kyc', 'cs-rekyc', 'cs-noc', 'cs-calendar', 'cs-cdsl', 'cs-security-return', 'cs-loan-register', 'cs-sanction-register', 'cs-exception-register', 'cs-grievance', 'cs-stamp', 'cs-poa-register', 'cs-reports'],
  sanction: ['sc-dashboard', 'sc-awaiting', 'sc-my-sign', 'sc-joint', 'sc-review', 'sc-special-cases', 'sc-returns', 'sc-register', 'sc-exceptions', 'sc-health', 'sc-exposure', 'sc-dpd', 'sc-board', 'sc-policy', 'sc-security-invocation', 'sc-default-escalations'],
  treasury: ['treasury-dashboard', 'treasury-pending', 'treasury-auth', 'treasury-today', 'treasury-sap-codes', 'treasury-sap-log', 'treasury-incoming', 'treasury-deductions', 'treasury-interest', 'treasury-reconciliation', 'treasury-ledger', 'treasury-exports', 'treasury-reports', 'treasury-disbursement'],
  admin: ['admin-users', 'admin-portfolio', 'admin-audit', 'admin-config', 'admin-section186', 'admin-nbfc'],
};

const utilityPages = [
  'notifications-center',
  'member-loan-profile',
  'integration-overview',
  'credit-manual-entry',
  'sc-final-signoff',
  'cs-new-loan',
  'cs-archive-file',
  'farmer-post-disbursement',
  'farmer-payment-processing',
  'farmer-fully-repaid',
  'farmer-noc-delivered',
  'shared-director-case',
  'shared-rate-change',
  'shared-s186-lock',
  'shared-audit-trail',
  'shared-notifications',
];

function readPageFromUrl() {
  return new URLSearchParams(window.location.search).get('page') || '';
}

function AppRoot() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState<string>(() => readPageFromUrl());

  const navigate = (page: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', page);
    window.history.pushState({}, '', url);
    setActivePage(page);
  };

  useEffect(() => {
    const handlePop = () => setActivePage(readPageFromUrl());
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  if (!user) {
    return <LoginPage />;
  }

  // Set default page per role
  const isAllowedPage = utilityPages.includes(activePage) || rolePages[user.role]?.includes(activePage);
  if (!activePage || !isAllowedPage) {
    const fallback = defaultPages[user.role] || 'farmer-dashboard';
    const url = new URL(window.location.href);
    url.searchParams.set('page', fallback);
    window.history.replaceState({}, '', url);
    setActivePage(fallback);
    return null;
  }

  const props = { onNavigate: navigate, activePage };

  if (activePage === 'notifications-center') return <NotificationsCenter {...props} />;
  if (activePage === 'member-loan-profile') return <MemberLoanProfile {...props} />;
  if (utilityPages.includes(activePage)) return <CrossRoleScreens {...props} />;

  // --- Farmer Screens ---
  if (user.role === 'farmer') {
    if (activePage === 'farmer-dashboard') return <FarmerDashboard {...props} />;
    if (activePage === 'farmer-apply') return <LoanApplication {...props} />;
    if (activePage === 'farmer-active-loans' || activePage === 'farmer-loan-history' || activePage === 'farmer-noc') return <LoanStatus {...props} />;
    if (activePage === 'farmer-documents') return <LoanStatus {...props} />;
    if (activePage === 'farmer-repayment') return <RepaymentScreen {...props} />;
    if (activePage === 'farmer-support') return <SupportGrievance {...props} />;
    return <FarmerDashboard {...props} />;
  }

  // --- Credit Team Screens ---
  if (user.role === 'credit') {
    if (activePage === 'credit-dashboard') return <CreditDashboard {...props} />;
    if (activePage === 'credit-queue') return <ApplicationQueue {...props} />;
    if (activePage === 'credit-review') return <ApplicationReview {...props} />;
    if (activePage === 'credit-calculator') return <LoanCalculator {...props} />;
    if (['credit-pending', 'credit-returned', 'credit-sc-queue', 'credit-active-loans', 'credit-repayments', 'credit-dpd', 'credit-register', 'credit-rejected', 'credit-exceptions', 'credit-mis', 'credit-interest-invoices', 'credit-search-member', 'credit-member-profile', 'credit-analytics', 'credit-defaults', 'credit-all-apps'].includes(activePage)) return <CreditOperations {...props} />;
    return <CreditDashboard {...props} />;
  }

  // --- Compliance Screens ---
  if (user.role === 'compliance') {
    if (activePage === 'cs-dashboard') return <ComplianceDashboard {...props} />;
    if (['cs-queue', 'cs-workspace', 'cs-awaiting-prep', 'cs-awaiting-review', 'cs-signoff', 'cs-poa', 'cs-triparty', 'cs-sh4', 'cs-termsheet', 'cs-agreement'].includes(activePage)) return <DocumentWorkspace {...props} />;
    if (activePage === 'cs-kyc' || activePage === 'cs-pending-kyc' || activePage === 'cs-rekyc') return <KYCManagement {...props} />;
    if (['cs-noc', 'cs-calendar', 'cs-cdsl', 'cs-security-return', 'cs-loan-register', 'cs-sanction-register', 'cs-exception-register', 'cs-grievance', 'cs-stamp', 'cs-poa-register', 'cs-reports', 'cs-archive'].includes(activePage)) return <ComplianceOperations {...props} />;
    return <ComplianceDashboard {...props} />;
  }

  // --- Sanction Screens ---
  if (user.role === 'sanction') {
    if (activePage === 'sc-dashboard') return <SanctionDashboard {...props} />;
    if (activePage === 'sc-joint' || activePage === 'sc-review') return <ApprovalScreen {...props} />;
    if (['sc-awaiting', 'sc-my-sign', 'sc-register', 'sc-exceptions', 'sc-health', 'sc-exposure', 'sc-dpd', 'sc-board', 'sc-policy', 'sc-special-cases', 'sc-returns', 'sc-security-invocation', 'sc-default-escalations'].includes(activePage)) return <SanctionOperations {...props} />;
    return <SanctionDashboard {...props} />;
  }

  // --- Treasury Screens ---
  if (user.role === 'treasury') {
    if (activePage === 'treasury-dashboard') return <TreasuryDashboard {...props} />;
    if (['treasury-pending', 'treasury-auth', 'treasury-today', 'treasury-sap-codes', 'treasury-sap-log', 'treasury-incoming', 'treasury-deductions', 'treasury-interest', 'treasury-reconciliation', 'treasury-ledger', 'treasury-exports', 'treasury-reports'].includes(activePage)) return <TreasuryOperations {...props} />;
    if (activePage === 'treasury-disbursement') return <DisbursementScreen {...props} />;
    return <TreasuryDashboard {...props} />;
  }

  // --- Admin Screens ---
  if (user.role === 'admin') {
    if (activePage === 'admin-portfolio') return <PortfolioOverview {...props} />;
    if (activePage === 'admin-users') return <UserManagement {...props} />;
    if (activePage === 'admin-audit') return <AuditLog {...props} />;
    if (['admin-config', 'admin-section186', 'admin-nbfc'].includes(activePage)) return <SystemConfig {...props} />;
    return <UserManagement {...props} />;
  }

  return <LoginPage />;
}

function Root() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppRoot />
      </AuthProvider>
    </LanguageProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
  },
  {
    path: '*',
    Component: Root,
  },
]);
