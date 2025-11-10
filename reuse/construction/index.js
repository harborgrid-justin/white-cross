"use strict";
/**
 * File: /reuse/construction/index.ts
 * Purpose: Main export for the Construction Domain.
 *
 * This file exports the primary NestJS module for the construction domain,
 * which encapsulates all related services, controllers, and models.
 * It also exports shared types and interfaces for use in other domains.
 *
 * @module Construction
 * @version 2.0.0
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstructionSite = exports.ResourceAssignment = exports.ActivityRelationship = exports.ScheduleActivity = exports.SafetyInspection = exports.SafetyIncident = exports.SafetyPlan = exports.QualityDeficiency = exports.QualityInspection = exports.QualityPlan = exports.MaterialTransaction = exports.MaterialRequisition = exports.ConstructionMaterial = exports.ConstructionWorker = exports.Timesheet = exports.LaborPlan = exports.InspectionChecklistItem = exports.InspectionDeficiency = exports.ConstructionInspection = exports.EquipmentAllocation = exports.EquipmentMaintenanceRecord = exports.ConstructionEquipment = exports.DocumentDistribution = exports.DocumentRevision = exports.ConstructionDocument = exports.CostChangeOrder = exports.CostTracking = exports.CostEstimate = exports.ContractMilestone = exports.ContractAmendment = exports.PaymentApplication = exports.ConstructionContract = exports.ChangeRequest = exports.VendorPrequalification = exports.BidSubmission = exports.BidSolicitation = exports.ChangeOrder = exports.ProjectBaseline = exports.ConstructionProject = exports.UpdateCloseoutDocumentDto = exports.CreateCloseoutDocumentDto = exports.UpdatePunchListItemDto = exports.CreatePunchListItemDto = exports.UpdateConstructionCloseoutDto = exports.CreateConstructionCloseoutDto = exports.CreateChangeOrderDto = exports.CreateBaselineDto = exports.UpdateProjectProgressDto = exports.CreateConstructionProjectDto = exports.ConstructionModule = void 0;
exports.WarrantyClaim = exports.ConstructionWarranty = exports.SubmittalWorkflow = exports.SubmittalReview = exports.ConstructionSubmittal = exports.SiteSafetyIncident = exports.DailySiteLog = void 0;
// ============================================================================
// PRIMARY DOMAIN MODULE
// ============================================================================
var construction_module_1 = require("./construction.module");
Object.defineProperty(exports, "ConstructionModule", { enumerable: true, get: function () { return construction_module_1.ConstructionModule; } });
// ============================================================================
// SHARED DOMAIN TYPES
// ============================================================================
__exportStar(require("./types/project.types"), exports);
__exportStar(require("./types/bid.types"), exports);
__exportStar(require("./types/change-order.types"), exports);
__exportStar(require("./types/closeout.types"), exports);
__exportStar(require("./types/contract.types"), exports);
__exportStar(require("./types/cost.types"), exports);
__exportStar(require("./types/document.types"), exports);
__exportStar(require("./types/equipment.types"), exports);
__exportStar(require("./types/inspection.types"), exports);
__exportStar(require("./types/labor.types"), exports);
__exportStar(require("./types/material.types"), exports);
__exportStar(require("./types/quality.types"), exports);
__exportStar(require("./types/safety.types"), exports);
__exportStar(require("./types/schedule.types"), exports);
__exportStar(require("./types/site.types"), exports);
__exportStar(require("./types/submittal.types"), exports);
__exportStar(require("./types/warranty.types"), exports);
// ============================================================================
// DTOs (Data Transfer Objects)
// Exporting DTOs can be useful for client-side implementations or for
// other services that need to communicate with this module.
// ============================================================================
var create_project_dto_1 = require("./dto/create-project.dto");
Object.defineProperty(exports, "CreateConstructionProjectDto", { enumerable: true, get: function () { return create_project_dto_1.CreateConstructionProjectDto; } });
var update_project_dto_1 = require("./dto/update-project.dto");
Object.defineProperty(exports, "UpdateProjectProgressDto", { enumerable: true, get: function () { return update_project_dto_1.UpdateProjectProgressDto; } });
var create_baseline_dto_1 = require("./dto/create-baseline.dto");
Object.defineProperty(exports, "CreateBaselineDto", { enumerable: true, get: function () { return create_baseline_dto_1.CreateBaselineDto; } });
var create_change_order_dto_1 = require("./dto/create-change-order.dto");
Object.defineProperty(exports, "CreateChangeOrderDto", { enumerable: true, get: function () { return create_change_order_dto_1.CreateChangeOrderDto; } });
var create_construction_closeout_dto_1 = require("./dto/create-construction-closeout.dto");
Object.defineProperty(exports, "CreateConstructionCloseoutDto", { enumerable: true, get: function () { return create_construction_closeout_dto_1.CreateConstructionCloseoutDto; } });
var update_construction_closeout_dto_1 = require("./dto/update-construction-closeout.dto");
Object.defineProperty(exports, "UpdateConstructionCloseoutDto", { enumerable: true, get: function () { return update_construction_closeout_dto_1.UpdateConstructionCloseoutDto; } });
var create_punch_list_item_dto_1 = require("./dto/create-punch-list-item.dto");
Object.defineProperty(exports, "CreatePunchListItemDto", { enumerable: true, get: function () { return create_punch_list_item_dto_1.CreatePunchListItemDto; } });
var update_punch_list_item_dto_1 = require("./dto/update-punch-list-item.dto");
Object.defineProperty(exports, "UpdatePunchListItemDto", { enumerable: true, get: function () { return update_punch_list_item_dto_1.UpdatePunchListItemDto; } });
var create_closeout_document_dto_1 = require("./dto/create-closeout-document.dto");
Object.defineProperty(exports, "CreateCloseoutDocumentDto", { enumerable: true, get: function () { return create_closeout_document_dto_1.CreateCloseoutDocumentDto; } });
var update_closeout_document_dto_1 = require("./dto/update-closeout-document.dto");
Object.defineProperty(exports, "UpdateCloseoutDocumentDto", { enumerable: true, get: function () { return update_closeout_document_dto_1.UpdateCloseoutDocumentDto; } });
// ============================================================================
// MODELS
// Exporting models can be useful for setting up relationships in other modules.
// ============================================================================
var project_model_1 = require("./models/project.model");
Object.defineProperty(exports, "ConstructionProject", { enumerable: true, get: function () { return project_model_1.ConstructionProject; } });
var project_baseline_model_1 = require("./models/project-baseline.model");
Object.defineProperty(exports, "ProjectBaseline", { enumerable: true, get: function () { return project_baseline_model_1.ProjectBaseline; } });
var change_order_model_1 = require("./models/change-order.model");
Object.defineProperty(exports, "ChangeOrder", { enumerable: true, get: function () { return change_order_model_1.ChangeOrder; } });
var bid_solicitation_model_1 = require("./models/bid-solicitation.model");
Object.defineProperty(exports, "BidSolicitation", { enumerable: true, get: function () { return bid_solicitation_model_1.BidSolicitation; } });
var bid_submission_model_1 = require("./models/bid-submission.model");
Object.defineProperty(exports, "BidSubmission", { enumerable: true, get: function () { return bid_submission_model_1.BidSubmission; } });
var vendor_prequalification_model_1 = require("./models/vendor-prequalification.model");
Object.defineProperty(exports, "VendorPrequalification", { enumerable: true, get: function () { return vendor_prequalification_model_1.VendorPrequalification; } });
var change_request_model_1 = require("./models/change-request.model");
Object.defineProperty(exports, "ChangeRequest", { enumerable: true, get: function () { return change_request_model_1.ChangeRequest; } });
var construction_contract_model_1 = require("./models/construction-contract.model");
Object.defineProperty(exports, "ConstructionContract", { enumerable: true, get: function () { return construction_contract_model_1.ConstructionContract; } });
var payment_application_model_1 = require("./models/payment-application.model");
Object.defineProperty(exports, "PaymentApplication", { enumerable: true, get: function () { return payment_application_model_1.PaymentApplication; } });
var contract_amendment_model_1 = require("./models/contract-amendment.model");
Object.defineProperty(exports, "ContractAmendment", { enumerable: true, get: function () { return contract_amendment_model_1.ContractAmendment; } });
var contract_milestone_model_1 = require("./models/contract-milestone.model");
Object.defineProperty(exports, "ContractMilestone", { enumerable: true, get: function () { return contract_milestone_model_1.ContractMilestone; } });
var cost_estimate_model_1 = require("./models/cost-estimate.model");
Object.defineProperty(exports, "CostEstimate", { enumerable: true, get: function () { return cost_estimate_model_1.CostEstimate; } });
var cost_tracking_model_1 = require("./models/cost-tracking.model");
Object.defineProperty(exports, "CostTracking", { enumerable: true, get: function () { return cost_tracking_model_1.CostTracking; } });
var cost_change_order_model_1 = require("./models/cost-change-order.model");
Object.defineProperty(exports, "CostChangeOrder", { enumerable: true, get: function () { return cost_change_order_model_1.CostChangeOrder; } });
var construction_document_model_1 = require("./models/construction-document.model");
Object.defineProperty(exports, "ConstructionDocument", { enumerable: true, get: function () { return construction_document_model_1.ConstructionDocument; } });
var document_revision_model_1 = require("./models/document-revision.model");
Object.defineProperty(exports, "DocumentRevision", { enumerable: true, get: function () { return document_revision_model_1.DocumentRevision; } });
var document_distribution_model_1 = require("./models/document-distribution.model");
Object.defineProperty(exports, "DocumentDistribution", { enumerable: true, get: function () { return document_distribution_model_1.DocumentDistribution; } });
var construction_equipment_model_1 = require("./models/construction-equipment.model");
Object.defineProperty(exports, "ConstructionEquipment", { enumerable: true, get: function () { return construction_equipment_model_1.ConstructionEquipment; } });
var equipment_maintenance_record_model_1 = require("./models/equipment-maintenance-record.model");
Object.defineProperty(exports, "EquipmentMaintenanceRecord", { enumerable: true, get: function () { return equipment_maintenance_record_model_1.EquipmentMaintenanceRecord; } });
var equipment_allocation_model_1 = require("./models/equipment-allocation.model");
Object.defineProperty(exports, "EquipmentAllocation", { enumerable: true, get: function () { return equipment_allocation_model_1.EquipmentAllocation; } });
var construction_inspection_model_1 = require("./models/construction-inspection.model");
Object.defineProperty(exports, "ConstructionInspection", { enumerable: true, get: function () { return construction_inspection_model_1.ConstructionInspection; } });
var inspection_deficiency_model_1 = require("./models/inspection-deficiency.model");
Object.defineProperty(exports, "InspectionDeficiency", { enumerable: true, get: function () { return inspection_deficiency_model_1.InspectionDeficiency; } });
var inspection_checklist_item_model_1 = require("./models/inspection-checklist-item.model");
Object.defineProperty(exports, "InspectionChecklistItem", { enumerable: true, get: function () { return inspection_checklist_item_model_1.InspectionChecklistItem; } });
var labor_plan_model_1 = require("./models/labor-plan.model");
Object.defineProperty(exports, "LaborPlan", { enumerable: true, get: function () { return labor_plan_model_1.LaborPlan; } });
var timesheet_model_1 = require("./models/timesheet.model");
Object.defineProperty(exports, "Timesheet", { enumerable: true, get: function () { return timesheet_model_1.Timesheet; } });
var construction_worker_model_1 = require("./models/construction-worker.model");
Object.defineProperty(exports, "ConstructionWorker", { enumerable: true, get: function () { return construction_worker_model_1.ConstructionWorker; } });
var construction_material_model_1 = require("./models/construction-material.model");
Object.defineProperty(exports, "ConstructionMaterial", { enumerable: true, get: function () { return construction_material_model_1.ConstructionMaterial; } });
var material_requisition_model_1 = require("./models/material-requisition.model");
Object.defineProperty(exports, "MaterialRequisition", { enumerable: true, get: function () { return material_requisition_model_1.MaterialRequisition; } });
var material_transaction_model_1 = require("./models/material-transaction.model");
Object.defineProperty(exports, "MaterialTransaction", { enumerable: true, get: function () { return material_transaction_model_1.MaterialTransaction; } });
var quality_plan_model_1 = require("./models/quality-plan.model");
Object.defineProperty(exports, "QualityPlan", { enumerable: true, get: function () { return quality_plan_model_1.QualityPlan; } });
var quality_inspection_model_1 = require("./models/quality-inspection.model");
Object.defineProperty(exports, "QualityInspection", { enumerable: true, get: function () { return quality_inspection_model_1.QualityInspection; } });
var quality_deficiency_model_1 = require("./models/quality-deficiency.model");
Object.defineProperty(exports, "QualityDeficiency", { enumerable: true, get: function () { return quality_deficiency_model_1.QualityDeficiency; } });
var safety_plan_model_1 = require("./models/safety-plan.model");
Object.defineProperty(exports, "SafetyPlan", { enumerable: true, get: function () { return safety_plan_model_1.SafetyPlan; } });
var safety_incident_model_1 = require("./models/safety-incident.model");
Object.defineProperty(exports, "SafetyIncident", { enumerable: true, get: function () { return safety_incident_model_1.SafetyIncident; } });
var safety_inspection_model_1 = require("./models/safety-inspection.model");
Object.defineProperty(exports, "SafetyInspection", { enumerable: true, get: function () { return safety_inspection_model_1.SafetyInspection; } });
var schedule_activity_model_1 = require("./models/schedule-activity.model");
Object.defineProperty(exports, "ScheduleActivity", { enumerable: true, get: function () { return schedule_activity_model_1.ScheduleActivity; } });
var activity_relationship_model_1 = require("./models/activity-relationship.model");
Object.defineProperty(exports, "ActivityRelationship", { enumerable: true, get: function () { return activity_relationship_model_1.ActivityRelationship; } });
var resource_assignment_model_1 = require("./models/resource-assignment.model");
Object.defineProperty(exports, "ResourceAssignment", { enumerable: true, get: function () { return resource_assignment_model_1.ResourceAssignment; } });
var construction_site_model_1 = require("./models/construction-site.model");
Object.defineProperty(exports, "ConstructionSite", { enumerable: true, get: function () { return construction_site_model_1.ConstructionSite; } });
var daily_site_log_model_1 = require("./models/daily-site-log.model");
Object.defineProperty(exports, "DailySiteLog", { enumerable: true, get: function () { return daily_site_log_model_1.DailySiteLog; } });
var site_safety_incident_model_1 = require("./models/site-safety-incident.model");
Object.defineProperty(exports, "SiteSafetyIncident", { enumerable: true, get: function () { return site_safety_incident_model_1.SiteSafetyIncident; } });
var construction_submittal_model_1 = require("./models/construction-submittal.model");
Object.defineProperty(exports, "ConstructionSubmittal", { enumerable: true, get: function () { return construction_submittal_model_1.ConstructionSubmittal; } });
var submittal_review_model_1 = require("./models/submittal-review.model");
Object.defineProperty(exports, "SubmittalReview", { enumerable: true, get: function () { return submittal_review_model_1.SubmittalReview; } });
var submittal_workflow_model_1 = require("./models/submittal-workflow.model");
Object.defineProperty(exports, "SubmittalWorkflow", { enumerable: true, get: function () { return submittal_workflow_model_1.SubmittalWorkflow; } });
var construction_warranty_model_1 = require("./models/construction-warranty.model");
Object.defineProperty(exports, "ConstructionWarranty", { enumerable: true, get: function () { return construction_warranty_model_1.ConstructionWarranty; } });
var warranty_claim_model_1 = require("./models/warranty-claim.model");
Object.defineProperty(exports, "WarrantyClaim", { enumerable: true, get: function () { return warranty_claim_model_1.WarrantyClaim; } });
//# sourceMappingURL=index.js.map