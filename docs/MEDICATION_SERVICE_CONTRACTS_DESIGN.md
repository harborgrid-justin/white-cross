# Medication/Prescription Management Module - TypeScript Service Contracts Design

## Executive Summary

This document provides a comprehensive enterprise-grade TypeScript service contract design for the medication/prescription management module following Service-Oriented Architecture (SOA) best practices. The design addresses critical deficiencies in the current implementation, including proper domain separation, type safety for controlled substances, and compile-time enforcement of the Five Rights of Medication Administration.

**Critical Healthcare Context**: This module handles controlled substances and life-critical medications. Type safety is not just good engineering practice—it prevents medication errors that could be fatal.

---

## Current Implementation Analysis

### Identified Issues

1. **Domain Mixing**: Single `MedicationService` class mixes:
   - Medication formulary management
   - Student prescriptions
   - Administration logging
   - Inventory tracking
   - Adverse reaction reporting

2. **Weak Type Safety**:
   - Primitive string types for IDs (no branded types)
   - No type-level validation of medication dosages
   - Frequency parsing happens at runtime only
   - Missing types for controlled substance tracking
   - No compile-time Five Rights validation

3. **DTO/Domain Confusion**:
   - No clear separation between domain models and DTOs
   - Create interfaces mix validation concerns with domain logic
   - API contracts lack versioning support

4. **Missing Critical Types**:
   - DEA schedule classification
   - Medication interactions/contraindications
   - Dosage calculation with units
   - Administration window validation
   - Controlled substance chain of custody

5. **Service Architecture**:
   - Static class methods (not dependency-injectable)
   - No repository pattern abstraction
   - Missing service interfaces
   - No clear service boundaries

---

## Domain-Driven Design Architecture

### Bounded Contexts

```
┌─────────────────────────────────────────────────────────────┐
│              MEDICATION MANAGEMENT DOMAIN                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐│
│  │   Formulary     │  │  Prescription   │  │ Controlled   ││
│  │   Subdomain     │  │   Subdomain     │  │ Substance    ││
│  │                 │  │                 │  │  Subdomain   ││
│  │ - Medications   │  │ - Student Meds  │  │              ││
│  │ - Generics      │  │ - Dosing        │  │ - DEA Track  ││
│  │ - Interactions  │  │ - Schedules     │  │ - Custody    ││
│  └─────────────────┘  └─────────────────┘  └──────────────┘│
│                                                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐│
│  │ Administration  │  │   Inventory     │  │   Adverse    ││
│  │   Subdomain     │  │   Subdomain     │  │  Reaction    ││
│  │                 │  │                 │  │  Subdomain   ││
│  │ - Five Rights   │  │ - Stock Mgmt    │  │              ││
│  │ - MAR Logging   │  │ - Expiration    │  │ - Reporting  ││
│  │ - Timing        │  │ - Reorder       │  │ - Severity   ││
│  └─────────────────┘  └─────────────────┘  └──────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Core Type System Design

### 1. Branded Types (Type-Safe IDs)

```typescript
/**
 * Branded types prevent ID mixing at compile-time
 * Example: Cannot pass MedicationId where PrescriptionId is expected
 */

// Brand utility type
declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };
type Branded<T, B> = T & Brand<B>;

// Medication Domain IDs
export type MedicationId = Branded<string, 'MedicationId'>;
export type PrescriptionId = Branded<string, 'PrescriptionId'>;
export type InventoryId = Branded<string, 'InventoryId'>;
export type AdministrationLogId = Branded<string, 'AdministrationLogId'>;
export type AdverseReactionId = Branded<string, 'AdverseReactionId'>;
export type BatchNumber = Branded<string, 'BatchNumber'>;
export type NDC = Branded<string, 'NDC'>; // National Drug Code

// Student/User IDs
export type StudentId = Branded<string, 'StudentId'>;
export type UserId = Branded<string, 'UserId'>;

// Brand constructor functions
export const MedicationId = {
  create: (id: string): MedicationId => id as MedicationId,
  unwrap: (id: MedicationId): string => id as string,
  validate: (id: string): id is MedicationId => /^[a-z0-9]{25}$/.test(id),
};

export const PrescriptionId = {
  create: (id: string): PrescriptionId => id as PrescriptionId,
  unwrap: (id: PrescriptionId): string => id as string,
  validate: (id: string): id is PrescriptionId => /^[a-z0-9]{25}$/.test(id),
};

// ... similar for other branded types
```

### 2. Unit Types for Dosage Safety

```typescript
/**
 * Type-safe units prevent dosage calculation errors
 * Example: Cannot add milligrams to milliliters
 */

// Base unit system
export enum MedicationUnit {
  // Mass
  MILLIGRAM = 'mg',
  GRAM = 'g',
  MICROGRAM = 'mcg',

  // Volume
  MILLILITER = 'mL',
  LITER = 'L',

  // International Units
  UNIT = 'unit',
  INTERNATIONAL_UNIT = 'IU',

  // Dosage Forms
  TABLET = 'tablet',
  CAPSULE = 'capsule',
  SPRAY = 'spray',
  PUFF = 'puff',
  DROP = 'drop',
  PATCH = 'patch',
}

// Unit category for type safety
export enum UnitCategory {
  MASS = 'MASS',
  VOLUME = 'VOLUME',
  DOSAGE_FORM = 'DOSAGE_FORM',
  INTERNATIONAL = 'INTERNATIONAL',
}

// Type-safe quantity with unit
export interface Quantity<U extends MedicationUnit = MedicationUnit> {
  readonly value: number;
  readonly unit: U;
  readonly category: UnitCategory;
}

// Dosage type with range support
export interface Dosage {
  readonly min: Quantity;
  readonly max?: Quantity; // For range dosing (e.g., 5-10mg)
  readonly route: RouteOfAdministration;
}

// Type-safe dosage calculation
export class DosageCalculator {
  /**
   * Add quantities (enforces same unit category)
   */
  static add<U extends MedicationUnit>(
    a: Quantity<U>,
    b: Quantity<U>
  ): Quantity<U> {
    if (a.category !== b.category) {
      throw new TypeError('Cannot add quantities of different categories');
    }

    // Convert to base unit, add, convert back
    const baseValue = this.toBaseUnit(a.value, a.unit) + this.toBaseUnit(b.value, b.unit);
    return {
      value: this.fromBaseUnit(baseValue, a.unit),
      unit: a.unit,
      category: a.category,
    };
  }

  /**
   * Validate dosage is within safe range
   */
  static validateDosage(
    given: Quantity,
    prescribed: Dosage
  ): DosageValidationResult {
    // Implementation validates Five Rights - Right Dose
    const givenInBase = this.toBaseUnit(given.value, given.unit);
    const minInBase = this.toBaseUnit(prescribed.min.value, prescribed.min.unit);
    const maxInBase = prescribed.max
      ? this.toBaseUnit(prescribed.max.value, prescribed.max.unit)
      : minInBase;

    if (givenInBase < minInBase || givenInBase > maxInBase) {
      return {
        valid: false,
        error: {
          code: 'DOSAGE_OUT_OF_RANGE',
          message: `Dosage ${given.value}${given.unit} is outside prescribed range`,
          severity: 'CRITICAL',
        },
      };
    }

    return { valid: true };
  }

  private static toBaseUnit(value: number, unit: MedicationUnit): number {
    // Conversion logic
    switch (unit) {
      case MedicationUnit.MILLIGRAM: return value;
      case MedicationUnit.GRAM: return value * 1000;
      case MedicationUnit.MICROGRAM: return value / 1000;
      // ... other conversions
      default: return value;
    }
  }

  private static fromBaseUnit(value: number, unit: MedicationUnit): number {
    // Inverse conversion
    switch (unit) {
      case MedicationUnit.MILLIGRAM: return value;
      case MedicationUnit.GRAM: return value / 1000;
      case MedicationUnit.MICROGRAM: return value * 1000;
      default: return value;
    }
  }
}

export interface DosageValidationResult {
  valid: boolean;
  error?: MedicationError;
}
```

### 3. Controlled Substance Types

```typescript
/**
 * DEA Schedule classification for controlled substances
 */
export enum DEASchedule {
  SCHEDULE_I = 'I',     // No accepted medical use (not in school setting)
  SCHEDULE_II = 'II',   // High potential for abuse (ADHD meds, opioids)
  SCHEDULE_III = 'III', // Moderate to low potential
  SCHEDULE_IV = 'IV',   // Low potential (anxiety meds)
  SCHEDULE_V = 'V',     // Lower potential (cough preparations)
  NON_CONTROLLED = 'NON_CONTROLLED',
}

/**
 * Controlled substance metadata
 */
export interface ControlledSubstanceInfo {
  readonly isControlled: true;
  readonly schedule: Exclude<DEASchedule, DEASchedule.NON_CONTROLLED>;
  readonly requiresDoubleCount: boolean; // Schedule II requires two nurses
  readonly requiresWitnessSignature: boolean;
  readonly disposalRequirements: DisposalRequirement;
  readonly reportingRequirements: ReportingRequirement;
}

export interface NonControlledSubstanceInfo {
  readonly isControlled: false;
  readonly schedule: DEASchedule.NON_CONTROLLED;
}

export type SubstanceControlInfo =
  | ControlledSubstanceInfo
  | NonControlledSubstanceInfo;

/**
 * Chain of custody for controlled substances
 */
