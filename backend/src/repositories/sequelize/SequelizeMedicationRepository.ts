/**
 * Sequelize Medication Repository Implementation
 * @description Concrete implementation of IMedicationRepository using Sequelize ORM
 * Implements all interface methods with proper Sequelize queries
 */

import { Op } from 'sequelize';
import {
  IMedicationRepository,
  Medication as MedicationEntity,
  MedicationFilters,
  CreateMedicationData,
  UpdateMedicationData
} from '../interfaces/IMedicationRepository';
import { RepositoryOptions } from '../interfaces/IRepository';
import { Medication, MedicationInventory } from '../../database/models';

/**
 * Sequelize-specific implementation of the Medication Repository
 */
export class SequelizeMedicationRepository implements IMedicationRepository {
  /**
   * Find a medication by its unique identifier
   */
  async findById(id: string, options?: RepositoryOptions): Promise<MedicationEntity | null> {
    const medication = await Medication.findByPk(id, {
      include: options?.include,
      attributes: options?.attributes,
      transaction: options?.transaction,
      raw: options?.raw
    });

    return medication ? this.toEntity(medication) : null;
  }

  /**
   * Find all medications matching the given filters
   */
  async findAll(filters?: MedicationFilters, options?: RepositoryOptions): Promise<MedicationEntity[]> {
    const where: any = {};

    if (filters) {
      if (filters.name) {
        where.name = { [Op.like]: `%${filters.name}%` };
      }
      if (filters.dosageForm) {
        where.dosageForm = filters.dosageForm;
      }
      if (filters.manufacturer) {
        where.manufacturer = { [Op.like]: `%${filters.manufacturer}%` };
      }
      if (filters.controlledSubstance !== undefined) {
        where.controlledSubstance = filters.controlledSubstance;
      }
      if (filters.requiresRefrigeration !== undefined) {
        where.requiresRefrigeration = filters.requiresRefrigeration;
      }
      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
      }
      if (filters.scheduleClass) {
        where.scheduleClass = filters.scheduleClass;
      }
    }

    const medications = await Medication.findAll({
      where,
      include: options?.include,
      attributes: options?.attributes,
      order: options?.order || [['name', 'ASC']],
      transaction: options?.transaction,
      raw: options?.raw
    });

