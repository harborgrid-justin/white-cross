"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHealthRecordMedicationDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_medication_dto_1 = require("./create-medication.dto");
class UpdateHealthRecordMedicationDto extends (0, swagger_1.PartialType)(create_medication_dto_1.HealthRecordCreateMedicationDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateHealthRecordMedicationDto = UpdateHealthRecordMedicationDto;
//# sourceMappingURL=update-medication.dto.js.map