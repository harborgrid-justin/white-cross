
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
import { SafetyPlanStatus } from '../types/safety.types';

@Table({
  tableName: 'safety_plans',
  timestamps: true,
  indexes: [
    { fields: ['planNumber'], unique: true },
    { fields: ['projectId'] },
    { fields: ['status'] },
    { fields: ['effectiveDate'] },
    { fields: ['safetyOfficer'] },
  ],
})
export class SafetyPlan extends Model {
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
  applicableRegulations: string[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  safetyObjectives: string[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  emergencyContacts: Record<string, any>[];

  @AllowNull(false)
  @Column(DataType.TEXT)
  evacuationProcedures: string;

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  ppeRequirements: string[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  hazardMitigationStrategies: string[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  trainingRequirements: string[];

  @AllowNull(false)
  @Column(DataType.STRING(255))
  inspectionSchedule: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  safetyOfficer: string;

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  competentPersons: string[];

  @AllowNull(false)
  @Default(SafetyPlanStatus.DRAFT)
  @Column({
    type: DataType.ENUM(...Object.values(SafetyPlanStatus)),
  })
  status: SafetyPlanStatus;

  @Column(DataType.STRING(100))
  approvedBy?: string;

  @Column(DataType.DATE)
  approvedAt?: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  effectiveDate: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  reviewDate: Date;

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
