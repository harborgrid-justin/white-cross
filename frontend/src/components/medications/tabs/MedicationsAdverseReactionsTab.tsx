import React from 'react'
import { AlertTriangle } from 'lucide-react'

interface Reaction {
  id: string
  occurredAt: string
  student: {
    firstName: string
    lastName: string
  }
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  actionsTaken: string
  reportedBy: {
    firstName: string
    lastName: string
  }
}

interface AdverseReactionsData {
  reactions?: Reaction[]
}

interface MedicationsAdverseReactionsTabProps {
  data: AdverseReactionsData | undefined
  loading: boolean
}

export default function MedicationsAdverseReactionsTab({ data, loading }: MedicationsAdverseReactionsTabProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading adverse reactions...</p>
      </div>
    )
  }

  if (!data?.reactions || data.reactions.length === 0) {
    return (
      <div className="card p-12 text-center">
        <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No adverse reactions reported</p>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reaction</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action Taken</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported By</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.reactions.map((reaction) => (
            <tr key={reaction.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">
                {new Date(reaction.occurredAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {reaction.student.firstName} {reaction.student.lastName}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  reaction.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                  reaction.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                  reaction.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {reaction.severity}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                {reaction.description}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                {reaction.actionsTaken}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {reaction.reportedBy.firstName} {reaction.reportedBy.lastName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
