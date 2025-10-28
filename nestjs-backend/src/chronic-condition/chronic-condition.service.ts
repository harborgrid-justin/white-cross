import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, In } from 'typeorm';
import { ChronicCondition } from './entities/chronic-condition.entity';
import {
  CreateChronicConditionDto,
  UpdateChronicConditionDto,
  ChronicConditionFiltersDto,
  PaginationDto,
} from './dto';
import { ConditionStatus, AccommodationType } from './enums';
import {
  ChronicConditionStatistics,
  ChronicConditionSearchResult,
} from './interfaces';

/**
 * ChronicConditionService
 *
 * Comprehensive service for chronic condition management including:
 * - CRUD operations with validation and audit logging
 * - Advanced search with multi-criteria filtering
 * - Care plan tracking and review scheduling
 * - Educational accommodation management (IEP/504)
 * - Population health statistics and analytics
 * - Bulk operations for data imports
 */
@Injectable()
export class ChronicConditionService {
  private readonly logger = new Logger(ChronicConditionService.name);

  constructor(
    @InjectRepository(ChronicCondition)
    private readonly chronicConditionRepository: Repository<ChronicCondition>,
  ) {}

  // ==================== CRUD Operations ====================

  /**
   * Creates a new chronic condition record with validation and audit logging.
   */
  async createChronicCondition(
    dto: CreateChronicConditionDto,
  ): Promise<ChronicCondition> {
    try {
      // Convert date strings to Date objects
      const conditionData = {
        ...dto,
        diagnosedDate: new Date(dto.diagnosedDate),
        lastReviewDate: dto.lastReviewDate
          ? new Date(dto.lastReviewDate)
          : null,
        nextReviewDate: dto.nextReviewDate
          ? new Date(dto.nextReviewDate)
          : null,
        medications: dto.medications || [],
        restrictions: dto.restrictions || [],
        triggers: dto.triggers || [],
        accommodations: dto.accommodations || [],
      };

      const condition = this.chronicConditionRepository.create(conditionData);
      const savedCondition =
        await this.chronicConditionRepository.save(condition);

      // PHI Audit Log
      this.logger.log({
        message: 'PHI Access - Chronic Condition Created',
        action: 'CREATE',
        entity: 'ChronicCondition',
        entityId: savedCondition.id,
        studentId: dto.studentId,
        condition: dto.condition,
        status: dto.status,
        diagnosedBy: dto.diagnosedBy,
        timestamp: new Date().toISOString(),
      });

      this.logger.log(
        `Chronic condition created: ${dto.condition} for student ${dto.studentId}`,
      );
      return savedCondition;
    } catch (error) {
      this.logger.error('Error creating chronic condition:', error);
      throw error;
    }
  }

  /**
   * Retrieves a single chronic condition by ID.
   */
  async getChronicConditionById(id: string): Promise<ChronicCondition> {
    const condition = await this.chronicConditionRepository.findOne({
      where: { id },
    });

    if (!condition) {
      throw new NotFoundException(`Chronic condition with ID ${id} not found`);
    }

    // PHI Audit Log
    this.logger.log({
      message: 'PHI Access - Chronic Condition Retrieved',
      action: 'READ',
      entity: 'ChronicCondition',
      entityId: id,
      studentId: condition.studentId,
      timestamp: new Date().toISOString(),
    });

    return condition;
  }

  /**
   * Retrieves all chronic conditions for a specific student.
   */
  async getStudentChronicConditions(
    studentId: string,
    includeInactive: boolean = false,
  ): Promise<ChronicCondition[]> {
    const whereClause: any = { studentId };
    if (!includeInactive) {
      whereClause.isActive = true;
    }

    const conditions = await this.chronicConditionRepository.find({
      where: whereClause,
      order: {
        status: 'ASC',
        diagnosedDate: 'DESC',
      },
    });

    // PHI Audit Log
    if (conditions.length > 0) {
      this.logger.log({
        message: 'PHI Access - Student Chronic Conditions Retrieved',
        action: 'READ',
        entity: 'ChronicCondition',
        studentId,
        count: conditions.length,
        includeInactive,
        timestamp: new Date().toISOString(),
      });
    }

    return conditions;
  }

