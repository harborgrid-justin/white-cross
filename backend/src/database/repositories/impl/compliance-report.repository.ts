/**
 * Compliance Report Repository Implementation
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ComplianceReport } from '../../models/compliance-report.model';

@Injectable()
export class ComplianceReportRepository {
  constructor(
    @InjectModel(ComplianceReport)
    private readonly complianceReportModel: typeof ComplianceReport,
  ) {}

  async findAll(): Promise<ComplianceReport[]> {
    return this.complianceReportModel.findAll();
  }

  async findById(id: string): Promise<ComplianceReport | null> {
    return this.complianceReportModel.findByPk(id);
  }

  async create(data: Partial<ComplianceReport>): Promise<ComplianceReport> {
    return this.complianceReportModel.create(data);
  }

  async update(id: string, data: Partial<ComplianceReport>): Promise<[number]> {
    return this.complianceReportModel.update(data, {
      where: { id },
    });
  }

  async delete(id: string): Promise<number> {
    return this.complianceReportModel.destroy({
      where: { id },
    });
  }
}
