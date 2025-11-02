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
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
        <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-muted-foreground">Loading appointment...</span>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px] p-4">
        <div className="text-center">
          <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 text-destructive mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
            {error ? 'Error Loading Appointment' : 'Appointment Not Found'}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            {error || 'The appointment you are trying to edit does not exist.'}
          </p>
          <div className="flex flex-col xs:flex-row gap-2 justify-center">
            <Button onClick={() => router.back()} variant="outline" size="sm">
              Go Back
            </Button>
            <Button onClick={() => router.push('/appointments')} size="sm">
              View All Appointments
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!appointmentUtils.canEdit(appointment.status)) {
    return (
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px] p-4">
        <div className="text-center">
          <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 text-warning mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
            Cannot Edit Appointment
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            This appointment cannot be edited because its status is &quot;{appointment.status}&quot;.
          </p>
          <div className="flex flex-col xs:flex-row gap-2 justify-center">
            <Button onClick={() => router.push(`/appointments/${appointmentId}`)} variant="outline" size="sm">
              View Appointment
            </Button>
            <Button onClick={() => router.push('/appointments')} size="sm">
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
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive mr-2 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-destructive">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base sm:text-lg">
            <Edit className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
            Appointment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
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
          <CardTitle className="text-base sm:text-lg">Current Status</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <p className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground">Status</p>
              <p className="text-xs sm:text-sm font-medium text-foreground">{appointment.status}</p>
            </div>
            <div>
              <p className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground">Priority</p>
              <p className="text-xs sm:text-sm font-medium text-foreground">{appointment.priority}</p>
            </div>
            <div className="xs:col-span-2 lg:col-span-1">
              <p className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground">Last Updated</p>
              <p className="text-xs sm:text-sm font-medium text-foreground">
                {appointmentUtils.formatDateTime(appointment.scheduledDate, appointment.scheduledTime)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
