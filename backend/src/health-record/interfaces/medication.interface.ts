/**
 * Medication Interface
 *
 * Comprehensive medication catalog following FDA guidelines
 *
 * @interface Medication
 * @compliance FDA, DEA, HIPAA
 */

/**
 * DEA Schedule enumeration for controlled substances
 */
export enum DEASchedule {
  I = 'I',
  II = 'II',
  III = 'III',
  IV = 'IV',
  V = 'V',
}

/**
 * Dosage form enumeration
 */
export enum DosageForm {
  TABLET = 'TABLET',
  CAPSULE = 'CAPSULE',
  LIQUID = 'LIQUID',
  INJECTION = 'INJECTION',
  TOPICAL = 'TOPICAL',
  INHALER = 'INHALER',
  PATCH = 'PATCH',
  SUPPOSITORY = 'SUPPOSITORY',
  OTHER = 'OTHER',
}

export interface Medication {
  /** Unique identifier */
  id: string;

  /** Brand name of the medication */
  name: string;

  /** Generic name of the medication */
  genericName?: string;

  /** Dosage form (tablet, capsule, liquid, etc.) */
  dosageForm: string;

  /** Strength of the medication */
  strength: string;

  /** Manufacturer of the medication */
  manufacturer?: string;

  /** National Drug Code */
  ndc?: string;

  /** Whether medication is controlled substance */
  isControlled: boolean;

  /** DEA schedule if controlled */
  deaSchedule?: 'I' | 'II' | 'III' | 'IV' | 'V';

  /** Whether administration requires a witness */
  requiresWitness: boolean;

  /** Whether medication is active/available */
  isActive: boolean;

  /** Soft delete timestamp */
  deletedAt?: Date;

  /** Person who deleted the record */
  deletedBy?: string;

  /** Record creation timestamp */
  createdAt?: Date;

  /** Record update timestamp */
  updatedAt?: Date;
}
