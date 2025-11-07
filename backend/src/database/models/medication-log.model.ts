import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Index,
  Model,
  PrimaryKey,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

export enum MedicationLogStatus {
  PENDING = 'PENDING',
  ADMINISTERED = 'ADMINISTERED',
  MISSED = 'MISSED',
  CANCELLED = 'CANCELLED',
  REFUSED = 'REFUSED',
}

export interface MedicationLogAttributes {
  id?: string;
  studentId: string;
  medicationId: string;
  dosage: number;
  dosageUnit: string;
  route: string;
  scheduledAt?: Date;
  administeredAt: Date;
  administeredBy: string;
  status?: MedicationLogStatus;
  notes?: string;
  reasonNotGiven?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'medication_logs',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    { fields: ['studentId', 'medicationId'] },
    { fields: ['administeredAt'] },
    { fields: ['administeredBy'] },
    {
      fields: ['createdAt'],
      name: 'idx_medication_log_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_medication_log_updated_at',
    },
    // Composite index for medication administration history queries
    {
      fields: ['medicationId', 'administeredAt', 'status'],
      name: 'idx_medication_log_med_time_status',
    },
    // Composite index for student medication logs with status filtering
    {
      fields: ['studentId', 'administeredAt', 'status'],
      name: 'idx_medication_log_student_time_status',
    },
  ],
})
export class MedicationLog
  extends Model<MedicationLogAttributes>
  implements MedicationLogAttributes
{
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => require('./student.model').Student)
  @Index
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  studentId: string;

  @ForeignKey(() => require('./medication.model').Medication)
  @Index
  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: {
      model: 'medications',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  medicationId: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  dosage: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  dosageUnit: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  route: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Scheduled time for medication administration',
  })
  scheduledAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  administeredAt: Date;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  administeredBy: string;

  @Index
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(MedicationLogStatus)],
    },
    allowNull: true,
    defaultValue: MedicationLogStatus.ADMINISTERED,
    comment: 'Status of medication administration',
  })
  status?: MedicationLogStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Reason when status is MISSED, CANCELLED, or REFUSED',
  })
  reasonNotGiven?: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare updatedAt: Date;

  // Relations
  @BelongsTo(() => require('./student.model').Student, {
    foreignKey: 'studentId',
    as: 'student',
  })
  declare student?: any;

  @BelongsTo(() => require('./medication.model').Medication, {
    foreignKey: 'medicationId',
    as: 'medication',
  })
  declare medication?: any;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: MedicationLog, options: any) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      const { logModelPHIAccess } = await import(
        '../services/model-audit-helper.service.js'
      );
      const action = instance.isNewRecord ? 'CREATE' : 'UPDATE';
      await logModelPHIAccess(
        'MedicationLog',
        instance.id,
        action,
        changedFields,
        options?.transaction,
      );
    }
  }
}
