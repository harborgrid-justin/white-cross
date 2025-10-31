/**
 * Appointments Page - White Cross Healthcare Platform
 *
 * Features:
 * - View scheduled appointments
 * - Schedule new appointments
 * - Manage appointment calendar
 * - Track appointment history
 */

'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Calendar, List, Repeat, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { AppointmentList, AppointmentCalendar } from '@/components/appointments';
import { getAppointments, getUpcomingAppointments, type Appointment as ServerAppointment } from '@/app/appointments/actions';
import { appointmentUtils, type Appointment } from './data';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Transform server appointment to local appointment format
  const transformServerAppointment = (serverApt: ServerAppointment): Appointment => ({
    id: serverApt.id,
    studentId: serverApt.studentId,
    studentName: `Student ${serverApt.studentId}`, // This would normally come from a student lookup
    appointmentType: serverApt.appointmentType,
    scheduledDate: serverApt.scheduledDate,
    scheduledTime: serverApt.scheduledTime || '09:00', // Default time if not provided
    duration: serverApt.duration || 30,
    status: serverApt.status,
    priority: serverApt.priority || 'medium',
    reason: serverApt.reason,
    nurseId: undefined, // Not in server response
    nurseName: undefined, // Not in server response
  });

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load today's appointments using server actions
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        const todayResult = await getAppointments({
          dateFrom: today,
          dateTo: today
        });

        // Load upcoming appointments (next 7 days)
        const upcomingResult = await getAppointments({
          dateFrom: today,
          dateTo: nextWeek.toISOString().split('T')[0]
        });

        // Transform server appointments to local format
        const todayTransformed = todayResult.appointments.map(transformServerAppointment);
        const upcomingTransformed = upcomingResult.appointments
          .filter(apt => apt.scheduledDate !== today)
          .map(transformServerAppointment);

        setTodayAppointments(todayTransformed);
        setUpcomingAppointments(upcomingTransformed);
        setAppointments([...todayTransformed, ...upcomingTransformed]);

        setLoading(false);
      } catch (err: unknown) {
        console.error('Error loading appointments:', err);
        
        let errorMessage = 'Failed to load appointments';
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (err && typeof err === 'object') {
          const errorObj = err as Record<string, unknown>;
          errorMessage = (errorObj.message as string) || (errorObj.error as string) || JSON.stringify(err);
        }

        setError(errorMessage);
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading appointments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Appointments</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Appointments"
        description="Manage student appointments and scheduling"
        actions={
          <div className="flex gap-2">
            <Link href="/appointments/recurring">
              <Button variant="outline" size="sm">
                <Repeat className="h-4 w-4 mr-2" />
                Recurring
              </Button>
            </Link>
            <Link href="/appointments/new">
              <Button variant="primary" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
            </Link>
          </div>
        }
      />

      {/* View Toggle Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Today&apos;s Appointments ({todayAppointments.length})</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant={viewMode === 'list' ? 'outline' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4 mr-2" />
                List View
              </Button>
              <Button 
                variant={viewMode === 'calendar' ? 'outline' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('calendar')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Calendar View
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'list' ? (
            <AppointmentList appointments={todayAppointments} />
          ) : (
            <div className="h-[600px]">
              <AppointmentCalendar appointments={todayAppointments} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>This Week ({upcomingAppointments.length} upcoming)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingAppointments.slice(0, 6).map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm">{appointment.appointmentType}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${appointmentUtils.getStatusClass(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{appointment.studentName}</p>
                  <p className="text-xs text-gray-500 mb-2">
                    {appointmentUtils.formatDateTime(appointment.scheduledDate, appointment.scheduledTime)}
                  </p>
                  {appointment.reason && (
                    <p className="text-xs text-gray-600 truncate">{appointment.reason}</p>
                  )}
                  <div className="mt-2 flex gap-2">
                    <Link href={`/appointments/${appointment.id}`}>
                      <Button variant="ghost" size="xs">View</Button>
                    </Link>
                    {appointmentUtils.canEdit(appointment.status) && (
                      <Link href={`/appointments/${appointment.id}/edit`}>
                        <Button variant="ghost" size="xs">Edit</Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {upcomingAppointments.length > 6 && (
              <div className="mt-4 text-center">
                <Link href="/appointments">
                  <Button variant="outline" size="sm">
                    View All Appointments ({upcomingAppointments.length})
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
