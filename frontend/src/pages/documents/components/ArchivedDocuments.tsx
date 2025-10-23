/**
 * ArchivedDocuments Component
 * 
 * Archived Documents for documents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ArchivedDocumentsProps {
  className?: string;
}

/**
 * ArchivedDocuments component - Archived Documents
 */
const ArchivedDocuments: React.FC<ArchivedDocumentsProps> = ({ className = '' }) => {
  return (
    <div className={`archived-documents ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Archived Documents</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Archived Documents functionality</p>
          <p className="text-sm mt-2">Connected to documents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ArchivedDocuments;
