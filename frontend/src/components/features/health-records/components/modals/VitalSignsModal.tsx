'use client';

/**
 * VitalSignsModal.tsx - Modal for recording vital signs
 * Purpose: Create and edit vital signs records
 *
 * MIGRATION COMPLETE: Now uses server actions instead of deprecated services
 * Pattern: Form submission via native HTML form action (progressive enhancement)
 */

import React from 'react';
// MIGRATION COMPLETE: Using types from server actions
// Old: import type { VitalSigns, VitalSignsCreate } from '@/services/modules/healthRecordsApi';
import type { VitalSigns, VitalSignsCreate } from '@/lib/actions/health-records.actions';

interface VitalSignsFormErrors {
  recordDate?: string;
  temperature?: string;
  bloodPressureSystolic?: string;
  bloodPressureDiastolic?: string;
  heartRate?: string;
  respiratoryRate?: string;
  oxygenSaturation?: string;
  recordedBy?: string;
}

interface VitalSignsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<VitalSignsCreate>) => void;
  vitalSigns?: VitalSigns | null;
  errors?: VitalSignsFormErrors;
  title?: string;
}

/**
 * NOTE: This modal still uses callback pattern for backward compatibility.
 * Parent components can migrate to useActionState pattern:
 *
 * @example Modern pattern (in parent component):
 * ```typescript
 * import { useActionState } from 'react';
 * import { createVitalSignsAction } from '@/lib/actions/health-records.actions';
 *
 * const [state, formAction, isPending] = useActionState(createVitalSignsAction, { errors: {} });
 *
 * const handleSave = async (data: Partial<VitalSignsCreate>) => {
 *   const formData = new FormData();
 *   Object.entries(data).forEach(([key, value]) => {
 *     if (value !== undefined) formData.append(key, String(value));
 *   });
 *   await formAction(formData);
 *   if (state.success) onClose();
 * };
 * ```
 */

