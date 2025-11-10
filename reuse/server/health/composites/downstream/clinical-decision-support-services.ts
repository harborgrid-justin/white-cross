/**
 * LOC: CERNER-CDS-SVC-DS-001
 * File: /reuse/server/health/composites/downstream/clinical-decision-support-services.ts
 *
 * UPSTREAM (imports from):
 *   - ../cerner-clinical-integration-composites
 *   - ../../health-clinical-decision-support-kit
 *   - ../../health-lab-diagnostics-kit
 *   - @nestjs/common
 *
 * DOWNSTREAM (imported by):
 *   - CDS backend services
 *   - Clinical alert systems
 *   - Drug interaction checkers
 */

import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import {
  orchestrateClinicalEncounterWorkflow,
} from '../cerner-clinical-integration-composites';

export interface DrugInteractionAlert {
  alertId: string;
  severity: 'critical' | 'major' | 'moderate' | 'minor';
  drug1: string;
  drug2: string;
  interaction: string;
  recommendation: string;
  references: string[];
}

export interface ClinicalGuidelineRecommendation {
  guidelineId: string;
  guidelineName: string;
  applicableCondition: string;
  recommendation: string;
  evidence Level: 'A' | 'B' | 'C' | 'D';
  references: string[];
}

@Injectable()
export class ClinicalDecisionSupportService {
  private readonly logger = new Logger(ClinicalDecisionSupportService.name);

