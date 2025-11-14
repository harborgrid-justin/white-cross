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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicationAdministrationSchedulingController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const base_1 = require("../../../common/base");
let MedicationAdministrationSchedulingController = class MedicationAdministrationSchedulingController extends base_1.BaseController {
    constructor() {
        super();
    }
    async getDueMedications(nurseId, withinHours = 4) {
        throw new Error('Not implemented - Awaiting service layer integration');
    }
    async getOverdueAdministrations(nurseId) {
        throw new Error('Not implemented - Awaiting service layer integration');
    }
    async getUpcomingSchedule(nurseId, withinHours = 8) {
        throw new Error('Not implemented - Awaiting service layer integration');
    }
    async getMissedDoses(studentId, startDate, endDate) {
        throw new Error('Not implemented - Awaiting service layer integration');
    }
    async getTodayAdministrations(nurseId) {
        throw new Error('Not implemented - Awaiting service layer integration');
    }
    async getStudentSchedule(studentId, date) {
        throw new Error('Not implemented - Awaiting service layer integration');
    }
};
exports.MedicationAdministrationSchedulingController = MedicationAdministrationSchedulingController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get due medications", summary: 'Get medications due for administration',
        description: 'Retrieves list of medications currently due for administration.' }),
    (0, common_1.Get)('due'),
    (0, swagger_1.ApiQuery)({
        name: 'nurseId',
        required: false,
        type: String,
        description: 'Filter by assigned nurse',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'withinHours',
        required: false,
        type: Number,
        description: 'Within next N hours (default: 4)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Due medications retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('nurseId')),
    __param(1, (0, common_1.Query)('withinHours')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], MedicationAdministrationSchedulingController.prototype, "getDueMedications", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get overdue administrations", summary: 'Get overdue medication administrations',
        description: 'Retrieves medications that are past their scheduled administration time.' }),
    (0, common_1.Get)('overdue'),
    (0, swagger_1.ApiQuery)({
        name: 'nurseId',
        required: false,
        type: String,
        description: 'Filter by assigned nurse',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Overdue administrations retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('nurseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicationAdministrationSchedulingController.prototype, "getOverdueAdministrations", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get upcoming administration schedule", summary: 'Get upcoming medication administration schedule',
        description: 'Retrieves scheduled medications for upcoming time period.' }),
    (0, common_1.Get)('upcoming'),
    (0, swagger_1.ApiQuery)({
        name: 'nurseId',
        required: false,
        type: String,
        description: 'Filter by assigned nurse',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'withinHours',
        required: false,
        type: Number,
        description: 'Within next N hours (default: 8)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Upcoming schedule retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('nurseId')),
    __param(1, (0, common_1.Query)('withinHours')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], MedicationAdministrationSchedulingController.prototype, "getUpcomingSchedule", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get missed doses", summary: 'Get missed medication doses',
        description: 'Retrieves all missed dose records.' }),
    (0, common_1.Get)('missed'),
    (0, swagger_1.ApiQuery)({
        name: 'studentId',
        required: false,
        type: String,
        description: 'Filter by student',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: false,
        type: String,
        description: 'Filter from date',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: false,
        type: String,
        description: 'Filter to date',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Missed doses retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('studentId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MedicationAdministrationSchedulingController.prototype, "getMissedDoses", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get today's administrations", summary: "Get today's administrations",
        description: 'Retrieves all administrations completed today.' }),
    (0, common_1.Get)('today'),
    (0, swagger_1.ApiQuery)({
        name: 'nurseId',
        required: false,
        type: String,
        description: 'Filter by nurse',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Today's administrations retrieved successfully",
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('nurseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicationAdministrationSchedulingController.prototype, "getTodayAdministrations", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get student medication schedule", summary: 'Get student medication schedule',
        description: 'Retrieves scheduled medications for a student.' }),
    (0, common_1.Get)('student/:studentId/schedule'),
    (0, swagger_1.ApiQuery)({
        name: 'date',
        required: false,
        type: String,
        description: 'Date (ISO format, default: today)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student schedule retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('studentId')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MedicationAdministrationSchedulingController.prototype, "getStudentSchedule", null);
exports.MedicationAdministrationSchedulingController = MedicationAdministrationSchedulingController = __decorate([
    (0, swagger_1.ApiTags)('Medication Administration'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('medications/administrations'),
    __metadata("design:paramtypes", [])
], MedicationAdministrationSchedulingController);
//# sourceMappingURL=medication-administration-scheduling.controller.js.map