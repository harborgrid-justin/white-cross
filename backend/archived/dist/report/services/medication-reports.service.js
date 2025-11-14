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
exports.MedicationReportsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_2 = require("sequelize");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const base_1 = require("../../common/base");
let MedicationReportsService = class MedicationReportsService extends base_1.BaseService {
    medicationLogModel;
    studentMedicationModel;
    sequelize;
    constructor(medicationLogModel, studentMedicationModel, sequelize) {
        super("MedicationReportsService");
        this.medicationLogModel = medicationLogModel;
        this.studentMedicationModel = studentMedicationModel;
        this.sequelize = sequelize;
    }
    async getMedicationUsageReport(dto) {
        try {
            const { startDate, endDate, medicationId } = dto;
            const whereClause = {};
            if (startDate || endDate) {
                whereClause.administeredAt = {};
                if (startDate && endDate) {
                    whereClause.administeredAt = { [sequelize_2.Op.between]: [startDate, endDate] };
                }
                else if (startDate) {
                    whereClause.administeredAt = { [sequelize_2.Op.gte]: startDate };
                }
                else if (endDate) {
                    whereClause.administeredAt = { [sequelize_2.Op.lte]: endDate };
                }
            }
            const administrationLogs = await this.medicationLogModel.findAll({
                include: [
                    {
                        model: this.studentMedicationModel,
                        as: 'studentMedication',
                        include: [
                            {
                                model: this.studentMedicationModel.associations.medication?.target,
                                as: 'medication',
                            },
                            {
                                model: this.studentMedicationModel.associations.student?.target,
                                as: 'student',
                            },
                        ],
                    },
                    {
                        model: this.medicationLogModel.associations.nurse?.target,
                        as: 'nurse',
                    },
                ],
                where: medicationId
                    ? { ...whereClause, '$studentMedication.medicationId$': medicationId }
                    : whereClause,
                order: [['administeredAt', 'DESC']],
                limit: 100,
            });
            const totalScheduled = await this.studentMedicationModel.count({
                where: { isActive: true },
            });
            const totalLogs = await this.medicationLogModel.count({
                where: whereClause,
            });
            const topMedicationsRaw = await this.sequelize.query(`SELECT
          m.id as "medicationId",
          m.name as "medicationName",
          COUNT(ml.id)::integer as count
        FROM medication_logs ml
        INNER JOIN student_medications sm ON ml."studentMedicationId" = sm.id
        INNER JOIN medications m ON sm."medicationId" = m.id
        ${startDate || endDate ? 'WHERE' : ''}
        ${startDate ? `ml."timeGiven" >= $1` : ''}
        ${startDate && endDate ? 'AND' : ''}
        ${endDate && startDate ? `ml."timeGiven" <= $2` : endDate ? `ml."timeGiven" <= $1` : ''}
        GROUP BY m.id, m.name
        ORDER BY count DESC
        LIMIT 10`, {
                bind: startDate && endDate
                    ? [startDate, endDate]
                    : startDate
                        ? [startDate]
                        : endDate
                            ? [endDate]
                            : [],
                type: sequelize_2.QueryTypes.SELECT,
            });
            const topMedications = topMedicationsRaw.map((record) => ({
                medicationName: record.medicationName,
                count: parseInt(String(record.count), 10),
            }));
            const adverseReactionsWhere = {
                sideEffects: { [sequelize_2.Op.ne]: null },
                ...whereClause,
            };
            const adverseReactions = await this.medicationLogModel.findAll({
                where: adverseReactionsWhere,
                include: [
                    {
                        model: this.studentMedicationModel,
                        as: 'studentMedication',
                        include: [
                            {
                                model: this.studentMedicationModel.associations.medication?.target,
                                as: 'medication',
                            },
                            {
                                model: this.studentMedicationModel.associations.student?.target,
                                as: 'student',
                            },
                        ],
                    },
                    {
                        model: this.medicationLogModel.associations.nurse?.target,
                        as: 'nurse',
                    },
                ],
                order: [['administeredAt', 'DESC']],
            });
            this.logInfo(`Medication usage report generated: ${administrationLogs.length} logs, ${adverseReactions.length} adverse reactions, compliance: ${totalLogs}/${totalScheduled}`);
            return {
                administrationLogs,
                totalScheduled,
                totalLogs,
                topMedications,
                adverseReactions,
            };
        }
        catch (error) {
            this.logError('Error getting medication usage report:', error);
            throw error;
        }
    }
};
exports.MedicationReportsService = MedicationReportsService;
exports.MedicationReportsService = MedicationReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.MedicationLog)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.StudentMedication)),
    __metadata("design:paramtypes", [Object, Object, sequelize_typescript_1.Sequelize])
], MedicationReportsService);
//# sourceMappingURL=medication-reports.service.js.map