/**
 * LOC: CLIN-WF-ORCH-DS-012
 * File: /reuse/server/health/composites/downstream/clinical-workflow-orchestration-services.ts
 *
 * UPSTREAM (imports from):
 *   - ../epic-clinical-workflows-composites
 *   - @nestjs/common
 *
 * DOWNSTREAM (imported by):
 *   - Workflow automation engines
 *   - Clinical task management
 */

import { Injectable, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  orchestrateWorkflowAutomation,
  orchestrateClinicalPathwayEnforcement,
  orchestrateClinicalRiskAssessment,
  orchestrateBatchClinicalWorkflow,
} from '../epic-clinical-workflows-composites';

@Injectable()
@ApiTags('Clinical Workflow Orchestration')
export class ClinicalWorkflowOrchestrationServices {
  private readonly logger = new Logger(ClinicalWorkflowOrchestrationServices.name);

  @ApiOperation({ summary: 'Automate clinical workflow triggers' })
  async automateWorkflowTriggers(
    triggerEvent: {
      eventType: string;
      eventData: any;
      ruleId: string;
    },
    patientId: string,
    context: any
  ): Promise<{ triggered: boolean; actionsExecuted: string[]; tasksCreated: number }> {
    this.logger.log(`Automating workflow for event ${triggerEvent.eventType}`);

    const automation = await orchestrateWorkflowAutomation(
      triggerEvent,
      patientId,
      context
    );

    return {
      triggered: automation.triggered,
      actionsExecuted: automation.actionsExecuted,
      tasksCreated: automation.tasksCreated.length,
    };
  }

  @ApiOperation({ summary: 'Enforce clinical pathway compliance' })
  async enforceClinicalPathway(
    patientId: string,
    pathwayId: string,
    context: any
  ): Promise<{ compliant: boolean; nextSteps: any[]; completionPercentage: number }> {
    this.logger.log(`Enforcing clinical pathway ${pathwayId} for patient ${patientId}`);

    const pathway = await orchestrateClinicalPathwayEnforcement(
      patientId,
      pathwayId,
      context
    );

    return {
      compliant: pathway.compliant,
      nextSteps: pathway.nextSteps,
      completionPercentage: (pathway.completedSteps / pathway.totalSteps) * 100,
    };
  }

  @ApiOperation({ summary: 'Execute batch workflow processing' })
  async executeBatchWorkflow(
    patientIds: string[],
    workflowType: 'vitals' | 'tasks' | 'alerts',
    workflowData: any,
    context: any
  ): Promise<{ successCount: number; failureCount: number; successRate: number }> {
    this.logger.log(`Executing batch ${workflowType} workflow for ${patientIds.length} patients`);

    const result = await orchestrateBatchClinicalWorkflow(
      patientIds,
      workflowType,
      workflowData,
      context
    );

    return {
      successCount: result.successfulPatients.length,
      failureCount: result.failedPatients.length,
      successRate: result.summary.successRate,
    };
  }
}
