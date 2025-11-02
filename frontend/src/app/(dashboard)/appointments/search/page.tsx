import { Suspense } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Container } from '@/components/layouts/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AppointmentList } from '@/components/appointments';
import { API_ENDPOINTS } from '@/lib/api-client';
import { unstable_cache } from 'next/cache';

interface SearchPageProps {
  searchParams: {
    q?: string;
    status?: string;
    provider?: string;
    student?: string;
    type?: string;
    date_from?: string;
    date_to?: string;
    priority?: string;
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
  reason: string;
  notes?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

/**
 * Fetch appointments with search parameters
 */
async function searchAppointments(filters: SearchPageProps['searchParams']): Promise<AppointmentData[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const url = `${baseUrl}${API_ENDPOINTS.APPOINTMENTS.BASE}`;
  
  try {
    const response = await fetch(url, {
      next: {
        revalidate: 60, // Cache for 1 minute for search results
        tags: ['appointments', 'search-appointments'],
      },
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.API_KEY && { 'x-api-key': process.env.API_KEY }),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch appointments: ${response.status}`);
    }

    const appointments = await response.json();
    
    if (!Array.isArray(appointments)) {
      return [];
    }

    // Apply search filters
    return appointments.filter((appointment: any) => {
      // Text search across multiple fields
      if (filters.q) {
        const searchTerm = filters.q.toLowerCase();
        const searchableText = [
          appointment.studentName,
          appointment.nurseName,
          appointment.appointmentType,
          appointment.reason,
          appointment.notes,
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      // Status filter
      if (filters.status && appointment.status !== filters.status) {
        return false;
      }

      // Provider filter
      if (filters.provider && appointment.nurseName !== filters.provider) {
        return false;
      }

      // Student filter
      if (filters.student && appointment.studentName !== filters.student) {
        return false;
      }

      // Type filter
      if (filters.type && appointment.appointmentType !== filters.type) {
        return false;
      }

      // Priority filter
      if (filters.priority && appointment.priority !== filters.priority) {
        return false;
      }

      // Date range filter
      if (filters.date_from || filters.date_to) {
        const appointmentDate = new Date(appointment.scheduledDate);
        
        if (filters.date_from) {
          const fromDate = new Date(filters.date_from);
          if (appointmentDate < fromDate) {
            return false;
          }
        }
        
        if (filters.date_to) {
          const toDate = new Date(filters.date_to);
          if (appointmentDate > toDate) {
            return false;
          }
        }
      }

      return true;
    }).map((appointment: any) => ({
      ...appointment,
      reason: appointment.reason || 'No reason provided',
    }));

  } catch (error) {
    console.error('Error searching appointments:', error);
    return [];
  }
}

function SearchSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const appointments = await searchAppointments(searchParams);
  const hasActiveFilters = Object.keys(searchParams).length > 0;

  return (
    <Container>
      <PageHeader
        title="Search Appointments"
        description="Search and filter appointments using various criteria"
      />

      <div className="space-y-6">
        {/* Search Form */}
        <Card>
          <CardHeader>
            <CardTitle>Search Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <form method="GET" className="space-y-4">
              {/* Text Search */}
              <div>
                <label htmlFor="q" className="block text-sm font-medium text-gray-700 mb-1">
                  Search Text
                </label>
                <input
                  type="text"
                  id="q"
                  name="q"
                  defaultValue={searchParams.q}
                  placeholder="Search by student name, provider, type, reason..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filter Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={searchParams.status || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                {/* Priority Filter */}
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    defaultValue={searchParams.priority || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                {/* Date From */}
                <div>
                  <label htmlFor="date_from" className="block text-sm font-medium text-gray-700 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    id="date_from"
                    name="date_from"
                    defaultValue={searchParams.date_from}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Date To */}
                <div>
                  <label htmlFor="date_to" className="block text-sm font-medium text-gray-700 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    id="date_to"
                    name="date_to"
                    defaultValue={searchParams.date_to}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Search
                </button>
                <a
                  href="/appointments/search"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Clear
                </a>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <Suspense fallback={<SearchSkeleton />}>
          <Card>
            <CardHeader>
              <CardTitle>
                Search Results
                <span className="ml-2 text-sm font-normal text-gray-600">
                  ({appointments.length} appointment{appointments.length !== 1 ? 's' : ''} found)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <AppointmentList 
                  appointments={appointments}
                  showSearch={false}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    {hasActiveFilters 
                      ? 'No appointments found matching your search criteria.'
                      : 'Enter search criteria above to find appointments.'
                    }
                  </p>
                  {hasActiveFilters && (
                    <a
                      href="/appointments/search"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Clear all filters
                    </a>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </Suspense>
      </div>
    </Container>
  );
}

export const metadata = {
  title: 'Search Appointments',
  description: 'Search and filter appointments using various criteria',
};


