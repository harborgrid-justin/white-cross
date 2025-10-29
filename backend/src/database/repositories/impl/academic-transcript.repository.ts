/**
 * Academic Transcript Repository Implementation
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import { IAuditLogger } from '../../interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import { ICacheManager } from '../../interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';
import { AcademicTranscript, SubjectGrade, AttendanceRecord, BehaviorRecord } from '../../models/academic-transcript.model';

export interface AcademicTranscriptAttributes {
  id: string;
  studentId: string;
  academicYear: string;
  semester: string;
  grade: string;
  gpa: number;
  subjects: SubjectGrade[];
  attendance: AttendanceRecord;
  behavior: BehaviorRecord;
  importedBy?: string;
  importedAt?: Date;
  importSource?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAcademicTranscriptDTO {
  studentId: string;
  academicYear: string;
  semester: string;
  grade: string;
  gpa: number;
  subjects: SubjectGrade[];
  attendance: AttendanceRecord;
  behavior: BehaviorRecord;
  importedBy?: string;
  importedAt?: Date;
  importSource?: string;
  metadata?: Record<string, any>;
}

export interface UpdateAcademicTranscriptDTO {
  academicYear?: string;
  semester?: string;
  grade?: string;
  gpa?: number;
  subjects?: SubjectGrade[];
  attendance?: AttendanceRecord;
  behavior?: BehaviorRecord;
  metadata?: Record<string, any>;
}

@Injectable()
export class AcademicTranscriptRepository extends BaseRepository<AcademicTranscript, AcademicTranscriptAttributes, CreateAcademicTranscriptDTO> {
  constructor(
    @InjectModel(AcademicTranscript)
    private readonly academicTranscriptModel: typeof AcademicTranscript,
    @Inject('IAuditLogger') auditLogger,
    @Inject('ICacheManager') cacheManager
  ) {
    super(academicTranscriptModel, auditLogger, cacheManager, 'AcademicTranscript');
  }

  /**
   * Validate academic transcript creation
   */
  protected async validateCreate(data: CreateAcademicTranscriptDTO): Promise<void> {
    // Validate required fields
    if (!data.studentId) {
      throw new RepositoryError('Student ID is required', 'VALIDATION_ERROR');
    }

    if (!data.academicYear) {
      throw new RepositoryError('Academic year is required', 'VALIDATION_ERROR');
    }

    if (!data.semester) {
      throw new RepositoryError('Semester is required', 'VALIDATION_ERROR');
    }

    if (!data.grade) {
      throw new RepositoryError('Grade level is required', 'VALIDATION_ERROR');
    }

    // Validate GPA range
    if (data.gpa < 0 || data.gpa > 4.0) {
      throw new RepositoryError('GPA must be between 0 and 4.0', 'VALIDATION_ERROR');
    }

    // Validate subjects array
    if (!Array.isArray(data.subjects) || data.subjects.length === 0) {
      throw new RepositoryError('At least one subject is required', 'VALIDATION_ERROR');
    }

    // Validate attendance data
    if (!data.attendance || typeof data.attendance !== 'object') {
      throw new RepositoryError('Attendance record is required', 'VALIDATION_ERROR');
    }

    // Check for duplicate transcript (same student, year, semester)
    const existing = await this.academicTranscriptModel.findOne({
      where: {
        studentId: data.studentId,
        academicYear: data.academicYear,
        semester: data.semester,
      },
    });

    if (existing) {
      throw new RepositoryError(
        `Academic transcript already exists for ${data.academicYear} ${data.semester}`,
        'DUPLICATE_RECORD'
      );
    }
  }

  /**
   * Validate academic transcript update
   */
  protected async validateUpdate(id: string, data: UpdateAcademicTranscriptDTO): Promise<void> {
    // Validate GPA if being updated
    if (data.gpa !== undefined && (data.gpa < 0 || data.gpa > 4.0)) {
      throw new RepositoryError('GPA must be between 0 and 4.0', 'VALIDATION_ERROR');
    }

    // Validate subjects array if being updated
    if (data.subjects !== undefined && (!Array.isArray(data.subjects) || data.subjects.length === 0)) {
      throw new RepositoryError('At least one subject is required', 'VALIDATION_ERROR');
    }
  }

  /**
   * Invalidate caches for academic transcript
   */
  protected async invalidateCaches(entity: any): Promise<void> {
    try {
      const entityData = entity.get ? entity.get() : entity;

      // Invalidate specific transcript cache
      await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, entityData.id));

      // Invalidate student's transcript list cache
      await this.cacheManager.delete(`white-cross:academic-transcripts:student:${entityData.studentId}`);

      // Invalidate academic year cache
      await this.cacheManager.delete(`white-cross:academic-transcripts:year:${entityData.academicYear}`);

      // Invalidate all transcripts pattern
      await this.cacheManager.deletePattern(`white-cross:${this.entityName.toLowerCase()}:*`);
    } catch (error) {
      this.logger.warn(`Error invalidating ${this.entityName} caches:`, error);
    }
  }

  /**
   * Sanitize academic transcript data for audit logs
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({ ...data });
  }

  /**
   * Find transcripts by student ID
   */
  async findByStudentId(studentId: string): Promise<AcademicTranscript[]> {
    const cacheKey = `white-cross:academic-transcripts:student:${studentId}`;

    // Try cache first
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as AcademicTranscript[];
    }

    // Query database
    const transcripts = await this.academicTranscriptModel.findAll({
      where: { studentId },
      order: [['academicYear', 'DESC'], ['semester', 'DESC']],
    });

    // Cache results
    await this.cacheManager.set(cacheKey, transcripts, 3600); // Cache for 1 hour

    return transcripts;
  }

  /**
   * Find transcripts by academic year
   */
  async findByAcademicYear(academicYear: string): Promise<AcademicTranscript[]> {
    const cacheKey = `white-cross:academic-transcripts:year:${academicYear}`;

    // Try cache first
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as AcademicTranscript[];
    }

    // Query database
    const transcripts = await this.academicTranscriptModel.findAll({
      where: { academicYear },
      order: [['gpa', 'DESC']],
    });

    // Cache results
    await this.cacheManager.set(cacheKey, transcripts, 3600); // Cache for 1 hour

    return transcripts;
  }
}
