"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipientType = exports.DisclosureMethod = exports.DisclosurePurpose = exports.DisclosureType = exports.AuditAction = exports.PolicyStatus = exports.PolicyCategory = exports.ConsentType = exports.ChecklistItemStatus = exports.ComplianceCategory = exports.ComplianceStatus = exports.ComplianceReportType = void 0;
var ComplianceReportType;
(function (ComplianceReportType) {
    ComplianceReportType["HIPAA"] = "HIPAA";
    ComplianceReportType["FERPA"] = "FERPA";
    ComplianceReportType["MEDICATION_AUDIT"] = "MEDICATION_AUDIT";
    ComplianceReportType["STATE_HEALTH"] = "STATE_HEALTH";
    ComplianceReportType["SAFETY_INSPECTION"] = "SAFETY_INSPECTION";
    ComplianceReportType["TRAINING_COMPLIANCE"] = "TRAINING_COMPLIANCE";
    ComplianceReportType["DATA_PRIVACY"] = "DATA_PRIVACY";
    ComplianceReportType["CUSTOM"] = "CUSTOM";
})(ComplianceReportType || (exports.ComplianceReportType = ComplianceReportType = {}));
var ComplianceStatus;
(function (ComplianceStatus) {
    ComplianceStatus["PENDING"] = "PENDING";
    ComplianceStatus["COMPLIANT"] = "COMPLIANT";
    ComplianceStatus["NON_COMPLIANT"] = "NON_COMPLIANT";
    ComplianceStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
})(ComplianceStatus || (exports.ComplianceStatus = ComplianceStatus = {}));
var ComplianceCategory;
(function (ComplianceCategory) {
    ComplianceCategory["PRIVACY"] = "PRIVACY";
    ComplianceCategory["SECURITY"] = "SECURITY";
    ComplianceCategory["DOCUMENTATION"] = "DOCUMENTATION";
    ComplianceCategory["TRAINING"] = "TRAINING";
    ComplianceCategory["MEDICATION"] = "MEDICATION";
    ComplianceCategory["HEALTH_RECORDS"] = "HEALTH_RECORDS";
    ComplianceCategory["SAFETY"] = "SAFETY";
    ComplianceCategory["CONSENT"] = "CONSENT";
})(ComplianceCategory || (exports.ComplianceCategory = ComplianceCategory = {}));
var ChecklistItemStatus;
(function (ChecklistItemStatus) {
    ChecklistItemStatus["PENDING"] = "PENDING";
    ChecklistItemStatus["COMPLETED"] = "COMPLETED";
    ChecklistItemStatus["NOT_APPLICABLE"] = "NOT_APPLICABLE";
    ChecklistItemStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ChecklistItemStatus["FAILED"] = "FAILED";
})(ChecklistItemStatus || (exports.ChecklistItemStatus = ChecklistItemStatus = {}));
var ConsentType;
(function (ConsentType) {
    ConsentType["MEDICATION_ADMINISTRATION"] = "MEDICATION_ADMINISTRATION";
    ConsentType["PHOTO_RELEASE"] = "PHOTO_RELEASE";
    ConsentType["FIELD_TRIP"] = "FIELD_TRIP";
    ConsentType["EMERGENCY_TREATMENT"] = "EMERGENCY_TREATMENT";
    ConsentType["DATA_SHARING"] = "DATA_SHARING";
    ConsentType["RESEARCH"] = "RESEARCH";
})(ConsentType || (exports.ConsentType = ConsentType = {}));
var PolicyCategory;
(function (PolicyCategory) {
    PolicyCategory["HIPAA_PRIVACY"] = "HIPAA_PRIVACY";
    PolicyCategory["HIPAA_SECURITY"] = "HIPAA_SECURITY";
    PolicyCategory["MEDICATION_ADMINISTRATION"] = "MEDICATION_ADMINISTRATION";
    PolicyCategory["EMERGENCY_PROCEDURES"] = "EMERGENCY_PROCEDURES";
    PolicyCategory["CONFIDENTIALITY"] = "CONFIDENTIALITY";
    PolicyCategory["DATA_RETENTION"] = "DATA_RETENTION";
    PolicyCategory["ACCESS_CONTROL"] = "ACCESS_CONTROL";
})(PolicyCategory || (exports.PolicyCategory = PolicyCategory = {}));
var PolicyStatus;
(function (PolicyStatus) {
    PolicyStatus["DRAFT"] = "DRAFT";
    PolicyStatus["ACTIVE"] = "ACTIVE";
    PolicyStatus["ARCHIVED"] = "ARCHIVED";
    PolicyStatus["SUPERSEDED"] = "SUPERSEDED";
})(PolicyStatus || (exports.PolicyStatus = PolicyStatus = {}));
var AuditAction;
(function (AuditAction) {
    AuditAction["CREATE"] = "CREATE";
    AuditAction["VIEW"] = "VIEW";
    AuditAction["UPDATE"] = "UPDATE";
    AuditAction["DELETE"] = "DELETE";
    AuditAction["EXPORT"] = "EXPORT";
    AuditAction["PRINT"] = "PRINT";
    AuditAction["LOGIN"] = "LOGIN";
    AuditAction["LOGOUT"] = "LOGOUT";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
var DisclosureType;
(function (DisclosureType) {
    DisclosureType["TREATMENT"] = "TREATMENT";
    DisclosureType["PAYMENT"] = "PAYMENT";
    DisclosureType["HEALTHCARE_OPERATIONS"] = "HEALTHCARE_OPERATIONS";
    DisclosureType["AUTHORIZATION"] = "AUTHORIZATION";
    DisclosureType["REQUIRED_BY_LAW"] = "REQUIRED_BY_LAW";
    DisclosureType["PUBLIC_HEALTH"] = "PUBLIC_HEALTH";
    DisclosureType["RESEARCH"] = "RESEARCH";
})(DisclosureType || (exports.DisclosureType = DisclosureType = {}));
var DisclosurePurpose;
(function (DisclosurePurpose) {
    DisclosurePurpose["TREATMENT"] = "TREATMENT";
    DisclosurePurpose["PAYMENT"] = "PAYMENT";
    DisclosurePurpose["OPERATIONS"] = "OPERATIONS";
    DisclosurePurpose["LEGAL_REQUIREMENT"] = "LEGAL_REQUIREMENT";
    DisclosurePurpose["PUBLIC_HEALTH"] = "PUBLIC_HEALTH";
    DisclosurePurpose["RESEARCH"] = "RESEARCH";
    DisclosurePurpose["PATIENT_REQUEST"] = "PATIENT_REQUEST";
})(DisclosurePurpose || (exports.DisclosurePurpose = DisclosurePurpose = {}));
var DisclosureMethod;
(function (DisclosureMethod) {
    DisclosureMethod["VERBAL"] = "VERBAL";
    DisclosureMethod["WRITTEN"] = "WRITTEN";
    DisclosureMethod["ELECTRONIC"] = "ELECTRONIC";
    DisclosureMethod["FAX"] = "FAX";
    DisclosureMethod["PHONE"] = "PHONE";
})(DisclosureMethod || (exports.DisclosureMethod = DisclosureMethod = {}));
var RecipientType;
(function (RecipientType) {
    RecipientType["HEALTHCARE_PROVIDER"] = "HEALTHCARE_PROVIDER";
    RecipientType["INSURANCE"] = "INSURANCE";
    RecipientType["PARENT_GUARDIAN"] = "PARENT_GUARDIAN";
    RecipientType["SCHOOL_OFFICIAL"] = "SCHOOL_OFFICIAL";
    RecipientType["GOVERNMENT_AGENCY"] = "GOVERNMENT_AGENCY";
    RecipientType["RESEARCHER"] = "RESEARCHER";
    RecipientType["OTHER"] = "OTHER";
})(RecipientType || (exports.RecipientType = RecipientType = {}));
//# sourceMappingURL=index.js.map