import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Student } from './student.model';

/**
 * Mental Health Record Types
 */
export enum MentalHealthRecordType {
  ASSESSMENT = 'ASSESSMENT',
  COUNSELING_SESSION = 'COUNSELING_SESSION',
  CRISIS_INTERVENTION = 'CRISIS_INTERVENTION',
  THERAPY_SESSION = 'THERAPY_SESSION',
  PSYCHIATRIC_EVALUATION = 'PSYCHIATRIC_EVALUATION',
  SCREENING = 'SCREENING',
  FOLLOW_UP = 'FOLLOW_UP',
  REFERRAL = 'REFERRAL',
  PROGRESS_NOTE = 'PROGRESS_NOTE',
}

/**
 * Risk Level Assessment
 */
export enum RiskLevel {
  NONE = 'NONE',
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Mental Health Record Attributes
 */
export interface MentalHealthRecordAttributes {
  id: string;
  studentId: string;
  recordType: MentalHealthRecordType;
  recordDate: Date;
  counselorId?: string;
  therapistId?: string;
  psychiatristId?: string;
  title: string;
  sessionNotes: string;
  assessment?: string;
  diagnosis?: string;
  diagnosisCode?: string; // ICD-10 or DSM-5 code
  treatmentPlan?: string;
  riskLevel: RiskLevel;
  riskFactors?: string[];
  protectiveFactors?: string[];
  interventions?: string[];
  followUpRequired: boolean;
  followUpDate?: Date;
  followUpCompleted: boolean;
  referralTo?: string;
  referralReason?: string;
  confidentialityLevel: 'STANDARD' | 'ENHANCED' | 'MAXIMUM';
  parentNotified: boolean;
  parentNotificationDate?: Date;
  attachments: string[];
  metadata?: Record<string, any>;
  createdBy?: string;
  updatedBy?: string;
  accessLog?: Array<{
    userId: string;
    accessDate: Date;
    action: string;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Mental Health Record Model
 *
 * Stores highly sensitive mental health records for students with enhanced
 * confidentiality and access controls beyond standard PHI protections.
 *
 * HIPAA & Privacy Compliance:
 * - Enhanced confidentiality beyond standard PHI
 * - Strict access controls (mental health specialists only)
 * - Detailed access logging required
 * - Special consent requirements for access
 * - Separate from general health records
 * - Additional encryption recommended
 *
 * Features:
 * - Risk assessment and tracking
 * - Crisis intervention documentation
 * - Treatment planning
 * - Referral management
 * - Parent notification tracking
 * - Comprehensive access audit trail
 *
 * Access Control:
 * - Only mental health professionals can access
 * - School nurses may have limited access with proper authorization
 * - Access requires special consent from parent/guardian
 * - All access must be logged and audited
 *
 * Indexes:
 * - studentId for student lookup
 * - recordType for filtering by type
 * - riskLevel for identifying high-risk students
 * - counselorId for counselor caseload queries
 */
@Table({
  tableName: 'mental_health_records',
  timestamps: true,
  indexes: [
    {
      fields: ['student_id'],
      name: 'mental_health_records_student_id_idx',
    },
    {
      fields: ['record_type'],
      name: 'mental_health_records_record_type_idx',
    },
    {
      fields: ['risk_level'],
      name: 'mental_health_records_risk_level_idx',
    },
    {
      fields: ['counselor_id'],
      name: 'mental_health_records_counselor_id_idx',
    },
    {
      fields: ['record_date'],
      name: 'mental_health_records_record_date_idx',
    },
    {
      fields: ['follow_up_required', 'follow_up_date'],
      name: 'mental_health_records_follow_up_idx',
    },
    {
      fields: ['student_id', 'record_date'],
      name: 'mental_health_records_student_date_idx',
    },
  ],
})
export class MentalHealthRecord extends Model<MentalHealthRecordAttributes> implements MentalHealthRecordAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  /**
   * Student reference
   * @PHI - Enhanced Protection Required
   */
  @ForeignKey(() => Student)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'student_id',
  })
  studentId: string;

  /**
   * Type of mental health record
   */
  @Column({
    type: DataType.ENUM(...(Object.values(MentalHealthRecordType) as string[])),
    allowNull: false,
    field: 'record_type',
  })
  recordType: MentalHealthRecordType;

