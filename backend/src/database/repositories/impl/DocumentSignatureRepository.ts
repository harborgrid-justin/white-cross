/**
 * DocumentSignatureRepository Implementation
 * Repository for DocumentSignature data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { DocumentSignature } from '../../models/documents/DocumentSignature';
import {
  IDocumentSignatureRepository,
  CreateDocumentSignatureDTO,
  UpdateDocumentSignatureDTO
} from '../interfaces/IDocumentSignatureRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class DocumentSignatureRepository
  extends BaseRepository<DocumentSignature, any, any>
  implements IDocumentSignatureRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(DocumentSignature, auditLogger, cacheManager, 'DocumentSignature');
  }

  protected async invalidateCaches(entity: DocumentSignature): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.deletePattern(
        `white-cross:documentsignature:document:${data.documentId}:*`
      );
    } catch (error) {
      logger.warn('Error invalidating document signature caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }
}
