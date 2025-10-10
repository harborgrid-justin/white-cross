import React, { useState } from 'react'
import { X } from 'lucide-react'

interface AppointmentFormData {
  studentId: string
  appointmentDate: string
  appointmentTime: string
  duration: number
  type: string
  reason: string
  notes: string
  location: string
  recurring: boolean
  frequency: string
  recurringEndDate: string
}

interface AppointmentFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: AppointmentFormData) => void
  loading?: boolean
}

export default function AppointmentFormModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false
}: AppointmentFormModalProps) {
  const [formData, setFormData] = useState<AppointmentFormData>({
    studentId: '',
    appointmentDate: '',
    appointmentTime: '',
    duration: 30,
    type: '',
    reason: '',
    notes: '',
    location: '',
    recurring: false,
    frequency: '',
    recurringEndDate: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!formData.studentId.trim()) newErrors.studentId = 'Student selection is required'
    if (!formData.appointmentDate) newErrors.appointmentDate = 'Date is required'
    if (!formData.appointmentTime) newErrors.appointmentTime = 'Time is required'
    if (!formData.type) newErrors.type = 'Type is required'
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required'
    if (formData.duration <= 0) newErrors.duration = 'Invalid duration'
    if (formData.notes.length > 1000) newErrors.notes = 'Notes are too long (maximum 1000 characters)'
    if (formData.recurring && !formData.recurringEndDate) newErrors.recurringEndDate = 'End date is required for recurring appointments'

    // Validate date is not in the past
    const selectedDate = new Date(formData.appointmentDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selectedDate < today) {
      newErrors.appointmentDate = 'Past date is not allowed'
    }

    // Validate time format
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
    if (formData.appointmentTime && !timeRegex.test(formData.appointmentTime)) {
      newErrors.appointmentTime = 'Invalid time format'
    }

    // Validate business hours (8 AM - 5 PM)
    if (formData.appointmentTime) {
      const [hours] = formData.appointmentTime.split(':').map(Number)
      if (hours < 8 || hours >= 17) {
        newErrors.appointmentTime = 'Appointment must be within business hours (8 AM - 5 PM)'
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
    setErrors({})
  }

  const handleClose = () => {
    onClose()
    setFormData({
      studentId: '',
      appointmentDate: '',
      appointmentTime: '',
      duration: 30,
      type: '',
      reason: '',
      notes: '',
      location: '',
      recurring: false,
      frequency: '',
      recurringEndDate: ''
    })
    setErrors({})
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div data-testid="appointment-form-modal" className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 data-testid="modal-title" className="text-lg font-semibold">
            Schedule Appointment
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
              <select
                name="studentId"
                data-testid="student-select"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a student</option>
                <option value="1">John Doe</option>
                <option value="2">Jane Smith</option>
              </select>
              {errors.studentId && <p data-testid="student-error" className="text-red-600 text-sm mt-1">{errors.studentId}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  name="appointmentDate"
                  data-testid="appointment-date-input"
                  type="date"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.appointmentDate && <p data-testid="date-error" className="text-red-600 text-sm mt-1">{errors.appointmentDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                <input
                  name="appointmentTime"
                  data-testid="appointment-time-input"
                  type="time"
                  value={formData.appointmentTime}
                  onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.appointmentTime && <p data-testid="time-error" className="text-red-600 text-sm mt-1">{errors.appointmentTime}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes) *</label>
                <input
                  name="duration"
                  data-testid="duration-input"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.duration && <p data-testid="duration-error" className="text-red-600 text-sm mt-1">{errors.duration}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  name="location"
                  data-testid="location-select"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select location</option>
                  <option value="nurses_office">Nurse's Office</option>
                  <option value="exam_room_1">Exam Room 1</option>
                  <option value="exam_room_2">Exam Room 2</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                name="type"
                data-testid="type-select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select appointment type</option>
                <option value="ROUTINE_CHECKUP">Routine Checkup</option>
                <option value="MEDICATION_ADMINISTRATION">Medication Administration</option>
                <option value="INJURY_ASSESSMENT">Injury Assessment</option>
                <option value="ILLNESS_EVALUATION">Illness Evaluation</option>
                <option value="FOLLOW_UP">Follow Up</option>
                <option value="SCREENING">Screening</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
              {errors.type && <p data-testid="type-error" className="text-red-600 text-sm mt-1">{errors.type}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
              <input
                name="reason"
                data-testid="reason-input"
                type="text"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Brief description of the appointment purpose"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.reason && <p data-testid="reason-error" className="text-red-600 text-sm mt-1">{errors.reason}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                data-testid="notes-textarea"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                maxLength={1000}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.notes.length}/1000 characters</p>
              {errors.notes && <p data-testid="notes-error" className="text-red-600 text-sm mt-1">{errors.notes}</p>}
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center mb-3">
                <input
                  name="recurring"
                  data-testid="recurring-checkbox"
                  type="checkbox"
                  checked={formData.recurring}
                  onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Recurring Appointment</label>
              </div>

              {formData.recurring && (
                <div className="grid grid-cols-2 gap-4 ml-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                    <select
                      name="frequency"
                      data-testid="frequency-select"
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select frequency</option>
                      <option value="DAILY">Daily</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="BIWEEKLY">Bi-weekly</option>
                      <option value="MONTHLY">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      name="recurringEndDate"
                      data-testid="recurring-end-date-input"
                      type="date"
                      value={formData.recurringEndDate}
                      onChange={(e) => setFormData({ ...formData, recurringEndDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.recurringEndDate && <p data-testid="recurring-end-date-error" className="text-red-600 text-sm mt-1">{errors.recurringEndDate}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              data-testid="cancel-button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="schedule-button"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Scheduling...' : 'Schedule Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
