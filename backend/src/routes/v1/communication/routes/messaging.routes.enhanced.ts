/**
 * Communication Messaging Routes - Enhanced with Comprehensive Swagger Documentation
 * Handles bulk messaging and notification features
 * Path prefix: /v1/communication
 *
 * Swagger/OpenAPI Documentation:
 * - Complete request/response schemas for bulk messaging endpoint
 * - FERPA/HIPAA compliance documentation
 * - Tracking and delivery options
 * - Comprehensive error responses
 */

import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import { sendBulkMessage } from '../controllers/messaging.controller';
import {
  bulkMessageSchema
} from '../validators/messaging.validators';

/**
 * SWAGGER SCHEMA COMPONENTS
 * Reusable response schemas for documentation
 */

const bulkMessageResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    messageId: Joi.string().description('Unique message batch identifier').example('msg_1698076800_abc123xyz'),
    sentCount: Joi.number().description('Number of messages successfully sent').example(947),
    failedCount: Joi.number().description('Number of messages that failed').example(53),
    status: Joi.string().valid('sending', 'scheduled', 'completed', 'failed').example('sending'),
    estimatedDelivery: Joi.date().iso().description('Estimated completion time').example('2025-10-23T10:35:00Z'),
    batchDetails: Joi.object({
      totalBatches: Joi.number().example(20),
      completedBatches: Joi.number().example(0),
      remainingBatches: Joi.number().example(20)
    }).optional().description('Batch processing details for large sends')
  })
}).label('BulkMessageResponse');

const errorResponseSchema = Joi.object({
  success: Joi.boolean().example(false),
  error: Joi.object({
    message: Joi.string().example('Invalid message data'),
    code: Joi.string().optional().example('VALIDATION_ERROR'),
    details: Joi.any().optional()
  })
}).label('ErrorResponse');

/**
 * BULK MESSAGING ROUTES
 */

