/**
 * StandardReportList Component
 * 
 * Standard Report List for reports module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface StandardReportListProps {
  className?: string;
}

/**
 * StandardReportList component - Standard Report List
 */
const StandardReportList: React.FC<StandardReportListProps> = ({ className = '' }) => {
  return (
    <div className={`standard-report-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Standard Report List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Standard Report List functionality</p>
          <p className="text-sm mt-2">Connected to reports Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default StandardReportList;
