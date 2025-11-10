
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
} from 'sequelize-typescript';
import { ChangeOrderStatus } from '../types/cost.types';

@Table({
  tableName: 'cost_change_orders',
  timestamps: true,
})
export class CostChangeOrder extends Model<CostChangeOrder> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  projectId: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(50))
  changeOrderNumber: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  changeOrderDate: Date;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  requestedBy: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  justification: string;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  costImpact: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  scheduleImpact: number; // in days

  @AllowNull(false)
  @Default(ChangeOrderStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(ChangeOrderStatus)),
  })
  status: ChangeOrderStatus;

  @Column(DataType.STRING(100))
  approvedBy?: string;

  @Column(DataType.DATE)
  approvalDate?: Date;

  @Column(DataType.STRING(100))
  rejectedBy?: string;

  @Column(DataType.TEXT)
  rejectionReason?: string;

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  affectedCostCodes: string[];

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  originalEstimate: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  revisedEstimate: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  actualCost: number;

  @Column(DataType.DATE)
  incorporatedDate?: Date;

  @AllowNull(false)
  @Default({})
  @Column(DataType.JSON)
  metadata: Record<string, any>;
}
