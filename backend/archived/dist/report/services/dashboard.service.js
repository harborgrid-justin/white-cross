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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const models_3 = require("../../database/models");
const models_4 = require("../../database/models");
const models_5 = require("../../database/models");
const models_6 = require("../../database/models");
const enums_1 = require("../../services/chronic-condition/enums");
const base_1 = require("../../common/base");
let DashboardService = class DashboardService extends base_1.BaseService {
    studentModel;
    appointmentModel;
    studentMedicationModel;
    incidentReportModel;
    allergyModel;
    chronicConditionModel;
    constructor(studentModel, appointmentModel, studentMedicationModel, incidentReportModel, allergyModel, chronicConditionModel) {
        super("DashboardService");
        this.studentModel = studentModel;
        this.appointmentModel = appointmentModel;
        this.studentMedicationModel = studentMedicationModel;
        this.incidentReportModel = incidentReportModel;
        this.allergyModel = allergyModel;
        this.chronicConditionModel = chronicConditionModel;
    }
    async getRealTimeDashboard() {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const [activeStudents, todaysAppointments, pendingMedications, recentIncidents, activeAllergies, chronicConditions,] = await Promise.all([
                this.studentModel.count({ where: { isActive: true } }),
                this.appointmentModel.count({
                    where: {
                        scheduledAt: { [sequelize_2.Op.between]: [today, tomorrow] },
                        status: 'SCHEDULED',
                    },
                }),
                this.studentMedicationModel.count({ where: { isActive: true } }),
                this.incidentReportModel.count({
                    where: {
                        createdAt: { [sequelize_2.Op.between]: [sevenDaysAgo, new Date()] },
                    },
                }),
                this.allergyModel.count({ where: { verified: true } }),
                this.chronicConditionModel.count({
                    where: { status: enums_1.ConditionStatus.ACTIVE },
                }),
            ]);
            this.logInfo('Dashboard metrics retrieved successfully');
            return {
                activeStudents,
                todaysAppointments,
                pendingMedications,
                recentIncidents,
                lowStockItems: 0,
                activeAllergies,
                chronicConditions,
                timestamp: new Date(),
            };
        }
        catch (error) {
            this.logError('Error fetching dashboard metrics:', error);
            throw error;
        }
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Student)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.Appointment)),
    __param(2, (0, sequelize_1.InjectModel)(models_3.StudentMedication)),
    __param(3, (0, sequelize_1.InjectModel)(models_4.IncidentReport)),
    __param(4, (0, sequelize_1.InjectModel)(models_5.Allergy)),
    __param(5, (0, sequelize_1.InjectModel)(models_6.ChronicCondition)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map