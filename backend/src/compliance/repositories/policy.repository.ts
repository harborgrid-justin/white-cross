import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  PolicyDocument,
  PolicyDocumentAttributes,
} from '../../database/models/policy-document.model';
import {
  PolicyAcknowledgment,
  PolicyAcknowledgmentAttributes,
} from '../../database/models/policy-acknowledgment.model';

@Injectable()
export class PolicyRepository {
  constructor(
    @InjectModel(PolicyDocument)
    private readonly policyModel: typeof PolicyDocument,
    @InjectModel(PolicyAcknowledgment)
    private readonly acknowledgmentModel: typeof PolicyAcknowledgment,
  ) {}

  async findAllPolicies(filters: any = {}) {
    const whereClause: any = {};

    if (filters.category) {
      whereClause.category = filters.category;
    }
    if (filters.status) {
      whereClause.status = filters.status;
    }

    return this.policyModel.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });
  }

  async findPolicyById(id: string) {
    return this.policyModel.findByPk(id, {
      include: [{ model: PolicyAcknowledgment, as: 'acknowledgments' }],
    });
  }

  async createPolicy(
    data: Omit<PolicyDocumentAttributes, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    return this.policyModel.create(data);
  }

  async updatePolicy(id: string, data: Partial<PolicyDocumentAttributes>) {
    const [affectedCount] = await this.policyModel.update(data, {
      where: { id },
    });
    if (affectedCount > 0) {
      return this.findPolicyById(id);
    }
    return null;
  }

  async deletePolicy(id: string) {
    return this.policyModel.destroy({ where: { id } });
  }

  async createAcknowledgment(data: Omit<PolicyAcknowledgmentAttributes, 'id'>) {
    return this.acknowledgmentModel.create(data);
  }

  async findAcknowledgment(policyId: string, userId: string) {
    return this.acknowledgmentModel.findOne({
      where: { policyId, userId },
    });
  }
}
