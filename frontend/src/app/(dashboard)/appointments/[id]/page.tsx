/**
 * Appointment Detail Page - Dynamic Route
 *
 * Route: /appointments/[id]
 * Shows detailed view of a specific appointment
 *
 * Next.js 16 Best Practices:
 * - Server component with async data fetching
 * - Parallel data preloading with generateMetadata
 * - Proper TypeScript types
 * - notFound() for 404 handling
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Calendar, User, Clock, MapPin, FileText, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { getAppointment } from '@/lib/actions/appointments.actions';
import { Appointment, appointmentUtils } from '../data';
import { AppointmentActions } from './_components/AppointmentActions';

/**
 * Generate metadata for the appointment page
 * This preloads the appointment data for better performance
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const appointment = await getAppointment(id);

  if (!appointment) {
    return {
      title: 'Appointment Not Found | White Cross Healthcare',
    };
  }

  return {
    title: `${appointment.appointmentType} - ${appointment.studentName || 'Student'} | White Cross Healthcare`,
    description: `Appointment details for ${appointment.studentName || 'student'}`,
  };
}

/**
 * Appointment Detail Page Component - Server Component
 *
 * This page demonstrates Next.js 16 best practices:
 * - Async server component for data fetching
 * - Parallel data preloading via generateMetadata
 * - Proper error handling with notFound()
 * - TypeScript types for all props
 */
export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: appointmentId } = await params;
  const appointment = await getAppointment(appointmentId);

  // Handle not found
  if (!appointment) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={`${appointment.appointmentType}`}
        description={`Appointment with ${appointment.studentName || 'Student'}`}
        actions={
          <div className="flex gap-2">
            {appointmentUtils.canEdit(appointment.status) && (
              <Link href={`/appointments/${appointment.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
            )}
            <Link href={`/appointments/${appointment.id}/reschedule`}>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Reschedule
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Date & Time</label>
                  <p className="text-sm text-gray-900">
                    {appointmentUtils.formatDateTime(appointment.scheduledDate, appointment.scheduledTime)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Duration</label>
                  <p className="text-sm text-gray-900">{appointment.duration} minutes</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">
                    <Badge className={appointmentUtils.getStatusClass(appointment.status)}>
                      {appointment.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Priority</label>
                  <div className="mt-1">
                    <Badge className={appointmentUtils.getPriorityClass(appointment.priority)}>
                      {appointment.priority}
                    </Badge>
                  </div>
                </div>
              </div>

              {appointment.reason && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Reason</label>
                  <p className="text-sm text-gray-900 mt-1">{appointment.reason}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Student Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{appointment.studentName}</p>
                  <p className="text-sm text-gray-600">Student ID: {appointment.studentId}</p>
                </div>
                <Link href={`/students/${appointment.studentId}`}>
                  <Button variant="outline" size="sm">View Profile</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Sidebar - Client component for interactive actions */}
        <div className="space-y-6">
          <AppointmentActions appointment={appointment} />

          {appointment.nurseName && (
            <Card>
              <CardHeader>
                <CardTitle>Assigned Nurse</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-gray-900">{appointment.nurseName}</p>
                <p className="text-sm text-gray-600">Nurse ID: {appointment.nurseId}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
