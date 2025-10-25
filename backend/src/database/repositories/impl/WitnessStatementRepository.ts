/**
 * WitnessStatementRepository Implementation
 * Repository for WitnessStatement data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { WitnessStatement } from '../../models/incidents/WitnessStatement';
import {
  IWitnessStatementRepository,
  CreateWitnessStatementDTO,
  UpdateWitnessStatementDTO
} from '../interfaces/IWitnessStatementRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class WitnessStatementRepository
  extends BaseRepository<WitnessStatement, any, any>
  implements IWitnessStatementRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(WitnessStatement, auditLogger, cacheManager, 'WitnessStatement');
  }
}
