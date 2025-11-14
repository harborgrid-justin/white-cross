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
exports.UpdateDrugDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const add_drug_dto_1 = require("./add-drug.dto");
const class_validator_1 = require("class-validator");
class UpdateDrugDto extends (0, swagger_1.PartialType)(add_drug_dto_1.AddDrugDto) {
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { isActive: { required: false, type: () => Boolean } };
    }
}
exports.UpdateDrugDto = UpdateDrugDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Active status of the drug',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDrugDto.prototype, "isActive", void 0);
//# sourceMappingURL=update-drug.dto.js.map