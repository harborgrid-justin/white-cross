import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import { RealTimeAlertService } from '../../../services/alerts/RealTimeAlertService';
import { AlertSeverity, AlertStatus, AlertCategory } from '../../../database/models/alerts/AlertInstance';
import { DeliveryChannel } from '../../../database/models/alerts/AlertSubscription';
import { WebSocketService } from '../../../infrastructure/websocket/WebSocketService';
import { EmailService } from '../../../infrastructure/email/EmailService';
import { SMSService } from '../../../infrastructure/sms/SMSService';

// Instantiate service with dependencies
const wsService = new WebSocketService();
const emailService = new EmailService();
const smsService = new SMSService();
const alertService = new RealTimeAlertService(wsService, emailService, smsService);

/**
 * Real-Time Alert Routes
 * Feature 26: Real-Time Alerts System
 */
const realTimeAlertRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/api/v1/alerts',
    options: {
      auth: 'jwt',
      description: 'Create and broadcast a new alert',
      notes: 'Creates a new alert and broadcasts it via WebSocket and other channels',
      tags: ['api', 'alerts'],
      validate: {
        payload: Joi.object({
          definitionId: Joi.string().uuid().optional(),
          severity: Joi.string()
            .valid(...Object.values(AlertSeverity))
            .required(),
          category: Joi.string()
            .valid(...Object.values(AlertCategory))
            .required(),
          title: Joi.string().required(),
          message: Joi.string().required(),
          studentId: Joi.string().uuid().optional(),
          userId: Joi.string().uuid().optional(),
          schoolId: Joi.string().uuid().optional(),
          metadata: Joi.object().optional(),
          expiresAt: Joi.date().optional(),
          autoEscalateAfter: Joi.number().integer().min(1).optional(),
          requiresAcknowledgment: Joi.boolean().required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const userId = request.auth.credentials.userId as string;
        const alert = await alertService.createAlert(request.payload as any, userId);
        return h.response(alert).code(201);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/alerts',
    options: {
      auth: 'jwt',
      description: 'Get alerts with filtering and pagination',
      notes: 'Returns paginated list of alerts with optional filters',
      tags: ['api', 'alerts'],
      validate: {
        query: Joi.object({
          severity: Joi.array()
            .items(Joi.string().valid(...Object.values(AlertSeverity)))
            .optional(),
          category: Joi.array()
            .items(Joi.string().valid(...Object.values(AlertCategory)))
            .optional(),
          status: Joi.array()
            .items(Joi.string().valid(...Object.values(AlertStatus)))
            .optional(),
          studentId: Joi.string().uuid().optional(),
          userId: Joi.string().uuid().optional(),
          schoolId: Joi.string().uuid().optional(),
          dateFrom: Joi.date().optional(),
          dateTo: Joi.date().optional(),
          limit: Joi.number().integer().min(1).max(100).default(20),
          offset: Joi.number().integer().min(0).default(0),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const filters = request.query;
        const result = await alertService.getAlerts(filters);
        return h.response(result).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/alerts/{id}',
    options: {
      auth: 'jwt',
      description: 'Get alert by ID',
      notes: 'Returns a single alert with delivery logs',
      tags: ['api', 'alerts'],
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const alert = await alertService.getAlertById(request.params.id);
        if (!alert) {
          return h.response({ error: 'Alert not found' }).code(404);
        }
        return h.response(alert).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'POST',
    path: '/api/v1/alerts/{id}/acknowledge',
    options: {
      auth: 'jwt',
      description: 'Acknowledge an alert',
      notes: 'Marks an alert as acknowledged and broadcasts the update',
      tags: ['api', 'alerts'],
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
        const userId = request.auth.credentials.userId as string;
        const { notes } = request.payload as any;
        const alert = await alertService.acknowledgeAlert(request.params.id, userId, notes);
        return h.response(alert).code(200);
      } catch (error) {
        if (error.message === 'Alert not found') {
          return h.response({ error: error.message }).code(404);
        }
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'POST',
    path: '/api/v1/alerts/{id}/resolve',
    options: {
      auth: 'jwt',
      description: 'Resolve an alert',
      notes: 'Marks an alert as resolved and broadcasts the update',
      tags: ['api', 'alerts'],
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
        payload: Joi.object({
          resolution: Joi.string().required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const userId = request.auth.credentials.userId as string;
        const { resolution } = request.payload as any;
        const alert = await alertService.resolveAlert(request.params.id, userId, resolution);
        return h.response(alert).code(200);
      } catch (error) {
        if (error.message === 'Alert not found') {
          return h.response({ error: error.message }).code(404);
        }
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'POST',
    path: '/api/v1/alerts/{id}/escalate',
    options: {
      auth: 'jwt',
      description: 'Escalate an alert',
      notes: 'Escalates an alert and re-delivers to subscribers',
      tags: ['api', 'alerts'],
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
        payload: Joi.object({
          escalationReason: Joi.string().required(),
          escalationLevel: Joi.number().integer().min(1).required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const userId = request.auth.credentials.userId as string;
        const { escalationReason, escalationLevel } = request.payload as any;
        const alert = await alertService.escalateAlert(
          request.params.id,
          userId,
          escalationReason,
          escalationLevel
        );
        return h.response(alert).code(200);
      } catch (error) {
        if (error.message === 'Alert not found') {
          return h.response({ error: error.message }).code(404);
        }
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'POST',
    path: '/api/v1/alerts/{id}/dismiss',
    options: {
      auth: 'jwt',
      description: 'Dismiss an alert',
      notes: 'Marks an alert as dismissed',
      tags: ['api', 'alerts'],
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
        payload: Joi.object({
          dismissalReason: Joi.string().required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const userId = request.auth.credentials.userId as string;
        const { dismissalReason } = request.payload as any;
        const alert = await alertService.dismissAlert(request.params.id, userId, dismissalReason);
        return h.response(alert).code(200);
      } catch (error) {
        if (error.message === 'Alert not found') {
          return h.response({ error: error.message }).code(404);
        }
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/alerts/critical/unacknowledged',
    options: {
      auth: 'jwt',
      description: 'Get critical unacknowledged alerts',
      notes: 'Returns all critical/emergency alerts that have not been acknowledged',
      tags: ['api', 'alerts'],
    },
    handler: async (request, h) => {
      try {
        const alerts = await alertService.getCriticalUnacknowledged();
        return h.response(alerts).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/alerts/user/{userId}/active',
    options: {
      auth: 'jwt',
      description: 'Get active alerts for a user',
      notes: 'Returns all active alerts for a specific user',
      tags: ['api', 'alerts'],
      validate: {
        params: Joi.object({
          userId: Joi.string().uuid().required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const alerts = await alertService.getActiveAlertsForUser(request.params.userId);
        return h.response(alerts).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/alerts/expiring',
    options: {
      auth: 'jwt',
      description: 'Get alerts expiring soon',
      notes: 'Returns alerts expiring within the specified hours',
      tags: ['api', 'alerts'],
      validate: {
        query: Joi.object({
          hours: Joi.number().integer().min(1).max(24).default(1),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const { hours } = request.query;
        const alerts = await alertService.getExpiringAlerts(hours);
        return h.response(alerts).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'POST',
    path: '/api/v1/alerts/subscriptions',
    options: {
      auth: 'jwt',
      description: 'Create or update alert subscription',
      notes: 'Manages user alert subscription preferences',
      tags: ['api', 'alerts', 'subscriptions'],
      validate: {
        payload: Joi.object({
          schoolId: Joi.string().uuid().required(),
          channels: Joi.array()
            .items(Joi.string().valid(...Object.values(DeliveryChannel)))
            .required(),
          severityFilter: Joi.array()
            .items(Joi.string().valid(...Object.values(AlertSeverity)))
            .required(),
          categoryFilter: Joi.array()
            .items(Joi.string().valid(...Object.values(AlertCategory)))
            .required(),
          quietHoursStart: Joi.string().optional(),
          quietHoursEnd: Joi.string().optional(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const userId = request.auth.credentials.userId as string;
        const { schoolId, channels, severityFilter, categoryFilter, quietHoursStart, quietHoursEnd } =
          request.payload as any;

        const subscription = await alertService.manageSubscription(
          userId,
          schoolId,
          channels,
          severityFilter,
          categoryFilter,
          quietHoursStart,
          quietHoursEnd
        );

        return h.response(subscription).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/alerts/statistics',
    options: {
      auth: 'jwt',
      description: 'Get alert statistics',
      notes: 'Returns statistics for alert management and reporting',
      tags: ['api', 'alerts', 'statistics'],
      validate: {
        query: Joi.object({
          schoolId: Joi.string().uuid().required(),
          startDate: Joi.date().required(),
          endDate: Joi.date().required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const { schoolId, startDate, endDate } = request.query;
        const stats = await alertService.getStatistics(
          schoolId,
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
    path: '/api/v1/alerts/{id}/delivery-stats',
    options: {
      auth: 'jwt',
      description: 'Get alert delivery statistics',
      notes: 'Returns delivery statistics for a specific alert',
      tags: ['api', 'alerts', 'statistics'],
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const stats = await alertService.getDeliveryStatistics(request.params.id);
        return h.response(stats).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },
];

export default realTimeAlertRoutes;
