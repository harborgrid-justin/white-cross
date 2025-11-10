"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingMethod = exports.ApprovalStatus = exports.ImpactSeverity = exports.ChangeCategory = exports.ChangeOrderType = exports.ChangeRequestStatus = void 0;
var ChangeRequestStatus;
(function (ChangeRequestStatus) {
    ChangeRequestStatus["DRAFT"] = "draft";
    ChangeRequestStatus["SUBMITTED"] = "submitted";
    ChangeRequestStatus["UNDER_REVIEW"] = "under_review";
    ChangeRequestStatus["IMPACT_ANALYSIS"] = "impact_analysis";
    ChangeRequestStatus["PRICING"] = "pricing";
    ChangeRequestStatus["NEGOTIATION"] = "negotiation";
    ChangeRequestStatus["PENDING_APPROVAL"] = "pending_approval";
    ChangeRequestStatus["APPROVED"] = "approved";
    ChangeRequestStatus["REJECTED"] = "rejected";
    ChangeRequestStatus["WITHDRAWN"] = "withdrawn";
    ChangeRequestStatus["EXECUTED"] = "executed";
})(ChangeRequestStatus || (exports.ChangeRequestStatus = ChangeRequestStatus = {}));
var ChangeOrderType;
(function (ChangeOrderType) {
    ChangeOrderType["OWNER_INITIATED"] = "owner_initiated";
    ChangeOrderType["CONTRACTOR_PROPOSED"] = "contractor_proposed";
    ChangeOrderType["ARCHITECT_DIRECTED"] = "architect_directed";
    ChangeOrderType["DESIGN_ERROR"] = "design_error";
    ChangeOrderType["UNFORESEEN_CONDITIONS"] = "unforeseen_conditions";
    ChangeOrderType["REGULATORY_REQUIREMENT"] = "regulatory_requirement";
    ChangeOrderType["VALUE_ENGINEERING"] = "value_engineering";
    ChangeOrderType["SCHEDULE_DRIVEN"] = "schedule_driven";
})(ChangeOrderType || (exports.ChangeOrderType = ChangeOrderType = {}));
var ChangeCategory;
(function (ChangeCategory) {
    ChangeCategory["SCOPE_ADDITION"] = "scope_addition";
    ChangeCategory["SCOPE_DELETION"] = "scope_deletion";
    ChangeCategory["SCOPE_MODIFICATION"] = "scope_modification";
    ChangeCategory["MATERIAL_SUBSTITUTION"] = "material_substitution";
    ChangeCategory["DESIGN_CLARIFICATION"] = "design_clarification";
    ChangeCategory["SCHEDULE_ACCELERATION"] = "schedule_acceleration";
    ChangeCategory["SCHEDULE_EXTENSION"] = "schedule_extension";
    ChangeCategory["QUALITY_IMPROVEMENT"] = "quality_improvement";
    ChangeCategory["COST_REDUCTION"] = "cost_reduction";
})(ChangeCategory || (exports.ChangeCategory = ChangeCategory = {}));
var ImpactSeverity;
(function (ImpactSeverity) {
    ImpactSeverity["MINIMAL"] = "minimal";
    ImpactSeverity["MODERATE"] = "moderate";
    ImpactSeverity["SIGNIFICANT"] = "significant";
    ImpactSeverity["CRITICAL"] = "critical";
})(ImpactSeverity || (exports.ImpactSeverity = ImpactSeverity = {}));
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["PENDING"] = "pending";
    ApprovalStatus["APPROVED"] = "approved";
    ApprovalStatus["REJECTED"] = "rejected";
    ApprovalStatus["DEFERRED"] = "deferred";
})(ApprovalStatus || (exports.ApprovalStatus = ApprovalStatus = {}));
var PricingMethod;
(function (PricingMethod) {
    PricingMethod["LUMP_SUM"] = "lump_sum";
    PricingMethod["UNIT_PRICE"] = "unit_price";
    PricingMethod["TIME_AND_MATERIALS"] = "time_and_materials";
    PricingMethod["COST_PLUS"] = "cost_plus";
    PricingMethod["NOT_TO_EXCEED"] = "not_to_exceed";
})(PricingMethod || (exports.PricingMethod = PricingMethod = {}));
//# sourceMappingURL=change-order.types.js.map