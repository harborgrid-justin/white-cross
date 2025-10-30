import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
  ForeignKey,
  BelongsTo
  } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';


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

@Table({
  tableName: 'prescriptions',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    {
      fields: ['studentId', 'status']
  },
    {
      fields: ['visitId']
  },
    {
      fields: ['treatmentPlanId']
  },
  ]
  })
export class Prescription extends Model<PrescriptionAttributes> implements PrescriptionAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  @Index
  studentId: string;

  @AllowNull
  @ForeignKey(() => require('./clinic-visit.model').ClinicVisit)
  @Column({
    type: DataType.UUID
  })
  visitId?: string;

  @BelongsTo(() => require('./clinic-visit.model').ClinicVisit, { foreignKey: 'visitId', as: 'visit' })
  declare visit?: any;

  @AllowNull
  @ForeignKey(() => require('./treatment-plan.model').TreatmentPlan)
  @Column({
    type: DataType.UUID
  })
  treatmentPlanId?: string;

  @BelongsTo(() => require('./treatment-plan.model').TreatmentPlan, { foreignKey: 'treatmentPlanId', as: 'treatmentPlan' })
  declare treatmentPlan?: any;

  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  prescribedBy: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  drugName: string;

  @AllowNull
  @Column({
    type: DataType.STRING(100)
  })
  drugCode?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false
  })
  dosage: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false
  })
  frequency: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false
  })
  route: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  quantity: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0
  })
  quantityFilled: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0
  })
  refillsAuthorized: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0
  })
  refillsUsed: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false
  })
  startDate: Date;

  @AllowNull
  @Column({
    type: DataType.DATEONLY
  })
  endDate?: Date;

  @AllowNull
  @Column({
    type: DataType.TEXT
  })
  instructions?: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(PrescriptionStatus)]
    },
    allowNull: false,
    defaultValue: PrescriptionStatus.PENDING
  })
  @Index
  status: PrescriptionStatus;

  @AllowNull
  @Column({
    type: DataType.STRING(255)
  })
  pharmacyName?: string;

  @AllowNull
  @Column({
    type: DataType.DATE
  })
  filledDate?: Date;

  @AllowNull
  @Column({
    type: DataType.DATE
  })
  pickedUpDate?: Date;

  @AllowNull
  @Column({
    type: DataType.TEXT
  })
  notes?: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  /**
   * Check if prescription is currently active
   */
  isActive(): boolean {
    const now = new Date();
    if (this.status === PrescriptionStatus.CANCELLED ||
        this.status === PrescriptionStatus.EXPIRED) {
      return false;
    }
    if (this.endDate && now > this.endDate) {
      return false;
    }
    return this.status === PrescriptionStatus.FILLED ||
           this.status === PrescriptionStatus.PICKED_UP;
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
