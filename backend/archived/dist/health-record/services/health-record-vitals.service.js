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
exports.HealthRecordVitalsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../database/models");
const base_1 = require("../../common/base");
let HealthRecordVitalsService = class HealthRecordVitalsService extends base_1.BaseService {
    healthRecordModel;
    constructor(healthRecordModel) {
        super("HealthRecordVitalsService");
        this.healthRecordModel = healthRecordModel;
    }
    async getGrowthChartData(studentId) {
        const records = await this.healthRecordModel.findAll({
            where: {
                studentId,
                [sequelize_2.Op.or]: [
                    { metadata: { height: { [sequelize_2.Op.ne]: null } } },
                    { metadata: { weight: { [sequelize_2.Op.ne]: null } } },
                ],
            },
            order: [['recordDate', 'ASC']],
        });
        const growthData = records
            .map((record) => {
            const height = record.metadata?.height ? parseFloat(record.metadata.height) : undefined;
            const weight = record.metadata?.weight ? parseFloat(record.metadata.weight) : undefined;
            let bmi;
            if (height && weight) {
                const heightInMeters = height / 100;
                bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
            }
            return {
                date: record.recordDate,
                height,
                weight,
                bmi,
                recordType: record.recordType,
            };
        })
            .filter((point) => point.height !== undefined || point.weight !== undefined);
        this.logInfo(`PHI Access: Growth chart data retrieved for student ${studentId}, data points: ${growthData.length}`);
        return growthData;
    }
    async getRecentVitals(studentId, limit = 10) {
        const records = await this.healthRecordModel.findAll({
            where: {
                studentId,
                recordType: {
                    [sequelize_2.Op.in]: ['VITAL_SIGNS_CHECK', 'CHECKUP', 'PHYSICAL_EXAM'],
                },
            },
            order: [['recordDate', 'DESC']],
            limit,
        });
        const vitals = records
            .map((record) => ({
            studentId,
            measurementDate: record.recordDate,
            isAbnormal: false,
            temperature: record.metadata?.temperature,
            bloodPressureSystolic: record.metadata?.bloodPressureSystolic,
            bloodPressureDiastolic: record.metadata?.bloodPressureDiastolic,
            heartRate: record.metadata?.heartRate,
            respiratoryRate: record.metadata?.respiratoryRate,
            oxygenSaturation: record.metadata?.oxygenSaturation,
            height: record.metadata?.height,
            weight: record.metadata?.weight,
            bmi: record.metadata?.bmi,
        }))
            .filter((vital) => Object.values(vital).some((v) => v !== undefined));
        this.logInfo(`PHI Access: Recent vitals retrieved for student ${studentId}, count: ${vitals.length}`);
        return vitals;
    }
};
exports.HealthRecordVitalsService = HealthRecordVitalsService;
exports.HealthRecordVitalsService = HealthRecordVitalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.HealthRecord)),
    __metadata("design:paramtypes", [Object])
], HealthRecordVitalsService);
//# sourceMappingURL=health-record-vitals.service.js.map