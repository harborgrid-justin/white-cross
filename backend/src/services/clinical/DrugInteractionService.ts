import DrugCatalog from '@/database/models/clinical/DrugCatalog';
import DrugInteraction, { InteractionSeverity } from '@/database/models/clinical/DrugInteraction';
import StudentDrugAllergy from '@/database/models/clinical/StudentDrugAllergy';
import { Op } from 'sequelize';

export interface DrugSearchDTO {
  query: string;
  limit?: number;
}

export interface InteractionCheckDTO {
  drugIds: string[];
  studentId?: string;
}

export interface InteractionResult {
  hasInteractions: boolean;
  interactions: Array<{
    drug1: DrugCatalog;
    drug2: DrugCatalog;
    severity: InteractionSeverity;
    description: string;
    clinicalEffects?: string;
    management?: string;
    references?: string[];
  }>;
  allergies?: Array<{
    drug: DrugCatalog;
    allergyType: string;
    reaction: string;
    severity: string;
  }>;
  riskLevel: 'NONE' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

export interface AllergyDTO {
  studentId: string;
  drugId: string;
  allergyType: string;
  reaction: string;
  severity: string;
  notes?: string;
  diagnosedDate?: Date;
  diagnosedBy?: string;
}

/**
 * Drug Interaction Service
 * Feature 48: Drug Interaction Checker
 *
 * Manages drug catalog, checks interactions, and tracks allergies
 */
export class DrugInteractionService {
  /**
   * Search drugs by name
   */
  async searchDrugs(query: string, limit: number = 20): Promise<DrugCatalog[]> {
    return DrugCatalog.searchByName(query, limit);
  }

  /**
   * Search drugs by RxNorm code
   */
  async searchByRxNorm(rxnormCode: string): Promise<DrugCatalog | null> {
    return DrugCatalog.findOne({
      where: { rxnormCode },
    });
  }

  /**
   * Get drug by ID
   */
  async getDrugById(id: string): Promise<DrugCatalog | null> {
    return DrugCatalog.findByPk(id);
  }

