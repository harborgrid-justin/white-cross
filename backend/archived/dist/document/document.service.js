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
exports.DocumentService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../database/models");
const sequelize_2 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const base_1 = require("../common/base");
let DocumentService = class DocumentService extends base_1.BaseService {
    documentModel;
    signatureModel;
    auditModel;
    sequelize;
    constructor(documentModel, signatureModel, auditModel, sequelize) {
        super("DocumentService");
        this.documentModel = documentModel;
        this.signatureModel = signatureModel;
        this.auditModel = auditModel;
        this.sequelize = sequelize;
    }
    async getDocuments(page = 1, limit = 20, filters = {}) {
        const offset = (page - 1) * limit;
        const whereClause = {};
        if (filters.category)
            whereClause.category = filters.category;
        if (filters.status)
            whereClause.status = filters.status;
        if (filters.studentId)
            whereClause.studentId = filters.studentId;
        if (filters.uploadedBy)
            whereClause.uploadedBy = filters.uploadedBy;
        if (filters.searchTerm) {
            whereClause[sequelize_2.Op.or] = [
                { title: { [sequelize_2.Op.iLike]: `%${filters.searchTerm}%` } },
                { description: { [sequelize_2.Op.iLike]: `%${filters.searchTerm}%` } },
                { fileName: { [sequelize_2.Op.iLike]: `%${filters.searchTerm}%` } },
            ];
        }
        if (filters.tags && filters.tags.length > 0) {
            whereClause.tags = { [sequelize_2.Op.overlap]: filters.tags };
        }
        const { rows: documents, count: total } = await this.documentModel.findAndCountAll({
            where: whereClause,
            offset,
            limit,
            include: [
                { model: models_1.Document, as: 'versions', limit: 5, separate: true },
                { model: models_1.DocumentSignature, as: 'signatures' },
            ],
            order: [['createdAt', 'DESC']],
            distinct: true,
        });
        return {
            documents,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        };
    }
    async getDocumentById(id) {
        const document = await this.documentModel.findByPk(id, {
            include: [
                { model: models_1.Document, as: 'parent' },
                { model: models_1.Document, as: 'versions' },
                { model: models_1.DocumentSignature, as: 'signatures' },
                { model: models_1.DocumentAuditTrail, as: 'auditTrail', limit: 50 },
            ],
        });
        if (!document) {
            throw new common_1.NotFoundException(`Document with ID ${id} not found`);
        }
        return document;
    }
    async createDocument(createDto) {
        const transaction = await this.sequelize.transaction({
            isolationLevel: sequelize_2.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
        });
        try {
            const document = await this.documentModel.create({
                ...createDto,
                title: createDto.title.trim(),
                description: createDto.description?.trim(),
                fileType: createDto.fileType.toLowerCase().trim(),
                fileName: createDto.fileName.trim(),
                tags: createDto.tags?.map((tag) => tag.trim()) || [],
                isTemplate: createDto.isTemplate || false,
                status: 'DRAFT',
                version: 1,
                accessLevel: createDto.accessLevel || 'STAFF_ONLY',
                accessCount: 0,
            }, { transaction });
            await this.addAuditTrail(document.id, 'CREATED', createDto.uploadedBy, undefined, transaction);
            await transaction.commit();
            return this.getDocumentById(document.id);
        }
        catch (error) {
            await transaction.rollback();
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new Error('Failed to create document. Please try again.');
        }
    }
    async updateDocument(id, updateDto, updatedBy) {
        const transaction = await this.sequelize.transaction({
            isolationLevel: sequelize_2.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
        });
        try {
            const document = await this.documentModel.findByPk(id);
            if (!document) {
                throw new common_1.NotFoundException(`Document with ID ${id} not found`);
            }
            const updateData = {};
            if (updateDto.title)
                updateData.title = updateDto.title.trim();
            if (updateDto.description !== undefined)
                updateData.description = updateDto.description?.trim();
            if (updateDto.status)
                updateData.status = updateDto.status;
            if (updateDto.tags)
                updateData.tags = updateDto.tags.map((tag) => tag.trim());
            if (updateDto.retentionDate)
                updateData.retentionDate = updateDto.retentionDate;
            if (updateDto.accessLevel)
                updateData.accessLevel = updateDto.accessLevel;
            await document.update(updateData, { transaction });
            await this.addAuditTrail(id, 'UPDATED', updatedBy, updateDto, transaction);
            await transaction.commit();
            return this.getDocumentById(id);
        }
        catch (error) {
            await transaction.rollback();
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new Error('Failed to update document. Please try again.');
        }
    }
    async deleteDocument(id, deletedBy) {
        const transaction = await this.sequelize.transaction({
            isolationLevel: sequelize_2.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
        });
        try {
            const document = await this.documentModel.findByPk(id);
            if (!document) {
                throw new common_1.NotFoundException(`Document with ID ${id} not found`);
            }
            await this.addAuditTrail(id, 'DELETED', deletedBy, undefined, transaction);
            await document.destroy({ transaction });
            await transaction.commit();
            return { success: true };
        }
        catch (error) {
            await transaction.rollback();
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new Error('Failed to delete document. Please try again.');
        }
    }
    async signDocument(signDto) {
        const transaction = await this.sequelize.transaction({
            isolationLevel: sequelize_2.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
        });
        try {
            const document = await this.documentModel.findByPk(signDto.documentId);
            if (!document) {
                throw new common_1.NotFoundException(`Document with ID ${signDto.documentId} not found`);
            }
            const signature = await this.signatureModel.create({
                documentId: signDto.documentId,
                signedBy: signDto.signedBy,
                signedByRole: signDto.signedByRole.trim(),
                signatureData: signDto.signatureData,
                ipAddress: signDto.ipAddress,
            }, { transaction });
            await document.update({ status: 'APPROVED' }, { transaction });
            await this.addAuditTrail(signDto.documentId, 'SIGNED', signDto.signedBy, { signedByRole: signDto.signedByRole }, transaction);
            await transaction.commit();
            return signature;
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async downloadDocument(documentId, downloadedBy, ipAddress) {
        const transaction = await this.sequelize.transaction();
        try {
            const document = await this.documentModel.findByPk(documentId, {
                transaction,
            });
            if (!document) {
                throw new common_1.NotFoundException(`Document with ID ${documentId} not found`);
            }
            await document.update({
                lastAccessedAt: new Date(),
                accessCount: document.accessCount + 1,
            }, { transaction });
            await this.addAuditTrail(documentId, 'DOWNLOADED', downloadedBy, { ipAddress, containsPHI: document.containsPHI }, transaction);
            await transaction.commit();
            return this.getDocumentById(documentId);
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async addAuditTrail(documentId, action, performedBy, changes, transaction) {
        try {
            await this.auditModel.create({
                documentId,
                action,
                performedBy,
                changes,
            }, { transaction });
        }
        catch (error) {
            console.error('Error adding audit trail:', error);
        }
    }
};
exports.DocumentService = DocumentService;
exports.DocumentService = DocumentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Document)),
    __param(1, (0, sequelize_1.InjectModel)(models_1.DocumentSignature)),
    __param(2, (0, sequelize_1.InjectModel)(models_1.DocumentAuditTrail)),
    __metadata("design:paramtypes", [Object, Object, Object, sequelize_typescript_1.Sequelize])
], DocumentService);
//# sourceMappingURL=document.service.js.map