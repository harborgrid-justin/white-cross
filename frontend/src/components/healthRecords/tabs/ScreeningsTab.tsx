import React from 'react'
import { Plus, Eye, Ear } from 'lucide-react'
import type { Screening } from '@/types/healthRecords'
import type { User } from '@/types'

interface ScreeningsTabProps {
  screenings: Screening[]
  onRecordScreening: () => void
  user?: User | null
}

export const ScreeningsTab: React.FC<ScreeningsTabProps> = ({
  screenings,
  onRecordScreening,
  user
}) => {
  const canModify = user?.role !== 'READ_ONLY' && user?.role !== 'VIEWER'

  // Use the screenings prop passed from parent component (real API data)
  // No mock data - this is CRITICAL for HIPAA compliance
  const displayScreenings = (screenings || []).map(screening => ({
    ...screening,
    icon: screening.type === 'Vision' ? Eye : Ear
  }))

  return (
    <div className="space-y-4" data-testid="screenings-content">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Vision & Hearing Screenings</h3>
        <button
          className="btn-primary flex items-center"
          data-testid="record-screening-button"
          onClick={onRecordScreening}
          disabled={!canModify}
        >
          <Plus className="h-4 w-4 mr-2" />
          Record Screening
        </button>
      </div>

      <div className="space-y-3" data-testid="screenings-table">
        {displayScreenings.length === 0 ? (
          <div className="text-center py-8 text-gray-600" data-testid="no-screenings-message">
            <Eye className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p>No screening records found for this student.</p>
          </div>
        ) : (
          displayScreenings.map((screening) => {
          const Icon = screening.icon
          return (
            <div key={screening.id} className="border border-gray-200 rounded-lg p-4" data-testid="screening-row">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <Icon className={`h-5 w-5 mt-1 ${
                    screening.result === 'Pass' ? 'text-green-600' : 'text-orange-600'
                  }`} />
                  <div>
                    <h4 className="font-semibold">{screening.type}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded ${
                        screening.result === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`} data-testid="screening-result">
                        {screening.result}
                      </span>
                      <span className="text-sm text-gray-600" data-testid="screening-date">
                        {screening.date}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          )
          })
        )}
      </div>
    </div>
  )
}