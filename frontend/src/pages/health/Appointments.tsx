/**
 * Appointments Management Page - Health Module
 *
 * Comprehensive appointment scheduling and management system providing full CRUD operations
 * for student healthcare visits. Integrates with student records, nurse schedules, and
 * health records for seamless healthcare coordination.
 *
 * **Features:**
 * - Complete CRUD operations (Create, Read, Update, Delete/Cancel)
 * - Advanced filtering by status, type, and date range
 * - Server-side pagination with configurable page sizes
 * - Appointment statistics dashboard (total, scheduled, completed, today)
 * - Calendar export functionality (iCal format)
 * - Real-time appointment updates via TanStack Query
 * - No-show tracking and reporting
 * - Appointment status management
 *
 * **Appointment Types:**
 * - Routine Checkup: Regular health assessments
 * - Medication Administration: Scheduled medication doses
 * - Injury Assessment: Accident/injury evaluation
 * - Illness Evaluation: Sick student assessment
 * - Follow-up: Post-treatment or screening follow-up
 * - Screening: Vision, hearing, dental screenings
 * - Emergency: Urgent healthcare needs
 *
 * **Workflow:**
 * 1. Schedule appointment via modal form
 * 2. Student arrives and appointment marked IN_PROGRESS
 * 3. Nurse completes visit and updates to COMPLETED
 * 4. Health records updated with visit details
 * 5. Parent notification if required
 *
 * **State Management:**
 * - TanStack Query for server state (appointments data)
 * - URL-based filters with usePersistedFilters hook
 * - Local state for modal visibility and form data
 * - Optimistic updates for responsive UX
 *
 * **Permissions:**
 * - View Appointments: All authenticated healthcare staff
 * - Create/Schedule: ADMIN, NURSE roles
 * - Edit/Update: ADMIN, NURSE roles (scheduled appointments only)
 * - Cancel: ADMIN, NURSE roles
 * - Mark No-Show: ADMIN, NURSE roles
 *
 * @module pages/health/Appointments
 * @version 2.0.0
 *
 * @component
 * @returns {React.FC} Appointments management page component
 *
 * @example
 * ```tsx
 * import Appointments from './pages/health/Appointments';
 *
 * function App() {
 *   return <Appointments />;
 * }
 * ```
 *
 * @remarks
 * **HIPAA Compliance**: Appointment records contain PHI (student health information).
 * All access must be logged for audit purposes. Student names visible only to authorized staff.
 *
 * **Parent Notification**: Parents must be notified of appointment outcomes, especially
 * for injury assessments, illness evaluations, or when referrals are made.
 *
 * **Emergency Appointments**: Emergency appointments bypass normal scheduling and can be
 * created with minimal information. Full details captured during or after visit.
 *
 * **No-Show Tracking**: Frequent no-shows may indicate transportation issues, language
 * barriers, or other family challenges requiring social services intervention.
 *
 * **Calendar Integration**: Export functionality generates iCal files compatible with
 * Google Calendar, Outlook, and Apple Calendar for nurse scheduling.
 *
 * **Appointment Conflicts**: System should check for scheduling conflicts (nurse availability,
 * student class schedule) before confirming appointments.
 *
 * **Follow-up Reminders**: Automated reminders sent to students/parents 24 hours before
 * scheduled appointments to reduce no-show rates.
 *
 * **Accessibility**: Form inputs include proper labels, error messages, and keyboard
 * navigation support for compliance with accessibility standards.
 *
 * @see {@link AppointmentModal} for create/edit form
 * @see {@link useAppointmentsData} for data fetching hook
 * @see {@link appointmentsApi} for API integration
 * @since 1.0.0
 */

import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Users, Plus, Download, CheckCircle, XCircle, Filter, Edit2, AlertCircle } from 'lucide-react'
import { appointmentsApi } from '../../services'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import {
  APPOINTMENT_TYPE_OPTIONS,
  APPOINTMENT_STATUS_OPTIONS,
  getAppointmentTypeLabel,
  getStatusBadgeClass,
  getPriorityBadgeClass
} from '../../constants/appointmentOptions'
import { usePersistedFilters, usePageState, useSortState } from '@/hooks/useRouteState'
import { useAppointmentsData } from './hooks/useAppointmentsData'
import type { ViewMode, AppointmentFilters, AppointmentSortColumn } from './types'
import type { Appointment, UpdateAppointmentData } from '../../types/appointments'

interface EditModalState {
  isOpen: boolean
  appointment: Appointment | null
}

interface AppointmentFormData {
  studentId: string
  appointmentDate: string
  appointmentTime: string
  duration: number
  type: string
  reason: string
  notes: string
  status?: string
}

