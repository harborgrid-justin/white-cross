/**
 * Appointment Actions Component
 *
 * Client component for interactive appointment status updates
 * Separated from server component to maintain optimal performance
 */

'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/button';
import { updateAppointment } from '@/lib/actions/appointments.actions';
import { Appointment, appointmentUtils } from '../../data';

interface AppointmentActionsProps {
  appointment: Appointment;
}

export function AppointmentActions({ appointment }: AppointmentActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleStatusUpdate = async (newStatus: Appointment['status']) => {
    setError(null);

    startTransition(async () => {
      try {
        const result = await updateAppointment(appointment.id, { status: newStatus });

        if (!result.success) {
          setError(result.error || 'Failed to update appointment status');
          return;
        }

        // Refresh the page to show updated data
        router.refresh();
      } catch (err) {
        console.error('Error updating appointment status:', err);
        setError('Failed to update appointment status');
      }
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {appointment.status === 'scheduled' && (
            <Button
              onClick={() => handleStatusUpdate('confirmed')}
              className="w-full"
              variant="outline"
              disabled={isPending}
            >
              {isPending ? 'Updating...' : 'Confirm Appointment'}
            </Button>
          )}

          {(appointment.status === 'confirmed' || appointment.status === 'in-progress') && (
            <Button
              onClick={() => handleStatusUpdate('completed')}
              className="w-full"
              variant="primary"
              disabled={isPending}
            >
              {isPending ? 'Updating...' : 'Mark Complete'}
            </Button>
          )}

          {appointmentUtils.canCancel(appointment.status) && (
            <Button
              onClick={() => handleStatusUpdate('cancelled')}
              className="w-full"
              variant="outline"
              disabled={isPending}
            >
              {isPending ? 'Updating...' : 'Cancel Appointment'}
            </Button>
          )}

          {appointment.status === 'confirmed' && (
            <Button
              onClick={() => handleStatusUpdate('no-show')}
              className="w-full"
              variant="outline"
              disabled={isPending}
            >
              {isPending ? 'Updating...' : 'Mark No-Show'}
            </Button>
          )}
        </CardContent>
      </Card>
    </>
  );
}
