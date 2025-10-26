'use client';

/**
 * @fileoverview Appointment Calendar Component
 * @module components/appointments/AppointmentCalendar
 *
 * FullCalendar-powered interactive calendar for appointment management.
 * Supports drag-and-drop rescheduling, click-to-create, and conflict detection.
 *
 * IMPORTANT: This is a Client Component due to FullCalendar interactivity.
 */

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg, EventDragStopArg } from '@fullcalendar/interaction';
import type { EventChangeArg, EventClickArg, EventContentArg } from '@fullcalendar/core';
import {
  appointmentsToCalendarEvents,
  getDefaultCalendarConfig,
  type CalendarEvent,
} from '@/lib/appointments/calendar';
import { checkConflict } from '@/lib/appointments/conflicts';
import { rescheduleAppointment } from '@/actions/appointments.actions';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// ==========================================
// TYPES
// ==========================================

interface Appointment {
  id: string;
  studentId: string;
  studentName?: string;
  nurseId?: string;
  nurseName?: string;
  appointmentType: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  reason: string;
  notes?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

interface AppointmentCalendarProps {
  /** Initial appointments to display */
  appointments: Appointment[];
  /** Calendar view mode */
  initialView?: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
  /** Enable drag-and-drop rescheduling */
  editable?: boolean;
  /** Enable click-to-create appointments */
  selectable?: boolean;
  /** Working hours configuration */
  workingHours?: {
    start: string;
    end: string;
    daysOfWeek?: number[];
  };
  /** Current user's nurse ID (for conflict checking) */
  nurseId?: string;
  /** Callback when appointment is clicked */
  onEventClick?: (appointmentId: string) => void;
  /** Callback when date is clicked (for creating appointment) */
  onDateClick?: (date: Date, allDay: boolean) => void;
  /** Show weekends */
  showWeekends?: boolean;
}

// ==========================================
// COMPONENT
// ==========================================

export default function AppointmentCalendar({
  appointments,
  initialView = 'timeGridWeek',
  editable = true,
  selectable = true,
  workingHours,
  nurseId,
  onEventClick,
  onDateClick,
  showWeekends = false,
}: AppointmentCalendarProps) {
  const router = useRouter();
  const calendarRef = useRef<FullCalendar>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isRescheduling, setIsRescheduling] = useState(false);

  // Transform appointments to calendar events
  useEffect(() => {
    const calendarEvents = appointmentsToCalendarEvents(appointments);
    setEvents(calendarEvents);
  }, [appointments]);

  /**
   * Handle event click (view appointment details)
   */
  const handleEventClick = useCallback(
    (clickInfo: EventClickArg) => {
      const appointmentId = clickInfo.event.extendedProps.appointmentId;

      if (onEventClick) {
        onEventClick(appointmentId);
      } else {
        // Default behavior: navigate to appointment details
        router.push(`/appointments/${appointmentId}`);
      }
    },
    [onEventClick, router]
  );

  /**
   * Handle date click (create new appointment)
   */
  const handleDateClick = useCallback(
    (clickInfo: DateClickArg) => {
      if (!selectable) return;

      const clickedDate = clickInfo.date;
      const allDay = clickInfo.allDay;

      if (onDateClick) {
        onDateClick(clickedDate, allDay);
      } else {
        // Default behavior: navigate to new appointment with pre-filled date/time
        const dateStr = clickedDate.toISOString().split('T')[0];
        const timeStr = clickedDate.toTimeString().slice(0, 5);
        router.push(`/appointments/new?date=${dateStr}&time=${timeStr}`);
      }
    },
    [selectable, onDateClick, router]
  );

  /**
   * Handle event drag-and-drop (reschedule appointment)
   */
  const handleEventChange = useCallback(
    async (changeInfo: EventChangeArg) => {
      if (!editable || isRescheduling) return;

      setIsRescheduling(true);
      const event = changeInfo.event;
      const appointmentId = event.extendedProps.appointmentId;
      const studentId = event.extendedProps.studentId;
      const duration = event.extendedProps.duration;

      const newStart = event.start;
      if (!newStart) {
        toast.error('Invalid date/time');
        changeInfo.revert();
        setIsRescheduling(false);
        return;
      }

      const newDate = newStart.toISOString().split('T')[0];
      const newTime = newStart.toTimeString().slice(0, 5);

      try {
        // Check for conflicts before rescheduling
        const conflictCheck = await checkConflict({
          appointmentId,
          studentId,
          nurseId,
          scheduledDate: newDate,
          scheduledTime: newTime,
          duration,
        });

        if (conflictCheck.hasConflict) {
          toast.error(conflictCheck.message || 'Scheduling conflict detected');
          changeInfo.revert();
          setIsRescheduling(false);
          return;
        }

        // Reschedule the appointment
        const result = await rescheduleAppointment({
          appointmentId,
          newDate,
          newTime,
          reason: 'Rescheduled via drag-and-drop',
        });

        if (result.success) {
          toast.success('Appointment rescheduled successfully');
          // The calendar will update via revalidation
        } else {
          toast.error(result.error || 'Failed to reschedule appointment');
          changeInfo.revert();
        }
      } catch (error) {
        console.error('Error rescheduling appointment:', error);
        toast.error('Failed to reschedule appointment');
        changeInfo.revert();
      } finally {
        setIsRescheduling(false);
      }
    },
    [editable, isRescheduling, nurseId]
  );

