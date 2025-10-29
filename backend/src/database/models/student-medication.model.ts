import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  BeforeCreate,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
;
;

export interface StudentMedicationAttributes {
  id: string;
  studentId: string;
  medicationId: string;
  dosage: string;
  frequency: string;
  route: string;
  instructions?: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  prescribedBy: string;
  prescriptionNumber?: string;
  refillsRemaining?: number;
  createdBy?: string;
  updatedBy?: string;
}

@Table({
  tableName: 'student_medications',
  timestamps: true,
  indexes: [
    {
      fields: ['studentId'],
    },
    {
      fields: ['medicationId'],
    },
    {
      fields: ['isActive'],
    },
    {
      fields: ['startDate'],
    },
    {
      fields: ['endDate'],
    },
    {
      fields: ['studentId', 'isActive'],
    },
    {
      fields: ['createdBy'],
    },
  ],
})
export class StudentMedication extends Model<StudentMedicationAttributes> implements StudentMedicationAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => require('./student.model').Student)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'studentId',
  })
  studentId: string;

  @ForeignKey(() => require('./medication.model').Medication)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'medicationId',
  })
  medicationId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  dosage: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  frequency: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  route: string;

  @Column(DataType.TEXT)
  instructions?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'startDate',
  })
  startDate: Date;

  @Column({
    type: DataType.DATE,
    field: 'endDate',
  })
  endDate?: Date;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    field: 'isActive',
  })
  isActive: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'prescribedBy',
  })
  prescribedBy: string;

  @Column({
    type: DataType.STRING,
    field: 'prescriptionNumber',
  })
  prescriptionNumber?: string;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    field: 'refillsRemaining',
  })
  refillsRemaining?: number;

  @Column({
    type: DataType.UUID,
    field: 'createdBy',
  })
  createdBy?: string;

  @Column({
    type: DataType.UUID,
    field: 'updatedBy',
  })
  updatedBy?: string;

  @Column({
    type: DataType.DATE,
    field: 'createdAt',
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
    field: 'updatedAt',
  })
  declare updatedAt: Date;

  @BelongsTo(() => require('./student.model').Student)
  declare student?: any;

  @BelongsTo(() => require('./medication.model').Medication)
  declare medication?: any;

  /**
   * Check if medication is currently active based on dates
   */
  get isCurrentlyActive(): boolean {
    const now = new Date();
    const isAfterStart = now >= this.startDate;
    const isBeforeEnd = !this.endDate || now <= this.endDate;
    return this.isActive && isAfterStart && isBeforeEnd;
  }

  /**
   * Get the number of days remaining in the medication schedule
   */
  get daysRemaining(): number | null {
    if (!this.endDate) return null;
    const now = new Date();
    const diff = this.endDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
