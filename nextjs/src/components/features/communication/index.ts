/**
 * Communication Feature Components
 *
 * Comprehensive suite of components for healthcare communication management including
 * individual messaging, broadcast communications, emergency alerts, message templates,
 * and communication history tracking. All components support HIPAA-compliant messaging
 * with audit logging and multi-channel delivery.
 *
 * @module features/communication
 */

/**
 * Communication statistics dashboard component
 * Displays aggregated message delivery metrics and performance indicators
 */
export { default as CommunicationStats } from './components/CommunicationStats'

/**
 * Message composition interface for sending messages to specific recipients
 * Supports multiple channels, priority levels, and scheduled delivery
 */
export { default as CommunicationComposeTab } from './tabs/CommunicationComposeTab'

/**
 * Message history and audit trail viewer
 * Displays chronological list of sent messages with delivery details
 */
export { default as CommunicationHistoryTab } from './tabs/CommunicationHistoryTab'

/**
 * Reusable message template management interface
 * Create and manage templates with variable substitution for personalized communications
 */
export { default as CommunicationTemplatesTab } from './tabs/CommunicationTemplatesTab'

/**
 * Broadcast messaging interface for mass communications
 * Send messages to multiple recipients with grade-level and role-based filtering
 */
export { default as CommunicationBroadcastTab } from './tabs/CommunicationBroadcastTab'

/**
 * Emergency alert system interface
 * High-priority alert composition and delivery for critical healthcare situations
 */
export { default as CommunicationEmergencyTab } from './tabs/CommunicationEmergencyTab'