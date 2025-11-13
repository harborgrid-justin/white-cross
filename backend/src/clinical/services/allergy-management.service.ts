/**
 * @fileoverview Allergy Management Service
 * @module clinical/services
 * @description Service for managing student drug allergies
 */

import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StudentDrugAllergy } from '../entities/student-drug-allergy.entity';
import { DrugCatalogService } from './drug-catalog.service';
import { AddAllergyDto, UpdateAllergyDto } from '../types/drug-interaction.types';

import { BaseService } from '@/common/base';
@Injectable()
export class AllergyManagementService extends BaseService {
  constructor(
    @InjectModel(StudentDrugAllergy)
    private studentDrugAllergyModel: typeof StudentDrugAllergy,
    private readonly drugCatalogService: DrugCatalogService,
  ) {}

  /**
   * Add a student drug allergy
   */
  async addAllergy(data: AddAllergyDto): Promise<StudentDrugAllergy> {
    this.logInfo(`Adding allergy for student ${data.studentId}`);

    // Validate drug exists
    await this.drugCatalogService.getDrugById(data.drugId);

    // Check if allergy already exists
    const existing = await this.studentDrugAllergyModel.findOne({
      where: {
        studentId: data.studentId,
        drugId: data.drugId,
      },
    });

    if (existing) {
      throw new ConflictException(
        'Allergy already recorded for this student and drug',
      );
    }

    return this.studentDrugAllergyModel.create(data as any);
  }

  /**
   * Update student drug allergy
   */
  async updateAllergy(
    id: string,
    updates: UpdateAllergyDto,
  ): Promise<StudentDrugAllergy> {
    const allergy = await this.studentDrugAllergyModel.findByPk(id);

    if (!allergy) {
      throw new NotFoundException('Allergy not found');
    }

    Object.assign(allergy, updates);
    await allergy.save();
    return allergy;
  }

  /**
   * Delete student drug allergy
   */
  async deleteAllergy(id: string): Promise<void> {
    const deletedCount = await this.studentDrugAllergyModel.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      throw new NotFoundException('Allergy not found');
    }

    this.logInfo(`Deleted allergy ${id}`);
  }

  /**
   * Get all allergies for a student
   */
  async getStudentAllergies(studentId: string): Promise<StudentDrugAllergy[]> {
    return this.studentDrugAllergyModel.findAll({
      where: { studentId },
      include: [{ model: this.drugCatalogService['drugCatalogModel'], as: 'drug' }],
      order: [['diagnosedDate', 'DESC']],
    });
  }

  /**
   * Get allergy by ID
   */
  async getAllergyById(id: string): Promise<StudentDrugAllergy> {
    const allergy = await this.studentDrugAllergyModel.findByPk(id, {
      include: [{ model: this.drugCatalogService['drugCatalogModel'], as: 'drug' }],
    });

    if (!allergy) {
      throw new NotFoundException('Allergy not found');
    }

    return allergy;
  }

  /**
   * Get allergies by drug
   */
  async getAllergiesByDrug(drugId: string): Promise<StudentDrugAllergy[]> {
    return this.studentDrugAllergyModel.findAll({
      where: { drugId },
      include: [{ model: this.drugCatalogService['drugCatalogModel'], as: 'drug' }],
      order: [['diagnosedDate', 'DESC']],
    });
  }

  /**
   * Get allergies by severity
   */
  async getAllergiesBySeverity(severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING'): Promise<StudentDrugAllergy[]> {
    return this.studentDrugAllergyModel.findAll({
      where: { severity },
      include: [{ model: this.drugCatalogService['drugCatalogModel'], as: 'drug' }],
      order: [['diagnosedDate', 'DESC']],
    });
  }

  /**
   * Get critical allergies (severe or life-threatening)
   */
  async getCriticalAllergies(): Promise<StudentDrugAllergy[]> {
    return this.studentDrugAllergyModel.findAll({
      where: {
        severity: ['SEVERE', 'LIFE_THREATENING'],
      },
      include: [{ model: this.drugCatalogService['drugCatalogModel'], as: 'drug' }],
      order: [['diagnosedDate', 'DESC']],
    });
  }

  /**
   * Check if student has allergy to specific drug
   */
  async studentHasAllergyToDrug(studentId: string, drugId: string): Promise<boolean> {
    const allergy = await this.studentDrugAllergyModel.findOne({
      where: {
        studentId,
        drugId,
      },
    });

    return !!allergy;
  }

  /**
   * Get allergy statistics
   */
  async getAllergyStatistics(): Promise<{
    totalAllergies: number;
    bySeverity: Record<string, number>;
    byDrug: Array<{ drugId: string; drugName: string; allergyCount: number }>;
    byStudent: Array<{ studentId: string; allergyCount: number }>;
  }> {
    const allergies = await this.studentDrugAllergyModel.findAll({
      include: [{ model: this.drugCatalogService['drugCatalogModel'], as: 'drug' }],
    });

    const bySeverity: Record<string, number> = {};
    const drugCounts = new Map<string, { drugId: string; drugName: string; count: number }>();
    const studentCounts = new Map<string, number>();

    for (const allergy of allergies) {
      // Count by severity
      bySeverity[allergy.severity] = (bySeverity[allergy.severity] || 0) + 1;

      // Count by drug
      if (allergy.drug) {
        const drugKey = allergy.drugId;
        const existing = drugCounts.get(drugKey);
        if (existing) {
          existing.count++;
        } else {
          drugCounts.set(drugKey, {
            drugId: allergy.drugId,
            drugName: allergy.drug.genericName,
            count: 1,
          });
        }
      }

      // Count by student
      const studentKey = allergy.studentId;
      studentCounts.set(studentKey, (studentCounts.get(studentKey) || 0) + 1);
    }

    const byDrug = Array.from(drugCounts.values())
      .sort((a, b) => b.count - a.count)
      .map(item => ({
        drugId: item.drugId,
        drugName: item.drugName,
        allergyCount: item.count,
      }));

    const byStudent = Array.from(studentCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .map(([studentId, count]) => ({
        studentId,
        allergyCount: count,
      }));

    return {
      totalAllergies: allergies.length,
      bySeverity,
      byDrug,
      byStudent,
    };
  }

  /**
   * Bulk update allergy severity for a drug
   */
  async bulkUpdateAllergySeverity(
    drugId: string,
    oldSeverity: string,
    newSeverity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING',
  ): Promise<number> {
    const [affectedRows] = await this.studentDrugAllergyModel.update(
      { severity: newSeverity },
      {
        where: {
          drugId,
          severity: oldSeverity,
        },
      },
    );

    this.logInfo(`Updated ${affectedRows} allergies for drug ${drugId} from ${oldSeverity} to ${newSeverity}`);
    return affectedRows;
  }

  /**
   * Remove all allergies for a student
   */
  async removeAllStudentAllergies(studentId: string): Promise<number> {
    const deletedCount = await this.studentDrugAllergyModel.destroy({
      where: { studentId },
    });

    this.logInfo(`Removed ${deletedCount} allergies for student ${studentId}`);
    return deletedCount;
  }

  /**
   * Get allergies diagnosed within date range
   */
  async getAllergiesByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<StudentDrugAllergy[]> {
    return this.studentDrugAllergyModel.findAll({
      where: {
        diagnosedDate: {
          [this.studentDrugAllergyModel.sequelize!.Op.between]: [startDate, endDate],
        },
      },
      include: [{ model: this.drugCatalogService['drugCatalogModel'], as: 'drug' }],
      order: [['diagnosedDate', 'DESC']],
    });
  }
}
