/**
 * VaccinationRepository Implementation
 * Repository for Vaccination data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { Vaccination } from '../../models/healthcare/Vaccination';
import {
  IVaccinationRepository,
  CreateVaccinationDTO,
  UpdateVaccinationDTO
} from '../interfaces/IVaccinationRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class VaccinationRepository
  extends BaseRepository<Vaccination, any, any>
  implements IVaccinationRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(Vaccination, auditLogger, cacheManager, 'Vaccination');
  }
}