  /**
   * Check drug interactions
   */
  async checkInteractions(data: InteractionCheckDTO): Promise<InteractionResult> {
    const result: InteractionResult = {
      hasInteractions: false,
      interactions: [],
      allergies: [],
      riskLevel: 'NONE',
    };

    // Get all drugs
    const drugs = await DrugCatalog.findAll({
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
        const interaction = await DrugInteraction.findOne({
          where: {
            [Op.or]: [
              { drug1Id: drug1.id, drug2Id: drug2.id },
              { drug1Id: drug2.id, drug2Id: drug1.id },
            ],
          },
        });

        if (interaction) {
          result.hasInteractions = true;
          result.interactions.push({
            drug1,
            drug2,
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
      const allergies = await StudentDrugAllergy.findAll({
        where: {
          studentId: data.studentId,
          drugId: { [Op.in]: data.drugIds },
        },
        include: ['drug'],
      });

      if (allergies.length > 0) {
        result.hasInteractions = true;
        result.allergies = allergies.map((allergy) => ({
          drug: allergy.drug,
          allergyType: allergy.allergyType,
          reaction: allergy.reaction,
          severity: allergy.severity,
        }));
      }
    }

    // Determine overall risk level
    result.riskLevel = this.calculateRiskLevel(result);

    return result;
  }

  /**
   * Calculate overall risk level
   */
  private calculateRiskLevel(result: InteractionResult): 'NONE' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' {
    if (!result.hasInteractions) {
      return 'NONE';
    }

    // Check for critical severity in interactions
    const hasCritical = result.interactions.some(
      (i) => i.severity === InteractionSeverity.CONTRAINDICATED
    );
    if (hasCritical) {
      return 'CRITICAL';
    }

    const hasMajor = result.interactions.some(
      (i) => i.severity === InteractionSeverity.MAJOR
    );
    if (hasMajor) {
      return 'HIGH';
    }

    const hasModerate = result.interactions.some(
      (i) => i.severity === InteractionSeverity.MODERATE
    );
    if (hasModerate) {
      return 'MODERATE';
    }

    // Check allergies
    if (result.allergies && result.allergies.length > 0) {
      const hasSevereAllergy = result.allergies.some(
        (a) => a.severity === 'SEVERE' || a.severity === 'LIFE_THREATENING'
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
  async addDrug(data: {
    genericName: string;
    brandNames?: string[];
    rxnormCode?: string;
    ndcCodes?: string[];
    drugClass?: string;
    description?: string;
    administrationRoute?: string;
    controlledSubstanceSchedule?: string;
  }): Promise<DrugCatalog> {
    return DrugCatalog.create({
      ...data,
      isActive: true,
    });
  }

  /**
   * Update drug information
   */
  async updateDrug(
    id: string,
    updates: Partial<{
      genericName: string;
      brandNames: string[];
      rxnormCode: string;
      ndcCodes: string[];
      drugClass: string;
      description: string;
      administrationRoute: string;
      controlledSubstanceSchedule: string;
      isActive: boolean;
    }>
  ): Promise<DrugCatalog> {
    const drug = await DrugCatalog.findByPk(id);
    if (!drug) {
      throw new Error('Drug not found');
    }

    await drug.update(updates);
    return drug;
  }

  /**
   * Add a drug interaction
   */
  async addInteraction(data: {
    drug1Id: string;
    drug2Id: string;
    severity: InteractionSeverity;
    description: string;
    clinicalEffects?: string;
    management?: string;
    references?: string[];
    evidenceLevel?: string;
  }): Promise<DrugInteraction> {
    // Validate drugs exist
    const drug1 = await DrugCatalog.findByPk(data.drug1Id);
    const drug2 = await DrugCatalog.findByPk(data.drug2Id);

    if (!drug1 || !drug2) {
      throw new Error('One or both drugs not found');
    }

    if (data.drug1Id === data.drug2Id) {
      throw new Error('Cannot create interaction with same drug');
    }

    // Check if interaction already exists
    const existing = await DrugInteraction.findOne({
      where: {
        [Op.or]: [
          { drug1Id: data.drug1Id, drug2Id: data.drug2Id },
          { drug1Id: data.drug2Id, drug2Id: data.drug1Id },
        ],
      },
    });

    if (existing) {
      throw new Error('Interaction already exists');
    }

    return DrugInteraction.create(data);
  }

  /**
   * Update drug interaction
   */
  async updateInteraction(
    id: string,
    updates: Partial<{
      severity: InteractionSeverity;
      description: string;
      clinicalEffects: string;
      management: string;
      references: string[];
      evidenceLevel: string;
    }>
  ): Promise<DrugInteraction> {
    const interaction = await DrugInteraction.findByPk(id);
    if (!interaction) {
      throw new Error('Interaction not found');
    }

    await interaction.update(updates);
    return interaction;
  }

  /**
   * Delete drug interaction
   */
  async deleteInteraction(id: string): Promise<void> {
    const interaction = await DrugInteraction.findByPk(id);
    if (!interaction) {
      throw new Error('Interaction not found');
    }

    await interaction.destroy();
  }

  /**
   * Add student drug allergy
   */
  async addAllergy(data: AllergyDTO): Promise<StudentDrugAllergy> {
    // Validate drug exists
    const drug = await DrugCatalog.findByPk(data.drugId);
    if (!drug) {
      throw new Error('Drug not found');
    }

    // Check if allergy already exists
    const existing = await StudentDrugAllergy.findOne({
      where: {
        studentId: data.studentId,
        drugId: data.drugId,
      },
    });

    if (existing) {
      throw new Error('Allergy already recorded for this student and drug');
    }

    return StudentDrugAllergy.create(data);
  }

  /**
   * Update student drug allergy
   */
  async updateAllergy(
    id: string,
    updates: Partial<AllergyDTO>
  ): Promise<StudentDrugAllergy> {
    const allergy = await StudentDrugAllergy.findByPk(id);
    if (!allergy) {
      throw new Error('Allergy not found');
    }

    await allergy.update(updates);
    return allergy;
  }

  /**
   * Delete student drug allergy
   */
  async deleteAllergy(id: string): Promise<void> {
    const allergy = await StudentDrugAllergy.findByPk(id);
    if (!allergy) {
      throw new Error('Allergy not found');
    }

    await allergy.destroy();
  }

  /**
   * Get all allergies for a student
   */
  async getStudentAllergies(studentId: string): Promise<StudentDrugAllergy[]> {
    return StudentDrugAllergy.findAll({
      where: { studentId },
      include: ['drug'],
      order: [['diagnosedDate', 'DESC']],
    });
  }

  /**
   * Get all interactions for a drug
   */
  async getDrugInteractions(drugId: string): Promise<Array<{
    interactingDrug: DrugCatalog;
    severity: InteractionSeverity;
    description: string;
    clinicalEffects?: string;
    management?: string;
  }>> {
    const interactions = await DrugInteraction.findAll({
      where: {
        [Op.or]: [{ drug1Id: drugId }, { drug2Id: drugId }],
      },
      include: ['drug1', 'drug2'],
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
    return DrugCatalog.findAll({
      where: {
        drugClass: { [Op.iLike]: `%${drugClass}%` },
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
      controlledSubstanceSchedule: { [Op.not]: null },
      isActive: true,
    };

    if (schedule) {
      where.controlledSubstanceSchedule = schedule;
    }

    return DrugCatalog.findAll({
      where,
      order: [['controlledSubstanceSchedule', 'ASC'], ['genericName', 'ASC']],
    });
  }

  /**
   * Bulk import drugs from FDA data
   */
  async bulkImportDrugs(
    drugs: Array<{
      genericName: string;
      brandNames?: string[];
      rxnormCode?: string;
      ndcCodes?: string[];
      drugClass?: string;
      description?: string;
      administrationRoute?: string;
      controlledSubstanceSchedule?: string;
    }>
  ): Promise<{ imported: number; failed: number; errors: string[] }> {
    const result = {
      imported: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const drug of drugs) {
      try {
        // Check if drug already exists by RxNorm code
        if (drug.rxnormCode) {
          const existing = await DrugCatalog.findOne({
            where: { rxnormCode: drug.rxnormCode },
          });
          if (existing) {
            result.failed++;
            result.errors.push(
              `Drug with RxNorm code ${drug.rxnormCode} already exists`
            );
            continue;
          }
        }

        await DrugCatalog.create({
          ...drug,
          isActive: true,
        });
        result.imported++;
      } catch (error) {
        result.failed++;
        result.errors.push(`Failed to import ${drug.genericName}: ${error.message}`);
      }
    }

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
    const totalDrugs = await DrugCatalog.count({ where: { isActive: true } });
    const interactions = await DrugInteraction.findAll({
      include: ['drug1', 'drug2'],
    });

    const bySeverity: Record<string, number> = {};
    const drugInteractionCounts: Map<string, { drug: DrugCatalog; count: number }> = new Map();

    for (const interaction of interactions) {
      // Count by severity
      bySeverity[interaction.severity] = (bySeverity[interaction.severity] || 0) + 1;

      // Count interactions per drug
      for (const drug of [interaction.drug1, interaction.drug2]) {
        const existing = drugInteractionCounts.get(drug.id);
        if (existing) {
          existing.count++;
        } else {
          drugInteractionCounts.set(drug.id, { drug, count: 1 });
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

export default new DrugInteractionService();
