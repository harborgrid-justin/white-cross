/**
 * Communication Store - Export Module
 *
 * Centralized re-export point for all communication-related Redux state management.
 * Provides access to message state, actions, selectors, and async thunks for
 * multi-channel communication workflows.
 *
 * @module pages/communication/store
 *
 * @remarks
 * This module exports communication state management for:
 * - **Messages**: Email, SMS, push notifications, voice calls
 * - **Templates**: Reusable message templates
 * - **Recipients**: Parent groups, staff groups, individual recipients
 * - **Delivery**: Status tracking and engagement metrics
 * - **Emergency Alerts**: Broadcast messaging for critical situations
 * - **Scheduled Messages**: Future delivery scheduling
 *
 * State Features:
 * - Normalized message entities using EntityAdapter
 * - Real-time delivery status updates
 * - Template library with categorization
 * - Recipient group management
 * - Engagement analytics and metrics
 *
 * Communication Channels:
 * - EMAIL: Template-based email with attachments
 * - SMS: Text messaging with character limits
 * - PUSH: In-app notifications
 * - VOICE: Automated voice call system
 * - BROADCAST: Multi-channel emergency messaging
 *
 * HIPAA Compliance:
 * - PHI content encrypted in transit and at rest
 * - Audit logging for all message sends
 * - Consent verification before messaging
 * - Secure message delivery tracking
 * - Message content retention policies
 *
 * @example
 * ```typescript
 * // Import communication store
 * import {
 *   communicationSlice,
 *   communicationThunks,
 *   communicationSelectors,
 *   communicationActions
 * } from '@/pages/communication/store';
 *
 * // Send emergency alert
 * dispatch(communicationThunks.create({
 *   recipientType: 'PARENT',
 *   recipientIds: parentGroupIds,
 *   channels: ['EMAIL', 'SMS', 'PUSH'],
 *   category: 'EMERGENCY',
 *   priority: 'HIGH',
 *   subject: 'Weather Alert',
 *   content: 'School closing early due to severe weather...'
 * }));
 *
 * // Access sent messages
 * const messages = useSelector(communicationSelectors.selectAll);
 * const emergencyMessages = useSelector(selectEmergencyMessages);
 * ```
 *
 * @see {@link module:pages/communication/store/communicationSlice} for implementation
 * @see {@link module:services/modules/communicationApi} for API integration
 */

// Communication store exports
export * from './communicationSlice';
