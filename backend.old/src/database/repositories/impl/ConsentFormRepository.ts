/**
 * ConsentFormRepository Implementation
 * Repository for ConsentForm data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { ConsentForm } from '../../models/compliance/ConsentForm';
import {
  IConsentFormRepository,
  CreateConsentFormDTO,
  UpdateConsentFormDTO
} from '../interfaces/IConsentFormRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class ConsentFormRepository
  extends BaseRepository<ConsentForm, any, any>
  implements IConsentFormRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(ConsentForm, auditLogger, cacheManager, 'ConsentForm');
  }

  protected async invalidateCaches(entity: ConsentForm): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.deletePattern(
        `white-cross:consentform:type:${data.type}:*`
      );
    } catch (error) {
      logger.warn('Error invalidating consent form caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }
}
