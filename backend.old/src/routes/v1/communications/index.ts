/**
 * Communications Module Index
 * Aggregates all communication routes for the v1 API
 *
 * This module provides comprehensive communication functionality including:
 * - Direct messaging between users
 * - Broadcast messaging to groups
 * - Emergency alerts
 * - Scheduled and recurring messages
 * - Message templates
 * - Delivery tracking and reporting
 * - Communication statistics
 *
 * All routes are HIPAA-compliant with comprehensive audit logging
 */

import { ServerRoute } from '@hapi/hapi';
import { messagesRoutes } from './routes/messages.routes';
import { broadcastsRoutes } from './routes/broadcasts.routes';

/**
 * All communication routes
 * Total: 20 routes
 *
 * Messages Routes (12):
 * - GET    /api/v1/communications/messages - List messages
 * - GET    /api/v1/communications/messages/{id} - Get message by ID
 * - POST   /api/v1/communications/messages - Send new message
 * - PUT    /api/v1/communications/messages/{id} - Update message
 * - DELETE /api/v1/communications/messages/{id} - Delete message
 * - POST   /api/v1/communications/messages/{id}/reply - Reply to message
 * - GET    /api/v1/communications/messages/inbox - Get inbox messages
 * - GET    /api/v1/communications/messages/sent - Get sent messages
 * - GET    /api/v1/communications/templates - List templates
 * - POST   /api/v1/communications/templates - Create template
 * - GET    /api/v1/communications/delivery-status/{messageId} - Get delivery status
 * - GET    /api/v1/communications/statistics - Get statistics
 *
 * Broadcasts Routes (8):
 * - POST   /api/v1/communications/broadcasts - Create broadcast
 * - GET    /api/v1/communications/broadcasts - List broadcasts
 * - GET    /api/v1/communications/broadcasts/{id} - Get broadcast by ID
 * - POST   /api/v1/communications/broadcasts/{id}/cancel - Cancel broadcast
 * - GET    /api/v1/communications/broadcasts/{id}/recipients - Get recipients
 * - GET    /api/v1/communications/broadcasts/{id}/delivery-report - Get delivery report
 * - POST   /api/v1/communications/scheduled - Schedule message
 * - GET    /api/v1/communications/scheduled - List scheduled messages
 */
export const communicationsRoutes: ServerRoute[] = [
  ...messagesRoutes,
  ...broadcastsRoutes
];

/**
 * Route count for tracking migration progress
 */
export const COMMUNICATIONS_ROUTE_COUNT = communicationsRoutes.length;

/**
 * Export individual route groups for selective imports
 */
export { messagesRoutes, broadcastsRoutes };

/**
 * Export controllers for testing
 */
export { MessagesController } from './controllers/messages.controller';
export { BroadcastsController } from './controllers/broadcasts.controller';

/**
 * Export validators for reuse
 */
export * from './validators/messages.validators';
export * from './validators/broadcasts.validators';
