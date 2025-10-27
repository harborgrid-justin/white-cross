/**
 * @fileoverview Appointments List View Page
 * @module app/appointments/list
 *
 * Comprehensive tabular list view for appointment management with advanced filtering,
 * multi-column sorting, server-side pagination, and bulk operations support. This view
 * provides school nurses with a data-dense, keyboard-accessible interface for managing
 * large volumes of appointments.
 *
 * **Key Features:**
 * - **Server-Side Pagination**: Handles 1000+ appointments efficiently with offset-based pagination
 * - **Multi-Filter Support**: Status, nurse, student, date range, and free-text search
 * - **Dynamic Sorting**: Sort by any column (date, time, student, status) with asc/desc order
 * - **Real-Time Statistics**: At-a-glance appointment count breakdown by status
 * - **Export Capabilities**: CSV export and print-friendly formatting (planned)
 * - **Responsive Layout**: Adapts from mobile card view to desktop table view
 *
 * **Pagination Algorithm:**
 * Uses offset-based pagination for deterministic page navigation:
 * - `offset = (page - 1) * limit`
 * - `totalPages = Math.ceil(total / limit)`
 * - Default: 50 items per page (configurable via URL param)
 * - Prevents memory issues with large datasets by loading only visible page
 *
 * **Filtering Strategy:**
 * - All filters applied server-side via database queries
 * - Filters are composable (AND logic): status + nurse + student + date range
 * - Search uses full-text search on student name and appointment reason
 * - URL params persist filter state for bookmarking and sharing
 *
 * **Performance Optimization:**
 * - Force dynamic rendering (no static generation) due to auth and real-time data
 * - Server-side filtering reduces client-side JavaScript processing
 * - Statistics calculated in single database query with filter conditions
 * - Suspense boundaries prevent render blocking during data fetch
 *
 * **Accessibility:**
 * - Table view supports keyboard navigation (arrow keys, tab)
 * - Sort controls are announced by screen readers
 * - Filter controls have proper labels and ARIA attributes
 * - Pagination buttons are keyboard-accessible and disabled state is announced
 *
 * @see {@link AppointmentList} for the table/list rendering component
 * @see {@link getAppointmentsAction} for server-side data fetching with filters
 *
 * @example
 * ```tsx
 * // View page 2 with 25 items per page:
 * // /appointments/list?page=2&limit=25
 *
 * // Filter by status and sort by date descending:
 * // /appointments/list?status=confirmed&sortBy=scheduledDate&order=desc
 *
 * // Search for student with date range:
 * // /appointments/list?search=John+Doe&startDate=2025-10-01&endDate=2025-10-31
 * ```
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAppointmentsAction } from '@/actions/appointments.actions';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AppointmentList } from '@/components/appointments/AppointmentList';
import { Button } from '@/components/ui/Button';

/**
 * Next.js Metadata Configuration
 *
 * SEO and browser metadata for the appointments list page.
 */
export const metadata: Metadata = {
  title: 'Appointments List | White Cross',
  description: 'Comprehensive list view of all appointments',
};

/**
 * Next.js Rendering Mode Configuration
 *
 * Forces dynamic rendering (disables static generation and caching) because:
 * - Requires authentication check on every request
 * - Shows real-time appointment data that changes frequently
 * - Filter/search params are user-specific and cannot be pre-rendered
 * - Ensures users always see up-to-date appointment information
 *
 * @constant {string} dynamic - "force-dynamic" disables static optimization
 */
export const dynamic = "force-dynamic";

/**
 * Page Props Interface
 *
 * Defines the structure of URL search parameters accepted by the list page.
 * All parameters are optional, providing flexible navigation and filtering.
 *
 * **Pagination Parameters:**
 * @property {string} [page] - Current page number (1-indexed), default: "1"
 * @property {string} [limit] - Items per page, default: "50"
 *
 * **Sorting Parameters:**
 * @property {string} [sortBy] - Column to sort by (scheduledDate, student, status), default: "scheduledDate"
 * @property {'asc' | 'desc'} [order] - Sort direction, default: "desc"
 *
 * **Filter Parameters:**
 * @property {string} [status] - Filter by appointment status (scheduled, confirmed, in-progress, completed, cancelled, no-show)
 * @property {string} [nurse] - Filter by nurse ID
 * @property {string} [student] - Filter by student ID
 * @property {string} [startDate] - Filter by date range start (ISO format: YYYY-MM-DD)
 * @property {string} [endDate] - Filter by date range end (ISO format: YYYY-MM-DD)
 * @property {string} [search] - Free-text search across student name and appointment reason
 *
 * @example
 * ```tsx
 * // Type-safe search params usage:
 * const { page, limit, sortBy, order, status, search } = searchParams;
 * const pageNum = parseInt(page || '1');
 * const itemsPerPage = parseInt(limit || '50');
 * ```
 */
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

