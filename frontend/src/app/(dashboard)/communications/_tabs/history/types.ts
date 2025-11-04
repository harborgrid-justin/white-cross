/**
 * WF-COMM-HISTORY-002 | types.ts - Communication History Type Definitions
 * Purpose: Shared TypeScript types for communication history components
 * Upstream: Communications system | Dependencies: None
 * Downstream: History components | Called by: All history sub-components
 * Related: CommunicationHistoryTab, message tracking, audit logging
 * Exports: CommunicationRecord, filter types, status types
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: Type definitions for communication history and audit system
 */

/**
 * Communication message type
 */
export type CommunicationType = 'individual' | 'broadcast' | 'emergency';

/**
 * Message delivery status
 */
export type CommunicationStatus = 'sent' | 'delivered' | 'read' | 'failed' | 'pending';

/**
 * Message priority level
 */
export type CommunicationPriority = 'normal' | 'high' | 'urgent';

/**
 * Delivery method types
 */
export type DeliveryMethod = 'email' | 'sms' | 'voice' | 'push';

/**
 * Communication history record
 */
export interface CommunicationRecord {
  id: string;
  type: CommunicationType;
  subject: string;
  message: string;
  sender: string;
  recipients: string[];
  deliveryMethod: DeliveryMethod[];
  status: CommunicationStatus;
  priority: CommunicationPriority;
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  readReceipts?: number;
  totalRecipients: number;
}

/**
 * Filter state for history search and filtering
 */
export interface HistoryFilters {
  searchTerm: string;
  filterType: string;
  filterStatus: string;
  filterPriority: string;
}

/**
 * Pagination state
 */
export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Audit trail entry
 */
export interface AuditTrailEntry {
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

/**
 * Delivery tracking information
 */
export interface DeliveryTracking {
  method: DeliveryMethod;
  status: 'sent' | 'delivered' | 'failed';
  timestamp: string;
  errorMessage?: string;
}

/**
 * Read receipt information
 */
export interface ReadReceipt {
  recipientId: string;
  recipientName: string;
  readAt: string;
  device?: string;
}

/**
 * Export options
 */
export interface ExportOptions {
  format: 'csv' | 'pdf' | 'json';
  dateRange?: {
    start: string;
    end: string;
  };
  includeAuditTrail: boolean;
}
