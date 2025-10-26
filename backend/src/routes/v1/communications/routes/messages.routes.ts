/**
 * Messages Routes
 * HTTP endpoints for message management, delivery tracking, and templates
 * All routes prefixed with /api/v1/communications
 */

import { ServerRoute } from '@hapi/hapi';
import { asyncHandler } from '../../../shared/utils';
import { standardFailAction } from '../../core/shared/validationConfig';
import { MessagesController } from '../controllers/messages.controller';
import {
  listMessagesQuerySchema,
  listTemplatesQuerySchema,
  getInboxQuerySchema,
  getSentQuerySchema,
  statisticsQuerySchema,
  messageIdParamSchema,
  deliveryStatusParamSchema,
  sendMessageSchema,
  updateMessageSchema,
  replyToMessageSchema,
  createTemplateSchema
} from '../validators/messages.validators';
import {
  MessageListResponseSchema,
  MessageResponseSchema,
  MessageTemplateListResponseSchema,
  MessageTemplateResponseSchema,
  DeliveryStatusResponseSchema,
  CommunicationStatisticsResponseSchema,
  ErrorResponseSchema
} from '../../RESPONSE_SCHEMAS';

/**
 * MESSAGE CRUD ROUTES
 */

const listMessagesRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/communications/messages',
  handler: asyncHandler(MessagesController.list),
  options: {
    auth: 'jwt',
    tags: ['api', 'Communications', 'Messages', 'v1'],
    description: 'List messages with pagination and filters',
    notes: '**PHI Protected Endpoint** - Returns paginated list of messages. Supports filtering by sender, recipient, category, priority, status, and date range. Includes sender details and delivery summary. Access is audited for compliance.',
    validate: {
      query: listMessagesQuerySchema,
      failAction: standardFailAction
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Messages retrieved successfully with pagination', schema: MessageListResponseSchema },
          '401': { description: 'Unauthorized', schema: ErrorResponseSchema },
          '500': { description: 'Internal server error', schema: ErrorResponseSchema }
        }
      }
    }
  }
};

const getMessageByIdRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/communications/messages/{id}',
  handler: asyncHandler(MessagesController.getById),
  options: {
    auth: 'jwt',
    tags: ['api', 'Communications', 'Messages', 'v1'],
    description: 'Get message by ID',
    notes: '**PHI Protected Endpoint** - Returns detailed message information including sender details, template used, and all delivery records. Shows message content, attachments, priority, category, and delivery status across all channels.',
    validate: {
      params: messageIdParamSchema,
      failAction: standardFailAction
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Message retrieved successfully', schema: MessageResponseSchema },
          '401': { description: 'Unauthorized', schema: ErrorResponseSchema },
          '404': { description: 'Message not found', schema: ErrorResponseSchema }
        }
      }
    }
  }
};

const sendMessageRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/communications/messages',
  handler: asyncHandler(MessagesController.send),
  options: {
    auth: 'jwt',
    tags: ['api', 'Communications', 'Messages', 'v1'],
    description: 'Send new message to specific recipients',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Sends message to specified recipients via selected channels (EMAIL, SMS, PUSH_NOTIFICATION, VOICE). Supports immediate or scheduled delivery. Validates HIPAA compliance, message content limits, and recipient contact information. Maximum 100 recipients per message. Returns message record and delivery status for each recipient/channel combination.',
    validate: {
      payload: sendMessageSchema,
      failAction: standardFailAction
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Message sent successfully', schema: MessageResponseSchema },
          '400': { description: 'Validation error - Invalid message data or HIPAA violation', schema: ErrorResponseSchema },
          '401': { description: 'Unauthorized', schema: ErrorResponseSchema },
          '403': { description: 'Forbidden - Insufficient permissions', schema: ErrorResponseSchema },
          '429': { description: 'Too many requests - Rate limit exceeded', schema: ErrorResponseSchema }
        }
      }
    }
  }
};

const updateMessageRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/communications/messages/{id}',
  handler: asyncHandler(MessagesController.update),
  options: {
    auth: 'jwt',
    tags: ['api', 'Communications', 'Messages', 'v1'],
    description: 'Update message (draft/scheduled only)',
    notes: '**PHI Protected Endpoint** - Updates message content or metadata. Only scheduled messages that have not yet been sent can be updated. Cannot update messages that have already been delivered. Sender must own the message. Used for editing drafts or rescheduling messages.',
    validate: {
      params: messageIdParamSchema,
      payload: updateMessageSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Message updated successfully', schema: MessageResponseSchema },
          '400': { description: 'Validation error or message already sent', schema: ErrorResponseSchema },
          '401': { description: 'Unauthorized', schema: ErrorResponseSchema },
          '403': { description: 'Forbidden - Not message owner', schema: ErrorResponseSchema },
          '404': { description: 'Message not found', schema: ErrorResponseSchema }
        }
      }
    }
  }
};

const deleteMessageRoute: ServerRoute = {
  method: 'DELETE',
  path: '/api/v1/communications/messages/{id}',
  handler: asyncHandler(MessagesController.delete),
  options: {
    auth: 'jwt',
    tags: ['api', 'Communications', 'Messages', 'v1'],
    description: 'Delete message (cancel scheduled)',
    notes: '**PHI Protected Endpoint** - Cancels a scheduled message before it is sent. Cannot delete messages that have already been sent. Sender must own the message. Historical records are preserved for audit trail.',
    validate: {
      params: messageIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '204': { description: 'Message cancelled successfully (no content)', schema: MessageResponseSchema },
          '400': { description: 'Message already sent or cannot be deleted', schema: ErrorResponseSchema },
          '401': { description: 'Unauthorized', schema: ErrorResponseSchema },
          '403': { description: 'Forbidden - Not message owner', schema: ErrorResponseSchema },
          '404': { description: 'Message not found', schema: ErrorResponseSchema }
        }
      }
    }
  }
};

const replyToMessageRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/communications/messages/{id}/reply',
  handler: asyncHandler(MessagesController.reply),
  options: {
    auth: 'jwt',
    tags: ['api', 'Communications', 'Messages', 'v1'],
    description: 'Reply to a message',
    notes: '**PHI Protected Endpoint** - Creates a reply to an existing message. Reply is sent to the original message sender. Subject is automatically prefixed with "Re:". Inherits category from original message. Supports all standard communication channels.',
    validate: {
      params: messageIdParamSchema,
      payload: replyToMessageSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Reply sent successfully', schema: MessageResponseSchema },
          '400': { description: 'Validation error', schema: ErrorResponseSchema },
          '401': { description: 'Unauthorized', schema: ErrorResponseSchema },
          '404': { description: 'Original message not found', schema: ErrorResponseSchema },
          '429': { description: 'Too many requests - Rate limit exceeded', schema: ErrorResponseSchema }
        }
      }
    }
  }
};

/**
 * INBOX & SENT ROUTES
 */

const getInboxRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/communications/messages/inbox',
  handler: asyncHandler(MessagesController.getInbox),
  options: {
    auth: 'jwt',
    tags: ['api', 'Communications', 'Messages', 'v1'],
    description: 'Get inbox messages for current user',
    notes: '**PHI Protected Endpoint** - Returns messages where the current user is a recipient. Shows messages received across all channels. Includes delivery status and read/unread tracking. Paginated for performance.',
    validate: {
      query: getInboxQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Inbox messages retrieved successfully', schema: MessageListResponseSchema },
          '401': { description: 'Unauthorized', schema: ErrorResponseSchema },
          '500': { description: 'Internal server error', schema: ErrorResponseSchema }
        }
      }
    }
  }
};

const getSentRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/communications/messages/sent',
  handler: asyncHandler(MessagesController.getSent),
  options: {
    auth: 'jwt',
    tags: ['api', 'Communications', 'Messages', 'v1'],
    description: 'Get sent messages for current user',
    notes: '**PHI Protected Endpoint** - Returns messages sent by the current user. Includes delivery statistics, recipient count, and overall delivery status. Useful for tracking message history and delivery success rates.',
    validate: {
      query: getSentQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Sent messages retrieved successfully', schema: MessageListResponseSchema },
          '401': { description: 'Unauthorized', schema: ErrorResponseSchema },
          '500': { description: 'Internal server error', schema: ErrorResponseSchema }
        }
      }
    }
  }
};

