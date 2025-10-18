/**
 * LOC: AD34A8F353
 * Search and Utility Routes
 *
 * UPSTREAM (imports from):
 *   - searchAndUtility.ts (routes/healthRecords/handlers/searchAndUtility.ts)
 *   - validationSchemas.ts (routes/healthRecords/validationSchemas.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (routes/healthRecords/index.ts)
 */

/**
 * Search and Utility Routes
 * Purpose: Route definitions for cross-record search, bulk operations, and data import/export
 * Note: Enhanced security for bulk operations with comprehensive audit logging
 */

import { ServerRoute } from '@hapi/hapi';
import * as handlers from '../handlers/searchAndUtility';
import * as schemas from '../validationSchemas';

export const searchAndUtilityRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/health-records/search',
    handler: handlers.searchHealthRecordsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Search'],
      description: 'Search health records',
      notes: '**PHI PROTECTED ENDPOINT** - Full-text search across all health records with type filtering and pagination.',
      validate: {
        query: schemas.searchQuery
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Search completed successfully' },
            '400': { description: 'Invalid search query' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/health-records/bulk-delete',
    handler: handlers.bulkDeleteHealthRecordsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Bulk Operations'],
      description: 'Bulk delete health records',
      notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Mass deletion requires ADMIN role and comprehensive audit logging. Use with extreme caution.',
      validate: {
        payload: schemas.bulkDeletePayload
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Bulk delete completed successfully' },
            '400': { description: 'Invalid record IDs' },
            '401': { description: 'Authentication required' },
            '403': { description: 'Insufficient permissions - ADMIN required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/health-records/student/{studentId}/import',
    handler: handlers.importHealthRecordsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Import/Export'],
      description: 'Import health records',
      notes: '**PHI PROTECTED ENDPOINT** - Bulk import from external systems (EHR, SIS integration). Requires ADMIN or DISTRICT_ADMIN role.',
      validate: {
        params: schemas.studentIdParam,
        payload: schemas.importHealthRecordsPayload
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Import completed successfully' },
            '400': { description: 'Invalid import data format' },
            '401': { description: 'Authentication required' },
            '403': { description: 'Insufficient permissions' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  }
];
