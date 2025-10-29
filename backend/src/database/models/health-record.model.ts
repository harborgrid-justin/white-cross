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
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

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

@Table({
  tableName: 'health_records',
  timestamps: true,
  indexes: [
    {
      fields: ['studentId', 'recordDate'],
    },
    {
      fields: ['recordType', 'recordDate'],
    },
    {
      fields: ['createdBy'],
    },
    {
      fields: ['followUpRequired', 'followUpDate'],
    },
  ],
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
    allowNull: false,
  })
  recordType: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  recordDate: Date;

  @Column(DataType.STRING(200))
  provider?: string;

  @Column(DataType.STRING(20))
  providerNpi?: string;

  @Column(DataType.STRING(200))
  facility?: string;

  @Column(DataType.STRING(20))
  facilityNpi?: string;

  @Column(DataType.TEXT)
  diagnosis?: string;

  @Column(DataType.STRING(20))
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
    allowNull: false,
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
  @BelongsTo(() => require('./student.model').Student)
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
