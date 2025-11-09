"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InspectionStatus = exports.IncidentSeverity = exports.ConstructionDocumentType = exports.ConstructionEntityType = exports.ContractType = exports.DeliveryMethod = exports.ConstructionPhase = void 0;
/**
 * Construction project phases
 */
var ConstructionPhase;
(function (ConstructionPhase) {
    ConstructionPhase["PRE_PLANNING"] = "pre_planning";
    ConstructionPhase["PLANNING"] = "planning";
    ConstructionPhase["DESIGN"] = "design";
    ConstructionPhase["PROCUREMENT"] = "procurement";
    ConstructionPhase["PRE_CONSTRUCTION"] = "pre_construction";
    ConstructionPhase["CONSTRUCTION"] = "construction";
    ConstructionPhase["COMMISSIONING"] = "commissioning";
    ConstructionPhase["CLOSEOUT"] = "closeout";
    ConstructionPhase["WARRANTY"] = "warranty";
})(ConstructionPhase || (exports.ConstructionPhase = ConstructionPhase = {}));
/**
 * Construction project delivery methods
 */
var DeliveryMethod;
(function (DeliveryMethod) {
    DeliveryMethod["DESIGN_BID_BUILD"] = "design_bid_build";
    DeliveryMethod["DESIGN_BUILD"] = "design_build";
    DeliveryMethod["CONSTRUCTION_MANAGER_AT_RISK"] = "cm_at_risk";
    DeliveryMethod["INTEGRATED_PROJECT_DELIVERY"] = "ipd";
    DeliveryMethod["PUBLIC_PRIVATE_PARTNERSHIP"] = "ppp";
})(DeliveryMethod || (exports.DeliveryMethod = DeliveryMethod = {}));
/**
 * Contract types in construction
 */
var ContractType;
(function (ContractType) {
    ContractType["LUMP_SUM"] = "lump_sum";
    ContractType["COST_PLUS_FEE"] = "cost_plus_fee";
    ContractType["GUARANTEED_MAXIMUM_PRICE"] = "gmp";
    ContractType["UNIT_PRICE"] = "unit_price";
    ContractType["TIME_AND_MATERIALS"] = "time_and_materials";
})(ContractType || (exports.ContractType = ContractType = {}));
/**
 * Construction entity types
 */
var ConstructionEntityType;
(function (ConstructionEntityType) {
    ConstructionEntityType["OWNER"] = "owner";
    ConstructionEntityType["GENERAL_CONTRACTOR"] = "general_contractor";
    ConstructionEntityType["SUBCONTRACTOR"] = "subcontractor";
    ConstructionEntityType["ARCHITECT"] = "architect";
    ConstructionEntityType["ENGINEER"] = "engineer";
    ConstructionEntityType["CONSULTANT"] = "consultant";
    ConstructionEntityType["VENDOR"] = "vendor";
    ConstructionEntityType["INSPECTOR"] = "inspector";
})(ConstructionEntityType || (exports.ConstructionEntityType = ConstructionEntityType = {}));
/**
 * Document types in construction
 */
var ConstructionDocumentType;
(function (ConstructionDocumentType) {
    ConstructionDocumentType["DRAWING"] = "drawing";
    ConstructionDocumentType["SPECIFICATION"] = "specification";
    ConstructionDocumentType["CONTRACT"] = "contract";
    ConstructionDocumentType["CHANGE_ORDER"] = "change_order";
    ConstructionDocumentType["RFI"] = "rfi";
    ConstructionDocumentType["SUBMITTAL"] = "submittal";
    ConstructionDocumentType["TRANSMITTAL"] = "transmittal";
    ConstructionDocumentType["REPORT"] = "report";
    ConstructionDocumentType["PHOTO"] = "photo";
    ConstructionDocumentType["WARRANTY"] = "warranty";
})(ConstructionDocumentType || (exports.ConstructionDocumentType = ConstructionDocumentType = {}));
/**
 * Safety incident severity
 */
var IncidentSeverity;
(function (IncidentSeverity) {
    IncidentSeverity["NEAR_MISS"] = "near_miss";
    IncidentSeverity["FIRST_AID"] = "first_aid";
    IncidentSeverity["MEDICAL_TREATMENT"] = "medical_treatment";
    IncidentSeverity["LOST_TIME"] = "lost_time";
    IncidentSeverity["FATALITY"] = "fatality";
})(IncidentSeverity || (exports.IncidentSeverity = IncidentSeverity = {}));
/**
 * Quality control inspection status
 */
var InspectionStatus;
(function (InspectionStatus) {
    InspectionStatus["SCHEDULED"] = "scheduled";
    InspectionStatus["IN_PROGRESS"] = "in_progress";
    InspectionStatus["PASSED"] = "passed";
    InspectionStatus["FAILED"] = "failed";
    InspectionStatus["CONDITIONAL_PASS"] = "conditional_pass";
    InspectionStatus["REINSPECTION_REQUIRED"] = "reinspection_required";
})(InspectionStatus || (exports.InspectionStatus = InspectionStatus = {}));
//# sourceMappingURL=index.js.map