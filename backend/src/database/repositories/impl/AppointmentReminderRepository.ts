/**
 * AppointmentReminderRepository Implementation
 * Repository for AppointmentReminder data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { AppointmentReminder } from '../../models/healthcare/AppointmentReminder';
import {
  IAppointmentReminderRepository,
  CreateAppointmentReminderDTO,
  UpdateAppointmentReminderDTO
} from '../interfaces/IAppointmentReminderRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class AppointmentReminderRepository
  extends BaseRepository<AppointmentReminder, any, any>
  implements IAppointmentReminderRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(AppointmentReminder, auditLogger, cacheManager, 'AppointmentReminder');
  }

  protected async invalidateCaches(entity: AppointmentReminder): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.deletePattern(
        `white-cross:appointmentreminder:appointment:${data.appointmentId}:*`
      );
    } catch (error) {
      logger.warn('Error invalidating appointment reminder caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }
}
