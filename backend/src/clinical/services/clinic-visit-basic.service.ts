import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ClinicVisit } from '../../database/models/clinic-visit.model';
import { VisitDisposition } from '../enums/visit-disposition.enum';
import { CheckInDto } from '../dto/visit/check-in.dto';
import { CheckOutDto } from '../dto/visit/check-out.dto';
import { VisitFiltersDto } from '../dto/visit/visit-filters.dto';

import { BaseService } from '../../../common/base';
/**
 * Clinic Visit Basic Service
 * Handles basic CRUD operations for clinic visits
 */
@Injectable()
export class ClinicVisitBasicService extends BaseService {
  constructor(
    @InjectModel(ClinicVisit)
    private readonly clinicVisitModel: typeof ClinicVisit,
  ) {}

  /**
   * Check in a student to the clinic
   */
  async checkIn(data: CheckInDto): Promise<ClinicVisit> {
    this.logInfo(`Checking in student ${data.studentId}`);

    // Validate student doesn't have an active visit
    const activeVisit = await this.clinicVisitModel.findOne({
      where: {
        studentId: data.studentId,
        checkOutTime: null as any,
      },
    });

    if (activeVisit) {
      throw new ConflictException('Student already has an active clinic visit');
    }

    // Create new visit
    const visit = await this.clinicVisitModel.create({
      ...data,
      checkInTime: new Date(),
      disposition: VisitDisposition.OTHER, // Temporary, will be set at checkout
    } as any);

    return visit;
  }

  /**
   * Check out a student from the clinic
   */
  async checkOut(visitId: string, data: CheckOutDto): Promise<ClinicVisit> {
    this.logInfo(`Checking out visit ${visitId}`);

    const visit = await this.clinicVisitModel.findOne({
      where: { id: visitId },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    if (visit.checkOutTime) {
      throw new BadRequestException('Visit already checked out');
    }

    // Update visit with checkout data
    await visit.update({
      ...data,
      checkOutTime: new Date(),
    });

    return visit.reload();
  }

  /**
   * Get active clinic visits
   */
  async getActiveVisits(): Promise<ClinicVisit[]> {
    return this.clinicVisitModel.findAll({
      where: {
        checkOutTime: null as any,
      },
      order: [['checkInTime', 'ASC']],
    });
  }

  /**
   * Get visits with filtering and pagination
   */
  async getVisits(
    filters: VisitFiltersDto,
  ): Promise<{ visits: ClinicVisit[]; total: number }> {
    const where: any = {};

    if (filters.studentId) {
      where.studentId = filters.studentId;
    }

    if (filters.attendedBy) {
      where.attendedBy = filters.attendedBy;
    }

    if (filters.disposition) {
      where.disposition = filters.disposition;
    }

    if (filters.activeOnly) {
      where.checkOutTime = null as any;
    }

    if (filters.dateFrom || filters.dateTo) {
      if (filters.dateFrom && filters.dateTo) {
        where.checkInTime = {
          [Op.between]: [filters.dateFrom, filters.dateTo],
        };
      } else if (filters.dateFrom) {
        where.checkInTime = { [Op.gte]: filters.dateFrom };
      } else if (filters.dateTo) {
        where.checkInTime = { [Op.lte]: filters.dateTo };
      }
    }

    const { rows: visits, count: total } =
      await this.clinicVisitModel.findAndCountAll({
        where,
        offset: filters.offset || 0,
        limit: filters.limit || 20,
        order: [['checkInTime', 'DESC']],
      });

    return { visits, total };
  }

  /**
   * Get visit by ID
   */
  async getVisitById(id: string): Promise<ClinicVisit> {
    const visit = await this.clinicVisitModel.findOne({
      where: { id },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    return visit;
  }

  /**
   * Get visits for a student
   */
  async getVisitsByStudent(
    studentId: string,
    limit: number = 10,
  ): Promise<ClinicVisit[]> {
    return this.clinicVisitModel.findAll({
      where: { studentId },
      order: [['checkInTime', 'DESC']],
      limit,
    });
  }

  /**
   * Update a visit
   */
  async updateVisit(
    id: string,
    updates: Partial<CheckInDto & CheckOutDto>,
  ): Promise<ClinicVisit> {
    const visit = await this.getVisitById(id);

    await visit.update(updates);
    return visit.reload();
  }

  /**
   * Delete a visit
   */
  async deleteVisit(id: string): Promise<void> {
    const result = await this.clinicVisitModel.destroy({
      where: { id },
    });

    if (result === 0) {
      throw new NotFoundException(`Visit with ID ${id} not found`);
    }

    this.logInfo(`Deleted visit ${id}`);
  }
}
