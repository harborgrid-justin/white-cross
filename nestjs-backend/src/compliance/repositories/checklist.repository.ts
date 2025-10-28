import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComplianceChecklistItem } from '../entities/compliance-checklist-item.entity';

@Injectable()
export class ChecklistRepository {
  constructor(
    @InjectRepository(ComplianceChecklistItem)
    private readonly repository: Repository<ComplianceChecklistItem>,
  ) {}

  async findAll(filters: any = {}, page: number = 1, limit: number = 20) {
    const queryBuilder = this.repository.createQueryBuilder('item');

    if (filters.reportId) {
      queryBuilder.andWhere('item.reportId = :reportId', { reportId: filters.reportId });
    }
    if (filters.category) {
      queryBuilder.andWhere('item.category = :category', { category: filters.category });
    }
    if (filters.status) {
      queryBuilder.andWhere('item.status = :status', { status: filters.status });
    }

    const [data, total] = await queryBuilder
      .orderBy('item.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async findById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<ComplianceChecklistItem>) {
    const item = this.repository.create(data);
    return this.repository.save(item);
  }

  async update(id: string, data: Partial<ComplianceChecklistItem>) {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
