/**
 * DocumentsList Component
 * 
 * Documents List for documents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface DocumentsListProps {
  className?: string;
}

/**
 * DocumentsList component - Documents List
 */
const DocumentsList: React.FC<DocumentsListProps> = ({ className = '' }) => {
  return (
    <div className={`documents-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Documents List functionality</p>
          <p className="text-sm mt-2">Connected to documents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentsList;
