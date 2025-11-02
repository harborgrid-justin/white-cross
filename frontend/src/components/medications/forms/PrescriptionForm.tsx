'use client';

/**
 * Prescription Form Component
 * For creating and editing prescription records
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export interface PrescriptionFormData {
  medicationId: string;
  prescriptionNumber: string;
  prescriber: string;
  prescriberNPI?: string;
  pharmacy: string;
  dateIssued: string;
  expirationDate?: string;
  refillsAuthorized: number;
  refillsRemaining: number;
  quantity: string;
  directions: string;
  notes?: string;
}

export interface PrescriptionFormProps {
  initialData?: Partial<PrescriptionFormData>;
  onSubmit: (data: PrescriptionFormData) => Promise<void> | void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<PrescriptionFormData>>({
    dateIssued: new Date().toISOString().split('T')[0],
    refillsAuthorized: 0,
    refillsRemaining: 0,
    ...initialData,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData as PrescriptionFormData);
  };

  const updateField = (field: keyof PrescriptionFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Prescription Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prescription Number *</label>
            <Input
              value={formData.prescriptionNumber}
              onChange={(e) => updateField('prescriptionNumber', e.target.value)}
              placeholder="Rx number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
            <Input
              value={formData.quantity}
              onChange={(e) => updateField('quantity', e.target.value)}
              placeholder="e.g., 30 tablets"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prescriber *</label>
            <Input
              value={formData.prescriber}
              onChange={(e) => updateField('prescriber', e.target.value)}
              placeholder="Dr. Smith"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prescriber NPI</label>
            <Input
              value={formData.prescriberNPI || ''}
              onChange={(e) => updateField('prescriberNPI', e.target.value)}
              placeholder="10-digit NPI"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pharmacy *</label>
            <Input
              value={formData.pharmacy}
              onChange={(e) => updateField('pharmacy', e.target.value)}
              placeholder="Pharmacy name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Issued *</label>
            <Input
              type="date"
              value={formData.dateIssued}
              onChange={(e) => updateField('dateIssued', e.target.value)}
              required
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Refills Authorized</label>
            <Input
              type="number"
              min="0"
              value={formData.refillsAuthorized}
              onChange={(e) => updateField('refillsAuthorized', parseInt(e.target.value) || 0)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Refills Remaining</label>
            <Input
              type="number"
              min="0"
              value={formData.refillsRemaining}
              onChange={(e) => updateField('refillsRemaining', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Directions *</label>
          <Textarea
            value={formData.directions}
            onChange={(e) => updateField('directions', e.target.value)}
            placeholder="Take one tablet twice daily with food..."
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <Textarea
            value={formData.notes || ''}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder="Additional prescription notes..."
            rows={2}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="default" loading={isLoading}>
          Save Prescription
        </Button>
      </div>
    </form>
  );
};

PrescriptionForm.displayName = 'PrescriptionForm';

export default PrescriptionForm;
