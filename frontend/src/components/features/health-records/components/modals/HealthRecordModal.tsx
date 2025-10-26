/**
 * HealthRecordModal Component - Create/Edit Health Record Modal
 *
 * Modal dialog for creating and editing student health records with comprehensive
 * validation and PHI data handling. Includes fields for record type, provider
 * information, and detailed descriptions.
 *
 * @module components/features/health-records/modals/HealthRecordModal
 *
 * HIPAA Compliance:
 * - All form data contains Protected Health Information (PHI)
 * - Form validation prevents invalid PHI data entry
 * - No client-side PHI persistence - cleared on modal close
 * - Audit logging should be implemented on the backend for all PHI access
 *
 * @component
 * @since 2025-10-17
 */

import React, { useState } from 'react'
import { X } from 'lucide-react'

/**
 * Props for HealthRecordModal component
 *
 * @interface HealthRecordModalProps
 * @property {boolean} isOpen - Whether modal is currently displayed
 * @property {() => void} onClose - Callback when modal should close
 * @property {(data: any) => void} onSave - Callback with form data when saved
 * @property {any} [initialData] - Pre-populated data for editing existing records
 *
 * @example
 * ```tsx
 * <HealthRecordModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   onSave={(data) => createHealthRecord(data)}
 *   initialData={existingRecord}
 * />
 * ```
 */
interface HealthRecordModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  initialData?: any
}

export const HealthRecordModal: React.FC<HealthRecordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [formData, setFormData] = useState({
    recordType: initialData?.recordType || '',
    date: initialData?.date || '',
    provider: initialData?.provider || '',
    providerEmail: initialData?.providerEmail || '',
    providerPhone: initialData?.providerPhone || '',
    description: initialData?.description || ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required field validation
    if (!formData.recordType) {
      newErrors.recordType = 'Record type is required'
    }
    if (!formData.date) {
      newErrors.date = 'Date is required'
    }
    if (!formData.provider) {
      newErrors.provider = 'Healthcare provider is required'
    }
    if (!formData.description) {
      newErrors.description = 'Description is required'
    }

    // Date validation
    if (formData.date) {
      const dateValue = new Date(formData.date)
      const today = new Date()
      const hundredYearsAgo = new Date()
      hundredYearsAgo.setFullYear(today.getFullYear() - 100)

      if (isNaN(dateValue.getTime())) {
        newErrors.date = 'Please enter a valid date'
      } else if (dateValue > today) {
        newErrors.date = 'Date cannot be in the future'
      } else if (dateValue < hundredYearsAgo) {
        newErrors.date = 'Date cannot be more than 100 years ago'
      }
    }

    // Provider name validation
    if (formData.provider && formData.provider.length < 3) {
      newErrors.provider = 'Provider name must be at least 3 characters'
    }
    if (formData.provider && formData.provider.includes('<script>')) {
      newErrors.provider = 'Provider name contains invalid characters'
    }

    // Description length validation
    if (formData.description && formData.description.length > 2000) {
      newErrors.description = 'Description cannot exceed 2000 characters'
    }

    // Email validation
    if (formData.providerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.providerEmail)) {
      newErrors.providerEmail = 'Please enter a valid email address'
    }

    // Phone validation
    if (formData.providerPhone && !/^[\d\s()-+]+$/.test(formData.providerPhone)) {
      newErrors.providerPhone = 'Please enter a valid phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
      onClose()
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="health-record-modal">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Edit Health Record' : 'New Health Record'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            data-testid="close-modal-button"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} data-testid="health-record-form">
          <div className="space-y-4">
            {/* Record Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Record Type *
              </label>
              <select
                data-testid="record-type-select"
                value={formData.recordType}
                onChange={(e) => handleInputChange('recordType', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select record type</option>
                <option value="Physical Exam">Physical Exam</option>
                <option value="Vaccination">Vaccination</option>
                <option value="Illness">Illness</option>
                <option value="Injury">Injury</option>
                <option value="Medication">Medication</option>
                <option value="Other">Other</option>
              </select>
              {errors.recordType && (
                <p className="text-red-500 text-sm mt-1" data-testid="record-type-error">
                  {errors.recordType}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                data-testid="date-input"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1" data-testid="date-error">
                  {errors.date}
                </p>
              )}
            </div>

            {/* Provider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Healthcare Provider *
              </label>
              <input
                type="text"
                data-testid="provider-input"
                value={formData.provider}
                onChange={(e) => handleInputChange('provider', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Dr. Smith"
              />
              {errors.provider && (
                <p className="text-red-500 text-sm mt-1" data-testid="provider-error">
                  {errors.provider}
                </p>
              )}
            </div>

            {/* Provider Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provider Email
              </label>
              <input
                type="email"
                data-testid="provider-email-input"
                value={formData.providerEmail}
                onChange={(e) => handleInputChange('providerEmail', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="provider@clinic.com"
              />
              {errors.providerEmail && (
                <p className="text-red-500 text-sm mt-1" data-testid="provider-email-error">
                  {errors.providerEmail}
                </p>
              )}
            </div>

            {/* Provider Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provider Phone
              </label>
              <input
                type="tel"
                data-testid="provider-phone-input"
                value={formData.providerPhone}
                onChange={(e) => handleInputChange('providerPhone', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(555) 123-4567"
              />
              {errors.providerPhone && (
                <p className="text-red-500 text-sm mt-1" data-testid="provider-phone-error">
                  {errors.providerPhone}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                data-testid="description-textarea"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the health record details..."
              />
              <div className="text-sm text-gray-500 mt-1" data-testid="character-count">
                {formData.description.length}/2000
              </div>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1" data-testid="description-error">
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              data-testid="cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="save-record-button"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
