/**
 * StudentMedicationRepository Implementation
 * Repository for StudentMedication data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { StudentMedication } from '../../models/medications/StudentMedication';
import {
  IStudentMedicationRepository,
  CreateStudentMedicationDTO,
  UpdateStudentMedicationDTO
} from '../interfaces/IStudentMedicationRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class StudentMedicationRepository
  extends BaseRepository<StudentMedication, any, any>
  implements IStudentMedicationRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(StudentMedication, auditLogger, cacheManager, 'StudentMedication');
  }
  /**
   * Invalidate StudentMedication-related caches
   */
  protected async invalidateCaches(entity: StudentMedication): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:studentmedication:*`);
    } catch (error) {
      logger.warn('Error invalidating StudentMedication caches:', error);
    }
  }

  /**
   * Sanitize StudentMedication data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}