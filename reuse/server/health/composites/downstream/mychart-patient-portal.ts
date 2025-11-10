/**
 * LOC: MYCHART-PORTAL-DS-017
 * File: /reuse/server/health/composites/downstream/mychart-patient-portal.ts
 *
 * UPSTREAM (imports from):
 *   - ../epic-patient-workflow-composites
 *   - @nestjs/common
 *
 * DOWNSTREAM (imported by):
 *   - MyChart web application
 *   - Patient mobile apps
 */

import { Injectable, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  orchestratePatientPortalProvisioning,
  orchestrateCommunicationPreferences,
} from '../epic-patient-workflow-composites';

@Injectable()
@ApiTags('MyChart Patient Portal')
export class MyChartPatientPortal {
  private readonly logger = new Logger(MyChartPatientPortal.name);

  @ApiOperation({ summary: 'Provision MyChart patient portal account' })
  async provisionPortalAccount(
    patientId: string,
    email: string,
    enableMFA: boolean
  ): Promise<{
    portalAccountId: string;
    username: string;
    activationLink: string;
    features: string[];
  }> {
    this.logger.log(`Provisioning MyChart account for patient ${patientId}`);

    const result = await orchestratePatientPortalProvisioning(
      patientId,
      email,
      enableMFA
    );

    return {
      portalAccountId: result.portalAccountId,
      username: result.username,
      activationLink: result.activationLink,
      features: result.features,
    };
  }

  @ApiOperation({ summary: 'Update patient communication preferences' })
  async updateCommunicationPreferences(
    patientId: string,
    preferences: {
      preferredContactMethod: 'phone' | 'email' | 'sms' | 'portal';
      emailPreferences?: any;
      smsPreferences?: any;
      portalPreferences?: any;
    }
  ): Promise<{
    updated: boolean;
    preferences: any;
  }> {
    this.logger.log(`Updating communication preferences for patient ${patientId}`);

    const result = await orchestrateCommunicationPreferences(
      patientId,
      preferences
    );

    return {
      updated: true,
      preferences: result,
    };
  }

  @ApiOperation({ summary: 'Request medical records access via portal' })
  async requestMedicalRecordsAccess(
    patientId: string,
    recordTypes: string[],
    dateRange: { startDate: Date; endDate: Date }
  ): Promise<{
    requestId: string;
    status: string;
    estimatedCompletionDate: Date;
  }> {
    this.logger.log(`Processing medical records request for patient ${patientId}`);

    const requestId = `MRR-${Date.now()}`;

    return {
      requestId,
      status: 'pending',
      estimatedCompletionDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    };
  }

  @ApiOperation({ summary: 'Schedule appointment via MyChart' })
  async scheduleAppointmentViaPortal(
    patientId: string,
    appointmentData: {
      providerId: string;
      appointmentType: string;
      preferredDate: Date;
      reason: string;
    }
  ): Promise<{
    appointmentId: string;
    scheduledDateTime: Date;
    confirmationSent: boolean;
  }> {
    this.logger.log(`Scheduling appointment via MyChart for patient ${patientId}`);

    const appointmentId = `APT-${Date.now()}`;

    return {
      appointmentId,
      scheduledDateTime: appointmentData.preferredDate,
      confirmationSent: true,
    };
  }
}
