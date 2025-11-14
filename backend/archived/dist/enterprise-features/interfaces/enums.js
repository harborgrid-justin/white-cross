"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrendDirection = exports.ReportFrequency = exports.VisualizationType = exports.RecurrenceFrequency = exports.ImpactLevel = exports.RegulationStatus = exports.ComplianceStatus = exports.InsuranceClaimStatus = exports.CaptureMethod = exports.WitnessRole = exports.EvidenceSecurityLevel = exports.CommunicationChannel = exports.ReminderTiming = exports.BulkMessageStatus = exports.ConsentFormStatus = exports.WaitlistStatus = exports.WaitlistPriority = void 0;
var WaitlistPriority;
(function (WaitlistPriority) {
    WaitlistPriority["ROUTINE"] = "routine";
    WaitlistPriority["URGENT"] = "urgent";
})(WaitlistPriority || (exports.WaitlistPriority = WaitlistPriority = {}));
var WaitlistStatus;
(function (WaitlistStatus) {
    WaitlistStatus["WAITING"] = "waiting";
    WaitlistStatus["SCHEDULED"] = "scheduled";
    WaitlistStatus["CANCELLED"] = "cancelled";
})(WaitlistStatus || (exports.WaitlistStatus = WaitlistStatus = {}));
var ConsentFormStatus;
(function (ConsentFormStatus) {
    ConsentFormStatus["PENDING"] = "pending";
    ConsentFormStatus["SIGNED"] = "signed";
    ConsentFormStatus["EXPIRED"] = "expired";
    ConsentFormStatus["REVOKED"] = "revoked";
})(ConsentFormStatus || (exports.ConsentFormStatus = ConsentFormStatus = {}));
var BulkMessageStatus;
(function (BulkMessageStatus) {
    BulkMessageStatus["PENDING"] = "pending";
    BulkMessageStatus["SENDING"] = "sending";
    BulkMessageStatus["COMPLETED"] = "completed";
    BulkMessageStatus["FAILED"] = "failed";
})(BulkMessageStatus || (exports.BulkMessageStatus = BulkMessageStatus = {}));
var ReminderTiming;
(function (ReminderTiming) {
    ReminderTiming["HOURS_24"] = "24h";
    ReminderTiming["HOURS_1"] = "1h";
    ReminderTiming["MINUTES_15"] = "15m";
})(ReminderTiming || (exports.ReminderTiming = ReminderTiming = {}));
var CommunicationChannel;
(function (CommunicationChannel) {
    CommunicationChannel["EMAIL"] = "email";
    CommunicationChannel["SMS"] = "sms";
    CommunicationChannel["PUSH"] = "push";
})(CommunicationChannel || (exports.CommunicationChannel = CommunicationChannel = {}));
var EvidenceSecurityLevel;
(function (EvidenceSecurityLevel) {
    EvidenceSecurityLevel["RESTRICTED"] = "restricted";
    EvidenceSecurityLevel["CONFIDENTIAL"] = "confidential";
})(EvidenceSecurityLevel || (exports.EvidenceSecurityLevel = EvidenceSecurityLevel = {}));
var WitnessRole;
(function (WitnessRole) {
    WitnessRole["STUDENT"] = "student";
    WitnessRole["TEACHER"] = "teacher";
    WitnessRole["STAFF"] = "staff";
    WitnessRole["OTHER"] = "other";
})(WitnessRole || (exports.WitnessRole = WitnessRole = {}));
var CaptureMethod;
(function (CaptureMethod) {
    CaptureMethod["TYPED"] = "typed";
    CaptureMethod["VOICE_TO_TEXT"] = "voice-to-text";
    CaptureMethod["HANDWRITTEN_SCAN"] = "handwritten-scan";
})(CaptureMethod || (exports.CaptureMethod = CaptureMethod = {}));
var InsuranceClaimStatus;
(function (InsuranceClaimStatus) {
    InsuranceClaimStatus["DRAFT"] = "draft";
    InsuranceClaimStatus["SUBMITTED"] = "submitted";
    InsuranceClaimStatus["APPROVED"] = "approved";
    InsuranceClaimStatus["DENIED"] = "denied";
})(InsuranceClaimStatus || (exports.InsuranceClaimStatus = InsuranceClaimStatus = {}));
var ComplianceStatus;
(function (ComplianceStatus) {
    ComplianceStatus["COMPLIANT"] = "compliant";
    ComplianceStatus["NON_COMPLIANT"] = "non-compliant";
    ComplianceStatus["NEEDS_ATTENTION"] = "needs-attention";
})(ComplianceStatus || (exports.ComplianceStatus = ComplianceStatus = {}));
var RegulationStatus;
(function (RegulationStatus) {
    RegulationStatus["PENDING_REVIEW"] = "pending-review";
    RegulationStatus["IMPLEMENTING"] = "implementing";
    RegulationStatus["IMPLEMENTED"] = "implemented";
})(RegulationStatus || (exports.RegulationStatus = RegulationStatus = {}));
var ImpactLevel;
(function (ImpactLevel) {
    ImpactLevel["HIGH"] = "high";
    ImpactLevel["MEDIUM"] = "medium";
    ImpactLevel["LOW"] = "low";
})(ImpactLevel || (exports.ImpactLevel = ImpactLevel = {}));
var RecurrenceFrequency;
(function (RecurrenceFrequency) {
    RecurrenceFrequency["DAILY"] = "daily";
    RecurrenceFrequency["WEEKLY"] = "weekly";
    RecurrenceFrequency["MONTHLY"] = "monthly";
})(RecurrenceFrequency || (exports.RecurrenceFrequency = RecurrenceFrequency = {}));
var VisualizationType;
(function (VisualizationType) {
    VisualizationType["TABLE"] = "table";
    VisualizationType["CHART"] = "chart";
    VisualizationType["GRAPH"] = "graph";
})(VisualizationType || (exports.VisualizationType = VisualizationType = {}));
var ReportFrequency;
(function (ReportFrequency) {
    ReportFrequency["DAILY"] = "daily";
    ReportFrequency["WEEKLY"] = "weekly";
    ReportFrequency["MONTHLY"] = "monthly";
})(ReportFrequency || (exports.ReportFrequency = ReportFrequency = {}));
var TrendDirection;
(function (TrendDirection) {
    TrendDirection["UP"] = "up";
    TrendDirection["DOWN"] = "down";
    TrendDirection["STABLE"] = "stable";
})(TrendDirection || (exports.TrendDirection = TrendDirection = {}));
//# sourceMappingURL=enums.js.map