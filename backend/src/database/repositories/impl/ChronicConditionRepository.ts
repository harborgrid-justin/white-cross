/**
 * Chronic Condition Repository Implementation
 * PHI-compliant chronic condition data access
 */

import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { ChronicCondition } from '../../models/healthcare/ChronicCondition';
import { ConditionSeverity, ConditionStatus } from '../../types/enums';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

interface CreateChronicConditionDTO {
  id: string;
  studentId: string;
  healthRecordId?: string;
  condition: string;
  icdCode?: string;
  diagnosisDate: Date;
  diagnosedBy?: string;
  severity?: ConditionSeverity;
  status?: ConditionStatus;
  medications?: any;
  treatments?: string;
  accommodationsRequired?: boolean;
  accommodationDetails?: string;
  emergencyProtocol?: string;
  actionPlan?: string;
  nextReviewDate?: Date;
  reviewFrequency?: string;
  restrictions?: any;
  precautions?: any;
  triggers?: string[];
  notes?: string;
  carePlan?: string;
  createdBy?: string;
}

interface UpdateChronicConditionDTO extends Partial<CreateChronicConditionDTO> {
  updatedBy?: string;
}

export interface IChronicConditionRepository {
  findByStudentId(studentId: string): Promise<any[]>;
  findBySeverity(severity: ConditionSeverity): Promise<any[]>;
  findByStatus(status: ConditionStatus): Promise<any[]>;
  findActiveConditions(studentId: string): Promise<any[]>;
  findConditionsDueForReview(): Promise<any[]>;
  findDueForReview(daysThreshold: number): Promise<ChronicCondition[]>;
  checkDuplicateCondition(studentId: string, condition: string): Promise<boolean>;
}

export class ChronicConditionRepository
  extends BaseRepository<ChronicCondition, CreateChronicConditionDTO, UpdateChronicConditionDTO>
  implements IChronicConditionRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(ChronicCondition, auditLogger, cacheManager, 'ChronicCondition');
  }

  async findByStudentId(studentId: string): Promise<any[]> {
    try {
      const conditions = await this.model.findAll({
        where: { studentId },
        order: [['severity', 'DESC'], ['condition', 'ASC']]
      });
      return conditions.map((c) => this.mapToEntity(c));
    } catch (error) {
      logger.error('Error finding chronic conditions by student:', error);
      throw new RepositoryError(
        'Failed to find chronic conditions',
        'FIND_BY_STUDENT_ERROR',
        500,
        { studentId }
      );
    }
  }

  async findBySeverity(severity: ConditionSeverity): Promise<any[]> {
    try {
      const conditions = await this.model.findAll({
        where: { severity },
        order: [['condition', 'ASC']]
      });
      return conditions.map((c) => this.mapToEntity(c));
    } catch (error) {
      logger.error('Error finding chronic conditions by severity:', error);
      throw new RepositoryError(
        'Failed to find chronic conditions by severity',
        'FIND_BY_SEVERITY_ERROR',
        500,
        { severity }
      );
    }
  }

  async findByStatus(status: ConditionStatus): Promise<any[]> {
    try {
      const conditions = await this.model.findAll({
        where: { status },
        order: [['condition', 'ASC']]
      });
      return conditions.map((c) => this.mapToEntity(c));
    } catch (error) {
      logger.error('Error finding chronic conditions by status:', error);
      throw new RepositoryError(
        'Failed to find chronic conditions by status',
        'FIND_BY_STATUS_ERROR',
        500,
        { status }
      );
    }
  }

  async findActiveConditions(studentId: string): Promise<any[]> {
    try {
      const conditions = await this.model.findAll({
        where: {
          studentId,
          status: ConditionStatus.ACTIVE
        },
        order: [['severity', 'DESC'], ['condition', 'ASC']]
      });
      return conditions.map((c) => this.mapToEntity(c));
    } catch (error) {
      logger.error('Error finding active chronic conditions:', error);
      throw new RepositoryError(
        'Failed to find active chronic conditions',
        'FIND_ACTIVE_ERROR',
        500,
        { studentId }
      );
    }
  }

  async findConditionsDueForReview(): Promise<any[]> {
    try {
      const conditions = await this.model.findAll({
        where: {
          status: ConditionStatus.ACTIVE,
          nextReviewDate: {
            [Op.lte]: new Date()
          }
        },
        order: [['nextReviewDate', 'ASC']]
      });
      return conditions.map((c) => this.mapToEntity(c));
    } catch (error) {
      logger.error('Error finding conditions due for review:', error);
      throw new RepositoryError(
        'Failed to find conditions due for review',
        'FIND_DUE_FOR_REVIEW_ERROR',
        500
      );
    }
  }

  async checkDuplicateCondition(
    studentId: string,
    condition: string
  ): Promise<boolean> {
    try {
      const count = await this.model.count({
        where: {
          studentId,
          condition: { [Op.iLike]: condition },
          status: ConditionStatus.ACTIVE
        }
      });
      return count > 0;
    } catch (error) {
      logger.error('Error checking duplicate condition:', error);
      return false;
    }
  }

  async findDueForReview(daysThreshold: number): Promise<ChronicCondition[]> {
    try {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + daysThreshold);

      return await this.model.findAll({
        where: {
          status: ConditionStatus.ACTIVE,
          nextReviewDate: {
            [Op.lte]: dueDate
          }
        },
        order: [['nextReviewDate', 'ASC']]
      });
    } catch (error) {
      logger.error('Error finding conditions due for review:', error);
      throw new RepositoryError(
        'Failed to find conditions due for review',
        'FIND_DUE_FOR_REVIEW_ERROR',
        500,
        { daysThreshold }
      );
    }
  }

  protected async validateCreate(data: CreateChronicConditionDTO): Promise<void> {
    const isDuplicate = await this.checkDuplicateCondition(
      data.studentId,
      data.condition
    );
    if (isDuplicate) {
      throw new RepositoryError(
        'Active condition already exists for this student',
        'DUPLICATE_CONDITION',
        409,
        { studentId: data.studentId, condition: data.condition }
      );
    }
  }

  protected async invalidateCaches(condition: ChronicCondition): Promise<void> {
    try {
      const data = condition.get();
      await this.cacheManager.deletePattern(
        `white-cross:chronic-condition:student:${data.studentId}:*`
      );
    } catch (error) {
      logger.warn('Error invalidating chronic condition caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

  protected shouldCache(): boolean {
    return true; // Chronic conditions can be cached with appropriate TTL
  }
}
