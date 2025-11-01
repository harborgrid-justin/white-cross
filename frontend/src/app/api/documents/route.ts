/**
 * @fileoverview Documents API Root Endpoint
 *
 * Provides document management capabilities for the healthcare platform.
 * This endpoint handles document listing, search, metadata management,
 * and document lifecycle operations.
 *
 * @module api/documents
 * @category Documents
 * @subcategory Main Routes
 *
 * **Key Features:**
 * - Document listing and search functionality
 * - Document metadata management
 * - Document categorization and tagging
 * - Document lifecycle tracking (created, updated, archived)
 * - Bulk document operations
 *
 * **Security:**
 * - Authentication required for all operations
 * - Role-based access control for document visibility
 * - PHI protection for healthcare documents
 * - Audit logging for all document access
 *
 * **HIPAA Compliance:**
 * - All document access is audit logged
 * - PHI-containing documents require special handling
 * - Secure document transmission and storage
 * - Document retention and disposal policies
 *
 * @since 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { createAuditContext, logPHIAccess } from '@/lib/audit';

/**
 * GET /api/documents
 *
 * Retrieves a paginated list of documents with search and filtering capabilities.
 * Returns document metadata including title, type, creation date, and access permissions.
 *
 * @async
 * @param {NextRequest} request - Next.js request object with optional query parameters
 * @param {Object} context - Route context
 * @param {Object} auth - Authenticated user context
 * @param {Object} auth.user - User information from JWT
 * @param {string} auth.user.userId - User ID
 * @param {string} auth.user.role - User role
 *
 * @returns {Promise<NextResponse>} JSON response with document list
 * @returns {Object} response.data - Document listing data
 * @returns {Array} response.data.documents - Array of document objects
 * @returns {string} response.data.documents[].id - Document ID
 * @returns {string} response.data.documents[].title - Document title
 * @returns {string} response.data.documents[].type - Document type/category
 * @returns {string} response.data.documents[].fileName - Original file name
 * @returns {number} response.data.documents[].size - File size in bytes
 * @returns {string} response.data.documents[].uploadedBy - User who uploaded the document
 * @returns {string} response.data.documents[].createdAt - Creation timestamp
 * @returns {string} response.data.documents[].updatedAt - Last update timestamp
 * @returns {Object} response.data.pagination - Pagination information
 * @returns {number} response.data.pagination.page - Current page number
 * @returns {number} response.data.pagination.limit - Items per page
 * @returns {number} response.data.pagination.total - Total document count
 * @returns {number} response.data.pagination.pages - Total page count
 *
 * @throws {401} Unauthorized - Authentication required
 * @throws {500} Internal Server Error - Server error during retrieval
 *
 * @example
 * // List documents with pagination
 * GET /api/documents?page=1&limit=20&type=medical&search=allergy
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 * // Response (200 OK)
 * {
 *   "data": {
 *     "documents": [
 *       {
 *         "id": "doc-123",
 *         "title": "Student Allergy Information",
 *         "type": "medical",
 *         "fileName": "allergy-info.pdf",
 *         "size": 1048576,
 *         "uploadedBy": "nurse@school.edu",
 *         "createdAt": "2025-10-31T10:00:00Z",
 *         "updatedAt": "2025-10-31T10:00:00Z"
 *       }
 *     ],
 *     "pagination": {
 *       "page": 1,
 *       "limit": 20,
 *       "total": 150,
 *       "pages": 8
 *     }
 *   }
 * }
 *
 * @method GET
 * @access Authenticated
 * @auditLog Document listing access is logged
 */
export const GET = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Proxy request to backend with caching
    const response = await proxyToBackend(request, '/documents', {
      cache: {
        revalidate: 60, // Cache for 1 minute (document lists change moderately)
        tags: ['documents', 'document-list']
      }
    });

    const data = await response.json();

    // Audit log document listing access
    const auditContext = createAuditContext(request, auth.user.userId);
    await logPHIAccess({
      ...auditContext,
      action: 'VIEW',
      resource: 'DocumentList',
      details: `Document list accessed, count: ${data.data?.documents?.length || 0}`
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching documents:', error);

    return NextResponse.json(
      { 
        error: 'Failed to fetch documents',
        message: 'Unable to retrieve document list'
      },
      { status: 500 }
    );
  }
});

