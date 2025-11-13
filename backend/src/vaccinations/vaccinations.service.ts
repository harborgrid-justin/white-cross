/**
 * @fileoverview Vaccinations Service
 * @module vaccinations/vaccinations.service
 * @description Service for aggregating vaccination data across all students
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { RequestContextService } from '../shared/context/request-context.service';
import { BaseService } from '@/common/base';
import { Student } from '@/database/models';
import { Vaccination } from '@/database/models';

@Injectable()
export class VaccinationsService extends BaseService {
  constructor(
    protected readonly requestContext: RequestContextService,
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    @InjectModel(Vaccination)
    private readonly vaccinationModel: typeof Vaccination,
  ) {
    super(requestContext);
  }

  /**
   * Get vaccinations by status (due, overdue, or both)
   */
  async getVaccinationsByStatus(statuses: string[], query: any = {}) {
    const { page = 1, limit = 50, studentId, vaccineType } = query;
    const offset = (page - 1) * limit;
    
    let vaccinations: any[] = [];
    
    try {
      // Handle different status combinations
      if (statuses.includes('due') && statuses.includes('overdue')) {
        // Get both due and overdue
        const [dueResults, overdueResults] = await Promise.all([
          this.getDueVaccinationsInternal({ studentId, vaccineType, limit: Math.ceil(limit / 2) }),
          this.getOverdueVaccinationsInternal({ studentId, vaccineType, limit: Math.ceil(limit / 2) })
        ]);
        
        vaccinations = [
          ...dueResults.map((v: any) => ({ ...v, status: 'due' })),
          ...overdueResults.map((v: any) => ({ ...v, status: 'overdue' }))
        ];
      } else if (statuses.includes('due')) {
        const results = await this.getDueVaccinationsInternal({ studentId, vaccineType, limit });
        vaccinations = results.map((v: any) => ({ ...v, status: 'due' }));
      } else if (statuses.includes('overdue')) {
        const results = await this.getOverdueVaccinationsInternal({ studentId, vaccineType, limit });
        vaccinations = results.map((v: any) => ({ ...v, status: 'overdue' }));
      }

      // Apply pagination to combined results
      const paginatedVaccinations = vaccinations.slice(offset, offset + limit);
      
      return {
        vaccinations: paginatedVaccinations,
        total: vaccinations.length,
        page: Number(page),
        limit: Number(limit),
        statusFilter: statuses.join(',')
      };
    } catch (error) {
      console.error('Error fetching vaccinations by status:', error);
      return {
        vaccinations: [],
        total: 0,
        page: Number(page),
        limit: Number(limit),
        statusFilter: statuses.join(','),
        error: 'Failed to fetch vaccinations'
      };
    }
  }

  /**
   * Internal method to get due vaccinations
   */
  private async getDueVaccinationsInternal(options: any = {}) {
    const { studentId, vaccineType, limit = 25 } = options;
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const whereClause: any = {
      nextDueDate: {
        [Op.gte]: today,
        [Op.lte]: thirtyDaysFromNow
      },
      seriesComplete: false
    };

    if (studentId) {
      whereClause.studentId = studentId;
    }

    if (vaccineType) {
      whereClause.vaccineType = { [Op.iLike]: `%${vaccineType}%` };
    }

    return await this.vaccinationModel.findAll({
      where: whereClause,
      include: [{
        model: Student,
        as: 'student',
        attributes: ['id', 'firstName', 'lastName', 'dateOfBirth']
      }],
      order: [['nextDueDate', 'ASC']],
      limit
    });
  }

  /**
   * Internal method to get overdue vaccinations
   */
  private async getOverdueVaccinationsInternal(options: any = {}) {
    const { studentId, vaccineType, limit = 25 } = options;
    const today = new Date();

    const whereClause: any = {
      nextDueDate: { [Op.lt]: today },
      seriesComplete: false
    };

    if (studentId) {
      whereClause.studentId = studentId;
    }

    if (vaccineType) {
      whereClause.vaccineType = { [Op.iLike]: `%${vaccineType}%` };
    }

    return await this.vaccinationModel.findAll({
      where: whereClause,
      include: [{
        model: Student,
        as: 'student',
        attributes: ['id', 'firstName', 'lastName', 'dateOfBirth']
      }],
      order: [['nextDueDate', 'ASC']],
      limit
    });
  }

  async getDueVaccinations(query: any = {}) {
    return this.getVaccinationsByStatus(['due'], query);
  }

  async getOverdueVaccinations(query: any = {}) {
    return this.getVaccinationsByStatus(['overdue'], query);
  }
}