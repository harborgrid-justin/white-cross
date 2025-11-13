/**
 * @fileoverview Drug Catalog Service
 * @module clinical/services
 * @description Service for managing the drug catalog
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { literal, Op } from 'sequelize';
import { DrugCatalog } from '../entities/drug-catalog.entity';
import { AddDrugDto, UpdateDrugDto, BulkImportResult } from '../types/drug-interaction.types';

import { BaseService } from '@/common/base';
@Injectable()
export class DrugCatalogService extends BaseService {
  constructor(
    @InjectModel(DrugCatalog)
    private drugCatalogModel: typeof DrugCatalog,
  ) {}

  /**
   * Search drugs by name
   */
  async searchDrugs(query: string, limit: number = 20): Promise<DrugCatalog[]> {
    this.logInfo(`Searching drugs with query: ${query}`);

    return this.drugCatalogModel.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { genericName: { [Op.iLike]: `%${query}%` } },
          literal(`'${query}' = ANY(brand_names)`),
        ],
      },
      limit,
    });
  }

  /**
   * Search drug by RxNorm code
   */
  async searchByRxNorm(rxnormCode: string): Promise<DrugCatalog | null> {
    this.logInfo(`Searching drug by RxNorm code: ${rxnormCode}`);
    return this.drugCatalogModel.findOne({
      where: { rxnormCode },
    });
  }

  /**
   * Get drug by ID
   */
  async getDrugById(id: string): Promise<DrugCatalog> {
    const drug = await this.drugCatalogModel.findByPk(id);

    if (!drug) {
      throw new NotFoundException(`Drug with ID ${id} not found`);
    }

    return drug;
  }

  /**
   * Add a new drug to catalog
   */
  async addDrug(data: AddDrugDto): Promise<DrugCatalog> {
    this.logInfo(`Adding new drug: ${data.genericName}`);

    return this.drugCatalogModel.create({ ...data, isActive: true } as any);
  }

  /**
   * Update drug information
   */
  async updateDrug(id: string, updates: UpdateDrugDto): Promise<DrugCatalog> {
    const drug = await this.getDrugById(id);

    Object.assign(drug, updates);
    await drug.save();
    return drug;
  }

  /**
   * Get drugs by class
   */
  async getDrugsByClass(drugClass: string): Promise<DrugCatalog[]> {
    return this.drugCatalogModel.findAll({
      where: {
        drugClass: {
          [Op.iLike]: `%${drugClass}%`,
        },
        isActive: true,
      },
      order: [['genericName', 'ASC']],
    });
  }

  /**
   * Get controlled substances
   */
  async getControlledSubstances(schedule?: string): Promise<DrugCatalog[]> {
    const where: any = {
      controlledSubstanceSchedule: {
        [Op.ne]: null,
      },
      isActive: true,
    };

    if (schedule) {
      where.controlledSubstanceSchedule = schedule;
    }

    return this.drugCatalogModel.findAll({
      where,
      order: [
        ['controlledSubstanceSchedule', 'ASC'],
        ['genericName', 'ASC'],
      ],
    });
  }

  /**
   * Bulk import drugs from FDA data
   */
  async bulkImportDrugs(drugs: AddDrugDto[]): Promise<BulkImportResult> {
    this.logInfo(`Bulk importing ${drugs.length} drugs`);

    const result: BulkImportResult = {
      imported: 0,
      failed: 0,
      errors: [],
    };

    for (const drug of drugs) {
      try {
        // Check if drug already exists by RxNorm code
        if (drug.rxnormCode) {
          const existing = await this.drugCatalogModel.findOne({
            where: { rxnormCode: drug.rxnormCode },
          });
          if (existing) {
            result.failed++;
            result.errors.push(
              `Drug with RxNorm code ${drug.rxnormCode} already exists`,
            );
            continue;
          }
        }

        await this.addDrug(drug);
        result.imported++;
      } catch (error) {
        result.failed++;
        result.errors.push(
          `Failed to import ${drug.genericName}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }

    this.logInfo(
      `Bulk import complete: ${result.imported} imported, ${result.failed} failed`,
    );
    return result;
  }

  /**
   * Get total drug count
   */
  async getTotalDrugCount(): Promise<number> {
    return this.drugCatalogModel.count({
      where: { isActive: true },
    });
  }

  /**
   * Deactivate a drug
   */
  async deactivateDrug(id: string): Promise<void> {
    const drug = await this.getDrugById(id);
    drug.isActive = false;
    await drug.save();
    this.logInfo(`Deactivated drug: ${drug.genericName}`);
  }

  /**
   * Reactivate a drug
   */
  async reactivateDrug(id: string): Promise<void> {
    const drug = await this.drugCatalogModel.findByPk(id);
    if (!drug) {
      throw new NotFoundException(`Drug with ID ${id} not found`);
    }
    drug.isActive = true;
    await drug.save();
    this.logInfo(`Reactivated drug: ${drug.genericName}`);
  }
}
