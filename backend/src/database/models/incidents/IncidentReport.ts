import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { IncidentType, IncidentSeverity, InsuranceClaimStatus, ComplianceStatus } from '../../types/enums';
import { AuditableModel } from '../base/AuditableModel';

interface IncidentReportAttributes {
  id: string;
  studentId: string;
  reportedById: string;
  type: IncidentType;
  severity: IncidentSeverity;
  description: string;
  location: string;
  witnesses: string[];
  actionsTaken: string;
  parentNotified: boolean;
  parentNotificationMethod?: string;
  parentNotifiedAt?: Date;
  parentNotifiedBy?: string;
  followUpRequired: boolean;
  followUpNotes?: string;
  attachments: string[];
  evidencePhotos: string[];
  evidenceVideos: string[];
  insuranceClaimNumber?: string;
  insuranceClaimStatus?: InsuranceClaimStatus;
  legalComplianceStatus: ComplianceStatus;
  occurredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface IncidentReportCreationAttributes
  extends Optional<
    IncidentReportAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'parentNotificationMethod'
    | 'parentNotifiedAt'
    | 'parentNotifiedBy'
    | 'followUpNotes'
    | 'attachments'
    | 'witnesses'
    | 'evidencePhotos'
    | 'evidenceVideos'
    | 'insuranceClaimNumber'
    | 'insuranceClaimStatus'
  > {}

export class IncidentReport
  extends Model<IncidentReportAttributes, IncidentReportCreationAttributes>
  implements IncidentReportAttributes
{
  public id!: string;
  public studentId!: string;
  public reportedById!: string;
  public type!: IncidentType;
  public severity!: IncidentSeverity;
  public description!: string;
  public location!: string;
  public witnesses!: string[];
  public actionsTaken!: string;
  public parentNotified!: boolean;
  public parentNotificationMethod?: string;
  public parentNotifiedAt?: Date;
  public parentNotifiedBy?: string;
  public followUpRequired!: boolean;
  public followUpNotes?: string;
  public attachments!: string[];
  public evidencePhotos!: string[];
  public evidenceVideos!: string[];
  public insuranceClaimNumber?: string;
  public insuranceClaimStatus?: InsuranceClaimStatus;
  public legalComplianceStatus!: ComplianceStatus;
  public occurredAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

IncidentReport.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reportedById: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(IncidentType)),
      allowNull: false,
    },
    severity: {
      type: DataTypes.ENUM(...Object.values(IncidentSeverity)),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    witnesses: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    actionsTaken: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    parentNotified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    parentNotificationMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    parentNotifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    parentNotifiedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    followUpRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    followUpNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    attachments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    evidencePhotos: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    evidenceVideos: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    occurredAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    insuranceClaimNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    insuranceClaimStatus: {
      type: DataTypes.ENUM(...Object.values(InsuranceClaimStatus)),
      allowNull: true,
    },
    legalComplianceStatus: {
      type: DataTypes.ENUM(...Object.values(ComplianceStatus)),
      allowNull: false,
      defaultValue: ComplianceStatus.PENDING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'incident_reports',
    timestamps: true,
    indexes: [
      { fields: ['studentId'] },
      { fields: ['reportedById'] },
      { fields: ['type', 'occurredAt'] },
      { fields: ['severity'] },
    ],
  }
);

AuditableModel.setupAuditHooks(IncidentReport, 'IncidentReport');
