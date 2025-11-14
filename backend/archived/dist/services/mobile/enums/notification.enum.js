"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryStatus = exports.NotificationStatus = exports.NotificationCategory = exports.NotificationPriority = exports.NotificationPlatform = void 0;
var NotificationPlatform;
(function (NotificationPlatform) {
    NotificationPlatform["FCM"] = "FCM";
    NotificationPlatform["APNS"] = "APNS";
    NotificationPlatform["WEB_PUSH"] = "WEB_PUSH";
    NotificationPlatform["SMS"] = "SMS";
    NotificationPlatform["EMAIL"] = "EMAIL";
})(NotificationPlatform || (exports.NotificationPlatform = NotificationPlatform = {}));
var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority["CRITICAL"] = "CRITICAL";
    NotificationPriority["HIGH"] = "HIGH";
    NotificationPriority["NORMAL"] = "NORMAL";
    NotificationPriority["LOW"] = "LOW";
})(NotificationPriority || (exports.NotificationPriority = NotificationPriority = {}));
var NotificationCategory;
(function (NotificationCategory) {
    NotificationCategory["MEDICATION"] = "MEDICATION";
    NotificationCategory["APPOINTMENT"] = "APPOINTMENT";
    NotificationCategory["INCIDENT"] = "INCIDENT";
    NotificationCategory["SCREENING"] = "SCREENING";
    NotificationCategory["IMMUNIZATION"] = "IMMUNIZATION";
    NotificationCategory["MESSAGE"] = "MESSAGE";
    NotificationCategory["EMERGENCY"] = "EMERGENCY";
    NotificationCategory["REMINDER"] = "REMINDER";
    NotificationCategory["ALERT"] = "ALERT";
    NotificationCategory["SYSTEM"] = "SYSTEM";
})(NotificationCategory || (exports.NotificationCategory = NotificationCategory = {}));
var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus["PENDING"] = "PENDING";
    NotificationStatus["SCHEDULED"] = "SCHEDULED";
    NotificationStatus["SENDING"] = "SENDING";
    NotificationStatus["DELIVERED"] = "DELIVERED";
    NotificationStatus["FAILED"] = "FAILED";
    NotificationStatus["EXPIRED"] = "EXPIRED";
})(NotificationStatus || (exports.NotificationStatus = NotificationStatus = {}));
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["SUCCESS"] = "SUCCESS";
    DeliveryStatus["FAILED"] = "FAILED";
    DeliveryStatus["INVALID_TOKEN"] = "INVALID_TOKEN";
    DeliveryStatus["RATE_LIMITED"] = "RATE_LIMITED";
    DeliveryStatus["TIMEOUT"] = "TIMEOUT";
})(DeliveryStatus || (exports.DeliveryStatus = DeliveryStatus = {}));
//# sourceMappingURL=notification.enum.js.map