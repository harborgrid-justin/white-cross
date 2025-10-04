import React, { useState } from 'react'
import { X } from 'lucide-react'

interface MedicationFormData {
  name: string
  genericName: string
  dosageForm: string
  strength: string
  manufacturer: string
  isControlled: boolean
}

interface MedicationFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: MedicationFormData) => void
  initialData?: MedicationFormData
  loading?: boolean
}

export default function MedicationFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading = false
}: MedicationFormModalProps) {
  const [formData, setFormData] = useState<MedicationFormData>(
    initialData || {
      name: '',
      genericName: '',
      dosageForm: '',
      strength: '',
      manufacturer: '',
      isControlled: false
    }
  )

  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Medication name is required'
    if (!formData.dosageForm.trim()) newErrors.dosageForm = 'Dosage form is required'
    if (!formData.strength.trim()) newErrors.strength = 'Strength is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
    setErrors({})
  }

  const handleClose = () => {
    onClose()
    setFormData({
      name: '',
      genericName: '',
      dosageForm: '',
      strength: '',
      manufacturer: '',
      isControlled: false
    })
    setErrors({})
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div data-testid="add-medication-modal" className="bg-white rounded-lg p-6 w-full max-w-lg max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 data-testid="modal-title" className="text-lg font-semibold">
            {initialData ? 'Edit Medication' : 'Add New Medication'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name *</label>
              <input
                data-testid="medication-name-input"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.name && <p data-testid="name-error" className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Generic Name</label>
              <input
                data-testid="generic-name-input"
                type="text"
                value={formData.genericName}
                onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Form *</label>
              <select
                data-testid="dosage-form-select"
                value={formData.dosageForm}
                onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
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
              {errors.dosageForm && <p data-testid="dosage-form-error" className="text-red-600 text-sm mt-1">{errors.dosageForm}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Strength *</label>
              <input
                data-testid="strength-input"
                type="text"
                placeholder="e.g., 500mg, 10ml"
                value={formData.strength}
                onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.strength && <p data-testid="strength-error" className="text-red-600 text-sm mt-1">{errors.strength}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
              <input
                data-testid="manufacturer-input"
                type="text"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <input
                data-testid="controlled-substance-checkbox"
                type="checkbox"
                checked={formData.isControlled}
                onChange={(e) => setFormData({ ...formData, isControlled: e.target.checked })}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700">Controlled Substance</label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              data-testid="cancel-button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="save-medication-button"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : initialData ? 'Update' : 'Add'} Medication
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
