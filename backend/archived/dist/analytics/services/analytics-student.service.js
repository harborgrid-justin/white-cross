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
exports.AnalyticsStudentService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const database_1 = require("../../database");
const sequelize_2 = require("sequelize");
const base_1 = require("../../common/base");
let AnalyticsStudentService = class AnalyticsStudentService extends base_1.BaseService {
    healthRecordModel;
    appointmentModel;
    medicationLogModel;
    constructor(healthRecordModel, appointmentModel, medicationLogModel) {
        super("AnalyticsStudentService");
        this.healthRecordModel = healthRecordModel;
        this.appointmentModel = appointmentModel;
        this.medicationLogModel = medicationLogModel;
    }
    async getStudentHealthMetrics(studentId, query) {
        try {
            const startDate = query.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const endDate = query.endDate || new Date();
            const healthRecords = await this.healthRecordModel.findAll({
                where: {
                    studentId,
                    recordDate: {
                        [sequelize_2.Op.between]: [startDate, endDate],
                    },
                },
                order: [['recordDate', 'DESC']],
                limit: 100,
            });
            const medicationLogs = await this.medicationLogModel.findAll({
                where: {
                    studentId,
                    administeredAt: {
                        [sequelize_2.Op.between]: [startDate, endDate],
                    },
                },
                order: [['administeredAt', 'DESC']],
                limit: 100,
            });
            const appointments = await this.appointmentModel.findAll({
                where: {
                    studentId,
                    scheduledAt: {
                        [sequelize_2.Op.between]: [startDate, endDate],
                    },
                },
                order: [['scheduledAt', 'DESC']],
                limit: 50,
            });
            const adherenceMetrics = this.calculateMedicationAdherence(medicationLogs);
            const vitalSignsRecords = this.extractVitalSigns(healthRecords);
            const healthVisitsByType = this.groupHealthVisitsByType(healthRecords);
            const appointmentMetrics = this.calculateAppointmentMetrics(appointments);
            const trends = {
                vitalSigns: vitalSignsRecords,
                healthVisits: healthRecords.map((record) => ({
                    id: record.id,
                    type: record.recordType,
                    title: record.title,
                    date: record.recordDate,
                    provider: record.provider,
                })),
                healthVisitsByType,
                medicationAdherence: adherenceMetrics,
                appointments: appointmentMetrics,
            };
            this.logInfo(`Student health metrics retrieved: ${studentId} (${healthRecords.length} health records, ${medicationLogs.length} medication logs, ${appointments.length} appointments)`);
            return {
                studentId,
                trends,
                period: { startDate, endDate },
                includesHistoricalData: query.includeHistory !== false,
            };
        }
        catch (error) {
            this.logError('Error getting student health metrics', error);
            throw error;
        }
    }
    calculateMedicationAdherence(medicationLogs) {
        const scheduledMedications = medicationLogs.length;
        const administeredMedications = medicationLogs.filter((log) => log.status === 'ADMINISTERED').length;
        const adherenceRate = scheduledMedications > 0
            ? Math.round((administeredMedications / scheduledMedications) * 100)
            : 100;
        return {
            rate: adherenceRate,
            scheduled: scheduledMedications,
            administered: administeredMedications,
            missedDoses: scheduledMedications - administeredMedications,
        };
    }
    extractVitalSigns(healthRecords) {
        return healthRecords
            .filter((record) => record.recordType === 'VITAL_SIGNS_CHECK' &&
            record.metadata?.vitalSigns)
            .map((record) => ({
            date: record.recordDate,
            ...(record.metadata?.vitalSigns || {}),
        }));
    }
    groupHealthVisitsByType(healthRecords) {
        return healthRecords.reduce((acc, record) => {
            const type = record.recordType;
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});
    }
    calculateAppointmentMetrics(appointments) {
        return {
            total: appointments.length,
            completed: appointments.filter((apt) => apt.status === 'COMPLETED')
                .length,
            upcoming: appointments.filter((apt) => apt.status === 'SCHEDULED')
                .length,
            cancelled: appointments.filter((apt) => apt.status === 'CANCELLED')
                .length,
        };
    }
};
exports.AnalyticsStudentService = AnalyticsStudentService;
exports.AnalyticsStudentService = AnalyticsStudentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.HealthRecord)),
    __param(1, (0, sequelize_1.InjectModel)(database_1.Appointment)),
    __param(2, (0, sequelize_1.InjectModel)(database_1.MedicationLog)),
    __metadata("design:paramtypes", [Object, Object, Object])
], AnalyticsStudentService);
//# sourceMappingURL=analytics-student.service.js.map