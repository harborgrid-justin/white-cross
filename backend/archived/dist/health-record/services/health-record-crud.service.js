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
exports.HealthRecordCrudService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const base_1 = require("../../common/base");
let HealthRecordCrudService = class HealthRecordCrudService extends base_1.BaseService {
    healthRecordModel;
    studentModel;
    constructor(healthRecordModel, studentModel) {
        super("HealthRecordCrudService");
        this.healthRecordModel = healthRecordModel;
        this.studentModel = studentModel;
    }
    async getStudentHealthRecords(studentId, page = 1, limit = 20, filters = {}) {
        const whereClause = { studentId };
        if (filters.type) {
            whereClause.recordType = filters.type;
        }
        if (filters.dateFrom || filters.dateTo) {
            whereClause.recordDate = this.buildDateRangeClause('recordDate', filters.dateFrom, filters.dateTo);
        }
        if (filters.provider) {
            whereClause.provider = { [sequelize_2.Op.iLike]: `%${filters.provider}%` };
        }
        const result = await this.createPaginatedQuery(this.healthRecordModel, {
            page,
            limit,
            where: whereClause,
            include: [{ model: this.studentModel, as: 'student' }],
            order: [['recordDate', 'DESC']],
        });
        this.logInfo(`PHI Access: Health records retrieved for student ${studentId}, count: ${result.data.length}`);
        return {
            records: result.data,
            pagination: result.pagination,
        };
    }
    async createHealthRecord(data) {
        const student = await this.studentModel.findByPk(data.studentId);
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const healthRecord = await this.healthRecordModel.create(data);
        const record = await this.healthRecordModel.findByPk(healthRecord.id, {
            include: [{ model: this.studentModel, as: 'student' }],
        });
        if (!record) {
            throw new Error('Failed to reload health record after creation');
        }
        this.logInfo(`PHI Created: Health record ${record.recordType} for student ${record.student.firstName} ${record.student.lastName}`);
        return record;
    }
    async updateHealthRecord(id, data) {
        const existingRecord = await this.healthRecordModel.findOne({
            where: { id },
            include: [{ model: this.studentModel, as: 'student' }],
        });
        if (!existingRecord) {
            throw new common_1.NotFoundException('Health record not found');
        }
        await existingRecord.update(data);
        const record = await this.healthRecordModel.findByPk(id, {
            include: [{ model: this.studentModel, as: 'student' }],
        });
        if (!record) {
            throw new Error('Failed to reload health record after update');
        }
        this.logInfo(`PHI Modified: Health record ${record.recordType} updated for student ${record.student.firstName} ${record.student.lastName}`);
        return record;
    }
    async getVaccinationRecords(studentId) {
        const records = await this.healthRecordModel.findAll({
            where: {
                studentId,
                recordType: 'VACCINATION',
            },
            include: [{ model: this.studentModel, as: 'student' }],
            order: [['recordDate', 'DESC']],
        });
        this.logInfo(`PHI Access: Vaccination records retrieved for student ${studentId}, count: ${records.length}`);
        return records;
    }
    async bulkDeleteHealthRecords(recordIds) {
        if (!recordIds || recordIds.length === 0) {
            throw new Error('No record IDs provided');
        }
        const recordsToDelete = await this.healthRecordModel.findAll({
            where: {
                id: { [sequelize_2.Op.in]: recordIds },
            },
            include: [{ model: this.studentModel, as: 'student' }],
        });
        const deletedCount = await this.healthRecordModel.destroy({
            where: { id: { [sequelize_2.Op.in]: recordIds } },
        });
        const notFoundCount = recordIds.length - deletedCount;
        this.logWarning(`PHI Deletion: Bulk delete completed - ${deletedCount} records deleted, ${notFoundCount} not found`);
        if (recordsToDelete.length > 0) {
            const studentNames = [
                ...new Set(recordsToDelete.map((r) => `${r.student.firstName} ${r.student.lastName}`)),
            ];
            this.logWarning(`PHI Deletion: Records deleted for students: ${studentNames.join(', ')}`);
        }
        return {
            deleted: deletedCount,
            notFound: notFoundCount,
            success: true,
        };
    }
    async getAllHealthRecords(page = 1, limit = 20, filters = {}) {
        const whereClause = {};
        if (filters.type) {
            whereClause.recordType = filters.type;
        }
        if (filters.studentId) {
            whereClause.studentId = filters.studentId;
        }
        if (filters.dateFrom || filters.dateTo) {
            whereClause.recordDate = this.buildDateRangeClause('recordDate', filters.dateFrom, filters.dateTo);
        }
        if (filters.provider) {
            whereClause.provider = { [sequelize_2.Op.iLike]: `%${filters.provider}%` };
        }
        const result = await this.createPaginatedQuery(this.healthRecordModel, {
            page,
            limit,
            where: whereClause,
            include: [{ model: this.studentModel, as: 'student' }],
            order: [['recordDate', 'DESC']],
        });
        this.logInfo(`PHI Access: All health records retrieved, count: ${result.data.length}, filters: ${JSON.stringify(filters)}`);
        return {
            records: result.data,
            pagination: result.pagination,
        };
    }
    async getHealthRecord(studentId) {
        return this.healthRecordModel.findOne({
            where: { studentId },
            include: [{ model: this.studentModel, as: 'student' }],
        });
    }
    async getHealthRecordById(id) {
        const record = await this.healthRecordModel.findByPk(id, {
            include: [{ model: this.studentModel, as: 'student' }],
        });
        if (!record) {
            throw new common_1.NotFoundException(`Health record with ID ${id} not found`);
        }
        this.logInfo(`PHI Access: Health record ${id} retrieved for student ${record.student?.firstName} ${record.student?.lastName}`);
        return record;
    }
    async deleteHealthRecord(id) {
        const deletedCount = await this.healthRecordModel.destroy({
            where: { id },
        });
        if (deletedCount === 0) {
            throw new common_1.NotFoundException(`Health record with ID ${id} not found`);
        }
    }
};
exports.HealthRecordCrudService = HealthRecordCrudService;
exports.HealthRecordCrudService = HealthRecordCrudService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.HealthRecord)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.Student)),
    __metadata("design:paramtypes", [Object, Object])
], HealthRecordCrudService);
//# sourceMappingURL=health-record-crud.service.js.map