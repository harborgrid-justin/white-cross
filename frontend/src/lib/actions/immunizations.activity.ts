/**
 * @fileoverview Immunization Activity API Functions
 * @module lib/actions/immunizations/activity
 *
 * Real-time activity tracking and recent immunization events.
 * Provides activity feed data for dashboard widgets.
 */

'use server';

import { cache } from 'react';
import type { ImmunizationRecord } from './immunizations.types';
import { getImmunizationRecords } from './immunizations.cache';

// ==========================================
// ACTIVITY TYPES
// ==========================================

export interface ImmunizationActivity {
  id: string;
  type: 'administered' | 'scheduled' | 'overdue' | 'declined' | 'exemption_requested';
  studentName: string;
  vaccineName: string;
  date: string;
  timestamp: string;
  priority?: 'urgent' | 'high' | 'medium' | 'low';
  administeredBy?: string;
  notes?: string;
  studentId: string;
}

// ==========================================
// ACTIVITY FUNCTIONS
// ==========================================

/**
 * Get recent immunization activity
 * Returns chronological list of recent immunization events
 */
export const getRecentImmunizationActivity = cache(async (limit: number = 6): Promise<ImmunizationActivity[]> => {
  try {
    console.log('[Immunizations] Loading recent activity');

    // Get all immunization records
    const records = await getImmunizationRecords();
    
    // Transform records to activity items
    const activities: ImmunizationActivity[] = records
      .map((record: ImmunizationRecord) => {
        const activity: ImmunizationActivity = {
          id: record.id,
          studentName: record.studentName,
          vaccineName: record.vaccineName,
          studentId: record.studentId,
          date: record.administeredDate || record.nextDueDate || record.createdAt,
          timestamp: getRelativeTime(record.administeredDate || record.nextDueDate || record.createdAt),
          type: determineActivityType(record),
          administeredBy: record.administeredByName || record.administeredBy,
          notes: record.notes,
          priority: determinePriority(record)
        };
        return activity;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);

    console.log(`[Immunizations] Loaded ${activities.length} recent activities`);
    return activities;

  } catch (error) {
    console.error('[Immunizations] Failed to load recent activity:', error);
    return [];
  }
});

/**
 * Get immunization activity by student
 */
export const getStudentImmunizationActivity = cache(async (studentId: string): Promise<ImmunizationActivity[]> => {
  try {
    const records = await getImmunizationRecords({ studentId });
    
    return records.map((record: ImmunizationRecord) => ({
      id: record.id,
      studentName: record.studentName,
      vaccineName: record.vaccineName,
      studentId: record.studentId,
      date: record.administeredDate || record.nextDueDate || record.createdAt,
      timestamp: getRelativeTime(record.administeredDate || record.nextDueDate || record.createdAt),
      type: determineActivityType(record),
      administeredBy: record.administeredByName || record.administeredBy,
      notes: record.notes,
      priority: determinePriority(record)
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  } catch (error) {
    console.error(`[Immunizations] Failed to load activity for student ${studentId}:`, error);
    return [];
  }
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Determine activity type from immunization record
 */
function determineActivityType(record: ImmunizationRecord): ImmunizationActivity['type'] {
  if (record.administeredDate) {
    return 'administered';
  }
  
  if (record.nextDueDate) {
    const dueDate = new Date(record.nextDueDate);
    const now = new Date();
    
    if (dueDate < now) {
      return 'overdue';
    } else {
      return 'scheduled';
    }
  }
  
  return 'scheduled';
}

/**
 * Determine priority from immunization record
 */
function determinePriority(record: ImmunizationRecord): ImmunizationActivity['priority'] {
  if (record.nextDueDate) {
    const dueDate = new Date(record.nextDueDate);
    const now = new Date();
    const daysDiff = Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return 'urgent'; // Overdue
    if (daysDiff <= 7) return 'high';  // Due within a week
    if (daysDiff <= 30) return 'medium'; // Due within a month
  }
  
  return 'low';
}

/**
 * Get relative time string
 */
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
}