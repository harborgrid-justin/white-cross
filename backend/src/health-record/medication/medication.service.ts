import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Medication   } from "../../database/models";
import { HealthRecordCreateMedicationDto } from './dto/create-medication.dto';
import { UpdateHealthRecordMedicationDto } from './dto/update-medication.dto';
import { Op } from 'sequelize';

import { BaseService } from '@/common/base';
@Injectable()
export class MedicationService extends BaseService {
  constructor(
    @InjectModel(Medication)
    private readonly medicationModel: typeof Medication,
  ) {}

  /**
   * Create a new medication
   */
  async create(
    createDto: HealthRecordCreateMedicationDto,
  ): Promise<Medication> {
    // Check if medication with same NDC already exists
    if (createDto.ndc) {
      const existing = await this.medicationModel.findOne({
        where: { ndc: createDto.ndc, isActive: true },
      });
      if (existing) {
        throw new ConflictException(
          `Medication with NDC ${createDto.ndc} already exists`,
        );
      }
    }

    return this.medicationModel.create(createDto as any);
  }

  /**
   * Find all medications with optional filtering
   */
  async findAll(options?: {
    isActive?: boolean;
    isControlled?: boolean;
    search?: string;
  }): Promise<Medication[]> {
    const where: any = {};

    if (options?.isActive !== undefined) {
      where.isActive = options.isActive;
    }

    if (options?.isControlled !== undefined) {
      where.isControlled = options.isControlled;
    }

    if (options?.search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${options.search}%` } },
        { genericName: { [Op.iLike]: `%${options.search}%` } },
        { manufacturer: { [Op.iLike]: `%${options.search}%` } },
      ];
    }

    return this.medicationModel.findAll({
      where,
      order: [['name', 'ASC']],
    });
  }

  /**
   * Find medication by ID
   */
  async findById(id: string): Promise<Medication> {
    const medication = await this.medicationModel.findByPk(id);
    if (!medication) {
      throw new NotFoundException(`Medication with ID ${id} not found`);
    }
    return medication;
  }

  /**
   * Update medication
   */
  async update(
    id: string,
    updateDto: UpdateHealthRecordMedicationDto,
  ): Promise<Medication> {
    const medication = await this.findById(id);

    // Check NDC uniqueness if being updated
    if (updateDto.ndc && updateDto.ndc !== medication.ndc) {
      const existing = await this.medicationModel.findOne({
        where: { ndc: updateDto.ndc, isActive: true, id: { [Op.ne]: id } },
      });
      if (existing) {
        throw new ConflictException(
          `Medication with NDC ${updateDto.ndc} already exists`,
        );
      }
    }

    await medication.update(updateDto);
    return medication;
  }

  /**
   * Soft delete medication (deactivate)
   */
  async deactivate(id: string, deletedBy: string): Promise<void> {
    const medication = await this.findById(id);
    await medication.update({
      isActive: false,
      deletedAt: new Date(),
      deletedBy,
    });
  }

  /**
   * Reactivate medication
   */
  async reactivate(id: string): Promise<Medication> {
    const medication = await this.findById(id);
    const updateData: any = {
      isActive: true,
    };

    // Only set deletedAt and deletedBy to null if they were set
    if (medication.deletedAt) {
      updateData.deletedAt = null;
    }
    if (medication.deletedBy) {
      updateData.deletedBy = null;
    }

    await medication.update(updateData);
    return medication;
  }

  /**
   * Get controlled substances
   */
  async getControlledSubstances(): Promise<Medication[]> {
    return this.medicationModel.findAll({
      where: {
        isControlled: true,
        isActive: true,
      },
      order: [
        ['deaSchedule', 'ASC'],
        ['name', 'ASC'],
      ],
    });
  }

  /**
   * Get medications requiring witness
   */
  async getWitnessRequiredMedications(): Promise<Medication[]> {
    return this.medicationModel.findAll({
      where: {
        requiresWitness: true,
        isActive: true,
      },
      order: [['name', 'ASC']],
    });
  }
}
