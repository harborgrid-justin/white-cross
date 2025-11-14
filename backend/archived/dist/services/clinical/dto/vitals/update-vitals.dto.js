"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVitalsDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const record_vitals_dto_1 = require("./record-vitals.dto");
class UpdateVitalsDto extends (0, swagger_1.PartialType)(record_vitals_dto_1.RecordVitalsDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateVitalsDto = UpdateVitalsDto;
//# sourceMappingURL=update-vitals.dto.js.map