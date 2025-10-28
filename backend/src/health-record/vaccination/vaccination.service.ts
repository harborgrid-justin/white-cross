/**
 * @fileoverview Vaccination Service
 * @module health-record/vaccination
 * @description CDC-compliant vaccination record management with CVX validation,
 * dose tracking, series completion, compliance status, and PHI protection.
 *
 * HIPAA Compliance: All vaccination data is PHI and requires audit logging
 * CDC Compliance: CVX codes, dose tracking, VIS documentation, compliance monitoring
 */

import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Vaccination } from './entities/vaccination.entity';
import { Student } from '../../student/entities/student.entity';

/**
 * CDC CVX Vaccine Codes (subset of commonly used codes)
 * Full list: https://www2a.cdc.gov/vaccines/iis/iisstandards/vaccines.asp?rpt=cvx
 */
const CDC_CVX_CODES: Record<string, string> = {
  '08': 'Hepatitis B',
  '10': 'Polio (IPV)',
  '20': 'DTaP',
  '21': 'Varicella',
  '03': 'MMR',
  '49': 'Hib',
  '33': 'Pneumococcal (PCV)',
  '83': 'Hepatitis A',
  '115': 'Tdap',
  '62': 'HPV',
  '141': 'Influenza',
  '208': 'COVID-19 (Pfizer)',
  '207': 'COVID-19 (Moderna)',
  '212': 'COVID-19 (Janssen)',
};

/**
 * Vaccination compliance requirements by grade (simplified)
 */
interface ComplianceRequirement {
  vaccineName: string;
  requiredDoses: number;
  ageRequirement?: number; // in months
}

const SCHOOL_REQUIREMENTS: ComplianceRequirement[] = [
  { vaccineName: 'DTaP', requiredDoses: 5 },
  { vaccineName: 'Polio', requiredDoses: 4 },
  { vaccineName: 'MMR', requiredDoses: 2 },
  { vaccineName: 'Hepatitis B', requiredDoses: 3 },
  { vaccineName: 'Varicella', requiredDoses: 2 },
  { vaccineName: 'Hib', requiredDoses: 4, ageRequirement: 60 }, // up to 5 years
];

@Injectable()
export class VaccinationService {
  private readonly logger = new Logger(VaccinationService.name);

