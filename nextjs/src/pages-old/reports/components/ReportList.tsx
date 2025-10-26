/**
 * ReportList Component
 * 
 * Report List for reports module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ReportListProps {
  className?: string;
}

/**
 * ReportList component - Report List
 */
const ReportList: React.FC<ReportListProps> = ({ className = '' }) => {
  return (
    <div className={`report-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Report List functionality</p>
          <p className="text-sm mt-2">Connected to reports Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ReportList;
