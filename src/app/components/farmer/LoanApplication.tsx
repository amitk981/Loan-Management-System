import { LoanApplicationForm } from './LoanApplicationForm';

interface LoanApplicationProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

// Farmer self-service application = the shared wizard in 'farmer' mode.
// The Credit Manager's Manual Loan Application Entry reuses the same wizard (credit mode)
// behind a member-search gate (see shared/ManualLoanEntry.tsx).
export function LoanApplication({ onNavigate, activePage }: LoanApplicationProps) {
  return (
    <LoanApplicationForm
      onNavigate={onNavigate}
      activePage={activePage}
      mode="farmer"
      breadcrumbs={['Farmer Portal', 'New Loan Application']}
      pageTitle="Apply for Loan"
      pageSubtitle="Complete the 5-step application form"
      onFirstStepBack={() => onNavigate('farmer-dashboard')}
      firstStepBackLabel="Back to Dashboard"
    />
  );
}
