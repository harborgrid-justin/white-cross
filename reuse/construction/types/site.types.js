"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceType = exports.EquipmentStatus = exports.DeficiencyStatus = exports.DeficiencySeverity = exports.SiteInspectionStatus = exports.SiteInspectionType = exports.CommunicationStatus = exports.CommunicationType = exports.ActionItemStatus = exports.MeetingType = exports.DelayType = exports.EmergencyType = exports.InvestigationStatus = exports.IncidentSeverity = exports.IncidentType = exports.AccessLevel = exports.SiteStatus = void 0;
var SiteStatus;
(function (SiteStatus) {
    SiteStatus["PLANNING"] = "planning";
    SiteStatus["ACTIVE"] = "active";
    SiteStatus["SUSPENDED"] = "suspended";
    SiteStatus["COMPLETED"] = "completed";
    SiteStatus["CLOSED"] = "closed";
})(SiteStatus || (exports.SiteStatus = SiteStatus = {}));
var AccessLevel;
(function (AccessLevel) {
    AccessLevel["FULL"] = "full";
    AccessLevel["RESTRICTED"] = "restricted";
    AccessLevel["ESCORT_REQUIRED"] = "escort_required";
    AccessLevel["PROHIBITED"] = "prohibited";
})(AccessLevel || (exports.AccessLevel = AccessLevel = {}));
var IncidentType;
(function (IncidentType) {
    IncidentType["INJURY"] = "injury";
    IncidentType["NEAR_MISS"] = "near_miss";
    IncidentType["PROPERTY_DAMAGE"] = "property_damage";
    IncidentType["ENVIRONMENTAL"] = "environmental";
    IncidentType["SECURITY"] = "security";
})(IncidentType || (exports.IncidentType = IncidentType = {}));
var IncidentSeverity;
(function (IncidentSeverity) {
    IncidentSeverity["MINOR"] = "minor";
    IncidentSeverity["MODERATE"] = "moderate";
    IncidentSeverity["SERIOUS"] = "serious";
    IncidentSeverity["CRITICAL"] = "critical";
    IncidentSeverity["FATALITY"] = "fatality";
})(IncidentSeverity || (exports.IncidentSeverity = IncidentSeverity = {}));
var InvestigationStatus;
(function (InvestigationStatus) {
    InvestigationStatus["PENDING"] = "pending";
    InvestigationStatus["IN_PROGRESS"] = "in_progress";
    InvestigationStatus["COMPLETED"] = "completed";
})(InvestigationStatus || (exports.InvestigationStatus = InvestigationStatus = {}));
var EmergencyType;
(function (EmergencyType) {
    EmergencyType["FIRE"] = "fire";
    EmergencyType["MEDICAL"] = "medical";
    EmergencyType["WEATHER"] = "weather";
    EmergencyType["HAZMAT"] = "hazmat";
    EmergencyType["EVACUATION"] = "evacuation";
    EmergencyType["SECURITY"] = "security";
})(EmergencyType || (exports.EmergencyType = EmergencyType = {}));
var DelayType;
(function (DelayType) {
    DelayType["WEATHER"] = "weather";
    DelayType["MATERIAL"] = "material";
    DelayType["EQUIPMENT"] = "equipment";
    DelayType["LABOR"] = "labor";
    DelayType["PERMIT"] = "permit";
    DelayType["DESIGN"] = "design";
    DelayType["OTHER"] = "other";
})(DelayType || (exports.DelayType = DelayType = {}));
var MeetingType;
(function (MeetingType) {
    MeetingType["SAFETY"] = "safety";
    MeetingType["COORDINATION"] = "coordination";
    MeetingType["TOOLBOX"] = "toolbox";
    MeetingType["PLANNING"] = "planning";
    MeetingType["CLOSEOUT"] = "closeout";
    MeetingType["OWNER"] = "owner";
})(MeetingType || (exports.MeetingType = MeetingType = {}));
var ActionItemStatus;
(function (ActionItemStatus) {
    ActionItemStatus["OPEN"] = "open";
    ActionItemStatus["IN_PROGRESS"] = "in_progress";
    ActionItemStatus["COMPLETED"] = "completed";
    ActionItemStatus["CANCELLED"] = "cancelled";
})(ActionItemStatus || (exports.ActionItemStatus = ActionItemStatus = {}));
var CommunicationType;
(function (CommunicationType) {
    CommunicationType["EMAIL"] = "email";
    CommunicationType["PHONE"] = "phone";
    CommunicationType["MEETING"] = "meeting";
    CommunicationType["RFI"] = "rfi";
    CommunicationType["SUBMITTAL"] = "submittal";
    CommunicationType["CHANGE_ORDER"] = "change_order";
    CommunicationType["NOTICE"] = "notice";
})(CommunicationType || (exports.CommunicationType = CommunicationType = {}));
var CommunicationStatus;
(function (CommunicationStatus) {
    CommunicationStatus["SENT"] = "sent";
    CommunicationStatus["RECEIVED"] = "received";
    CommunicationStatus["ACKNOWLEDGED"] = "acknowledged";
    CommunicationStatus["RESPONDED"] = "responded";
    CommunicationStatus["CLOSED"] = "closed";
})(CommunicationStatus || (exports.CommunicationStatus = CommunicationStatus = {}));
var SiteInspectionType;
(function (SiteInspectionType) {
    SiteInspectionType["SAFETY"] = "safety";
    SiteInspectionType["QUALITY"] = "quality";
    SiteInspectionType["PROGRESS"] = "progress";
    SiteInspectionType["COMPLIANCE"] = "compliance";
    SiteInspectionType["FINAL"] = "final";
})(SiteInspectionType || (exports.SiteInspectionType = SiteInspectionType = {}));
var SiteInspectionStatus;
(function (SiteInspectionStatus) {
    SiteInspectionStatus["PASSED"] = "passed";
    SiteInspectionStatus["FAILED"] = "failed";
    SiteInspectionStatus["CONDITIONAL"] = "conditional";
    SiteInspectionStatus["PENDING"] = "pending";
})(SiteInspectionStatus || (exports.SiteInspectionStatus = SiteInspectionStatus = {}));
var DeficiencySeverity;
(function (DeficiencySeverity) {
    DeficiencySeverity["MINOR"] = "minor";
    DeficiencySeverity["MAJOR"] = "major";
    DeficiencySeverity["CRITICAL"] = "critical";
})(DeficiencySeverity || (exports.DeficiencySeverity = DeficiencySeverity = {}));
var DeficiencyStatus;
(function (DeficiencyStatus) {
    DeficiencyStatus["OPEN"] = "open";
    DeficiencyStatus["IN_PROGRESS"] = "in_progress";
    DeficiencyStatus["RESOLVED"] = "resolved";
    DeficiencyStatus["VERIFIED"] = "verified";
})(DeficiencyStatus || (exports.DeficiencyStatus = DeficiencyStatus = {}));
var EquipmentStatus;
(function (EquipmentStatus) {
    EquipmentStatus["ACTIVE"] = "active";
    EquipmentStatus["MAINTENANCE"] = "maintenance";
    EquipmentStatus["IDLE"] = "idle";
    EquipmentStatus["REMOVED"] = "removed";
})(EquipmentStatus || (exports.EquipmentStatus = EquipmentStatus = {}));
var MaintenanceType;
(function (MaintenanceType) {
    MaintenanceType["INSPECTION"] = "inspection";
    MaintenanceType["REPAIR"] = "repair";
    MaintenanceType["SERVICE"] = "service";
    MaintenanceType["CALIBRATION"] = "calibration";
})(MaintenanceType || (exports.MaintenanceType = MaintenanceType = {}));
//# sourceMappingURL=site.types.js.map