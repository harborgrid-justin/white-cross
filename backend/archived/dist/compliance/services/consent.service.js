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
exports.ConsentService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const index_1 = require("../utils/index");
const base_1 = require("../../common/base");
let ConsentService = class ConsentService extends base_1.BaseService {
    consentFormModel;
    consentSignatureModel;
    sequelize;
    constructor(consentFormModel, consentSignatureModel, sequelize) {
        super("ConsentService");
        this.consentFormModel = consentFormModel;
        this.consentSignatureModel = consentSignatureModel;
        this.sequelize = sequelize;
    }
    async getConsentForms(filters = {}) {
        try {
            const whereClause = {};
            if (filters.isActive !== undefined) {
                whereClause.isActive = filters.isActive;
            }
            const forms = await this.consentFormModel.findAll({
                where: whereClause,
                include: [{ model: models_2.ConsentSignature, as: 'signatures' }],
                order: [['createdAt', 'DESC']],
            });
            this.logInfo(`Retrieved ${forms.length} consent forms`);
            return forms;
        }
        catch (error) {
            this.logError('Error getting consent forms:', error);
            throw error;
        }
    }
    async getConsentFormById(id) {
        try {
            const form = await this.consentFormModel.findByPk(id, {
                include: [{ model: models_2.ConsentSignature, as: 'signatures' }],
            });
            if (!form) {
                throw new common_1.NotFoundException('Consent form not found');
            }
            this.logInfo(`Retrieved consent form: ${id}`);
            return form;
        }
        catch (error) {
            this.logError(`Error getting consent form ${id}:`, error);
            throw error;
        }
    }
    async createConsentForm(data) {
        try {
            if (data.expiresAt) {
                const expirationDate = new Date(data.expiresAt);
                if (expirationDate <= new Date()) {
                    throw new common_1.BadRequestException(index_1.COMPLIANCE_ERRORS.EXPIRATION_DATE_PAST);
                }
            }
            if (data.version &&
                !index_1.ComplianceUtils.validateVersionFormat(data.version)) {
                throw new common_1.BadRequestException(index_1.COMPLIANCE_ERRORS.INVALID_VERSION_FORMAT);
            }
            if (!index_1.ComplianceUtils.validateContentLength(data.content, 50)) {
                throw new common_1.BadRequestException(index_1.COMPLIANCE_ERRORS.CONTENT_TOO_SHORT);
            }
            const form = await this.consentFormModel.create({
                ...data,
                version: data.version || '1.0',
                isActive: true,
            });
            this.logInfo(`Created consent form: ${form.id} - ${form.title}`);
            return form;
        }
        catch (error) {
            this.logError('Error creating consent form:', error);
            throw error;
        }
    }
    async signConsentForm(data) {
        const transaction = await this.sequelize.transaction();
        try {
            if (!index_1.ComplianceUtils.validateRelationship(data.relationship)) {
                throw new common_1.BadRequestException(index_1.COMPLIANCE_ERRORS.INVALID_RELATIONSHIP);
            }
            if (!data.signedBy || data.signedBy.trim().length < 2) {
                throw new common_1.BadRequestException(index_1.COMPLIANCE_ERRORS.SIGNATORY_NAME_REQUIRED);
            }
            const consentForm = await this.consentFormModel.findByPk(data.consentFormId, { transaction });
            if (!consentForm) {
                throw new common_1.NotFoundException('Consent form not found');
            }
            if (!consentForm.isActive) {
                throw new common_1.BadRequestException(index_1.COMPLIANCE_ERRORS.CONSENT_NOT_ACTIVE);
            }
            if (consentForm.expiresAt &&
                new Date(consentForm.expiresAt) < new Date()) {
                throw new common_1.BadRequestException(index_1.COMPLIANCE_ERRORS.CONSENT_EXPIRED);
            }
            const existingSignature = await this.consentSignatureModel.findOne({
                where: {
                    consentFormId: data.consentFormId,
                    studentId: data.studentId,
                },
                transaction,
            });
            if (existingSignature) {
                if (existingSignature.withdrawnAt) {
                    throw new common_1.BadRequestException('Consent form was previously signed and withdrawn. A new consent form version may be required.');
                }
                throw new common_1.BadRequestException(index_1.COMPLIANCE_ERRORS.CONSENT_ALREADY_SIGNED);
            }
            if (data.signatureData) {
                const validation = index_1.ComplianceUtils.validateSignatureData(data.signatureData);
                if (!validation.valid) {
                    throw new common_1.BadRequestException(validation.error);
                }
            }
            const signature = await this.consentSignatureModel.create({
                consentFormId: data.consentFormId,
                studentId: data.studentId,
                signedBy: data.signedBy.trim(),
                relationship: data.relationship,
                signatureData: data.signatureData,
                ipAddress: data.ipAddress,
                signedAt: new Date(),
            }, { transaction });
            await transaction.commit();
            this.logInfo(`CONSENT SIGNED: Form ${data.consentFormId} for student ${data.studentId} by ${data.signedBy} (${data.relationship})`);
            return signature;
        }
        catch (error) {
            await transaction.rollback();
            this.logError('Error signing consent form:', error);
            throw error;
        }
    }
    async getStudentConsents(studentId) {
        try {
            const consents = await this.consentSignatureModel.findAll({
                where: { studentId },
                include: [{ model: models_1.ConsentForm, as: 'consentForm' }],
                order: [['signedAt', 'DESC']],
            });
            this.logInfo(`Retrieved ${consents.length} consents for student ${studentId}`);
            return consents;
        }
        catch (error) {
            this.logError(`Error getting consents for student ${studentId}:`, error);
            throw error;
        }
    }
    async withdrawConsent(signatureId, withdrawnBy) {
        try {
            if (!withdrawnBy || withdrawnBy.trim().length < 2) {
                throw new common_1.BadRequestException('Withdrawn by name is required for audit trail');
            }
            const signature = await this.consentSignatureModel.findByPk(signatureId, {
                include: [{ model: models_1.ConsentForm, as: 'consentForm' }],
            });
            if (!signature) {
                throw new common_1.NotFoundException('Consent signature not found');
            }
            if (signature.withdrawnAt) {
                throw new common_1.BadRequestException(index_1.COMPLIANCE_ERRORS.CONSENT_ALREADY_WITHDRAWN);
            }
            await signature.update({
                withdrawnAt: new Date(),
                withdrawnBy: withdrawnBy.trim(),
            });
            this.logWarning(`CONSENT WITHDRAWN: Signature ${signatureId} for student ${signature.studentId} withdrawn by ${withdrawnBy}. Consent is no longer valid.`);
            return signature;
        }
        catch (error) {
            this.logError(`Error withdrawing consent ${signatureId}:`, error);
            throw error;
        }
    }
};
exports.ConsentService = ConsentService;
exports.ConsentService = ConsentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.ConsentForm)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.ConsentSignature)),
    __metadata("design:paramtypes", [Object, Object, sequelize_typescript_1.Sequelize])
], ConsentService);
//# sourceMappingURL=consent.service.js.map