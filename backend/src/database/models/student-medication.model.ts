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
  })
  studentId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
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
  })
  startDate: Date;

  @Column(DataType.DATE)
  endDate?: Date;

  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  prescribedBy: string;

  @Column(DataType.STRING)
  prescriptionNumber?: string;

  @Default(0)
  @Column(DataType.INTEGER)
  refillsRemaining?: number;

  @Column(DataType.UUID)
  createdBy?: string;

  @Column(DataType.UUID)
  updatedBy?: string;

  @Column(DataType.DATE)
  declare createdAt: Date;

  @Column(DataType.DATE)
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
