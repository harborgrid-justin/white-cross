/**
 * This file centralizes the type definitions, enums, and interfaces
 * for the Construction Project domain, ensuring consistency and reusability.
 */
export declare enum ConstructionProjectStatus {
    PRE_PLANNING = "pre_planning",
    PLANNING = "planning",
    DESIGN = "design",
    PRE_CONSTRUCTION = "pre_construction",
    CONSTRUCTION = "construction",
    CLOSEOUT = "closeout",
    COMPLETED = "completed",
    ON_HOLD = "on_hold",
    CANCELLED = "cancelled"
}
export declare enum ProjectPhase {
    INITIATION = "initiation",
    PLANNING = "planning",
    DESIGN = "design",
    PROCUREMENT = "procurement",
    CONSTRUCTION = "construction",
    COMMISSIONING = "commissioning",
    CLOSEOUT = "closeout",
    OPERATIONS = "operations"
}
export declare enum ProjectPriority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
export declare enum DeliveryMethod {
    DESIGN_BID_BUILD = "design_bid_build",
    DESIGN_BUILD = "design_build",
    CM_AT_RISK = "cm_at_risk",
    IPD = "ipd",// Integrated Project Delivery
    PUBLIC_PRIVATE = "public_private"
}
/**
 * Represents the key performance indicators for a project based on
 * Earned Value Management (EVM).
 */
export interface ProjectPerformanceMetrics {
    projectId: string;
    schedulePerformanceIndex: number;
    costPerformanceIndex: number;
    scheduleVariance: number;
    costVariance: number;
    estimateAtCompletion: number;
    estimateToComplete: number;
    varianceAtCompletion: number;
    toCompletePerformanceIndex: number;
    earnedValue: number;
    plannedValue: number;
    actualCost: number;
    budgetAtCompletion: number;
}
//# sourceMappingURL=project.types.d.ts.map