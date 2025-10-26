/**
 * ExpenseForm Component
 * 
 * Form for recording budget expenses/transactions.
 */

import React, { useState } from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { selectBudgetCategories } from '../store/budgetSlice';
import toast from 'react-hot-toast';

interface ExpenseFormProps {
  onSubmit?: (data: any) => Promise<void>;
  onCancel?: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, onCancel }) => {
  const categories = useAppSelector(selectBudgetCategories);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: 0,
    description: '',
    transactionDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId || formData.amount <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await onSubmit?.(formData);
      toast.success('Expense recorded successfully');
    } catch (error) {
      toast.error('Failed to record expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
        <select
          value={formData.categoryId}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          className="input-field"
          required
        >
          <option value="">Select a category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
          className="input-field"
          min="0"
          step="0.01"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="input-field"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
        <input
          type="date"
          value={formData.transactionDate}
          onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
          className="input-field"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="input-field"
          rows={3}
        />
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Saving...' : 'Record Expense'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={loading} className="btn-secondary flex-1">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ExpenseForm;
