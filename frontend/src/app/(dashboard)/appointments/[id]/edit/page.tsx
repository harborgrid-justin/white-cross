/**
 * Edit Appointment Page - Nested Dynamic Route
 * 
 * Route: /appointments/[id]/edit
 * Form for editing an existing appointment
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/button';
import { Edit, AlertTriangle } from 'lucide-react';
import { SchedulingForm } from '@/components/features/appointments';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/api';
import { Appointment, appointmentUtils } from '../../data';

export default function EditAppointmentPage() {
  const params = useParams();
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const handleSubmit = async (appointmentData: Partial<Appointment>) => {
    try {
      setSaving(true);
      setError(null);

      await apiClient.put(
        API_ENDPOINTS.APPOINTMENTS.BY_ID(appointmentId),
        appointmentData
      );

      // Redirect back to appointment detail page
      router.push(`/appointments/${appointmentId}`);
    } catch (err: unknown) {
      console.error('Error updating appointment:', err);
      let errorMessage = 'Failed to update appointment';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err && typeof err === 'object') {
        const errorObj = err as Record<string, unknown>;
        errorMessage = (errorObj.message as string) || (errorObj.error as string) || JSON.stringify(err);
      }
      setError(errorMessage);
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/appointments/${appointmentId}`);
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
            {error || 'The appointment you are trying to edit does not exist.'}
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => router.back()} variant="outline">
              Go Back
            </Button>
            <Button onClick={() => router.push('/appointments')}>
              View All Appointments
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!appointmentUtils.canEdit(appointment.status)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Cannot Edit Appointment
          </h3>
          <p className="text-gray-600 mb-4">
            This appointment cannot be edited because its status is &quot;{appointment.status}&quot;.
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => router.push(`/appointments/${appointmentId}`)} variant="outline">
              View Appointment
            </Button>
            <Button onClick={() => router.push('/appointments')}>
              View All Appointments
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Edit Appointment"
        description={`Editing ${appointment.appointmentType} for ${appointment.studentName || 'Student'}`}
        actions={
          <Button onClick={handleCancel} variant="outline" size="sm">
            Cancel
          </Button>
        }
      />

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Edit className="h-5 w-5 mr-2" />
            Appointment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SchedulingForm
            appointment={appointment}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={saving}
            submitLabel="Update Appointment"
            mode="edit"
          />
        </CardContent>
      </Card>

      {/* Current Status Info */}
      <Card>
        <CardHeader>
          <CardTitle>Current Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-medium text-gray-900">{appointment.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Priority</p>
              <p className="font-medium text-gray-900">{appointment.priority}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="font-medium text-gray-900">
                {appointmentUtils.formatDateTime(appointment.scheduledDate, appointment.scheduledTime)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
