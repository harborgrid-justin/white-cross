/**
 * DocumentSearch Component
 * 
 * Document Search for documents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface DocumentSearchProps {
  className?: string;
}

/**
 * DocumentSearch component - Document Search
 */
const DocumentSearch: React.FC<DocumentSearchProps> = ({ className = '' }) => {
  return (
    <div className={`document-search ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Search</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Document Search functionality</p>
          <p className="text-sm mt-2">Connected to documents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentSearch;
