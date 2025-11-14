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
exports.HealthRecordBatchService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const base_1 = require("../../common/base");
let HealthRecordBatchService = class HealthRecordBatchService extends base_1.BaseService {
    healthRecordModel;
    studentModel;
    constructor(healthRecordModel, studentModel) {
        super("HealthRecordBatchService");
        this.healthRecordModel = healthRecordModel;
        this.studentModel = studentModel;
    }
    async findByIds(ids) {
        try {
            const records = await this.healthRecordModel.findAll({
                where: {
                    id: { [sequelize_2.Op.in]: ids },
                },
                include: [{ model: this.studentModel, as: 'student' }],
            });
            const recordMap = new Map(records.map((r) => [r.id, r]));
            return ids.map((id) => recordMap.get(id) || null);
        }
        catch (error) {
            this.logError(`Failed to batch fetch health records: ${error.message}`);
            throw new Error('Failed to batch fetch health records');
        }
    }
    async findByStudentIds(studentIds) {
        try {
            const records = await this.healthRecordModel.findAll({
                where: {
                    studentId: { [sequelize_2.Op.in]: studentIds },
                },
                include: [{ model: this.studentModel, as: 'student' }],
                order: [['recordDate', 'DESC']],
            });
            const grouped = new Map();
            for (const record of records) {
                if (!grouped.has(record.studentId)) {
                    grouped.set(record.studentId, []);
                }
                grouped.get(record.studentId).push(record);
            }
            return studentIds.map((id) => grouped.get(id) || []);
        }
        catch (error) {
            this.logError(`Failed to batch fetch health records by student IDs: ${error.message}`);
            throw new Error('Failed to batch fetch health records by student IDs');
        }
    }
};
exports.HealthRecordBatchService = HealthRecordBatchService;
exports.HealthRecordBatchService = HealthRecordBatchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.HealthRecord)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.Student)),
    __metadata("design:paramtypes", [Object, Object])
], HealthRecordBatchService);
//# sourceMappingURL=health-record-batch.service.js.map