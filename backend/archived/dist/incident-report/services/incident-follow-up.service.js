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
exports.IncidentFollowUpService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const database_1 = require("../../database");
const incident_validation_service_1 = require("./incident-validation.service");
const action_priority_enum_1 = require("../enums/action-priority.enum");
const action_status_enum_1 = require("../enums/action-status.enum");
const base_1 = require("../../common/base");
let IncidentFollowUpService = class IncidentFollowUpService extends base_1.BaseService {
    followUpActionModel;
    incidentReportModel;
    validationService;
    constructor(followUpActionModel, incidentReportModel, validationService) {
        super('IncidentFollowUpService');
        this.followUpActionModel = followUpActionModel;
        this.incidentReportModel = incidentReportModel;
        this.validationService = validationService;
    }
    async addFollowUpAction(incidentReportId, dto) {
        try {
            const report = await this.incidentReportModel.findByPk(incidentReportId);
            if (!report) {
                throw new common_1.NotFoundException('Incident report not found');
            }
            this.validationService.validateFollowUpActionData(dto);
            const savedAction = await this.followUpActionModel.create({
                incidentReportId,
                ...dto,
                status: action_status_enum_1.ActionStatus.PENDING,
            });
            this.logInfo(`Follow-up action added to incident ${incidentReportId}`);
            return savedAction;
        }
        catch (error) {
            this.logError('Error adding follow-up action:', error);
            throw error;
        }
    }
    async updateFollowUpAction(actionId, dto) {
        try {
            const action = await this.followUpActionModel.findByPk(actionId);
            if (!action) {
                throw new common_1.NotFoundException('Follow-up action not found');
            }
            if (dto.status) {
                this.validationService.validateFollowUpActionStatusUpdate(dto.status, dto.completedBy, dto.notes);
                if (dto.status === action_status_enum_1.ActionStatus.COMPLETED) {
                    action.completedAt = new Date();
                }
            }
            Object.assign(action, dto);
            const updatedAction = await action.save();
            this.logInfo(`Follow-up action ${actionId} updated`);
            return updatedAction;
        }
        catch (error) {
            this.logError('Error updating follow-up action:', error);
            throw error;
        }
    }
    async getFollowUpActions(incidentReportId) {
        try {
            const actions = await this.followUpActionModel.findAll({
                where: { incidentReportId },
                order: [['dueDate', 'ASC']],
            });
            return actions;
        }
        catch (error) {
            this.logError('Error fetching follow-up actions:', error);
            throw error;
        }
    }
    async getOverdueActions() {
        try {
            const now = new Date();
            const actions = await this.followUpActionModel.findAll({
                where: {
                    status: action_status_enum_1.ActionStatus.PENDING,
                    dueDate: {
                        [sequelize_2.Op.lt]: now,
                    },
                },
                order: [['dueDate', 'ASC']],
            });
            return actions;
        }
        catch (error) {
            this.logError('Error fetching overdue actions:', error);
            throw error;
        }
    }
    async getUserPendingActions(assignedTo) {
        try {
            const actions = await this.followUpActionModel.findAll({
                where: {
                    assignedTo,
                    status: action_status_enum_1.ActionStatus.PENDING,
                },
                order: [['dueDate', 'ASC']],
            });
            return actions;
        }
        catch (error) {
            this.logError('Error fetching user pending actions:', error);
            throw error;
        }
    }
    async getUrgentActions() {
        try {
            const tomorrow = new Date();
            tomorrow.setHours(tomorrow.getHours() + 24);
            const actions = await this.followUpActionModel.findAll({
                where: {
                    status: action_status_enum_1.ActionStatus.PENDING,
                    dueDate: {
                        [sequelize_2.Op.lte]: tomorrow,
                    },
                    priority: action_priority_enum_1.ActionPriority.URGENT,
                },
                order: [['dueDate', 'ASC']],
            });
            return actions;
        }
        catch (error) {
            this.logError('Error fetching urgent actions:', error);
            throw error;
        }
    }
    async deleteFollowUpAction(actionId) {
        try {
            const action = await this.followUpActionModel.findByPk(actionId);
            if (!action) {
                throw new common_1.NotFoundException('Follow-up action not found');
            }
            if (action.status === action_status_enum_1.ActionStatus.COMPLETED) {
                throw new common_1.BadRequestException('Cannot delete completed follow-up actions');
            }
            await action.destroy();
            this.logInfo(`Follow-up action ${actionId} deleted`);
            return true;
        }
        catch (error) {
            this.logError('Error deleting follow-up action:', error);
            throw error;
        }
    }
    async getFollowUpStatistics(dateFrom, dateTo) {
        try {
            const whereClause = {};
            if (dateFrom || dateTo) {
                whereClause.createdAt = {};
                if (dateFrom) {
                    whereClause.createdAt = {
                        ...whereClause.createdAt,
                        [sequelize_2.Op.gte]: dateFrom,
                    };
                }
                if (dateTo) {
                    whereClause.createdAt = {
                        ...whereClause.createdAt,
                        [sequelize_2.Op.lte]: dateTo,
                    };
                }
            }
            const [total, pending, completed, overdue] = await Promise.all([
                this.followUpActionModel.count({ where: whereClause }),
                this.followUpActionModel.count({
                    where: { ...whereClause, status: action_status_enum_1.ActionStatus.PENDING },
                }),
                this.followUpActionModel.count({
                    where: { ...whereClause, status: action_status_enum_1.ActionStatus.COMPLETED },
                }),
                this.followUpActionModel.count({
                    where: {
                        ...whereClause,
                        status: action_status_enum_1.ActionStatus.PENDING,
                        dueDate: {
                            [sequelize_2.Op.lt]: new Date(),
                        },
                    },
                }),
            ]);
            return {
                total,
                pending,
                completed,
                overdue,
                completionRate: total > 0 ? (completed / total) * 100 : 0,
            };
        }
        catch (error) {
            this.logError('Error fetching follow-up statistics:', error);
            throw error;
        }
    }
};
exports.IncidentFollowUpService = IncidentFollowUpService;
exports.IncidentFollowUpService = IncidentFollowUpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.FollowUpAction)),
    __param(1, (0, sequelize_1.InjectModel)(database_1.IncidentReport)),
    __metadata("design:paramtypes", [Object, Object, incident_validation_service_1.IncidentValidationService])
], IncidentFollowUpService);
//# sourceMappingURL=incident-follow-up.service.js.map