/**
 * ExportDialog Component
 * 
 * Export Dialog for reports module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ExportDialogProps {
  className?: string;
}

/**
 * ExportDialog component - Export Dialog
 */
const ExportDialog: React.FC<ExportDialogProps> = ({ className = '' }) => {
  return (
    <div className={`export-dialog ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Dialog</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Export Dialog functionality</p>
          <p className="text-sm mt-2">Connected to reports Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ExportDialog;
