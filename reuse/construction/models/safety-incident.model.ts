
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
import { IncidentType, IncidentSeverity, IncidentStatus } from '../types/safety.types';

@Table({
  tableName: 'safety_incidents',
  timestamps: true,
  indexes: [
    { fields: ['incidentNumber'], unique: true },
    { fields: ['projectId'] },
    { fields: ['safetyPlanId'] },
    { fields: ['incidentType'] },
    { fields: ['severity'] },
    { fields: ['status'] },
    { fields: ['occurredDate'] },
    { fields: ['oshaRecordable'] },
    { fields: ['contractor'] },
  ],
})
export class SafetyIncident extends Model {
  @PrimaryKey
  @Default(DataType.INTEGER)
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(50))
  incidentNumber: string;

  @AllowNull(false)
  @Index
  @Column(DataType.INTEGER)
  projectId: number;

  @Index
  @Column(DataType.INTEGER)
  safetyPlanId?: number;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(IncidentType)),
  })
  incidentType: IncidentType;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(IncidentSeverity)),
  })
  severity: IncidentSeverity;

  @AllowNull(false)
  @Column(DataType.DATE)
  occurredDate: Date;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  occurredTime: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  location: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  injuredPersons: string[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  witnesses: string[];

  @AllowNull(false)
  @Column(DataType.TEXT)
  immediateActions: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  reportedBy: string;

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  reportedDate: Date;

  @Column(DataType.STRING(255))
  contractor?: string;

  @Column(DataType.STRING(100))
  trade?: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  activity: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  oshaRecordable: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  workersCompClaim: boolean;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  lostWorkDays: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  restrictedWorkDays: number;

  @AllowNull(false)
  @Default(IncidentStatus.REPORTED)
  @Column({
    type: DataType.ENUM(...Object.values(IncidentStatus)),
  })
  status: IncidentStatus;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  investigationRequired: boolean;

  @Column(DataType.STRING(50))
  investigationId?: string;

  @Column(DataType.TEXT)
  rootCause?: string;

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  correctiveActions: string[];

  @Column(DataType.STRING(100))
  closedBy?: string;

  @Column(DataType.DATE)
  closedDate?: Date;

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
