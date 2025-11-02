/**
 * @fileoverview Appointment Card Component
 * @module components/appointments/AppointmentCard
 *
 * Server Component that displays a compact appointment card.
 */

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface Appointment {
  id: string;
  studentId: string;
  studentName?: string;
  appointmentType: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reason?: string;
  nurseId?: string;
  nurseName?: string;
}

interface AppointmentCardProps {
  appointment: Appointment;
}

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  'in-progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  completed: 'bg-gray-100 text-gray-800 border-gray-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  'no-show': 'bg-orange-100 text-orange-800 border-orange-200',
};

const priorityBadgeColors = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600',
};

/**
 * AppointmentCard - Server Component
 *
 * Displays a compact card view of an appointment with quick actions.
 */
export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const dateObj = new Date(appointment.scheduledDate);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className={`bg-white border-l-4 ${statusColors[appointment.status]} rounded-lg shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <Link
              href={`/appointments/${appointment.id}`}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600"
            >
              {appointment.appointmentType}
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={statusColors[appointment.status]}>
                {appointment.status.replace('-', ' ')}
              </Badge>
              {appointment.priority !== 'low' && (
                <Badge className={priorityBadgeColors[appointment.priority]}>
                  {appointment.priority}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Student Info */}
        <div className="mb-3">
          <div className="text-sm text-gray-600">Student</div>
          <Link
            href={`/students/${appointment.studentId}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            {appointment.studentName || `Student ${appointment.studentId.substring(0, 8)}`}
          </Link>
        </div>

        {/* Date & Time */}
        <div className="mb-3">
          <div className="flex items-center text-sm text-gray-700">
            <svg
              className="h-4 w-4 mr-2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {formattedDate} at {appointment.scheduledTime}
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <svg
              className="h-4 w-4 mr-2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {appointment.duration} minutes
          </div>
        </div>

        {/* Reason */}
        {appointment.reason && (
          <div className="mb-3">
            <div className="text-sm text-gray-600">Reason</div>
            <p className="text-sm text-gray-700 line-clamp-2">
              {appointment.reason}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-200">
          <Link
            href={`/appointments/${appointment.id}`}
            className="flex-1 text-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
          >
            View Details
          </Link>
          {(appointment.status === 'scheduled' ||
            appointment.status === 'confirmed') && (
            <Link
              href={`/appointments/${appointment.id}/edit`}
              className="flex-1 text-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100"
            >
              Edit
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}


