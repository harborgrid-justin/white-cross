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
exports.StudentCrudService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const event_emitter_1 = require("@nestjs/event-emitter");
const models_1 = require("../../../database/models");
const models_2 = require("../../../database/models");
const query_cache_service_1 = require("../../../database/services/query-cache.service");
const request_context_service_1 = require("../../../common/context/request-context.service");
const base_1 = require("../../../common/base");
let StudentCrudService = class StudentCrudService extends base_1.BaseService {
    studentModel;
    userModel;
    sequelize;
    queryCacheService;
    requestContext;
    eventEmitter;
    constructor(studentModel, userModel, sequelize, queryCacheService, requestContext, eventEmitter) {
        super(requestContext ||
            {
                requestId: 'system',
                userId: undefined,
                getLogContext: () => ({ requestId: 'system' }),
                getAuditContext: () => ({
                    requestId: 'system',
                    timestamp: new Date(),
                }),
            });
        this.studentModel = studentModel;
        this.userModel = userModel;
        this.sequelize = sequelize;
        this.queryCacheService = queryCacheService;
        this.requestContext = requestContext;
        this.eventEmitter = eventEmitter;
    }
    async create(createStudentDto) {
        try {
            const normalizedData = this.normalizeCreateData(createStudentDto);
            await this.validateStudentNumber(normalizedData.studentNumber);
            if (normalizedData.medicalRecordNum) {
                await this.validateMedicalRecordNumber(normalizedData.medicalRecordNum);
            }
            this.validateDateOfBirth(normalizedData.dateOfBirth);
            if (normalizedData.nurseId) {
                await this.validateNurseAssignment(normalizedData.nurseId);
            }
            const student = await this.studentModel.create(normalizedData);
            if (this.eventEmitter) {
                this.eventEmitter.emit('student.created', {
                    studentId: student.id,
                    data: student,
                    userId: this.requestContext?.userId,
                });
            }
            this.logInfo(`Student created: ${student.id} (${student.studentNumber})`);
            return student;
        }
        catch (error) {
            this.handleError('Failed to create student', error);
        }
    }
    async findAll(filterDto) {
        try {
            const { page = 1, limit = 20, search, grade, isActive, nurseId, gender } = filterDto;
            const where = {};
            if (search) {
                where[sequelize_2.Op.or] = [
                    { firstName: { [sequelize_2.Op.iLike]: `%${search}%` } },
                    { lastName: { [sequelize_2.Op.iLike]: `%${search}%` } },
                    { studentNumber: { [sequelize_2.Op.iLike]: `%${search}%` } },
                ];
            }
            if (grade) {
                where.grade = grade;
            }
            if (isActive !== undefined) {
                where.isActive = isActive;
            }
            if (nurseId) {
                where.nurseId = nurseId;
            }
            if (gender) {
                where.gender = gender;
            }
            const result = await this.createPaginatedQuery(this.studentModel, {
                page,
                limit,
                where,
                order: [
                    ['lastName', 'ASC'],
                    ['firstName', 'ASC'],
                ],
                include: [
                    {
                        model: models_2.User,
                        as: 'nurse',
                        attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
                        required: false,
                    },
                ],
                attributes: {
                    exclude: ['schoolId', 'districtId'],
                },
                distinct: true,
            });
            return {
                data: result.data,
                meta: result.pagination,
            };
        }
        catch (error) {
            this.handleError('Failed to fetch students', error);
        }
    }
    async findOne(id) {
        try {
            this.validateUUID(id, 'Student ID');
            const students = await this.queryCacheService.findWithCache(this.studentModel, { where: { id } }, {
                ttl: 600,
                keyPrefix: 'student_detail',
                invalidateOn: ['update', 'destroy'],
            });
            if (!students || students.length === 0) {
                throw new common_1.NotFoundException(`Student with ID ${id} not found`);
            }
            return students[0];
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleError('Failed to fetch student', error);
        }
    }
    async update(id, updateStudentDto) {
        try {
            this.validateUUID(id, 'Student ID');
            const student = await this.findOne(id);
            const normalizedData = this.normalizeUpdateData(updateStudentDto);
            if (normalizedData.studentNumber && normalizedData.studentNumber !== student.studentNumber) {
                await this.validateStudentNumber(normalizedData.studentNumber, id);
            }
            if (normalizedData.medicalRecordNum &&
                normalizedData.medicalRecordNum !== student.medicalRecordNum) {
                await this.validateMedicalRecordNumber(normalizedData.medicalRecordNum, id);
            }
            if (normalizedData.dateOfBirth) {
                this.validateDateOfBirth(normalizedData.dateOfBirth);
            }
            if (normalizedData.nurseId) {
                await this.validateNurseAssignment(normalizedData.nurseId);
            }
            Object.assign(student, normalizedData);
            const updated = await student.save();
            if (this.eventEmitter) {
                this.eventEmitter.emit('student.updated', {
                    studentId: updated.id,
                    data: updated,
                    userId: this.requestContext?.userId,
                });
            }
            this.logInfo(`Student updated: ${updated.id} (${updated.studentNumber})`);
            return updated;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleError('Failed to update student', error);
        }
    }
    async remove(id) {
        try {
            this.validateUUID(id, 'Student ID');
            const student = await this.findOne(id);
            student.isActive = false;
            await student.save();
            if (this.eventEmitter) {
                this.eventEmitter.emit('student.deleted', {
                    studentId: id,
                    userId: this.requestContext?.userId,
                });
            }
            this.logInfo(`Student deleted (soft): ${id} (${student.studentNumber})`);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleError('Failed to delete student', error);
        }
    }
    async deactivate(id, reason) {
        try {
            this.validateUUID(id, 'Student ID');
            const student = await this.findOne(id);
            student.isActive = false;
            const updated = await student.save();
            this.logInfo(`Student deactivated: ${id} (${student.studentNumber})${reason ? `, reason: ${reason}` : ''}`);
            return updated;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleError('Failed to deactivate student', error);
        }
    }
    async reactivate(id) {
        try {
            this.validateUUID(id, 'Student ID');
            const student = await this.findOne(id);
            student.isActive = true;
            const updated = await student.save();
            this.logInfo(`Student reactivated: ${id} (${student.studentNumber})`);
            return updated;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleError('Failed to reactivate student', error);
        }
    }
    async transfer(id, transferDto) {
        try {
            this.validateUUID(id, 'Student ID');
            const student = await this.findOne(id);
            if (transferDto.nurseId) {
                await this.validateNurseAssignment(transferDto.nurseId);
                student.nurseId = transferDto.nurseId;
            }
            if (transferDto.grade) {
                student.grade = transferDto.grade;
            }
            const updated = await student.save();
            this.logInfo(`Student transferred: ${id} (${student.studentNumber})${transferDto.reason ? `, reason: ${transferDto.reason}` : ''}`);
            return updated;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleError('Failed to transfer student', error);
        }
    }
    async bulkUpdate(bulkUpdateDto) {
        try {
            const { studentIds, nurseId, grade, isActive } = bulkUpdateDto;
            return await this.sequelize.transaction({
                isolationLevel: sequelize_2.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
            }, async (transaction) => {
                if (nurseId) {
                    const nurse = await this.userModel.findOne({
                        where: {
                            id: nurseId,
                            role: models_2.UserRole.NURSE,
                            isActive: true,
                        },
                        transaction,
                    });
                    if (!nurse) {
                        throw new common_1.NotFoundException('Assigned nurse not found. Please select a valid, active nurse.');
                    }
                    this.logInfo(`Nurse validation successful: ${nurse.fullName} (${nurseId})`);
                }
                const updateData = {};
                if (nurseId !== undefined)
                    updateData.nurseId = nurseId;
                if (grade !== undefined)
                    updateData.grade = grade;
                if (isActive !== undefined)
                    updateData.isActive = isActive;
                const [affectedCount] = await this.studentModel.update(updateData, {
                    where: { id: { [sequelize_2.Op.in]: studentIds } },
                    transaction,
                });
                this.logInfo(`Bulk update: ${affectedCount} students updated`);
                return { updated: affectedCount };
            });
        }
        catch (error) {
            this.handleError('Failed to bulk update students', error);
        }
    }
    async search(query, limit = 20) {
        try {
            const students = await this.studentModel.findAll({
                where: {
                    isActive: true,
                    [sequelize_2.Op.or]: [
                        { firstName: { [sequelize_2.Op.iLike]: `%${query}%` } },
                        { lastName: { [sequelize_2.Op.iLike]: `%${query}%` } },
                        { studentNumber: { [sequelize_2.Op.iLike]: `%${query}%` } },
                    ],
                },
                order: [
                    ['lastName', 'ASC'],
                    ['firstName', 'ASC'],
                ],
                limit,
            });
            return students;
        }
        catch (error) {
            this.handleError('Failed to search students', error);
        }
    }
    async findByGrade(grade) {
        try {
            const students = await this.queryCacheService.findWithCache(this.studentModel, {
                where: { grade, isActive: true },
                order: [
                    ['lastName', 'ASC'],
                    ['firstName', 'ASC'],
                ],
            }, {
                ttl: 300,
                keyPrefix: 'students_by_grade',
                invalidateOn: ['create', 'update', 'destroy'],
            });
            return students;
        }
        catch (error) {
            this.handleError('Failed to fetch students by grade', error);
        }
    }
    async findByNurse(nurseId) {
        try {
            this.validateUUID(nurseId, 'Nurse ID');
            const students = await this.queryCacheService.findWithCache(this.studentModel, {
                where: { nurseId, isActive: true },
                order: [
                    ['lastName', 'ASC'],
                    ['firstName', 'ASC'],
                ],
            }, {
                ttl: 300,
                keyPrefix: 'students_by_nurse',
                invalidateOn: ['create', 'update', 'destroy'],
            });
            return students;
        }
        catch (error) {
            this.handleError('Failed to fetch students by nurse', error);
        }
    }
    async validateStudentNumber(studentNumber, excludeId) {
        const where = { studentNumber };
        if (excludeId) {
            where.id = { [sequelize_2.Op.ne]: excludeId };
        }
        const existing = await this.studentModel.findOne({ where });
        if (existing) {
            throw new common_1.ConflictException('Student number already exists');
        }
    }
    async validateMedicalRecordNumber(medicalRecordNum, excludeId) {
        const where = { medicalRecordNum };
        if (excludeId) {
            where.id = { [sequelize_2.Op.ne]: excludeId };
        }
        const existing = await this.studentModel.findOne({ where });
        if (existing) {
            throw new common_1.ConflictException('Medical record number already exists');
        }
    }
    validateDateOfBirth(dateOfBirth) {
        const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
        this.validateNotFuture(dob, 'Date of birth');
    }
    async validateNurseAssignment(nurseId) {
        this.validateUUID(nurseId, 'Nurse ID');
        const nurse = await this.userModel.findOne({
            where: {
                id: nurseId,
                role: models_2.UserRole.NURSE,
                isActive: true,
            },
        });
        if (!nurse) {
            throw new common_1.NotFoundException('Assigned nurse not found. Please select a valid, active nurse.');
        }
    }
    normalizeCreateData(data) {
        return {
            ...data,
            firstName: data.firstName?.trim(),
            lastName: data.lastName?.trim(),
            studentNumber: data.studentNumber?.trim()?.toUpperCase(),
        };
    }
    normalizeUpdateData(data) {
        const normalized = { ...data };
        if (normalized.firstName)
            normalized.firstName = normalized.firstName.trim();
        if (normalized.lastName)
            normalized.lastName = normalized.lastName.trim();
        if (normalized.studentNumber)
            normalized.studentNumber = normalized.studentNumber.trim().toUpperCase();
        if (normalized.email)
            normalized.email = normalized.email.trim().toLowerCase();
        return normalized;
    }
};
exports.StudentCrudService = StudentCrudService;
exports.StudentCrudService = StudentCrudService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Student)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.User)),
    __param(2, (0, sequelize_1.InjectConnection)()),
    __param(4, (0, common_1.Optional)()),
    __param(5, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [Object, Object, sequelize_2.Sequelize,
        query_cache_service_1.QueryCacheService,
        request_context_service_1.RequestContextService,
        event_emitter_1.EventEmitter2])
], StudentCrudService);
//# sourceMappingURL=student-crud.service.js.map