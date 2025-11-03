/**
 * Chronic Condition Interface
 *
 * Comprehensive chronic condition management following clinical standards
 *
 * @interface ChronicCondition
 * @compliance HIPAA, CDC Guidelines
 */

/**
 * Chronic condition status enumeration
 */
export enum ConditionStatus {
  ACTIVE = 'ACTIVE',
  MANAGED = 'MANAGED',
  RESOLVED = 'RESOLVED',
  MONITORING = 'MONITORING'
}

/**
 * Chronic condition severity enumeration
 */
export enum ConditionSeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
  CRITICAL = 'CRITICAL'
}

export interface ChronicCondition {
  /** Unique identifier */
  id: string;

  /** Student ID this condition belongs to */
  studentId: string;

  /** Associated health record ID */
  healthRecordId?: string;

  /** Name of the chronic condition */
  condition: string;

  /** ICD diagnostic code */
  icdCode?: string;

  /** Date when condition was diagnosed */
  diagnosedDate: Date;

  /** Healthcare provider who diagnosed */
  diagnosedBy?: string;

  /** Current status of the condition */
  status: ConditionStatus;

  /** Severity level */
  severity?: string;

  /** Additional clinical notes */
  notes?: string;

  /** Care plan and management strategy */
  carePlan?: string;

  /** Associated medications */
  medications: string[];

  /** Activity restrictions */
  restrictions: string[];

  /** Known triggers */
  triggers: string[];

  /** Required accommodations */
  accommodations: string[];

  /** Emergency action plan */
  emergencyActionPlan?: string;

  /** Emergency response protocol */
  emergencyProtocol?: string;

  /** Review frequency in months */
  reviewFrequencyMonths?: number;

  /** Next review due date */
  nextReviewDate?: Date;

  /** Last review date */
  lastReviewDate?: Date;

  /** Monitoring parameters */
  monitoringParameters?: string[];

  /** Specialist referrals */
  specialistReferrals?: string[];

  /** Requires IEP accommodation */
  requiresIEP: boolean;

  /** Requires 504 plan accommodation */
  requires504: boolean;

  /** Whether condition is currently active */
  isActive: boolean;

  /** Parent/guardian notified */
  guardianNotified: boolean;

  /** Date guardian was notified */
  guardianNotificationDate?: Date;

  /** Record creation timestamp */
  createdAt?: Date;

  /** Record update timestamp */
  updatedAt?: Date;
}