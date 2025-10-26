/**
 * SharedDocuments Component
 * 
 * Shared Documents for documents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface SharedDocumentsProps {
  className?: string;
}

/**
 * SharedDocuments component - Shared Documents
 */
const SharedDocuments: React.FC<SharedDocumentsProps> = ({ className = '' }) => {
  return (
    <div className={`shared-documents ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shared Documents</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Shared Documents functionality</p>
          <p className="text-sm mt-2">Connected to documents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default SharedDocuments;
