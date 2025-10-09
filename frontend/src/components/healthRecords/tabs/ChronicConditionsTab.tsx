import React from 'react'
import { Plus, Heart } from 'lucide-react'
import { getSeverityColor, getStatusColor } from '@/utils/healthRecords'
import type { ChronicCondition } from '@/types/healthRecords'
import type { User } from '@/types'

interface ChronicConditionsTabProps {
  conditions: ChronicCondition[]
  onAddCondition: () => void
  onViewCarePlan: (condition: ChronicCondition) => void
  user?: User | null
}

export const ChronicConditionsTab: React.FC<ChronicConditionsTabProps> = ({
  conditions,
  onAddCondition,
  onViewCarePlan,
  user
}) => {
  const canModify = user?.role !== 'READ_ONLY' && user?.role !== 'VIEWER'
  const mockConditions: ChronicCondition[] = [
    { 
      id: '1', 
      condition: 'Asthma', 
      status: 'ACTIVE', 
      severity: 'MODERATE',
      nextReview: 'Nov 15, 2024'
    },
    { 
      id: '2', 
      condition: 'Type 1 Diabetes', 
      status: 'ACTIVE', 
      severity: 'SEVERE',
      nextReview: 'Dec 1, 2024'
    },
  ]

  return (
    <div className="space-y-4" data-testid="chronic-conditions-content">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Chronic Conditions</h3>
        <button
          className="btn-primary flex items-center"
          data-testid="add-condition-button"
          onClick={onAddCondition}
          disabled={!canModify}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Condition
        </button>
      </div>

      <div className="space-y-3" data-testid="conditions-list">
        {mockConditions.map((condition) => (
          <div key={condition.id} className="border border-gray-200 rounded-lg p-4" data-testid="condition-item">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-purple-600 mt-1" data-testid="condition-icon" />
                <div>
                  <h4 className="font-semibold" data-testid="condition-name">{condition.condition}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(condition.status)}`} data-testid="status-badge">
                      {condition.status === 'ACTIVE' ? 'Active' : condition.status === 'MANAGED' ? 'Managed' : 'Resolved'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(condition.severity)}`} data-testid="severity-indicator">
                      {condition.severity}
                    </span>
                  </div>
                  {condition.diagnosedDate && (
                    <p className="text-sm text-gray-600 mt-1" data-testid="diagnosed-date">
                      Diagnosed: {condition.diagnosedDate}
                    </p>
                  )}
                  {condition.nextReview && (
                    <p className="text-sm text-gray-600 mt-1" data-testid="next-review">
                      Next review: {condition.nextReview}
                    </p>
                  )}
                </div>
              </div>
              <button
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                data-testid="view-care-plan"
                onClick={() => onViewCarePlan(condition)}
              >
                View Care Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}