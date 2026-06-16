import type { ReactNode } from 'react';

export interface NavItem {
  icon?: ReactNode;
  label: string;
  key: string;
  groupKey?: string;
  i18nKey?: string;
  children?: { label: string; key: string; badge?: number }[];
  badge?: number;
  section?: string;
}

export const roleAccents: Record<string, string> = {
  farmer: '#1E88E5',
  credit: '#2D7A4F',
  compliance: '#1A3C2A',
  sanction: '#7C3AED',
  treasury: '#0891B2',
  admin: '#3D4450',
};

export const roleSectionLabels: Record<string, string[]> = {
  farmer: ['Today', 'My Loan', 'Services'],
  credit: ['Today', 'Intake', 'Portfolio', 'Tools'],
  compliance: ['Today', 'Documents', 'Compliance', 'Registers'],
  sanction: ['Today', 'Decisions', 'Oversight', 'Governance'],
  treasury: ['Today', 'Disbursements', 'Finance', 'Reporting'],
  admin: ['Today', 'Controls', 'Compliance'],
};

export const creditIntakeTabs = [
  { key: 'credit-queue', label: 'New Applications', badge: 12 },
  { key: 'credit-pending', label: 'Pending Appraisal' },
  { key: 'credit-returned', label: 'Returned / Incomplete' },
  { key: 'credit-sc-queue', label: 'SC Tracker' },
];

export const creditWorkbenchTabs = [
  { key: 'credit-register', label: 'Loan Register' },
  { key: 'credit-active-loans', label: 'Active Loans' },
  { key: 'credit-dpd', label: 'DPD Monitoring' },
  { key: 'credit-defaults', label: 'Defaults & Recovery' },
  { key: 'credit-mis', label: 'MIS Reports' },
  { key: 'credit-rejected', label: 'Rejected' },
  { key: 'credit-exceptions', label: 'Exceptions' },
];

export const complianceQueueTabs = [
  { key: 'cs-queue', label: 'All Pending', badge: 14 },
  { key: 'cs-awaiting-prep', label: 'Awaiting Prep' },
  { key: 'cs-awaiting-review', label: 'Awaiting Review' },
  { key: 'cs-signoff', label: 'CS Sign-off', badge: 3 },
];

export const complianceDocTabs = [
  { key: 'cs-workspace', label: 'Workspace' },
  { key: 'cs-poa', label: 'PoA' },
  { key: 'cs-triparty', label: 'Tri-Party' },
  { key: 'cs-sh4', label: 'SH-4 / CDSL' },
  { key: 'cs-termsheet', label: 'Term Sheet' },
  { key: 'cs-agreement', label: 'Loan Agreement' },
];

export const complianceKycTabs = [
  { key: 'cs-kyc', label: 'All Members' },
  { key: 'cs-pending-kyc', label: 'Pending KYC', badge: 4 },
  { key: 'cs-rekyc', label: 'Re-KYC Due', badge: 9 },
];

export const sanctionWorkbenchTabs = [
  { key: 'sc-awaiting', label: 'Approval Queue', badge: 7 },
  { key: 'sc-my-sign', label: 'Awaiting My Sign', badge: 5 },
  { key: 'sc-joint', label: 'Joint Approvals', badge: 2 },
  { key: 'sc-special-cases', label: 'Special Cases', badge: 1 },
  { key: 'sc-returns', label: 'Returns' },
  { key: 'sc-final-signoff', label: 'Final Sign-off', badge: 2 },
];

export const sanctionPortfolioTabs = [
  { key: 'sc-health', label: 'Portfolio Health' },
  { key: 'sc-exposure', label: 'Exposure & Limits' },
  { key: 'sc-dpd', label: 'DPD Summary' },
];

export const treasuryDisbursementTabs = [
  { key: 'treasury-pending', label: 'Pending Initiation', badge: 2 },
  { key: 'treasury-auth', label: 'Authorizations', badge: 2 },
  { key: 'treasury-today', label: 'Disbursed Today' },
  { key: 'treasury-disbursement', label: 'Process Flow' },
];

export const treasuryFinanceTabs = [
  { key: 'treasury-incoming', label: 'Incoming Payments' },
  { key: 'treasury-deductions', label: 'Subsidiary Deductions' },
  { key: 'treasury-interest', label: 'Interest Accruals' },
  { key: 'treasury-reconciliation', label: 'Reconciliation' },
  { key: 'treasury-reports', label: 'Reports' },
];

export const treasurySapTabs = [
  { key: 'treasury-sap-codes', label: 'Customer Codes' },
  { key: 'treasury-sap-log', label: 'SAP Entries Log' },
];

export const complianceRegisterTabs = [
  { key: 'cs-loan-register', label: 'Loan Register' },
  { key: 'cs-sanction-register', label: 'Sanction Register' },
  { key: 'cs-noc', label: 'NOC Queue', badge: 2 },
  { key: 'cs-calendar', label: 'Calendar', badge: 3 },
  { key: 'cs-stamp', label: 'Stamp Register' },
  { key: 'cs-grievance', label: 'Grievances' },
  { key: 'cs-reports', label: 'Reports' },
];

/**
 * Default expanded sidebar groups per role on first load.
 * Each role opens with ONLY its primary task-group expanded, so the sidebar
 * lands calm and directed instead of a wall of every sub-item (see the audit:
 * "no nested-group sprawl by default"). Users can still expand the rest.
 */
export const defaultExpandedGroups: Record<string, string[]> = {
  farmer: [],
  credit: ['credit-inbox'],
  compliance: ['cs-doc-queue'],
  sanction: ['sc-decisions'],
  treasury: ['treasury-disburse'],
  admin: [],
};

/** Page title metadata for breadcrumbs / quick lookup */
export const pageTitles: Record<string, string> = {
  'farmer-dashboard': 'My Dashboard',
  'farmer-apply': 'Apply for Loan',
  'farmer-active-loans': 'Active Loan',
  'farmer-loan-history': 'Loan History',
  'farmer-documents': 'My Documents',
  'farmer-repayment': 'Make Payment',
  'farmer-support': 'Support & Grievance',
  'farmer-noc': 'NOC & Closure',
  'credit-dashboard': 'Dashboard',
  'credit-queue': 'Application Inbox',
  'credit-review': 'Appraisal Note',
  'credit-calculator': 'Loan Calculator',
  'cs-dashboard': 'CS Dashboard',
  'sc-dashboard': 'SC Dashboard',
  'treasury-dashboard': 'Treasury Dashboard',
  'sc-final-signoff': 'Final Checklist Sign-off',
  'credit-manual-entry': 'Manual Application Entry',
  'member-loan-profile': 'Member / Loan Profile',
  'notifications-center': 'Notifications',
};
