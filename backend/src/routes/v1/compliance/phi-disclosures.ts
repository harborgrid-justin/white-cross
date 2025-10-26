import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import { PHIDisclosureService } from '@/services/compliance/PHIDisclosureService';
import { DisclosureType, DisclosurePurpose, DisclosureMethod, RecipientType } from '@/database/models/compliance/PHIDisclosure';

const phiDisclosureService = new PHIDisclosureService();

/**
 * PHI Disclosure Routes
 * Feature 30: PHI Disclosure Tracking
 * HIPAA §164.528 - Accounting of Disclosures
 */
const phiDisclosureRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/api/v1/compliance/phi-disclosures',
    options: {
      auth: 'jwt',
      description: 'Create a new PHI disclosure record',
      notes: 'Records a disclosure of Protected Health Information with full audit trail',
      tags: ['api', 'compliance', 'phi'],
      validate: {
        payload: Joi.object({
          studentId: Joi.string().uuid().required(),
          disclosureType: Joi.string()
            .valid(...Object.values(DisclosureType))
            .required(),
          purpose: Joi.string()
            .valid(...Object.values(DisclosurePurpose))
            .required(),
          method: Joi.string()
            .valid(...Object.values(DisclosureMethod))
            .required(),
          disclosureDate: Joi.date().required(),
          informationDisclosed: Joi.array().items(Joi.string()).required(),
          minimumNecessary: Joi.string().min(10).required(),
          recipientType: Joi.string()
            .valid(...Object.values(RecipientType))
            .required(),
          recipientName: Joi.string().required(),
          recipientOrganization: Joi.string().optional(),
          recipientAddress: Joi.string().optional(),
          recipientPhone: Joi.string().optional(),
          recipientEmail: Joi.string().email().optional(),
          authorizationObtained: Joi.boolean().required(),
          authorizationDate: Joi.date().optional(),
          authorizationExpiryDate: Joi.date().optional(),
          patientRequested: Joi.boolean().required(),
          followUpRequired: Joi.boolean().required(),
          followUpDate: Joi.date().optional(),
          notes: Joi.string().optional(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const userId = request.auth.credentials.userId;
        const ipAddress = request.info.remoteAddress;
        const userAgent = request.headers['user-agent'];

        const disclosure = await phiDisclosureService.createDisclosure(
          request.payload as any,
          userId,
          ipAddress,
          userAgent
        );

        return h.response(disclosure).code(201);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/compliance/phi-disclosures',
    options: {
      auth: 'jwt',
      description: 'Get PHI disclosures with filtering and pagination',
      notes: 'Returns paginated list of PHI disclosures with optional filters',
      tags: ['api', 'compliance', 'phi'],
      validate: {
        query: Joi.object({
          studentId: Joi.string().uuid().optional(),
          dateFrom: Joi.date().optional(),
          dateTo: Joi.date().optional(),
          purpose: Joi.string()
            .valid(...Object.values(DisclosurePurpose))
            .optional(),
          disclosureType: Joi.string()
            .valid(...Object.values(DisclosureType))
            .optional(),
          limit: Joi.number().integer().min(1).max(100).default(20),
          offset: Joi.number().integer().min(0).default(0),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const filters = request.query;
        const result = await phiDisclosureService.getDisclosures(filters);
        return h.response(result).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/compliance/phi-disclosures/{id}',
    options: {
      auth: 'jwt',
      description: 'Get PHI disclosure by ID',
      notes: 'Returns a single PHI disclosure with full audit trail',
      tags: ['api', 'compliance', 'phi'],
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const userId = request.auth.credentials.userId;
        const ipAddress = request.info.remoteAddress;
        const userAgent = request.headers['user-agent'];

        const disclosure = await phiDisclosureService.getDisclosureById(
          request.params.id,
          userId,
          ipAddress,
          userAgent
        );

        if (!disclosure) {
          return h.response({ error: 'Disclosure not found' }).code(404);
        }

        return h.response(disclosure).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'PUT',
    path: '/api/v1/compliance/phi-disclosures/{id}',
    options: {
      auth: 'jwt',
      description: 'Update PHI disclosure record',
      notes: 'Updates a PHI disclosure with full audit logging',
      tags: ['api', 'compliance', 'phi'],
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
        payload: Joi.object({
          reasonForVisit: Joi.array().items(Joi.string()).optional(),
          symptoms: Joi.array().items(Joi.string()).optional(),
          treatment: Joi.string().optional(),
          recipientName: Joi.string().optional(),
          recipientOrganization: Joi.string().optional(),
          recipientAddress: Joi.string().optional(),
          recipientPhone: Joi.string().optional(),
          recipientEmail: Joi.string().email().optional(),
          followUpDate: Joi.date().optional(),
          notes: Joi.string().optional(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const userId = request.auth.credentials.userId;
        const ipAddress = request.info.remoteAddress;
        const userAgent = request.headers['user-agent'];

        const disclosure = await phiDisclosureService.updateDisclosure(
          request.params.id,
          request.payload as any,
          userId,
          ipAddress,
          userAgent
        );

        return h.response(disclosure).code(200);
      } catch (error) {
        if (error.message === 'Disclosure not found') {
          return h.response({ error: error.message }).code(404);
        }
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'DELETE',
    path: '/api/v1/compliance/phi-disclosures/{id}',
    options: {
      auth: 'jwt',
      description: 'Soft delete PHI disclosure record',
      notes: 'Soft deletes a PHI disclosure (paranoid delete)',
      tags: ['api', 'compliance', 'phi'],
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const userId = request.auth.credentials.userId;
        const ipAddress = request.info.remoteAddress;
        const userAgent = request.headers['user-agent'];

        await phiDisclosureService.deleteDisclosure(
          request.params.id,
          userId,
          ipAddress,
          userAgent
        );

        return h.response({ message: 'Disclosure deleted successfully' }).code(200);
      } catch (error) {
        if (error.message === 'Disclosure not found') {
          return h.response({ error: error.message }).code(404);
        }
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/compliance/phi-disclosures/student/{studentId}',
    options: {
      auth: 'jwt',
      description: 'Get all PHI disclosures for a student',
      notes: 'Returns all disclosures for a specific student',
      tags: ['api', 'compliance', 'phi'],
      validate: {
        params: Joi.object({
          studentId: Joi.string().uuid().required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const disclosures = await phiDisclosureService.getDisclosuresByStudent(
          request.params.studentId
        );
        return h.response(disclosures).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/compliance/phi-disclosures/follow-ups/overdue',
    options: {
      auth: 'jwt',
      description: 'Get overdue follow-ups',
      notes: 'Returns all disclosures with overdue follow-up dates',
      tags: ['api', 'compliance', 'phi'],
    },
    handler: async (request, h) => {
      try {
        const disclosures = await phiDisclosureService.getOverdueFollowUps();
        return h.response(disclosures).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'POST',
    path: '/api/v1/compliance/phi-disclosures/{id}/follow-up/complete',
    options: {
      auth: 'jwt',
      description: 'Mark follow-up as completed',
      notes: 'Marks a disclosure follow-up as completed',
      tags: ['api', 'compliance', 'phi'],
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
        payload: Joi.object({
          notes: Joi.string().optional(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const userId = request.auth.credentials.userId;
        const { notes } = request.payload as any;

        const disclosure = await phiDisclosureService.completeFollowUp(
          request.params.id,
          userId,
          notes
        );

        return h.response(disclosure).code(200);
      } catch (error) {
        if (error.message === 'Disclosure not found') {
          return h.response({ error: error.message }).code(404);
        }
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/compliance/phi-disclosures/statistics',
    options: {
      auth: 'jwt',
      description: 'Get PHI disclosure statistics',
      notes: 'Returns statistics for compliance reporting',
      tags: ['api', 'compliance', 'phi'],
      validate: {
        query: Joi.object({
          startDate: Joi.date().required(),
          endDate: Joi.date().required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const { startDate, endDate } = request.query;
        const stats = await phiDisclosureService.getStatistics(
          new Date(startDate),
          new Date(endDate)
        );
        return h.response(stats).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/compliance/phi-disclosures/reports/compliance',
    options: {
      auth: 'jwt',
      description: 'Generate HIPAA compliance report',
      notes: 'Generates comprehensive HIPAA §164.528 compliance report',
      tags: ['api', 'compliance', 'phi', 'reports'],
      validate: {
        query: Joi.object({
          startDate: Joi.date().required(),
          endDate: Joi.date().required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const { startDate, endDate } = request.query;
        const report = await phiDisclosureService.generateComplianceReport(
          new Date(startDate),
          new Date(endDate)
        );
        return h.response(report).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },
];

export default phiDisclosureRoutes;
