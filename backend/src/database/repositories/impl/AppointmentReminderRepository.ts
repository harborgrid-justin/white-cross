/**
 * AppointmentReminderRepository Implementation
 * Auto-generated repository for AppointmentReminder data access
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { AppointmentReminder } from '../../models/operations/AppointmentReminder';
import {
  IAppointmentReminderRepository,
  CreateAppointmentReminderDTO,
  UpdateAppointmentReminderDTO
} from '../interfaces/IAppointmentReminderRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class AppointmentReminderRepository
  extends BaseRepository<AppointmentReminder, any, any>
  implements IAppointmentReminderRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(AppointmentReminder, auditLogger, cacheManager, 'AppointmentReminder');
  }

  /**
   * Custom AppointmentReminder-specific methods can be added here
   */
}
