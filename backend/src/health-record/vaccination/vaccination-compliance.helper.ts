/**
 * @fileoverview Vaccination Compliance Helper
 * @module health-record/vaccination
 * @description Vaccination compliance checking, validation, and reporting
 *
 * HIPAA Compliance: All vaccination data is PHI and requires audit logging
 * CDC Compliance: Validates CVX codes and tracks compliance status
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Vaccination } from '../../../database/models/vaccination.model';
import { Student } from '../../../database/models/student.model';
import { CDC_CVX_CODES, SCHOOL_REQUIREMENTS } from './vaccination.constants';
import {
  ComplianceReport,
  DueVaccinationsResponse,
  ComplianceReportQuery,
  ComplianceReportResponse,
  StudentComplianceData,
} from './vaccination-compliance.interfaces';

@Injectable()
export class VaccinationComplianceHelper {
  private readonly logger = new Logger(VaccinationComplianceHelper.name);

  constructor(
    @InjectModel(Vaccination)
    private readonly vaccinationModel: typeof Vaccination,
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
  ) {}

  /**
   * Validate CDC CVX code
   * @param cvxCode - CVX code to validate
   * @returns True if valid CDC code
   */
  validateCVXCode(cvxCode: string): boolean {
    return cvxCode in CDC_CVX_CODES;
  }

  /**
   * Determine compliance status based on dates and completion
   * @param administrationDate - Date vaccine was administered
   * @param nextDueDate - Next dose due date
   * @param seriesComplete - Whether series is complete
   * @param exemptionStatus - Whether exemption exists
   * @returns Compliance status
   */
  determineComplianceStatus(
    administrationDate: Date,
    nextDueDate: Date | null,
    seriesComplete: boolean,
    exemptionStatus: boolean,
  ):
    | 'COMPLIANT'
    | 'OVERDUE'
    | 'PARTIALLY_COMPLIANT'
    | 'EXEMPT'
    | 'NON_COMPLIANT' {
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

  /**
   * Check vaccination compliance status for student
   * @param studentId - Student UUID
   * @returns Compliance report with missing/upcoming vaccinations
   */
  async checkComplianceStatus(studentId: string): Promise<ComplianceReport> {
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
    const complianceReport: ComplianceReport = {
      studentId,
      studentName: `${student.firstName} ${student.lastName}`,
      ageInMonths,
      compliant: true,
      missing: [],
      upcoming: [],
      complete: [],
      exemptions: [],
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
          (v.vaccineName &&
            v.vaccineName
              .toLowerCase()
              .includes(requirement.vaccineName.toLowerCase())) ||
          (v.vaccineType &&
            requirement.vaccineName
              .toLowerCase()
              .includes(v.vaccineType.toLowerCase())),
      );

      // Check if exemption exists
      const hasExemption = exemptedVaccinations.some(
        (v) =>
          v.vaccineName &&
          v.vaccineName
            .toLowerCase()
            .includes(requirement.vaccineName.toLowerCase()),
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
   * Get due vaccinations for student (within next 30 days)
   * @param studentId - Student UUID
   * @returns Due vaccinations response
   */
  async getDueVaccinations(
    studentId: string,
  ): Promise<DueVaccinationsResponse> {
    const student = await this.studentModel.findByPk(studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const complianceReport = await this.checkComplianceStatus(studentId);
    const today = new Date();
    const thirtyDaysFromNow = new Date(
      today.getTime() + 30 * 24 * 60 * 60 * 1000,
    );

    const dueVaccinations = complianceReport.upcoming.filter((vax) => {
      if (!vax.dueDate) return false;
      const dueDate = new Date(vax.dueDate);
      return dueDate >= today && dueDate <= thirtyDaysFromNow;
    });

    this.logger.log(
      `PHI Access: Due vaccinations retrieved for student ${studentId}`,
    );

    return {
      studentId,
      studentName: `${student.firstName} ${student.lastName}`,
      dueVaccinations: dueVaccinations.map((vax) => ({
        vaccineName: vax.vaccineName,
        doseNumber: vax.nextDose,
        totalDoses: vax.requiredDoses,
        dueDate: vax.dueDate,
        status: 'DUE',
      })),
    };
  }

  /**
   * Get overdue vaccinations for specific student
   * @param studentId - Student UUID
   * @returns Overdue vaccinations response
   */
  async getOverdueVaccinationsForStudent(
    studentId: string,
  ): Promise<DueVaccinationsResponse> {
    const student = await this.studentModel.findByPk(studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const complianceReport = await this.checkComplianceStatus(studentId);
    const today = new Date();

    const overdueVaccinations = complianceReport.missing.filter(
      (vax) => vax.status === 'OVERDUE' && vax.dueDate,
    );

    this.logger.log(
      `PHI Access: Overdue vaccinations retrieved for student ${studentId}`,
    );

    return {
      studentId,
      studentName: `${student.firstName} ${student.lastName}`,
      dueVaccinations: overdueVaccinations.map((vax) => {
        const dueDate = new Date(vax.dueDate!);
        const daysOverdue = Math.floor(
          (today.getTime() - dueDate.getTime()) / (24 * 60 * 60 * 1000),
        );

        return {
          vaccineName: vax.vaccineName,
          doseNumber: vax.nextDose || vax.completedDoses + 1,
          totalDoses: vax.requiredDoses,
          dueDate: vax.dueDate!,
          status: 'OVERDUE',
          daysOverdue,
        };
      }),
    };
  }

  /**
   * Get compliance report across students
   * @param query - Query parameters for filtering
   * @returns Compliance report with student data
   */
  async getComplianceReport(
    query: ComplianceReportQuery,
  ): Promise<ComplianceReportResponse> {
    const { schoolId, gradeLevel, vaccineType, onlyNonCompliant } = query;

    // This is a simplified implementation - in production, you'd query across multiple students
    const whereClause: Record<string, unknown> = {};

    if (vaccineType) {
      whereClause.vaccineName = { [Op.iLike]: `%${vaccineType}%` };
    }

    const vaccinations = await this.vaccinationModel.findAll({
      where: whereClause,
      include: ['student'],
      limit: 100,
    });

    // Group by student
    const studentGroups = vaccinations.reduce(
      (acc: Record<string, { student: Student; vaccinations: Vaccination[] }>, vax) => {
        const studentId = vax.studentId;
        if (!acc[studentId]) {
          acc[studentId] = {
            student: vax.student!,
            vaccinations: [],
          };
        }
        acc[studentId].vaccinations.push(vax);
        return acc;
      },
      {},
    );

    // Calculate compliance for each student
    const complianceData: StudentComplianceData[] = Object.values(
      studentGroups,
    ).map((group) => {
      const compliantCount = group.vaccinations.filter(
        (v) =>
          v.complianceStatus === 'COMPLIANT' || v.complianceStatus === 'EXEMPT',
      ).length;
      const totalVaccinations = group.vaccinations.length;
      const compliancePercentage =
        totalVaccinations > 0 ? (compliantCount / totalVaccinations) * 100 : 0;

      return {
        studentId: group.student.id,
        studentName: `${group.student.firstName} ${group.student.lastName}`,
        totalVaccinations,
        compliantCount,
        compliancePercentage: Math.round(compliancePercentage),
        status:
          compliancePercentage >= 100
            ? 'COMPLIANT'
            : compliancePercentage >= 50
              ? 'PARTIALLY_COMPLIANT'
              : 'NON_COMPLIANT',
      };
    });

    // Filter if onlyNonCompliant is true
    const filteredData = onlyNonCompliant
      ? complianceData.filter((d) => d.status !== 'COMPLIANT')
      : complianceData;

    this.logger.log(
      `Compliance report generated: ${filteredData.length} students`,
    );

    return {
      reportDate: new Date().toISOString(),
      filters: { schoolId, gradeLevel, vaccineType, onlyNonCompliant },
      totalStudents: filteredData.length,
      summary: {
        compliant: filteredData.filter((d) => d.status === 'COMPLIANT')
          .length,
        partiallyCompliant: filteredData.filter(
          (d) => d.status === 'PARTIALLY_COMPLIANT',
        ).length,
        nonCompliant: filteredData.filter((d) => d.status === 'NON_COMPLIANT')
          .length,
      },
      students: filteredData,
    };
  }
}
