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
exports.ClinicalNoteController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const clinical_note_service_1 = require("../services/clinical-note.service");
const create_note_dto_1 = require("../dto/note/create-note.dto");
const update_note_dto_1 = require("../dto/note/update-note.dto");
const note_filters_dto_1 = require("../dto/note/note-filters.dto");
const base_1 = require("../../../common/base");
let ClinicalNoteController = class ClinicalNoteController extends base_1.BaseController {
    noteService;
    constructor(noteService) {
        super();
        this.noteService = noteService;
    }
    async create(createDto) {
        return this.noteService.create(createDto);
    }
    async findAll(filters) {
        return this.noteService.findAll(filters);
    }
    async findByVisit(visitId) {
        return this.noteService.findByVisit(visitId);
    }
    async findByStudent(studentId) {
        return this.noteService.findByStudent(studentId);
    }
    async findOne(id) {
        return this.noteService.findOne(id);
    }
    async update(id, updateDto) {
        return this.noteService.update(id, updateDto);
    }
    async sign(id) {
        return this.noteService.sign(id);
    }
    async remove(id) {
        await this.noteService.remove(id);
    }
};
exports.ClinicalNoteController = ClinicalNoteController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create clinical note',
        description: 'Creates a new clinical note for documenting student health visits, assessments, treatments, and clinical decisions. Supports structured SOAP format and free-text documentation.',
    }),
    (0, swagger_1.ApiBody)({ type: create_note_dto_1.CreateNoteDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Clinical note created successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Student or visit not found' }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/clinical-note.model").ClinicalNote }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_note_dto_1.CreateNoteDto]),
    __metadata("design:returntype", Promise)
], ClinicalNoteController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Query clinical notes',
        description: 'Retrieves clinical notes with filtering options by student, visit, date range, note type, or clinical staff. Supports pagination and sorting for large datasets.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'studentId',
        required: false,
        description: 'Filter by student ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'visitId',
        required: false,
        description: 'Filter by visit ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: false,
        description: 'Start date for filtering',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: false,
        description: 'End date for filtering',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'noteType',
        required: false,
        description: 'Filter by note type (SOAP, Progress, Assessment)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'authorId',
        required: false,
        description: 'Filter by note author ID',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Clinical notes retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [note_filters_dto_1.NoteFiltersDto]),
    __metadata("design:returntype", Promise)
], ClinicalNoteController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('visit/:visitId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get notes for a visit',
        description: 'Retrieves all clinical notes associated with a specific student visit. Returns notes in chronological order with author information and electronic signatures.',
    }),
    (0, swagger_1.ApiParam)({ name: 'visitId', description: 'Visit UUID', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Visit clinical notes retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Visit not found' }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/clinical-note.model").ClinicalNote] }),
    __param(0, (0, common_1.Param)('visitId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClinicalNoteController.prototype, "findByVisit", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get notes for a student',
        description: 'Retrieves comprehensive clinical documentation history for a student. Includes all clinical notes across visits, assessments, and health encounters for continuity of care.',
    }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student UUID', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student clinical notes retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Student not found' }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/clinical-note.model").ClinicalNote] }),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClinicalNoteController.prototype, "findByStudent", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get note by ID',
        description: 'Retrieves a specific clinical note by its UUID. Returns complete note content, metadata, signature status, and revision history.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Clinical note UUID', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Clinical note retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Clinical note not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/clinical-note.model").ClinicalNote }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClinicalNoteController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update clinical note',
        description: 'Updates an existing clinical note. Only unsigned notes can be modified. Creates an audit trail of changes with timestamp and editor information for regulatory compliance.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Clinical note UUID', format: 'uuid' }),
    (0, swagger_1.ApiBody)({ type: update_note_dto_1.UpdateNoteDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Clinical note updated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data or note already signed',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Clinical note not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/clinical-note.model").ClinicalNote }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_note_dto_1.UpdateNoteDto]),
    __metadata("design:returntype", Promise)
], ClinicalNoteController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/sign'),
    (0, swagger_1.ApiOperation)({
        summary: 'Sign clinical note',
        description: 'Applies electronic signature to a clinical note, finalizing the documentation. Once signed, the note becomes read-only and part of the permanent medical record.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Clinical note UUID', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Clinical note signed successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Note already signed or invalid state',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Clinical note not found' }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/clinical-note.model").ClinicalNote }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClinicalNoteController.prototype, "sign", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete clinical note',
        description: 'Soft deletes a clinical note. Signed notes cannot be deleted. Maintains audit trail and may be restricted by medical record retention policies.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Clinical note UUID', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Clinical note deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot delete signed note' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Clinical note not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClinicalNoteController.prototype, "remove", null);
exports.ClinicalNoteController = ClinicalNoteController = __decorate([
    (0, swagger_1.ApiTags)('Clinical - Clinical Notes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('clinical/notes'),
    __metadata("design:paramtypes", [clinical_note_service_1.ClinicalNoteService])
], ClinicalNoteController);
//# sourceMappingURL=clinical-note.controller.js.map