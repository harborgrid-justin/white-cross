import React from 'react'
import { Plus, AlertCircle } from 'lucide-react'
import { getSeverityColor } from '@/utils/healthRecords'
import type { Allergy } from '@/types/healthRecords'
import type { User } from '@/types'

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
  const mockAllergies: Allergy[] = [
    { id: '1', allergen: 'Peanuts', severity: 'LIFE_THREATENING', verified: true, treatment: 'EpiPen Auto-Injector', providerName: 'Dr. Smith' },
    { id: '2', allergen: 'Penicillin', severity: 'SEVERE', verified: true, treatment: 'Alternative antibiotics only', providerName: 'Dr. Johnson' },
    { id: '3', allergen: 'Bee Stings', severity: 'MODERATE', verified: false, treatment: 'Antihistamines', providerName: 'Dr. Williams' },
  ]

  // Check if user has write permissions (not readonly)
  const canModify = user?.role !== 'READ_ONLY'

  return (
    <div className="space-y-4" data-testid="allergies-content">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Student Allergies</h3>
        <button 
          className="btn-primary flex items-center" 
          data-testid="add-allergy-button"
          onClick={onAddAllergy}
          disabled={!canModify}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Allergy
        </button>
      </div>

      <div className="space-y-3" data-testid="allergies-list">
        {mockAllergies.map((allergy) => (
          <div key={allergy.id} className="border border-gray-200 rounded-lg p-4" data-testid="allergy-item">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                <AlertCircle className={`h-5 w-5 mt-1 ${
                  allergy.severity === 'LIFE_THREATENING' ? 'text-red-600' :
                  allergy.severity === 'SEVERE' ? 'text-orange-600' :
                  'text-yellow-600'
                }`} />
                <div>
                  <h4 className="font-semibold" data-testid="allergen-name">{allergy.allergen}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(allergy.severity)}`} data-testid="severity-badge">
                      {allergy.severity}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      allergy.verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`} data-testid="verification-status">
                      {allergy.verified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                  {/* Treatment Details - role-based display */}
                  {allergy.treatment && (
                    <div className="mt-2" data-testid="treatment-details">
                      {user?.role === 'COUNSELOR' ? (
                        <span className="text-sm text-gray-500">[MEDICAL INFO RESTRICTED]</span>
                      ) : (
                        <span className="text-sm text-gray-600">Treatment: {allergy.treatment}</span>
                      )}
                    </div>
                  )}
                  {/* Provider Name - only for medical staff */}
                  {allergy.providerName && user?.role !== 'COUNSELOR' && (
                    <div className="mt-1" data-testid="provider-name">
                      <span className="text-sm text-gray-500">Provider: {allergy.providerName}</span>
                    </div>
                  )}
                </div>
              </div>
              <button 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium" 
                data-testid="edit-allergy-button"
                onClick={() => onEditAllergy(allergy)}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}