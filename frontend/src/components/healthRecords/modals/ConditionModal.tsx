import React from 'react'
import type { ChronicCondition, ConditionFormErrors } from '@/types/healthRecords'
import { SEVERITY_LEVELS, CONDITION_STATUS_OPTIONS } from '@/constants/healthRecords'

interface ConditionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (formData: FormData) => void
  condition?: ChronicCondition | null
  errors?: ConditionFormErrors
  title?: string
}

export const ConditionModal: React.FC<ConditionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  condition,
  errors = {},
  title
}) => {
  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    onSave(formData)
  }

  const modalTitle = title || (condition ? 'Edit Chronic Condition' : 'Add Chronic Condition')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="add-condition-modal">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4" data-testid="modal-title">{modalTitle}</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <input 
              type="text" 
              name="condition"
              className="w-full border border-gray-300 rounded px-3 py-2" 
              placeholder="Enter condition name"
              defaultValue={condition?.condition || ''}
              data-testid="condition-input"
            />
            {errors.condition && (
              <p className="text-red-600 text-sm mt-1" data-testid="condition-error">{errors.condition}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosed Date</label>
            <input 
              type="date" 
              name="diagnosedDate"
              className="w-full border border-gray-300 rounded px-3 py-2"
              defaultValue={condition?.diagnosedDate || ''}
              data-testid="diagnosed-date-input"
            />
            {errors.diagnosedDate && (
              <p className="text-red-600 text-sm mt-1" data-testid="diagnosed-date-error">{errors.diagnosedDate}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              name="status"
              className="w-full border border-gray-300 rounded px-3 py-2" 
              defaultValue={condition?.status || ''}
              data-testid="status-select"
            >
              <option value="">Select status</option>
              {CONDITION_STATUS_OPTIONS.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
            <select 
              name="severity"
              className="w-full border border-gray-300 rounded px-3 py-2" 
              defaultValue={condition?.severity || ''}
              data-testid="severity-select"
            >
              <option value="">Select severity</option>
              {SEVERITY_LEVELS.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Care Plan</label>
            <textarea 
              name="carePlan"
              className="w-full border border-gray-300 rounded px-3 py-2" 
              rows={3}
              placeholder="Describe care plan"
              defaultValue={condition?.carePlan || ''}
              data-testid="care-plan-textarea"
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <button 
              type="submit" 
              className="btn-primary flex-1"
              data-testid="save-condition-button"
            >
              {condition ? 'Update Condition' : 'Save Condition'}
            </button>
            <button 
              type="button" 
              className="btn-secondary flex-1"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}