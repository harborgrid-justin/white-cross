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
}
