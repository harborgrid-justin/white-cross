/**
 * ScreeningRepository Implementation
 * Repository for Screening data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { Screening } from '../../models/healthcare/Screening';
import {
  IScreeningRepository,
  CreateScreeningDTO,
  UpdateScreeningDTO
} from '../interfaces/IScreeningRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class ScreeningRepository
  extends BaseRepository<Screening, any, any>
  implements IScreeningRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(Screening, auditLogger, cacheManager, 'Screening');
  }
}
