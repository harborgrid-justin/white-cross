/**
 * ComplianceDetail Module
 *
 * This module provides a comprehensive compliance requirement detail view with
 * support for task management, evidence tracking, history, comments, and settings.
 *
 * The component has been refactored from a single 1,105 LOC file into modular
 * components for better maintainability and separation of concerns.
 */

// Main component
export { default as ComplianceDetail } from './ComplianceDetail';
export { default } from './ComplianceDetail';

// Tab components (for advanced usage)
export { default as ComplianceOverview } from './ComplianceOverview';
export { default as ComplianceTasks } from './ComplianceTasks';
export { default as ComplianceEvidence } from './ComplianceEvidence';
export { default as ComplianceHistory } from './ComplianceHistory';
export { default as ComplianceComments } from './ComplianceComments';
export { default as ComplianceSettings } from './ComplianceSettings';

// Types
export * from './types';

// Utilities
export * from './utils';