export const messagingRoutes: ServerRoute[] = [
  // Send bulk message to multiple recipients
  {
    method: 'POST',
    path: '/v1/communication/bulk-message',
    options: {
      auth: 'jwt',
      tags: ['api', 'communication', 'messaging', 'v1'],
      description: 'Send bulk message to multiple recipients',
      notes: [
        '**HIGHLY SENSITIVE PHI ENDPOINT** - Sends bulk messages to groups of parents, students, or staff.',
        '',
        '**Bulk Messaging Features:**',
        '- Send to up to 1000 recipients per batch',
        '- Multiple communication channels (email, sms, push, app, voice)',
        '- Message type categorization for routing and compliance',
        '- Priority levels (low, medium, high, urgent)',
        '- Scheduled delivery support',
        '- Attachment support (max 5 files, 25MB each)',
        '- Multi-language support',
        '',
        '**Recipient Configuration:**',
        '- `recipients`: Array of recipient objects (max 1000)',
        '  - `id`: User UUID (required)',
        '  - `type`: student, parent, guardian, staff, teacher, nurse, admin (required)',
        '  - `contactMethod`: Preferred channel override (optional)',
        '  - `language`: Preferred language for message (optional, default: en)',
        '',
        '**Message Object:**',
        '- `subject`: Message subject line (1-200 chars, required)',
        '- `body`: Plain text message body (1-5000 chars, required)',
        '- `htmlBody`: HTML formatted body (optional, max 10000 chars)',
        '- `attachments`: Array of attachment objects (optional, max 5)',
        '',
        '**Message Types:**',
        '- general, emergency, health-alert, attendance, academic',
        '- behavior, event, reminder, newsletter, administrative',
        '',
        '**Delivery Options:**',
        '- `sendImmediately`: Send now vs batch queue (default: true)',
        '- `retryAttempts`: Failed delivery retries (0-5, default: 3)',
        '- `batchSize`: Messages per batch (1-100, default: 50)',
        '- `throttleDelay`: Delay between batches in seconds (0-300, default: 0)',
        '',
        '**Tracking Options:**',
        '- `trackOpens`: Track when recipients open message (default: true)',
        '- `trackClicks`: Track link clicks (default: true)',
        '- `trackReplies`: Track replies (default: true)',
        '- `requireDeliveryConfirmation`: Require confirmation for high-priority (default: false)',
        '',
        '**Compliance Requirements:**',
        '- `ferpaCompliant`: FERPA compliance flag (default: true)',
        '- `hipaaCompliant`: HIPAA compliance (required for health-alert type)',
        '- `retentionPeriod`: Message retention in days (30-2555, default: 365)',
        '- `auditTrail`: Maintain audit trail (default: true)',
        '',
        '**FERPA/HIPAA Compliance:**',
        '- All messages are encrypted at rest and in transit',
        '- Access is audited and logged',
        '- Recipient lists are validated',
        '- PHI content is automatically flagged',
        '- Retention policies enforced',
        '',
        '**Rate Limiting:**',
        '- Throttle delays prevent system overload',
        '- Batch sizes configurable per organization',
        '- High-priority messages processed first',
        '',
        '**Example Request - Simple Bulk Message:**',
        '```json',
        '{',
        '  "recipients": [',
        '    {',
        '      "id": "parent-uuid-1",',
        '      "type": "parent",',
        '      "language": "en"',
        '    },',
        '    {',
        '      "id": "parent-uuid-2",',
        '      "type": "parent",',
        '      "language": "es"',
        '    }',
        '  ],',
        '  "message": {',
        '    "subject": "School Closure Notice",',
        '    "body": "Due to weather conditions, school will be closed tomorrow."',
        '  },',
        '  "messageType": "general",',
        '  "priority": "high",',
        '  "channels": ["email", "sms", "app"]',
        '}',
        '```',
        '',
        '**Example Request - Health Alert with Compliance:**',
        '```json',
        '{',
        '  "recipients": [',
        '    { "id": "parent-uuid", "type": "parent" }',
        '  ],',
        '  "message": {',
        '    "subject": "Health Screening Reminder",',
        '    "body": "Your child is due for their annual health screening.",',
        '    "htmlBody": "<p>Your child <strong>is due</strong> for their annual health screening.</p>"',
        '  },',
        '  "messageType": "health-alert",',
        '  "priority": "medium",',
        '  "channels": ["email"],',
        '  "scheduledTime": "2025-10-24T08:00:00Z",',
        '  "compliance": {',
        '    "hipaaCompliant": true,',
        '    "ferpaCompliant": true,',
        '    "retentionPeriod": 730,',
        '    "auditTrail": true',
        '  },',
        '  "trackingOptions": {',
        '    "trackOpens": true,',
        '    "trackClicks": true,',
        '    "requireDeliveryConfirmation": true',
        '  }',
        '}',
        '```',
        '',
        '**Example Request - Newsletter with Attachments:**',
        '```json',
        '{',
        '  "recipients": [',
        '    { "id": "parent-uuid-1", "type": "parent" },',
        '    { "id": "parent-uuid-2", "type": "parent" }',
        '  ],',
        '  "message": {',
        '    "subject": "Monthly Health Newsletter - October 2025",',
        '    "body": "Please see attached newsletter for October health tips.",',
        '    "attachments": [',
        '      {',
        '        "filename": "october-newsletter.pdf",',
        '        "contentType": "application/pdf",',
        '        "size": 524288,',
        '        "data": "base64-encoded-file-content-here"',
        '      }',
        '    ]',
        '  },',
        '  "messageType": "newsletter",',
        '  "priority": "low",',
        '  "channels": ["email"],',
        '  "deliveryOptions": {',
        '    "sendImmediately": false,',
        '    "batchSize": 100,',
        '    "throttleDelay": 5',
        '  }',
        '}',
        '```'
      ].join('\n'),
      validate: {
        payload: bulkMessageSchema
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            200: {
              description: 'Bulk message sent successfully',
              schema: bulkMessageResponseSchema
            },
            400: {
              description: 'Invalid message data - Validation errors, recipient limit exceeded, or compliance violation',
              schema: errorResponseSchema.keys({
                error: Joi.object({
                  message: Joi.string().example('Recipients array exceeds maximum of 1000'),
                  code: Joi.string().example('RECIPIENT_LIMIT_EXCEEDED'),
                  details: Joi.array().items(
                    Joi.object({
                      field: Joi.string().example('recipients'),
                      message: Joi.string().example('Maximum 1000 recipients allowed per batch'),
                      value: Joi.number().example(1500)
                    })
                  ).optional()
                })
              })
            },
            401: {
              description: 'Authentication required - Invalid or missing JWT token',
              schema: errorResponseSchema
            },
            403: {
              description: 'Insufficient permissions - User lacks bulk messaging permissions',
              schema: errorResponseSchema.keys({
                error: Joi.object({
                  message: Joi.string().example('User does not have permission to send bulk messages'),
                  code: Joi.string().example('INSUFFICIENT_PERMISSIONS')
                })
              })
            },
            500: {
              description: 'Server error sending messages - Internal processing error or external service failure',
              schema: errorResponseSchema.keys({
                error: Joi.object({
                  message: Joi.string().example('Failed to queue bulk message for delivery'),
                  code: Joi.string().example('INTERNAL_SERVER_ERROR'),
                  details: Joi.object({
                    service: Joi.string().example('MessageQueue'),
                    error: Joi.string().example('Queue service temporarily unavailable')
                  }).optional()
                })
              })
            }
          },
          security: [{ jwt: [] }],
          order: 1,
          payloadType: 'json'
        }
      }
    },
    handler: sendBulkMessage
  }
];
