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
exports.ContactController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const services_1 = require("./services");
const dto_1 = require("./dto");
const enums_1 = require("./enums");
const base_1 = require("../../../common/base");
let ContactController = class ContactController extends base_1.BaseController {
    contactService;
    emergencyContactService;
    constructor(contactService, emergencyContactService) {
        super();
        this.contactService = contactService;
        this.emergencyContactService = emergencyContactService;
    }
    async getContacts(query) {
        return this.contactService.getContacts(query);
    }
    async searchContacts(query, limit) {
        return this.contactService.searchContacts(query, limit);
    }
    async getContactStats() {
        return this.contactService.getContactStats();
    }
    async getContactsByRelation(relationId, type) {
        return this.contactService.getContactsByRelation(relationId, type);
    }
    async getContactById(id) {
        return this.contactService.getContactById(id);
    }
    async createContact(dto) {
        return this.contactService.createContact(dto);
    }
    async updateContact(id, dto) {
        return this.contactService.updateContact(id, dto);
    }
    async deleteContact(id) {
        return this.contactService.deleteContact(id);
    }
    async reactivateContact(id, updatedBy) {
        return this.contactService.reactivateContact(id, updatedBy);
    }
    async deactivateContact(id, updatedBy) {
        return this.contactService.deactivateContact(id, updatedBy);
    }
    async getAllEmergencyContacts(query) {
        return this.emergencyContactService.findAll(query);
    }
    async getEmergencyContactsByStudent(studentId) {
        return this.emergencyContactService.findAllByStudent(studentId);
    }
    async getPrimaryEmergencyContacts(studentId) {
        return this.emergencyContactService.getPrimaryContacts(studentId);
    }
    async getAuthorizedPickupContacts(studentId) {
        return this.emergencyContactService.getAuthorizedPickupContacts(studentId);
    }
    async getNotificationRouting(studentId) {
        return this.emergencyContactService.getNotificationRouting(studentId);
    }
    async getEmergencyContactById(id) {
        return this.emergencyContactService.findOne(id);
    }
    async createEmergencyContact(dto) {
        return this.emergencyContactService.create(dto);
    }
    async updateEmergencyContact(id, dto) {
        return this.emergencyContactService.update(id, dto);
    }
    async deleteEmergencyContact(id) {
        return this.emergencyContactService.remove(id);
    }
    async verifyEmergencyContact(id, dto) {
        return this.emergencyContactService.verifyContact(id, dto);
    }
};
exports.ContactController = ContactController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all contacts with pagination and filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns paginated contacts' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ContactQueryDto]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "getContacts", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search contacts by name, email, or organization' }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: true, description: 'Search query' }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Result limit',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns matching contacts' }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/contact.model").Contact] }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "searchContacts", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get contact statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns contact statistics by type',
    }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "getContactStats", null);
__decorate([
    (0, common_1.Get)('relation/:relationId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get contacts by relation ID' }),
    (0, swagger_1.ApiParam)({ name: 'relationId', description: 'Related entity UUID' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: enums_1.ContactType }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns contacts for relation' }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/contact.model").Contact] }),
    __param(0, (0, common_1.Param)('relationId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "getContactsByRelation", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get contact by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Contact UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns contact' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Contact not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/contact.model").Contact }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "getContactById", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new contact' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Contact created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Duplicate contact email' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: require("../../../database/models/contact.model").Contact }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateContactDto]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "createContact", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update contact' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Contact UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Contact updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Contact not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Duplicate contact email' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/contact.model").Contact }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateContactDto]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "updateContact", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete contact (soft delete)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Contact UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Contact deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Contact not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "deleteContact", null);
__decorate([
    (0, common_1.Patch)(':id/activate'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate contact' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Contact UUID' }),
    (0, swagger_1.ApiQuery)({ name: 'updatedBy', required: false, description: 'User UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Contact activated successfully' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/contact.model").Contact }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('updatedBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "reactivateContact", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate contact' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Contact UUID' }),
    (0, swagger_1.ApiQuery)({ name: 'updatedBy', required: false, description: 'User UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Contact deactivated successfully' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/contact.model").Contact }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('updatedBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "deactivateContact", null);
__decorate([
    (0, common_1.Get)('emergency/list'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all emergency contacts with filters' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns paginated emergency contacts',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.EmergencyContactQueryDto]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "getAllEmergencyContacts", null);
__decorate([
    (0, common_1.Get)('emergency/student/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all emergency contacts for a student' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns student emergency contacts',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/emergency-contact.model").EmergencyContact] }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "getEmergencyContactsByStudent", null);
__decorate([
    (0, common_1.Get)('emergency/student/:studentId/primary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get primary emergency contacts for a student' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns primary contacts' }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/emergency-contact.model").EmergencyContact] }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "getPrimaryEmergencyContacts", null);
__decorate([
    (0, common_1.Get)('emergency/student/:studentId/authorized-pickup'),
    (0, swagger_1.ApiOperation)({ summary: 'Get authorized pickup contacts for a student' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns authorized pickup contacts',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/emergency-contact.model").EmergencyContact] }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "getAuthorizedPickupContacts", null);
__decorate([
    (0, common_1.Get)('emergency/student/:studentId/notification-routing'),
    (0, swagger_1.ApiOperation)({ summary: 'Get notification routing for a student' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns notification routing by priority',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "getNotificationRouting", null);
__decorate([
    (0, common_1.Get)('emergency/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get emergency contact by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Emergency contact UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns emergency contact' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Emergency contact not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/emergency-contact.model").EmergencyContact }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "getEmergencyContactById", null);
__decorate([
    (0, common_1.Post)('emergency'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new emergency contact' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Emergency contact created successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: require("../../../database/models/emergency-contact.model").EmergencyContact }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ContactCreateEmergencyDto]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "createEmergencyContact", null);
__decorate([
    (0, common_1.Put)('emergency/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update emergency contact' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Emergency contact UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Emergency contact updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Emergency contact not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/emergency-contact.model").EmergencyContact }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.ContactUpdateEmergencyDto]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "updateEmergencyContact", null);
__decorate([
    (0, common_1.Delete)('emergency/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete emergency contact' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Emergency contact UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Emergency contact deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Cannot delete last primary contact',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Emergency contact not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "deleteEmergencyContact", null);
__decorate([
    (0, common_1.Post)('emergency/:id/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify emergency contact' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Emergency contact UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Emergency contact verified successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Emergency contact not found' }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/emergency-contact.model").EmergencyContact }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.ContactVerifyDto]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "verifyEmergencyContact", null);
exports.ContactController = ContactController = __decorate([
    (0, swagger_1.ApiTags)('Contacts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('contacts'),
    __metadata("design:paramtypes", [services_1.ContactService,
        services_1.EmergencyContactService])
], ContactController);
//# sourceMappingURL=contact.controller.js.map