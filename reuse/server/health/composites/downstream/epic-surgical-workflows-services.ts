/**
 * LOC: EPIC-SURG-WF-DS-020
 * File: /reuse/server/health/composites/downstream/epic-surgical-workflows-services.ts
 *
 * UPSTREAM (imports from):
 *   - ../epic-clinical-workflows-composites
 *   - @nestjs/common
 *
 * DOWNSTREAM (imported by):
 *   - OR management systems
 *   - Surgical scheduling
 */

import { Injectable, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  orchestrateLabOrderEntryWithTracking,
  orchestratePrescriptionOrderingWithSafety,
} from '../epic-clinical-workflows-composites';

@Injectable()
@ApiTags('Epic Surgical Workflows Services')
export class EpicSurgicalWorkflowsServices {
  private readonly logger = new Logger(EpicSurgicalWorkflowsServices.name);

  @ApiOperation({ summary: 'Schedule surgical procedure' })
  async scheduleSurgicalProcedure(
    patientId: string,
    procedureData: {
      procedureCode: string;
      procedureName: string;
      surgeonId: string;
      anesthesiologistId?: string;
      preferredDate: Date;
      estimatedDuration: number;
      requiredEquipment: string[];
    }
  ): Promise<{
    surgeryId: string;
    scheduledDateTime: Date;
    orRoom: string;
    preOpInstructions: string[];
  }> {
    this.logger.log(`Scheduling surgical procedure for patient ${patientId}`);

    const surgeryId = `SURG-${Date.now()}`;

    return {
      surgeryId,
      scheduledDateTime: procedureData.preferredDate,
      orRoom: 'OR-3',
      preOpInstructions: [
        'NPO after midnight',
        'Stop anticoagulants 5 days prior',
        'Pre-op labs required',
        'Arrive 2 hours before surgery',
      ],
    };
  }

  @ApiOperation({ summary: 'Manage pre-operative workflow' })
  async managePreOperativeWorkflow(
    patientId: string,
    surgeryId: string,
    preOpData: {
      labsOrdered: boolean;
      imagingOrdered: boolean;
      anesthesiaConsultCompleted: boolean;
      consentsObtained: boolean;
    }
  ): Promise<{
    workflowId: string;
    preOpStatus: 'incomplete' | 'ready' | 'cleared';
    outstandingTasks: string[];
  }> {
    this.logger.log(`Managing pre-operative workflow for surgery ${surgeryId}`);

    const outstandingTasks: string[] = [];

    if (!preOpData.labsOrdered) outstandingTasks.push('Order pre-op labs');
    if (!preOpData.imagingOrdered) outstandingTasks.push('Order pre-op imaging');
    if (!preOpData.anesthesiaConsultCompleted) outstandingTasks.push('Complete anesthesia consult');
    if (!preOpData.consentsObtained) outstandingTasks.push('Obtain surgical consents');

    const preOpStatus = outstandingTasks.length === 0 ? 'cleared' : 'incomplete';

    return {
      workflowId: `PREOP-${Date.now()}`,
      preOpStatus,
      outstandingTasks,
    };
  }

  @ApiOperation({ summary: 'Manage intra-operative documentation' })
  async manageIntraOperativeDocumentation(
    surgeryId: string,
    intraOpData: {
      startTime: Date;
      endTime?: Date;
      procedure: string;
      complications?: string[];
      bloodLoss?: number;
      specimens?: string[];
      implantDevices?: string[];
    }
  ): Promise<{
    operativeReportId: string;
    status: 'in_progress' | 'completed';
    billable: boolean;
  }> {
    this.logger.log(`Managing intra-operative documentation for surgery ${surgeryId}`);

    const operativeReportId = `OR-RPT-${Date.now()}`;

    return {
      operativeReportId,
      status: intraOpData.endTime ? 'completed' : 'in_progress',
      billable: true,
    };
  }

  @ApiOperation({ summary: 'Manage post-operative recovery workflow' })
  async managePostOperativeRecovery(
    patientId: string,
    surgeryId: string,
    postOpData: {
      recoveryPhase: 'pacu' | 'floor' | 'icu' | 'discharged';
      vitalSignsStable: boolean;
      painManaged: boolean;
      postOpOrdersCompleted: boolean;
    }
  ): Promise<{
    recoveryWorkflowId: string;
    phase: string;
    readyForDischarge: boolean;
      dischargeInstructions?: string[];
  }> {
    this.logger.log(`Managing post-operative recovery for surgery ${surgeryId}`);

    const readyForDischarge =
      postOpData.recoveryPhase === 'floor' &&
      postOpData.vitalSignsStable &&
      postOpData.painManaged &&
      postOpData.postOpOrdersCompleted;

    const dischargeInstructions = readyForDischarge
      ? [
          'Take pain medications as prescribed',
          'Keep wound clean and dry',
          'Follow-up appointment in 2 weeks',
          'Call if fever >101F or increased pain',
        ]
      : undefined;

    return {
      recoveryWorkflowId: `POSTOP-${Date.now()}`,
      phase: postOpData.recoveryPhase,
      readyForDischarge,
      dischargeInstructions,
    };
  }

  @ApiOperation({ summary: 'Track surgical case metrics' })
  async trackSurgicalCaseMetrics(
    surgeryId: string
  ): Promise<{
    caseMetrics: {
      scheduledStartTime: Date;
      actualStartTime: Date;
      scheduledEndTime: Date;
      actualEndTime: Date;
      turnoverTime: number;
      onTimeStart: boolean;
    };
    utilizationMetrics: {
      orUtilization: number;
      staffUtilization: number;
    };
  }> {
    this.logger.log(`Tracking metrics for surgery ${surgeryId}`);

    return {
      caseMetrics: {
        scheduledStartTime: new Date(),
        actualStartTime: new Date(),
        scheduledEndTime: new Date(),
        actualEndTime: new Date(),
        turnoverTime: 45,
        onTimeStart: true,
      },
      utilizationMetrics: {
        orUtilization: 85,
        staffUtilization: 92,
      },
    };
  }
}
