"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryStatus = exports.RecipientType = exports.CommunicationChannel = exports.BroadcastStatus = exports.BroadcastAudience = exports.EmergencyPriority = exports.EmergencyType = void 0;
var EmergencyType;
(function (EmergencyType) {
    EmergencyType["ACTIVE_THREAT"] = "ACTIVE_THREAT";
    EmergencyType["MEDICAL_EMERGENCY"] = "MEDICAL_EMERGENCY";
    EmergencyType["FIRE"] = "FIRE";
    EmergencyType["NATURAL_DISASTER"] = "NATURAL_DISASTER";
    EmergencyType["LOCKDOWN"] = "LOCKDOWN";
    EmergencyType["EVACUATION"] = "EVACUATION";
    EmergencyType["SHELTER_IN_PLACE"] = "SHELTER_IN_PLACE";
    EmergencyType["WEATHER_ALERT"] = "WEATHER_ALERT";
    EmergencyType["TRANSPORTATION"] = "TRANSPORTATION";
    EmergencyType["FACILITY_ISSUE"] = "FACILITY_ISSUE";
    EmergencyType["SCHOOL_CLOSURE"] = "SCHOOL_CLOSURE";
    EmergencyType["EARLY_DISMISSAL"] = "EARLY_DISMISSAL";
    EmergencyType["GENERAL_ANNOUNCEMENT"] = "GENERAL_ANNOUNCEMENT";
})(EmergencyType || (exports.EmergencyType = EmergencyType = {}));
var EmergencyPriority;
(function (EmergencyPriority) {
    EmergencyPriority["CRITICAL"] = "CRITICAL";
    EmergencyPriority["HIGH"] = "HIGH";
    EmergencyPriority["MEDIUM"] = "MEDIUM";
    EmergencyPriority["LOW"] = "LOW";
})(EmergencyPriority || (exports.EmergencyPriority = EmergencyPriority = {}));
var BroadcastAudience;
(function (BroadcastAudience) {
    BroadcastAudience["ALL_PARENTS"] = "ALL_PARENTS";
    BroadcastAudience["ALL_STAFF"] = "ALL_STAFF";
    BroadcastAudience["ALL_STUDENTS"] = "ALL_STUDENTS";
    BroadcastAudience["SPECIFIC_GRADE"] = "SPECIFIC_GRADE";
    BroadcastAudience["SPECIFIC_SCHOOL"] = "SPECIFIC_SCHOOL";
    BroadcastAudience["SPECIFIC_CLASS"] = "SPECIFIC_CLASS";
    BroadcastAudience["SPECIFIC_GROUP"] = "SPECIFIC_GROUP";
    BroadcastAudience["EMERGENCY_CONTACTS"] = "EMERGENCY_CONTACTS";
})(BroadcastAudience || (exports.BroadcastAudience = BroadcastAudience = {}));
var BroadcastStatus;
(function (BroadcastStatus) {
    BroadcastStatus["DRAFT"] = "DRAFT";
    BroadcastStatus["SENDING"] = "SENDING";
    BroadcastStatus["SENT"] = "SENT";
    BroadcastStatus["FAILED"] = "FAILED";
    BroadcastStatus["CANCELLED"] = "CANCELLED";
})(BroadcastStatus || (exports.BroadcastStatus = BroadcastStatus = {}));
var CommunicationChannel;
(function (CommunicationChannel) {
    CommunicationChannel["SMS"] = "SMS";
    CommunicationChannel["EMAIL"] = "EMAIL";
    CommunicationChannel["PUSH"] = "PUSH";
    CommunicationChannel["VOICE"] = "VOICE";
})(CommunicationChannel || (exports.CommunicationChannel = CommunicationChannel = {}));
var RecipientType;
(function (RecipientType) {
    RecipientType["PARENT"] = "PARENT";
    RecipientType["STUDENT"] = "STUDENT";
    RecipientType["STAFF"] = "STAFF";
})(RecipientType || (exports.RecipientType = RecipientType = {}));
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["QUEUED"] = "QUEUED";
    DeliveryStatus["SENDING"] = "SENDING";
    DeliveryStatus["DELIVERED"] = "DELIVERED";
    DeliveryStatus["FAILED"] = "FAILED";
    DeliveryStatus["BOUNCED"] = "BOUNCED";
})(DeliveryStatus || (exports.DeliveryStatus = DeliveryStatus = {}));
//# sourceMappingURL=emergency-broadcast.enums.js.map