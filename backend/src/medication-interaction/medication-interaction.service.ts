import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StudentMedication } from '../database/models/student-medication.model';
import { Medication } from '../database/models/medication.model';
import { DrugInteractionDto, InteractionCheckResultDto, InteractionSeverity } from './dto';

import { BaseService } from '../common/base';
/**
 * Medication Interaction Checker Service
 * Checks for drug-drug interactions and contraindications
 *
 * Migrated from backend/src/services/medicationInteractionService.ts
 * LOC: 161334FAAD
 */

// Mock drug interaction database
const KNOWN_INTERACTIONS: { [key: string]: DrugInteractionDto[] } = {
  warfarin: [
    {
      severity: InteractionSeverity.MAJOR,
      medication1: 'warfarin',
      medication2: 'aspirin',
      description: 'Increased risk of bleeding',
      recommendation: 'Monitor INR closely, consider alternative pain management',
    },
  ],
  metformin: [
    {
      severity: InteractionSeverity.MODERATE,
      medication1: 'metformin',
      medication2: 'insulin',
      description: 'Increased risk of hypoglycemia',
      recommendation: 'Monitor blood glucose levels frequently',
    },
  ],
};

@Injectable()
export class MedicationInteractionService extends BaseService {
  constructor(
    @InjectModel(StudentMedication)
    private readonly studentMedicationModel: typeof StudentMedication,
  ) {}

  /**
   * Check for interactions in student's current medications
   */
  async checkStudentMedications(studentId: string): Promise<InteractionCheckResultDto> {
    try {
      const medications = await this.studentMedicationModel.findAll({
        where: { studentId, isActive: true },
        include: [{ model: Medication, as: 'medication' }],
      });

      const interactions: DrugInteractionDto[] = [];

      // Check all medication pairs
      for (let i = 0; i < medications.length; i++) {
        for (let j = i + 1; j < medications.length; j++) {
          const med1 = medications[i]?.medication?.name?.toLowerCase() ?? '';
          const med2 = medications[j]?.medication?.name?.toLowerCase() ?? '';

          const foundInteractions = this.findInteractions(med1, med2);
          interactions.push(...foundInteractions);
        }
      }

      const hasInteractions = interactions.length > 0;
      const safetyScore = this.calculateSafetyScore(interactions);

      this.logInfo({
        message: 'Medication interaction check completed',
        studentId,
        medicationCount: medications.length,
        interactionCount: interactions.length,
      });

      return {
        hasInteractions,
        interactions,
        safetyScore,
      };
    } catch (error) {
      this.logError('Error checking medication interactions', {
        error,
        studentId,
      });
      throw error;
    }
  }

  /**
   * Check if new medication will interact with existing ones
   */
  async checkNewMedication(
    studentId: string,
    newMedicationName: string,
  ): Promise<InteractionCheckResultDto> {
    try {
      const existingMedications = await this.studentMedicationModel.findAll({
        where: { studentId, isActive: true },
        include: [{ model: Medication, as: 'medication' }],
      });

      const interactions: DrugInteractionDto[] = [];

      for (const existingMed of existingMedications) {
        const existingName = existingMed.medication?.name.toLowerCase() || '';
        const foundInteractions = this.findInteractions(
          newMedicationName.toLowerCase(),
          existingName,
        );
        interactions.push(...foundInteractions);
      }

      const hasInteractions = interactions.length > 0;
      const safetyScore = this.calculateSafetyScore(interactions);

      this.logInfo({
        message: 'New medication interaction check completed',
        studentId,
        newMedication: newMedicationName,
        interactionCount: interactions.length,
      });

      return {
        hasInteractions,
        interactions,
        safetyScore,
      };
    } catch (error) {
      this.logError('Error checking new medication interactions', {
        error,
      });
      throw error;
    }
  }

  /**
   * Get interaction recommendations
   */
  async getInteractionRecommendations(studentId: string): Promise<string[]> {
    try {
      const result = await this.checkStudentMedications(studentId);

      const recommendations: string[] = [];

      if (!result.hasInteractions) {
        recommendations.push('No significant drug interactions detected');
        return recommendations;
      }

      result.interactions.forEach((interaction) => {
        recommendations.push(
          `${interaction.medication1} + ${interaction.medication2}: ${interaction.recommendation}`,
        );
      });

      if (result.safetyScore < 70) {
        recommendations.push(
          'URGENT: Consult with pharmacist or physician regarding medication regimen',
        );
      }

      return recommendations;
    } catch (error) {
      this.logError('Error getting interaction recommendations', { error });
      throw error;
    }
  }

  /**
   * Find interactions between two medications
   */
  private findInteractions(med1: string, med2: string): DrugInteractionDto[] {
    const interactions: DrugInteractionDto[] = [];

    // Check both directions
    if (KNOWN_INTERACTIONS[med1]) {
      const matches = KNOWN_INTERACTIONS[med1].filter((i) => i.medication2.toLowerCase() === med2);
      interactions.push(...matches);
    }

    if (KNOWN_INTERACTIONS[med2]) {
      const matches = KNOWN_INTERACTIONS[med2].filter((i) => i.medication2.toLowerCase() === med1);
      interactions.push(...matches);
    }

    return interactions;
  }

  /**
   * Calculate safety score based on interactions
   */
  private calculateSafetyScore(interactions: DrugInteractionDto[]): number {
    if (interactions.length === 0) return 100;

    const severityScores: { [key: string]: number } = {
      [InteractionSeverity.MINOR]: 5,
      [InteractionSeverity.MODERATE]: 15,
      [InteractionSeverity.MAJOR]: 30,
      [InteractionSeverity.CONTRAINDICATED]: 50,
    };

    let totalDeduction = 0;
    interactions.forEach((interaction) => {
      totalDeduction += severityScores[interaction.severity] || 0;
    });

    return Math.max(0, 100 - totalDeduction);
  }
}
