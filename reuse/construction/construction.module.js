"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstructionModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const project_controller_1 = require("./project.controller");
const project_service_1 = require("./project.service");
const project_model_1 = require("./models/project.model");
const project_baseline_model_1 = require("./models/project-baseline.model");
const change_order_model_1 = require("./models/change-order.model");
const progress_service_1 = require("./progress.service");
const bid_solicitation_model_1 = require("./models/bid-solicitation.model");
const bid_submission_model_1 = require("./models/bid-submission.model");
const vendor_prequalification_model_1 = require("./models/vendor-prequalification.model");
const change_request_model_1 = require("./models/change-request.model");
const construction_contract_model_1 = require("./models/construction-contract.model");
const payment_application_model_1 = require("./models/payment-application.model");
const contract_amendment_model_1 = require("./models/contract-amendment.model");
const contract_milestone_model_1 = require("./models/contract-milestone.model");
const cost_estimate_model_1 = require("./models/cost-estimate.model");
const cost_tracking_model_1 = require("./models/cost-tracking.model");
const cost_change_order_model_1 = require("./models/cost-change-order.model");
const construction_document_model_1 = require("./models/construction-document.model");
const document_revision_model_1 = require("./models/document-revision.model");
const document_distribution_model_1 = require("./models/document-distribution.model");
const construction_equipment_model_1 = require("./models/construction-equipment.model");
const equipment_maintenance_record_model_1 = require("./models/equipment-maintenance-record.model");
const equipment_allocation_model_1 = require("./models/equipment-allocation.model");
const construction_inspection_model_1 = require("./models/construction-inspection.model");
const inspection_deficiency_model_1 = require("./models/inspection-deficiency.model");
const inspection_checklist_item_model_1 = require("./models/inspection-checklist-item.model");
const labor_plan_model_1 = require("./models/labor-plan.model");
const timesheet_model_1 = require("./models/timesheet.model");
const construction_worker_model_1 = require("./models/construction-worker.model");
const construction_material_model_1 = require("./models/construction-material.model");
const material_requisition_model_1 = require("./models/material-requisition.model");
const material_transaction_model_1 = require("./models/material-transaction.model");
const quality_plan_model_1 = require("./models/quality-plan.model");
const quality_inspection_model_1 = require("./models/quality-inspection.model");
const quality_deficiency_model_1 = require("./models/quality-deficiency.model");
const safety_plan_model_1 = require("./models/safety-plan.model");
const safety_incident_model_1 = require("./models/safety-incident.model");
const safety_inspection_model_1 = require("./models/safety-inspection.model");
const schedule_activity_model_1 = require("./models/schedule-activity.model");
const activity_relationship_model_1 = require("./models/activity-relationship.model");
const resource_assignment_model_1 = require("./models/resource-assignment.model");
const construction_site_model_1 = require("./models/construction-site.model");
const daily_site_log_model_1 = require("./models/daily-site-log.model");
const site_safety_incident_model_1 = require("./models/site-safety-incident.model");
const construction_submittal_model_1 = require("./models/construction-submittal.model");
const submittal_review_model_1 = require("./models/submittal-review.model");
const submittal_workflow_model_1 = require("./models/submittal-workflow.model");
const construction_warranty_model_1 = require("./models/construction-warranty.model");
const warranty_claim_model_1 = require("./models/warranty-claim.model");
let ConstructionModule = (() => {
    let _classDecorators = [(0, common_1.Module)({
            imports: [
                sequelize_1.SequelizeModule.forFeature([
                    project_model_1.ConstructionProject,
                    project_baseline_model_1.ProjectBaseline,
                    change_order_model_1.ChangeOrder,
                    bid_solicitation_model_1.BidSolicitation,
                    bid_submission_model_1.BidSubmission,
                    vendor_prequalification_model_1.VendorPrequalification,
                    change_request_model_1.ChangeRequest,
                    construction_contract_model_1.ConstructionContract,
                    payment_application_model_1.PaymentApplication,
                    contract_amendment_model_1.ContractAmendment,
                    contract_milestone_model_1.ContractMilestone,
                    cost_estimate_model_1.CostEstimate,
                    cost_tracking_model_1.CostTracking,
                    cost_change_order_model_1.CostChangeOrder,
                    construction_document_model_1.ConstructionDocument,
                    document_revision_model_1.DocumentRevision,
                    document_distribution_model_1.DocumentDistribution,
                    construction_equipment_model_1.ConstructionEquipment,
                    equipment_maintenance_record_model_1.EquipmentMaintenanceRecord,
                    equipment_allocation_model_1.EquipmentAllocation,
                    construction_inspection_model_1.ConstructionInspection,
                    inspection_deficiency_model_1.InspectionDeficiency,
                    inspection_checklist_item_model_1.InspectionChecklistItem,
                    labor_plan_model_1.LaborPlan,
                    timesheet_model_1.Timesheet,
                    construction_worker_model_1.ConstructionWorker,
                    construction_material_model_1.ConstructionMaterial,
                    material_requisition_model_1.MaterialRequisition,
                    material_transaction_model_1.MaterialTransaction,
                    quality_plan_model_1.QualityPlan,
                    quality_inspection_model_1.QualityInspection,
                    quality_deficiency_model_1.QualityDeficiency,
                    safety_plan_model_1.SafetyPlan,
                    safety_incident_model_1.SafetyIncident,
                    safety_inspection_model_1.SafetyInspection,
                    schedule_activity_model_1.ScheduleActivity,
                    activity_relationship_model_1.ActivityRelationship,
                    resource_assignment_model_1.ResourceAssignment,
                    construction_site_model_1.ConstructionSite,
                    daily_site_log_model_1.DailySiteLog,
                    site_safety_incident_model_1.SiteSafetyIncident,
                    construction_submittal_model_1.ConstructionSubmittal,
                    submittal_review_model_1.SubmittalReview,
                    submittal_workflow_model_1.SubmittalWorkflow,
                    construction_warranty_model_1.ConstructionWarranty,
                    warranty_claim_model_1.WarrantyClaim,
                ]),
            ],
            controllers: [project_controller_1.ProjectController],
            providers: [project_service_1.ProjectService, progress_service_1.ProgressService],
            exports: [project_service_1.ProjectService, progress_service_1.ProgressService, sequelize_1.SequelizeModule],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ConstructionModule = _classThis = class {
    };
    __setFunctionName(_classThis, "ConstructionModule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConstructionModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConstructionModule = _classThis;
})();
exports.ConstructionModule = ConstructionModule;
//# sourceMappingURL=construction.module.js.map