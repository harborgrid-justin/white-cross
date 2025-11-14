"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCarePlanDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateCarePlanDto {
    carePlan;
    static _OPENAPI_METADATA_FACTORY() {
        return { carePlan: { required: true, type: () => String, minLength: 10 } };
    }
}
exports.UpdateCarePlanDto = UpdateCarePlanDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated care plan documentation',
        example: 'Updated care plan:\n1. Daily inhaler use before physical activity\n2. Monitor for symptoms during recess\n3. Emergency inhaler in nurse office',
        minLength: 10,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    __metadata("design:type", String)
], UpdateCarePlanDto.prototype, "carePlan", void 0);
//# sourceMappingURL=update-care-plan.dto.js.map