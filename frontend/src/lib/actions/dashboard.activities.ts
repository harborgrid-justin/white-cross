/**
 * @fileoverview Dashboard Activities Module
 * @module app/dashboard/activities
 * @category Dashboard - Activities
 * @version 2.0.0
 *
 * Tracks and retrieves recent system activities for dashboard display.
 * Includes filtering by activity type and time-based limits.
 */

'use server';

import { headers } from 'next/headers';
import type { RecentActivity, DashboardFilters } from './dashboard.types';

/**
 * Get Recent Activities
 * Retrieves recent system activities for dashboard overview
 *
 * @param filters - Activity filtering options
 * @param limit - Maximum number of activities to return
 * @returns Promise<RecentActivity[]>
 */
export async function getRecentActivities(filters: DashboardFilters = {}, limit: number = 10): Promise<RecentActivity[]> {
  // Access headers to enable dynamic rendering (required before using Date)
  await headers();
  
  try {
    console.log('[Dashboard] Loading recent activities with filters:', filters);

    // In production, this would query activity logs
    const activities: RecentActivity[] = [
      {
        id: '1',
        type: 'medication_administered',
        description: 'Insulin administered to Student A',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        performedBy: 'Nurse Johnson',
        studentAffected: 'Student A',
        priority: 'high',
        status: 'completed'
      },
      {
        id: '2',
        type: 'appointment_scheduled',
        description: 'Vision screening scheduled',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        performedBy: 'Admin Smith',
        studentAffected: 'Student B',
        priority: 'normal',
        status: 'completed'
      },
      {
        id: '3',
        type: 'emergency_contact',
        description: 'Emergency contact updated',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        performedBy: 'Secretary Davis',
        studentAffected: 'Student C',
        priority: 'normal',
        status: 'completed'
      },
      {
        id: '4',
        type: 'health_record_update',
        description: 'Allergy information updated',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        performedBy: 'Nurse Wilson',
        studentAffected: 'Student D',
        priority: 'high',
        status: 'completed'
      }
    ];

    // Apply activity type filter
    if (filters.activityType && filters.activityType !== 'all') {
      const filteredActivities = activities.filter(activity => {
        switch (filters.activityType) {
          case 'health':
            return ['medication_administered', 'health_record_update'].includes(activity.type);
          case 'administrative':
            return ['student_enrollment', 'appointment_scheduled', 'document_upload'].includes(activity.type);
          case 'emergency':
            return ['emergency_contact', 'system_alert'].includes(activity.type);
          default:
            return true;
        }
      });
      return filteredActivities.slice(0, limit);
    }

    console.log('[Dashboard] Recent activities loaded successfully');
    return activities.slice(0, limit);

  } catch (error) {
    console.error('[Dashboard] Failed to load recent activities:', error);
    return [];
  }
}
