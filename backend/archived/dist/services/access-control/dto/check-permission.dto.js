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
exports.CheckPermissionDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CheckPermissionDto {
    resource;
    action;
    static _OPENAPI_METADATA_FACTORY() {
        return { resource: { required: true, type: () => String }, action: { required: true, type: () => String } };
    }
}
exports.CheckPermissionDto = CheckPermissionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Resource to check permission for',
        example: 'students',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckPermissionDto.prototype, "resource", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Action to check permission for',
        example: 'read',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckPermissionDto.prototype, "action", void 0);
//# sourceMappingURL=check-permission.dto.js.map