/**
 * DocumentViewer Component
 * 
 * Document Viewer for documents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface DocumentViewerProps {
  className?: string;
}

/**
 * DocumentViewer component - Document Viewer
 */
const DocumentViewer: React.FC<DocumentViewerProps> = ({ className = '' }) => {
  return (
    <div className={`document-viewer ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Viewer</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Document Viewer functionality</p>
          <p className="text-sm mt-2">Connected to documents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
