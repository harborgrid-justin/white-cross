/**
 * File: /reuse/construction/types/index.ts
 * Purpose: Construction domain-specific type definitions
 *
 * This module exports common types and interfaces specific to the construction
 * management domain. These types are shared across construction kits.
 *
 * @module Construction/Types
 * @version 1.0.0
 */
import { BaseEntity, CommonStatus } from '../../domain-shared';
/**
 * Construction project phases
 */
export declare enum ConstructionPhase {
    PRE_PLANNING = "pre_planning",
    PLANNING = "planning",
    DESIGN = "design",
    PROCUREMENT = "procurement",
    PRE_CONSTRUCTION = "pre_construction",
    CONSTRUCTION = "construction",
    COMMISSIONING = "commissioning",
    CLOSEOUT = "closeout",
    WARRANTY = "warranty"
}
/**
 * Construction project delivery methods
 */
export declare enum DeliveryMethod {
    DESIGN_BID_BUILD = "design_bid_build",
    DESIGN_BUILD = "design_build",
    CONSTRUCTION_MANAGER_AT_RISK = "cm_at_risk",
    INTEGRATED_PROJECT_DELIVERY = "ipd",
    PUBLIC_PRIVATE_PARTNERSHIP = "ppp"
}
/**
 * Contract types in construction
 */
export declare enum ContractType {
    LUMP_SUM = "lump_sum",
    COST_PLUS_FEE = "cost_plus_fee",
    GUARANTEED_MAXIMUM_PRICE = "gmp",
    UNIT_PRICE = "unit_price",
    TIME_AND_MATERIALS = "time_and_materials"
}
/**
 * Construction entity types
 */
export declare enum ConstructionEntityType {
    OWNER = "owner",
    GENERAL_CONTRACTOR = "general_contractor",
    SUBCONTRACTOR = "subcontractor",
    ARCHITECT = "architect",
    ENGINEER = "engineer",
    CONSULTANT = "consultant",
    VENDOR = "vendor",
    INSPECTOR = "inspector"
}
/**
 * Document types in construction
 */
export declare enum ConstructionDocumentType {
    DRAWING = "drawing",
    SPECIFICATION = "specification",
    CONTRACT = "contract",
    CHANGE_ORDER = "change_order",
    RFI = "rfi",
    SUBMITTAL = "submittal",
    TRANSMITTAL = "transmittal",
    REPORT = "report",
    PHOTO = "photo",
    WARRANTY = "warranty"
}
/**
 * Safety incident severity
 */
export declare enum IncidentSeverity {
    NEAR_MISS = "near_miss",
    FIRST_AID = "first_aid",
    MEDICAL_TREATMENT = "medical_treatment",
    LOST_TIME = "lost_time",
    FATALITY = "fatality"
}
/**
 * Quality control inspection status
 */
export declare enum InspectionStatus {
    SCHEDULED = "scheduled",
    IN_PROGRESS = "in_progress",
    PASSED = "passed",
    FAILED = "failed",
    CONDITIONAL_PASS = "conditional_pass",
    REINSPECTION_REQUIRED = "reinspection_required"
}
/**
 * Base construction entity interface
 */
export interface ConstructionEntity extends BaseEntity {
    projectId: string;
    entityType: ConstructionEntityType;
}
/**
 * Construction cost breakdown
 */
export interface CostBreakdown {
    labor: number;
    materials: number;
    equipment: number;
    overhead: number;
    profit: number;
    total: number;
}
/**
 * Schedule milestone
 */
export interface Milestone {
    id: string;
    name: string;
    description?: string;
    targetDate: Date;
    actualDate?: Date;
    status: CommonStatus;
    criticalPath: boolean;
}
//# sourceMappingURL=index.d.ts.map