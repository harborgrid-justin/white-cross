'use client';

/**
 * EditInventoryItemContent Component
 *
 * Form for editing existing inventory items.
 * Loads current item data and allows updates to all fields.
 *
 * @module EditInventoryItemContent
 */

import React, { useState, useEffect } from 'react';

export interface EditInventoryItemContentProps {
  /** ID of the inventory item to edit */
  itemId?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  type: 'medication' | 'supply' | 'equipment';
  description: string;
  manufacturer: string;
  ndcCode?: string;
  lotNumber?: string;
  expirationDate?: string;
  location: string;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  reorderPoint: number;
  unitOfMeasure: string;
  unitCost: number;
  isControlledSubstance: boolean;
  requiresPrescription: boolean;
  storageRequirements?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Edit inventory item form component
 *
 * @param props - Component props
 * @returns Rendered edit form
 *
 * @example
 * ```tsx
 * <EditInventoryItemContent itemId="123" />
 * ```
 */
export default function EditInventoryItemContent({ itemId }: EditInventoryItemContentProps) {
  const [formData, setFormData] = useState<Partial<InventoryItem>>({});
  const [originalData, setOriginalData] = useState<Partial<InventoryItem>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof InventoryItem, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  /**
   * Load inventory item data
   */
  useEffect(() => {
    const loadItem = async () => {
      setIsLoading(true);

      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock data
        const mockItem: InventoryItem = {
          id: itemId || '1',
          name: 'Acetaminophen 500mg',
          sku: 'MED-001',
          category: 'Pain Relief',
          type: 'medication',
          description: 'Over-the-counter pain reliever and fever reducer',
          manufacturer: 'Generic Pharmaceuticals',
          ndcCode: '12345-678-90',
          lotNumber: 'LOT2024-001',
          expirationDate: '2025-12-31',
          location: 'Cabinet A, Shelf 2',
          currentStock: 100,
          minStockLevel: 20,
          maxStockLevel: 200,
          reorderPoint: 40,
          unitOfMeasure: 'tablet',
          unitCost: 0.15,
          isControlledSubstance: false,
          requiresPrescription: false,
          storageRequirements: 'Store at room temperature',
          notes: 'Common OTC medication',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        };

        setFormData(mockItem);
        setOriginalData(mockItem);
      } catch (error) {
        console.error('Error loading inventory item:', error);
        setErrors({ name: 'Failed to load inventory item. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    };

    loadItem();
  }, [itemId]);

  /**
   * Validates form data
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof InventoryItem, string>> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Item name is required';
    }

    if (!formData.sku?.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.location) {
      newErrors.location = 'Storage location is required';
    }

    if (formData.minStockLevel && formData.minStockLevel < 0) {
      newErrors.minStockLevel = 'Minimum stock level cannot be negative';
    }

    if (formData.maxStockLevel && formData.minStockLevel && formData.maxStockLevel < formData.minStockLevel) {
      newErrors.maxStockLevel = 'Maximum stock level must be greater than minimum';
    }

    if (formData.type === 'medication' && !formData.ndcCode) {
      newErrors.ndcCode = 'NDC code is required for medications';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Updating inventory item:', formData);

      setSubmitSuccess(true);
      setOriginalData(formData);

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating inventory item:', error);
      setErrors({ name: 'Failed to update inventory item. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles input changes
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : type === 'number'
        ? parseFloat(value) || 0
        : value,
    }));

    if (errors[name as keyof InventoryItem]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  /**
   * Checks if form has unsaved changes
   */
  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory item...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Inventory Item</h1>
        <p className="text-gray-600 mt-2">
          Update details for {formData.name || 'this item'}.
        </p>
      </div>

      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">Changes saved successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Basic Information */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type || 'supply'}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="medication">Medication</option>
                <option value="supply">Medical Supply</option>
                <option value="equipment">Equipment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="category"
                value={formData.category || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manufacturer
              </label>
              <input
                type="text"
                name="manufacturer"
                value={formData.manufacturer || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {formData.type === 'medication' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NDC Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="ndcCode"
                  value={formData.ndcCode || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.ndcCode && <p className="text-red-500 text-sm mt-1">{errors.ndcCode}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lot Number
              </label>
              <input
                type="text"
                name="lotNumber"
                value={formData.lotNumber || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Date
              </label>
              <input
                type="date"
                name="expirationDate"
                value={formData.expirationDate || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Stock
              </label>
              <input
                type="number"
                name="currentStock"
                value={formData.currentStock || 0}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Use stock transactions to modify current stock</p>
            </div>
          </div>
        </div>

        {/* Stock Management */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Stock Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Storage Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit of Measure
              </label>
              <select
                name="unitOfMeasure"
                value={formData.unitOfMeasure || 'unit'}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="unit">Unit</option>
                <option value="bottle">Bottle</option>
                <option value="box">Box</option>
                <option value="tablet">Tablet</option>
                <option value="ml">mL</option>
                <option value="mg">mg</option>
                <option value="piece">Piece</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Stock Level
              </label>
              <input
                type="number"
                name="minStockLevel"
                value={formData.minStockLevel || 0}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Stock Level
              </label>
              <input
                type="number"
                name="maxStockLevel"
                value={formData.maxStockLevel || 0}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reorder Point
              </label>
              <input
                type="number"
                name="reorderPoint"
                value={formData.reorderPoint || 0}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Cost ($)
              </label>
              <input
                type="number"
                name="unitCost"
                value={formData.unitCost || 0}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Regulatory & Safety */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Regulatory & Safety</h2>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isControlledSubstance"
                checked={formData.isControlledSubstance || false}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Controlled Substance (requires DEA tracking)</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="requiresPrescription"
                checked={formData.requiresPrescription || false}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Requires Prescription</span>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Storage Requirements
              </label>
              <textarea
                name="storageRequirements"
                value={formData.storageRequirements || ''}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Last updated: {formData.updatedAt ? new Date(formData.updatedAt).toLocaleString() : 'Never'}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !hasChanges()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Saving...' : hasChanges() ? 'Save Changes' : 'No Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
