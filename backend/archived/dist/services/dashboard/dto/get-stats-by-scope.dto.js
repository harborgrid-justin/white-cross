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
exports.GetStatsByScopeDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class GetStatsByScopeDto {
    schoolId;
    districtId;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: false, type: () => String, format: "uuid" }, districtId: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.GetStatsByScopeDto = GetStatsByScopeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'School ID to filter dashboard data',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetStatsByScopeDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'District ID to filter dashboard data',
        example: '123e4567-e89b-12d3-a456-426614174001',
        required: false,
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetStatsByScopeDto.prototype, "districtId", void 0);
//# sourceMappingURL=get-stats-by-scope.dto.js.map