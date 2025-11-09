
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({ tableName: 'labor_plans', timestamps: true })
export class LaborPlan extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.UUID, allowNull: false })
  projectId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  planName: string;

  @Column({ type: DataType.DATE, allowNull: false })
  startDate: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  endDate: Date;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  totalLaborHours: number;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  budgetedLaborCost: number;

  @Column({ type: DataType.DECIMAL(12, 2), defaultValue: 0 })
  actualLaborCost: number;

  @Column({ type: DataType.JSON })
  craftMix: Record<string, number>;

  @Column({ type: DataType.JSON })
  skillRequirements: Record<string, any>;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  peakHeadcount: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isPrevailingWage: boolean;

  @Column({ type: DataType.UUID })
  createdBy: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
