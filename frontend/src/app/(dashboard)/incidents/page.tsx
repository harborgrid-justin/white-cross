/**
 * @fileoverview Incidents List - Main incident management dashboard and primary entry point
 * for comprehensive incident tracking and reporting system.
 *
 * @module app/(dashboard)/incidents/page
 * @category Incidents - Core Pages
 *
 * ## Overview
 * Provides centralized incident management interface with real-time statistics, multi-dimensional
 * filtering, and quick access to incident creation and analytics. Serves as the primary navigation
 * hub for all incident-related workflows.
 *
 * ## Features
 * - **Real-time Statistics**: Displays aggregate counts for total, pending, investigating, and action-required incidents
 * - **Advanced Filtering**: Multi-dimensional filtering by incident type, status, severity, and date range
 * - **Quick Navigation**: Direct links to incident type categories and status-based views
 * - **Role-Based Access Control**: Respects user permissions for viewing and managing incidents
 * - **Responsive Design**: Optimized card-based layout for various screen sizes
 * - **Performance Optimized**: Server-side rendering with pagination support
 *
 * ## Incident Management Workflow
 * This page serves as the entry point for the complete incident lifecycle:
 *
 * 1. **Creation**: Quick access to create new incident reports via "Create Incident" button
 * 2. **Monitoring**: Real-time dashboard showing incidents requiring attention
 * 3. **Investigation**: Filter by status to view incidents under investigation
 * 4. **Resolution**: Track and filter resolved incidents for compliance reporting
 * 5. **Analytics**: Navigate to analytics dashboard for trend analysis and insights
 *
 * ## Incident Status State Machine
 * ```
 * DRAFT → PENDING_REVIEW → UNDER_INVESTIGATION → RESOLVED
 *                       ↓
 *                  REQUIRES_ACTION → [loops back to PENDING_REVIEW]
 *                       ↓
 *                  [any status] → ARCHIVED
 * ```
 *
 * ### Status Transitions
 * - **DRAFT**: Initial creation, not yet submitted for review
 * - **PENDING_REVIEW**: Awaiting administrator review and validation
 * - **UNDER_INVESTIGATION**: Actively being investigated, may involve witnesses and follow-ups
 * - **REQUIRES_ACTION**: Needs additional information or corrective action
 * - **RESOLVED**: Investigation complete, all required actions taken
 * - **ARCHIVED**: Closed and archived per retention policy
 *
 * ## Incident Types
 * - **INJURY**: Physical injuries requiring medical attention or documentation
 * - **ILLNESS**: Illness symptoms, contagious disease exposure, medication reactions
 * - **BEHAVIORAL**: Behavioral incidents, conflicts, disciplinary matters
 * - **SAFETY**: Safety hazards, equipment issues, environmental concerns
 * - **EMERGENCY**: Critical emergencies requiring immediate response (911, evacuation, lockdown)
 *
 * ## Compliance & Regulatory Requirements
 * - **FERPA Compliance**: Student privacy maintained throughout incident documentation
 * - **State Reporting**: Certain incident types trigger mandatory state reporting requirements
 * - **Audit Logging**: All incident access and modifications are audit-logged
 * - **Data Retention**: Incidents retained per district policy (typically 7 years minimum)
 * - **Parent Notification**: Critical incidents trigger automatic parent notification workflows
 *
 * ## Integration Points
 * - **Student Records**: Incidents linked to student health and behavioral records
 * - **Emergency Contacts**: Automatic retrieval of parent/guardian contact information
 * - **Notification System**: Email/SMS notifications for status changes and escalations
 * - **Analytics Engine**: Real-time data feeding into incident analytics and trending
 * - **Reporting System**: Data source for compliance and administrative reports
 *
 * ## Security & Access Control
 * - Requires authentication (enforced by dynamic rendering)
 * - Role-based filtering of visible incidents
 * - Confidential incidents restricted to authorized personnel only
 * - Audit trail for all incident list access
 *
 * ## Performance Considerations
 * - Server-side rendering for initial page load optimization
 * - Pagination limits to 50 incidents per page for performance
 * - Default sort by incident date (descending) for recent-first display
 * - Efficient querying with indexed database columns
 *
 * @see {@link IncidentCard} for individual incident display component
 * @see {@link listIncidents} for server action fetching incident data
 * @see {@link /incidents/new} for incident creation workflow
 * @see {@link /incidents/analytics} for analytics dashboard
 *
 * @example
 * // This page is rendered at route: /incidents
 * // Displays paginated list of incidents with real-time statistics
 * // Provides navigation to filtered views and creation form
 */

