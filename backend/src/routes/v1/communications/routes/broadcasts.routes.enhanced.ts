/**
 * Broadcasts Routes - Enhanced with Comprehensive Swagger Documentation
 * HTTP endpoints for broadcast messages, emergency alerts, and scheduled messaging
 * All routes prefixed with /api/v1/communications
 *
 * Swagger/OpenAPI Documentation:
 * - Complete request/response schemas for all 8 endpoints
 * - HIPAA compliance notes for PHI-protected endpoints
 * - Comprehensive error responses and status codes
 * - Audience targeting and delivery report schemas
 */

import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import { asyncHandler } from '../../../shared/utils';
import { BroadcastsController } from '../controllers/broadcasts.controller';
import {
  listBroadcastsQuerySchema,
  getBroadcastRecipientsQuerySchema,
  listScheduledQuerySchema,
  broadcastIdParamSchema,
  createBroadcastSchema,
  scheduleMessageSchema
} from '../validators/broadcasts.validators';

/**
 * SWAGGER SCHEMA COMPONENTS
 * Reusable response schemas for documentation
 */

const broadcastObjectSchema = Joi.object({
  id: Joi.string().uuid().description('Broadcast unique identifier').example('750e8400-e29b-41d4-a716-446655440000'),
  senderId: Joi.string().uuid().description('Sender user ID'),
  senderName: Joi.string().description('Sender display name').example('School Nurse Administrator'),
  subject: Joi.string().allow(null).description('Broadcast subject').example('Health Alert: Flu Season Reminder'),
  content: Joi.string().description('Broadcast message content').example('Flu season is here. Please ensure your child gets their flu shot. Contact the nurse office for assistance.'),
  category: Joi.string().valid('EMERGENCY', 'HEALTH_UPDATE', 'APPOINTMENT_REMINDER', 'MEDICATION_REMINDER', 'GENERAL', 'INCIDENT_NOTIFICATION', 'COMPLIANCE').example('HEALTH_UPDATE'),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').example('HIGH'),
  channels: Joi.array().items(Joi.string().valid('EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE')).example(['EMAIL', 'SMS', 'PUSH_NOTIFICATION']),
  recipientCount: Joi.number().description('Total number of recipients').example(342),
  audienceTargeting: Joi.object({
    grades: Joi.array().items(Joi.string()).optional().example(['9', '10', '11', '12']),
    nurseIds: Joi.array().items(Joi.string().uuid()).optional(),
    studentIds: Joi.array().items(Joi.string().uuid()).optional(),
    schoolIds: Joi.array().items(Joi.string().uuid()).optional().example(['school-uuid-1']),
    includeParents: Joi.boolean().example(true),
    includeEmergencyContacts: Joi.boolean().example(false)
  }).description('Audience targeting criteria used'),
  deliverySummary: Joi.object({
    total: Joi.number().example(342),
    pending: Joi.number().example(0),
    sent: Joi.number().example(342),
    delivered: Joi.number().example(328),
    failed: Joi.number().example(14),
    bounced: Joi.number().example(0)
  }).description('Delivery status summary across all recipients'),
  scheduledAt: Joi.date().iso().allow(null).description('Scheduled delivery time').example(null),
  createdAt: Joi.date().iso().example('2025-10-23T09:00:00Z'),
  updatedAt: Joi.date().iso().example('2025-10-23T09:01:00Z')
}).label('BroadcastObject');

const recipientDeliverySchema = Joi.object({
  recipientId: Joi.string().uuid().description('Recipient user ID'),
  recipientName: Joi.string().example('John Doe'),
  recipientType: Joi.string().valid('STUDENT', 'EMERGENCY_CONTACT', 'PARENT', 'NURSE', 'ADMIN').example('PARENT'),
  deliveries: Joi.array().items(
    Joi.object({
      channel: Joi.string().valid('EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE').example('EMAIL'),
      contact: Joi.string().example('john.doe@example.com'),
      status: Joi.string().valid('PENDING', 'SENT', 'DELIVERED', 'FAILED', 'BOUNCED').example('DELIVERED'),
      sentAt: Joi.date().iso().allow(null).example('2025-10-23T09:01:15Z'),
      deliveredAt: Joi.date().iso().allow(null).example('2025-10-23T09:02:42Z'),
      failureReason: Joi.string().allow(null).example(null),
      externalId: Joi.string().allow(null).example('sendgrid-abc123')
    })
  ).description('Delivery status for each channel')
}).label('RecipientDelivery');

