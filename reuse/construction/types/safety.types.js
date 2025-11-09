"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HazardSeverity = exports.ComplianceStatus = exports.InspectionType = exports.IncidentStatus = exports.IncidentSeverity = exports.IncidentType = exports.SafetyPlanStatus = void 0;
var SafetyPlanStatus;
(function (SafetyPlanStatus) {
    SafetyPlanStatus["DRAFT"] = "DRAFT";
    SafetyPlanStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    SafetyPlanStatus["APPROVED"] = "APPROVED";
    SafetyPlanStatus["ACTIVE"] = "ACTIVE";
    SafetyPlanStatus["SUSPENDED"] = "SUSPENDED";
    SafetyPlanStatus["ARCHIVED"] = "ARCHIVED";
})(SafetyPlanStatus || (exports.SafetyPlanStatus = SafetyPlanStatus = {}));
var IncidentType;
(function (IncidentType) {
    IncidentType["INJURY"] = "INJURY";
    IncidentType["NEAR_MISS"] = "NEAR_MISS";
    IncidentType["PROPERTY_DAMAGE"] = "PROPERTY_DAMAGE";
    IncidentType["ENVIRONMENTAL"] = "ENVIRONMENTAL";
    IncidentType["VEHICLE"] = "VEHICLE";
    IncidentType["FIRE"] = "FIRE";
    IncidentType["CHEMICAL_SPILL"] = "CHEMICAL_SPILL";
    IncidentType["ELECTRICAL"] = "ELECTRICAL";
})(IncidentType || (exports.IncidentType = IncidentType = {}));
var IncidentSeverity;
(function (IncidentSeverity) {
    IncidentSeverity["FATALITY"] = "FATALITY";
    IncidentSeverity["LOST_TIME"] = "LOST_TIME";
    IncidentSeverity["RESTRICTED_WORK"] = "RESTRICTED_WORK";
    IncidentSeverity["MEDICAL_TREATMENT"] = "MEDICAL_TREATMENT";
    IncidentSeverity["FIRST_AID"] = "FIRST_AID";
    IncidentSeverity["NEAR_MISS"] = "NEAR_MISS";
    IncidentSeverity["PROPERTY_DAMAGE_ONLY"] = "PROPERTY_DAMAGE_ONLY";
})(IncidentSeverity || (exports.IncidentSeverity = IncidentSeverity = {}));
var IncidentStatus;
(function (IncidentStatus) {
    IncidentStatus["REPORTED"] = "REPORTED";
    IncidentStatus["INVESTIGATING"] = "INVESTIGATING";
    IncidentStatus["PENDING_REVIEW"] = "PENDING_REVIEW";
    IncidentStatus["CLOSED"] = "CLOSED";
    IncidentStatus["FOLLOW_UP_REQUIRED"] = "FOLLOW_UP_REQUIRED";
})(IncidentStatus || (exports.IncidentStatus = IncidentStatus = {}));
var InspectionType;
(function (InspectionType) {
    InspectionType["DAILY_TOOLBOX"] = "DAILY_TOOLBOX";
    InspectionType["WEEKLY_SITE"] = "WEEKLY_SITE";
    InspectionType["MONTHLY_FORMAL"] = "MONTHLY_FORMAL";
    InspectionType["COMPETENT_PERSON"] = "COMPETENT_PERSON";
    InspectionType["THIRD_PARTY"] = "THIRD_PARTY";
    InspectionType["OSHA_VISIT"] = "OSHA_VISIT";
    InspectionType["POST_INCIDENT"] = "POST_INCIDENT";
})(InspectionType || (exports.InspectionType = InspectionType = {}));
var ComplianceStatus;
(function (ComplianceStatus) {
    ComplianceStatus["COMPLIANT"] = "COMPLIANT";
    ComplianceStatus["NON_COMPLIANT"] = "NON_COMPLIANT";
    ComplianceStatus["PENDING_VERIFICATION"] = "PENDING_VERIFICATION";
    ComplianceStatus["EXEMPTED"] = "EXEMPTED";
})(ComplianceStatus || (exports.ComplianceStatus = ComplianceStatus = {}));
var HazardSeverity;
(function (HazardSeverity) {
    HazardSeverity["IMMINENT"] = "IMMINENT";
    HazardSeverity["SERIOUS"] = "SERIOUS";
    HazardSeverity["MODERATE"] = "MODERATE";
    HazardSeverity["LOW"] = "LOW";
})(HazardSeverity || (exports.HazardSeverity = HazardSeverity = {}));
//# sourceMappingURL=safety.types.js.map