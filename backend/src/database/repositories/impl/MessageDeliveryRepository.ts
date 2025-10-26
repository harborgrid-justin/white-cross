/**
 * MessageDeliveryRepository Implementation
 * Repository for MessageDelivery data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { MessageDelivery } from '../../models/communication/MessageDelivery';
import {
  IMessageDeliveryRepository,
  CreateMessageDeliveryDTO,
  UpdateMessageDeliveryDTO
} from '../interfaces/IMessageDeliveryRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class MessageDeliveryRepository
  extends BaseRepository<MessageDelivery, any, any>
  implements IMessageDeliveryRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(MessageDelivery, auditLogger, cacheManager, 'MessageDelivery');
  }
  /**
   * Invalidate MessageDelivery-related caches
   */
  protected async invalidateCaches(entity: MessageDelivery): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:messagedelivery:*`);
    } catch (error) {
      logger.warn('Error invalidating MessageDelivery caches:', error);
    }
  }

  /**
   * Sanitize MessageDelivery data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}