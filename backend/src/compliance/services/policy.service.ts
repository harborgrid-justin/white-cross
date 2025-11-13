import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PolicyRepository } from '../repositories/policy.repository';
import { CreatePolicyDto, QueryPolicyDto, UpdatePolicyDto } from '../dto/policy.dto';
import { PolicyStatus } from '../../database/models/policy-document.model';

import { BaseService } from '@/common/base';
@Injectable()
export class PolicyService extends BaseService {
  constructor(private readonly policyRepository: PolicyRepository) {}

  async listPolicies(query: QueryPolicyDto) {
    return this.policyRepository.findAllPolicies(query);
  }

  async getPolicyById(id: string) {
    const policy = await this.policyRepository.findPolicyById(id);
    if (!policy) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }
    return policy;
  }

  async createPolicy(dto: CreatePolicyDto) {
    return this.policyRepository.createPolicy({
      ...dto,
      status: PolicyStatus.DRAFT,
      effectiveDate: new Date(dto.effectiveDate),
      reviewDate: dto.reviewDate ? new Date(dto.reviewDate) : undefined,
    });
  }

  async updatePolicy(id: string, dto: UpdatePolicyDto) {
    await this.getPolicyById(id); // Verify exists
    const updateData: any = { ...dto };

    if (
      dto.status === PolicyStatus.ACTIVE &&
      dto.approvedBy &&
      !updateData.approvedAt
    ) {
      updateData.approvedAt = new Date();
    }
    if (dto.reviewDate) {
      updateData.reviewDate = new Date(dto.reviewDate);
    }

    return this.policyRepository.updatePolicy(id, updateData);
  }

  async deletePolicy(id: string) {
    await this.getPolicyById(id); // Verify exists
    return this.policyRepository.deletePolicy(id);
  }

  async acknowledgePolicy(policyId: string, userId: string, ipAddress: string) {
    const policy = await this.getPolicyById(policyId);

    if (policy.status !== PolicyStatus.ACTIVE) {
      throw new BadRequestException('Only active policies can be acknowledged');
    }

    // Check if already acknowledged
    const existing = await this.policyRepository.findAcknowledgment(
      policyId,
      userId,
    );
    if (existing) {
      throw new BadRequestException('Policy already acknowledged by this user');
    }

    return this.policyRepository.createAcknowledgment({
      policyId,
      userId,
      ipAddress,
      acknowledgedAt: new Date(),
    });
  }
}
