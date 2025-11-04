/**
 * WF-COMP-128 | useCommunicationOptions.types.ts - Type definitions
 * Purpose: Type definitions for communication options
 * Upstream: None | Dependencies: None
 * Downstream: useCommunicationOptions hooks | Called by: Communication hooks
 * Related: useCommunicationOptions.ts, useCommunicationOptions.constants.ts
 * Exports: interfaces | Key Features: type definitions
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Type definitions for communication channel configurations
 * LLM Context: Type definitions for communication options hook
 */

// ============================================================================
// Type Definitions
// ============================================================================

export interface CommunicationChannel {
  id: string;
  label: string;
  value: string;
  description?: string;
  enabled: boolean;
  icon?: string;
}

export interface NotificationType {
  id: string;
  label: string;
  value: string;
  description?: string;
  defaultPriority?: string;
  requiresApproval?: boolean;
}

export interface PriorityLevel {
  id: string;
  label: string;
  value: string;
  description?: string;
  color?: string;
}

export interface CommunicationOptions {
  channels: CommunicationChannel[];
  notificationTypes: NotificationType[];
  priorityLevels: PriorityLevel[];
  verificationMethods: {
    id: string;
    label: string;
    value: string;
  }[];
}
