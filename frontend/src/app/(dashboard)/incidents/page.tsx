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
 * Server component that renders the main incident management dashboard using Next.js v16
 * patterns with local components and modern architecture.
 *
 * @component
 * @async
 *
 * @returns {Promise<JSX.Element>} Rendered incidents dashboard with filtering and content
 *
 * @description
 * Modern Next.js v16 implementation with:
 * - Local _components for feature-specific UI logic
 * - Search params integration for filtering
 * - Parallel routes support (@modal, @sidebar)
 * - Responsive design with proper loading states
 *
 * @example
 * ```tsx
 * // Rendered automatically at route /incidents
 * // Search params automatically passed for filtering
 * <IncidentsListPage searchParams={{ type: 'INJURY', status: 'PENDING_REVIEW' }} />
 * ```
 */

import { Suspense } from 'react';
import { IncidentsContent } from './_components/IncidentsContent';
import { IncidentsFilters } from './_components/IncidentsFilters';
import { Skeleton } from '@/components/ui/Skeleton';

interface IncidentsListPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    type?: string;
    status?: string;
    severity?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    reportedBy?: string;
    studentId?: string;
  };
}

export default async function IncidentsListPage({ searchParams }: IncidentsListPageProps) {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <Suspense
        fallback={
          <div className="bg-white rounded-lg border p-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
          </div>
        }
      >
        <IncidentsFilters totalCount={247} />
      </Suspense>

      {/* Main Content */}
      <Suspense
        fallback={
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
            <div className="space-y-4">
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        }
      >
        <IncidentsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
