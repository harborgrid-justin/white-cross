import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

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
@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'mental_health_records',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    {
      fields: ['studentId'],
      name: 'mental_health_records_student_id_idx',
    },
    {
      fields: ['recordType'],
      name: 'mental_health_records_record_type_idx',
    },
    {
      fields: ['riskLevel'],
      name: 'mental_health_records_risk_level_idx',
    },
    {
      fields: ['counselorId'],
      name: 'mental_health_records_counselor_id_idx',
    },
    {
      fields: ['recordDate'],
      name: 'mental_health_records_record_date_idx',
    },
    {
      fields: ['followUpRequired', 'followUpDate'],
      name: 'mental_health_records_follow_up_idx',
    },
    {
      fields: ['studentId', 'recordDate'],
      name: 'mental_health_records_student_date_idx',
    },
    {
      fields: ['createdAt'],
      name: 'idx_mental_health_record_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_mental_health_record_updated_at',
    },
  ],
})
export class MentalHealthRecord
  extends Model<MentalHealthRecordAttributes>
  implements MentalHealthRecordAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  /**
   * Student reference
   * @PHI - Enhanced Protection Required
   */
  @ForeignKey(() => require('./student.model').Student)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  studentId: string;

  /**
   * Type of mental health record
   */
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(MentalHealthRecordType)],
    },
    allowNull: false,
  })
  recordType: MentalHealthRecordType;

  /**
   * Date of the session/assessment
   */
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  recordDate: Date;

  /**
   * School counselor ID
   */
  @Column({
    type: DataType.UUID,
  })
  counselorId?: string;

  /**
   * External therapist ID (if applicable)
   */
  @Column({
    type: DataType.UUID,
  })
  therapistId?: string;

  /**
   * Psychiatrist ID (if applicable)
   */
  @Column({
    type: DataType.UUID,
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
  })
  diagnosisCode?: string;

  /**
   * Treatment plan
   * @PHI - Enhanced Protection Required
   */
  @Column({
    type: DataType.TEXT,
  })
  treatmentPlan?: string;

  /**
   * Current risk level assessment
   */
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(RiskLevel)],
    },
    allowNull: false,
    defaultValue: RiskLevel.NONE,
  })
  riskLevel: RiskLevel;

  /**
   * Identified risk factors
   */
  @Column({
    type: DataType.ARRAY(DataType.TEXT),
  })
  riskFactors?: string[];

  /**
   * Protective factors
   */
  @Column({
    type: DataType.ARRAY(DataType.TEXT),
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
  })
  followUpRequired: boolean;

  /**
   * Follow-up scheduled date
   */
  @Column({
    type: DataType.DATE,
  })
  followUpDate?: Date;

  /**
   * Follow-up completed
   */
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  followUpCompleted: boolean;

  /**
   * Referral to external provider/specialist
   */
  @Column({
    type: DataType.STRING(200),
  })
  referralTo?: string;

  /**
   * Reason for referral
   */
  @Column({
    type: DataType.TEXT,
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
  })
  confidentialityLevel: 'STANDARD' | 'ENHANCED' | 'MAXIMUM';

  /**
   * Whether parent/guardian was notified
   */
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  parentNotified: boolean;

  /**
   * Date parent/guardian was notified
   */
  @Column({
    type: DataType.DATE,
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
  })
  createdBy?: string;

  /**
   * User who last updated this record
   */
  @Column({
    type: DataType.UUID,
  })
  updatedBy?: string;

  /**
   * Access log for audit trail
   * Records every access to this record
   */
  @Default([])
  @Column({
    type: DataType.JSONB,
  })
  accessLog?: Array<{
    userId: string;
    accessDate: Date;
    action: string;
  }>;

  @Column({
    type: DataType.DATE,
  })
  declare createdAt?: Date;

  @Column({
    type: DataType.DATE,
  })
  declare updatedAt?: Date;

  // Relationships
  @BelongsTo(() => require('./student.model').Student)
  declare student?: any;

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
    if (
      !this.followUpRequired ||
      !this.followUpDate ||
      this.followUpCompleted
    ) {
      return false;
    }
    return new Date() > this.followUpDate;
  }

  /**
   * Check if this is a high-risk record
   */
  isHighRisk(): boolean {
    return (
      this.riskLevel === RiskLevel.HIGH || this.riskLevel === RiskLevel.CRITICAL
    );
  }

  /**
   * Get days until follow-up (negative if overdue)
   */
  getDaysUntilFollowUp(): number | null {
    if (
      !this.followUpRequired ||
      !this.followUpDate ||
      this.followUpCompleted
    ) {
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

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: MentalHealthRecord) {
    await createModelAuditHook('MentalHealthRecord', instance);
  }
}

// Default export for Sequelize-TypeScript
export default MentalHealthRecord;
