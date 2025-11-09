
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Unique,
  Index,
  HasMany,
} from 'sequelize-typescript';
import { ConstructionProjectStatus, ProjectPhase, ProjectPriority, DeliveryMethod } from '../types/project.types';
import { ProjectBaseline } from './project-baseline.model';
import { ChangeOrder } from './change-order.model';

@Table({
  tableName: 'construction_projects',
  timestamps: true,
  indexes: [
    { fields: ['projectNumber'], unique: true },
    { fields: ['status'] },
    { fields: ['currentPhase'] },
    { fields: ['priority'] },
    { fields: ['projectManagerId'] },
    { fields: ['districtCode'] },
  ],
})
export class ConstructionProject extends Model<ConstructionProject> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(50))
  projectNumber: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  projectName: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Default(ConstructionProjectStatus.PRE_PLANNING)
  @Column({
    type: DataType.ENUM(...Object.values(ConstructionProjectStatus)),
  })
  status: ConstructionProjectStatus;

  @AllowNull(false)
  @Default(ProjectPhase.INITIATION)
  @Column({
    type: DataType.ENUM(...Object.values(ProjectPhase)),
  })
  currentPhase: ProjectPhase;

  @AllowNull(false)
  @Default(ProjectPriority.MEDIUM)
  @Column({
    type: DataType.ENUM(...Object.values(ProjectPriority)),
  })
  priority: ProjectPriority;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(DeliveryMethod)),
  })
  deliveryMethod: DeliveryMethod;

  @Index
  @AllowNull(false)
  @Column(DataType.UUID)
  projectManagerId: string;

  @Column(DataType.UUID)
  sponsorId?: string;

  @Column(DataType.UUID)
  contractorId?: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(19, 2))
  totalBudget: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(19, 2))
  committedCost: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(19, 2))
  actualCost: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(19, 2))
  forecastedCost: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(19, 2))
  contingencyReserve: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(19, 2))
  managementReserve: number;

  @Column(DataType.DATE)
  baselineEndDate?: Date;

  @Column(DataType.DATE)
  actualStartDate?: Date;

  @Column(DataType.DATE)
  actualEndDate?: Date;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(5, 2))
  progressPercentage: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(19, 2))
  earnedValue: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(19, 2))
  plannedValue: number;

  @Column(DataType.JSON)
  metadata?: Record<string, any>;

  @AllowNull(false)
  @Column(DataType.STRING)
  createdBy: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  updatedBy: string;

  @HasMany(() => ProjectBaseline)
  baselines: ProjectBaseline[];

  @HasMany(() => ChangeOrder)
  changeOrders: ChangeOrder[];
}
