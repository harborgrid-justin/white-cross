/**
 * @fileoverview Reminder Types - Next.js v14+ Compatible
 *
 * Type definitions for reminder management.
 *
 * Note: Runtime values (constants) are in reminders.constants.ts
 */

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