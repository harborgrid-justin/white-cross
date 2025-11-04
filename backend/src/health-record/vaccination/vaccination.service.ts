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
import { InjectModel } from '@nestjs/sequelize';
import { Model, Op } from 'sequelize';
import { Vaccination } from '../../database/models/vaccination.model';
import { Student } from '../../database/models/student.model';
import { ComplianceStatus } from '../interfaces/vaccination.interface';

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
    @InjectModel(Vaccination)
    private readonly vaccinationModel: typeof Vaccination,
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
  ) {}

  /**
   * Add vaccination with CVX validation, dose tracking, and audit logging
   * @param data - Vaccination creation data
   * @returns Created vaccination record with associations
   */
  async addVaccination(data: any): Promise<Vaccination> {
    this.logger.log(`Adding vaccination for student ${data.studentId}`);

    // Verify student exists
    const student = await this.studentModel.findByPk(data.studentId);

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
    const vaccination = this.vaccinationModel.build({
      ...data,
      seriesComplete,
      nextDueDate,
      complianceStatus,
    });

    const savedVaccination = await vaccination.save();

    // Reload with associations
    const vaccinationWithRelations = await this.vaccinationModel.findByPk(
      (savedVaccination as any).id,
      { include: ['student'] },
    );

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
    const student = await this.studentModel.findByPk(studentId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const vaccinations = await this.vaccinationModel.findAll({
      where: { studentId },
      include: ['student'],
      order: [['administrationDate', 'DESC']],
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
    const student = await this.studentModel.findByPk(studentId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Get all vaccinations for student
    const vaccinations = await this.vaccinationModel.findAll({
      where: { studentId },
      order: [['administrationDate', 'DESC']],
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
    const existingVaccination = await this.vaccinationModel.findByPk(id, {
      include: ['student'],
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
    const updatedVaccination = await existingVaccination.save();

    // Reload with associations
    const vaccinationWithRelations = await this.vaccinationModel.findByPk(updatedVaccination.id, {
      include: ['student'],
    });

    if (!vaccinationWithRelations) {
      throw new Error('Failed to reload vaccination after update');
    }

    // PHI Modification Audit Log
    this.logger.log(
      `PHI Modified: Vaccination ${vaccinationWithRelations.vaccineName} updated for student ${vaccinationWithRelations.student?.firstName ?? 'Unknown'} ${vaccinationWithRelations.student?.lastName ?? 'Unknown'}`,
    );

    return vaccinationWithRelations;
  }

  /**
   * Delete vaccination record (soft delete for HIPAA compliance)
   * @param id - Vaccination UUID
   * @returns Success status
   */
  async deleteVaccination(id: string): Promise<{ success: boolean }> {
    const vaccination = await this.vaccinationModel.findByPk(id, {
      include: ['student'],
    });

    if (!vaccination) {
      throw new NotFoundException('Vaccination not found');
    }

    // Soft delete
    await vaccination.destroy();

    // PHI Deletion Audit Log
    this.logger.warn(
      `Vaccination deleted: ${vaccination.vaccineName} for ${vaccination.student?.firstName ?? 'Unknown'} ${vaccination.student?.lastName ?? 'Unknown'}`,
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

    const overdueVaccinations = await this.vaccinationModel.findAll({
      where: {
        nextDueDate: { [Op.lt]: today },
        seriesComplete: false,
      },
      include: ['student'],
      order: [['nextDueDate', 'ASC']],
      limit,
    });

    // PHI Access Audit Log
    this.logger.log(
      `PHI Access: Overdue vaccinations query performed, results: ${overdueVaccinations.length}`,
    );

    return overdueVaccinations;
  }

  /**
   * GAP-VAX-001: Get due vaccinations for student
   */
  async getDueVaccinations(studentId: string): Promise<any> {
    const student = await this.studentModel.findByPk(studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const complianceReport = await this.checkComplianceStatus(studentId);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const dueVaccinations = complianceReport.upcoming.filter((vax: any) => {
      if (!vax.dueDate) return false;
      const dueDate = new Date(vax.dueDate);
      return dueDate >= today && dueDate <= thirtyDaysFromNow;
    });

    this.logger.log(`PHI Access: Due vaccinations retrieved for student ${studentId}`);

    return {
      studentId,
      studentName: `${student.firstName} ${student.lastName}`,
      dueVaccinations: dueVaccinations.map((vax: any) => ({
        vaccineName: vax.vaccineName,
        doseNumber: vax.nextDose,
        totalDoses: vax.requiredDoses,
        dueDate: vax.dueDate,
        status: 'DUE',
      })),
    };
  }

  /**
   * GAP-VAX-002: Get overdue vaccinations for specific student
   */
  async getOverdueVaccinationsForStudent(studentId: string): Promise<any> {
    const student = await this.studentModel.findByPk(studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const complianceReport = await this.checkComplianceStatus(studentId);
    const today = new Date();

    const overdueVaccinations = complianceReport.missing.filter((vax: any) =>
      vax.status === 'OVERDUE' && vax.dueDate
    );

    this.logger.log(`PHI Access: Overdue vaccinations retrieved for student ${studentId}`);

    return {
      studentId,
      studentName: `${student.firstName} ${student.lastName}`,
      dueVaccinations: overdueVaccinations.map((vax: any) => {
        const dueDate = new Date(vax.dueDate);
        const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (24 * 60 * 60 * 1000));

        return {
          vaccineName: vax.vaccineName,
          doseNumber: vax.nextDose || vax.completedDoses + 1,
          totalDoses: vax.requiredDoses,
          dueDate: vax.dueDate,
          status: 'OVERDUE',
          daysOverdue,
        };
      }),
    };
  }

  /**
   * GAP-VAX-003: Batch import vaccinations
   */
  async batchImport(vaccinations: any[]): Promise<any> {
    this.logger.log(`Batch importing ${vaccinations.length} vaccinations`);

    const results = {
      successCount: 0,
      errorCount: 0,
      importedIds: [] as string[],
      errors: [] as string[],
    };

    for (const vaccinationData of vaccinations) {
      try {
        const vaccination = await this.addVaccination(vaccinationData);
        results.successCount++;
        results.importedIds.push((vaccination as any).id);
      } catch (error) {
        results.errorCount++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.errors.push(
          `Failed to import vaccination for student ${vaccinationData.studentId}: ${errorMessage}`
        );
        this.logger.error(`Batch import error: ${errorMessage}`);
      }
    }

    this.logger.log(
      `Batch import completed: ${results.successCount} successful, ${results.errorCount} failed`
    );

    return results;
  }

  /**
   * GAP-VAX-004: Get CDC vaccination schedule
   */
  getCDCSchedule(query: any): any {
    const { ageOrGrade, vaccineType } = query;

    // CDC schedule data (simplified)
    const schedules = [
      {
        vaccine: 'Hepatitis B',
        cvxCode: '08',
        doses: [
          { dose: 1, age: 'Birth', timing: 'At birth' },
          { dose: 2, age: '1-2 months', timing: '1-2 months after dose 1' },
          { dose: 3, age: '6-18 months', timing: '6-18 months after dose 1' },
        ],
      },
      {
        vaccine: 'DTaP',
        cvxCode: '20',
        doses: [
          { dose: 1, age: '2 months', timing: 'At 2 months' },
          { dose: 2, age: '4 months', timing: 'At 4 months' },
          { dose: 3, age: '6 months', timing: 'At 6 months' },
          { dose: 4, age: '15-18 months', timing: 'At 15-18 months' },
          { dose: 5, age: '4-6 years', timing: 'At 4-6 years (before school entry)' },
        ],
      },
      {
        vaccine: 'Polio (IPV)',
        cvxCode: '10',
        doses: [
          { dose: 1, age: '2 months', timing: 'At 2 months' },
          { dose: 2, age: '4 months', timing: 'At 4 months' },
          { dose: 3, age: '6-18 months', timing: 'At 6-18 months' },
          { dose: 4, age: '4-6 years', timing: 'At 4-6 years (before school entry)' },
        ],
      },
      {
        vaccine: 'MMR',
        cvxCode: '03',
        doses: [
          { dose: 1, age: '12-15 months', timing: 'At 12-15 months' },
          { dose: 2, age: '4-6 years', timing: 'At 4-6 years (before school entry)' },
        ],
      },
      {
        vaccine: 'Varicella',
        cvxCode: '21',
        doses: [
          { dose: 1, age: '12-15 months', timing: 'At 12-15 months' },
          { dose: 2, age: '4-6 years', timing: 'At 4-6 years' },
        ],
      },
    ];

    // Filter by vaccine type if specified
    let filteredSchedules = vaccineType
      ? schedules.filter((s) => s.vaccine.toLowerCase().includes(vaccineType.toLowerCase()))
      : schedules;

    return {
      source: 'CDC Immunization Schedule',
      lastUpdated: '2024-01-01',
      ageOrGrade: ageOrGrade || 'All ages',
      schedules: filteredSchedules,
    };
  }

  /**
   * GAP-VAX-005: Create vaccination exemption
   */
  async createExemption(studentId: string, exemptionDto: any): Promise<any> {
    const student = await this.studentModel.findByPk(studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Create exemption vaccination record
    const exemption = await this.vaccinationModel.create({
      id: require('uuid').v4(),
      studentId,
      vaccineName: exemptionDto.vaccineName,
      vaccineType: exemptionDto.vaccineName,
      seriesComplete: false,
      administrationDate: new Date(), // Record creation date
      administeredBy: 'EXEMPT',
      exemptionStatus: true,
      exemptionReason: exemptionDto.reason,
      complianceStatus: ComplianceStatus.EXEMPT,
      vfcEligibility: false,
      visProvided: false,
      consentObtained: false,
      notes: `Exemption: ${exemptionDto.exemptionType} - ${exemptionDto.reason}`,
    });

    this.logger.log(
      `PHI Created: Vaccination exemption created for student ${studentId} (${exemptionDto.vaccineName})`
    );

    return exemption;
  }

  /**
   * GAP-VAX-006: Get compliance report across students
   */
  async getComplianceReport(query: any): Promise<any> {
    const { schoolId, gradeLevel, vaccineType, onlyNonCompliant } = query;

    // This is a simplified implementation - in production, you'd query across multiple students
    const whereClause: any = {};

    if (vaccineType) {
      whereClause.vaccineName = { [Op.iLike]: `%${vaccineType}%` };
    }

    const vaccinations = await this.vaccinationModel.findAll({
      where: whereClause,
      include: ['student'],
      limit: 100,
    });

    // Group by student
    const studentGroups = vaccinations.reduce((acc: any, vax: any) => {
      const studentId = vax.studentId;
      if (!acc[studentId]) {
        acc[studentId] = {
          student: vax.student,
          vaccinations: [],
        };
      }
      acc[studentId].vaccinations.push(vax);
      return acc;
    }, {});

    // Calculate compliance for each student
    const complianceData = Object.values(studentGroups).map((group: any) => {
      const compliantCount = group.vaccinations.filter((v: any) => v.complianceStatus === 'COMPLIANT' || v.complianceStatus === 'EXEMPT').length;
      const totalVaccinations = group.vaccinations.length;
      const compliancePercentage = totalVaccinations > 0 ? (compliantCount / totalVaccinations) * 100 : 0;

      return {
        studentId: group.student.id,
        studentName: `${group.student.firstName} ${group.student.lastName}`,
        totalVaccinations,
        compliantCount,
        compliancePercentage: Math.round(compliancePercentage),
        status: compliancePercentage >= 100 ? 'COMPLIANT' : compliancePercentage >= 50 ? 'PARTIALLY_COMPLIANT' : 'NON_COMPLIANT',
      };
    });

    // Filter if onlyNonCompliant is true
    const filteredData = onlyNonCompliant
      ? complianceData.filter((d: any) => d.status !== 'COMPLIANT')
      : complianceData;

    this.logger.log(`Compliance report generated: ${filteredData.length} students`);

    return {
      reportDate: new Date().toISOString(),
      filters: { schoolId, gradeLevel, vaccineType, onlyNonCompliant },
      totalStudents: filteredData.length,
      summary: {
        compliant: filteredData.filter((d: any) => d.status === 'COMPLIANT').length,
        partiallyCompliant: filteredData.filter((d: any) => d.status === 'PARTIALLY_COMPLIANT').length,
        nonCompliant: filteredData.filter((d: any) => d.status === 'NON_COMPLIANT').length,
      },
      students: filteredData,
    };
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
