/**
 * ContactRepository Implementation
 * Repository for Contact data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { Contact } from '../../models/core/Contact';
import {
  IContactRepository,
  CreateContactDTO,
  UpdateContactDTO
} from '../interfaces/IContactRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class ContactRepository
  extends BaseRepository<Contact, any, any>
  implements IContactRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(Contact, auditLogger, cacheManager, 'Contact');
  }

  /**
   * Invalidate Contact-related caches
   */
  protected async invalidateCaches(entity: Contact): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:contact:*`);
    } catch (error) {
      logger.warn('Error invalidating Contact caches:', error);
    }
  }

  /**
   * Sanitize Contact data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }
}