export interface ChainOfCustodyEntry {
  readonly id: string;
  readonly inventoryId: InventoryId;
  readonly action: CustodyAction;
  readonly performedBy: UserId;
  readonly witnessedBy?: UserId; // Required for Schedule II
  readonly timestamp: Date;
  readonly quantityBefore: Quantity;
  readonly quantityAfter: Quantity;
  readonly reason: string;
  readonly signature: DigitalSignature;
  readonly witnessSignature?: DigitalSignature;
}

export enum CustodyAction {
  RECEIVED = 'RECEIVED',
  DISPENSED = 'DISPENSED',
  ADMINISTERED = 'ADMINISTERED',
  WASTED = 'WASTED',
  RETURNED = 'RETURNED',
  TRANSFERRED = 'TRANSFERRED',
  DISPOSED = 'DISPOSED',
  COUNTED = 'COUNTED',
}

export interface DigitalSignature {
  readonly signerId: UserId;
  readonly signedAt: Date;
  readonly ipAddress: string;
  readonly hash: string; // SHA-256 hash of signed data
}
```

### 4. Medication Frequency Types

```typescript
/**
 * Structured medication frequency (not just strings)
 */

// Standard medical abbreviations
export enum MedicationFrequency {
  // Daily frequencies
  QD = 'QD',           // Once daily
  BID = 'BID',         // Twice daily
  TID = 'TID',         // Three times daily
  QID = 'QID',         // Four times daily

  // Hourly intervals
  Q4H = 'Q4H',         // Every 4 hours
  Q6H = 'Q6H',         // Every 6 hours
  Q8H = 'Q8H',         // Every 8 hours
  Q12H = 'Q12H',       // Every 12 hours

  // As needed
  PRN = 'PRN',         // As needed

  // Special timing
  AC = 'AC',           // Before meals
  PC = 'PC',           // After meals
  HS = 'HS',           // At bedtime
  QAM = 'QAM',         // Every morning
  QPM = 'QPM',         // Every evening

  // Custom interval
  CUSTOM = 'CUSTOM',
}

/**
 * Detailed frequency specification
 */
export interface FrequencySchedule {
  readonly frequency: MedicationFrequency;
  readonly timesPerDay?: number; // For custom frequencies
  readonly specificTimes?: ReadonlyArray<TimeOfDay>; // Exact administration times
  readonly interval?: Duration; // For custom intervals
  readonly maxDosesPerDay?: number; // Important for PRN
  readonly administrationWindow?: AdministrationWindow; // Allowable time range
}

export interface TimeOfDay {
  readonly hour: number; // 0-23
  readonly minute: number; // 0-59
}

export interface Duration {
  readonly value: number;
  readonly unit: 'hours' | 'minutes' | 'days';
}

export interface AdministrationWindow {
  readonly beforeMinutes: number; // How early can be given
  readonly afterMinutes: number;  // How late can be given
}

/**
 * Parse frequency string to structured format
 */
export class FrequencyParser {
  static parse(input: string): FrequencySchedule {
    const normalized = input.toLowerCase().trim();

    // Pattern matching for standard frequencies
    if (normalized.includes('once') || normalized === 'daily' || normalized === 'qd') {
      return {
        frequency: MedicationFrequency.QD,
        timesPerDay: 1,
        specificTimes: [{ hour: 9, minute: 0 }],
        administrationWindow: { beforeMinutes: 60, afterMinutes: 60 },
      };
    }

    if (normalized.includes('twice') || normalized.includes('bid')) {
      return {
        frequency: MedicationFrequency.BID,
        timesPerDay: 2,
        specificTimes: [
          { hour: 9, minute: 0 },
          { hour: 21, minute: 0 },
        ],
        administrationWindow: { beforeMinutes: 60, afterMinutes: 60 },
      };
    }

    // ... additional parsing logic

    throw new Error(`Unable to parse frequency: ${input}`);
  }

  /**
   * Generate next administration times
   */
  static getNextAdministrationTimes(
    schedule: FrequencySchedule,
    after: Date = new Date(),
    count: number = 24
  ): ReadonlyArray<Date> {
    // Implementation generates upcoming administration times
    // considering schedule, windows, and constraints
    return [];
  }
}
```

### 5. Five Rights Validation Types

```typescript
/**
 * The Five Rights of Medication Administration
 * Type-safe validation at compile-time where possible
 */

export interface FiveRightsValidation {
  readonly rightPatient: PatientValidation;
  readonly rightMedication: MedicationValidation;
  readonly rightDose: DoseValidation;
  readonly rightRoute: RouteValidation;
  readonly rightTime: TimeValidation;
}

export interface PatientValidation {
  readonly verified: boolean;
  readonly studentId: StudentId;
  readonly prescriptionId: PrescriptionId;
  readonly verificationMethod: 'PHOTO_ID' | 'BARCODE' | 'NAME_DOB' | 'MANUAL';
  readonly verifiedBy: UserId;
  readonly verifiedAt: Date;
}

export interface MedicationValidation {
  readonly verified: boolean;
  readonly medicationId: MedicationId;
  readonly ndc?: NDC;
  readonly batchNumber?: BatchNumber;
  readonly expirationDate: Date;
  readonly isExpired: boolean;
}

export interface DoseValidation {
  readonly verified: boolean;
  readonly prescribedDose: Dosage;
  readonly administeredDose: Quantity;
  readonly isWithinRange: boolean;
  readonly calculatedBy?: UserId; // Required for weight-based dosing
  readonly doubleCheckedBy?: UserId; // Required for high-risk medications
}

export interface RouteValidation {
  readonly verified: boolean;
  readonly prescribedRoute: RouteOfAdministration;
  readonly administeredRoute: RouteOfAdministration;
  readonly matches: boolean;
}

export interface TimeValidation {
  readonly verified: boolean;
  readonly scheduledTime: Date;
  readonly administeredTime: Date;
  readonly isWithinWindow: boolean;
  readonly window: AdministrationWindow;
  readonly reason?: string; // If outside window
}

export enum RouteOfAdministration {
  ORAL = 'ORAL',
  SUBLINGUAL = 'SUBLINGUAL',
  BUCCAL = 'BUCCAL',
  TOPICAL = 'TOPICAL',
  TRANSDERMAL = 'TRANSDERMAL',
  INHALATION = 'INHALATION',
  NASAL = 'NASAL',
  OPHTHALMIC = 'OPHTHALMIC',
  OTIC = 'OTIC',
  RECTAL = 'RECTAL',
  SUBCUTANEOUS = 'SUBCUTANEOUS',
  INTRAMUSCULAR = 'INTRAMUSCULAR',
  INTRAVENOUS = 'INTRAVENOUS', // Unlikely in school setting
}

/**
 * Compile-time Five Rights validator builder
 */
export class FiveRightsValidator {
  private constructor(
    private readonly prescription: Prescription,
    private readonly student: Student,
  ) {}

  static forPrescription(prescription: Prescription, student: Student) {
    return new FiveRightsValidator(prescription, student);
  }

  /**
   * Validate all five rights
   * Returns typed error if any validation fails
   */
  async validate(
    administration: AdministrationAttempt
  ): Promise<Result<FiveRightsValidation, MedicationError>> {
    const validations = await Promise.all([
      this.validatePatient(administration),
      this.validateMedication(administration),
      this.validateDose(administration),
      this.validateRoute(administration),
      this.validateTime(administration),
    ]);

    const errors = validations.filter(v => !v.success);

    if (errors.length > 0) {
      return {
        success: false,
        error: {
          code: 'FIVE_RIGHTS_VIOLATION',
          message: 'One or more Five Rights validations failed',
          severity: 'CRITICAL',
          details: errors,
        },
      };
    }

    return {
      success: true,
      data: {
        rightPatient: validations[0].data,
        rightMedication: validations[1].data,
        rightDose: validations[2].data,
        rightRoute: validations[3].data,
        rightTime: validations[4].data,
      },
    };
  }

  private async validatePatient(
    attempt: AdministrationAttempt
  ): Promise<Result<PatientValidation, MedicationError>> {
    // Implementation
    return { success: true, data: {} as PatientValidation };
  }

  // ... other validation methods
}

/**
 * Result type for safe error handling
 */
export type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };
```

---

## Domain Models

### Formulary Domain

```typescript
/**
 * Medication in the system formulary
 * Represents the "platonic ideal" of a medication, not a specific student's prescription
 */
export interface Medication {
  readonly id: MedicationId;
  readonly name: string;
  readonly genericName?: string;
  readonly brandNames: ReadonlyArray<string>;

  // Classification
  readonly ndc?: NDC;
  readonly therapeuticClass: TherapeuticClass;
  readonly substanceControl: SubstanceControlInfo;

  // Physical properties
  readonly dosageForm: DosageForm;
  readonly strength: Quantity;
  readonly color?: string;
  readonly shape?: string;
  readonly imprint?: string; // Tablet imprint for identification

  // Clinical information
  readonly indications: ReadonlyArray<string>;
  readonly contraindications: ReadonlyArray<Contraindication>;
  readonly interactions: ReadonlyArray<DrugInteraction>;
  readonly sideEffects: ReadonlyArray<SideEffect>;
  readonly blackBoxWarnings: ReadonlyArray<string>;

  // Administration
  readonly availableRoutes: ReadonlyArray<RouteOfAdministration>;
  readonly standardDosing: ReadonlyArray<StandardDose>;

  // Metadata
  readonly manufacturer?: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly version: number; // For optimistic locking
}

