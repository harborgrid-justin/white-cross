/**
 * YearEndClosing Component
 * 
 * Year-end closing process for budget module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { selectCurrentFiscalYear } from '../store/budgetSlice';

interface YearEndClosingProps {
  className?: string;
}

/**
 * YearEndClosing component - Year-end closing process
 */
const YearEndClosing: React.FC<YearEndClosingProps> = ({ className = '' }) => {
  const fiscalYear = useAppSelector(selectCurrentFiscalYear);

  return (
    <div className={`year-end-closing ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Year-end closing process</h3>
        <p className="text-gray-600 mb-4">Fiscal Year {fiscalYear}</p>
        <div className="text-center text-gray-500 py-8">
          <p>Year-end closing process functionality</p>
          <p className="text-sm mt-2">This component connects to the Budget Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default YearEndClosing;
