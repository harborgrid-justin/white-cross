/**
 * On-Demand Revalidation API Endpoint
 *
 * Provides manual cache invalidation capabilities for Next.js v16.
 * Allows administrators and webhook integrations to invalidate
 * specific caches on-demand.
 *
 * @module api/revalidate
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { withAuth } from '@/identity-access/middleware/withAuth';
import { RESOURCE_CACHE_CONFIG } from '@/lib/cache/config';
import {
  invalidateResource,
  invalidateRelatedResources,
  invalidateStudentData,
  invalidateAppointmentData,
  invalidateHealthRecordData,
  invalidateMedicationData,
  invalidateIncidentData,
  invalidateAll,
  batchInvalidate
} from '@/lib/cache/invalidation';
import { createAuditContext, auditLog, AUDIT_ACTIONS } from '@/lib/audit';

/**
 * Route segment configuration
 * Force dynamic for admin operations
 */

/**
 * Revalidation request body type
 */
interface RevalidateRequest {
  /** Type of revalidation: 'path', 'tag', 'resource', 'student', 'all' */
  type: 'path' | 'tag' | 'resource' | 'student' | 'appointment' | 'healthRecord' | 'medication' | 'incident' | 'batch' | 'all';
  /** Path to revalidate (for type='path') */
  path?: string;
  /** Tag to revalidate (for type='tag') */
  tag?: string;
  /** Resource type to revalidate (for type='resource') */
  resourceType?: keyof typeof RESOURCE_CACHE_CONFIG;
  /** Resource ID (optional, for granular invalidation) */
  resourceId?: string;
  /** Student ID (for student-related invalidations) */
  studentId?: string;
  /** Batch of resources to invalidate (for type='batch') */
  resources?: Array<{
    type: keyof typeof RESOURCE_CACHE_CONFIG;
    id?: string;
    tags?: string[];
  }>;
  /** Related resource IDs for cross-resource invalidation */
  relations?: {
    studentId?: string;
    appointmentId?: string;
    medicationId?: string;
    incidentId?: string;
  };
}

/**
 * POST /api/revalidate
 *
 * Invalidate caches on-demand. Requires ADMIN or SCHOOL_ADMIN role.
 *
 * @example
 * // Revalidate a path
 * POST /api/revalidate
 * {
 *   "type": "path",
 *   "path": "/dashboard"
 * }
 *
 * @example
 * // Revalidate a specific resource
 * POST /api/revalidate
 * {
 *   "type": "resource",
 *   "resourceType": "students",
 *   "resourceId": "123"
 * }
 *
 * @example
 * // Revalidate all student-related data
 * POST /api/revalidate
 * {
 *   "type": "student",
 *   "studentId": "123"
 * }
 *
 * @example
 * // Batch revalidation
 * POST /api/revalidate
 * {
 *   "type": "batch",
 *   "resources": [
 *     { "type": "students", "id": "123" },
 *     { "type": "appointments", "id": "456" }
 *   ]
 * }
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Check permissions - only admins can revalidate caches
    const allowedRoles = ['ADMIN', 'SCHOOL_ADMIN'];
    if (!allowedRoles.includes(auth.user.role)) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: 'Administrative privileges required for cache revalidation'
        },
        { status: 403 }
      );
    }

    const body: RevalidateRequest = await request.json();

    // Validate request
    if (!body.type) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Revalidation type is required' },
        { status: 400 }
      );
    }

    let revalidated: string[] = [];

    // Handle different revalidation types
    switch (body.type) {
      case 'path':
        if (!body.path) {
          return NextResponse.json(
            { error: 'Bad Request', message: 'Path is required for path revalidation' },
            { status: 400 }
          );
        }
        revalidatePath(body.path);
        revalidated.push(body.path);
        break;

      case 'tag':
        if (!body.tag) {
          return NextResponse.json(
            { error: 'Bad Request', message: 'Tag is required for tag revalidation' },
            { status: 400 }
          );
        }
        revalidateTag(body.tag);
        revalidated.push(body.tag);
        break;

      case 'resource':
        if (!body.resourceType) {
          return NextResponse.json(
            { error: 'Bad Request', message: 'Resource type is required' },
            { status: 400 }
          );
        }
        if (body.relations && body.resourceId) {
          await invalidateRelatedResources(
            body.resourceType,
            body.resourceId,
            body.relations
          );
          revalidated.push(`${body.resourceType}/${body.resourceId} (with relations)`);
        } else {
          await invalidateResource(body.resourceType, body.resourceId);
          revalidated.push(body.resourceId ? `${body.resourceType}/${body.resourceId}` : body.resourceType);
        }
        break;

      case 'student':
        if (!body.studentId) {
          return NextResponse.json(
            { error: 'Bad Request', message: 'Student ID is required' },
            { status: 400 }
          );
        }
        await invalidateStudentData(body.studentId);
        revalidated.push(`student/${body.studentId} (all related data)`);
        break;

      case 'appointment':
        if (!body.resourceId) {
          return NextResponse.json(
            { error: 'Bad Request', message: 'Appointment ID is required' },
            { status: 400 }
          );
        }
        await invalidateAppointmentData(body.resourceId, body.studentId);
        revalidated.push(`appointment/${body.resourceId}`);
        break;

      case 'healthRecord':
        if (!body.resourceId) {
          return NextResponse.json(
            { error: 'Bad Request', message: 'Health record ID is required' },
            { status: 400 }
          );
        }
        await invalidateHealthRecordData(body.resourceId, body.studentId);
        revalidated.push(`healthRecord/${body.resourceId}`);
        break;

      case 'medication':
        if (!body.resourceId) {
          return NextResponse.json(
            { error: 'Bad Request', message: 'Medication ID is required' },
            { status: 400 }
          );
        }
        await invalidateMedicationData(body.resourceId, body.studentId);
        revalidated.push(`medication/${body.resourceId}`);
        break;

      case 'incident':
        if (!body.resourceId) {
          return NextResponse.json(
            { error: 'Bad Request', message: 'Incident ID is required' },
            { status: 400 }
          );
        }
        await invalidateIncidentData(body.resourceId, body.studentId);
        revalidated.push(`incident/${body.resourceId}`);
        break;

      case 'batch':
        if (!body.resources || !Array.isArray(body.resources)) {
          return NextResponse.json(
            { error: 'Bad Request', message: 'Resources array is required for batch revalidation' },
            { status: 400 }
          );
        }
        await batchInvalidate(body.resources);
        revalidated = body.resources.map(r =>
          r.id ? `${r.type}/${r.id}` : r.type
        );
        break;

      case 'all':
        await invalidateAll();
        revalidated.push('ALL CACHES');
        break;

      default:
        return NextResponse.json(
          { error: 'Bad Request', message: `Invalid revalidation type: ${body.type}` },
          { status: 400 }
        );
    }

    // Audit log cache revalidation
    const auditContext = createAuditContext(request, auth.user.userId);
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.SYSTEM_CHANGE,
      resource: 'CacheRevalidation',
      details: `Cache revalidation performed: type=${body.type}, revalidated=[${revalidated.join(', ')}]`
    });

    return NextResponse.json({
      success: true,
      message: 'Cache revalidation completed',
      revalidated,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error during cache revalidation:', error);

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to revalidate cache',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});
