/**
 * LOC: 7CDF1FF8F0
 * Vital Signs Routes
 *
 * UPSTREAM (imports from):
 *   - vitalSigns.ts (routes/healthRecords/handlers/vitalSigns.ts)
 *   - validationSchemas.ts (routes/healthRecords/validationSchemas.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (routes/healthRecords/index.ts)
 */

/**
 * Vital Signs Routes
 * Purpose: Route definitions for vital signs recording and trend analysis
 * Note: PHI-protected endpoints with anomaly detection for concerning patterns
 */

import { ServerRoute } from '@hapi/hapi';
import * as handlers from '../handlers/vitalSigns';
import * as schemas from '../validationSchemas';

export const vitalSignsRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/health-records/student/{studentId}/vital-signs',
    handler: handlers.getVitalSignsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vital Signs'],
      description: 'Get vital signs for student',
      notes: '**PHI PROTECTED ENDPOINT** - Returns recent vital signs history with configurable limit.',
      validate: {
        params: schemas.studentIdParam,
        query: schemas.vitalSignsQuery
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Vital signs retrieved successfully' },
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
    path: '/api/health-records/vital-signs/{id}',
    handler: handlers.getVitalSignsByIdHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vital Signs'],
      description: 'Get single vital signs record by ID',
      notes: '**PHI PROTECTED ENDPOINT** - Retrieves specific vital signs measurement.',
      validate: {
        params: schemas.recordIdParam
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Vital signs retrieved successfully' },
            '404': { description: 'Vital signs not found' },
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
    path: '/api/health-records/vital-signs',
    handler: handlers.createVitalSignsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vital Signs'],
      description: 'Create vital signs record',
      notes: '**PHI PROTECTED ENDPOINT** - Documents vital signs during nurse visit. Requires NURSE or ADMIN role.',
      validate: {
        payload: schemas.createVitalSignsPayload
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': { description: 'Vital signs created successfully' },
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
    method: 'GET',
    path: '/api/health-records/student/{studentId}/vital-signs/latest',
    handler: handlers.getLatestVitalsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vital Signs'],
      description: 'Get latest vital signs for student',
      notes: '**PHI PROTECTED ENDPOINT** - Returns most recent vital signs measurement.',
      validate: {
        params: schemas.studentIdParam
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Latest vital signs retrieved successfully' },
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
    path: '/api/health-records/student/{studentId}/vital-trends',
    handler: handlers.getVitalTrendsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vital Signs'],
      description: 'Get vital signs trends',
      notes: '**PHI PROTECTED ENDPOINT** - Analyzes vital signs patterns over time for anomaly detection.',
      validate: {
        params: schemas.studentIdParam,
        query: schemas.vitalTrendsQuery
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Vital signs trends retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  }
];
