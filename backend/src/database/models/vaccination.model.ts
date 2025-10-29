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
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Student } from './student.model';
import { HealthRecord } from './health-record.model';

/**
 * Vaccine type enumeration
 */
export enum VaccineType {
  COVID_19 = 'COVID_19',
  FLU = 'FLU',
  MEASLES = 'MEASLES',
  MUMPS = 'MUMPS',
  RUBELLA = 'RUBELLA',
  MMR = 'MMR',
  POLIO = 'POLIO',
  HEPATITIS_A = 'HEPATITIS_A',
  HEPATITIS_B = 'HEPATITIS_B',
  VARICELLA = 'VARICELLA',
  TETANUS = 'TETANUS',
  DIPHTHERIA = 'DIPHTHERIA',
  PERTUSSIS = 'PERTUSSIS',
  TDAP = 'TDAP',
  DTAP = 'DTAP',
  HIB = 'HIB',
  PNEUMOCOCCAL = 'PNEUMOCOCCAL',
  ROTAVIRUS = 'ROTAVIRUS',
  MENINGOCOCCAL = 'MENINGOCOCCAL',
  HPV = 'HPV',
  OTHER = 'OTHER',
}

/**
 * Site of administration enumeration
 */
export enum SiteOfAdministration {
  ARM_LEFT = 'ARM_LEFT',
  ARM_RIGHT = 'ARM_RIGHT',
  THIGH_LEFT = 'THIGH_LEFT',
  THIGH_RIGHT = 'THIGH_RIGHT',
  DELTOID_LEFT = 'DELTOID_LEFT',
  DELTOID_RIGHT = 'DELTOID_RIGHT',
  BUTTOCK_LEFT = 'BUTTOCK_LEFT',
  BUTTOCK_RIGHT = 'BUTTOCK_RIGHT',
  ORAL = 'ORAL',
  NASAL = 'NASAL',
  OTHER = 'OTHER',
}

/**
 * Route of administration enumeration
 */
export enum RouteOfAdministration {
  INTRAMUSCULAR = 'INTRAMUSCULAR',
  SUBCUTANEOUS = 'SUBCUTANEOUS',
  INTRADERMAL = 'INTRADERMAL',
  ORAL = 'ORAL',
  INTRANASAL = 'INTRANASAL',
  INTRAVENOUS = 'INTRAVENOUS',
  OTHER = 'OTHER',
}

/**
 * Compliance status enumeration
 */
export enum ComplianceStatus {
  COMPLIANT = 'COMPLIANT',
  OVERDUE = 'OVERDUE',
  PARTIALLY_COMPLIANT = 'PARTIALLY_COMPLIANT',
  EXEMPT = 'EXEMPT',
  NON_COMPLIANT = 'NON_COMPLIANT',
}

export interface VaccinationAttributes {
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
  siteOfAdministration?: SiteOfAdministration;
  routeOfAdministration?: RouteOfAdministration;
  dosageAmount?: string;
  expirationDate?: Date;
  nextDueDate?: Date;
  reactions?: string;
  adverseEvents?: Record<string, any>;
  exemptionStatus: boolean;
  exemptionReason?: string;
  exemptionDocument?: string;
  complianceStatus: ComplianceStatus;
  vfcEligibility: boolean;
  visProvided: boolean;
  visDate?: Date;
  consentObtained: boolean;
  consentBy?: string;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  student?: Student;
  healthRecord?: HealthRecord;
}

