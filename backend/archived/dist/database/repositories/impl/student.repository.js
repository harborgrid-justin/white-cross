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
exports.StudentRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const base_repository_1 = require("../base/base.repository");
const interfaces_1 = require("../../interfaces");
const student_model_1 = require("../../models/student.model");
let StudentRepository = class StudentRepository extends base_repository_1.BaseRepository {
    constructor(model, auditLogger, cacheManager) {
        super(model, auditLogger, cacheManager, 'Student');
    }
    async findByStudentNumber(studentNumber) {
        try {
            const cacheKey = this.cacheKeyBuilder.summary(this.entityName, studentNumber, 'by-number');
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                this.logger.debug(`Cache hit for student number: ${studentNumber}`);
                return cached;
            }
            const student = await this.model.findOne({
                where: { studentNumber },
            });
            if (!student) {
                return null;
            }
            const entity = this.mapToEntity(student);
            await this.cacheManager.set(cacheKey, entity, 1800);
            return entity;
        }
        catch (error) {
            this.logger.error('Error finding student by number:', error);
            throw new base_repository_1.RepositoryError('Failed to find student by number', 'FIND_BY_NUMBER_ERROR', 500, { studentNumber, error: error.message });
        }
    }
    async findByMedicalRecordNumber(medicalRecordNum) {
        try {
            const student = await this.model.findOne({
                where: { medicalRecordNum },
            });
            return student ? this.mapToEntity(student) : null;
        }
        catch (error) {
            this.logger.error('Error finding student by MRN:', error);
            throw new base_repository_1.RepositoryError('Failed to find student by medical record number', 'FIND_BY_MRN_ERROR', 500, { medicalRecordNum, error: error.message });
        }
    }
    async findByGrade(grade) {
        try {
            const students = await this.model.findAll({
                where: {
                    grade,
                    isActive: true,
                },
                order: [
                    ['lastName', 'ASC'],
                    ['firstName', 'ASC'],
                ],
            });
            return students.map((s) => this.mapToEntity(s));
        }
        catch (error) {
            this.logger.error('Error finding students by grade:', error);
            throw new base_repository_1.RepositoryError('Failed to find students by grade', 'FIND_BY_GRADE_ERROR', 500, { grade, error: error.message });
        }
    }
    async findByNurse(nurseId, options) {
        try {
            const students = await this.model.findAll({
                where: {
                    nurseId,
                    isActive: true,
                },
                order: [
                    ['lastName', 'ASC'],
                    ['firstName', 'ASC'],
                ],
            });
            return students.map((s) => this.mapToEntity(s));
        }
        catch (error) {
            this.logger.error('Error finding students by nurse:', error);
            throw new base_repository_1.RepositoryError('Failed to find students by nurse', 'FIND_BY_NURSE_ERROR', 500, { nurseId, error: error.message });
        }
    }
    async search(query) {
        try {
            const searchTerm = `%${query}%`;
            const students = await this.model.findAll({
                where: {
                    [sequelize_2.Op.or]: [
                        { firstName: { [sequelize_2.Op.iLike]: searchTerm } },
                        { lastName: { [sequelize_2.Op.iLike]: searchTerm } },
                        { studentNumber: { [sequelize_2.Op.iLike]: searchTerm } },
                        { medicalRecordNum: { [sequelize_2.Op.iLike]: searchTerm } },
                    ],
                    isActive: true,
                },
                order: [
                    ['lastName', 'ASC'],
                    ['firstName', 'ASC'],
                ],
                limit: 50,
            });
            return students.map((s) => this.mapToEntity(s));
        }
        catch (error) {
            this.logger.error('Error searching students:', error);
            throw new base_repository_1.RepositoryError('Failed to search students', 'SEARCH_ERROR', 500, { query, error: error.message });
        }
    }
    async getActiveCount() {
        try {
            return await this.model.count({
                where: { isActive: true },
            });
        }
        catch (error) {
            this.logger.error('Error counting active students:', error);
            return 0;
        }
    }
    async bulkAssignToNurse(studentIds, nurseId, context) {
        let transaction;
        try {
            transaction = await this.model.sequelize.transaction();
            await this.model.update({ nurseId }, {
                where: { id: { [sequelize_2.Op.in]: studentIds } },
                transaction,
            });
            await this.auditLogger.logBulkOperation('BULK_ASSIGN_NURSE', this.entityName, context, { studentIds, nurseId, count: studentIds.length });
            if (transaction) {
                await transaction.commit();
            }
            this.logger.log(`Bulk assigned ${studentIds.length} students to nurse ${nurseId}`);
        }
        catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            this.logger.error('Error bulk assigning students:', error);
            throw new base_repository_1.RepositoryError('Failed to bulk assign students to nurse', 'BULK_ASSIGN_ERROR', 500, { error: error.message });
        }
    }
    async validateCreate(data) {
        const existing = await this.model.findOne({
            where: { studentNumber: data.studentNumber },
        });
        if (existing) {
            throw new base_repository_1.RepositoryError('Student number already exists', 'DUPLICATE_STUDENT_NUMBER', 409, { studentNumber: data.studentNumber });
        }
        if (data.medicalRecordNum) {
            const existingMRN = await this.model.findOne({
                where: { medicalRecordNum: data.medicalRecordNum },
            });
            if (existingMRN) {
                throw new base_repository_1.RepositoryError('Medical record number already exists', 'DUPLICATE_MRN', 409, { medicalRecordNum: data.medicalRecordNum });
            }
        }
    }
    async validateUpdate(id, data) {
        if (data.studentNumber) {
            const existing = await this.model.findOne({
                where: {
                    studentNumber: data.studentNumber,
                    id: { [sequelize_2.Op.ne]: id },
                },
            });
            if (existing) {
                throw new base_repository_1.RepositoryError('Student number already exists', 'DUPLICATE_STUDENT_NUMBER', 409, { studentNumber: data.studentNumber });
            }
        }
    }
    async invalidateCaches(student) {
        try {
            const studentData = student.get();
            await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, studentData.id));
            if (studentData.studentNumber) {
                await this.cacheManager.delete(this.cacheKeyBuilder.summary(this.entityName, studentData.studentNumber, 'by-number'));
            }
            if (studentData.nurseId) {
                await this.cacheManager.deletePattern(`white-cross:student:nurse:${studentData.nurseId}:*`);
            }
            await this.cacheManager.deletePattern(`white-cross:student:grade:${studentData.grade}:*`);
        }
        catch (error) {
            this.logger.warn('Error invalidating student caches:', error);
        }
    }
    sanitizeForAudit(data) {
        return (0, interfaces_1.sanitizeSensitiveData)({
            ...data,
        });
    }
};
exports.StudentRepository = StudentRepository;
exports.StudentRepository = StudentRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(student_model_1.Student)),
    __param(1, (0, common_1.Inject)('IAuditLogger')),
    __param(2, (0, common_1.Inject)('ICacheManager')),
    __metadata("design:paramtypes", [Object, Object, Object])
], StudentRepository);
//# sourceMappingURL=student.repository.js.map