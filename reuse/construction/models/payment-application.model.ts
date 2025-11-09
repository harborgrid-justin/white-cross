
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
import { PaymentStatus } from '../types/contract.types';
import { ConstructionContract } from './construction-contract.model';

@Table({
  tableName: 'payment_applications',
  timestamps: true,
})
export class PaymentApplication extends Model<PaymentApplication> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => ConstructionContract)
  @AllowNull(false)
  @Column(DataType.UUID)
  contractId: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  applicationNumber: number;

  @AllowNull(false)
  @Column(DataType.DATE)
  periodStartDate: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  periodEndDate: Date;

  @AllowNull(false)
  @Default(PaymentStatus.DRAFT)
  @Column({
    type: DataType.ENUM(...Object.values(PaymentStatus)),
  })
  status: PaymentStatus;

  @AllowNull(false)
  @Column(DataType.DECIMAL(19, 2))
  scheduledValue: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(19, 2))
  workCompleted: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(19, 2))
  storedMaterials: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(19, 2))
  totalCompleted: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(19, 2))
  previouslyPaid: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(19, 2))
  currentPaymentDue: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(19, 2))
  retainageWithheld: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(19, 2))
  netPayment: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(5, 2))
  percentComplete: number;

  @AllowNull(false)
  @Column(DataType.DATE)
  submittedDate: Date;

  @Column(DataType.DATE)
  reviewedDate?: Date;

  @Column(DataType.DATE)
  approvedDate?: Date;

  @Column(DataType.DATE)
  paidDate?: Date;

  @Column(DataType.STRING(100))
  reviewedBy?: string;

  @Column(DataType.STRING(100))
  approvedBy?: string;

  @Column(DataType.TEXT)
  notes?: string;

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  attachments?: string[];

  @AllowNull(false)
  @Column(DataType.STRING(100))
  createdBy: string;

  @BelongsTo(() => ConstructionContract)
  contract: ConstructionContract;
}
