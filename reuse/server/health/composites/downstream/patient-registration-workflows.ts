/**
 * LOC: PAT-REG-WF-DS-016
 * File: /reuse/server/health/composites/downstream/patient-registration-workflows.ts
 *
 * UPSTREAM (imports from):
 *   - ../epic-patient-workflow-composites
 *   - @nestjs/common
 *
 * DOWNSTREAM (imported by):
 *   - Registration kiosk systems
 *   - Front desk applications
 */

import { Injectable, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  orchestrateCompletePatientRegistration,
  orchestratePatientArrivalCheckIn,
  orchestrateInsuranceVerificationWorkflow,
  orchestratePatientPortalProvisioning,
} from '../epic-patient-workflow-composites';

@Injectable()
@ApiTags('Patient Registration Workflows')
export class PatientRegistrationWorkflows {
  private readonly logger = new Logger(PatientRegistrationWorkflows.name);

  @ApiOperation({ summary: 'Execute complete patient registration workflow' })
  async executeCompleteRegistration(
    demographics: any,
    insurance: any,
    appointmentRequest?: any,
    userId?: string
  ): Promise<{
    mrn: string;
    patientId: string;
    insuranceVerified: boolean;
    portalActivationLink?: string;
    nextSteps: string[];
  }> {
    this.logger.log(`Executing complete patient registration`);

    const result = await orchestrateCompletePatientRegistration(
      demographics,
      insurance,
      appointmentRequest,
      true
    );

    return {
      mrn: result.medicalRecordNumber,
      patientId: result.patientId,
      insuranceVerified: result.insuranceVerified,
      portalActivationLink: result.portalActivationLink,
      nextSteps: result.nextSteps,
    };
  }

  @ApiOperation({ summary: 'Process patient arrival and check-in' })
  async processPatientArrival(
    appointmentId: string,
    checkInMethod: 'kiosk' | 'front_desk' | 'mobile',
    collectCopay: boolean
  ): Promise<{
    checkInId: string;
    status: string;
    copayCollected: boolean;
    copayAmount?: number;
  }> {
    this.logger.log(`Processing patient arrival for appointment ${appointmentId}`);

    const result = await orchestratePatientArrivalCheckIn(
      appointmentId,
      checkInMethod,
      collectCopay,
      true
    );

    return {
      checkInId: result.checkInId,
      status: result.status,
      copayCollected: result.copayCollected,
      copayAmount: result.copayAmount,
    };
  }

  @ApiOperation({ summary: 'Verify insurance eligibility' })
  async verifyInsuranceEligibility(
    patientId: string,
    insuranceId: string,
    serviceDate: Date
  ): Promise<{
    eligible: boolean;
    coverageStatus: string;
    estimatedPatientResponsibility: number;
    copay?: number;
  }> {
    this.logger.log(`Verifying insurance for patient ${patientId}`);

    const result = await orchestrateInsuranceVerificationWorkflow(
      patientId,
      insuranceId,
      serviceDate
    );

    return {
      eligible: result.eligibilityConfirmed,
      coverageStatus: result.coverageStatus,
      estimatedPatientResponsibility: result.estimatedPatientResponsibility,
      copay: result.copayAmount,
    };
  }
}