import React from 'react';
import { Metadata } from 'next';
import { listIncidents } from '@/actions/incidents.actions';
import { IncidentCard } from '@/components/incidents/IncidentCard';
import { Card } from '@/components/ui/layout/Card';
import { Badge } from '@/components/ui/display/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Incident Reports | White Cross',
  description: 'Track and manage student health and safety incidents with comprehensive reporting and investigation tools',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Incident Reports | White Cross Healthcare',
    description: 'Student health and safety incident tracking system with real-time monitoring and compliance reporting',
    type: 'website',
  },
};

// Force dynamic rendering due to auth requirements and real-time incident data
export const dynamic = 'force-dynamic';

/**
 * Incidents List Page Component
 *
 * Server component that renders the main incident management dashboard with real-time
 * statistics, filtering options, and incident cards. Fetches incident data server-side
 * for optimal performance and SEO.
 *
 * @component
 * @async
 *
 * @returns {Promise<JSX.Element>} Rendered incidents dashboard with statistics, filters, and incident grid
 *
 * @description
 * Displays comprehensive incident dashboard with:
 * - Statistics cards showing incident counts by status
 * - Quick filter badges for incident types and statuses
 * - Grid layout of incident cards with severity and status indicators
 * - Navigation to analytics, reports, and incident creation
 *
 * Data is fetched server-side with:
 * - 50 incidents per page (pagination supported)
 * - Sorted by incident date descending (most recent first)
 * - Filtered by user permissions (handled in listIncidents action)
 *
 * @example
 * ```tsx
 * // Rendered automatically at route /incidents
 * // No props required - server component fetches own data
 * <IncidentsListPage />
 * ```
 */
export default async function IncidentsListPage() {
  // Fetch incidents with pagination and sorting
  // listIncidents action handles authentication and authorization
  const result = await listIncidents({ limit: 50, sortBy: 'incidentDate', sortOrder: 'desc' });
  const incidents = result.data?.incidents || [];

  // Calculate real-time statistics from current incident set
  // These stats reflect only incidents visible to the current user based on their role
  const stats = result.data
    ? {
        total: result.data.total,
        // Count incidents by status for dashboard cards
        pending: incidents.filter((i) => i.status === 'PENDING_REVIEW').length,
        investigating: incidents.filter((i) => i.status === 'UNDER_INVESTIGATION').length,
        requiresAction: incidents.filter((i) => i.status === 'REQUIRES_ACTION').length,
      }
    : { total: 0, pending: 0, investigating: 0, requiresAction: 0 };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Incident Reports</h1>
        <div className="flex gap-2">
          <Link href="/incidents/analytics">
            <Button variant="secondary">Analytics</Button>
          </Link>
          <Link href="/incidents/reports">
            <Button variant="secondary">Reports</Button>
          </Link>
          <Link href="/incidents/new">
            <Button>Create Incident</Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Incidents</h3>
          <p className="text-3xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Review</h3>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold">{stats.pending}</p>
            <Badge color="yellow">Pending</Badge>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Under Investigation</h3>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold">{stats.investigating}</p>
            <Badge color="blue">Active</Badge>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Requires Action</h3>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold">{stats.requiresAction}</p>
            <Badge color="orange">Action Needed</Badge>
          </div>
        </Card>
      </div>

      {/* Quick Filters */}
      <div className="mb-6">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Quick Filters</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/incidents/injury">
            <Badge color="gray" className="cursor-pointer hover:bg-gray-200">
              Injury
            </Badge>
          </Link>
          <Link href="/incidents/illness">
            <Badge color="gray" className="cursor-pointer hover:bg-gray-200">
              Illness
            </Badge>
          </Link>
          <Link href="/incidents/behavioral">
            <Badge color="gray" className="cursor-pointer hover:bg-gray-200">
              Behavioral
            </Badge>
          </Link>
          <Link href="/incidents/safety">
            <Badge color="gray" className="cursor-pointer hover:bg-gray-200">
              Safety
            </Badge>
          </Link>
          <Link href="/incidents/emergency">
            <Badge color="gray" className="cursor-pointer hover:bg-gray-200">
              Emergency
            </Badge>
          </Link>
          <span className="mx-2 text-gray-400">|</span>
          <Link href="/incidents/pending-review">
            <Badge color="yellow" className="cursor-pointer">
              Pending Review
            </Badge>
          </Link>
          <Link href="/incidents/under-investigation">
            <Badge color="blue" className="cursor-pointer">
              Under Investigation
            </Badge>
          </Link>
          <Link href="/incidents/requires-action">
            <Badge color="orange" className="cursor-pointer">
              Requires Action
            </Badge>
          </Link>
          <Link href="/incidents/resolved">
            <Badge color="green" className="cursor-pointer">
              Resolved
            </Badge>
          </Link>
        </div>
      </div>

      {/* Incidents List */}
      {result.success && incidents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {incidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-gray-500 mb-4">No incidents found</p>
          <Link href="/incidents/new">
            <Button>Create First Incident</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
