/**
 * Sequelize Health Record Repository Implementation
 * @description Concrete implementation of IHealthRecordRepository using Sequelize ORM
 */

import { Op } from 'sequelize';
import {
  IHealthRecordRepository,
  HealthRecord as HealthRecordEntity,
  HealthRecordFilters,
  HealthRecordQueryOptions,
  HealthSummary,
  CreateHealthRecordData,
  UpdateHealthRecordData
} from '../interfaces/IHealthRecordRepository';
import { RepositoryOptions } from '../interfaces/IRepository';
import { HealthRecord, Student, User, ChronicCondition, Allergy } from '../../database/models';

export class SequelizeHealthRecordRepository implements IHealthRecordRepository {
  async findById(id: string, options?: RepositoryOptions): Promise<HealthRecordEntity | null> {
    const record = await HealthRecord.findByPk(id, {
      include: options?.include,
      attributes: options?.attributes,
      transaction: options?.transaction
    });
    return record ? this.toEntity(record) : null;
  }

  async findAll(filters?: HealthRecordFilters, options?: RepositoryOptions): Promise<HealthRecordEntity[]> {
    const where = this.buildWhereClause(filters);
    const records = await HealthRecord.findAll({
      where,
      include: options?.include,
      attributes: options?.attributes,
      order: options?.order || [['date', 'DESC']],
      transaction: options?.transaction
    });
    return records.map(r => this.toEntity(r));
  }

  async findOne(filters: any, options?: RepositoryOptions): Promise<HealthRecordEntity | null> {
    const record = await HealthRecord.findOne({
      where: filters,
      include: options?.include,
      attributes: options?.attributes,
      transaction: options?.transaction
    });
    return record ? this.toEntity(record) : null;
  }

  async create(data: CreateHealthRecordData, options?: RepositoryOptions): Promise<HealthRecordEntity> {
    const record = await HealthRecord.create(data as any, {
      transaction: options?.transaction
    });
    return this.toEntity(record);
  }

  async update(id: string, data: UpdateHealthRecordData, options?: RepositoryOptions): Promise<HealthRecordEntity> {
    const record = await HealthRecord.findByPk(id, { transaction: options?.transaction });
    if (!record) {
      throw new Error(`Health record with id ${id} not found`);
    }
    await record.update(data as any, { transaction: options?.transaction });
    return this.toEntity(record);
  }

  async delete(id: string, options?: RepositoryOptions): Promise<void> {
    await HealthRecord.destroy({ where: { id }, transaction: options?.transaction });
  }

  async count(filters?: HealthRecordFilters): Promise<number> {
    const where = this.buildWhereClause(filters);
    return await HealthRecord.count({ where });
  }

  async findWithPagination(
    page: number,
    limit: number,
    filters?: HealthRecordFilters,
    options?: RepositoryOptions
  ): Promise<{ rows: HealthRecordEntity[]; count: number }> {
    const offset = (page - 1) * limit;
    const where = this.buildWhereClause(filters);
    const { rows, count } = await HealthRecord.findAndCountAll({
      where,
      limit,
      offset,
      include: options?.include,
      attributes: options?.attributes,
      order: options?.order || [['date', 'DESC']],
      transaction: options?.transaction
    });
    return { rows: rows.map(r => this.toEntity(r)), count };
  }

  async findByStudentId(studentId: string, options?: HealthRecordQueryOptions): Promise<HealthRecordEntity[]> {
    const queryOptions: any = {
      where: { studentId },
      order: [[options?.orderBy || 'date', options?.orderDirection || 'DESC']]
    };

    if (options?.includeStudent) {
      queryOptions.include = [{ model: Student, as: 'student' }];
    }
    if (options?.includeCreator) {
      queryOptions.include = queryOptions.include || [];
      queryOptions.include.push({ model: User, as: 'createdBy' });
    }
    if (options?.limit) {
      queryOptions.limit = options.limit;
    }
    if (options?.page && options?.limit) {
      queryOptions.offset = (options.page - 1) * options.limit;
    }

    const records = await HealthRecord.findAll(queryOptions);
    return records.map(r => this.toEntity(r));
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
    filters?: HealthRecordFilters
  ): Promise<HealthRecordEntity[]> {
    const where: any = {
      date: { [Op.between]: [startDate, endDate] }
    };
    if (filters) {
      Object.assign(where, this.buildWhereClause(filters));
    }
    const records = await HealthRecord.findAll({
      where,
      order: [['date', 'DESC']]
    });
    return records.map(r => this.toEntity(r));
  }

  async findWithVitals(id: string): Promise<HealthRecordEntity | null> {
    const record = await HealthRecord.findByPk(id, {
      attributes: { include: ['vital'] }
    });
    return record ? this.toEntity(record) : null;
  }

  async findRequiringFollowUp(beforeDate?: Date): Promise<HealthRecordEntity[]> {
    const cutoff = beforeDate || new Date();
    const records = await HealthRecord.findAll({
      where: {
        followUpRequired: true,
        followUpDate: { [Op.lte]: cutoff }
      },
      include: [{ model: Student, as: 'student' }],
      order: [['followUpDate', 'ASC']]
    });
    return records.map(r => this.toEntity(r));
  }

