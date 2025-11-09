"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestingStatus = exports.DeficiencySeverity = exports.DeficiencyStatus = exports.InspectionStatus = exports.InspectionType = exports.QualityPlanStatus = void 0;
var QualityPlanStatus;
(function (QualityPlanStatus) {
    QualityPlanStatus["DRAFT"] = "DRAFT";
    QualityPlanStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    QualityPlanStatus["APPROVED"] = "APPROVED";
    QualityPlanStatus["ACTIVE"] = "ACTIVE";
    QualityPlanStatus["COMPLETED"] = "COMPLETED";
    QualityPlanStatus["ARCHIVED"] = "ARCHIVED";
})(QualityPlanStatus || (exports.QualityPlanStatus = QualityPlanStatus = {}));
var InspectionType;
(function (InspectionType) {
    InspectionType["PRE_CONSTRUCTION"] = "PRE_CONSTRUCTION";
    InspectionType["IN_PROGRESS"] = "IN_PROGRESS";
    InspectionType["FINAL"] = "FINAL";
    InspectionType["MILESTONE"] = "MILESTONE";
    InspectionType["RANDOM"] = "RANDOM";
    InspectionType["COMPLIANCE"] = "COMPLIANCE";
    InspectionType["MATERIAL"] = "MATERIAL";
    InspectionType["WORKMANSHIP"] = "WORKMANSHIP";
})(InspectionType || (exports.InspectionType = InspectionType = {}));
var InspectionStatus;
(function (InspectionStatus) {
    InspectionStatus["SCHEDULED"] = "SCHEDULED";
    InspectionStatus["IN_PROGRESS"] = "IN_PROGRESS";
    InspectionStatus["COMPLETED"] = "COMPLETED";
    InspectionStatus["PASSED"] = "PASSED";
    InspectionStatus["FAILED"] = "FAILED";
    InspectionStatus["CONDITIONAL_PASS"] = "CONDITIONAL_PASS";
    InspectionStatus["CANCELLED"] = "CANCELLED";
})(InspectionStatus || (exports.InspectionStatus = InspectionStatus = {}));
var DeficiencyStatus;
(function (DeficiencyStatus) {
    DeficiencyStatus["OPEN"] = "OPEN";
    DeficiencyStatus["IN_PROGRESS"] = "IN_PROGRESS";
    DeficiencyStatus["RESOLVED"] = "RESOLVED";
    DeficiencyStatus["VERIFIED"] = "VERIFIED";
    DeficiencyStatus["CLOSED"] = "CLOSED";
    DeficiencyStatus["ESCALATED"] = "ESCALATED";
    DeficiencyStatus["REJECTED"] = "REJECTED";
})(DeficiencyStatus || (exports.DeficiencyStatus = DeficiencyStatus = {}));
var DeficiencySeverity;
(function (DeficiencySeverity) {
    DeficiencySeverity["CRITICAL"] = "CRITICAL";
    DeficiencySeverity["MAJOR"] = "MAJOR";
    DeficiencySeverity["MINOR"] = "MINOR";
    DeficiencySeverity["COSMETIC"] = "COSMETIC";
})(DeficiencySeverity || (exports.DeficiencySeverity = DeficiencySeverity = {}));
var TestingStatus;
(function (TestingStatus) {
    TestingStatus["NOT_STARTED"] = "NOT_STARTED";
    TestingStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TestingStatus["PASSED"] = "PASSED";
    TestingStatus["FAILED"] = "FAILED";
    TestingStatus["RETESTING"] = "RETESTING";
})(TestingStatus || (exports.TestingStatus = TestingStatus = {}));
//# sourceMappingURL=quality.types.js.map