const deliveryReportSchema = Joi.object({
  messageId: Joi.string().uuid().description('Broadcast message ID'),
  summary: Joi.object({
    total: Joi.number().example(342),
    pending: Joi.number().example(0),
    sent: Joi.number().example(342),
    delivered: Joi.number().example(328),
    failed: Joi.number().example(14),
    bounced: Joi.number().example(0)
  }),
  byChannel: Joi.object().pattern(
    Joi.string(),
    Joi.object({
      total: Joi.number().example(342),
      delivered: Joi.number().example(328),
      failed: Joi.number().example(14),
      pending: Joi.number().example(0)
    })
  ).example({
    EMAIL: { total: 342, delivered: 330, failed: 12, pending: 0 },
    SMS: { total: 342, delivered: 326, failed: 16, pending: 0 }
  }),
  byRecipientType: Joi.object().pattern(
    Joi.string(),
    Joi.object({
      total: Joi.number().example(342),
      delivered: Joi.number().example(328),
      failed: Joi.number().example(14),
      pending: Joi.number().example(0)
    })
  ).example({
    PARENT: { total: 342, delivered: 328, failed: 14, pending: 0 }
  }),
  deliveries: Joi.array().items(recipientDeliverySchema).description('Individual delivery records')
}).label('DeliveryReport');

const scheduledMessageSchema = Joi.object({
  id: Joi.string().uuid().example('850e8400-e29b-41d4-a716-446655440000'),
  subject: Joi.string().example('Monthly Health Newsletter'),
  body: Joi.string().example('Dear parents, here is your monthly health update...'),
  recipientType: Joi.string().valid('ALL_PARENTS', 'SPECIFIC_USERS', 'STUDENT_PARENTS', 'GRADE_LEVEL', 'CUSTOM_GROUP').example('ALL_PARENTS'),
  channels: Joi.array().items(Joi.string().valid('EMAIL', 'SMS', 'PUSH', 'PORTAL')).example(['EMAIL', 'PORTAL']),
  scheduledFor: Joi.date().iso().example('2025-10-25T08:00:00Z'),
  timezone: Joi.string().example('America/New_York'),
  priority: Joi.string().valid('LOW', 'NORMAL', 'HIGH').example('NORMAL'),
  status: Joi.string().valid('PENDING', 'PROCESSING', 'SENT', 'FAILED', 'CANCELLED', 'PAUSED').example('PENDING'),
  scheduleType: Joi.string().valid('ONE_TIME', 'RECURRING', 'CAMPAIGN').example('ONE_TIME'),
  recipientCount: Joi.number().example(428),
  createdBy: Joi.string().uuid(),
  createdAt: Joi.date().iso().example('2025-10-23T11:00:00Z'),
  updatedAt: Joi.date().iso().example('2025-10-23T11:00:00Z')
}).label('ScheduledMessage');

const errorResponseSchema = Joi.object({
  success: Joi.boolean().example(false),
  error: Joi.object({
    message: Joi.string().example('Broadcast not found'),
    code: Joi.string().optional().example('BROADCAST_NOT_FOUND'),
    details: Joi.any().optional()
  })
}).label('ErrorResponse');

/**
 * BROADCAST ROUTES
 */

const createBroadcastRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/communications/broadcasts',
  handler: asyncHandler(BroadcastsController.createBroadcast),
  options: {
    auth: 'jwt',
    tags: ['api', 'Communications', 'Broadcasts', 'v1'],
    description: 'Create and send emergency broadcast message',
    notes: [
      '**HIGHLY SENSITIVE PHI ENDPOINT** - Sends broadcast message to targeted audience groups.',
      '',
      '**Audience Targeting Options:**',
      '- `grades`: Filter by grade levels (K, 1-12)',
      '- `nurseIds`: Filter by assigned nurse IDs',
      '- `studentIds`: Specific student IDs (max 1000)',
      '- `schoolIds`: Filter by school IDs',
      '- `includeParents`: Include student parents/guardians',
      '- `includeEmergencyContacts`: Include emergency contacts',
      '',
      '**Broadcast Limits:**',
      '- Maximum 5000 recipients per broadcast',
      '- Emergency category requires URGENT priority',
      '- At least one audience filter required',
      '',
      '**HIPAA Compliance:**',
      '- All broadcast content encrypted',
      '- Recipient lists validated',
      '- Delivery tracked for audit compliance',
      '',
      '**Delivery Options:**',
      '- Immediate delivery (default)',
      '- Scheduled delivery (set `scheduledAt`)',
      '',
      '**Example Request:**',
      '```json',
      '{',
      '  "audience": {',
      '    "grades": ["9", "10", "11", "12"],',
      '    "includeParents": true,',
      '    "includeEmergencyContacts": false',
      '  },',
      '  "channels": ["EMAIL", "SMS", "PUSH_NOTIFICATION"],',
      '  "subject": "Health Alert: Flu Season",',
      '  "content": "Dear parents, flu season is here. Please ensure your child receives their flu vaccination.",',
      '  "priority": "HIGH",',
      '  "category": "HEALTH_UPDATE"',
      '}',
      '```'
    ].join('\n'),
    validate: {
      payload: createBroadcastSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': {
            description: 'Broadcast created and sent/scheduled successfully',
            schema: Joi.object({
              success: Joi.boolean().example(true),
              data: Joi.object({
                message: broadcastObjectSchema,
                deliveryStatuses: Joi.array().items(
                  Joi.object({
                    recipientId: Joi.string().uuid(),
                    channel: Joi.string().valid('EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE'),
                    status: Joi.string().valid('PENDING', 'SENT', 'DELIVERED', 'FAILED', 'BOUNCED').example('SENT')
                  })
                ).description('Initial delivery status for each recipient/channel')
              })
            }).label('CreateBroadcastResponse')
          },
          '400': {
            description: 'Validation error - Invalid audience criteria, HIPAA violation, or recipient limit exceeded',
            schema: errorResponseSchema.keys({
              error: Joi.object({
                message: Joi.string().example('Emergency broadcasts must have URGENT priority'),
                code: Joi.string().example('VALIDATION_ERROR'),
                details: Joi.array().items(
                  Joi.object({
                    field: Joi.string().example('priority'),
                    message: Joi.string().example('Emergency broadcasts must have URGENT priority')
                  })
                ).optional()
              })
            })
          },
          '401': {
            description: 'Unauthorized - Invalid or missing JWT token',
            schema: errorResponseSchema
          },
          '403': {
            description: 'Forbidden - Insufficient permissions for broadcast messaging',
            schema: errorResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: errorResponseSchema
          }
        },
        order: 1,
        payloadType: 'json'
      }
    }
  }
};

const listBroadcastsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/communications/broadcasts',
  handler: asyncHandler(BroadcastsController.list),
  options: {
    auth: 'jwt',
    tags: ['api', 'Communications', 'Broadcasts', 'v1'],
    description: 'List broadcast messages with filters',
    notes: [
      '**PHI Protected Endpoint** - Returns paginated list of broadcast messages (messages with multiple recipients).',
      '',
      'Supports filtering by:',
      '- `category`: Message category',
      '- `priority`: Message priority',
      '- `dateFrom` / `dateTo`: Date range',
      '',
      'Response includes:',
      '- Recipient counts',
      '- Delivery statistics',
      '- Message status',
      '',
      'Used for broadcast history and compliance reporting.',
      '',
      '**Example Request:**',
      '```',
      'GET /api/v1/communications/broadcasts?category=EMERGENCY&priority=URGENT&dateFrom=2025-10-01',
      '```'
    ].join('\n'),
    validate: {
      query: listBroadcastsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Broadcasts retrieved successfully with pagination',
            schema: Joi.object({
              success: Joi.boolean().example(true),
              data: Joi.object({
                broadcasts: Joi.array().items(broadcastObjectSchema),
                pagination: Joi.object({
                  page: Joi.number().example(1),
                  limit: Joi.number().example(20),
                  total: Joi.number().example(47),
                  pages: Joi.number().example(3)
                })
              })
            }).label('ListBroadcastsResponse')
          },
          '401': {
            description: 'Unauthorized - Invalid or missing JWT token',
            schema: errorResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: errorResponseSchema
          }
        },
        order: 2
      }
    }
  }
};

const getBroadcastByIdRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/communications/broadcasts/{id}',
  handler: asyncHandler(BroadcastsController.getById),
  options: {
    auth: 'jwt',
    tags: ['api', 'Communications', 'Broadcasts', 'v1'],
    description: 'Get broadcast by ID with full details',
    notes: [
      '**PHI Protected Endpoint** - Returns detailed broadcast information.',
      '',
      'Response includes:',
      '- Complete message content',
      '- Sender details',
      '- Audience targeting criteria',
      '- Recipient count',
      '- Delivery summary',
      '- All channels used',
      '- Aggregated delivery status',
      '',
      '**Example Request:**',
      '```',
      'GET /api/v1/communications/broadcasts/750e8400-e29b-41d4-a716-446655440000',
      '```'
    ].join('\n'),
    validate: {
      params: broadcastIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Broadcast retrieved successfully',
            schema: Joi.object({
              success: Joi.boolean().example(true),
              data: Joi.object({
                broadcast: broadcastObjectSchema
              })
            }).label('GetBroadcastResponse')
          },
          '400': {
            description: 'Not a broadcast message (single recipient)',
            schema: errorResponseSchema
          },
          '401': {
            description: 'Unauthorized - Invalid or missing JWT token',
            schema: errorResponseSchema
          },
          '404': {
            description: 'Broadcast not found',
            schema: errorResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: errorResponseSchema
          }
        },
        order: 3
      }
    }
  }
};

const cancelBroadcastRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/communications/broadcasts/{id}/cancel',
  handler: asyncHandler(BroadcastsController.cancel),
  options: {
    auth: 'jwt',
    tags: ['api', 'Communications', 'Broadcasts', 'v1'],
    description: 'Cancel scheduled broadcast before sending',
    notes: [
      '**PHI Protected Endpoint** - Cancels a scheduled broadcast before it is sent.',
      '',
      '**Restrictions:**',
      '- Only SCHEDULED broadcasts can be cancelled',
      '- Cannot cancel broadcasts already sent or in progress',
      '- Only the broadcast sender can cancel',
      '',
      '**Audit Trail:**',
      '- All pending deliveries are cancelled',
      '- Status updated for audit trail',
      '- Cancellation action logged',
      '',
      '**Example Request:**',
      '```',
      'POST /api/v1/communications/broadcasts/750e8400-e29b-41d4-a716-446655440000/cancel',
      '```'
    ].join('\n'),
    validate: {
      params: broadcastIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Broadcast cancelled successfully',
            schema: Joi.object({
              success: Joi.boolean().example(true),
              data: Joi.object({
                message: Joi.string().example('Broadcast cancelled successfully')
              })
            }).label('CancelBroadcastResponse')
          },
          '400': {
            description: 'Broadcast already sent or cannot be cancelled',
            schema: errorResponseSchema
          },
          '401': {
            description: 'Unauthorized - Invalid or missing JWT token',
            schema: errorResponseSchema
          },
          '403': {
            description: 'Forbidden - Not broadcast owner',
            schema: errorResponseSchema
          },
          '404': {
            description: 'Broadcast not found',
            schema: errorResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: errorResponseSchema
          }
        },
        order: 4
      }
    }
  }
};

const getBroadcastRecipientsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/communications/broadcasts/{id}/recipients',
  handler: asyncHandler(BroadcastsController.getRecipients),
  options: {
    auth: 'jwt',
    tags: ['api', 'Communications', 'Broadcasts', 'v1'],
    description: 'Get broadcast recipients with delivery status',
    notes: [
      '**HIGHLY SENSITIVE PHI ENDPOINT** - Returns paginated list of all recipients for a broadcast.',
      '',
      'Response includes per recipient:',
      '- Delivery status for each channel',
      '- Contact information used (email/phone)',
      '- Delivery timestamps',
      '- Failure reasons if applicable',
      '',
      'Essential for:',
      '- Delivery verification',
      '- Troubleshooting failed deliveries',
      '- Compliance reporting',
      '',
      '**Access Control:**',
      '- Access is strictly audited',
      '- Requires appropriate permissions',
      '',
      '**Example Request:**',
      '```',
      'GET /api/v1/communications/broadcasts/750e8400-e29b-41d4-a716-446655440000/recipients?page=1&limit=50',
      '```'
    ].join('\n'),
    validate: {
      params: broadcastIdParamSchema,
      query: getBroadcastRecipientsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Recipients retrieved successfully with pagination',
            schema: Joi.object({
              success: Joi.boolean().example(true),
              data: Joi.object({
                recipients: Joi.array().items(recipientDeliverySchema),
                pagination: Joi.object({
                  page: Joi.number().example(1),
                  limit: Joi.number().example(50),
                  total: Joi.number().example(342),
                  pages: Joi.number().example(7)
                })
              })
            }).label('GetBroadcastRecipientsResponse')
          },
          '401': {
            description: 'Unauthorized - Invalid or missing JWT token',
            schema: errorResponseSchema
          },
          '404': {
            description: 'Broadcast not found',
            schema: errorResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: errorResponseSchema
          }
        },
        order: 5
      }
    }
  }
};

const getBroadcastDeliveryReportRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/communications/broadcasts/{id}/delivery-report',
  handler: asyncHandler(BroadcastsController.getDeliveryReport),
  options: {
    auth: 'jwt',
    tags: ['api', 'Communications', 'Broadcasts', 'v1'],
    description: 'Get comprehensive broadcast delivery report',
    notes: [
      '**PHI Protected Endpoint** - Returns comprehensive delivery report for a broadcast.',
      '',
      'Report includes:',
      '- Overall summary (total, delivered, failed, pending)',
      '- Breakdown by channel (EMAIL, SMS, etc.)',
      '- Breakdown by recipient type (PARENT, EMERGENCY_CONTACT, etc.)',
      '- Individual delivery records',
      '',
      'Used for:',
      '- Compliance reporting',
      '- Delivery verification',
      '- System monitoring',
      '- Troubleshooting delivery issues',
      '',
      '**Example Request:**',
      '```',
      'GET /api/v1/communications/broadcasts/750e8400-e29b-41d4-a716-446655440000/delivery-report',
      '```'
    ].join('\n'),
    validate: {
      params: broadcastIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Delivery report retrieved successfully',
            schema: Joi.object({
              success: Joi.boolean().example(true),
              data: Joi.object({
                report: deliveryReportSchema
              })
            }).label('GetBroadcastDeliveryReportResponse')
          },
          '401': {
            description: 'Unauthorized - Invalid or missing JWT token',
            schema: errorResponseSchema
          },
          '404': {
            description: 'Broadcast not found',
            schema: errorResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: errorResponseSchema
          }
        },
        order: 6
      }
    }
  }
};

/**
 * SCHEDULED MESSAGING ROUTES
 */

const scheduleMessageRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/communications/scheduled',
  handler: asyncHandler(BroadcastsController.schedule),
  options: {
    auth: 'jwt',
    tags: ['api', 'Communications', 'Scheduled', 'v1'],
    description: 'Schedule message for future delivery',
    notes: [
      '**PHI Protected Endpoint** - Schedules a message for delivery at a specific future time.',
      '',
      '**Features:**',
      '- Advanced recipient targeting',
      '- Rate limiting/throttling',
      '- Template substitution',
      '- Timezone-aware scheduling',
      '',
      '**Message Queue:**',
      '- Messages queued and processed by background jobs',
      '- Can specify max delivery rates to prevent system overload',
      '',
      '**Use Cases:**',
      '- Planned communications',
      '- Reminder campaigns',
      '- Scheduled newsletters',
      '',
      '**Example Request:**',
      '```json',
      '{',
      '  "subject": "Monthly Health Newsletter",',
      '  "body": "Dear parents, here is your October health newsletter...",',
      '  "recipientType": "ALL_PARENTS",',
      '  "channels": ["EMAIL", "PORTAL"],',
      '  "scheduledFor": "2025-10-25T08:00:00Z",',
      '  "timezone": "America/New_York",',
      '  "priority": "NORMAL",',
      '  "throttle": {',
      '    "maxPerMinute": 100,',
      '    "maxPerHour": 1000',
      '  }',
      '}',
      '```'
    ].join('\n'),
    validate: {
      payload: scheduleMessageSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': {
            description: 'Message scheduled successfully',
            schema: Joi.object({
              success: Joi.boolean().example(true),
              data: Joi.object({
                scheduledMessage: scheduledMessageSchema
              })
            }).label('ScheduleMessageResponse')
          },
          '400': {
            description: 'Validation error - Invalid schedule time or recipient configuration',
            schema: errorResponseSchema
          },
          '401': {
            description: 'Unauthorized - Invalid or missing JWT token',
            schema: errorResponseSchema
          },
          '403': {
            description: 'Forbidden - Insufficient permissions for scheduled messaging',
            schema: errorResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: errorResponseSchema
          }
        },
        order: 7,
        payloadType: 'json'
      }
    }
  }
};

const listScheduledMessagesRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/communications/scheduled',
  handler: asyncHandler(BroadcastsController.listScheduled),
  options: {
    auth: 'jwt',
    tags: ['api', 'Communications', 'Scheduled', 'v1'],
    description: 'List scheduled messages with filters',
    notes: [
      '**PHI Protected Endpoint** - Returns list of scheduled messages.',
      '',
      'Filter options:',
      '- `status`: PENDING, PROCESSING, SENT, FAILED, CANCELLED, PAUSED',
      '- `scheduleType`: ONE_TIME, RECURRING, CAMPAIGN',
      '- `campaignId`: Filter by campaign',
      '- `startDate` / `endDate`: Filter by scheduled date range',
      '',
      'Response includes:',
      '- Schedule details',
      '- Recipient counts',
      '- Current processing status',
      '- Delivery progress (if processing)',
      '',
      'Used for:',
      '- Managing message queue',
      '- Monitoring scheduled communications',
      '',
      '**Example Request:**',
      '```',
      'GET /api/v1/communications/scheduled?status=PENDING&scheduleType=ONE_TIME',
      '```'
    ].join('\n'),
    validate: {
      query: listScheduledQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Scheduled messages retrieved successfully',
            schema: Joi.object({
              success: Joi.boolean().example(true),
              data: Joi.object({
                scheduledMessages: Joi.array().items(scheduledMessageSchema)
              })
            }).label('ListScheduledMessagesResponse')
          },
          '401': {
            description: 'Unauthorized - Invalid or missing JWT token',
            schema: errorResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: errorResponseSchema
          }
        },
        order: 8
      }
    }
  }
};

/**
 * EXPORT ROUTES
 */

export const broadcastsRoutes: ServerRoute[] = [
  // Broadcast CRUD (4 routes)
  createBroadcastRoute,
  listBroadcastsRoute,
  getBroadcastByIdRoute,
  cancelBroadcastRoute,

  // Broadcast delivery (2 routes)
  getBroadcastRecipientsRoute,
  getBroadcastDeliveryReportRoute,

  // Scheduled messaging (2 routes)
  scheduleMessageRoute,
  listScheduledMessagesRoute
];
