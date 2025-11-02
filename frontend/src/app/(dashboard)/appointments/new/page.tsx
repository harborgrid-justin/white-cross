/**
 * New Appointment Page
 * 
 * Route: /appointments/new
 * Form for creating a new appointment
 */

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, AlertTriangle } from 'lucide-react';
import { SchedulingForm } from '@/components/features/appointments';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/api';
import { Appointment, defaultAppointment, appointmentTypes } from '../data';

export default function NewAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill with student ID if provided in query params
  const preselectedStudentId = searchParams.get('studentId');

  const handleSubmit = async (appointmentData: Partial<Appointment>) => {
    try {
      setSaving(true);
      setError(null);

      const response = await apiClient.post<{ data: Appointment }>(
        API_ENDPOINTS.APPOINTMENTS.BASE,
        appointmentData
      );

      const newAppointment = response.data || response;
      
      // Redirect to the new appointment's detail page
      router.push(`/appointments/${(newAppointment as Appointment).id}`);
    } catch (err: unknown) {
      console.error('Error creating appointment:', err);
      let errorMessage = 'Failed to create appointment';
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
    router.back();
  };

  return (
    <>
      <PageHeader
        title="Schedule New Appointment"
        description="Create a new appointment for a student"
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
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
            Appointment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <SchedulingForm
            initialData={{
              ...defaultAppointment,
              ...(preselectedStudentId && { studentId: preselectedStudentId }),
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={saving}
            submitLabel="Schedule Appointment"
          />
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Scheduling Tips</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-3 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-foreground text-xs sm:text-sm">Duration Guidelines</p>
                <p className="text-[10px] xs:text-xs sm:text-sm">Health checks: 30 min, Medication: 15 min, Injury assessment: 45 min</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <User className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-foreground text-xs sm:text-sm">Student Selection</p>
                <p className="text-[10px] xs:text-xs sm:text-sm">Start typing the student&apos;s name to search and select</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-foreground text-xs sm:text-sm">Availability</p>
                <p className="text-[10px] xs:text-xs sm:text-sm">The system will show available time slots based on your schedule</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
