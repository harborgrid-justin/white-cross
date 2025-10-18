/**
 * Screenings Routes
 * Purpose: Route definitions for health screenings (vision, hearing, dental, scoliosis, BMI, mental health)
 * Note: PHI-protected endpoints with follow-up tracking and referral management
 */

import { ServerRoute } from '@hapi/hapi';
import * as handlers from '../handlers/screenings';
import * as schemas from '../validationSchemas';

export const screeningsRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/health-records/student/{studentId}/screenings',
    handler: handlers.getStudentScreeningsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Screenings'],
      description: 'Get screenings for student',
      notes: '**PHI PROTECTED ENDPOINT** - Returns all screening records with optional type filtering.',
      validate: {
        params: schemas.studentIdParam,
        query: schemas.screeningsQuery
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Screenings retrieved successfully' },
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
    path: '/api/health-records/screenings/{id}',
    handler: handlers.getScreeningByIdHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Screenings'],
      description: 'Get single screening by ID',
      notes: '**PHI PROTECTED ENDPOINT** - Retrieves specific screening record with results and follow-up.',
      validate: {
        params: schemas.recordIdParam
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Screening retrieved successfully' },
            '404': { description: 'Screening not found' },
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
    path: '/api/health-records/screenings',
    handler: handlers.createScreeningHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Screenings'],
      description: 'Create screening record',
      notes: '**PHI PROTECTED ENDPOINT** - Documents screening results. Requires NURSE or ADMIN role.',
      validate: {
        payload: schemas.createScreeningPayload
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': { description: 'Screening created successfully' },
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
    path: '/api/health-records/screenings/{id}',
    handler: handlers.updateScreeningHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Screenings'],
      description: 'Update screening record',
      notes: '**PHI PROTECTED ENDPOINT** - Updates screening details or follow-up information.',
      validate: {
        params: schemas.recordIdParam,
        payload: schemas.updateScreeningPayload
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Screening updated successfully' },
            '400': { description: 'Invalid input data' },
            '401': { description: 'Authentication required' },
            '404': { description: 'Screening not found' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/health-records/screenings/{id}',
    handler: handlers.deleteScreeningHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Screenings'],
      description: 'Delete screening record',
      notes: '**PHI PROTECTED ENDPOINT** - Soft deletes screening. Requires ADMIN or NURSE role.',
      validate: {
        params: schemas.recordIdParam
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Screening deleted successfully' },
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
    path: '/api/health-records/screenings/due',
    handler: handlers.getScreeningsDueHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Screenings'],
      description: 'Get screenings due for follow-up',
      notes: '**PHI PROTECTED ENDPOINT** - Returns screenings requiring referrals or re-testing.',
      validate: {
        query: schemas.conditionsDueQuery
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Screenings retrieved successfully' },
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
    path: '/api/health-records/screenings/statistics',
    handler: handlers.getScreeningStatsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Screenings'],
      description: 'Get screening statistics',
      notes: '**AGGREGATED PHI ENDPOINT** - School-wide screening completion and referral statistics.',
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
