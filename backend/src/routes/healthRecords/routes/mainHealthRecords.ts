/**
 * LOC: 2AE6F37774
 * Main Health Records Routes
 *
 * UPSTREAM (imports from):
 *   - mainHealthRecords.ts (routes/healthRecords/handlers/mainHealthRecords.ts)
 *   - validationSchemas.ts (routes/healthRecords/validationSchemas.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (routes/healthRecords/index.ts)
 */

/**
 * Main Health Records Routes
 * Purpose: Route definitions for core health records CRUD operations
 * Note: All routes are JWT-protected and PHI-compliant with Swagger documentation
 */

import { ServerRoute } from '@hapi/hapi';
import * as handlers from '../handlers/mainHealthRecords';
import * as schemas from '../validationSchemas';

/**
 * Main health records route definitions
 * All endpoints require JWT authentication and are audited for HIPAA compliance
 */
export const mainHealthRecordsRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/health-records/student/{studentId}',
    handler: handlers.getStudentHealthRecordsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records'],
      description: 'List all health records for a student',
      notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Returns all health records for a student with filtering and pagination. All access is logged and audited.',
      validate: {
        params: schemas.studentIdParam,
        query: schemas.healthRecordsQuery
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Health records retrieved successfully' },
            '401': { description: 'Authentication required' },
            '403': { description: 'Insufficient permissions' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/{id}',
    handler: handlers.getHealthRecordByIdHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records'],
      description: 'Get single health record by ID',
      notes: '**PHI PROTECTED ENDPOINT** - Retrieves a specific health record. Access is logged.',
      validate: {
        params: schemas.recordIdParam
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Health record retrieved successfully' },
            '404': { description: 'Health record not found' },
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
    path: '/api/health-records',
    handler: handlers.createHealthRecordHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records'],
      description: 'Create new health record',
      notes: '**PHI PROTECTED ENDPOINT** - Creates a new health record. Requires NURSE or ADMIN role. All creations are audited.',
      validate: {
        payload: schemas.createHealthRecordPayload
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': { description: 'Health record created successfully' },
            '400': { description: 'Invalid input data' },
            '401': { description: 'Authentication required' },
            '403': { description: 'Insufficient permissions' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/health-records/{id}',
    handler: handlers.updateHealthRecordHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records'],
      description: 'Update health record',
      notes: '**PHI PROTECTED ENDPOINT** - Updates an existing health record. All modifications are audited.',
      validate: {
        params: schemas.recordIdParam,
        payload: schemas.updateHealthRecordPayload
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Health record updated successfully' },
            '400': { description: 'Invalid input data' },
            '401': { description: 'Authentication required' },
            '404': { description: 'Health record not found' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/health-records/{id}',
    handler: handlers.deleteHealthRecordHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records'],
      description: 'Delete health record',
      notes: '**PHI PROTECTED ENDPOINT** - Soft deletes a health record. Requires ADMIN or NURSE role. All deletions are audited.',
      validate: {
        params: schemas.recordIdParam
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Health record deleted successfully' },
            '400': { description: 'Delete operation failed' },
            '401': { description: 'Authentication required' },
            '403': { description: 'Insufficient permissions' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/student/{studentId}/timeline',
    handler: handlers.getHealthTimelineHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records'],
      description: 'Get health record timeline for student',
      notes: '**PHI PROTECTED ENDPOINT** - Returns chronological timeline of all health events for a student.',
      validate: {
        params: schemas.studentIdParam,
        query: schemas.healthTimelineQuery
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Timeline retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/student/{studentId}/summary',
    handler: handlers.getHealthSummaryHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records'],
      description: 'Get comprehensive health summary for student',
      notes: '**PHI PROTECTED ENDPOINT** - Returns comprehensive health summary including allergies, conditions, vaccinations, and recent visits.',
      validate: {
        params: schemas.studentIdParam
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Health summary retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/student/{studentId}/export',
    handler: handlers.exportHealthRecordsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records'],
      description: 'Export student health records',
      notes: '**PHI PROTECTED ENDPOINT** - Exports complete health record. Rate limited. All exports are audited.',
      validate: {
        params: schemas.studentIdParam,
        query: schemas.exportHealthRecordsQuery
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Export completed successfully' },
            '401': { description: 'Authentication required' },
            '501': { description: 'Format not yet implemented' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/statistics',
    handler: handlers.getHealthRecordStatisticsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records'],
      description: 'Get health records statistics',
      notes: '**AGGREGATED PHI ENDPOINT** - Returns system-wide health records statistics. Requires ADMIN or DISTRICT_ADMIN role.',
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Statistics retrieved successfully' },
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
