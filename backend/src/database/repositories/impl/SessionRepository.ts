/**
 * SessionRepository Implementation
 * Auto-generated repository for Session data access
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { Session } from '../../models/security/Session';
import {
  ISessionRepository,
  CreateSessionDTO,
  UpdateSessionDTO
} from '../interfaces/ISessionRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class SessionRepository
  extends BaseRepository<Session, any, any>
  implements ISessionRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(Session, auditLogger, cacheManager, 'Session');
  }

  /**
   * Custom Session-specific methods can be added here
   */
}
