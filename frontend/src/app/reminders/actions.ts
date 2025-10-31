/**
 * @fileoverview Reminder Management Server Actions - Next.js v14+ Compatible
 * @module app/reminders/actions
 *
 * HIPAA-compliant server actions for reminder management with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all reminder operations
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

// Custom cache tags for reminders
export const REMINDER_CACHE_TAGS = {
  REMINDERS: 'reminders',
  TEMPLATES: 'reminder-templates',
  SCHEDULES: 'reminder-schedules',
  RECIPIENTS: 'reminder-recipients',
  LOGS: 'reminder-logs',
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

export interface Reminder {
  id: string;
  title: string;
  description: string;
  type: 'medication' | 'appointment' | 'immunization' | 'follow-up' | 'assessment' | 'compliance' | 'general';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'active' | 'inactive' | 'completed' | 'cancelled' | 'overdue';
  studentId?: string;
  studentName?: string;
  userId: string;
  userName: string;
  assignedTo?: string;
  assignedToName?: string;
  dueDate: string;
  completedAt?: string;
  completedBy?: string;
  completedByName?: string;
  snoozeUntil?: string;
  reminderTimes: string[];
  channels: ('email' | 'sms' | 'push' | 'in-app')[];
  recurrence?: {
    type: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: string;
    maxOccurrences?: number;
  };
  tags: string[];
  metadata: Record<string, unknown>;
  attachments: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderData {
  title: string;
  description: string;
  type: Reminder['type'];
  priority?: Reminder['priority'];
  studentId?: string;
  assignedTo?: string;
  dueDate: string;
  reminderTimes?: string[];
  channels?: Reminder['channels'];
  recurrence?: Reminder['recurrence'];
  tags?: string[];
  metadata?: Record<string, unknown>;
  attachments?: string[];
  notes?: string;
}

export interface UpdateReminderData {
  title?: string;
  description?: string;
  type?: Reminder['type'];
  priority?: Reminder['priority'];
  studentId?: string;
  assignedTo?: string;
  dueDate?: string;
  reminderTimes?: string[];
  channels?: Reminder['channels'];
  recurrence?: Reminder['recurrence'];
  tags?: string[];
  metadata?: Record<string, unknown>;
  notes?: string;
}

export interface ReminderTemplate {
  id: string;
  name: string;
  description: string;
  type: Reminder['type'];
  priority: Reminder['priority'];
  title: string;
  content: string;
  reminderTimes: string[];
  channels: Reminder['channels'];
  tags: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderTemplateData {
  name: string;
  description: string;
  type: Reminder['type'];
  priority: Reminder['priority'];
  title: string;
  content: string;
  reminderTimes?: string[];
  channels?: Reminder['channels'];
  tags?: string[];
  isActive?: boolean;
}

export interface ReminderFilters {
  type?: Reminder['type'];
  priority?: Reminder['priority'];
  status?: Reminder['status'];
  studentId?: string;
  userId?: string;
  assignedTo?: string;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  overdue?: boolean;
  completed?: boolean;
}

export interface ReminderAnalytics {
  totalReminders: number;
  activeReminders: number;
  completedReminders: number;
  overdueReminders: number;
  completionRate: number;
  averageCompletionTime: number;
  typeBreakdown: {
    type: Reminder['type'];
    count: number;
    percentage: number;
  }[];
  priorityBreakdown: {
    priority: Reminder['priority'];
    count: number;
    percentage: number;
  }[];
  statusBreakdown: {
    status: Reminder['status'];
    count: number;
    percentage: number;
  }[];
  userPerformance: {
    userId: string;
    userName: string;
    assigned: number;
    completed: number;
    completionRate: number;
  }[];
}

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get reminder by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getReminder = cache(async (id: string): Promise<Reminder | null> => {
  try {
    const response = await serverGet<ApiResponse<Reminder>>(
      `/api/reminders/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [`reminder-${id}`, REMINDER_CACHE_TAGS.REMINDERS] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get reminder:', error);
    return null;
  }
});

/**
 * Get all reminders with caching
 */
