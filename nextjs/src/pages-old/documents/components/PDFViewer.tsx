/**
 * PDFViewer Component
 * 
 * P D F Viewer for documents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface PDFViewerProps {
  className?: string;
}

/**
 * PDFViewer component - P D F Viewer
 */
const PDFViewer: React.FC<PDFViewerProps> = ({ className = '' }) => {
  return (
    <div className={`p-d-f-viewer ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">P D F Viewer</h3>
        <div className="text-center text-gray-500 py-8">
          <p>P D F Viewer functionality</p>
          <p className="text-sm mt-2">Connected to documents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
