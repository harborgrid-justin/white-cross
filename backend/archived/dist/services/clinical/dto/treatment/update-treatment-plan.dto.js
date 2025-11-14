"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTreatmentPlanDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_treatment_plan_dto_1 = require("./create-treatment-plan.dto");
class UpdateTreatmentPlanDto extends (0, swagger_1.PartialType)(create_treatment_plan_dto_1.CreateTreatmentPlanDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateTreatmentPlanDto = UpdateTreatmentPlanDto;
//# sourceMappingURL=update-treatment-plan.dto.js.map