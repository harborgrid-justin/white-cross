/**
 * Allergies Routes
 * Purpose: Route definitions for allergy management endpoints
 * Note: Critical PHI data - all routes require JWT auth and comprehensive audit logging
 */

import { ServerRoute } from '@hapi/hapi';
import * as handlers from '../handlers/allergies';
import * as schemas from '../validationSchemas';

export const allergiesRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/health-records/student/{studentId}/allergies',
    handler: handlers.getStudentAllergiesHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Allergies'],
      description: 'Get all allergies for a student',
      notes: '**PHI PROTECTED ENDPOINT** - Returns all documented allergies. Critical for medication safety.',
      validate: {
        params: schemas.studentIdParam
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Allergies retrieved successfully' },
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
    path: '/api/health-records/allergies/{id}',
    handler: handlers.getAllergyByIdHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Allergies'],
      description: 'Get single allergy by ID',
      notes: '**PHI PROTECTED ENDPOINT** - Retrieves specific allergy record.',
      validate: {
        params: schemas.recordIdParam
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Allergy retrieved successfully' },
            '404': { description: 'Allergy not found' },
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
    path: '/api/health-records/allergies',
    handler: handlers.addAllergyHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Allergies'],
      description: 'Add new allergy to student record',
      notes: '**PHI PROTECTED ENDPOINT** - Creates new allergy record. Severity must be documented. Requires NURSE or ADMIN role.',
      validate: {
        payload: schemas.addAllergyPayload
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': { description: 'Allergy created successfully' },
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
    path: '/api/health-records/allergies/{id}',
    handler: handlers.updateAllergyHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Allergies'],
      description: 'Update allergy record',
      notes: '**PHI PROTECTED ENDPOINT** - Updates allergy details. All changes are audited.',
      validate: {
        params: schemas.recordIdParam,
        payload: schemas.updateAllergyPayload
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Allergy updated successfully' },
            '400': { description: 'Invalid input data' },
            '401': { description: 'Authentication required' },
            '404': { description: 'Allergy not found' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/health-records/allergies/{id}',
    handler: handlers.deleteAllergyHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Allergies'],
      description: 'Delete allergy record',
      notes: '**PHI PROTECTED ENDPOINT** - Soft deletes allergy. Requires ADMIN or NURSE role.',
      validate: {
        params: schemas.recordIdParam
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Allergy deleted successfully' },
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
    method: 'POST',
    path: '/api/health-records/allergies/{id}/verify',
    handler: handlers.verifyAllergyHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Allergies'],
      description: 'Verify allergy by healthcare provider',
      notes: '**PHI PROTECTED ENDPOINT** - Marks allergy as medically verified. Requires NURSE or higher role.',
      validate: {
        params: schemas.recordIdParam
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Allergy verified successfully' },
            '400': { description: 'Verification failed' },
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
    path: '/api/health-records/student/{studentId}/allergies/critical',
    handler: handlers.getCriticalAllergiesHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Allergies'],
      description: 'Get critical allergies (SEVERE or LIFE_THREATENING)',
      notes: '**CRITICAL PHI ENDPOINT** - Returns high-severity allergies requiring immediate awareness.',
      validate: {
        params: schemas.studentIdParam
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Critical allergies retrieved successfully' },
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
    path: '/api/health-records/allergies/check-contraindications',
    handler: handlers.checkContraindicationsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Allergies'],
      description: 'Check medication contraindications',
      notes: '**CRITICAL SAFETY ENDPOINT** - Checks for allergy-medication interactions before administration.',
      validate: {
        payload: schemas.contraindicationsPayload
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Contraindication check completed' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  }
];
