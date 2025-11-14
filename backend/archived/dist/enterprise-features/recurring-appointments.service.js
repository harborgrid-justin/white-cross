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
exports.RecurringAppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const recurring_template_service_1 = require("./services/recurring/recurring-template.service");
const recurring_generation_service_1 = require("./services/recurring/recurring-generation.service");
const recurring_statistics_service_1 = require("./services/recurring/recurring-statistics.service");
const base_1 = require("../common/base");
const logger_service_1 = require("../common/logging/logger.service");
const common_2 = require("@nestjs/common");
let RecurringAppointmentsService = class RecurringAppointmentsService extends base_1.BaseService {
    eventEmitter;
    templateService;
    generationService;
    statisticsService;
    constructor(logger, eventEmitter, templateService, generationService, statisticsService) {
        super({
            serviceName: 'RecurringAppointmentsService',
            logger,
            enableAuditLogging: true,
        });
        this.eventEmitter = eventEmitter;
        this.templateService = templateService;
        this.generationService = generationService;
        this.statisticsService = statisticsService;
    }
    createRecurringTemplate(data) {
        return this.templateService.createRecurringTemplate(data);
    }
    getActiveTemplates() {
        return this.templateService.getActiveTemplates();
    }
    getTemplatesByAppointmentType(appointmentType) {
        return this.templateService.getTemplatesByAppointmentType(appointmentType);
    }
    updateRecurringTemplate(templateId, updates) {
        return this.templateService.updateRecurringTemplate(templateId, updates);
    }
    cancelRecurringSeries(templateId, cancelledBy, reason) {
        return this.templateService.cancelRecurringSeries(templateId, cancelledBy, reason);
    }
    generateUpcomingAppointments(daysAhead = 30) {
        return this.generationService.generateUpcomingAppointments(this.templateService.getAllTemplates(), daysAhead);
    }
    getTemplateStatistics() {
        return this.statisticsService.getTemplateStatistics(this.templateService.getAllTemplates());
    }
};
exports.RecurringAppointmentsService = RecurringAppointmentsService;
exports.RecurringAppointmentsService = RecurringAppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        event_emitter_1.EventEmitter2,
        recurring_template_service_1.RecurringTemplateService,
        recurring_generation_service_1.RecurringGenerationService,
        recurring_statistics_service_1.RecurringStatisticsService])
], RecurringAppointmentsService);
//# sourceMappingURL=recurring-appointments.service.js.map