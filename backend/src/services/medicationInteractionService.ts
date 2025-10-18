import { Medication, StudentMedication } from '../database/models';
import { logger } from '../utils/logger';

/**
 * Medication Interaction Checker Service
 * Checks for drug-drug interactions and contraindications
 */

export interface DrugInteraction {
  severity: 'minor' | 'moderate' | 'major' | 'contraindicated';
  medication1: string;
  medication2: string;
  description: string;
  recommendation: string;
}

export interface InteractionCheckResult {
  hasInteractions: boolean;
  interactions: DrugInteraction[];
  safetyScore: number; // 0-100, higher = safer
}

// Mock drug interaction database
const KNOWN_INTERACTIONS: { [key: string]: DrugInteraction[] } = {
  'warfarin': [
    {
      severity: 'major',
      medication1: 'warfarin',
      medication2: 'aspirin',
      description: 'Increased risk of bleeding',
      recommendation: 'Monitor INR closely, consider alternative pain management'
    }
  ],
  'metformin': [
    {
      severity: 'moderate',
      medication1: 'metformin',
      medication2: 'insulin',
      description: 'Increased risk of hypoglycemia',
      recommendation: 'Monitor blood glucose levels frequently'
    }
  ]
};

export class MedicationInteractionService {
  /**
   * Check for interactions in student's current medications
   */
  static async checkStudentMedications(studentId: string): Promise<InteractionCheckResult> {
    try {
      const medications = await StudentMedication.findAll({
        where: { studentId, isActive: true },
        include: [{ model: Medication }]
      });

      const interactions: DrugInteraction[] = [];

      // Check all medication pairs
      for (let i = 0; i < medications.length; i++) {
        for (let j = i + 1; j < medications.length; j++) {
          const med1 = medications[i].medication?.name.toLowerCase() || '';
          const med2 = medications[j].medication?.name.toLowerCase() || '';

          const foundInteractions = this.findInteractions(med1, med2);
          interactions.push(...foundInteractions);
        }
      }

      const hasInteractions = interactions.length > 0;
      const safetyScore = this.calculateSafetyScore(interactions);

      logger.info('Medication interaction check completed', { 
        studentId, 
        medicationCount: medications.length,
        interactionCount: interactions.length 
      });

      return {
        hasInteractions,
        interactions,
        safetyScore
      };
    } catch (error) {
      logger.error('Error checking medication interactions', { error, studentId });
      throw error;
    }
  }

  /**
   * Check if new medication will interact with existing ones
   */
  static async checkNewMedication(
    studentId: string,
    newMedicationName: string
  ): Promise<InteractionCheckResult> {
    try {
      const existingMedications = await StudentMedication.findAll({
        where: { studentId, isActive: true },
        include: [{ model: Medication }]
      });

      const interactions: DrugInteraction[] = [];

      for (const existingMed of existingMedications) {
        const existingName = existingMed.medication?.name.toLowerCase() || '';
        const foundInteractions = this.findInteractions(newMedicationName.toLowerCase(), existingName);
        interactions.push(...foundInteractions);
      }

      const hasInteractions = interactions.length > 0;
      const safetyScore = this.calculateSafetyScore(interactions);

      logger.info('New medication interaction check completed', { 
        studentId, 
        newMedication: newMedicationName,
        interactionCount: interactions.length 
      });

      return {
        hasInteractions,
        interactions,
        safetyScore
      };
    } catch (error) {
      logger.error('Error checking new medication interactions', { error });
      throw error;
    }
  }

  /**
   * Find interactions between two medications
   */
  private static findInteractions(med1: string, med2: string): DrugInteraction[] {
    const interactions: DrugInteraction[] = [];

    // Check both directions
    if (KNOWN_INTERACTIONS[med1]) {
      const matches = KNOWN_INTERACTIONS[med1].filter(i => 
        i.medication2.toLowerCase() === med2
      );
      interactions.push(...matches);
    }

    if (KNOWN_INTERACTIONS[med2]) {
      const matches = KNOWN_INTERACTIONS[med2].filter(i => 
        i.medication2.toLowerCase() === med1
      );
      interactions.push(...matches);
    }

    return interactions;
  }

  /**
   * Calculate safety score based on interactions
   */
  private static calculateSafetyScore(interactions: DrugInteraction[]): number {
    if (interactions.length === 0) return 100;

    const severityScores: { [key: string]: number } = {
      'minor': 5,
      'moderate': 15,
      'major': 30,
      'contraindicated': 50
    };

    let totalDeduction = 0;
    interactions.forEach(interaction => {
      totalDeduction += severityScores[interaction.severity] || 0;
    });

    return Math.max(0, 100 - totalDeduction);
  }

  /**
   * Get interaction recommendations
   */
  static async getInteractionRecommendations(studentId: string): Promise<string[]> {
    try {
      const result = await this.checkStudentMedications(studentId);
      
      const recommendations: string[] = [];

      if (!result.hasInteractions) {
        recommendations.push('No significant drug interactions detected');
        return recommendations;
      }

      result.interactions.forEach(interaction => {
        recommendations.push(
          `${interaction.medication1} + ${interaction.medication2}: ${interaction.recommendation}`
        );
      });

      if (result.safetyScore < 70) {
        recommendations.push('URGENT: Consult with pharmacist or physician regarding medication regimen');
      }

      return recommendations;
    } catch (error) {
      logger.error('Error getting interaction recommendations', { error });
      throw error;
    }
  }
}
