/**
 * IpRestrictionRepository Implementation
 * Auto-generated repository for IpRestriction data access
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

  /**
   * Custom IpRestriction-specific methods can be added here
   */
}
