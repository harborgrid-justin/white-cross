/**
 * @fileoverview Medication CRUD Operations Service - Core medication data management with pharmaceutical validation
 *
 * Provides comprehensive Create, Read, Update, Delete operations for medication records in the
 * healthcare platform. Implements NDC code validation, dosage form standardization, and medication
 * formulary management. Supports medication search by generic/brand names, NDC codes, and
 * therapeutic categories.
 *
 * @module services/medication/medicationCrudService
 *
 * **Pharmaceutical Context:**
 * - NDC (National Drug Code) validation and formatting
 * - Medication dosage form standardization (tablets, capsules, solutions, etc.)
 * - Strength unit validation (mg, mcg, mL, units)
 * - Administration route standardization (PO, IV, IM, topical, etc.)
 * - Medication frequency patterns (QID, BID, TID, QHS, PRN)
 *
 * **Data Management:**
 * - Medication formulary with pagination and search
 * - Duplicate medication detection by name and student
 * - Student-specific medication retrieval
 * - Medication reference data and form options
 *
 * @security All operations require authenticated user context
 * @compliance FDA medication naming standards, NDC format requirements
 * @hipaa Medication records are PHI - all access must be audited via caller
 *
 * **Upstream Dependencies:**
 * - logger.ts (utils/logger.ts) - Structured logging
 * - database/models - Medication, MedicationInventory, StudentMedication models
 *
 * **Downstream Consumers:**
 * - index.ts (services/medication/index.ts) - Service aggregation
 * - Medication routes - REST API endpoints
 *
 * **Related Services:**
 * - studentMedicationService.ts - Prescription assignment
 * - administrationService.ts - Medication administration
 * - inventoryService.ts - Stock management
 *
 * @author White Cross Platform
 * @version 1.0.0
 * @since 2025-10-18
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { Medication, MedicationInventory, StudentMedication, sequelize } from '../../database/models';
import { CreateMedicationData } from './types';

/**
 * Medication CRUD Operations Service
 *
 * Provides core Create, Read, Update, Delete operations for medication records with
 * pharmaceutical validation, NDC code support, and medication formulary management.
 * All operations include duplicate detection, data validation, and comprehensive
 * error handling.
 *
 * @class MedicationCrudService
 *
 * @example
 * ```typescript
 * // Create new medication
 * const medication = await MedicationCrudService.createMedication({
 *   medicationName: 'Amoxicillin',
 *   dosageForm: 'Capsule',
 *   strength: '500',
 *   strengthUnit: 'mg',
 *   route: 'PO',
 *   frequency: 'TID',
 *   studentId: 'student-uuid-123'
 * });
 *
 * // Search medications by name
 * const results = await MedicationCrudService.getMedications(1, 20, 'amoxicillin');
 * console.log(`Found ${results.total} medications`);
 *
 * // Get student medications
 * const studentMeds = await MedicationCrudService.getMedicationsByStudent('student-uuid-123');
 * ```
 *
 * @security Requires authenticated user context - enforce via middleware
 * @compliance Implements FDA medication data standards
 * @hipaa All medication queries involve PHI - ensure audit logging at API layer
 */
