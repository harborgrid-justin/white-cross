import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AccommodationType, ChronicCondition, ConditionStatus } from '../database/models/chronic-condition.model';
import { ChronicConditionCreateDto } from './dto/create-chronic-condition.dto';
import { ChronicConditionFiltersDto } from './dto/chronic-condition-filters.dto';
import { ChronicConditionUpdateDto } from './dto/update-chronic-condition.dto';
import { PaginationDto } from './dto/pagination.dto';
import { ChronicConditionSearchResult } from './interfaces/chronic-condition-search-result.interface';
import { ChronicConditionStatistics } from './interfaces/chronic-condition-statistics.interface';

import { BaseService } from '../common/base';
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
export class ChronicConditionService extends BaseService {
  constructor(
    @InjectModel(ChronicCondition)
    private readonly chronicConditionModel: typeof ChronicCondition,
  ) {}

  // ==================== CRUD Operations ====================

  /**
   * Creates a new chronic condition record with validation and audit logging.
   */
  async createChronicCondition(
    dto: ChronicConditionCreateDto,
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
        isActive: true, // Default to active
      };

      const savedCondition = await this.chronicConditionModel.create(
        conditionData as any,
      );

      // PHI Audit Log
      this.logInfo({
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

      this.logInfo(
        `Chronic condition created: ${dto.condition} for student ${dto.studentId}`,
      );
      return savedCondition;
    } catch (error) {
      this.logError('Error creating chronic condition:', error);
      throw error;
    }
  }

