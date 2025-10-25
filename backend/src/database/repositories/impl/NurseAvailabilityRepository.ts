/**
 * NurseAvailabilityRepository Implementation
 * Repository for NurseAvailability data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { NurseAvailability } from '../../models/operations/NurseAvailability';
import {
  INurseAvailabilityRepository,
  CreateNurseAvailabilityDTO,
  UpdateNurseAvailabilityDTO
} from '../interfaces/INurseAvailabilityRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class NurseAvailabilityRepository
  extends BaseRepository<NurseAvailability, any, any>
  implements INurseAvailabilityRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(NurseAvailability, auditLogger, cacheManager, 'NurseAvailability');
  }
}
