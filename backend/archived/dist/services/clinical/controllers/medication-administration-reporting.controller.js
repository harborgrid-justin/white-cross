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
exports.MedicationAdministrationReportingController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const administration_filters_dto_1 = require("../dto/administration/administration-filters.dto");
const base_1 = require("../../../common/base");
let MedicationAdministrationReportingController = class MedicationAdministrationReportingController extends base_1.BaseController {
    constructor() {
        super();
    }
    async getStudentAdministrationHistory(studentId, page = 1, limit = 20) {
        throw new Error('Not implemented - Awaiting service layer integration');
    }
    async getByPrescription(prescriptionId) {
        throw new Error('Not implemented - Awaiting service layer integration');
    }
    async getStatistics(nurseId, schoolId, startDate, endDate) {
        throw new Error('Not implemented - Awaiting service layer integration');
    }
    async getAdministrationHistory(filters) {
        throw new Error('Not implemented - Awaiting service layer integration');
    }
};
exports.MedicationAdministrationReportingController = MedicationAdministrationReportingController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get student administration history", summary: 'Get medication administration history for a student',
        description: 'Retrieves complete medication administration history for a specific student.' }),
    (0, common_1.Get)('student/:studentId'),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number (default: 1)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Items per page (default: 20)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Administration history retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], MedicationAdministrationReportingController.prototype, "getStudentAdministrationHistory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get administrations by prescription", summary: 'Get administration records for a prescription',
        description: 'Retrieves all administration records associated with a specific prescription.' }),
    (0, common_1.Get)('prescription/:prescriptionId'),
    (0, swagger_1.ApiParam)({ name: 'prescriptionId', description: 'Prescription ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Administration records retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('prescriptionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicationAdministrationReportingController.prototype, "getByPrescription", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get administration statistics", summary: 'Get medication administration statistics',
        description: 'Retrieves aggregated statistics on medication administrations.' }),
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiQuery)({
        name: 'nurseId',
        required: false,
        type: String,
        description: 'Filter by nurse',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'schoolId',
        required: false,
        type: String,
        description: 'Filter by school',
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
        description: 'Statistics retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('nurseId')),
    __param(1, (0, common_1.Query)('schoolId')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], MedicationAdministrationReportingController.prototype, "getStatistics", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get administration history with filters", summary: 'Get administration history with filters',
        description: 'Retrieves administration history with comprehensive filtering options.' }),
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Administration history retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [administration_filters_dto_1.AdministrationHistoryFiltersDto]),
    __metadata("design:returntype", Promise)
], MedicationAdministrationReportingController.prototype, "getAdministrationHistory", null);
exports.MedicationAdministrationReportingController = MedicationAdministrationReportingController = __decorate([
    (0, swagger_1.ApiTags)('Medication Administration'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('medications/administrations'),
    __metadata("design:paramtypes", [])
], MedicationAdministrationReportingController);
//# sourceMappingURL=medication-administration-reporting.controller.js.map