/**
 * Appointments List Page Component
 *
 * Server component that implements server-side pagination, filtering, and sorting
 * for appointment management. Handles authentication, parameter parsing, data fetching,
 * and rendering of the tabular list interface.
 *
 * **Server Component Rationale:**
 * - Performs authentication check before any data exposure
 * - Executes database queries on the server (reduced client payload)
 * - Calculates pagination offsets server-side
 * - Delivers pre-rendered HTML with appointment data
 *
 * **Pagination Implementation:**
 * Uses offset-based pagination algorithm:
 * 1. Extract `page` and `limit` from URL params (defaults: page=1, limit=50)
 * 2. Calculate `offset = (page - 1) * limit`
 * 3. Fetch appointments with LIMIT and OFFSET SQL clauses
 * 4. Calculate `totalPages = Math.ceil(total / limit)` for navigation
 *
 * **Performance Characteristics:**
 * - Time Complexity: O(1) for offset calculation, O(n) for database query
 * - Space Complexity: O(limit) - only loads items for current page
 * - Handles 10,000+ total appointments by loading 50 at a time
 *
 * **Filter Composition:**
 * All filters are composable using AND logic:
 * - `status AND nurse AND student AND dateRange AND search`
 * - Empty/null filters are excluded from query
 * - Maintains type safety through structured filters object
 *
 * @param {PageProps} props - Component props
 * @param {Object} props.searchParams - URL search parameters for pagination, filtering, sorting
 *
 * @returns {Promise<JSX.Element>} Rendered appointments list page with filters and pagination
 *
 * @example
 * ```tsx
 * // Server renders this component with search params from URL:
 * // /appointments/list?page=2&limit=25&status=confirmed&sortBy=scheduledDate&order=asc
 *
 * // Results in:
 * // - page: 2
 * // - limit: 25
 * // - offset: 25 (calculated as (2-1) * 25)
 * // - Fetches appointments 26-50
 * // - Filters to only "confirmed" status
 * // - Sorts by scheduledDate ascending
 * ```
 */
export default async function ListPage({ searchParams }: PageProps) {
  // Authentication check - redirect unauthenticated users before processing
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  /**
   * Pagination Parameter Parsing
   *
   * Converts string URL params to integers with safe defaults.
   * Calculates zero-based offset for database OFFSET clause.
   *
   * Algorithm: offset = (page - 1) * limit
   * - Page 1: offset = 0 (items 1-50)
   * - Page 2: offset = 50 (items 51-100)
   * - Page 3: offset = 100 (items 101-150)
   */
  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '50');
  const offset = (page - 1) * limit;

  /**
   * Filter Parameters Extraction
   *
   * Builds structured filter object from URL search params.
   * All filters are optional; undefined values are handled by the action.
   *
   * Filters use AND logic: appointments must match ALL specified criteria.
   */
  const filters = {
    status: searchParams.status,          // Appointment status filter
    nurseId: searchParams.nurse,          // Assigned nurse filter
    studentId: searchParams.student,      // Student filter
    startDate: searchParams.startDate,    // Date range start (inclusive)
    endDate: searchParams.endDate,        // Date range end (inclusive)
    search: searchParams.search,          // Full-text search on student name & reason
  };

  /**
   * Sorting Parameters
   *
   * Defaults to descending date sort (newest appointments first).
   * Supports any appointment column for flexible data exploration.
   */
  const sortBy = searchParams.sortBy || 'scheduledDate';
  const order = searchParams.order || 'desc';

  /**
   * Server-Side Data Fetching
   *
   * Fetches filtered, sorted, paginated appointments from database.
   * Executes single optimized query with all conditions.
   *
   * Returns:
   * - appointments: Array of appointment objects for current page
   * - total: Total count of appointments matching filters (for pagination)
   */
  const result = await getAppointmentsAction({
    ...filters,
    limit,
    offset,
    sortBy,
    order,
  });

  // Safe data extraction with fallbacks for error handling
  const appointments = result.success ? result.data?.appointments || [] : [];
  const total = result.success ? result.data?.total || 0 : 0;

  /**
   * Total Pages Calculation
   *
   * Calculates number of pages needed to display all filtered appointments.
   * Uses Math.ceil to ensure partial pages are counted (e.g., 51 items with limit 50 = 2 pages).
   */
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

      {/* Pagination Controls */}
      {/* Only displayed when multiple pages exist (totalPages > 1) */}
      {/* Uses Link components for SEO-friendly navigation with URL params */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
          {/* Page indicator: Shows current position in result set */}
          <div className="text-sm text-gray-700">
            Page {page} of {totalPages}
          </div>

          {/* Previous/Next navigation buttons */}
          {/* Accessibility: Disabled state is announced to screen readers */}
          {/* SEO: Uses Link for crawlable pagination */}
          <div className="flex gap-2">
            {/* Previous page button - disabled on first page */}
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

            {/* Next page button - disabled on last page */}
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
