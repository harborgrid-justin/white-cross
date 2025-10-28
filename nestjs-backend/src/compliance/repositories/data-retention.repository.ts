import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataRetentionPolicy } from '../entities/data-retention-policy.entity';

@Injectable()
export class DataRetentionRepository {
  constructor(
    @InjectRepository(DataRetentionPolicy)
    private readonly repository: Repository<DataRetentionPolicy>,
  ) {}

  async findAll(filters: any = {}) {
    const queryBuilder = this.repository.createQueryBuilder('policy');

    if (filters.category) {
      queryBuilder.andWhere('policy.category = :category', { category: filters.category });
    }
    if (filters.status) {
      queryBuilder.andWhere('policy.status = :status', { status: filters.status });
    }

    return queryBuilder.orderBy('policy.createdAt', 'DESC').getMany();
  }

  async findById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<DataRetentionPolicy>) {
    const policy = this.repository.create(data);
    return this.repository.save(policy);
  }

  async update(id: string, data: Partial<DataRetentionPolicy>) {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
