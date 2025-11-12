/**
 * @fileoverview Vaccination CRUD Helper
 * @module health-record/vaccination
 * @description Helper methods for CRUD operations and batch processing
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Vaccination } from '../../../database/models/vaccination.model';
import { Student } from '../../../database/models/student.model';
import { ComplianceStatus } from '../../interfaces/vaccination.interface';
import { CreateVaccinationDto, CreateExemptionDto, BatchImportResult } from './vaccination.dto';

@Injectable()
export class VaccinationCrudHelper {
  private readonly logger = new Logger(VaccinationCrudHelper.name);

  constructor(
    @InjectModel(Vaccination)
    private readonly vaccinationModel: typeof Vaccination,
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
  ) {}

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
   * Create vaccination exemption
   * @param studentId - Student UUID
   * @param exemptionDto - Exemption data
   * @returns Created exemption record
   */
  async createExemption(
    studentId: string,
    exemptionDto: CreateExemptionDto,
  ): Promise<Vaccination> {
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
      `PHI Created: Vaccination exemption created for student ${studentId} (${exemptionDto.vaccineName})`,
    );

    return exemption;
  }
}
