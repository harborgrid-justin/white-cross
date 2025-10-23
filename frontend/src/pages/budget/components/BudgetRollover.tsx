/**
 * BudgetRollover Component
 * 
 * Budget rollover functionality for budget module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { selectCurrentFiscalYear } from '../store/budgetSlice';

interface BudgetRolloverProps {
  className?: string;
}

/**
 * BudgetRollover component - Budget rollover functionality
 */
const BudgetRollover: React.FC<BudgetRolloverProps> = ({ className = '' }) => {
  const fiscalYear = useAppSelector(selectCurrentFiscalYear);

  return (
    <div className={`budget-rollover ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget rollover functionality</h3>
        <p className="text-gray-600 mb-4">Fiscal Year {fiscalYear}</p>
        <div className="text-center text-gray-500 py-8">
          <p>Budget rollover functionality functionality</p>
          <p className="text-sm mt-2">This component connects to the Budget Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default BudgetRollover;
