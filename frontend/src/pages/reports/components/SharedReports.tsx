/**
 * SharedReports Component
 * 
 * Shared Reports for reports module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface SharedReportsProps {
  className?: string;
}

/**
 * SharedReports component - Shared Reports
 */
const SharedReports: React.FC<SharedReportsProps> = ({ className = '' }) => {
  return (
    <div className={`shared-reports ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shared Reports</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Shared Reports functionality</p>
          <p className="text-sm mt-2">Connected to reports Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default SharedReports;
