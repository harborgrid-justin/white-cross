/**
 * BudgetForm Component
 * 
 * Form for creating and editing budget categories.
 */

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { selectCurrentFiscalYear } from '../store/budgetSlice';
import { CreateBudgetCategoryRequest, UpdateBudgetCategoryRequest } from '../../../types/budget';
import toast from 'react-hot-toast';

interface BudgetFormProps {
  initialData?: UpdateBudgetCategoryRequest & { id?: string };
  onSubmit: (data: CreateBudgetCategoryRequest | UpdateBudgetCategoryRequest) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

/**
 * BudgetForm component - Create/edit budget categories
 */
const BudgetForm: React.FC<BudgetFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const currentFiscalYear = useAppSelector(selectCurrentFiscalYear);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    fiscalYear: currentFiscalYear,
    allocatedAmount: initialData?.allocatedAmount || 0,
    isActive: initialData?.isActive ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (formData.allocatedAmount <= 0) {
      toast.error('Allocated amount must be greater than zero');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      toast.success(isEditing ? 'Budget category updated successfully' : 'Budget category created successfully');
    } catch (error) {
      toast.error(isEditing ? 'Failed to update budget category' : 'Failed to create budget category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="budget-form space-y-4">
      {/* Category Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Category Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input-field"
          placeholder="e.g., School Supplies"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="input-field"
          rows={3}
          placeholder="Optional description..."
        />
      </div>

      {/* Fiscal Year */}
      <div>
        <label htmlFor="fiscalYear" className="block text-sm font-medium text-gray-700 mb-1">
          Fiscal Year *
        </label>
        <input
          type="number"
          id="fiscalYear"
          name="fiscalYear"
          value={formData.fiscalYear}
          onChange={handleChange}
          className="input-field"
          min="2020"
          max="2100"
          required
          disabled={isEditing}
        />
      </div>

      {/* Allocated Amount */}
      <div>
        <label htmlFor="allocatedAmount" className="block text-sm font-medium text-gray-700 mb-1">
          Allocated Amount *
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            id="allocatedAmount"
            name="allocatedAmount"
            value={formData.allocatedAmount}
            onChange={handleChange}
            className="input-field pl-8"
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>

      {/* Active Status */}
      {isEditing && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Active
          </label>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="btn-secondary flex-1"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BudgetForm;
