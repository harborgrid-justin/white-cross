/**
 * BudgetList Component
 * 
 * Displays a list of budget categories with filtering and sorting.
 */

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/shared/store-hooks-index';
import {
  fetchBudgetCategories,
  selectBudgetCategories,
  selectCategoriesLoading,
  selectCurrentFiscalYear,
} from '../store/budgetSlice';
import BudgetCard from './BudgetCard';
import { Filter, Search } from 'lucide-react';

interface BudgetListProps {
  fiscalYear?: number;
  activeOnly?: boolean;
  className?: string;
}

/**
 * BudgetList component - Lists all budget categories
 */
const BudgetList: React.FC<BudgetListProps> = ({
  fiscalYear,
  activeOnly = true,
  className = ''
}) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectBudgetCategories);
  const loading = useAppSelector(selectCategoriesLoading);
  const currentFiscalYear = useAppSelector(selectCurrentFiscalYear);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'allocated' | 'spent' | 'remaining'>('name');

  const selectedFiscalYear = fiscalYear || currentFiscalYear;

  useEffect(() => {
    dispatch(fetchBudgetCategories({ fiscalYear: selectedFiscalYear, activeOnly }));
  }, [dispatch, selectedFiscalYear, activeOnly]);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    switch (sortBy) {
      case 'allocated':
        return b.allocatedAmount - a.allocatedAmount;
      case 'spent':
        return b.spentAmount - a.spentAmount;
      case 'remaining':
        return (b.remainingAmount || 0) - (a.remainingAmount || 0);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  if (loading) {
    return (
      <div className={`budget-list ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`budget-list ${className}`}>
      {/* Header with Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="input-field"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="name">Sort by Name</option>
            <option value="allocated">Sort by Allocated</option>
            <option value="spent">Sort by Spent</option>
            <option value="remaining">Sort by Remaining</option>
          </select>
        </div>
      </div>

      {/* Categories Grid */}
      {sortedCategories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No budget categories found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCategories.map((category) => (
            <BudgetCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BudgetList;
