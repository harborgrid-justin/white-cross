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
var DashboardService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const base_1 = require("../../common/base");
var AppointmentStatus;
(function (AppointmentStatus) {
    AppointmentStatus["SCHEDULED"] = "SCHEDULED";
    AppointmentStatus["IN_PROGRESS"] = "IN_PROGRESS";
    AppointmentStatus["COMPLETED"] = "COMPLETED";
    AppointmentStatus["CANCELLED"] = "CANCELLED";
    AppointmentStatus["NO_SHOW"] = "NO_SHOW";
})(AppointmentStatus || (AppointmentStatus = {}));
var AppointmentType;
(function (AppointmentType) {
    AppointmentType["ROUTINE_CHECKUP"] = "ROUTINE_CHECKUP";
    AppointmentType["SICK_VISIT"] = "SICK_VISIT";
    AppointmentType["MEDICATION_ADMINISTRATION"] = "MEDICATION_ADMINISTRATION";
    AppointmentType["INJURY_ASSESSMENT"] = "INJURY_ASSESSMENT";
    AppointmentType["EMERGENCY"] = "EMERGENCY";
    AppointmentType["FOLLOW_UP"] = "FOLLOW_UP";
    AppointmentType["HEALTH_SCREENING"] = "HEALTH_SCREENING";
})(AppointmentType || (AppointmentType = {}));
var AllergySeverity;
(function (AllergySeverity) {
    AllergySeverity["MILD"] = "MILD";
    AllergySeverity["MODERATE"] = "MODERATE";
    AllergySeverity["SEVERE"] = "SEVERE";
    AllergySeverity["LIFE_THREATENING"] = "LIFE_THREATENING";
})(AllergySeverity || (AllergySeverity = {}));
let DashboardService = class DashboardService extends base_1.BaseService {
    static { DashboardService_1 = this; }
    sequelize;
    static CACHE_TTL = 5 * 60 * 1000;
    statsCache = {
        data: null,
        timestamp: 0,
    };
    constructor(sequelize) {
        super('DashboardService');
        this.sequelize = sequelize;
    }
    getModel(modelName) {
        return this.sequelize.models[modelName];
    }
    async getDashboardStats() {
        try {
            const now = Date.now();
            if (this.statsCache.data && now - this.statsCache.timestamp < DashboardService_1.CACHE_TTL) {
                this.logDebug('Returning cached dashboard stats');
                return this.statsCache.data;
            }
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const lastMonth = new Date(today);
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            const Student = this.getModel('Student');
            const StudentMedication = this.getModel('StudentMedication');
            const Appointment = this.getModel('Appointment');
            const IncidentReport = this.getModel('IncidentReport');
            const Allergy = this.getModel('Allergy');
            const results = await Promise.allSettled([
                Student.count({ where: { isActive: true } }),
                StudentMedication.count({
                    where: {
                        isActive: true,
                        startDate: { [sequelize_2.Op.lte]: today },
                        [sequelize_2.Op.or]: [{ endDate: null }, { endDate: { [sequelize_2.Op.gte]: today } }],
                    },
                }),
                Appointment.count({
                    where: {
                        scheduledAt: {
                            [sequelize_2.Op.gte]: today,
                            [sequelize_2.Op.lt]: tomorrow,
                        },
                        status: {
                            [sequelize_2.Op.in]: [AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS],
                        },
                    },
                }),
                IncidentReport.count({
                    where: { followUpRequired: true },
                }),
                StudentMedication.count({
                    where: {
                        isActive: true,
                        startDate: { [sequelize_2.Op.lte]: today },
                        [sequelize_2.Op.or]: [{ endDate: null }, { endDate: { [sequelize_2.Op.gte]: today } }],
                    },
                }),
                (async () => {
                    const allergiesWithActiveStudents = await Allergy.findAll({
                        attributes: ['id'],
                        where: {
                            severity: {
                                [sequelize_2.Op.in]: [AllergySeverity.SEVERE, AllergySeverity.LIFE_THREATENING],
                            },
                            active: true,
                        },
                        include: [
                            {
                                model: Student,
                                as: 'student',
                                attributes: [],
                                where: { isActive: true },
                                required: true,
                            },
                        ],
                        raw: true,
                    });
                    return allergiesWithActiveStudents.length;
                })(),
                Student.count({
                    where: {
                        isActive: true,
                        createdAt: { [sequelize_2.Op.lte]: lastMonth },
                    },
                }),
                StudentMedication.count({
                    where: {
                        isActive: true,
                        createdAt: { [sequelize_2.Op.lte]: lastMonth },
                    },
                }),
                Appointment.count({
                    where: {
                        scheduledAt: {
                            [sequelize_2.Op.gte]: lastMonth,
                            [sequelize_2.Op.lt]: today,
                        },
                    },
                }),
            ]);
            const metricNames = [
                'totalStudents',
                'activeMedications',
                'todaysAppointments',
                'pendingIncidents',
                'medicationsDueToday',
                'healthAlerts',
                'studentsLastMonth',
                'medicationsLastMonth',
                'appointmentsLastMonth',
            ];
            const [totalStudents, activeMedications, todaysAppointments, pendingIncidents, medicationsDueToday, healthAlerts, studentsLastMonth, medicationsLastMonth, appointmentsLastMonth,] = results.map((result, index) => {
                if (result.status === 'fulfilled') {
                    return result.value;
                }
                else {
                    this.logError(`Dashboard metric '${metricNames[index]}' failed: ${result.reason?.message || result.reason}`);
                    return 0;
                }
            });
            const studentChange = studentsLastMonth > 0
                ? (((totalStudents - studentsLastMonth) / studentsLastMonth) * 100).toFixed(1)
                : '0';
            const medicationChange = medicationsLastMonth > 0
                ? (((activeMedications - medicationsLastMonth) / medicationsLastMonth) * 100).toFixed(1)
                : '0';
            const appointmentChange = appointmentsLastMonth > 0
                ? (((todaysAppointments - appointmentsLastMonth) / appointmentsLastMonth) * 100).toFixed(1)
                : '0';
            const getTrendType = (change) => {
                const numChange = Number(change);
                return numChange > 0 ? 'positive' : numChange < 0 ? 'negative' : 'neutral';
            };
            const recentActivityCount = await this.getRecentActivitiesCount();
            const stats = {
                totalStudents,
                activeMedications,
                todaysAppointments,
                pendingIncidents,
                medicationsDueToday,
                healthAlerts,
                recentActivityCount,
                studentTrend: {
                    value: totalStudents.toString(),
                    change: `${Number(studentChange) > 0 ? '+' : ''}${studentChange}%`,
                    changeType: getTrendType(studentChange),
                },
                medicationTrend: {
                    value: activeMedications.toString(),
                    change: `${Number(medicationChange) > 0 ? '+' : ''}${medicationChange}%`,
                    changeType: getTrendType(medicationChange),
                },
                appointmentTrend: {
                    value: todaysAppointments.toString(),
                    change: `${Number(appointmentChange) > 0 ? '+' : ''}${appointmentChange}%`,
                    changeType: getTrendType(appointmentChange),
                },
            };
            this.statsCache = {
                data: stats,
                timestamp: now,
            };
            this.logInfo('Dashboard stats retrieved successfully');
            return stats;
        }
        catch (error) {
            this.logError('Error fetching dashboard stats', error instanceof Error ? error.stack : undefined);
            throw new common_1.InternalServerErrorException('Failed to fetch dashboard statistics');
        }
    }
    async getRecentActivities(limit = 5) {
        try {
            const activities = [];
            const MedicationLog = this.getModel('MedicationLog');
            const StudentMedication = this.getModel('StudentMedication');
            const Student = this.getModel('Student');
            const Medication = this.getModel('Medication');
            const User = this.getModel('User');
            const IncidentReport = this.getModel('IncidentReport');
            const Appointment = this.getModel('Appointment');
            const now = new Date();
            const [recentMeds, recentIncidents, upcomingAppointments] = await Promise.all([
                MedicationLog.findAll({
                    limit: 3,
                    order: [['timeGiven', 'DESC']],
                    include: [
                        {
                            model: StudentMedication,
                            as: 'studentMedication',
                            required: true,
                            include: [
                                {
                                    model: Student,
                                    as: 'student',
                                    attributes: ['id', 'firstName', 'lastName'],
                                    required: true,
                                },
                                {
                                    model: Medication,
                                    as: 'medication',
                                    attributes: ['id', 'name'],
                                    required: true,
                                },
                            ],
                        },
                        {
                            model: User,
                            as: 'nurse',
                            attributes: ['id', 'firstName', 'lastName'],
                            required: false,
                        },
                    ],
                }),
                IncidentReport.findAll({
                    limit: 2,
                    order: [['createdAt', 'DESC']],
                    include: [
                        {
                            model: Student,
                            as: 'student',
                            attributes: ['id', 'firstName', 'lastName'],
                            required: true,
                        },
                    ],
                }),
                Appointment.findAll({
                    limit: 2,
                    where: {
                        scheduledAt: { [sequelize_2.Op.gte]: now },
                        status: AppointmentStatus.SCHEDULED,
                    },
                    order: [['scheduledAt', 'ASC']],
                    include: [
                        {
                            model: Student,
                            as: 'student',
                            attributes: ['id', 'firstName', 'lastName'],
                            required: true,
                        },
                    ],
                }),
            ]);
            recentMeds.forEach((med) => {
                const studentMedication = med.studentMedication;
                if (studentMedication && studentMedication.student && studentMedication.medication) {
                    activities.push({
                        id: med.id,
                        type: 'medication',
                        message: `Administered ${studentMedication.medication.name} to ${studentMedication.student.firstName} ${studentMedication.student.lastName}`,
                        time: this.formatRelativeTime(med.timeGiven),
                        status: 'completed',
                    });
                }
            });
            recentIncidents.forEach((incident) => {
                const student = incident.student;
                if (student) {
                    const typeFormatted = incident.type.toLowerCase().replace(/_/g, ' ');
                    activities.push({
                        id: incident.id,
                        type: 'incident',
                        message: `New ${typeFormatted} report for ${student.firstName} ${student.lastName}`,
                        time: this.formatRelativeTime(incident.createdAt),
                        status: incident.followUpRequired ? 'pending' : 'completed',
                    });
                }
            });
            upcomingAppointments.forEach((apt) => {
                const student = apt.student;
                if (student) {
                    const typeFormatted = apt.type.toLowerCase().replace(/_/g, ' ');
                    activities.push({
                        id: apt.id,
                        type: 'appointment',
                        message: `Upcoming ${typeFormatted} with ${student.firstName} ${student.lastName}`,
                        time: this.formatFutureTime(apt.scheduledAt),
                        status: 'upcoming',
                    });
                }
            });
            return activities.slice(0, limit);
        }
        catch (error) {
            this.logError('Error fetching recent activities', error instanceof Error ? error.stack : undefined);
            throw new common_1.InternalServerErrorException('Failed to fetch recent activities');
        }
    }
    async getUpcomingAppointments(limit = 5) {
        try {
            const now = new Date();
            const Appointment = this.getModel('Appointment');
            const Student = this.getModel('Student');
            const appointments = await Appointment.findAll({
                limit,
                where: {
                    scheduledAt: { [sequelize_2.Op.gte]: now },
                    status: {
                        [sequelize_2.Op.in]: [AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS],
                    },
                },
                order: [['scheduledAt', 'ASC']],
                include: [
                    {
                        model: Student,
                        as: 'student',
                        attributes: ['id', 'firstName', 'lastName'],
                        required: true,
                    },
                ],
            });
            return appointments.map((apt) => {
                const student = apt.student;
                let priority = 'medium';
                if (apt.type === AppointmentType.MEDICATION_ADMINISTRATION ||
                    apt.type === AppointmentType.EMERGENCY) {
                    priority = 'high';
                }
                else if (apt.type === AppointmentType.ROUTINE_CHECKUP) {
                    priority = 'low';
                }
                const timeStr = apt.scheduledAt.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                });
                const typeFormatted = apt.type
                    .replace(/_/g, ' ')
                    .toLowerCase()
                    .replace(/\b\w/g, (l) => l.toUpperCase());
                return {
                    id: apt.id,
                    student: student ? `${student.firstName} ${student.lastName}` : 'Unknown',
                    studentId: student ? student.id : '',
                    time: timeStr,
                    type: typeFormatted,
                    priority,
                };
            });
        }
        catch (error) {
            this.logError('Error fetching upcoming appointments', error instanceof Error ? error.stack : undefined);
            throw new common_1.InternalServerErrorException('Failed to fetch upcoming appointments');
        }
    }
    async getChartData(period = 'week') {
        try {
            const now = new Date();
            const startDate = new Date();
            let dateFormat = {
                month: 'short',
                day: 'numeric',
            };
            if (period === 'week') {
                startDate.setDate(now.getDate() - 7);
            }
            else if (period === 'month') {
                startDate.setMonth(now.getMonth() - 1);
            }
            else {
                startDate.setFullYear(now.getFullYear() - 1);
                dateFormat = { month: 'short' };
            }
            const Student = this.getModel('Student');
            const MedicationLog = this.getModel('MedicationLog');
            const IncidentReport = this.getModel('IncidentReport');
            const Appointment = this.getModel('Appointment');
            const [enrollmentData, medicationData, incidentData, appointmentData] = await Promise.all([
                Student.findAll({
                    attributes: [
                        [(0, sequelize_2.fn)('DATE', (0, sequelize_2.col)('createdAt')), 'date'],
                        [(0, sequelize_2.fn)('COUNT', (0, sequelize_2.col)('id')), 'count'],
                    ],
                    where: {
                        createdAt: { [sequelize_2.Op.gte]: startDate },
                    },
                    group: [(0, sequelize_2.fn)('DATE', (0, sequelize_2.col)('createdAt'))],
                    order: [[(0, sequelize_2.fn)('DATE', (0, sequelize_2.col)('createdAt')), 'ASC']],
                    raw: true,
                }),
                MedicationLog.findAll({
                    attributes: [
                        [(0, sequelize_2.fn)('DATE', (0, sequelize_2.col)('timeGiven')), 'date'],
                        [(0, sequelize_2.fn)('COUNT', (0, sequelize_2.col)('id')), 'count'],
                    ],
                    where: {
                        timeGiven: { [sequelize_2.Op.gte]: startDate },
                    },
                    group: [(0, sequelize_2.fn)('DATE', (0, sequelize_2.col)('timeGiven'))],
                    order: [[(0, sequelize_2.fn)('DATE', (0, sequelize_2.col)('timeGiven')), 'ASC']],
                    raw: true,
                }),
                IncidentReport.findAll({
                    attributes: [
                        [(0, sequelize_2.fn)('DATE', (0, sequelize_2.col)('occurredAt')), 'date'],
                        [(0, sequelize_2.fn)('COUNT', (0, sequelize_2.col)('id')), 'count'],
                    ],
                    where: {
                        occurredAt: { [sequelize_2.Op.gte]: startDate },
                    },
                    group: [(0, sequelize_2.fn)('DATE', (0, sequelize_2.col)('occurredAt'))],
                    order: [[(0, sequelize_2.fn)('DATE', (0, sequelize_2.col)('occurredAt')), 'ASC']],
                    raw: true,
                }),
                Appointment.findAll({
                    attributes: [
                        [(0, sequelize_2.fn)('DATE', (0, sequelize_2.col)('scheduledAt')), 'date'],
                        [(0, sequelize_2.fn)('COUNT', (0, sequelize_2.col)('id')), 'count'],
                    ],
                    where: {
                        scheduledAt: { [sequelize_2.Op.gte]: startDate },
                    },
                    group: [(0, sequelize_2.fn)('DATE', (0, sequelize_2.col)('scheduledAt'))],
                    order: [[(0, sequelize_2.fn)('DATE', (0, sequelize_2.col)('scheduledAt')), 'ASC']],
                    raw: true,
                }),
            ]);
            return {
                enrollmentTrend: this.formatChartData(enrollmentData, dateFormat),
                medicationAdministration: this.formatChartData(medicationData, dateFormat),
                incidentFrequency: this.formatChartData(incidentData, dateFormat),
                appointmentTrends: this.formatChartData(appointmentData, dateFormat),
            };
        }
        catch (error) {
            this.logError('Error fetching chart data', error instanceof Error ? error.stack : undefined);
            throw new common_1.InternalServerErrorException('Failed to fetch chart data');
        }
    }
    async getDashboardStatsByScope(schoolId, districtId) {
        try {
            this.logInfo(`Getting dashboard stats for scope - School: ${schoolId}, District: ${districtId}`);
            return this.getDashboardStats();
        }
        catch (error) {
            this.logError('Error fetching scoped dashboard stats', error instanceof Error ? error.stack : undefined);
            throw new common_1.InternalServerErrorException('Failed to fetch scoped dashboard statistics');
        }
    }
    clearCache() {
        this.statsCache = {
            data: null,
            timestamp: 0,
        };
        this.logDebug('Dashboard cache cleared');
    }
    formatChartData(data, dateFormat) {
        return data.map((item) => {
            const date = new Date(item.date);
            const dateStr = date.toLocaleDateString('en-US', dateFormat);
            return {
                date: dateStr,
                value: parseInt(item.count, 10) || 0,
                label: dateStr,
            };
        });
    }
    async getRecentActivitiesCount() {
        try {
            const last24Hours = new Date();
            last24Hours.setHours(last24Hours.getHours() - 24);
            const MedicationLog = this.getModel('MedicationLog');
            const IncidentReport = this.getModel('IncidentReport');
            const Appointment = this.getModel('Appointment');
            const [medCount, incidentCount, aptCount] = await Promise.all([
                MedicationLog.count({
                    where: { timeGiven: { [sequelize_2.Op.gte]: last24Hours } },
                }),
                IncidentReport.count({
                    where: { createdAt: { [sequelize_2.Op.gte]: last24Hours } },
                }),
                Appointment.count({
                    where: { createdAt: { [sequelize_2.Op.gte]: last24Hours } },
                }),
            ]);
            return medCount + incidentCount + aptCount;
        }
        catch (error) {
            this.logError('Error fetching recent activities count', error instanceof Error ? error.stack : undefined);
            return 0;
        }
    }
    formatRelativeTime(date) {
        const timeDiff = Date.now() - date.getTime();
        const minutes = Math.floor(timeDiff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }
        else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        }
        else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        }
        else {
            return 'Just now';
        }
    }
    formatFutureTime(date) {
        const timeDiff = date.getTime() - Date.now();
        const minutes = Math.floor(timeDiff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) {
            return `in ${days} day${days > 1 ? 's' : ''}`;
        }
        else if (hours > 0) {
            return `in ${hours} hour${hours > 1 ? 's' : ''}`;
        }
        else if (minutes > 0) {
            return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
        }
        else {
            return 'Now';
        }
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = DashboardService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __metadata("design:paramtypes", [sequelize_2.Sequelize])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map