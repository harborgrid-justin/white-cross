
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { InspectionType, InspectionStatus } from '../types/quality.types';

@Table({
  tableName: 'quality_inspections',
  timestamps: true,
  indexes: [
    { fields: ['inspectionNumber'], unique: true },
    { fields: ['qualityPlanId'] },
    { fields: ['projectId'] },
    { fields: ['inspectionType'] },
    { fields: ['status'] },
    { fields: ['scheduledDate'] },
    { fields: ['inspector'] },
    { fields: ['actualDate'] },
  ],
})
export class QualityInspection extends Model {
  @PrimaryKey
  @Default(DataType.INTEGER)
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Index
  @Column(DataType.INTEGER)
  qualityPlanId: number;

  @AllowNull(false)
  @Index
  @Column(DataType.INTEGER)
  projectId: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(50))
  inspectionNumber: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(InspectionType)),
  })
  inspectionType: InspectionType;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  title: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  location: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  scope: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  scheduledDate: Date;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  scheduledTime: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  inspector: string;

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  participants: string[];

  @Column(DataType.INTEGER)
  checklistId?: number;

  @Column(DataType.DATE)
  actualDate?: Date;

  @Column(DataType.STRING(20))
  actualStartTime?: string;

  @Column(DataType.STRING(20))
  actualEndTime?: string;

  @AllowNull(false)
  @Default(InspectionStatus.SCHEDULED)
  @Column({
    type: DataType.ENUM(...Object.values(InspectionStatus)),
  })
  status: InspectionStatus;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  passedItems: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  failedItems: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  totalItems: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(5, 2))
  passRate: number;

  @Column(DataType.TEXT)
  findings?: string;

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  observations: string[];

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  deficienciesFound: number;

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  recommendations: string[];

  @Column(DataType.DATE)
  nextInspectionDate?: Date;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  requiresFollowUp: boolean;

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  attachments: string[];

  @AllowNull(false)
  @Default({})
  @Column(DataType.JSON)
  metadata: Record<string, any>;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  createdBy: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  updatedBy: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
