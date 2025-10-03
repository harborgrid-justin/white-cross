import { Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { LoadingSpinner, EmptyState } from '../shared'
import { useMedicationsData } from '../../hooks/useMedicationsData'
import { formatDate } from '../../utils/medications'
import type { MedicationReminder } from '../../types/medications'

interface RemindersTabProps {
  onReminderSelect?: (reminder: MedicationReminder) => void
  className?: string
  testId?: string
}

export const RemindersTab: React.FC<RemindersTabProps> = ({
  onReminderSelect,
  className = '',
  testId
}) => {
  const { reminders, remindersLoading, markReminderCompleted, markReminderMissed } = useMedicationsData()

  if (remindersLoading) {
    return (
      <LoadingSpinner 
        size="large" 
        message="Loading reminders..." 
        testId="reminders-loading"
        className="py-12"
      />
    )
  }

  if (!reminders || reminders.length === 0) {
    return (
      <EmptyState
        icon={<Clock className="h-12 w-12" />}
        title="No reminders found"
        description="Medication reminders will appear here"
        testId="reminders-empty-state"
      />
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'MISSED':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'PENDING':
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-100'
      case 'MISSED':
        return 'text-red-600 bg-red-100'
      case 'PENDING':
      default:
        return 'text-yellow-600 bg-yellow-100'
    }
  }

  const handleMarkCompleted = async (reminderId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    await markReminderCompleted(reminderId)
  }

  const handleMarkMissed = async (reminderId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    await markReminderMissed(reminderId)
  }

  // Group reminders by status
  const pendingReminders = reminders.filter(r => r.status === 'PENDING')
  const completedReminders = reminders.filter(r => r.status === 'COMPLETED')
  const missedReminders = reminders.filter(r => r.status === 'MISSED')

  return (
    <div data-testid={testId} className={`space-y-6 ${className}`}>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{pendingReminders.length}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{completedReminders.length}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{missedReminders.length}</div>
              <div className="text-sm text-gray-600">Missed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reminders Table */}
      <div className="card overflow-hidden">
        <table data-testid="reminders-table" className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medication
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dosage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Scheduled Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reminders.map((reminder) => (
              <tr 
                key={reminder.id} 
                data-testid="reminder-row" 
                className={`hover:bg-gray-50 ${onReminderSelect ? 'cursor-pointer' : ''}`}
                onClick={() => onReminderSelect?.(reminder)}
              >
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {reminder.studentName}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {reminder.medicationName}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {reminder.dosage}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {formatDate(reminder.scheduledTime, 'datetime')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {getStatusIcon(reminder.status)}
                    <span 
                      className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reminder.status)}`}
                    >
                      {reminder.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {reminder.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => handleMarkCompleted(reminder.id, e)}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                        data-testid="mark-completed-btn"
                      >
                        Complete
                      </button>
                      <button
                        onClick={(e) => handleMarkMissed(reminder.id, e)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                        data-testid="mark-missed-btn"
                      >
                        Missed
                      </button>
                    </div>
                  )}
                  {reminder.status === 'COMPLETED' && reminder.administeredAt && (
                    <div className="text-xs text-gray-500">
                      Administered: {formatDate(reminder.administeredAt, 'datetime')}
                      {reminder.administeredBy && (
                        <div>By: {reminder.administeredBy}</div>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}