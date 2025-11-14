"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthRecordUpdateDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_health_record_dto_1 = require("./create-health-record.dto");
class HealthRecordUpdateDto extends (0, swagger_1.PartialType)(create_health_record_dto_1.HealthRecordCreateDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.HealthRecordUpdateDto = HealthRecordUpdateDto;
//# sourceMappingURL=update-health-record.dto.js.map