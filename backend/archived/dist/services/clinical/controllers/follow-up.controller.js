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
exports.FollowUpController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const follow_up_service_1 = require("../services/follow-up.service");
const schedule_follow_up_dto_1 = require("../dto/follow-up/schedule-follow-up.dto");
const update_follow_up_dto_1 = require("../dto/follow-up/update-follow-up.dto");
const complete_follow_up_dto_1 = require("../dto/follow-up/complete-follow-up.dto");
const follow_up_filters_dto_1 = require("../dto/follow-up/follow-up-filters.dto");
const base_1 = require("../../../common/base");
let FollowUpController = class FollowUpController extends base_1.BaseController {
    followUpService;
    constructor(followUpService) {
        super();
        this.followUpService = followUpService;
    }
    async schedule(scheduleDto) {
        return this.followUpService.schedule(scheduleDto);
    }
    async findAll(filters) {
        return this.followUpService.findAll(filters);
    }
    async findPending() {
        return this.followUpService.findPending();
    }
    async findByStudent(studentId) {
        return this.followUpService.findByStudent(studentId);
    }
    async findOne(id) {
        return this.followUpService.findOne(id);
    }
    async update(id, updateDto) {
        return this.followUpService.update(id, updateDto);
    }
    async confirm(id) {
        return this.followUpService.confirm(id);
    }
    async complete(id, completeDto) {
        return this.followUpService.complete(id, completeDto);
    }
    async cancel(id, body) {
        return this.followUpService.cancel(id, body.reason);
    }
    async remove(id) {
        await this.followUpService.remove(id);
    }
};
exports.FollowUpController = FollowUpController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Schedule follow-up appointment' }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/follow-up-appointment.model").FollowUpAppointment }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schedule_follow_up_dto_1.ScheduleFollowUpDto]),
    __metadata("design:returntype", Promise)
], FollowUpController.prototype, "schedule", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Query follow-up appointments' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [follow_up_filters_dto_1.FollowUpFiltersDto]),
    __metadata("design:returntype", Promise)
], FollowUpController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending follow-ups' }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/follow-up-appointment.model").FollowUpAppointment] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FollowUpController.prototype, "findPending", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get follow-ups for a student' }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/follow-up-appointment.model").FollowUpAppointment] }),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FollowUpController.prototype, "findByStudent", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get follow-up by ID' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/follow-up-appointment.model").FollowUpAppointment }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FollowUpController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update follow-up' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/follow-up-appointment.model").FollowUpAppointment }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_follow_up_dto_1.UpdateFollowUpDto]),
    __metadata("design:returntype", Promise)
], FollowUpController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/confirm'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm follow-up' }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/follow-up-appointment.model").FollowUpAppointment }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FollowUpController.prototype, "confirm", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete follow-up' }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/follow-up-appointment.model").FollowUpAppointment }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, complete_follow_up_dto_1.CompleteFollowUpDto]),
    __metadata("design:returntype", Promise)
], FollowUpController.prototype, "complete", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel follow-up' }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/follow-up-appointment.model").FollowUpAppointment }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FollowUpController.prototype, "cancel", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete follow-up' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FollowUpController.prototype, "remove", null);
exports.FollowUpController = FollowUpController = __decorate([
    (0, swagger_1.ApiTags)('Clinical - Follow-up Appointments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('clinical/follow-ups'),
    __metadata("design:paramtypes", [follow_up_service_1.FollowUpService])
], FollowUpController);
//# sourceMappingURL=follow-up.controller.js.map