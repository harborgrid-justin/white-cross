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
  UpdatedAt,
} from 'sequelize-typescript';
import { Student } from './student.model';

export enum MedicationLogStatus {
  PENDING = 'PENDING',
  ADMINISTERED = 'ADMINISTERED',
  MISSED = 'MISSED',
  CANCELLED = 'CANCELLED',
  REFUSED = 'REFUSED',
}

export interface MedicationLogAttributes {
  id: string;
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
  indexes: [
    { fields: ['studentId', 'medicationId'] },
    { fields: ['administeredAt'] },
    { fields: ['administeredBy'] },
  ],
})
export class MedicationLog extends Model<MedicationLogAttributes> implements MedicationLogAttributes {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  declare id: string;

  @ForeignKey(() => Student)
  @Index
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'student_id',
  })
  studentId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'medication_id',
  })
  medicationId: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  dosage: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  dosageUnit: string;

  @Column({
    type: DataType.STRING,
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
    type: DataType.STRING,
    allowNull: false,
    field: 'administered_by',
  })
  administeredBy: string;

  @Index
  @Column({
    type: DataType.ENUM(...(Object.values(MedicationLogStatus) as string[])),
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

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  wasGiven: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
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
  @BelongsTo(() => Student, { foreignKey: 'studentId', as: 'student' })
  student?: Student;
}