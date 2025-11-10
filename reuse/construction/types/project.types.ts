
/**
 * This file centralizes the type definitions, enums, and interfaces
 * for the Construction Project domain, ensuring consistency and reusability.
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum ConstructionProjectStatus {
  PRE_PLANNING = 'pre_planning',
  PLANNING = 'planning',
  DESIGN = 'design',
  PRE_CONSTRUCTION = 'pre_construction',
  CONSTRUCTION = 'construction',
  CLOSEOUT = 'closeout',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  CANCELLED = 'cancelled',
}

export enum ProjectPhase {
  INITIATION = 'initiation',
  PLANNING = 'planning',
  DESIGN = 'design',
  PROCUREMENT = 'procurement',
  CONSTRUCTION = 'construction',
  COMMISSIONING = 'commissioning',
  CLOSEOUT = 'closeout',
  OPERATIONS = 'operations',
}

export enum ProjectPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum DeliveryMethod {
  DESIGN_BID_BUILD = 'design_bid_build',
  DESIGN_BUILD = 'design_build',
  CM_AT_RISK = 'cm_at_risk',
  IPD = 'ipd', // Integrated Project Delivery
  PUBLIC_PRIVATE = 'public_private',
}

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Represents the key performance indicators for a project based on
 * Earned Value Management (EVM).
 */
export interface ProjectPerformanceMetrics {
  projectId: string;
  schedulePerformanceIndex: number; // SPI = EV / PV
  costPerformanceIndex: number;     // CPI = EV / AC
  scheduleVariance: number;         // SV = EV - PV
  costVariance: number;             // CV = EV - AC
  estimateAtCompletion: number;     // EAC = BAC / CPI
  estimateToComplete: number;       // ETC = EAC - AC
  varianceAtCompletion: number;     // VAC = BAC - EAC
  toCompletePerformanceIndex: number; // TCPI = (BAC - EV) / (EAC - AC)
  earnedValue: number;              // EV
  plannedValue: number;             // PV
  actualCost: number;               // AC
  budgetAtCompletion: number;       // BAC (Total Budget)
}
