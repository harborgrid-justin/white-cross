/**
 * @fileoverview Interaction Checker Service
 * @module clinical/services
 * @description Service for checking drug interactions and calculating risk levels
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { DrugCatalog } from '@/database/models/drug-catalog.model';
import { DrugInteraction } from '@/database/models/drug-interaction.model';
import { StudentDrugAllergy } from '@/database/models/student-drug-allergy.model';
import { BaseService } from '@/common/base';
import {
  InteractionResult,
  InteractionCheckDto,
  InteractionSeverity,
  RiskLevel,
} from '../types/drug-interaction.types';

@Injectable()
export class InteractionCheckerService extends BaseService {
  constructor(
    @InjectModel(DrugCatalog)
    private drugCatalogModel: typeof DrugCatalog,
    @InjectModel(DrugInteraction)
    private drugInteractionModel: typeof DrugInteraction,
    @InjectModel(StudentDrugAllergy)
    private studentDrugAllergyModel: typeof StudentDrugAllergy,
  ) {
    super("InteractionCheckerService");
  }

  /**
   * Check drug interactions for a list of drugs
   */
  async checkInteractions(data: InteractionCheckDto): Promise<InteractionResult> {
    this.logInfo(`Checking interactions for ${data.drugIds.length} drugs`);

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
    await this.checkPairwiseInteractions(drugs, result);

    // Check student allergies if studentId provided
    if (data.studentId) {
      await this.checkStudentAllergies(data.studentId, data.drugIds, result);
    }

    // Determine overall risk level
    result.riskLevel = this.calculateRiskLevel(result);

    this.logInfo(
      `Interaction check complete: ${result.riskLevel} risk level`,
    );
    return result;
  }

  /**
   * Check pairwise drug interactions
   */
  private async checkPairwiseInteractions(
    drugs: DrugCatalog[],
    result: InteractionResult,
  ): Promise<void> {
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
  }

  /**
   * Check student allergies for the given drugs
   */
  private async checkStudentAllergies(
    studentId: string,
    drugIds: string[],
    result: InteractionResult,
  ): Promise<void> {
    const allergies = await this.studentDrugAllergyModel.findAll({
      where: {
        studentId,
        drugId: { [Op.in]: drugIds },
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

  /**
   * Calculate overall risk level from interactions and allergies
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
   * Get all interactions for a specific drug
   */
  async getDrugInteractions(drugId: string): Promise<any[]> {
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
   * Validate drug combination safety
   */
  async validateDrugCombination(drugIds: string[]): Promise<{
    isSafe: boolean;
    warnings: string[];
    criticalIssues: string[];
  }> {
    const result = await this.checkInteractions({ drugIds });

    const validation = {
      isSafe: result.riskLevel === 'NONE' || result.riskLevel === 'LOW',
      warnings: [] as string[],
      criticalIssues: [] as string[],
    };

    // Add warnings for moderate interactions
    const moderateInteractions = result.interactions.filter(
      (i) => i.severity === InteractionSeverity.MODERATE,
    );
    if (moderateInteractions.length > 0) {
      validation.warnings.push(
        `${moderateInteractions.length} moderate drug interactions detected`,
      );
    }

    // Add critical issues for major and contraindicated interactions
    const criticalInteractions = result.interactions.filter(
      (i) =>
        i.severity === InteractionSeverity.MAJOR ||
        i.severity === InteractionSeverity.CONTRAINDICATED,
    );
    if (criticalInteractions.length > 0) {
      validation.criticalIssues.push(
        `${criticalInteractions.length} major/critical drug interactions detected`,
      );
      validation.isSafe = false;
    }

    // Add allergy warnings
    if (result.allergies && result.allergies.length > 0) {
      const severeAllergies = result.allergies.filter(
        (a) => a.severity === 'SEVERE' || a.severity === 'LIFE_THREATENING',
      );
      if (severeAllergies.length > 0) {
        validation.criticalIssues.push(
          `${severeAllergies.length} severe allergies detected`,
        );
        validation.isSafe = false;
      } else {
        validation.warnings.push(`${result.allergies.length} allergies detected`);
      }
    }

    return validation;
  }
}
