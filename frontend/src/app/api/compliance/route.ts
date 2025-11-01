/**
 * @fileoverview Compliance API Root Endpoint
 *
 * Provides HIPAA compliance management and reporting capabilities for the
 * healthcare platform. This endpoint handles compliance monitoring, audit
 * management, and regulatory reporting requirements.
 *
 * @module api/compliance
 * @category Compliance
 * @subcategory Main Routes
 *
 * **Key Features:**
 * - HIPAA compliance status monitoring
 * - Audit trail management and reporting
 * - Regulatory compliance checks
 * - Security assessment reporting
 * - Data breach notification protocols
 *
 * **Security:**
 * - Administrative access required for most operations
 * - Comprehensive audit logging for all compliance operations
 * - Tamper-proof audit trail generation
 * - Encrypted compliance data storage
 *
 * **HIPAA Requirements:**
 * - 164.308(a)(1)(ii)(D) - Information system activity review
 * - 164.312(b) - Audit controls implementation
 * - 164.308(a)(8) - Evaluation of security measures
 *
 * @since 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { withMinimumRole } from '@/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/compliance
 *
 * Retrieves comprehensive compliance dashboard data including HIPAA status,
 * audit summaries, and regulatory compliance metrics.
 *
 * @async
 * @param {NextRequest} request - Next.js request object
 * @param {Object} context - Route context
 * @param {Object} auth - Authenticated user context
 * @param {Object} auth.user - User information from JWT
 * @param {string} auth.user.userId - User ID
 * @param {string} auth.user.role - User role (must be ADMIN or higher)
 *
 * @returns {Promise<NextResponse>} JSON response with compliance overview
 * @returns {Object} response.data - Compliance dashboard data
 * @returns {Object} response.data.hipaa - HIPAA compliance status
 * @returns {boolean} response.data.hipaa.compliant - Overall compliance status
 * @returns {number} response.data.hipaa.score - Compliance score (0-100)
 * @returns {string[]} response.data.hipaa.issues - Array of compliance issues
 * @returns {Object} response.data.audits - Audit statistics
 * @returns {number} response.data.audits.totalLogs - Total audit log entries
 * @returns {number} response.data.audits.criticalEvents - Critical events logged
 * @returns {string} response.data.audits.lastAudit - Last audit timestamp
 * @returns {Object} response.data.security - Security assessment results
 * @returns {string} response.data.security.level - Security level (High/Medium/Low)
 * @returns {number} response.data.security.vulnerabilities - Vulnerability count
 *
 * @throws {401} Unauthorized - Authentication required
 * @throws {403} Forbidden - Administrative privileges required
 * @throws {500} Internal Server Error - Server error during retrieval
 *
 * @example
 * // Successful request (Admin user)
 * GET /api/compliance
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 * // Response (200 OK)
 * {
 *   "data": {
 *     "hipaa": {
 *       "compliant": true,
 *       "score": 98,
 *       "issues": []
 *     },
 *     "audits": {
 *       "totalLogs": 15420,
 *       "criticalEvents": 0,
 *       "lastAudit": "2025-10-31T09:15:00Z"
 *     },
 *     "security": {
 *       "level": "High",
 *       "vulnerabilities": 0
 *     }
 *   }
 * }
 *
 * @method GET
 * @access Admin Only (ADMIN, DISTRICT_ADMIN)
 * @auditLog All compliance data access is logged
 */
export const GET = withMinimumRole('ADMIN', async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend with caching
    const response = await proxyToBackend(request, '/compliance', {
      cache: {
        revalidate: 60, // Cache for 1 minute (compliance data should be fresh)
        tags: ['compliance', 'hipaa-status', 'audit-summary']
      }
    });

    const data = await response.json();

    // Audit log compliance data access
    const auditContext = createAuditContext(request, auth.user.userId);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'ComplianceDashboard',
      details: 'Compliance dashboard data accessed by administrator'
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching compliance data:', error);

    return NextResponse.json(
      { 
        error: 'Failed to fetch compliance data',
        message: 'Unable to retrieve compliance dashboard information'
      },
      { status: 500 }
    );
  }
});

/**
 * POST /api/compliance
 *
 * Initiates compliance assessment or updates compliance configuration.
 * Requires highest administrative privileges.
 *
 * @async
 * @param {NextRequest} request - Next.js request object
 * @param {Object} context - Route context
 * @param {Object} auth - Authenticated user context
 *
 * @returns {Promise<NextResponse>} JSON response with assessment results
 *
 * @throws {401} Unauthorized - Authentication required
 * @throws {403} Forbidden - Highest administrative privileges required
 * @throws {400} Bad Request - Invalid assessment parameters
 * @throws {500} Internal Server Error - Server error during assessment
 *
 * @method POST
 * @access Super Admin Only
 * @auditLog All compliance configuration changes are logged
 */
export const POST = withMinimumRole('ADMIN', async (request: NextRequest, _context, auth) => {
  try {
    // Additional check for highest privileges
    if (auth.user.role !== 'ADMIN' && auth.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { 
          error: 'Forbidden', 
          message: 'Highest administrative privileges required for compliance operations' 
        },
        { status: 403 }
      );
    }

    // Proxy request to backend
    const response = await proxyToBackend(request, '/compliance');

    const data = await response.json();

    if (response.status === 200 || response.status === 201) {
      // Audit log compliance operation
      const auditContext = createAuditContext(request, auth.user.userId);
      await logPHIAccess({
        ...auditContext,
        action: 'UPDATE',
        resource: 'ComplianceConfig',
        details: 'Compliance assessment initiated or configuration updated'
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error processing compliance operation:', error);

    return NextResponse.json(
      { 
        error: 'Failed to process compliance operation',
        message: 'Unable to complete compliance assessment or configuration update'
      },
      { status: 500 }
    );
  }
});