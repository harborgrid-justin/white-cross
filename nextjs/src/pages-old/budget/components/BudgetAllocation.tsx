/**
 * BudgetAllocation Component
 * 
 * Visual breakdown of budget allocation across categories with pie chart visualization.
 */

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/shared/store-hooks-index';
import {
  fetchBudgetCategories,
  fetchBudgetSummary,
  selectBudgetCategories,
  selectBudgetSummary,
  selectCurrentFiscalYear,
} from '../store/budgetSlice';
import { DollarSign, PieChart } from 'lucide-react';

interface BudgetAllocationProps {
  className?: string;
}

/**
 * BudgetAllocation component - Show budget allocation breakdown
 */
const BudgetAllocation: React.FC<BudgetAllocationProps> = ({ className = '' }) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectBudgetCategories);
  const summary = useAppSelector(selectBudgetSummary);
  const fiscalYear = useAppSelector(selectCurrentFiscalYear);

  useEffect(() => {
    dispatch(fetchBudgetCategories({ fiscalYear, activeOnly: true }));
    dispatch(fetchBudgetSummary(fiscalYear));
  }, [dispatch, fiscalYear]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalAllocated = summary?.totalAllocated || 0;

  // Calculate allocation percentages
  const allocations = categories.map(cat => ({
    ...cat,
    percentage: totalAllocated > 0 ? (cat.allocatedAmount / totalAllocated) * 100 : 0
  })).sort((a, b) => b.percentage - a.percentage);

  // Color palette for allocation visualization
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
  ];

  return (
    <div className={`budget-allocation ${className}`}>
      <div className="card p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Budget Allocation</h3>
            <p className="text-gray-600">Fiscal Year {fiscalYear}</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold text-blue-900">
              {formatCurrency(totalAllocated)}
            </span>
          </div>
        </div>

        {/* Allocation Visualization */}
        {allocations.length === 0 ? (
          <div className="text-center py-12">
            <PieChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No budget allocations to display</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Allocation Bars */}
            {allocations.map((allocation, index) => (
              <div key={allocation.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                    <span className="font-medium text-gray-900">{allocation.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">{formatCurrency(allocation.allocatedAmount)}</span>
                    <span className="font-semibold text-gray-900 w-16 text-right">
                      {allocation.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${colors[index % colors.length]}`}
                    style={{ width: `${allocation.percentage}%` }}
                  />
                </div>
              </div>
            ))}

            {/* Legend Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Categories</p>
                  <p className="text-xl font-bold text-gray-900">{allocations.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Allocated</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(totalAllocated)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(summary?.totalSpent || 0)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Remaining</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(summary?.totalRemaining || 0)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetAllocation;
