'use client';

/**
 * CalendarWeekView Component
 *
 * Displays appointments in a weekly time grid view.
 */

import React from 'react';
import type { CalendarWeekViewProps } from '../types/calendarTypes';
import {
  getWeekDays,
  generateTimeSlots,
  getAppointmentsByHour,
} from '../utils/calendarUtils';

/**
 * CalendarWeekView Component
 *
 * Renders a weekly calendar with time slots showing appointments
 * throughout the day for each day of the week.
 */
const CalendarWeekView: React.FC<CalendarWeekViewProps> = ({
  currentDate,
  appointments,
  onAppointmentClick,
  onCreateAppointment,
  getAppointmentStatusColor,
}) => {
  const weekDays = getWeekDays(currentDate);
  const timeSlots = generateTimeSlots();

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Week Day Headers */}
      <div className="grid grid-cols-8 border-b border-gray-200">
        <div className="p-4 text-sm font-medium text-gray-700 bg-gray-50"></div>
        {weekDays.map((day) => {
          const isToday = day.toDateString() === new Date().toDateString();

          return (
            <div
              key={day.toISOString()}
              className="p-4 text-sm font-medium text-gray-700 text-center bg-gray-50"
            >
              <div>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div
                className={`
                text-lg mt-1
                ${
                  isToday
                    ? 'bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto'
                    : ''
                }
              `}
              >
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time Grid */}
      <div className="max-h-96 overflow-y-auto">
        {timeSlots.map((time) => {
          const hour = parseInt(time.split(':')[0], 10);

          return (
            <div key={time} className="grid grid-cols-8 border-b border-gray-100">
              <div className="p-2 text-xs text-gray-500 bg-gray-50 border-r border-gray-200">
                {time}
              </div>
              {weekDays.map((day) => {
                const dayAppointments = getAppointmentsByHour(appointments, day, hour);

                return (
                  <div
                    key={`${day.toISOString()}-${time}`}
                    className="p-1 border-r border-gray-200 min-h-[60px] cursor-pointer hover:bg-gray-50"
                    onClick={() => onCreateAppointment?.(day, time)}
                  >
                    {dayAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                          e.stopPropagation();
                          onAppointmentClick?.(appointment);
                        }}
                        className={`
                          text-xs p-1 rounded border mb-1 cursor-pointer hover:shadow-sm
                          ${getAppointmentStatusColor(appointment.status)}
                        `}
                        title={`${appointment.patient.name} - ${appointment.reason}`}
                      >
                        {appointment.patient.name}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarWeekView;
