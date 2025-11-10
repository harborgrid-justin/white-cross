/**
 * LOC: EPIC-TELE-BILL-DS-005
 * File: /reuse/server/health/composites/downstream/telehealth-billing-services.ts
 *
 * UPSTREAM (imports from):
 *   - ../epic-telehealth-composites
 *   - ../health-billing-claims-kit
 *   - @nestjs/common
 *
 * DOWNSTREAM (imported by):
 *   - Revenue cycle management systems
 *   - Claims processing workflows
 */

import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import {
  orchestrateEpicTelehealthBilling,
  EpicTelehealthContext,
} from '../epic-telehealth-composites';

import { VisitType } from '../health-telehealth-kit';

@Injectable()
@ApiTags('Telehealth Billing')
export class TelehealthBillingService {
  private readonly logger = new Logger(TelehealthBillingService.name);

  @ApiOperation({ summary: 'Generate telehealth billing codes and submit claim' })
  async generateAndSubmitClaim(
    billingData: {
      visitId: string;
      patientId: string;
      visitType: VisitType;
      duration: number;
      patientState: string;
      providerState: string;
      newPatient: boolean;
      diagnosisCodes: string[];
    },
    userId: string,
    organizationId: string,
    facilityId: string
  ): Promise<{
    claimId: string;
    billingCodes: any[];
    totalRVU: number;
    estimatedReimbursement: number;
    submittedToPayor: boolean;
  }> {
    this.logger.log(`Generating telehealth billing for visit ${billingData.visitId}`);

    const context: EpicTelehealthContext = {
      userId,
      userRole: 'billing',
      facilityId,
      organizationId,
      timestamp: new Date(),
    };

    const billing = await orchestrateEpicTelehealthBilling(
      {
        visitId: billingData.visitId,
        visitType: billingData.visitType,
        duration: billingData.duration,
        patientState: billingData.patientState,
        providerState: billingData.providerState,
        newPatient: billingData.newPatient,
      },
      context
    );

    // Submit claim to payer
    const claimId = await this.submitClaimToPayor(billingData, billing.billingCodes);

    return {
      claimId,
      billingCodes: billing.billingCodes,
      totalRVU: billing.totalRVU,
      estimatedReimbursement: billing.estimatedReimbursement,
      submittedToPayor: true,
    };
  }

  @ApiOperation({ summary: 'Validate telehealth billing compliance' })
  async validateBillingCompliance(
    visitData: {
      visitId: string;
      duration: number;
      consentObtained: boolean;
      audioVideoUsed: boolean;
      clinicalNoteCompleted: boolean;
    }
  ): Promise<{
    compliant: boolean;
    violations: string[];
    recommendations: string[];
  }> {
    this.logger.log(`Validating billing compliance for visit ${visitData.visitId}`);

    const violations: string[] = [];

    if (!visitData.consentObtained) {
      violations.push('Telehealth consent not obtained');
    }
    if (!visitData.audioVideoUsed) {
      violations.push('Audio-video interaction required for synchronous telehealth');
    }
    if (!visitData.clinicalNoteCompleted) {
      violations.push('Clinical documentation not completed');
    }
    if (visitData.duration < 10) {
      violations.push('Visit duration too short for billing (minimum 10 minutes)');
    }

    return {
      compliant: violations.length === 0,
      violations,
      recommendations: violations.length > 0
        ? ['Review telehealth documentation requirements', 'Complete missing consent forms']
        : [],
    };
  }

  private async submitClaimToPayor(billingData: any, codes: any[]): Promise<string> {
    this.logger.log(`Submitting claim for visit ${billingData.visitId}`);
    return `CLAIM-${Date.now()}`;
  }
}
