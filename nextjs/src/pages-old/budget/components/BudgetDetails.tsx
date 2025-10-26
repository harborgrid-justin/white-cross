/**
 * BudgetDetails Component
 * 
 * Detailed view of a single budget category with transactions and metrics.
 */

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/shared/store-hooks-index';
import {
  fetchBudgetCategoryById,
  fetchBudgetTransactions,
  selectSelectedCategory,
  selectSelectedCategoryLoading,
  selectBudgetTransactions,
} from '../store/budgetSlice';
import { BudgetStatus } from '../../../types/budget';
import { Calendar, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';

interface BudgetDetailsProps {
  categoryId: string;
  className?: string;
}

/**
 * BudgetDetails component - Detailed budget category view
 */
const BudgetDetails: React.FC<BudgetDetailsProps> = ({ categoryId, className = '' }) => {
  const dispatch = useAppDispatch();
  const category = useAppSelector(selectSelectedCategory);
  const loading = useAppSelector(selectSelectedCategoryLoading);
  const transactions = useAppSelector(selectBudgetTransactions);

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchBudgetCategoryById(categoryId));
      dispatch(fetchBudgetTransactions({ filters: { categoryId }, page: 1, limit: 10 }));
    }
  }, [dispatch, categoryId]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className={`budget-details ${className}`}>
        <div className="card p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className={`budget-details ${className}`}>
        <div className="card p-6 text-center">
          <p className="text-gray-500">Budget category not found</p>
        </div>
      </div>
    );
  }

  const statusColors = {
    [BudgetStatus.UNDER_BUDGET]: 'text-green-600 bg-green-50',
    [BudgetStatus.ON_TRACK]: 'text-blue-600 bg-blue-50',
    [BudgetStatus.APPROACHING_LIMIT]: 'text-yellow-600 bg-yellow-50',
    [BudgetStatus.OVER_BUDGET]: 'text-red-600 bg-red-50',
    [BudgetStatus.CRITICAL]: 'text-red-700 bg-red-100',
  };

  return (
    <div className={`budget-details ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h2>
              {category.description && (
                <p className="text-gray-600">{category.description}</p>
              )}
            </div>
            {category.status && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[category.status]}`}>
                {category.status.replace('_', ' ')}
              </span>
            )}
          </div>

          {/* Budget Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 mb-1">Allocated</p>
                  <p className="text-2xl font-bold text-blue-900">{formatCurrency(category.allocatedAmount)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 mb-1">Spent</p>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(category.spentAmount)}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Remaining</p>
                  <p className={`text-2xl font-bold ${category.remainingAmount && category.remainingAmount < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatCurrency(category.remainingAmount || 0)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-gray-600" />
              </div>
            </div>
          </div>

          {/* Utilization Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Budget Utilization</span>
              <span className="font-semibold">{category.utilizationPercentage?.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  (category.utilizationPercentage || 0) > 100
                    ? 'bg-red-600'
                    : (category.utilizationPercentage || 0) > 80
                    ? 'bg-yellow-500'
                    : 'bg-green-600'
                }`}
                style={{ width: `${Math.min(category.utilizationPercentage || 0, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(transaction.transactionDate)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(transaction.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetDetails;
