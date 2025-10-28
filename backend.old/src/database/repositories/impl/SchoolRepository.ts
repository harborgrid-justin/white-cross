/**
 * LOC: 533B42D631
 * WC-GEN-104 | SchoolRepository.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - BaseRepository.ts (database/repositories/base/BaseRepository.ts)
 *   - School.ts (database/models/administration/School.ts)
 *   - IAuditLogger.ts (database/audit/IAuditLogger.ts)
 *   - ICacheManager.ts (database/cache/ICacheManager.ts)
 *   - logger.ts (utils/logger.ts)
 *
 * DOWNSTREAM (imported by):
 *   - RepositoryFactory.ts (database/repositories/RepositoryFactory.ts)
 */

/**
 * WC-GEN-104 | SchoolRepository.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../base/BaseRepository, ../../models/administration/School, ../../audit/IAuditLogger | Dependencies: sequelize, ../base/BaseRepository, ../../models/administration/School
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * School Repository Implementation
 * School management within districts
 */

import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { School } from '../../models/administration/School';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class SchoolRepository extends BaseRepository<School, any, any> {
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(School, auditLogger, cacheManager, 'School');
  }

  async findByDistrict(districtId: string): Promise<any[]> {
    try {
      const schools = await this.model.findAll({
        where: { districtId, isActive: true },
        order: [['name', 'ASC']]
      });
      return schools.map((s) => this.mapToEntity(s));
    } catch (error) {
      logger.error('Error finding schools by district:', error);
      throw new RepositoryError('Failed to find schools', 'FIND_BY_DISTRICT_ERROR', 500);
    }
  }

  async findByCode(code: string): Promise<any | null> {
    try {
      const school = await this.model.findOne({
        where: { code }
      });
      return school ? this.mapToEntity(school) : null;
    } catch (error) {
      logger.error('Error finding school by code:', error);
      throw new RepositoryError('Failed to find school', 'FIND_BY_CODE_ERROR', 500);
    }
  }

  async search(query: string, districtId?: string): Promise<any[]> {
    try {
      const where: any = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { code: { [Op.iLike]: `%${query}%` } }
        ]
      };

      if (districtId) {
        where.districtId = districtId;
      }

      const schools = await this.model.findAll({
        where,
        order: [['name', 'ASC']],
        limit: 50
      });
      return schools.map((s) => this.mapToEntity(s));
    } catch (error) {
      logger.error('Error searching schools:', error);
      throw new RepositoryError('Failed to search schools', 'SEARCH_ERROR', 500);
    }
  }

  protected async invalidateCaches(school: School): Promise<void> {
    try {
      const data = school.get();
      await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, data.id));
      await this.cacheManager.deletePattern(`white-cross:school:district:${data.districtId}:*`);
    } catch (error) {
      logger.warn('Error invalidating school caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }
}
