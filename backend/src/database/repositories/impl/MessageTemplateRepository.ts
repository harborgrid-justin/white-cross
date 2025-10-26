/**
 * MessageTemplateRepository Implementation
 * Repository for MessageTemplate data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { MessageTemplate } from '../../models/communication/MessageTemplate';
import {
  IMessageTemplateRepository,
  CreateMessageTemplateDTO,
  UpdateMessageTemplateDTO
} from '../interfaces/IMessageTemplateRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class MessageTemplateRepository
  extends BaseRepository<MessageTemplate, any, any>
  implements IMessageTemplateRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(MessageTemplate, auditLogger, cacheManager, 'MessageTemplate');
  }
  /**
   * Invalidate MessageTemplate-related caches
   */
  protected async invalidateCaches(entity: MessageTemplate): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:messagetemplate:*`);
    } catch (error) {
      logger.warn('Error invalidating MessageTemplate caches:', error);
    }
  }

  /**
   * Sanitize MessageTemplate data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}