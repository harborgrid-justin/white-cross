/**
 * LOC: BD2E2442B0
 * Growth Measurements Routes
 *
 * UPSTREAM (imports from):
 *   - growthMeasurements.ts (routes/healthRecords/handlers/growthMeasurements.ts)
 *   - validationSchemas.ts (routes/healthRecords/validationSchemas.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (routes/healthRecords/index.ts)
 */

/**
 * Growth Measurements Routes
 * Purpose: Route definitions for growth tracking (height, weight, BMI, head circumference)
 * Note: PHI-protected endpoints with growth trend analysis and concern detection
 */

import { ServerRoute } from '@hapi/hapi';
import * as handlers from '../handlers/growthMeasurements';
import * as schemas from '../validationSchemas';

export const growthMeasurementsRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/health-records/student/{studentId}/growth-measurements',
    handler: handlers.getGrowthMeasurementsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Growth Measurements'],
      description: 'Get growth measurements for student',
      notes: '**PHI PROTECTED ENDPOINT** - Returns complete growth history for charting and percentile analysis.',
      validate: {
        params: schemas.studentIdParam
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Growth measurements retrieved successfully' },
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
    path: '/api/health-records/growth-measurements/{id}',
    handler: handlers.getGrowthMeasurementByIdHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Growth Measurements'],
      description: 'Get single growth measurement by ID',
      notes: '**PHI PROTECTED ENDPOINT** - Retrieves specific growth measurement with all metrics.',
      validate: {
        params: schemas.recordIdParam
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Growth measurement retrieved successfully' },
            '404': { description: 'Growth measurement not found' },
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
    path: '/api/health-records/growth-measurements',
    handler: handlers.createGrowthMeasurementHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Growth Measurements'],
      description: 'Create growth measurement',
      notes: '**PHI PROTECTED ENDPOINT** - Records new growth measurements with BMI calculation. Requires NURSE or ADMIN role.',
      validate: {
        payload: schemas.createGrowthMeasurementPayload
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': { description: 'Growth measurement created successfully' },
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
    path: '/api/health-records/growth-measurements/{id}',
    handler: handlers.updateGrowthMeasurementHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Growth Measurements'],
      description: 'Update growth measurement',
      notes: '**PHI PROTECTED ENDPOINT** - Updates measurement values and recalculates BMI if needed.',
      validate: {
        params: schemas.recordIdParam,
        payload: schemas.updateGrowthMeasurementPayload
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Growth measurement updated successfully' },
            '400': { description: 'Invalid input data' },
            '401': { description: 'Authentication required' },
            '404': { description: 'Growth measurement not found' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/health-records/growth-measurements/{id}',
    handler: handlers.deleteGrowthMeasurementHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Growth Measurements'],
      description: 'Delete growth measurement',
      notes: '**PHI PROTECTED ENDPOINT** - Soft deletes growth measurement. Requires ADMIN or NURSE role.',
      validate: {
        params: schemas.recordIdParam
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Growth measurement deleted successfully' },
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
    path: '/api/health-records/student/{studentId}/growth-trends',
    handler: handlers.getGrowthTrendsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Growth Measurements'],
      description: 'Get growth trends for student',
      notes: '**PHI PROTECTED ENDPOINT** - Analyzes growth patterns and percentile tracking over time.',
      validate: {
        params: schemas.studentIdParam,
        query: schemas.growthTrendsQuery
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Growth trends retrieved successfully' },
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
    path: '/api/health-records/student/{studentId}/growth-concerns',
    handler: handlers.getGrowthConcernsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Growth Measurements'],
      description: 'Get growth concerns for student',
      notes: '**PHI PROTECTED ENDPOINT** - Identifies potential growth issues requiring medical attention.',
      validate: {
        params: schemas.studentIdParam
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Growth concerns retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  }
];
