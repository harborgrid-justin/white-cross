/**
 * ReportPreview Component
 * 
 * Report Preview for reports module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ReportPreviewProps {
  className?: string;
}

/**
 * ReportPreview component - Report Preview
 */
const ReportPreview: React.FC<ReportPreviewProps> = ({ className = '' }) => {
  return (
    <div className={`report-preview ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Preview</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Report Preview functionality</p>
          <p className="text-sm mt-2">Connected to reports Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;