export enum DosageForm {
  TABLET = 'TABLET',
  CAPSULE = 'CAPSULE',
  LIQUID_ORAL = 'LIQUID_ORAL',
  SUSPENSION = 'SUSPENSION',
  SYRUP = 'SYRUP',
  INJECTABLE = 'INJECTABLE',
  INHALER_MDI = 'INHALER_MDI',
  INHALER_DPI = 'INHALER_DPI',
  NEBULIZER_SOLUTION = 'NEBULIZER_SOLUTION',
  CREAM = 'CREAM',
  OINTMENT = 'OINTMENT',
  LOTION = 'LOTION',
  PATCH = 'PATCH',
  SPRAY_NASAL = 'SPRAY_NASAL',
  DROPS_OPHTHALMIC = 'DROPS_OPHTHALMIC',
  DROPS_OTIC = 'DROPS_OTIC',
}

export enum TherapeuticClass {
  ANALGESIC = 'ANALGESIC',
  ANTIBIOTIC = 'ANTIBIOTIC',
  ANTIHISTAMINE = 'ANTIHISTAMINE',
  BRONCHODILATOR = 'BRONCHODILATOR',
  STIMULANT = 'STIMULANT', // ADHD medications
  ANTIEPILEPTIC = 'ANTIEPILEPTIC',
  INSULIN = 'INSULIN',
  ANTIDIABETIC = 'ANTIDIABETIC',
  ANTIANXIETY = 'ANTIANXIETY',
  ANTIDEPRESSANT = 'ANTIDEPRESSANT',
  EMERGENCY_MEDICATION = 'EMERGENCY_MEDICATION', // Epinephrine, albuterol
  // ... additional classes
}

export interface Contraindication {
  readonly condition: string;
  readonly severity: 'ABSOLUTE' | 'RELATIVE';
  readonly reason: string;
}

export interface DrugInteraction {
  readonly interactingMedicationId?: MedicationId;
  readonly interactingSubstance: string;
  readonly severity: 'MINOR' | 'MODERATE' | 'MAJOR' | 'CONTRAINDICATED';
  readonly effect: string;
  readonly management: string;
}

export interface SideEffect {
  readonly effect: string;
  readonly frequency: 'COMMON' | 'UNCOMMON' | 'RARE';
  readonly severity: 'MILD' | 'MODERATE' | 'SEVERE';
}

export interface StandardDose {
  readonly indication: string;
  readonly ageRange?: AgeRange;
  readonly weightRange?: WeightRange;
  readonly dose: Dosage;
  readonly frequency: FrequencySchedule;
  readonly maxDailyDose?: Quantity;
  readonly notes?: string;
}

export interface AgeRange {
  readonly minYears?: number;
  readonly maxYears?: number;
}

export interface WeightRange {
  readonly min: Quantity<MedicationUnit.GRAM>;
  readonly max: Quantity<MedicationUnit.GRAM>;
}
```

### Prescription Domain

```typescript
/**
 * Student-specific medication prescription
 * Represents an order for a specific student to receive a medication
 */
export interface Prescription {
  readonly id: PrescriptionId;
  readonly studentId: StudentId;
  readonly medicationId: MedicationId;

  // Prescription details
  readonly prescribedBy: Prescriber;
  readonly prescribedDate: Date;
  readonly startDate: Date;
  readonly endDate?: Date;
  readonly isActive: boolean;

  // Dosing instructions
  readonly dosage: Dosage;
  readonly frequency: FrequencySchedule;
  readonly route: RouteOfAdministration;
  readonly instructions: string;
  readonly indicationForUse?: string;

  // Special considerations
  readonly isPRN: boolean; // As needed
  readonly maxDosesPerDay?: number;
  readonly requiresNotification: boolean; // Notify parent after admin
  readonly requiresMonitoring: boolean; // Vital signs, etc.
  readonly monitoringInstructions?: string;

  // Documentation
  readonly prescriptionImageUrl?: string;
  readonly parentConsentUrl?: string;
  readonly physicianOrderUrl?: string;

  // Metadata
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly createdBy: UserId;
  readonly lastModifiedBy: UserId;
  readonly version: number;
}

export interface Prescriber {
  readonly name: string;
  readonly credentials: string; // MD, DO, NP, PA
  readonly licenseNumber?: string;
  readonly deaNumber?: string; // Required for controlled substances
  readonly phone: string;
  readonly fax?: string;
}

/**
 * Medication administration record (MAR) entry
 */
export interface AdministrationLog {
  readonly id: AdministrationLogId;
  readonly prescriptionId: PrescriptionId;
  readonly studentId: StudentId;
  readonly medicationId: MedicationId;

  // Five Rights validation
  readonly fiveRights: FiveRightsValidation;

  // Administration details
  readonly administeredBy: UserId;
  readonly witnessedBy?: UserId; // For controlled substances
  readonly administeredAt: Date;
  readonly dosageGiven: Quantity;
  readonly route: RouteOfAdministration;
  readonly batchNumber?: BatchNumber;
  readonly expirationDate?: Date;

  // Outcome
  readonly status: AdministrationStatus;
  readonly refusalReason?: string;
  readonly notes?: string;
  readonly sideEffectsObserved?: ReadonlyArray<string>;

  // Monitoring
  readonly vitalSignsBefore?: VitalSigns;
  readonly vitalSignsAfter?: VitalSigns;

  // Audit trail
  readonly createdAt: Date;
  readonly ipAddress: string;
  readonly signature: DigitalSignature;
  readonly witnessSignature?: DigitalSignature;
}

export enum AdministrationStatus {
  ADMINISTERED = 'ADMINISTERED',
  REFUSED = 'REFUSED',
  MISSED = 'MISSED',
  HELD = 'HELD', // Nurse decision to hold dose
  UNAVAILABLE = 'UNAVAILABLE', // Student not present
  PARENT_ADMINISTERED = 'PARENT_ADMINISTERED', // Student took at home
}

export interface VitalSigns {
  readonly bloodPressureSystolic?: number;
  readonly bloodPressureDiastolic?: number;
  readonly heartRate?: number;
  readonly respiratoryRate?: number;
  readonly temperature?: number;
  readonly oxygenSaturation?: number;
  readonly painLevel?: number; // 0-10 scale
  readonly bloodGlucose?: number; // For diabetic medications
}

/**
 * Attempt to administer medication (before validation)
 */
export interface AdministrationAttempt {
  readonly prescriptionId: PrescriptionId;
  readonly studentId: StudentId;
  readonly administeredBy: UserId;
  readonly administeredAt: Date;
  readonly dosageGiven: Quantity;
  readonly route: RouteOfAdministration;
  readonly batchNumber?: BatchNumber;
  readonly notes?: string;
}
```

### Inventory Domain

```typescript
/**
 * Physical medication inventory
 */
export interface MedicationInventory {
  readonly id: InventoryId;
  readonly medicationId: MedicationId;

  // Batch information
  readonly batchNumber: BatchNumber;
  readonly expirationDate: Date;
  readonly manufacturer: string;
  readonly ndc?: NDC;

  // Quantity tracking
  readonly initialQuantity: Quantity;
  readonly currentQuantity: Quantity;
  readonly reorderLevel: Quantity;
  readonly reorderQuantity: Quantity;

  // Cost tracking
  readonly costPerUnit?: number;
  readonly totalCost?: number;
  readonly supplier?: string;
  readonly purchaseOrderNumber?: string;

  // Storage
  readonly location: StorageLocation;
  readonly storageRequirements?: StorageRequirements;

  // Status
  readonly status: InventoryStatus;
  readonly alerts: ReadonlyArray<InventoryAlert>;

  // Controlled substance tracking
  readonly controlledSubstanceLog?: ReadonlyArray<ChainOfCustodyEntry>;

  // Metadata
  readonly receivedDate: Date;
  readonly receivedBy: UserId;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export enum InventoryStatus {
  AVAILABLE = 'AVAILABLE',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  EXPIRED = 'EXPIRED',
  EXPIRING_SOON = 'EXPIRING_SOON',
  RECALLED = 'RECALLED',
  QUARANTINED = 'QUARANTINED', // Quality issue
}

export interface StorageLocation {
  readonly building?: string;
  readonly room: string;
  readonly cabinet?: string;
  readonly shelf?: string;
  readonly requiresLock: boolean; // Controlled substances
  readonly requiresRefrigeration: boolean;
}

export interface StorageRequirements {
  readonly temperatureMin?: number; // Celsius
  readonly temperatureMax?: number;
  readonly humidityMax?: number;
  readonly lightSensitive: boolean;
  readonly specialInstructions?: string;
}

export interface InventoryAlert {
  readonly type: InventoryAlertType;
  readonly severity: 'INFO' | 'WARNING' | 'CRITICAL';
  readonly message: string;
  readonly triggeredAt: Date;
  readonly acknowledgedBy?: UserId;
  readonly acknowledgedAt?: Date;
}

export enum InventoryAlertType {
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  EXPIRING_WITHIN_30_DAYS = 'EXPIRING_WITHIN_30_DAYS',
  EXPIRING_WITHIN_7_DAYS = 'EXPIRING_WITHIN_7_DAYS',
  EXPIRED = 'EXPIRED',
  RECALL = 'RECALL',
  TEMPERATURE_EXCURSION = 'TEMPERATURE_EXCURSION',
  COUNT_DISCREPANCY = 'COUNT_DISCREPANCY', // For controlled substances
}

/**
 * Inventory transaction for audit trail
 */
export interface InventoryTransaction {
  readonly id: string;
  readonly inventoryId: InventoryId;
  readonly type: InventoryTransactionType;
  readonly quantity: Quantity;
  readonly performedBy: UserId;
  readonly performedAt: Date;
  readonly reason?: string;
  readonly referenceId?: string; // Link to administration log, etc.
  readonly quantityBefore: Quantity;
  readonly quantityAfter: Quantity;
}

export enum InventoryTransactionType {
  RECEIVED = 'RECEIVED',
  DISPENSED = 'DISPENSED',
  ADMINISTERED = 'ADMINISTERED',
  WASTED = 'WASTED',
  EXPIRED_DISPOSAL = 'EXPIRED_DISPOSAL',
  RETURNED_TO_PHARMACY = 'RETURNED_TO_PHARMACY',
  TRANSFERRED = 'TRANSFERRED',
  ADJUSTMENT = 'ADJUSTMENT',
  PHYSICAL_COUNT = 'PHYSICAL_COUNT',
}
```

### Adverse Reaction Domain

```typescript
/**
 * Adverse medication reaction report
 */
export interface AdverseReaction {
  readonly id: AdverseReactionId;
  readonly prescriptionId: PrescriptionId;
  readonly studentId: StudentId;
  readonly medicationId: MedicationId;

