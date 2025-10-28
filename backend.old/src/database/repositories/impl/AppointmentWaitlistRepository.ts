/**
 * AppointmentWaitlistRepository Implementation
 * Repository for AppointmentWaitlist data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { AppointmentWaitlist } from '../../models/healthcare/AppointmentWaitlist';
import {
  IAppointmentWaitlistRepository,
  CreateAppointmentWaitlistDTO,
  UpdateAppointmentWaitlistDTO
} from '../interfaces/IAppointmentWaitlistRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class AppointmentWaitlistRepository
  extends BaseRepository<AppointmentWaitlist, any, any>
  implements IAppointmentWaitlistRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(AppointmentWaitlist, auditLogger, cacheManager, 'AppointmentWaitlist');
  }

  protected async invalidateCaches(entity: AppointmentWaitlist): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.deletePattern(
        `white-cross:appointmentwaitlist:student:${data.studentId}:*`
      );
    } catch (error) {
      logger.warn('Error invalidating appointment waitlist caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }
}
