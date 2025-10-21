/**
 * Communication Module Routes
 * Aggregates all communication module routes (messaging, notifications, etc.)
 */

import { ServerRoute } from '@hapi/hapi';
import { messagingRoutes } from './routes/messaging.routes';

/**
 * All communication module routes
 *
 * Currently includes:
 * - Messaging (1 endpoint) - Complete
 *   - Bulk Message Sending
 *
 * Total: 1 endpoint in Communication module
 *
 * Future additions:
 * - Individual messaging
 * - Message templates
 * - Delivery tracking
 * - Message history and analytics
 * - Parent notification preferences
 * - Multi-language support
 * - Emergency broadcast system
 */
export const communicationRoutes: ServerRoute[] = [
  ...messagingRoutes
];