  constructor(
    @InjectRepository(Vaccination)
    private readonly vaccinationRepository: Repository<Vaccination>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  /**
   * Add vaccination with CVX validation, dose tracking, and audit logging
   * @param data - Vaccination creation data
   * @returns Created vaccination record with associations
   */
  async addVaccination(data: any): Promise<Vaccination> {
    this.logger.log(`Adding vaccination for student ${data.studentId}`);

    // Verify student exists
    const student = await this.studentRepository.findOne({
      where: { id: data.studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Validate CVX code if provided
    if (data.cvxCode && !this.validateCVXCode(data.cvxCode)) {
      this.logger.warn(`Invalid CVX code provided: ${data.cvxCode}`);
      // Don't throw error, just log warning - allow manual entry
    }

    // Calculate series completion
    const seriesComplete =
      data.doseNumber && data.totalDoses
        ? data.doseNumber >= data.totalDoses
        : false;

    // Calculate next due date if series not complete
    let nextDueDate: Date | null = null;
    if (!seriesComplete && data.doseNumber && data.totalDoses) {
      nextDueDate = this.calculateNextDueDate(
        data.administrationDate,
        data.vaccineType,
        data.doseNumber,
      );
    }

    // Determine compliance status
    const complianceStatus = this.determineComplianceStatus(
      data.administrationDate,
      nextDueDate,
      seriesComplete,
      data.exemptionStatus,
    );

    // Create vaccination record
    const vaccination = this.vaccinationRepository.create({
      ...data,
      seriesComplete,
      nextDueDate,
      complianceStatus,
    });

    const savedVaccination = await this.vaccinationRepository.save(vaccination);

    // Reload with associations
    const vaccinationWithRelations = await this.vaccinationRepository.findOne({
      where: { id: (savedVaccination as any).id },
      relations: ['student'],
    });

    // PHI Creation Audit Log
    this.logger.log(
      `PHI Created: Vaccination ${data.vaccineName} (CVX: ${data.cvxCode || 'N/A'}) for student ${student.firstName} ${student.lastName}, dose ${data.doseNumber || 'N/A'}/${data.totalDoses || 'N/A'}`,
    );

    // Log critical adverse events
    if (data.adverseEvents || data.reactions) {
      this.logger.warn(
        `Adverse event reported for vaccination ${vaccinationWithRelations?.id}: ${data.reactions || JSON.stringify(data.adverseEvents)}`,
      );
    }

    if (!vaccinationWithRelations) {
      throw new Error('Failed to reload vaccination after creation');
    }

    return vaccinationWithRelations;
  }

  /**
   * Get vaccination history for student with full details
   * @param studentId - Student UUID
   * @returns Array of vaccinations ordered by administration date
   */
  async getVaccinationHistory(studentId: string): Promise<Vaccination[]> {
    // Verify student exists
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const vaccinations = await this.vaccinationRepository.find({
      where: { studentId },
      relations: ['student'],
      order: {
        administrationDate: 'DESC',
      },
    });

    // PHI Access Audit Log
    this.logger.log(
      `PHI Access: Vaccination history retrieved for student ${studentId} (${student.firstName} ${student.lastName}), count: ${vaccinations.length}`,
    );

    return vaccinations;
  }

  /**
   * Check vaccination compliance status for student
   * @param studentId - Student UUID
   * @returns Compliance report with missing/upcoming vaccinations
   */
  async checkComplianceStatus(studentId: string): Promise<any> {
    // Verify student exists
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Get all vaccinations for student
    const vaccinations = await this.vaccinationRepository.find({
      where: { studentId },
      order: { administrationDate: 'DESC' },
    });

    // Calculate student age in months
    const birthDate = new Date(student.dateOfBirth);
    const today = new Date();
    const ageInMonths =
      (today.getFullYear() - birthDate.getFullYear()) * 12 +
      (today.getMonth() - birthDate.getMonth());

    // Check each requirement
    const complianceReport = {
      studentId,
      studentName: `${student.firstName} ${student.lastName}`,
      ageInMonths,
      compliant: true,
      missing: [] as any[],
      upcoming: [] as any[],
      complete: [] as any[],
      exemptions: [] as any[],
    };

    // Check for exemptions
    const exemptedVaccinations = vaccinations.filter((v) => v.exemptionStatus);
    complianceReport.exemptions = exemptedVaccinations.map((v) => ({
      vaccineName: v.vaccineName,
      exemptionReason: v.exemptionReason,
    }));

    // Check each school requirement
    for (const requirement of SCHOOL_REQUIREMENTS) {
      // Skip if age requirement not met
      if (
        requirement.ageRequirement &&
        ageInMonths > requirement.ageRequirement
      ) {
        continue;
      }

      // Find matching vaccinations
      const matchingVaccines = vaccinations.filter(
        (v) =>
          v.vaccineName &&
          v.vaccineName.toLowerCase().includes(requirement.vaccineName.toLowerCase()) ||
          v.vaccineType &&
          requirement.vaccineName.toLowerCase().includes(v.vaccineType.toLowerCase()),
      );

      // Check if exemption exists
      const hasExemption = exemptedVaccinations.some(
        (v) =>
          v.vaccineName &&
          v.vaccineName.toLowerCase().includes(requirement.vaccineName.toLowerCase()),
      );

      if (hasExemption) {
        continue; // Skip if exempted
      }

      const completedDoses = matchingVaccines.length;

      if (completedDoses >= requirement.requiredDoses) {
        complianceReport.complete.push({
          vaccineName: requirement.vaccineName,
          requiredDoses: requirement.requiredDoses,
          completedDoses,
        });
      } else if (completedDoses === 0) {
        complianceReport.missing.push({
          vaccineName: requirement.vaccineName,
          requiredDoses: requirement.requiredDoses,
          completedDoses: 0,
          status: 'NOT_STARTED',
        });
        complianceReport.compliant = false;
      } else {
        // Partially complete - check if upcoming
        const latestVaccine = matchingVaccines[0];
        const isOverdue = latestVaccine.nextDueDate
          ? new Date() > latestVaccine.nextDueDate
          : false;

        if (isOverdue) {
          complianceReport.missing.push({
            vaccineName: requirement.vaccineName,
            requiredDoses: requirement.requiredDoses,
            completedDoses,
            nextDose: completedDoses + 1,
            dueDate: latestVaccine.nextDueDate,
            status: 'OVERDUE',
          });
          complianceReport.compliant = false;
        } else {
          complianceReport.upcoming.push({
            vaccineName: requirement.vaccineName,
            requiredDoses: requirement.requiredDoses,
            completedDoses,
            nextDose: completedDoses + 1,
            dueDate: latestVaccine.nextDueDate,
            status: 'IN_PROGRESS',
          });
        }
      }
    }

    // PHI Access Audit Log
    this.logger.log(
      `PHI Access: Compliance status checked for student ${studentId}, compliant: ${complianceReport.compliant}`,
    );

    return complianceReport;
  }

  /**
   * Update vaccination record with series tracking and compliance recalculation
   * @param id - Vaccination UUID
   * @param data - Updated vaccination data
   * @returns Updated vaccination record
   */
  async updateVaccination(id: string, data: Partial<any>): Promise<Vaccination> {
    const existingVaccination = await this.vaccinationRepository.findOne({
      where: { id },
      relations: ['student'],
    });

    if (!existingVaccination) {
      throw new NotFoundException('Vaccination not found');
    }

    // Validate CVX code if being updated
    if (data.cvxCode && !this.validateCVXCode(data.cvxCode)) {
      this.logger.warn(`Invalid CVX code provided: ${data.cvxCode}`);
    }

    // Recalculate series completion if dose information updated
    if (data.doseNumber !== undefined || data.totalDoses !== undefined) {
      const doseNumber = data.doseNumber ?? existingVaccination.doseNumber;
      const totalDoses = data.totalDoses ?? existingVaccination.totalDoses;
      if (doseNumber && totalDoses) {
        data.seriesComplete = doseNumber >= totalDoses;

        // Recalculate next due date if not complete
        if (!data.seriesComplete) {
          const adminDate = data.administrationDate ?? existingVaccination.administrationDate;
          data.nextDueDate = this.calculateNextDueDate(
            adminDate,
            data.vaccineType ?? existingVaccination.vaccineType,
            doseNumber,
          );
        } else {
          data.nextDueDate = null;
        }
      }
    }

    // Recalculate compliance status
    if (data.nextDueDate !== undefined || data.seriesComplete !== undefined || data.exemptionStatus !== undefined) {
      const adminDate = data.administrationDate ?? existingVaccination.administrationDate;
      const nextDueDate = data.nextDueDate ?? existingVaccination.nextDueDate;
      const seriesComplete = data.seriesComplete ?? existingVaccination.seriesComplete;
      const exemptionStatus = data.exemptionStatus ?? existingVaccination.exemptionStatus;

      data.complianceStatus = this.determineComplianceStatus(
        adminDate,
        nextDueDate,
        seriesComplete,
        exemptionStatus,
      );
    }

    // Update vaccination
    Object.assign(existingVaccination, data);
    const updatedVaccination = await this.vaccinationRepository.save(
      existingVaccination,
    );

    // Reload with associations
    const vaccinationWithRelations = await this.vaccinationRepository.findOne({
      where: { id: updatedVaccination.id },
      relations: ['student'],
    });

    if (!vaccinationWithRelations) {
      throw new Error('Failed to reload vaccination after update');
    }

    // PHI Modification Audit Log
    this.logger.log(
      `PHI Modified: Vaccination ${vaccinationWithRelations.vaccineName} updated for student ${vaccinationWithRelations.student.firstName} ${vaccinationWithRelations.student.lastName}`,
    );

    return vaccinationWithRelations;
  }

  /**
   * Delete vaccination record (soft delete for HIPAA compliance)
   * @param id - Vaccination UUID
   * @returns Success status
   */
  async deleteVaccination(id: string): Promise<{ success: boolean }> {
    const vaccination = await this.vaccinationRepository.findOne({
      where: { id },
      relations: ['student'],
    });

    if (!vaccination) {
      throw new NotFoundException('Vaccination not found');
    }

    // Soft delete
    await this.vaccinationRepository.softDelete(id);

    // PHI Deletion Audit Log
    this.logger.warn(
      `Vaccination deleted: ${vaccination.vaccineName} for ${vaccination.student.firstName} ${vaccination.student.lastName}`,
    );

    return { success: true };
  }

  /**
   * Get overdue vaccinations across all students
   * @param limit - Maximum number of results
   * @returns Array of overdue vaccinations
   */
  async getOverdueVaccinations(limit: number = 100): Promise<Vaccination[]> {
    const today = new Date();

    const overdueVaccinations = await this.vaccinationRepository.find({
      where: {
        nextDueDate: LessThan(today),
        seriesComplete: false,
      },
      relations: ['student'],
      order: {
        nextDueDate: 'ASC',
      },
      take: limit,
    });

    // PHI Access Audit Log
    this.logger.log(
      `PHI Access: Overdue vaccinations query performed, results: ${overdueVaccinations.length}`,
    );

    return overdueVaccinations;
  }

  /**
   * Get dose schedule for a vaccine series
   * @param vaccineType - Type of vaccine
   * @param currentDose - Current dose number
   * @returns Recommended schedule for remaining doses
   */
  getDoseSchedule(vaccineType: string, currentDose: number): any {
    // CDC recommended schedules (simplified)
    const schedules: Record<string, any> = {
      HEPATITIS_B: {
        totalDoses: 3,
        intervals: [
          { dose: 1, description: 'Birth' },
          { dose: 2, description: '1-2 months after dose 1' },
          { dose: 3, description: '6-18 months after dose 1' },
        ],
      },
      DTAP: {
        totalDoses: 5,
        intervals: [
          { dose: 1, description: '2 months' },
          { dose: 2, description: '4 months' },
          { dose: 3, description: '6 months' },
          { dose: 4, description: '15-18 months' },
          { dose: 5, description: '4-6 years' },
        ],
      },
      POLIO: {
        totalDoses: 4,
        intervals: [
          { dose: 1, description: '2 months' },
          { dose: 2, description: '4 months' },
          { dose: 3, description: '6-18 months' },
          { dose: 4, description: '4-6 years' },
        ],
      },
      MMR: {
        totalDoses: 2,
        intervals: [
          { dose: 1, description: '12-15 months' },
          { dose: 2, description: '4-6 years' },
        ],
      },
      VARICELLA: {
        totalDoses: 2,
        intervals: [
          { dose: 1, description: '12-15 months' },
          { dose: 2, description: '4-6 years' },
        ],
      },
    };

    const schedule = schedules[vaccineType];
    if (!schedule) {
      return {
        vaccineType,
        message: 'Schedule not available for this vaccine type',
      };
    }

    return {
      vaccineType,
      totalDoses: schedule.totalDoses,
      currentDose,
      remainingDoses: schedule.totalDoses - currentDose,
      schedule: schedule.intervals.filter((i: any) => i.dose > currentDose),
    };
  }

  // ==================== Private Helper Methods ====================

  /**
   * Validate CDC CVX code
   * @param cvxCode - CVX code to validate
   * @returns True if valid CDC code
   */
  private validateCVXCode(cvxCode: string): boolean {
    return cvxCode in CDC_CVX_CODES;
  }

  /**
   * Calculate next dose due date based on vaccine type and current dose
   * @param administrationDate - Date of current dose
   * @param vaccineType - Type of vaccine
   * @param currentDose - Current dose number
   * @returns Calculated next due date
   */
  private calculateNextDueDate(
    administrationDate: Date,
    vaccineType: string | null,
    currentDose: number,
  ): Date | null {
    if (!vaccineType) return null;

    const adminDate = new Date(administrationDate);
    let monthsToAdd = 0;

    // CDC recommended intervals (simplified)
    switch (vaccineType) {
      case 'HEPATITIS_B':
        monthsToAdd = currentDose === 1 ? 1 : currentDose === 2 ? 5 : 0;
        break;
      case 'DTAP':
      case 'POLIO':
      case 'HIB':
      case 'PNEUMOCOCCAL':
        monthsToAdd = currentDose < 3 ? 2 : currentDose === 3 ? 9 : 24;
        break;
      case 'MMR':
      case 'VARICELLA':
        monthsToAdd = currentDose === 1 ? 36 : 0; // 3 years between doses
        break;
      case 'FLU':
        monthsToAdd = 12; // Annual
        break;
      case 'COVID_19':
        monthsToAdd = currentDose === 1 ? 1 : 6; // Booster after 6 months
        break;
      default:
        monthsToAdd = 4; // Default 4-month interval
    }

    if (monthsToAdd === 0) return null;

    adminDate.setMonth(adminDate.getMonth() + monthsToAdd);
    return adminDate;
  }

  /**
   * Determine compliance status based on dates and completion
   * @param administrationDate - Date vaccine was administered
   * @param nextDueDate - Next dose due date
   * @param seriesComplete - Whether series is complete
   * @param exemptionStatus - Whether exemption exists
   * @returns Compliance status
   */
  private determineComplianceStatus(
    administrationDate: Date,
    nextDueDate: Date | null,
    seriesComplete: boolean,
    exemptionStatus: boolean,
  ): 'COMPLIANT' | 'OVERDUE' | 'PARTIALLY_COMPLIANT' | 'EXEMPT' | 'NON_COMPLIANT' {
    if (exemptionStatus) {
      return 'EXEMPT';
    }

    if (seriesComplete) {
      return 'COMPLIANT';
    }

    if (!nextDueDate) {
      return 'PARTIALLY_COMPLIANT';
    }

    const today = new Date();
    if (today > nextDueDate) {
      return 'OVERDUE';
    }

    return 'PARTIALLY_COMPLIANT';
  }
}
