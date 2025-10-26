/**
 * Sequelize Incident Report Repository Implementation
 * @description Concrete implementation of IIncidentReportRepository using Sequelize ORM
 */

import { Op, fn, col } from 'sequelize';
import {
  IIncidentReportRepository,
  IncidentReport as IncidentReportEntity,
  IncidentReportFilters,
  IncidentReportQueryOptions,
  IncidentTypeStatistics,
  IncidentSeverityStatistics,
  CreateIncidentReportData,
  UpdateIncidentReportData
} from '../interfaces/IIncidentReportRepository';
import { RepositoryOptions } from '../interfaces/IRepository';
import { IncidentReport, Student, User } from '../../database/models';

export class SequelizeIncidentReportRepository implements IIncidentReportRepository {
  async findById(id: string, options?: RepositoryOptions): Promise<IncidentReportEntity | null> {
    const report = await IncidentReport.findByPk(id, {
      include: options?.include,
      attributes: options?.attributes,
      transaction: options?.transaction
    });
    return report ? this.toEntity(report) : null;
  }

  async findAll(filters?: IncidentReportFilters, options?: RepositoryOptions): Promise<IncidentReportEntity[]> {
    const where = this.buildWhereClause(filters);
    const reports = await IncidentReport.findAll({
      where,
      include: options?.include,
      attributes: options?.attributes,
      order: options?.order || [['occurredAt', 'DESC']],
      transaction: options?.transaction
    });
    return reports.map(r => this.toEntity(r));
  }

  async findOne(filters: any, options?: RepositoryOptions): Promise<IncidentReportEntity | null> {
    const report = await IncidentReport.findOne({
      where: filters,
      include: options?.include,
      attributes: options?.attributes,
      transaction: options?.transaction
    });
    return report ? this.toEntity(report) : null;
  }

  async create(data: CreateIncidentReportData, options?: RepositoryOptions): Promise<IncidentReportEntity> {
    const report = await IncidentReport.create({ ...data, reportedAt: new Date() } as any, {
      transaction: options?.transaction
    });
    return this.toEntity(report);
  }

  async update(id: string, data: UpdateIncidentReportData, options?: RepositoryOptions): Promise<IncidentReportEntity> {
    const report = await IncidentReport.findByPk(id, { transaction: options?.transaction });
    if (!report) {
      throw new Error(`Incident report with id ${id} not found`);
    }
    await report.update(data as any, { transaction: options?.transaction });
    return this.toEntity(report);
  }

  async delete(id: string, options?: RepositoryOptions): Promise<void> {
    await IncidentReport.destroy({ where: { id }, transaction: options?.transaction });
  }

  async count(filters?: IncidentReportFilters): Promise<number> {
    const where = this.buildWhereClause(filters);
    return await IncidentReport.count({ where });
  }

  async findWithPagination(
    page: number,
    limit: number,
    filters?: IncidentReportFilters,
    options?: RepositoryOptions
  ): Promise<{ rows: IncidentReportEntity[]; count: number }> {
    const offset = (page - 1) * limit;
    const where = this.buildWhereClause(filters);
    const { rows, count } = await IncidentReport.findAndCountAll({
      where,
      limit,
      offset,
      include: options?.include,
      attributes: options?.attributes,
      order: options?.order || [['occurredAt', 'DESC']],
      transaction: options?.transaction
    });
    return { rows: rows.map(r => this.toEntity(r)), count };
  }

  async findByStudent(studentId: string, options?: IncidentReportQueryOptions): Promise<IncidentReportEntity[]> {
    const queryOptions = this.buildQueryOptions({ studentId }, options);
    const reports = await IncidentReport.findAll(queryOptions);
    return reports.map(r => this.toEntity(r));
  }

  async findBySeverity(severity: IncidentReportEntity['severity'], filters?: IncidentReportFilters): Promise<IncidentReportEntity[]> {
    const where = this.buildWhereClause({ ...filters, severity });
    const reports = await IncidentReport.findAll({ where, order: [['occurredAt', 'DESC']] });
    return reports.map(r => this.toEntity(r));
  }

  async findByType(type: IncidentReportEntity['type'], filters?: IncidentReportFilters): Promise<IncidentReportEntity[]> {
    const where = this.buildWhereClause({ ...filters, type });
    const reports = await IncidentReport.findAll({ where, order: [['occurredAt', 'DESC']] });
    return reports.map(r => this.toEntity(r));
  }

  async findByStatus(status: IncidentReportEntity['status'], filters?: IncidentReportFilters): Promise<IncidentReportEntity[]> {
    const where = this.buildWhereClause({ ...filters, status });
    const reports = await IncidentReport.findAll({ where, order: [['occurredAt', 'DESC']] });
    return reports.map(r => this.toEntity(r));
  }

  async findRequiringFollowUp(beforeDate?: Date): Promise<IncidentReportEntity[]> {
    const reports = await IncidentReport.findAll({
      where: {
        followUpRequired: true
      },
      include: [{ model: Student, as: 'student' }],
      order: [['occurredAt', 'ASC']]
    });
    return reports.map(r => this.toEntity(r));
  }

  async findByReporter(reporterId: string, options?: IncidentReportQueryOptions): Promise<IncidentReportEntity[]> {
    const queryOptions = this.buildQueryOptions({ reportedById: reporterId }, options);
    const reports = await IncidentReport.findAll(queryOptions);
    return reports.map(r => this.toEntity(r));
  }

  async findByDateRange(startDate: Date, endDate: Date, filters?: IncidentReportFilters): Promise<IncidentReportEntity[]> {
    const where: any = {
      occurredAt: { [Op.between]: [startDate, endDate] }
    };
    if (filters) {
      Object.assign(where, this.buildWhereClause(filters));
    }
    const reports = await IncidentReport.findAll({ where, order: [['occurredAt', 'DESC']] });
    return reports.map(r => this.toEntity(r));
  }

