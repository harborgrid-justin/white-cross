import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ComplianceReport, ComplianceReportAttributes } from '../../database/models/compliance-report.model';
import { ComplianceChecklistItem } from '../../database/models/compliance-checklist-item.model';

@Injectable()
export class ComplianceReportRepository {
  constructor(
    @InjectModel(ComplianceReport)
    private readonly complianceReportModel: typeof ComplianceReport,
  ) {}

  async findAll(filters: any = {}, page: number = 1, limit: number = 20) {
    const whereClause: any = {};

    if (filters.reportType) {
      whereClause.reportType = filters.reportType;
    }
    if (filters.status) {
      whereClause.status = filters.status;
    }
    if (filters.period) {
      whereClause.period = filters.period;
    }

    const { rows: data, count: total } = await this.complianceReportModel.findAndCountAll({
      where: whereClause,
      include: [{ model: ComplianceChecklistItem, as: 'checklistItems' }],
      order: [['createdAt', 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });

    return { data, total };
  }

  async findById(id: string) {
    return this.complianceReportModel.findByPk(id, {
      include: [{ model: ComplianceChecklistItem, as: 'checklistItems' }],
    });
  }

  async create(data: Omit<ComplianceReportAttributes, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.complianceReportModel.create(data);
  }

  async update(id: string, data: Partial<ComplianceReportAttributes>) {
    const [affectedCount] = await this.complianceReportModel.update(data, { where: { id } });
    if (affectedCount > 0) {
      return this.findById(id);
    }
    return null;
  }

  async delete(id: string) {
    return this.complianceReportModel.destroy({ where: { id } });
  }
}
