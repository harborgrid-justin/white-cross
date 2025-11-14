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
exports.WaitlistService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const uuid_1 = require("uuid");
const base_1 = require("../../../common/base");
const models_1 = require("../../../database/models");
let WaitlistService = class WaitlistService extends base_1.BaseService {
    waitlistModel;
    constructor(waitlistModel) {
        super('WaitlistService');
        this.waitlistModel = waitlistModel;
    }
    async addToWaitlist(data) {
        this.logInfo(`Adding student ${data.studentId} to waitlist`);
        try {
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 48);
            return await this.waitlistModel.create({
                id: (0, uuid_1.v4)(),
                studentId: data.studentId,
                nurseId: data.nurseId,
                appointmentType: data.appointmentType,
                preferredDate: data.preferredDate,
                duration: data.duration || 30,
                priority: data.priority || models_1.WaitlistPriority.NORMAL,
                reason: data.reason,
                notes: data.notes,
                status: models_1.WaitlistStatus.WAITING,
                expiresAt,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
        catch (error) {
            this.logError(`Error adding to waitlist: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Failed to add to waitlist');
        }
    }
    async getWaitlist(filters = {}) {
        this.logInfo('Fetching waitlist');
        try {
            const whereClause = {};
            if (filters.nurseId) {
                whereClause.nurseId = filters.nurseId;
            }
            if (filters.studentId) {
                whereClause.studentId = filters.studentId;
            }
            if (filters.status) {
                whereClause.status = filters.status;
            }
            if (filters.appointmentType) {
                whereClause.appointmentType = filters.appointmentType;
            }
            const page = filters.page || 1;
            const limit = filters.limit || 20;
            const offset = (page - 1) * limit;
            const { rows, count } = await this.waitlistModel.findAndCountAll({
                where: whereClause,
                limit,
                offset,
                order: [
                    ['priority', 'DESC'],
                    ['createdAt', 'ASC'],
                ],
            });
            return {
                data: rows,
                pagination: {
                    page,
                    limit,
                    total: count,
                    totalPages: Math.ceil(count / limit),
                    hasNext: page < Math.ceil(count / limit),
                    hasPrevious: page > 1,
                },
            };
        }
        catch (error) {
            this.logError(`Error fetching waitlist: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Failed to fetch waitlist');
        }
    }
    async updateWaitlistPriority(id, priority) {
        this.logInfo(`Updating waitlist priority for entry: ${id}`);
        const entry = await this.waitlistModel.findByPk(id);
        if (!entry) {
            throw new common_1.NotFoundException(`Waitlist entry with ID ${id} not found`);
        }
        await entry.update({ priority });
        return entry;
    }
    async getWaitlistPosition(id) {
        this.logInfo(`Getting waitlist position for entry: ${id}`);
        const entry = await this.waitlistModel.findByPk(id);
        if (!entry) {
            throw new common_1.NotFoundException(`Waitlist entry with ID ${id} not found`);
        }
        const position = await this.waitlistModel.count({
            where: {
                nurseId: entry.nurseId,
                status: models_1.WaitlistStatus.WAITING,
                [sequelize_2.Op.or]: [
                    { priority: { [sequelize_2.Op.gt]: entry.priority } },
                    {
                        [sequelize_2.Op.and]: [{ priority: entry.priority }, { createdAt: { [sequelize_2.Op.lt]: entry.createdAt } }],
                    },
                ],
            },
        });
        return { position: position + 1 };
    }
    async notifyWaitlistEntry(id, message) {
        this.logInfo(`Notifying waitlist entry: ${id}`);
        const entry = await this.waitlistModel.findByPk(id);
        if (!entry) {
            throw new common_1.NotFoundException(`Waitlist entry with ID ${id} not found`);
        }
        await entry.update({
            notes: message
                ? `${entry.notes || ''}\nNotification sent: ${message}`
                : `${entry.notes || ''}\nNotification sent`,
        });
        return { success: true, message: 'Notification sent successfully' };
    }
    async removeFromWaitlist(id, reason) {
        this.logInfo(`Removing from waitlist: ${id}`);
        const entry = await this.waitlistModel.findByPk(id);
        if (!entry) {
            throw new common_1.NotFoundException(`Waitlist entry with ID ${id} not found`);
        }
        await entry.update({
            status: models_1.WaitlistStatus.CANCELLED,
            notes: reason
                ? `${entry.notes || ''}\nRemoved: ${reason}`
                : `${entry.notes || ''}\nRemoved from waitlist`,
        });
        return entry;
    }
    async cleanupExpiredEntries() {
        try {
            const now = new Date();
            const result = await this.waitlistModel.update({ status: models_1.WaitlistStatus.EXPIRED }, {
                where: {
                    expiresAt: { [sequelize_2.Op.lt]: now },
                    status: models_1.WaitlistStatus.WAITING,
                },
            });
            if (result[0] > 0) {
                this.logInfo(`Cleaned up ${result[0]} expired waitlist entries`);
            }
        }
        catch (error) {
            this.logError(`Error cleaning up expired waitlist entries: ${error.message}`, error.stack);
        }
    }
};
exports.WaitlistService = WaitlistService;
exports.WaitlistService = WaitlistService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.AppointmentWaitlist)),
    __metadata("design:paramtypes", [Object])
], WaitlistService);
//# sourceMappingURL=waitlist.service.js.map