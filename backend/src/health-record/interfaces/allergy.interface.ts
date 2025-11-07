/**
 * Allergy Interface
 *
 * Comprehensive allergy documentation following clinical standards
 *
 * @interface Allergy
 * @compliance HIPAA, CDC Guidelines
 */

/**
 * Allergy type enumeration
 */
export enum AllergyType {
  FOOD = 'FOOD',
  MEDICATION = 'MEDICATION',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  INSECT = 'INSECT',
  LATEX = 'LATEX',
  OTHER = 'OTHER',
}

/**
 * Allergy severity enumeration
 */
export enum AllergySeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
  LIFE_THREATENING = 'LIFE_THREATENING',
}

export interface Allergy {
  /** Unique identifier */
  id: string;

  /** Student ID this allergy belongs to */
  studentId: string;

  /** Name of the allergen */
  allergen: string;

  /** Type of allergy */
  allergyType: AllergyType;

  /** Severity of the allergic reaction */
  severity: AllergySeverity;

  /** Symptoms experienced */
  symptoms?: string;

  /** Detailed reaction information */
  reactions?: any;

  /** Treatment protocol */
  treatment?: string;

  /** Emergency response protocol */
  emergencyProtocol?: string;

  /** Date when allergy first appeared */
  onsetDate?: Date;

  /** Date when allergy was diagnosed */
  diagnosedDate?: Date;

  /** Healthcare provider who diagnosed */
  diagnosedBy?: string;

  /** Whether allergy has been verified */
  verified: boolean;

  /** Person who verified the allergy */
  verifiedBy?: string;

  /** Date of verification */
  verificationDate?: Date;

  /** Whether allergy is currently active */
  active: boolean;

  /** Additional notes */
  notes?: string;

  /** Whether EpiPen is required */
  epiPenRequired: boolean;

  /** Location of EpiPen if required */
  epiPenLocation?: string;

  /** Expiration date of EpiPen */
  epiPenExpiration?: Date;

  /** Record creation timestamp */
  createdAt?: Date;

  /** Record update timestamp */
  updatedAt?: Date;
}
