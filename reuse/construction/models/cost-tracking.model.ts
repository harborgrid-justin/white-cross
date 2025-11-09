
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
import { CostCategory } from '../types/cost.types';

@Table({
  tableName: 'cost_tracking',
  timestamps: true,
  indexes: [
    { fields: ['projectId'] },
    { fields: ['costCodeId'] },
    { fields: ['category'] },
  ],
})
export class CostTracking extends Model<CostTracking> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  projectId: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  costCodeId: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  costCode: string;

  @AllowNull(false)
  @Column(DataType.STRING(500))
  description: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(CostCategory)),
  })
  category: CostCategory;

  @AllowNull(false)
  @Default('')
  @Column(DataType.STRING(100))
  phase: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  transactionDate: Date;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  budgetedCost: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  originalBudget: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  revisedBudget: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  committedCost: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  actualCost: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  projectedCost: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  costVariance: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(7, 4))
  variancePercent: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  earnedValue: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(5, 2))
  percentComplete: number;

  @AllowNull(false)
  @Default(1)
  @Column(DataType.DECIMAL(7, 4))
  costPerformanceIndex: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  estimateAtCompletion: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  estimateToComplete: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  fiscalPeriod: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  fiscalYear: number;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  lastUpdatedBy: string;

  @AllowNull(false)
  @Default({})
  @Column(DataType.JSON)
  metadata: Record<string, any>;
}
