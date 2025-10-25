/**
 * PermissionRepository Implementation
 * Auto-generated repository for Permission data access
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { Permission } from '../../models/security/Permission';
import {
  IPermissionRepository,
  CreatePermissionDTO,
  UpdatePermissionDTO
} from '../interfaces/IPermissionRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class PermissionRepository
  extends BaseRepository<Permission, any, any>
  implements IPermissionRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(Permission, auditLogger, cacheManager, 'Permission');
  }

  /**
   * Custom Permission-specific methods can be added here
   */
}