  /**
   * Updates a chronic condition record with change tracking.
   */
  async updateChronicCondition(
    id: string,
    dto: UpdateChronicConditionDto,
  ): Promise<ChronicCondition> {
    const condition = await this.getChronicConditionById(id);

    // Store old values for audit
    const oldValues = {
      condition: condition.condition,
      status: condition.status,
      carePlan: condition.carePlan,
    };

    // Convert date strings to Date objects if provided
    const updateData: any = { ...dto };
    if (dto.diagnosedDate) {
      updateData.diagnosedDate = new Date(dto.diagnosedDate);
    }
    if (dto.lastReviewDate) {
      updateData.lastReviewDate = new Date(dto.lastReviewDate);
    }
    if (dto.nextReviewDate) {
      updateData.nextReviewDate = new Date(dto.nextReviewDate);
    }

    Object.assign(condition, updateData);
    const updatedCondition =
      await this.chronicConditionRepository.save(condition);

    // PHI Audit Log
    this.logger.log({
      message: 'PHI Access - Chronic Condition Updated',
      action: 'UPDATE',
      entity: 'ChronicCondition',
      entityId: id,
      studentId: condition.studentId,
      changes: {
        old: oldValues,
        new: {
          condition: updatedCondition.condition,
          status: updatedCondition.status,
          carePlan: updatedCondition.carePlan,
        },
      },
      timestamp: new Date().toISOString(),
    });

    this.logger.log(
      `Chronic condition updated: ${updatedCondition.condition} for student ${updatedCondition.studentId}`,
    );
    return updatedCondition;
  }

