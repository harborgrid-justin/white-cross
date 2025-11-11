/**
 * @fileoverview Navigation quick access items configuration
 * 
 * This module defines quick access items for frequently used actions:
 * - Add new student
 * - Schedule appointment
 * - Log medication administration
 * - Report incident
 * - Send message
 * - View today's appointments
 * 
 * @module config/navigation/quickAccess
 */

import type { QuickAccessItem } from '../../types/core/navigation';
import type { UserRole } from '../../types/core/common';

/**
 * Quick access items for common tasks
 *
 * Provides fast access to frequently used actions with role-based filtering,
 * keyboard shortcuts, and contextual descriptions.
 *
 * Features:
 * - Role-based access control
 * - Contextual descriptions for tooltips
 * - Icon integration with Lucide React
 * - Path routing for direct navigation
 */
export const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  {
    id: 'quick-add-student',
    name: 'Add Student',
    path: '/students/new',
    icon: 'UserPlus',
    description: 'Quickly add a new student to the system',
    roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'],
  },
  {
    id: 'quick-schedule-appointment',
    name: 'Schedule',
    path: '/appointments/new',
    icon: 'CalendarPlus',
    description: 'Schedule a new appointment',
    roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'],
  },
  {
    id: 'quick-log-medication',
    name: 'Log Med',
    path: '/medications/log',
    icon: 'Pill',
    description: 'Log medication administration',
    roles: ['ADMIN', 'NURSE'],
  },
  {
    id: 'quick-report-incident',
    name: 'Incident',
    path: '/incidents/new',
    icon: 'AlertCircle',
    description: 'Report a new incident',
    roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'],
  },
  {
    id: 'quick-send-message',
    name: 'Message',
    path: '/messages/new',
    icon: 'Send',
    description: 'Send a new message',
    roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'],
  },
  {
    id: 'quick-view-today',
    name: 'Today',
    path: '/appointments/today',
    icon: 'Clock',
    description: 'View today\'s appointments',
    roles: ['ADMIN', 'NURSE'],
  },
];

/**
 * Quick access items grouped by category for organized display
 */
export const QUICK_ACCESS_CATEGORIES = {
  clinical: {
    title: 'Clinical',
    items: [
      'quick-add-student',
      'quick-schedule-appointment', 
      'quick-log-medication',
      'quick-view-today',
    ],
  },
  safety: {
    title: 'Safety & Incidents',
    items: [
      'quick-report-incident',
    ],
  },
  communication: {
    title: 'Communication',
    items: [
      'quick-send-message',
    ],
  },
} as const;

/**
 * Get quick access items by category
 * 
 * @param category - Category name
 * @returns Array of QuickAccessItem objects for the category
 */
export function getQuickAccessItemsByCategory(category: keyof typeof QUICK_ACCESS_CATEGORIES): QuickAccessItem[] {
  const categoryConfig = QUICK_ACCESS_CATEGORIES[category];
  if (!categoryConfig) return [];
  
  return categoryConfig.items
    .map(itemId => QUICK_ACCESS_ITEMS.find(item => item.id === itemId))
    .filter((item): item is QuickAccessItem => item !== undefined);
}

/**
 * Get quick access item by ID
 * 
 * @param id - Quick access item ID
 * @returns QuickAccessItem if found, undefined otherwise
 */
export function getQuickAccessItemById(id: string): QuickAccessItem | undefined {
  return QUICK_ACCESS_ITEMS.find(item => item.id === id);
}

/**
 * Filter quick access items by user role
 * 
 * @param userRole - User's role
 * @returns Array of QuickAccessItem objects accessible to the user
 */
export function filterQuickAccessByRole(userRole: UserRole): QuickAccessItem[] {
  return QUICK_ACCESS_ITEMS.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );
}
