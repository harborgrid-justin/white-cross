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
exports.IntegrationLogService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const base_1 = require("../../common/base");
let IntegrationLogService = class IntegrationLogService extends base_1.BaseService {
    logModel;
    constructor(logModel) {
        super("IntegrationLogService");
        this.logModel = logModel;
    }
    async create(data) {
        try {
            return await this.logModel.create({
                ...data,
                startedAt: new Date(),
                completedAt: data.status === 'success' || data.status === 'failed'
                    ? new Date()
                    : undefined,
            });
        }
        catch (error) {
            this.logError('Error creating integration log', error);
            throw error;
        }
    }
    async findAll(integrationId, type, page = 1, limit = 20) {
        try {
            const whereClause = {};
            if (integrationId) {
                whereClause.integrationId = integrationId;
            }
            if (type) {
                whereClause.integrationType = type;
            }
            const offset = (page - 1) * limit;
            const { rows: logs, count: total } = await this.logModel.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: models_2.IntegrationConfig,
                        as: 'integration',
                    },
                ],
                order: [['createdAt', 'DESC']],
                limit,
                offset,
            });
            return {
                logs,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            this.logError('Error fetching integration logs', error);
            throw error;
        }
    }
};
exports.IntegrationLogService = IntegrationLogService;
exports.IntegrationLogService = IntegrationLogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.IntegrationLog)),
    __metadata("design:paramtypes", [Object])
], IntegrationLogService);
//# sourceMappingURL=integration-log.service.js.map