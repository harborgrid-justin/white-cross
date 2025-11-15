'use client';

/**
 * ScreeningModal.tsx - Modal for health screenings
 * Purpose: Create and edit health screening records
 *
 * MIGRATION COMPLETE: Now uses server actions instead of deprecated services
 * Pattern: Form submission via native HTML form action (progressive enhancement)
 */

import React from 'react';
// MIGRATION COMPLETE: Using types from server actions
// Old: import type { Screening, ScreeningCreate, ScreeningType, ScreeningOutcome } from '@/services/modules/healthRecordsApi';
import type { Screening, ScreeningCreate } from '@/lib/actions/health-records.actions';
import { ScreeningType, ScreeningOutcome } from '@/lib/actions/health-records.actions';

interface ScreeningFormErrors {
  screeningType?: string;
  screeningDate?: string;
  performedBy?: string;
  outcome?: string;
}

interface ScreeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ScreeningCreate>) => void;
  screening?: Screening | null;
  errors?: ScreeningFormErrors;
  title?: string;
}

/**
 * NOTE: This modal still uses callback pattern for backward compatibility.
 * Parent components can migrate to useActionState pattern:
 *
 * @example Modern pattern (in parent component):
 * ```typescript
 * import { useActionState } from 'react';
 * import { createScreeningAction } from '@/lib/actions/health-records.actions';
 *
 * const [state, formAction, isPending] = useActionState(createScreeningAction, { errors: {} });
 *
 * const handleSave = async (data: Partial<ScreeningCreate>) => {
 *   const formData = new FormData();
 *   Object.entries(data).forEach(([key, value]) => {
 *     if (value !== undefined) formData.append(key, String(value));
 *   });
 *   await formAction(formData);
 *   if (state.success) onClose();
 * };
 * ```
 */

const SCREENING_TYPES: { value: ScreeningType; label: string }[] = [
  { value: ScreeningType.VISION, label: 'Vision' },
  { value: ScreeningType.HEARING, label: 'Hearing' },
  { value: ScreeningType.DENTAL, label: 'Dental' },
  { value: ScreeningType.SCOLIOSIS, label: 'Scoliosis' },
  { value: ScreeningType.BMI, label: 'BMI' },
  { value: ScreeningType.BLOOD_PRESSURE, label: 'Blood Pressure' },
  { value: ScreeningType.MENTAL_HEALTH, label: 'Mental Health' },
  { value: ScreeningType.DEVELOPMENTAL, label: 'Developmental' },
  { value: ScreeningType.OTHER, label: 'Other' },
];

const SCREENING_OUTCOMES: { value: ScreeningOutcome; label: string }[] = [
  { value: ScreeningOutcome.PASSED, label: 'Passed' },
  { value: ScreeningOutcome.FAILED, label: 'Failed' },
  { value: ScreeningOutcome.REFER, label: 'Refer' },
  { value: ScreeningOutcome.INCONCLUSIVE, label: 'Inconclusive' },
  { value: ScreeningOutcome.DECLINED, label: 'Declined' },
];

export const ScreeningModal: React.FC<ScreeningModalProps> = ({
  isOpen,
  onClose,
  onSave,
  screening,
  errors = {} as ScreeningFormErrors,
  title,
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const data: Partial<ScreeningCreate> = {
      screeningType: formData.get('screeningType') as ScreeningType,
      screeningDate: formData.get('screeningDate') as string,
      performedBy: formData.get('performedBy') as string,
      outcome: formData.get('outcome') as ScreeningOutcome,
    };

    const results = formData.get('results') as string;
    if (results) data.results = results;

    const referralRequired = formData.get('referralRequired') as string;
    data.referralRequired = referralRequired === 'true';

    const referralTo = formData.get('referralTo') as string;
    if (referralTo) data.referralTo = referralTo;

    const followUpRequired = formData.get('followUpRequired') as string;
    data.followUpRequired = followUpRequired === 'true';

    const followUpDate = formData.get('followUpDate') as string;
    if (followUpDate) data.followUpDate = followUpDate;

    const notes = formData.get('notes') as string;
    if (notes) data.notes = notes;

    onSave(data);
  };

  const modalTitle = title || (screening ? 'Edit Screening' : 'Add Screening');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="screening-modal">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white" data-testid="modal-title">
          {modalTitle}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Screening Type and Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Screening Type <span className="text-red-500">*</span>
              </label>
              <select
                name="screeningType"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
                defaultValue={screening?.screeningType || ''}
                data-testid="screening-type-select"
                required
              >
                <option value="">Select type</option>
                {SCREENING_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.screeningType && (
                <p className="text-red-600 text-sm mt-1">{errors.screeningType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Screening Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="screeningDate"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
                defaultValue={screening?.screeningDate || new Date().toISOString().split('T')[0]}
                data-testid="screening-date-input"
                required
              />
              {errors.screeningDate && (
                <p className="text-red-600 text-sm mt-1">{errors.screeningDate}</p>
              )}
            </div>
          </div>

          {/* Performed By and Outcome */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Performed By <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="performedBy"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
                placeholder="Nurse/Provider name"
                defaultValue={screening?.performedBy || ''}
                data-testid="performed-by-input"
                required
              />
              {errors.performedBy && (
                <p className="text-red-600 text-sm mt-1">{errors.performedBy}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Outcome <span className="text-red-500">*</span>
              </label>
              <select
                name="outcome"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
                defaultValue={screening?.outcome || ''}
                data-testid="outcome-select"
                required
              >
                <option value="">Select outcome</option>
                {SCREENING_OUTCOMES.map(outcome => (
                  <option key={outcome.value} value={outcome.value}>
                    {outcome.label}
                  </option>
                ))}
              </select>
              {errors.outcome && (
                <p className="text-red-600 text-sm mt-1">{errors.outcome}</p>
              )}
            </div>
          </div>

          {/* Results */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Results
            </label>
            <textarea
              name="results"
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
              rows={3}
              placeholder="Detailed screening results"
              defaultValue={screening?.results || ''}
              data-testid="results-input"
            />
          </div>

          {/* Referral */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Referral Required
              </label>
              <select
                name="referralRequired"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
                defaultValue={screening?.referralRequired ? 'true' : 'false'}
                data-testid="referral-required-select"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Referral To
              </label>
              <input
                type="text"
                name="referralTo"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
                placeholder="Specialist/Provider"
                defaultValue={screening?.referralTo || ''}
                data-testid="referral-to-input"
              />
            </div>
          </div>

          {/* Follow Up */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Follow Up Required
              </label>
              <select
                name="followUpRequired"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
                defaultValue={screening?.followUpRequired ? 'true' : 'false'}
                data-testid="follow-up-required-select"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Follow Up Date
              </label>
              <input
                type="date"
                name="followUpDate"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
                defaultValue={screening?.followUpDate || ''}
                data-testid="follow-up-date-input"
              />
            </div>
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
              placeholder="Additional notes"
              defaultValue={screening?.notes || ''}
              data-testid="notes-input"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="btn-primary flex-1"
              data-testid="save-screening-btn"
            >
              {screening ? 'Update Screening' : 'Save Screening'}
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
