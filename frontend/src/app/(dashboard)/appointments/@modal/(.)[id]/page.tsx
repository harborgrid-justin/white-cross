import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Modal } from '@/components/ui/modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { API_ENDPOINTS } from '@/lib/api-client';

interface ModalAppointmentPageProps {
  params: { id: string };
}

interface AppointmentData {
  id: string;
  studentId: string;
  studentName?: string;
  nurseId?: string;
  nurseName?: string;
  appointmentType: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  reason: string;
  notes?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Fetch appointment details for modal
 */
async function fetchAppointmentDetails(id: string): Promise<AppointmentData | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const url = `${baseUrl}${API_ENDPOINTS.APPOINTMENTS.BY_ID(id)}`;
  
  try {
    const response = await fetch(url, {
      next: {
        revalidate: 300, // Cache for 5 minutes
        tags: ['appointments', `appointment-${id}`],
      },
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.API_KEY && { 'x-api-key': process.env.API_KEY }),
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch appointment: ${response.status}`);
    }

    const appointment = await response.json();
    return {
      ...appointment,
      reason: appointment.reason || 'No reason provided',
    };

  } catch (error) {
    console.error('Error fetching appointment details:', error);
    return null;
  }
}

function AppointmentDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
      
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-5 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: AppointmentData['status'] }) {
  const statusConfig = {
    scheduled: { color: 'bg-blue-100 text-blue-800', label: 'Scheduled' },
    confirmed: { color: 'bg-green-100 text-green-800', label: 'Confirmed' },
    'in-progress': { color: 'bg-yellow-100 text-yellow-800', label: 'In Progress' },
    completed: { color: 'bg-gray-100 text-gray-800', label: 'Completed' },
    cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    'no-show': { color: 'bg-orange-100 text-orange-800', label: 'No Show' },
  };

  const config = statusConfig[status];
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority?: AppointmentData['priority'] }) {
  if (!priority) return null;

  const priorityConfig = {
    low: { color: 'bg-gray-100 text-gray-800', label: 'Low' },
    medium: { color: 'bg-blue-100 text-blue-800', label: 'Medium' },
    high: { color: 'bg-yellow-100 text-yellow-800', label: 'High' },
    urgent: { color: 'bg-red-100 text-red-800', label: 'Urgent' },
  };

  const config = priorityConfig[priority];
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
}

export default async function ModalAppointmentPage({ params }: ModalAppointmentPageProps) {
  // Validate the id parameter
  if (!params.id || params.id === 'undefined') {
    console.error('[ModalAppointmentPage] Invalid appointment ID:', params.id);
    notFound();
  }

  const appointment = await fetchAppointmentDetails(params.id);

  if (!appointment) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Modal defaultOpen>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Appointment Details</CardTitle>
            <div className="flex gap-2">
              <StatusBadge status={appointment.status} />
              <PriorityBadge priority={appointment.priority} />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Suspense fallback={<AppointmentDetailsSkeleton />}>
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Student</label>
                  <p className="text-base font-medium text-gray-900">
                    {appointment.studentName || 'Unknown Student'}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Provider</label>
                  <p className="text-base font-medium text-gray-900">
                    {appointment.nurseName || 'Unassigned'}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Type</label>
                  <p className="text-base text-gray-900">{appointment.appointmentType}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Duration</label>
                  <p className="text-base text-gray-900">{appointment.duration} minutes</p>
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Date</label>
                  <p className="text-base text-gray-900">
                    {formatDate(appointment.scheduledDate)}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Time</label>
                  <p className="text-base text-gray-900">
                    {formatTime(appointment.scheduledTime)}
                  </p>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="text-sm font-medium text-gray-600">Reason</label>
                <p className="text-base text-gray-900">{appointment.reason}</p>
              </div>

              {/* Notes */}
              {appointment.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Notes</label>
                  <p className="text-base text-gray-900">{appointment.notes}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                {appointment.createdAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Created</label>
                    <p className="text-sm text-gray-700">
                      {new Date(appointment.createdAt).toLocaleString()}
                    </p>
                  </div>
                )}
                
                {appointment.updatedAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Last Updated</label>
                    <p className="text-sm text-gray-700">
                      {new Date(appointment.updatedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <a
                  href={`/appointments/${appointment.id}/edit`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  Edit Appointment
                </a>
                
                <a
                  href={`/appointments/${appointment.id}`}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                >
                  Full Details
                </a>
                
                <button
                  type="button"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  onClick={() => {
                    if ('navigator' in window && 'share' in navigator) {
                      navigator.share({
                        title: `Appointment with ${appointment.studentName}`,
                        text: `${appointment.appointmentType} appointment on ${formatDate(appointment.scheduledDate)} at ${formatTime(appointment.scheduledTime)}`,
                      });
                    }
                  }}
                >
                  Share
                </button>
              </div>
            </div>
          </Suspense>
        </CardContent>
      </Card>
    </Modal>
  );
}
