import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import { ClinicVisitService } from '../../../services/clinical/ClinicVisitService';
import { VisitDisposition } from '../../../database/models/clinical/ClinicVisit';

const clinicVisitService = new ClinicVisitService();

/**
 * Clinic Visit Routes
 * Feature 17: Clinic Visit Tracking
 */
const clinicVisitRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/api/v1/clinical/clinic-visits/check-in',
    options: {
      auth: 'jwt',
      description: 'Check in a student to the clinic',
      notes: 'Creates a new clinic visit and records check-in time',
      tags: ['api', 'clinical', 'visits'],
      validate: {
        payload: Joi.object({
          studentId: Joi.string().uuid().required(),
          reasonForVisit: Joi.array().items(Joi.string()).required(),
          symptoms: Joi.array().items(Joi.string()).optional(),
          attendedBy: Joi.string().uuid().required(),
          notes: Joi.string().optional(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const visit = await clinicVisitService.checkIn(request.payload as any);
        return h.response(visit).code(201);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'POST',
    path: '/api/v1/clinical/clinic-visits/{id}/check-out',
    options: {
      auth: 'jwt',
      description: 'Check out a student from the clinic',
      notes: 'Records check-out time and visit disposition',
      tags: ['api', 'clinical', 'visits'],
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
        payload: Joi.object({
          treatment: Joi.string().optional(),
          disposition: Joi.string()
            .valid(...Object.values(VisitDisposition))
            .required(),
          classesMissed: Joi.array().items(Joi.string()).optional(),
          minutesMissed: Joi.number().integer().min(0).optional(),
          notes: Joi.string().optional(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const visit = await clinicVisitService.checkOut(request.params.id, request.payload as any);
        return h.response(visit).code(200);
      } catch (error) {
        if (error.message === 'Visit not found') {
          return h.response({ error: error.message }).code(404);
        }
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/clinical/clinic-visits/active',
    options: {
      auth: 'jwt',
      description: 'Get active clinic visits',
      notes: 'Returns all students currently checked in to the clinic',
      tags: ['api', 'clinical', 'visits'],
    },
    handler: async (request, h) => {
      try {
        const visits = await clinicVisitService.getActiveVisits();
        return h.response(visits).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/clinical/clinic-visits',
    options: {
      auth: 'jwt',
      description: 'Get clinic visits with filtering and pagination',
      notes: 'Returns paginated list of clinic visits with optional filters',
      tags: ['api', 'clinical', 'visits'],
      validate: {
        query: Joi.object({
          studentId: Joi.string().uuid().optional(),
          attendedBy: Joi.string().uuid().optional(),
          disposition: Joi.string()
            .valid(...Object.values(VisitDisposition))
            .optional(),
          dateFrom: Joi.date().optional(),
          dateTo: Joi.date().optional(),
          activeOnly: Joi.boolean().optional(),
          limit: Joi.number().integer().min(1).max(100).default(20),
          offset: Joi.number().integer().min(0).default(0),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const filters = request.query;
        const result = await clinicVisitService.getVisits(filters);
        return h.response(result).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/clinical/clinic-visits/{id}',
    options: {
      auth: 'jwt',
      description: 'Get clinic visit by ID',
      notes: 'Returns a single clinic visit with full details',
      tags: ['api', 'clinical', 'visits'],
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const visit = await clinicVisitService.getVisitById(request.params.id);
        if (!visit) {
          return h.response({ error: 'Visit not found' }).code(404);
        }
        return h.response(visit).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/clinical/clinic-visits/student/{studentId}',
    options: {
      auth: 'jwt',
      description: 'Get visits for a student',
      notes: 'Returns recent clinic visits for a specific student',
      tags: ['api', 'clinical', 'visits'],
      validate: {
        params: Joi.object({
          studentId: Joi.string().uuid().required(),
        }),
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(100).default(10),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const { limit } = request.query;
        const visits = await clinicVisitService.getVisitsByStudent(request.params.studentId, limit);
        return h.response(visits).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'PUT',
    path: '/api/v1/clinical/clinic-visits/{id}',
    options: {
      auth: 'jwt',
      description: 'Update clinic visit',
      notes: 'Updates an existing clinic visit',
      tags: ['api', 'clinical', 'visits'],
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
        payload: Joi.object({
          reasonForVisit: Joi.array().items(Joi.string()).optional(),
          symptoms: Joi.array().items(Joi.string()).optional(),
          treatment: Joi.string().optional(),
          disposition: Joi.string()
            .valid(...Object.values(VisitDisposition))
            .optional(),
          classesMissed: Joi.array().items(Joi.string()).optional(),
          minutesMissed: Joi.number().integer().min(0).optional(),
          notes: Joi.string().optional(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const visit = await clinicVisitService.updateVisit(request.params.id, request.payload as any);
        return h.response(visit).code(200);
      } catch (error) {
        if (error.message === 'Visit not found') {
          return h.response({ error: error.message }).code(404);
        }
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'DELETE',
    path: '/api/v1/clinical/clinic-visits/{id}',
    options: {
      auth: 'jwt',
      description: 'Delete clinic visit',
      notes: 'Deletes a clinic visit record',
      tags: ['api', 'clinical', 'visits'],
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        await clinicVisitService.deleteVisit(request.params.id);
        return h.response({ message: 'Visit deleted successfully' }).code(200);
      } catch (error) {
        if (error.message === 'Visit not found') {
          return h.response({ error: error.message }).code(404);
        }
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/clinical/clinic-visits/statistics',
    options: {
      auth: 'jwt',
      description: 'Get clinic visit statistics',
      notes: 'Returns statistics for clinic visit analytics',
      tags: ['api', 'clinical', 'visits', 'statistics'],
      validate: {
        query: Joi.object({
          startDate: Joi.date().required(),
          endDate: Joi.date().required(),
          schoolId: Joi.string().uuid().optional(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const { startDate, endDate, schoolId } = request.query;
        const stats = await clinicVisitService.getStatistics(
          new Date(startDate),
          new Date(endDate),
          schoolId
        );
        return h.response(stats).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/clinical/clinic-visits/student/{studentId}/summary',
    options: {
      auth: 'jwt',
      description: 'Get visit summary for a student',
      notes: 'Returns comprehensive visit summary including frequency and patterns',
      tags: ['api', 'clinical', 'visits', 'statistics'],
      validate: {
        params: Joi.object({
          studentId: Joi.string().uuid().required(),
        }),
        query: Joi.object({
          startDate: Joi.date().optional(),
          endDate: Joi.date().optional(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const { startDate, endDate } = request.query;
        const summary = await clinicVisitService.getStudentVisitSummary(
          request.params.studentId,
          startDate ? new Date(startDate) : undefined,
          endDate ? new Date(endDate) : undefined
        );
        return h.response(summary).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/clinical/clinic-visits/frequent-visitors',
    options: {
      auth: 'jwt',
      description: 'Get frequent clinic visitors',
      notes: 'Returns students with highest visit frequency',
      tags: ['api', 'clinical', 'visits', 'statistics'],
      validate: {
        query: Joi.object({
          startDate: Joi.date().required(),
          endDate: Joi.date().required(),
          limit: Joi.number().integer().min(1).max(50).default(10),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const { startDate, endDate, limit } = request.query;
        const visitors = await clinicVisitService.getFrequentVisitors(
          new Date(startDate),
          new Date(endDate),
          limit
        );
        return h.response(visitors).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/clinical/clinic-visits/time-of-day',
    options: {
      auth: 'jwt',
      description: 'Get visits by time of day distribution',
      notes: 'Returns distribution of visits by time of day',
      tags: ['api', 'clinical', 'visits', 'statistics'],
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
        const distribution = await clinicVisitService.getVisitsByTimeOfDay(
          new Date(startDate),
          new Date(endDate)
        );
        return h.response(distribution).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },
];

export default clinicVisitRoutes;