  /**
   * Check drug-drug interactions
   * Analyzes medication list for potential interactions
   */
  async checkDrugInteractions(
    medications: Array<{ name: string; dose: string }>,
    patientId: string
  ): Promise<DrugInteractionAlert[]> {
    this.logger.log(`Checking drug interactions for patient ${patientId}: ${medications.length} medications`);

    try {
      const alerts: DrugInteractionAlert[] = [];

      // Example: Check warfarin + aspirin
      const hasWarfarin = medications.some(m => m.name.toLowerCase().includes('warfarin'));
      const hasAspirin = medications.some(m => m.name.toLowerCase().includes('aspirin'));

      if (hasWarfarin && hasAspirin) {
        alerts.push({
          alertId: crypto.randomUUID(),
          severity: 'major',
          drug1: 'Warfarin',
          drug2: 'Aspirin',
          interaction: 'Increased risk of bleeding when warfarin is combined with aspirin',
          recommendation: 'Monitor INR more frequently. Consider alternative antiplatelet agent if appropriate.',
          references: ['Pharmacotherapy 2010;30:1139-1151'],
        });
      }

      this.logger.log(`Drug interaction check complete: ${alerts.length} alerts generated`);
      return alerts;
    } catch (error) {
      this.logger.error(`Drug interaction check failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Apply clinical guidelines
   * Recommends evidence-based interventions based on patient condition
   */
  async applyClinicalGuidelines(
    patientConditions: string[],
    patientId: string
  ): Promise<ClinicalGuidelineRecommendation[]> {
    this.logger.log(`Applying clinical guidelines for patient ${patientId}`);

    try {
      const recommendations: ClinicalGuidelineRecommendation[] = [];

      // Example: Diabetes management guideline
      if (patientConditions.includes('Type 2 Diabetes')) {
        recommendations.push({
          guidelineId: 'ADA-2024-DIABETES',
          guidelineName: 'ADA Standards of Medical Care in Diabetes',
          applicableCondition: 'Type 2 Diabetes',
          recommendation: 'Target HbA1c <7% for most adults. Consider SGLT2 inhibitor or GLP-1 RA with established ASCVD.',
          evidenceLevel: 'A',
          references: ['Diabetes Care 2024;47(Suppl 1):S1-S321'],
        });
      }

      // Example: Hypertension guideline
      if (patientConditions.includes('Hypertension')) {
        recommendations.push({
          guidelineId: 'ACC-AHA-2023-HTN',
          guidelineName: 'ACC/AHA Hypertension Guidelines',
          applicableCondition: 'Hypertension',
          recommendation: 'Target BP <130/80 mmHg. Initiate pharmacologic therapy with Stage 1 HTN if ASCVD risk ≥10%.',
          evidenceLevel: 'A',
          references: ['Circulation 2023;148:e123-e456'],
        });
      }

      this.logger.log(`Clinical guidelines applied: ${recommendations.length} recommendations`);
      return recommendations;
    } catch (error) {
      this.logger.error(`Clinical guideline application failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Assess patient risk scores
   * Calculates clinical risk scores for decision support
   */
  async assessPatientRiskScores(
    patientData: {
      age: number;
      gender: 'M' | 'F';
      vitals: any;
      labResults: any[];
      conditions: string[];
    },
    patientId: string
  ): Promise<{
    riskScores: Array<{
      scoreName: string;
      score: number;
      risk: 'low' | 'moderate' | 'high' | 'very_high';
      interpretation: string;
    }>;
  }> {
    this.logger.log(`Assessing risk scores for patient ${patientId}`);

    try {
      const riskScores = [];

      // Calculate CHADS2-VASc score if patient has atrial fibrillation
      if (patientData.conditions.includes('Atrial Fibrillation')) {
        const chadsVascScore = this.calculateCHADSVASc(patientData);
        riskScores.push({
          scoreName: 'CHA2DS2-VASc',
          score: chadsVascScore,
          risk: chadsVascScore >= 2 ? 'high' : chadsVascScore === 1 ? 'moderate' : 'low',
          interpretation: `Annual stroke risk ${chadsVascScore}% - ${
            chadsVascScore >= 2 ? 'Anticoagulation recommended' : 'Consider anticoagulation'
          }`,
        });
      }

      // Calculate ASCVD risk score
      const ascvdScore = this.calculateASCVDRisk(patientData);
      riskScores.push({
        scoreName: 'ASCVD 10-Year Risk',
        score: ascvdScore,
        risk: ascvdScore >= 20 ? 'very_high' : ascvdScore >= 7.5 ? 'high' : ascvdScore >= 5 ? 'moderate' : 'low',
        interpretation: `${ascvdScore.toFixed(1)}% 10-year ASCVD risk`,
      });

      this.logger.log(`Risk assessment complete: ${riskScores.length} scores calculated`);
      return { riskScores };
    } catch (error) {
      this.logger.error(`Risk score assessment failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate sepsis screening alerts
   * Screens for sepsis using SIRS criteria and qSOFA
   */
  async generateSepsisScreeningAlert(
    vitalSigns: {
      temperature: number;
      heartRate: number;
      respiratoryRate: number;
      systolicBP: number;
      mentalStatus: 'alert' | 'confused';
    },
    labResults: { wbc?: number },
    patientId: string
  ): Promise<{
    sepsisRisk: 'none' | 'possible' | 'likely';
    sirsCriteria: number;
    qsofaScore: number;
    recommendation: string;
  }> {
    this.logger.log(`Screening for sepsis: patient ${patientId}`);

    try {
      let sirsCriteria = 0;

      // SIRS criteria
      if (vitalSigns.temperature > 38 || vitalSigns.temperature < 36) sirsCriteria++;
      if (vitalSigns.heartRate > 90) sirsCriteria++;
      if (vitalSigns.respiratoryRate > 20) sirsCriteria++;
      if (labResults.wbc && (labResults.wbc > 12 || labResults.wbc < 4)) sirsCriteria++;

      // qSOFA score
      let qsofaScore = 0;
      if (vitalSigns.respiratoryRate >= 22) qsofaScore++;
      if (vitalSigns.systolicBP <= 100) qsofaScore++;
      if (vitalSigns.mentalStatus === 'confused') qsofaScore++;

      const sepsisRisk =
        qsofaScore >= 2 || sirsCriteria >= 2 ? 'likely' : sirsCriteria >= 1 ? 'possible' : 'none';

      const recommendation =
        sepsisRisk === 'likely'
          ? 'High sepsis risk. Initiate sepsis protocol: blood cultures, lactate, broad-spectrum antibiotics within 1 hour.'
          : sepsisRisk === 'possible'
          ? 'Possible sepsis. Monitor closely and reassess in 30-60 minutes.'
          : 'Low sepsis risk. Continue routine monitoring.';

      this.logger.log(`Sepsis screening: ${sepsisRisk} risk, qSOFA=${qsofaScore}, SIRS=${sirsCriteria}`);

      return {
        sepsisRisk,
        sirsCriteria,
        qsofaScore,
        recommendation,
      };
    } catch (error) {
      this.logger.error(`Sepsis screening failed: ${error.message}`);
      throw error;
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private calculateCHADSVASc(patientData: any): number {
    let score = 0;
    if (patientData.conditions.includes('CHF')) score += 1;
    if (patientData.conditions.includes('Hypertension')) score += 1;
    if (patientData.age >= 75) score += 2;
    else if (patientData.age >= 65) score += 1;
    if (patientData.conditions.includes('Diabetes')) score += 1;
    if (patientData.conditions.includes('Stroke') || patientData.conditions.includes('TIA')) score += 2;
    if (patientData.conditions.includes('Vascular Disease')) score += 1;
    if (patientData.gender === 'F') score += 1;
    return score;
  }

  private calculateASCVDRisk(patientData: any): number {
    // Simplified ASCVD risk calculation (actual calculation is complex)
    const baseRisk = 5.0;
    let risk = baseRisk;
    if (patientData.age > 60) risk += 5;
    if (patientData.conditions.includes('Diabetes')) risk += 3;
    if (patientData.conditions.includes('Hypertension')) risk += 2;
    return Math.min(risk, 40);
  }
}

export default ClinicalDecisionSupportService;
