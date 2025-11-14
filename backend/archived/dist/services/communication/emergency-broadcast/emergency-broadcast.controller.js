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
var EmergencyBroadcastController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmergencyBroadcastController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const emergency_broadcast_service_1 = require("./emergency-broadcast.service");
const base_1 = require("../../../common/base");
const dto_1 = require("./dto");
let EmergencyBroadcastController = EmergencyBroadcastController_1 = class EmergencyBroadcastController extends base_1.BaseController {
    emergencyBroadcastService;
    logger = new common_1.Logger(EmergencyBroadcastController_1.name);
    constructor(emergencyBroadcastService) {
        super();
        this.emergencyBroadcastService = emergencyBroadcastService;
    }
    async createBroadcast(createDto) {
        this.logger.log('Creating emergency broadcast', {
            type: createDto.type,
            audience: createDto.audience,
        });
        return this.emergencyBroadcastService.createBroadcast(createDto);
    }
    async updateBroadcast(id, updateDto) {
        this.logger.log('Updating emergency broadcast', { id });
        return this.emergencyBroadcastService.updateBroadcast(id, updateDto);
    }
    async sendBroadcast(id) {
        this.logger.log('Sending emergency broadcast', { id });
        return this.emergencyBroadcastService.sendBroadcast(id);
    }
    async getBroadcastStatus(id) {
        this.logger.log('Getting broadcast status', { id });
        return this.emergencyBroadcastService.getBroadcastStatus(id);
    }
    async cancelBroadcast(id, cancelDto) {
        this.logger.log('Cancelling emergency broadcast', {
            id,
            reason: cancelDto.reason,
        });
        return this.emergencyBroadcastService.cancelBroadcast(id, cancelDto.reason);
    }
    async recordAcknowledgment(id, acknowledgmentDto) {
        this.logger.log('Recording acknowledgment', {
            id,
            recipientId: acknowledgmentDto.recipientId,
        });
        return this.emergencyBroadcastService.recordAcknowledgment(id, acknowledgmentDto.recipientId, acknowledgmentDto.acknowledgedAt || new Date());
    }
    async getTemplates() {
        this.logger.log('Getting emergency broadcast templates');
        const templates = this.emergencyBroadcastService.getTemplates();
        return { templates };
    }
};
exports.EmergencyBroadcastController = EmergencyBroadcastController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Create a new emergency broadcast\nPOST /emergency-broadcast", summary: 'Create emergency broadcast',
        description: 'Creates a new emergency broadcast message for immediate or scheduled delivery' }),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiBody)({
        type: dto_1.CreateEmergencyBroadcastDto,
        description: 'Emergency broadcast creation data',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Emergency broadcast created successfully',
        type: dto_1.EmergencyBroadcastResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data - validation error',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - emergency broadcast privileges required',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: require("./dto/emergency-broadcast-response.dto").EmergencyBroadcastResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateEmergencyBroadcastDto]),
    __metadata("design:returntype", Promise)
], EmergencyBroadcastController.prototype, "createBroadcast", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update an existing emergency broadcast\nPUT /emergency-broadcast/:id", summary: 'Update emergency broadcast',
        description: 'Updates an existing emergency broadcast before sending' }),
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Emergency broadcast UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiBody)({
        type: dto_1.UpdateEmergencyBroadcastDto,
        description: 'Emergency broadcast update data',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Emergency broadcast updated successfully',
        type: dto_1.EmergencyBroadcastResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data or broadcast already sent',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Emergency broadcast not found',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("./dto/emergency-broadcast-response.dto").EmergencyBroadcastResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateEmergencyBroadcastDto]),
    __metadata("design:returntype", Promise)
], EmergencyBroadcastController.prototype, "updateBroadcast", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Send an emergency broadcast\nPOST /emergency-broadcast/:id/send", summary: 'Send emergency broadcast',
        description: 'Immediately sends an emergency broadcast to all recipients' }),
    (0, common_1.Post)(':id/send'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Emergency broadcast UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Emergency broadcast sent successfully',
        type: dto_1.SendBroadcastResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Broadcast already sent or invalid state',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Emergency broadcast not found',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("./dto/send-broadcast-response.dto").SendBroadcastResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmergencyBroadcastController.prototype, "sendBroadcast", null);
__decorate([
    openapi.ApiOperation({ summary: "Get broadcast status and delivery statistics\nGET /emergency-broadcast/:id/status" }),
    (0, common_1.Get)(':id/status'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("./dto/broadcast-status-response.dto").BroadcastStatusResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmergencyBroadcastController.prototype, "getBroadcastStatus", null);
__decorate([
    openapi.ApiOperation({ summary: "Cancel a pending broadcast\nPUT /emergency-broadcast/:id/cancel" }),
    (0, common_1.Put)(':id/cancel'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CancelBroadcastDto]),
    __metadata("design:returntype", Promise)
], EmergencyBroadcastController.prototype, "cancelBroadcast", null);
__decorate([
    openapi.ApiOperation({ summary: "Record acknowledgment from recipient\nPOST /emergency-broadcast/:id/acknowledge" }),
    (0, common_1.Post)(':id/acknowledge'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.RecordAcknowledgmentDto]),
    __metadata("design:returntype", Promise)
], EmergencyBroadcastController.prototype, "recordAcknowledgment", null);
__decorate([
    openapi.ApiOperation({ summary: "Get emergency broadcast templates\nGET /emergency-broadcast/templates" }),
    (0, common_1.Get)('templates'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("./dto/emergency-template-response.dto").EmergencyTemplatesResponseDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmergencyBroadcastController.prototype, "getTemplates", null);
exports.EmergencyBroadcastController = EmergencyBroadcastController = EmergencyBroadcastController_1 = __decorate([
    (0, swagger_1.ApiTags)('Emergency Broadcasts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('emergency-broadcasts'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __metadata("design:paramtypes", [emergency_broadcast_service_1.EmergencyBroadcastService])
], EmergencyBroadcastController);
//# sourceMappingURL=emergency-broadcast.controller.js.map