/**
 * @fileoverview Vaccination Service
 * @module health-record/vaccination
 * @description CDC-compliant vaccination record management with CVX validation,
 * dose tracking, series completion, compliance status, and PHI protection.
 *
 * HIPAA Compliance: All vaccination data is PHI and requires audit logging
 * CDC Compliance: CVX codes, dose tracking, VIS documentation, compliance monitoring
 */

import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { InjectModel } from '@nestjs/sequelize';
import { Vaccination   } from '@/database/models';
import { Student   } from '@/database/models';
import { VaccinationScheduleHelper } from './vaccination-schedule.helper';
import { VaccinationComplianceHelper } from './vaccination-compliance.helper';
import { VaccinationCrudHelper } from './vaccination-crud.helper';
import {
  ComplianceReport,
  DueVaccinationsResponse,
  ComplianceReportQuery,
  ComplianceReportResponse,
} from './vaccination-compliance.interfaces';
import {
  CDCScheduleQuery,
  CDCScheduleResponse,
  DoseScheduleResponse,
} from './vaccination-schedule.helper';
import {
  CreateVaccinationDto,
  UpdateVaccinationDto,
  CreateExemptionDto,
  BatchImportResult,
} from './vaccination.dto';

@Injectable()
export class VaccinationService extends BaseService {
  constructor(
    @InjectModel(Vaccination)
    private readonly vaccinationModel: typeof Vaccination,
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    private readonly scheduleHelper: VaccinationScheduleHelper,
    private readonly complianceHelper: VaccinationComplianceHelper,
    private readonly crudHelper: VaccinationCrudHelper,
  ) {}

