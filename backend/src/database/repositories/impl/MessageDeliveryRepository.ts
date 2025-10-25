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
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class MessageDeliveryRepository
  extends BaseRepository<MessageDelivery, any, any>
  implements IMessageDeliveryRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(MessageDelivery, auditLogger, cacheManager, 'MessageDelivery');
  }
}
