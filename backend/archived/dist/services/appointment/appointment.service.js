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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = void 0;
const common_1 = require("@nestjs/common");
const request_context_service_1 = require("../../common/context/request-context.service");
const base_1 = require("../../common/base");
const app_config_service_1 = require("../../common/config/app-config.service");
const appointment_read_service_1 = require("./services/appointment-read.service");
const appointment_write_service_1 = require("./services/appointment-write.service");
const appointment_status_service_1 = require("./services/appointment-status.service");
const appointment_query_service_1 = require("./services/appointment-query.service");
const appointment_scheduling_service_1 = require("./services/appointment-scheduling.service");
const appointment_statistics_service_1 = require("./services/appointment-statistics.service");
const appointment_recurring_service_1 = require("./services/appointment-recurring.service");
const waitlist_service_1 = require("./services/waitlist.service");
const reminder_service_1 = require("./services/reminder.service");
let AppointmentService = class AppointmentService extends base_1.BaseService {
    requestContext;
    readService;
    writeService;
    statusService;
    queryService;
    schedulingService;
    statisticsService;
    recurringService;
    waitlistService;
    reminderService;
    config;
    cleanupInterval;
    constructor(requestContext, readService, writeService, statusService, queryService, schedulingService, statisticsService, recurringService, waitlistService, reminderService, config) {
        super(requestContext);
        this.requestContext = requestContext;
        this.readService = readService;
        this.writeService = writeService;
        this.statusService = statusService;
        this.queryService = queryService;
        this.schedulingService = schedulingService;
        this.statisticsService = statisticsService;
        this.recurringService = recurringService;
        this.waitlistService = waitlistService;
        this.reminderService = reminderService;
        this.config = config;
        if (this.config?.isProduction) {
            this.cleanupInterval = setInterval(() => this.waitlistService.cleanupExpiredEntries(), 24 * 60 * 60 * 1000);
            this.logger.log('Appointment service initialized with daily cleanup interval');
        }
    }
    async onModuleDestroy() {
        this.logger.log('AppointmentService shutting down - cleaning up resources');
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.logger.log('Cleanup interval cleared');
        }
        try {
            await this.reminderService.processPendingReminders();
            this.logger.log('Pending reminders processed before shutdown');
        }
        catch (error) {
            this.logger.warn(`Error processing pending reminders during shutdown: ${error.message}`);
        }
        this.logger.log('AppointmentService destroyed, resources cleaned up');
    }
    async getAppointments(filters = {}) {
        return this.readService.getAppointments(filters);
    }
    async getAppointmentById(id) {
        return this.readService.getAppointmentById(id);
    }
    async createAppointment(createDto) {
        return this.writeService.createAppointment(createDto);
    }
    async updateAppointment(id, updateDto) {
        return this.writeService.updateAppointment(id, updateDto);
    }
    async cancelAppointment(id, reason) {
        return this.writeService.cancelAppointment(id, reason);
    }
    async startAppointment(id) {
        return this.statusService.startAppointment(id);
    }
    async completeAppointment(id, completionData) {
        return this.statusService.completeAppointment(id, completionData);
    }
    async markNoShow(id) {
        return this.statusService.markNoShow(id);
    }
    async getUpcomingAppointments(nurseId, limit = 10) {
        return this.queryService.getUpcomingAppointments(nurseId, limit);
    }
    async getAppointmentsByDate(dateStr) {
        return this.queryService.getAppointmentsByDate(dateStr);
    }
    async getGeneralUpcomingAppointments(days = 7, limit = 50) {
        return this.queryService.getGeneralUpcomingAppointments(days, limit);
    }
    async getAppointmentHistory(studentId, limit = 50) {
        return this.queryService.getAppointmentHistory(studentId, limit);
    }
    async getAppointmentsByDateRange(dateRange) {
        return this.queryService.getAppointmentsByDateRange(dateRange);
    }
    async getAppointmentsForStudents(studentIds, filters) {
        return this.queryService.getAppointmentsForStudents(studentIds, filters);
    }
    async searchAppointments(searchDto) {
        return this.queryService.searchAppointments(searchDto);
    }
    async checkAvailability(nurseId, startTime, duration, excludeAppointmentId) {
        return this.schedulingService.checkAvailability(nurseId, startTime, duration, excludeAppointmentId);
    }
    async getAvailableSlots(nurseId, date, slotDuration = 30) {
        return this.schedulingService.getAvailableSlots(nurseId, date, slotDuration);
    }
    async checkConflicts(nurseId, startTime, duration, excludeAppointmentId) {
        return this.schedulingService.checkConflicts(nurseId, startTime, duration, excludeAppointmentId);
    }
    async addToWaitlist(data) {
        return this.waitlistService.addToWaitlist(data);
    }
    async getWaitlist(filters = {}) {
        return this.waitlistService.getWaitlist(filters);
    }
    async updateWaitlistPriority(id, priority) {
        return this.waitlistService.updateWaitlistPriority(id, priority);
    }
    async getWaitlistPosition(id) {
        return this.waitlistService.getWaitlistPosition(id);
    }
    async notifyWaitlistEntry(id, message) {
        return this.waitlistService.notifyWaitlistEntry(id, message);
    }
    async removeFromWaitlist(id, reason) {
        return this.waitlistService.removeFromWaitlist(id, reason);
    }
    async processPendingReminders() {
        return this.reminderService.processPendingReminders();
    }
    async getAppointmentReminders(appointmentId) {
        return this.reminderService.getAppointmentReminders(appointmentId);
    }
    async scheduleReminder(createDto) {
        return this.reminderService.scheduleReminder(createDto);
    }
    async cancelReminder(reminderId) {
        return this.reminderService.cancelReminder(reminderId);
    }
    async getStatistics(filters = {}) {
        return this.statisticsService.getStatistics(filters);
    }
    async getAppointmentTrends(dateFrom, dateTo, groupBy = 'day') {
        return this.statisticsService.getAppointmentTrends(dateFrom, dateTo, groupBy);
    }
    async getNoShowStats(nurseId, dateFrom, dateTo) {
        return this.statisticsService.getNoShowStats(nurseId, dateFrom, dateTo);
    }
    async getNoShowCount(studentId, daysBack = 90) {
        return this.statisticsService.getNoShowCount(studentId, daysBack);
    }
    async getUtilizationStats(nurseId, dateFrom, dateTo) {
        return this.statisticsService.getUtilizationStats(nurseId, dateFrom, dateTo);
    }
    async exportCalendar(nurseId, dateFrom, dateTo) {
        return this.statisticsService.exportCalendar(nurseId, dateFrom, dateTo);
    }
    async createRecurringAppointments(createDto) {
        return this.recurringService.createRecurringAppointments(createDto, this.createAppointment.bind(this));
    }
    async bulkCancelAppointments(bulkCancelDto) {
        return this.recurringService.bulkCancelAppointments(bulkCancelDto);
    }
};
exports.AppointmentService = AppointmentService;
exports.AppointmentService = AppointmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService,
        appointment_read_service_1.AppointmentReadService,
        appointment_write_service_1.AppointmentWriteService,
        appointment_status_service_1.AppointmentStatusService,
        appointment_query_service_1.AppointmentQueryService,
        appointment_scheduling_service_1.AppointmentSchedulingService,
        appointment_statistics_service_1.AppointmentStatisticsService,
        appointment_recurring_service_1.AppointmentRecurringService,
        waitlist_service_1.WaitlistService,
        reminder_service_1.ReminderService,
        app_config_service_1.AppConfigService])
], AppointmentService);
//# sourceMappingURL=appointment.service.js.map