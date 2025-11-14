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
exports.BroadcastManagementService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const emergency_broadcast_enums_1 = require("../emergency-broadcast.enums");
const types_1 = require("../../../../database/types");
const emergency_broadcast_repository_1 = require("../../../../database/repositories/impl/emergency-broadcast.repository");
const broadcast_priority_service_1 = require("./broadcast-priority.service");
const broadcast_recipient_service_1 = require("./broadcast-recipient.service");
const broadcast_delivery_service_1 = require("./broadcast-delivery.service");
const base_1 = require("../../../../common/base");
let BroadcastManagementService = class BroadcastManagementService extends base_1.BaseService {
    broadcastRepository;
    priorityService;
    recipientService;
    deliveryService;
    constructor(broadcastRepository, priorityService, recipientService, deliveryService) {
        super("BroadcastManagementService");
        this.broadcastRepository = broadcastRepository;
        this.priorityService = priorityService;
        this.recipientService = recipientService;
        this.deliveryService = deliveryService;
    }
    async createBroadcast(createDto) {
        try {
            const priority = createDto.priority || this.priorityService.determinePriority(createDto.type);
            const channels = createDto.channels || this.priorityService.getDeliveryChannels(priority);
            let expiresAt = createDto.expiresAt;
            if (!expiresAt) {
                expiresAt = this.priorityService.getDefaultExpiration(priority);
            }
            const context = {
                userId: createDto.sentBy,
                userRole: types_1.UserRole.ADMIN,
                ipAddress: 'system',
                userAgent: 'emergency-broadcast-service',
                timestamp: new Date(),
                transactionId: (0, uuid_1.v4)(),
            };
            const emergencyBroadcast = {
                id: `EMG-${Date.now()}`,
                ...createDto,
                priority,
                channels,
                expiresAt,
                sentAt: new Date(),
                status: emergency_broadcast_enums_1.BroadcastStatus.DRAFT,
            };
            const savedBroadcast = await this.broadcastRepository.create(emergencyBroadcast, context);
            this.logInfo('Emergency broadcast created', {
                id: savedBroadcast.id,
                type: createDto.type,
                priority,
                audience: createDto.audience,
            });
            return this.mapToResponseDto(savedBroadcast);
        }
        catch (error) {
            this.logError('Failed to create emergency broadcast', error);
            throw error;
        }
    }
    async updateBroadcast(id, updateDto, userId = 'system') {
        try {
            const broadcast = await this.broadcastRepository.findById(id);
            if (!broadcast) {
                throw new common_1.NotFoundException(`Broadcast with ID ${id} not found`);
            }
            const context = {
                userId,
                userRole: types_1.UserRole.ADMIN,
                ipAddress: 'system',
                userAgent: 'emergency-broadcast-service',
                timestamp: new Date(),
                transactionId: (0, uuid_1.v4)(),
            };
            const updatedBroadcast = await this.broadcastRepository.update(id, updateDto, context);
            this.logInfo('Emergency broadcast updated', { id });
            return this.mapToResponseDto(updatedBroadcast);
        }
        catch (error) {
            this.logError('Failed to update emergency broadcast', error);
            throw error;
        }
    }
    async sendBroadcast(broadcastId, userId = 'system') {
        try {
            const broadcast = await this.broadcastRepository.findById(broadcastId);
            if (!broadcast) {
                throw new common_1.NotFoundException(`Broadcast with ID ${broadcastId} not found`);
            }
            this.logInfo('Sending emergency broadcast', { broadcastId });
            const context = {
                userId,
                userRole: types_1.UserRole.ADMIN,
                ipAddress: 'system',
                userAgent: 'emergency-broadcast-service',
                timestamp: new Date(),
                transactionId: (0, uuid_1.v4)(),
            };
            const recipients = await this.recipientService.getRecipients(broadcastId);
            await this.broadcastRepository.update(broadcastId, {
                status: emergency_broadcast_enums_1.BroadcastStatus.SENDING,
                totalRecipients: recipients.length,
            }, context);
            const deliveryResults = await this.deliveryService.deliverToRecipients(broadcastId, recipients, broadcast.channels, broadcast.title, broadcast.message);
            const stats = this.deliveryService.getDeliveryStats(deliveryResults);
            await this.broadcastRepository.update(broadcastId, {
                status: emergency_broadcast_enums_1.BroadcastStatus.SENT,
                deliveredCount: stats.delivered,
                failedCount: stats.failed,
            }, context);
            this.logInfo('Emergency broadcast sent', {
                broadcastId,
                totalRecipients: recipients.length,
                sent: stats.delivered,
                failed: stats.failed,
            });
            return {
                success: true,
                totalRecipients: recipients.length,
                sent: stats.delivered,
                failed: stats.failed,
            };
        }
        catch (error) {
            this.logError('Failed to send emergency broadcast', error);
            throw error;
        }
    }
    async getBroadcastStatus(broadcastId) {
        try {
            this.logInfo('Retrieving broadcast status', { broadcastId });
            const broadcast = await this.broadcastRepository.findById(broadcastId);
            if (!broadcast) {
                throw new common_1.NotFoundException(`Broadcast with ID ${broadcastId} not found`);
            }
            const deliveryStats = {
                total: broadcast.totalRecipients || 0,
                delivered: broadcast.deliveredCount || 0,
                failed: broadcast.failedCount || 0,
                pending: (broadcast.totalRecipients || 0) -
                    (broadcast.deliveredCount || 0) -
                    (broadcast.failedCount || 0),
                acknowledged: broadcast.acknowledgedCount || 0,
            };
            const recentDeliveries = [];
            return {
                broadcast: this.mapToResponseDto(broadcast),
                deliveryStats,
                recentDeliveries,
            };
        }
        catch (error) {
            this.logError('Failed to get broadcast status', error);
            throw error;
        }
    }
    async cancelBroadcast(broadcastId, reason, userId = 'system') {
        try {
            const broadcast = await this.broadcastRepository.findById(broadcastId);
            if (!broadcast) {
                throw new common_1.NotFoundException(`Broadcast with ID ${broadcastId} not found`);
            }
            const context = {
                userId,
                userRole: types_1.UserRole.ADMIN,
                ipAddress: 'system',
                userAgent: 'emergency-broadcast-service',
                timestamp: new Date(),
                transactionId: (0, uuid_1.v4)(),
            };
            await this.broadcastRepository.update(broadcastId, {
                status: emergency_broadcast_enums_1.BroadcastStatus.CANCELLED,
            }, context);
            this.logInfo('Emergency broadcast cancelled', { broadcastId, reason });
        }
        catch (error) {
            this.logError('Failed to cancel broadcast', error);
            throw error;
        }
    }
    async recordAcknowledgment(broadcastId, recipientId, acknowledgedAt = new Date()) {
        try {
            const broadcast = await this.broadcastRepository.findById(broadcastId);
            if (!broadcast) {
                throw new common_1.NotFoundException(`Broadcast with ID ${broadcastId} not found`);
            }
            const context = {
                userId: recipientId,
                userRole: 'SYSTEM',
                ipAddress: 'system',
                userAgent: 'emergency-broadcast-service',
                timestamp: new Date(),
                requestId: (0, uuid_1.v4)(),
            };
            const currentCount = broadcast.acknowledgedCount || 0;
            await this.broadcastRepository.update(broadcastId, {
                acknowledgedCount: currentCount + 1,
            }, context);
            this.logInfo('Broadcast acknowledged', { broadcastId, recipientId, acknowledgedAt });
        }
        catch (error) {
            this.logError('Failed to record acknowledgment', error);
            throw error;
        }
    }
    async getBroadcastById(broadcastId) {
        try {
            const broadcast = await this.broadcastRepository.findById(broadcastId);
            if (!broadcast) {
                throw new common_1.NotFoundException(`Broadcast with ID ${broadcastId} not found`);
            }
            return this.mapToResponseDto(broadcast);
        }
        catch (error) {
            this.logError('Failed to get broadcast by ID', error);
            throw error;
        }
    }
    async listBroadcasts(filters) {
        try {
            const { page = 1, limit = 20, ...otherFilters } = filters;
            const whereClause = {};
            if (otherFilters.status)
                whereClause.status = otherFilters.status;
            if (otherFilters.type)
                whereClause.type = otherFilters.type;
            if (otherFilters.sentBy)
                whereClause.sentBy = otherFilters.sentBy;
            if (otherFilters.dateFrom || otherFilters.dateTo) {
                whereClause.sentAt = {};
                if (otherFilters.dateFrom)
                    whereClause.sentAt.gte = otherFilters.dateFrom;
                if (otherFilters.dateTo)
                    whereClause.sentAt.lte = otherFilters.dateTo;
            }
            const result = await this.broadcastRepository.findMany({
                where: whereClause,
                pagination: { page, limit },
                orderBy: { sentAt: 'desc' },
            });
            return {
                broadcasts: result.data.map((broadcast) => this.mapToResponseDto(broadcast)),
                total: result.total,
                page,
                limit,
            };
        }
        catch (error) {
            this.logError('Failed to list broadcasts', error);
            throw error;
        }
    }
    mapToResponseDto(broadcast) {
        return {
            id: broadcast.id,
            type: broadcast.type,
            priority: broadcast.priority,
            title: broadcast.title,
            message: broadcast.message,
            audience: broadcast.audience,
            schoolId: broadcast.schoolId,
            gradeLevel: broadcast.gradeLevel,
            classId: broadcast.classId,
            groupIds: broadcast.groupIds,
            channels: broadcast.channels,
            requiresAcknowledgment: broadcast.requiresAcknowledgment,
            expiresAt: broadcast.expiresAt,
            sentBy: broadcast.sentBy,
            sentAt: broadcast.sentAt,
            status: broadcast.status,
            totalRecipients: broadcast.totalRecipients,
            deliveredCount: broadcast.deliveredCount,
            failedCount: broadcast.failedCount,
            acknowledgedCount: broadcast.acknowledgedCount,
            followUpRequired: broadcast.followUpRequired,
            followUpInstructions: broadcast.followUpInstructions,
        };
    }
};
exports.BroadcastManagementService = BroadcastManagementService;
exports.BroadcastManagementService = BroadcastManagementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(emergency_broadcast_repository_1.EmergencyBroadcastRepository)),
    __metadata("design:paramtypes", [emergency_broadcast_repository_1.EmergencyBroadcastRepository,
        broadcast_priority_service_1.BroadcastPriorityService,
        broadcast_recipient_service_1.BroadcastRecipientService,
        broadcast_delivery_service_1.BroadcastDeliveryService])
], BroadcastManagementService);
//# sourceMappingURL=broadcast-management.service.js.map