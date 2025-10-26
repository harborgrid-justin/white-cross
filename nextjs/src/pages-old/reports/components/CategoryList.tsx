/**
 * CategoryList Component
 * 
 * Category List for reports module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface CategoryListProps {
  className?: string;
}

/**
 * CategoryList component - Category List
 */
const CategoryList: React.FC<CategoryListProps> = ({ className = '' }) => {
  return (
    <div className={`category-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Category List functionality</p>
          <p className="text-sm mt-2">Connected to reports Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
