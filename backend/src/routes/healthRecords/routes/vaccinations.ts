/**
 * Vaccinations Routes
 * Purpose: Route definitions for vaccination records and compliance tracking
 * Note: PHI-protected endpoints with immunization compliance and school requirements
 */

import { ServerRoute } from '@hapi/hapi';
import * as handlers from '../handlers/vaccinations';
import * as schemas from '../validationSchemas';

export const vaccinationsRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/health-records/student/{studentId}/vaccinations',
    handler: handlers.getVaccinationRecordsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vaccinations'],
      description: 'Get vaccination records for student',
      notes: '**PHI PROTECTED ENDPOINT** - Returns complete immunization history.',
      validate: {
        params: schemas.studentIdParam
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Vaccinations retrieved successfully' },
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
    path: '/api/health-records/vaccinations/{id}',
    handler: handlers.getVaccinationByIdHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vaccinations'],
      description: 'Get single vaccination by ID',
      notes: '**PHI PROTECTED ENDPOINT** - Retrieves specific vaccination record with lot numbers and reactions.',
      validate: {
        params: schemas.recordIdParam
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Vaccination retrieved successfully' },
            '404': { description: 'Vaccination not found' },
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
    path: '/api/health-records/vaccinations',
    handler: handlers.createVaccinationHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vaccinations'],
      description: 'Create vaccination record',
      notes: '**PHI PROTECTED ENDPOINT** - Documents vaccine administration. Requires NURSE or ADMIN role.',
      validate: {
        payload: schemas.createVaccinationPayload
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': { description: 'Vaccination created successfully' },
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
    path: '/api/health-records/vaccinations/{id}',
    handler: handlers.updateVaccinationHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vaccinations'],
      description: 'Update vaccination record',
      notes: '**PHI PROTECTED ENDPOINT** - Updates vaccination details or reaction information. All changes audited.',
      validate: {
        params: schemas.recordIdParam,
        payload: schemas.updateVaccinationPayload
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Vaccination updated successfully' },
            '400': { description: 'Invalid input data' },
            '401': { description: 'Authentication required' },
            '404': { description: 'Vaccination not found' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/health-records/vaccinations/{id}',
    handler: handlers.deleteVaccinationHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vaccinations'],
      description: 'Delete vaccination record',
      notes: '**PHI PROTECTED ENDPOINT** - Soft deletes vaccination. Requires ADMIN or NURSE role.',
      validate: {
        params: schemas.recordIdParam
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Vaccination deleted successfully' },
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
    path: '/api/health-records/student/{studentId}/vaccinations/compliance',
    handler: handlers.checkVaccinationComplianceHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vaccinations'],
      description: 'Check vaccination compliance',
      notes: '**COMPLIANCE ENDPOINT** - Validates student meets school immunization requirements.',
      validate: {
        params: schemas.studentIdParam
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Compliance check completed' },
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
    path: '/api/health-records/student/{studentId}/vaccinations/upcoming',
    handler: handlers.getUpcomingVaccinationsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vaccinations'],
      description: 'Get upcoming vaccinations',
      notes: '**PHI PROTECTED ENDPOINT** - Returns scheduled/due vaccinations.',
      validate: {
        params: schemas.studentIdParam,
        query: schemas.upcomingVaccinationsQuery
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Upcoming vaccinations retrieved successfully' },
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
    path: '/api/health-records/student/{studentId}/vaccinations/report',
    handler: handlers.getVaccinationReportHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vaccinations'],
      description: 'Get vaccination report for student',
      notes: '**PHI PROTECTED ENDPOINT** - Generates immunization compliance report for school enrollment.',
      validate: {
        params: schemas.studentIdParam,
        query: schemas.exportHealthRecordsQuery
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Report generated successfully' },
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
    path: '/api/health-records/vaccinations/statistics/{schoolId}',
    handler: handlers.getVaccinationStatsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vaccinations'],
      description: 'Get vaccination statistics for school',
      notes: '**AGGREGATED PHI ENDPOINT** - School-wide vaccination compliance statistics.',
      validate: {
        params: schemas.schoolIdParam
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
