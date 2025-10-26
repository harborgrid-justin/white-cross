/**
 * BudgetApprovals Component
 * 
 * Budget approval workflow for budget module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { selectCurrentFiscalYear } from '../store/budgetSlice';

interface BudgetApprovalsProps {
  className?: string;
}

/**
 * BudgetApprovals component - Budget approval workflow
 */
const BudgetApprovals: React.FC<BudgetApprovalsProps> = ({ className = '' }) => {
  const fiscalYear = useAppSelector(selectCurrentFiscalYear);

  return (
    <div className={`budget-approvals ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget approval workflow</h3>
        <p className="text-gray-600 mb-4">Fiscal Year {fiscalYear}</p>
        <div className="text-center text-gray-500 py-8">
          <p>Budget approval workflow functionality</p>
          <p className="text-sm mt-2">This component connects to the Budget Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default BudgetApprovals;
