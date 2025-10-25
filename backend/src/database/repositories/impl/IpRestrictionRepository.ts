/**
 * IpRestrictionRepository Implementation
 * Repository for IpRestriction data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { IpRestriction } from '../../models/security/IpRestriction';
import {
  IIpRestrictionRepository,
  CreateIpRestrictionDTO,
  UpdateIpRestrictionDTO
} from '../interfaces/IIpRestrictionRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class IpRestrictionRepository
  extends BaseRepository<IpRestriction, any, any>
  implements IIpRestrictionRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(IpRestriction, auditLogger, cacheManager, 'IpRestriction');
  }
}
