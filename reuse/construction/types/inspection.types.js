"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermitStatus = exports.InspectorType = exports.DeficiencyStatus = exports.DeficiencySeverity = exports.InspectionResult = exports.InspectionStatus = exports.InspectionType = void 0;
var InspectionType;
(function (InspectionType) {
    InspectionType["FOUNDATION"] = "foundation";
    InspectionType["FRAMING"] = "framing";
    InspectionType["ROUGH_IN"] = "rough_in";
    InspectionType["INSULATION"] = "insulation";
    InspectionType["DRYWALL"] = "drywall";
    InspectionType["FINAL"] = "final";
    InspectionType["FIRE_PROTECTION"] = "fire_protection";
    InspectionType["ELECTRICAL"] = "electrical";
    InspectionType["PLUMBING"] = "plumbing";
    InspectionType["MECHANICAL"] = "mechanical";
    InspectionType["STRUCTURAL"] = "structural";
    InspectionType["ACCESSIBILITY"] = "accessibility";
    InspectionType["ENERGY_CODE"] = "energy_code";
    InspectionType["THIRD_PARTY"] = "third_party";
    InspectionType["SPECIAL"] = "special";
})(InspectionType || (exports.InspectionType = InspectionType = {}));
var InspectionStatus;
(function (InspectionStatus) {
    InspectionStatus["SCHEDULED"] = "scheduled";
    InspectionStatus["IN_PROGRESS"] = "in_progress";
    InspectionStatus["PASSED"] = "passed";
    InspectionStatus["PASSED_WITH_CONDITIONS"] = "passed_with_conditions";
    InspectionStatus["FAILED"] = "failed";
    InspectionStatus["CANCELLED"] = "cancelled";
    InspectionStatus["RESCHEDULED"] = "rescheduled";
    InspectionStatus["PENDING_REVIEW"] = "pending_review";
    InspectionStatus["COMPLETED"] = "completed";
})(InspectionStatus || (exports.InspectionStatus = InspectionStatus = {}));
var InspectionResult;
(function (InspectionResult) {
    InspectionResult["PASS"] = "pass";
    InspectionResult["PASS_WITH_CONDITIONS"] = "pass_with_conditions";
    InspectionResult["FAIL"] = "fail";
    InspectionResult["INCOMPLETE"] = "incomplete";
    InspectionResult["NOT_READY"] = "not_ready";
})(InspectionResult || (exports.InspectionResult = InspectionResult = {}));
var DeficiencySeverity;
(function (DeficiencySeverity) {
    DeficiencySeverity["CRITICAL"] = "critical";
    DeficiencySeverity["MAJOR"] = "major";
    DeficiencySeverity["MINOR"] = "minor";
    DeficiencySeverity["OBSERVATION"] = "observation";
})(DeficiencySeverity || (exports.DeficiencySeverity = DeficiencySeverity = {}));
var DeficiencyStatus;
(function (DeficiencyStatus) {
    DeficiencyStatus["OPEN"] = "open";
    DeficiencyStatus["IN_PROGRESS"] = "in_progress";
    DeficiencyStatus["RESOLVED"] = "resolved";
    DeficiencyStatus["VERIFIED"] = "verified";
    DeficiencyStatus["CLOSED"] = "closed";
    DeficiencyStatus["REJECTED"] = "rejected";
})(DeficiencyStatus || (exports.DeficiencyStatus = DeficiencyStatus = {}));
var InspectorType;
(function (InspectorType) {
    InspectorType["INTERNAL"] = "internal";
    InspectorType["MUNICIPAL"] = "municipal";
    InspectorType["THIRD_PARTY"] = "third_party";
    InspectorType["OWNER_REP"] = "owner_rep";
    InspectorType["ENGINEER"] = "engineer";
})(InspectorType || (exports.InspectorType = InspectorType = {}));
var PermitStatus;
(function (PermitStatus) {
    PermitStatus["PENDING"] = "pending";
    PermitStatus["SUBMITTED"] = "submitted";
    PermitStatus["UNDER_REVIEW"] = "under_review";
    PermitStatus["APPROVED"] = "approved";
    PermitStatus["ISSUED"] = "issued";
    PermitStatus["EXPIRED"] = "expired";
    PermitStatus["REVOKED"] = "revoked";
    PermitStatus["CLOSED"] = "closed";
})(PermitStatus || (exports.PermitStatus = PermitStatus = {}));
//# sourceMappingURL=inspection.types.js.map