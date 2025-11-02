'use client';

/**
 * Stock Adjustment Form Component
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export interface StockAdjustmentFormData {
  medicationId: string;
  adjustmentType: 'add' | 'remove' | 'correction' | 'waste' | 'expired';
  quantity: number;
  adjustedBy: string;
  reason: string;
  batchNumber?: string;
  expirationDate?: string;
  witnessedBy?: string;
  notes?: string;
}

export interface StockAdjustmentFormProps {
  medicationName?: string;
  currentStock?: number;
  onSubmit: (data: StockAdjustmentFormData) => Promise<void> | void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const StockAdjustmentForm: React.FC<StockAdjustmentFormProps> = ({
  medicationName,
  currentStock,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<StockAdjustmentFormData>>({
    adjustmentType: 'add',
    quantity: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData as StockAdjustmentFormData);
  };

  const updateField = (field: keyof StockAdjustmentFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getNewStock = () => {
    if (currentStock === undefined || !formData.quantity) return currentStock;
    const adjustment = formData.adjustmentType === 'add' ? formData.quantity : -formData.quantity;
    return currentStock + adjustment;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {medicationName && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900">Medication: {medicationName}</p>
          {currentStock !== undefined && (
            <p className="text-sm text-blue-700 mt-1">Current Stock: {currentStock} units</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adjustment Type *</label>
          <Select
            value={formData.adjustmentType}
            onChange={(e) => updateField('adjustmentType', e.target.value as any)}
            required
          >
            <option value="add">Add Stock</option>
            <option value="remove">Remove Stock</option>
            <option value="correction">Inventory Correction</option>
            <option value="waste">Waste/Disposal</option>
            <option value="expired">Expired Removal</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
          <Input
            type="number"
            min="0"
            value={formData.quantity}
            onChange={(e) => updateField('quantity', parseInt(e.target.value) || 0)}
            required
          />
        </div>

        {currentStock !== undefined && (
          <div className="col-span-2 bg-gray-50 border border-gray-200 rounded p-3">
            <p className="text-sm font-medium text-gray-700">
              New Stock Level: {getNewStock()} units
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adjusted By *</label>
          <Input
            value={formData.adjustedBy}
            onChange={(e) => updateField('adjustedBy', e.target.value)}
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Witnessed By</label>
          <Input
            value={formData.witnessedBy || ''}
            onChange={(e) => updateField('witnessedBy', e.target.value)}
            placeholder="Witness name (for controlled substances)"
          />
        </div>

        {formData.adjustmentType === 'add' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch/Lot Number</label>
              <Input
                value={formData.batchNumber || ''}
                onChange={(e) => updateField('batchNumber', e.target.value)}
                placeholder="Batch number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
              <Input
                type="date"
                value={formData.expirationDate || ''}
                onChange={(e) => updateField('expirationDate', e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
        <Textarea
          value={formData.reason}
          onChange={(e) => updateField('reason', e.target.value)}
          placeholder="Reason for adjustment..."
          rows={2}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <Textarea
          value={formData.notes || ''}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Additional notes..."
          rows={2}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="default" loading={isLoading}>
          Record Adjustment
        </Button>
      </div>
    </form>
  );
};

StockAdjustmentForm.displayName = 'StockAdjustmentForm';

export default StockAdjustmentForm;



