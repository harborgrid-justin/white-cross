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
exports.AdvancedFeaturesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const advanced_features_service_1 = require("./advanced-features.service");
const record_screening_dto_1 = require("./dto/record-screening.dto");
const record_measurement_dto_1 = require("./dto/record-measurement.dto");
const send_emergency_notification_dto_1 = require("./dto/send-emergency-notification.dto");
const scan_barcode_dto_1 = require("./dto/scan-barcode.dto");
const verify_medication_administration_dto_1 = require("./dto/verify-medication-administration.dto");
const base_1 = require("../common/base");
let AdvancedFeaturesController = class AdvancedFeaturesController extends base_1.BaseController {
    advancedFeaturesService;
    constructor(advancedFeaturesService) {
        super();
        this.advancedFeaturesService = advancedFeaturesService;
    }
    async recordScreening(screeningData) {
        return this.advancedFeaturesService.recordScreening(screeningData);
    }
    async getScreeningHistory(studentId) {
        return this.advancedFeaturesService.getScreeningHistory(studentId);
    }
    async recordMeasurement(measurementData) {
        return this.advancedFeaturesService.recordMeasurement(measurementData);
    }
    async analyzeGrowthTrend(studentId) {
        return this.advancedFeaturesService.analyzeGrowthTrend(studentId);
    }
    async getImmunizationForecast(studentId) {
        return this.advancedFeaturesService.getImmunizationForecast(studentId);
    }
    async sendEmergencyNotification(notificationData) {
        return this.advancedFeaturesService.sendEmergencyNotification(notificationData);
    }
    async getEmergencyHistory(studentId, limit) {
        return this.advancedFeaturesService.getEmergencyHistory(studentId, limit);
    }
    async scanBarcode(scanData) {
        return this.advancedFeaturesService.scanBarcode(scanData);
    }
    async verifyMedicationAdministration(verificationData) {
        return this.advancedFeaturesService.verifyMedicationAdministration(verificationData);
    }
};
exports.AdvancedFeaturesController = AdvancedFeaturesController;
__decorate([
    (0, common_1.Post)('screenings'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Record health screening',
        description: 'Records a health screening (vision, hearing, scoliosis, etc.) for a student with comprehensive results tracking.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Screening recorded successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },
                studentId: { type: 'string', format: 'uuid' },
                screeningType: { type: 'string', example: 'VISION' },
                results: { type: 'object' },
                createdAt: { type: 'string', format: 'date-time' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid screening data - validation errors',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [record_screening_dto_1.RecordScreeningDto]),
    __metadata("design:returntype", Promise)
], AdvancedFeaturesController.prototype, "recordScreening", null);
__decorate([
    (0, common_1.Get)('screenings/student/:studentId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get screening history',
        description: 'Retrieves complete screening history for a specific student including all screening types and results.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'studentId',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'screeningType',
        required: false,
        description: 'Filter by screening type (VISION, HEARING, SCOLIOSIS, etc.)',
        type: 'string',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Maximum number of records to return',
        type: 'number',
        example: 10,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Screening history retrieved successfully',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    screeningType: { type: 'string' },
                    results: { type: 'object' },
                    screenerName: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('studentId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdvancedFeaturesController.prototype, "getScreeningHistory", null);
__decorate([
    (0, common_1.Post)('growth/measurements'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Record growth measurement',
        description: 'Records height, weight, and BMI measurements for student growth tracking.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Measurement recorded successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid measurement data',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [record_measurement_dto_1.RecordMeasurementDto]),
    __metadata("design:returntype", Promise)
], AdvancedFeaturesController.prototype, "recordMeasurement", null);
__decorate([
    (0, common_1.Get)('growth/trend/:studentId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Analyze growth trend',
        description: 'Analyzes growth trends for a student and generates recommendations.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'studentId',
        description: 'Student UUID',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Growth trend analysis completed',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('studentId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdvancedFeaturesController.prototype, "analyzeGrowthTrend", null);
__decorate([
    (0, common_1.Get)('immunization/forecast/:studentId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get immunization forecast',
        description: 'Generates immunization forecast showing upcoming, overdue, and completed immunizations.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'studentId',
        description: 'Student UUID',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Immunization forecast generated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('studentId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdvancedFeaturesController.prototype, "getImmunizationForecast", null);
__decorate([
    (0, common_1.Post)('emergency/notifications'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Send emergency notification',
        description: 'Sends emergency notification via multiple channels (SMS, email, push, in-app).',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Emergency notification sent successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid notification data',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_emergency_notification_dto_1.SendEmergencyNotificationDto]),
    __metadata("design:returntype", Promise)
], AdvancedFeaturesController.prototype, "sendEmergencyNotification", null);
__decorate([
    (0, common_1.Get)('emergency/history'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get emergency notification history',
        description: 'Retrieves emergency notification history, optionally filtered by student.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'studentId',
        required: false,
        description: 'Filter by student UUID',
        schema: { format: 'uuid' },
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: 'number',
        description: 'Limit number of results',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Emergency history retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('studentId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AdvancedFeaturesController.prototype, "getEmergencyHistory", null);
__decorate([
    (0, common_1.Post)('barcode/scan'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Scan barcode',
        description: 'Scans and identifies a barcode (student, medication, nurse, inventory, equipment).',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Barcode scanned successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid barcode data',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [scan_barcode_dto_1.AdvancedFeaturesScanBarcodeDto]),
    __metadata("design:returntype", Promise)
], AdvancedFeaturesController.prototype, "scanBarcode", null);
__decorate([
    (0, common_1.Post)('barcode/verify-medication'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Verify medication administration',
        description: 'Verifies medication administration using three-barcode scan (student, medication, nurse) with Five Rights Check.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Medication administration verification completed',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid verification data',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_medication_administration_dto_1.VerifyMedicationAdministrationDto]),
    __metadata("design:returntype", Promise)
], AdvancedFeaturesController.prototype, "verifyMedicationAdministration", null);
exports.AdvancedFeaturesController = AdvancedFeaturesController = __decorate([
    (0, swagger_1.ApiTags)('Advanced Features'),
    (0, common_1.Controller)('advanced-features'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [advanced_features_service_1.AdvancedFeaturesService])
], AdvancedFeaturesController);
//# sourceMappingURL=advanced-features.controller.js.map