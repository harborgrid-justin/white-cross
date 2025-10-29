'use client';

/**
 * WF-MED-FORM-001 | MedicationForm.tsx - Medication Form Component
 * Purpose: Form for creating and editing medications
 * Upstream: Medication API | Dependencies: React, Form inputs
 * Downstream: Medication management | Called by: Add/Edit medication modals
 * Related: MedicationList, MedicationDetails
 * Exports: MedicationForm component | Key Features: Validation, submission
 * Last Updated: 2025-10-27 | File Type: .tsx
 * Critical Path: User input → Validation → API submission
 * LLM Context: Medication form component for White Cross healthcare platform
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { DatePicker } from '@/components/ui/Inputs/DatePicker';

/**
 * Medication form data interface
 */
export interface MedicationFormData {
  name: string;
  genericName?: string;
  brandName?: string;
  dosage: string;
  frequency: string;
  route: string;
  prescriber: string;
  prescriberNPI?: string;
  pharmacy?: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'inactive' | 'discontinued' | 'pending';
  isControlled: boolean;
  controlledSubstanceSchedule?: string;
  instructions?: string;
  studentId?: string;
  prescriptionNumber?: string;
  refillsRemaining?: number;
  notes?: string;
}

/**
 * MedicationForm component props
 */
export interface MedicationFormProps {
  initialData?: Partial<MedicationFormData>;
  onSubmit: (data: MedicationFormData) => Promise<void> | void;
  onCancel?: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

/**
 * MedicationForm component for creating and editing medications
 *
 * Comprehensive form with validation for all medication fields.
 * Supports both create and edit modes with proper defaults.
 *
 * **Features:**
 * - Complete medication information capture
 * - Form validation
 * - Controlled substance handling
 * - Date selection
 * - Loading states
 * - Error handling
 *
 * @component
 */
export const MedicationForm: React.FC<MedicationFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  mode = 'create',
}) => {
  const [formData, setFormData] = useState<MedicationFormData>({
    name: '',
    dosage: '',
    frequency: '',
    route: 'oral',
    prescriber: '',
    startDate: new Date().toISOString().split('T')[0],
    status: 'active',
    isControlled: false,
    ...initialData,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof MedicationFormData, string>>>({});

  // Note: initialData is already spread into formData initial state above (line 91)
  // No need for useEffect to update it, as this would cause infinite re-renders
  // when initialData defaults to {} on every render

  /**
   * Validate form data
   */
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof MedicationFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Medication name is required';
    }
    if (!formData.dosage.trim()) {
      newErrors.dosage = 'Dosage is required';
    }
    if (!formData.frequency.trim()) {
      newErrors.frequency = 'Frequency is required';
    }
    if (!formData.prescriber.trim()) {
      newErrors.prescriber = 'Prescriber is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  /**
   * Update form field
   */
  const updateField = (field: keyof MedicationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Medication Name *
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Enter medication name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="genericName" className="block text-sm font-medium text-gray-700 mb-1">
              Generic Name
            </label>
            <Input
              id="genericName"
              value={formData.genericName || ''}
              onChange={(e) => updateField('genericName', e.target.value)}
              placeholder="Generic name"
            />
          </div>

          <div>
            <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-1">
              Brand Name
            </label>
            <Input
              id="brandName"
              value={formData.brandName || ''}
              onChange={(e) => updateField('brandName', e.target.value)}
              placeholder="Brand name"
            />
          </div>

          <div>
            <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1">
              Dosage *
            </label>
            <Input
              id="dosage"
              value={formData.dosage}
              onChange={(e) => updateField('dosage', e.target.value)}
              placeholder="e.g., 500mg"
              aria-invalid={!!errors.dosage}
              aria-describedby={errors.dosage ? 'dosage-error' : undefined}
            />
            {errors.dosage && (
              <p id="dosage-error" className="mt-1 text-sm text-red-600">
                {errors.dosage}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
              Frequency *
            </label>
            <Input
              id="frequency"
              value={formData.frequency}
              onChange={(e) => updateField('frequency', e.target.value)}
              placeholder="e.g., Twice daily"
              aria-invalid={!!errors.frequency}
              aria-describedby={errors.frequency ? 'frequency-error' : undefined}
            />
            {errors.frequency && (
              <p id="frequency-error" className="mt-1 text-sm text-red-600">
                {errors.frequency}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="route" className="block text-sm font-medium text-gray-700 mb-1">
              Route of Administration *
            </label>
            <Select
              id="route"
              value={formData.route}
              onChange={(e) => updateField('route', e.target.value)}
            >
              <option value="oral">Oral</option>
              <option value="topical">Topical</option>
              <option value="inhaled">Inhaled</option>
              <option value="injection">Injection</option>
              <option value="sublingual">Sublingual</option>
              <option value="rectal">Rectal</option>
              <option value="transdermal">Transdermal</option>
              <option value="other">Other</option>
            </Select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Select
              id="status"
              value={formData.status}
              onChange={(e) => updateField('status', e.target.value as any)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="discontinued">Discontinued</option>
              <option value="pending">Pending</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Prescriber Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Prescriber Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="prescriber" className="block text-sm font-medium text-gray-700 mb-1">
              Prescriber Name *
            </label>
            <Input
              id="prescriber"
              value={formData.prescriber}
              onChange={(e) => updateField('prescriber', e.target.value)}
              placeholder="Dr. Smith"
              aria-invalid={!!errors.prescriber}
              aria-describedby={errors.prescriber ? 'prescriber-error' : undefined}
            />
            {errors.prescriber && (
              <p id="prescriber-error" className="mt-1 text-sm text-red-600">
                {errors.prescriber}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="prescriberNPI" className="block text-sm font-medium text-gray-700 mb-1">
              Prescriber NPI
            </label>
            <Input
              id="prescriberNPI"
              value={formData.prescriberNPI || ''}
              onChange={(e) => updateField('prescriberNPI', e.target.value)}
              placeholder="10-digit NPI"
            />
          </div>

          <div>
            <label htmlFor="pharmacy" className="block text-sm font-medium text-gray-700 mb-1">
              Pharmacy
            </label>
            <Input
              id="pharmacy"
              value={formData.pharmacy || ''}
              onChange={(e) => updateField('pharmacy', e.target.value)}
              placeholder="Pharmacy name"
            />
          </div>

          <div>
            <label htmlFor="prescriptionNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Prescription Number
            </label>
            <Input
              id="prescriptionNumber"
              value={formData.prescriptionNumber || ''}
              onChange={(e) => updateField('prescriptionNumber', e.target.value)}
              placeholder="Rx number"
            />
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Treatment Period</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => updateField('startDate', e.target.value)}
              aria-invalid={!!errors.startDate}
              aria-describedby={errors.startDate ? 'startDate-error' : undefined}
            />
            {errors.startDate && (
              <p id="startDate-error" className="mt-1 text-sm text-red-600">
                {errors.startDate}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date (Optional)
            </label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate || ''}
              onChange={(e) => updateField('endDate', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Controlled Substance */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="isControlled"
            checked={formData.isControlled}
            onChange={(e) => updateField('isControlled', e.target.checked)}
          />
          <label htmlFor="isControlled" className="text-sm font-medium text-gray-700">
            Controlled Substance
          </label>
        </div>

        {formData.isControlled && (
          <div className="ml-6">
            <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-1">
              DEA Schedule
            </label>
            <Select
              id="schedule"
              value={formData.controlledSubstanceSchedule || ''}
              onChange={(e) => updateField('controlledSubstanceSchedule', e.target.value)}
            >
              <option value="">Select schedule</option>
              <option value="I">Schedule I</option>
              <option value="II">Schedule II</option>
              <option value="III">Schedule III</option>
              <option value="IV">Schedule IV</option>
              <option value="V">Schedule V</option>
            </Select>
          </div>
        )}
      </div>

      {/* Instructions and Notes */}
      <div className="space-y-4">
        <div>
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
            Administration Instructions
          </label>
          <Textarea
            id="instructions"
            value={formData.instructions || ''}
            onChange={(e) => updateField('instructions', e.target.value)}
            placeholder="Special instructions for administration..."
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <Textarea
            id="notes"
            value={formData.notes || ''}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder="Additional notes..."
            rows={3}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" loading={isLoading}>
          {mode === 'create' ? 'Create Medication' : 'Update Medication'}
        </Button>
      </div>
    </form>
  );
};

MedicationForm.displayName = 'MedicationForm';

export default MedicationForm;
