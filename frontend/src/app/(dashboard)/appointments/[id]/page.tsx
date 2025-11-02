/**
 * Appointment Detail Page - Dynamic Route
 * 
 * Route: /appointments/[id]
 * Shows detailed view of a specific appointment
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Calendar, User, Clock, MapPin, FileText, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { apiClient, API_ENDPOINTS } from '@/lib/api-client';
import { Appointment, appointmentUtils } from '../data';

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const appointmentId = params.id as string;

  useEffect(() => {
    const loadAppointment = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.get<{ data: Appointment }>(
          API_ENDPOINTS.APPOINTMENTS.BY_ID(appointmentId)
        );

        const appointmentData = response.data || response;
        setAppointment(appointmentData as Appointment);
        setLoading(false);
      } catch (err: unknown) {
        console.error('Error loading appointment:', err);
        let errorMessage = 'Failed to load appointment';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        setLoading(false);
      }
    };

    if (appointmentId) {
      loadAppointment();
    }
  }, [appointmentId]);

  const handleStatusUpdate = async (newStatus: Appointment['status']) => {
    if (!appointment) return;

    try {
      let endpoint = '';
      switch (newStatus) {
        case 'confirmed':
          endpoint = API_ENDPOINTS.APPOINTMENTS.CONFIRM(appointment.id);
          break;
        case 'completed':
          endpoint = API_ENDPOINTS.APPOINTMENTS.COMPLETE(appointment.id);
          break;
        case 'cancelled':
          endpoint = API_ENDPOINTS.APPOINTMENTS.CANCEL(appointment.id);
          break;
        case 'no-show':
          endpoint = API_ENDPOINTS.APPOINTMENTS.NO_SHOW(appointment.id);
          break;
      }

      if (endpoint) {
        await apiClient.post(endpoint, {});
        setAppointment({ ...appointment, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating appointment status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading appointment...</span>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {error ? 'Error Loading Appointment' : 'Appointment Not Found'}
          </h3>
          <p className="text-gray-600 mb-4">
            {error || 'The appointment you are looking for does not exist.'}
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => router.back()} variant="outline">
              Go Back
            </Button>
            <Link href="/appointments">
              <Button>View All Appointments</Button>
            </Link>
          </div>
        </div>
      </div>
    );
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

        {/* Actions Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {appointment.status === 'scheduled' && (
                <Button 
                  onClick={() => handleStatusUpdate('confirmed')} 
                  className="w-full"
                  variant="outline"
                >
                  Confirm Appointment
                </Button>
              )}
              
              {(appointment.status === 'confirmed' || appointment.status === 'in-progress') && (
                <Button 
                  onClick={() => handleStatusUpdate('completed')} 
                  className="w-full"
                  variant="primary"
                >
                  Mark Complete
                </Button>
              )}
              
              {appointmentUtils.canCancel(appointment.status) && (
                <Button 
                  onClick={() => handleStatusUpdate('cancelled')} 
                  className="w-full"
                  variant="outline"
                >
                  Cancel Appointment
                </Button>
              )}
              
              {appointment.status === 'confirmed' && (
                <Button 
                  onClick={() => handleStatusUpdate('no-show')} 
                  className="w-full"
                  variant="outline"
                >
                  Mark No-Show
                </Button>
              )}
            </CardContent>
          </Card>

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
