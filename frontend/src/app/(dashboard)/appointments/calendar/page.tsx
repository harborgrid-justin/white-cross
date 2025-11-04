import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Container } from '@/components/layouts/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LazyAppointmentCalendar, CalendarSkeleton } from '@/components/lazy';
import { Skeleton } from '@/components/ui/skeleton';
import { API_ENDPOINTS } from '@/constants/api';
import { revalidateTag, unstable_cache } from 'next/cache';

interface CalendarPageProps {
  searchParams: {
    view?: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
    date?: string;
    status?: string;
    provider?: string;
  };
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
  reason: string; // Make required to fix type issues
  notes?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

interface FetchError extends Error {
  statusCode?: number;
  details?: unknown;
}

/**
 * Fetch appointments with Next.js enhanced fetch API
 * - Includes caching, revalidation, and error handling
 * - Uses tags for targeted cache invalidation
 */
async function fetchAppointments(): Promise<AppointmentData[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const url = `${baseUrl}${API_ENDPOINTS.APPOINTMENTS.BASE}`;
  
  try {
    const response = await fetch(url, {
      // Next.js fetch options
      next: {
        // Cache for 5 minutes
        revalidate: 300,
        // Tag for targeted revalidation
        tags: ['appointments', 'calendar-appointments'],
      },
      headers: {
        'Content-Type': 'application/json',
        // Add authorization if available
        ...(process.env.API_KEY && { 'x-api-key': process.env.API_KEY }),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      const error: FetchError = new Error(
        `Failed to fetch appointments: ${response.status} ${response.statusText}`
      );
      error.statusCode = response.status;
      error.details = { body: errorText, url };
      throw error;
    }

    const appointments = await response.json();
    
    if (!Array.isArray(appointments)) {
      console.error('Expected appointments array, got:', appointments);
      throw new Error('Invalid response format: expected array');
    }

    // Ensure all appointments have required fields
    return appointments.map((appointment: unknown) => ({
      ...(appointment as AppointmentData),
      reason: (appointment as AppointmentData).reason || 'No reason provided',
    })) as AppointmentData[];

  } catch (error) {
    console.error('Error fetching appointments:', error);
    
    // In development, throw the error to see details
    if (process.env.NODE_ENV === 'development') {
      throw error;
    }
    
    // In production, return empty array but log the error
    return [];
  }
}

/**
 * Cached appointment fetcher with filtering
 * Uses unstable_cache for additional caching layer
 */
const getCachedAppointments = unstable_cache(
  async () => fetchAppointments(),
  ['appointments-cache'],
  {
    revalidate: 300, // 5 minutes
    tags: ['appointments'],
  }
);

/**
 * Filter appointments by status and provider
 */
function filterAppointments(
  appointments: AppointmentData[],
  filters: { status?: string; provider?: string }
): AppointmentData[] {
  return appointments.filter((appointment) => {
    if (filters.status && appointment.status !== filters.status) {
      return false;
    }
    if (filters.provider && appointment.nurseName !== filters.provider) {
      return false;
    }
    return true;
  });
}

/**
 * Get filtered appointments with enhanced error handling
 */
async function getFilteredAppointments(filters: {
  status?: string;
  provider?: string;
}): Promise<{ appointments: AppointmentData[]; error?: string }> {
  try {
    const appointments = await getCachedAppointments();
    const filtered = filterAppointments(appointments, filters);
    
    return { appointments: filtered };
  } catch (error) {
    console.error('Error in getFilteredAppointments:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to load appointments';
      
    return { 
      appointments: [], 
      error: errorMessage 
    };
  }
}

function CalendarSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-96 w-full" />
      </CardContent>
    </Card>
  );
}

/**
 * Error Boundary Component for Calendar
 */
function CalendarError({ error, reset }: { error: string; reset?: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-red-600">Error Loading Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{error}</p>
        {reset && (
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Calendar Page Component with enhanced fetching
 */
export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const view = searchParams.view || 'timeGridWeek';
  
  // Fetch appointments with error handling
  const { appointments, error } = await getFilteredAppointments({
    status: searchParams.status,
    provider: searchParams.provider,
  });

  const getViewDisplayName = (view: string) => {
    switch (view) {
      case 'dayGridMonth':
        return 'Month';
      case 'timeGridWeek':
        return 'Week';
      case 'timeGridDay':
        return 'Day';
      default:
        return 'Week';
    }
  };

  return (
    <Container>
      <PageHeader
        title="Appointments Calendar"
        description="View and manage appointments in calendar format"
      />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            <select 
              value={view}
              className="px-3 py-2 border border-gray-300 rounded-md"
              title="Calendar View"
              disabled // Server-side component, selection would need client-side handling
            >
              <option value="dayGridMonth">Month View</option>
              <option value="timeGridWeek">Week View</option>
              <option value="timeGridDay">Day View</option>
            </select>
            
            <select 
              value={searchParams.status || ''}
              className="px-3 py-2 border border-gray-300 rounded-md"
              title="Filter by Status"
              disabled // Server-side component, selection would need client-side handling
            >
              <option value="">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>
          
          {/* Display appointment count */}
          <div className="text-sm text-gray-600">
            {appointments.length} appointment{appointments.length !== 1 ? 's' : ''} found
          </div>
        </div>

        <Suspense fallback={<CalendarSkeleton />}>
          {error ? (
            <CalendarError error={error} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>
                  {getViewDisplayName(view)} View
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<CalendarSkeleton />}>
                  <LazyAppointmentCalendar
                    appointments={appointments}
                    initialView={view}
                    editable={true}
                    selectable={true}
                    showWeekends={false}
                    workingHours={{
                      start: '08:00',
                      end: '17:00',
                      daysOfWeek: [1, 2, 3, 4, 5],
                    }}
                  />
                </Suspense>
              </CardContent>
            </Card>
          )}
        </Suspense>
      </div>
    </Container>
  );
}

/**
 * Force dynamic rendering for this page to ensure fresh data
 * Remove this if you want static generation with revalidation
 */


/**
 * Revalidate every 5 minutes for appointment data freshness
 * Removed due to incompatibility with nextConfig.cacheComponents
 * TODO: Consider alternative caching strategy if needed
 */
// export const revalidate = 300;

export const metadata = {
  title: 'Appointments Calendar',
  description: 'View and manage appointments in calendar format',
};


