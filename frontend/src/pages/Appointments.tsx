import React, { useState, useEffect, useCallback } from 'react'
import { Calendar, Clock, Users, Plus, Download, CheckCircle, XCircle, Filter } from 'lucide-react'
import { appointmentsApi } from '../services/api'
import { Appointment } from '../types/api'
import { WaitlistEntry } from '../services/types'
import toast from 'react-hot-toast'
import AppointmentFormModal from '../components/appointments/AppointmentFormModal'
import { useAuthContext } from '../contexts/AuthContext'
import {
  APPOINTMENT_TYPE_OPTIONS,
  APPOINTMENT_STATUS_OPTIONS,
  getAppointmentTypeLabel,
  getStatusBadgeClass,
  getPriorityBadgeClass
} from '../constants/appointmentOptions'
import { usePersistedFilters, usePageState, useSortState } from '@/hooks/useRouteState'

type ViewMode = 'calendar' | 'list' | 'waitlist' | 'availability'

interface AppointmentFilters {
  filterStatus: string
  filterType: string
  dateFrom: string
  dateTo: string
}

type AppointmentSortColumn = 'scheduledAt' | 'type' | 'status' | 'studentName'

export default function Appointments() {
  const { user } = useAuthContext()
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([])
  const [statistics, setStatistics] = useState<{
    total: number
    completionRate: number
    noShowRate: number
    scheduledToday: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showWaitlistModal, setShowWaitlistModal] = useState(false)

  // State persistence hooks
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

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const apiFilters: Record<string, string> = {}
      if (filters.filterStatus !== 'all') apiFilters.status = filters.filterStatus.toUpperCase()
      if (filters.filterType !== 'all') apiFilters.type = filters.filterType.toUpperCase()
      if (filters.dateFrom) apiFilters.dateFrom = filters.dateFrom
      if (filters.dateTo) apiFilters.dateTo = filters.dateTo

      const [appointmentsData, waitlistData, stats] = await Promise.all([
        appointmentsApi.getAll(apiFilters),
        appointmentsApi.getWaitlist({ status: 'WAITING' }),
        appointmentsApi.getStatistics()
      ])

      setAppointments(Array.isArray(appointmentsData.data) ? appointmentsData.data : (appointmentsData as any).appointments || [])
      setWaitlist(Array.isArray(waitlistData.waitlist) ? waitlistData.waitlist : [])
      setStatistics(stats as any || null)
    } catch (error) {
      console.error('Error loading appointments:', error)
      toast.error('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }, [filters.filterStatus, filters.filterType, filters.dateFrom, filters.dateTo])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleCancelAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return

    try {
      await appointmentsApi.cancel(id, 'Cancelled by nurse')
      toast.success('Appointment cancelled successfully')
      loadData()
    } catch (error) {
      console.error('Error cancelling appointment:', error)
    }
  }

  const handleMarkNoShow = async (id: string) => {
    if (!confirm('Mark this appointment as no-show?')) return

    try {
      await appointmentsApi.markNoShow(id)
      toast.success('Appointment marked as no-show')
      loadData()
    } catch (error) {
      console.error('Error marking no-show:', error)
    }
  }

  const handleCreateAppointment = async (data: any) => {
    try {
      await appointmentsApi.create({
        studentId: data.studentId,
        scheduledAt: new Date(`${data.appointmentDate}T${data.appointmentTime}`).toISOString(),
        duration: data.duration,
        type: data.type,
        reason: data.reason,
        notes: data.notes,
        location: data.location || undefined,
        status: 'SCHEDULED'
      })
      toast.success('Appointment scheduled successfully')
      setShowCreateModal(false)
      loadData()
    } catch (error) {
      console.error('Error creating appointment:', error)
      toast.error('Failed to schedule appointment')
    }
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Appointment Scheduling</h1>
          <p className="text-gray-600">Manage nurse availability, student bookings, and automated reminders</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCalendar}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Calendar
          </button>
          <button
            onClick={() => setShowWaitlistModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Add to Waitlist
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Schedule Appointment
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <Calendar className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">{statistics.total || 0}</h3>
            <p className="text-sm text-gray-600">Total Appointments</p>
          </div>

          <div className="card p-6">
            <CheckCircle className="h-8 w-8 text-green-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">
              {statistics.completionRate?.toFixed(1) || 0}%
            </h3>
            <p className="text-sm text-gray-600">Completion Rate</p>
          </div>

          <div className="card p-6">
            <XCircle className="h-8 w-8 text-red-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">
              {statistics.noShowRate?.toFixed(1) || 0}%
            </h3>
            <p className="text-sm text-gray-600">No-Show Rate</p>
          </div>

          <div className="card p-6">
            <Users className="h-8 w-8 text-purple-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">{waitlist.length}</h3>
            <p className="text-sm text-gray-600">On Waitlist</p>
          </div>
        </div>
      )}

      {/* View Mode Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 font-medium ${
            viewMode === 'list'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Appointments List
        </button>
        <button
          onClick={() => setViewMode('waitlist')}
          className={`px-4 py-2 font-medium ${
            viewMode === 'waitlist'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Waitlist ({waitlist.length})
        </button>
        <button
          onClick={() => setViewMode('calendar')}
          className={`px-4 py-2 font-medium ${
            viewMode === 'calendar'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Calendar View
        </button>
        <button
          onClick={() => setViewMode('availability')}
          className={`px-4 py-2 font-medium ${
            viewMode === 'availability'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Availability
        </button>
      </div>

      {/* Filters */}
      {viewMode === 'list' && (
        <div className="card p-4">
          <div className="flex gap-4 items-center">
            <Filter className="h-5 w-5 text-gray-400" />
            <label htmlFor="filterStatus" className="sr-only">Status filter</label>
            <select
              id="filterStatus"
              value={filters.filterStatus}
              onChange={(e) => updateFilter('filterStatus', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {APPOINTMENT_STATUS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <label htmlFor="filterType" className="sr-only">Type filter</label>
            <select
              id="filterType"
              value={filters.filterType}
              onChange={(e) => updateFilter('filterType', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {APPOINTMENT_TYPE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Content based on view mode */}
      {viewMode === 'list' && (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Scheduled
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No appointments found</p>
                    </td>
                  </tr>
                ) : (
                  appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {appointment.student?.firstName} {appointment.student?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{appointment.reason}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {getAppointmentTypeLabel(appointment.type)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(appointment.scheduledAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {appointment.duration} min
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(appointment.status)}`}>
                          {appointment.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          {appointment.status === 'SCHEDULED' && (
                            <>
                              <button
                                onClick={() => handleCancelAppointment(appointment.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleMarkNoShow(appointment.id)}
                                className="text-gray-600 hover:text-gray-800"
                              >
                                No Show
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'waitlist' && (
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Appointment Waitlist</h3>
            {waitlist.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No students on waitlist</p>
              </div>
            ) : (
              <div className="space-y-4">
                {waitlist.map((entry) => (
                  <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {entry.student?.firstName} {entry.student?.lastName}
                        </h4>
                        <p className="text-sm text-gray-600">{getAppointmentTypeLabel(entry.type)}</p>
                        <p className="text-sm text-gray-500 mt-1">{entry.reason}</p>
                        {(entry as any).preferredDate && (
                          <p className="text-xs text-gray-400 mt-1">
                            Preferred: {formatDate((entry as any).preferredDate)}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          getPriorityBadgeClass((entry as any).priority || 'NORMAL')
                        }`}>
                          {(entry as any).priority || 'NORMAL'}
                        </span>
                        <button
                          onClick={() => appointmentsApi.removeFromWaitlist(entry.id).then(loadData)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {viewMode === 'calendar' && (
        <div className="card p-6">
          <div className="text-center py-12 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Calendar view coming soon</p>
            <p className="text-sm mt-2">Use the Export Calendar button to download iCal format</p>
          </div>
        </div>
      )}

      {viewMode === 'availability' && (
        <div className="card p-6">
          <div className="text-center py-12 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Availability management coming soon</p>
            <p className="text-sm mt-2">Configure your working hours and unavailable periods</p>
          </div>
        </div>
      )}

      {/* Appointment Form Modal */}
      <AppointmentFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateAppointment}
      />

      {showWaitlistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Add to Waitlist</h3>
            <p className="text-gray-600 mb-4">
              Waitlist form will be implemented here.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowWaitlistModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}