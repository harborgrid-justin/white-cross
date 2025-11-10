/**
 * LOC: INS-VERIF-DS-019
 * File: /reuse/server/health/composites/downstream/insurance-verification-services.ts
 *
 * UPSTREAM (imports from):
 *   - ../epic-patient-workflow-composites
 *   - ../health-insurance-eligibility-kit
 *   - @nestjs/common
 *
 * DOWNSTREAM (imported by):
 *   - Registration services
 *   - Billing systems
 */

import { Injectable, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  orchestrateInsuranceVerificationWorkflow,
} from '../epic-patient-workflow-composites';

@Injectable()
@ApiTags('Insurance Verification Services')
export class InsuranceVerificationServices {
  private readonly logger = new Logger(InsuranceVerificationServices.name);

  @ApiOperation({ summary: 'Verify insurance eligibility and benefits' })
  async verifyInsuranceEligibilityAndBenefits(
    patientId: string,
    insuranceId: string,
    serviceDate: Date,
    serviceTypeCodes: string[]
  ): Promise<{
    verificationId: string;
    eligible: boolean;
    coverageStatus: string;
    benefits: any[];
    copay?: number;
    deductibleRemaining?: number;
    outOfPocketRemaining?: number;
    priorAuthRequired: boolean;
  }> {
    this.logger.log(`Verifying insurance eligibility for patient ${patientId}`);

    const result = await orchestrateInsuranceVerificationWorkflow(
      patientId,
      insuranceId,
      serviceDate,
      serviceTypeCodes
    );

    return {
      verificationId: result.verificationId,
      eligible: result.eligibilityConfirmed,
      coverageStatus: result.coverageStatus,
      benefits: result.benefitsVerified,
      copay: result.copayAmount,
      deductibleRemaining: result.deductibleRemaining,
      outOfPocketRemaining: result.outOfPocketRemaining,
      priorAuthRequired: result.priorAuthRequired,
    };
  }

  @ApiOperation({ summary: 'Check prior authorization status' })
  async checkPriorAuthorizationStatus(
    patientId: string,
    insuranceId: string,
    procedureCode: string
  ): Promise<{
    authorizationRequired: boolean;
    authorizationNumber?: string;
    authorizationStatus?: string;
    approvedUnits?: number;
    expiryDate?: Date;
  }> {
    this.logger.log(`Checking prior authorization for patient ${patientId}, procedure ${procedureCode}`);

    // Mock prior auth check
    return {
      authorizationRequired: true,
      authorizationNumber: 'AUTH123456',
      authorizationStatus: 'approved',
      approvedUnits: 10,
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    };
  }

  @ApiOperation({ summary: 'Submit prior authorization request' })
  async submitPriorAuthorizationRequest(
    patientId: string,
    insuranceId: string,
    priorAuthData: {
      procedureCode: string;
      diagnosisCode: string;
      providerId: string;
      urgency: 'routine' | 'urgent' | 'emergency';
      clinicalJustification: string;
    }
  ): Promise<{
    requestId: string;
    status: string;
    estimatedDecisionDate: Date;
  }> {
    this.logger.log(`Submitting prior authorization request for patient ${patientId}`);

    const requestId = `PA-REQ-${Date.now()}`;

    return {
      requestId,
      status: 'pending',
      estimatedDecisionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    };
  }

  @ApiOperation({ summary: 'Calculate patient financial responsibility' })
  async calculatePatientResponsibility(
    patientId: string,
    insuranceId: string,
    serviceCodes: string[],
    estimatedCharges: number
  ): Promise<{
    totalCharges: number;
    insurancePayment: number;
    patientResponsibility: number;
    breakdown: {
      copay: number;
      deductible: number;
      coinsurance: number;
      notCovered: number;
    };
  }> {
    this.logger.log(`Calculating patient responsibility for ${patientId}`);

    // Mock calculation
    const insurancePayment = estimatedCharges * 0.8;
    const patientResponsibility = estimatedCharges * 0.2;

    return {
      totalCharges: estimatedCharges,
      insurancePayment,
      patientResponsibility,
      breakdown: {
        copay: 25,
        deductible: 100,
        coinsurance: patientResponsibility - 125,
        notCovered: 0,
      },
    };
  }
}
