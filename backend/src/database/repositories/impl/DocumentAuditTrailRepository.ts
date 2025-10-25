/**
 * DocumentAuditTrailRepository Implementation
 * Repository for DocumentAuditTrail data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { DocumentAuditTrail } from '../../models/documents/DocumentAuditTrail';
import {
  IDocumentAuditTrailRepository,
  CreateDocumentAuditTrailDTO,
  UpdateDocumentAuditTrailDTO
} from '../interfaces/IDocumentAuditTrailRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class DocumentAuditTrailRepository
  extends BaseRepository<DocumentAuditTrail, any, any>
  implements IDocumentAuditTrailRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(DocumentAuditTrail, auditLogger, cacheManager, 'DocumentAuditTrail');
  }
}
