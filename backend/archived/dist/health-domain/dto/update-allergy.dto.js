"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthDomainUpdateAllergyDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_allergy_dto_1 = require("./create-allergy.dto");
class HealthDomainUpdateAllergyDto extends (0, swagger_1.PartialType)(create_allergy_dto_1.HealthDomainCreateAllergyDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.HealthDomainUpdateAllergyDto = HealthDomainUpdateAllergyDto;
//# sourceMappingURL=update-allergy.dto.js.map