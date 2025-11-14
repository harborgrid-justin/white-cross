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
exports.DocumentController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const document_service_1 = require("./document.service");
const create_document_dto_1 = require("./dto/create-document.dto");
const sign_document_dto_1 = require("./dto/sign-document.dto");
const update_document_dto_1 = require("./dto/update-document.dto");
const decorators_1 = require("../services/auth/decorators");
const base_1 = require("../common/base");
let DocumentController = class DocumentController extends base_1.BaseController {
    documentService;
    constructor(documentService) {
        super();
        this.documentService = documentService;
    }
    async getDocuments(page, limit, category, status, studentId, uploadedBy, searchTerm) {
        const filters = { category, status, studentId, uploadedBy, searchTerm };
        return this.documentService.getDocuments(page, limit, filters);
    }
    async getDocumentById(id) {
        return this.documentService.getDocumentById(id);
    }
    async createDocument(createDto) {
        return this.documentService.createDocument(createDto);
    }
    async updateDocument(id, updateDto, userId) {
        const updatedBy = userId || 'system';
        return this.documentService.updateDocument(id, updateDto, updatedBy);
    }
    async deleteDocument(id, userId) {
        const deletedBy = userId || 'system';
        return this.documentService.deleteDocument(id, deletedBy);
    }
    async signDocument(signDto) {
        return this.documentService.signDocument(signDto);
    }
    async downloadDocument(id, userId, ipAddress) {
        const downloadedBy = userId || 'system';
        return this.documentService.downloadDocument(id, downloadedBy, ipAddress);
    }
};
exports.DocumentController = DocumentController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all documents with pagination and filters',
        description: 'Retrieves a paginated list of documents with optional filtering by category, status, student ID, uploader, and search terms. HIPAA compliant with audit logging.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: 'number',
        example: 1,
        description: 'Page number for pagination',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: 'number',
        example: 20,
        description: 'Items per page (max 100)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'category',
        required: false,
        description: 'Filter by document category',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        description: 'Filter by document status',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'studentId',
        required: false,
        description: 'Filter by student UUID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'uploadedBy',
        required: false,
        description: 'Filter by uploader user ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'searchTerm',
        required: false,
        description: 'Search in document titles and descriptions',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Documents retrieved successfully with pagination metadata',
        schema: {
            type: 'object',
            properties: {
                documents: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid' },
                            title: { type: 'string' },
                            category: { type: 'string' },
                            status: { type: 'string' },
                            fileSize: { type: 'number' },
                            mimeType: { type: 'string' },
                            uploadedAt: { type: 'string', format: 'date-time' },
                            studentId: { type: 'string', format: 'uuid', nullable: true },
                        },
                    },
                },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        pages: { type: 'number' },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('category')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('studentId')),
    __param(5, (0, common_1.Query)('uploadedBy')),
    __param(6, (0, common_1.Query)('searchTerm')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "getDocuments", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get document by ID with all associations',
        description: 'Retrieves a single document by UUID with full details including metadata, signatures, and access history. Logs access for HIPAA audit trail.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Document UUID', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Document retrieved successfully with full details',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },
                title: { type: 'string' },
                description: { type: 'string', nullable: true },
                category: { type: 'string' },
                status: { type: 'string' },
                filePath: { type: 'string' },
                fileName: { type: 'string' },
                mimeType: { type: 'string' },
                fileSize: { type: 'number' },
                uploadedBy: { type: 'string' },
                uploadedAt: { type: 'string', format: 'date-time' },
                studentId: { type: 'string', format: 'uuid', nullable: true },
                signatures: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            signedBy: { type: 'string' },
                            signedAt: { type: 'string', format: 'date-time' },
                            signatureType: { type: 'string' },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - No access to this document',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Document not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "getDocumentById", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new document',
        description: 'Creates a new document record with metadata. File upload is handled separately. Supports various document types including medical forms, consent documents, and reports.',
    }),
    (0, swagger_1.ApiBody)({ type: create_document_dto_1.CreateDocumentDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Document created successfully with generated UUID',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },
                title: { type: 'string' },
                category: { type: 'string' },
                status: { type: 'string', example: 'draft' },
                uploadedBy: { type: 'string' },
                uploadedAt: { type: 'string', format: 'date-time' },
                studentId: { type: 'string', format: 'uuid', nullable: true },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data or validation errors',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions to create documents',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_document_dto_1.CreateDocumentDto]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "createDocument", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing document' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Document updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Document not found' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_document_dto_1.UpdateDocumentDto, String]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "updateDocument", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a document' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Document deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Document not found' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "deleteDocument", null);
__decorate([
    (0, common_1.Post)(':id/sign'),
    (0, swagger_1.ApiOperation)({
        summary: 'Sign a document',
        description: 'Adds a digital signature to a document. Supports various signature types including electronic consent, parent approval, and medical authorization. Creates audit trail for legal compliance.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Document UUID', format: 'uuid' }),
    (0, swagger_1.ApiBody)({ type: sign_document_dto_1.SignDocumentDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Document signed successfully with signature record',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },
                signedBy: { type: 'string' },
                signedAt: { type: 'string', format: 'date-time' },
                signatureType: { type: 'string' },
                ipAddress: { type: 'string' },
                userAgent: { type: 'string' },
                documentStatus: { type: 'string', example: 'signed' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid signature data or document not signable',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - No permission to sign this document',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Document not found' }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Document already signed or in invalid state',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sign_document_dto_1.SignDocumentDto]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "signDocument", null);
__decorate([
    (0, common_1.Post)(':id/download'),
    (0, swagger_1.ApiOperation)({
        summary: 'Download a document (tracks access)',
        description: 'Initiates secure download of document file with comprehensive access logging. Tracks user, IP address, and timestamp for HIPAA audit compliance. Returns download URL or file stream.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Document UUID', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Document download initiated successfully',
        schema: {
            type: 'object',
            properties: {
                downloadUrl: {
                    type: 'string',
                    description: 'Secure temporary download URL',
                },
                fileName: { type: 'string' },
                fileSize: { type: 'number' },
                mimeType: { type: 'string' },
                expiresAt: { type: 'string', format: 'date-time' },
                accessRecordId: { type: 'string', format: 'uuid' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - No download permission for this document',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Document not found or file missing',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error or file system error',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __param(2, (0, decorators_1.IpAddress)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "downloadDocument", null);
exports.DocumentController = DocumentController = __decorate([
    (0, swagger_1.ApiTags)('documents'),
    (0, common_1.Controller)('documents'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [document_service_1.DocumentService])
], DocumentController);
//# sourceMappingURL=document.controller.js.map