  async findRecent(limit: number = 10, filters?: IncidentReportFilters): Promise<IncidentReportEntity[]> {
    const where = this.buildWhereClause(filters);
    const reports = await IncidentReport.findAll({
      where,
      limit,
      order: [['occurredAt', 'DESC']],
      include: [{ model: Student, as: 'student' }]
    });
    return reports.map(r => this.toEntity(r));
  }

  async findUnresolved(filters?: IncidentReportFilters): Promise<IncidentReportEntity[]> {
    const where = this.buildWhereClause({ ...filters, status: ['OPEN', 'IN_PROGRESS'] as any });
    const reports = await IncidentReport.findAll({ where, order: [['occurredAt', 'DESC']] });
    return reports.map(r => this.toEntity(r));
  }

  async getStatisticsByType(startDate: Date, endDate: Date): Promise<IncidentTypeStatistics[]> {
    const results = await IncidentReport.findAll({
      attributes: [
        'type',
        [fn('COUNT', col('id')), 'count']
      ],
      where: {
        occurredAt: { [Op.between]: [startDate, endDate] }
      },
      group: ['type'],
      raw: true
    });

    const total = results.reduce((sum: number, r: any) => sum + parseInt(r.count), 0);
    return results.map((r: any) => ({
      type: r.type,
      count: parseInt(r.count),
      percentage: total > 0 ? (parseInt(r.count) / total) * 100 : 0
    }));
  }

  async getStatisticsBySeverity(startDate: Date, endDate: Date): Promise<IncidentSeverityStatistics[]> {
    const results = await IncidentReport.findAll({
      attributes: [
        'severity',
        [fn('COUNT', col('id')), 'count']
      ],
      where: {
        occurredAt: { [Op.between]: [startDate, endDate] }
      },
      group: ['severity'],
      raw: true
    });

    const total = results.reduce((sum: number, r: any) => sum + parseInt(r.count), 0);
    return results.map((r: any) => ({
      severity: r.severity,
      count: parseInt(r.count),
      percentage: total > 0 ? (parseInt(r.count) / total) * 100 : 0
    }));
  }

  async countByStudent(studentId: string): Promise<number> {
    return await IncidentReport.count({ where: { studentId } });
  }

  async findByLocation(location: string, filters?: IncidentReportFilters): Promise<IncidentReportEntity[]> {
    const where = this.buildWhereClause({ ...filters, location });
    const reports = await IncidentReport.findAll({ where, order: [['occurredAt', 'DESC']] });
    return reports.map(r => this.toEntity(r));
  }

  private buildWhereClause(filters?: IncidentReportFilters): any {
    const where: any = {};
    if (!filters) return where;

    if (filters.studentId) where.studentId = filters.studentId;
    if (filters.type) {
      where.type = Array.isArray(filters.type) ? { [Op.in]: filters.type } : filters.type;
    }
    if (filters.severity) {
      where.severity = Array.isArray(filters.severity) ? { [Op.in]: filters.severity } : filters.severity;
    }
    if (filters.status) {
      where.status = Array.isArray(filters.status) ? { [Op.in]: filters.status } : filters.status;
    }
    if (filters.reportedById) where.reportedById = filters.reportedById;
    if (filters.occurredFrom) {
      where.occurredAt = where.occurredAt || {};
      where.occurredAt[Op.gte] = filters.occurredFrom;
    }
    if (filters.occurredTo) {
      where.occurredAt = where.occurredAt || {};
      where.occurredAt[Op.lte] = filters.occurredTo;
    }
    if (filters.parentNotified !== undefined) where.parentNotified = filters.parentNotified;
    if (filters.followUpRequired !== undefined) where.followUpRequired = filters.followUpRequired;
    if (filters.location) where.location = filters.location;

    return where;
  }

  private buildQueryOptions(filters: any, options?: IncidentReportQueryOptions): any {
    const queryOptions: any = {
      where: filters,
      order: [[options?.orderBy || 'occurredAt', options?.orderDirection || 'DESC']]
    };

    const include: any[] = [];
    if (options?.includeStudent) {
      include.push({ model: Student, as: 'student' });
    }
    if (options?.includeReporter) {
      include.push({ model: User, as: 'reportedBy' });
    }
    if (include.length > 0) {
      queryOptions.include = include;
    }

    if (options?.limit) {
      queryOptions.limit = options.limit;
    }
    if (options?.page && options?.limit) {
      queryOptions.offset = (options.page - 1) * options.limit;
    }

    return queryOptions;
  }

  private toEntity(model: any): IncidentReportEntity {
    const plain = model.get({ plain: true });
    return {
      id: plain.id,
      studentId: plain.studentId,
      type: plain.type,
      severity: plain.severity,
      description: plain.description,
      location: plain.location,
      occurredAt: plain.occurredAt,
      reportedAt: plain.reportedAt,
      reportedById: plain.reportedById,
      witnessIds: plain.witnessIds,
      actionsTaken: plain.actionsTaken,
      treatmentProvided: plain.treatmentProvided,
      parentNotified: plain.parentNotified,
      parentNotificationDetails: plain.parentNotificationDetails,
      followUpRequired: plain.followUpRequired,
      followUpDetails: plain.followUpDetails,
      followUpCompletedAt: plain.followUpCompletedAt,
      attachments: plain.attachments,
      status: plain.status,
      resolution: plain.resolution,
      resolvedById: plain.resolvedById,
      resolvedAt: plain.resolvedAt,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt
    };
  }
}