@Table({
  tableName: 'vaccinations',
  timestamps: true,
  paranoid: true, // Enable soft deletes for immunization records
  indexes: [
    {
      fields: ['student_id', 'administration_date'],
    },
    {
      fields: ['vaccine_type', 'compliance_status'],
    },
    {
      fields: ['next_due_date'],
    },
    {
      fields: ['expiration_date'],
    },
  ],
})
export class Vaccination extends Model<VaccinationAttributes> implements VaccinationAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  /**
   * Student ID (foreign key, required)
   * @PHI - Links to student identity
   */
  @ForeignKey(() => Student)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'student_id',
  })
  @Index
  studentId: string;

  /**
   * Health Record ID (foreign key, optional)
   * Links to specific health event if vaccination was part of clinic visit
   */
  @AllowNull
  @ForeignKey(() => HealthRecord)
  @Column({
    type: DataType.UUID,
    field: 'health_record_id',
  })
  healthRecordId?: string;

  /**
   * Vaccine name (e.g., "Moderna COVID-19 Vaccine", "MMR Vaccine")
   */
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    field: 'vaccine_name',
  })
  vaccineName: string;

  /**
   * Vaccine type classification
   */
  @AllowNull
  @Column({
    type: DataType.ENUM(...(Object.values(VaccineType) as string[])),
    field: 'vaccine_type',
  })
  @Index
  vaccineType?: VaccineType;

  /**
   * Vaccine manufacturer
   */
  @AllowNull
  @Column({
    type: DataType.STRING(100),
    field: 'manufacturer',
  })
  manufacturer?: string;

  /**
   * Vaccine lot number (for recall tracking)
   */
  @AllowNull
  @Column({
    type: DataType.STRING(50),
    field: 'lot_number',
  })
  lotNumber?: string;

  /**
   * CVX code (CDC Vaccine Administered code)
   * Standard coding system for vaccines
   */
  @AllowNull
  @Column({
    type: DataType.STRING(10),
    field: 'cvx_code',
  })
  cvxCode?: string;

  /**
   * NDC code (National Drug Code)
   */
  @AllowNull
  @Column({
    type: DataType.STRING(20),
    field: 'ndc_code',
  })
  ndcCode?: string;

  /**
   * Dose number in series (e.g., 1 for first dose, 2 for second)
   */
  @AllowNull
  @Column({
    type: DataType.INTEGER,
    field: 'dose_number',
  })
  doseNumber?: number;

  /**
   * Total number of doses required in series
   */
  @AllowNull
  @Column({
    type: DataType.INTEGER,
    field: 'total_doses',
  })
  totalDoses?: number;

  /**
   * Whether the vaccination series is complete
   */
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'series_complete',
  })
  seriesComplete: boolean;

  /**
   * Date vaccine was administered
   */
  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'administration_date',
  })
  @Index
  administrationDate: Date;

  /**
   * Name of person who administered vaccine
   */
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    field: 'administered_by',
  })
  administeredBy: string;

  /**
   * Role of person who administered (RN, MD, NP, etc.)
   */
  @AllowNull
  @Column({
    type: DataType.STRING(50),
    field: 'administered_by_role',
  })
  administeredByRole?: string;

  /**
   * Facility where vaccine was administered
   */
  @AllowNull
  @Column({
    type: DataType.STRING(200),
    field: 'facility',
  })
  facility?: string;

  /**
   * Body site where vaccine was administered
   */
  @AllowNull
  @Column({
    type: DataType.ENUM(...(Object.values(SiteOfAdministration) as string[])),
    field: 'site_of_administration',
  })
  siteOfAdministration?: SiteOfAdministration;

  /**
   * Route of administration
   */
  @AllowNull
  @Column({
    type: DataType.ENUM(...(Object.values(RouteOfAdministration) as string[])),
    field: 'route_of_administration',
  })
  routeOfAdministration?: RouteOfAdministration;

  /**
   * Dosage amount (e.g., "0.5 mL")
   */
  @AllowNull
  @Column({
    type: DataType.STRING(50),
    field: 'dosage_amount',
  })
  dosageAmount?: string;

  /**
   * Vaccine expiration date (for expired vaccine tracking)
   */
  @AllowNull
  @Column({
    type: DataType.DATEONLY,
    field: 'expiration_date',
  })
  @Index
  expirationDate?: Date;

  /**
   * Next dose due date (for series completion)
   */
  @AllowNull
  @Column({
    type: DataType.DATEONLY,
    field: 'next_due_date',
  })
  @Index
  nextDueDate?: Date;

  /**
   * Any reactions to the vaccine
   */
  @AllowNull
  @Column({
    type: DataType.TEXT,
    field: 'reactions',
  })
  reactions?: string;

  /**
   * Adverse events (structured data)
   */
  @AllowNull
  @Column({
    type: DataType.JSONB,
    field: 'adverse_events',
  })
  adverseEvents?: Record<string, any>;

  /**
   * Whether student has medical or religious exemption
   */
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'exemption_status',
  })
  exemptionStatus: boolean;

  /**
   * Reason for exemption
   */
  @AllowNull
  @Column({
    type: DataType.TEXT,
    field: 'exemption_reason',
  })
  exemptionReason?: string;

  /**
   * Exemption document URL
   */
  @AllowNull
  @Column({
    type: DataType.STRING(500),
    field: 'exemption_document',
  })
  exemptionDocument?: string;

  /**
   * Compliance status (for school requirements)
   */
  @Column({
    type: DataType.ENUM(...(Object.values(ComplianceStatus) as string[])),
    allowNull: false,
    defaultValue: ComplianceStatus.COMPLIANT,
    field: 'compliance_status',
  })
  @Index
  complianceStatus: ComplianceStatus;

  /**
   * VFC (Vaccines for Children) eligibility
   */
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'vfc_eligibility',
  })
  vfcEligibility: boolean;

  /**
   * Whether VIS (Vaccine Information Statement) was provided
   */
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'vis_provided',
  })
  visProvided: boolean;

  /**
   * Date VIS was provided
   */
  @AllowNull
  @Column({
    type: DataType.DATEONLY,
    field: 'vis_date',
  })
  visDate?: Date;

  /**
   * Whether parental consent was obtained
   */
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'consent_obtained',
  })
  consentObtained: boolean;

  /**
   * Who provided consent (parent/guardian name)
   */
  @AllowNull
  @Column({
    type: DataType.STRING(200),
    field: 'consent_by',
  })
  consentBy?: string;

  /**
   * Additional notes
   */
  @AllowNull
  @Column({
    type: DataType.TEXT,
  })
  notes?: string;

  /**
   * User who created this record
   */
  @AllowNull
  @Column({
    type: DataType.UUID,
    field: 'created_by',
  })
  createdBy?: string;

  /**
   * User who last updated this record
   */
  @AllowNull
  @Column({
    type: DataType.UUID,
    field: 'updated_by',
  })
  updatedBy?: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  @Column(DataType.DATE)
  declare deletedAt?: Date;

  // Relationships
  @BelongsTo(() => Student, { foreignKey: 'studentId', as: 'student' })
  student?: Student;

  @BelongsTo(() => HealthRecord, { foreignKey: 'healthRecordId', as: 'healthRecord' })
  healthRecord?: HealthRecord;

  /**
   * Check if vaccination is overdue (past next due date)
   * @returns true if next dose is overdue
   */
  isOverdue(): boolean {
    if (!this.nextDueDate || this.seriesComplete) {
      return false;
    }
    return new Date() > this.nextDueDate;
  }

  /**
   * Get days until next dose (negative if overdue)
   * @returns days until next dose, null if not applicable
   */
  getDaysUntilNextDose(): number | null {
    if (!this.nextDueDate || this.seriesComplete) {
      return null;
    }
    const diff = this.nextDueDate.getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Get completion percentage of series
   * @returns percentage (0-100), null if series not tracked
   */
  getSeriesCompletionPercentage(): number | null {
    if (!this.totalDoses || !this.doseNumber) {
      return null;
    }
    return Math.round((this.doseNumber / this.totalDoses) * 100);
  }
}
