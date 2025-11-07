import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { literal, Op } from 'sequelize';
import { DrugCatalog } from '../entities/drug-catalog.entity';
import { DrugInteraction } from '../entities/drug-interaction.entity';
import { StudentDrugAllergy } from '../entities/student-drug-allergy.entity';
import { InteractionSeverity } from '../enums/interaction-severity.enum';
import { InteractionResult, RiskLevel } from '../interfaces/interaction-result.interface';
import { AddDrugDto } from '../dto/drug/add-drug.dto';
import { UpdateDrugDto } from '../dto/drug/update-drug.dto';
import { AddInteractionDto } from '../dto/drug/add-interaction.dto';
import { UpdateInteractionDto } from '../dto/drug/update-interaction.dto';
import { AddAllergyDto } from '../dto/drug/add-allergy.dto';
import { ClinicalUpdateAllergyDto } from '../dto/drug/update-allergy.dto';
import { InteractionCheckDto } from '../dto/drug/interaction-check.dto';

/**
 * Drug Interaction Service
 * Feature 48: Drug Interaction Checker
 *
 * Manages drug catalog, checks interactions, and tracks allergies
 */
@Injectable()
export class DrugInteractionService {
  private readonly logger = new Logger(DrugInteractionService.name);

  constructor(
    @InjectModel(DrugCatalog)
    private drugCatalogModel: typeof DrugCatalog,
    @InjectModel(DrugInteraction)
    private drugInteractionModel: typeof DrugInteraction,
    @InjectModel(StudentDrugAllergy)
    private studentDrugAllergyModel: typeof StudentDrugAllergy,
  ) {}

