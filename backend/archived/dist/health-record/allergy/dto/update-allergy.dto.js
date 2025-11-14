"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAllergyDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_allergy_dto_1 = require("./create-allergy.dto");
class UpdateAllergyDto extends (0, swagger_1.PartialType)(create_allergy_dto_1.CreateAllergyDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateAllergyDto = UpdateAllergyDto;
//# sourceMappingURL=update-allergy.dto.js.map