  /**
   * Date of the session/assessment
   */
  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'record_date',
  })
  recordDate: Date;

  /**
   * School counselor ID
   */
  @Column({
    type: DataType.UUID,
    field: 'counselor_id',
  })
  counselorId?: string;

  /**
   * External therapist ID (if applicable)
   */
  @Column({
    type: DataType.UUID,
    field: 'therapist_id',
  })
  therapistId?: string;

  /**
   * Psychiatrist ID (if applicable)
   */
  @Column({
    type: DataType.UUID,
    field: 'psychiatrist_id',
  })
  psychiatristId?: string;

  /**
   * Record title/subject
   * @PHI - Enhanced Protection Required
   */
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  title: string;

  /**
   * Session notes (highly confidential)
   * @PHI - Enhanced Protection Required
   */
  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'session_notes',
  })
  sessionNotes: string;

  /**
   * Clinical assessment
   * @PHI - Enhanced Protection Required
   */
  @Column(DataType.TEXT)
  assessment?: string;

  /**
   * Diagnosis (if applicable)
   * @PHI - Enhanced Protection Required
   */
  @Column(DataType.TEXT)
  diagnosis?: string;

  /**
   * ICD-10 or DSM-5 diagnosis code
   */
  @Column({
    type: DataType.STRING(20),
    field: 'diagnosis_code',
  })
  diagnosisCode?: string;

  /**
   * Treatment plan
   * @PHI - Enhanced Protection Required
   */
  @Column({
    type: DataType.TEXT,
    field: 'treatment_plan',
  })
  treatmentPlan?: string;

  /**
   * Current risk level assessment
   */
  @Column({
    type: DataType.ENUM(...(Object.values(RiskLevel) as string[])),
    allowNull: false,
    defaultValue: RiskLevel.NONE,
    field: 'risk_level',
  })
  riskLevel: RiskLevel;

  /**
   * Identified risk factors
   */
  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    field: 'risk_factors',
  })
  riskFactors?: string[];

  /**
   * Protective factors
   */
  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    field: 'protective_factors',
  })
  protectiveFactors?: string[];

  /**
   * Interventions applied
   */
  @Column({
    type: DataType.ARRAY(DataType.TEXT),
  })
  interventions?: string[];

  /**
   * Follow-up required
   */
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    field: 'follow_up_required',
  })
  followUpRequired: boolean;

  /**
   * Follow-up scheduled date
   */
  @Column({
    type: DataType.DATE,
    field: 'follow_up_date',
  })
  followUpDate?: Date;

  /**
   * Follow-up completed
   */
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    field: 'follow_up_completed',
  })
  followUpCompleted: boolean;

  /**
   * Referral to external provider/specialist
   */
  @Column({
    type: DataType.STRING(200),
    field: 'referral_to',
  })
  referralTo?: string;

  /**
   * Reason for referral
   */
  @Column({
    type: DataType.TEXT,
    field: 'referral_reason',
  })
  referralReason?: string;

  /**
   * Confidentiality level
   * STANDARD: Normal mental health record protection
   * ENHANCED: Additional restrictions (e.g., crisis intervention)
   * MAXIMUM: Highest protection (e.g., abuse cases, legal involvement)
   */
  @Column({
    type: DataType.ENUM('STANDARD', 'ENHANCED', 'MAXIMUM'),
    allowNull: false,
    defaultValue: 'STANDARD',
    field: 'confidentiality_level',
  })
  confidentialityLevel: 'STANDARD' | 'ENHANCED' | 'MAXIMUM';

  /**
   * Whether parent/guardian was notified
   */
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    field: 'parent_notified',
  })
  parentNotified: boolean;

  /**
   * Date parent/guardian was notified
   */
  @Column({
    type: DataType.DATE,
    field: 'parent_notification_date',
  })
  parentNotificationDate?: Date;

  /**
   * Encrypted attachment URLs
   */
  @Default([])
  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  attachments: string[];

  /**
   * Additional metadata
   */
  @Column(DataType.JSONB)
  metadata?: Record<string, any>;

  /**
   * User who created this record
   */
  @Column({
    type: DataType.UUID,
    field: 'created_by',
  })
  createdBy?: string;

  /**
   * User who last updated this record
   */
  @Column({
    type: DataType.UUID,
    field: 'updated_by',
  })
  updatedBy?: string;

  /**
   * Access log for audit trail
   * Records every access to this record
   */
  @Default([])
  @Column({
    type: DataType.JSONB,
    field: 'access_log',
  })
  accessLog?: Array<{
    userId: string;
    accessDate: Date;
    action: string;
  }>;

  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  declare createdAt?: Date;

  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  declare updatedAt?: Date;

  // Relationships
  @BelongsTo(() => Student)
  student?: Student;

  /**
   * Log access to this record
   */
  logAccess(userId: string, action: string): void {
    if (!this.accessLog) {
      this.accessLog = [];
    }

    this.accessLog.push({
      userId,
      accessDate: new Date(),
      action,
    });
  }

  /**
   * Check if follow-up is overdue
   */
  isFollowUpOverdue(): boolean {
    if (!this.followUpRequired || !this.followUpDate || this.followUpCompleted) {
      return false;
    }
    return new Date() > this.followUpDate;
  }

  /**
   * Check if this is a high-risk record
   */
  isHighRisk(): boolean {
    return this.riskLevel === RiskLevel.HIGH || this.riskLevel === RiskLevel.CRITICAL;
  }

  /**
   * Get days until follow-up (negative if overdue)
   */
  getDaysUntilFollowUp(): number | null {
    if (!this.followUpRequired || !this.followUpDate || this.followUpCompleted) {
      return null;
    }
    const diff = this.followUpDate.getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Check if parent notification is required but not done
   */
  requiresParentNotification(): boolean {
    // High or critical risk records should notify parents
    return this.isHighRisk() && !this.parentNotified;
  }
}
