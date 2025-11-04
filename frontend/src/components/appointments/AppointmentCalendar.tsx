'use client';

/**
 * AppointmentCalendar Component
 *
 * Interactive calendar for scheduling and viewing appointments.
 * Supports drag-and-drop, time slots, and appointment management.
 *
 * @module components/appointments/AppointmentCalendar
 */

import React, { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// ============================================================================
// TYPES
// ============================================================================

export interface Appointment {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  studentId?: string;
  studentName?: string;
  location?: string;
  type: 'checkup' | 'medication' | 'consultation' | 'emergency' | 'followup';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface AppointmentCalendarProps {
  appointments?: Appointment[];
  onAppointmentClick?: (appointment: Appointment) => void;
  onDateClick?: (date: Date) => void;
  selectedDate?: Date;
  view?: 'month' | 'week' | 'day';
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * AppointmentCalendar component for scheduling and viewing appointments
 */
export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments = [],
  onAppointmentClick,
  onDateClick,
  selectedDate = new Date(),
  view = 'month',
  className = ''
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate);

  // Get days in current month
  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  // Get appointments for a specific day
  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(apt =>
      isSameDay(apt.startTime, date)
    );
  };

  // Navigate to previous/next month
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev =>
      direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1)
    );
  };

  // Get status color
  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get type color
  const getTypeColor = (type: Appointment['type']) => {
    switch (type) {
      case 'checkup': return 'bg-blue-500';
      case 'medication': return 'bg-green-500';
      case 'consultation': return 'bg-purple-500';
      case 'emergency': return 'bg-red-500';
      case 'followup': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (view === 'month') {
    return (
      <Card className={`p-6 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center font-medium text-gray-500 text-sm">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {daysInMonth.map(day => {
            const dayAppointments = getAppointmentsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                className={`
                  min-h-[100px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50
                  ${!isCurrentMonth ? 'text-gray-400 bg-gray-50' : ''}
                  ${isToday ? 'bg-blue-50 border-blue-300' : ''}
                `}
                onClick={() => onDateClick?.(day)}
              >
                <div className="text-sm font-medium mb-1">
                  {format(day, 'd')}
                </div>

                {/* Appointments for this day */}
                <div className="space-y-1">
                  {dayAppointments.slice(0, 3).map(apt => (
                    <div
                      key={apt.id}
                      className={`
                        text-xs p-1 rounded cursor-pointer hover:opacity-80
                        ${getStatusColor(apt.status)}
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAppointmentClick?.(apt);
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-2 h-2 rounded-full ${getTypeColor(apt.type)}`}
                        />
                        <span className="truncate">{apt.title}</span>
                      </div>
                      <div className="text-xs opacity-75">
                        {format(apt.startTime, 'HH:mm')}
                      </div>
                    </div>
                  ))}

                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{dayAppointments.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  }

  // Placeholder for other views
  return (
    <Card className={`p-6 ${className}`}>
      <div className="text-center py-12">
        <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {view.charAt(0).toUpperCase() + view.slice(1)} View
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {view === 'week' ? 'Weekly calendar view coming soon' : 'Daily calendar view coming soon'}
        </p>
      </div>
    </Card>
  );
};

export default AppointmentCalendar;