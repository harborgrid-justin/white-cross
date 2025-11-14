"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthDomainUpdateChronicConditionDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_chronic_condition_dto_1 = require("./create-chronic-condition.dto");
class HealthDomainUpdateChronicConditionDto extends (0, swagger_1.PartialType)(create_chronic_condition_dto_1.HealthDomainCreateChronicConditionDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.HealthDomainUpdateChronicConditionDto = HealthDomainUpdateChronicConditionDto;
//# sourceMappingURL=update-chronic-condition.dto.js.map