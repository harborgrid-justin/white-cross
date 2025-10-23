/**
 * ReportSharing Component
 * 
 * Report Sharing for reports module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ReportSharingProps {
  className?: string;
}

/**
 * ReportSharing component - Report Sharing
 */
const ReportSharing: React.FC<ReportSharingProps> = ({ className = '' }) => {
  return (
    <div className={`report-sharing ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Sharing</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Report Sharing functionality</p>
          <p className="text-sm mt-2">Connected to reports Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ReportSharing;
