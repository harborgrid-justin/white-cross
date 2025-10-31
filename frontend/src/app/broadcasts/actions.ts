/**
 * @fileoverview Broadcast Management Server Actions - Next.js v14+ Compatible
 * @module app/broadcasts/actions
 *
 * HIPAA-compliant server actions for broadcast communication management with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all broadcast operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Core API integrations
import { serverGet, serverPost, serverPut, serverDelete, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';

// Types
import type { ApiResponse } from '@/types/api';

// Utils
import { formatDate } from '@/utils/dateUtils';
import { validateEmail, validatePhone } from '@/utils/validation/userValidation';
import { generateId } from '@/utils/generators';
import { formatName, formatPhone } from '@/utils/formatters';

// ==========================================
// CONFIGURATION
// ==========================================

// Custom cache tags for broadcasts
export const BROADCAST_CACHE_TAGS = {
  BROADCASTS: 'broadcasts',
  TEMPLATES: 'broadcast-templates',
  RECIPIENTS: 'broadcast-recipients',
  ANALYTICS: 'broadcast-analytics',
  SCHEDULES: 'broadcast-schedules',
} as const;

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

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

export interface BroadcastFilters {
  type?: Broadcast['type'];
  status?: Broadcast['status'];
  priority?: Broadcast['priority'];
  targetAudience?: Broadcast['targetAudience'];
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
}

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

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get broadcast by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getBroadcast = cache(async (id: string): Promise<Broadcast | null> => {
  try {
    const response = await serverGet<ApiResponse<Broadcast>>(
      API_ENDPOINTS.BROADCASTS.BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [`broadcast-${id}`, BROADCAST_CACHE_TAGS.BROADCASTS] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get broadcast:', error);
    return null;
  }
});

/**
 * Get all broadcasts with caching
 */
