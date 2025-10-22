/**
 * @fileoverview Vaccination Database Model
 * @module database/models/healthcare/Vaccination
 * @description Sequelize model for managing student vaccination records including immunization
 * tracking, compliance status, exemptions, and adverse event reporting.
 *
 * Key Features:
 * - CVX and NDC code support for standardized vaccine identification
 * - Dose series tracking (e.g., 1 of 3)
 * - VIS (Vaccine Information Statement) documentation
 * - Vaccination compliance status monitoring
 * - Medical and religious exemption tracking
 * - Adverse event reporting
 * - VFC (Vaccines for Children) eligibility
 * - Consent documentation
 * - Administration site and route tracking
 * - Next due date calculation
 * - Full audit trail for compliance
 *
 * @compliance HIPAA Privacy Rule §164.308 - Contains Protected Health Information (PHI)
 * @compliance FERPA §99.3 - Educational health records
 * @compliance CDC Immunization Guidelines - Vaccine administration and documentation
 * @compliance State School Immunization Requirements - Varies by jurisdiction
 * @compliance 42 USC §1396s - VFC Program requirements
 * @audit All access and modifications logged per immunization registry requirements
 *
 * @requires sequelize
 * @requires ../../config/sequelize
 * @requires ../../types/enums
 * @requires ../base/AuditableModel
 *
 * LOC: 4F8B6128F9
 * WC-GEN-069
 *
 * UPSTREAM: sequelize.ts, enums.ts, AuditableModel.ts
 * DOWNSTREAM: index.ts, VaccinationRepository.ts
 */

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
 * @interface VaccinationAttributes
 * @description TypeScript interface defining all Vaccination model attributes
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} studentId - Foreign key reference to student, required
 * @property {string} [healthRecordId] - Optional link to related health record (nullable)
 * @property {string} vaccineName - Vaccine name (e.g., "MMR", "DTaP"), required
 * @property {VaccineType} [vaccineType] - Category of vaccine (nullable)
 * @property {string} [manufacturer] - Vaccine manufacturer (e.g., "Pfizer", "Moderna"), nullable
 * @property {string} [lotNumber] - Vaccine lot number for tracking and recalls, nullable
 * @property {string} [cvxCode] - CVX code (CDC vaccine identifier), nullable
 * @property {string} [ndcCode] - NDC code (National Drug Code), nullable
 * @property {number} [doseNumber] - Dose number in series (e.g., 1 of 3), nullable
 * @property {number} [totalDoses] - Total doses in series (nullable)
 * @property {boolean} seriesComplete - Whether vaccination series is complete, defaults to false
 * @property {Date} administrationDate - Date vaccine was administered, required
 * @property {string} administeredBy - Person who administered vaccine, required
 * @property {string} [administeredByRole] - Role of administrator (e.g., "RN", "MD"), nullable
 * @property {string} [facility] - Facility where vaccine was given (nullable)
 * @property {AdministrationSite} [siteOfAdministration] - Body site (e.g., left arm), nullable
 * @property {AdministrationRoute} [routeOfAdministration] - Route (e.g., intramuscular), nullable
 * @property {string} [dosageAmount] - Dosage given (e.g., "0.5mL"), nullable
 * @property {Date} [expirationDate] - Vaccine expiration date, nullable
 * @property {Date} [nextDueDate] - Next dose due date, nullable
 * @property {string} [reactions] - Immediate reactions observed (nullable)
 * @property {any} [adverseEvents] - Structured adverse event data (JSONB), nullable
 * @property {boolean} exemptionStatus - Whether student has exemption, defaults to false
 * @property {string} [exemptionReason] - Reason for exemption (medical/religious), nullable
 * @property {string} [exemptionDocument] - Path to exemption documentation, nullable
 * @property {VaccineComplianceStatus} complianceStatus - Compliance status, defaults to COMPLIANT
 * @property {boolean} vfcEligibility - VFC program eligibility, defaults to false
 * @property {boolean} visProvided - Whether VIS was provided, defaults to false
 * @property {Date} [visDate] - Date VIS was provided to parent/guardian, nullable
 * @property {boolean} consentObtained - Whether consent was obtained, defaults to false
 * @property {string} [consentBy] - Who provided consent (parent/guardian name), nullable
 * @property {string} [notes] - Additional notes or comments (nullable)
 * @property {string} [createdBy] - User ID who created the record (audit field)
 * @property {string} [updatedBy] - User ID who last updated the record (audit field)
 * @property {Date} createdAt - Timestamp of record creation
 * @property {Date} updatedAt - Timestamp of last update
 *
 * @security PHI - Critical for school enrollment and outbreak prevention
 * @safety Adverse events must be reported to VAERS (Vaccine Adverse Event Reporting System)
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

