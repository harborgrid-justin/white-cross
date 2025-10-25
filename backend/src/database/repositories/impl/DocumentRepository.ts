/**
 * DocumentRepository Implementation
 * Repository for Document data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { Document } from '../../models/documents/Document';
import {
  IDocumentRepository,
  CreateDocumentDTO,
  UpdateDocumentDTO
} from '../interfaces/IDocumentRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class DocumentRepository
  extends BaseRepository<Document, any, any>
  implements IDocumentRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(Document, auditLogger, cacheManager, 'Document');
  }
}
