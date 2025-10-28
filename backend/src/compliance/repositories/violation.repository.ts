import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComplianceViolation } from '../entities/compliance-violation.entity';
import { RemediationAction } from '../entities/remediation-action.entity';

@Injectable()
export class ViolationRepository {
  constructor(
    @InjectRepository(ComplianceViolation)
    private readonly violationRepo: Repository<ComplianceViolation>,
    @InjectRepository(RemediationAction)
    private readonly remediationRepo: Repository<RemediationAction>,
  ) {}

  async findAllViolations(filters: any = {}, page: number = 1, limit: number = 20) {
    const queryBuilder = this.violationRepo.createQueryBuilder('violation');

    if (filters.violationType) {
      queryBuilder.andWhere('violation.violationType = :violationType', { violationType: filters.violationType });
    }
    if (filters.severity) {
      queryBuilder.andWhere('violation.severity = :severity', { severity: filters.severity });
    }
    if (filters.status) {
      queryBuilder.andWhere('violation.status = :status', { status: filters.status });
    }

    const [data, total] = await queryBuilder
      .orderBy('violation.discoveredAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async findViolationById(id: string) {
    return this.violationRepo.findOne({ where: { id } });
  }

  async createViolation(data: Partial<ComplianceViolation>) {
    const violation = this.violationRepo.create(data);
    return this.violationRepo.save(violation);
  }

  async updateViolation(id: string, data: Partial<ComplianceViolation>) {
    await this.violationRepo.update(id, data);
    return this.findViolationById(id);
  }

  async createRemediation(data: Partial<RemediationAction>) {
    const remediation = this.remediationRepo.create(data);
    return this.remediationRepo.save(remediation);
  }

  async findRemediationById(id: string) {
    return this.remediationRepo.findOne({ where: { id } });
  }

  async updateRemediation(id: string, data: Partial<RemediationAction>) {
    await this.remediationRepo.update(id, data);
    return this.findRemediationById(id);
  }

  async findRemediationsByViolation(violationId: string) {
    return this.remediationRepo.find({ where: { violationId } });
  }
}
