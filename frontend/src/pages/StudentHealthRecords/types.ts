/**
 * WF-COMP-239 | types.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: interfaces | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Student Health Records Page Type Definitions
 *
 * Page-specific types for the student health records module
 */

/**
 * Student health record data structure
 */
export interface HealthRecord {
  student: {
    name: string;
  };
  records: any[];
}

/**
 * Access check result
 */
export interface AccessCheckResult {
  hasAccess: boolean;
  isRestricted: boolean;
  isSensitive: boolean;
}

/**
 * Props for health record components
 */
export interface HealthRecordComponentProps {
  studentId: string;
  onBack: () => void;
}
