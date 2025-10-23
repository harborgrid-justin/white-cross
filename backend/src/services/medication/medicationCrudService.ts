/**
 * LOC: 7359200817-CRUD
 * WC-SVC-MED-CRUD | Medication CRUD Operations Service
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - models (database/models)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/medication/index.ts)
 */

/**
 * WC-SVC-MED-CRUD | Medication CRUD Operations Service
 * Purpose: Core medication CRUD operations - Create, Read, Update, Delete
 * Upstream: database/models/Medication | Dependencies: Sequelize
 * Downstream: MedicationService | Called by: Medication service index
 * Related: medicationValidators.ts
 * Exports: MedicationCrudService class | Key Services: CRUD operations
 * Last Updated: 2025-10-18 | Dependencies: sequelize
 * Critical Path: Validation → Database operation → Response
 * LLM Context: HIPAA-compliant medication data management
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { Medication, MedicationInventory, StudentMedication, sequelize } from '../../database/models';
import { CreateMedicationData } from './types';

export class MedicationCrudService {
  /**
   * Get all medications with pagination and search
   */
  static async getMedications(page: number = 1, limit: number = 20, search?: string) {
    try {
      const offset = (page - 1) * limit;

      const whereClause: any = {};
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { genericName: { [Op.iLike]: `%${search}%` } },
          { manufacturer: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { rows: medications, count: total } = await Medication.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        include: [
          {
            model: MedicationInventory,
            as: 'inventory',
            attributes: ['id', 'quantity', 'expirationDate', 'reorderLevel', 'supplier']
          },
          {
            model: StudentMedication,
            as: 'studentMedications',
            attributes: []
          }
        ],
        attributes: {
          include: [
            [
              sequelize.literal('(SELECT COUNT(*) FROM "StudentMedications" WHERE "StudentMedications"."medicationId" = "Medication"."id")'),
              'studentMedicationCount'
            ]
          ]
        },
        order: [['name', 'ASC']],
        distinct: true
      });

      return {
        medications,
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
   * Create new medication with validation
   */
  static async createMedication(data: CreateMedicationData) {
    try {
      // Check if medication with same name and strength exists
      const existingMedication = await Medication.findOne({
        where: {
          name: data.name,
          strength: data.strength,
          dosageForm: data.dosageForm
        }
      });

      if (existingMedication) {
        throw new Error('Medication with same name, strength, and dosage form already exists');
      }

      // Check NDC uniqueness if provided
      if (data.ndc) {
        const existingNDC = await Medication.findOne({
          where: { ndc: data.ndc }
        });

        if (existingNDC) {
          throw new Error('Medication with this NDC already exists');
        }
      }

      const medication = await Medication.create(data);

      // Reload with associations
      await medication.reload({
        include: [
          {
            model: MedicationInventory,
            as: 'inventory'
          },
          {
            model: StudentMedication,
            as: 'studentMedications',
            attributes: []
          }
        ],
        attributes: {
          include: [
            [
              sequelize.literal('(SELECT COUNT(*) FROM "StudentMedications" WHERE "StudentMedications"."medicationId" = "Medication"."id")'),
              'studentMedicationCount'
            ]
          ]
        }
      });

      logger.info(`Medication created: ${medication.name} ${medication.strength}`);
      return medication;
    } catch (error) {
      logger.error('Error creating medication:', error);
      throw error;
    }
  }

  /**
   * Get medication form options and reference data
   * Now uses centralized constants from medicationConstants.ts
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
      const allForms = [...new Set([
        ...MEDICATION_DOSAGE_FORMS,
        ...existingForms.map((f: any) => f.dosageForm).filter(Boolean)
      ])].sort();

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
