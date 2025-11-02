'use client';

/**
 * Refill Request Form Component
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export interface RefillRequestFormData {
  medicationId: string;
  prescriptionId: string;
  requestedBy: string;
  requestDate: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  pharmacy?: string;
  notes?: string;
}

export interface RefillRequestFormProps {
  medicationName?: string;
  onSubmit: (data: RefillRequestFormData) => Promise<void> | void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const RefillRequestForm: React.FC<RefillRequestFormProps> = ({
  medicationName,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<RefillRequestFormData>>({
    requestDate: new Date().toISOString().split('T')[0],
    urgency: 'routine',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData as RefillRequestFormData);
  };

  const updateField = (field: keyof RefillRequestFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {medicationName && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900">Medication: {medicationName}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Requested By *</label>
          <Input
            value={formData.requestedBy}
            onChange={(e) => updateField('requestedBy', e.target.value)}
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Request Date *</label>
          <Input
            type="date"
            value={formData.requestDate}
            onChange={(e) => updateField('requestDate', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Urgency *</label>
          <Select
            value={formData.urgency}
            onChange={(e) => updateField('urgency', e.target.value as any)}
            required
          >
            <option value="routine">Routine</option>
            <option value="urgent">Urgent (within 3 days)</option>
            <option value="emergency">Emergency (within 24 hours)</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pharmacy</label>
          <Input
            value={formData.pharmacy || ''}
            onChange={(e) => updateField('pharmacy', e.target.value)}
            placeholder="Pharmacy name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <Textarea
          value={formData.notes || ''}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Additional information about this refill request..."
          rows={3}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="default" loading={isLoading}>
          Submit Refill Request
        </Button>
      </div>
    </form>
  );
};

RefillRequestForm.displayName = 'RefillRequestForm';

export default RefillRequestForm;



