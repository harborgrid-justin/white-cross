/**
 * Broadcasts Routes
 * HTTP endpoints for broadcast messages, emergency alerts, and scheduled messaging
 * All routes prefixed with /api/v1/communications
 */

import { ServerRoute } from '@hapi/hapi';
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
import {
  BroadcastResponseSchema,
  BroadcastListResponseSchema,
  BroadcastRecipientsResponseSchema,
  BroadcastDeliveryReportResponseSchema,
  ScheduledMessageResponseSchema,
  ScheduledMessageListResponseSchema,
  ErrorResponseSchema
} from '../../RESPONSE_SCHEMAS';

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
    description: 'Create emergency broadcast message',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Sends broadcast message to targeted audience groups. Supports advanced audience targeting by grade level, school, nurse assignment, or specific student IDs. Can include emergency contacts and parents. Validates HIPAA compliance and enforces broadcast limits (max 5000 recipients). Emergency category requires URGENT priority. Supports immediate or scheduled delivery across multiple channels.',
    validate: {
      payload: createBroadcastSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Broadcast created and sent/scheduled successfully', schema: BroadcastResponseSchema },
          '400': { description: 'Validation error - Invalid audience criteria, HIPAA violation, or recipient limit exceeded', schema: ErrorResponseSchema },
          '401': { description: 'Unauthorized', schema: ErrorResponseSchema },
          '403': { description: 'Forbidden - Insufficient permissions for broadcast messaging', schema: ErrorResponseSchema },
          '429': { description: 'Too many requests - Rate limit exceeded', schema: ErrorResponseSchema }
        }
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
    description: 'List broadcast messages',
    notes: '**PHI Protected Endpoint** - Returns paginated list of broadcast messages (messages with multiple recipients). Supports filtering by category, priority, and date range. Shows recipient counts, delivery statistics, and message status. Used for broadcast history and compliance reporting.',
    validate: {
      query: listBroadcastsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Broadcasts retrieved successfully with pagination', schema: BroadcastListResponseSchema },
          '401': { description: 'Unauthorized', schema: ErrorResponseSchema },
          '500': { description: 'Internal server error', schema: ErrorResponseSchema }
        }
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
    description: 'Get broadcast by ID',
    notes: '**PHI Protected Endpoint** - Returns detailed broadcast information including message content, sender details, audience targeting criteria, recipient count, and delivery summary. Shows all channels used and aggregated delivery status.',
    validate: {
      params: broadcastIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Broadcast retrieved successfully', schema: BroadcastResponseSchema },
          '400': { description: 'Not a broadcast message (single recipient)', schema: ErrorResponseSchema },
          '401': { description: 'Unauthorized', schema: ErrorResponseSchema },
          '404': { description: 'Broadcast not found', schema: ErrorResponseSchema }
        }
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
    description: 'Cancel scheduled broadcast',
    notes: '**PHI Protected Endpoint** - Cancels a scheduled broadcast before it is sent. Cannot cancel broadcasts that have already been sent or are currently being sent. Sender must own the broadcast. All pending deliveries are cancelled and status updated for audit trail.',
    validate: {
      params: broadcastIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Broadcast cancelled successfully', schema: BroadcastResponseSchema },
          '400': { description: 'Broadcast already sent or cannot be cancelled', schema: ErrorResponseSchema },
          '401': { description: 'Unauthorized', schema: ErrorResponseSchema },
          '403': { description: 'Forbidden - Not broadcast owner', schema: ErrorResponseSchema },
          '404': { description: 'Broadcast not found', schema: ErrorResponseSchema }
        }
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
    description: 'Get broadcast recipients',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Returns paginated list of all recipients for a broadcast message. Shows delivery status for each recipient across all channels, contact information used, delivery timestamps, and failure reasons if applicable. Essential for delivery verification and troubleshooting. Access is strictly audited.',
    validate: {
      params: broadcastIdParamSchema,
      query: getBroadcastRecipientsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Recipients retrieved successfully with pagination', schema: BroadcastRecipientsResponseSchema },
          '401': { description: 'Unauthorized', schema: ErrorResponseSchema },
          '404': { description: 'Broadcast not found', schema: ErrorResponseSchema },
          '500': { description: 'Internal server error', schema: ErrorResponseSchema }
        }
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
    description: 'Get broadcast delivery report',
    notes: '**PHI Protected Endpoint** - Returns comprehensive delivery report for a broadcast. Includes overall summary (total, delivered, failed, pending), breakdown by channel (EMAIL, SMS, etc.), breakdown by recipient type (PARENT, EMERGENCY_CONTACT, etc.), and individual delivery records. Used for compliance reporting, delivery verification, and system monitoring.',
    validate: {
      params: broadcastIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Delivery report retrieved successfully', schema: BroadcastDeliveryReportResponseSchema },
          '401': { description: 'Unauthorized', schema: ErrorResponseSchema },
          '404': { description: 'Broadcast not found', schema: ErrorResponseSchema },
          '500': { description: 'Internal server error', schema: ErrorResponseSchema }
        }
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
    notes: '**PHI Protected Endpoint** - Schedules a message for delivery at a specific future time. Supports advanced recipient targeting, rate limiting/throttling, template substitution, and timezone-aware scheduling. Messages are queued and processed by background jobs. Can specify max delivery rates to prevent system overload. Used for planned communications, reminders, and campaigns.',
    validate: {
      payload: scheduleMessageSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Message scheduled successfully', schema: ScheduledMessageResponseSchema },
          '400': { description: 'Validation error - Invalid schedule time or recipient configuration', schema: ErrorResponseSchema },
          '401': { description: 'Unauthorized', schema: ErrorResponseSchema },
          '403': { description: 'Forbidden - Insufficient permissions for scheduled messaging', schema: ErrorResponseSchema },
          '429': { description: 'Too many requests - Rate limit exceeded', schema: ErrorResponseSchema }
        }
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
    description: 'List scheduled messages',
    notes: '**PHI Protected Endpoint** - Returns list of scheduled messages with various filters. Can filter by status (PENDING, PROCESSING, SENT, FAILED, CANCELLED, PAUSED), schedule type (ONE_TIME, RECURRING, CAMPAIGN), campaign ID, and date range. Shows schedule details, recipient counts, and current processing status. Used for managing message queue and monitoring scheduled communications.',
    validate: {
      query: listScheduledQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Scheduled messages retrieved successfully', schema: ScheduledMessageListResponseSchema },
          '401': { description: 'Unauthorized', schema: ErrorResponseSchema },
          '500': { description: 'Internal server error', schema: ErrorResponseSchema }
        }
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
