/**
 * ReportsDashboard Component
 * 
 * Reports Dashboard for reports module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ReportsDashboardProps {
  className?: string;
}

/**
 * ReportsDashboard component - Reports Dashboard
 */
const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ className = '' }) => {
  return (
    <div className={`reports-dashboard ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports Dashboard</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Reports Dashboard functionality</p>
          <p className="text-sm mt-2">Connected to reports Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
