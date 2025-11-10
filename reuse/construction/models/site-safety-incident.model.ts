
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
  ForeignKey,
} from 'sequelize-typescript';
import { ConstructionSite } from './construction-site.model';
import { IncidentType, IncidentSeverity, InvestigationStatus } from '../types/site.types';

@Table({
  tableName: 'site_safety_incidents',
  timestamps: true,
  indexes: [
    { fields: ['siteId'] },
    { fields: ['incidentDate'] },
    { fields: ['incidentType'] },
    { fields: ['severity'] },
    { fields: ['investigationStatus'] },
    { fields: ['oshaRecordable'] },
    { fields: ['siteId', 'incidentDate'] },
    { fields: ['siteId', 'incidentType', 'severity'] },
  ],
})
export class SiteSafetyIncident extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => ConstructionSite)
  @AllowNull(false)
  @Column(DataType.UUID)
  siteId: string;

  @AllowNull(false)
  @Column(DataType.DATEONLY)
  incidentDate: Date;

  @AllowNull(false)
  @Column(DataType.TIME)
  incidentTime: string;

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
  @Column(DataType.STRING(200))
  location: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  personnelInvolved: string[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  witnessIds: string[];

  @AllowNull(false)
  @Column(DataType.TEXT)
  immediateAction: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  reportedBy: string;

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  reportedAt: Date;

  @AllowNull(false)
  @Default(InvestigationStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(InvestigationStatus)),
  })
  investigationStatus: InvestigationStatus;

  @Column(DataType.STRING(100))
  investigator?: string;

  @Column(DataType.DATE)
  investigationStartDate?: Date;

  @Column(DataType.DATE)
  investigationCompletedDate?: Date;

  @Column(DataType.TEXT)
  rootCause?: string;

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  contributingFactors: string[];

  @Column(DataType.TEXT)
  correctiveActions?: string;

  @Column(DataType.TEXT)
  preventiveActions?: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  oshaRecordable: boolean;

  @Column(DataType.STRING(50))
  oshaReportNumber?: string;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  lostTimeDays: number;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  medicalTreatmentRequired: boolean;

  @Column(DataType.DECIMAL(15, 2))
  costEstimate?: number;

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  photoUrls: string[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  documentUrls: string[];

  @Column(DataType.DATE)
  closedAt?: Date;

  @Column(DataType.STRING(100))
  closedBy?: string;

  @AllowNull(false)
  @Default({})
  @Column(DataType.JSON)
  metadata: Record<string, any>;
}
