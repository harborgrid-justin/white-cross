import { Injectable, Logger } from '@nestjs/common';
import { Op } from 'sequelize';
import { MedicationEntity } from './entities';
import { ListMedicationsQueryDto } from './dto';

/**
 * Medication Repository
 *
 * Provides database access layer for medication operations using Sequelize ORM.
 * Implements CRUD operations with proper filtering, pagination, and search functionality.
 *
 * This repository directly uses the Sequelize models from the backend/src/database/models
 * to interact with the medications table. In the future, this should be migrated to use
 * TypeORM or NestJS-native Sequelize integration.
 *
 * Security:
 * - All queries are parameterized to prevent SQL injection
 * - Soft delete pattern preserves audit trail
 *
 * HIPAA Compliance:
 * - All medication data is PHI
 * - Caller must ensure proper audit logging
 */
@Injectable()
export class MedicationRepository {
  private readonly logger = new Logger(MedicationRepository.name);

  /**
   * Get Sequelize Medication model
   * Imports dynamically to avoid circular dependencies
   */
  private async getMedicationModel() {
    const { Medication } = await import('../../../backend/src/database/models');
    return Medication;
  }

  /**
   * Get Sequelize Student model for joins
   */
  private async getStudentModel() {
    const { Student } = await import('../../../backend/src/database/models');
    return Student;
  }

  /**
   * Find all medications with pagination and filtering
   */
  async findAll(
    query: ListMedicationsQueryDto,
  ): Promise<{ medications: any[]; total: number }> {
    try {
      const Medication = await this.getMedicationModel();
      const Student = await this.getStudentModel();

      const { page = 1, limit = 20, search, studentId, isActive } = query;
      const offset = (page - 1) * limit;

      const where: any = {};

      // Search by medication name
      if (search) {
        where.name = { [Op.iLike]: `%${search}%` };
      }

      // Filter by student
      if (studentId) {
        where.studentId = studentId;
      }

      // Filter by active status
      if (isActive !== undefined) {
        where.status = isActive ? 'ACTIVE' : { [Op.ne]: 'ACTIVE' };
      }

      const { rows: medications, count: total } =
        await Medication.findAndCountAll({
          where,
          offset,
          limit,
          include: [
            {
              model: Student,
              as: 'student',
              attributes: ['id', 'firstName', 'lastName'],
              required: false,
            },
          ],
          order: [['createdAt', 'DESC']],
          distinct: true,
        });

      this.logger.log(
        `Found ${total} medications (page ${page}, limit ${limit})`,
      );
      return { medications, total };
    } catch (error) {
      this.logger.error('Error finding medications:', error);
      throw error;
    }
  }

