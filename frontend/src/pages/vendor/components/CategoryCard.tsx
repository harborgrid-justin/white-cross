/**
 * CategoryCard Component
 * 
 * Category Card for vendor module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface CategoryCardProps {
  className?: string;
}

/**
 * CategoryCard component - Category Card
 */
const CategoryCard: React.FC<CategoryCardProps> = ({ className = '' }) => {
  return (
    <div className={`category-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Category Card functionality</p>
          <p className="text-sm mt-2">Connected to vendor Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
