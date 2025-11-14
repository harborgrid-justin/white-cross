"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendBroadcastResponseDto = void 0;
const openapi = require("@nestjs/swagger");
class SendBroadcastResponseDto {
    success;
    totalRecipients;
    sent;
    failed;
    static _OPENAPI_METADATA_FACTORY() {
        return { success: { required: true, type: () => Boolean }, totalRecipients: { required: true, type: () => Number }, sent: { required: true, type: () => Number }, failed: { required: true, type: () => Number } };
    }
}
exports.SendBroadcastResponseDto = SendBroadcastResponseDto;
//# sourceMappingURL=send-broadcast-response.dto.js.map