  async findByType(
    type: HealthRecordEntity['type'],
    filters?: HealthRecordFilters
  ): Promise<HealthRecordEntity[]> {
    const where: any = { type };
    if (filters) {
      Object.assign(where, this.buildWhereClause(filters));
    }
    const records = await HealthRecord.findAll({
      where,
      order: [['date', 'DESC']]
    });
    return records.map(r => this.toEntity(r));
  }

  async findByDiagnosisCode(diagnosisCode: string): Promise<HealthRecordEntity[]> {
    const records = await HealthRecord.findAll({
      where: { diagnosisCode },
      order: [['date', 'DESC']]
    });
    return records.map(r => this.toEntity(r));
  }

  async findRecentByStudent(studentId: string, limit: number = 10): Promise<HealthRecordEntity[]> {
    const records = await HealthRecord.findAll({
      where: { studentId },
      order: [['date', 'DESC']],
      limit
    });
    return records.map(r => this.toEntity(r));
  }

  async getHealthSummary(studentId: string): Promise<HealthSummary> {
    const totalRecords = await HealthRecord.count({ where: { studentId } });

    const recordsByType: any = {};
    const types: HealthRecordEntity['type'][] = ['VISIT', 'SCREENING', 'VACCINATION', 'INJURY', 'ILLNESS', 'MEDICATION', 'OTHER'];
    for (const type of types) {
      recordsByType[type] = await HealthRecord.count({ where: { studentId, recordType: type } });
    }

    const lastVisit = await HealthRecord.findOne({
      where: { studentId },
      order: [['date', 'DESC']],
      attributes: ['date']
    });

    const upcomingFollowUps = await this.findRequiringFollowUp(new Date());
    const filteredFollowUps = upcomingFollowUps.filter(r => r.studentId === studentId);

    const recentRecords = await HealthRecord.findAll({
      where: { studentId, diagnosis: { [Op.not]: null } },
      order: [['date', 'DESC']],
      limit: 5,
      attributes: ['diagnosis']
    });

    const chronicConditions = await ChronicCondition.findAll({
      where: { studentId },
      attributes: ['condition']
    });

    return {
      studentId,
      totalRecords,
      recordsByType,
      lastVisitDate: lastVisit?.get('date') as Date,
      upcomingFollowUps: filteredFollowUps,
      recentDiagnoses: recentRecords.map(r => r.get('diagnosis') as string).filter(Boolean),
      chronicConditions: chronicConditions.map(c => c.get('condition') as string)
    };
  }

  async findByCreator(userId: string, options?: HealthRecordQueryOptions): Promise<HealthRecordEntity[]> {
    const queryOptions: any = {
      where: { createdById: userId },
      order: [[options?.orderBy || 'date', options?.orderDirection || 'DESC']]
    };

    if (options?.includeStudent) {
      queryOptions.include = [{ model: Student, as: 'student' }];
    }
    if (options?.limit) {
      queryOptions.limit = options.limit;
    }
    if (options?.page && options?.limit) {
      queryOptions.offset = (options.page - 1) * options.limit;
    }

    const records = await HealthRecord.findAll(queryOptions);
    return records.map(r => this.toEntity(r));
  }

  async countByTypeForStudent(studentId: string): Promise<Record<HealthRecordEntity['type'], number>> {
    const types: HealthRecordEntity['type'][] = ['VISIT', 'SCREENING', 'VACCINATION', 'INJURY', 'ILLNESS', 'MEDICATION', 'OTHER'];
    const result: any = {};

    for (const type of types) {
      result[type] = await HealthRecord.count({ where: { studentId, recordType: type } });
    }

    return result;
  }

  private buildWhereClause(filters?: HealthRecordFilters): any {
    const where: any = {};
    if (!filters) return where;

    if (filters.studentId) where.studentId = filters.studentId;
    if (filters.type) {
      where.recordType = Array.isArray(filters.type) ? { [Op.in]: filters.type } : filters.type;
    }
    if (filters.dateFrom) {
      where.date = where.date || {};
      where.date[Op.gte] = filters.dateFrom;
    }
    if (filters.dateTo) {
      where.date = where.date || {};
      where.date[Op.lte] = filters.dateTo;
    }
    if (filters.createdById) where.createdById = filters.createdById;
    if (filters.followUpRequired !== undefined) where.followUpRequired = filters.followUpRequired;
    if (filters.diagnosisCode) where.diagnosisCode = filters.diagnosisCode;

    return where;
  }

  private toEntity(model: any): HealthRecordEntity {
    const plain = model.get({ plain: true });
    return {
      id: plain.id,
      studentId: plain.studentId,
      type: plain.type,
      date: plain.date,
      visitReason: plain.visitReason,
      symptoms: plain.symptoms,
      diagnosis: plain.diagnosis,
      diagnosisCode: plain.diagnosisCode,
      treatment: plain.treatment,
      followUpRequired: plain.followUpRequired,
      followUpDate: plain.followUpDate,
      vital: plain.vital,
      notes: plain.notes,
      attachments: plain.attachments,
      createdById: plain.createdById,
      updatedById: plain.updatedById,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt
    };
  }
}
