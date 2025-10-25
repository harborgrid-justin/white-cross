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
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class MessageRepository
  extends BaseRepository<Message, any, any>
  implements IMessageRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(Message, auditLogger, cacheManager, 'Message');
  }
}