export const VitalSignsModal: React.FC<VitalSignsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  vitalSigns,
  errors = {} as VitalSignsFormErrors,
  title,
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const data: Partial<VitalSignsCreate> = {
      recordDate: formData.get('recordDate') as string,
      recordedBy: formData.get('recordedBy') as string,
    };

    // Optional temperature
    const temperature = formData.get('temperature') as string;
    if (temperature) {
      data.temperature = parseFloat(temperature);
      data.temperatureMethod = formData.get('temperatureMethod') as 'oral' | 'axillary' | 'tympanic' | 'temporal';
    }

    // Optional blood pressure
    const systolic = formData.get('bloodPressureSystolic') as string;
    const diastolic = formData.get('bloodPressureDiastolic') as string;
    if (systolic) data.bloodPressureSystolic = parseInt(systolic);
    if (diastolic) data.bloodPressureDiastolic = parseInt(diastolic);

    // Optional other vitals
    const heartRate = formData.get('heartRate') as string;
    if (heartRate) data.heartRate = parseInt(heartRate);

    const respiratoryRate = formData.get('respiratoryRate') as string;
    if (respiratoryRate) data.respiratoryRate = parseInt(respiratoryRate);

    const oxygenSaturation = formData.get('oxygenSaturation') as string;
    if (oxygenSaturation) data.oxygenSaturation = parseInt(oxygenSaturation);

    const pain = formData.get('pain') as string;
    if (pain) data.pain = parseInt(pain);

    const glucose = formData.get('glucose') as string;
    if (glucose) data.glucose = parseFloat(glucose);

    const weight = formData.get('weight') as string;
    if (weight) data.weight = parseFloat(weight);

    const height = formData.get('height') as string;
    if (height) data.height = parseFloat(height);

    const notes = formData.get('notes') as string;
    if (notes) data.notes = notes;

    onSave(data);
  };

  const modalTitle = title || (vitalSigns ? 'Edit Vital Signs' : 'Record Vital Signs');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="vital-signs-modal">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white" data-testid="modal-title">
          {modalTitle}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Date and Provider */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Record Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="recordDate"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
                defaultValue={vitalSigns?.recordDate || new Date().toISOString().split('T')[0]}
                data-testid="record-date-input"
                required
              />
              {errors.recordDate && (
                <p className="text-red-600 text-sm mt-1">{errors.recordDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Recorded By <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="recordedBy"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
                placeholder="Nurse/Provider name"
                defaultValue={vitalSigns?.recordedBy || ''}
                data-testid="recorded-by-input"
                required
              />
              {errors.recordedBy && (
                <p className="text-red-600 text-sm mt-1">{errors.recordedBy}</p>
              )}
            </div>
          </div>

          {/* Temperature */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Temperature (°C)
              </label>
              <input
                type="number"
                name="temperature"
                step="0.1"
                min="35"
                max="42"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
                placeholder="37.0"
                defaultValue={vitalSigns?.temperature || ''}
                data-testid="temperature-input"
              />
              {errors.temperature && (
                <p className="text-red-600 text-sm mt-1">{errors.temperature}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Temperature Method
              </label>
              <select
                name="temperatureMethod"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
                defaultValue={vitalSigns?.temperatureMethod || 'oral'}
                data-testid="temperature-method-select"
              >
                <option value="oral">Oral</option>
                <option value="axillary">Axillary</option>
                <option value="tympanic">Tympanic</option>
                <option value="temporal">Temporal</option>
              </select>
            </div>
          </div>

          {/* Blood Pressure */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                BP Systolic (mmHg)
              </label>
              <input
                type="number"
                name="bloodPressureSystolic"
                min="50"
                max="250"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
                placeholder="120"
                defaultValue={vitalSigns?.bloodPressureSystolic || ''}
                data-testid="bp-systolic-input"
              />
              {errors.bloodPressureSystolic && (
                <p className="text-red-600 text-sm mt-1">{errors.bloodPressureSystolic}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                BP Diastolic (mmHg)
              </label>
              <input
                type="number"
                name="bloodPressureDiastolic"
                min="30"
                max="150"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
                placeholder="80"
                defaultValue={vitalSigns?.bloodPressureDiastolic || ''}
                data-testid="bp-diastolic-input"
              />
              {errors.bloodPressureDiastolic && (
                <p className="text-red-600 text-sm mt-1">{errors.bloodPressureDiastolic}</p>
              )}
            </div>
          </div>

          {/* Heart Rate and Respiratory Rate */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Heart Rate (bpm)
              </label>
              <input
                type="number"
                name="heartRate"
                min="30"
                max="250"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
                placeholder="72"
                defaultValue={vitalSigns?.heartRate || ''}
                data-testid="heart-rate-input"
              />
              {errors.heartRate && (
                <p className="text-red-600 text-sm mt-1">{errors.heartRate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Respiratory Rate (breaths/min)
              </label>
              <input
                type="number"
                name="respiratoryRate"
                min="8"
                max="60"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
                placeholder="16"
                defaultValue={vitalSigns?.respiratoryRate || ''}
                data-testid="respiratory-rate-input"
              />
              {errors.respiratoryRate && (
                <p className="text-red-600 text-sm mt-1">{errors.respiratoryRate}</p>
              )}
            </div>
          </div>

          {/* Oxygen Saturation and Pain */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                O2 Saturation (%)
              </label>
              <input
                type="number"
                name="oxygenSaturation"
                min="0"
                max="100"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
                placeholder="98"
                defaultValue={vitalSigns?.oxygenSaturation || ''}
                data-testid="oxygen-saturation-input"
              />
              {errors.oxygenSaturation && (
                <p className="text-red-600 text-sm mt-1">{errors.oxygenSaturation}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pain Level (0-10)
              </label>
              <input
                type="number"
                name="pain"
                min="0"
                max="10"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
                placeholder="0"
                defaultValue={vitalSigns?.pain || ''}
                data-testid="pain-input"
              />
            </div>
          </div>

          {/* Glucose */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Glucose (mg/dL)
              </label>
              <input
                type="number"
                name="glucose"
                step="0.1"
                min="0"
                max="600"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
                placeholder="100"
                defaultValue={vitalSigns?.glucose || ''}
                data-testid="glucose-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                step="0.1"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
                placeholder="70"
                defaultValue={vitalSigns?.weight || ''}
                data-testid="weight-input"
              />
            </div>
          </div>

          {/* Height */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              name="height"
              step="0.1"
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
              placeholder="170"
              defaultValue={vitalSigns?.height || ''}
              data-testid="height-input"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
              rows={3}
              placeholder="Additional notes about vital signs"
              defaultValue={vitalSigns?.notes || ''}
              data-testid="notes-input"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="btn-primary flex-1"
              data-testid="save-vital-signs-btn"
            >
              {vitalSigns ? 'Update Vital Signs' : 'Save Vital Signs'}
            </button>
            <button
              type="button"
              className="btn-secondary flex-1"
              onClick={onClose}
              data-testid="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
