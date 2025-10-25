/**
 * LicenseRepository Implementation
 * Repository for License data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { License } from '../../models/administration/License';
import {
  ILicenseRepository,
  CreateLicenseDTO,
  UpdateLicenseDTO
} from '../interfaces/ILicenseRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class LicenseRepository
  extends BaseRepository<License, any, any>
  implements ILicenseRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(License, auditLogger, cacheManager, 'License');
  }
}
