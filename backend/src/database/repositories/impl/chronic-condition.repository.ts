/**
 * Chronic Condition Repository Implementation
 * Injectable NestJS repository for ongoing medical condition tracking
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ChronicCondition } from '../../models/chronic-condition.model';

@Injectable()
export class ChronicConditionRepository {
  constructor(
    @InjectModel(ChronicCondition)
    private readonly chronicConditionModel: typeof ChronicCondition,
  ) {}

  async findAll(): Promise<ChronicCondition[]> {
    return this.chronicConditionModel.findAll();
  }

  async findById(id: string): Promise<ChronicCondition | null> {
    return this.chronicConditionModel.findByPk(id);
  }

  async create(data: Partial<ChronicCondition>): Promise<ChronicCondition> {
    return this.chronicConditionModel.create(data as any);
  }

  async update(id: string, data: Partial<ChronicCondition>): Promise<[number]> {
    return this.chronicConditionModel.update(data as any, {
      where: { id },
    });
  }

  async delete(id: string): Promise<number> {
    return this.chronicConditionModel.destroy({
      where: { id },
    });
  }

  async findByStudent(studentId: string): Promise<ChronicCondition[]> {
    return this.chronicConditionModel.findAll({
      where: { studentId, isActive: true },
      order: [['diagnosedDate', 'DESC']]
    });
  }

  async findBySeverity(severity: string): Promise<ChronicCondition[]> {
    return this.chronicConditionModel.findAll({
      where: { severity, isActive: true },
      order: [['condition', 'ASC']]
    });
  }
}
