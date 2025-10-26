/**
 * ExportHistory Component
 * 
 * Export History for reports module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ExportHistoryProps {
  className?: string;
}

/**
 * ExportHistory component - Export History
 */
const ExportHistory: React.FC<ExportHistoryProps> = ({ className = '' }) => {
  return (
    <div className={`export-history ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export History</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Export History functionality</p>
          <p className="text-sm mt-2">Connected to reports Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ExportHistory;
