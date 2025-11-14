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
exports.DashboardStatsDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const trend_data_dto_1 = require("./trend-data.dto");
class DashboardStatsDto {
    totalStudents;
    activeMedications;
    todaysAppointments;
    pendingIncidents;
    medicationsDueToday;
    healthAlerts;
    recentActivityCount;
    studentTrend;
    medicationTrend;
    appointmentTrend;
    static _OPENAPI_METADATA_FACTORY() {
        return { totalStudents: { required: true, type: () => Number }, activeMedications: { required: true, type: () => Number }, todaysAppointments: { required: true, type: () => Number }, pendingIncidents: { required: true, type: () => Number }, medicationsDueToday: { required: true, type: () => Number }, healthAlerts: { required: true, type: () => Number }, recentActivityCount: { required: true, type: () => Number }, studentTrend: { required: true, type: () => require("./trend-data.dto").TrendDataDto }, medicationTrend: { required: true, type: () => require("./trend-data.dto").TrendDataDto }, appointmentTrend: { required: true, type: () => require("./trend-data.dto").TrendDataDto } };
    }
}
exports.DashboardStatsDto = DashboardStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of active students',
        example: 250,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "totalStudents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of active medication prescriptions',
        example: 45,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "activeMedications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of appointments scheduled for today',
        example: 8,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "todaysAppointments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of pending incident reports requiring follow-up',
        example: 3,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "pendingIncidents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of medications due to be administered today',
        example: 12,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "medicationsDueToday", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of critical health alerts (severe/life-threatening allergies)',
        example: 7,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "healthAlerts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Count of recent activities in the last 24 hours',
        example: 23,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "recentActivityCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student enrollment trend data',
        type: trend_data_dto_1.TrendDataDto,
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => trend_data_dto_1.TrendDataDto),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", trend_data_dto_1.TrendDataDto)
], DashboardStatsDto.prototype, "studentTrend", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Medication prescription trend data',
        type: trend_data_dto_1.TrendDataDto,
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => trend_data_dto_1.TrendDataDto),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", trend_data_dto_1.TrendDataDto)
], DashboardStatsDto.prototype, "medicationTrend", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Appointment scheduling trend data',
        type: trend_data_dto_1.TrendDataDto,
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => trend_data_dto_1.TrendDataDto),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", trend_data_dto_1.TrendDataDto)
], DashboardStatsDto.prototype, "appointmentTrend", void 0);
//# sourceMappingURL=dashboard-stats.dto.js.map