"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastStatusResponseDto = exports.DeliveryStatsDto = void 0;
const openapi = require("@nestjs/swagger");
class DeliveryStatsDto {
    total;
    delivered;
    failed;
    pending;
    acknowledged;
    static _OPENAPI_METADATA_FACTORY() {
        return { total: { required: true, type: () => Number }, delivered: { required: true, type: () => Number }, failed: { required: true, type: () => Number }, pending: { required: true, type: () => Number }, acknowledged: { required: true, type: () => Number } };
    }
}
exports.DeliveryStatsDto = DeliveryStatsDto;
class BroadcastStatusResponseDto {
    broadcast;
    deliveryStats;
    recentDeliveries;
    static _OPENAPI_METADATA_FACTORY() {
        return { broadcast: { required: true, type: () => Object }, deliveryStats: { required: true, type: () => require("./broadcast-status-response.dto").DeliveryStatsDto }, recentDeliveries: { required: true, type: () => [Object] } };
    }
}
exports.BroadcastStatusResponseDto = BroadcastStatusResponseDto;
//# sourceMappingURL=broadcast-status-response.dto.js.map