
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
import { InspectionType } from '../types/safety.types';

@Table({
  tableName: 'safety_inspections',
  timestamps: true,
  indexes: [
    { fields: ['inspectionNumber'], unique: true },
    { fields: ['safetyPlanId'] },
    { fields: ['projectId'] },
    { fields: ['inspectionType'] },
    { fields: ['inspectionDate'] },
    { fields: ['inspector'] },
    { fields: ['followUpRequired'] },
  ],
})
export class SafetyInspection extends Model {
  @PrimaryKey
  @Default(DataType.INTEGER)
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(50))
  inspectionNumber: string;

  @AllowNull(false)
  @Index
  @Column(DataType.INTEGER)
  safetyPlanId: number;

  @AllowNull(false)
  @Index
  @Column(DataType.INTEGER)
  projectId: number;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(InspectionType)),
  })
  inspectionType: InspectionType;

  @AllowNull(false)
  @Column(DataType.DATE)
  inspectionDate: Date;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  inspectionTime: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  inspector: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  inspectorQualification: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  location: string;

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  areasInspected: string[];

  @AllowNull(false)
  @Column(DataType.STRING(255))
  checklistUsed: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  weatherConditions: string;

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  workActivities: string[];

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  safeItems: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  unsafeItems: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  totalItems: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(5, 2))
  complianceRate: number;

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  findings: string[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  violations: Record<string, any>[];

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  hazardsIdentified: number;

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  immediateCorrections: string[];

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  followUpRequired: boolean;

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  followUpItems: string[];

  @AllowNull(false)
  @Default({})
  @Column(DataType.JSON)
  responsiblePersons: Record<string, string>;

  @Column(DataType.DATE)
  nextInspectionDate?: Date;

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  completedDate: Date;

  @Column(DataType.STRING(100))
  reviewedBy?: string;

  @Column(DataType.DATE)
  reviewedDate?: Date;

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
