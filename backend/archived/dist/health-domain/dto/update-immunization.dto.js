"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateImmunizationDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_immunization_dto_1 = require("./create-immunization.dto");
class UpdateImmunizationDto extends (0, swagger_1.PartialType)(create_immunization_dto_1.CreateImmunizationDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateImmunizationDto = UpdateImmunizationDto;
//# sourceMappingURL=update-immunization.dto.js.map