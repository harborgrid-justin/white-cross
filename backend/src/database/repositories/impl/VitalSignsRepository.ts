/**
 * VitalSignsRepository Implementation
 * Repository for VitalSigns data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { VitalSigns } from '../../models/healthcare/VitalSigns';
import {
  IVitalSignsRepository,
  CreateVitalSignsDTO,
  UpdateVitalSignsDTO
} from '../interfaces/IVitalSignsRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class VitalSignsRepository
  extends BaseRepository<VitalSigns, any, any>
  implements IVitalSignsRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(VitalSigns, auditLogger, cacheManager, 'VitalSigns');
  }
}
