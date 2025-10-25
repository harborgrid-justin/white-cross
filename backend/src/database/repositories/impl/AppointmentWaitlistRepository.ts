/**
 * AppointmentWaitlistRepository Implementation
 * Auto-generated repository for AppointmentWaitlist data access
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { AppointmentWaitlist } from '../../models/operations/AppointmentWaitlist';
import {
  IAppointmentWaitlistRepository,
  CreateAppointmentWaitlistDTO,
  UpdateAppointmentWaitlistDTO
} from '../interfaces/IAppointmentWaitlistRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class AppointmentWaitlistRepository
  extends BaseRepository<AppointmentWaitlist, any, any>
  implements IAppointmentWaitlistRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(AppointmentWaitlist, auditLogger, cacheManager, 'AppointmentWaitlist');
  }

  /**
   * Custom AppointmentWaitlist-specific methods can be added here
   */
}
