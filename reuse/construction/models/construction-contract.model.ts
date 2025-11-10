
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
  HasMany,
} from 'sequelize-typescript';
import { ContractStatus, ContractType } from '../types/contract.types';
import { PaymentApplication } from './payment-application.model';
import { ContractAmendment } from './contract-amendment.model';
import { ContractMilestone } from './contract-milestone.model';

@Table({
  tableName: 'construction_contracts',
  timestamps: true,
})
export class ConstructionContract extends Model<ConstructionContract> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(50))
  contractNumber: string;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  projectId: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  projectName: string;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  contractorId: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  contractorName: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(ContractType)),
  })
  contractType: ContractType;

  @AllowNull(false)
  @Default(ContractStatus.DRAFT)
  @Column({
    type: DataType.ENUM(...Object.values(ContractStatus)),
  })
  status: ContractStatus;

  @AllowNull(false)
  @Column(DataType.DECIMAL(19, 2))
  contractAmount: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(19, 2))
  originalAmount: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(19, 2))
  currentAmount: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(19, 2))
  totalPaid: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(5, 2))
  retainagePercentage: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(19, 2))
  retainageAmount: number;

  @AllowNull(false)
  @Column(DataType.DATE)
  startDate: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  completionDate: Date;

  @Column(DataType.DATE)
  actualStartDate?: Date;

  @Column(DataType.DATE)
  actualCompletionDate?: Date;

  @Column(DataType.DATE)
  substantialCompletionDate?: Date;

  @Column(DataType.DATE)
  noticeToProceedDate?: Date;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  contractDuration: number; // in days

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  daysExtended: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  scopeOfWork: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  performanceBondRequired: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  paymentBondRequired: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  insuranceRequired: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  prevailingWageRequired: boolean;

  @Column(DataType.DECIMAL(19, 2))
  liquidatedDamagesRate?: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  warrantyPeriod: number; // in months

  @AllowNull(false)
  @Default({})
  @Column(DataType.JSON)
  metadata: Record<string, any>;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  createdBy: string;

  @Column(DataType.STRING(100))
  updatedBy?: string;

  @HasMany(() => PaymentApplication)
  paymentApplications: PaymentApplication[];

  @HasMany(() => ContractAmendment)
  amendments: ContractAmendment[];

  @HasMany(() => ContractMilestone)
  milestones: ContractMilestone[];
}
