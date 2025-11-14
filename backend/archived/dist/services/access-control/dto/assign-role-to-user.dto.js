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
exports.AssignRoleToUserDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AssignRoleToUserDto {
    roleId;
    static _OPENAPI_METADATA_FACTORY() {
        return { roleId: { required: true, type: () => String, format: "uuid" } };
    }
}
exports.AssignRoleToUserDto = AssignRoleToUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the role to assign',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'Role ID must be a valid UUID' }),
    __metadata("design:type", String)
], AssignRoleToUserDto.prototype, "roleId", void 0);
//# sourceMappingURL=assign-role-to-user.dto.js.map