/**
 * POST /api/documents
 *
 * Creates a new document record or updates document metadata.
 * This endpoint handles document metadata operations, not file uploads
 * (use /api/documents/upload for file uploads).
 *
 * @async
 * @param {NextRequest} request - Next.js request object with document data
 * @param {Object} context - Route context
 * @param {Object} auth - Authenticated user context
 *
 * @returns {Promise<NextResponse>} JSON response with created document data
 *
 * @throws {401} Unauthorized - Authentication required
 * @throws {403} Forbidden - Insufficient permissions for document creation
 * @throws {400} Bad Request - Invalid document data
 * @throws {500} Internal Server Error - Server error during creation
 *
 * @method POST
 * @access Authenticated (NURSE or higher for medical documents)
 * @auditLog Document creation is logged
 */
export const POST = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Parse request body to check document type for permission validation
    const body = await request.json();
    const documentType = body.type || 'general';

    // Check permissions for medical documents
    if (documentType === 'medical' || documentType === 'health') {
      const allowedRoles = ['ADMIN', 'SCHOOL_ADMIN', 'NURSE'];
      if (!allowedRoles.includes(auth.user.role)) {
        return NextResponse.json(
          { 
            error: 'Forbidden', 
            message: 'Insufficient permissions for medical document creation' 
          },
          { status: 403 }
        );
      }
    }

    // Proxy request to backend with the original body
    const response = await proxyToBackend(request, '/documents', {
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (response.status === 200 || response.status === 201) {
      // Audit log document creation
      const auditContext = createAuditContext(request, auth.user.userId);
      await logPHIAccess({
        ...auditContext,
        action: 'CREATE',
        resource: 'Document',
        resourceId: data.data?.id,
        details: `Document created: ${body.title || 'Untitled'}, type: ${documentType}`
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating document:', error);

    return NextResponse.json(
      { 
        error: 'Failed to create document',
        message: 'Unable to create document record'
      },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/documents
 *
 * Bulk delete documents by IDs. Requires appropriate permissions
 * and performs soft deletion with audit trail.
 *
 * @async
 * @param {NextRequest} request - Next.js request object with document IDs
 * @param {Object} context - Route context
 * @param {Object} auth - Authenticated user context
 *
 * @returns {Promise<NextResponse>} JSON response with deletion results
 *
 * @throws {401} Unauthorized - Authentication required
 * @throws {403} Forbidden - Insufficient permissions for document deletion
 * @throws {400} Bad Request - Invalid document IDs
 * @throws {500} Internal Server Error - Server error during deletion
 *
 * @method DELETE
 * @access Admin Only (for bulk operations)
 * @auditLog All document deletions are logged
 */
export const DELETE = withAuth(async (request: NextRequest, _context, auth) => {
  try {
    // Check admin permissions for bulk delete
    const allowedRoles = ['ADMIN', 'SCHOOL_ADMIN'];
    if (!allowedRoles.includes(auth.user.role)) {
      return NextResponse.json(
        { 
          error: 'Forbidden', 
          message: 'Administrative privileges required for bulk document deletion' 
        },
        { status: 403 }
      );
    }

    // Proxy request to backend
    const response = await proxyToBackend(request, '/documents');

    const data = await response.json();

    if (response.status === 200 || response.status === 204) {
      // Audit log bulk deletion
      const auditContext = createAuditContext(request, auth.user.userId);
      await logPHIAccess({
        ...auditContext,
        action: 'DELETE',
        resource: 'DocumentBulk',
        details: `Bulk document deletion performed, count: ${data.deletedCount || 'unknown'}`
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error deleting documents:', error);

    return NextResponse.json(
      { 
        error: 'Failed to delete documents',
        message: 'Unable to complete bulk document deletion'
      },
      { status: 500 }
    );
  }
});