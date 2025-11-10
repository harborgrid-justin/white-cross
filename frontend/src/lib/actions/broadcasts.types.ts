/**
 * @fileoverview Broadcast Type Definitions
 * @module lib/actions/broadcasts/types
 *
 * TypeScript interfaces and types for broadcast communication management.
 * These types are shared across all broadcast modules.
 *
 * Note: Runtime values (constants, functions, schemas) are in separate files:
 * - broadcasts.constants.ts - Const values like cache tags
 * - broadcasts.utils.ts - Utility functions
 */

// ==========================================
// CORE TYPE DEFINITIONS
// ==========================================

/**
 * Standard action result type for server actions
 */
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

/**
 * Broadcast entity
 */
export interface Broadcast {
  id: string;
  title: string;
  content: string;
  type: 'email' | 'sms' | 'push' | 'in_app';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed' | 'cancelled';
  targetAudience: 'all' | 'students' | 'parents' | 'staff' | 'nurses' | 'custom';
  customRecipients?: string[];
  scheduledAt?: string;
  sentAt?: string;
  createdBy: string;
  createdByName: string;
  totalRecipients: number;
  successCount: number;
  failureCount: number;
  openRate?: number;
  clickRate?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Data required to create a new broadcast
 */
export interface CreateBroadcastData {
  title: string;
  content: string;
  type: Broadcast['type'];
  priority?: Broadcast['priority'];
  targetAudience: Broadcast['targetAudience'];
  customRecipients?: string[];
  scheduledAt?: string;
  templateId?: string;
}

/**
 * Data for updating an existing broadcast
 */
export interface UpdateBroadcastData {
  title?: string;
  content?: string;
  type?: Broadcast['type'];
  priority?: Broadcast['priority'];
  targetAudience?: Broadcast['targetAudience'];
  customRecipients?: string[];
  scheduledAt?: string;
  status?: Broadcast['status'];
}

// ==========================================
// TEMPLATE TYPE DEFINITIONS
// ==========================================

/**
 * Broadcast template entity
 */
export interface BroadcastTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  content: string;
  type: Broadcast['type'];
  category: 'emergency' | 'announcement' | 'reminder' | 'health' | 'academic' | 'general';
  variables: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Data required to create a broadcast template
 */
export interface CreateBroadcastTemplateData {
  name: string;
  description: string;
  subject: string;
  content: string;
  type: Broadcast['type'];
  category: BroadcastTemplate['category'];
  variables?: string[];
  isActive?: boolean;
}

/**
 * Data for updating a broadcast template
 */
export interface UpdateBroadcastTemplateData {
  name?: string;
  description?: string;
  subject?: string;
  content?: string;
  type?: Broadcast['type'];
  category?: BroadcastTemplate['category'];
  variables?: string[];
  isActive?: boolean;
}

// ==========================================
// FILTER AND ANALYTICS TYPES
// ==========================================

/**
 * Filters for querying broadcasts
 */
export interface BroadcastFilters {
  type?: Broadcast['type'];
  status?: Broadcast['status'];
  priority?: Broadcast['priority'];
  targetAudience?: Broadcast['targetAudience'];
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Analytics data for broadcast performance
 */
export interface BroadcastAnalytics {
  totalBroadcasts: number;
  sentBroadcasts: number;
  failedBroadcasts: number;
  averageOpenRate: number;
  averageClickRate: number;
  typeBreakdown: {
    type: Broadcast['type'];
    count: number;
    percentage: number;
  }[];
  statusBreakdown: {
    status: Broadcast['status'];
    count: number;
    percentage: number;
  }[];
  recentActivity: {
    date: string;
    sent: number;
    failed: number;
  }[];
}

/**
 * Statistics for broadcast dashboard
 */
export interface BroadcastStats {
  totalBroadcasts: number;
  activeCampaigns: number;
  scheduledMessages: number;
  totalRecipients: number;
  emergencyAlerts: number;
  healthAlerts: number;
  deliveryRate: number;
  openRate: number;
}
