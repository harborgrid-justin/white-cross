/**
 * ConsentSignatureRepository Implementation
 * Repository for ConsentSignature data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { ConsentSignature } from '../../models/compliance/ConsentSignature';
import {
  IConsentSignatureRepository,
  CreateConsentSignatureDTO,
  UpdateConsentSignatureDTO
} from '../interfaces/IConsentSignatureRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class ConsentSignatureRepository
  extends BaseRepository<ConsentSignature, any, any>
  implements IConsentSignatureRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(ConsentSignature, auditLogger, cacheManager, 'ConsentSignature');
  }

  protected async invalidateCaches(entity: ConsentSignature): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.deletePattern(
        `white-cross:consentsignature:form:${data.consentFormId}:*`
      );
    } catch (error) {
      logger.warn('Error invalidating consent signature caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }
}
