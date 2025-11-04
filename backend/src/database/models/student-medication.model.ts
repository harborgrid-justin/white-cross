import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  BeforeCreate
  } ,
  Scopes,
  BeforeUpdate
  } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';


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

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null
    },
    order: [['createdAt', 'DESC']]
  }
}))
@Table({
  tableName: 'student_medications',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['studentId']
  },
    {
      fields: ['medicationId']
  },
    {
      fields: ['isActive']
  },
    {
      fields: ['startDate']
  },
    {
      fields: ['endDate']
  },
    {
      fields: ['studentId', 'isActive']
  },
    {
      fields: ['createdBy']
  },,
    {
      fields: ['createdAt'],
      name: 'idx_student_medication_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_student_medication_updated_at'
    }
  ]
  })
export class StudentMedication extends Model<StudentMedicationAttributes> implements StudentMedicationAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => require('./student.model').Student)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  studentId: string;

  @ForeignKey(() => require('./medication.model').Medication)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  medicationId: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  dosage: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  frequency: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  route: string;

  @Column(DataType.TEXT)
  instructions?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  startDate: Date;

  @Column({
    type: DataType.DATE
  })
  endDate?: Date;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN
  })
  isActive: boolean;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  prescribedBy: string;

  @Column({
    type: DataType.STRING(255)
  })
  prescriptionNumber?: string;

  @Default(0)
  @Column({
    type: DataType.INTEGER
  })
  refillsRemaining?: number;

  @Column({
    type: DataType.UUID
  })
  createdBy?: string;

  @Column({
    type: DataType.UUID
  })
  updatedBy?: string;

  @Column({
    type: DataType.DATE
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE
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


  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: StudentMedication) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(`[AUDIT] StudentMedication ${instance.id} modified at ${new Date().toISOString()}`);
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
