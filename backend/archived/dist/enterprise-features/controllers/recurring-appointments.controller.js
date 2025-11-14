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
exports.RecurringAppointmentsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const recurring_appointments_service_1 = require("../recurring-appointments.service");
const dto_1 = require("../dto");
const base_1 = require("../../common/base");
let RecurringAppointmentsController = class RecurringAppointmentsController extends base_1.BaseController {
    recurringAppointmentsService;
    constructor(recurringAppointmentsService) {
        super();
        this.recurringAppointmentsService = recurringAppointmentsService;
    }
    createRecurringTemplate(dto) {
        return this.recurringAppointmentsService.createRecurringTemplate({
            studentId: dto.studentId,
            appointmentType: dto.appointmentType,
            frequency: dto.frequency,
            dayOfWeek: dto.dayOfWeek,
            timeOfDay: dto.timeOfDay,
            startDate: new Date(dto.startDate),
            endDate: dto.endDate ? new Date(dto.endDate) : undefined,
            createdBy: dto.createdBy,
        });
    }
    cancelRecurringSeries(templateId) {
        return this.recurringAppointmentsService.cancelRecurringSeries(templateId, 'system', 'API cancellation');
    }
};
exports.RecurringAppointmentsController = RecurringAppointmentsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create recurring appointment template' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Recurring template created',
        type: dto_1.RecurringTemplateResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateRecurringTemplateDto]),
    __metadata("design:returntype", void 0)
], RecurringAppointmentsController.prototype, "createRecurringTemplate", null);
__decorate([
    (0, common_1.Delete)(':templateId'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel recurring appointment series' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Recurring series cancelled successfully',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: Boolean }),
    __param(0, (0, common_1.Param)('templateId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RecurringAppointmentsController.prototype, "cancelRecurringSeries", null);
exports.RecurringAppointmentsController = RecurringAppointmentsController = __decorate([
    (0, swagger_1.ApiTags)('Recurring Appointments'),
    (0, common_1.Controller)('enterprise-features/recurring-appointments'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [recurring_appointments_service_1.RecurringAppointmentsService])
], RecurringAppointmentsController);
//# sourceMappingURL=recurring-appointments.controller.js.map