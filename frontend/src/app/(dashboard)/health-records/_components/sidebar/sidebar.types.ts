/**
 * @fileoverview Shared Type Definitions for Health Records Sidebar Components
 * @module app/health-records/_components/sidebar/sidebar.types
 *
 * HIPAA CRITICAL: These types handle Protected Health Information (PHI).
 * All components using these types must implement proper access controls and audit logging.
 */

/**
 * Health Records Statistics Interface
 * Dashboard metrics for sidebar overview
 */
export interface HealthRecordsStats {
  total: number;
  active: number;
  pendingReview: number;
  archived: number;
  criticalPriority: number;
  followUpsRequired: number;
  confidentialRecords: number;
  expiringRecords: number;
  medicalHistory: number;
  physicalExams: number;
  immunizations: number;
  allergies: number;
  medications: number;
  vitalSigns: number;
  growthCharts: number;
  screenings: number;
}

/**
 * Recent Health Record Item
 * Represents a recently accessed or updated health record
 * HIPAA CRITICAL: Contains PHI - student name and health information
 */
export interface RecentRecord {
  id: string;
  title: string;
  studentName: string;
  type: HealthRecordType;
  status: RecordStatus;
  priority: RecordPriority;
  timestamp: string;
}

/**
 * Upcoming Action Item
 * Represents a pending action or follow-up required
 * HIPAA CRITICAL: Contains PHI - student identifier and health action details
 */
export interface UpcomingAction {
  id: string;
  action: string;
  student: string;
  dueDate: string;
  priority: ActionPriority;
  type: ActionType;
}

/**
 * Health Record Type Enum
 */
export type HealthRecordType =
  | 'MEDICAL_HISTORY'
  | 'PHYSICAL_EXAM'
  | 'IMMUNIZATION'
  | 'ALLERGY'
  | 'MEDICATION'
  | 'VITAL_SIGNS'
  | 'GROWTH_CHART'
  | 'SCREENING';

/**
 * Record Status Enum
 */
export type RecordStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'PENDING_REVIEW'
  | 'ARCHIVED'
  | 'EXPIRED';

/**
 * Record Priority Enum
 */
export type RecordPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Action Priority Enum
 */
export type ActionPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Action Type Enum
 */
export type ActionType =
  | 'FOLLOW_UP'
  | 'REVIEW'
  | 'MEDICATION'
  | 'IMMUNIZATION'
  | 'SCREENING'
  | 'APPOINTMENT';

/**
 * System Status Item
 */
export interface SystemStatus {
  name: string;
  status: 'online' | 'offline' | 'warning';
  label: string;
}

/**
 * Quick Action Button Configuration
 */
export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  path: string;
  description?: string;
}

/**
 * Search Parameters for Sidebar Filtering
 */
export interface SidebarSearchParams {
  page?: string;
  limit?: string;
  type?: string;
  status?: string;
  priority?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  studentId?: string;
}
