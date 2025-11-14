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
exports.RecurringGenerationService = void 0;
const common_1 = require("@nestjs/common");
const enterprise_features_interfaces_1 = require("../../enterprise-features-interfaces");
const base_1 = require("../../../common/base");
let RecurringGenerationService = class RecurringGenerationService extends base_1.BaseService {
    constructor() {
        super('RecurringGenerationService');
    }
    generateUpcomingAppointments(templates, daysAhead = 30) {
        try {
            const upcomingAppointments = [];
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + daysAhead);
            for (const template of templates) {
                if (!template.isActive)
                    continue;
                const appointments = this.generateAppointmentsFromTemplate(template, endDate);
                upcomingAppointments.push(...appointments);
            }
            upcomingAppointments.sort((a, b) => a.appointmentDate.getTime() - b.appointmentDate.getTime());
            this.logInfo('Upcoming appointments generated', {
                templateCount: templates.length,
                appointmentCount: upcomingAppointments.length,
                daysAhead,
            });
            return upcomingAppointments;
        }
        catch (error) {
            this.logError('Error generating upcoming appointments', {
                error: error instanceof Error ? error.message : String(error),
                daysAhead,
            });
            throw error;
        }
    }
    generateAppointmentsFromTemplate(template, endDate) {
        const appointments = [];
        let currentDate = new Date(template.startDate);
        if (currentDate < new Date()) {
            currentDate = this.getNextOccurrence(template, new Date());
        }
        while (currentDate <= endDate) {
            appointments.push({
                templateId: template.id,
                appointmentDate: new Date(currentDate),
                appointmentType: template.appointmentType,
                studentId: template.studentId,
                notes: template.notes,
            });
            currentDate = this.getNextOccurrence(template, currentDate);
        }
        return appointments;
    }
    getNextOccurrence(template, fromDate) {
        const nextDate = new Date(fromDate);
        const { frequency, interval } = template.recurrenceRule;
        switch (frequency) {
            case enterprise_features_interfaces_1.RecurrenceFrequency.DAILY:
                nextDate.setDate(nextDate.getDate() + interval);
                break;
            case enterprise_features_interfaces_1.RecurrenceFrequency.WEEKLY:
                if (template.recurrenceRule.daysOfWeek && template.recurrenceRule.daysOfWeek.length > 0) {
                    nextDate.setDate(nextDate.getDate() + 1);
                    while (!template.recurrenceRule.daysOfWeek.includes(this.getDayName(nextDate.getDay()))) {
                        nextDate.setDate(nextDate.getDate() + 1);
                    }
                }
                else {
                    nextDate.setDate(nextDate.getDate() + (interval * 7));
                }
                break;
            case enterprise_features_interfaces_1.RecurrenceFrequency.MONTHLY:
                nextDate.setMonth(nextDate.getMonth() + interval);
                break;
            default:
                throw new Error(`Unsupported recurrence frequency: ${frequency}`);
        }
        return nextDate;
    }
    getDayName(dayIndex) {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[dayIndex];
    }
};
exports.RecurringGenerationService = RecurringGenerationService;
exports.RecurringGenerationService = RecurringGenerationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RecurringGenerationService);
//# sourceMappingURL=recurring-generation.service.js.map