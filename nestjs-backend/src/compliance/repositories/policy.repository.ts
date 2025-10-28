import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PolicyDocument } from '../entities/policy-document.entity';
import { PolicyAcknowledgment } from '../entities/policy-acknowledgment.entity';

@Injectable()
export class PolicyRepository {
  constructor(
    @InjectRepository(PolicyDocument)
    private readonly policyRepo: Repository<PolicyDocument>,
    @InjectRepository(PolicyAcknowledgment)
    private readonly ackRepo: Repository<PolicyAcknowledgment>,
  ) {}

  async findAllPolicies(filters: any = {}) {
    const queryBuilder = this.policyRepo.createQueryBuilder('policy');

    if (filters.category) {
      queryBuilder.andWhere('policy.category = :category', { category: filters.category });
    }
    if (filters.status) {
      queryBuilder.andWhere('policy.status = :status', { status: filters.status });
    }

    return queryBuilder.orderBy('policy.createdAt', 'DESC').getMany();
  }

  async findPolicyById(id: string) {
    return this.policyRepo.findOne({ where: { id }, relations: ['acknowledgments'] });
  }

  async createPolicy(data: Partial<PolicyDocument>) {
    const policy = this.policyRepo.create(data);
    return this.policyRepo.save(policy);
  }

  async updatePolicy(id: string, data: Partial<PolicyDocument>) {
    await this.policyRepo.update(id, data);
    return this.findPolicyById(id);
  }

  async deletePolicy(id: string) {
    return this.policyRepo.delete(id);
  }

  async createAcknowledgment(data: Partial<PolicyAcknowledgment>) {
    const ack = this.ackRepo.create(data);
    return this.ackRepo.save(ack);
  }

  async findAcknowledgment(policyId: string, userId: string) {
    return this.ackRepo.findOne({ where: { policyId, userId } });
  }
}
