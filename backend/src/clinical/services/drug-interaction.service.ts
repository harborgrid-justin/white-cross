/**
 * @fileoverview Drug Interaction Service
 * @module clinical/services
 * @description Main service orchestrating all drug interaction functionality
 */

import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DrugInteraction } from '../entities/drug-interaction.entity';
import { DrugCatalogService } from './drug-catalog.service';
import { InteractionCheckerService } from './interaction-checker.service';
import { AllergyManagementService } from './allergy-management.service';
import { BaseService } from '../../../common/base';
import {
  InteractionResult,
  InteractionCheckDto,
  AddDrugDto,
  UpdateDrugDto,
  AddInteractionDto,
  UpdateInteractionDto,
  AddAllergyDto,
  UpdateAllergyDto,
  BulkImportResult,
  InteractionStatistics,
} from '../types/drug-interaction.types';

@Injectable()
export class DrugInteractionService extends BaseService {
  constructor(
    @InjectModel(DrugInteraction)
    private drugInteractionModel: typeof DrugInteraction,
    private readonly drugCatalogService: DrugCatalogService,
    private readonly interactionChecker: InteractionCheckerService,
    private readonly allergyManager: AllergyManagementService,
  ) {}

  // Drug Catalog Operations

  /**
   * Search drugs by name
   */
  async searchDrugs(query: string, limit: number = 20) {
    return this.drugCatalogService.searchDrugs(query, limit);
  }

  /**
   * Search drug by RxNorm code
   */
  async searchByRxNorm(rxnormCode: string) {
    return this.drugCatalogService.searchByRxNorm(rxnormCode);
  }

  /**
   * Get drug by ID
   */
  async getDrugById(id: string) {
    return this.drugCatalogService.getDrugById(id);
  }

  /**
   * Add a new drug to catalog
   */
  async addDrug(data: AddDrugDto) {
    return this.drugCatalogService.addDrug(data);
  }

  /**
   * Update drug information
   */
  async updateDrug(id: string, updates: UpdateDrugDto) {
    return this.drugCatalogService.updateDrug(id, updates);
  }

  /**
   * Get drugs by class
   */
  async getDrugsByClass(drugClass: string) {
    return this.drugCatalogService.getDrugsByClass(drugClass);
  }

  /**
   * Get controlled substances
   */
  async getControlledSubstances(schedule?: string) {
    return this.drugCatalogService.getControlledSubstances(schedule);
  }

  /**
   * Bulk import drugs from FDA data
   */
  async bulkImportDrugs(drugs: AddDrugDto[]): Promise<BulkImportResult> {
    return this.drugCatalogService.bulkImportDrugs(drugs);
  }

  // Interaction Checking Operations

  /**
   * Check drug interactions
   */
  async checkInteractions(data: InteractionCheckDto): Promise<InteractionResult> {
    return this.interactionChecker.checkInteractions(data);
  }

  /**
   * Get all interactions for a drug
   */
  async getDrugInteractions(drugId: string) {
    return this.interactionChecker.getDrugInteractions(drugId);
  }

  /**
   * Validate drug combination safety
   */
  async validateDrugCombination(drugIds: string[]) {
    return this.interactionChecker.validateDrugCombination(drugIds);
  }

  // Drug Interaction Management

  /**
   * Add a drug interaction
   */
  async addInteraction(data: AddInteractionDto) {
    this.logInfo(
      `Adding interaction between drugs ${data.drug1Id} and ${data.drug2Id}`,
    );

    // Validate drugs exist
    await this.drugCatalogService.getDrugById(data.drug1Id);
    await this.drugCatalogService.getDrugById(data.drug2Id);

    if (data.drug1Id === data.drug2Id) {
      throw new ConflictException('Cannot create interaction with same drug');
    }

    // Check if interaction already exists
    const existing = await this.drugInteractionModel.findOne({
      where: {
        [this.drugInteractionModel.sequelize!.Op.or]: [
          { drug1Id: data.drug1Id, drug2Id: data.drug2Id },
          { drug1Id: data.drug2Id, drug2Id: data.drug1Id },
        ],
      },
    });

    if (existing) {
      throw new ConflictException('Interaction already exists');
    }

    return this.drugInteractionModel.create(data as any);
  }

  /**
   * Update drug interaction
   */
  async updateInteraction(id: string, updates: UpdateInteractionDto) {
    const interaction = await this.drugInteractionModel.findByPk(id);

    if (!interaction) {
      throw new NotFoundException('Interaction not found');
    }

    Object.assign(interaction, updates);
    await interaction.save();
    return interaction;
  }

  /**
   * Delete drug interaction
   */
  async deleteInteraction(id: string): Promise<void> {
    const deletedCount = await this.drugInteractionModel.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      throw new NotFoundException('Interaction not found');
    }

    this.logInfo(`Deleted interaction ${id}`);
  }

  // Allergy Management Operations

  /**
   * Add student drug allergy
   */
  async addAllergy(data: AddAllergyDto) {
    return this.allergyManager.addAllergy(data);
  }

  /**
   * Update student drug allergy
   */
  async updateAllergy(id: string, updates: UpdateAllergyDto) {
    return this.allergyManager.updateAllergy(id, updates);
  }

  /**
   * Delete student drug allergy
   */
  async deleteAllergy(id: string): Promise<void> {
    return this.allergyManager.deleteAllergy(id);
  }

  /**
   * Get all allergies for a student
   */
  async getStudentAllergies(studentId: string) {
    return this.allergyManager.getStudentAllergies(studentId);
  }

  // Statistics and Reporting

  /**
   * Get interaction statistics
   */
  async getInteractionStatistics(): Promise<InteractionStatistics> {
    const totalDrugs = await this.drugCatalogService.getTotalDrugCount();
    const interactions = await this.drugInteractionModel.findAll({
      include: [
        { model: this.drugCatalogService['drugCatalogModel'], as: 'drug1' },
        { model: this.drugCatalogService['drugCatalogModel'], as: 'drug2' },
      ],
    });

    const bySeverity: Record<string, number> = {};
    const drugInteractionCounts = new Map<string, { drug: any; count: number }>();

    for (const interaction of interactions) {
      // Count by severity
      bySeverity[interaction.severity] = (bySeverity[interaction.severity] || 0) + 1;

      // Count interactions per drug
      for (const drug of [interaction.drug1, interaction.drug2]) {
        if (drug) {
          const existing = drugInteractionCounts.get(drug.id);
          if (existing) {
            existing.count++;
          } else {
            drugInteractionCounts.set(drug.id, { drug, count: 1 });
          }
        }
      }
    }

    // Get top 10 interacting drugs
    const topInteractingDrugs = Array.from(drugInteractionCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((item) => ({
        drug: item.drug,
        interactionCount: item.count,
      }));

    return {
      totalDrugs,
      totalInteractions: interactions.length,
      bySeverity,
      topInteractingDrugs,
    };
  }

  /**
   * Get allergy statistics
   */
  async getAllergyStatistics() {
    return this.allergyManager.getAllergyStatistics();
  }
}
