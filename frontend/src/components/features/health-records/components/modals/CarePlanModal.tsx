'use client';

/**
 * WF-COMP-018 | CarePlanModal.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: useState, functional component, arrow component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React, { useState } from 'react'
import { X, FileText, Calendar, User } from 'lucide-react'
import type { ChronicCondition } from '@/types/healthRecords'

interface CarePlanModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (carePlan: any) => void
  condition?: ChronicCondition | null
}

export const CarePlanModal: React.FC<CarePlanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  condition
}) => {
  const [formData, setFormData] = useState({
    title: `Care Plan for ${condition?.condition || 'Condition'}`,
    objectives: '',
    interventions: '',
    medications: '',
    monitoringSchedule: '',
    emergencyProcedures: '',
    reviewDate: condition?.nextReviewDate || '',
    assignedStaff: '',
    notes: condition?.carePlan || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      conditionId: condition?.id,
      createdDate: new Date().toISOString(),
      status: 'ACTIVE'
    })
    onClose()
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="care-plan-modal">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Create Care Plan</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            data-testid="close-modal-button"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {condition && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Condition:</strong> {condition.condition}
            </p>
            <p className="text-sm text-blue-700">
              <strong>Severity:</strong> {condition.severity}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Care Plan Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              required
              data-testid="title-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Care Objectives
            </label>
            <textarea
              value={formData.objectives}
              onChange={(e) => handleChange('objectives', e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              rows={3}
              placeholder="Primary objectives and goals for care management"
              data-testid="objectives-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interventions & Treatments
            </label>
            <textarea
              value={formData.interventions}
              onChange={(e) => handleChange('interventions', e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              rows={4}
              placeholder="Specific interventions, treatments, and procedures"
              data-testid="interventions-input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Medications
              </label>
              <textarea
                value={formData.medications}
                onChange={(e) => handleChange('medications', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                rows={3}
                placeholder="List current medications and dosages"
                data-testid="medications-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monitoring Schedule
              </label>
              <textarea
                value={formData.monitoringSchedule}
                onChange={(e) => handleChange('monitoringSchedule', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                rows={3}
                placeholder="Regular monitoring and check-up schedule"
                data-testid="monitoring-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Procedures
            </label>
            <textarea
              value={formData.emergencyProcedures}
              onChange={(e) => handleChange('emergencyProcedures', e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              rows={3}
              placeholder="Emergency response procedures and contacts"
              data-testid="emergency-procedures-input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline h-4 w-4 mr-1" />
                Next Review Date
              </label>
              <input
                type="date"
                value={formData.reviewDate}
                onChange={(e) => handleChange('reviewDate', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                data-testid="review-date-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="inline h-4 w-4 mr-1" />
                Assigned Staff
              </label>
              <input
                type="text"
                value={formData.assignedStaff}
                onChange={(e) => handleChange('assignedStaff', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Primary care coordinator"
                data-testid="assigned-staff-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              rows={3}
              placeholder="Additional notes and considerations"
              data-testid="notes-input"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              data-testid="cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              data-testid="save-care-plan-button"
            >
              Create Care Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
// Default export for dynamic imports
export default CarePlanModal
