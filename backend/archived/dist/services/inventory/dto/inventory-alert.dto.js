"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertSummaryDto = exports.InventoryAlertDto = exports.AlertSeverity = exports.AlertType = void 0;
const openapi = require("@nestjs/swagger");
var AlertType;
(function (AlertType) {
    AlertType["LOW_STOCK"] = "LOW_STOCK";
    AlertType["OUT_OF_STOCK"] = "OUT_OF_STOCK";
    AlertType["EXPIRED"] = "EXPIRED";
    AlertType["NEAR_EXPIRY"] = "NEAR_EXPIRY";
    AlertType["MAINTENANCE_DUE"] = "MAINTENANCE_DUE";
})(AlertType || (exports.AlertType = AlertType = {}));
var AlertSeverity;
(function (AlertSeverity) {
    AlertSeverity["LOW"] = "LOW";
    AlertSeverity["MEDIUM"] = "MEDIUM";
    AlertSeverity["HIGH"] = "HIGH";
    AlertSeverity["CRITICAL"] = "CRITICAL";
})(AlertSeverity || (exports.AlertSeverity = AlertSeverity = {}));
class InventoryAlertDto {
    id;
    type;
    severity;
    message;
    itemId;
    itemName;
    daysUntilAction;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, type: { required: true, enum: require("./inventory-alert.dto").AlertType }, severity: { required: true, enum: require("./inventory-alert.dto").AlertSeverity }, message: { required: true, type: () => String }, itemId: { required: true, type: () => String }, itemName: { required: true, type: () => String }, daysUntilAction: { required: false, type: () => Number } };
    }
}
exports.InventoryAlertDto = InventoryAlertDto;
class AlertSummaryDto {
    timestamp;
    totalAlerts;
    criticalCount;
    highCount;
    mediumCount;
    lowCount;
    typeBreakdown;
    topAlerts;
    recommendations;
    static _OPENAPI_METADATA_FACTORY() {
        return { timestamp: { required: true, type: () => Date }, totalAlerts: { required: true, type: () => Number }, criticalCount: { required: true, type: () => Number }, highCount: { required: true, type: () => Number }, mediumCount: { required: true, type: () => Number }, lowCount: { required: true, type: () => Number }, typeBreakdown: { required: true, type: () => ({ LOW_STOCK: { required: true, type: () => Number }, OUT_OF_STOCK: { required: true, type: () => Number }, EXPIRED: { required: true, type: () => Number }, NEAR_EXPIRY: { required: true, type: () => Number }, MAINTENANCE_DUE: { required: true, type: () => Number } }) }, topAlerts: { required: true, type: () => [require("./inventory-alert.dto").InventoryAlertDto] }, recommendations: { required: true, type: () => [String] } };
    }
}
exports.AlertSummaryDto = AlertSummaryDto;
//# sourceMappingURL=inventory-alert.dto.js.map