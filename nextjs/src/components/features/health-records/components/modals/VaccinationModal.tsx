'use client';

/**
 * WF-COMP-023 | VaccinationModal.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: functional component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React from 'react'
import type { Vaccination, VaccinationFormErrors } from '@/types/healthRecords'

interface VaccinationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (vaccinationData: {
    vaccineName: string
    dateAdministered: string
    administeredBy: string
    dose: string
    lotNumber?: string
    notes?: string
  }) => void
  vaccination?: Vaccination | null
  errors?: VaccinationFormErrors
  title?: string
}

export const VaccinationModal: React.FC<VaccinationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  vaccination,
  errors = {} as VaccinationFormErrors,
  title
}) => {
  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    const vaccinationData = {
      vaccineName: formData.get('vaccineName') as string,
      dateAdministered: formData.get('dateAdministered') as string,
      administeredBy: formData.get('administeredBy') as string,
      dose: formData.get('dose') as string,
      lotNumber: formData.get('lotNumber') as string,
      notes: formData.get('notes') as string,
    }
    
    onSave(vaccinationData)
  }

  const modalTitle = title || (vaccination ? 'Edit Vaccination Record' : 'Add Vaccination Record')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="vaccination-modal">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4" data-testid="modal-title">{modalTitle}</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vaccination Name</label>
            <input 
              type="text" 
              name="vaccineName"
              className="w-full border border-gray-300 rounded px-3 py-2" 
              placeholder="Enter vaccination name"
              defaultValue={vaccination?.vaccineName || ''}
              data-testid="vaccination-name-input"
            />
            {errors.vaccineName && (
              <p className="text-red-600 text-sm mt-1" data-testid="vaccination-name-error">{errors.vaccineName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Administered</label>
            <input 
              type="date" 
              name="dateAdministered"
              className="w-full border border-gray-300 rounded px-3 py-2"
              defaultValue={vaccination?.administrationDate || ''}
              data-testid="vaccination-date-input"
            />
            {errors.dateAdministered && (
              <p className="text-red-600 text-sm mt-1" data-testid="vaccination-date-error">{errors.dateAdministered}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
            <input 
              type="text" 
              name="administeredBy"
              className="w-full border border-gray-300 rounded px-3 py-2" 
              placeholder="Healthcare provider"
              defaultValue={vaccination?.administeredBy || ''}
              data-testid="vaccination-provider-input"
            />
            {errors.administeredBy && (
              <p className="text-red-600 text-sm mt-1" data-testid="vaccination-provider-error">{errors.administeredBy}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dose</label>
            <input 
              type="text" 
              name="dose"
              className="w-full border border-gray-300 rounded px-3 py-2" 
              placeholder="e.g., 1st dose, 0.5ml"
              defaultValue={vaccination?.doseNumber || ''}
              data-testid="vaccination-dose-input"
            />
            {errors.dose && (
              <p className="text-red-600 text-sm mt-1" data-testid="vaccination-dose-error">{errors.dose}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lot Number</label>
            <input 
              type="text" 
              name="lotNumber"
              className="w-full border border-gray-300 rounded px-3 py-2" 
              placeholder="Vaccine lot number"
              defaultValue={vaccination?.lotNumber || ''}
              data-testid="vaccination-lot-input"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea 
              name="notes"
              className="w-full border border-gray-300 rounded px-3 py-2" 
              rows={3}
              placeholder="Additional notes"
              defaultValue={vaccination?.notes || ''}
              data-testid="vaccination-notes-input"
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <button 
              type="submit" 
              className="btn-primary flex-1"
              data-testid="save-vaccination-btn"
            >
              {vaccination ? 'Update Vaccination' : 'Save Vaccination'}
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