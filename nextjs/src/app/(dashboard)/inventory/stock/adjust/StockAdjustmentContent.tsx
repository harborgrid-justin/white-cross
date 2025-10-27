'use client';

/**
 * StockAdjustmentContent Component
 *
 * Form for making manual stock adjustments due to physical counts,
 * corrections, damage, expiration, or other reasons.
 *
 * @module StockAdjustmentContent
 */

import React, { useState } from 'react';

export interface StockAdjustmentFormData {
  itemId: string;
  itemName: string;
  currentStock: number;
  adjustmentType: 'increase' | 'decrease';
  adjustmentQuantity: number;
  newStock: number;
  reason: string;
  adjustmentDate: string;
  adjustedBy: string;
  requiresApproval: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

/**
 * Stock adjustment form component
 *
 * @returns Rendered stock adjustment form
 */
export default function StockAdjustmentContent() {
  const [formData, setFormData] = useState<StockAdjustmentFormData>({
    itemId: '',
    itemName: '',
    currentStock: 0,
    adjustmentType: 'decrease',
    adjustmentQuantity: 0,
    newStock: 0,
    reason: '',
    adjustmentDate: new Date().toISOString().split('T')[0],
    adjustedBy: 'Current User', // TODO: Get from auth context
    requiresApproval: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof StockAdjustmentFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Mock inventory items
  const mockItems = [
    { id: '1', name: 'Acetaminophen 500mg', sku: 'MED-001', currentStock: 100 },
    { id: '2', name: 'Bandages (Adhesive)', sku: 'SUP-101', currentStock: 15 },
    { id: '3', name: 'Digital Thermometer', sku: 'EQP-201', currentStock: 5 },
  ];

  // Adjustment reasons
  const adjustmentReasons = [
    'Physical count discrepancy',
    'Damaged items',
    'Expired items',
    'Lost/Missing items',
    'Data entry correction',
    'Returned to supplier',
    'Donation',
    'Theft/Loss',
    'Quality issue',
    'Other',
  ];

  /**
   * Validates form data
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof StockAdjustmentFormData, string>> = {};

    if (!formData.itemId) {
      newErrors.itemId = 'Please select an inventory item';
    }

    if (formData.adjustmentQuantity <= 0) {
      newErrors.adjustmentQuantity = 'Adjustment quantity must be greater than zero';
    }

    if (formData.adjustmentType === 'decrease' && formData.adjustmentQuantity > formData.currentStock) {
      newErrors.adjustmentQuantity = `Cannot decrease by more than current stock (${formData.currentStock})`;
    }

    if (!formData.reason) {
      newErrors.reason = 'Reason for adjustment is required';
    }

    if (!formData.adjustmentDate) {
      newErrors.adjustmentDate = 'Adjustment date is required';
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
      console.log('Adjusting stock:', formData);

      setSubmitSuccess(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          itemId: '',
          itemName: '',
          currentStock: 0,
          adjustmentType: 'decrease',
          adjustmentQuantity: 0,
          newStock: 0,
          reason: '',
          adjustmentDate: new Date().toISOString().split('T')[0],
          adjustedBy: 'Current User',
          requiresApproval: false,
        });
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error adjusting stock:', error);
      setErrors({ itemId: 'Failed to adjust stock. Please try again.' });
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

    if (name === 'itemId') {
      const selectedItem = mockItems.find(item => item.id === value);
      const currentStock = selectedItem?.currentStock || 0;

      setFormData(prev => ({
        ...prev,
        itemId: value,
        itemName: selectedItem?.name || '',
        currentStock,
        newStock: currentStock,
        adjustmentQuantity: 0,
      }));
    } else if (name === 'adjustmentType' || name === 'adjustmentQuantity') {
      const adjustmentType = name === 'adjustmentType' ? value as 'increase' | 'decrease' : formData.adjustmentType;
      const adjustmentQuantity = name === 'adjustmentQuantity' ? parseFloat(value) || 0 : formData.adjustmentQuantity;

      const newStock = adjustmentType === 'increase'
        ? formData.currentStock + adjustmentQuantity
        : formData.currentStock - adjustmentQuantity;

      setFormData(prev => ({
        ...prev,
        [name]: name === 'adjustmentQuantity' ? adjustmentQuantity : value,
        newStock: Math.max(0, newStock),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
          ? parseFloat(value) || 0
          : value,
      }));
    }

    if (errors[name as keyof StockAdjustmentFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stock Adjustment</h1>
        <p className="text-gray-600 mt-2">
          Make manual inventory adjustments for corrections, damage, expiration, or physical counts.
        </p>
      </div>

      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">
            Stock adjustment recorded successfully!
            {formData.requiresApproval && ' Adjustment is pending approval.'}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Item Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Item Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inventory Item <span className="text-red-500">*</span>
              </label>
              <select
                name="itemId"
                value={formData.itemId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select an item...</option>
                {mockItems.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.sku}) - Current stock: {item.currentStock}
                  </option>
                ))}
              </select>
              {errors.itemId && <p className="text-red-500 text-sm mt-1">{errors.itemId}</p>}
            </div>

            {formData.itemId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Stock
                </label>
                <input
                  type="number"
                  value={formData.currentStock}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  disabled
                />
              </div>
            )}
          </div>
        </div>

        {/* Adjustment Details */}
        {formData.itemId && (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Adjustment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adjustment Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="adjustmentType"
                    value={formData.adjustmentType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="increase">Increase Stock</option>
                    <option value="decrease">Decrease Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adjustment Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="adjustmentQuantity"
                    value={formData.adjustmentQuantity}
                    onChange={handleChange}
                    min="1"
                    max={formData.adjustmentType === 'decrease' ? formData.currentStock : undefined}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.adjustmentQuantity && <p className="text-red-500 text-sm mt-1">{errors.adjustmentQuantity}</p>}
                </div>

                {/* Visual Adjustment Indicator */}
                <div className="md:col-span-2 p-4 bg-orange-50 border border-orange-200 rounded-md">
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">CURRENT</div>
                      <div className="text-2xl font-bold text-gray-900">{formData.currentStock}</div>
                    </div>
                    <div className={`text-2xl ${formData.adjustmentType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                      {formData.adjustmentType === 'increase' ? '+' : '-'}{formData.adjustmentQuantity}
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">NEW STOCK</div>
                      <div className={`text-2xl font-bold ${formData.adjustmentType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                        {formData.newStock}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adjustment Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="adjustmentDate"
                    value={formData.adjustmentDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.adjustmentDate && <p className="text-red-500 text-sm mt-1">{errors.adjustmentDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adjusted By
                  </label>
                  <input
                    type="text"
                    name="adjustedBy"
                    value={formData.adjustedBy}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    disabled
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Adjustment <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a reason...</option>
                    {adjustmentReasons.map(reason => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                  {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="requiresApproval"
                    checked={formData.requiresApproval}
                    onChange={handleChange}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Requires supervisor approval</span>
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Provide detailed explanation for this adjustment"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Warning for Large Adjustments */}
            {formData.adjustmentQuantity > formData.currentStock * 0.5 && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-start">
                  <span className="text-yellow-600 text-xl mr-3">⚠️</span>
                  <div>
                    <p className="text-sm font-semibold text-yellow-900">Large Adjustment Detected</p>
                    <p className="text-sm text-yellow-800 mt-1">
                      This adjustment represents a significant change in stock levels. Please ensure the reason and notes are detailed.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !formData.itemId}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Adjusting...' : 'Adjust Stock'}
          </button>
        </div>
      </form>
    </div>
  );
}
