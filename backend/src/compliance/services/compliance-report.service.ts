import { Injectable, NotFoundException } from '@nestjs/common';
import { ComplianceReportRepository } from '../../database/repositories/impl/compliance-report.repository';
import { CreateComplianceReportDto, UpdateComplianceReportDto, GenerateReportDto, QueryComplianceReportDto } from '../dto/compliance-report.dto';
import { ComplianceStatus } from '../entities/compliance-report.entity';
import { ExecutionContext } from '../../database/types';

@Injectable()
export class ComplianceReportService {
  constructor(private readonly reportRepository: ComplianceReportRepository) {}

  async listReports(query: QueryComplianceReportDto) {
    const { page = 1, limit = 20, ...filters } = query;
    const result = await this.reportRepository.findMany({
      where: filters,
      pagination: { page, limit }
    });
    return {
      data: result.data,
      pagination: result.pagination,
    };
  }

  async getReportById(id: string) {
    const report = await this.reportRepository.findById(id);
    if (!report) {
      throw new NotFoundException(`Compliance report with ID ${id} not found`);
    }
    return report;
  }

  async createReport(dto: CreateComplianceReportDto, createdById: string, context: ExecutionContext) {
    return this.reportRepository.create({
      ...dto,
      createdById,
      status: ComplianceStatus.PENDING,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
    }, context);
  }

  async updateReport(id: string, dto: UpdateComplianceReportDto, context: ExecutionContext) {
    await this.getReportById(id); // Verify exists
    const updateData: any = { ...dto };

    if (dto.status === ComplianceStatus.COMPLIANT && !updateData.submittedAt) {
      updateData.submittedAt = new Date();
    }
    if (dto.reviewedBy && !updateData.reviewedAt) {
      updateData.reviewedAt = new Date();
    }

    return this.reportRepository.update(id, updateData, context);
  }

  async deleteReport(id: string, context: ExecutionContext) {
    await this.getReportById(id); // Verify exists
    return this.reportRepository.delete(id, context);
  }

  async generateReport(dto: GenerateReportDto, createdById: string, context: ExecutionContext) {
    // Automated report generation logic would go here
    // For now, create a basic report structure
    return this.createReport({
      reportType: dto.reportType,
      title: `${dto.reportType} Compliance Report - ${dto.period}`,
      description: `Auto-generated compliance report for ${dto.period} period`,
      period: dto.period,
      dueDate: dto.startDate,
    }, createdById, context);
  }
}