  /**
   * Search drugs by name
   */
  async searchDrugs(query: string, limit: number = 20): Promise<DrugCatalog[]> {
    this.logger.log(`Searching drugs with query: ${query}`);

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
    this.logger.log(`Searching drug by RxNorm code: ${rxnormCode}`);
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
   * Check drug interactions
   */
  async checkInteractions(
    data: InteractionCheckDto,
  ): Promise<InteractionResult> {
    this.logger.log(`Checking interactions for ${data.drugIds.length} drugs`);

    const result: InteractionResult = {
      hasInteractions: false,
      interactions: [],
      allergies: [],
      riskLevel: 'NONE',
    };

    // Get all drugs
    const drugs = await this.drugCatalogModel.findAll({
      where: {
        id: { [Op.in]: data.drugIds },
      },
    });

    if (drugs.length < 2) {
      return result; // Need at least 2 drugs to check interactions
    }

    // Check pairwise interactions
    for (let i = 0; i < drugs.length; i++) {
      for (let j = i + 1; j < drugs.length; j++) {
        const drug1 = drugs[i];
        const drug2 = drugs[j];

        // Check both directions (drug1-drug2 and drug2-drug1)
        const interaction = await this.drugInteractionModel.findOne({
          where: {
            [Op.or]: [
              { drug1Id: drug1.id, drug2Id: drug2.id },
              { drug1Id: drug2.id, drug2Id: drug1.id },
            ],
          },
          include: [
            { model: DrugCatalog, as: 'drug1' },
            { model: DrugCatalog, as: 'drug2' },
          ],
        });

        if (interaction) {
          result.hasInteractions = true;
          result.interactions.push({
            drug1: {
              id: drug1.id,
              genericName: drug1.genericName,
              brandNames: drug1.brandNames,
            },
            drug2: {
              id: drug2.id,
              genericName: drug2.genericName,
              brandNames: drug2.brandNames,
            },
            severity: interaction.severity,
            description: interaction.description,
            clinicalEffects: interaction.clinicalEffects,
            management: interaction.management,
            references: interaction.references,
          });
        }
      }
    }

    // Check student allergies if studentId provided
    if (data.studentId) {
      const allergies = await this.studentDrugAllergyModel.findAll({
        where: {
          studentId: data.studentId,
          drugId: { [Op.in]: data.drugIds },
        },
        include: [{ model: DrugCatalog, as: 'drug' }],
      });

      if (allergies.length > 0) {
        result.hasInteractions = true;
        // Filter out allergies with undefined drug data and map to result format
        result.allergies = allergies
          .filter((allergy) => allergy.drug != null)
          .map((allergy) => ({
            drug: {
              id: allergy.drug!.id,
              genericName: allergy.drug!.genericName,
              brandNames: allergy.drug!.brandNames,
            },
            allergyType: allergy.allergyType,
            reaction: allergy.reaction,
            severity: allergy.severity,
          }));
      }
    }

    // Determine overall risk level
    result.riskLevel = this.calculateRiskLevel(result);

    this.logger.log(
      `Interaction check complete: ${result.riskLevel} risk level`,
    );
    return result;
  }

  /**
   * Calculate overall risk level
   */
  private calculateRiskLevel(result: InteractionResult): RiskLevel {
    if (!result.hasInteractions) {
      return 'NONE';
    }

    // Check for critical severity in interactions
    const hasCritical = result.interactions.some(
      (i) => i.severity === InteractionSeverity.CONTRAINDICATED,
    );
    if (hasCritical) {
      return 'CRITICAL';
    }

    const hasMajor = result.interactions.some(
      (i) => i.severity === InteractionSeverity.MAJOR,
    );
    if (hasMajor) {
      return 'HIGH';
    }

    const hasModerate = result.interactions.some(
      (i) => i.severity === InteractionSeverity.MODERATE,
    );
    if (hasModerate) {
      return 'MODERATE';
    }

    // Check allergies
    if (result.allergies && result.allergies.length > 0) {
      const hasSevereAllergy = result.allergies.some(
        (a) => a.severity === 'SEVERE' || a.severity === 'LIFE_THREATENING',
      );
      if (hasSevereAllergy) {
        return 'CRITICAL';
      }
      return 'HIGH';
    }

    return 'LOW';
  }

  /**
   * Add a new drug to catalog
   */
  async addDrug(data: AddDrugDto): Promise<DrugCatalog> {
    this.logger.log(`Adding new drug: ${data.genericName}`);

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
   * Add a drug interaction
   */
  async addInteraction(data: AddInteractionDto): Promise<DrugInteraction> {
    this.logger.log(
      `Adding interaction between drugs ${data.drug1Id} and ${data.drug2Id}`,
    );

    // Validate drugs exist
    const drug1 = await this.getDrugById(data.drug1Id);
    const drug2 = await this.getDrugById(data.drug2Id);

    if (data.drug1Id === data.drug2Id) {
      throw new BadRequestException('Cannot create interaction with same drug');
    }

    // Check if interaction already exists
    const existing = await this.drugInteractionModel.findOne({
      where: {
        [Op.or]: [
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
  async updateInteraction(
    id: string,
    updates: UpdateInteractionDto,
  ): Promise<DrugInteraction> {
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

    this.logger.log(`Deleted interaction ${id}`);
  }

  /**
   * Add student drug allergy
   */
  async addAllergy(data: AddAllergyDto): Promise<StudentDrugAllergy> {
    this.logger.log(`Adding allergy for student ${data.studentId}`);

    // Validate drug exists
    await this.getDrugById(data.drugId);

    // Check if allergy already exists
    const existing = await this.studentDrugAllergyModel.findOne({
      where: {
        studentId: data.studentId,
        drugId: data.drugId,
      },
    });

    if (existing) {
      throw new ConflictException(
        'Allergy already recorded for this student and drug',
      );
    }

    return this.studentDrugAllergyModel.create(data as any);
  }

  /**
   * Update student drug allergy
   */
  async updateAllergy(
    id: string,
    updates: ClinicalUpdateAllergyDto,
  ): Promise<StudentDrugAllergy> {
    const allergy = await this.studentDrugAllergyModel.findByPk(id);

    if (!allergy) {
      throw new NotFoundException('Allergy not found');
    }

    Object.assign(allergy, updates);
    await allergy.save();
    return allergy;
  }

  /**
   * Delete student drug allergy
   */
  async deleteAllergy(id: string): Promise<void> {
    const deletedCount = await this.studentDrugAllergyModel.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      throw new NotFoundException('Allergy not found');
    }

    this.logger.log(`Deleted allergy ${id}`);
  }

  /**
   * Get all allergies for a student
   */
  async getStudentAllergies(studentId: string): Promise<StudentDrugAllergy[]> {
    return this.studentDrugAllergyModel.findAll({
      where: { studentId },
      include: [{ model: DrugCatalog, as: 'drug' }],
      order: [['diagnosedDate', 'DESC']],
    });
  }

  /**
   * Get all interactions for a drug
   */
  async getDrugInteractions(drugId: string): Promise<any[]> {
    await this.getDrugById(drugId); // Validate drug exists

    const interactions = await this.drugInteractionModel.findAll({
      where: {
        [Op.or]: [{ drug1Id: drugId }, { drug2Id: drugId }],
      },
      include: [
        { model: DrugCatalog, as: 'drug1' },
        { model: DrugCatalog, as: 'drug2' },
      ],
    });

    return interactions.map((interaction) => {
      const interactingDrug =
        interaction.drug1Id === drugId ? interaction.drug2 : interaction.drug1;
      return {
        interactingDrug,
        severity: interaction.severity,
        description: interaction.description,
        clinicalEffects: interaction.clinicalEffects,
        management: interaction.management,
      };
    });
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
  async bulkImportDrugs(
    drugs: AddDrugDto[],
  ): Promise<{ imported: number; failed: number; errors: string[] }> {
    this.logger.log(`Bulk importing ${drugs.length} drugs`);

    const result = {
      imported: 0,
      failed: 0,
      errors: [] as string[],
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
          `Failed to import ${drug.genericName}: ${error.message}`,
        );
      }
    }

    this.logger.log(
      `Bulk import complete: ${result.imported} imported, ${result.failed} failed`,
    );
    return result;
  }

  /**
   * Get interaction statistics
   */
  async getInteractionStatistics(): Promise<{
    totalDrugs: number;
    totalInteractions: number;
    bySeverity: Record<string, number>;
    topInteractingDrugs: Array<{ drug: DrugCatalog; interactionCount: number }>;
  }> {
    const totalDrugs = await this.drugCatalogModel.count({
      where: { isActive: true },
    });
    const interactions = await this.drugInteractionModel.findAll({
      include: [
        { model: DrugCatalog, as: 'drug1' },
        { model: DrugCatalog, as: 'drug2' },
      ],
    });

    const bySeverity: Record<string, number> = {};
    const drugInteractionCounts: Map<
      string,
      { drug: DrugCatalog; count: number }
    > = new Map();

    for (const interaction of interactions) {
      // Count by severity
      bySeverity[interaction.severity] =
        (bySeverity[interaction.severity] || 0) + 1;

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
}
