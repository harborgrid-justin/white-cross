/**
 * Incident Report Repository Implementation
 * Tracks safety incidents, injuries, and emergency events at school
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { ExecutionContext, QueryOptions } from '../../types';
import { IncidentReport } from '../../models/incident-report.model';

export interface IncidentReportAttributes {
  id: string;
  studentId: string;
  incidentDate: Date;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  location?: string;
  description: string;
  reportedBy?: string;
  witnesses?: string[];
  injuries?: string;
  actions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateIncidentReportDTO {
  studentId: string;
  incidentDate: Date;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  location?: string;
  description: string;
  reportedBy?: string;
  witnesses?: string[];
  injuries?: string;
  actions?: string;
}

export interface UpdateIncidentReportDTO {
  incidentDate?: Date;
  type?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  location?: string;
  description?: string;
  witnesses?: string[];
  injuries?: string;
  actions?: string;
}

@Injectable()
export class IncidentReportRepository extends BaseRepository<
  IncidentReport,
  IncidentReportAttributes,
  CreateIncidentReportDTO
> {
  constructor(
    @InjectModel(IncidentReport) model: typeof IncidentReport,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'IncidentReport');
  }

  /**
   * Find incidents by student
   */
  async findByStudent(
    studentId: string,
    options?: QueryOptions,
  ): Promise<IncidentReportAttributes[]> {
    try {
      const incidents = await this.model.findAll({
        where: { studentId },
        order: [['occurredAt', 'DESC']],
        ...options,
      });
      return incidents.map((incident: IncidentReport) => this.mapToEntity(incident));
    } catch (error) {
      this.logger.error('Error finding incidents by student:', error);
      throw new RepositoryError(
        'Failed to find incidents by student',
        'FIND_BY_STUDENT_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  /**
   * Find incidents by severity level
   */
  async findBySeverity(
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    options?: QueryOptions,
  ): Promise<IncidentReportAttributes[]> {
    try {
      const incidents = await this.model.findAll({
        where: { severity },
        order: [['occurredAt', 'DESC']],
        ...options,
      });
      return incidents.map((incident: IncidentReport) => this.mapToEntity(incident));
    } catch (error) {
      this.logger.error('Error finding incidents by severity:', error);
      throw new RepositoryError(
        'Failed to find incidents by severity',
        'FIND_BY_SEVERITY_ERROR',
        500,
        { severity, error: (error as Error).message },
      );
    }
  }

  /**
   * Find incidents within date range
   */
  async findByDateRange(
    startDate: Date,
    endDate: Date,
    options?: QueryOptions,
  ): Promise<IncidentReportAttributes[]> {
    try {
      const incidents = await this.model.findAll({
        where: {
          occurredAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        order: [['occurredAt', 'DESC']],
        ...options,
      });
      return incidents.map((incident: IncidentReport) => this.mapToEntity(incident));
    } catch (error) {
      this.logger.error('Error finding incidents by date range:', error);
      throw new RepositoryError(
        'Failed to find incidents by date range',
        'FIND_BY_DATE_RANGE_ERROR',
        500,
        { startDate, endDate, error: (error as Error).message },
      );
    }
  }

  protected async validateCreate(
    data: CreateIncidentReportDTO,
  ): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateIncidentReportDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: IncidentReport): Promise<void> {
    try {
      const entityData = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, entityData.id),
      );
      await this.cacheManager.deletePattern(
        `white-cross:${this.entityName.toLowerCase()}:*`,
      );
    } catch (error) {
      this.logger.warn(`Error invalidating ${this.entityName} caches:`, error);
    }
  }

  protected sanitizeForAudit(data: Partial<IncidentReportAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
