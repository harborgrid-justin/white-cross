/**
 * Messages Routes - Enhanced with Comprehensive Swagger Documentation
 * HTTP endpoints for message management, delivery tracking, and templates
 * All routes prefixed with /api/v1/communications
 *
 * Swagger/OpenAPI Documentation:
 * - Complete request/response schemas for all 12 endpoints
 * - HIPAA compliance notes for PHI-protected endpoints
 * - Comprehensive error responses and status codes
 * - Request body examples and validation rules
 */

import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import { asyncHandler } from '../../../shared/utils';
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

/**
 * SWAGGER SCHEMA COMPONENTS
 * Reusable response schemas for documentation
 */

const messageObjectSchema = Joi.object({
  id: Joi.string().uuid().description('Message unique identifier').example('550e8400-e29b-41d4-a716-446655440000'),
  senderId: Joi.string().uuid().description('Sender user ID'),
  senderName: Joi.string().description('Sender display name').example('Nurse Jane Smith'),
  subject: Joi.string().allow(null).description('Message subject (EMAIL channel)').example('Health Update for Student'),
  content: Joi.string().description('Message body content').example('Your child was seen by the nurse today for a minor headache. They received acetaminophen and are resting.'),
  category: Joi.string().valid('EMERGENCY', 'HEALTH_UPDATE', 'APPOINTMENT_REMINDER', 'MEDICATION_REMINDER', 'GENERAL', 'INCIDENT_NOTIFICATION', 'COMPLIANCE').example('HEALTH_UPDATE'),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').example('MEDIUM'),
  channels: Joi.array().items(Joi.string().valid('EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE')).example(['EMAIL', 'SMS']),
  recipientCount: Joi.number().description('Total number of recipients').example(2),
  templateId: Joi.string().uuid().allow(null).description('Template used (if any)'),
  deliverySummary: Joi.object({
    total: Joi.number().example(2),
    pending: Joi.number().example(0),
    sent: Joi.number().example(2),
    delivered: Joi.number().example(1),
    failed: Joi.number().example(0),
    bounced: Joi.number().example(0)
  }).description('Delivery status summary across all recipients'),
  scheduledAt: Joi.date().iso().allow(null).description('Scheduled delivery time (null for immediate)').example(null),
  createdAt: Joi.date().iso().example('2025-10-23T10:30:00Z'),
  updatedAt: Joi.date().iso().example('2025-10-23T10:31:00Z')
}).label('MessageObject');

const deliveryStatusObjectSchema = Joi.object({
  id: Joi.string().uuid().description('Delivery record ID'),
  messageId: Joi.string().uuid().description('Associated message ID'),
  recipientId: Joi.string().uuid().description('Recipient user ID'),
  recipientType: Joi.string().valid('STUDENT', 'EMERGENCY_CONTACT', 'PARENT', 'NURSE', 'ADMIN').example('PARENT'),
  channel: Joi.string().valid('EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE').example('EMAIL'),
  recipientContact: Joi.string().description('Email/phone used').example('parent@example.com'),
  status: Joi.string().valid('PENDING', 'SENT', 'DELIVERED', 'FAILED', 'BOUNCED').example('DELIVERED'),
  sentAt: Joi.date().iso().allow(null).example('2025-10-23T10:30:15Z'),
  deliveredAt: Joi.date().iso().allow(null).example('2025-10-23T10:31:22Z'),
  failureReason: Joi.string().allow(null).description('Error message if failed').example(null),
  externalId: Joi.string().allow(null).description('External provider tracking ID').example('sendgrid-msg-xyz123'),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso()
}).label('DeliveryStatusObject');

const templateObjectSchema = Joi.object({
  id: Joi.string().uuid().example('650e8400-e29b-41d4-a716-446655440000'),
  name: Joi.string().example('Appointment Reminder Template'),
  subject: Joi.string().allow(null).example('Upcoming Appointment for {{studentName}}'),
  content: Joi.string().example('Hello {{parentName}}, This is a reminder that {{studentName}} has an appointment on {{appointmentDate}} at {{appointmentTime}}.'),
  type: Joi.string().valid('EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE').example('EMAIL'),
  category: Joi.string().valid('EMERGENCY', 'HEALTH_UPDATE', 'APPOINTMENT_REMINDER', 'MEDICATION_REMINDER', 'GENERAL', 'INCIDENT_NOTIFICATION', 'COMPLIANCE').example('APPOINTMENT_REMINDER'),
  variables: Joi.array().items(Joi.string()).example(['studentName', 'parentName', 'appointmentDate', 'appointmentTime']),
  isActive: Joi.boolean().example(true),
  createdBy: Joi.string().uuid().description('User who created template'),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso()
}).label('TemplateObject');

