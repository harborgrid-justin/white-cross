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
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, ILike } from 'typeorm';
import { Allergy } from '../entities/allergy.entity';
import { AllergySeverity } from '../../common/enums';
import { AllergyFiltersDto } from '../dto/allergy-filters.dto';
import { PaginationDto } from '../dto/pagination.dto';

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
export class AllergyQueryService {
  private readonly logger = new Logger(AllergyQueryService.name);

  constructor(
    @InjectRepository(Allergy)
    private readonly allergyRepository: Repository<Allergy>,
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

    const allergies = await this.allergyRepository.find({
      where: whereClause,
      relations: ['student'],
      order: {
        severity: 'DESC', // Critical allergies first
        verified: 'DESC', // Verified allergies first
        createdAt: 'DESC',
      },
    });

    // PHI Audit Log
    if (allergies.length > 0) {
      this.logger.log(
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
      // Note: TypeORM doesn't support OR directly in where clause
      // We'll need to use queryBuilder for complex OR conditions
      const queryBuilder = this.allergyRepository
        .createQueryBuilder('allergy')
        .leftJoinAndSelect('allergy.student', 'student')
        .where(whereClause)
        .andWhere(
          '(allergy.allergen ILIKE :searchTerm OR allergy.reaction ILIKE :searchTerm OR allergy.treatment ILIKE :searchTerm OR allergy.notes ILIKE :searchTerm)',
          { searchTerm: searchPattern },
        )
        .orderBy('allergy.severity', 'DESC')
        .addOrderBy('allergy.createdAt', 'DESC')
        .skip(offset)
        .take(limit);

      const [allergies, total] = await queryBuilder.getManyAndCount();

      // PHI Audit Log
      this.logger.log(
        `Allergy search: Filters: ${JSON.stringify(filters)}, Results: ${allergies.length}`,
      );

      return {
        allergies,
        total,
        page,
        pages: Math.ceil(total / limit),
      };
    }

    // Simple search without full-text
    const [allergies, total] = await this.allergyRepository.findAndCount({
      where: whereClause,
      relations: ['student'],
      skip: offset,
      take: limit,
      order: {
        severity: 'DESC',
        createdAt: 'DESC',
      },
    });

    // PHI Audit Log
    this.logger.log(
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
    const allergies = await this.allergyRepository.find({
      where: {
        studentId,
        severity: In([AllergySeverity.SEVERE, AllergySeverity.LIFE_THREATENING]),
        isActive: true,
      },
      relations: ['student'],
      order: {
        severity: 'DESC', // LIFE_THREATENING first
      },
    });

    // PHI Audit Log
    if (allergies.length > 0) {
      this.logger.warn(
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
    const total = await this.allergyRepository.count({ where: whereClause });

    // Count by severity
    const bySeverityRaw = await this.allergyRepository
      .createQueryBuilder('allergy')
      .select('allergy.severity', 'severity')
      .addSelect('COUNT(*)', 'count')
      .where(whereClause)
      .groupBy('allergy.severity')
      .getRawMany();

    const bySeverity = bySeverityRaw.reduce(
      (acc, item) => {
        acc[item.severity] = parseInt(item.count, 10);
        return acc;
      },
      {} as Record<string, number>,
    );

    // Count by type
    const byTypeRaw = await this.allergyRepository
      .createQueryBuilder('allergy')
      .select('allergy.allergenType', 'allergenType')
      .addSelect('COUNT(*)', 'count')
      .where(whereClause)
      .groupBy('allergy.allergenType')
      .getRawMany();

    const byType = byTypeRaw.reduce(
      (acc, item) => {
        if (item.allergenType) {
          acc[item.allergenType] = parseInt(item.count, 10);
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    // Count verified
    const verified = await this.allergyRepository.count({
      where: { ...whereClause, verified: true },
    });

    // Count critical
    const critical = await this.allergyRepository.count({
      where: {
        ...whereClause,
        severity: In([AllergySeverity.SEVERE, AllergySeverity.LIFE_THREATENING]),
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

    this.logger.log(`Allergy statistics retrieved: ${JSON.stringify(statistics)}`);

    return statistics;
  }
}
