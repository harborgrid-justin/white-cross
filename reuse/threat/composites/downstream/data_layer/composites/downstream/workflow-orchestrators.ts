/**
 * LOC: WORKFLOW001
 * Purpose: Workflow orchestration and state machines
 */
import { Injectable } from "@nestjs/common";
import { EntityManagementService } from "../entity-management-kit";

@Injectable()
export class WorkflowOrchestratorService {
  constructor(private readonly entityService: EntityManagementService) {}
  
  async executeWorkflow(workflowId: string, context: any): Promise<any> {
    return this.entityService.transitionEntityState("Workflow", workflowId, "executing", context);
  }
}

export { WorkflowOrchestratorService };