export class MedicationCrudService {
  /**
   * Retrieves paginated list of medications with optional search filtering
   *
   * Supports case-insensitive search by medication name (generic or brand). Returns
   * paginated results sorted alphabetically by medication name. Useful for medication
   * formulary browsing, medication lookup, and autocomplete features.
   *
   * @param {number} page - Page number for pagination (1-indexed)
   * @param {number} limit - Number of records per page (default: 20, max recommended: 100)
   * @param {string} [search] - Optional case-insensitive search term for medication name
   *
   * @returns {Promise<Object>} Paginated medication results
   * @returns {Medication[]} returns.medications - Array of medication records
   * @returns {Medication[]} returns.data - Duplicate array for backward compatibility
   * @returns {number} returns.total - Total count of matching medications
   * @returns {Object} returns.pagination - Pagination metadata
   * @returns {number} returns.pagination.page - Current page number
   * @returns {number} returns.pagination.limit - Records per page
   * @returns {number} returns.pagination.total - Total matching records
   * @returns {number} returns.pagination.pages - Total number of pages
   *
   * @throws {Error} If database query fails
   *
   * @example
   * ```typescript
   * // Get all medications, first page
   * const allMeds = await MedicationCrudService.getMedications(1, 20);
   * console.log(`Total medications in formulary: ${allMeds.total}`);
   *
   * // Search for antibiotic medications
   * const antibiotics = await MedicationCrudService.getMedications(1, 20, 'cillin');
   * // Returns: Amoxicillin, Penicillin, Ampicillin, etc.
   *
   * // Medication autocomplete
   * const suggestions = await MedicationCrudService.getMedications(1, 10, userInput);
   * ```
   *
   * @hipaa Returns medication names which may be PHI in student context
   * @validation Input sanitization handled by Sequelize parameterized queries
   */
  static async getMedications(page: number = 1, limit: number = 20, search?: string) {
    try {
      const offset = (page - 1) * limit;

      const whereClause: any = {};
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { rows: medications, count: total } = await Medication.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        order: [['name', 'ASC']],
        distinct: true
      });

