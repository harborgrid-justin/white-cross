'use client';

/**
 * WF-COMP-017 | AllergyModal.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, @/constants/healthRecords
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: functional component, arrow component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React from 'react'
import type { Allergy, AllergyFormErrors } from '@/types/healthRecords'
import { SEVERITY_LEVELS, ALLERGY_TYPES } from '@/constants/healthRecords'

interface AllergyModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (formData: FormData) => void
  allergy?: Allergy | null
  errors?: AllergyFormErrors
  title?: string
}

export const AllergyModal: React.FC<AllergyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  allergy,
  errors = {} as AllergyFormErrors,
  title
}) => {
  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    onSave(formData)
  }

  const modalTitle = title || (allergy ? 'Edit Allergy' : 'Add New Allergy')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid={allergy ? 'edit-allergy-modal' : 'add-allergy-modal'}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4" data-testid="modal-title">{modalTitle}</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Allergen</label>
            <input
              type="text"
              name="allergen"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter allergen"
              defaultValue={allergy?.allergen || ''}
              data-testid="allergen-input"
            />
            {errors.allergen && (
              <p className="text-red-600 text-sm mt-1" data-testid="allergen-error">{errors.allergen}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Allergy Type</label>
            <select
              name="allergyType"
              className="w-full border border-gray-300 rounded px-3 py-2"
              defaultValue={allergy?.allergyType || ''}
              data-testid="allergy-type-select"
            >
              <option value="">Select type</option>
              {ALLERGY_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            {errors.allergyType && (
              <p className="text-red-600 text-sm mt-1" data-testid="allergy-type-error">{errors.allergyType}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
            <select 
              name="severity" 
              className="w-full border border-gray-300 rounded px-3 py-2" 
              defaultValue={allergy?.severity || ''}
              data-testid="severity-select"
            >
              <option value="">Select severity</option>
              {SEVERITY_LEVELS.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
            {errors.severity && (
              <p className="text-red-600 text-sm mt-1" data-testid="severity-error">{errors.severity}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reaction</label>
            <textarea 
              name="reaction"
              className="w-full border border-gray-300 rounded px-3 py-2" 
              rows={3}
              placeholder="Describe allergic reaction"
              defaultValue={typeof allergy?.reactions === 'string' ? allergy.reactions : ''}
              data-testid="reaction-input"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Treatment</label>
            <textarea 
              name="treatment"
              className="w-full border border-gray-300 rounded px-3 py-2" 
              rows={2}
              placeholder="Describe treatment"
              defaultValue={allergy?.treatment || ''}
              data-testid="treatment-input"
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <button 
              type="submit" 
              className="btn-primary flex-1"
              data-testid="save-allergy-button"
            >
              {allergy ? 'Update Allergy' : 'Save Allergy'}
            </button>
            <button 
              type="button" 
              className="btn-secondary flex-1"
              onClick={onClose}
              data-testid="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

AllergyModal.displayName = 'AllergyModal';

// Export both named and default
export default AllergyModal;