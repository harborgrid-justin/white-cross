/**
 * SecurityIncidentRepository Implementation
 * Repository for SecurityIncident data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { SecurityIncident } from '../../models/security/SecurityIncident';
import {
  ISecurityIncidentRepository,
  CreateSecurityIncidentDTO,
  UpdateSecurityIncidentDTO
} from '../interfaces/ISecurityIncidentRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class SecurityIncidentRepository
  extends BaseRepository<SecurityIncident, any, any>
  implements ISecurityIncidentRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(SecurityIncident, auditLogger, cacheManager, 'SecurityIncident');
  }
}
