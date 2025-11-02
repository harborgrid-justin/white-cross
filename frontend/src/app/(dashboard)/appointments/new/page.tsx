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
import { apiClient, API_ENDPOINTS } from '@/lib/api-client';
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
            <Calendar className="h-5 w-5 mr-2" />
            Appointment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
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
          <CardTitle>Scheduling Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start">
              <Clock className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900">Duration Guidelines</p>
                <p>Health checks: 30 min, Medication: 15 min, Injury assessment: 45 min</p>
              </div>
            </div>
            <div className="flex items-start">
              <User className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
              <div>
                <p className="font-medium text-gray-900">Student Selection</p>
                <p>Start typing the student&apos;s name to search and select</p>
              </div>
            </div>
            <div className="flex items-start">
              <Calendar className="h-4 w-4 mr-2 mt-0.5 text-purple-500" />
              <div>
                <p className="font-medium text-gray-900">Availability</p>
                <p>The system will show available time slots based on your schedule</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}


