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
  CreatedAt,
  UpdatedAt
  } from 'sequelize-typescript';

export enum MedicationLogStatus {
  PENDING = 'PENDING',
  ADMINISTERED = 'ADMINISTERED',
  MISSED = 'MISSED',
  CANCELLED = 'CANCELLED',
  REFUSED = 'REFUSED'
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
  wasGiven: boolean;
  reasonNotGiven?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Table({
  tableName: 'medication_logs',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    { fields: ['studentId', 'medicationId'] },
    { fields: ['administeredAt'] },
    { fields: ['administeredBy'] },
  ]
  })
export class MedicationLog extends Model<MedicationLogAttributes> implements MedicationLogAttributes {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => require('./student.model').Student)
  @Index
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  studentId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  medicationId: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false
  })
  dosage: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  dosageUnit: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  route: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Scheduled time for medication administration'
  })
  scheduledAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  administeredAt: Date;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  administeredBy: string;

  @Index
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(MedicationLogStatus)]
    },
    allowNull: true,
    defaultValue: MedicationLogStatus.ADMINISTERED,
    comment: 'Status of medication administration'
  })
  status?: MedicationLogStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  notes?: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false
  })
  wasGiven: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  reasonNotGiven?: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  declare updatedAt: Date;

  // Relations
  @BelongsTo(() => require('./student.model').Student, { foreignKey: 'studentId', as: 'student' })
  declare student?: any;
}