  /**
   * Soft deletes (deactivates) a chronic condition by marking it as RESOLVED.
   */
  async deactivateChronicCondition(id: string): Promise<{ success: boolean }> {
    const condition = await this.getChronicConditionById(id);

    condition.status = ConditionStatus.RESOLVED;
    condition.isActive = false;
    await this.chronicConditionRepository.save(condition);

    // PHI Audit Log
    this.logger.log({
      message: 'PHI Access - Chronic Condition Deactivated',
      action: 'UPDATE',
      entity: 'ChronicCondition',
      entityId: id,
      studentId: condition.studentId,
      condition: condition.condition,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(
      `Chronic condition deactivated: ${condition.condition} for student ${condition.studentId}`,
    );
    return { success: true };
  }

  /**
   * Hard deletes a chronic condition (use with caution - HIPAA implications).
   */
  async deleteChronicCondition(id: string): Promise<{ success: boolean }> {
    const condition = await this.getChronicConditionById(id);

    // Store data for audit
    const auditData = {
      condition: condition.condition,
      studentId: condition.studentId,
    };

    await this.chronicConditionRepository.remove(condition);

    // PHI Audit Log
    this.logger.warn({
      message: 'PHI Access - Chronic Condition Permanently Deleted',
      action: 'DELETE',
      entity: 'ChronicCondition',
      entityId: id,
      ...auditData,
      timestamp: new Date().toISOString(),
    });

    this.logger.warn(
      `Chronic condition permanently deleted: ${auditData.condition} for student ${auditData.studentId}`,
    );
    return { success: true };
  }

  // ==================== Query Operations ====================

  /**
   * Searches chronic conditions with comprehensive filtering and pagination.
   */
  async searchChronicConditions(
    filters: ChronicConditionFiltersDto,
    pagination: PaginationDto,
  ): Promise<ChronicConditionSearchResult> {
    const { page = 1, limit = 20 } = pagination;
    const skip = (page - 1) * limit;

    const queryBuilder = this.chronicConditionRepository.createQueryBuilder('cc');

    // Apply filters
    if (filters.studentId) {
      queryBuilder.andWhere('cc.studentId = :studentId', {
        studentId: filters.studentId,
      });
    }

    if (filters.status) {
      queryBuilder.andWhere('cc.status = :status', { status: filters.status });
    }

    if (filters.requiresIEP !== undefined) {
      queryBuilder.andWhere('cc.requiresIEP = :requiresIEP', {
        requiresIEP: filters.requiresIEP,
      });
    }

    if (filters.requires504 !== undefined) {
      queryBuilder.andWhere('cc.requires504 = :requires504', {
        requires504: filters.requires504,
      });
    }

    if (filters.isActive !== undefined) {
      queryBuilder.andWhere('cc.isActive = :isActive', {
        isActive: filters.isActive,
      });
    }

    if (filters.reviewDueSoon) {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      queryBuilder.andWhere(
        'cc.nextReviewDate BETWEEN :now AND :futureDate',
        {
          now: new Date(),
          futureDate: thirtyDaysFromNow,
        },
      );
    }

    if (filters.searchTerm) {
      queryBuilder.andWhere(
        '(cc.condition ILIKE :searchTerm OR cc.icdCode ILIKE :searchTerm OR cc.notes ILIKE :searchTerm OR cc.carePlan ILIKE :searchTerm)',
        { searchTerm: `%${filters.searchTerm}%` },
      );
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination and ordering
    const conditions = await queryBuilder
      .orderBy('cc.status', 'ASC')
      .addOrderBy('cc.nextReviewDate', 'ASC')
      .addOrderBy('cc.diagnosedDate', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    // PHI Audit Log
    this.logger.log({
      message: 'PHI Access - Chronic Conditions Searched',
      action: 'READ',
      entity: 'ChronicCondition',
      filters,
      resultCount: conditions.length,
      timestamp: new Date().toISOString(),
    });

    return {
      conditions,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Gets conditions requiring review within specified days.
   */
  async getConditionsRequiringReview(
    daysAhead: number = 30,
  ): Promise<ChronicCondition[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const conditions = await this.chronicConditionRepository.find({
      where: {
        isActive: true,
        nextReviewDate: Between(new Date(), futureDate),
      },
      order: {
        nextReviewDate: 'ASC',
      },
    });

    this.logger.log(
      `Found ${conditions.length} conditions requiring review within ${daysAhead} days`,
    );
    return conditions;
  }

  /**
   * Gets conditions requiring educational accommodations (IEP or 504 plans).
   */
  async getConditionsRequiringAccommodations(
    type: AccommodationType = AccommodationType.BOTH,
  ): Promise<ChronicCondition[]> {
    const queryBuilder =
      this.chronicConditionRepository.createQueryBuilder('cc');

    queryBuilder.where('cc.isActive = :isActive', { isActive: true });

    if (type === AccommodationType.IEP) {
      queryBuilder.andWhere('cc.requiresIEP = :requiresIEP', {
        requiresIEP: true,
      });
    } else if (type === AccommodationType.PLAN_504) {
      queryBuilder.andWhere('cc.requires504 = :requires504', {
        requires504: true,
      });
    } else {
      queryBuilder.andWhere(
        '(cc.requiresIEP = :requiresIEP OR cc.requires504 = :requires504)',
        { requiresIEP: true, requires504: true },
      );
    }

    const conditions = await queryBuilder
      .orderBy('cc.condition', 'ASC')
      .getMany();

    this.logger.log(
      `Found ${conditions.length} conditions requiring ${type} accommodations`,
    );
    return conditions;
  }

  /**
   * Gets comprehensive statistics for chronic condition management.
   */
  async getChronicConditionStatistics(
    filters?: ChronicConditionFiltersDto,
  ): Promise<ChronicConditionStatistics> {
    const baseWhere: any = { isActive: true };
    if (filters?.studentId) {
      baseWhere.studentId = filters.studentId;
    }

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    // Get total count
    const total = await this.chronicConditionRepository.count({
      where: baseWhere,
    });

    // Get counts by status
    const byStatusRaw = await this.chronicConditionRepository
      .createQueryBuilder('cc')
      .select('cc.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where(baseWhere)
      .groupBy('cc.status')
      .getRawMany();

    const byStatus = byStatusRaw.reduce(
      (acc, item) => {
        acc[item.status] = parseInt(item.count, 10);
        return acc;
      },
      {} as Record<string, number>,
    );

    // Get other counts
    const requiresIEP = await this.chronicConditionRepository.count({
      where: { ...baseWhere, requiresIEP: true },
    });

    const requires504 = await this.chronicConditionRepository.count({
      where: { ...baseWhere, requires504: true },
    });

    const reviewDueSoon = await this.chronicConditionRepository.count({
      where: {
        ...baseWhere,
        nextReviewDate: Between(new Date(), thirtyDaysFromNow),
      },
    });

    const activeConditions = await this.chronicConditionRepository.count({
      where: { ...baseWhere, status: ConditionStatus.ACTIVE },
    });

    const statistics: ChronicConditionStatistics = {
      total,
      byStatus,
      requiresIEP,
      requires504,
      reviewDueSoon,
      activeConditions,
    };

    this.logger.log('Chronic condition statistics retrieved');
    return statistics;
  }

  // ==================== Business Logic ====================

  /**
   * Updates the care plan for a chronic condition and refreshes review date.
   */
  async updateCarePlan(id: string, carePlan: string): Promise<ChronicCondition> {
    return this.updateChronicCondition(id, {
      carePlan,
      lastReviewDate: new Date().toISOString(),
    });
  }

  /**
   * Bulk creates multiple chronic condition records.
   */
  async bulkCreateChronicConditions(
    conditionsData: CreateChronicConditionDto[],
  ): Promise<ChronicCondition[]> {
    try {
      const conditions = conditionsData.map((dto) => {
        return this.chronicConditionRepository.create({
          ...dto,
          diagnosedDate: new Date(dto.diagnosedDate),
          lastReviewDate: dto.lastReviewDate
            ? new Date(dto.lastReviewDate)
            : null,
          nextReviewDate: dto.nextReviewDate
            ? new Date(dto.nextReviewDate)
            : null,
          medications: dto.medications || [],
          restrictions: dto.restrictions || [],
          triggers: dto.triggers || [],
          accommodations: dto.accommodations || [],
        });
      });

      const savedConditions =
        await this.chronicConditionRepository.save(conditions);

      // PHI Audit Log
      this.logger.log({
        message: 'PHI Access - Chronic Conditions Bulk Created',
        action: 'CREATE',
        entity: 'ChronicCondition',
        count: savedConditions.length,
        studentIds: [...new Set(conditionsData.map((c) => c.studentId))],
        timestamp: new Date().toISOString(),
      });

      this.logger.log(
        `Bulk created ${savedConditions.length} chronic condition records`,
      );
      return savedConditions;
    } catch (error) {
      this.logger.error('Error bulk creating chronic conditions:', error);
      throw error;
    }
  }
}