const paginationObjectSchema = Joi.object({
  page: Joi.number().integer().description('Current page number').example(1),
  limit: Joi.number().integer().description('Items per page').example(20),
  total: Joi.number().integer().description('Total number of items').example(156),
  pages: Joi.number().integer().description('Total number of pages').example(8)
}).label('PaginationObject');

const errorResponseSchema = Joi.object({
  success: Joi.boolean().example(false),
  error: Joi.object({
    message: Joi.string().example('Message not found'),
    code: Joi.string().optional().example('MESSAGE_NOT_FOUND'),
    details: Joi.any().optional()
  })
}).label('ErrorResponse');

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
    notes: [
      '**PHI Protected Endpoint** - Returns paginated list of messages.',
      '',
      'Supports filtering by:',
      '- `senderId`: Filter by sender UUID',
      '- `recipientId`: Filter by recipient UUID',
      '- `category`: Filter by message category',
      '- `priority`: Filter by message priority',
      '- `status`: Filter by delivery status',
      '- `dateFrom` / `dateTo`: Filter by date range',
      '',
      'Includes sender details and delivery summary for each message.',
      'Access is audited for compliance.',
      '',
      '**Example Request:**',
      '```',
      'GET /api/v1/communications/messages?page=1&limit=20&category=HEALTH_UPDATE&priority=HIGH',
      '```'
    ].join('\n'),
    validate: {
      query: listMessagesQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Messages retrieved successfully with pagination',
            schema: Joi.object({
              success: Joi.boolean().example(true),
              data: Joi.object({
                messages: Joi.array().items(messageObjectSchema),
                pagination: paginationObjectSchema
              })
            }).label('ListMessagesResponse')
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
        order: 1
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
    description: 'Get message by ID with full details',
    notes: [
      '**PHI Protected Endpoint** - Returns detailed message information.',
      '',
      'Response includes:',
      '- Complete message content and metadata',
      '- Sender details',
      '- Template used (if applicable)',
      '- All delivery records across all recipients and channels',
      '- Message attachments',
      '- Priority and category information',
      '',
      'Used for viewing message details and tracking delivery status.',
      '',
      '**Example Request:**',
      '```',
      'GET /api/v1/communications/messages/550e8400-e29b-41d4-a716-446655440000',
      '```'
    ].join('\n'),
    validate: {
      params: messageIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Message retrieved successfully',
            schema: Joi.object({
              success: Joi.boolean().example(true),
              data: Joi.object({
                message: messageObjectSchema.keys({
                  deliveries: Joi.array().items(deliveryStatusObjectSchema).description('Full delivery records')
                })
              })
            }).label('GetMessageResponse')
          },
          '401': {
            description: 'Unauthorized - Invalid or missing JWT token',
            schema: errorResponseSchema
          },
          '404': {
            description: 'Message not found',
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

const sendMessageRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/communications/messages',
  handler: asyncHandler(MessagesController.send),
  options: {
    auth: 'jwt',
    tags: ['api', 'Communications', 'Messages', 'v1'],
    description: 'Send new message to specific recipients',
    notes: [
      '**HIGHLY SENSITIVE PHI ENDPOINT** - Sends message to specified recipients.',
      '',
      'Supported channels: EMAIL, SMS, PUSH_NOTIFICATION, VOICE',
      'Delivery options: Immediate or scheduled',
      '',
      '**Validation Rules:**',
      '- Maximum 100 recipients per message (use broadcasts for more)',
      '- EMAIL channel requires `subject` field',
      '- `scheduledAt` must be in the future',
      '- Content max length: 5000 characters',
      '- Attachments: max 5 files, 10MB each',
      '',
      '**HIPAA Compliance:**',
      '- All message content is encrypted',
      '- Delivery tracked for audit trail',
      '- Recipient contact info validated',
      '- PHI content automatically flagged',
      '',
      '**Example Request:**',
      '```json',
      '{',
      '  "recipients": [',
      '    {',
      '      "type": "PARENT",',
      '      "id": "parent-uuid-here",',
      '      "email": "parent@example.com",',
      '      "phoneNumber": "+1234567890"',
      '    }',
      '  ],',
      '  "channels": ["EMAIL", "SMS"],',
      '  "subject": "Health Update",',
      '  "content": "Your child visited the nurse today.",',
      '  "priority": "MEDIUM",',
      '  "category": "HEALTH_UPDATE",',
      '  "scheduledAt": null',
      '}',
      '```'
    ].join('\n'),
    validate: {
      payload: sendMessageSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': {
            description: 'Message sent successfully',
            schema: Joi.object({
              success: Joi.boolean().example(true),
              data: Joi.object({
                message: messageObjectSchema,
                deliveryStatuses: Joi.array().items(deliveryStatusObjectSchema).description('Initial delivery status for each recipient/channel combination')
              })
            }).label('SendMessageResponse')
          },
          '400': {
            description: 'Validation error - Invalid message data or HIPAA violation',
            schema: errorResponseSchema.keys({
              error: Joi.object({
                message: Joi.string().example('Subject is required when using EMAIL channel'),
                code: Joi.string().example('VALIDATION_ERROR'),
                details: Joi.array().items(
                  Joi.object({
                    field: Joi.string().example('subject'),
                    message: Joi.string().example('Subject is required when using EMAIL channel')
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
            description: 'Forbidden - Insufficient permissions to send messages',
            schema: errorResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: errorResponseSchema
          }
        },
        order: 3,
        payloadType: 'json'
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
    description: 'Update message (scheduled messages only)',
    notes: [
      '**PHI Protected Endpoint** - Updates message content or metadata.',
      '',
      '**Important Restrictions:**',
      '- Only SCHEDULED messages can be updated',
      '- Messages already sent CANNOT be modified',
      '- Only the message sender can update',
      '- `scheduledAt` must be in the future',
      '',
      'Use cases:',
      '- Editing draft messages before sending',
      '- Rescheduling delivery time',
      '- Updating content before scheduled send',
      '',
      '**Example Request:**',
      '```json',
      '{',
      '  "content": "Updated message content",',
      '  "scheduledAt": "2025-10-24T14:00:00Z"',
      '}',
      '```'
    ].join('\n'),
    validate: {
      params: messageIdParamSchema,
      payload: updateMessageSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Message updated successfully',
            schema: Joi.object({
              success: Joi.boolean().example(true),
              data: Joi.object({
                message: messageObjectSchema
              })
            }).label('UpdateMessageResponse')
          },
          '400': {
            description: 'Validation error or message already sent',
            schema: errorResponseSchema.keys({
              error: Joi.object({
                message: Joi.string().example('Cannot update messages that have already been sent'),
                code: Joi.string().example('MESSAGE_ALREADY_SENT')
              })
            })
          },
          '401': {
            description: 'Unauthorized - Invalid or missing JWT token',
            schema: errorResponseSchema
          },
          '403': {
            description: 'Forbidden - Not the message owner',
            schema: errorResponseSchema
          },
          '404': {
            description: 'Message not found',
            schema: errorResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: errorResponseSchema
          }
        },
        order: 4,
        payloadType: 'json'
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
    notes: [
      '**PHI Protected Endpoint** - Cancels a scheduled message before sending.',
      '',
      '**Important Restrictions:**',
      '- Only SCHEDULED messages can be deleted',
      '- Messages already sent CANNOT be deleted',
      '- Only the message sender can delete',
      '',
      '**Audit Trail:**',
      '- Historical records are preserved for compliance',
      '- Deletion action is logged in audit trail',
      '- Original message metadata retained for reporting',
      '',
      '**Example Request:**',
      '```',
      'DELETE /api/v1/communications/messages/550e8400-e29b-41d4-a716-446655440000',
      '```'
    ].join('\n'),
    validate: {
      params: messageIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Message cancelled successfully',
            schema: Joi.object({
              success: Joi.boolean().example(true),
              data: Joi.object({
                message: Joi.string().example('Message cancelled successfully')
              })
            }).label('DeleteMessageResponse')
          },
          '400': {
            description: 'Message already sent or cannot be deleted',
            schema: errorResponseSchema
          },
          '401': {
            description: 'Unauthorized - Invalid or missing JWT token',
            schema: errorResponseSchema
          },
          '403': {
            description: 'Forbidden - Not the message owner',
            schema: errorResponseSchema
          },
          '404': {
            description: 'Message not found',
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

const replyToMessageRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/communications/messages/{id}/reply',
  handler: asyncHandler(MessagesController.reply),
  options: {
    auth: 'jwt',
    tags: ['api', 'Communications', 'Messages', 'v1'],
    description: 'Reply to a message',
    notes: [
      '**PHI Protected Endpoint** - Creates a reply to an existing message.',
      '',
      '**Reply Behavior:**',
      '- Reply is sent to the original message sender',
      '- Subject is automatically prefixed with "Re:"',
      '- Category is inherited from original message',
      '- Supports all standard communication channels',
      '',
      '**Example Request:**',
      '```json',
      '{',
      '  "content": "Thank you for the update. My child is feeling better now.",',
      '  "channels": ["EMAIL"],',
      '  "priority": "MEDIUM"',
      '}',
      '```'
    ].join('\n'),
    validate: {
      params: messageIdParamSchema,
      payload: replyToMessageSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': {
            description: 'Reply sent successfully',
            schema: Joi.object({
              success: Joi.boolean().example(true),
              data: Joi.object({
                message: messageObjectSchema,
                deliveryStatuses: Joi.array().items(deliveryStatusObjectSchema)
              })
            }).label('ReplyToMessageResponse')
          },
          '400': {
            description: 'Validation error',
            schema: errorResponseSchema
          },
          '401': {
            description: 'Unauthorized - Invalid or missing JWT token',
            schema: errorResponseSchema
          },
          '404': {
            description: 'Original message not found',
            schema: errorResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: errorResponseSchema
          }
        },
        order: 6,
        payloadType: 'json'
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
    notes: [
      '**PHI Protected Endpoint** - Returns messages where the current user is a recipient.',
      '',
      'Response includes:',
      '- Messages received across all channels',
      '- Delivery status (delivered, read, unread)',
      '- Sender information',
      '- Message priority and category',
      '',
      'Results are paginated for performance.',
      '',
      '**Example Request:**',
      '```',
      'GET /api/v1/communications/messages/inbox?page=1&limit=20',
      '```'
    ].join('\n'),
    validate: {
      query: getInboxQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Inbox messages retrieved successfully',
            schema: Joi.object({
              success: Joi.boolean().example(true),
              data: Joi.object({
                messages: Joi.array().items(messageObjectSchema),
                total: Joi.number().example(42),
                page: Joi.number().example(1),
                limit: Joi.number().example(20)
              })
            }).label('GetInboxResponse')
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
        order: 7
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
    notes: [
      '**PHI Protected Endpoint** - Returns messages sent by the current user.',
      '',
      'Response includes:',
      '- Delivery statistics per message',
      '- Recipient count',
      '- Overall delivery status',
      '- Message content and metadata',
      '',
      'Useful for tracking message history and delivery success rates.',
      '',
      '**Example Request:**',
      '```',
      'GET /api/v1/communications/messages/sent?page=1&limit=20',
      '```'
    ].join('\n'),
    validate: {
      query: getSentQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Sent messages retrieved successfully',
            schema: Joi.object({
              success: Joi.boolean().example(true),
              data: Joi.object({
                messages: Joi.array().items(messageObjectSchema),
                pagination: paginationObjectSchema
              })
            }).label('GetSentResponse')
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
    notes: [
      'Returns available message templates for quick message composition.',
      '',
      '**Template Features:**',
      '- Variable substitution using {{variableName}} syntax',
      '- Support for common variables: {{studentName}}, {{parentName}}, {{date}}, {{time}}',
      '- Filter by message type (EMAIL, SMS, etc.)',
      '- Filter by category (HEALTH_UPDATE, APPOINTMENT_REMINDER, etc.)',
      '',
      'Only active templates are returned by default.',
      '',
      '**Example Request:**',
      '```',
      'GET /api/v1/communications/templates?type=EMAIL&category=APPOINTMENT_REMINDER',
      '```'
    ].join('\n'),
    validate: {
      query: listTemplatesQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Templates retrieved successfully',
            schema: Joi.object({
              success: Joi.boolean().example(true),
              data: Joi.object({
                templates: Joi.array().items(templateObjectSchema)
              })
            }).label('ListTemplatesResponse')
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
        order: 9
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
    notes: [
      'Creates a new reusable message template.',
      '',
      '**Template Syntax:**',
      '- Use {{variableName}} for variable substitution',
      '- Variables are automatically extracted from content',
      '- Common variables: {{studentName}}, {{parentName}}, {{date}}, {{time}}, {{appointmentDate}}',
      '',
      '**Validation:**',
      '- Template content must meet requirements for specified message type',
      '- SMS templates: max 160 characters (or 306 for Unicode)',
      '- EMAIL templates: subject and body required',
      '',
      '**Permissions:**',
      '- Requires NURSE or ADMIN role',
      '',
      '**Example Request:**',
      '```json',
      '{',
      '  "name": "Appointment Reminder",',
      '  "subject": "Upcoming Appointment for {{studentName}}",',
      '  "content": "Hello {{parentName}}, reminder that {{studentName}} has an appointment on {{date}} at {{time}}.",',
      '  "type": "EMAIL",',
      '  "category": "APPOINTMENT_REMINDER",',
      '  "isActive": true',
      '}',
      '```'
    ].join('\n'),
    validate: {
      payload: createTemplateSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': {
            description: 'Template created successfully',
            schema: Joi.object({
              success: Joi.boolean().example(true),
              data: Joi.object({
                template: templateObjectSchema
              })
            }).label('CreateTemplateResponse')
          },
          '400': {
            description: 'Validation error - Invalid template data',
            schema: errorResponseSchema
          },
          '401': {
            description: 'Unauthorized - Invalid or missing JWT token',
            schema: errorResponseSchema
          },
          '403': {
            description: 'Forbidden - Requires NURSE or ADMIN role',
            schema: errorResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: errorResponseSchema
          }
        },
        order: 10,
        payloadType: 'json'
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
    notes: [
      '**PHI Protected Endpoint** - Returns detailed delivery status for a message.',
      '',
      'Response includes:',
      '- Status for each recipient/channel combination',
      '- Delivery statuses: PENDING, SENT, DELIVERED, FAILED, BOUNCED',
      '- Summary statistics',
      '- Timestamps for sent and delivered events',
      '- Failure reasons (if applicable)',
      '- External tracking IDs from email/SMS providers',
      '',
      'Essential for:',
      '- Monitoring message delivery',
      '- Troubleshooting delivery issues',
      '- Compliance reporting',
      '',
      '**Example Request:**',
      '```',
      'GET /api/v1/communications/delivery-status/550e8400-e29b-41d4-a716-446655440000',
      '```'
    ].join('\n'),
    validate: {
      params: deliveryStatusParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Delivery status retrieved successfully',
            schema: Joi.object({
              success: Joi.boolean().example(true),
              data: Joi.object({
                deliveries: Joi.array().items(deliveryStatusObjectSchema),
                summary: Joi.object({
                  total: Joi.number().example(5),
                  pending: Joi.number().example(0),
                  sent: Joi.number().example(5),
                  delivered: Joi.number().example(4),
                  failed: Joi.number().example(1),
                  bounced: Joi.number().example(0)
                }).description('Overall delivery summary')
              })
            }).label('GetDeliveryStatusResponse')
          },
          '401': {
            description: 'Unauthorized - Invalid or missing JWT token',
            schema: errorResponseSchema
          },
          '404': {
            description: 'Message not found',
            schema: errorResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: errorResponseSchema
          }
        },
        order: 11
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
    notes: [
      'Returns aggregated communication statistics.',
      '',
      '**Statistics Include:**',
      '- Total messages sent',
      '- Breakdown by category (HEALTH_UPDATE, EMERGENCY, etc.)',
      '- Breakdown by priority (LOW, MEDIUM, HIGH, URGENT)',
      '- Breakdown by channel (EMAIL, SMS, PUSH_NOTIFICATION)',
      '- Delivery success rates',
      '- Trends over time',
      '',
      '**Privacy:**',
      '- No PHI exposed - aggregated data only',
      '- Can filter by date range and sender',
      '',
      'Used for:',
      '- Dashboard analytics',
      '- Compliance reports',
      '- System monitoring',
      '',
      '**Example Request:**',
      '```',
      'GET /api/v1/communications/statistics?dateFrom=2025-10-01&dateTo=2025-10-23',
      '```'
    ].join('\n'),
    validate: {
      query: statisticsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Statistics retrieved successfully',
            schema: Joi.object({
              success: Joi.boolean().example(true),
              data: Joi.object({
                stats: Joi.object({
                  totalMessages: Joi.number().example(1234),
                  byCategory: Joi.object({
                    HEALTH_UPDATE: Joi.number().example(456),
                    APPOINTMENT_REMINDER: Joi.number().example(321),
                    EMERGENCY: Joi.number().example(12),
                    MEDICATION_REMINDER: Joi.number().example(234),
                    GENERAL: Joi.number().example(211)
                  }),
                  byPriority: Joi.object({
                    LOW: Joi.number().example(234),
                    MEDIUM: Joi.number().example(789),
                    HIGH: Joi.number().example(198),
                    URGENT: Joi.number().example(13)
                  }),
                  byChannel: Joi.object({
                    EMAIL: Joi.number().example(987),
                    SMS: Joi.number().example(654),
                    PUSH_NOTIFICATION: Joi.number().example(432),
                    VOICE: Joi.number().example(21)
                  }),
                  deliveryStatus: Joi.object({
                    PENDING: Joi.number().example(45),
                    SENT: Joi.number().example(123),
                    DELIVERED: Joi.number().example(1012),
                    FAILED: Joi.number().example(32),
                    BOUNCED: Joi.number().example(22)
                  })
                }).description('Aggregated statistics')
              })
            }).label('GetStatisticsResponse')
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
        order: 12
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
