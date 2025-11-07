import { Injectable, NotFoundException } from '@nestjs/common';
import { DataRetentionRepository } from '../repositories/data-retention.repository';
import {
  CreateDataRetentionDto,
  UpdateDataRetentionDto,
  QueryDataRetentionDto,
} from '../dto/data-retention.dto';
import { RetentionStatus } from '../../database/models/data-retention-policy.model';

@Injectable()
export class DataRetentionService {
  constructor(private readonly retentionRepository: DataRetentionRepository) {}

  async listPolicies(query: QueryDataRetentionDto) {
    return this.retentionRepository.findAll(query);
  }

  async getPolicyById(id: string) {
    const policy = await this.retentionRepository.findById(id);
    if (!policy) {
      throw new NotFoundException(
        `Data retention policy with ID ${id} not found`,
      );
    }
    return policy;
  }

  async createPolicy(dto: CreateDataRetentionDto) {
    return this.retentionRepository.create({
      ...dto,
      status: RetentionStatus.ACTIVE,
      autoDelete: dto.autoDelete ?? false,
    });
  }

  async updatePolicy(
    id: string,
    dto: UpdateDataRetentionDto,
    reviewedBy: string,
  ) {
    await this.getPolicyById(id); // Verify exists
    return this.retentionRepository.update(id, {
      ...dto,
      lastReviewedAt: new Date(),
      lastReviewedBy: reviewedBy,
    });
  }

  async deletePolicy(id: string) {
    await this.getPolicyById(id); // Verify exists
    return this.retentionRepository.delete(id);
  }
}
