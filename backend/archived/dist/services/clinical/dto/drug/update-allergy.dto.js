"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicalUpdateAllergyDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const add_allergy_dto_1 = require("./add-allergy.dto");
class ClinicalUpdateAllergyDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(add_allergy_dto_1.AddAllergyDto, ['studentId', 'drugId'])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.ClinicalUpdateAllergyDto = ClinicalUpdateAllergyDto;
//# sourceMappingURL=update-allergy.dto.js.map