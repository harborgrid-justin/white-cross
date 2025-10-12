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
