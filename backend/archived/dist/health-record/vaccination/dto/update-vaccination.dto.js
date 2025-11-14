"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVaccinationDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_vaccination_dto_1 = require("./create-vaccination.dto");
class UpdateVaccinationDto extends (0, swagger_1.PartialType)(create_vaccination_dto_1.CreateVaccinationDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateVaccinationDto = UpdateVaccinationDto;
//# sourceMappingURL=update-vaccination.dto.js.map