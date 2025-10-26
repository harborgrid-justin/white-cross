/**
 * ExpenseDetails Component - Detailed view of a single expense
 */
import React from 'react';
import { BudgetTransaction } from '../../../types/budget';

interface ExpenseDetailsProps {
  transaction?: BudgetTransaction;
}

const ExpenseDetails: React.FC<ExpenseDetailsProps> = ({ transaction }) => {
  if (!transaction) return <div className="card p-6 text-center text-gray-500">No transaction selected</div>;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <div className="card p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{transaction.description}</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Amount:</span>
          <span className="font-semibold">{formatCurrency(transaction.amount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Date:</span>
          <span>{new Date(transaction.transactionDate).toLocaleDateString()}</span>
        </div>
        {transaction.category && (
          <div className="flex justify-between">
            <span className="text-gray-600">Category:</span>
            <span>{transaction.category.name}</span>
          </div>
        )}
        {transaction.notes && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-gray-600 text-sm mb-1">Notes:</p>
            <p className="text-gray-900">{transaction.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseDetails;
