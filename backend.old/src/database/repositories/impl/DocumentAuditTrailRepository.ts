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
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class DocumentAuditTrailRepository
  extends BaseRepository<DocumentAuditTrail, any, any>
  implements IDocumentAuditTrailRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(DocumentAuditTrail, auditLogger, cacheManager, 'DocumentAuditTrail');
  }

  protected async invalidateCaches(entity: DocumentAuditTrail): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.deletePattern(
        `white-cross:documentaudittrail:document:${data.documentId}:*`
      );
    } catch (error) {
      logger.warn('Error invalidating document audit trail caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }
}
