import React from 'react'
import type { GrowthMeasurement, GrowthMeasurementFormErrors } from '@/types/healthRecords'

interface MeasurementModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (measurementData: {
    date: string
    height: number
    weight: number
    headCircumference?: number
    notes?: string
  }) => void
  measurement?: GrowthMeasurement | null
  errors?: GrowthMeasurementFormErrors
  title?: string
}

export const MeasurementModal: React.FC<MeasurementModalProps> = ({
  isOpen,
  onClose,
  onSave,
  measurement,
  errors = {},
  title = 'Add Growth Measurement'
}) => {
  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    const measurementData = {
      date: formData.get('date') as string,
      height: parseFloat(formData.get('height') as string),
      weight: parseFloat(formData.get('weight') as string),
      headCircumference: formData.get('headCircumference') ? parseFloat(formData.get('headCircumference') as string) : undefined,
      notes: formData.get('notes') as string,
    }
    
    onSave(measurementData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="measurement-modal">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4" data-testid="modal-title">{title}</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Measurement Date</label>
            <input 
              type="date" 
              name="date"
              className="w-full border border-gray-300 rounded px-3 py-2"
              defaultValue={measurement?.date || ''}
              data-testid="measurement-date-input"
            />
            {errors.date && (
              <p className="text-red-600 text-sm mt-1" data-testid="date-error">{errors.date}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height (inches)</label>
            <input 
              type="number" 
              name="height"
              step="0.1"
              className="w-full border border-gray-300 rounded px-3 py-2" 
              placeholder="Height in inches"
              defaultValue={measurement?.height?.replace(' in', '') || ''}
              data-testid="height-input"
            />
            {errors.height && (
              <p className="text-red-600 text-sm mt-1" data-testid="height-error">{errors.height}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
            <input 
              type="number" 
              name="weight"
              step="0.1"
              className="w-full border border-gray-300 rounded px-3 py-2" 
              placeholder="Weight in pounds"
              defaultValue={measurement?.weight?.replace(' lbs', '') || ''}
              data-testid="weight-input"
            />
            {errors.weight && (
              <p className="text-red-600 text-sm mt-1" data-testid="weight-error">{errors.weight}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Head Circumference (inches)</label>
            <input 
              type="number" 
              name="headCircumference"
              step="0.1"
              className="w-full border border-gray-300 rounded px-3 py-2" 
              placeholder="Head circumference"
              defaultValue={measurement?.headCircumference || ''}
              data-testid="head-circumference-input"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea 
              name="notes"
              className="w-full border border-gray-300 rounded px-3 py-2" 
              rows={2}
              placeholder="Measurement notes"
              defaultValue={measurement?.notes || ''}
              data-testid="measurement-notes-input"
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <button 
              type="submit" 
              className="btn-primary flex-1"
              data-testid="save-measurement-btn"
            >
              {measurement ? 'Update Measurement' : 'Save Measurement'}
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