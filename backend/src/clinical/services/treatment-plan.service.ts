import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
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
    @InjectModel(TreatmentPlan)
    private treatmentPlanModel: typeof TreatmentPlan,
  ) {}

  /**
   * Create a new treatment plan
   */
  async create(createDto: CreateTreatmentPlanDto): Promise<TreatmentPlan> {
    this.logger.log(
      `Creating treatment plan for student ${createDto.studentId}`,
    );

    return this.treatmentPlanModel.create(createDto as any);
  }

  /**
   * Find treatment plan by ID
   */
  async findOne(id: string): Promise<TreatmentPlan> {
    const plan = await this.treatmentPlanModel.findByPk(id);

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
    const whereClause: any = {};

    if (filters.studentId) {
      whereClause.studentId = filters.studentId;
    }

    // visitId filter removed - not in model

    if (filters.status) {
      whereClause.status = filters.status;
    }

    if (filters.createdBy) {
      whereClause.createdBy = filters.createdBy;
    }

    const { rows: plans, count: total } =
      await this.treatmentPlanModel.findAndCountAll({
        where: whereClause,
        offset: filters.offset || 0,
        limit: filters.limit || 20,
        order: [['createdAt', 'DESC']],
      });

    return { plans, total };
  }

  /**
   * Get treatment plans by student ID
   */
  async findByStudent(
    studentId: string,
    limit: number = 10,
  ): Promise<TreatmentPlan[]> {
    return this.treatmentPlanModel.findAll({
      where: { studentId },
      order: [['createdAt', 'DESC']],
      limit,
    });
  }

  /**
   * Get active treatment plans for a student
   */
  async findActiveByStudent(studentId: string): Promise<TreatmentPlan[]> {
    return this.treatmentPlanModel.findAll({
      where: {
        studentId,
        status: TreatmentStatus.ACTIVE,
      },
      order: [['startDate', 'DESC']],
    });
  }

  /**
   * Update treatment plan
   */
  async update(
    id: string,
    updateDto: UpdateTreatmentPlanDto,
  ): Promise<TreatmentPlan> {
    const plan = await this.findOne(id);

    Object.assign(plan, updateDto);
    await plan.save();
    return plan;
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
    await plan.save();
    return plan;
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
    await plan.save();
    return plan;
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
    await plan.save();
    return plan;
  }

  /**
   * Delete treatment plan
   */
  async remove(id: string): Promise<void> {
    const result = await this.treatmentPlanModel.destroy({ where: { id } });

    if (result === 0) {
      throw new NotFoundException(`Treatment plan ${id} not found`);
    }

    this.logger.log(`Deleted treatment plan ${id}`);
  }
}
