/**
 * UserRoleAssignmentRepository Implementation
 * Repository for UserRoleAssignment data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { UserRoleAssignment } from '../../models/security/UserRoleAssignment';
import {
  IUserRoleAssignmentRepository,
  CreateUserRoleAssignmentDTO,
  UpdateUserRoleAssignmentDTO
} from '../interfaces/IUserRoleAssignmentRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class UserRoleAssignmentRepository
  extends BaseRepository<UserRoleAssignment, any, any>
  implements IUserRoleAssignmentRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(UserRoleAssignment, auditLogger, cacheManager, 'UserRoleAssignment');
  }
}
