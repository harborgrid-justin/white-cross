/**
 * EmergencyContactRepository Implementation
 * Auto-generated repository for EmergencyContact data access
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

  /**
   * Custom EmergencyContact-specific methods can be added here
   */
}
