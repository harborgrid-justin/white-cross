/**
 * VendorRepository Implementation
 * Repository for Vendor data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { Vendor } from '../../models/inventory/Vendor';
import {
  IVendorRepository,
  CreateVendorDTO,
  UpdateVendorDTO
} from '../interfaces/IVendorRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class VendorRepository
  extends BaseRepository<Vendor, any, any>
  implements IVendorRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(Vendor, auditLogger, cacheManager, 'Vendor');
  }
  /**
   * Invalidate Vendor-related caches
   */
  protected async invalidateCaches(entity: Vendor): Promise<void> {
    try {
      const data = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:vendor:*`);
    } catch (error) {
      logger.warn('Error invalidating Vendor caches:', error);
    }
  }

  /**
   * Sanitize Vendor data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

}