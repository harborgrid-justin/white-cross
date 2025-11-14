/**
 * @fileoverview Vaccinations Service
 * @module vaccinations/vaccinations.service
 * @description Service for aggregating vaccination data across all students
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { RequestContextService } from '@/common/context/request-context.service';
import { BaseService } from '@/common/base';
import { Student, Vaccination } from '@/database/models';
import { PaginatedResponse } from '@/database/types/pagination.types';

export interface VaccinationQueryOptions {
  page?: number;
  limit?: number;
  studentId?: string;
  vaccineType?: string;
}

export interface VaccinationStatusResult {
  vaccinations: any[];
  total: number;
  page: number;
  limit: number;
  statusFilter: string;
}

@Injectable()
export class VaccinationsService extends BaseService {
  constructor(
    protected readonly requestContext: RequestContextService,
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    @InjectModel(Vaccination)
    private readonly vaccinationModel: typeof Vaccination,
  ) {
    super(requestContext, {
      serviceName: 'VaccinationsService',
      tableName: 'vaccinations',
    });
  }

  /**
   * Get vaccinations by status (due, overdue, or both)
   */
  async getVaccinationsByStatus(
    statuses: string[], 
    query: VaccinationQueryOptions = {}
  ): Promise<VaccinationStatusResult> {
    return this.executeWithLogging('getVaccinationsByStatus', async () => {
      const { page = 1, limit = 50, studentId, vaccineType } = query;
      
      // Validate inputs
      this.validateRequiredField(statuses, 'statuses');
      if (statuses.length === 0) {
        throw new Error('At least one status must be specified');
      }
      
      if (studentId) {
        this.validateUUID(studentId, 'studentId');
      }

      let vaccinations: any[] = [];
      
      // Handle different status combinations
      if (statuses.includes('due') && statuses.includes('overdue')) {
        // Get both due and overdue
        const [dueResults, overdueResults] = await Promise.all([
          this.getDueVaccinationsInternal({ 
            studentId, 
            vaccineType, 
            limit: Math.ceil(limit / 2) 
          }),
          this.getOverdueVaccinationsInternal({ 
            studentId, 
            vaccineType, 
            limit: Math.ceil(limit / 2) 
          })
        ]);
        
        vaccinations = [
          ...dueResults.map((v: any) => ({ ...v.toJSON(), status: 'due' })),
          ...overdueResults.map((v: any) => ({ ...v.toJSON(), status: 'overdue' }))
        ];
      } else if (statuses.includes('due')) {
        const results = await this.getDueVaccinationsInternal({ studentId, vaccineType, limit });
        vaccinations = results.map((v: any) => ({ ...v.toJSON(), status: 'due' }));
      } else if (statuses.includes('overdue')) {
        const results = await this.getOverdueVaccinationsInternal({ studentId, vaccineType, limit });
        vaccinations = results.map((v: any) => ({ ...v.toJSON(), status: 'overdue' }));
      }

      // Apply pagination to combined results
      const offset = (page - 1) * limit;
      const paginatedVaccinations = vaccinations.slice(offset, offset + limit);
      
      this.logInfo(`Retrieved ${paginatedVaccinations.length} vaccinations with status: ${statuses.join(',')}`);
      
      return {
        vaccinations: paginatedVaccinations,
        total: vaccinations.length,
        page: Number(page),
        limit: Number(limit),
        statusFilter: statuses.join(',')
      };
    });
  }

  /**
   * Get due vaccinations using BaseService patterns
   */
  async getDueVaccinations(query: VaccinationQueryOptions = {}): Promise<PaginatedResponse<Vaccination>> {
    return this.executeWithLogging('getDueVaccinations', async () => {
      const { studentId, vaccineType } = query;
      
      if (studentId) {
        this.validateUUID(studentId, 'studentId');
      }

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

      return this.createPaginatedQuery(this.vaccinationModel, {
        page: query.page,
        limit: query.limit,
        where: whereClause,
        include: [{
          model: this.studentModel,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'dateOfBirth']
        }],
        order: [['nextDueDate', 'ASC']]
      });
    });
  }

  /**
   * Get overdue vaccinations using BaseService patterns
   */
  async getOverdueVaccinations(query: VaccinationQueryOptions = {}): Promise<PaginatedResponse<Vaccination>> {
    return this.executeWithLogging('getOverdueVaccinations', async () => {
      const { studentId, vaccineType } = query;
      
      if (studentId) {
        this.validateUUID(studentId, 'studentId');
      }

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

      return this.createPaginatedQuery(this.vaccinationModel, {
        page: query.page,
        limit: query.limit,
        where: whereClause,
        include: [{
          model: this.studentModel,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'dateOfBirth']
        }],
        order: [['nextDueDate', 'ASC']]
      });
    });
  }

  /**
   * Get vaccination by ID with validation
   */
  async getVaccinationById(id: string): Promise<Vaccination> {
    return this.executeWithLogging('getVaccinationById', async () => {
      this.validateUUID(id, 'vaccination ID');
      
      return this.findEntityOrFail(
        this.vaccinationModel,
        id,
        'Vaccination'
      );
    });
  }

  /**
   * Get all vaccinations for a specific student
   */
  async getVaccinationsByStudentId(
    studentId: string, 
    query: Omit<VaccinationQueryOptions, 'studentId'> = {}
  ): Promise<PaginatedResponse<Vaccination>> {
    return this.executeWithLogging('getVaccinationsByStudentId', async () => {
      this.validateUUID(studentId, 'student ID');
      
      // Verify student exists
      await this.findEntityOrFail(this.studentModel, studentId, 'Student');

      const whereClause: any = { studentId };

      if (query.vaccineType) {
        whereClause.vaccineType = { [Op.iLike]: `%${query.vaccineType}%` };
      }

      return this.createPaginatedQuery(this.vaccinationModel, {
        page: query.page,
        limit: query.limit,
        where: whereClause,
        include: [{
          model: this.studentModel,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'dateOfBirth']
        }],
        order: [['createdAt', 'DESC']]
      });
    });
  }

  /**
   * Internal method to get due vaccinations (legacy support)
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
        model: this.studentModel,
        as: 'student',
        attributes: ['id', 'firstName', 'lastName', 'dateOfBirth']
      }],
      order: [['nextDueDate', 'ASC']],
      limit
    });
  }

  /**
   * Internal method to get overdue vaccinations (legacy support)
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
        model: this.studentModel,
        as: 'student',
        attributes: ['id', 'firstName', 'lastName', 'dateOfBirth']
      }],
      order: [['nextDueDate', 'ASC']],
      limit
    });
  }
}
