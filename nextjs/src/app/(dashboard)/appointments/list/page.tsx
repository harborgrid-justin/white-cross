/**
 * @fileoverview Appointments List View Page
 * @module app/appointments/list
 *
 * Tabular list view with advanced filtering, sorting, and bulk operations.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAppointmentsAction } from '@/actions/appointments.actions';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AppointmentList } from '@/components/appointments/AppointmentList';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Appointments List | White Cross',
  description: 'Comprehensive list view of all appointments',
};

interface PageProps {
  searchParams: {
    page?: string;
    limit?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    status?: string;
    nurse?: string;
    student?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  };
}

export default async function ListPage({ searchParams }: PageProps) {
  // Authentication check
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  // Parse pagination
  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '50');
  const offset = (page - 1) * limit;

  // Parse filters
  const filters = {
    status: searchParams.status,
    nurseId: searchParams.nurse,
    studentId: searchParams.student,
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
    search: searchParams.search,
  };

  // Parse sorting
  const sortBy = searchParams.sortBy || 'scheduledDate';
  const order = searchParams.order || 'desc';

  // Fetch appointments
  const result = await getAppointmentsAction({
    ...filters,
    limit,
    offset,
    sortBy,
    order,
  });

  const appointments = result.success ? result.data?.appointments || [] : [];
  const total = result.success ? result.data?.total || 0 : 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments List</h1>
          <p className="mt-2 text-gray-600">
            Showing {appointments.length} of {total} appointments
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/appointments/new">Schedule Appointment</Link>
          </Button>
          <Button variant="outline">Export to CSV</Button>
          <Button variant="outline">Print</Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue={searchParams.status || ''}
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

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue={searchParams.startDate || ''}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue={searchParams.endDate || ''}
            />
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Student name, reason..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue={searchParams.search || ''}
            />
          </div>

          {/* Apply Filters */}
          <div className="flex items-end">
            <Button className="w-full">Apply Filters</Button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total</div>
          <div className="text-2xl font-bold text-gray-900">{total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Scheduled</div>
          <div className="text-2xl font-bold text-blue-600">
            {appointments.filter((a) => a.status === 'scheduled').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Confirmed</div>
          <div className="text-2xl font-bold text-green-600">
            {appointments.filter((a) => a.status === 'confirmed').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Completed</div>
          <div className="text-2xl font-bold text-gray-600">
            {appointments.filter((a) => a.status === 'completed').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">No Shows</div>
          <div className="text-2xl font-bold text-orange-600">
            {appointments.filter((a) => a.status === 'no-show').length}
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow">
        <Suspense
          fallback={
            <div className="p-8 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          }
        >
          <AppointmentList
            appointments={appointments}
            sortBy={sortBy}
            order={order}
          />
        </Suspense>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page <= 1}
              asChild={page > 1}
            >
              {page > 1 ? (
                <Link href={`?page=${page - 1}&limit=${limit}`}>Previous</Link>
              ) : (
                <span>Previous</span>
              )}
            </Button>
            <Button
              variant="outline"
              disabled={page >= totalPages}
              asChild={page < totalPages}
            >
              {page < totalPages ? (
                <Link href={`?page=${page + 1}&limit=${limit}`}>Next</Link>
              ) : (
                <span>Next</span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
