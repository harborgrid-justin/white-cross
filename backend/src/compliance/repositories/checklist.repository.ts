import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ComplianceChecklistItem, ComplianceChecklistItemAttributes } from '../../database/models/compliance-checklist-item.model';

@Injectable()
export class ChecklistRepository {
  constructor(
    @InjectModel(ComplianceChecklistItem)
    private readonly checklistItemModel: typeof ComplianceChecklistItem,
  ) {}

  async findAll(filters: any = {}, page: number = 1, limit: number = 20) {
    const whereClause: any = {};

    if (filters.reportId) {
      whereClause.reportId = filters.reportId;
    }
    if (filters.category) {
      whereClause.category = filters.category;
    }
    if (filters.status) {
      whereClause.status = filters.status;
    }

    const { rows: data, count: total } = await this.checklistItemModel.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });

    return { data, total };
  }

  async findById(id: string) {
    return this.checklistItemModel.findByPk(id);
  }

  async create(data: Omit<ComplianceChecklistItemAttributes, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.checklistItemModel.create(data);
  }

  async update(id: string, data: Partial<ComplianceChecklistItemAttributes>) {
    const [affectedCount] = await this.checklistItemModel.update(data, { where: { id } });
    if (affectedCount > 0) {
      return this.findById(id);
    }
    return null;
  }

  async delete(id: string) {
    return this.checklistItemModel.destroy({ where: { id } });
  }
}
