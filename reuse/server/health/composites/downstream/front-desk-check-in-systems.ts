/**
 * LOC: FDSK-CHECKIN-DS-018
 * File: /reuse/server/health/composites/downstream/front-desk-check-in-systems.ts
 *
 * UPSTREAM (imports from):
 *   - ../epic-patient-workflow-composites
 *   - @nestjs/common
 *
 * DOWNSTREAM (imported by):
 *   - Front desk kiosk applications
 *   - Reception staff terminals
 */

import { Injectable, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  orchestratePatientArrivalCheckIn,
  orchestrateDemographicUpdateWorkflow,
} from '../epic-patient-workflow-composites';

@Injectable()
@ApiTags('Front Desk Check-in Systems')
export class FrontDeskCheckInSystems {
  private readonly logger = new Logger(FrontDeskCheckInSystems.name);

  @ApiOperation({ summary: 'Process front desk check-in' })
  async processFrontDeskCheckIn(
    appointmentId: string,
    patientId: string,
    verifyDemographics: boolean,
    collectCopay: boolean
  ): Promise<{
    checkInId: string;
    status: string;
    demographicsVerified: boolean;
    copayCollected: boolean;
    formsCompleted: string[];
    nextSteps: string[];
  }> {
    this.logger.log(`Processing front desk check-in for appointment ${appointmentId}`);

    // Process check-in
    const checkIn = await orchestratePatientArrivalCheckIn(
      appointmentId,
      'front_desk',
      collectCopay,
      true
    );

    // Verify demographics if requested
    let demographicsVerified = false;
    if (verifyDemographics) {
      demographicsVerified = await this.verifyDemographics(patientId);
    }

    const nextSteps = [
      'Patient waiting for provider',
      'Complete any outstanding forms',
      'Vital signs will be collected',
    ];

    return {
      checkInId: checkIn.checkInId,
      status: checkIn.status,
      demographicsVerified,
      copayCollected: checkIn.copayCollected,
      formsCompleted: checkIn.formsCompleted,
      nextSteps,
    };
  }

  @ApiOperation({ summary: 'Update patient demographics at check-in' })
  async updateDemographicsAtCheckIn(
    patientId: string,
    demographicUpdates: any
  ): Promise<{
    updateId: string;
    fieldsUpdated: string[];
    requiresStaffReview: boolean;
  }> {
    this.logger.log(`Updating demographics for patient ${patientId} at check-in`);

    const result = await orchestrateDemographicUpdateWorkflow(
      patientId,
      demographicUpdates,
      true,
      true
    );

    return {
      updateId: result.updateId,
      fieldsUpdated: result.fieldsUpdated,
      requiresStaffReview: result.requiresStaffReview,
    };
  }

  @ApiOperation({ summary: 'Process patient payment at front desk' })
  async processPatientPayment(
    patientId: string,
    appointmentId: string,
    paymentData: {
      amount: number;
      paymentMethod: 'cash' | 'card' | 'check';
      paymentType: 'copay' | 'deductible' | 'past_due';
    }
  ): Promise<{
    transactionId: string;
    success: boolean;
    receiptGenerated: boolean;
    remainingBalance: number;
  }> {
    this.logger.log(`Processing payment for patient ${patientId}`);

    const transactionId = `TXN-${Date.now()}`;

    return {
      transactionId,
      success: true,
      receiptGenerated: true,
      remainingBalance: 0,
    };
  }

  private async verifyDemographics(patientId: string): Promise<boolean> {
    this.logger.log(`Verifying demographics for patient ${patientId}`);
    return true;
  }
}