  /**
   * Custom event content renderer
   */
  const renderEventContent = useCallback((eventInfo: EventContentArg) => {
    const { event } = eventInfo;
    const priority = event.extendedProps.priority;

    return (
      <div className="fc-event-main-frame">
        <div className="fc-event-time">{eventInfo.timeText}</div>
        <div className="fc-event-title-container">
          <div className="fc-event-title fc-sticky">
            {priority === 'urgent' && (
              <span className="mr-1 text-red-300" title="Urgent">
                ⚠
              </span>
            )}
            {event.title}
          </div>
        </div>
      </div>
    );
  }, []);

  /**
   * Get business hours configuration
   */
  const businessHours = workingHours
    ? {
        daysOfWeek: workingHours.daysOfWeek || [1, 2, 3, 4, 5],
        startTime: workingHours.start,
        endTime: workingHours.end,
      }
    : {
        daysOfWeek: [1, 2, 3, 4, 5],
        startTime: '08:00',
        endTime: '17:00',
      };

  const calendarConfig = getDefaultCalendarConfig();

  return (
    <div className="appointment-calendar w-full">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={initialView}
        headerToolbar={calendarConfig.headerToolbar}
        events={events}
        editable={editable}
        selectable={selectable}
        selectMirror={calendarConfig.selectMirror}
        dayMaxEvents={calendarConfig.dayMaxEvents}
        weekends={showWeekends}
        allDaySlot={calendarConfig.allDaySlot}
        slotMinTime={calendarConfig.slotMinTime}
        slotMaxTime={calendarConfig.slotMaxTime}
        slotDuration={calendarConfig.slotDuration}
        snapDuration={calendarConfig.snapDuration}
        businessHours={businessHours}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        eventChange={handleEventChange}
        height="auto"
        contentHeight="auto"
        aspectRatio={1.8}
        nowIndicator={true}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short',
        }}
        slotLabelFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short',
        }}
        // Custom styling
        eventClassNames={(arg) => {
          const status = arg.event.extendedProps.status;
          const priority = arg.event.extendedProps.priority;
          return [
            `appointment-status-${status}`,
            priority ? `appointment-priority-${priority}` : '',
          ].filter(Boolean);
        }}
        // Prevent drag outside working hours
        eventConstraint={businessHours}
        // Loading overlay
        loading={(isLoading) => {
          if (isLoading) {
            // Could show a loading overlay
          }
        }}
      />

      {/* Custom CSS for calendar styling */}
      <style jsx global>{`
        .appointment-calendar .fc {
          font-family: inherit;
        }

        .appointment-calendar .fc-event {
          cursor: pointer;
          border-radius: 4px;
          padding: 2px 4px;
        }

        .appointment-calendar .fc-event:hover {
          opacity: 0.9;
        }

        .appointment-calendar .fc-event.appointment-priority-urgent {
          border-width: 2px;
          border-style: solid;
          font-weight: 600;
        }

        .appointment-calendar .fc-daygrid-event {
          white-space: normal;
        }

        .appointment-calendar .fc-timegrid-event {
          border-radius: 4px;
        }

        .appointment-calendar .fc-event-title {
          font-weight: 500;
        }

        .appointment-calendar .fc-event-time {
          font-weight: 600;
          font-size: 0.85em;
        }

        /* Status-specific styles */
        .appointment-calendar .fc-event.appointment-status-scheduled {
          background-color: #3b82f6;
          border-color: #2563eb;
        }

        .appointment-calendar .fc-event.appointment-status-confirmed {
          background-color: #10b981;
          border-color: #059669;
        }

        .appointment-calendar .fc-event.appointment-status-in-progress {
          background-color: #f59e0b;
          border-color: #d97706;
        }

        .appointment-calendar .fc-event.appointment-status-completed {
          background-color: #6b7280;
          border-color: #4b5563;
        }

        .appointment-calendar .fc-event.appointment-status-cancelled {
          background-color: #ef4444;
          border-color: #dc2626;
          opacity: 0.6;
        }

        .appointment-calendar .fc-event.appointment-status-no-show {
          background-color: #f97316;
          border-color: #ea580c;
        }

        /* Highlight current time */
        .appointment-calendar .fc-timegrid-now-indicator-line {
          border-color: #ef4444;
          border-width: 2px;
        }

        /* Business hours styling */
        .appointment-calendar .fc-non-business {
          background-color: #f9fafb;
        }

        /* Loading state */
        .appointment-calendar.fc-loading {
          opacity: 0.6;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

// ==========================================
// USAGE EXAMPLE
// ==========================================

/**
 * Example usage:
 *
 * ```tsx
 * import AppointmentCalendar from '@/components/appointments/AppointmentCalendar';
 *
 * function AppointmentsPage() {
 *   const appointments = await fetchAppointments();
 *
 *   return (
 *     <AppointmentCalendar
 *       appointments={appointments}
 *       initialView="timeGridWeek"
 *       editable={true}
 *       selectable={true}
 *       showWeekends={false}
 *       workingHours={{
 *         start: '08:00',
 *         end: '17:00',
 *         daysOfWeek: [1, 2, 3, 4, 5],
 *       }}
 *       onEventClick={(id) => console.log('Clicked:', id)}
 *       onDateClick={(date) => console.log('Create at:', date)}
 *     />
 *   );
 * }
 * ```
 */