export const getReminders = cache(async (filters?: ReminderFilters): Promise<Reminder[]> => {
  try {
    const response = await serverGet<ApiResponse<Reminder[]>>(
      `/api/reminders`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [REMINDER_CACHE_TAGS.REMINDERS, 'reminder-list'] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get reminders:', error);
    return [];
  }
});

/**
 * Get reminder templates with caching
 */
export const getReminderTemplates = cache(async (): Promise<ReminderTemplate[]> => {
  try {
    const response = await serverGet<ApiResponse<ReminderTemplate[]>>(
      `/api/reminders/templates`,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATIC,
          tags: [REMINDER_CACHE_TAGS.TEMPLATES, 'reminder-template-list'] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get reminder templates:', error);
    return [];
  }
});

/**
 * Get reminder analytics with caching
 */
export const getReminderAnalytics = cache(async (filters?: Record<string, unknown>): Promise<ReminderAnalytics | null> => {
  try {
    const response = await serverGet<ApiResponse<ReminderAnalytics>>(
      `/api/reminders/analytics`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATS,
          tags: ['reminder-analytics', 'reminder-stats'] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get reminder analytics:', error);
    return null;
  }
});

/**
 * Get overdue reminders with caching
 */
export const getOverdueReminders = cache(async (userId?: string): Promise<Reminder[]> => {
  try {
    const filters: ReminderFilters = { overdue: true };
    if (userId) filters.assignedTo = userId;
    
    const response = await serverGet<ApiResponse<Reminder[]>>(
      `/api/reminders/overdue`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.REALTIME,
          tags: ['overdue-reminders', REMINDER_CACHE_TAGS.REMINDERS] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get overdue reminders:', error);
    return [];
  }
});

// ==========================================
// REMINDER OPERATIONS
// ==========================================

/**
 * Create a new reminder
 * Includes audit logging and cache invalidation
 */
export async function createReminderAction(data: CreateReminderData): Promise<ActionResult<Reminder>> {
  try {
    // Validate required fields
    if (!data.title || !data.description || !data.dueDate) {
      return {
        success: false,
        error: 'Missing required fields: title, description, dueDate'
      };
    }

    // Validate due date
    const dueDate = new Date(data.dueDate);
    if (isNaN(dueDate.getTime())) {
      return {
        success: false,
        error: 'Invalid due date format'
      };
    }

    const response = await serverPost<ApiResponse<Reminder>>(
      `/api/reminders`,
      data,
      {
        cache: 'no-store',
        next: { tags: [REMINDER_CACHE_TAGS.REMINDERS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create reminder');
    }

    // AUDIT LOG - Reminder creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Reminder',
      resourceId: response.data.id,
      details: `Created reminder: ${data.title}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(REMINDER_CACHE_TAGS.REMINDERS);
    revalidateTag('reminder-list');
    revalidateTag('overdue-reminders');
    revalidatePath('/reminders', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Reminder created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create reminder';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Reminder',
      details: `Failed to create reminder: ${errorMessage}`,
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
 * Update reminder
 * Includes audit logging and cache invalidation
 */
export async function updateReminderAction(
  reminderId: string,
  data: UpdateReminderData
): Promise<ActionResult<Reminder>> {
  try {
    if (!reminderId) {
      return {
        success: false,
        error: 'Reminder ID is required'
      };
    }

    // Validate due date if provided
    if (data.dueDate) {
      const dueDate = new Date(data.dueDate);
      if (isNaN(dueDate.getTime())) {
        return {
          success: false,
          error: 'Invalid due date format'
        };
      }
    }

    const response = await serverPut<ApiResponse<Reminder>>(
      `/api/reminders/${reminderId}`,
      data,
      {
        cache: 'no-store',
        next: { tags: [REMINDER_CACHE_TAGS.REMINDERS, `reminder-${reminderId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update reminder');
    }

    // AUDIT LOG - Reminder update
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Reminder',
      resourceId: reminderId,
      details: `Updated reminder: ${response.data.title}`,
      changes: data as Record<string, unknown>,
      success: true
    });

    // Cache invalidation
    revalidateTag(REMINDER_CACHE_TAGS.REMINDERS);
    revalidateTag(`reminder-${reminderId}`);
    revalidateTag('reminder-list');
    revalidateTag('overdue-reminders');
    revalidatePath('/reminders', 'page');
    revalidatePath(`/reminders/${reminderId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Reminder updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update reminder';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Reminder',
      resourceId: reminderId,
      details: `Failed to update reminder: ${errorMessage}`,
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
 * Complete reminder
 * Includes audit logging and cache invalidation
 */
export async function completeReminderAction(
  reminderId: string,
  notes?: string
): Promise<ActionResult<Reminder>> {
  try {
    if (!reminderId) {
      return {
        success: false,
        error: 'Reminder ID is required'
      };
    }

    const response = await serverPost<ApiResponse<Reminder>>(
      `/api/reminders/${reminderId}/complete`,
      { notes },
      {
        cache: 'no-store',
        next: { tags: [REMINDER_CACHE_TAGS.REMINDERS, `reminder-${reminderId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to complete reminder');
    }

    // AUDIT LOG - Reminder completion
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Reminder',
      resourceId: reminderId,
      details: `Completed reminder: ${response.data.title}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(REMINDER_CACHE_TAGS.REMINDERS);
    revalidateTag(`reminder-${reminderId}`);
    revalidateTag('reminder-list');
    revalidateTag('overdue-reminders');
    revalidatePath('/reminders', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Reminder completed successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to complete reminder';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Reminder',
      resourceId: reminderId,
      details: `Failed to complete reminder: ${errorMessage}`,
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
 * Snooze reminder
 * Includes audit logging and cache invalidation
 */
export async function snoozeReminderAction(
  reminderId: string,
  snoozeUntil: string
): Promise<ActionResult<Reminder>> {
  try {
    if (!reminderId) {
      return {
        success: false,
        error: 'Reminder ID is required'
      };
    }

    if (!snoozeUntil) {
      return {
        success: false,
        error: 'Snooze until date is required'
      };
    }

    // Validate snooze date
    const snoozeDate = new Date(snoozeUntil);
    if (isNaN(snoozeDate.getTime())) {
      return {
        success: false,
        error: 'Invalid snooze date format'
      };
    }

    const response = await serverPost<ApiResponse<Reminder>>(
      `/api/reminders/${reminderId}/snooze`,
      { snoozeUntil },
      {
        cache: 'no-store',
        next: { tags: [REMINDER_CACHE_TAGS.REMINDERS, `reminder-${reminderId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to snooze reminder');
    }

    // AUDIT LOG - Reminder snooze
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Reminder',
      resourceId: reminderId,
      details: `Snoozed reminder: ${response.data.title} until ${formatDate(snoozeUntil)}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(REMINDER_CACHE_TAGS.REMINDERS);
    revalidateTag(`reminder-${reminderId}`);
    revalidateTag('reminder-list');
    revalidateTag('overdue-reminders');
    revalidatePath('/reminders', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Reminder snoozed successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to snooze reminder';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Reminder',
      resourceId: reminderId,
      details: `Failed to snooze reminder: ${errorMessage}`,
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
 * Delete reminder
 * Includes audit logging and cache invalidation
 */
export async function deleteReminderAction(reminderId: string): Promise<ActionResult<void>> {
  try {
    if (!reminderId) {
      return {
        success: false,
        error: 'Reminder ID is required'
      };
    }

    const response = await serverDelete<ApiResponse<void>>(
      `/api/reminders/${reminderId}`,
      {
        cache: 'no-store',
        next: { tags: [REMINDER_CACHE_TAGS.REMINDERS, `reminder-${reminderId}`] }
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete reminder');
    }

    // AUDIT LOG - Reminder deletion
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_DOCUMENT,
      resource: 'Reminder',
      resourceId: reminderId,
      details: 'Deleted reminder',
      success: true
    });

    // Cache invalidation
    revalidateTag(REMINDER_CACHE_TAGS.REMINDERS);
    revalidateTag(`reminder-${reminderId}`);
    revalidateTag('reminder-list');
    revalidateTag('overdue-reminders');
    revalidatePath('/reminders', 'page');

    return {
      success: true,
      message: 'Reminder deleted successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to delete reminder';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_DOCUMENT,
      resource: 'Reminder',
      resourceId: reminderId,
      details: `Failed to delete reminder: ${errorMessage}`,
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
// REMINDER TEMPLATE OPERATIONS
// ==========================================

/**
 * Create reminder template
 * Includes audit logging and cache invalidation
 */
export async function createReminderTemplateAction(data: CreateReminderTemplateData): Promise<ActionResult<ReminderTemplate>> {
  try {
    // Validate required fields
    if (!data.name || !data.title || !data.content) {
      return {
        success: false,
        error: 'Missing required fields: name, title, content'
      };
    }

    const response = await serverPost<ApiResponse<ReminderTemplate>>(
      `/api/reminders/templates`,
      data,
      {
        cache: 'no-store',
        next: { tags: [REMINDER_CACHE_TAGS.TEMPLATES] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create reminder template');
    }

    // AUDIT LOG - Template creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'ReminderTemplate',
      resourceId: response.data.id,
      details: `Created reminder template: ${data.name}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(REMINDER_CACHE_TAGS.TEMPLATES);
    revalidateTag('reminder-template-list');
    revalidatePath('/reminders/templates', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Reminder template created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create reminder template';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'ReminderTemplate',
      details: `Failed to create reminder template: ${errorMessage}`,
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
 * Create reminder from form data
 * Form-friendly wrapper for createReminderAction
 */
export async function createReminderFromForm(formData: FormData): Promise<ActionResult<Reminder>> {
  // Parse reminder times from form data
  const reminderTimesJson = formData.get('reminderTimes') as string;
  let reminderTimes: string[] = [];
  
  try {
    reminderTimes = JSON.parse(reminderTimesJson || '[]');
  } catch {
    // Use default reminder times if parsing fails
    reminderTimes = ['30m', '1d'];
  }

  // Parse channels from form data
  const channelsJson = formData.get('channels') as string;
  let channels: Reminder['channels'] = [];
  
  try {
    channels = JSON.parse(channelsJson || '[]');
  } catch {
    // Use default channels if parsing fails
    channels = ['in-app', 'email'];
  }

  // Parse tags from form data
  const tagsJson = formData.get('tags') as string;
  let tags: string[] = [];
  
  try {
    tags = JSON.parse(tagsJson || '[]');
  } catch {
    // Ignore tag parsing errors
  }

  const reminderData: CreateReminderData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    type: formData.get('type') as Reminder['type'],
    priority: (formData.get('priority') as Reminder['priority']) || 'normal',
    studentId: formData.get('studentId') as string || undefined,
    assignedTo: formData.get('assignedTo') as string || undefined,
    dueDate: formData.get('dueDate') as string,
    reminderTimes,
    channels,
    tags: tags.length > 0 ? tags : undefined,
    notes: formData.get('notes') as string || undefined,
  };

  const result = await createReminderAction(reminderData);
  
  if (result.success && result.data) {
    revalidatePath('/reminders', 'page');
  }
  
  return result;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if reminder exists
 */
export async function reminderExists(reminderId: string): Promise<boolean> {
  const reminder = await getReminder(reminderId);
  return reminder !== null;
}

/**
 * Get reminder count
 */
export const getReminderCount = cache(async (filters?: ReminderFilters): Promise<number> => {
  try {
    const reminders = await getReminders(filters);
    return reminders.length;
  } catch {
    return 0;
  }
});

/**
 * Get reminder overview
 */
export async function getReminderOverview(userId?: string): Promise<{
  totalReminders: number;
  activeReminders: number;
  overdueReminders: number;
  completedToday: number;
  upcomingReminders: number;
}> {
  try {
    const filters: ReminderFilters = {};
    if (userId) filters.assignedTo = userId;
    
    const reminders = await getReminders(filters);
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    return {
      totalReminders: reminders.length,
      activeReminders: reminders.filter(r => r.status === 'active').length,
      overdueReminders: reminders.filter(r => r.status === 'overdue').length,
      completedToday: reminders.filter(r => 
        r.status === 'completed' && 
        r.completedAt?.startsWith(today)
      ).length,
      upcomingReminders: reminders.filter(r => {
        const dueDate = new Date(r.dueDate);
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return r.status === 'active' && dueDate <= tomorrow;
      }).length,
    };
  } catch {
    return {
      totalReminders: 0,
      activeReminders: 0,
      overdueReminders: 0,
      completedToday: 0,
      upcomingReminders: 0,
    };
  }
}

/**
 * Clear reminder cache
 */
export async function clearReminderCache(reminderId?: string): Promise<void> {
  if (reminderId) {
    revalidateTag(`reminder-${reminderId}`);
  }
  
  // Clear all reminder caches
  Object.values(REMINDER_CACHE_TAGS).forEach(tag => {
    revalidateTag(tag);
  });

  // Clear list caches
  revalidateTag('reminder-list');
  revalidateTag('reminder-template-list');
  revalidateTag('overdue-reminders');
  revalidateTag('reminder-stats');

  // Clear paths
  revalidatePath('/reminders', 'page');
  revalidatePath('/reminders/templates', 'page');
  revalidatePath('/reminders/analytics', 'page');
}
