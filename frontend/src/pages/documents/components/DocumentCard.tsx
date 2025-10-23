/**
 * DocumentCard Component
 * 
 * Document Card for documents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface DocumentCardProps {
  className?: string;
}

/**
 * DocumentCard component - Document Card
 */
const DocumentCard: React.FC<DocumentCardProps> = ({ className = '' }) => {
  return (
    <div className={`document-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Document Card functionality</p>
          <p className="text-sm mt-2">Connected to documents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
