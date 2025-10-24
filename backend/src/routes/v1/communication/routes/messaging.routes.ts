/**
 * Communication Messaging Routes
 * Handles bulk messaging and notification features
 */

import { ServerRoute } from '@hapi/hapi';
import { sendBulkMessage } from '../controllers/messaging.controller';
import {
  validateBulkMessage
} from '../validators/messaging.validators';
import {
  BulkMessageResponseSchema,
  ErrorResponseSchema
} from '../../RESPONSE_SCHEMAS';

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
      tags: ['api', 'communication', 'messaging'],
      description: 'Send bulk message to multiple recipients',
      notes: 'Allows sending messages to groups of parents, students, or staff members',
      validate: {
        payload: validateBulkMessage
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            200: { description: 'Bulk message sent successfully', schema: BulkMessageResponseSchema },
            400: { description: 'Invalid message data', schema: ErrorResponseSchema },
            401: { description: 'Authentication required', schema: ErrorResponseSchema },
            403: { description: 'Insufficient permissions', schema: ErrorResponseSchema },
            500: { description: 'Server error sending messages', schema: ErrorResponseSchema }
          },
          security: [{ jwt: [] }]
        }
      }
    },
    handler: sendBulkMessage
  }
];
