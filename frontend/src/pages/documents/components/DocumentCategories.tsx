/**
 * DocumentCategories Component
 * 
 * Document Categories for documents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface DocumentCategoriesProps {
  className?: string;
}

/**
 * DocumentCategories component - Document Categories
 */
const DocumentCategories: React.FC<DocumentCategoriesProps> = ({ className = '' }) => {
  return (
    <div className={`document-categories ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Categories</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Document Categories functionality</p>
          <p className="text-sm mt-2">Connected to documents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentCategories;
