
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
import { EstimateType } from '../types/cost.types';

@Table({
  tableName: 'cost_estimates',
  timestamps: true,
  indexes: [
    { fields: ['projectId'] },
    { fields: ['estimateNumber'], unique: true },
    { fields: ['estimateType'] },
    { fields: ['status'] },
  ],
})
export class CostEstimate extends Model<CostEstimate> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  projectId: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  estimateNumber: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(EstimateType)),
  })
  estimateType: EstimateType;

  @AllowNull(false)
  @Column(DataType.DATE)
  estimateDate: Date;

  @AllowNull(false)
  @Column(DataType.DECIMAL(15, 2))
  totalEstimatedCost: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  directCosts: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  indirectCosts: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  contingency: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(5, 2))
  contingencyPercent: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  escalation: number;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  estimatedBy: string;

  @AllowNull(false)
  @Default('draft')
  @Column(DataType.ENUM('draft', 'submitted', 'approved', 'baseline', 'superseded'))
  status: 'draft' | 'submitted' | 'approved' | 'baseline' | 'superseded';

  @Column(DataType.DATE)
  baselineDate?: Date;

  @Column(DataType.DECIMAL(15, 2))
  revisedEstimate?: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  revisionNumber: number;

  @Column(DataType.TEXT)
  revisionReason?: string;

  @Column(DataType.STRING(100))
  approvedBy?: string;

  @Column(DataType.DATE)
  approvalDate?: Date;

  @AllowNull(false)
  @Default({})
  @Column(DataType.JSON)
  metadata: Record<string, any>;
}
