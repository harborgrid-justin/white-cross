import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import {
  VaccineType,
  AdministrationSite,
  AdministrationRoute,
  VaccineComplianceStatus,
} from '../../types/enums';
import { AuditableModel } from '../base/AuditableModel';

/**
 * Vaccination Model
 * Manages student vaccination records including doses, compliance status, exemptions, and adverse events.
 * This model contains Protected Health Information (PHI) and is subject to HIPAA compliance.
 */

interface VaccinationAttributes {
  id: string;
  studentId: string;
  healthRecordId?: string;
  vaccineName: string;
  vaccineType?: VaccineType;
  manufacturer?: string;
  lotNumber?: string;
  cvxCode?: string;
  ndcCode?: string;
  doseNumber?: number;
  totalDoses?: number;
  seriesComplete: boolean;
  administrationDate: Date;
  administeredBy: string;
  administeredByRole?: string;
  facility?: string;
  siteOfAdministration?: AdministrationSite;
  routeOfAdministration?: AdministrationRoute;
  dosageAmount?: string;
  expirationDate?: Date;
  nextDueDate?: Date;
  reactions?: string;
  adverseEvents?: any;
  exemptionStatus: boolean;
  exemptionReason?: string;
  exemptionDocument?: string;
  complianceStatus: VaccineComplianceStatus;
  vfcEligibility: boolean;
  visProvided: boolean;
  visDate?: Date;
  consentObtained: boolean;
  consentBy?: string;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface VaccinationCreationAttributes
  extends Optional<
    VaccinationAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'healthRecordId'
    | 'vaccineType'
    | 'manufacturer'
    | 'lotNumber'
    | 'cvxCode'
    | 'ndcCode'
    | 'doseNumber'
    | 'totalDoses'
    | 'seriesComplete'
    | 'administeredByRole'
    | 'facility'
    | 'siteOfAdministration'
    | 'routeOfAdministration'
    | 'dosageAmount'
    | 'expirationDate'
    | 'nextDueDate'
    | 'reactions'
    | 'adverseEvents'
    | 'exemptionStatus'
    | 'exemptionReason'
    | 'exemptionDocument'
    | 'complianceStatus'
    | 'vfcEligibility'
    | 'visProvided'
    | 'visDate'
    | 'consentObtained'
    | 'consentBy'
    | 'notes'
    | 'createdBy'
    | 'updatedBy'
  > {}

export class Vaccination
  extends Model<VaccinationAttributes, VaccinationCreationAttributes>
  implements VaccinationAttributes
{
  public id!: string;
  public studentId!: string;
  public healthRecordId?: string;
  public vaccineName!: string;
  public vaccineType?: VaccineType;
  public manufacturer?: string;
  public lotNumber?: string;
  public cvxCode?: string;
  public ndcCode?: string;
  public doseNumber?: number;
  public totalDoses?: number;
  public seriesComplete!: boolean;
  public administrationDate!: Date;
  public administeredBy!: string;
  public administeredByRole?: string;
  public facility?: string;
  public siteOfAdministration?: AdministrationSite;
  public routeOfAdministration?: AdministrationRoute;
  public dosageAmount?: string;
  public expirationDate?: Date;
  public nextDueDate?: Date;
  public reactions?: string;
  public adverseEvents?: any;
  public exemptionStatus!: boolean;
  public exemptionReason?: string;
  public exemptionDocument?: string;
  public complianceStatus!: VaccineComplianceStatus;
  public vfcEligibility!: boolean;
  public visProvided!: boolean;
  public visDate?: Date;
  public consentObtained!: boolean;
  public consentBy?: string;
  public notes?: string;
  public createdBy?: string;
  public updatedBy?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Vaccination.init(
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
    healthRecordId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vaccineName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vaccineType: {
      type: DataTypes.ENUM(...Object.values(VaccineType)),
      allowNull: true,
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lotNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cvxCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ndcCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    doseNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    totalDoses: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    seriesComplete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    administrationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    administeredBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    administeredByRole: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facility: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    siteOfAdministration: {
      type: DataTypes.ENUM(...Object.values(AdministrationSite)),
      allowNull: true,
    },
    routeOfAdministration: {
      type: DataTypes.ENUM(...Object.values(AdministrationRoute)),
      allowNull: true,
    },
    dosageAmount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    nextDueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reactions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    adverseEvents: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    exemptionStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    exemptionReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    exemptionDocument: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    complianceStatus: {
      type: DataTypes.ENUM(...Object.values(VaccineComplianceStatus)),
      allowNull: false,
      defaultValue: VaccineComplianceStatus.COMPLIANT,
    },
    vfcEligibility: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    visProvided: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    visDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    consentObtained: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    consentBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ...AuditableModel.getAuditableFields(),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'vaccinations',
    timestamps: true,
    indexes: [
      { fields: ['studentId', 'administrationDate'] },
      { fields: ['vaccineType', 'complianceStatus'] },
      { fields: ['nextDueDate'] },
      { fields: ['expirationDate'] },
    ],
  }
);

AuditableModel.setupAuditHooks(Vaccination, 'Vaccination');
