/**
 * RoleRepository Implementation
 * Repository for Role data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { Role } from '../../models/security/Role';
import {
  IRoleRepository,
  CreateRoleDTO,
  UpdateRoleDTO
} from '../interfaces/IRoleRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class RoleRepository
  extends BaseRepository<Role, any, any>
  implements IRoleRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(Role, auditLogger, cacheManager, 'Role');
  }
}
