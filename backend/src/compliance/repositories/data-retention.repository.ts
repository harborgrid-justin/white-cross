import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DataRetentionPolicy, DataRetentionPolicyAttributes } from '../../database/models/data-retention-policy.model';

@Injectable()
export class DataRetentionRepository {
  constructor(
    @InjectModel(DataRetentionPolicy)
    private readonly dataRetentionModel: typeof DataRetentionPolicy,
  ) {}

  async findAll(filters: any = {}) {
    const whereClause: any = {};

    if (filters.category) {
      whereClause.category = filters.category;
    }
    if (filters.status) {
      whereClause.status = filters.status;
    }

    return this.dataRetentionModel.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id: string) {
    return this.dataRetentionModel.findByPk(id);
  }

  async create(data: Omit<DataRetentionPolicyAttributes, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.dataRetentionModel.create(data);
  }

  async update(id: string, data: Partial<DataRetentionPolicyAttributes>) {
    const [affectedCount] = await this.dataRetentionModel.update(data, { where: { id } });
    if (affectedCount > 0) {
      return this.findById(id);
    }
    return null;
  }

  async delete(id: string) {
    return this.dataRetentionModel.destroy({ where: { id } });
  }
}
