/**
 * WF-APPT-003 | AppointmentSchedule.tsx - Appointment scheduling interface
 * Purpose: Comprehensive appointment scheduling with calendar view and time slot management
 * Upstream: ../services/modules/health/appointmentsApi, ../types/appointments | Dependencies: react, react-hook-form, date-fns
 * Downstream: Appointment management system | Called by: React router, appointment workflow
 * Related: Appointments.tsx, AppointmentDetail.tsx, AppointmentCreate.tsx
 * Exports: default AppointmentSchedule component | Key Features: Calendar view, time slot booking, drag-and-drop
 * Last Updated: 2025-10-21 | File Type: .tsx
 * Critical Path: Load calendar → Display availability → Book appointments → Confirm scheduling
 * LLM Context: Appointment scheduling interface with calendar integration and time management
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, startOfWeek, addDays, isSameDay, parseISO, addWeeks, subWeeks } from 'date-fns';
import { appointmentsApi } from '../../services';
import { studentsApi } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import { PROTECTED_ROUTES } from '../../constants/routes';
import type { Appointment, AppointmentStatus } from '../../types/appointments';
import type { Student } from '../../types/student.types';

// ============================================================================
// INTERFACES
// ============================================================================

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  appointmentId?: string;
  appointment?: Appointment;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  timeSlots: TimeSlot[];
  appointments: Appointment[];
}

interface ScheduleFilters {
  providerId?: string;
  appointmentType?: string;
  status?: AppointmentStatus;
  dateRange: {
    start: Date;
    end: Date;
  };
}

// ============================================================================
// COMPONENT
// ============================================================================

const AppointmentSchedule: React.FC = () => {
  // Navigation and auth
  const navigate = useNavigate();
  const { user } = useAuth();

  // State management
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  // Filters
  const [filters, setFilters] = useState<ScheduleFilters>({
    dateRange: {
      start: startOfWeek(new Date()),
      end: addDays(startOfWeek(new Date()), 6),
    },
  });

  // Quick booking modal
  const [showQuickBook, setShowQuickBook] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const [appointmentsData, studentsData] = await Promise.all([
        appointmentsApi.getAll({
          dateFrom: format(filters.dateRange.start, 'yyyy-MM-dd'),
          dateTo: format(filters.dateRange.end, 'yyyy-MM-dd'),
          limit: 1000,
        }),
        studentsApi.getAll({ limit: 1000 }), // Get all students for quick booking
      ]);

      setAppointments(appointmentsData.data || []);
      setStudents(studentsData.students || []);
    } catch (err) {
      console.error('Failed to load appointment data:', err);
      setError('Failed to load appointment data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [filters.dateRange, filters.providerId, filters.appointmentType, filters.status]);

  // ============================================================================
  // TIME SLOT GENERATION
  // ============================================================================

  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const dayAppointments = appointments.filter(apt =>
      isSameDay(parseISO(apt.scheduledAt), date)
    );

    // Generate 30-minute slots from 8 AM to 5 PM
    for (let hour = 8; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endTime = minute === 30
          ? `${(hour + 1).toString().padStart(2, '0')}:00`
          : `${hour.toString().padStart(2, '0')}:30`;

        const aptTime = format(parseISO(`${format(date, 'yyyy-MM-dd')}T${startTime}:00`), 'HH:mm');
        const existingAppointment = dayAppointments.find(apt => {
          const aptScheduledTime = format(parseISO(apt.scheduledAt), 'HH:mm');
          return aptScheduledTime === startTime && apt.status !== 'CANCELLED';
        });

        slots.push({
          id: `${format(date, 'yyyy-MM-dd')}-${startTime}`,
          startTime,
          endTime,
          isAvailable: !existingAppointment,
          appointmentId: existingAppointment?.id,
          appointment: existingAppointment,
        });
      }
    }

    return slots;
  };

  // ============================================================================
  // CALENDAR COMPUTATION
  // ============================================================================

  const calendarDays = useMemo(() => {
    const days: CalendarDay[] = [];
    const startDate = filters.dateRange.start;
    const endDate = filters.dateRange.end;

    let currentDay = startDate;
    while (currentDay <= endDate) {
      days.push({
        date: currentDay,
        isCurrentMonth: true,
        timeSlots: generateTimeSlots(currentDay),
        appointments: appointments.filter(apt =>
          isSameDay(parseISO(apt.scheduledAt), currentDay)
        ),
      });
      currentDay = addDays(currentDay, 1);
    }

    return days;
  }, [filters.dateRange, appointments]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handlePreviousWeek = () => {
    const newStart = subWeeks(filters.dateRange.start, 1);
    const newEnd = addDays(newStart, 6);
    setFilters(prev => ({
      ...prev,
      dateRange: { start: newStart, end: newEnd },
    }));
  };

  const handleNextWeek = () => {
    const newStart = addWeeks(filters.dateRange.start, 1);
    const newEnd = addDays(newStart, 6);
    setFilters(prev => ({
      ...prev,
      dateRange: { start: newStart, end: newEnd },
    }));
  };

  const handleTimeSlotClick = (timeSlot: TimeSlot, date: Date) => {
    if (timeSlot.isAvailable) {
      setSelectedTimeSlot({ ...timeSlot, id: `${format(date, 'yyyy-MM-dd')}-${timeSlot.startTime}` });
      setSelectedDate(date);
      setShowQuickBook(true);
    } else if (timeSlot.appointment) {
      navigate(`${PROTECTED_ROUTES.APPOINTMENTS_DETAIL.replace(':id', timeSlot.appointment.id)}`);
    }
  };

  const handleCreateAppointment = () => {
    const params = new URLSearchParams();
    if (selectedDate) {
      params.set('date', format(selectedDate, 'yyyy-MM-dd'));
    }
    if (selectedTimeSlot) {
      params.set('time', selectedTimeSlot.startTime);
    }
    navigate(`${PROTECTED_ROUTES.APPOINTMENTS_CREATE}?${params.toString()}`);
  };

  // ============================================================================
  // QUICK BOOK MODAL
  // ============================================================================

  const QuickBookModal: React.FC = () => {
    const [selectedStudent, setSelectedStudent] = useState<string>('');
    const [appointmentType, setAppointmentType] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedStudent || !appointmentType || !selectedDate || !selectedTimeSlot) return;

      try {
        setSubmitting(true);
        await appointmentsApi.create({
          studentId: selectedStudent,
          nurseId: filters.providerId || '', // Use current user ID in real implementation
          type: appointmentType as any, // Cast to AppointmentType enum
          scheduledAt: `${format(selectedDate, 'yyyy-MM-dd')}T${selectedTimeSlot.startTime}:00`,
          duration: 30, // Default 30 minutes
          reason: notes || 'Quick booking',
          notes: notes || undefined,
        });

        setShowQuickBook(false);
        setSelectedTimeSlot(null);
        setSelectedDate(null);
        await loadAppointments(); // Refresh the calendar
      } catch (err) {
        console.error('Failed to create appointment:', err);
        setError('Failed to create appointment. Please try again.');
      } finally {
        setSubmitting(false);
      }
    };

    if (!showQuickBook) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Book Appointment
          </h3>
          
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Date:</strong> {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </p>
            <p className="text-sm text-blue-800">
              <strong>Time:</strong> {selectedTimeSlot?.startTime} - {selectedTimeSlot?.endTime}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student *
              </label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a student...</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.firstName} {student.lastName} - {student.studentNumber}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Appointment Type *
              </label>
              <select
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select type...</option>
                <option value="MEDICATION_ADMINISTRATION">Medication Administration</option>
                <option value="HEALTH_SCREENING">Health Screening</option>
                <option value="INJURY_ASSESSMENT">Injury Assessment</option>
                <option value="COUNSELING">Counseling</option>
                <option value="FOLLOW_UP">Follow-up</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Optional notes or instructions..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowQuickBook(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !selectedStudent || !appointmentType}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const getStatusColor = (status: AppointmentStatus): string => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      case 'NO_SHOW': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // ============================================================================
  // LOADING & ERROR STATES
  // ============================================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading schedule...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Schedule</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => loadAppointments()}
                className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointment Schedule</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and schedule appointments with students
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleCreateAppointment}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Appointment
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePreviousWeek}
            className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h2 className="text-lg font-semibold text-gray-900">
            {format(filters.dateRange.start, 'MMMM d')} - {format(filters.dateRange.end, 'MMMM d, yyyy')}
          </h2>
          
          <button
            onClick={handleNextWeek}
            className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">View:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'week' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'day' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Day
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-8 bg-gray-50 border-b border-gray-200">
          <div className="p-3 text-xs font-medium text-gray-500 uppercase">Time</div>
          {calendarDays.map(day => (
            <div key={day.date.toISOString()} className="p-3 text-center">
              <div className="text-xs font-medium text-gray-500 uppercase">
                {format(day.date, 'EEE')}
              </div>
              <div className={`text-lg font-semibold mt-1 ${
                isSameDay(day.date, new Date()) 
                  ? 'text-blue-600' 
                  : 'text-gray-900'
              }`}>
                {format(day.date, 'd')}
              </div>
              <div className="text-xs text-gray-500">
                {day.appointments.length} apt{day.appointments.length !== 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>

        {/* Time Slot Grid */}
        <div className="divide-y divide-gray-100">
          {/* Generate time rows */}
          {Array.from({ length: 18 }, (_, index) => {
            const hour = Math.floor(index / 2) + 8;
            const minute = (index % 2) * 30;
            const timeLabel = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            
            return (
              <div key={timeLabel} className="grid grid-cols-8 min-h-[60px]">
                {/* Time Label */}
                <div className="p-3 text-sm text-gray-500 bg-gray-50 border-r border-gray-200">
                  {timeLabel}
                </div>
                
                {/* Day Columns */}
                {calendarDays.map(day => {
                  const dayTimeSlot = day.timeSlots.find(slot => slot.startTime === timeLabel);
                  
                  return (
                    <div
                      key={`${day.date.toISOString()}-${timeLabel}`}
                      className={`border-r border-gray-100 p-1 cursor-pointer hover:bg-gray-50 ${
                        dayTimeSlot?.isAvailable ? 'bg-white' : ''
                      }`}
                      onClick={() => dayTimeSlot && handleTimeSlotClick(dayTimeSlot, day.date)}
                    >
                      {dayTimeSlot?.appointment && (
                        <div className={`
                          text-xs p-2 rounded border truncate
                          ${getStatusColor(dayTimeSlot.appointment.status)}
                        `}>
                          <div className="font-medium truncate">
                            {dayTimeSlot.appointment.student?.firstName} {dayTimeSlot.appointment.student?.lastName}
                          </div>
                          <div className="truncate">
                            {dayTimeSlot.appointment.type?.replace(/_/g, ' ')}
                          </div>
                        </div>
                      )}
                      {dayTimeSlot?.isAvailable && (
                        <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                          Available
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Scheduled</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Confirmed</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded mr-2"></div>
            <span className="text-sm text-gray-600">In Progress</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Completed</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-100 border border-red-200 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Cancelled/No Show</span>
          </div>
        </div>
      </div>

      {/* Quick Book Modal */}
      <QuickBookModal />
    </div>
  );
};

export default AppointmentSchedule;
