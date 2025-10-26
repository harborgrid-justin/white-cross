/**
 * OverspendingAlerts Component
 * 
 * Displays alerts for budget categories that are over budget.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';
import {
  selectOverBudgetCategories,
  selectOverBudgetCategoriesLoading,
} from '../store/budgetSlice';
import { AlertTriangle, TrendingUp } from 'lucide-react';

interface OverspendingAlertsProps {
  maxDisplay?: number;
  className?: string;
}

/**
 * OverspendingAlerts component - Shows categories exceeding budget
 */
const OverspendingAlerts: React.FC<OverspendingAlertsProps> = ({
  maxDisplay = 5,
  className = ''
}) => {
  const overBudgetCategories = useAppSelector(selectOverBudgetCategories);
  const loading = useAppSelector(selectOverBudgetCategoriesLoading);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className={`overspending-alerts ${className}`}>
        <div className="card p-4">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (overBudgetCategories.length === 0) {
    return null;
  }

  const displayCategories = overBudgetCategories.slice(0, maxDisplay);

  return (
    <div className={`overspending-alerts ${className}`}>
      <div className="card border-l-4 border-red-500 bg-red-50">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-semibold text-red-900">
                Overspending Alert
              </h3>
              <p className="text-sm text-red-700 mt-1">
                {overBudgetCategories.length} categor{overBudgetCategories.length === 1 ? 'y has' : 'ies have'} exceeded their budget allocation
              </p>
            </div>
          </div>

          {/* Category List */}
          <div className="space-y-3">
            {displayCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-lg p-4 border border-red-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>Allocated: {formatCurrency(category.allocatedAmount)}</span>
                      <span>Spent: {formatCurrency(category.spentAmount)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-red-600 font-semibold">
                      <TrendingUp className="h-4 w-4" />
                      <span>{formatCurrency(category.overAmount)}</span>
                    </div>
                    <p className="text-xs text-red-600 mt-1">
                      {category.overPercentage.toFixed(1)}% over budget
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Link */}
          {overBudgetCategories.length > maxDisplay && (
            <div className="mt-4 text-center">
              <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                View all {overBudgetCategories.length} overspending categories →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverspendingAlerts;
