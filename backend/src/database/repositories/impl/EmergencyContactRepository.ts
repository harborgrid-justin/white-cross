/**
 * EmergencyContactRepository Implementation
 * Repository for EmergencyContact data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { EmergencyContact } from '../../models/core/EmergencyContact';
import {
  IEmergencyContactRepository,
  CreateEmergencyContactDTO,
  UpdateEmergencyContactDTO
} from '../interfaces/IEmergencyContactRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class EmergencyContactRepository
  extends BaseRepository<EmergencyContact, any, any>
  implements IEmergencyContactRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(EmergencyContact, auditLogger, cacheManager, 'EmergencyContact');
  }
}
