/**
 * WC-GEN-101 | DistrictRepository.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../base/BaseRepository, ../../models/administration/District, ../../audit/IAuditLogger | Dependencies: sequelize, ../base/BaseRepository, ../../models/administration/District
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * District Repository Implementation
 * Multi-tenant district management
 */

import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { District } from '../../models/administration/District';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class DistrictRepository extends BaseRepository<District, any, any> {
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(District, auditLogger, cacheManager, 'District');
  }

  async findByCode(code: string): Promise<any | null> {
    try {
      const district = await this.model.findOne({
        where: { code }
      });
      return district ? this.mapToEntity(district) : null;
    } catch (error) {
      logger.error('Error finding district by code:', error);
      throw new RepositoryError('Failed to find district', 'FIND_BY_CODE_ERROR', 500);
    }
  }

  async findActive(): Promise<any[]> {
    try {
      const districts = await this.model.findAll({
        where: { isActive: true },
        order: [['name', 'ASC']]
      });
      return districts.map((d) => this.mapToEntity(d));
    } catch (error) {
      logger.error('Error finding active districts:', error);
      throw new RepositoryError('Failed to find active districts', 'FIND_ACTIVE_ERROR', 500);
    }
  }

  async search(query: string): Promise<any[]> {
    try {
      const districts = await this.model.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${query}%` } },
            { code: { [Op.iLike]: `%${query}%` } }
          ]
        },
        order: [['name', 'ASC']],
        limit: 50
      });
      return districts.map((d) => this.mapToEntity(d));
    } catch (error) {
      logger.error('Error searching districts:', error);
      throw new RepositoryError('Failed to search districts', 'SEARCH_ERROR', 500);
    }
  }

  protected async invalidateCaches(district: District): Promise<void> {
    try {
      const data = district.get();
      await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, data.id));
      await this.cacheManager.deletePattern(`white-cross:district:*`);
    } catch (error) {
      logger.warn('Error invalidating district caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }
}
