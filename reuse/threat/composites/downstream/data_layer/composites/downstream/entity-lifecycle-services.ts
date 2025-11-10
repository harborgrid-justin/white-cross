/**
 * LOC: LIFECYCLE001
 * File: entity-lifecycle-services.ts
 * Purpose: Entity lifecycle management, state transitions, and business workflows
 */

import { Injectable, Logger } from "@nestjs/common";
import { EntityManagementService } from "../entity-management-kit";

export enum EntityLifecycleState {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  ARCHIVED = "ARCHIVED",
  DELETED = "DELETED",
}

export interface ILifecycleTransition {
  from: EntityLifecycleState;
  to: EntityLifecycleState;
  validator?: (entity: any) => Promise<boolean>;
  onTransition?: (entity: any) => Promise<void>;
  requiresApproval: boolean;
}

export interface ILifecycleDefinition {
  entityType: string;
  states: EntityLifecycleState[];
  transitions: ILifecycleTransition[];
  defaultState: EntityLifecycleState;
}

@Injectable()
export class EntityLifecycleService {
  private readonly logger = new Logger(EntityLifecycleService.name);
  private readonly lifecycles: Map<string, ILifecycleDefinition> = new Map();

  constructor(private readonly entityService: EntityManagementService) {
    this.registerDefaultLifecycles();
  }

  registerLifecycle(definition: ILifecycleDefinition): void {
    this.logger.log(`Registering lifecycle for ${definition.entityType}`);
    this.lifecycles.set(definition.entityType, definition);
  }

  async transitionEntity(
    entityType: string,
    entityId: string,
    toState: EntityLifecycleState,
    context?: any
  ): Promise<{ success: boolean; newState: EntityLifecycleState; error?: string }> {
    const lifecycle = this.lifecycles.get(entityType);
    
    if (!lifecycle) {
      return { success: false, newState: EntityLifecycleState.DRAFT, error: "Lifecycle not found" };
    }

    // Get current entity state
    const entity = await this.entityService.getEntityState(entityType, entityId);
    const currentState = entity.state as EntityLifecycleState;

    // Find valid transition
    const transition = lifecycle.transitions.find(t => t.from === currentState && t.to === toState);
    
    if (!transition) {
      return { success: false, newState: currentState, error: `Invalid transition: ${currentState} -> ${toState}` };
    }

    // Validate transition
    if (transition.validator) {
      const isValid = await transition.validator(entity);
      if (!isValid) {
        return { success: false, newState: currentState, error: "Transition validation failed" };
      }
    }

    // Execute transition
    try {
      await this.entityService.transitionEntityState(entityType, entityId, toState, context);
      
      if (transition.onTransition) {
        await transition.onTransition(entity);
      }

      this.logger.log(`Entity ${entityType}:${entityId} transitioned ${currentState} -> ${toState}`);
      return { success: true, newState: toState };
    } catch (error) {
      return { success: false, newState: currentState, error: error.message };
    }
  }

  getAvailableTransitions(entityType: string, currentState: EntityLifecycleState): EntityLifecycleState[] {
    const lifecycle = this.lifecycles.get(entityType);
    if (!lifecycle) return [];

    return lifecycle.transitions
      .filter(t => t.from === currentState)
      .map(t => t.to);
  }

  async getEntityHistory(entityType: string, entityId: string): Promise<Array<{
    state: EntityLifecycleState;
    timestamp: Date;
    user?: string;
    context?: any;
  }>> {
    return this.entityService.getEntityHistory(entityType, entityId);
  }

  private registerDefaultLifecycles(): void {
    // Threat Intelligence Lifecycle
    this.registerLifecycle({
      entityType: "ThreatIntelligence",
      states: [
        EntityLifecycleState.DRAFT,
        EntityLifecycleState.ACTIVE,
        EntityLifecycleState.ARCHIVED,
      ],
      transitions: [
        { from: EntityLifecycleState.DRAFT, to: EntityLifecycleState.ACTIVE, requiresApproval: true },
        { from: EntityLifecycleState.ACTIVE, to: EntityLifecycleState.ARCHIVED, requiresApproval: false },
      ],
      defaultState: EntityLifecycleState.DRAFT,
    });

    // Incident Lifecycle
    this.registerLifecycle({
      entityType: "Incident",
      states: [
        EntityLifecycleState.DRAFT,
        EntityLifecycleState.ACTIVE,
        EntityLifecycleState.SUSPENDED,
        EntityLifecycleState.ARCHIVED,
      ],
      transitions: [
        { from: EntityLifecycleState.DRAFT, to: EntityLifecycleState.ACTIVE, requiresApproval: false },
        { from: EntityLifecycleState.ACTIVE, to: EntityLifecycleState.SUSPENDED, requiresApproval: true },
        { from: EntityLifecycleState.SUSPENDED, to: EntityLifecycleState.ACTIVE, requiresApproval: true },
        { from: EntityLifecycleState.ACTIVE, to: EntityLifecycleState.ARCHIVED, requiresApproval: false },
      ],
      defaultState: EntityLifecycleState.DRAFT,
    });
  }
}

export { EntityLifecycleService };