    return medications.map(med => this.toEntity(med));
  }

  /**
   * Find a single medication matching the given filters
   */
  async findOne(filters: any, options?: RepositoryOptions): Promise<MedicationEntity | null> {
    const medication = await Medication.findOne({
      where: filters,
      include: options?.include,
      attributes: options?.attributes,
      transaction: options?.transaction,
      raw: options?.raw
    });

    return medication ? this.toEntity(medication) : null;
  }

  /**
   * Create a new medication
   */
  async create(data: CreateMedicationData, options?: RepositoryOptions): Promise<MedicationEntity> {
    const medication = await Medication.create(data as any, {
      transaction: options?.transaction
    });

    return this.toEntity(medication);
  }

  /**
   * Update an existing medication
   */
  async update(id: string, data: UpdateMedicationData, options?: RepositoryOptions): Promise<MedicationEntity> {
    const medication = await Medication.findByPk(id, {
      transaction: options?.transaction
    });

    if (!medication) {
      throw new Error(`Medication with id ${id} not found`);
    }

    await medication.update(data as any, {
      transaction: options?.transaction
    });

    return this.toEntity(medication);
  }

  /**
   * Delete a medication by ID (soft delete - sets isActive to false)
   */
  async delete(id: string, options?: RepositoryOptions): Promise<void> {
    const medication = await Medication.findByPk(id, {
      transaction: options?.transaction
    });

    if (!medication) {
      throw new Error(`Medication with id ${id} not found`);
    }

    await medication.update(
      { isActive: false } as any,
      { transaction: options?.transaction }
    );
  }

  /**
   * Count medications matching the given filters
   */
  async count(filters?: MedicationFilters): Promise<number> {
    const where: any = {};

    if (filters) {
      if (filters.name) {
        where.name = { [Op.like]: `%${filters.name}%` };
      }
      if (filters.dosageForm) {
        where.dosageForm = filters.dosageForm;
      }
      if (filters.manufacturer) {
        where.manufacturer = { [Op.like]: `%${filters.manufacturer}%` };
      }
      if (filters.controlledSubstance !== undefined) {
        where.controlledSubstance = filters.controlledSubstance;
      }
      if (filters.requiresRefrigeration !== undefined) {
        where.requiresRefrigeration = filters.requiresRefrigeration;
      }
      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
      }
      if (filters.scheduleClass) {
        where.scheduleClass = filters.scheduleClass;
      }
    }

    return await Medication.count({ where });
  }

  /**
   * Find medications with pagination
   */
  async findWithPagination(
    page: number,
    limit: number,
    filters?: MedicationFilters,
    options?: RepositoryOptions
  ): Promise<{ rows: MedicationEntity[]; count: number }> {
    const offset = (page - 1) * limit;
    const where: any = {};

    if (filters) {
      if (filters.name) {
        where.name = { [Op.like]: `%${filters.name}%` };
      }
      if (filters.dosageForm) {
        where.dosageForm = filters.dosageForm;
      }
      if (filters.manufacturer) {
        where.manufacturer = { [Op.like]: `%${filters.manufacturer}%` };
      }
      if (filters.controlledSubstance !== undefined) {
        where.controlledSubstance = filters.controlledSubstance;
      }
      if (filters.requiresRefrigeration !== undefined) {
        where.requiresRefrigeration = filters.requiresRefrigeration;
      }
      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
      }
      if (filters.scheduleClass) {
        where.scheduleClass = filters.scheduleClass;
      }
    }

    const { rows, count } = await Medication.findAndCountAll({
      where,
      limit,
      offset,
      include: options?.include,
      attributes: options?.attributes,
      order: options?.order || [['name', 'ASC']],
      transaction: options?.transaction
    });

    return {
      rows: rows.map(med => this.toEntity(med)),
      count
    };
  }

  /**
   * Find medication by NDC (National Drug Code)
   */
  async findByNDC(ndc: string, options?: RepositoryOptions): Promise<MedicationEntity | null> {
    const medication = await Medication.findOne({
      where: { ndc },
      transaction: options?.transaction
    });

    return medication ? this.toEntity(medication) : null;
  }

  /**
   * Find all active medications with inventory data
   */
  async findActiveWithInventory(options?: RepositoryOptions): Promise<MedicationEntity[]> {
    const medications = await Medication.findAll({
      where: { isActive: true },
      include: [
        {
          model: MedicationInventory,
          as: 'inventory',
          required: false
        }
      ],
      order: [['name', 'ASC']],
      transaction: options?.transaction
    });

    return medications.map(med => this.toEntity(med));
  }

  /**
   * Find medications expiring within specified days
   */
  async findExpiringSoon(days: number, options?: RepositoryOptions): Promise<MedicationEntity[]> {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);

    const medications = await Medication.findAll({
      where: { isActive: true },
      include: [
        {
          model: MedicationInventory,
          as: 'inventory',
          required: true,
          where: {
            expirationDate: {
              [Op.lte]: expirationDate,
              [Op.gte]: new Date()
            },
            quantity: {
              [Op.gt]: 0
            }
          }
        }
      ],
      order: [['name', 'ASC']],
      transaction: options?.transaction
    });

    return medications.map(med => this.toEntity(med));
  }

  /**
   * Find medications by controlled substance schedule
   */
  async findByScheduleClass(scheduleClass: string, options?: RepositoryOptions): Promise<MedicationEntity[]> {
    const medications = await Medication.findAll({
      where: {
        controlledSubstance: true,
        scheduleClass,
        isActive: true
      },
      order: [['name', 'ASC']],
      transaction: options?.transaction
    });

    return medications.map(med => this.toEntity(med));
  }

  /**
   * Search medications by name (partial match)
   */
  async searchByName(query: string, limit: number = 20, options?: RepositoryOptions): Promise<MedicationEntity[]> {
    const medications = await Medication.findAll({
      where: {
        name: {
          [Op.like]: `%${query}%`
        },
        isActive: true
      },
      limit,
      order: [['name', 'ASC']],
      transaction: options?.transaction
    });

    return medications.map(med => this.toEntity(med));
  }

  /**
   * Find medications requiring refrigeration
   */
  async findRefrigerationRequired(options?: RepositoryOptions): Promise<MedicationEntity[]> {
    const medications = await Medication.findAll({
      where: {
        requiresRefrigeration: true,
        isActive: true
      },
      order: [['name', 'ASC']],
      transaction: options?.transaction
    });

    return medications.map(med => this.toEntity(med));
  }

  /**
   * Find medications by dosage form
   */
  async findByDosageForm(dosageForm: string, options?: RepositoryOptions): Promise<MedicationEntity[]> {
    const medications = await Medication.findAll({
      where: {
        dosageForm,
        isActive: true
      },
      order: [['name', 'ASC']],
      transaction: options?.transaction
    });

    return medications.map(med => this.toEntity(med));
  }

  /**
   * Find medications by manufacturer
   */
  async findByManufacturer(manufacturer: string, options?: RepositoryOptions): Promise<MedicationEntity[]> {
    const medications = await Medication.findAll({
      where: {
        manufacturer: {
          [Op.like]: `%${manufacturer}%`
        },
        isActive: true
      },
      order: [['name', 'ASC']],
      transaction: options?.transaction
    });

    return medications.map(med => this.toEntity(med));
  }

  /**
   * Check if medication name already exists
   */
  async nameExists(name: string, excludeId?: string): Promise<boolean> {
    const where: any = { name };

    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }

    const count = await Medication.count({ where });
    return count > 0;
  }

  /**
   * Check if NDC already exists
   */
  async ndcExists(ndc: string, excludeId?: string): Promise<boolean> {
    const where: any = { ndc };

    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }

    const count = await Medication.count({ where });
    return count > 0;
  }

  /**
   * Convert Sequelize model instance to plain entity
   * @private
   */
  private toEntity(model: any): MedicationEntity {
    const plain = model.get({ plain: true });
    return {
      id: plain.id,
      name: plain.name,
      strength: plain.strength,
      dosageForm: plain.dosageForm,
      unit: plain.unit,
      ndc: plain.ndc,
      manufacturer: plain.manufacturer,
      requiresRefrigeration: plain.requiresRefrigeration,
      controlledSubstance: plain.controlledSubstance,
      scheduleClass: plain.scheduleClass,
      routeOfAdministration: plain.routeOfAdministration,
      warnings: plain.warnings,
      sideEffects: plain.sideEffects,
      contraindications: plain.contraindications,
      isActive: plain.isActive,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt
    };
  }
}
