'use client';

/**
 * TransferStockContent Component
 *
 * Form for transferring stock between different storage locations.
 * Maintains inventory accuracy across multiple locations.
 *
 * @module TransferStockContent
 */

import React, { useState } from 'react';

export interface TransferStockFormData {
  itemId: string;
  itemName: string;
  quantity: number;
  fromLocation: string;
  toLocation: string;
  transferDate: string;
  transferredBy: string;
  reason?: string;
  notes?: string;
}

/**
 * Transfer stock form component
 *
 * @returns Rendered transfer stock form
 */
export default function TransferStockContent() {
  const [formData, setFormData] = useState<TransferStockFormData>({
    itemId: '',
    itemName: '',
    quantity: 0,
    fromLocation: '',
    toLocation: '',
    transferDate: new Date().toISOString().split('T')[0],
    transferredBy: 'Current User', // TODO: Get from auth context
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TransferStockFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [availableStock, setAvailableStock] = useState<number>(0);

  // Mock inventory items
  const mockItems = [
    { id: '1', name: 'Acetaminophen 500mg', sku: 'MED-001', currentStock: 100, location: 'Cabinet A, Shelf 2' },
    { id: '2', name: 'Bandages (Adhesive)', sku: 'SUP-101', currentStock: 15, location: 'Cabinet B, Shelf 1' },
    { id: '3', name: 'Digital Thermometer', sku: 'EQP-201', currentStock: 5, location: 'Equipment Cabinet' },
  ];

  // Mock locations
  const mockLocations = [
    'Cabinet A, Shelf 1',
    'Cabinet A, Shelf 2',
    'Cabinet A, Shelf 3',
    'Cabinet B, Shelf 1',
    'Cabinet B, Shelf 2',
    'Equipment Cabinet',
    'Refrigerator',
    'Locked Cabinet',
    'Nurse Office - Main',
    'Nurse Office - Secondary',
  ];

  /**
   * Validates form data
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TransferStockFormData, string>> = {};

    if (!formData.itemId) {
      newErrors.itemId = 'Please select an inventory item';
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than zero';
    }

    if (formData.quantity > availableStock) {
      newErrors.quantity = `Insufficient stock. Only ${availableStock} available.`;
    }

    if (!formData.fromLocation) {
      newErrors.fromLocation = 'Source location is required';
    }

    if (!formData.toLocation) {
      newErrors.toLocation = 'Destination location is required';
    }

    if (formData.fromLocation === formData.toLocation) {
      newErrors.toLocation = 'Destination must be different from source location';
    }

    if (!formData.transferDate) {
      newErrors.transferDate = 'Transfer date is required';
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
      console.log('Transferring stock:', formData);

      setSubmitSuccess(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          itemId: '',
          itemName: '',
          quantity: 0,
          fromLocation: '',
          toLocation: '',
          transferDate: new Date().toISOString().split('T')[0],
          transferredBy: 'Current User',
        });
        setAvailableStock(0);
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error transferring stock:', error);
      setErrors({ itemId: 'Failed to transfer stock. Please try again.' });
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
        fromLocation: selectedItem?.location || '',
      }));
      setAvailableStock(selectedItem?.currentStock || 0);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: e.target.type === 'number' ? parseFloat(value) || 0 : value,
      }));
    }

    if (errors[name as keyof TransferStockFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transfer Stock</h1>
        <p className="text-gray-600 mt-2">
          Move inventory items between different storage locations.
        </p>
      </div>

      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">Stock transferred successfully! Locations have been updated.</p>
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
                    {item.name} ({item.sku}) - {item.currentStock} available at {item.location}
                  </option>
                ))}
              </select>
              {errors.itemId && <p className="text-red-500 text-sm mt-1">{errors.itemId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity to Transfer <span className="text-red-500">*</span>
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
                Transfer Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="transferDate"
                value={formData.transferDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.transferDate && <p className="text-red-500 text-sm mt-1">{errors.transferDate}</p>}
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Transfer Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Location <span className="text-red-500">*</span>
              </label>
              <select
                name="fromLocation"
                value={formData.fromLocation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                disabled={!!formData.itemId}
              >
                <option value="">Select location...</option>
                {mockLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              {errors.fromLocation && <p className="text-red-500 text-sm mt-1">{errors.fromLocation}</p>}
              {formData.itemId && (
                <p className="text-xs text-gray-500 mt-1">Current location of selected item</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Location <span className="text-red-500">*</span>
              </label>
              <select
                name="toLocation"
                value={formData.toLocation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select destination...</option>
                {mockLocations
                  .filter(loc => loc !== formData.fromLocation)
                  .map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
              </select>
              {errors.toLocation && <p className="text-red-500 text-sm mt-1">{errors.toLocation}</p>}
            </div>

            {/* Visual Transfer Indicator */}
            {formData.fromLocation && formData.toLocation && (
              <div className="md:col-span-2 p-4 bg-purple-50 border border-purple-200 rounded-md">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">FROM</div>
                    <div className="font-medium text-gray-900">{formData.fromLocation}</div>
                  </div>
                  <div className="text-2xl text-purple-600">→</div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">TO</div>
                    <div className="font-medium text-gray-900">{formData.toLocation}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Transfer
              </label>
              <input
                type="text"
                name="reason"
                value={formData.reason || ''}
                onChange={handleChange}
                placeholder="e.g., Restocking, Reorganization, Equipment relocation"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transferred By
              </label>
              <input
                type="text"
                name="transferredBy"
                value={formData.transferredBy}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                disabled
              />
            </div>

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
        {formData.itemId && formData.quantity > 0 && formData.fromLocation && formData.toLocation && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Transfer Summary</h3>
            <p className="text-sm text-blue-800">
              Transferring <strong>{formData.quantity}</strong> units of{' '}
              <strong>{formData.itemName}</strong> from{' '}
              <strong>{formData.fromLocation}</strong> to{' '}
              <strong>{formData.toLocation}</strong>
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
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Transferring...' : 'Transfer Stock'}
          </button>
        </div>
      </form>
    </div>
  );
}
