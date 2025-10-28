/**
 * MessageRepository Implementation
 * Repository for Message data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { Message } from '../../models/communication/Message';
import {
  IMessageRepository,
  CreateMessageDTO,
  UpdateMessageDTO
} from '../interfaces/IMessageRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class MessageRepository
  extends BaseRepository<Message, any, any>
  implements IMessageRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(Message, auditLogger, cacheManager, 'Message');
  }
  /**
   * Invalidate Message-related caches
   */
  protected async invalidateCaches(entity: Message): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:message:*`);
    } catch (error) {
      logger.warn('Error invalidating Message caches:', error);
    }
  }

  /**
   * Sanitize Message data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}