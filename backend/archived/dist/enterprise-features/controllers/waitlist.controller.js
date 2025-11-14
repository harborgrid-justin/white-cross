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
exports.WaitlistController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const waitlist_management_service_1 = require("../waitlist-management.service");
const dto_1 = require("../dto");
const base_1 = require("../../common/base");
let WaitlistController = class WaitlistController extends base_1.BaseController {
    waitlistService;
    constructor(waitlistService) {
        super();
        this.waitlistService = waitlistService;
    }
    async addToWaitlist(dto) {
        return this.waitlistService.addToWaitlist(dto.studentId, dto.appointmentType, dto.priority);
    }
    async autoFillFromWaitlist(dto) {
        return this.waitlistService.autoFillFromWaitlist(new Date(dto.appointmentSlot), dto.appointmentType);
    }
    async getWaitlistByPriority() {
        return this.waitlistService.getWaitlistByPriority();
    }
    async getWaitlistStatus(studentId) {
        return this.waitlistService.getWaitlistStatus(studentId);
    }
};
exports.WaitlistController = WaitlistController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Add student to waitlist',
        description: 'Adds a student to the intelligent waitlist system with priority scoring based on medical urgency and appointment type.',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.AddToWaitlistDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Student added to waitlist successfully',
        type: dto_1.WaitlistEntryResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Student not found' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AddToWaitlistDto]),
    __metadata("design:returntype", Promise)
], WaitlistController.prototype, "addToWaitlist", null);
__decorate([
    (0, common_1.Post)('auto-fill'),
    (0, swagger_1.ApiOperation)({ summary: 'Auto-fill appointment from waitlist' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Appointment auto-filled from waitlist',
    }),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AutoFillFromWaitlistDto]),
    __metadata("design:returntype", Promise)
], WaitlistController.prototype, "autoFillFromWaitlist", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get waitlist by priority' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Waitlist retrieved by priority',
        type: [dto_1.WaitlistEntryResponseDto],
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WaitlistController.prototype, "getWaitlistByPriority", null);
__decorate([
    (0, common_1.Get)(':studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get waitlist status for student' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Waitlist status retrieved' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WaitlistController.prototype, "getWaitlistStatus", null);
exports.WaitlistController = WaitlistController = __decorate([
    (0, swagger_1.ApiTags)('Waitlist Management'),
    (0, common_1.Controller)('enterprise-features/waitlist'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [waitlist_management_service_1.WaitlistManagementService])
], WaitlistController);
//# sourceMappingURL=waitlist.controller.js.map