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
exports.ConsentFormsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const consent_form_management_service_1 = require("../consent-form-management.service");
const dto_1 = require("../dto");
const base_1 = require("../../common/base");
let ConsentFormsController = class ConsentFormsController extends base_1.BaseController {
    consentFormService;
    constructor(consentFormService) {
        super();
        this.consentFormService = consentFormService;
    }
    createConsentForm(dto) {
        return this.consentFormService.createConsentForm(dto.studentId, dto.formType, dto.content, dto.expiresAt ? new Date(dto.expiresAt) : undefined);
    }
    signForm(formId, dto) {
        return this.consentFormService.signForm(formId, dto.signedBy, dto.signature, dto.ipAddress, dto.userAgent);
    }
    verifySignature(formId, dto) {
        return this.consentFormService.verifySignature(formId, dto.signature);
    }
    revokeConsent(formId, dto) {
        return this.consentFormService.revokeConsent(formId, dto.revokedBy, dto.reason);
    }
    renewConsentForm(formId, dto) {
        return this.consentFormService.renewConsentForm(formId, dto.extendedBy, dto.additionalYears);
    }
    getConsentFormsByStudent(studentId, status) {
        return this.consentFormService.getConsentFormsByStudent(studentId, status);
    }
    getConsentFormHistory(formId) {
        return this.consentFormService.getConsentFormHistory(formId);
    }
    sendReminderForUnsignedForms() {
        return this.consentFormService.sendReminderForUnsignedForms();
    }
    generateConsentFormTemplate(formType, studentId) {
        return this.consentFormService.generateConsentFormTemplate(formType, studentId);
    }
    checkFormsExpiringSoon(days) {
        return this.consentFormService.checkFormsExpiringSoon(days ? parseInt(days.toString()) : 30);
    }
};
exports.ConsentFormsController = ConsentFormsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create consent form' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Consent form created',
        type: dto_1.ConsentFormResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateConsentFormDto]),
    __metadata("design:returntype", void 0)
], ConsentFormsController.prototype, "createConsentForm", null);
__decorate([
    (0, common_1.Put)(':formId/sign'),
    (0, swagger_1.ApiOperation)({ summary: 'Sign consent form' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Form signed successfully' }),
    openapi.ApiResponse({ status: 200, type: Boolean }),
    __param(0, (0, common_1.Param)('formId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.SignFormDto]),
    __metadata("design:returntype", void 0)
], ConsentFormsController.prototype, "signForm", null);
__decorate([
    (0, common_1.Post)(':formId/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify form signature' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Signature verified' }),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __param(0, (0, common_1.Param)('formId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.VerifySignatureDto]),
    __metadata("design:returntype", void 0)
], ConsentFormsController.prototype, "verifySignature", null);
__decorate([
    (0, common_1.Delete)(':formId/revoke'),
    (0, swagger_1.ApiOperation)({ summary: 'Revoke consent' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Consent revoked' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: Boolean }),
    __param(0, (0, common_1.Param)('formId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.RevokeConsentDto]),
    __metadata("design:returntype", void 0)
], ConsentFormsController.prototype, "revokeConsent", null);
__decorate([
    (0, common_1.Post)(':formId/renew'),
    (0, swagger_1.ApiOperation)({ summary: 'Renew consent form' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Form renewed' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('formId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.RenewConsentFormDto]),
    __metadata("design:returntype", void 0)
], ConsentFormsController.prototype, "renewConsentForm", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get consent forms for student' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Consent forms retrieved',
        type: [dto_1.ConsentFormResponseDto],
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ConsentFormsController.prototype, "getConsentFormsByStudent", null);
__decorate([
    (0, common_1.Get)(':formId/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get consent form history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Form history retrieved' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('formId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConsentFormsController.prototype, "getConsentFormHistory", null);
__decorate([
    (0, common_1.Post)('send-reminders'),
    (0, swagger_1.ApiOperation)({ summary: 'Send reminders for unsigned forms' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reminders sent' }),
    openapi.ApiResponse({ status: 201, type: Number }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConsentFormsController.prototype, "sendReminderForUnsignedForms", null);
__decorate([
    (0, common_1.Get)('template/:formType/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate consent form template' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Template generated' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('formType')),
    __param(1, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ConsentFormsController.prototype, "generateConsentFormTemplate", null);
__decorate([
    (0, common_1.Get)('expiring'),
    (0, swagger_1.ApiOperation)({ summary: 'Check forms expiring soon' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Expiring forms retrieved',
        type: [dto_1.ConsentFormResponseDto],
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ConsentFormsController.prototype, "checkFormsExpiringSoon", null);
exports.ConsentFormsController = ConsentFormsController = __decorate([
    (0, swagger_1.ApiTags)('Consent Forms'),
    (0, common_1.Controller)('enterprise-features/consent-forms'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [consent_form_management_service_1.ConsentFormManagementService])
], ConsentFormsController);
//# sourceMappingURL=consent-forms.controller.js.map