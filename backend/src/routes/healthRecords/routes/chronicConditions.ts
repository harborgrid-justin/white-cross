/**
 * LOC: 6819AEE9E4
 * Chronic Conditions Routes
 *
 * UPSTREAM (imports from):
 *   - chronicConditions.ts (routes/healthRecords/handlers/chronicConditions.ts)
 *   - validationSchemas.ts (routes/healthRecords/validationSchemas.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (routes/healthRecords/index.ts)
 */

/**
 * Chronic Conditions Routes
 * Purpose: Route definitions for chronic condition management with care plans
 * Note: PHI-protected endpoints with care management and review scheduling
 */

import { ServerRoute } from '@hapi/hapi';
import * as handlers from '../handlers/chronicConditions';
import * as schemas from '../validationSchemas';

export const chronicConditionsRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/health-records/student/{studentId}/chronic-conditions',
    handler: handlers.getStudentChronicConditionsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Chronic Conditions'],
      description: 'Get all chronic conditions for a student',
      notes: '**PHI PROTECTED ENDPOINT** - Returns all documented chronic conditions with care plans.',
      validate: {
        params: schemas.studentIdParam
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Chronic conditions retrieved successfully' },
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
    path: '/api/health-records/chronic-conditions/{id}',
    handler: handlers.getChronicConditionByIdHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Chronic Conditions'],
      description: 'Get single chronic condition by ID',
      notes: '**PHI PROTECTED ENDPOINT** - Retrieves specific condition with full care plan details.',
      validate: {
        params: schemas.recordIdParam
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Chronic condition retrieved successfully' },
            '404': { description: 'Chronic condition not found' },
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
    path: '/api/health-records/chronic-conditions',
    handler: handlers.addChronicConditionHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Chronic Conditions'],
      description: 'Add new chronic condition',
      notes: '**PHI PROTECTED ENDPOINT** - Creates condition record with care plan. Requires NURSE or ADMIN role.',
      validate: {
        payload: schemas.addChronicConditionPayload
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': { description: 'Chronic condition created successfully' },
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
    path: '/api/health-records/chronic-conditions/{id}',
    handler: handlers.updateChronicConditionHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Chronic Conditions'],
      description: 'Update chronic condition',
      notes: '**PHI PROTECTED ENDPOINT** - Updates condition details, care plan, or review dates. All changes audited.',
      validate: {
        params: schemas.recordIdParam,
        payload: schemas.updateChronicConditionPayload
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Chronic condition updated successfully' },
            '400': { description: 'Invalid input data' },
            '401': { description: 'Authentication required' },
            '404': { description: 'Chronic condition not found' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/health-records/chronic-conditions/{id}',
    handler: handlers.deleteChronicConditionHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Chronic Conditions'],
      description: 'Delete chronic condition',
      notes: '**PHI PROTECTED ENDPOINT** - Soft deletes condition record. Requires ADMIN or NURSE role.',
      validate: {
        params: schemas.recordIdParam
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Chronic condition deleted successfully' },
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
    method: 'PATCH',
    path: '/api/health-records/chronic-conditions/{id}/status',
    handler: handlers.updateChronicConditionStatusHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Chronic Conditions'],
      description: 'Update chronic condition status',
      notes: '**PHI PROTECTED ENDPOINT** - Updates status (ACTIVE, MANAGED, RESOLVED, INACTIVE).',
      validate: {
        params: schemas.recordIdParam,
        payload: schemas.updateConditionStatusPayload
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Status updated successfully' },
            '400': { description: 'Invalid status value' },
            '401': { description: 'Authentication required' },
            '404': { description: 'Chronic condition not found' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/chronic-conditions/due-for-review',
    handler: handlers.getConditionsDueForReviewHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Chronic Conditions'],
      description: 'Get conditions due for review',
      notes: '**PHI PROTECTED ENDPOINT** - Returns conditions needing scheduled medical review.',
      validate: {
        query: schemas.conditionsDueQuery
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Conditions retrieved successfully' },
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
    path: '/api/health-records/chronic-conditions/statistics',
    handler: handlers.getChronicConditionsStatsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Chronic Conditions'],
      description: 'Get chronic conditions statistics',
      notes: '**AGGREGATED PHI ENDPOINT** - School/district-wide condition statistics. Requires appropriate permissions.',
      validate: {
        query: schemas.schoolIdQuery
      },
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
