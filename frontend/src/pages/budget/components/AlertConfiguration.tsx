/**
 * AlertConfiguration Component
 * 
 * Alert settings configuration for budget module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { selectCurrentFiscalYear } from '../store/budgetSlice';

interface AlertConfigurationProps {
  className?: string;
}

/**
 * AlertConfiguration component - Alert settings configuration
 */
const AlertConfiguration: React.FC<AlertConfigurationProps> = ({ className = '' }) => {
  const fiscalYear = useAppSelector(selectCurrentFiscalYear);

  return (
    <div className={`alert-configuration ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert settings configuration</h3>
        <p className="text-gray-600 mb-4">Fiscal Year {fiscalYear}</p>
        <div className="text-center text-gray-500 py-8">
          <p>Alert settings configuration functionality</p>
          <p className="text-sm mt-2">This component connects to the Budget Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default AlertConfiguration;
