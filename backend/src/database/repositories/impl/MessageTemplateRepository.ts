/**
 * MessageTemplateRepository Implementation
 * Auto-generated repository for MessageTemplate data access
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { MessageTemplate } from '../../models/communication/MessageTemplate';
import {
  IMessageTemplateRepository,
  CreateMessageTemplateDTO,
  UpdateMessageTemplateDTO
} from '../interfaces/IMessageTemplateRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
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
   * Custom MessageTemplate-specific methods can be added here
   */
}
