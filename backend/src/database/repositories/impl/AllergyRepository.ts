/**
 * Allergy Repository Implementation
 * PHI-compliant allergy data access
 */

import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { Allergy } from '../../models/healthcare/Allergy';
import {
  IAllergyRepository,
  CreateAllergyDTO,
  UpdateAllergyDTO,
  AllergySeverity
} from '../interfaces/IAllergyRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class AllergyRepository
  extends BaseRepository<Allergy, any, any>
  implements IAllergyRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(Allergy, auditLogger, cacheManager, 'Allergy');
  }

  async findByStudentId(studentId: string): Promise<any[]> {
    try {
      const allergies = await this.model.findAll({
        where: { studentId },
        order: [['severity', 'DESC'], ['allergen', 'ASC']]
      });
      return allergies.map((a) => this.mapToEntity(a));
    } catch (error) {
      logger.error('Error finding allergies by student:', error);
      throw new RepositoryError(
        'Failed to find allergies',
        'FIND_BY_STUDENT_ERROR',
        500,
        { studentId }
      );
    }
  }

  async findBySeverity(severity: AllergySeverity): Promise<any[]> {
    try {
      const allergies = await this.model.findAll({
        where: { severity },
        order: [['allergen', 'ASC']]
      });
      return allergies.map((a) => this.mapToEntity(a));
    } catch (error) {
      logger.error('Error finding allergies by severity:', error);
      throw new RepositoryError(
        'Failed to find allergies by severity',
        'FIND_BY_SEVERITY_ERROR',
        500,
        { severity }
      );
    }
  }

  async checkDuplicateAllergen(
    studentId: string,
    allergen: string
  ): Promise<boolean> {
    try {
      const count = await this.model.count({
        where: {
          studentId,
          allergen: { [Op.iLike]: allergen }
        }
      });
      return count > 0;
    } catch (error) {
      logger.error('Error checking duplicate allergen:', error);
      return false;
    }
  }

  protected async validateCreate(data: CreateAllergyDTO): Promise<void> {
    const isDuplicate = await this.checkDuplicateAllergen(
      data.studentId,
      data.allergen
    );
    if (isDuplicate) {
      throw new RepositoryError(
        'Allergen already exists for this student',
        'DUPLICATE_ALLERGEN',
        409,
        { studentId: data.studentId, allergen: data.allergen }
      );
    }
  }

  protected async invalidateCaches(allergy: Allergy): Promise<void> {
    try {
      const data = allergy.get();
      await this.cacheManager.deletePattern(
        `white-cross:allergy:student:${data.studentId}:*`
      );
    } catch (error) {
      logger.warn('Error invalidating allergy caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

  protected shouldCache(): boolean {
    return true; // Allergies can be cached with appropriate TTL
  }
}
