/**
 * LoginAttemptRepository Implementation
 * Repository for LoginAttempt data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { LoginAttempt } from '../../models/security/LoginAttempt';
import {
  ILoginAttemptRepository,
  CreateLoginAttemptDTO,
  UpdateLoginAttemptDTO
} from '../interfaces/ILoginAttemptRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class LoginAttemptRepository
  extends BaseRepository<LoginAttempt, any, any>
  implements ILoginAttemptRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(LoginAttempt, auditLogger, cacheManager, 'LoginAttempt');
  }
}
