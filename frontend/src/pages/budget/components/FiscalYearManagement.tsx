/**
 * FiscalYearManagement Component
 * 
 * Fiscal year management for budget module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { selectCurrentFiscalYear } from '../store/budgetSlice';

interface FiscalYearManagementProps {
  className?: string;
}

/**
 * FiscalYearManagement component - Fiscal year management
 */
const FiscalYearManagement: React.FC<FiscalYearManagementProps> = ({ className = '' }) => {
  const fiscalYear = useAppSelector(selectCurrentFiscalYear);

  return (
    <div className={`fiscal-year-management ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fiscal year management</h3>
        <p className="text-gray-600 mb-4">Fiscal Year {fiscalYear}</p>
        <div className="text-center text-gray-500 py-8">
          <p>Fiscal year management functionality</p>
          <p className="text-sm mt-2">This component connects to the Budget Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default FiscalYearManagement;
