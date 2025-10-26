/**
 * DocumentGrid Component
 * 
 * Document Grid for documents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface DocumentGridProps {
  className?: string;
}

/**
 * DocumentGrid component - Document Grid
 */
const DocumentGrid: React.FC<DocumentGridProps> = ({ className = '' }) => {
  return (
    <div className={`document-grid ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Grid</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Document Grid functionality</p>
          <p className="text-sm mt-2">Connected to documents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentGrid;
