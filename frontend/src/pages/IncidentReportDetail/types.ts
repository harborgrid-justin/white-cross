/**
 * WF-COMP-193 | types.ts - React component or utility module
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