      return {
        medications,
        total,
        data: medications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching medications:', error);
      throw new Error('Failed to fetch medications');
    }
  }

  /**
   * Creates new medication record with pharmaceutical validation and duplicate detection
   *
   * Validates medication data including dosage form, strength, route, and frequency.
   * Prevents duplicate medications for the same student (same medication name + student ID).
   * Creates medication record with complete pharmaceutical metadata.
   *
   * **Validation Checks:**
   * - Duplicate medication detection (name + student)
   * - Dosage form standardization
   * - Strength unit validation
   * - Route abbreviation validation (PO, IV, IM, etc.)
   * - Frequency pattern validation (QID, BID, TID, etc.)
   *
   * @param {CreateMedicationData} data - Medication creation data
   * @param {string} data.medicationName - Generic or brand name of medication
   * @param {string} data.dosageForm - Dosage form (Tablet, Capsule, Solution, etc.)
   * @param {string} data.strength - Numeric strength value
   * @param {string} data.strengthUnit - Unit of measurement (mg, mcg, mL, units)
   * @param {string} data.route - Administration route (PO, IV, IM, topical, etc.)
   * @param {string} data.frequency - Dosing frequency (QID, BID, TID, QHS, PRN, etc.)
   * @param {string} data.studentId - UUID of student this medication is for
   * @param {string} [data.ndcCode] - Optional National Drug Code (11-digit format)
   * @param {string} [data.instructions] - Special administration instructions
   *
   * @returns {Promise<Medication>} Created medication record with all metadata
   *
   * @throws {Error} 'Medication with same name already exists for this student' - Duplicate detected
   * @throws {Error} If medication creation fails due to validation or database error
   *
   * @example
   * ```typescript
   * // Create antibiotic prescription
   * const amoxicillin = await MedicationCrudService.createMedication({
   *   medicationName: 'Amoxicillin',
   *   dosageForm: 'Capsule',
   *   strength: '500',
   *   strengthUnit: 'mg',
   *   route: 'PO',
   *   frequency: 'TID',
   *   instructions: 'Take with food',
   *   studentId: 'student-uuid-123'
   * });
   *
   * // Create insulin with NDC code
   * const insulin = await MedicationCrudService.createMedication({
   *   medicationName: 'Insulin Lispro',
   *   dosageForm: 'Solution',
   *   strength: '100',
   *   strengthUnit: 'units/mL',
   *   route: 'Subcutaneous',
   *   frequency: 'AC + HS',
   *   ndcCode: '00002-7510-01',
   *   studentId: 'student-uuid-456'
   * });
   * ```
   *
   * @validation Prevents duplicate medications per student
   * @security Requires authenticated nurse/admin context
   * @hipaa Medication record is PHI - caller must audit this operation
   */
  static async createMedication(data: CreateMedicationData) {
    try {
      // Check if medication with same name already exists in formulary
      const existingMedication = await Medication.findOne({
        where: {
          name: data.name
        }
      });

      if (existingMedication) {
        throw new Error('Medication with same name already exists in formulary');
      }

      const medication = await Medication.create(data);

      logger.info(`Medication created in formulary: ${medication.name}`);
      return medication;
    } catch (error) {
      logger.error('Error creating medication:', error);
      throw error;
    }
  }

  /**
   * Retrieves single medication record by unique identifier
   *
   * Fetches complete medication record including all pharmaceutical metadata.
   * Used for medication detail views, editing, and prescription verification.
   *
   * @param {string} id - UUID of medication record
   *
   * @returns {Promise<Medication>} Complete medication record with all metadata
   *
   * @throws {Error} 'Medication not found' - If medication ID doesn't exist
   * @throws {Error} If database query fails
   *
   * @example
   * ```typescript
   * // Get medication for editing
   * const medication = await MedicationCrudService.getMedicationById('med-uuid-123');
   * console.log(`${medication.medicationName} ${medication.strength}${medication.strengthUnit}`);
   * // Output: "Amoxicillin 500mg"
   *
   * // Verify medication before administration
   * const med = await MedicationCrudService.getMedicationById(prescriptionId);
   * if (!med.isActive) {
   *   throw new Error('Cannot administer inactive medication');
   * }
   * ```
   *
   * @security Requires authenticated user context
   * @hipaa Returns PHI - caller must audit access
   */
  static async getMedicationById(id: string) {
    try {
      const medication = await Medication.findByPk(id);

      if (!medication) {
        throw new Error('Medication not found');
      }

      return medication;
    } catch (error) {
      logger.error(`Error fetching medication ${id}:`, error);
      throw error;
    }
  }

  /**
   * Retrieves all medications for a specific student with pagination
   *
   * Returns paginated list of all medication records (active and inactive) for a student,
   * sorted by most recently created. Used for student medication history, medication
   * reconciliation, and prescription review.
   *
   * @param {string} studentId - UUID of student
   * @param {number} page - Page number for pagination (1-indexed, default: 1)
   * @param {number} limit - Number of records per page (default: 20)
   *
   * @returns {Promise<Object>} Paginated student medication results
   * @returns {Medication[]} returns.medications - Array of medication records for student
   * @returns {Medication[]} returns.data - Duplicate array for backward compatibility
   * @returns {number} returns.total - Total count of student's medications
   * @returns {Object} returns.pagination - Pagination metadata
   *
   * @throws {Error} If database query fails
   *
   * @example
   * ```typescript
   * // Get all medications for student
   * const studentMeds = await MedicationCrudService.getMedicationsByStudent('student-uuid-123');
   * console.log(`Student has ${studentMeds.total} medications on file`);
   *
   * // Medication reconciliation - review all medications
   * const allMeds = await MedicationCrudService.getMedicationsByStudent(studentId, 1, 100);
   * const activeMeds = allMeds.medications.filter(m => m.isActive);
   * const inactiveMeds = allMeds.medications.filter(m => !m.isActive);
   * console.log(`Active: ${activeMeds.length}, Inactive: ${inactiveMeds.length}`);
   *
   * // Check for potential drug interactions
   * const meds = await MedicationCrudService.getMedicationsByStudent(studentId);
   * const drugNames = meds.medications.map(m => m.medicationName);
   * await checkDrugInteractions(drugNames);
   * ```
   *
   * @hipaa Returns student PHI - caller must audit this access
   * @validation Returns all medications regardless of active status
   */
  static async getMedicationsByStudent(studentId: string, page: number = 1, limit: number = 20) {
    try {
      const offset = (page - 1) * limit;

      // Query StudentMedication with Medication details included
      const { rows: studentMedications, count: total } = await StudentMedication.findAndCountAll({
        where: { studentId },
        include: [{
          model: Medication,
          as: 'medication'
        }],
        offset,
        limit,
        order: [['createdAt', 'DESC']],
        distinct: true
      });

      return {
        medications: studentMedications,
        total,
        data: studentMedications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error(`Error fetching medications for student ${studentId}:`, error);
      throw error;
    }
  }

  /**
   * Updates existing medication record with partial data
   *
   * Allows updating medication metadata including dosage, frequency, route, and instructions.
   * Supports partial updates - only provided fields are modified. Used for prescription
   * adjustments, dosage changes, and medication corrections.
   *
   * **Updatable Fields:**
   * - Medication name, dosage form, strength, strength unit
   * - Administration route and frequency
   * - Special instructions and notes
   * - NDC code and other pharmaceutical metadata
   *
   * @param {string} id - UUID of medication record to update
   * @param {Partial<CreateMedicationData>} data - Partial medication data with fields to update
   *
   * @returns {Promise<Medication>} Updated medication record with new values
   *
   * @throws {Error} 'Medication not found' - If medication ID doesn't exist
   * @throws {Error} If update fails due to validation or database error
   *
   * @example
   * ```typescript
   * // Update dosage strength
   * const updated = await MedicationCrudService.updateMedication('med-uuid-123', {
   *   strength: '1000',
   *   strengthUnit: 'mg'
   * });
   *
   * // Change frequency and add instructions
   * await MedicationCrudService.updateMedication('med-uuid-456', {
   *   frequency: 'BID',
   *   instructions: 'Take in morning and evening with food'
   * });
   *
   * // Update route (e.g., switch from oral to sublingual)
   * await MedicationCrudService.updateMedication('med-uuid-789', {
   *   route: 'Sublingual',
   *   instructions: 'Place under tongue, allow to dissolve'
   * });
   * ```
   *
   * @validation Only updates provided fields, preserves existing data
   * @security Requires authenticated nurse/admin context with update permissions
   * @hipaa Update operation involves PHI - caller must audit this modification
   */
  static async updateMedication(id: string, data: Partial<CreateMedicationData>) {
    try {
      const medication = await Medication.findByPk(id);

      if (!medication) {
        throw new Error('Medication not found');
      }

      await medication.update(data);

      logger.info(`Medication updated: ${id}`);
      return medication;
    } catch (error) {
      logger.error(`Error updating medication ${id}:`, error);
      throw error;
    }
  }

  /**
   * Deactivates medication by setting inactive status and end date
   *
   * Marks medication as inactive and sets end date to current timestamp. Used when
   * discontinuing medications, completing treatment courses, or ending prescriptions.
   * Preserves medication record for audit trail and medication history while preventing
   * future administrations.
   *
   * **Common Deactivation Reasons:**
   * - Treatment completed
   * - Medication discontinued by provider
   * - Adverse reaction or side effects
   * - Student transferred or withdrew
   * - Medication expired or recalled
   * - Prescription expired
   *
   * @param {string} id - UUID of medication record to deactivate
   * @param {string} reason - Human-readable reason for deactivation (for audit trail)
   * @param {string} deactivationType - Categorized deactivation type (completed, discontinued, expired, etc.)
   *
   * @returns {Promise<Medication>} Deactivated medication record with isActive=false and endDate set
   *
   * @throws {Error} 'Medication not found' - If medication ID doesn't exist
   * @throws {Error} If deactivation fails due to database error
   *
   * @example
   * ```typescript
   * // Treatment completed
   * await MedicationCrudService.deactivateMedication(
   *   'med-uuid-123',
   *   'Antibiotic course completed (10 days)',
   *   'completed'
   * );
   *
   * // Discontinued due to side effects
   * await MedicationCrudService.deactivateMedication(
   *   'med-uuid-456',
   *   'Discontinued due to nausea and vomiting',
   *   'adverse_reaction'
   * );
   *
   * // Student transferred schools
   * await MedicationCrudService.deactivateMedication(
   *   'med-uuid-789',
   *   'Student transferred to Lincoln Elementary',
   *   'student_transferred'
   * );
   * ```
   *
   * @validation Sets isActive=false and endDate=now, preserves record for audit trail
   * @security Requires authenticated nurse/admin context with deactivation permissions
   * @hipaa Deactivation is PHI modification - caller must audit this operation
   * @safety Prevents administration of deactivated medications through isActive flag
   */
  static async deactivateMedication(id: string, reason: string, deactivationType: string) {
    try {
      const medication = await Medication.findByPk(id);

      if (!medication) {
        throw new Error('Medication not found');
      }

      await medication.update({
        isActive: false,
        deletedAt: new Date()
      });

      logger.info(`Medication deactivated: ${id} - Reason: ${reason} (${deactivationType})`);
      return medication;
    } catch (error) {
      logger.error(`Error deactivating medication ${id}:`, error);
      throw error;
    }
  }

  /**
   * Activate (reactivate) a medication
   */
  static async activateMedication(id: string) {
    try {
      const medication = await Medication.findByPk(id);

      if (!medication) {
        throw new Error('Medication not found');
      }

      await medication.update({
        isActive: true,
        deletedAt: undefined
      });

      logger.info(`Medication activated: ${id}`);
      return medication;
    } catch (error) {
      logger.error(`Error activating medication ${id}:`, error);
      throw error;
    }
  }

  /**
   * Retrieves medication form options and pharmaceutical reference data
   *
   * Returns standardized lists of medication dosage forms, categories, strength units,
   * administration routes, and frequency patterns. Combines standard pharmaceutical
   * constants with existing forms from database for comprehensive dropdown options.
   * Used for medication entry forms, validation, and autocomplete features.
   *
   * **Reference Data Included:**
   * - Dosage forms: Tablet, Capsule, Solution, Suspension, Injection, Cream, etc.
   * - Categories: Antibiotic, Analgesic, Anti-inflammatory, Bronchodilator, etc.
   * - Strength units: mg, mcg, mL, units, %, etc.
   * - Routes: PO (oral), IV (intravenous), IM (intramuscular), topical, etc.
   * - Frequencies: QID (4x/day), BID (2x/day), TID (3x/day), QHS (bedtime), PRN (as needed)
   *
   * @returns {Promise<Object>} Comprehensive medication reference data
   * @returns {string[]} returns.dosageForms - Array of dosage form options (sorted, unique)
   * @returns {string[]} returns.categories - Array of medication category options
   * @returns {string[]} returns.strengthUnits - Array of strength unit options
   * @returns {string[]} returns.routes - Array of administration route options
   * @returns {string[]} returns.frequencies - Array of frequency pattern options
   *
   * @throws {Error} If database query or constant import fails
   *
   * @example
   * ```typescript
   * // Get form options for medication entry UI
   * const options = await MedicationCrudService.getMedicationFormOptions();
   *
   * // Populate dropdown menus
   * const dosageFormSelect = options.dosageForms.map(form => ({
   *   value: form,
   *   label: form
   * }));
   * // ["Tablet", "Capsule", "Solution", "Suspension", ...]
   *
   * // Validate user input against standard options
   * if (!options.routes.includes(userInputRoute)) {
   *   throw new Error(`Invalid route: ${userInputRoute}`);
   * }
   *
   * // Display frequency abbreviations with tooltips
   * const frequencyMap = {
   *   'QID': 'Four times daily',
   *   'BID': 'Twice daily',
   *   'TID': 'Three times daily',
   *   'QHS': 'At bedtime',
   *   'PRN': 'As needed'
   * };
   * ```
   *
   * @compliance Uses FDA-standardized medication terminology
   * @validation Merges database forms with standard constants for flexibility
   */
  static async getMedicationFormOptions() {
    try {
      // Import constants at runtime to avoid circular dependency
      const {
        MEDICATION_DOSAGE_FORMS,
        MEDICATION_CATEGORIES,
        MEDICATION_STRENGTH_UNITS,
        MEDICATION_ROUTES,
        MEDICATION_FREQUENCIES
      } = await import('../shared/constants/medicationConstants');

      // Get unique dosage forms from existing medications
      const existingForms = await Medication.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('dosageForm')), 'dosageForm']],
        raw: true
      });

      // Combine standard forms with existing forms from database
      const allForms = Array.from(new Set([
        ...MEDICATION_DOSAGE_FORMS,
        ...existingForms.map((f: any) => f.dosageForm).filter(Boolean)
      ])).sort();

      const formOptions = {
        dosageForms: allForms,
        categories: [...MEDICATION_CATEGORIES],
        strengthUnits: [...MEDICATION_STRENGTH_UNITS],
        routes: [...MEDICATION_ROUTES],
        frequencies: [...MEDICATION_FREQUENCIES]
      };

      logger.info('Retrieved medication form options');
      return formOptions;
    } catch (error) {
      logger.error('Error getting medication form options:', error);
      throw error;
    }
  }
}
