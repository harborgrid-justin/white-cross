/**
 * ExpenseList Component
 * 
 * List view of expense transactions with pagination.
 */

import React from 'react';
import { BudgetTransaction } from '../../../types/budget';
import ExpenseCard from './ExpenseCard';

interface ExpenseListProps {
  transactions: BudgetTransaction[];
  loading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  className?: string;
}

/**
 * ExpenseList component - Displays list of expenses
 */
const ExpenseList: React.FC<ExpenseListProps> = ({
  transactions,
  loading = false,
  pagination,
  onPageChange,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`expense-list ${className}`}>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className={`expense-list ${className}`}>
        <div className="card p-12 text-center">
          <p className="text-gray-500 text-lg">No expenses found</p>
          <p className="text-gray-400 text-sm mt-2">Add your first expense to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`expense-list ${className}`}>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <ExpenseCard key={transaction.id} transaction={transaction} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} transactions
          </div>
          <div className="flex gap-2">
            <button
              className="btn-secondary"
              disabled={pagination.page === 1}
              onClick={() => onPageChange?.(pagination.page - 1)}
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    className={`px-3 py-1 rounded ${
                      pagination.page === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => onPageChange?.(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              className="btn-secondary"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => onPageChange?.(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
