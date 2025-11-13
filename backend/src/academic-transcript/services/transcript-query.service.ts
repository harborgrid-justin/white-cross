/**
 * @fileoverview Transcript Query Service
 * @module academic-transcript/services/transcript-query.service
 * @description Service for querying academic transcript data
 */

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RequestContextService } from '../../shared/context/request-context.service';
import { BaseService } from '@/common/base';
import { AcademicRecord } from '../interfaces/academic-record.interface';
import { AcademicTranscriptRepository } from '../../database/repositories/impl/academic-transcript.repository';
import { StudentRepository } from '../../database/repositories/impl/student.repository';

/**
 * Transcript Query Service
 *
 * Handles querying academic transcript history from the database.
 * Supports single student queries and batch operations for performance optimization.
 */
@Injectable()
export class TranscriptQueryService extends BaseService {
  constructor(
    protected readonly requestContext: RequestContextService,
    @Inject(AcademicTranscriptRepository)
    private readonly academicTranscriptRepository: AcademicTranscriptRepository,
    @Inject(StudentRepository)
    private readonly studentRepository: StudentRepository,
  ) {
    super(requestContext);
  }

  /**
   * Get student's academic history
   *
   * Retrieves complete academic history for a student including all transcripts across
   * all academic years and semesters. Records are sorted chronologically with most recent first.
   *
   * @param {string} studentId - UUID of the student whose history to retrieve
   *
   * @returns {Promise<AcademicRecord[]>} Array of academic records sorted by year and semester
   *
   * @throws {NotFoundException} When student with given ID does not exist
   * @throws {InternalServerErrorException} When database query fails
   *
   * @example
   * ```typescript
   * const history = await transcriptQueryService.getAcademicHistory(
   *   '550e8400-e29b-41d4-a716-446655440000'
   * );
   * // Returns: [{academicYear: '2024-2025', semester: 'Fall', gpa: 3.5, ...}, ...]
   * ```
   *
   * @remarks
   * - Returns empty array if no transcripts found
   * - Sorted by academicYear DESC, semester DESC
   * - Includes all subjects, attendance, and behavior records
   * - Validates student existence before query
   * - All queries logged for audit trail
   */
  async getAcademicHistory(studentId: string): Promise<AcademicRecord[]> {
    try {
      // Validate student exists
      const student = await this.studentRepository.findById(studentId);
      if (!student) {
        throw new NotFoundException(`Student with ID ${studentId} not found`);
      }

      // Query academic transcripts from database
      const transcriptResults =
        await this.academicTranscriptRepository.findMany({
          where: { studentId },
          orderBy: { academicYear: 'DESC', semester: 'DESC' },
        });
      const transcripts = transcriptResults.data;

      this.logger.log(
        `Fetching academic history for student ${studentId}: ${transcripts.length} records found`,
      );

      // Convert to AcademicRecord interface
      return transcripts.map((transcript) => this.mapToAcademicRecord(transcript));
    } catch (error) {
      this.logger.error(
        `Error fetching academic history: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Batch fetch academic histories for multiple students
   *
   * OPTIMIZATION: Prevents N+1 query problem by fetching all transcripts in a single query
   * Before: N queries (one per student)
   * After: 1 query (all students at once)
   * Performance improvement: ~99% query reduction for graduating students endpoint
   *
   * @param {string[]} studentIds - Array of student UUIDs
   * @returns {Promise<Map<string, AcademicRecord[]>>} Map of studentId to their academic records
   *
   * @example
   * ```typescript
   * const studentIds = ['uuid1', 'uuid2', 'uuid3'];
   * const transcriptsMap = await transcriptQueryService.batchGetAcademicHistories(studentIds);
   * const student1Transcripts = transcriptsMap.get('uuid1') || [];
   * ```
   *
   * @remarks
   * - Returns empty array for students with no transcripts
   * - Orders transcripts by academic year and semester (DESC)
   * - More efficient than calling getAcademicHistory repeatedly
   * - Use this for bulk operations like graduating students report
   */
  async batchGetAcademicHistories(
    studentIds: string[],
  ): Promise<Map<string, AcademicRecord[]>> {
    try {
      if (!studentIds || studentIds.length === 0) {
        return new Map();
      }

      this.logger.log(
        `Batch fetching academic histories for ${studentIds.length} students`,
      );

      // OPTIMIZATION: Single query to fetch all transcripts for all students
      const transcriptResults =
        await this.academicTranscriptRepository.findMany({
          where: {
            studentId: { in: studentIds }, // Sequelize will translate this to IN clause
          },
          orderBy: { academicYear: 'DESC', semester: 'DESC' },
        });
      const allTranscripts = transcriptResults.data;

      // Group transcripts by student ID using Map for O(1) lookup
      const transcriptsByStudent = new Map<string, AcademicRecord[]>();

      // Initialize map with empty arrays for all student IDs
      studentIds.forEach((id) => transcriptsByStudent.set(id, []));

      // Group transcripts by student
      allTranscripts.forEach((transcript) => {
        const studentId = transcript.studentId;
        const academicRecord = this.mapToAcademicRecord(transcript);

        const studentTranscripts = transcriptsByStudent.get(studentId);
        if (studentTranscripts) {
          studentTranscripts.push(academicRecord);
        }
      });

      this.logger.log(
        `Batch fetched ${allTranscripts.length} transcripts for ${studentIds.length} students`,
      );

      return transcriptsByStudent;
    } catch (error) {
      this.logger.error(
        `Error batch fetching academic histories: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get specific academic record by ID
   *
   * @param {string} recordId - UUID of the academic record
   * @returns {Promise<AcademicRecord | null>} Academic record or null if not found
   */
  async getAcademicRecord(recordId: string): Promise<AcademicRecord | null> {
    try {
      const transcript = await this.academicTranscriptRepository.findById(recordId);
      if (!transcript) {
        return null;
      }

      return this.mapToAcademicRecord(transcript);
    } catch (error) {
      this.logger.error(
        `Error fetching academic record: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Check if transcript exists for student, year, and semester
   *
   * @param {string} studentId - Student UUID
   * @param {string} academicYear - Academic year (e.g., '2024-2025')
   * @param {string} semester - Semester (e.g., 'Fall', 'Spring')
   * @returns {Promise<boolean>} True if transcript exists
   */
  async transcriptExists(
    studentId: string,
    academicYear: string,
    semester: string,
  ): Promise<boolean> {
    try {
      const existingResults = await this.academicTranscriptRepository.findMany({
        where: {
          studentId,
          academicYear,
          semester,
        },
        pagination: { page: 1, limit: 1 },
      });

      return existingResults.data.length > 0;
    } catch (error) {
      this.logger.error(
        `Error checking transcript existence: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Map database entity to AcademicRecord interface
   *
   * @private
   * @param {any} transcript - Database transcript entity
   * @returns {AcademicRecord} Mapped academic record
   */
  private mapToAcademicRecord(transcript: any): AcademicRecord {
    return {
      id: transcript.id,
      studentId: transcript.studentId,
      academicYear: transcript.academicYear,
      semester: transcript.semester,
      grade: transcript.grade,
      gpa: transcript.gpa,
      subjects: transcript.subjects,
      attendance: transcript.attendance,
      behavior: transcript.behavior,
      createdAt: transcript.createdAt || new Date(),
      updatedAt: transcript.updatedAt || new Date(),
    };
  }
}
