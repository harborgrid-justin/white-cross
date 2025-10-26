/**
 * Communication Domain - Module Exports
 *
 * Centralized export module for the communication domain, providing comprehensive
 * messaging, notification, and emergency alert functionality for school-to-parent
 * and school-to-staff communication.
 *
 * @module pages/communication
 *
 * @remarks
 * Domain Architecture:
 * - **Pages**: Message center and communication dashboard
 * - **Components**: 55+ components for messaging workflows
 * - **Store**: Redux state with message templates and delivery tracking
 * - **Routes**: Communication routing with permission controls
 *
 * Communication Channels:
 * - EMAIL: Template-based email messaging
 * - SMS: Text message notifications
 * - PUSH: In-app push notifications
 * - VOICE: Automated voice call system (emergency use)
 * - BROADCAST: Multi-channel emergency broadcasts
 *
 * Feature Domains:
 * - Message composition with rich text editor
 * - Template management and reuse
 * - Recipient group management
 * - Emergency alert broadcasting
 * - Scheduled message delivery
 * - Delivery status tracking
 * - Engagement metrics and analytics
 * - Response collection and tracking
 *
 * Healthcare & Safety Context:
 * - HIPAA-compliant messaging for health information
 * - Emergency notification system for critical incidents
 * - Parent consent tracking for communication preferences
 * - Audit logging for all sent messages
 * - Secure message delivery with encryption
 * - PII protection in message content
 *
 * @example
 * ```typescript
 * // Import communication functionality
 * import {
 *   Communication,
 *   communicationRoutes,
 *   MessageComposer,
 *   EmergencyAlertList,
 *   communicationThunks,
 *   selectEmergencyMessages
 * } from '@/pages/communication';
 *
 * // Use in routing
 * <Route path="/communication/*" element={communicationRoutes} />
 *
 * // Send emergency alert
 * dispatch(communicationThunks.create({
 *   recipientType: 'PARENT',
 *   channels: ['EMAIL', 'SMS', 'PUSH'],
 *   category: 'EMERGENCY',
 *   priority: 'HIGH',
 *   subject: 'School Closure Alert',
 *   content: 'Due to weather conditions...'
 * }));
 * ```
 *
 * @see {@link module:pages/communication/store} for state management
 * @see {@link module:pages/communication/components} for UI components
 * @see {@link module:types/communication} for type definitions
 */

// Communication domain exports
export { default as Communication } from './Communication';

// Components
export * from './components';

// Store
export * from './store';

// Routes
export { communicationRoutes } from './routes';
