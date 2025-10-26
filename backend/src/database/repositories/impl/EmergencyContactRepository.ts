/**
 * EmergencyContactRepository Implementation
 * Repository for EmergencyContact data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { EmergencyContact } from '../../models/core/EmergencyContact';
import {
  IEmergencyContactRepository,
  CreateEmergencyContactDTO,
  UpdateEmergencyContactDTO
} from '../interfaces/IEmergencyContactRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class EmergencyContactRepository
  extends BaseRepository<EmergencyContact, any, any>
  implements IEmergencyContactRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(EmergencyContact, auditLogger, cacheManager, 'EmergencyContact');
  }

  protected async invalidateCaches(entity: EmergencyContact): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.deletePattern(
        `white-cross:emergencycontact:student:${data.studentId}:*`
      );
    } catch (error) {
      logger.warn('Error invalidating emergency contact caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }
}
