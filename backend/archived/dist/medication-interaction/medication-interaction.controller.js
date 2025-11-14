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
var MedicationInteractionController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicationInteractionController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const medication_interaction_service_1 = require("./medication-interaction.service");
const dto_1 = require("./dto");
const base_1 = require("../common/base");
let MedicationInteractionController = MedicationInteractionController_1 = class MedicationInteractionController extends base_1.BaseController {
    medicationInteractionService;
    logger = new common_1.Logger(MedicationInteractionController_1.name);
    constructor(medicationInteractionService) {
        super();
        this.medicationInteractionService = medicationInteractionService;
    }
    async checkStudentMedications(studentId) {
        this.logger.log(`Checking medication interactions for student ${studentId}`);
        return this.medicationInteractionService.checkStudentMedications(studentId);
    }
    async checkNewMedication(studentId, checkNewMedicationDto) {
        this.logger.log(`Checking new medication ${checkNewMedicationDto.medicationName} for student ${studentId}`);
        return this.medicationInteractionService.checkNewMedication(studentId, checkNewMedicationDto.medicationName);
    }
    async getInteractionRecommendations(studentId) {
        this.logger.log(`Getting interaction recommendations for student ${studentId}`);
        const recommendations = await this.medicationInteractionService.getInteractionRecommendations(studentId);
        return { recommendations };
    }
};
exports.MedicationInteractionController = MedicationInteractionController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Check interactions in student's current medications\nGET /medication-interaction/students/:studentId/check", summary: 'Check student medication interactions',
        description: 'Analyzes all current medications for a student to detect potential drug-drug interactions' }),
    (0, common_1.Get)('students/:studentId/check'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({
        name: 'studentId',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Medication interaction check completed',
        type: dto_1.InteractionCheckResultDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("./dto/interaction-check-result.dto").InteractionCheckResultDto }),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicationInteractionController.prototype, "checkStudentMedications", null);
__decorate([
    openapi.ApiOperation({ summary: "Check if new medication will interact with existing ones\nPOST /medication-interaction/students/:studentId/check-new" }),
    (0, common_1.Post)('students/:studentId/check-new'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("./dto/interaction-check-result.dto").InteractionCheckResultDto }),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CheckNewMedicationDto]),
    __metadata("design:returntype", Promise)
], MedicationInteractionController.prototype, "checkNewMedication", null);
__decorate([
    openapi.ApiOperation({ summary: "Get interaction recommendations for a student\nGET /medication-interaction/students/:studentId/recommendations" }),
    (0, common_1.Get)('students/:studentId/recommendations'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicationInteractionController.prototype, "getInteractionRecommendations", null);
exports.MedicationInteractionController = MedicationInteractionController = MedicationInteractionController_1 = __decorate([
    (0, swagger_1.ApiTags)('Medication Interactions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('medication-interactions'),
    __metadata("design:paramtypes", [medication_interaction_service_1.MedicationInteractionService])
], MedicationInteractionController);
//# sourceMappingURL=medication-interaction.controller.js.map