  /**
   * Add vaccination with CVX validation, dose tracking, and audit logging
   */
  async addVaccination(data: CreateVaccinationDto): Promise<Vaccination> {
    this.logInfo(`Adding vaccination for student ${data.studentId}`);

    const student = await this.studentModel.findByPk(data.studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (data.cvxCode && !this.complianceHelper.validateCVXCode(data.cvxCode)) {
      this.logWarning(`Invalid CVX code provided: ${data.cvxCode}`);
    }

    const seriesComplete =
      data.doseNumber && data.totalDoses
        ? data.doseNumber >= data.totalDoses
        : false;

    let nextDueDate: Date | null = null;
    if (!seriesComplete && data.doseNumber && data.totalDoses) {
      nextDueDate = this.scheduleHelper.calculateNextDueDate(
        data.administrationDate,
        data.vaccineType || null,
        data.doseNumber,
      );
    }

    const complianceStatus = this.complianceHelper.determineComplianceStatus(
      data.administrationDate,
      nextDueDate,
      seriesComplete,
      data.exemptionStatus || false,
    );

    const vaccination = this.vaccinationModel.build({
      ...data,
      seriesComplete,
      nextDueDate,
      complianceStatus,
    });

    const savedVaccination = await vaccination.save();
    const vaccinationWithRelations = await this.vaccinationModel.findByPk(
      savedVaccination.id,
      { include: ['student'] },
    );

    this.logInfo(
      `PHI Created: Vaccination ${data.vaccineName} (CVX: ${data.cvxCode || 'N/A'}) for student ${student.firstName} ${student.lastName}, dose ${data.doseNumber || 'N/A'}/${data.totalDoses || 'N/A'}`,
    );

    if (data.adverseEvents || data.reactions) {
      this.logWarning(
        `Adverse event reported for vaccination ${vaccinationWithRelations?.id}: ${data.reactions || JSON.stringify(data.adverseEvents)}`,
      );
    }

    if (!vaccinationWithRelations) {
      throw new Error('Failed to reload vaccination after creation');
    }

    return vaccinationWithRelations;
  }

  /**
   * Get vaccination history for student
   */
  async getVaccinationHistory(studentId: string): Promise<Vaccination[]> {
    const student = await this.studentModel.findByPk(studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const vaccinations = await this.vaccinationModel.findAll({
      where: { studentId },
      include: ['student'],
      order: [['administrationDate', 'DESC']],
    });

    this.logInfo(
      `PHI Access: Vaccination history retrieved for student ${studentId} (${student.firstName} ${student.lastName}), count: ${vaccinations.length}`,
    );

    return vaccinations;
  }

  /**
   * Check vaccination compliance status
   */
  async checkComplianceStatus(studentId: string): Promise<ComplianceReport> {
    return this.complianceHelper.checkComplianceStatus(studentId);
  }

  /**
   * Update vaccination record
   */
  async updateVaccination(
    id: string,
    data: UpdateVaccinationDto,
  ): Promise<Vaccination> {
    const existingVaccination = await this.vaccinationModel.findByPk(id, {
      include: ['student'],
    });

    if (!existingVaccination) {
      throw new NotFoundException('Vaccination not found');
    }

    if (data.cvxCode && !this.complianceHelper.validateCVXCode(data.cvxCode)) {
      this.logWarning(`Invalid CVX code provided: ${data.cvxCode}`);
    }

    if (data.doseNumber !== undefined || data.totalDoses !== undefined) {
      const doseNumber = data.doseNumber ?? existingVaccination.doseNumber;
      const totalDoses = data.totalDoses ?? existingVaccination.totalDoses;
      if (doseNumber && totalDoses) {
        data.seriesComplete = doseNumber >= totalDoses;

        if (!data.seriesComplete) {
          const adminDate =
            data.administrationDate ?? existingVaccination.administrationDate;
          data.nextDueDate = this.scheduleHelper.calculateNextDueDate(
            adminDate,
            (data.vaccineType ?? existingVaccination.vaccineType) || null,
            doseNumber,
          );
        } else {
          data.nextDueDate = null;
        }
      }
    }

    if (
      data.nextDueDate !== undefined ||
      data.seriesComplete !== undefined ||
      data.exemptionStatus !== undefined
    ) {
      const adminDate =
        data.administrationDate ?? existingVaccination.administrationDate;
      const nextDueDate = data.nextDueDate ?? existingVaccination.nextDueDate;
      const seriesComplete =
        data.seriesComplete ?? existingVaccination.seriesComplete;
      const exemptionStatus =
        data.exemptionStatus ?? existingVaccination.exemptionStatus;

      data.complianceStatus = this.complianceHelper.determineComplianceStatus(
        adminDate,
        nextDueDate,
        seriesComplete,
        exemptionStatus,
      );
    }

    Object.assign(existingVaccination, data);
    const updatedVaccination = await existingVaccination.save();

    const vaccinationWithRelations = await this.vaccinationModel.findByPk(
      updatedVaccination.id,
      { include: ['student'] },
    );

    if (!vaccinationWithRelations) {
      throw new Error('Failed to reload vaccination after update');
    }

    this.logInfo(
      `PHI Modified: Vaccination ${vaccinationWithRelations.vaccineName} updated for student ${vaccinationWithRelations.student?.firstName ?? 'Unknown'} ${vaccinationWithRelations.student?.lastName ?? 'Unknown'}`,
    );

    return vaccinationWithRelations;
  }

  /**
   * Delete vaccination record
   */
  async deleteVaccination(id: string): Promise<{ success: boolean }> {
    const vaccination = await this.vaccinationModel.findByPk(id, {
      include: ['student'],
    });

    if (!vaccination) {
      throw new NotFoundException('Vaccination not found');
    }

    await vaccination.destroy();

    this.logWarning(
      `Vaccination deleted: ${vaccination.vaccineName} for ${vaccination.student?.firstName ?? 'Unknown'} ${vaccination.student?.lastName ?? 'Unknown'}`,
    );

    return { success: true };
  }

  /**
   * Get overdue vaccinations
   */
  async getOverdueVaccinations(limit: number = 100): Promise<Vaccination[]> {
    return this.crudHelper.getOverdueVaccinations(limit);
  }

  /**
   * Get due vaccinations
   */
  async getDueVaccinations(
    studentId: string,
  ): Promise<DueVaccinationsResponse> {
    return this.complianceHelper.getDueVaccinations(studentId);
  }

  /**
   * Get overdue vaccinations for student
   */
  async getOverdueVaccinationsForStudent(
    studentId: string,
  ): Promise<DueVaccinationsResponse> {
    return this.complianceHelper.getOverdueVaccinationsForStudent(studentId);
  }

  /**
   * Batch import vaccinations
   */
  async batchImport(
    vaccinations: CreateVaccinationDto[],
  ): Promise<BatchImportResult> {
    this.logInfo(`Batch importing ${vaccinations.length} vaccinations`);

    const results: BatchImportResult = {
      successCount: 0,
      errorCount: 0,
      importedIds: [],
      errors: [],
    };

    for (const vaccinationData of vaccinations) {
      try {
        const vaccination = await this.addVaccination(vaccinationData);
        results.successCount++;
        results.importedIds.push(vaccination.id);
      } catch (error) {
        results.errorCount++;
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        results.errors.push(
          `Failed to import vaccination for student ${vaccinationData.studentId}: ${errorMessage}`,
        );
        this.logError(`Batch import error: ${errorMessage}`);
      }
    }

    this.logInfo(
      `Batch import completed: ${results.successCount} successful, ${results.errorCount} failed`,
    );

    return results;
  }

  /**
   * Get CDC vaccination schedule
   */
  getCDCSchedule(query: CDCScheduleQuery): CDCScheduleResponse {
    return this.scheduleHelper.getCDCSchedule(query);
  }

  /**
   * Create vaccination exemption
   */
  async createExemption(
    studentId: string,
    exemptionDto: CreateExemptionDto,
  ): Promise<Vaccination> {
    return this.crudHelper.createExemption(studentId, exemptionDto);
  }

  /**
   * Get compliance report
   */
  async getComplianceReport(
    query: ComplianceReportQuery,
  ): Promise<ComplianceReportResponse> {
    return this.complianceHelper.getComplianceReport(query);
  }

  /**
   * Get dose schedule
   */
  getDoseSchedule(
    vaccineType: string,
    currentDose: number,
  ): DoseScheduleResponse {
    return this.scheduleHelper.getDoseSchedule(vaccineType, currentDose);
  }
}
