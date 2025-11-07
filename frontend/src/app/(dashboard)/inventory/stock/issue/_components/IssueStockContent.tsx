'use client';

/**
 * IssueStockContent Component
 *
 * Form for issuing/dispensing stock to students or staff.
 * Tracks who received the items, quantity, and purpose.
 *
 * @module IssueStockContent
 */

import React, { useState } from 'react';

export interface IssueStockFormData {
  itemId: string;
  itemName: string;
  quantity: number;
  recipientType: 'student' | 'staff' | 'other';
  recipientId?: string;
  recipientName: string;
  purpose: string;
  issuedDate: string;
  issuedBy: string;
  requiresSignature: boolean;
  signatureObtained?: boolean;
  notes?: string;
}

/**
 * Issue stock transaction form component
 *
 * @returns Rendered issue stock form
 */
export default function IssueStockContent() {
  const [formData, setFormData] = useState<IssueStockFormData>({
    itemId: '',
    itemName: '',
    quantity: 0,
    recipientType: 'student',
    recipientName: '',
    purpose: '',
    issuedDate: new Date().toISOString().split('T')[0],
    issuedBy: 'Current User', // TODO: Get from auth context
    requiresSignature: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof IssueStockFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [availableStock, setAvailableStock] = useState<number>(0);

  // Mock inventory items
  const mockItems = [
    { id: '1', name: 'Acetaminophen 500mg', sku: 'MED-001', currentStock: 100 },
    { id: '2', name: 'Bandages (Adhesive)', sku: 'SUP-101', currentStock: 15 },
    { id: '3', name: 'Digital Thermometer', sku: 'EQP-201', currentStock: 5 },
  ];

  /**
   * Validates form data
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof IssueStockFormData, string>> = {};

    if (!formData.itemId) {
      newErrors.itemId = 'Please select an inventory item';
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than zero';
    }

    if (formData.quantity > availableStock) {
      newErrors.quantity = `Insufficient stock. Only ${availableStock} available.`;
    }

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = 'Recipient name is required';
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose is required';
    }

    if (formData.requiresSignature && !formData.signatureObtained) {
      newErrors.signatureObtained = 'Signature must be obtained before issuing';
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
      console.log('Issuing stock:', formData);

      setSubmitSuccess(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          itemId: '',
          itemName: '',
          quantity: 0,
          recipientType: 'student',
          recipientName: '',
          purpose: '',
          issuedDate: new Date().toISOString().split('T')[0],
          issuedBy: 'Current User',
          requiresSignature: false,
        });
        setAvailableStock(0);
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error issuing stock:', error);
      setErrors({ itemId: 'Failed to issue stock. Please try again.' });
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
      setFormData(prev => ({
        ...prev,
        itemId: value,
        itemName: selectedItem?.name || '',
      }));
      setAvailableStock(selectedItem?.currentStock || 0);
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

    if (errors[name as keyof IssueStockFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Issue Stock</h1>
        <p className="text-gray-600 mt-2">
          Dispense inventory items to students or staff members.
        </p>
      </div>

      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">Stock issued successfully! Stock levels have been updated.</p>
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
                    {item.name} ({item.sku}) - {item.currentStock} available
                  </option>
                ))}
              </select>
              {errors.itemId && <p className="text-red-500 text-sm mt-1">{errors.itemId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity to Issue <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                max={availableStock}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
              {availableStock > 0 && (
                <p className="text-xs text-gray-500 mt-1">{availableStock} units available</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="issuedDate"
                value={formData.issuedDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Recipient Information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recipient Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Type <span className="text-red-500">*</span>
              </label>
              <select
                name="recipientType"
                value={formData.recipientType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="student">Student</option>
                <option value="staff">Staff Member</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient ID
              </label>
              <input
                type="text"
                name="recipientId"
                value={formData.recipientId || ''}
                onChange={handleChange}
                placeholder="Student/Staff ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                placeholder="Full name of recipient"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.recipientName && <p className="text-red-500 text-sm mt-1">{errors.recipientName}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purpose <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="e.g., Headache, Minor cut, Fever"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.purpose && <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issued By
              </label>
              <input
                type="text"
                name="issuedBy"
                value={formData.issuedBy}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Signature & Notes */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="requiresSignature"
                checked={formData.requiresSignature}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Requires recipient signature</span>
            </label>

            {formData.requiresSignature && (
              <div className="ml-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="signatureObtained"
                    checked={formData.signatureObtained || false}
                    onChange={handleChange}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Signature obtained</span>
                </label>
                {errors.signatureObtained && (
                  <p className="text-red-500 text-sm mt-1 ml-6">{errors.signatureObtained}</p>
                )}
              </div>
            )}

            <div>
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
        {formData.itemId && formData.quantity > 0 && formData.recipientName && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Transaction Summary</h3>
            <p className="text-sm text-blue-800">
              Issuing <strong>{formData.quantity}</strong> units of{' '}
              <strong>{formData.itemName}</strong> to{' '}
              <strong>{formData.recipientName}</strong>{' '}
              for <strong>{formData.purpose}</strong>
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Remaining stock after transaction: <strong>{availableStock - formData.quantity}</strong>
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Issuing...' : 'Issue Stock'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Export both named and default for flexibility
export { IssueStockContent }
