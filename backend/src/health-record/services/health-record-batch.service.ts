/**
 * @fileoverview Health Record Batch Service - Batch Query Operations
 * @module health-record/services
 * @description Service providing batch query operations for DataLoader support.
 * Eliminates N+1 query problems by batching multiple health record lookups
 * into single database queries.
 *
 * HIPAA CRITICAL - This service manages Protected Health Information (PHI)
 *
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 * @performance Optimizes GraphQL DataLoader patterns
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { HealthRecord   } from "../../database/models";
import { Student   } from "../../database/models";

/**
 * HealthRecordBatchService
 *
 * Provides batch query operations for DataLoader support, enabling efficient
 * bulk data retrieval and eliminating N+1 query problems.
 *
 * Responsibilities:
 * - Batch fetch health records by IDs
 * - Batch fetch health records by student IDs
 * - Maintain result ordering for DataLoader
 * - Optimize database query patterns
 *
 * Performance Impact:
 * - Before: 1 + N queries (1 per record)
 * - After: 1 query with IN clause
 * - Performance improvement: ~99% query reduction for batch operations
 */
@Injectable()
export class HealthRecordBatchService {
  private readonly logger = new Logger(HealthRecordBatchService.name);

  constructor(
    @InjectModel(HealthRecord)
    private readonly healthRecordModel: typeof HealthRecord,
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
  ) {}

  /**
   * Batch find health records by IDs (for DataLoader)
   * Returns health records in the same order as requested IDs
   *
   * OPTIMIZATION: Eliminates N+1 queries when fetching multiple health records
   * Before: 1 + N queries (1 per record)
   * After: 1 query with IN clause
   * Performance improvement: ~99% query reduction for batch operations
   *
   * @param ids - Array of health record UUIDs
   * @returns Array of health records or null for missing records, in same order as input
   */
  async findByIds(ids: string[]): Promise<(HealthRecord | null)[]> {
    try {
      const records = await this.healthRecordModel.findAll({
        where: {
          id: { [Op.in]: ids },
        },
        include: [{ model: this.studentModel, as: 'student' }],
      });

      // Create map for O(1) lookup
      const recordMap = new Map(records.map((r) => [r.id, r]));

      // Return in same order as input, null for missing
      return ids.map((id) => recordMap.get(id) || null);
    } catch (error) {
      this.logger.error(
        `Failed to batch fetch health records: ${error.message}`,
      );
      throw new Error('Failed to batch fetch health records');
    }
  }

  /**
   * Batch find health records by student IDs (for DataLoader)
   * Returns array of health record arrays for each student ID
   *
   * OPTIMIZATION: Eliminates N+1 queries when fetching health records for multiple students
   * Before: 1 + N queries (1 per student)
   * After: 1 query with IN clause
   * Performance improvement: ~99% query reduction for batch operations
   *
   * Example use case: Fetching health records for all students in a class or school
   *
   * @param studentIds - Array of student UUIDs
   * @returns Array of health record arrays, one array per student ID, in same order as input
   */
  async findByStudentIds(studentIds: string[]): Promise<HealthRecord[][]> {
    try {
      const records = await this.healthRecordModel.findAll({
        where: {
          studentId: { [Op.in]: studentIds },
        },
        include: [{ model: this.studentModel, as: 'student' }],
        order: [['recordDate', 'DESC']],
      });

      // Group by studentId
      const grouped = new Map<string, HealthRecord[]>();
      for (const record of records) {
        if (!grouped.has(record.studentId)) {
          grouped.set(record.studentId, []);
        }
        grouped.get(record.studentId)!.push(record);
      }

      // Return in same order as input, empty array for missing
      return studentIds.map((id) => grouped.get(id) || []);
    } catch (error) {
      this.logger.error(
        `Failed to batch fetch health records by student IDs: ${error.message}`,
      );
      throw new Error('Failed to batch fetch health records by student IDs');
    }
  }
}
