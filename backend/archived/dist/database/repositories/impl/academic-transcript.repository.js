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
exports.AcademicTranscriptRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const base_repository_1 = require("../base/base.repository");
const audit_logger_interface_1 = require("../../interfaces/audit/audit-logger.interface");
const academic_transcript_model_1 = require("../../models/academic-transcript.model");
let AcademicTranscriptRepository = class AcademicTranscriptRepository extends base_repository_1.BaseRepository {
    academicTranscriptModel;
    constructor(academicTranscriptModel, auditLogger, cacheManager) {
        super(academicTranscriptModel, auditLogger, cacheManager, 'AcademicTranscript');
        this.academicTranscriptModel = academicTranscriptModel;
    }
    async validateCreate(data) {
        if (!data.studentId) {
            throw new base_repository_1.RepositoryError('Student ID is required', 'VALIDATION_ERROR');
        }
        if (!data.academicYear) {
            throw new base_repository_1.RepositoryError('Academic year is required', 'VALIDATION_ERROR');
        }
        if (!data.semester) {
            throw new base_repository_1.RepositoryError('Semester is required', 'VALIDATION_ERROR');
        }
        if (!data.grade) {
            throw new base_repository_1.RepositoryError('Grade level is required', 'VALIDATION_ERROR');
        }
        if (data.gpa < 0 || data.gpa > 4.0) {
            throw new base_repository_1.RepositoryError('GPA must be between 0 and 4.0', 'VALIDATION_ERROR');
        }
        if (!Array.isArray(data.subjects) || data.subjects.length === 0) {
            throw new base_repository_1.RepositoryError('At least one subject is required', 'VALIDATION_ERROR');
        }
        if (!data.attendance || typeof data.attendance !== 'object') {
            throw new base_repository_1.RepositoryError('Attendance record is required', 'VALIDATION_ERROR');
        }
        const existing = await this.academicTranscriptModel.findOne({
            where: {
                studentId: data.studentId,
                academicYear: data.academicYear,
                semester: data.semester,
            },
        });
        if (existing) {
            throw new base_repository_1.RepositoryError(`Academic transcript already exists for ${data.academicYear} ${data.semester}`, 'DUPLICATE_RECORD');
        }
    }
    async validateUpdate(id, data) {
        if (data.gpa !== undefined && (data.gpa < 0 || data.gpa > 4.0)) {
            throw new base_repository_1.RepositoryError('GPA must be between 0 and 4.0', 'VALIDATION_ERROR');
        }
        if (data.subjects !== undefined &&
            (!Array.isArray(data.subjects) || data.subjects.length === 0)) {
            throw new base_repository_1.RepositoryError('At least one subject is required', 'VALIDATION_ERROR');
        }
    }
    async invalidateCaches(entity) {
        try {
            const entityData = entity.get ? entity.get() : entity;
            await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, entityData.id));
            await this.cacheManager.delete(`white-cross:academic-transcripts:student:${entityData.studentId}`);
            await this.cacheManager.delete(`white-cross:academic-transcripts:year:${entityData.academicYear}`);
            await this.cacheManager.deletePattern(`white-cross:${this.entityName.toLowerCase()}:*`);
        }
        catch (error) {
            this.logger.warn(`Error invalidating ${this.entityName} caches:`, error);
        }
    }
    sanitizeForAudit(data) {
        return (0, audit_logger_interface_1.sanitizeSensitiveData)({ ...data });
    }
    async findByStudentId(studentId) {
        const cacheKey = `white-cross:academic-transcripts:student:${studentId}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }
        const transcripts = await this.academicTranscriptModel.findAll({
            where: { studentId },
            order: [
                ['academicYear', 'DESC'],
                ['semester', 'DESC'],
            ],
        });
        await this.cacheManager.set(cacheKey, transcripts, 3600);
        return transcripts;
    }
    async findByAcademicYear(academicYear) {
        const cacheKey = `white-cross:academic-transcripts:year:${academicYear}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }
        const transcripts = await this.academicTranscriptModel.findAll({
            where: { academicYear },
            order: [['gpa', 'DESC']],
        });
        await this.cacheManager.set(cacheKey, transcripts, 3600);
        return transcripts;
    }
};
exports.AcademicTranscriptRepository = AcademicTranscriptRepository;
exports.AcademicTranscriptRepository = AcademicTranscriptRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(academic_transcript_model_1.AcademicTranscript)),
    __param(1, (0, common_1.Inject)('IAuditLogger')),
    __param(2, (0, common_1.Inject)('ICacheManager')),
    __metadata("design:paramtypes", [Object, Object, Object])
], AcademicTranscriptRepository);
//# sourceMappingURL=academic-transcript.repository.js.map