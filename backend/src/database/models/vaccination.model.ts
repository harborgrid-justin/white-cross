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
  Scopes,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

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
  student?: any;
  healthRecord?: any;
}

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'vaccinations',
  timestamps: true,
  underscored: false,
  paranoid: true, // Enable soft deletes for immunization records
  indexes: [
    {
      fields: ['studentId', 'administrationDate'],
    },
    {
      fields: ['vaccineType', 'complianceStatus'],
    },
    {
      fields: ['nextDueDate'],
    },
    {
      fields: ['expirationDate'],
    },
    {
      fields: ['createdAt'],
      name: 'idx_vaccination_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_vaccination_updated_at',
    },
  ],
})
export class Vaccination
  extends Model<VaccinationAttributes>
  implements VaccinationAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  /**
   * Student ID (foreign key, required)
   * @PHI - Links to student identity
   */
  @ForeignKey(() => require('./student.model').Student)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @Index
  studentId: string;

  /**
   * Health Record ID (foreign key, optional)
   * Links to specific health event if vaccination was part of clinic visit
   */
  @AllowNull
  @ForeignKey(() => require('./health-record.model').HealthRecord)
  @Column({
    type: DataType.UUID,
  })
  healthRecordId?: string;

  /**
   * Vaccine name (e.g., "Moderna COVID-19 Vaccine", "MMR Vaccine")
   */
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  vaccineName: string;

  /**
   * Vaccine type classification
   */
  @AllowNull
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(VaccineType)],
    },
  })
  @Index
  vaccineType?: VaccineType;

  /**
   * Vaccine manufacturer
   */
  @AllowNull
  @Column({
    type: DataType.STRING(100),
  })
  manufacturer?: string;

  /**
   * Vaccine lot number (for recall tracking)
   */
  @AllowNull
  @Column({
    type: DataType.STRING(50),
  })
  lotNumber?: string;

  /**
   * CVX code (CDC Vaccine Administered code)
   * Standard coding system for vaccines
   */
  @AllowNull
  @Column({
    type: DataType.STRING(10),
  })
  cvxCode?: string;

  /**
   * NDC code (National Drug Code)
   */
  @AllowNull
  @Column({
    type: DataType.STRING(20),
  })
  ndcCode?: string;

  /**
   * Dose number in series (e.g., 1 for first dose, 2 for second)
   */
  @AllowNull
  @Column({
    type: DataType.INTEGER,
  })
  doseNumber?: number;

  /**
   * Total number of doses required in series
   */
  @AllowNull
  @Column({
    type: DataType.INTEGER,
  })
  totalDoses?: number;

  /**
   * Whether the vaccination series is complete
   */
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  seriesComplete: boolean;

  /**
   * Date vaccine was administered
   */
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @Index
  administrationDate: Date;

  /**
   * Name of person who administered vaccine
   */
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  administeredBy: string;

  /**
   * Role of person who administered (RN, MD, NP, etc.)
   */
  @AllowNull
  @Column({
    type: DataType.STRING(50),
  })
  administeredByRole?: string;

  /**
   * Facility where vaccine was administered
   */
  @AllowNull
  @Column({
    type: DataType.STRING(200),
  })
  facility?: string;

  /**
   * Body site where vaccine was administered
   */
  @AllowNull
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(SiteOfAdministration)],
    },
  })
  siteOfAdministration?: SiteOfAdministration;

  /**
   * Route of administration
   */
  @AllowNull
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(RouteOfAdministration)],
    },
  })
  routeOfAdministration?: RouteOfAdministration;

  /**
   * Dosage amount (e.g., "0.5 mL")
   */
  @AllowNull
  @Column({
    type: DataType.STRING(50),
  })
  dosageAmount?: string;

  /**
   * Vaccine expiration date (for expired vaccine tracking)
   */
  @AllowNull
  @Column({
    type: DataType.DATEONLY,
  })
  @Index
  expirationDate?: Date;

  /**
   * Next dose due date (for series completion)
   */
  @AllowNull
  @Column({
    type: DataType.DATEONLY,
  })
  @Index
  nextDueDate?: Date;

  /**
   * Any reactions to the vaccine
   */
  @AllowNull
  @Column({
    type: DataType.TEXT,
  })
  reactions?: string;

  /**
   * Adverse events (structured data)
   */
  @AllowNull
  @Column({
    type: DataType.JSONB,
  })
  adverseEvents?: Record<string, any>;

  /**
   * Whether student has medical or religious exemption
   */
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  exemptionStatus: boolean;

  /**
   * Reason for exemption
   */
  @AllowNull
  @Column({
    type: DataType.TEXT,
  })
  exemptionReason?: string;

  /**
   * Exemption document URL
   */
  @AllowNull
  @Column({
    type: DataType.STRING(500),
  })
  exemptionDocument?: string;

  /**
   * Compliance status (for school requirements)
   */
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ComplianceStatus)],
    },
    allowNull: false,
    defaultValue: ComplianceStatus.COMPLIANT,
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
  })
  vfcEligibility: boolean;

  /**
   * Whether VIS (Vaccine Information Statement) was provided
   */
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  visProvided: boolean;

  /**
   * Date VIS was provided
   */
  @AllowNull
  @Column({
    type: DataType.DATEONLY,
  })
  visDate?: Date;

  /**
   * Whether parental consent was obtained
   */
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  consentObtained: boolean;

  /**
   * Who provided consent (parent/guardian name)
   */
  @AllowNull
  @Column({
    type: DataType.STRING(200),
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
  })
  createdBy?: string;

  /**
   * User who last updated this record
   */
  @AllowNull
  @Column({
    type: DataType.UUID,
  })
  updatedBy?: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  @Column(DataType.DATE)
  declare deletedAt?: Date;

  // Relationships
  @BelongsTo(() => require('./student.model').Student, {
    foreignKey: 'studentId',
    as: 'student',
  })
  student?: any;

  @BelongsTo(() => require('./health-record.model').HealthRecord, {
    foreignKey: 'healthRecordId',
    as: 'healthRecord',
  })
  healthRecord?: any;

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

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: Vaccination) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(
        `[AUDIT] Vaccination ${instance.id} modified at ${new Date().toISOString()}`,
      );
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
