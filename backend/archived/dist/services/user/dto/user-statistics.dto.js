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
exports.UserStatisticsDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class UserStatisticsDto {
    total;
    active;
    inactive;
    byRole;
    recentLogins;
    static _OPENAPI_METADATA_FACTORY() {
        return { total: { required: true, type: () => Number }, active: { required: true, type: () => Number }, inactive: { required: true, type: () => Number }, byRole: { required: true, type: () => Object }, recentLogins: { required: true, type: () => Number } };
    }
}
exports.UserStatisticsDto = UserStatisticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of users', example: 150 }),
    __metadata("design:type", Number)
], UserStatisticsDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of active users', example: 140 }),
    __metadata("design:type", Number)
], UserStatisticsDto.prototype, "active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of inactive users', example: 10 }),
    __metadata("design:type", Number)
], UserStatisticsDto.prototype, "inactive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User count by role',
        example: { NURSE: 80, ADMIN: 5, SCHOOL_ADMIN: 40, VIEWER: 25 },
    }),
    __metadata("design:type", Object)
], UserStatisticsDto.prototype, "byRole", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Users logged in within last 30 days',
        example: 120,
    }),
    __metadata("design:type", Number)
], UserStatisticsDto.prototype, "recentLogins", void 0);
//# sourceMappingURL=user-statistics.dto.js.map