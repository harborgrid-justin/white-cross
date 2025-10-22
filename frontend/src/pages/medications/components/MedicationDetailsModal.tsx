/**
 * WF-COMP-049 | MedicationDetailsModal.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React from 'react'
import { X } from 'lucide-react'

interface Medication {
  id: string
  name: string
  genericName?: string
  dosageForm: string
  strength: string
  manufacturer?: string
  isControlled: boolean
  _count?: {
    studentMedications?: number
  }
}

interface MedicationDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  medication: Medication | null
}

export default function MedicationDetailsModal({
  isOpen,
  onClose,
  medication
}: MedicationDetailsModalProps) {
  if (!isOpen || !medication) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div data-testid="medication-details-modal" className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 data-testid="medication-details-title" className="text-lg font-semibold">
            {medication.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand Name</label>
              <p className="text-sm text-gray-900">{medication.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Generic Name</label>
              <p className="text-sm text-gray-900">{medication.genericName || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Dosage Form</label>
              <p className="text-sm text-gray-900">{medication.dosageForm}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Strength</label>
              <p className="text-sm text-gray-900">{medication.strength}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                medication.isControlled
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {medication.isControlled ? 'Controlled' : 'Standard'}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Active Prescriptions</label>
              <p className="text-sm text-gray-900">{medication._count?.studentMedications || 0}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}



