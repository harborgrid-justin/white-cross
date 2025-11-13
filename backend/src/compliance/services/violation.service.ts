import { Injectable, NotFoundException } from '@nestjs/common';
import { ViolationRepository } from '../repositories/violation.repository';
import {
  CreateRemediationDto,
  CreateViolationDto,
  QueryViolationDto,
  UpdateRemediationDto,
  UpdateViolationDto,
} from '../dto/violation.dto';
import { ViolationStatus } from '../../database/models/compliance-violation.model';
import { RemediationStatus } from '../../database/models/remediation-action.model';

import { BaseService } from '@/common/base';
@Injectable()
export class ViolationService extends BaseService {
  constructor(private readonly violationRepository: ViolationRepository) {}

  async listViolations(query: QueryViolationDto) {
    const { page = 1, limit = 20, ...filters } = query;
    const { data, total } = await this.violationRepository.findAllViolations(
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

  async getViolationById(id: string) {
    const violation = await this.violationRepository.findViolationById(id);
    if (!violation) {
      throw new NotFoundException(`Violation with ID ${id} not found`);
    }
    return violation;
  }

  async createViolation(dto: CreateViolationDto, reportedBy: string) {
    return this.violationRepository.createViolation({
      ...dto,
      reportedBy,
      status: ViolationStatus.REPORTED,
      discoveredAt: new Date(dto.discoveredAt),
    });
  }

  async updateViolation(id: string, dto: UpdateViolationDto) {
    await this.getViolationById(id); // Verify exists
    const updateData: any = { ...dto };

    if (dto.status === ViolationStatus.RESOLVED && !updateData.resolvedAt) {
      updateData.resolvedAt = new Date();
    }

    return this.violationRepository.updateViolation(id, updateData);
  }

  async createRemediation(dto: CreateRemediationDto) {
    return this.violationRepository.createRemediation({
      ...dto,
      status: RemediationStatus.PLANNED,
      dueDate: new Date(dto.dueDate),
    });
  }

  async updateRemediation(id: string, dto: UpdateRemediationDto) {
    const remediation = await this.violationRepository.findRemediationById(id);
    if (!remediation) {
      throw new NotFoundException(`Remediation action with ID ${id} not found`);
    }

    const updateData: any = { ...dto };

    if (dto.status === RemediationStatus.COMPLETED && !updateData.completedAt) {
      updateData.completedAt = new Date();
    }
    if (dto.verifiedBy && !updateData.verifiedAt) {
      updateData.verifiedAt = new Date();
    }

    return this.violationRepository.updateRemediation(id, updateData);
  }

  async getRemediationsByViolation(violationId: string) {
    return this.violationRepository.findRemediationsByViolation(violationId);
  }
}
