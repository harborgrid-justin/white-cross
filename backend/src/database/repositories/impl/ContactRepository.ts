/**
 * ContactRepository Implementation
 * Auto-generated repository for Contact data access
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { Contact } from '../../models/core/Contact';
import {
  IContactRepository,
  CreateContactDTO,
  UpdateContactDTO
} from '../interfaces/IContactRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
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
   * Custom Contact-specific methods can be added here
   */
}
