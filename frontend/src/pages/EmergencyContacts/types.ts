/**
 * WF-COMP-186 | types.ts - React component or utility module
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
 * Emergency Contacts Page Type Definitions
 *
 * Page-specific types for the emergency contacts module
 */

/**
 * Contact priority levels
 */
export type ContactPriority = 'PRIMARY' | 'SECONDARY' | 'EMERGENCY_ONLY';

/**
 * Tab types for the page
 */
export type EmergencyContactsTab = 'overview' | 'contacts' | 'notify';

/**
 * Emergency contact interface
 */
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  priority: ContactPriority;
  isActive: boolean;
  verified?: boolean;
  verifiedAt?: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
}

/**
 * Filter form state interface
 */
export interface EmergencyContactFilters {
  searchQuery: string;
  selectedStudent: string;
  priority: string;
  verified: string;
}

/**
 * Contact form data interface
 */
export interface ContactFormData {
  studentId: string;
  firstName: string;
  lastName: string;
  relationship: string;
  phoneNumber: string;
  email: string;
  address: string;
  priority: ContactPriority;
}

/**
 * Notification types
 */
export type NotificationType = 'emergency' | 'health' | 'medication' | 'general';

/**
 * Notification priority levels
 */
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Notification form data interface
 */
export interface NotificationData {
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  channels: string[];
}

/**
 * Emergency contact statistics interface
 */
export interface EmergencyContactStatistics {
  totalContacts: number;
  verifiedContacts: number;
  primaryContacts: number;
  notificationsSent: number;
}
