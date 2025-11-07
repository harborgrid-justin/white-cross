import {
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Index,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { literal, Op } from 'sequelize';

import { PrescriptionStatus } from '../../clinical/enums/prescription-status.enum';

export interface PrescriptionAttributes {
  id: string;
  studentId: string;
  visitId?: string;
  treatmentPlanId?: string;
  prescribedBy: string;
  drugName: string;
  drugCode?: string;
  dosage: string;
  frequency: string;
  route: string;
  quantity: number;
  quantityFilled: number;
  refillsAuthorized: number;
  refillsUsed: number;
  startDate: Date;
  endDate?: Date;
  instructions?: string;
  status: PrescriptionStatus;
  pharmacyName?: string;
  filledDate?: Date;
  pickedUpDate?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  visit?: any;
  treatmentPlan?: any;
}

@Scopes(() => ({
  active: {
    where: {
      status: {
        [Op.in]: [PrescriptionStatus.FILLED, PrescriptionStatus.PICKED_UP],
      },
      endDate: {
        [Op.or]: [null, { [Op.gte]: new Date() }],
      },
    },
    order: [['startDate', 'DESC']],
  },
  byStudent: (studentId: string) => ({
    where: { studentId },
    order: [['startDate', 'DESC']],
  }),
  byStatus: (status: PrescriptionStatus) => ({
    where: { status },
    order: [['startDate', 'DESC']],
  }),
  pending: {
    where: {
      status: PrescriptionStatus.PENDING,
    },
    order: [['createdAt', 'ASC']],
  },
  needsRefill: {
    where: {
      status: {
        [Op.in]: [PrescriptionStatus.FILLED, PrescriptionStatus.PICKED_UP],
      },
      refillsAuthorized: {
        [Op.gt]: literal('"refillsUsed"'),
      },
    },
  },
  expired: {
    where: {
      [Op.or]: [
        { status: PrescriptionStatus.EXPIRED },
        {
          endDate: {
            [Op.lt]: new Date(),
          },
        },
      ],
    },
  },
}))
@Table({
  tableName: 'prescriptions',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    {
      fields: ['studentId', 'status'],
    },
    {
      fields: ['visitId'],
    },
    {
      fields: ['treatmentPlanId'],
    },
    {
      fields: ['status', 'startDate'],
      name: 'idx_prescriptions_status_start_date',
    },
    {
      fields: ['endDate'],
      name: 'idx_prescriptions_end_date',
    },
    {
      fields: ['createdAt'],
      name: 'idx_prescriptions_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_prescriptions_updated_at',
    },
  ],
})
export class Prescription
  extends Model<PrescriptionAttributes>
  implements PrescriptionAttributes
{
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
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @Index
  studentId: string;

  @AllowNull
  @ForeignKey(() => require('./clinic-visit.model').ClinicVisit)
  @Column({
    type: DataType.UUID,
  })
  visitId?: string;

  @BelongsTo(() => require('./clinic-visit.model').ClinicVisit, {
    foreignKey: 'visitId',
    as: 'visit',
  })
  declare visit?: any;

  @AllowNull
  @ForeignKey(() => require('./treatment-plan.model').TreatmentPlan)
  @Column({
    type: DataType.UUID,
  })
  treatmentPlanId?: string;

  @BelongsTo(() => require('./treatment-plan.model').TreatmentPlan, {
    foreignKey: 'treatmentPlanId',
    as: 'treatmentPlan',
  })
  declare treatmentPlan?: any;

  @BelongsTo(() => require('./student.model').Student, {
    foreignKey: 'studentId',
    as: 'student',
  })
  declare student?: any;

  @ForeignKey(() => require('./user.model').User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  prescribedBy: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  drugName: string;

  @AllowNull
  @Column({
    type: DataType.STRING(100),
    validate: {
      is: {
        args: /^\d{4,5}-\d{4}-\d{1,2}$/,
        msg: 'Drug code must be in NDC format (e.g., 12345-1234-1, 1234-1234-12)',
      },
    },
  })
  drugCode?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  dosage: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  frequency: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  route: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  quantityFilled: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  refillsAuthorized: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  refillsUsed: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  startDate: Date;

  @AllowNull
  @Column({
    type: DataType.DATEONLY,
  })
  endDate?: Date;

  @AllowNull
  @Column({
    type: DataType.TEXT,
  })
  instructions?: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(PrescriptionStatus)],
    },
    allowNull: false,
    defaultValue: PrescriptionStatus.PENDING,
  })
  @Index
  status: PrescriptionStatus;

  @AllowNull
  @Column({
    type: DataType.STRING(255),
  })
  pharmacyName?: string;

  @AllowNull
  @Column({
    type: DataType.DATE,
  })
  filledDate?: Date;

  @AllowNull
  @Column({
    type: DataType.DATE,
  })
  pickedUpDate?: Date;

  @AllowNull
  @Column({
    type: DataType.TEXT,
  })
  notes?: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  @BelongsTo(() => require('./user.model').User, {
    foreignKey: 'prescribedBy',
    as: 'prescriber',
  })
  declare prescriber?: any;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: Prescription) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(
        `[AUDIT] Prescription ${instance.id} modified for student ${instance.studentId} at ${new Date().toISOString()}`,
      );
      console.log(
        `[AUDIT] Changed fields: ${changedFields.join(', ')}, Drug: ${instance.drugName}`,
      );
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static async validateDates(instance: Prescription) {
    if (instance.endDate && instance.endDate < instance.startDate) {
      throw new Error('End date cannot be before start date');
    }
    if (instance.filledDate && instance.filledDate < instance.startDate) {
      throw new Error('Filled date cannot be before start date');
    }
    if (
      instance.pickedUpDate &&
      instance.filledDate &&
      instance.pickedUpDate < instance.filledDate
    ) {
      throw new Error('Picked up date cannot be before filled date');
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static async validateRefills(instance: Prescription) {
    if (instance.refillsUsed > instance.refillsAuthorized) {
      throw new Error('Refills used cannot exceed refills authorized');
    }
    if (instance.quantityFilled > instance.quantity) {
      throw new Error('Quantity filled cannot exceed quantity prescribed');
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static async checkExpiration(instance: Prescription) {
    if (
      instance.endDate &&
      new Date() > instance.endDate &&
      instance.status !== PrescriptionStatus.EXPIRED
    ) {
      instance.status = PrescriptionStatus.EXPIRED;
    }
  }

  /**
   * Check if prescription is currently active
   */
  isActive(): boolean {
    const now = new Date();
    if (
      this.status === PrescriptionStatus.CANCELLED ||
      this.status === PrescriptionStatus.EXPIRED
    ) {
      return false;
    }
    if (this.endDate && now > this.endDate) {
      return false;
    }
    return (
      this.status === PrescriptionStatus.FILLED ||
      this.status === PrescriptionStatus.PICKED_UP
    );
  }

  /**
   * Check if prescription has refills remaining
   */
  hasRefillsRemaining(): boolean {
    return this.refillsUsed < this.refillsAuthorized;
  }

  /**
   * Get remaining refills
   */
  getRemainingRefills(): number {
    return Math.max(0, this.refillsAuthorized - this.refillsUsed);
  }

  /**
   * Calculate days supply (assuming typical prescription)
   */
  getDaysSupply(): number | null {
    if (!this.endDate) return null;
    const diff = this.endDate.getTime() - this.startDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}
