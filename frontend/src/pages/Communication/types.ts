/**
 * Communication Page Types
 *
 * Type definitions for the Communication Center module
 * @module pages/Communication/types
 */

export type Tab = 'compose' | 'templates' | 'broadcast' | 'history' | 'emergency'

export interface ComposeFormState {
  recipients: string
  channels: string[]
  subject: string
  content: string
  priority: string
  category: string
  scheduledAt: string
}

export interface TemplateFormState {
  name: string
  subject: string
  content: string
  type: string
  category: string
  variables: string
}

export interface BroadcastFormState {
  grades: string
  channels: string[]
  subject: string
  content: string
  priority: string
  category: string
  includeParents: boolean
  includeEmergencyContacts: boolean
}

export interface EmergencyFormState {
  title: string
  message: string
  severity: string
  audience: string
  channels: string[]
}

export interface CommunicationTemplate {
  id: string
  name: string
  subject: string
  content: string
  type: string
  category: string
  variables: string[]
}

export interface CommunicationMessage {
  id: string
  subject: string
  content: string
  channels: string[]
  priority: string
  category: string
  status: string
  createdAt: string
  sentAt?: string
}

export interface CommunicationStatistics {
  totalMessages: number
  deliveryStatus: {
    DELIVERED: number
    PENDING: number
    FAILED: number
  }
}
