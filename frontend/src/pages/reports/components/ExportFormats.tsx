/**
 * ExportFormats Component
 * 
 * Export Formats for reports module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ExportFormatsProps {
  className?: string;
}

/**
 * ExportFormats component - Export Formats
 */
const ExportFormats: React.FC<ExportFormatsProps> = ({ className = '' }) => {
  return (
    <div className={`export-formats ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Formats</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Export Formats functionality</p>
          <p className="text-sm mt-2">Connected to reports Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ExportFormats;
