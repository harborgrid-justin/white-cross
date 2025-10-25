/**
 * ConsentSignatureRepository Implementation
 * Repository for ConsentSignature data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { ConsentSignature } from '../../models/compliance/ConsentSignature';
import {
  IConsentSignatureRepository,
  CreateConsentSignatureDTO,
  UpdateConsentSignatureDTO
} from '../interfaces/IConsentSignatureRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class ConsentSignatureRepository
  extends BaseRepository<ConsentSignature, any, any>
  implements IConsentSignatureRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(ConsentSignature, auditLogger, cacheManager, 'ConsentSignature');
  }
}
