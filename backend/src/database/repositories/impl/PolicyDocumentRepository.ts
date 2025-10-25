/**
 * PolicyDocumentRepository Implementation
 * Repository for PolicyDocument data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { PolicyDocument } from '../../models/compliance/PolicyDocument';
import {
  IPolicyDocumentRepository,
  CreatePolicyDocumentDTO,
  UpdatePolicyDocumentDTO
} from '../interfaces/IPolicyDocumentRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class PolicyDocumentRepository
  extends BaseRepository<PolicyDocument, any, any>
  implements IPolicyDocumentRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(PolicyDocument, auditLogger, cacheManager, 'PolicyDocument');
  }
}
