/**
 * LOC: CDSS-DS-014
 * File: /reuse/server/health/composites/downstream/clinical-decision-support-systems.ts
 *
 * UPSTREAM (imports from):
 *   - ../epic-clinical-workflows-composites
 *   - ../health-clinical-decision-support-kit
 *   - @nestjs/common
 *
 * DOWNSTREAM (imported by):
 *   - CDS Hooks implementations
 *   - Order entry systems
 */

import { Injectable, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  orchestrateClinicalDecisionSupport,
  orchestratePrescriptionOrderingWithSafety,
  orchestrateLabOrderEntryWithTracking,
} from '../epic-clinical-workflows-composites';

@Injectable()
@ApiTags('Clinical Decision Support Systems')
export class ClinicalDecisionSupportSystems {
  private readonly logger = new Logger(ClinicalDecisionSupportSystems.name);

  @ApiOperation({ summary: 'Generate clinical recommendations via CDS Hooks' })
  async generateCdsRecommendations(
    patientId: string,
    clinicalContext: {
      diagnoses: string[];
      medications: string[];
      labResults: any[];
      allergies: string[];
    },
    context: any
  ): Promise<{
    recommendations: any[];
    alerts: any[];
    suggestedOrders: any[];
  }> {
    this.logger.log(`Generating CDS recommendations for patient ${patientId}`);

    const recommendations = await orchestrateClinicalDecisionSupport(
      patientId,
      clinicalContext,
      context
    );

    return {
      recommendations: recommendations.map(r => ({
        type: r.type,
        severity: r.severity,
        message: r.message,
        actions: r.suggestedActions,
      })),
      alerts: recommendations.filter(r => r.severity === 'major' || r.severity === 'contraindicated'),
      suggestedOrders: [],
    };
  }

  @ApiOperation({ summary: 'Validate prescription orders with drug safety checks' })
  async validatePrescriptionOrders(
    patientId: string,
    prescriptions: any[],
    context: any
  ): Promise<{
    validated: boolean;
    safetyIssues: any[];
    approvedPrescriptions: any[];
  }> {
    this.logger.log(`Validating ${prescriptions.length} prescriptions for patient ${patientId}`);

    try {
      const approvedPrescriptions = await orchestratePrescriptionOrderingWithSafety(
        patientId,
        prescriptions,
        context
      );

      return {
        validated: true,
        safetyIssues: [],
        approvedPrescriptions,
      };
    } catch (error) {
      return {
        validated: false,
        safetyIssues: [{ type: 'drug_interaction', message: error.message }],
        approvedPrescriptions: [],
      };
    }
  }

  @ApiOperation({ summary: 'Provide order set recommendations' })
  async recommendOrderSets(
    patientId: string,
    diagnosis: string,
    context: any
  ): Promise<{
    orderSets: Array<{
      orderSetId: string;
      name: string;
      description: string;
      items: string[];
      evidenceLevel: string;
    }>;
  }> {
    this.logger.log(`Recommending order sets for diagnosis: ${diagnosis}`);

    return {
      orderSets: [
        {
          orderSetId: 'CHF-ADMIT',
          name: 'CHF Admission Order Set',
          description: 'Comprehensive orders for CHF admission',
          items: ['BNP', 'Chest X-Ray', 'EKG', 'Troponin', 'Metabolic Panel'],
          evidenceLevel: 'Level A',
        },
      ],
    };
  }
}
