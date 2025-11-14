"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateChronicConditionDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_chronic_condition_dto_1 = require("./create-chronic-condition.dto");
class UpdateChronicConditionDto extends (0, swagger_1.PartialType)(create_chronic_condition_dto_1.CreateChronicConditionDto) {
    studentId;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: false } };
    }
}
exports.UpdateChronicConditionDto = UpdateChronicConditionDto;
//# sourceMappingURL=update-chronic-condition.dto.js.map