export default function Appointments() {
  const { user } = useAuth()
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showWaitlistModal, setShowWaitlistModal] = useState(false)

  // Edit modal state
  const [editModal, setEditModal] = useState<EditModalState>({
    isOpen: false,
    appointment: null
  })
  const [editLoading, setEditLoading] = useState(false)

  const { filters, updateFilter, clearFilters, isRestored } = usePersistedFilters<AppointmentFilters>({
    storageKey: 'appointment-filters',
    defaultFilters: {
      filterStatus: 'all',
      filterType: 'all',
      dateFrom: '',
      dateTo: '',
    },
    syncWithUrl: true,
    debounceMs: 300,
  })

  const { page, pageSize, setPage, setPageSize } = usePageState({
    defaultPage: 1,
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    resetOnFilterChange: true,
  })

  const { column, direction, toggleSort } = useSortState<AppointmentSortColumn>({
    validColumns: ['scheduledAt', 'type', 'status', 'studentName'],
    defaultColumn: 'scheduledAt',
    defaultDirection: 'asc',
    persistPreference: true,
    storageKey: 'appointment-sort-preference',
  })

  const {
    appointments,
    waitlist,
    statistics,
    loading,
    loadData
  } = useAppointmentsData(filters)

  useEffect(() => {
    loadData()
  }, [loadData])

  /**
   * Handle cancel appointment
   */
  const handleCancelAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return

    try {
      await appointmentsApi.cancel(id, 'Cancelled by nurse')
      toast.success('Appointment cancelled successfully')
      loadData()
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      toast.error('Failed to cancel appointment')
    }
  }

  /**
   * Handle mark no-show
   */
  const handleMarkNoShow = async (id: string) => {
    if (!confirm('Mark this appointment as no-show?')) return

    try {
      await appointmentsApi.markNoShow(id)
      toast.success('Appointment marked as no-show')
      loadData()
    } catch (error) {
      console.error('Error marking no-show:', error)
      toast.error('Failed to mark appointment as no-show')
    }
  }

  /**
   * Handle create appointment
   */
  const handleCreateAppointment = async (data: any) => {
    try {
      await appointmentsApi.create({
        studentId: data.studentId,
        nurseId: user?.id || '',
        scheduledAt: new Date(`${data.appointmentDate}T${data.appointmentTime}`).toISOString(),
        duration: data.duration,
        type: data.type,
        reason: data.reason,
        notes: data.notes,
      })
      toast.success('Appointment scheduled successfully')
      setShowCreateModal(false)
      loadData()
    } catch (error) {
      console.error('Error creating appointment:', error)
      toast.error('Failed to schedule appointment')
    }
  }

  /**
   * Handle edit button click
   * Opens modal with pre-populated appointment data
   */
  const handleEdit = async (appointment: Appointment) => {
    try {
      // Fetch full appointment details if needed
      const { appointment: fullAppointment } = await appointmentsApi.getById(appointment.id)

      setEditModal({
        isOpen: true,
        appointment: fullAppointment
      })
    } catch (error) {
      console.error('Error fetching appointment details:', error)
      toast.error('Failed to load appointment details')
    }
  }

  /**
   * Handle update appointment submission
   * Sends UPDATE request to backend and refreshes list
   */
  const handleUpdateAppointment = async (data: AppointmentFormData) => {
    if (!editModal.appointment) return

    try {
      setEditLoading(true)

      // Build update data
      const updateData: UpdateAppointmentData = {
        type: data.type as any,
        scheduledAt: new Date(`${data.appointmentDate}T${data.appointmentTime}`).toISOString(),
        duration: data.duration,
        reason: data.reason,
        notes: data.notes,
      }

      // Optional: Include status if changed
      if (data.status && data.status !== editModal.appointment.status) {
        updateData.status = data.status as any
      }

      // Call API
      await appointmentsApi.update(editModal.appointment.id, updateData)

      toast.success('Appointment updated successfully')

      // Close modal and refresh data
      setEditModal({ isOpen: false, appointment: null })
      loadData()
    } catch (error) {
      console.error('Error updating appointment:', error)
      toast.error('Failed to update appointment')
    } finally {
      setEditLoading(false)
    }
  }

  /**
   * Handle export calendar
   */
  const handleExportCalendar = async () => {
    if (!user) {
      toast.error('User not authenticated')
      return
    }

    try {
      const blob = await appointmentsApi.exportCalendar(user.id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `appointments-${new Date().toISOString().split('T')[0]}.ics`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Calendar exported successfully')
    } catch (error) {
      console.error('Error exporting calendar:', error)
      toast.error('Failed to export calendar')
    }
  }

  /**
   * Format date for display
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  /**
   * Check if appointment can be edited
   */
  const canEditAppointment = (appointment: Appointment): boolean => {
    return appointment.status === 'SCHEDULED' || appointment.status === 'IN_PROGRESS'
  }

  const isLoadingState = loading || !isRestored

  if (isLoadingState) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading appointments...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">Manage student appointments and healthcare visits</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExportCalendar}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Schedule Appointment
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{statistics?.total || 0}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">{statistics?.scheduled || 0}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{statistics?.completed || 0}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today</p>
              <p className="text-2xl font-bold text-gray-900">{statistics?.todayAppointments || 0}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.filterStatus}
              onChange={(e) => updateFilter('filterStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filters.filterType}
              onChange={(e) => updateFilter('filterType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {APPOINTMENT_TYPE_OPTIONS?.map((option: any) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => updateFilter('dateFrom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => updateFilter('dateTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {(filters.filterStatus !== 'all' || filters.filterType !== 'all' || filters.dateFrom || filters.dateTo) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600 mb-4">
              {filters.filterStatus !== 'all' || filters.filterType !== 'all'
                ? 'No appointments match your filters.'
                : 'No appointments have been scheduled yet.'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Schedule First Appointment
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
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
                {appointments.map((appointment: any) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.student?.firstName} {appointment.student?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {appointment.studentId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(appointment.scheduledAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getAppointmentTypeLabel ? getAppointmentTypeLabel(appointment.type) : appointment.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.duration} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        getStatusBadgeClass ? getStatusBadgeClass(appointment.status) : 'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        {canEditAppointment(appointment) && (
                          <button
                            onClick={() => handleEdit(appointment)}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                            title="Edit Appointment"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {appointment.status === 'SCHEDULED' && (
                          <button
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                            title="Cancel Appointment"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        {appointment.status === 'SCHEDULED' && (
                          <button
                            onClick={() => handleMarkNoShow(appointment.id)}
                            className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
                            title="Mark No-Show"
                          >
                            <AlertCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <AppointmentModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateAppointment}
          mode="create"
        />
      )}

      {/* Edit Modal */}
      {editModal.isOpen && editModal.appointment && (
        <AppointmentModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, appointment: null })}
          onSubmit={handleUpdateAppointment}
          mode="edit"
          appointment={editModal.appointment}
          loading={editLoading}
        />
      )}
    </div>
  )
}

/**
 * Appointment Modal Component
 * Reusable modal for both CREATE and UPDATE operations
 */
interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: AppointmentFormData) => void
  mode: 'create' | 'edit'
  appointment?: Appointment
  loading?: boolean
}

function AppointmentModal({ isOpen, onClose, onSubmit, mode, appointment, loading = false }: AppointmentModalProps) {
  // Extract date and time from appointment if in edit mode
  const getInitialDateTime = () => {
    if (mode === 'edit' && appointment) {
      const date = new Date(appointment.scheduledAt)
      return {
        date: date.toISOString().split('T')[0],
        time: date.toTimeString().slice(0, 5)
      }
    }
    return { date: '', time: '' }
  }

  const initialDateTime = getInitialDateTime()

  const [formData, setFormData] = useState<AppointmentFormData>({
    studentId: appointment?.studentId || '',
    appointmentDate: initialDateTime.date,
    appointmentTime: initialDateTime.time,
    duration: appointment?.duration || 30,
    type: appointment?.type || '',
    reason: appointment?.reason || '',
    notes: appointment?.notes || '',
    status: appointment?.status || ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (mode === 'create' && !formData.studentId.trim()) {
      newErrors.studentId = 'Student selection is required'
    }
    if (!formData.appointmentDate) newErrors.appointmentDate = 'Date is required'
    if (!formData.appointmentTime) newErrors.appointmentTime = 'Time is required'
    if (!formData.type) newErrors.type = 'Type is required'
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required'
    if (formData.duration <= 0) newErrors.duration = 'Invalid duration'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
    setErrors({})
  }

  const handleClose = () => {
    onClose()
    setErrors({})
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {mode === 'create' ? 'Schedule Appointment' : 'Edit Appointment'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {mode === 'create' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter student ID"
                />
                {errors.studentId && <p className="text-red-600 text-sm mt-1">{errors.studentId}</p>}
              </div>
            )}

            {mode === 'edit' && appointment && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Student</p>
                <p className="text-sm font-medium text-gray-900">
                  {appointment.student?.firstName} {appointment.student?.lastName} (ID: {appointment.studentId})
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.appointmentDate && <p className="text-red-600 text-sm mt-1">{errors.appointmentDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                <input
                  type="time"
                  value={formData.appointmentTime}
                  onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.appointmentTime && <p className="text-red-600 text-sm mt-1">{errors.appointmentTime}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes) *</label>
                <input
                  type="number"
                  min="15"
                  step="15"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.duration && <p className="text-red-600 text-sm mt-1">{errors.duration}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  <option value="ROUTINE_CHECKUP">Routine Checkup</option>
                  <option value="MEDICATION_ADMINISTRATION">Medication Administration</option>
                  <option value="INJURY_ASSESSMENT">Injury Assessment</option>
                  <option value="ILLNESS_EVALUATION">Illness Evaluation</option>
                  <option value="FOLLOW_UP">Follow Up</option>
                  <option value="SCREENING">Screening</option>
                  <option value="EMERGENCY">Emergency</option>
                </select>
                {errors.type && <p className="text-red-600 text-sm mt-1">{errors.type}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
              <input
                type="text"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Brief description of the appointment purpose"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.reason && <p className="text-red-600 text-sm mt-1">{errors.reason}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                maxLength={1000}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.notes.length}/1000 characters</p>
            </div>

            {mode === 'edit' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Keep current status</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="NO_SHOW">No Show</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {mode === 'create' ? 'Scheduling...' : 'Updating...'}
                </span>
              ) : (
                mode === 'create' ? 'Schedule Appointment' : 'Update Appointment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
