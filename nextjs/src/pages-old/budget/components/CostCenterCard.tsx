/**
 * CostCenterCard Component
 * 
 * Cost center display card for budget module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { selectCurrentFiscalYear } from '../store/budgetSlice';

interface CostCenterCardProps {
  className?: string;
}

/**
 * CostCenterCard component - Cost center display card
 */
const CostCenterCard: React.FC<CostCenterCardProps> = ({ className = '' }) => {
  const fiscalYear = useAppSelector(selectCurrentFiscalYear);

  return (
    <div className={`cost-center-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost center display card</h3>
        <p className="text-gray-600 mb-4">Fiscal Year {fiscalYear}</p>
        <div className="text-center text-gray-500 py-8">
          <p>Cost center display card functionality</p>
          <p className="text-sm mt-2">This component connects to the Budget Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default CostCenterCard;
