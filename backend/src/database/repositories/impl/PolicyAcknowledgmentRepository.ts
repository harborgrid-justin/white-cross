/**
 * PolicyAcknowledgmentRepository Implementation
 * Repository for PolicyAcknowledgment data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { PolicyAcknowledgment } from '../../models/compliance/PolicyAcknowledgment';
import {
  IPolicyAcknowledgmentRepository,
  CreatePolicyAcknowledgmentDTO,
  UpdatePolicyAcknowledgmentDTO
} from '../interfaces/IPolicyAcknowledgmentRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class PolicyAcknowledgmentRepository
  extends BaseRepository<PolicyAcknowledgment, any, any>
  implements IPolicyAcknowledgmentRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(PolicyAcknowledgment, auditLogger, cacheManager, 'PolicyAcknowledgment');
  }
}