/**
 * TEMPLATE ROUTES
 */

const listTemplatesRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/communications/templates',
  handler: asyncHandler(MessagesController.listTemplates),
  options: {
    auth: 'jwt',
    tags: ['api', 'Communications', 'Templates', 'v1'],
    description: 'List message templates',
    notes: 'Returns available message templates for quick message composition. Templates support variable substitution like {{studentName}}, {{date}}, etc. Can filter by message type (EMAIL, SMS, etc.) and category. Only active templates returned by default.',
    validate: {
      query: listTemplatesQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Templates retrieved successfully', schema: MessageTemplateListResponseSchema },
          '401': { description: 'Unauthorized', schema: ErrorResponseSchema },
          '500': { description: 'Internal server error', schema: ErrorResponseSchema }
        }
      }
    }
  }
};

const createTemplateRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/communications/templates',
  handler: asyncHandler(MessagesController.createTemplate),
  options: {
    auth: 'jwt',
    tags: ['api', 'Communications', 'Templates', 'v1'],
    description: 'Create message template',
    notes: 'Creates a new reusable message template. Templates support variable substitution using {{variableName}} syntax. Variables are automatically extracted from content. Template validation ensures content meets requirements for specified message type (e.g., SMS character limits). Requires NURSE or ADMIN role.',
    validate: {
      payload: createTemplateSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Template created successfully', schema: MessageTemplateResponseSchema },
          '400': { description: 'Validation error - Invalid template data', schema: ErrorResponseSchema },
          '401': { description: 'Unauthorized', schema: ErrorResponseSchema },
          '403': { description: 'Forbidden - Requires NURSE or ADMIN role', schema: ErrorResponseSchema }
        }
      }
    }
  }
};

/**
 * DELIVERY STATUS ROUTES
 */

const getDeliveryStatusRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/communications/delivery-status/{messageId}',
  handler: asyncHandler(MessagesController.getDeliveryStatus),
  options: {
    auth: 'jwt',
    tags: ['api', 'Communications', 'Delivery', 'v1'],
    description: 'Get message delivery status',
    notes: '**PHI Protected Endpoint** - Returns detailed delivery status for a message. Shows status for each recipient/channel combination (PENDING, SENT, DELIVERED, FAILED, BOUNCED). Includes summary statistics, timestamps, failure reasons, and external tracking IDs. Essential for monitoring message delivery and troubleshooting issues.',
    validate: {
      params: deliveryStatusParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Delivery status retrieved successfully', schema: DeliveryStatusResponseSchema },
          '401': { description: 'Unauthorized', schema: ErrorResponseSchema },
          '404': { description: 'Message not found', schema: ErrorResponseSchema },
          '500': { description: 'Internal server error', schema: ErrorResponseSchema }
        }
      }
    }
  }
};

/**
 * STATISTICS ROUTES
 */

const getStatisticsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/communications/statistics',
  handler: asyncHandler(MessagesController.getStatistics),
  options: {
    auth: 'jwt',
    tags: ['api', 'Communications', 'Statistics', 'v1'],
    description: 'Get messaging statistics',
    notes: 'Returns aggregated communication statistics. Shows total messages, breakdown by category/priority/channel, delivery success rates, and trends. Can filter by date range and sender. No PHI exposed - aggregated data only. Used for dashboards, reports, and system monitoring.',
    validate: {
      query: statisticsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Statistics retrieved successfully', schema: CommunicationStatisticsResponseSchema },
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

export const messagesRoutes: ServerRoute[] = [
  // Message CRUD (6 routes)
  listMessagesRoute,
  getMessageByIdRoute,
  sendMessageRoute,
  updateMessageRoute,
  deleteMessageRoute,
  replyToMessageRoute,

  // Inbox & Sent (2 routes)
  getInboxRoute,
  getSentRoute,

  // Templates (2 routes)
  listTemplatesRoute,
  createTemplateRoute,

  // Delivery & Statistics (2 routes)
  getDeliveryStatusRoute,
  getStatisticsRoute
];
