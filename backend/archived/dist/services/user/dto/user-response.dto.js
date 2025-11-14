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
exports.UserListResponseDto = exports.UserResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const user_role_enum_1 = require("../enums/user-role.enum");
let UserResponseDto = class UserResponseDto {
    id;
    email;
    firstName;
    lastName;
    role;
    isActive;
    lastLogin;
    schoolId;
    districtId;
    phone;
    emailVerified;
    twoFactorEnabled;
    failedLoginAttempts;
    lockoutUntil;
    lastPasswordChange;
    mustChangePassword;
    createdAt;
    updatedAt;
    _count;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, email: { required: true, type: () => String }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, role: { required: true, enum: require("../enums/user-role.enum").UserRole }, isActive: { required: true, type: () => Boolean }, lastLogin: { required: false, type: () => Date }, schoolId: { required: false, type: () => String }, districtId: { required: false, type: () => String }, phone: { required: false, type: () => String }, emailVerified: { required: true, type: () => Boolean }, twoFactorEnabled: { required: true, type: () => Boolean }, failedLoginAttempts: { required: true, type: () => Number }, lockoutUntil: { required: false, type: () => Date }, lastPasswordChange: { required: false, type: () => Date }, mustChangePassword: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, _count: { required: false, type: () => ({ nurseManagedStudents: { required: false, type: () => Number }, appointments: { required: false, type: () => Number }, incidentReports: { required: false, type: () => Number }, medicationLogs: { required: false, type: () => Number }, inventoryTransactions: { required: false, type: () => Number } }) } };
    }
};
exports.UserResponseDto = UserResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'User ID', example: 'uuid' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'Email address', example: 'nurse@school.edu' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'First name', example: 'Jane' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'Last name', example: 'Doe' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'User role', enum: user_role_enum_1.UserRole }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "role", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'Active status', example: true }),
    __metadata("design:type", Boolean)
], UserResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Last login timestamp' }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "lastLogin", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'School ID' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "schoolId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'District ID' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "districtId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Phone number' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "phone", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'Email verified status', example: false }),
    __metadata("design:type", Boolean)
], UserResponseDto.prototype, "emailVerified", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: '2FA enabled status', example: false }),
    __metadata("design:type", Boolean)
], UserResponseDto.prototype, "twoFactorEnabled", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'Failed login attempts', example: 0 }),
    __metadata("design:type", Number)
], UserResponseDto.prototype, "failedLoginAttempts", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Lockout expiration' }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "lockoutUntil", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Last password change' }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "lastPasswordChange", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'Must change password flag', example: false }),
    __metadata("design:type", Boolean)
], UserResponseDto.prototype, "mustChangePassword", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'Created timestamp' }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'Updated timestamp' }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Activity counts' }),
    __metadata("design:type", Object)
], UserResponseDto.prototype, "_count", void 0);
exports.UserResponseDto = UserResponseDto = __decorate([
    (0, class_transformer_1.Exclude)()
], UserResponseDto);
class UserListResponseDto {
    users;
    pagination;
    static _OPENAPI_METADATA_FACTORY() {
        return { users: { required: true, type: () => [require("./user-response.dto").UserResponseDto] }, pagination: { required: true, type: () => ({ total: { required: true, type: () => Number }, page: { required: true, type: () => Number }, limit: { required: true, type: () => Number }, pages: { required: true, type: () => Number } }) } };
    }
}
exports.UserListResponseDto = UserListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [UserResponseDto] }),
    __metadata("design:type", Array)
], UserListResponseDto.prototype, "users", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pagination metadata',
        example: { total: 100, page: 1, limit: 20, pages: 5 },
    }),
    __metadata("design:type", Object)
], UserListResponseDto.prototype, "pagination", void 0);
//# sourceMappingURL=user-response.dto.js.map