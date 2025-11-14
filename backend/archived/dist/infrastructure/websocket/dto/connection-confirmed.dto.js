"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionConfirmedDto = void 0;
const openapi = require("@nestjs/swagger");
class ConnectionConfirmedDto {
    socketId;
    userId;
    organizationId;
    connectedAt;
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { socketId: { required: true, type: () => String, description: "Unique socket identifier" }, userId: { required: true, type: () => String, description: "Authenticated user identifier" }, organizationId: { required: true, type: () => String, description: "Organization identifier" }, connectedAt: { required: true, type: () => String, description: "ISO timestamp of connection establishment" } };
    }
}
exports.ConnectionConfirmedDto = ConnectionConfirmedDto;
//# sourceMappingURL=connection-confirmed.dto.js.map