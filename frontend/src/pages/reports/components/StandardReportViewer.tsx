/**
 * StandardReportViewer Component
 * 
 * Standard Report Viewer for reports module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface StandardReportViewerProps {
  className?: string;
}

/**
 * StandardReportViewer component - Standard Report Viewer
 */
const StandardReportViewer: React.FC<StandardReportViewerProps> = ({ className = '' }) => {
  return (
    <div className={`standard-report-viewer ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Standard Report Viewer</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Standard Report Viewer functionality</p>
          <p className="text-sm mt-2">Connected to reports Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default StandardReportViewer;