  /**
   * Retrieves a single chronic condition by ID.
   */
  async getChronicConditionById(id: string): Promise<ChronicCondition> {
    const condition = await this.chronicConditionModel.findOne({
      where: { id },
    });

    if (!condition) {
      throw new NotFoundException(`Chronic condition with ID ${id} not found`);
    }

    // PHI Audit Log
    this.logInfo({
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

    const conditions = await this.chronicConditionModel.findAll({
      where: whereClause,
      order: [
        ['status', 'ASC'],
        ['diagnosedDate', 'DESC'],
      ],
    });

    // PHI Audit Log
    if (conditions.length > 0) {
      this.logInfo({
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
    dto: ChronicConditionUpdateDto,
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

    await condition.update(updateData);
    const updatedCondition = await condition.reload();

    // PHI Audit Log
    this.logInfo({
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

    this.logInfo(
      `Chronic condition updated: ${updatedCondition.condition} for student ${updatedCondition.studentId}`,
    );
    return updatedCondition;
  }

  /**
   * Soft deletes (deactivates) a chronic condition by marking it as RESOLVED.
   */
  async deactivateChronicCondition(id: string): Promise<{ success: boolean }> {
    const condition = await this.getChronicConditionById(id);

    await condition.update({
      status: ConditionStatus.RESOLVED,
      isActive: false,
    });

    // PHI Audit Log
    this.logInfo({
      message: 'PHI Access - Chronic Condition Deactivated',
      action: 'UPDATE',
      entity: 'ChronicCondition',
      entityId: id,
      studentId: condition.studentId,
      condition: condition.condition,
      timestamp: new Date().toISOString(),
    });

    this.logInfo(
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

    await condition.destroy();

    // PHI Audit Log
    this.logWarning({
      message: 'PHI Access - Chronic Condition Permanently Deleted',
      action: 'DELETE',
      entity: 'ChronicCondition',
      entityId: id,
      ...auditData,
      timestamp: new Date().toISOString(),
    });

    this.logWarning(
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
    const offset = (page - 1) * limit;

    const where: any = {};

    // Apply filters
    if (filters.studentId) {
      where.studentId = filters.studentId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.requiresIEP !== undefined) {
      where.requiresIEP = filters.requiresIEP;
    }

    if (filters.requires504 !== undefined) {
      where.requires504 = filters.requires504;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.reviewDueSoon) {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      where.nextReviewDate = {
        [Op.between]: [new Date(), thirtyDaysFromNow],
      };
    }

    if (filters.searchTerm) {
      where[Op.or] = [
        { condition: { [Op.iLike]: `%${filters.searchTerm}%` } },
        { icdCode: { [Op.iLike]: `%${filters.searchTerm}%` } },
        { notes: { [Op.iLike]: `%${filters.searchTerm}%` } },
        { carePlan: { [Op.iLike]: `%${filters.searchTerm}%` } },
      ];
    }

    // Get total count and results
    const { count: total, rows: conditions } =
      await this.chronicConditionModel.findAndCountAll({
        where,
        order: [
          ['status', 'ASC'],
          ['nextReviewDate', 'ASC'],
          ['diagnosedDate', 'DESC'],
        ],
        offset,
        limit,
      });

    // PHI Audit Log
    this.logInfo({
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

    const conditions = await this.chronicConditionModel.findAll({
      where: {
        isActive: true,
        nextReviewDate: {
          [Op.between]: [new Date(), futureDate],
        },
      },
      order: [['nextReviewDate', 'ASC']],
    });

    this.logInfo(
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
    const where: any = { isActive: true };

    if (type === AccommodationType.IEP) {
      where.requiresIEP = true;
    } else if (type === AccommodationType.PLAN_504) {
      where.requires504 = true;
    } else {
      where[Op.or] = [{ requiresIEP: true }, { requires504: true }];
    }

    const conditions = await this.chronicConditionModel.findAll({
      where,
      order: [['condition', 'ASC']],
    });

    this.logInfo(
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
    const total = await this.chronicConditionModel.count({
      where: baseWhere,
    });

    // Get counts by status using raw query
    const byStatusRaw = await this.chronicConditionModel.sequelize!.query(
      `SELECT status, COUNT(*) as count FROM chronic_conditions WHERE is_active = true ${filters?.studentId ? 'AND student_id = $studentId' : ''} GROUP BY status`,
      {
        type: 'SELECT',
        bind: filters?.studentId ? { studentId: filters.studentId } : {},
      },
    );

    const byStatus = (byStatusRaw[0] as any[]).reduce(
      (acc, item) => {
        acc[item.status] = parseInt(item.count, 10);
        return acc;
      },
      {} as Record<string, number>,
    );

    // Get other counts
    const requiresIEP = await this.chronicConditionModel.count({
      where: { ...baseWhere, requiresIEP: true },
    });

    const requires504 = await this.chronicConditionModel.count({
      where: { ...baseWhere, requires504: true },
    });

    const reviewDueSoon = await this.chronicConditionModel.count({
      where: {
        ...baseWhere,
        nextReviewDate: {
          [Op.between]: [new Date(), thirtyDaysFromNow],
        },
      },
    });

    const activeConditions = await this.chronicConditionModel.count({
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

    this.logInfo('Chronic condition statistics retrieved');
    return statistics;
  }

  // ==================== Business Logic ====================

  /**
   * Updates the care plan for a chronic condition and refreshes review date.
   */
  async updateCarePlan(
    id: string,
    carePlan: string,
  ): Promise<ChronicCondition> {
    return this.updateChronicCondition(id, {
      carePlan,
      lastReviewDate: new Date().toISOString(),
    });
  }

  /**
   * Bulk creates multiple chronic condition records.
   */
  async bulkCreateChronicConditions(
    conditionsData: ChronicConditionCreateDto[],
  ): Promise<ChronicCondition[]> {
    try {
      const conditions = conditionsData.map((dto) => ({
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
        isActive: true, // Default to active
      }));

      const savedConditions = await this.chronicConditionModel.bulkCreate(
        conditions as any,
      );

      // PHI Audit Log
      this.logInfo({
        message: 'PHI Access - Chronic Conditions Bulk Created',
        action: 'CREATE',
        entity: 'ChronicCondition',
        count: savedConditions.length,
        studentIds: [...new Set(conditionsData.map((c) => c.studentId))],
        timestamp: new Date().toISOString(),
      });

      this.logInfo(
        `Bulk created ${savedConditions.length} chronic condition records`,
      );
      return savedConditions;
    } catch (error) {
      this.logError('Error bulk creating chronic conditions:', error);
      throw error;
    }
  }

  // ==================== Batch Query Methods (DataLoader Support) ====================

  /**
   * Batch find chronic conditions by IDs (for DataLoader)
   * Returns chronic conditions in the same order as requested IDs
   *
   * OPTIMIZATION: Eliminates N+1 queries when fetching multiple chronic conditions
   * Before: 1 + N queries (1 per condition)
   * After: 1 query with IN clause
   * Performance improvement: ~99% query reduction for batch operations
   */
  async findByIds(ids: string[]): Promise<(ChronicCondition | null)[]> {
    try {
      const conditions = await this.chronicConditionModel.findAll({
        where: {
          id: { [Op.in]: ids },
        },
      });

      // Create map for O(1) lookup
      const conditionMap = new Map(conditions.map((c) => [c.id, c]));

      // Return in same order as input, null for missing
      return ids.map((id) => conditionMap.get(id) || null);
    } catch (error) {
      this.logError(
        `Failed to batch fetch chronic conditions: ${error.message}`,
      );
      throw new Error('Failed to batch fetch chronic conditions');
    }
  }

  /**
   * Batch find chronic conditions by student IDs (for DataLoader)
   * Returns array of chronic condition arrays for each student ID
   *
   * OPTIMIZATION: Eliminates N+1 queries when fetching conditions for multiple students
   * Before: 1 + N queries (1 per student)
   * After: 1 query with IN clause
   * Performance improvement: ~99% query reduction for batch operations
   *
   * Example use case: Fetching chronic conditions for all students in a class or school
   * Conditions are ordered by status (ACTIVE first) for quick identification
   */
  async findByStudentIds(
    studentIds: string[],
  ): Promise<ChronicCondition[][]> {
    try {
      const conditions = await this.chronicConditionModel.findAll({
        where: {
          studentId: { [Op.in]: studentIds },
          isActive: true,
        },
        order: [
          ['status', 'ASC'],
          ['diagnosedDate', 'DESC'],
        ],
      });

      // Group by studentId
      const grouped = new Map<string, ChronicCondition[]>();
      for (const condition of conditions) {
        if (!grouped.has(condition.studentId)) {
          grouped.set(condition.studentId, []);
        }
        grouped.get(condition.studentId)!.push(condition);
      }

      // Return in same order as input, empty array for missing
      return studentIds.map((id) => grouped.get(id) || []);
    } catch (error) {
      this.logError(
        `Failed to batch fetch chronic conditions by student IDs: ${error.message}`,
      );
      throw new Error(
        'Failed to batch fetch chronic conditions by student IDs',
      );
    }
  }
}
