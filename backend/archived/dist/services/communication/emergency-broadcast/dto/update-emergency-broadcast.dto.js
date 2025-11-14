"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEmergencyBroadcastDto = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const create_emergency_broadcast_dto_1 = require("./create-emergency-broadcast.dto");
class UpdateEmergencyBroadcastDto extends (0, mapped_types_1.PartialType)(create_emergency_broadcast_dto_1.CreateEmergencyBroadcastDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateEmergencyBroadcastDto = UpdateEmergencyBroadcastDto;
//# sourceMappingURL=update-emergency-broadcast.dto.js.map