/**
 * @fileoverview Appointment List Component
 * @module components/appointments/AppointmentList
 *
 * Server Component that displays a sortable table of appointments.
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

interface AppointmentListProps {
  appointments: Appointment[];
  sortBy?: string;
  order?: 'asc' | 'desc';
}

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
  'no-show': 'bg-orange-100 text-orange-800',
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600',
};

/**
 * AppointmentList - Server Component
 *
 * Displays appointments in a sortable table format.
 */
export function AppointmentList({
  appointments,
  sortBy = 'scheduledDate',
  order = 'desc',
}: AppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No appointments found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date & Time
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Student
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Type
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Priority
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Duration
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {appointments.map((appointment) => {
            const dateObj = new Date(appointment.scheduledDate);
            const formattedDate = dateObj.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <tr key={appointment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formattedDate}
                  </div>
                  <div className="text-sm text-gray-500">
                    {appointment.scheduledTime}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/students/${appointment.studentId}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    {appointment.studentName || `Student ${appointment.studentId.substring(0, 8)}`}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {appointment.appointmentType}
                  </div>
                  {appointment.reason && (
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {appointment.reason}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={statusColors[appointment.status]}>
                    {appointment.status.replace('-', ' ')}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={priorityColors[appointment.priority]}>
                    {appointment.priority}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {appointment.duration} min
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/appointments/${appointment.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </Link>
                    {(appointment.status === 'scheduled' ||
                      appointment.status === 'confirmed') && (
                      <>
                        <span className="text-gray-300">|</span>
                        <Link
                          href={`/appointments/${appointment.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link
                          href={`/appointments/${appointment.id}/cancel`}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </Link>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