export const getBroadcasts = cache(async (filters?: BroadcastFilters): Promise<Broadcast[]> => {
  try {
    const response = await serverGet<ApiResponse<Broadcast[]>>(
      API_ENDPOINTS.BROADCASTS.BASE,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [BROADCAST_CACHE_TAGS.BROADCASTS, 'broadcast-list'] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get broadcasts:', error);
    return [];
  }
});

/**
 * Get broadcast template by ID with caching
 */
export const getBroadcastTemplate = cache(async (id: string): Promise<BroadcastTemplate | null> => {
  try {
    const response = await serverGet<ApiResponse<BroadcastTemplate>>(
      `${API_ENDPOINTS.BROADCASTS.BASE}/templates/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATIC,
          tags: [`broadcast-template-${id}`, BROADCAST_CACHE_TAGS.TEMPLATES] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get broadcast template:', error);
    return null;
  }
});

/**
 * Get all broadcast templates with caching
 */
export const getBroadcastTemplates = cache(async (category?: string): Promise<BroadcastTemplate[]> => {
  try {
    const params = category ? { category } : undefined;
    const response = await serverGet<ApiResponse<BroadcastTemplate[]>>(
      `${API_ENDPOINTS.BROADCASTS.BASE}/templates`,
      params as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATIC,
          tags: [BROADCAST_CACHE_TAGS.TEMPLATES, 'broadcast-template-list'] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get broadcast templates:', error);
    return [];
  }
});

/**
 * Get broadcast analytics with caching
 */
export const getBroadcastAnalytics = cache(async (filters?: Record<string, unknown>): Promise<BroadcastAnalytics | null> => {
  try {
    const response = await serverGet<ApiResponse<BroadcastAnalytics>>(
      `${API_ENDPOINTS.BROADCASTS.BASE}/analytics`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATS,
          tags: [BROADCAST_CACHE_TAGS.ANALYTICS, 'broadcast-stats'] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get broadcast analytics:', error);
    return null;
  }
});

// ==========================================
// BROADCAST OPERATIONS
// ==========================================

/**
 * Create a new broadcast
 * Includes audit logging and cache invalidation
 */
export async function createBroadcastAction(data: CreateBroadcastData): Promise<ActionResult<Broadcast>> {
  try {
    // Validate required fields
    if (!data.title || !data.content || !data.type || !data.targetAudience) {
      return {
        success: false,
        error: 'Missing required fields: title, content, type, targetAudience'
      };
    }

    // Validate email format if type is email
    if (data.type === 'email' && data.customRecipients) {
      const invalidEmails = data.customRecipients.filter(email => !validateEmail(email));
      if (invalidEmails.length > 0) {
        return {
          success: false,
          error: `Invalid email addresses: ${invalidEmails.join(', ')}`
        };
      }
    }

    const response = await serverPost<ApiResponse<Broadcast>>(
      API_ENDPOINTS.BROADCASTS.BASE,
      data,
      {
        cache: 'no-store',
        next: { tags: [BROADCAST_CACHE_TAGS.BROADCASTS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create broadcast');
    }

    // AUDIT LOG - Broadcast creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Broadcast',
      resourceId: response.data.id,
      details: `Created ${data.type} broadcast: ${data.title} for ${data.targetAudience}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(BROADCAST_CACHE_TAGS.BROADCASTS);
    revalidateTag('broadcast-list');
    revalidatePath('/broadcasts', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Broadcast created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create broadcast';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Broadcast',
      details: `Failed to create broadcast: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Update broadcast
 * Includes audit logging and cache invalidation
 */
export async function updateBroadcastAction(
  broadcastId: string,
  data: UpdateBroadcastData
): Promise<ActionResult<Broadcast>> {
  try {
    if (!broadcastId) {
      return {
        success: false,
        error: 'Broadcast ID is required'
      };
    }

    // Validate email format if type is email and custom recipients provided
    if (data.type === 'email' && data.customRecipients) {
      const invalidEmails = data.customRecipients.filter(email => !validateEmail(email));
      if (invalidEmails.length > 0) {
        return {
          success: false,
          error: `Invalid email addresses: ${invalidEmails.join(', ')}`
        };
      }
    }

    const response = await serverPut<ApiResponse<Broadcast>>(
      API_ENDPOINTS.BROADCASTS.BY_ID(broadcastId),
      data,
      {
        cache: 'no-store',
        next: { tags: [BROADCAST_CACHE_TAGS.BROADCASTS, `broadcast-${broadcastId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update broadcast');
    }

    // AUDIT LOG - Broadcast update
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Broadcast',
      resourceId: broadcastId,
      details: 'Updated broadcast information',
      changes: data as Record<string, unknown>,
      success: true
    });

    // Cache invalidation
    revalidateTag(BROADCAST_CACHE_TAGS.BROADCASTS);
    revalidateTag(`broadcast-${broadcastId}`);
    revalidateTag('broadcast-list');
    revalidatePath('/broadcasts', 'page');
    revalidatePath(`/broadcasts/${broadcastId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Broadcast updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update broadcast';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Broadcast',
      resourceId: broadcastId,
      details: `Failed to update broadcast: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Send broadcast immediately
 * Includes audit logging and cache invalidation
 */
export async function sendBroadcastAction(broadcastId: string): Promise<ActionResult<Broadcast>> {
  try {
    if (!broadcastId) {
      return {
        success: false,
        error: 'Broadcast ID is required'
      };
    }

    const response = await serverPost<ApiResponse<Broadcast>>(
      `${API_ENDPOINTS.BROADCASTS.BASE}/${broadcastId}/send`,
      {},
      {
        cache: 'no-store',
        next: { tags: [BROADCAST_CACHE_TAGS.BROADCASTS, `broadcast-${broadcastId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to send broadcast');
    }

    // AUDIT LOG - Broadcast send
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Broadcast',
      resourceId: broadcastId,
      details: `Sent broadcast to ${response.data.totalRecipients} recipients`,
      success: true
    });

    // Cache invalidation
    revalidateTag(BROADCAST_CACHE_TAGS.BROADCASTS);
    revalidateTag(BROADCAST_CACHE_TAGS.ANALYTICS);
    revalidateTag(`broadcast-${broadcastId}`);
    revalidateTag('broadcast-list');
    revalidateTag('broadcast-stats');
    revalidatePath('/broadcasts', 'page');
    revalidatePath(`/broadcasts/${broadcastId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Broadcast sent successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to send broadcast';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Broadcast',
      resourceId: broadcastId,
      details: `Failed to send broadcast: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// BROADCAST TEMPLATE OPERATIONS
// ==========================================

/**
 * Create broadcast template
 * Includes audit logging and cache invalidation
 */
export async function createBroadcastTemplateAction(data: CreateBroadcastTemplateData): Promise<ActionResult<BroadcastTemplate>> {
  try {
    // Validate required fields
    if (!data.name || !data.subject || !data.content || !data.type || !data.category) {
      return {
        success: false,
        error: 'Missing required fields: name, subject, content, type, category'
      };
    }

    const response = await serverPost<ApiResponse<BroadcastTemplate>>(
      `${API_ENDPOINTS.BROADCASTS.BASE}/templates`,
      data,
      {
        cache: 'no-store',
        next: { tags: [BROADCAST_CACHE_TAGS.TEMPLATES] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create broadcast template');
    }

    // AUDIT LOG - Template creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'BroadcastTemplate',
      resourceId: response.data.id,
      details: `Created ${data.type} broadcast template: ${data.name}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(BROADCAST_CACHE_TAGS.TEMPLATES);
    revalidateTag('broadcast-template-list');
    revalidatePath('/broadcasts/templates', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Broadcast template created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create broadcast template';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'BroadcastTemplate',
      details: `Failed to create broadcast template: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// FORM HANDLING OPERATIONS
// ==========================================

/**
 * Create broadcast from form data
 * Form-friendly wrapper for createBroadcastAction
 */
export async function createBroadcastFromForm(formData: FormData): Promise<ActionResult<Broadcast>> {
  const customRecipientsRaw = formData.get('customRecipients') as string;
  const customRecipients = customRecipientsRaw 
    ? customRecipientsRaw.split(',').map(email => email.trim()).filter(Boolean)
    : undefined;

  const broadcastData: CreateBroadcastData = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    type: formData.get('type') as Broadcast['type'],
    priority: (formData.get('priority') as Broadcast['priority']) || 'normal',
    targetAudience: formData.get('targetAudience') as Broadcast['targetAudience'],
    customRecipients,
    scheduledAt: formData.get('scheduledAt') as string || undefined,
    templateId: formData.get('templateId') as string || undefined,
  };

  const result = await createBroadcastAction(broadcastData);
  
  if (result.success && result.data) {
    revalidatePath('/broadcasts', 'page');
  }
  
  return result;
}

/**
 * Create broadcast template from form data
 * Form-friendly wrapper for createBroadcastTemplateAction
 */
export async function createBroadcastTemplateFromForm(formData: FormData): Promise<ActionResult<BroadcastTemplate>> {
  const variablesRaw = formData.get('variables') as string;
  const variables = variablesRaw 
    ? variablesRaw.split(',').map(v => v.trim()).filter(Boolean)
    : undefined;

  const templateData: CreateBroadcastTemplateData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    subject: formData.get('subject') as string,
    content: formData.get('content') as string,
    type: formData.get('type') as Broadcast['type'],
    category: formData.get('category') as BroadcastTemplate['category'],
    variables,
    isActive: formData.get('isActive') === 'true',
  };

  const result = await createBroadcastTemplateAction(templateData);
  
  if (result.success && result.data) {
    revalidatePath('/broadcasts/templates', 'page');
  }
  
  return result;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if broadcast exists
 */
export async function broadcastExists(broadcastId: string): Promise<boolean> {
  const broadcast = await getBroadcast(broadcastId);
  return broadcast !== null;
}

/**
 * Check if broadcast template exists
 */
export async function broadcastTemplateExists(templateId: string): Promise<boolean> {
  const template = await getBroadcastTemplate(templateId);
  return template !== null;
}

/**
 * Get broadcast count
 */
export const getBroadcastCount = cache(async (filters?: BroadcastFilters): Promise<number> => {
  try {
    const broadcasts = await getBroadcasts(filters);
    return broadcasts.length;
  } catch {
    return 0;
  }
});

/**
 * Get broadcast template count
 */
export const getBroadcastTemplateCount = cache(async (category?: string): Promise<number> => {
  try {
    const templates = await getBroadcastTemplates(category);
    return templates.length;
  } catch {
    return 0;
  }
});

/**
 * Get broadcast overview
 */
export async function getBroadcastOverview(): Promise<{
  totalBroadcasts: number;
  sentBroadcasts: number;
  scheduledBroadcasts: number;
  failedBroadcasts: number;
  averageOpenRate: number;
}> {
  try {
    const broadcasts = await getBroadcasts();
    const analytics = await getBroadcastAnalytics();
    
    return {
      totalBroadcasts: broadcasts.length,
      sentBroadcasts: broadcasts.filter(b => b.status === 'sent').length,
      scheduledBroadcasts: broadcasts.filter(b => b.status === 'scheduled').length,
      failedBroadcasts: broadcasts.filter(b => b.status === 'failed').length,
      averageOpenRate: analytics?.averageOpenRate || 0,
    };
  } catch {
    return {
      totalBroadcasts: 0,
      sentBroadcasts: 0,
      scheduledBroadcasts: 0,
      failedBroadcasts: 0,
      averageOpenRate: 0,
    };
  }
}

/**
 * Clear broadcast cache
 */
export async function clearBroadcastCache(resourceType?: string, resourceId?: string): Promise<void> {
  if (resourceType && resourceId) {
    revalidateTag(`${resourceType}-${resourceId}`);
  }
  
  // Clear all broadcast caches
  Object.values(BROADCAST_CACHE_TAGS).forEach(tag => {
    revalidateTag(tag);
  });

  // Clear list caches
  revalidateTag('broadcast-list');
  revalidateTag('broadcast-template-list');
  revalidateTag('broadcast-stats');

  // Clear paths
  revalidatePath('/broadcasts', 'page');
  revalidatePath('/broadcasts/templates', 'page');
  revalidatePath('/broadcasts/analytics', 'page');
}
