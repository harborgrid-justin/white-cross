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

// Main Hub
export { default as CommunicationHub } from './CommunicationHub'

// History and Templates
export { MessageHistory } from './MessageHistory'
export { MessageTemplates } from './MessageTemplates'

// Statistics
export { default as CommunicationStats } from './components/CommunicationStats'

// Individual Components
export { BroadcastForm } from './components/BroadcastForm'
export { BroadcastManager } from './components/BroadcastManager'
export { EmergencyAlert } from './components/EmergencyAlert'
export { MessageComposer } from './components/MessageComposer'
export { MessageInbox } from './components/MessageInbox'
export { MessageList } from './components/MessageList'
export { MessageThread } from './components/MessageThread'
export { NotificationBell } from './components/NotificationBell'

// Tab Components
export { default as CommunicationComposeTab } from './tabs/CommunicationComposeTab'
export { default as CommunicationHistoryTab } from './tabs/CommunicationHistoryTab'
export { default as CommunicationTemplatesTab } from './tabs/CommunicationTemplatesTab'
export { default as CommunicationBroadcastTab } from './tabs/CommunicationBroadcastTab'
export { default as CommunicationEmergencyTab } from './tabs/CommunicationEmergencyTab'
