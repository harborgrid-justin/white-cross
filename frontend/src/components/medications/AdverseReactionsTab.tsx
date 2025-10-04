import { AlertTriangle } from 'lucide-react'
import { LoadingSpinner, EmptyState } from '../shared'
import { useMedicationsData } from '../../hooks/useMedicationsData'
import { getSeverityColor, formatDate } from '../../utils/medications'
import type { AdverseReaction } from '../../types/api'

interface AdverseReactionsTabProps {
  onReactionSelect?: (reaction: AdverseReaction) => void
  className?: string
  testId?: string
}

export const AdverseReactionsTab: React.FC<AdverseReactionsTabProps> = ({
  onReactionSelect,
  className = '',
  testId
}) => {
  const { adverseReactions, isLoading: adverseReactionsLoading } = useMedicationsData()

  if (adverseReactionsLoading) {
    return (
      <LoadingSpinner 
        size="large" 
        message="Loading adverse reactions..." 
        testId="adverse-reactions-loading"
        className="py-12"
      />
    )
  }

  if (!adverseReactions || adverseReactions.length === 0) {
    return (
      <EmptyState
        icon={<AlertTriangle className="h-12 w-12" />}
        title="No adverse reactions recorded"
        description="Adverse reaction reports will appear here"
        testId="adverse-reactions-empty-state"
      />
    )
  }

  // Group by severity for stats
  const severityCount = adverseReactions.reduce((acc, reaction) => {
    acc[reaction.severity] = (acc[reaction.severity] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div data-testid={testId} className={`space-y-6 ${className}`}>
      {/* Severity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{severityCount['LOW'] || 0}</div>
              <div className="text-sm text-gray-600">Low Severity</div>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-400 rounded-full mr-3"></div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{severityCount['MEDIUM'] || 0}</div>
              <div className="text-sm text-gray-600">Medium Severity</div>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-400 rounded-full mr-3"></div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{severityCount['HIGH'] || 0}</div>
              <div className="text-sm text-gray-600">High Severity</div>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-700 rounded-full mr-3"></div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{severityCount['CRITICAL'] || 0}</div>
              <div className="text-sm text-gray-600">Critical</div>
            </div>
          </div>
        </div>
      </div>

      {/* Adverse Reactions Table */}
      <div className="card overflow-hidden">
        <table data-testid="adverse-reactions-table" className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medication
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Occurred
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reported By
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {adverseReactions.map((reaction) => (
              <tr 
                key={reaction.id} 
                data-testid="adverse-reaction-row" 
                className={`hover:bg-gray-50 ${onReactionSelect ? 'cursor-pointer' : ''}`}
                onClick={() => onReactionSelect?.(reaction)}
              >
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {reaction.student?.firstName} {reaction.student?.lastName}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {reaction.medication?.name || 'Unknown Medication'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span 
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(reaction.severity)}`}
                  >
                    {reaction.severity}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {reaction.reaction}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {formatDate(reaction.onset, 'datetime')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {reaction.reportedBy || 'Unknown Reporter'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(reaction.createdAt, 'datetime')}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}