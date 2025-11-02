'use client';

/**
 * WF-COMP-030 | ChronicConditionsTab.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, lucide-react, @/utils/healthRecords
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: functional component, arrow component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React from 'react'
import { Plus, Heart } from 'lucide-react'
import { getConditionSeverityColor, getStatusColor } from '@/utils/healthRecords'
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
  const canModify = user?.role !== 'READ_ONLY'

  // Use the conditions prop passed from parent component (real API data)
  // No mock data - this is CRITICAL for HIPAA compliance
  const displayConditions = conditions || []

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
        {displayConditions.length === 0 ? (
          <div className="text-center py-8 text-gray-600" data-testid="no-conditions-message">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p>No chronic conditions recorded for this student.</p>
          </div>
        ) : (
          displayConditions.map((condition) => (
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
                    <span className={`text-xs px-2 py-1 rounded ${getConditionSeverityColor(condition.severity)}`} data-testid="severity-indicator">
                      {condition.severity}
                    </span>
                  </div>
                  {condition.diagnosisDate && (
                    <p className="text-sm text-gray-600 mt-1" data-testid="diagnosed-date">
                      Diagnosed: {condition.diagnosisDate}
                    </p>
                  )}
                  {condition.nextReviewDate && (
                    <p className="text-sm text-gray-600 mt-1" data-testid="next-review">
                      Next review: {condition.nextReviewDate}
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
          ))
        )}
      </div>
    </div>
  )
}