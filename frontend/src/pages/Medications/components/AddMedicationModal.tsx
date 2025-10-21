/**
 * WF-COMP-223 | AddMedicationModal.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Add Medication Modal Component
 *
 * Modal form for creating new medications with validation
 */

import React from 'react';
import type { MedicationFormData, MedicationFormErrors } from '../types';

interface AddMedicationModalProps {
  show: boolean;
  formData: MedicationFormData;
  formErrors: MedicationFormErrors;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormDataChange: (data: MedicationFormData) => void;
}

/**
 * Modal for adding new medications
 */
export default function AddMedicationModal({
  show,
  formData,
  formErrors,
  onClose,
  onSubmit,
  onFormDataChange,
}: AddMedicationModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        data-testid="add-medication-modal"
        className="bg-white rounded-lg p-6 w-full max-w-lg max-h-screen overflow-y-auto"
      >
        <h3 data-testid="modal-title" className="text-lg font-semibold mb-4">
          Add New Medication
        </h3>

        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medication Name *
              </label>
              <input
                data-testid="medication-name-input"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  onFormDataChange({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {formErrors.name && (
                <p data-testid="name-error" className="text-red-600 text-sm mt-1">
                  {formErrors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Generic Name
              </label>
              <input
                data-testid="generic-name-input"
                type="text"
                value={formData.genericName}
                onChange={(e) =>
                  onFormDataChange({ ...formData, genericName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dosage Form *
              </label>
              <select
                data-testid="dosage-form-select"
                value={formData.dosageForm}
                onChange={(e) =>
                  onFormDataChange({ ...formData, dosageForm: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select dosage form</option>
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Liquid">Liquid</option>
                <option value="Inhaler">Inhaler</option>
                <option value="Injection">Injection</option>
                <option value="Cream">Cream</option>
                <option value="Ointment">Ointment</option>
              </select>
              {formErrors.dosageForm && (
                <p
                  data-testid="dosage-form-error"
                  className="text-red-600 text-sm mt-1"
                >
                  {formErrors.dosageForm}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Strength *
              </label>
              <input
                data-testid="strength-input"
                type="text"
                placeholder="e.g., 500mg, 10ml"
                value={formData.strength}
                onChange={(e) =>
                  onFormDataChange({ ...formData, strength: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {formErrors.strength && (
                <p
                  data-testid="strength-error"
                  className="text-red-600 text-sm mt-1"
                >
                  {formErrors.strength}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manufacturer
              </label>
              <input
                data-testid="manufacturer-input"
                type="text"
                value={formData.manufacturer}
                onChange={(e) =>
                  onFormDataChange({ ...formData, manufacturer: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NDC Number
              </label>
              <input
                data-testid="ndc-input"
                type="text"
                placeholder="12345-678-90"
                value={formData.ndc}
                onChange={(e) =>
                  onFormDataChange({ ...formData, ndc: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {formErrors.ndc && (
                <p data-testid="ndc-error" className="text-red-600 text-sm mt-1">
                  {formErrors.ndc}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                data-testid="medication-notes"
                placeholder="Special handling instructions..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <input
                data-testid="controlled-substance-checkbox"
                type="checkbox"
                checked={formData.isControlled}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    isControlled: e.target.checked,
                  })
                }
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700">
                Controlled Substance
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              data-testid="cancel-button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="save-medication-button"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Medication
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
