/**
 * Medication Repository Implementation
 * Controlled substance tracking
 */

import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { Medication } from '../../models/core/Medication';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class MedicationRepository extends BaseRepository<Medication, any, any> {
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(Medication, auditLogger, cacheManager, 'Medication');
  }

  async findByName(name: string): Promise<any[]> {
    try {
      const medications = await this.model.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${name}%` } },
            { genericName: { [Op.iLike]: `%${name}%` } }
          ]
        },
        order: [['name', 'ASC']],
        limit: 50
      });
      return medications.map((m) => this.mapToEntity(m));
    } catch (error) {
      logger.error('Error finding medications by name:', error);
      throw new RepositoryError(
        'Failed to find medications',
        'FIND_BY_NAME_ERROR',
        500
      );
    }
  }

  async findControlledSubstances(): Promise<any[]> {
    try {
      const medications = await this.model.findAll({
        where: { isControlled: true },
        order: [['name', 'ASC']]
      });
      return medications.map((m) => this.mapToEntity(m));
    } catch (error) {
      logger.error('Error finding controlled substances:', error);
      throw new RepositoryError(
        'Failed to find controlled substances',
        'FIND_CONTROLLED_ERROR',
        500
      );
    }
  }

  async findByNDC(ndc: string): Promise<any | null> {
    try {
      const medication = await this.model.findOne({
        where: { ndc }
      });
      return medication ? this.mapToEntity(medication) : null;
    } catch (error) {
      logger.error('Error finding medication by NDC:', error);
      throw new RepositoryError(
        'Failed to find medication by NDC',
        'FIND_BY_NDC_ERROR',
        500
      );
    }
  }

  protected async invalidateCaches(medication: Medication): Promise<void> {
    try {
      const data = medication.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, data.id)
      );
      await this.cacheManager.deletePattern(`white-cross:medication:*`);
    } catch (error) {
      logger.warn('Error invalidating medication caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

  protected shouldCache(): boolean {
    return true; // Medications are relatively static
  }
}
