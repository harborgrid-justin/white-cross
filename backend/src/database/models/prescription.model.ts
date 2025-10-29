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
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { ClinicVisit } from './clinic-visit.model';
import { TreatmentPlan } from './treatment-plan.model';
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
  visit?: ClinicVisit;
  treatmentPlan?: TreatmentPlan;
}

@Table({
  tableName: 'prescriptions',
  timestamps: true,
  indexes: [
    {
      fields: ['student_id', 'status'],
    },
    {
      fields: ['visit_id'],
    },
    {
      fields: ['treatment_plan_id'],
    },
  ],
})
export class Prescription extends Model<PrescriptionAttributes> implements PrescriptionAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'student_id',
  })
  @Index
  studentId: string;

  @AllowNull
  @ForeignKey(() => ClinicVisit)
  @Column({
    type: DataType.UUID,
    field: 'visit_id',
  })
  visitId?: string;

  @BelongsTo(() => ClinicVisit, { foreignKey: 'visitId', as: 'visit' })
  visit?: ClinicVisit;

  @AllowNull
  @ForeignKey(() => TreatmentPlan)
  @Column({
    type: DataType.UUID,
    field: 'treatment_plan_id',
  })
  treatmentPlanId?: string;

  @BelongsTo(() => TreatmentPlan, { foreignKey: 'treatmentPlanId', as: 'treatmentPlan' })
  treatmentPlan?: TreatmentPlan;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'prescribed_by',
  })
  prescribedBy: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'drug_name',
  })
  drugName: string;

  @AllowNull
  @Column({
    type: DataType.STRING(100),
    field: 'drug_code',
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
    field: 'quantity_filled',
  })
  quantityFilled: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'refills_authorized',
  })
  refillsAuthorized: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'refills_used',
  })
  refillsUsed: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'start_date',
  })
  startDate: Date;

  @AllowNull
  @Column({
    type: DataType.DATEONLY,
    field: 'end_date',
  })
  endDate?: Date;

  @AllowNull
  @Column({
    type: DataType.TEXT,
  })
  instructions?: string;

  @Column({
    type: DataType.ENUM(...(Object.values(PrescriptionStatus) as string[])),
    allowNull: false,
    defaultValue: PrescriptionStatus.PENDING,
  })
  @Index
  status: PrescriptionStatus;

  @AllowNull
  @Column({
    type: DataType.STRING(255),
    field: 'pharmacy_name',
  })
  pharmacyName?: string;

  @AllowNull
  @Column({
    type: DataType.DATE,
    field: 'filled_date',
  })
  filledDate?: Date;

  @AllowNull
  @Column({
    type: DataType.DATE,
    field: 'picked_up_date',
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
