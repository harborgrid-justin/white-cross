"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthDomainUpdateRecordDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_health_record_dto_1 = require("./create-health-record.dto");
class HealthDomainUpdateRecordDto extends (0, swagger_1.PartialType)(create_health_record_dto_1.HealthDomainCreateRecordDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.HealthDomainUpdateRecordDto = HealthDomainUpdateRecordDto;
//# sourceMappingURL=update-health-record.dto.js.map