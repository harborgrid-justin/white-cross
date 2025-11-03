/**
 * Vaccination Interface
 *
 * Comprehensive vaccination records following CDC guidelines
 *
 * @interface Vaccination
 * @compliance CDC Immunization Schedules, HIPAA
 */

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
  OTHER = 'OTHER'
}

/**
 * Site of administration enumeration
 */
export enum SiteOfAdministration {
  ARM_LEFT = 'ARM_LEFT',
  ARM_RIGHT = 'ARM_RIGHT',
  THIGH_LEFT = 'THIGH_LEFT',
  THIGH_RIGHT = 'THIGH_RIGHT',
  BUTTOCK_LEFT = 'BUTTOCK_LEFT',
  BUTTOCK_RIGHT = 'BUTTOCK_RIGHT',
  ORAL = 'ORAL',
  NASAL = 'NASAL',
  OTHER = 'OTHER'
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
  OTHER = 'OTHER'
}

/**
 * Compliance status enumeration
 */
export enum ComplianceStatus {
  COMPLIANT = 'COMPLIANT',
  OVERDUE = 'OVERDUE',
  PARTIALLY_COMPLIANT = 'PARTIALLY_COMPLIANT',
  EXEMPT = 'EXEMPT',
  NON_COMPLIANT = 'NON_COMPLIANT'
}

export interface Vaccination {
  /** Unique identifier */
  id: string;

  /** Student ID this vaccination belongs to */
  studentId: string;

  /** Associated health record ID */
  healthRecordId?: string;

  /** Specific vaccine name/brand */
  vaccineName: string;

  /** Type of vaccine administered */
  vaccineType?: VaccineType;

  /** Manufacturer of the vaccine */
  manufacturer?: string;

  /** Lot number of the vaccine */
  lotNumber?: string;

  /** CVX code for vaccine */
  cvxCode?: string;

  /** NDC code for vaccine */
  ndcCode?: string;

  /** Dose number in series */
  doseNumber?: number;

  /** Total doses required for series */
  totalDoses?: number;

  /** Whether vaccination series is complete */
  seriesComplete: boolean;

  /** Date of vaccination */
  administrationDate: Date;

  /** Healthcare provider who administered */
  administeredBy: string;

  /** Provider's role */
  administeredByRole?: string;

  /** Facility where administered */
  facility?: string;

  /** Site where vaccine was administered */
  siteOfAdministration?: SiteOfAdministration;

  /** Route of administration */
  routeOfAdministration?: RouteOfAdministration;

  /** Dosage amount administered */
  dosageAmount?: string;

  /** Vaccine expiration date */
  expirationDate?: Date;

  /** Next dose due date */
  nextDueDate?: Date;

  /** Immediate reactions */
  reactions?: string;

  /** Adverse events data */
  adverseEvents?: Record<string, any>;

  /** Whether student is exempt */
  exemptionStatus: boolean;

  /** Reason for exemption */
  exemptionReason?: string;

  /** Exemption documentation */
  exemptionDocument?: string;

  /** Compliance status */
  complianceStatus: ComplianceStatus;

  /** VFC eligibility status */
  vfcEligibility: boolean;

  /** VIS provided to parent/guardian */
  visProvided: boolean;

  /** Date VIS was provided */
  visDate?: Date;

  /** Consent obtained */
  consentObtained: boolean;

  /** Person who obtained consent */
  consentBy?: string;

  /** Additional notes */
  notes?: string;

  /** Record creator */
  createdBy?: string;

  /** Record updater */
  updatedBy?: string;

  /** Record creation timestamp */
  createdAt?: Date;

  /** Record update timestamp */
  updatedAt?: Date;

  /** Soft delete timestamp */
  deletedAt?: Date;
}