/**
 * @interface VaccinationCreationAttributes
 * @description Attributes required when creating a new Vaccination instance.
 * Extends VaccinationAttributes with optional fields that have defaults or are auto-generated.
 */
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

/**
 * @class Vaccination
 * @extends Model
 * @description Student vaccination tracking model with compliance monitoring and adverse event reporting.
 *
 * @tablename vaccinations
 *
 * Key Features:
 * - Comprehensive vaccine tracking with CVX/NDC codes
 * - Dose series management
 * - Compliance status monitoring for school requirements
 * - Exemption tracking (medical, religious, philosophical)
 * - VIS (Vaccine Information Statement) documentation
 * - Consent tracking
 * - Adverse event reporting (VAERS integration support)
 * - VFC eligibility tracking
 * - Lot number tracking for recalls
 * - Next due date reminders
 * - Full audit trail
 * - Indexed for efficient queries by student, vaccine type, compliance, and due dates
 *
 * Vaccine Types (from VaccineType enum):
 * - DTaP/Tdap: Diphtheria, Tetanus, Pertussis
 * - MMR: Measles, Mumps, Rubella
 * - Varicella: Chickenpox
 * - Polio (IPV)
 * - Hepatitis A & B
 * - HPV: Human Papillomavirus
 * - Meningococcal (MenACWY, MenB)
 * - COVID-19
 * - Influenza
 *
 * Compliance Status (from VaccineComplianceStatus enum):
 * - COMPLIANT: Meets all requirements
 * - OVERDUE: Past due date
 * - EXEMPT: Has valid exemption
 * - NON_COMPLIANT: Does not meet requirements, no exemption
 *
 * Administration Sites (from AdministrationSite enum):
 * - LEFT_ARM, RIGHT_ARM (deltoid muscle)
 * - LEFT_THIGH, RIGHT_THIGH (vastus lateralis)
 * - ORAL, NASAL
 *
 * @security Contains PHI - Critical for outbreak prevention
 * @compliance HIPAA Privacy Rule - 45 CFR §164.308(a)(3)(ii)(A)
 * @compliance CDC Immunization Guidelines - Proper vaccine administration
 * @compliance State School Entry Requirements - Varies by jurisdiction
 * @compliance VFC Program - 42 USC §1396s
 * @safety Adverse events must be reported to VAERS within required timeframes
 *
 * @example
 * // Record MMR vaccine administration
 * const vaccination = await Vaccination.create({
 *   studentId: 'student-uuid',
 *   vaccineName: 'MMR',
 *   vaccineType: VaccineType.MMR,
 *   manufacturer: 'Merck',
 *   lotNumber: 'ABC123',
 *   cvxCode: '03',
 *   doseNumber: 1,
 *   totalDoses: 2,
 *   administrationDate: new Date('2024-01-15'),
 *   administeredBy: 'Jane Smith, RN',
 *   administeredByRole: 'RN',
 *   facility: 'County Health Department',
 *   siteOfAdministration: AdministrationSite.LEFT_ARM,
 *   routeOfAdministration: AdministrationRoute.INTRAMUSCULAR,
 *   dosageAmount: '0.5mL',
 *   nextDueDate: new Date('2028-01-15'),
 *   complianceStatus: VaccineComplianceStatus.COMPLIANT,
 *   visProvided: true,
 *   visDate: new Date('2024-01-15'),
 *   consentObtained: true,
 *   consentBy: 'Mary Johnson (mother)'
 * });
 *
 * @example
 * // Find students with overdue vaccinations
 * const overdue = await Vaccination.findAll({
 *   where: {
 *     complianceStatus: VaccineComplianceStatus.OVERDUE,
 *     nextDueDate: { [Op.lt]: new Date() }
 *   },
 *   include: ['student'],
 *   order: [['nextDueDate', 'ASC']]
 * });
 *
 * @example
 * // Track vaccine lot for recall
 * const lotRecords = await Vaccination.findAll({
 *   where: {
 *     manufacturer: 'Pfizer',
 *     lotNumber: 'RECALLED123'
 *   },
 *   include: ['student']
 * });
 */
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
