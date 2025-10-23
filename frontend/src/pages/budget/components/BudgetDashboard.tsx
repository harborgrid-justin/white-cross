/**
 * BudgetDashboard Component
 * 
 * Main dashboard view for budget management with summary metrics and insights.
 */

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/shared/store-hooks-index';
import {
  fetchBudgetSummary,
  fetchBudgetCategories,
  fetchOverBudgetCategories,
  selectBudgetSummary,
  selectSummaryLoading,
  selectOverBudgetCategories,
  selectCurrentFiscalYear,
} from '../store/budgetSlice';
import BudgetOverviewCard from './BudgetOverviewCard';
import OverspendingAlerts from './OverspendingAlerts';

interface BudgetDashboardProps {
  className?: string;
}

/**
 * BudgetDashboard component - Main budget overview dashboard
 */
const BudgetDashboard: React.FC<BudgetDashboardProps> = ({ className = '' }) => {
  const dispatch = useAppDispatch();
  const summary = useAppSelector(selectBudgetSummary);
  const loading = useAppSelector(selectSummaryLoading);
  const overBudgetCategories = useAppSelector(selectOverBudgetCategories);
  const currentFiscalYear = useAppSelector(selectCurrentFiscalYear);

  useEffect(() => {
    dispatch(fetchBudgetSummary(currentFiscalYear));
    dispatch(fetchBudgetCategories({ fiscalYear: currentFiscalYear, activeOnly: true }));
    dispatch(fetchOverBudgetCategories(currentFiscalYear));
  }, [dispatch, currentFiscalYear]);

  if (loading) {
    return (
      <div className={`budget-dashboard ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading budget dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`budget-dashboard ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Budget Dashboard</h1>
        <p className="text-gray-600">Fiscal Year {currentFiscalYear}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <BudgetOverviewCard
          title="Total Allocated"
          amount={summary?.totalAllocated || 0}
          subtitle={`${summary?.categoryCount || 0} categories`}
          color="blue"
        />
        <BudgetOverviewCard
          title="Total Spent"
          amount={summary?.totalSpent || 0}
          subtitle={`${summary?.utilizationPercentage || 0}% utilized`}
          color="green"
        />
        <BudgetOverviewCard
          title="Remaining Budget"
          amount={summary?.totalRemaining || 0}
          subtitle={`${summary?.overBudgetCount || 0} over budget`}
          color={summary?.overBudgetCount ? 'red' : 'gray'}
        />
      </div>

      {/* Overspending Alerts */}
      {overBudgetCategories.length > 0 && (
        <div className="mb-6">
          <OverspendingAlerts />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="btn-primary">
          View All Categories
        </button>
        <button className="btn-secondary">
          Add Transaction
        </button>
        <button className="btn-secondary">
          Generate Report
        </button>
        <button className="btn-secondary">
          Export Data
        </button>
      </div>
    </div>
  );
};

export default BudgetDashboard;
