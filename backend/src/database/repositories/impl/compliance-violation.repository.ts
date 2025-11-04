/**
 * Compliance Violation Repository Implementation
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ComplianceViolation } from '../../models/compliance-violation.model';

@Injectable()
export class ComplianceViolationRepository {
  constructor(
    @InjectModel(ComplianceViolation)
    private readonly complianceViolationModel: typeof ComplianceViolation,
  ) {}

  async findAll(): Promise<ComplianceViolation[]> {
    return this.complianceViolationModel.findAll();
  }

  async findById(id: string): Promise<ComplianceViolation | null> {
    return this.complianceViolationModel.findByPk(id);
  }

  async create(data: Partial<ComplianceViolation>): Promise<ComplianceViolation> {
    return this.complianceViolationModel.create(data as any);
  }

  async update(id: string, data: Partial<ComplianceViolation>): Promise<[number]> {
    return this.complianceViolationModel.update(data as any, {
      where: { id },
    });
  }

  async delete(id: string): Promise<number> {
    return this.complianceViolationModel.destroy({
      where: { id },
    });
  }
}
