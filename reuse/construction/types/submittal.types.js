"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowStatus = exports.WorkflowType = exports.ReviewAction = exports.SubmittalPriority = exports.SubmittalStatus = exports.SubmittalType = void 0;
var SubmittalType;
(function (SubmittalType) {
    SubmittalType["SHOP_DRAWING"] = "shop_drawing";
    SubmittalType["PRODUCT_DATA"] = "product_data";
    SubmittalType["SAMPLE"] = "sample";
    SubmittalType["TEST_REPORT"] = "test_report";
    SubmittalType["MATERIAL_CERT"] = "material_cert";
    SubmittalType["OTHER"] = "other";
})(SubmittalType || (exports.SubmittalType = SubmittalType = {}));
var SubmittalStatus;
(function (SubmittalStatus) {
    SubmittalStatus["DRAFT"] = "draft";
    SubmittalStatus["SUBMITTED"] = "submitted";
    SubmittalStatus["UNDER_REVIEW"] = "under_review";
    SubmittalStatus["APPROVED"] = "approved";
    SubmittalStatus["APPROVED_AS_NOTED"] = "approved_as_noted";
    SubmittalStatus["REVISE_RESUBMIT"] = "revise_resubmit";
    SubmittalStatus["REJECTED"] = "rejected";
    SubmittalStatus["CLOSED"] = "closed";
})(SubmittalStatus || (exports.SubmittalStatus = SubmittalStatus = {}));
var SubmittalPriority;
(function (SubmittalPriority) {
    SubmittalPriority["LOW"] = "low";
    SubmittalPriority["MEDIUM"] = "medium";
    SubmittalPriority["HIGH"] = "high";
    SubmittalPriority["CRITICAL"] = "critical";
})(SubmittalPriority || (exports.SubmittalPriority = SubmittalPriority = {}));
var ReviewAction;
(function (ReviewAction) {
    ReviewAction["APPROVED"] = "approved";
    ReviewAction["APPROVED_AS_NOTED"] = "approved_as_noted";
    ReviewAction["REVISE_RESUBMIT"] = "revise_resubmit";
    ReviewAction["REJECTED"] = "rejected";
    ReviewAction["NO_EXCEPTION_TAKEN"] = "no_exception_taken";
})(ReviewAction || (exports.ReviewAction = ReviewAction = {}));
var WorkflowType;
(function (WorkflowType) {
    WorkflowType["SEQUENTIAL"] = "sequential";
    WorkflowType["PARALLEL"] = "parallel";
    WorkflowType["HYBRID"] = "hybrid";
})(WorkflowType || (exports.WorkflowType = WorkflowType = {}));
var WorkflowStatus;
(function (WorkflowStatus) {
    WorkflowStatus["PENDING"] = "pending";
    WorkflowStatus["IN_PROGRESS"] = "in_progress";
    WorkflowStatus["COMPLETED"] = "completed";
    WorkflowStatus["REJECTED"] = "rejected";
})(WorkflowStatus || (exports.WorkflowStatus = WorkflowStatus = {}));
//# sourceMappingURL=submittal.types.js.map