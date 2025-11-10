/**
 * LOC: EPIC-EHR-INT-DS-011
 * File: /reuse/server/health/composites/downstream/epic-ehr-integration-services.ts
 *
 * UPSTREAM (imports from):
 *   - ../epic-clinical-workflows-composites
 *   - ../epic-patient-workflow-composites
 *   - @nestjs/common
 *
 * DOWNSTREAM (imported by):
 *   - Epic Hyperspace integrations
 *   - EHR data sync services
 */

import { Injectable, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  orchestrateClinicalEncounter,
  orchestratePatientCheckIn,
  orchestratePatientCheckOut,
} from '../epic-clinical-workflows-composites';
import {
  orchestrateCompletePatientRegistration,
} from '../epic-patient-workflow-composites';

@Injectable()
@ApiTags('Epic EHR Integration Services')
export class EpicEhrIntegrationServices {
  private readonly logger = new Logger(EpicEhrIntegrationServices.name);

  @ApiOperation({ summary: 'Sync patient registration to Epic EHR' })
  async syncPatientRegistration(
    patientData: any,
    insuranceData: any,
    userId: string
  ): Promise<{ mrn: string; epicPatientId: string; syncStatus: string }> {
    this.logger.log(`Syncing patient registration to Epic EHR`);

    const registration = await orchestrateCompletePatientRegistration(
      patientData,
      insuranceData,
      undefined,
      true
    );

    return {
      mrn: registration.medicalRecordNumber,
      epicPatientId: registration.patientId,
      syncStatus: registration.registrationStatus,
    };
  }

  @ApiOperation({ summary: 'Sync clinical encounter to Epic EHR' })
  async syncClinicalEncounter(
    patientId: string,
    appointmentId: string,
    encounterData: any,
    context: any
  ): Promise<{ encounterId: string; noteId: string; syncStatus: string }> {
    this.logger.log(`Syncing clinical encounter for patient ${patientId}`);

    const encounter = await orchestrateClinicalEncounter(
      patientId,
      appointmentId,
      encounterData,
      context
    );

    return {
      encounterId: encounter.encounterId,
      noteId: encounter.clinicalNote?.id || '',
      syncStatus: encounter.status,
    };
  }

  @ApiOperation({ summary: 'Sync patient check-in/check-out workflow' })
  async syncPatientWorkflow(
    appointmentId: string,
    workflowType: 'check-in' | 'check-out',
    data: any,
    context: any
  ): Promise<{ workflowId: string; syncStatus: string }> {
    this.logger.log(`Syncing patient ${workflowType} for appointment ${appointmentId}`);

    if (workflowType === 'check-in') {
      const checkIn = await orchestratePatientCheckIn(
        data.patientId,
        appointmentId,
        data,
        context
      );
      return { workflowId: checkIn.id!, syncStatus: 'completed' };
    } else {
      const checkOut = await orchestratePatientCheckOut(
        data.patientId,
        appointmentId,
        data,
        context
      );
      return { workflowId: checkOut.id, syncStatus: 'completed' };
    }
  }
}
