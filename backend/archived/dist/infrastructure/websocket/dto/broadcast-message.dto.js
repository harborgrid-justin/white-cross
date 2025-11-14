"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastMessageDto = void 0;
const openapi = require("@nestjs/swagger");
class BroadcastMessageDto {
    timestamp;
    constructor(data) {
        Object.assign(this, data);
        this.timestamp = new Date().toISOString();
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { timestamp: { required: true, type: () => String, description: "ISO timestamp when the message was created" } };
    }
}
exports.BroadcastMessageDto = BroadcastMessageDto;
//# sourceMappingURL=broadcast-message.dto.js.map