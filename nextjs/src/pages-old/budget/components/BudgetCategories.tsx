/**
 * BudgetCategories Component
 * 
 * Comprehensive view of all budget categories with management options.
 */

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/shared/store-hooks-index';
import {
  fetchBudgetCategories,
  selectBudgetCategories,
  selectCategoriesLoading,
  selectCurrentFiscalYear,
} from '../store/budgetSlice';
import CategoryCard from './CategoryCard';
import { Plus, Grid, List } from 'lucide-react';

interface BudgetCategoriesProps {
  className?: string;
  onCreateCategory?: () => void;
  onSelectCategory?: (categoryId: string) => void;
}

/**
 * BudgetCategories component - Manage budget categories
 */
const BudgetCategories: React.FC<BudgetCategoriesProps> = ({
  className = '',
  onCreateCategory,
  onSelectCategory
}) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectBudgetCategories);
  const loading = useAppSelector(selectCategoriesLoading);
  const fiscalYear = useAppSelector(selectCurrentFiscalYear);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    dispatch(fetchBudgetCategories({
      fiscalYear,
      activeOnly: !showInactive
    }));
  }, [dispatch, fiscalYear, showInactive]);

  const activeCategories = categories.filter(c => c.isActive);
  const inactiveCategories = categories.filter(c => !c.isActive);

  return (
    <div className={`budget-categories ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Budget Categories</h2>
            <p className="text-gray-600">
              Fiscal Year {fiscalYear} • {activeCategories.length} active categories
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'text-gray-600'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'text-gray-600'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            {onCreateCategory && (
              <button className="btn-primary flex items-center gap-2" onClick={onCreateCategory}>
                <Plus className="h-4 w-4" />
                New Category
              </button>
            )}
          </div>
        </div>

        {/* Toggle inactive */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showInactive"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <label htmlFor="showInactive" className="ml-2 text-sm text-gray-700">
            Show inactive categories ({inactiveCategories.length})
          </label>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && categories.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">No budget categories found</p>
          {onCreateCategory && (
            <button className="btn-primary" onClick={onCreateCategory}>
              Create your first category
            </button>
          )}
        </div>
      )}

      {/* Categories Grid/List */}
      {!loading && categories.length > 0 && (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => onSelectCategory?.(category.id)}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BudgetCategories;
