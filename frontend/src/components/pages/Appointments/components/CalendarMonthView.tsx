'use client';

/**
 * CalendarMonthView Component
 *
 * Displays appointments in a monthly calendar grid view.
 */

import React from 'react';
import type { CalendarMonthViewProps } from '../types/calendarTypes';

/**
 * CalendarMonthView Component
 *
 * Renders a monthly calendar grid with appointments displayed in each day cell.
 * Supports clicking on dates and appointments.
 */
const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({
  cells,
  highlightWeekends,
  showAppointmentCount,
  onDateSelect,
  onAppointmentClick,
  getAppointmentStatusColor,
}) => {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Week Day Headers */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-4 text-sm font-medium text-gray-700 text-center bg-gray-50"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {cells.map((cell, index) => (
          <div
            key={index}
            onClick={() => onDateSelect(cell.date)}
            className={`
              min-h-[120px] p-2 border-r border-b border-gray-200 cursor-pointer transition-colors
              hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
              ${!cell.isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
              ${cell.isToday ? 'bg-blue-50' : ''}
              ${cell.isSelected ? 'bg-blue-100 ring-2 ring-blue-500' : ''}
              ${
                highlightWeekends &&
                (cell.date.getDay() === 0 || cell.date.getDay() === 6)
                  ? 'bg-orange-50'
                  : ''
              }
            `}
            role="button"
            tabIndex={0}
            aria-label={`${cell.date.toDateString()}, ${cell.appointments.length} appointments`}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onDateSelect(cell.date);
              }
            }}
          >
            {/* Date Number */}
            <div className="flex items-center justify-between mb-2">
              <span
                className={`
                text-sm font-medium
                ${
                  cell.isToday
                    ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center'
                    : ''
                }
              `}
              >
                {cell.date.getDate()}
              </span>

              {showAppointmentCount && cell.appointments.length > 0 && (
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                  {cell.appointments.length}
                </span>
              )}
            </div>

            {/* Appointments */}
            <div className="space-y-1">
              {cell.appointments.slice(0, 3).map((appointment) => (
                <div
                  key={appointment.id}
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                    onAppointmentClick(appointment);
                  }}
                  className={`
                    text-xs p-1 rounded border truncate cursor-pointer hover:shadow-sm
                    ${getAppointmentStatusColor(appointment.status)}
                  `}
                  title={`${appointment.patient.name} - ${appointment.reason}`}
                >
                  <div className="font-medium truncate">
                    {new Date(appointment.dateTime).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="truncate">{appointment.patient.name}</div>
                </div>
              ))}

              {cell.appointments.length > 3 && (
                <div className="text-xs text-gray-500 text-center">
                  +{cell.appointments.length - 3} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarMonthView;