  // Reaction details
  readonly severity: ReactionSeverity;
  readonly reactionType: ReactionType;
  readonly symptoms: ReadonlyArray<string>;
  readonly onset: Date;
  readonly duration?: Duration;
  readonly resolved: boolean;
  readonly resolvedAt?: Date;

  // Response
  readonly actionsTaken: ReadonlyArray<string>;
  readonly treatmentProvided?: string;
  readonly hospitalTransport: boolean;
  readonly emergencyServicesContacted: boolean;

  // Reporting
  readonly reportedBy: UserId;
  readonly reportedAt: Date;
  readonly parentNotified: boolean;
  readonly parentNotifiedAt?: Date;
  readonly physicianNotified: boolean;
  readonly physicianNotifiedAt?: Date;

  // FDA reporting (for serious reactions)
  readonly fdaReportRequired: boolean;
  readonly fdaReportNumber?: string;
  readonly fdaReportedAt?: Date;

  // Documentation
  readonly notes: string;
  readonly attachments: ReadonlyArray<string>;

  // Follow-up
  readonly followUpRequired: boolean;
  readonly followUpNotes?: string;
  readonly followUpCompletedAt?: Date;

  // Metadata
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export enum ReactionSeverity {
  MILD = 'MILD',           // Minimal discomfort, no intervention needed
  MODERATE = 'MODERATE',   // Intervention needed, not life-threatening
  SEVERE = 'SEVERE',       // Medically significant, may require hospitalization
  LIFE_THREATENING = 'LIFE_THREATENING', // Immediate intervention required
}

export enum ReactionType {
  ALLERGIC = 'ALLERGIC',
  SIDE_EFFECT = 'SIDE_EFFECT',
  OVERDOSE = 'OVERDOSE',
  INTERACTION = 'INTERACTION',
  IDIOSYNCRATIC = 'IDIOSYNCRATIC', // Unexpected reaction
  UNKNOWN = 'UNKNOWN',
}
```

---

## Data Transfer Objects (DTOs)

### Request DTOs

```typescript
/**
 * Create medication in formulary
 */
export interface CreateMedicationDTO {
  readonly name: string;
  readonly genericName?: string;
  readonly brandNames?: ReadonlyArray<string>;
  readonly ndc?: string;
  readonly therapeuticClass: TherapeuticClass;
  readonly dosageForm: DosageForm;
  readonly strength: {
    readonly value: number;
    readonly unit: MedicationUnit;
  };
  readonly isControlled: boolean;
  readonly deaSchedule?: DEASchedule;
  readonly manufacturer?: string;
  readonly indications?: ReadonlyArray<string>;
}

/**
 * Create student prescription
 */
export interface CreatePrescriptionDTO {
  readonly studentId: string;
  readonly medicationId: string;

  // Prescriber
  readonly prescriberName: string;
  readonly prescriberCredentials: string;
  readonly prescriberLicense?: string;
  readonly prescriberDEA?: string;
  readonly prescriberPhone: string;

  // Prescription details
  readonly prescribedDate: string; // ISO 8601
  readonly startDate: string;
  readonly endDate?: string;

  // Dosing
  readonly dosageValue: number;
  readonly dosageUnit: MedicationUnit;
  readonly dosageMaxValue?: number; // For range dosing
  readonly frequency: MedicationFrequency;
  readonly customFrequency?: string;
  readonly route: RouteOfAdministration;
  readonly instructions: string;

  // Flags
  readonly isPRN: boolean;
  readonly maxDosesPerDay?: number;
  readonly requiresNotification: boolean;

  // Documentation
  readonly prescriptionImage?: File;
  readonly parentConsent?: File;
}

/**
 * Log medication administration
 */
export interface LogAdministrationDTO {
  readonly prescriptionId: string;
  readonly studentId: string;
  readonly administeredAt: string; // ISO 8601
  readonly dosageValue: number;
  readonly dosageUnit: MedicationUnit;
  readonly route: RouteOfAdministration;
  readonly batchNumber?: string;

  // Five Rights validation data
  readonly patientVerificationMethod: 'PHOTO_ID' | 'BARCODE' | 'NAME_DOB' | 'MANUAL';
  readonly witnessId?: string; // For controlled substances

  // Optional
  readonly status?: AdministrationStatus;
  readonly refusalReason?: string;
  readonly notes?: string;
  readonly vitalSigns?: {
    readonly bloodPressure?: string; // "120/80"
    readonly heartRate?: number;
    readonly temperature?: number;
    readonly bloodGlucose?: number;
  };
}

/**
 * Report adverse reaction
 */
export interface ReportAdverseReactionDTO {
  readonly prescriptionId: string;
  readonly studentId: string;
  readonly medicationId: string;
  readonly severity: ReactionSeverity;
  readonly reactionType: ReactionType;
  readonly symptoms: ReadonlyArray<string>;
  readonly onsetTime: string; // ISO 8601
  readonly actionsTaken: ReadonlyArray<string>;
  readonly hospitalTransport: boolean;
  readonly emergencyServicesContacted: boolean;
  readonly notes: string;
}

/**
 * Add medication to inventory
 */
export interface AddInventoryDTO {
  readonly medicationId: string;
  readonly batchNumber: string;
  readonly expirationDate: string; // ISO 8601
  readonly quantity: number;
  readonly unit: MedicationUnit;
  readonly reorderLevel?: number;
  readonly costPerUnit?: number;
  readonly supplier?: string;
  readonly location: {
    readonly room: string;
    readonly cabinet?: string;
    readonly requiresLock: boolean;
  };
}
```

### Response DTOs

```typescript
/**
 * Medication response
 */
export interface MedicationResponseDTO {
  readonly id: string;
  readonly name: string;
  readonly genericName?: string;
  readonly strength: string; // Formatted: "500mg"
  readonly form: DosageForm;
  readonly isControlled: boolean;
  readonly schedule?: DEASchedule;
  readonly activePresriptionCount: number;
  readonly inventoryCount: number;
  readonly createdAt: string; // ISO 8601
}

/**
 * Prescription response
 */
export interface PrescriptionResponseDTO {
  readonly id: string;
  readonly student: {
    readonly id: string;
    readonly name: string;
    readonly photo?: string;
  };
  readonly medication: {
    readonly id: string;
    readonly name: string;
    readonly strength: string;
    readonly form: DosageForm;
  };
  readonly dosage: string; // Formatted: "500mg"
  readonly frequency: string; // Human-readable
  readonly route: RouteOfAdministration;
  readonly instructions: string;
  readonly isPRN: boolean;
  readonly isActive: boolean;
  readonly startDate: string;
  readonly endDate?: string;
  readonly prescriber: {
    readonly name: string;
    readonly phone: string;
  };
  readonly nextScheduledDose?: string; // ISO 8601
}

/**
 * Administration log response
 */
export interface AdministrationLogResponseDTO {
  readonly id: string;
  readonly student: {
    readonly id: string;
    readonly name: string;
  };
  readonly medication: {
    readonly id: string;
    readonly name: string;
  };
  readonly dosageGiven: string;
  readonly route: RouteOfAdministration;
  readonly administeredBy: {
    readonly id: string;
    readonly name: string;
  };
  readonly administeredAt: string; // ISO 8601
  readonly status: AdministrationStatus;
  readonly notes?: string;
  readonly fiveRightsVerified: boolean;
}

/**
 * Inventory response
 */
export interface InventoryResponseDTO {
  readonly id: string;
  readonly medication: {
    readonly id: string;
    readonly name: string;
    readonly strength: string;
  };
  readonly batchNumber: string;
  readonly expirationDate: string;
  readonly currentQuantity: string; // Formatted with unit
  readonly reorderLevel: string;
  readonly status: InventoryStatus;
  readonly alerts: ReadonlyArray<{
    readonly type: InventoryAlertType;
    readonly severity: string;
    readonly message: string;
  }>;
  readonly location: string; // Formatted location
  readonly daysUntilExpiration: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponseDTO<T> {
  readonly data: ReadonlyArray<T>;
  readonly pagination: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly totalPages: number;
  };
}
```

---

## Service Interfaces

### Repository Pattern Interfaces

```typescript
/**
 * Base repository interface
 */
export interface IRepository<TEntity, TId> {
  findById(id: TId): Promise<TEntity | null>;
  findAll(options?: QueryOptions): Promise<ReadonlyArray<TEntity>>;
  create(entity: TEntity): Promise<TEntity>;
  update(id: TId, entity: Partial<TEntity>): Promise<TEntity>;
  delete(id: TId): Promise<boolean>;
}

export interface QueryOptions {
  readonly skip?: number;
  readonly take?: number;
  readonly orderBy?: string;
  readonly orderDirection?: 'asc' | 'desc';
}

/**
 * Medication formulary repository
 */
export interface IMedicationRepository extends IRepository<Medication, MedicationId> {
  findByNDC(ndc: NDC): Promise<Medication | null>;
  findByTherapeuticClass(
    therapeuticClass: TherapeuticClass
  ): Promise<ReadonlyArray<Medication>>;
  findControlledSubstances(
    schedule?: DEASchedule
  ): Promise<ReadonlyArray<Medication>>;
  search(query: string): Promise<ReadonlyArray<Medication>>;
  checkInteractions(
    medicationIds: ReadonlyArray<MedicationId>
  ): Promise<ReadonlyArray<DrugInteraction>>;
}

/**
 * Prescription repository
 */
export interface IPrescriptionRepository extends IRepository<Prescription, PrescriptionId> {
  findByStudent(
    studentId: StudentId,
    activeOnly?: boolean
  ): Promise<ReadonlyArray<Prescription>>;
  findByMedication(
    medicationId: MedicationId
  ): Promise<ReadonlyArray<Prescription>>;
  findExpiring(
    daysAhead: number
  ): Promise<ReadonlyArray<Prescription>>;
  findDueForAdministration(
    date: Date,
    window: AdministrationWindow
  ): Promise<ReadonlyArray<Prescription>>;
  deactivate(id: PrescriptionId, reason: string): Promise<Prescription>;
}

/**
 * Administration log repository
 */
export interface IAdministrationLogRepository extends IRepository<AdministrationLog, AdministrationLogId> {
  findByPrescription(
    prescriptionId: PrescriptionId
  ): Promise<ReadonlyArray<AdministrationLog>>;
  findByStudent(
    studentId: StudentId,
    startDate?: Date,
    endDate?: Date
  ): Promise<ReadonlyArray<AdministrationLog>>;
  findByNurse(
    nurseId: UserId,
    startDate?: Date,
    endDate?: Date
  ): Promise<ReadonlyArray<AdministrationLog>>;
  findMissedDoses(
    date: Date
  ): Promise<ReadonlyArray<MissedDose>>;
}

export interface MissedDose {
  readonly prescription: Prescription;
  readonly scheduledTime: Date;
  readonly student: Student;
}

/**
 * Inventory repository
 */
export interface IInventoryRepository extends IRepository<MedicationInventory, InventoryId> {
  findByMedication(
    medicationId: MedicationId
  ): Promise<ReadonlyArray<MedicationInventory>>;
  findLowStock(): Promise<ReadonlyArray<MedicationInventory>>;
  findExpiring(daysAhead: number): Promise<ReadonlyArray<MedicationInventory>>;
  findExpired(): Promise<ReadonlyArray<MedicationInventory>>;
  findByBatch(batchNumber: BatchNumber): Promise<MedicationInventory | null>;
  recordTransaction(transaction: InventoryTransaction): Promise<void>;
  getChainOfCustody(inventoryId: InventoryId): Promise<ReadonlyArray<ChainOfCustodyEntry>>;
}

/**
 * Adverse reaction repository
 */
export interface IAdverseReactionRepository extends IRepository<AdverseReaction, AdverseReactionId> {
  findByStudent(studentId: StudentId): Promise<ReadonlyArray<AdverseReaction>>;
  findByMedication(medicationId: MedicationId): Promise<ReadonlyArray<AdverseReaction>>;
  findBySeverity(severity: ReactionSeverity): Promise<ReadonlyArray<AdverseReaction>>;
  findRequiringFollowUp(): Promise<ReadonlyArray<AdverseReaction>>;
  findRequiringFDAReport(): Promise<ReadonlyArray<AdverseReaction>>;
}
```

### Service Interfaces

```typescript
/**
 * Medication formulary service
 */
export interface IMedicationFormularyService {
  /**
   * Add medication to formulary
   */
  addMedication(dto: CreateMedicationDTO): Promise<Result<Medication, MedicationError>>;

