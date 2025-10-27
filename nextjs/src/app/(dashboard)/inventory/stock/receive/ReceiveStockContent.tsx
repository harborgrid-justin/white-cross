'use client';

/**
 * ReceiveStockContent Component
 *
 * Form for recording incoming stock/inventory receipts.
 * Tracks received quantities, lot numbers, expiration dates, and supplier information.
 *
 * @module ReceiveStockContent
 */

import React, { useState } from 'react';

export interface ReceiveStockFormData {
  itemId: string;
  itemName: string;
  quantity: number;
  lotNumber?: string;
  expirationDate?: string;
  supplier?: string;
  purchaseOrderNumber?: string;
  unitCost?: number;
  receivedDate: string;
  receivedBy: string;
  notes?: string;
}

/**
 * Receive stock transaction form component
 *
 * @returns Rendered receive stock form
 */
export default function ReceiveStockContent() {
  const [formData, setFormData] = useState<ReceiveStockFormData>({
    itemId: '',
    itemName: '',
    quantity: 0,
    receivedDate: new Date().toISOString().split('T')[0],
    receivedBy: 'Current User', // TODO: Get from auth context
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ReceiveStockFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Mock inventory items for selection
  const mockItems = [
    { id: '1', name: 'Acetaminophen 500mg', sku: 'MED-001' },
    { id: '2', name: 'Bandages (Adhesive)', sku: 'SUP-101' },
    { id: '3', name: 'Digital Thermometer', sku: 'EQP-201' },
  ];

  /**
   * Validates form data
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ReceiveStockFormData, string>> = {};

    if (!formData.itemId) {
      newErrors.itemId = 'Please select an inventory item';
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than zero';
    }

    if (!formData.receivedDate) {
      newErrors.receivedDate = 'Received date is required';
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
      console.log('Recording stock receipt:', formData);

      setSubmitSuccess(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          itemId: '',
          itemName: '',
          quantity: 0,
          receivedDate: new Date().toISOString().split('T')[0],
          receivedBy: 'Current User',
        });
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error recording stock receipt:', error);
      setErrors({ itemId: 'Failed to record stock receipt. Please try again.' });
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
    const { name, value } = e.target;

    if (name === 'itemId') {
      const selectedItem = mockItems.find(item => item.id === value);
      setFormData(prev => ({
        ...prev,
        itemId: value,
        itemName: selectedItem?.name || '',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: e.target.type === 'number' ? parseFloat(value) || 0 : value,
      }));
    }

    if (errors[name as keyof ReceiveStockFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Receive Stock</h1>
        <p className="text-gray-600 mt-2">
          Record incoming inventory items and update stock levels.
        </p>
      </div>

      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">Stock received successfully! Stock levels have been updated.</p>
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
                    {item.name} ({item.sku})
                  </option>
                ))}
              </select>
              {errors.itemId && <p className="text-red-500 text-sm mt-1">{errors.itemId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity Received <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Cost ($)
              </label>
              <input
                type="number"
                name="unitCost"
                value={formData.unitCost || ''}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Optional"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lot Number
              </label>
              <input
                type="text"
                name="lotNumber"
                value={formData.lotNumber || ''}
                onChange={handleChange}
                placeholder="Optional"
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
          </div>
        </div>

        {/* Receipt Information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Receipt Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier
              </label>
              <input
                type="text"
                name="supplier"
                value={formData.supplier || ''}
                onChange={handleChange}
                placeholder="Supplier name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Order Number
              </label>
              <input
                type="text"
                name="purchaseOrderNumber"
                value={formData.purchaseOrderNumber || ''}
                onChange={handleChange}
                placeholder="PO number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Received Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="receivedDate"
                value={formData.receivedDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.receivedDate && <p className="text-red-500 text-sm mt-1">{errors.receivedDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Received By
              </label>
              <input
                type="text"
                name="receivedBy"
                value={formData.receivedBy}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                disabled
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                rows={3}
                placeholder="Additional notes or comments"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        {formData.itemId && formData.quantity > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Transaction Summary</h3>
            <p className="text-sm text-blue-800">
              Receiving <strong>{formData.quantity}</strong> units of{' '}
              <strong>{formData.itemName}</strong>
              {formData.unitCost && formData.quantity && (
                <span> for a total cost of <strong>${(formData.unitCost * formData.quantity).toFixed(2)}</strong></span>
              )}
            </p>
          </div>
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
            disabled={isSubmitting}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Recording...' : 'Receive Stock'}
          </button>
        </div>
      </form>
    </div>
  );
}
