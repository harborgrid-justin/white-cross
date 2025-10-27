'use client';

/**
 * WF-MED-FORM-002 | AdministrationForm.tsx - Medication Administration Form
 * Purpose: Record medication administration events
 * Upstream: Administration API | Dependencies: React, Form inputs
 * Downstream: Administration log | Called by: Medication administration flow
 * Related: AdministrationLog, MedicationSchedule
 * Exports: AdministrationForm component
 * Last Updated: 2025-10-27 | File Type: .tsx
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';

export interface AdministrationFormData {
  medicationId: string;
  studentId: string;
  administeredAt: string;
  dosageGiven: string;
  administeredBy: string;
  route: string;
  site?: string;
  witnessedBy?: string;
  reactions?: string;
  notes?: string;
  refusedByStudent?: boolean;
  refusalReason?: string;
}

export interface AdministrationFormProps {
  medicationName?: string;
  studentName?: string;
  scheduledDosage?: string;
  onSubmit: (data: AdministrationFormData) => Promise<void> | void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const AdministrationForm: React.FC<AdministrationFormProps> = ({
  medicationName,
  studentName,
  scheduledDosage,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<AdministrationFormData>>({
    administeredAt: new Date().toISOString().slice(0, 16),
    dosageGiven: scheduledDosage || '',
    route: 'oral',
    refusedByStudent: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData as AdministrationFormData);
  };

  const updateField = (field: keyof AdministrationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900">Administration Details</h4>
        {medicationName && <p className="text-sm text-blue-700 mt-1">Medication: {medicationName}</p>}
        {studentName && <p className="text-sm text-blue-700">Student: {studentName}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time Administered *</label>
          <Input
            type="datetime-local"
            value={formData.administeredAt}
            onChange={(e) => updateField('administeredAt', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Given *</label>
          <Input
            value={formData.dosageGiven}
            onChange={(e) => updateField('dosageGiven', e.target.value)}
            placeholder="e.g., 500mg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Route *</label>
          <Select value={formData.route} onChange={(e) => updateField('route', e.target.value)} required>
            <option value="oral">Oral</option>
            <option value="topical">Topical</option>
            <option value="inhaled">Inhaled</option>
            <option value="injection">Injection</option>
            <option value="sublingual">Sublingual</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Administration Site</label>
          <Input
            value={formData.site || ''}
            onChange={(e) => updateField('site', e.target.value)}
            placeholder="e.g., Left arm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Administered By *</label>
          <Input
            value={formData.administeredBy}
            onChange={(e) => updateField('administeredBy', e.target.value)}
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Witnessed By</label>
          <Input
            value={formData.witnessedBy || ''}
            onChange={(e) => updateField('witnessedBy', e.target.value)}
            placeholder="Witness name"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          checked={formData.refusedByStudent}
          onChange={(e) => updateField('refusedByStudent', e.target.checked)}
        />
        <label className="text-sm font-medium text-gray-700">Student refused medication</label>
      </div>

      {formData.refusedByStudent && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Refusal Reason</label>
          <Textarea
            value={formData.refusalReason || ''}
            onChange={(e) => updateField('refusalReason', e.target.value)}
            placeholder="Reason for refusal..."
            rows={2}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Reactions or Side Effects</label>
        <Textarea
          value={formData.reactions || ''}
          onChange={(e) => updateField('reactions', e.target.value)}
          placeholder="Any observed reactions..."
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <Textarea
          value={formData.notes || ''}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Additional notes..."
          rows={3}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" loading={isLoading}>
          Record Administration
        </Button>
      </div>
    </form>
  );
};

AdministrationForm.displayName = 'AdministrationForm';

export default AdministrationForm;
