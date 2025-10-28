import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComplianceReport } from '../entities/compliance-report.entity';

@Injectable()
export class ComplianceReportRepository {
  constructor(
    @InjectRepository(ComplianceReport)
    private readonly repository: Repository<ComplianceReport>,
  ) {}

  async findAll(filters: any = {}, page: number = 1, limit: number = 20) {
    const queryBuilder = this.repository.createQueryBuilder('report');

    if (filters.reportType) {
      queryBuilder.andWhere('report.reportType = :reportType', { reportType: filters.reportType });
    }
    if (filters.status) {
      queryBuilder.andWhere('report.status = :status', { status: filters.status });
    }
    if (filters.period) {
      queryBuilder.andWhere('report.period = :period', { period: filters.period });
    }

    const [data, total] = await queryBuilder
      .orderBy('report.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async findById(id: string) {
    return this.repository.findOne({ where: { id }, relations: ['checklistItems'] });
  }

  async create(data: Partial<ComplianceReport>) {
    const report = this.repository.create(data);
    return this.repository.save(report);
  }

  async update(id: string, data: Partial<ComplianceReport>) {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
