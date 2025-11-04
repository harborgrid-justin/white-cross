import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
  BeforeCreate,
  BeforeUpdate,
  Scopes
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

export interface HealthRecordAttributes {
  id: string;
  studentId: string;
  recordType: string;
  title: string;
  description: string;
  recordDate: Date;
  provider?: string;
  providerNpi?: string;
  facility?: string;
  facilityNpi?: string;
  diagnosis?: string;
  diagnosisCode?: string;
  treatment?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  followUpCompleted: boolean;
  attachments: string[];
  metadata?: Record<string, any>;
  isConfidential: boolean;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
}

@Scopes(() => ({
  byStudent: (studentId: string) => ({
    where: { studentId },
    order: [['recordDate', 'DESC']]
  }),
  byType: (recordType: string) => ({
    where: { recordType },
    order: [['recordDate', 'DESC']]
  }),
  confidential: {
    where: {
      isConfidential: true
    }
  },
  recent: {
    where: {
      recordDate: {
        [Op.gte]: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      }
    },
    order: [['recordDate', 'DESC']]
  },
  needsFollowUp: {
    where: {
      followUpRequired: true,
      followUpCompleted: false,
      followUpDate: {
        [Op.ne]: null
      }
    },
    order: [['followUpDate', 'ASC']]
  },
  overdueFollowUp: {
    where: {
      followUpRequired: true,
      followUpCompleted: false,
      followUpDate: {
        [Op.lt]: new Date()
      }
    },
    order: [['followUpDate', 'ASC']]
  },
  byDiagnosisCode: (code: string) => ({
    where: {
      diagnosisCode: {
        [Op.like]: `${code}%`
      }
    },
    order: [['recordDate', 'DESC']]
  })
}))
@Table({
  tableName: 'health_records',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    // Existing indexes
    {
      fields: ['studentId', 'recordDate'],
      name: 'idx_health_records_student_date'
    },
    {
      fields: ['recordType', 'recordDate'],
      name: 'idx_health_records_type_date'
    },
    {
      fields: ['createdBy'],
      name: 'idx_health_records_created_by'
    },
    {
      fields: ['followUpRequired', 'followUpDate'],
      name: 'idx_health_records_followup'
    },
    // New composite indexes for common query patterns
    {
      fields: ['studentId', 'recordType', 'recordDate'],
      name: 'idx_health_records_student_type_date'
    },
    {
      fields: ['studentId', 'isConfidential'],
      name: 'idx_health_records_student_confidential'
    },
    {
      fields: ['recordType', 'isConfidential', 'recordDate'],
      name: 'idx_health_records_type_confidential_date'
    },
    {
      fields: ['provider', 'recordDate'],
      name: 'idx_health_records_provider_date'
    },
    {
      fields: ['diagnosisCode'],
      name: 'idx_health_records_diagnosis_code'
    },
    {
      fields: ['createdAt'],
      name: 'idx_health_records_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_health_records_updated_at'
    }
  ]
})
export class HealthRecord extends Model<HealthRecordAttributes> implements HealthRecordAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => require('./student.model').Student)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  studentId: string;

  @Column({
    type: DataType.ENUM(
      'CHECKUP',
      'VACCINATION',
      'ILLNESS',
      'INJURY',
      'SCREENING',
      'PHYSICAL_EXAM',
      'MENTAL_HEALTH',
      'DENTAL',
      'VISION',
      'HEARING',
      'EXAMINATION',
      'ALLERGY_DOCUMENTATION',
      'CHRONIC_CONDITION_REVIEW',
      'GROWTH_ASSESSMENT',
      'VITAL_SIGNS_CHECK',
      'EMERGENCY_VISIT',
      'FOLLOW_UP',
      'CONSULTATION',
      'DIAGNOSTIC_TEST',
      'PROCEDURE',
      'HOSPITALIZATION',
      'SURGERY',
      'COUNSELING',
      'THERAPY',
      'NUTRITION',
      'MEDICATION_REVIEW',
      'IMMUNIZATION',
      'LAB_RESULT',
      'RADIOLOGY',
      'OTHER'
    ),
    allowNull: false
  })
  recordType: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  description: string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  recordDate: Date;

  @Column(DataType.STRING(200))
  provider?: string;

  @Column({
    type: DataType.STRING(20),
    validate: {
      is: {
        args: /^\d{10}$/,
        msg: 'NPI must be a 10-digit number'
      }
    }
  })
  providerNpi?: string;

  @Column(DataType.STRING(200))
  facility?: string;

  @Column({
    type: DataType.STRING(20),
    validate: {
      is: {
        args: /^\d{10}$/,
        msg: 'NPI must be a 10-digit number'
      }
    }
  })
  facilityNpi?: string;

  @Column(DataType.TEXT)
  diagnosis?: string;

  @Column({
    type: DataType.STRING(20),
    validate: {
      is: {
        args: /^[A-Z]\d{2}(\.\d{1,4})?$/,
        msg: 'Diagnosis code must be in ICD-10 format (e.g., A00, A00.0, A00.01)'
      }
    }
  })
  diagnosisCode?: string;

  @Column(DataType.TEXT)
  treatment?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  followUpRequired: boolean;

  @Column(DataType.DATE)
  followUpDate?: Date;

  @Default(false)
  @Column(DataType.BOOLEAN)
  followUpCompleted: boolean;

  @Default([])
  @Column({
    type: DataType.JSON,
    allowNull: false
  })
  attachments: string[];

  @Column(DataType.JSONB)
  metadata?: Record<string, any>;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isConfidential: boolean;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.UUID)
  createdBy?: string;

  @Column(DataType.UUID)
  updatedBy?: string;

  @Column(DataType.DATE)
  declare createdAt: Date;

  @Column(DataType.DATE)
  declare updatedAt: Date;

  // Relationships
  // Using lazy evaluation with require() to prevent circular dependencies
  @BelongsTo(() => require('./student.model').Student, { foreignKey: 'studentId', as: 'student', constraints: true })
  declare student?: any;

  // Note: Other relationships will be added as related models are converted
  // @HasMany(() => Vaccination)
  // vaccinations?: Vaccination[];

  // @HasMany(() => VitalSigns)
  // vitalSigns?: VitalSigns[];

  // @HasMany(() => Allergy)
  // allergies?: Allergy[];

  // @HasMany(() => ChronicCondition)
  // chronicConditions?: ChronicCondition[];

  // Hooks
  @BeforeCreate
  @BeforeUpdate
  static async validateFollowUpDate(instance: HealthRecord) {
    if (instance.followUpRequired && !instance.followUpDate) {
      throw new Error('Follow-up date is required when follow-up is marked as required');
    }
    if (instance.followUpDate && instance.followUpDate < instance.recordDate) {
      throw new Error('Follow-up date cannot be before record date');
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: HealthRecord) {
    // Log PHI access for HIPAA compliance
    if (instance.changed()) {
      console.log(`[AUDIT] Health record ${instance.id} modified for student ${instance.studentId} at ${new Date().toISOString()}`);
      // TODO: Integrate with AuditLog model when available
    }
  }

  /**
   * Check if follow-up is overdue
   * @returns true if follow-up is required but date has passed
   */
  isFollowUpOverdue(): boolean {
    if (!this.followUpRequired || !this.followUpDate || this.followUpCompleted) {
      return false;
    }
    return new Date() > this.followUpDate;
  }

  /**
   * Get days until follow-up (negative if overdue)
   * @returns days until follow-up, null if not applicable
   */
  getDaysUntilFollowUp(): number | null {
    if (!this.followUpRequired || !this.followUpDate || this.followUpCompleted) {
      return null;
    }
    const diff = this.followUpDate.getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
