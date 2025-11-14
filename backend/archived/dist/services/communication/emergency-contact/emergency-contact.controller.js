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
exports.EmergencyContactController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const emergency_contact_service_1 = require("./emergency-contact.service");
const create_emergency_contact_dto_1 = require("./dto/create-emergency-contact.dto");
const update_emergency_contact_dto_1 = require("./dto/update-emergency-contact.dto");
const verify_contact_dto_1 = require("./dto/verify-contact.dto");
const notification_dto_1 = require("./dto/notification.dto");
const swagger_1 = require("@nestjs/swagger");
const base_1 = require("../../../common/base");
const controller_utilities_1 = require("../../../common/shared/controller-utilities");
let EmergencyContactController = class EmergencyContactController extends base_1.BaseController {
    emergencyContactService;
    logger = controller_utilities_1.ControllerUtilities.createControllerLogger('EmergencyContactController');
    constructor(emergencyContactService) {
        super();
        this.emergencyContactService = emergencyContactService;
    }
    async getStudentEmergencyContacts(studentId, req) {
        return await controller_utilities_1.ControllerUtilities.executeEndpoint(() => this.emergencyContactService.getStudentEmergencyContacts(studentId), this.logger, 'get student emergency contacts', req);
    }
    async getEmergencyContactById(id, req) {
        controller_utilities_1.ControllerUtilities.validateUuidParam(id);
        return await controller_utilities_1.ControllerUtilities.executeEndpoint(() => this.emergencyContactService.getEmergencyContactById(id), this.logger, 'get emergency contact by ID', req);
    }
    async createEmergencyContact(createEmergencyContactDto, req) {
        return await controller_utilities_1.ControllerUtilities.executeEndpoint(() => this.emergencyContactService.createEmergencyContact(createEmergencyContactDto), this.logger, 'create emergency contact', req);
    }
    async updateEmergencyContact(id, updateEmergencyContactDto, req) {
        controller_utilities_1.ControllerUtilities.validateUuidParam(id);
        return await controller_utilities_1.ControllerUtilities.executeEndpoint(() => this.emergencyContactService.updateEmergencyContact(id, updateEmergencyContactDto), this.logger, 'update emergency contact', req);
    }
    async deleteEmergencyContact(id, req) {
        controller_utilities_1.ControllerUtilities.validateUuidParam(id);
        return await controller_utilities_1.ControllerUtilities.executeEndpoint(() => this.emergencyContactService.deleteEmergencyContact(id), this.logger, 'delete emergency contact', req);
    }
    async sendEmergencyNotification(studentId, notificationDto) {
        return this.emergencyContactService.sendEmergencyNotification(studentId, notificationDto);
    }
    async sendContactNotification(contactId, notificationDto) {
        return this.emergencyContactService.sendContactNotification(contactId, notificationDto);
    }
    async verifyContact(id, verifyContactDto) {
        return this.emergencyContactService.verifyContact(id, verifyContactDto.verificationMethod);
    }
    async getContactStatistics() {
        return this.emergencyContactService.getContactStatistics();
    }
};
exports.EmergencyContactController = EmergencyContactController;
__decorate([
    openapi.ApiOperation({ summary: "Get all emergency contacts for a student\nGET /emergency-contact/student/:studentId" }),
    (0, common_1.Get)('student/:studentId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmergencyContactController.prototype, "getStudentEmergencyContacts", null);
__decorate([
    openapi.ApiOperation({ summary: "Get emergency contact by ID\nGET /emergency-contact/:id" }),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmergencyContactController.prototype, "getEmergencyContactById", null);
__decorate([
    openapi.ApiOperation({ summary: "Create new emergency contact\nPOST /emergency-contact" }),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_emergency_contact_dto_1.EmergencyContactCreateDto, Object]),
    __metadata("design:returntype", Promise)
], EmergencyContactController.prototype, "createEmergencyContact", null);
__decorate([
    openapi.ApiOperation({ summary: "Update emergency contact\nPATCH /emergency-contact/:id" }),
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_emergency_contact_dto_1.EmergencyContactUpdateDto, Object]),
    __metadata("design:returntype", Promise)
], EmergencyContactController.prototype, "updateEmergencyContact", null);
__decorate([
    openapi.ApiOperation({ summary: "Delete emergency contact (soft delete)\nDELETE /emergency-contact/:id" }),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmergencyContactController.prototype, "deleteEmergencyContact", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Send emergency notification to all student contacts\nPOST /emergency-contact/notification/student/:studentId", summary: 'Send emergency notification to all contacts',
        description: 'Sends emergency notification to all active contacts for a student via specified channels' }),
    (0, common_1.Post)('notification/student/:studentId'),
    (0, swagger_1.ApiParam)({
        name: 'studentId',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notification sent successfully',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    contactId: { type: 'string', format: 'uuid' },
                    contact: {
                        type: 'object',
                        properties: {
                            firstName: { type: 'string' },
                            lastName: { type: 'string' },
                            phoneNumber: { type: 'string' },
                            email: { type: 'string' },
                        },
                    },
                    channels: {
                        type: 'object',
                        properties: {
                            sms: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    messageId: { type: 'string' },
                                },
                            },
                            email: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    messageId: { type: 'string' },
                                },
                            },
                            voice: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    callId: { type: 'string' },
                                },
                            },
                        },
                    },
                    timestamp: { type: 'string', format: 'date-time' },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found or no emergency contacts',
    }),
    openapi.ApiResponse({ status: 201, type: [require("./dto/notification-result.dto").NotificationResultDto] }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, notification_dto_1.NotificationDto]),
    __metadata("design:returntype", Promise)
], EmergencyContactController.prototype, "sendEmergencyNotification", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Send notification to specific contact\nPOST /emergency-contact/notification/contact/:contactId", summary: 'Send notification to specific contact',
        description: 'Sends notification to a specific emergency contact via specified channels' }),
    (0, common_1.Post)('notification/contact/:contactId'),
    (0, swagger_1.ApiParam)({
        name: 'contactId',
        description: 'Emergency Contact UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notification sent successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Contact is not active',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Emergency contact not found',
    }),
    openapi.ApiResponse({ status: 201, type: require("./dto/notification-result.dto").NotificationResultDto }),
    __param(0, (0, common_1.Param)('contactId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, notification_dto_1.NotificationDto]),
    __metadata("design:returntype", Promise)
], EmergencyContactController.prototype, "sendContactNotification", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Verify emergency contact\nPOST /emergency-contact/:id/verify", summary: 'Verify emergency contact',
        description: 'Sends verification code to emergency contact via specified method (SMS, email, or voice)' }),
    (0, common_1.Post)(':id/verify'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Emergency Contact UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Verification code sent successfully',
        schema: {
            type: 'object',
            properties: {
                verificationCode: {
                    type: 'string',
                    example: '123456',
                    description: 'For testing only - should not be returned in production',
                },
                method: { type: 'string', enum: ['sms', 'email', 'voice'] },
                messageId: { type: 'string', example: 'sms_1234567890' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid verification method or contact information missing',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Emergency contact not found',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, verify_contact_dto_1.EmergencyVerifyContactDto]),
    __metadata("design:returntype", Promise)
], EmergencyContactController.prototype, "verifyContact", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get emergency contact statistics\nGET /emergency-contact/statistics/all", summary: 'Get emergency contact statistics',
        description: 'Retrieves aggregated statistics about emergency contacts (counts by priority, students without contacts)' }),
    (0, common_1.Get)('statistics/all'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                totalContacts: { type: 'number', example: 450 },
                studentsWithoutContacts: { type: 'number', example: 12 },
                byPriority: {
                    type: 'object',
                    properties: {
                        PRIMARY: { type: 'number', example: 300 },
                        SECONDARY: { type: 'number', example: 120 },
                        EMERGENCY_ONLY: { type: 'number', example: 30 },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmergencyContactController.prototype, "getContactStatistics", null);
exports.EmergencyContactController = EmergencyContactController = __decorate([
    (0, controller_utilities_1.ApiTagsAndAuth)(['Emergency Contacts']),
    (0, common_1.Controller)('emergency-contacts'),
    __metadata("design:paramtypes", [emergency_contact_service_1.EmergencyContactService])
], EmergencyContactController);
//# sourceMappingURL=emergency-contact.controller.js.map