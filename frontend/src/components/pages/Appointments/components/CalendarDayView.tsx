'use client';

/**
 * CalendarDayView Component
 *
 * Displays appointments in a detailed daily time grid view.
 */

import React from 'react';
import { Video, MapPin, Edit, XCircle } from 'lucide-react';
import type { CalendarDayViewProps } from '../types/calendarTypes';
import { generateTimeSlots, getAppointmentsByHour } from '../utils/calendarUtils';

/**
 * CalendarDayView Component
 *
 * Renders a detailed daily view with time slots and appointment details.
 * Supports editing and deleting appointments.
 */
const CalendarDayView: React.FC<CalendarDayViewProps> = ({
  currentDate,
  appointments,
  editable,
  onAppointmentClick,
  onEditAppointment,
  onDeleteAppointment,
  onCreateAppointment,
  getAppointmentStatusColor,
}) => {
  const timeSlots = generateTimeSlots();

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Day Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">
          {currentDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {appointments.length} {appointments.length === 1 ? 'appointment' : 'appointments'}{' '}
          scheduled
        </p>
      </div>

      {/* Time Slots */}
      <div className="max-h-96 overflow-y-auto">
        {timeSlots.map((time) => {
          const hour = parseInt(time.split(':')[0], 10);
          const hourAppointments = getAppointmentsByHour(appointments, currentDate, hour);

          return (
            <div key={time} className="flex border-b border-gray-100">
              <div className="w-20 p-2 text-xs text-gray-500 bg-gray-50 border-r border-gray-200">
                {time}
              </div>
              <div
                className="flex-1 p-2 min-h-[60px] cursor-pointer hover:bg-gray-50"
                onClick={() => onCreateAppointment?.(currentDate, time)}
              >
                {hourAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                      e.stopPropagation();
                      onAppointmentClick?.(appointment);
                    }}
                    className={`
                      p-3 rounded border mb-2 cursor-pointer hover:shadow-sm
                      ${getAppointmentStatusColor(appointment.status)}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{appointment.patient.name}</div>
                        <div className="text-xs text-gray-600">{appointment.reason}</div>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          {appointment.location.isVirtual ? (
                            <>
                              <Video size={12} className="mr-1" />
                              Virtual
                            </>
                          ) : (
                            <>
                              <MapPin size={12} className="mr-1" />
                              {appointment.location.room}
                            </>
                          )}
                        </div>
                      </div>

                      {editable && (
                        <div className="flex items-center space-x-2 ml-2">
                          <button
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                              e.stopPropagation();
                              onEditAppointment?.(appointment);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600"
                            aria-label="Edit appointment"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                              e.stopPropagation();
                              onDeleteAppointment?.(appointment.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600"
                            aria-label="Delete appointment"
                          >
                            <XCircle size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarDayView;
