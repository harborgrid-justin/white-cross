/**
 * Medication Factory
 *
 * Factory for creating test medication data with realistic pharmaceutical scenarios.
 * Includes support for controlled substances and DEA schedule tracking.
 */

export interface CreateMedicationOptions {
  id?: string;
  name?: string;
  genericName?: string;
  dosageForm?: string;
  strength?: string;
  manufacturer?: string;
  ndc?: string;
  isControlled?: boolean;
  deaSchedule?: 'I' | 'II' | 'III' | 'IV' | 'V';
  requiresWitness?: boolean;
  isActive?: boolean;
  deletedAt?: Date;
  deletedBy?: string;
}

export class MedicationFactory {
  private static idCounter = 1;
  private static ndcCounter = 1000;

  /**
   * Create a single test medication with optional overrides
   */
  static create(overrides: CreateMedicationOptions = {}): any {
    const id = overrides.id || `medication-${this.idCounter++}-${Date.now()}`;
    const ndc = overrides.ndc || this.generateNDC();

    return {
      id,
      name: overrides.name || 'Acetaminophen',
      genericName: overrides.genericName || 'Acetaminophen',
      dosageForm: overrides.dosageForm || 'Tablet',
      strength: overrides.strength || '500 mg',
      manufacturer: overrides.manufacturer || 'Generic Pharmaceuticals Inc.',
      ndc,
      isControlled: overrides.isControlled ?? false,
      deaSchedule: overrides.deaSchedule || null,
      requiresWitness: overrides.requiresWitness ?? false,
      isActive: overrides.isActive ?? true,
      deletedAt: overrides.deletedAt || null,
      deletedBy: overrides.deletedBy || null,
      createdAt: new Date(),
      updatedAt: new Date(),

      // Mock methods
      save: jest.fn().mockResolvedValue(true),
      destroy: jest.fn().mockResolvedValue(true),
      toJSON: jest.fn().mockReturnThis(),
    };
  }

