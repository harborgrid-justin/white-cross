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
exports.ConsentType = exports.PatientConsentManagementService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const models_3 = require("../../database/models");
const models_4 = require("../../database/models");
const sequelize_2 = require("sequelize");
const base_1 = require("../../common/base");
let PatientConsentManagementService = class PatientConsentManagementService extends base_1.BaseService {
    consentFormModel;
    consentSignatureModel;
    patientModel;
    userModel;
    sequelize;
    constructor(consentFormModel, consentSignatureModel, patientModel, userModel, sequelize) {
        super("PatientConsentManagementService");
        this.consentFormModel = consentFormModel;
        this.consentSignatureModel = consentSignatureModel;
        this.patientModel = patientModel;
        this.userModel = userModel;
        this.sequelize = sequelize;
    }
    async createConsentForm(formData) {
        const transaction = await this.sequelize.transaction();
        try {
            await this.validateConsentFormData(formData);
            const consentForm = await this.consentFormModel.create({
                id: this.generateConsentFormId(),
                type: formData.consentType,
                title: formData.title,
                description: formData.description || '',
                content: formData.content,
                version: formData.version,
                isActive: true,
                expiresAt: formData.expirationDays
                    ? new Date(Date.now() + formData.expirationDays * 24 * 60 * 60 * 1000)
                    : null,
            }, { transaction });
            await transaction.commit();
            this.logInfo(`Consent form created: ${consentForm.id} - ${consentForm.title}`);
            return consentForm;
        }
        catch (error) {
            await transaction.rollback();
            this.logError(`Failed to create consent form: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getConsentForm(formId) {
        const consentForm = await this.consentFormModel.findByPk(formId, {
            include: [
                {
                    model: models_2.ConsentSignature,
                    as: 'signatures',
                    include: [
                        { model: models_3.Patient, attributes: ['id', 'firstName', 'lastName'] },
                        { model: models_4.User, as: 'witness', attributes: ['id', 'email'] },
                    ],
                },
            ],
        });
        if (!consentForm) {
            throw new common_1.NotFoundException(`Consent form ${formId} not found`);
        }
        return {
            ...consentForm.toJSON(),
            signatures: consentForm.signatures || [],
            signatureCount: consentForm.signatures?.length || 0,
            isExpired: this.isFormExpired(consentForm),
        };
    }
    async signConsentForm(signatureData) {
        const transaction = await this.sequelize.transaction();
        try {
            await this.validateSignatureData(signatureData);
            const consentForm = await this.consentFormModel.findByPk(signatureData.consentFormId, {
                transaction,
            });
            if (!consentForm) {
                throw new common_1.NotFoundException(`Consent form ${signatureData.consentFormId} not found`);
            }
            if (!consentForm.isActive) {
                throw new common_1.BadRequestException('Consent form is not active');
            }
            if (this.isFormExpired(consentForm)) {
                throw new common_1.BadRequestException('Consent form has expired');
            }
            const existingSignature = await this.consentSignatureModel.findOne({
                where: {
                    consentFormId: signatureData.consentFormId,
                    patientId: signatureData.patientId,
                    isRevoked: false,
                },
                transaction,
            });
            if (existingSignature) {
                throw new common_1.BadRequestException('Patient has already signed this consent form');
            }
            const isValidSignature = await this.verifyDigitalSignature(signatureData);
            if (!isValidSignature) {
                throw new common_1.BadRequestException('Invalid digital signature');
            }
            const signature = await this.consentSignatureModel.create({
                id: this.generateSignatureId(),
                consentFormId: signatureData.consentFormId,
                patientId: signatureData.patientId,
                signatureData: signatureData.signatureData,
                signatureMethod: signatureData.signatureMethod,
                ipAddress: signatureData.ipAddress,
                userAgent: signatureData.userAgent,
                witnessId: signatureData.witnessId,
                consentGiven: true,
                isRevoked: false,
                revocationReason: null,
                expiresAt: this.calculateExpirationDate(consentForm),
                metadata: signatureData.metadata,
            }, { transaction });
            await transaction.commit();
            this.logInfo(`Consent form signed: ${signature.id} - Patient: ${signatureData.patientId}, Form: ${signatureData.consentFormId}`);
            return signature;
        }
        catch (error) {
            await transaction.rollback();
            this.logError(`Failed to sign consent form: ${error.message}`, error.stack);
            throw error;
        }
    }
    async revokeConsent(signatureId, revocationData) {
        const transaction = await this.sequelize.transaction();
        try {
            const signature = await this.consentSignatureModel.findByPk(signatureId, { transaction });
            if (!signature) {
                throw new common_1.NotFoundException(`Consent signature ${signatureId} not found`);
            }
            if (signature.isRevoked) {
                throw new common_1.BadRequestException('Consent signature is already revoked');
            }
            await signature.update({
                isRevoked: true,
                revocationReason: revocationData.reason,
                revokedAt: new Date(),
                revokedBy: revocationData.revokedBy,
                metadata: {
                    ...signature.metadata,
                    revocation: {
                        reason: revocationData.reason,
                        revokedBy: revocationData.revokedBy,
                        timestamp: new Date(),
                        ipAddress: revocationData.ipAddress,
                    },
                },
            }, { transaction });
            await transaction.commit();
            this.logInfo(`Consent revoked: ${signatureId} - Reason: ${revocationData.reason}`);
        }
        catch (error) {
            await transaction.rollback();
            this.logError(`Failed to revoke consent: ${error.message}`, error.stack);
            throw error;
        }
    }
    async checkPatientConsent(patientId, consentType, operation) {
        const signatures = await this.consentSignatureModel.findAll({
            where: {
                patientId,
                consentGiven: true,
                isRevoked: false,
                expiresAt: {
                    [sequelize_2.Op.or]: [{ [sequelize_2.Op.is]: null }, { [sequelize_2.Op.gt]: new Date() }],
                },
            },
            include: [
                {
                    model: models_1.ConsentForm,
                    where: {
                        consentType,
                        isActive: true,
                    },
                },
            ],
        });
        const validSignatures = signatures.filter((signature) => {
            const form = signature.consentForm;
            return form && !this.isFormExpired(form);
        });
        const hasValidConsent = validSignatures.length > 0;
        return {
            patientId,
            consentType,
            operation,
            hasValidConsent,
            validSignatures: validSignatures.length,
            latestSignature: validSignatures.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]?.createdAt,
            expiresAt: validSignatures.length > 0
                ? validSignatures
                    .map((s) => s.expiresAt)
                    .filter((date) => date)
                    .sort((a, b) => b.getTime() - a.getTime())[0]
                : null,
        };
    }
    async getPatientConsentHistory(patientId, filters) {
        const whereClause = {
            patientId,
        };
        if (filters?.consentType) {
            whereClause['$consentForm.consentType$'] = filters.consentType;
        }
        if (filters?.dateFrom) {
            whereClause.createdAt = {
                ...whereClause.createdAt,
                [sequelize_2.Op.gte]: filters.dateFrom,
            };
        }
        if (filters?.dateTo) {
            whereClause.createdAt = {
                ...whereClause.createdAt,
                [sequelize_2.Op.lte]: filters.dateTo,
            };
        }
        const signatures = await this.consentSignatureModel.findAll({
            where: whereClause,
            include: [
                {
                    model: models_1.ConsentForm,
                    attributes: ['id', 'title', 'consentType', 'version'],
                },
                {
                    model: models_4.User,
                    as: 'witness',
                    attributes: ['id', 'email'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });
        return {
            patientId,
            totalSignatures: signatures.length,
            activeConsents: signatures.filter((s) => s.consentGiven && !s.isRevoked && !this.isSignatureExpired(s)).length,
            revokedConsents: signatures.filter((s) => s.isRevoked).length,
            expiredConsents: signatures.filter((s) => this.isSignatureExpired(s)).length,
            signatures: signatures.map((signature) => ({
                id: signature.id,
                consentForm: signature.consentForm,
                signedAt: signature.createdAt,
                expiresAt: signature.expiresAt,
                isRevoked: signature.isRevoked,
                revocationReason: signature.revocationReason,
                witness: signature.witness,
                signatureMethod: signature.signatureMethod,
                isExpired: this.isSignatureExpired(signature),
            })),
        };
    }
    async generateConsentReport(startDate, endDate) {
        const forms = await this.consentFormModel.findAll({
            where: {
                createdAt: {
                    [sequelize_2.Op.between]: [startDate, endDate],
                },
            },
        });
        const signatures = await this.consentSignatureModel.findAll({
            where: {
                createdAt: {
                    [sequelize_2.Op.between]: [startDate, endDate],
                },
            },
            include: [models_1.ConsentForm],
        });
        const revokedSignatures = signatures.filter((s) => s.isRevoked);
        const expiredSignatures = signatures.filter((s) => this.isSignatureExpired(s));
        return {
            period: { startDate, endDate },
            totalForms: forms.length,
            activeForms: forms.filter((f) => f.isActive).length,
            totalSignatures: signatures.length,
            revokedSignatures: revokedSignatures.length,
            expiredSignatures: expiredSignatures.length,
            consentTypes: this.summarizeConsentTypes(signatures),
            revocationReasons: this.summarizeRevocationReasons(revokedSignatures),
            complianceMetrics: {
                consentRate: signatures.length > 0
                    ? ((signatures.length - revokedSignatures.length) / signatures.length) * 100
                    : 0,
                timelyRevocations: revokedSignatures.filter((s) => s.revokedAt <= s.expiresAt).length,
                digitalSignatures: signatures.filter((s) => s.signatureMethod === 'DIGITAL').length,
            },
        };
    }
    generateConsentFormId() {
        return `CF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    generateSignatureId() {
        return `CS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    async validateConsentFormData(formData) {
        if (!formData.title || formData.title.trim().length === 0) {
            throw new common_1.BadRequestException('Consent form title is required');
        }
        if (!formData.content || formData.content.trim().length === 0) {
            throw new common_1.BadRequestException('Consent form content is required');
        }
        if (!formData.consentType) {
            throw new common_1.BadRequestException('Consent type is required');
        }
        const existingForm = await this.consentFormModel.findOne({
            where: {
                consentType: formData.consentType,
                language: formData.language,
                isActive: true,
            },
        });
        if (existingForm) {
            throw new common_1.BadRequestException(`Active consent form already exists for type ${formData.consentType} in language ${formData.language}`);
        }
    }
    async validateSignatureData(signatureData) {
        if (!signatureData.consentFormId) {
            throw new common_1.BadRequestException('Consent form ID is required');
        }
        if (!signatureData.patientId) {
            throw new common_1.BadRequestException('Patient ID is required');
        }
        if (!signatureData.signatureData) {
            throw new common_1.BadRequestException('Signature data is required');
        }
        const patient = await this.patientModel.findByPk(signatureData.patientId);
        if (!patient) {
            throw new common_1.NotFoundException(`Patient ${signatureData.patientId} not found`);
        }
        if (signatureData.witnessId) {
            const witness = await this.userModel.findByPk(signatureData.witnessId);
            if (!witness) {
                throw new common_1.NotFoundException(`Witness ${signatureData.witnessId} not found`);
            }
        }
    }
    async verifyDigitalSignature(signatureData) {
        return true;
    }
    isFormExpired(form) {
        if (!form.expirationDays)
            return false;
        const expirationDate = new Date(form.createdAt);
        expirationDate.setDate(expirationDate.getDate() + form.expirationDays);
        return expirationDate < new Date();
    }
    isSignatureExpired(signature) {
        return signature.expiresAt ? signature.expiresAt < new Date() : false;
    }
    calculateExpirationDate(form) {
        if (!form.expirationDays)
            return null;
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + form.expirationDays);
        return expirationDate;
    }
    summarizeConsentTypes(signatures) {
        return signatures.reduce((acc, signature) => {
            const type = signature.consentForm?.consentType;
            if (type) {
                acc[type] = (acc[type] || 0) + 1;
            }
            return acc;
        }, {});
    }
    summarizeRevocationReasons(signatures) {
        return signatures.reduce((acc, signature) => {
            const reason = signature.revocationReason || 'Not specified';
            acc[reason] = (acc[reason] || 0) + 1;
            return acc;
        }, {});
    }
};
exports.PatientConsentManagementService = PatientConsentManagementService;
exports.PatientConsentManagementService = PatientConsentManagementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.ConsentForm)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.ConsentSignature)),
    __param(2, (0, sequelize_1.InjectModel)(models_3.Patient)),
    __param(3, (0, sequelize_1.InjectModel)(models_4.User)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, sequelize_typescript_1.Sequelize])
], PatientConsentManagementService);
var ConsentType;
(function (ConsentType) {
    ConsentType["TREATMENT"] = "TREATMENT";
    ConsentType["DISCLOSURE"] = "DISCLOSURE";
    ConsentType["RESEARCH"] = "RESEARCH";
    ConsentType["PHOTOGRAPHY"] = "PHOTOGRAPHY";
    ConsentType["TELEMEDICINE"] = "TELEMEDICINE";
    ConsentType["EMERGENCY"] = "EMERGENCY";
    ConsentType["GENERAL"] = "GENERAL";
})(models_1.ConsentType || (models_1.ConsentType = {}));
//# sourceMappingURL=patient-consent-management.service.js.map