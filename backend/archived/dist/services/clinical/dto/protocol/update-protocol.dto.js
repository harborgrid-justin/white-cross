"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProtocolDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_protocol_dto_1 = require("./create-protocol.dto");
class UpdateProtocolDto extends (0, swagger_1.PartialType)(create_protocol_dto_1.CreateProtocolDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateProtocolDto = UpdateProtocolDto;
//# sourceMappingURL=update-protocol.dto.js.map