  /**
   * Create multiple test medications
   */
  static createMany(count: number, overrides: CreateMedicationOptions = {}): any[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  /**
   * Create a common OTC medication
   */
  static createOTC(overrides: CreateMedicationOptions = {}): any {
    return this.create({
      ...overrides,
      name: overrides.name || 'Ibuprofen',
      genericName: 'Ibuprofen',
      dosageForm: 'Tablet',
      strength: '200 mg',
      isControlled: false,
      requiresWitness: false,
    });
  }

  /**
   * Create an asthma medication (albuterol)
   */
  static createAlbuterol(overrides: CreateMedicationOptions = {}): any {
    return this.create({
      ...overrides,
      name: 'Albuterol Sulfate HFA',
      genericName: 'Albuterol',
      dosageForm: 'Inhaler',
      strength: '90 mcg/actuation',
      manufacturer: 'GlaxoSmithKline',
      isControlled: false,
      requiresWitness: false,
    });
  }

  /**
   * Create an EpiPen (epinephrine auto-injector)
   */
  static createEpiPen(overrides: CreateMedicationOptions = {}): any {
    return this.create({
      ...overrides,
      name: 'EpiPen',
      genericName: 'Epinephrine',
      dosageForm: 'Auto-Injector',
      strength: '0.3 mg',
      manufacturer: 'Mylan',
      isControlled: false,
      requiresWitness: true, // Emergency medication requiring documentation
    });
  }

  /**
   * Create a Schedule II controlled substance (high abuse potential)
   */
  static createScheduleII(overrides: CreateMedicationOptions = {}): any {
    return this.create({
      ...overrides,
      name: 'Methylphenidate',
      genericName: 'Methylphenidate',
      dosageForm: 'Tablet',
      strength: '10 mg',
      manufacturer: 'Novartis',
      isControlled: true,
      deaSchedule: 'II',
      requiresWitness: true,
    });
  }

  /**
   * Create a Schedule III controlled substance
   */
  static createScheduleIII(overrides: CreateMedicationOptions = {}): any {
    return this.create({
      ...overrides,
      name: 'Acetaminophen with Codeine',
      genericName: 'Acetaminophen/Codeine',
      dosageForm: 'Tablet',
      strength: '300mg/30mg',
      manufacturer: 'Various',
      isControlled: true,
      deaSchedule: 'III',
      requiresWitness: true,
    });
  }

  /**
   * Create a Schedule IV controlled substance
   */
  static createScheduleIV(overrides: CreateMedicationOptions = {}): any {
    return this.create({
      ...overrides,
      name: 'Lorazepam',
      genericName: 'Lorazepam',
      dosageForm: 'Tablet',
      strength: '0.5 mg',
      manufacturer: 'Various',
      isControlled: true,
      deaSchedule: 'IV',
      requiresWitness: false,
    });
  }

  /**
   * Create a Schedule V controlled substance
   */
  static createScheduleV(overrides: CreateMedicationOptions = {}): any {
    return this.create({
      ...overrides,
      name: 'Promethazine with Codeine',
      genericName: 'Promethazine/Codeine',
      dosageForm: 'Syrup',
      strength: '6.25mg/10mg per 5mL',
      manufacturer: 'Various',
      isControlled: true,
      deaSchedule: 'V',
      requiresWitness: false,
    });
  }

  /**
   * Create an insulin medication
   */
  static createInsulin(overrides: CreateMedicationOptions = {}): any {
    return this.create({
      ...overrides,
      name: 'Insulin Lispro',
      genericName: 'Insulin Lispro',
      dosageForm: 'Injectable Solution',
      strength: '100 units/mL',
      manufacturer: 'Eli Lilly',
      isControlled: false,
      requiresWitness: true, // Important medication requiring careful documentation
    });
  }

  /**
   * Create an antibiotic medication
   */
  static createAntibiotic(overrides: CreateMedicationOptions = {}): any {
    return this.create({
      ...overrides,
      name: 'Amoxicillin',
      genericName: 'Amoxicillin',
      dosageForm: 'Capsule',
      strength: '500 mg',
      manufacturer: 'Various',
      isControlled: false,
      requiresWitness: false,
    });
  }

  /**
   * Create an inactive (discontinued) medication
   */
  static createInactive(overrides: CreateMedicationOptions = {}): any {
    return this.create({
      ...overrides,
      isActive: false,
      deletedAt: new Date(),
      deletedBy: 'user-test-1',
    });
  }

  /**
   * Create a medication requiring witness signature
   */
  static createRequiringWitness(overrides: CreateMedicationOptions = {}): any {
    return this.create({
      ...overrides,
      requiresWitness: true,
    });
  }

  /**
   * Create an ADHD medication (common in school health)
   */
  static createADHDMedication(overrides: CreateMedicationOptions = {}): any {
    return this.create({
      ...overrides,
      name: 'Adderall XR',
      genericName: 'Amphetamine/Dextroamphetamine',
      dosageForm: 'Extended-Release Capsule',
      strength: '20 mg',
      manufacturer: 'Shire',
      isControlled: true,
      deaSchedule: 'II',
      requiresWitness: true,
    });
  }

  /**
   * Create an allergy medication
   */
  static createAllergyMedication(overrides: CreateMedicationOptions = {}): any {
    return this.create({
      ...overrides,
      name: 'Cetirizine',
      genericName: 'Cetirizine Hydrochloride',
      dosageForm: 'Tablet',
      strength: '10 mg',
      manufacturer: 'Various',
      isControlled: false,
      requiresWitness: false,
    });
  }

  /**
   * Create a seizure medication
   */
  static createSeizureMedication(overrides: CreateMedicationOptions = {}): any {
    return this.create({
      ...overrides,
      name: 'Levetiracetam',
      genericName: 'Levetiracetam',
      dosageForm: 'Tablet',
      strength: '500 mg',
      manufacturer: 'UCB',
      isControlled: false,
      requiresWitness: true, // Critical medication requiring careful monitoring
    });
  }

  /**
   * Generate a valid NDC (National Drug Code)
   */
  private static generateNDC(): string {
    const labeler = String(this.ndcCounter++).padStart(5, '0');
    const product = String(Math.floor(Math.random() * 1000)).padStart(4, '0');
    const package = String(Math.floor(Math.random() * 100)).padStart(2, '0');
    return `${labeler}-${product}-${package}`;
  }

  /**
   * Reset the ID and NDC counters (useful between test suites)
   */
  static reset(): void {
    this.idCounter = 1;
    this.ndcCounter = 1000;
  }
}
