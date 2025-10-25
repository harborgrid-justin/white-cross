/**
 * VendorRepository Implementation
 * Auto-generated repository for Vendor data access
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { Vendor } from '../../models/inventory/Vendor';
import {
  IVendorRepository,
  CreateVendorDTO,
  UpdateVendorDTO
} from '../interfaces/IVendorRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
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
   * Custom Vendor-specific methods can be added here
   */
}
