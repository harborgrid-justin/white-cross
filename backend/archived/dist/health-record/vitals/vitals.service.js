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
exports.VitalsService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
let VitalsService = class VitalsService extends base_1.BaseService {
    vitalSignsModel;
    studentModel;
    constructor(logger, vitalSignsModel, studentModel) {
        super({
            serviceName: 'VitalsService',
            logger,
            enableAuditLogging: true,
        });
        this.vitalSignsModel = vitalSignsModel;
        this.studentModel = studentModel;
    }
    async recordVitals(data) {
        this.logInfo(`Recording vitals for student ${data.studentId}`);
        const student = await this.studentModel.findByPk(data.studentId);
        if (!student) {
            throw new common_1.BadRequestException(`Student with ID ${data.studentId} not found`);
        }
        let bmi = null;
        let isAbnormal = false;
        const abnormalFlags = [];
        if (data.height && data.weight) {
            const heightInMeters = data.heightUnit === 'cm' ? data.height / 100 : data.height;
            const weightInKg = data.weightUnit === 'lbs' ? data.weight * 0.453592 : data.weight;
            bmi = parseFloat((weightInKg / (heightInMeters * heightInMeters)).toFixed(2));
            if (bmi < 14 || bmi > 30) {
                isAbnormal = true;
                abnormalFlags.push('BMI_OUT_OF_RANGE');
            }
        }
        if (data.bloodPressureSystolic && data.bloodPressureDiastolic) {
            if (data.bloodPressureSystolic > 130 ||
                data.bloodPressureDiastolic > 90) {
                isAbnormal = true;
                abnormalFlags.push('HIGH_BLOOD_PRESSURE');
            }
        }
        if (data.heartRate) {
            if (data.heartRate > 120 || data.heartRate < 60) {
                isAbnormal = true;
                abnormalFlags.push('ABNORMAL_HEART_RATE');
            }
        }
        if (data.temperature) {
            const temp = data.temperatureUnit === 'F'
                ? ((data.temperature - 32) * 5) / 9
                : data.temperature;
            if (temp > 38 || temp < 35) {
                isAbnormal = true;
                abnormalFlags.push('ABNORMAL_TEMPERATURE');
            }
        }
        if (data.oxygenSaturation && data.oxygenSaturation < 95) {
            isAbnormal = true;
            abnormalFlags.push('LOW_OXYGEN_SATURATION');
        }
        const vital = await this.vitalSignsModel.create({
            ...data,
            bmi,
            isAbnormal,
            abnormalFlags,
        });
        this.logInfo(`PHI Created: Vital signs recorded for student ${data.studentId}`);
        return vital;
    }
    async getVitalsHistory(studentId, limit) {
        this.logInfo(`Getting vitals history for student ${studentId}, limit: ${limit || 'all'}`);
        const student = await this.studentModel.findByPk(studentId);
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${studentId} not found`);
        }
        const queryOptions = {
            where: { studentId },
            order: [['measurementDate', 'DESC']],
        };
        if (limit) {
            queryOptions.limit = limit;
        }
        return await this.vitalSignsModel.findAll(queryOptions);
    }
    async detectAnomalies(studentId) {
        this.logInfo(`Detecting vital sign anomalies for student ${studentId}`);
        const history = await this.getVitalsHistory(studentId, 10);
        if (history.length === 0) {
            return { anomalies: [], warnings: [] };
        }
        const anomalies = [];
        const warnings = [];
        const recentAbnormal = history.filter((v) => v.isAbnormal);
        if (recentAbnormal.length > 0) {
            anomalies.push({
                type: 'RECENT_ABNORMAL_READINGS',
                count: recentAbnormal.length,
                message: `${recentAbnormal.length} recent measurements show abnormalities`,
                severity: 'HIGH',
                flags: [...new Set(recentAbnormal.flatMap((v) => v.abnormalFlags))],
            });
        }
        if (history.length >= 3) {
            const recent = history.slice(0, 3);
            const tempReadings = recent.filter((v) => v.temperature !== null && v.temperature !== undefined);
            if (tempReadings.length > 0) {
                const avgTemp = tempReadings.reduce((sum, v) => sum + (v.temperature || 0), 0) /
                    tempReadings.length;
                if (avgTemp > 37.5) {
                    warnings.push({
                        type: 'ELEVATED_TEMPERATURE_TREND',
                        value: avgTemp.toFixed(1),
                        message: 'Recent temperature readings are elevated',
                        severity: 'MEDIUM',
                    });
                }
            }
        }
        return { anomalies, warnings };
    }
    async getLatest(studentId) {
        this.logInfo(`Getting latest vitals for student ${studentId}`);
        const history = await this.getVitalsHistory(studentId, 1);
        return history[0] || null;
    }
    async getGrowthChart(studentId) {
        this.logInfo(`Getting growth chart data for student ${studentId}`);
        const vitals = await this.vitalSignsModel.findAll({
            where: {
                studentId,
            },
            order: [['measurementDate', 'ASC']],
        });
        const growthVitals = vitals.filter((v) => v.height !== null || v.weight !== null);
        const growthData = growthVitals.map((v) => ({
            date: v.measurementDate,
            height: v.height,
            heightUnit: v.heightUnit,
            weight: v.weight,
            weightUnit: v.weightUnit,
            bmi: v.bmi,
        }));
        return {
            studentId,
            dataPoints: growthData,
            totalMeasurements: growthData.length,
        };
    }
    calculateBMIPercentile(bmi, ageInMonths, gender) {
        this.logInfo(`Calculating BMI percentile for BMI ${bmi}, age ${ageInMonths} months, gender ${gender}`);
        let percentile = 50;
        if (bmi < 16)
            percentile = 5;
        else if (bmi < 17)
            percentile = 10;
        else if (bmi < 18.5)
            percentile = 25;
        else if (bmi < 25)
            percentile = 50;
        else if (bmi < 30)
            percentile = 85;
        else if (bmi < 35)
            percentile = 95;
        else
            percentile = 99;
        return {
            bmi,
            percentile,
            category: this.getBMICategory(percentile),
        };
    }
    getBMICategory(percentile) {
        if (percentile < 5)
            return 'UNDERWEIGHT';
        if (percentile < 85)
            return 'HEALTHY_WEIGHT';
        if (percentile < 95)
            return 'OVERWEIGHT';
        return 'OBESE';
    }
    async getTrends(studentId, metric, days = 30) {
        this.logInfo(`Getting ${metric} trends for student ${studentId} over ${days} days`);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const vitals = await this.vitalSignsModel.findAll({
            where: {
                studentId,
                measurementDate: {
                    [sequelize_2.Op.gte]: cutoffDate,
                },
                [metric]: {
                    [sequelize_2.Op.ne]: null,
                },
            },
            order: [['measurementDate', 'ASC']],
        });
        const values = vitals.map((v) => v[metric]).filter((v) => v !== null);
        const average = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
        const min = values.length > 0 ? Math.min(...values) : 0;
        const max = values.length > 0 ? Math.max(...values) : 0;
        return {
            metric,
            period: `${days} days`,
            dataPoints: vitals.map((v) => ({
                date: v.measurementDate,
                value: v[metric],
            })),
            statistics: {
                average: average.toFixed(2),
                min,
                max,
                count: values.length,
            },
        };
    }
    async getAbnormalVitals(studentId, days = 7) {
        this.logInfo(`Getting abnormal vitals${studentId ? ` for student ${studentId}` : ''} over ${days} days`);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const whereClause = {
            isAbnormal: true,
            measurementDate: {
                [sequelize_2.Op.gte]: cutoffDate,
            },
        };
        if (studentId) {
            whereClause.studentId = studentId;
        }
        return await this.vitalSignsModel.findAll({
            where: whereClause,
            include: [
                {
                    model: models_2.Student,
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
            order: [['measurementDate', 'DESC']],
        });
    }
    async getVitalsSummary(studentId) {
        this.logInfo(`Getting vitals summary for student ${studentId}`);
        const vitals = await this.vitalSignsModel.findAll({
            where: { studentId },
            order: [['measurementDate', 'DESC']],
        });
        if (vitals.length === 0) {
            return {
                studentId,
                totalMeasurements: 0,
                averageVitals: {
                    temperature: null,
                    heartRate: null,
                    bloodPressure: null,
                    oxygenSaturation: null,
                    bmi: null,
                },
                lastMeasurementDate: null,
                abnormalCount: 0,
            };
        }
        const tempReadings = vitals
            .filter((v) => v.temperature !== null)
            .map((v) => v.temperature);
        const heartRateReadings = vitals
            .filter((v) => v.heartRate !== null)
            .map((v) => v.heartRate);
        const systolicReadings = vitals
            .filter((v) => v.bloodPressureSystolic !== null)
            .map((v) => v.bloodPressureSystolic);
        const diastolicReadings = vitals
            .filter((v) => v.bloodPressureDiastolic !== null)
            .map((v) => v.bloodPressureDiastolic);
        const oxygenReadings = vitals
            .filter((v) => v.oxygenSaturation !== null)
            .map((v) => v.oxygenSaturation);
        const bmiReadings = vitals.filter((v) => v.bmi !== null).map((v) => v.bmi);
        const avgTemp = tempReadings.length > 0
            ? tempReadings.reduce((a, b) => a + b, 0) / tempReadings.length
            : null;
        const avgHeartRate = heartRateReadings.length > 0
            ? heartRateReadings.reduce((a, b) => a + b, 0) /
                heartRateReadings.length
            : null;
        const avgSystolic = systolicReadings.length > 0
            ? systolicReadings.reduce((a, b) => a + b, 0) / systolicReadings.length
            : null;
        const avgDiastolic = diastolicReadings.length > 0
            ? diastolicReadings.reduce((a, b) => a + b, 0) /
                diastolicReadings.length
            : null;
        const avgOxygen = oxygenReadings.length > 0
            ? oxygenReadings.reduce((a, b) => a + b, 0) / oxygenReadings.length
            : null;
        const avgBMI = bmiReadings.length > 0
            ? bmiReadings.reduce((a, b) => a + b, 0) / bmiReadings.length
            : null;
        const abnormalCount = vitals.filter((v) => v.isAbnormal).length;
        return {
            studentId,
            totalMeasurements: vitals.length,
            averageVitals: {
                temperature: avgTemp ? parseFloat(avgTemp.toFixed(1)) : null,
                heartRate: avgHeartRate ? Math.round(avgHeartRate) : null,
                bloodPressure: avgSystolic && avgDiastolic
                    ? `${Math.round(avgSystolic)}/${Math.round(avgDiastolic)}`
                    : null,
                oxygenSaturation: avgOxygen ? Math.round(avgOxygen) : null,
                bmi: avgBMI ? parseFloat(avgBMI.toFixed(1)) : null,
            },
            lastMeasurementDate: vitals[0].measurementDate,
            abnormalCount,
        };
    }
};
exports.VitalsService = VitalsService;
exports.VitalsService = VitalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __param(1, (0, sequelize_1.InjectModel)(models_1.VitalSigns)),
    __param(2, (0, sequelize_1.InjectModel)(models_2.Student)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService, Object, Object])
], VitalsService);
//# sourceMappingURL=vitals.service.js.map