/**
 * RolePermissionRepository Implementation
 * Repository for RolePermission data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { RolePermission } from '../../models/security/RolePermission';
import {
  IRolePermissionRepository,
  CreateRolePermissionDTO,
  UpdateRolePermissionDTO
} from '../interfaces/IRolePermissionRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class RolePermissionRepository
  extends BaseRepository<RolePermission, any, any>
  implements IRolePermissionRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(RolePermission, auditLogger, cacheManager, 'RolePermission');
  }
}
