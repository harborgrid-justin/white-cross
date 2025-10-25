/**
 * AppointmentReminderRepository Implementation
 * Repository for AppointmentReminder data access with CRUD operations
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
}
