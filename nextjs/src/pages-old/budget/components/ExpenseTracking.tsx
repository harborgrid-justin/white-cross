/**
 * ExpenseTracking Component
 * 
 * Comprehensive expense tracking dashboard with transactions and analytics.
 */

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/shared/store-hooks-index';
import {
  fetchBudgetTransactions,
  selectBudgetTransactions,
  selectTransactionsLoading,
  selectTransactionsPagination,
  selectCurrentFiscalYear,
} from '../store/budgetSlice';
import ExpenseList from './ExpenseList';
import { Filter, Download, Plus } from 'lucide-react';

interface ExpenseTrackingProps {
  categoryId?: string;
  className?: string;
}

/**
 * ExpenseTracking component - Track and manage expenses
 */
const ExpenseTracking: React.FC<ExpenseTrackingProps> = ({
  categoryId,
  className = ''
}) => {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector(selectBudgetTransactions);
  const loading = useAppSelector(selectTransactionsLoading);
  const pagination = useAppSelector(selectTransactionsPagination);
  const fiscalYear = useAppSelector(selectCurrentFiscalYear);
  
  const [filters, setFilters] = useState({
    categoryId,
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    dispatch(fetchBudgetTransactions({
      page: pagination.page,
      limit: pagination.limit,
      filters: { ...filters, categoryId: categoryId || filters.categoryId }
    }));
  }, [dispatch, pagination.page, pagination.limit, filters, categoryId]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = () => {
    // Export functionality would be implemented here
    console.log('Exporting expense data...');
  };

  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className={`expense-tracking ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Expense Tracking</h2>
            <p className="text-gray-600">Fiscal Year {fiscalYear}</p>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button className="btn-secondary flex items-center gap-2" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="btn-primary flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Expense
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-4">
            <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-600 mb-1">Transaction Count</p>
            <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-600 mb-1">Average Transaction</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(pagination.total > 0 ? totalExpenses / pagination.total : 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Expense List */}
      <ExpenseList
        transactions={transactions}
        loading={loading}
        pagination={pagination}
      />
    </div>
  );
};

export default ExpenseTracking;
