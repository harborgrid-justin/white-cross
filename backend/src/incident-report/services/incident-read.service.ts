/**
 * @fileoverview Incident Read Service
 * @module incident-report/services/incident-read.service
 * @description Business logic for reading incident report data
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { IncidentReport } from '@/database';
import { IncidentFiltersDto } from '../dto/incident-filters.dto';

/**
 * Incident Read Service
 *
 * Handles read operations for incident reports:
 * - List incident reports with filtering and pagination
 * - Get single incident report by ID
 * - Get incidents requiring follow-up
 * - Get student recent incidents
 */
@Injectable()
export class IncidentReadService {
  private readonly logger = new Logger(IncidentReadService.name);

  constructor(
    @InjectModel(IncidentReport)
    private readonly incidentReportModel: typeof IncidentReport,
  ) {}

  /**
   * Get incident reports with pagination and filters
   */
  async getIncidentReports(filters: IncidentFiltersDto) {
    const { page = 1, limit = 20, ...filterParams } = filters;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (filterParams.studentId) {
      where.studentId = filterParams.studentId;
    }

    if (filterParams.reportedById) {
      where.reportedById = filterParams.reportedById;
    }

    if (filterParams.type) {
      where.type = filterParams.type;
    }

    if (filterParams.severity) {
      where.severity = filterParams.severity;
    }

    if (filterParams.dateFrom && filterParams.dateTo) {
      where.occurredAt = {
        [Op.between]: [new Date(filterParams.dateFrom), new Date(filterParams.dateTo)],
      };
    }

    const { rows: incidents, count: total } = await this.incidentReportModel.findAndCountAll({
      where,
      include: [
        {
          model: this.incidentReportModel.sequelize?.models.User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName'],
        },
        {
          model: this.incidentReportModel.sequelize?.models.User,
          as: 'reportedBy',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [['occurredAt', 'DESC']],
      limit,
      offset,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: incidents,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Get incident report by ID
   */
  async getIncidentReportById(id: string): Promise<IncidentReport> {
    this.logger.log(`Getting incident report by ID: ${id}`);

    const incident = await this.incidentReportModel.findByPk(id, {
      include: [
        {
          model: this.incidentReportModel.sequelize?.models.User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName'],
        },
        {
          model: this.incidentReportModel.sequelize?.models.User,
          as: 'reportedBy',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });

    if (!incident) {
      throw new NotFoundException(`Incident report with ID ${id} not found`);
    }

    return incident;
  }

  /**
   * Get incidents requiring follow-up
   */
  async getIncidentsRequiringFollowUp(): Promise<IncidentReport[]> {
    this.logger.log('Getting incidents requiring follow-up');

    return this.incidentReportModel.findAll({
      where: {
        [Op.or]: [{ parentNotified: false }, { followUpRequired: true }],
      },
      include: [
        {
          model: this.incidentReportModel.sequelize?.models.User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [['occurredAt', 'DESC']],
    });
  }

  /**
   * Get student recent incidents
   */
  async getStudentRecentIncidents(
    studentId: string,
    limit: number = 10,
  ): Promise<IncidentReport[]> {
    this.logger.log(`Getting recent incidents for student: ${studentId}`);

    return this.incidentReportModel.findAll({
      where: { studentId },
      include: [
        {
          model: this.incidentReportModel.sequelize?.models.User,
          as: 'reportedBy',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [['occurredAt', 'DESC']],
      limit,
    });
  }
}
