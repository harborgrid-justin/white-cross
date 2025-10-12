/**
 * Incident Report Detail Page Type Definitions
 *
 * Page-specific types for the incident report detail module
 */

/**
 * Tab types for detail view
 */
export type TabType = 'details' | 'witness-statements' | 'follow-up-actions' | 'timeline';

/**
 * Timeline event types
 */
export interface TimelineEvent {
  id: string;
  type: 'incident' | 'statement' | 'action' | 'notification';
  timestamp: string;
  title: string;
  description: string;
  actor?: string;
}
