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
var WaitlistController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitlistController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const waitlist_service_1 = require("../services/waitlist.service");
const base_1 = require("../../../common/base");
const waitlist_dto_1 = require("../dto/waitlist.dto");
let WaitlistController = WaitlistController_1 = class WaitlistController extends base_1.BaseController {
    waitlistService;
    logger = new common_1.Logger(WaitlistController_1.name);
    constructor(waitlistService) {
        super();
        this.waitlistService = waitlistService;
    }
    async addToWaitlist(createDto) {
        this.logger.log('POST /appointments/waitlist');
        return this.waitlistService.addToWaitlist(createDto);
    }
    async getWaitlist(filters) {
        this.logger.log('GET /appointments/waitlist');
        return this.waitlistService.getWaitlist(filters);
    }
    async updateWaitlistPriority(id, updateDto) {
        this.logger.log(`PATCH /appointments/waitlist/${id}/priority`);
        return this.waitlistService.updateWaitlistPriority(id, updateDto.priority);
    }
    async getWaitlistPosition(id) {
        this.logger.log(`GET /appointments/waitlist/${id}/position`);
        return this.waitlistService.getWaitlistPosition(id);
    }
    async notifyWaitlistEntry(id, notifyDto) {
        this.logger.log(`POST /appointments/waitlist/${id}/notify`);
        return this.waitlistService.notifyWaitlistEntry(id, notifyDto?.message);
    }
    async removeFromWaitlist(id, removeDto) {
        this.logger.log(`DELETE /appointments/waitlist/${id}`);
        return this.waitlistService.removeFromWaitlist(id, removeDto?.reason);
    }
};
exports.WaitlistController = WaitlistController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Add student to appointment waitlist", summary: 'Add to waitlist',
        description: 'Add student to appointment waitlist when no slots are available' }),
    (0, common_1.Post)('waitlist'),
    (0, swagger_1.ApiBody)({ type: waitlist_dto_1.CreateWaitlistEntryDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Successfully added to waitlist' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation failed' }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/appointment-waitlist.model").AppointmentWaitlist }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [waitlist_dto_1.CreateWaitlistEntryDto]),
    __metadata("design:returntype", Promise)
], WaitlistController.prototype, "addToWaitlist", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get appointment waitlist", summary: 'Get waitlist',
        description: 'Retrieve appointment waitlist with filtering and pagination' }),
    (0, common_1.Get)('waitlist'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully retrieved waitlist' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [waitlist_dto_1.WaitlistFiltersDto]),
    __metadata("design:returntype", Promise)
], WaitlistController.prototype, "getWaitlist", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update waitlist entry priority", summary: 'Update waitlist priority',
        description: 'Update the priority level of a waitlist entry' }),
    (0, common_1.Patch)('waitlist/:id/priority'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Waitlist entry UUID' }),
    (0, swagger_1.ApiBody)({ type: waitlist_dto_1.UpdateWaitlistPriorityDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Priority updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid UUID format' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Waitlist entry not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/appointment-waitlist.model").AppointmentWaitlist }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, waitlist_dto_1.UpdateWaitlistPriorityDto]),
    __metadata("design:returntype", Promise)
], WaitlistController.prototype, "updateWaitlistPriority", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get waitlist position", summary: 'Get waitlist position',
        description: 'Get the current position of a student in the waitlist' }),
    (0, common_1.Get)('waitlist/:id/position'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Waitlist entry UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Position retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid UUID format' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Waitlist entry not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WaitlistController.prototype, "getWaitlistPosition", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Notify waitlist entry", summary: 'Notify waitlist entry',
        description: 'Send notification to waitlisted student about available slot' }),
    (0, common_1.Post)('waitlist/:id/notify'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Waitlist entry UUID' }),
    (0, swagger_1.ApiBody)({ type: waitlist_dto_1.NotifyWaitlistEntryDto, required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notification sent successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid UUID format' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Waitlist entry not found' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, waitlist_dto_1.NotifyWaitlistEntryDto]),
    __metadata("design:returntype", Promise)
], WaitlistController.prototype, "notifyWaitlistEntry", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Remove from waitlist", summary: 'Remove from waitlist',
        description: 'Remove student from appointment waitlist' }),
    (0, common_1.Delete)('waitlist/:id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Waitlist entry UUID' }),
    (0, swagger_1.ApiBody)({ type: waitlist_dto_1.RemoveFromWaitlistDto, required: false }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Removed from waitlist successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid UUID format' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Waitlist entry not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/appointment-waitlist.model").AppointmentWaitlist }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, waitlist_dto_1.RemoveFromWaitlistDto]),
    __metadata("design:returntype", Promise)
], WaitlistController.prototype, "removeFromWaitlist", null);
exports.WaitlistController = WaitlistController = WaitlistController_1 = __decorate([
    (0, swagger_1.ApiTags)('appointments-waitlist'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('appointments'),
    __metadata("design:paramtypes", [waitlist_service_1.WaitlistService])
], WaitlistController);
//# sourceMappingURL=waitlist.controller.js.map