  /**
   * Update medication information
   */
  updateMedication(
    id: MedicationId,
    updates: Partial<Medication>
  ): Promise<Result<Medication, MedicationError>>;

  /**
   * Get medication by ID
   */
  getMedication(id: MedicationId): Promise<Result<Medication, MedicationError>>;

  /**
   * Search medications
   */
  searchMedications(
    query: string,
    filters?: MedicationSearchFilters
  ): Promise<Result<ReadonlyArray<Medication>, MedicationError>>;

  /**
   * Check for drug interactions
   */
  checkInteractions(
    medicationIds: ReadonlyArray<MedicationId>
  ): Promise<Result<InteractionCheckResult, MedicationError>>;

  /**
   * Get controlled substances
   */
  getControlledSubstances(
    schedule?: DEASchedule
  ): Promise<Result<ReadonlyArray<Medication>, MedicationError>>;
}

export interface MedicationSearchFilters {
  readonly therapeuticClass?: TherapeuticClass;
  readonly dosageForm?: DosageForm;
  readonly isControlled?: boolean;
  readonly isActive?: boolean;
}

export interface InteractionCheckResult {
  readonly hasInteractions: boolean;
  readonly interactions: ReadonlyArray<DrugInteraction>;
  readonly severity: 'NONE' | 'MINOR' | 'MODERATE' | 'MAJOR' | 'CONTRAINDICATED';
}

/**
 * Prescription management service
 */
export interface IPrescriptionService {
  /**
   * Create new prescription for student
   */
  createPrescription(
    dto: CreatePrescriptionDTO
  ): Promise<Result<Prescription, MedicationError>>;

  /**
   * Update prescription
   */
  updatePrescription(
    id: PrescriptionId,
    updates: Partial<Prescription>
  ): Promise<Result<Prescription, MedicationError>>;

  /**
   * Deactivate prescription
   */
  deactivatePrescription(
    id: PrescriptionId,
    reason: string
  ): Promise<Result<Prescription, MedicationError>>;

  /**
   * Get student prescriptions
   */
  getStudentPrescriptions(
    studentId: StudentId,
    activeOnly?: boolean
  ): Promise<Result<ReadonlyArray<Prescription>, MedicationError>>;

  /**
   * Get prescription details
   */
  getPrescription(
    id: PrescriptionId
  ): Promise<Result<Prescription, MedicationError>>;

  /**
   * Check for contraindications
   */
  checkContraindications(
    studentId: StudentId,
    medicationId: MedicationId
  ): Promise<Result<ContraindicationCheckResult, MedicationError>>;

  /**
   * Get due administrations
   */
  getDueAdministrations(
    date: Date,
    nurseId?: UserId
  ): Promise<Result<ReadonlyArray<DueAdministration>, MedicationError>>;
}

export interface ContraindicationCheckResult {
  readonly hasContraindications: boolean;
  readonly contraindications: ReadonlyArray<Contraindication>;
  readonly allergyConflicts: ReadonlyArray<string>;
  readonly drugInteractions: ReadonlyArray<DrugInteraction>;
  readonly canProceed: boolean;
  readonly warnings: ReadonlyArray<string>;
}

export interface DueAdministration {
  readonly prescription: Prescription;
  readonly student: Student;
  readonly scheduledTime: Date;
  readonly window: AdministrationWindow;
  readonly isOverdue: boolean;
  readonly lastAdministered?: Date;
}

/**
 * Medication administration service
 */
export interface IMedicationAdministrationService {
  /**
   * Administer medication (with Five Rights validation)
   */
  administerMedication(
    dto: LogAdministrationDTO
  ): Promise<Result<AdministrationLog, MedicationError>>;

  /**
   * Validate Five Rights before administration
   */
  validateFiveRights(
    attempt: AdministrationAttempt
  ): Promise<Result<FiveRightsValidation, MedicationError>>;

  /**
   * Record missed dose
   */
  recordMissedDose(
    prescriptionId: PrescriptionId,
    scheduledTime: Date,
    reason: string
  ): Promise<Result<AdministrationLog, MedicationError>>;

  /**
   * Record refused dose
   */
  recordRefusal(
    prescriptionId: PrescriptionId,
    reason: string
  ): Promise<Result<AdministrationLog, MedicationError>>;

  /**
   * Get administration history
   */
  getAdministrationHistory(
    studentId: StudentId,
    startDate?: Date,
    endDate?: Date
  ): Promise<Result<ReadonlyArray<AdministrationLog>, MedicationError>>;

  /**
   * Get MAR (Medication Administration Record) for student
   */
  getMedicationAdministrationRecord(
    studentId: StudentId,
    month: number,
    year: number
  ): Promise<Result<MedicationAdministrationRecord, MedicationError>>;
}

export interface MedicationAdministrationRecord {
  readonly student: Student;
  readonly month: number;
  readonly year: number;
  readonly prescriptions: ReadonlyArray<Prescription>;
  readonly administrations: ReadonlyArray<AdministrationLog>;
  readonly schedule: ReadonlyArray<ScheduledAdministration>;
  readonly statistics: MARStatistics;
}

export interface ScheduledAdministration {
  readonly date: Date;
  readonly prescriptions: ReadonlyArray<{
    readonly prescription: Prescription;
    readonly scheduledTimes: ReadonlyArray<Date>;
  }>;
}

export interface MARStatistics {
  readonly totalScheduled: number;
  readonly totalAdministered: number;
  readonly totalMissed: number;
  readonly totalRefused: number;
  readonly complianceRate: number; // Percentage
}

/**
 * Inventory management service
 */
export interface IInventoryManagementService {
  /**
   * Add medication to inventory
   */
  addInventory(
    dto: AddInventoryDTO
  ): Promise<Result<MedicationInventory, MedicationError>>;

