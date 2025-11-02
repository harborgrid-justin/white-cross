/**
 * @fileoverview Analytics API Root Endpoint
 *
 * Provides healthcare analytics and reporting capabilities for the platform.
 * This endpoint handles data aggregation, statistical analysis, and 
 * performance metrics for healthcare operations.
 *
 * @module api/analytics
 * @category Analytics
 * @subcategory Main Routes
 *
 * **Key Features:**
 * - Healthcare operation metrics and KPIs
 * - Student health trend analysis
 * - Medication usage statistics
 * - Incident reporting analytics
 * - Performance dashboards and insights
 *
 * **Security:**
 * - Authentication required for all operations
 * - Role-based access to different analytics levels
 * - PHI-compliant data aggregation and anonymization
 * - Audit logging for all data access
 *
 * **HIPAA Compliance:**
 * - All analytics operations are audit logged
 * - PHI data is properly anonymized for reporting
 * - Minimum necessary standard applied to data access
 * - Secure transmission and storage of analytics data
 *
 * @since 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';
import {
  getCacheConfig,
  generateCacheTags,
  getCacheControlHeader
} from '@/lib/cache/config';
import { invalidateResource } from '@/lib/cache/invalidation';

/**
 * GET /api/analytics
 *
 * Retrieves healthcare analytics dashboard with key performance indicators,
 * health trends, and operational metrics for authorized users.
 *
 * @async
 * @param {NextRequest} request - Next.js request object
 * @param {Object} context - Route context
 * @param {Object} auth - Authenticated user context
 * @param {Object} auth.user - User information from JWT
 * @param {string} auth.user.userId - User ID
 * @param {string} auth.user.role - User role
 *
 * @returns {Promise<NextResponse>} JSON response with analytics data
 * @returns {Object} response.data - Analytics dashboard data
 * @returns {Object} response.data.overview - High-level metrics overview
 * @returns {number} response.data.overview.totalStudents - Total student count
 * @returns {number} response.data.overview.activeIncidents - Active incident count
 * @returns {number} response.data.overview.medicationEvents - Recent medication events
 * @returns {Object} response.data.trends - Health trend data
 * @returns {Array} response.data.trends.monthlyVisits - Monthly health office visits
 * @returns {Array} response.data.trends.commonConditions - Most frequent health conditions
 * @returns {Object} response.data.performance - System performance metrics
 * @returns {number} response.data.performance.responseTime - Average response time
 * @returns {number} response.data.performance.uptime - System uptime percentage
 *
 * @throws {401} Unauthorized - Authentication required
 * @throws {403} Forbidden - Insufficient permissions for detailed analytics
 * @throws {500} Internal Server Error - Server error during retrieval
 *
 * @example
 * // Successful request
 * GET /api/analytics
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 * // Response (200 OK)
 * {
 *   "data": {
 *     "overview": {
 *       "totalStudents": 1250,
 *       "activeIncidents": 3,
 *       "medicationEvents": 45
 *     },
 *     "trends": {
 *       "monthlyVisits": [
 *         { "month": "2025-09", "visits": 234 },
 *         { "month": "2025-10", "visits": 267 }
 *       ],
 *       "commonConditions": [
 *         { "condition": "Headache", "count": 89 },
 *         { "condition": "Allergic Reaction", "count": 23 }
 *       ]
 *     },
 *     "performance": {
 *       "responseTime": 45,
 *       "uptime": 99.9
 *     }
 *   }
 * }
 *
 * @method GET
 * @access Authenticated (role-based data filtering)
 * @auditLog Analytics data access is logged
 */
/**
 * Route segment configuration
 * Force dynamic rendering for role-based data
 */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    const cacheConfig = getCacheConfig('analytics');
    const cacheTags = [...generateCacheTags('analytics'), `user-${auth.user.role}`];
    const cacheControl = getCacheControlHeader('analytics');

    // Proxy request to backend with enhanced caching
    const response = await proxyToBackend(request, '/analytics', {
      cache: {
        revalidate: cacheConfig.revalidate,
        tags: cacheTags
      },
      cacheControl
    });

    const data = await response.json();

    // Audit log analytics access
    const auditContext = createAuditContext(request, auth.user.userId);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'AnalyticsDashboard',
      details: `Analytics dashboard accessed by ${auth.user.role}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching analytics data:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch analytics data',
        message: 'Unable to retrieve analytics dashboard information'
      },
      { status: 500 }
    );
  }
});

/**
 * POST /api/analytics
 *
 * Generates custom analytics reports or initiates data analysis jobs.
 * Requires appropriate permissions based on the type of analysis requested.
 *
 * @async
 * @param {NextRequest} request - Next.js request object
 * @param {Object} context - Route context
 * @param {Object} auth - Authenticated user context
 *
 * @returns {Promise<NextResponse>} JSON response with report generation results
 *
 * @throws {401} Unauthorized - Authentication required
 * @throws {403} Forbidden - Insufficient permissions for requested analysis
 * @throws {400} Bad Request - Invalid report parameters
 * @throws {500} Internal Server Error - Server error during report generation
 *
 * @method POST
 * @access Authenticated (NURSE or higher for detailed reports)
 * @auditLog All custom report generation is logged
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Check permissions for custom analytics
    const allowedRoles = ['ADMIN', 'SCHOOL_ADMIN', 'NURSE'];
    if (!allowedRoles.includes(auth.user.role)) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: 'Insufficient permissions for custom analytics generation'
        },
        { status: 403 }
      );
    }

    // Proxy request to backend
    const response = await proxyToBackend(request, '/analytics');

    const data = await response.json();

    if (response.status === 200 || response.status === 201) {
      // Audit log custom analytics generation
      const auditContext = createAuditContext(request, auth.user.userId);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'CustomAnalyticsReport',
        details: 'Custom analytics report generated'
      });

      // Invalidate analytics cache since new data was generated
      await invalidateResource('analytics');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error generating custom analytics:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate custom analytics',
        message: 'Unable to complete analytics report generation'
      },
      { status: 500 }
    );
  }
});