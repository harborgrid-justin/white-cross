
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
import { ResourceType } from '../types/schedule.types';

@Table({
  tableName: 'resource_assignments',
  timestamps: true,
  indexes: [
    { fields: ['projectId'] },
    { fields: ['activityId'] },
    { fields: ['resourceId'] },
    { fields: ['resourceType'] },
    { fields: ['isOverallocated'] },
    { fields: ['startDate'] },
    { fields: ['endDate'] },
    { fields: ['projectId', 'resourceId'] },
    { fields: ['activityId', 'resourceId'], unique: true },
  ],
})
export class ResourceAssignment extends Model {
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
  activityId: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  resourceId: string;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  resourceName: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(ResourceType)),
  })
  resourceType: ResourceType;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  unitsRequired: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  unitsAvailable: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(5, 2))
  utilizationPercent: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(10, 2))
  costPerUnit: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  totalCost: number;

  @AllowNull(false)
  @Column(DataType.DATE)
  assignmentDate: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  startDate: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  endDate: Date;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  isOverallocated: boolean;

  @AllowNull(false)
  @Default({})
  @Column(DataType.JSON)
  metadata: Record<string, any>;
}
