
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
import { QualityPlanStatus } from '../types/quality.types';

@Table({
  tableName: 'quality_plans',
  timestamps: true,
  indexes: [
    { fields: ['planNumber'], unique: true },
    { fields: ['projectId'] },
    { fields: ['status'] },
    { fields: ['effectiveDate'] },
    { fields: ['responsiblePerson'] },
  ],
})
export class QualityPlan extends Model {
  @PrimaryKey
  @Default(DataType.INTEGER)
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Index
  @Column(DataType.INTEGER)
  projectId: number;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  projectName: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(50))
  planNumber: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  title: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  scope: string;

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  applicableStandards: string[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  qualityObjectives: string[];

  @AllowNull(false)
  @Default({})
  @Column(DataType.JSON)
  acceptanceCriteria: Record<string, any>;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  inspectionFrequency: string;

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  testingRequirements: string[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  documentationRequirements: string[];

  @AllowNull(false)
  @Column(DataType.STRING(100))
  responsiblePerson: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  contactInfo: string;

  @AllowNull(false)
  @Default(QualityPlanStatus.DRAFT)
  @Column({
    type: DataType.ENUM(...Object.values(QualityPlanStatus)),
  })
  status: QualityPlanStatus;

  @Column(DataType.STRING(100))
  approvedBy?: string;

  @Column(DataType.DATE)
  approvedAt?: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  effectiveDate: Date;

  @Column(DataType.DATE)
  expirationDate?: Date;

  @AllowNull(false)
  @Default(1)
  @Column(DataType.INTEGER)
  version: number;

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
