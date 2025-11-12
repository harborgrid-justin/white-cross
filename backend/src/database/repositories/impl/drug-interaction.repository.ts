/**
 * Drug Interaction Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger  } from "../../../backend/src/database/interfaces";
import { sanitizeSensitiveData  } from "../../../backend/src/database/interfaces";
import type { ICacheManager  } from "../../../backend/src/database/interfaces";

export interface DrugInteractionAttributes {
  id: string;
  drug1: string;
  drug2: string;
  interactionType: string;
  severity: string;
  description: string;
  recommendations?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDrugInteractionDTO {
  drug1: string;
  drug2: string;
  interactionType: string;
  severity: string;
  description: string;
  recommendations?: string;
}

export interface UpdateDrugInteractionDTO {
  interactionType?: string;
  severity?: string;
  description?: string;
  recommendations?: string;
  isActive?: boolean;
}

@Injectable()
export class DrugInteractionRepository extends BaseRepository<
  any,
  DrugInteractionAttributes,
  CreateDrugInteractionDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'DrugInteraction');
  }

  async findByDrug(drugName: string): Promise<DrugInteractionAttributes[]> {
    try {
      const interactions = await this.model.findAll({
        where: {
          [Op.or]: [
            { drug1: { [Op.iLike]: `%${drugName}%` } },
            { drug2: { [Op.iLike]: `%${drugName}%` } },
          ],
          isActive: true,
        },
        order: [['severity', 'DESC']],
      });
      return interactions.map((i: Immunization) => this.mapToEntity(i));
    } catch (error) {
      this.logger.error('Error finding drug interactions:', error);
      throw new RepositoryError(
        'Failed to find drug interactions',
        'FIND_BY_DRUG_ERROR',
        500,
        { drugName, error: (error as Error).message },
      );
    }
  }

  async findBySeverity(severity: string): Promise<DrugInteractionAttributes[]> {
    try {
      const interactions = await this.model.findAll({
        where: { severity, isActive: true },
        order: [['drug1', 'ASC']],
      });
      return interactions.map((i: Immunization) => this.mapToEntity(i));
    } catch (error) {
      this.logger.error('Error finding interactions by severity:', error);
      throw new RepositoryError(
        'Failed to find interactions by severity',
        'FIND_BY_SEVERITY_ERROR',
        500,
        { severity, error: (error as Error).message },
      );
    }
  }

  protected async validateCreate(
    data: CreateDrugInteractionDTO,
  ): Promise<void> {}

  protected async validateUpdate(
    id: string,
    data: UpdateDrugInteractionDTO,
  ): Promise<void> {}

  protected async invalidateCaches(interaction: DrugInteraction): Promise<void> {
    try {
      const interactionData = interaction.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, interactionData.id),
      );
      await this.cacheManager.deletePattern(`white-cross:drug-interaction:*`);
    } catch (error) {
      this.logger.warn('Error invalidating drug interaction caches:', error);
    }
  }

  protected sanitizeForAudit(data: Partial<DrugInteractionAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
