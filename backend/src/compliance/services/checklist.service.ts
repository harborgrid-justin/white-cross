import { Injectable, NotFoundException } from '@nestjs/common';
import { ChecklistRepository } from '../repositories/checklist.repository';
import { CreateChecklistDto, QueryChecklistDto, UpdateChecklistDto } from '../dto/checklist.dto';
import { ChecklistItemStatus } from '../../database/models/compliance-checklist-item.model';

import { BaseService } from '../../../common/base';
@Injectable()
export class ChecklistService extends BaseService {
  constructor(private readonly checklistRepository: ChecklistRepository) {}

  async listChecklists(query: QueryChecklistDto) {
    const { page = 1, limit = 20, ...filters } = query;
    const { data, total } = await this.checklistRepository.findAll(
      filters,
      page,
      limit,
    );
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getChecklistById(id: string) {
    const checklist = await this.checklistRepository.findById(id);
    if (!checklist) {
      throw new NotFoundException(`Checklist item with ID ${id} not found`);
    }
    return checklist;
  }

  async createChecklist(dto: CreateChecklistDto) {
    return this.checklistRepository.create({
      ...dto,
      status: ChecklistItemStatus.PENDING,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
    });
  }

  async updateChecklist(id: string, dto: UpdateChecklistDto) {
    await this.getChecklistById(id); // Verify exists
    const updateData: any = { ...dto };

    if (
      dto.status === ChecklistItemStatus.COMPLETED &&
      !updateData.completedAt
    ) {
      updateData.completedAt = new Date();
    }

    return this.checklistRepository.update(id, updateData);
  }

  async deleteChecklist(id: string) {
    await this.getChecklistById(id); // Verify exists
    return this.checklistRepository.delete(id);
  }
}
