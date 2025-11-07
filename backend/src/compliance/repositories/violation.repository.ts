import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ComplianceViolation, ComplianceViolationAttributes } from '../../database/models/compliance-violation.model';
import { RemediationAction, RemediationActionAttributes } from '../../database/models/remediation-action.model';

@Injectable()
export class ViolationRepository {
  constructor(
    @InjectModel(ComplianceViolation)
    private readonly violationModel: typeof ComplianceViolation,
    @InjectModel(RemediationAction)
    private readonly remediationModel: typeof RemediationAction,
  ) {}

  async findAllViolations(
    filters: any = {},
    page: number = 1,
    limit: number = 20,
  ) {
    const whereClause: any = {};

    if (filters.violationType) {
      whereClause.violationType = filters.violationType;
    }
    if (filters.severity) {
      whereClause.severity = filters.severity;
    }
    if (filters.status) {
      whereClause.status = filters.status;
    }

    const { rows: data, count: total } =
      await this.violationModel.findAndCountAll({
        where: whereClause,
        order: [['discoveredAt', 'DESC']],
        limit,
        offset: (page - 1) * limit,
      });

    return { data, total };
  }

  async findViolationById(id: string) {
    return this.violationModel.findByPk(id);
  }

  async createViolation(
    data: Omit<ComplianceViolationAttributes, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    return this.violationModel.create(data);
  }

  async updateViolation(
    id: string,
    data: Partial<ComplianceViolationAttributes>,
  ) {
    const [affectedCount] = await this.violationModel.update(data, {
      where: { id },
    });
    if (affectedCount > 0) {
      return this.findViolationById(id);
    }
    return null;
  }

  async createRemediation(
    data: Omit<RemediationActionAttributes, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    return this.remediationModel.create(data);
  }

  async findRemediationById(id: string) {
    return this.remediationModel.findByPk(id);
  }

  async updateRemediation(
    id: string,
    data: Partial<RemediationActionAttributes>,
  ) {
    const [affectedCount] = await this.remediationModel.update(data, {
      where: { id },
    });
    if (affectedCount > 0) {
      return this.findRemediationById(id);
    }
    return null;
  }

  async findRemediationsByViolation(violationId: string) {
    return this.remediationModel.findAll({
      where: { violationId },
    });
  }
}
