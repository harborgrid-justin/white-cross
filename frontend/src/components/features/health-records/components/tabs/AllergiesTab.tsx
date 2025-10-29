'use client';

/**
 * WF-COMP-028 | AllergiesTab.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: lucide-react, @/utils/healthRecords, @/hooks/useHealthRecords
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: useState, functional component, arrow component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React, { useState } from 'react'
import { Plus, AlertCircle, CheckCircle, Shield, AlertTriangle, MapPin } from 'lucide-react'
import { getSeverityColor } from '../../../../../utils/healthRecords'
import { useVerifyAllergy, useDeleteAllergy } from '../../../../../hooks/domains/health'
import type { Allergy } from '../../../../../types/healthRecords'
import type { User } from '../../../../../types'

interface AllergiesTabProps {
  allergies: Allergy[]
  onAddAllergy: () => void
  onEditAllergy: (allergy: Allergy) => void
  user?: User | null
}

export const AllergiesTab: React.FC<AllergiesTabProps> = ({
  allergies,
  onAddAllergy,
  onEditAllergy,
  user
}) => {
  // Use the allergies prop passed from parent component (real API data)
  // No mock data - this is CRITICAL for HIPAA compliance
  const displayAllergies = allergies || []

  // Check if user has write permissions (not readonly)
  const canModify = user?.role !== 'READ_ONLY'

  // Mutation hooks
  const verifyAllergyMutation = useVerifyAllergy()
  const deleteAllergyMutation = useDeleteAllergy()

  // State for modals
  const [verifyingAllergy, setVerifyingAllergy] = useState<Allergy | null>(null)
  const [deletingAllergy, setDeletingAllergy] = useState<Allergy | null>(null)

  const handleAddAllergy = () => {
    if (!canModify) {
      // Show toast message for permission error that tests expect
      const event = new CustomEvent('toast', {
        detail: { message: 'You do not have permission to add allergies', type: 'error' }
      })
      window.dispatchEvent(event)
      return
    }
    onAddAllergy()
  }

  const handleVerifyAllergy = async (allergy: Allergy) => {
    if (!user?.id) return

    try {
      await verifyAllergyMutation.mutateAsync({
        id: allergy.id,
        verifiedBy: user.id
      })
      setVerifyingAllergy(null)
    } catch (error) {
      console.error('Failed to verify allergy:', error)
    }
  }

  const handleDeleteAllergy = async () => {
    if (!deletingAllergy || !deletingAllergy.studentId) return

    try {
      await deleteAllergyMutation.mutateAsync({
        id: deletingAllergy.id,
        studentId: deletingAllergy.studentId
      })
      setDeletingAllergy(null)
    } catch (error) {
      console.error('Failed to delete allergy:', error)
    }
  }

  // Separate life-threatening allergies
  const lifeThreatening = displayAllergies.filter(a => a.severity === 'LIFE_THREATENING')
  const otherAllergies = displayAllergies.filter(a => a.severity !== 'LIFE_THREATENING')

  return (
    <div className="space-y-6" data-testid="allergies-content">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Student Allergies</h3>
        <button
          className="btn-primary flex items-center"
          data-testid="add-allergy-button"
          onClick={handleAddAllergy}
          disabled={!canModify}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Allergy
        </button>
      </div>

      {/* Life-Threatening Allergies - Prominent Display */}
      {lifeThreatening.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4" data-testid="life-threatening-section">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h4 className="text-lg font-bold text-red-900">LIFE-THREATENING ALLERGIES</h4>
          </div>
          <div className="space-y-3">
            {lifeThreatening.map((allergy) => (
              <div key={allergy.id} className="bg-white border-2 border-red-400 rounded-lg p-4" data-testid="allergy-item">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3 flex-1">
                    <AlertCircle className="h-6 w-6 text-red-600 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-bold text-red-900" data-testid="allergen-name">{allergy.allergen}</h4>
                        <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700" data-testid="severity-badge">
                          LIFE-THREATENING
                        </span>
                        {allergy.verified ? (
                          <CheckCircle className="h-5 w-5 text-green-600" aria-label="Verified" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-yellow-600" aria-label="Unverified" />
                        )}
                      </div>

                      {allergy.reactions && (
                        <div className="mb-2">
                          <span className="font-semibold text-red-900">Reaction: </span>
                          <span className="text-gray-800">{typeof allergy.reactions === 'string' ? allergy.reactions : JSON.stringify(allergy.reactions)}</span>
                        </div>
                      )}

                      {allergy.treatment && user?.role !== 'COUNSELOR' && (
                        <div className="mb-2 bg-yellow-50 border border-yellow-200 p-2 rounded" data-testid="treatment-details">
                          <span className="font-semibold text-gray-900">Emergency Treatment: </span>
                          <span className="text-gray-800">{allergy.treatment}</span>
                        </div>
                      )}

                      {allergy.notes && allergy.notes.toLowerCase().includes('epipen') && (
                        <div className="flex items-center gap-2 text-sm text-gray-700 bg-blue-50 p-2 rounded">
                          <MapPin className="h-4 w-4" />
                          <span><strong>Notes:</strong> {allergy.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {canModify && !allergy.verified && (
                      <button
                        className="text-green-600 hover:text-green-700 text-sm font-medium whitespace-nowrap"
                        onClick={() => setVerifyingAllergy(allergy)}
                      >
                        Verify
                      </button>
                    )}
                    {canModify && (
                      <button
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        data-testid="edit-allergy-button"
                        onClick={() => onEditAllergy(allergy)}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Allergies */}
      <div className="space-y-3" data-testid="allergies-list">
        {otherAllergies.length === 0 && lifeThreatening.length === 0 ? (
          <div className="text-center py-8 text-gray-600" data-testid="no-allergies-message">
            <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p>No allergies recorded for this student.</p>
          </div>
        ) : otherAllergies.length > 0 && (
          <>
            <h4 className="font-semibold text-gray-900 mt-4">Other Allergies</h4>
            {otherAllergies.map((allergy) => (
              <div key={allergy.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50" data-testid="allergy-item">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3 flex-1">
                    <AlertCircle className={`h-5 w-5 mt-1 ${
                      allergy.severity === 'SEVERE' ? 'text-orange-600' :
                      allergy.severity === 'MODERATE' ? 'text-yellow-600' :
                      'text-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold" data-testid="allergen-name">{allergy.allergen}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(allergy.severity)}`} data-testid="severity-badge">
                          {allergy.severity}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          allergy.verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`} data-testid="verification-status">
                          {allergy.verified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>

                      {allergy.reactions && (
                        <div className="mt-1 text-sm text-gray-600">
                          <span className="font-medium">Reaction: </span>{typeof allergy.reactions === 'string' ? allergy.reactions : JSON.stringify(allergy.reactions)}
                        </div>
                      )}

                      {allergy.treatment && user?.role !== 'COUNSELOR' && (
                        <div className="mt-1 text-sm text-gray-600" data-testid="treatment-details">
                          <span className="font-medium">Treatment: </span>{allergy.treatment}
                        </div>
                      )}

                      {allergy.diagnosedBy && user?.role !== 'COUNSELOR' && (
                        <div className="mt-1 text-sm text-gray-500" data-testid="provider-name">
                          Provider: {allergy.diagnosedBy}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {canModify && !allergy.verified && (
                      <button
                        className="text-green-600 hover:text-green-700 text-sm font-medium whitespace-nowrap"
                        onClick={() => setVerifyingAllergy(allergy)}
                      >
                        Verify
                      </button>
                    )}
                    {canModify && (
                      <>
                        <button
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          data-testid="edit-allergy-button"
                          onClick={() => onEditAllergy(allergy)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                          onClick={() => setDeletingAllergy(allergy)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Verification Modal */}
      {verifyingAllergy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Verify Allergy</h3>
            <p className="text-gray-700 mb-4">
              Are you sure you want to verify the allergy to <strong>{verifyingAllergy.allergen}</strong>?
              This action confirms that the allergy information has been reviewed and validated by a medical professional.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setVerifyingAllergy(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerifyAllergy(verifyingAllergy)}
                className="btn-primary"
                disabled={verifyAllergyMutation.isPending}
              >
                {verifyAllergyMutation.isPending ? 'Verifying...' : 'Verify Allergy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingAllergy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Delete Allergy</h3>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete the allergy to <strong>{deletingAllergy.allergen}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeletingAllergy(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAllergy}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                disabled={deleteAllergyMutation.isPending}
              >
                {deleteAllergyMutation.isPending ? 'Deleting...' : 'Delete Allergy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold mb-3">Allergy Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold text-gray-900">{displayAllergies.length}</div>
            <div className="text-sm text-gray-600">Total Allergies</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{lifeThreatening.length}</div>
            <div className="text-sm text-gray-600">Life-Threatening</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {displayAllergies.filter(a => a.verified).length}
            </div>
            <div className="text-sm text-gray-600">Verified</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {displayAllergies.filter(a => !a.verified).length}
            </div>
            <div className="text-sm text-gray-600">Unverified</div>
          </div>
        </div>
      </div>
    </div>
  )
}