  /**
   * Dispense medication from inventory
   */
  dispenseMedication(
    inventoryId: InventoryId,
    quantity: Quantity,
    prescriptionId: PrescriptionId,
    dispensedBy: UserId
  ): Promise<Result<InventoryTransaction, MedicationError>>;

  /**
   * Adjust inventory quantity
   */
  adjustInventory(
    inventoryId: InventoryId,
    newQuantity: Quantity,
    reason: string,
    performedBy: UserId
  ): Promise<Result<MedicationInventory, MedicationError>>;

  /**
   * Dispose expired medication
   */
  disposeExpired(
    inventoryId: InventoryId,
    disposedBy: UserId,
    witnessedBy?: UserId
  ): Promise<Result<InventoryTransaction, MedicationError>>;

  /**
   * Get inventory status
   */
  getInventoryStatus(
    medicationId?: MedicationId
  ): Promise<Result<ReadonlyArray<MedicationInventory>, MedicationError>>;

  /**
   * Get inventory alerts
   */
  getInventoryAlerts(): Promise<Result<InventoryAlerts, MedicationError>>;

  /**
   * Perform physical count (for controlled substances)
   */
  performPhysicalCount(
    inventoryId: InventoryId,
    actualQuantity: Quantity,
    countedBy: UserId,
    witnessedBy?: UserId
  ): Promise<Result<PhysicalCountResult, MedicationError>>;
}

export interface InventoryAlerts {
  readonly lowStock: ReadonlyArray<MedicationInventory>;
  readonly outOfStock: ReadonlyArray<MedicationInventory>;
  readonly expiringSoon: ReadonlyArray<MedicationInventory>;
  readonly expired: ReadonlyArray<MedicationInventory>;
  readonly countDiscrepancies: ReadonlyArray<CountDiscrepancy>;
}

export interface CountDiscrepancy {
  readonly inventory: MedicationInventory;
  readonly expectedQuantity: Quantity;
  readonly actualQuantity: Quantity;
  readonly discrepancy: Quantity;
  readonly discoveredAt: Date;
  readonly discoveredBy: UserId;
}

export interface PhysicalCountResult {
  readonly inventory: MedicationInventory;
  readonly expectedQuantity: Quantity;
  readonly actualQuantity: Quantity;
  readonly discrepancy?: Quantity;
  readonly transaction: InventoryTransaction;
  readonly requiresInvestigation: boolean;
}

/**
 * Adverse reaction service
 */
export interface IAdverseReactionService {
  /**
   * Report adverse reaction
   */
  reportReaction(
    dto: ReportAdverseReactionDTO
  ): Promise<Result<AdverseReaction, MedicationError>>;

  /**
   * Update adverse reaction report
   */
  updateReaction(
    id: AdverseReactionId,
    updates: Partial<AdverseReaction>
  ): Promise<Result<AdverseReaction, MedicationError>>;

  /**
   * Get student's adverse reactions
   */
  getStudentReactions(
    studentId: StudentId
  ): Promise<Result<ReadonlyArray<AdverseReaction>, MedicationError>>;

  /**
   * Get medication's adverse reactions
   */
  getMedicationReactions(
    medicationId: MedicationId
  ): Promise<Result<ReadonlyArray<AdverseReaction>, MedicationError>>;

  /**
   * Get reactions requiring follow-up
   */
  getReactionsRequiringFollowUp(): Promise<Result<ReadonlyArray<AdverseReaction>, MedicationError>>;

  /**
   * Mark follow-up complete
   */
  completeFollowUp(
    id: AdverseReactionId,
    notes: string
  ): Promise<Result<AdverseReaction, MedicationError>>;
}
```

---

## Error Type System

```typescript
/**
 * Medication-specific error types
 */
export interface MedicationError {
  readonly code: MedicationErrorCode;
  readonly message: string;
  readonly severity: ErrorSeverity;
  readonly details?: Record<string, unknown>;
  readonly timestamp: Date;
  readonly stackTrace?: string;
}

export enum MedicationErrorCode {
  // Validation errors
  INVALID_DOSAGE = 'INVALID_DOSAGE',
  DOSAGE_OUT_OF_RANGE = 'DOSAGE_OUT_OF_RANGE',
  INVALID_FREQUENCY = 'INVALID_FREQUENCY',
  INVALID_ROUTE = 'INVALID_ROUTE',

  // Five Rights violations
  WRONG_PATIENT = 'WRONG_PATIENT',
  WRONG_MEDICATION = 'WRONG_MEDICATION',
  WRONG_DOSE = 'WRONG_DOSE',
  WRONG_ROUTE = 'WRONG_ROUTE',
  WRONG_TIME = 'WRONG_TIME',
  FIVE_RIGHTS_VIOLATION = 'FIVE_RIGHTS_VIOLATION',

  // Prescription errors
  PRESCRIPTION_NOT_FOUND = 'PRESCRIPTION_NOT_FOUND',
  PRESCRIPTION_INACTIVE = 'PRESCRIPTION_INACTIVE',
  PRESCRIPTION_EXPIRED = 'PRESCRIPTION_EXPIRED',
  DUPLICATE_PRESCRIPTION = 'DUPLICATE_PRESCRIPTION',
  MISSING_PRESCRIBER_INFO = 'MISSING_PRESCRIBER_INFO',

  // Contraindication errors
  ALLERGY_CONFLICT = 'ALLERGY_CONFLICT',
  DRUG_INTERACTION = 'DRUG_INTERACTION',
  CONTRAINDICATION = 'CONTRAINDICATION',
  AGE_RESTRICTION = 'AGE_RESTRICTION',

  // Inventory errors
  INSUFFICIENT_INVENTORY = 'INSUFFICIENT_INVENTORY',
  EXPIRED_MEDICATION = 'EXPIRED_MEDICATION',
  BATCH_NOT_FOUND = 'BATCH_NOT_FOUND',
  INVENTORY_NOT_FOUND = 'INVENTORY_NOT_FOUND',
  COUNT_DISCREPANCY = 'COUNT_DISCREPANCY',

  // Controlled substance errors
  MISSING_DEA_NUMBER = 'MISSING_DEA_NUMBER',
  MISSING_WITNESS_SIGNATURE = 'MISSING_WITNESS_SIGNATURE',
  CUSTODY_CHAIN_BROKEN = 'CUSTODY_CHAIN_BROKEN',
  UNAUTHORIZED_CONTROLLED_SUBSTANCE = 'UNAUTHORIZED_CONTROLLED_SUBSTANCE',

  // Administration errors
  ADMINISTRATION_WINDOW_MISSED = 'ADMINISTRATION_WINDOW_MISSED',
  MAX_DAILY_DOSE_EXCEEDED = 'MAX_DAILY_DOSE_EXCEEDED',
  DUPLICATE_ADMINISTRATION = 'DUPLICATE_ADMINISTRATION',

  // System errors
  MEDICATION_NOT_FOUND = 'MEDICATION_NOT_FOUND',
  STUDENT_NOT_FOUND = 'STUDENT_NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  DATABASE_ERROR = 'DATABASE_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
}

export enum ErrorSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL', // Requires immediate attention
}

/**
 * Error factory
 */
export class MedicationErrorFactory {
  static fiveRightsViolation(
    validations: FiveRightsValidation,
    details: string
  ): MedicationError {
    return {
      code: MedicationErrorCode.FIVE_RIGHTS_VIOLATION,
      message: `Five Rights validation failed: ${details}`,
      severity: ErrorSeverity.CRITICAL,
      details: { validations },
      timestamp: new Date(),
    };
  }

  static allergyConflict(
    allergen: string,
    medicationName: string
  ): MedicationError {
    return {
      code: MedicationErrorCode.ALLERGY_CONFLICT,
      message: `Patient is allergic to ${allergen} found in ${medicationName}`,
      severity: ErrorSeverity.CRITICAL,
      details: { allergen, medicationName },
      timestamp: new Date(),
    };
  }

  static dosageOutOfRange(
    given: Quantity,
    prescribed: Dosage
  ): MedicationError {
    return {
      code: MedicationErrorCode.DOSAGE_OUT_OF_RANGE,
      message: `Dosage ${given.value}${given.unit} is outside prescribed range`,
      severity: ErrorSeverity.CRITICAL,
      details: { given, prescribed },
      timestamp: new Date(),
    };
  }

