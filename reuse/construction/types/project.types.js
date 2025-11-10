"use strict";
/**
 * This file centralizes the type definitions, enums, and interfaces
 * for the Construction Project domain, ensuring consistency and reusability.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryMethod = exports.ProjectPriority = exports.ProjectPhase = exports.ConstructionProjectStatus = void 0;
// ============================================================================
// ENUMS
// ============================================================================
var ConstructionProjectStatus;
(function (ConstructionProjectStatus) {
    ConstructionProjectStatus["PRE_PLANNING"] = "pre_planning";
    ConstructionProjectStatus["PLANNING"] = "planning";
    ConstructionProjectStatus["DESIGN"] = "design";
    ConstructionProjectStatus["PRE_CONSTRUCTION"] = "pre_construction";
    ConstructionProjectStatus["CONSTRUCTION"] = "construction";
    ConstructionProjectStatus["CLOSEOUT"] = "closeout";
    ConstructionProjectStatus["COMPLETED"] = "completed";
    ConstructionProjectStatus["ON_HOLD"] = "on_hold";
    ConstructionProjectStatus["CANCELLED"] = "cancelled";
})(ConstructionProjectStatus || (exports.ConstructionProjectStatus = ConstructionProjectStatus = {}));
var ProjectPhase;
(function (ProjectPhase) {
    ProjectPhase["INITIATION"] = "initiation";
    ProjectPhase["PLANNING"] = "planning";
    ProjectPhase["DESIGN"] = "design";
    ProjectPhase["PROCUREMENT"] = "procurement";
    ProjectPhase["CONSTRUCTION"] = "construction";
    ProjectPhase["COMMISSIONING"] = "commissioning";
    ProjectPhase["CLOSEOUT"] = "closeout";
    ProjectPhase["OPERATIONS"] = "operations";
})(ProjectPhase || (exports.ProjectPhase = ProjectPhase = {}));
var ProjectPriority;
(function (ProjectPriority) {
    ProjectPriority["CRITICAL"] = "critical";
    ProjectPriority["HIGH"] = "high";
    ProjectPriority["MEDIUM"] = "medium";
    ProjectPriority["LOW"] = "low";
})(ProjectPriority || (exports.ProjectPriority = ProjectPriority = {}));
var DeliveryMethod;
(function (DeliveryMethod) {
    DeliveryMethod["DESIGN_BID_BUILD"] = "design_bid_build";
    DeliveryMethod["DESIGN_BUILD"] = "design_build";
    DeliveryMethod["CM_AT_RISK"] = "cm_at_risk";
    DeliveryMethod["IPD"] = "ipd";
    DeliveryMethod["PUBLIC_PRIVATE"] = "public_private";
})(DeliveryMethod || (exports.DeliveryMethod = DeliveryMethod = {}));
//# sourceMappingURL=project.types.js.map