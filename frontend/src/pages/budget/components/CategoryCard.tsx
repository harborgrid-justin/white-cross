/**
 * CategoryCard Component
 * 
 * Display card for a budget category (reuses BudgetCard functionality).
 */

import React from 'react';
import { BudgetCategoryWithMetrics } from '../../../types/budget';
import BudgetCard from './BudgetCard';

interface CategoryCardProps {
  category: BudgetCategoryWithMetrics;
  onClick?: () => void;
  viewMode?: 'grid' | 'list';
  className?: string;
}

/**
 * CategoryCard component - Wraps BudgetCard for category display
 */
const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onClick,
  viewMode = 'grid',
  className = ''
}) => {
  // CategoryCard is essentially a BudgetCard with specific styling for category views
  return (
    <BudgetCard
      category={category}
      onClick={onClick}
      className={className}
    />
  );
};

export default CategoryCard;
