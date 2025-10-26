/**
 * MedicationInventoryRepository Implementation
 * Repository for MedicationInventory data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { MedicationInventory } from '../../models/medications/MedicationInventory';
import {
  IMedicationInventoryRepository,
  CreateMedicationInventoryDTO,
  UpdateMedicationInventoryDTO
} from '../interfaces/IMedicationInventoryRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class MedicationInventoryRepository
  extends BaseRepository<MedicationInventory, any, any>
  implements IMedicationInventoryRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(MedicationInventory, auditLogger, cacheManager, 'MedicationInventory');
  }
  /**
   * Invalidate MedicationInventory-related caches
   */
  protected async invalidateCaches(entity: MedicationInventory): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:medicationinventory:*`);
    } catch (error) {
      logger.warn('Error invalidating MedicationInventory caches:', error);
    }
  }

  /**
   * Sanitize MedicationInventory data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}