"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationFrequency = exports.CallbackStatus = exports.ClaimPriority = exports.ClaimStatus = exports.WarrantyStatus = exports.WarrantyType = void 0;
var WarrantyType;
(function (WarrantyType) {
    WarrantyType["MANUFACTURER"] = "MANUFACTURER";
    WarrantyType["CONTRACTOR"] = "CONTRACTOR";
    WarrantyType["SUBCONTRACTOR"] = "SUBCONTRACTOR";
    WarrantyType["SUPPLIER"] = "SUPPLIER";
    WarrantyType["EXTENDED"] = "EXTENDED";
    WarrantyType["LABOR"] = "LABOR";
    WarrantyType["MATERIALS"] = "MATERIALS";
    WarrantyType["WORKMANSHIP"] = "WORKMANSHIP";
    WarrantyType["SYSTEM"] = "SYSTEM";
})(WarrantyType || (exports.WarrantyType = WarrantyType = {}));
var WarrantyStatus;
(function (WarrantyStatus) {
    WarrantyStatus["DRAFT"] = "DRAFT";
    WarrantyStatus["ACTIVE"] = "ACTIVE";
    WarrantyStatus["PENDING_ACTIVATION"] = "PENDING_ACTIVATION";
    WarrantyStatus["EXPIRING_SOON"] = "EXPIRING_SOON";
    WarrantyStatus["EXPIRED"] = "EXPIRED";
    WarrantyStatus["RENEWED"] = "RENEWED";
    WarrantyStatus["TERMINATED"] = "TERMINATED";
    WarrantyStatus["SUSPENDED"] = "SUSPENDED";
})(WarrantyStatus || (exports.WarrantyStatus = WarrantyStatus = {}));
var ClaimStatus;
(function (ClaimStatus) {
    ClaimStatus["DRAFT"] = "DRAFT";
    ClaimStatus["SUBMITTED"] = "SUBMITTED";
    ClaimStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    ClaimStatus["APPROVED"] = "APPROVED";
    ClaimStatus["REJECTED"] = "REJECTED";
    ClaimStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ClaimStatus["COMPLETED"] = "COMPLETED";
    ClaimStatus["CLOSED"] = "CLOSED";
    ClaimStatus["DISPUTED"] = "DISPUTED";
})(ClaimStatus || (exports.ClaimStatus = ClaimStatus = {}));
var ClaimPriority;
(function (ClaimPriority) {
    ClaimPriority["LOW"] = "LOW";
    ClaimPriority["MEDIUM"] = "MEDIUM";
    ClaimPriority["HIGH"] = "HIGH";
    ClaimPriority["CRITICAL"] = "CRITICAL";
    ClaimPriority["EMERGENCY"] = "EMERGENCY";
})(ClaimPriority || (exports.ClaimPriority = ClaimPriority = {}));
var CallbackStatus;
(function (CallbackStatus) {
    CallbackStatus["SCHEDULED"] = "SCHEDULED";
    CallbackStatus["CONFIRMED"] = "CONFIRMED";
    CallbackStatus["IN_PROGRESS"] = "IN_PROGRESS";
    CallbackStatus["COMPLETED"] = "COMPLETED";
    CallbackStatus["CANCELLED"] = "CANCELLED";
    CallbackStatus["NO_SHOW"] = "NO_SHOW";
    CallbackStatus["RESCHEDULED"] = "RESCHEDULED";
})(CallbackStatus || (exports.CallbackStatus = CallbackStatus = {}));
var NotificationFrequency;
(function (NotificationFrequency) {
    NotificationFrequency["IMMEDIATE"] = "IMMEDIATE";
    NotificationFrequency["DAILY"] = "DAILY";
    NotificationFrequency["WEEKLY"] = "WEEKLY";
    NotificationFrequency["MONTHLY"] = "MONTHLY";
    NotificationFrequency["QUARTERLY"] = "QUARTERLY";
})(NotificationFrequency || (exports.NotificationFrequency = NotificationFrequency = {}));
//# sourceMappingURL=warranty.types.js.map