/**
 * WF-COMP-167 | types.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: interfaces, types | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

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