  // ... additional factory methods
}
```

---

## Validation Schemas (Zod)

```typescript
import { z } from 'zod';

/**
 * Zod schemas for runtime validation
 */

export const QuantitySchema = z.object({
  value: z.number().positive(),
  unit: z.nativeEnum(MedicationUnit),
  category: z.nativeEnum(UnitCategory),
});

export const DosageSchema = z.object({
  min: QuantitySchema,
  max: QuantitySchema.optional(),
  route: z.nativeEnum(RouteOfAdministration),
});

export const FrequencyScheduleSchema = z.object({
  frequency: z.nativeEnum(MedicationFrequency),
  timesPerDay: z.number().int().positive().optional(),
  specificTimes: z.array(z.object({
    hour: z.number().int().min(0).max(23),
    minute: z.number().int().min(0).max(59),
  })).optional(),
  interval: z.object({
    value: z.number().positive(),
    unit: z.enum(['hours', 'minutes', 'days']),
  }).optional(),
  maxDosesPerDay: z.number().int().positive().optional(),
  administrationWindow: z.object({
    beforeMinutes: z.number().int().min(0),
    afterMinutes: z.number().int().min(0),
  }).optional(),
});

export const CreateMedicationDTOSchema = z.object({
  name: z.string().min(1).max(255),
  genericName: z.string().max(255).optional(),
  brandNames: z.array(z.string()).optional(),
  ndc: z.string().regex(/^\d{5}-\d{4}-\d{2}$/).optional(),
  therapeuticClass: z.nativeEnum(TherapeuticClass),
  dosageForm: z.nativeEnum(DosageForm),
  strength: z.object({
    value: z.number().positive(),
    unit: z.nativeEnum(MedicationUnit),
  }),
  isControlled: z.boolean(),
  deaSchedule: z.nativeEnum(DEASchedule).optional(),
  manufacturer: z.string().max(255).optional(),
  indications: z.array(z.string()).optional(),
});

export const CreatePrescriptionDTOSchema = z.object({
  studentId: z.string().cuid(),
  medicationId: z.string().cuid(),
  prescriberName: z.string().min(1).max(255),
  prescriberCredentials: z.string().min(1).max(50),
  prescriberLicense: z.string().max(100).optional(),
  prescriberDEA: z.string().regex(/^[A-Z]{2}\d{7}$/).optional(),
  prescriberPhone: z.string().regex(/^\+?[\d\s\-\(\)]+$/),
  prescribedDate: z.string().datetime(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  dosageValue: z.number().positive(),
  dosageUnit: z.nativeEnum(MedicationUnit),
  dosageMaxValue: z.number().positive().optional(),
  frequency: z.nativeEnum(MedicationFrequency),
  customFrequency: z.string().max(255).optional(),
  route: z.nativeEnum(RouteOfAdministration),
  instructions: z.string().min(1).max(1000),
  isPRN: z.boolean(),
  maxDosesPerDay: z.number().int().positive().optional(),
  requiresNotification: z.boolean(),
}).refine(
  (data) => {
    // If controlled substance, DEA number required
    return true; // Implement cross-field validation
  },
  {
    message: 'DEA number required for controlled substances',
    path: ['prescriberDEA'],
  }
);

export const LogAdministrationDTOSchema = z.object({
  prescriptionId: z.string().cuid(),
  studentId: z.string().cuid(),
  administeredAt: z.string().datetime(),
  dosageValue: z.number().positive(),
  dosageUnit: z.nativeEnum(MedicationUnit),
  route: z.nativeEnum(RouteOfAdministration),
  batchNumber: z.string().max(100).optional(),
  patientVerificationMethod: z.enum(['PHOTO_ID', 'BARCODE', 'NAME_DOB', 'MANUAL']),
  witnessId: z.string().cuid().optional(),
  status: z.nativeEnum(AdministrationStatus).optional(),
  refusalReason: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
  vitalSigns: z.object({
    bloodPressure: z.string().regex(/^\d{2,3}\/\d{2,3}$/).optional(),
    heartRate: z.number().int().min(20).max(300).optional(),
    temperature: z.number().min(35).max(42).optional(),
    bloodGlucose: z.number().min(0).max(600).optional(),
  }).optional(),
}).refine(
  (data) => {
    // If status is REFUSED, refusal reason required
    if (data.status === AdministrationStatus.REFUSED && !data.refusalReason) {
      return false;
    }
    return true;
  },
  {
    message: 'Refusal reason required when status is REFUSED',
    path: ['refusalReason'],
  }
);

export const ReportAdverseReactionDTOSchema = z.object({
  prescriptionId: z.string().cuid(),
  studentId: z.string().cuid(),
  medicationId: z.string().cuid(),
  severity: z.nativeEnum(ReactionSeverity),
  reactionType: z.nativeEnum(ReactionType),
  symptoms: z.array(z.string()).min(1),
  onsetTime: z.string().datetime(),
  actionsTaken: z.array(z.string()).min(1),
  hospitalTransport: z.boolean(),
  emergencyServicesContacted: z.boolean(),
  notes: z.string().min(10).max(5000),
});

export const AddInventoryDTOSchema = z.object({
  medicationId: z.string().cuid(),
  batchNumber: z.string().min(1).max(100),
  expirationDate: z.string().datetime(),
  quantity: z.number().positive(),
  unit: z.nativeEnum(MedicationUnit),
  reorderLevel: z.number().int().min(0).optional(),
  costPerUnit: z.number().min(0).optional(),
  supplier: z.string().max(255).optional(),
  location: z.object({
    room: z.string().min(1).max(100),
    cabinet: z.string().max(100).optional(),
    requiresLock: z.boolean(),
  }),
});
```

---

## File Organization Structure

```
backend/src/
├── domains/
│   ├── medication/
│   │   ├── types/
│   │   │   ├── branded-types.ts              # Branded ID types
│   │   │   ├── unit-types.ts                 # Quantity, Unit types
│   │   │   ├── controlled-substance-types.ts # DEA, custody types
│   │   │   ├── frequency-types.ts            # Frequency, schedule types
│   │   │   ├── five-rights-types.ts          # Five Rights validation types
│   │   │   └── index.ts
│   │   │
│   │   ├── models/
│   │   │   ├── medication.model.ts           # Formulary domain model
│   │   │   ├── prescription.model.ts         # Prescription domain model
│   │   │   ├── administration-log.model.ts   # Administration domain model
│   │   │   ├── inventory.model.ts            # Inventory domain model
│   │   │   ├── adverse-reaction.model.ts     # Adverse reaction domain model
│   │   │   └── index.ts
│   │   │
│   │   ├── dtos/
│   │   │   ├── requests/
│   │   │   │   ├── create-medication.dto.ts
│   │   │   │   ├── create-prescription.dto.ts
│   │   │   │   ├── log-administration.dto.ts
│   │   │   │   ├── add-inventory.dto.ts
│   │   │   │   ├── report-adverse-reaction.dto.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── responses/
│   │   │   │   ├── medication-response.dto.ts
│   │   │   │   ├── prescription-response.dto.ts
│   │   │   │   ├── administration-response.dto.ts
│   │   │   │   ├── inventory-response.dto.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── errors/
│   │   │   ├── medication-error.ts           # Error types
│   │   │   ├── error-factory.ts              # Error factory
│   │   │   └── index.ts
│   │   │
│   │   ├── validators/
│   │   │   ├── five-rights-validator.ts
│   │   │   ├── dosage-calculator.ts
│   │   │   ├── frequency-parser.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── schemas/
│   │   │   ├── medication.schema.ts          # Zod schemas
│   │   │   ├── prescription.schema.ts
│   │   │   ├── administration.schema.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── repositories/
│   │   │   ├── interfaces/
│   │   │   │   ├── i-medication.repository.ts
│   │   │   │   ├── i-prescription.repository.ts
│   │   │   │   ├── i-administration-log.repository.ts
│   │   │   │   ├── i-inventory.repository.ts
│   │   │   │   ├── i-adverse-reaction.repository.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── implementations/
│   │   │   │   ├── medication.repository.ts
│   │   │   │   ├── prescription.repository.ts
│   │   │   │   ├── administration-log.repository.ts
│   │   │   │   ├── inventory.repository.ts
│   │   │   │   ├── adverse-reaction.repository.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── services/
│   │   │   ├── interfaces/
│   │   │   │   ├── i-medication-formulary.service.ts
│   │   │   │   ├── i-prescription.service.ts
│   │   │   │   ├── i-medication-administration.service.ts
│   │   │   │   ├── i-inventory-management.service.ts
│   │   │   │   ├── i-adverse-reaction.service.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── implementations/
│   │   │   │   ├── medication-formulary.service.ts
│   │   │   │   ├── prescription.service.ts
│   │   │   │   ├── medication-administration.service.ts
│   │   │   │   ├── inventory-management.service.ts
│   │   │   │   ├── adverse-reaction.service.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   └── shared/
│       ├── types/
│       │   ├── result.ts                     # Result<T, E> type
│       │   ├── branded.ts                    # Brand utility
│       │   └── index.ts
│       │
│       └── index.ts
│
├── api/
│   └── routes/
│       ├── medication-formulary.routes.ts
│       ├── prescription.routes.ts
│       ├── administration.routes.ts
│       ├── inventory.routes.ts
│       ├── adverse-reaction.routes.ts
│       └── index.ts
│
└── infrastructure/
    └── di/
        └── medication-container.ts           # Dependency injection setup

frontend/src/
├── domains/
│   └── medication/
│       ├── types/                            # Same type definitions as backend
│       ├── api/
│       │   ├── medication-formulary.api.ts
│       │   ├── prescription.api.ts
│       │   ├── administration.api.ts
│       │   ├── inventory.api.ts
│       │   └── index.ts
│       │
│       ├── hooks/
│       │   ├── useMedications.ts
│       │   ├── usePrescriptions.ts
│       │   ├── useAdministration.ts
│       │   └── index.ts
│       │
│       └── index.ts
│
└── shared/
    └── types/                                # Shared types
```

---

## Migration Strategy

### Phase 1: Type Definitions (Week 1)
1. Create branded type infrastructure
2. Define unit types and dosage calculator
3. Implement controlled substance types
4. Build Five Rights validation types
5. Create error type system

**Deliverable**: Complete type system with full compile-time safety

### Phase 2: Domain Models (Week 2)
1. Refactor Medication model to new structure
2. Separate Prescription from StudentMedication
3. Create AdministrationLog model
4. Refactor Inventory with chain of custody
5. Create AdverseReaction model

**Deliverable**: Clean domain models with proper separation

### Phase 3: DTOs and Schemas (Week 3)
1. Create request DTOs
2. Create response DTOs
3. Implement Zod validation schemas
4. Add versioning support to DTOs

**Deliverable**: Type-safe API contracts with runtime validation

### Phase 4: Repository Layer (Week 4)
1. Define repository interfaces
2. Implement Medication repository
3. Implement Prescription repository
4. Implement AdministrationLog repository
5. Implement Inventory repository
6. Implement AdverseReaction repository

**Deliverable**: Data access layer with clean abstractions

### Phase 5: Service Layer (Week 5-6)
1. Define service interfaces
2. Implement MedicationFormularyService
3. Implement PrescriptionService
4. Implement MedicationAdministrationService
5. Implement InventoryManagementService
6. Implement AdverseReactionService

**Deliverable**: Business logic layer with dependency injection

### Phase 6: API Layer (Week 7)
1. Create versioned API routes
2. Implement request validation middleware
3. Add error handling middleware
4. Update controllers to use new services

**Deliverable**: RESTful API with proper versioning

### Phase 7: Frontend Integration (Week 8)
1. Update frontend types
2. Refactor API client
3. Update React components
4. Add client-side validation

**Deliverable**: End-to-end type safety

### Phase 8: Testing and Documentation (Week 9-10)
1. Unit tests for all services
2. Integration tests for repositories
3. E2E tests for critical flows
4. API documentation
5. Migration guide for existing data

**Deliverable**: Production-ready implementation

---

## Usage Examples

### Example 1: Creating a Prescription with Type Safety

```typescript
import { PrescriptionService } from '@/domains/medication/services';
import { CreatePrescriptionDTO } from '@/domains/medication/dtos';

async function prescribeMedication(
  studentId: string,
  medicationId: string
): Promise<void> {
  const prescriptionService = new PrescriptionService(
    prescriptionRepository,
    medicationRepository,
    studentRepository
  );

  const dto: CreatePrescriptionDTO = {
    studentId,
    medicationId,
    prescriberName: 'Dr. Jane Smith',
    prescriberCredentials: 'MD',
    prescriberLicense: 'CA12345',
    prescriberDEA: 'AS1234563', // Required for controlled substances
    prescriberPhone: '+1-555-0100',
    prescribedDate: new Date().toISOString(),
    startDate: new Date().toISOString(),
    dosageValue: 10,
    dosageUnit: MedicationUnit.MILLIGRAM,
    frequency: MedicationFrequency.BID,
    route: RouteOfAdministration.ORAL,
    instructions: 'Take with food',
    isPRN: false,
    requiresNotification: true,
  };

  // Zod validates at runtime
  const validatedDto = CreatePrescriptionDTOSchema.parse(dto);

  // Check contraindications
  const contraindicationCheck = await prescriptionService.checkContraindications(
    StudentId.create(studentId),
    MedicationId.create(medicationId)
  );

  if (!contraindicationCheck.success) {
    console.error('Contraindication:', contraindicationCheck.error);
    return;
  }

  if (!contraindicationCheck.data.canProceed) {
    console.warn('Warnings:', contraindicationCheck.data.warnings);
    // Show confirmation dialog to user
  }

  // Create prescription
  const result = await prescriptionService.createPrescription(validatedDto);

  if (!result.success) {
    console.error('Failed to create prescription:', result.error);
    return;
  }

  console.log('Prescription created:', result.data);
}
```

### Example 2: Administering Medication with Five Rights

```typescript
import { MedicationAdministrationService } from '@/domains/medication/services';
import { LogAdministrationDTO } from '@/domains/medication/dtos';

async function administerMedication(
  prescriptionId: string,
  studentId: string,
  nurseId: string
): Promise<void> {
  const adminService = new MedicationAdministrationService(
    administrationRepository,
    prescriptionRepository,
    inventoryRepository
  );

  const attempt: AdministrationAttempt = {
    prescriptionId: PrescriptionId.create(prescriptionId),
    studentId: StudentId.create(studentId),
    administeredBy: UserId.create(nurseId),
    administeredAt: new Date(),
    dosageGiven: { value: 10, unit: MedicationUnit.MILLIGRAM, category: UnitCategory.MASS },
    route: RouteOfAdministration.ORAL,
    batchNumber: BatchNumber.create('LOT12345'),
  };

  // Validate Five Rights BEFORE administration
  const validation = await adminService.validateFiveRights(attempt);

  if (!validation.success) {
    // CRITICAL: Five Rights violation
    alert(`STOP: ${validation.error.message}`);
    return;
  }

  const fiveRights = validation.data;

  // Show confirmation to nurse
  const confirmed = confirm(`
    Verify Five Rights:
    ✓ Right Patient: ${fiveRights.rightPatient.verified}
    ✓ Right Medication: ${fiveRights.rightMedication.verified}
    ✓ Right Dose: ${fiveRights.rightDose.verified}
    ✓ Right Route: ${fiveRights.rightRoute.verified}
    ✓ Right Time: ${fiveRights.rightTime.verified}

    Proceed with administration?
  `);

  if (!confirmed) {
    return;
  }

  // Create DTO
  const dto: LogAdministrationDTO = {
    prescriptionId,
    studentId,
    administeredAt: attempt.administeredAt.toISOString(),
    dosageValue: attempt.dosageGiven.value,
    dosageUnit: attempt.dosageGiven.unit,
    route: attempt.route,
    batchNumber: attempt.batchNumber ? BatchNumber.unwrap(attempt.batchNumber) : undefined,
    patientVerificationMethod: 'PHOTO_ID',
  };

  // Log administration
  const result = await adminService.administerMedication(dto);

  if (!result.success) {
    console.error('Administration failed:', result.error);
    return;
  }

  console.log('Medication administered successfully:', result.data);

  // Update inventory automatically handled by service
}
```

### Example 3: Inventory Management with Controlled Substances

```typescript
import { InventoryManagementService } from '@/domains/medication/services';

async function performControlledSubstanceCount(
  inventoryId: string,
  nurseId: string,
  witnessId: string
): Promise<void> {
  const inventoryService = new InventoryManagementService(
    inventoryRepository,
    medicationRepository
  );

  // Physical count
  const actualCount: Quantity = {
    value: 245,
    unit: MedicationUnit.TABLET,
    category: UnitCategory.DOSAGE_FORM,
  };

  const result = await inventoryService.performPhysicalCount(
    InventoryId.create(inventoryId),
    actualCount,
    UserId.create(nurseId),
    UserId.create(witnessId) // Required for controlled substances
  );

  if (!result.success) {
    console.error('Count failed:', result.error);
    return;
  }

  const countResult = result.data;

  if (countResult.discrepancy) {
    console.warn('DISCREPANCY DETECTED!');
    console.warn(`Expected: ${countResult.expectedQuantity.value}${countResult.expectedQuantity.unit}`);
    console.warn(`Actual: ${countResult.actualQuantity.value}${countResult.actualQuantity.unit}`);
    console.warn(`Discrepancy: ${countResult.discrepancy.value}${countResult.discrepancy.unit}`);

    if (countResult.requiresInvestigation) {
      // Trigger investigation workflow
      await notifyPharmacySupervisor(countResult);
    }
  } else {
    console.log('Count matches expected quantity');
  }

  // Chain of custody automatically updated
}
```

---

## Best Practices

### 1. Always Use Branded Types
```typescript
// ❌ BAD - Can mix up IDs
function getPrescription(id: string) { }
getPrescription(studentId); // Compiles, but wrong!

// ✅ GOOD - Compile-time safety
function getPrescription(id: PrescriptionId) { }
getPrescription(StudentId.create(studentId)); // Compile error!
```

### 2. Validate Dosages at Type Level
```typescript
// ❌ BAD - Runtime errors possible
const dose = "10mg";

// ✅ GOOD - Type-safe quantities
const dose: Quantity = {
  value: 10,
  unit: MedicationUnit.MILLIGRAM,
  category: UnitCategory.MASS,
};

DosageCalculator.validateDosage(dose, prescribedDosage);
```

### 3. Use Result Type for Error Handling
```typescript
// ❌ BAD - Throws exceptions
function administerMedication() {
  throw new Error('Five Rights violation');
}

// ✅ GOOD - Explicit error handling
function administerMedication(): Promise<Result<AdministrationLog, MedicationError>> {
  return {
    success: false,
    error: MedicationErrorFactory.fiveRightsViolation(...),
  };
}
```

### 4. Separate Domain Models from DTOs
```typescript
// ❌ BAD - Same type for domain and API
interface Medication {
  id: string;
  name: string;
  // ... mixed concerns
}

// ✅ GOOD - Separate concerns
interface Medication { /* domain model */ }
interface MedicationResponseDTO { /* API contract */ }
```

### 5. Use Dependency Injection
```typescript
// ❌ BAD - Tight coupling
class PrescriptionService {
  private repo = new PrescriptionRepository();
}

// ✅ GOOD - Dependency injection
class PrescriptionService {
  constructor(
    private readonly prescriptionRepo: IPrescriptionRepository,
    private readonly medicationRepo: IMedicationRepository
  ) {}
}
```

---

## Conclusion

This comprehensive TypeScript service contract design provides enterprise-grade type safety for the medication management module. The design:

✅ **Separates domains** (formulary, prescription, administration, inventory)
✅ **Enforces Five Rights** at compile-time where possible
✅ **Prevents ID mixing** with branded types
✅ **Validates dosages** with type-safe units
✅ **Tracks controlled substances** with chain of custody
✅ **Provides clear error types** for medication-specific errors
✅ **Supports API versioning** with separate DTOs
✅ **Enables dependency injection** with service interfaces
✅ **Maintains audit trails** for HIPAA compliance

The migration can be done incrementally over 10 weeks with minimal disruption to existing functionality. Each phase delivers tangible value and can be tested independently.

This is a life-critical system. The type safety provided by this design can literally save lives by preventing medication errors at compile-time.
