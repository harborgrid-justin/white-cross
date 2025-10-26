/**
 * ExpenseCard Component
 * 
 * Individual expense transaction card display.
 */

import React from 'react';
import { BudgetTransaction } from '../../../types/budget';
import { Calendar, FileText, Tag } from 'lucide-react';

interface ExpenseCardProps {
  transaction: BudgetTransaction;
  onClick?: () => void;
  className?: string;
}

/**
 * ExpenseCard component - Displays a single expense transaction
 */
const ExpenseCard: React.FC<ExpenseCardProps> = ({
  transaction,
  onClick,
  className = ''
}) => {
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

  return (
    <div
      className={`expense-card card p-4 hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Description */}
          <h4 className="font-semibold text-gray-900 mb-2">
            {transaction.description}
          </h4>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(transaction.transactionDate)}</span>
            </div>
            
            {transaction.category && (
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                <span>{transaction.category.name}</span>
              </div>
            )}

            {transaction.referenceId && (
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Ref: {transaction.referenceId}</span>
              </div>
            )}
          </div>

          {/* Notes */}
          {transaction.notes && (
            <p className="text-sm text-gray-600 mt-2 italic">
              {transaction.notes}
            </p>
          )}
        </div>

        {/* Amount */}
        <div className="ml-4 text-right">
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(transaction.amount)}
          </div>
          {transaction.referenceType && (
            <span className="text-xs text-gray-500 uppercase">
              {transaction.referenceType}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
