/**
 * Compliance Checklist Item Repository Implementation
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ComplianceChecklistItem } from '../../models/compliance-checklist-item.model';

@Injectable()
export class ComplianceChecklistItemRepository {
  constructor(
    @InjectModel(ComplianceChecklistItem)
    private readonly complianceChecklistItemModel: typeof ComplianceChecklistItem,
  ) {}

  async findAll(): Promise<ComplianceChecklistItem[]> {
    return this.complianceChecklistItemModel.findAll();
  }

  async findById(id: string): Promise<ComplianceChecklistItem | null> {
    return this.complianceChecklistItemModel.findByPk(id);
  }

  async create(data: Partial<ComplianceChecklistItem>): Promise<ComplianceChecklistItem> {
    return this.complianceChecklistItemModel.create(data as any);
  }

  async update(id: string, data: Partial<ComplianceChecklistItem>): Promise<[number]> {
    return this.complianceChecklistItemModel.update(data as any, {
      where: { id },
    });
  }

  async delete(id: string): Promise<number> {
    return this.complianceChecklistItemModel.destroy({
      where: { id },
    });
  }
}
