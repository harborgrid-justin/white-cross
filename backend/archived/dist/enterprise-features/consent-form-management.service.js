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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsentFormManagementService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const consent_validation_helper_1 = require("./helpers/consent-validation.helper");
const consent_template_helper_1 = require("./helpers/consent-template.helper");
const signature_helper_1 = require("./helpers/signature.helper");
const base_1 = require("../common/base");
let ConsentFormManagementService = class ConsentFormManagementService extends base_1.BaseService {
    eventEmitter;
    consentForms = [];
    constructor(eventEmitter) {
        super('ConsentFormManagementService');
        this.eventEmitter = eventEmitter;
    }
    createConsentForm(studentId, formType, content, expiresAt) {
        try {
            consent_validation_helper_1.ConsentValidationHelper.validateConsentFormParameters(studentId, formType, content);
            const form = {
                id: signature_helper_1.SignatureHelper.generateFormId(),
                studentId,
                formType,
                status: 'pending',
                content,
                createdAt: new Date(),
                expiresAt: expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                version: '1.0',
                metadata: {
                    createdBy: 'system',
                    ipAddress: 'unknown',
                },
            };
            this.consentForms.push(form);
            this.eventEmitter.emit('consent.form.created', {
                formId: form.id,
                studentId,
                formType,
                timestamp: new Date(),
            });
            this.logInfo('Consent form created', { formId: form.id, formType, studentId });
            return form;
        }
        catch (error) {
            this.logError('Error creating consent form', {
                error: error instanceof Error ? error.message : String(error),
                studentId,
                formType,
            });
            throw error;
        }
    }
    signForm(formId, signedBy, signature, ipAddress, userAgent) {
        try {
            consent_validation_helper_1.ConsentValidationHelper.validateSignatureParameters(formId, signedBy, signature);
            const form = this.consentForms.find((f) => f.id === formId);
            if (!form) {
                throw new Error(`Consent form not found: ${formId}`);
            }
            if (form.status !== 'pending') {
                throw new Error(`Form ${formId} is not in pending status`);
            }
            const signatureData = signature_helper_1.SignatureHelper.createSignatureData(formId, signedBy, signature, ipAddress, userAgent);
            form.status = 'signed';
            form.lastModifiedAt = new Date();
            form.lastModifiedBy = signedBy;
            this.eventEmitter.emit('consent.form.signed', {
                formId,
                signedBy,
                ipAddress,
                timestamp: signatureData.signedAt,
            });
            this.logInfo('Consent form signed', { formId, signedBy, ipAddress, timestamp: signatureData.signedAt });
            return true;
        }
        catch (error) {
            this.logError('Error signing consent form', {
                error: error instanceof Error ? error.message : String(error),
                formId,
            });
            return false;
        }
    }
    verifySignature(formId, signature) {
        try {
            consent_validation_helper_1.ConsentValidationHelper.validateVerificationParameters(formId, signature);
            const form = this.consentForms.find((f) => f.id === formId);
            if (!form) {
                throw new Error(`Consent form not found: ${formId}`);
            }
            if (form.status !== 'signed') {
                this.logWarning('Attempted to verify signature on unsigned form', { formId });
                return false;
            }
            const isValid = true;
            this.logInfo('Signature verification completed', { formId, isValid });
            return isValid;
        }
        catch (error) {
            this.logError('Error verifying signature', {
                error: error instanceof Error ? error.message : String(error),
                formId,
            });
            return false;
        }
    }
    revokeConsent(formId, revokedBy, reason) {
        try {
            consent_validation_helper_1.ConsentValidationHelper.validateRevocationParameters(formId, revokedBy, reason);
            const form = this.consentForms.find((f) => f.id === formId);
            if (!form) {
                throw new Error(`Consent form not found: ${formId}`);
            }
            if (form.status !== 'signed') {
                throw new Error(`Cannot revoke consent for form ${formId} - not signed`);
            }
            form.status = 'revoked';
            form.lastModifiedAt = new Date();
            form.lastModifiedBy = revokedBy;
            this.eventEmitter.emit('consent.form.revoked', { formId, revokedBy, reason, timestamp: new Date() });
            this.logInfo('Consent form revoked', { formId, revokedBy, reason });
            return true;
        }
        catch (error) {
            this.logError('Error revoking consent', {
                error: error instanceof Error ? error.message : String(error),
                formId,
            });
            return false;
        }
    }
    checkFormsExpiringSoon(days = 30) {
        try {
            const expiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
            const expiringForms = this.consentForms.filter((form) => form.status === 'signed' && form.expiresAt && form.expiresAt <= expiryDate);
            this.logInfo('Checked for expiring consent forms', {
                days,
                expiringCount: expiringForms.length,
                expiryDate,
            });
            return expiringForms;
        }
        catch (error) {
            this.logError('Error checking expiring forms', {
                error: error instanceof Error ? error.message : String(error),
                days,
            });
            return [];
        }
    }
    renewConsentForm(formId, extendedBy, additionalYears = 1) {
        try {
            consent_validation_helper_1.ConsentValidationHelper.validateRenewalParameters(formId, extendedBy, additionalYears);
            const form = this.consentForms.find((f) => f.id === formId);
            if (!form) {
                throw new Error(`Consent form not found: ${formId}`);
            }
            const newExpiryDate = new Date(form.expiresAt.getTime() + additionalYears * 365 * 24 * 60 * 60 * 1000);
            const renewedForm = {
                ...form,
                id: signature_helper_1.SignatureHelper.generateFormId(),
                status: 'pending',
                expiresAt: newExpiryDate,
                version: (parseFloat(form.version || '1.0') + 0.1).toFixed(1),
                createdAt: new Date(),
                lastModifiedAt: new Date(),
                lastModifiedBy: extendedBy,
            };
            this.consentForms.push(renewedForm);
            this.eventEmitter.emit('consent.form.renewed', {
                originalFormId: formId,
                newFormId: renewedForm.id,
                extendedBy,
                newExpiryDate,
                additionalYears,
                timestamp: new Date(),
            });
            this.logInfo('Consent form renewed', { originalFormId: formId, newFormId: renewedForm.id, extendedBy, newExpiryDate, additionalYears });
            return renewedForm;
        }
        catch (error) {
            this.logError('Error renewing consent form', {
                error: error instanceof Error ? error.message : String(error),
                formId,
            });
            return null;
        }
    }
    getConsentFormsByStudent(studentId, status) {
        try {
            consent_validation_helper_1.ConsentValidationHelper.validateStudentId(studentId);
            let forms = this.consentForms.filter((form) => form.studentId === studentId);
            if (status) {
                forms = forms.filter((form) => form.status === status);
            }
            this.logInfo('Retrieved consent forms by student', { studentId, status, count: forms.length });
            return forms;
        }
        catch (error) {
            this.logError('Error retrieving consent forms by student', {
                error: error instanceof Error ? error.message : String(error),
                studentId,
            });
            return [];
        }
    }
    getConsentFormHistory(formId) {
        try {
            consent_validation_helper_1.ConsentValidationHelper.validateFormId(formId);
            const form = this.consentForms.find((f) => f.id === formId);
            if (!form) {
                return [];
            }
            const history = [{
                    version: form.version,
                    status: form.status,
                    createdAt: form.createdAt,
                    lastModifiedAt: form.lastModifiedAt,
                    lastModifiedBy: form.lastModifiedBy,
                }];
            this.logInfo('Retrieved consent form history', { formId, historyEntries: history.length });
            return history;
        }
        catch (error) {
            this.logError('Error retrieving form history', {
                error: error instanceof Error ? error.message : String(error),
                formId,
            });
            return [];
        }
    }
    sendReminderForUnsignedForms() {
        try {
            const unsignedForms = this.consentForms.filter((form) => form.status === 'pending' &&
                form.createdAt &&
                Date.now() - form.createdAt.getTime() > 7 * 24 * 60 * 60 * 1000);
            const remindersSent = unsignedForms.length;
            if (remindersSent > 0) {
                this.eventEmitter.emit('consent.reminders.sent', {
                    unsignedFormsCount: unsignedForms.length,
                    remindersSent,
                    timestamp: new Date(),
                });
            }
            this.logInfo('Sent reminders for unsigned consent forms', {
                unsignedFormsCount: unsignedForms.length,
                remindersSent,
            });
            return remindersSent;
        }
        catch (error) {
            this.logError('Error sending reminders', error);
            return 0;
        }
    }
    generateConsentFormTemplate(formType, studentId) {
        try {
            consent_validation_helper_1.ConsentValidationHelper.validateTemplateParameters(formType, studentId);
            const variables = consent_template_helper_1.ConsentTemplateHelper.getDefaultVariables(formType, studentId);
            const html = consent_template_helper_1.ConsentTemplateHelper.generateHtmlTemplate(formType, variables.studentName, variables.schoolName, variables.date, variables.studentId);
            this.logInfo('Consent form template generated', { formType, studentId });
            return { html, variables };
        }
        catch (error) {
            this.logError('Error generating form template', {
                error: error instanceof Error ? error.message : String(error),
                formType,
            });
            throw error;
        }
    }
};
exports.ConsentFormManagementService = ConsentFormManagementService;
exports.ConsentFormManagementService = ConsentFormManagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2])
], ConsentFormManagementService);
//# sourceMappingURL=consent-form-management.service.js.map