  /**
   * Find a medication by ID
   */
  async findById(id: string): Promise<any | null> {
    try {
      const Medication = await this.getMedicationModel();
      const Student = await this.getStudentModel();

      const medication = await Medication.findByPk(id, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName'],
            required: false,
          },
        ],
      });

      if (medication) {
        this.logger.log(`Found medication: ${id}`);
      } else {
        this.logger.warn(`Medication not found: ${id}`);
      }

      return medication;
    } catch (error) {
      this.logger.error(`Error finding medication ${id}:`, error);
      throw error;
    }
  }

  /**
   * Find all medications for a specific student
   */
  async findByStudent(
    studentId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ medications: any[]; total: number }> {
    try {
      const Medication = await this.getMedicationModel();
      const Student = await this.getStudentModel();

      const offset = (page - 1) * limit;

      const { rows: medications, count: total } =
        await Medication.findAndCountAll({
          where: { studentId },
          offset,
          limit,
          include: [
            {
              model: Student,
              as: 'student',
              attributes: ['id', 'firstName', 'lastName'],
              required: false,
            },
          ],
          order: [['createdAt', 'DESC']],
          distinct: true,
        });

      this.logger.log(
        `Found ${total} medications for student ${studentId} (page ${page}, limit ${limit})`,
      );
      return { medications, total };
    } catch (error) {
      this.logger.error(
        `Error finding medications for student ${studentId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Create a new medication
   */
  async create(data: any): Promise<any> {
    try {
      const Medication = await this.getMedicationModel();

      // Map DTO fields to model fields
      const medicationData = {
        name: data.medicationName,
        dosage: data.dosage,
        frequency: data.frequency,
        route: data.route?.toUpperCase() || 'ORAL',
        prescribedBy: data.prescribedBy,
        startDate: data.startDate,
        endDate: data.endDate,
        instructions: data.instructions,
        notes: data.sideEffects,
        studentId: data.studentId,
        organizationId: data.organizationId || 'default-org-id', // TODO: Get from context
        status: data.isActive === false ? 'DISCONTINUED' : 'ACTIVE',
      };

      const medication = await Medication.create(medicationData);

      this.logger.log(`Created medication: ${medication.id}`);
      return medication;
    } catch (error) {
      this.logger.error('Error creating medication:', error);
      throw error;
    }
  }

  /**
   * Update an existing medication
   */
  async update(id: string, data: any): Promise<any> {
    try {
      const Medication = await this.getMedicationModel();

      const medication = await Medication.findByPk(id);
      if (!medication) {
        throw new Error('Medication not found');
      }

      // Map DTO fields to model fields
      const updateData: any = {};

      if (data.medicationName !== undefined) {
        updateData.name = data.medicationName;
      }
      if (data.dosage !== undefined) {
        updateData.dosage = data.dosage;
      }
      if (data.frequency !== undefined) {
        updateData.frequency = data.frequency;
      }
      if (data.route !== undefined) {
        updateData.route = data.route.toUpperCase();
      }
      if (data.prescribedBy !== undefined) {
        updateData.prescribedBy = data.prescribedBy;
      }
      if (data.startDate !== undefined) {
        updateData.startDate = data.startDate;
      }
      if (data.endDate !== undefined) {
        updateData.endDate = data.endDate;
      }
      if (data.instructions !== undefined) {
        updateData.instructions = data.instructions;
      }
      if (data.sideEffects !== undefined) {
        updateData.notes = data.sideEffects;
      }
      if (data.isActive !== undefined) {
        updateData.status = data.isActive ? 'ACTIVE' : 'DISCONTINUED';
      }

      await medication.update(updateData);

      this.logger.log(`Updated medication: ${id}`);
      return medication;
    } catch (error) {
      this.logger.error(`Error updating medication ${id}:`, error);
      throw error;
    }
  }

  /**
   * Deactivate a medication (soft delete)
   */
  async deactivate(
    id: string,
    reason: string,
    deactivationType: string,
  ): Promise<any> {
    try {
      const Medication = await this.getMedicationModel();

      const medication = await Medication.findByPk(id);
      if (!medication) {
        throw new Error('Medication not found');
      }

      await medication.update({
        status: 'DISCONTINUED',
        endDate: new Date(),
        notes: medication.notes
          ? `${medication.notes}\n\nDeactivated: ${reason} (${deactivationType})`
          : `Deactivated: ${reason} (${deactivationType})`,
      });

      this.logger.log(
        `Deactivated medication: ${id} - Reason: ${reason} (${deactivationType})`,
      );
      return medication;
    } catch (error) {
      this.logger.error(`Error deactivating medication ${id}:`, error);
      throw error;
    }
  }

  /**
   * Activate a medication (restore from soft delete)
   */
  async activate(id: string): Promise<any> {
    try {
      const Medication = await this.getMedicationModel();

      const medication = await Medication.findByPk(id);
      if (!medication) {
        throw new Error('Medication not found');
      }

      await medication.update({
        status: 'ACTIVE',
        endDate: null,
      });

      this.logger.log(`Activated medication: ${id}`);
      return medication;
    } catch (error) {
      this.logger.error(`Error activating medication ${id}:`, error);
      throw error;
    }
  }

  /**
   * Check if medication exists
   */
  async exists(id: string): Promise<boolean> {
    try {
      const Medication = await this.getMedicationModel();
      const count = await Medication.count({ where: { id } });
      return count > 0;
    } catch (error) {
      this.logger.error(`Error checking medication existence ${id}:`, error);
      throw error;
    }
  }
}
