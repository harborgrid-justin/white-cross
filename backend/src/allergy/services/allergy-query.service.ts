/**
 * Allergy Query Service
 *
 * Provides comprehensive query, search, and filtering operations for allergy records.
 * All queries prioritize patient safety by ordering results by severity.
 *
 * PATIENT SAFETY CRITICAL - Query results inform medication-allergy cross-checking
 * and emergency response protocols.
 *
 * @service AllergyQueryService
 * @compliance HIPAA, Patient Safety Information Retrieval Standards
 */
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Allergy } from '../models/allergy.model';
import { Student } from '../../student/models/student.model';
import { AllergySeverity } from '../../common/enums';
import { AllergyFiltersDto } from '../dto/allergy-filters.dto';
import { PaginationDto } from '../dto/pagination.dto';

import { BaseService } from '../../../common/base';
export interface PaginatedAllergyResults {
  allergies: Allergy[];
  total: number;
  page: number;
  pages: number;
}

export interface AllergyStatistics {
  total: number;
  bySeverity: Record<string, number>;
  byType: Record<string, number>;
  verified: number;
  unverified: number;
  critical: number;
}

@Injectable()
export class AllergyQueryService extends BaseService {
  constructor(
    @InjectModel(Allergy)
    private readonly allergyModel: typeof Allergy,
  ) {}

  /**
   * Retrieves all allergy records for a specific student with severity-based ordering
   *
   * @param studentId - Student's unique identifier
   * @param includeInactive - Include inactive/resolved allergies
   * @returns Array of allergy records ordered by severity
   */
  async getStudentAllergies(
    studentId: string,
    includeInactive: boolean = false,
  ): Promise<Allergy[]> {
    const whereClause: any = { studentId };
    if (!includeInactive) {
      whereClause.isActive = true;
    }

    const allergies = await this.allergyModel.findAll({
      where: whereClause,
      include: [{ model: Student, as: 'student' }],
      order: [
        ['severity', 'DESC'], // Critical allergies first
        ['verified', 'DESC'], // Verified allergies first
        ['createdAt', 'DESC'],
      ],
    });

    // PHI Audit Log
    if (allergies.length > 0) {
      this.logInfo(
        `Student allergies accessed: Student ${studentId}, Count: ${allergies.length}, ` +
          `IncludeInactive: ${includeInactive}`,
      );
    }

    return allergies;
  }

  /**
   * Searches allergies across all students with advanced filtering and pagination
   *
   * @param filters - Search and filter criteria
   * @param pagination - Pagination controls
   * @returns Paginated allergy results with metadata
   */
  async searchAllergies(
    filters: AllergyFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedAllergyResults> {
    const { page = 1, limit = 20 } = pagination;
    const offset = (page - 1) * limit;

    // Build where clause dynamically
    const whereClause: any = {};

    if (filters.studentId) {
      whereClause.studentId = filters.studentId;
    }

    if (filters.severity) {
      whereClause.severity = filters.severity;
    }

    if (filters.allergenType) {
      whereClause.allergenType = filters.allergenType;
    }

    if (filters.verified !== undefined) {
      whereClause.verified = filters.verified;
    }

    if (filters.isActive !== undefined) {
      whereClause.isActive = filters.isActive;
    }

    // Full-text search across multiple fields
    if (filters.searchTerm) {
      const searchPattern = `%${filters.searchTerm}%`;
      whereClause[Op.or] = [
        { allergen: { [Op.iLike]: searchPattern } },
        { reaction: { [Op.iLike]: searchPattern } },
        { treatment: { [Op.iLike]: searchPattern } },
        { notes: { [Op.iLike]: searchPattern } },
      ];
    }

    const { rows: allergies, count: total } =
      await this.allergyModel.findAndCountAll({
        where: whereClause,
        include: [{ model: Student, as: 'student' }],
        offset,
        limit,
        order: [
          ['severity', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      });

    // PHI Audit Log
    this.logInfo(
      `Allergy search: Filters: ${JSON.stringify(filters)}, Results: ${allergies.length}`,
    );

    return {
      allergies,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Retrieves CRITICAL allergies (SEVERE or LIFE_THREATENING) for emergency response
   *
   * PATIENT SAFETY CRITICAL - Returns only the most serious allergies
   *
   * @param studentId - Student's unique identifier
   * @returns Array of critical allergy records
   */
  async getCriticalAllergies(studentId: string): Promise<Allergy[]> {
    const allergies = await this.allergyModel.findAll({
      where: {
        studentId,
        severity: {
          [Op.in]: [AllergySeverity.SEVERE, AllergySeverity.LIFE_THREATENING],
        },
        isActive: true,
      },
      include: [{ model: Student, as: 'student' }],
      order: [
        ['severity', 'DESC'], // LIFE_THREATENING first
      ],
    });

    // PHI Audit Log
    if (allergies.length > 0) {
      this.logWarning(
        `Critical allergies accessed: Student ${studentId}, Count: ${allergies.length}, ` +
          `Severities: ${allergies.map((a) => a.severity).join(', ')}`,
      );
    }

    return allergies;
  }

  /**
   * Generates comprehensive allergy statistics for analytics and reporting
   *
   * @param filters - Optional filters to scope statistics
   * @returns Statistical summary of allergy data
   */
  async getAllergyStatistics(
    filters?: AllergyFiltersDto,
  ): Promise<AllergyStatistics> {
    const whereClause: any = { isActive: true };
    if (filters?.studentId) {
      whereClause.studentId = filters.studentId;
    }

    // Get total count
    const total = await this.allergyModel.count({ where: whereClause });

    // Count by severity using Sequelize
    const bySeverityRaw = await this.allergyModel.findAll({
      where: whereClause,
      attributes: [
        'severity',
        [
          this.allergyModel.sequelize!.fn(
            'COUNT',
            this.allergyModel.sequelize!.col('id'),
          ),
          'count',
        ],
      ],
      group: ['severity'],
      raw: true,
    });

    const bySeverity = (bySeverityRaw as any[]).reduce(
      (acc, item) => {
        acc[item.severity] = parseInt(item.count, 10);
        return acc;
      },
      {} as Record<string, number>,
    );

    // Count by type
    const byTypeRaw = await this.allergyModel.findAll({
      where: {
        ...whereClause,
        allergenType: { [Op.ne]: null },
      },
      attributes: [
        'allergenType',
        [
          this.allergyModel.sequelize!.fn(
            'COUNT',
            this.allergyModel.sequelize!.col('id'),
          ),
          'count',
        ],
      ],
      group: ['allergenType'],
      raw: true,
    });

    const byType = (byTypeRaw as any[]).reduce(
      (acc, item) => {
        if (item.allergenType) {
          acc[item.allergenType] = parseInt(item.count, 10);
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    // Count verified
    const verified = await this.allergyModel.count({
      where: { ...whereClause, verified: true },
    });

    // Count critical
    const critical = await this.allergyModel.count({
      where: {
        ...whereClause,
        severity: {
          [Op.in]: [AllergySeverity.SEVERE, AllergySeverity.LIFE_THREATENING],
        },
      },
    });

    const statistics: AllergyStatistics = {
      total,
      bySeverity,
      byType,
      verified,
      unverified: total - verified,
      critical,
    };

    this.logInfo(
      `Allergy statistics retrieved: ${JSON.stringify(statistics)}`,
    );

    return statistics;
  }
}
