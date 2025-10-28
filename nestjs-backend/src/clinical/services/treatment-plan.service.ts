import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TreatmentPlan } from '../entities/treatment-plan.entity';
import { TreatmentStatus } from '../enums/treatment-status.enum';
import { CreateTreatmentPlanDto } from '../dto/treatment/create-treatment-plan.dto';
import { UpdateTreatmentPlanDto } from '../dto/treatment/update-treatment-plan.dto';
import { TreatmentPlanFiltersDto } from '../dto/treatment/treatment-plan-filters.dto';

/**
 * Treatment Plan Service
 * Manages treatment plans for students including CRUD operations and status management
 */
@Injectable()
export class TreatmentPlanService {
  private readonly logger = new Logger(TreatmentPlanService.name);

  constructor(
    @InjectRepository(TreatmentPlan)
    private treatmentPlanRepository: Repository<TreatmentPlan>,
  ) {}

  /**
   * Create a new treatment plan
   */
  async create(createDto: CreateTreatmentPlanDto): Promise<TreatmentPlan> {
    this.logger.log(`Creating treatment plan for student ${createDto.studentId}`);

    const plan = this.treatmentPlanRepository.create(createDto);
    return this.treatmentPlanRepository.save(plan);
  }

  /**
   * Find treatment plan by ID
   */
  async findOne(id: string): Promise<TreatmentPlan> {
    const plan = await this.treatmentPlanRepository.findOne({
      where: { id },
      relations: ['visit', 'prescriptions'],
    });

    if (!plan) {
      throw new NotFoundException(`Treatment plan ${id} not found`);
    }

    return plan;
  }

  /**
   * Find all treatment plans with filters
   */
  async findAll(filters: TreatmentPlanFiltersDto): Promise<{
    plans: TreatmentPlan[];
    total: number;
  }> {
    const queryBuilder = this.treatmentPlanRepository.createQueryBuilder('plan');

    if (filters.studentId) {
      queryBuilder.andWhere('plan.studentId = :studentId', {
        studentId: filters.studentId,
      });
    }

    if (filters.visitId) {
      queryBuilder.andWhere('plan.visitId = :visitId', { visitId: filters.visitId });
    }

    if (filters.status) {
      queryBuilder.andWhere('plan.status = :status', { status: filters.status });
    }

    if (filters.createdBy) {
      queryBuilder.andWhere('plan.createdBy = :createdBy', {
        createdBy: filters.createdBy,
      });
    }

    const [plans, total] = await queryBuilder
      .skip(filters.offset || 0)
      .take(filters.limit || 20)
      .orderBy('plan.createdAt', 'DESC')
      .getManyAndCount();

    return { plans, total };
  }

  /**
   * Get treatment plans by student ID
   */
  async findByStudent(studentId: string, limit: number = 10): Promise<TreatmentPlan[]> {
    return this.treatmentPlanRepository.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['prescriptions'],
    });
  }

  /**
   * Get active treatment plans for a student
   */
  async findActiveByStudent(studentId: string): Promise<TreatmentPlan[]> {
    return this.treatmentPlanRepository.find({
      where: {
        studentId,
        status: TreatmentStatus.ACTIVE,
      },
      order: { startDate: 'DESC' },
      relations: ['prescriptions'],
    });
  }

  /**
   * Get treatment plans by visit ID
   */
  async findByVisit(visitId: string): Promise<TreatmentPlan[]> {
    return this.treatmentPlanRepository.find({
      where: { visitId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Update treatment plan
   */
  async update(id: string, updateDto: UpdateTreatmentPlanDto): Promise<TreatmentPlan> {
    const plan = await this.findOne(id);

    Object.assign(plan, updateDto);
    return this.treatmentPlanRepository.save(plan);
  }

  /**
   * Activate a treatment plan
   */
  async activate(id: string): Promise<TreatmentPlan> {
    const plan = await this.findOne(id);

    if (plan.status === TreatmentStatus.ACTIVE) {
      throw new BadRequestException('Treatment plan is already active');
    }

    plan.status = TreatmentStatus.ACTIVE;
    return this.treatmentPlanRepository.save(plan);
  }

  /**
   * Complete a treatment plan
   */
  async complete(id: string): Promise<TreatmentPlan> {
    const plan = await this.findOne(id);

    if (plan.status === TreatmentStatus.COMPLETED) {
      throw new BadRequestException('Treatment plan is already completed');
    }

    plan.status = TreatmentStatus.COMPLETED;
    plan.endDate = new Date();
    return this.treatmentPlanRepository.save(plan);
  }

  /**
   * Cancel a treatment plan
   */
  async cancel(id: string): Promise<TreatmentPlan> {
    const plan = await this.findOne(id);

    if (plan.status === TreatmentStatus.CANCELLED) {
      throw new BadRequestException('Treatment plan is already cancelled');
    }

    plan.status = TreatmentStatus.CANCELLED;
    return this.treatmentPlanRepository.save(plan);
  }

  /**
   * Delete treatment plan
   */
  async remove(id: string): Promise<void> {
    const result = await this.treatmentPlanRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Treatment plan ${id} not found`);
    }

    this.logger.log(`Deleted treatment plan ${id}`);
  }

  /**
   * Get plans needing review
   */
  async findPlansNeedingReview(): Promise<TreatmentPlan[]> {
    const now = new Date();

    return this.treatmentPlanRepository
      .createQueryBuilder('plan')
      .where('plan.status = :status', { status: TreatmentStatus.ACTIVE })
      .andWhere('plan.reviewDate IS NOT NULL')
      .andWhere('plan.reviewDate <= :now', { now })
      .orderBy('plan.reviewDate', 'ASC')
      .getMany();
  }
}
