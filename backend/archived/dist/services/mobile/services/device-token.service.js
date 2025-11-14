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
exports.DeviceTokenService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const device_token_model_1 = require("../../../database/models/device-token.model");
const base_1 = require("../../../common/base");
let DeviceTokenService = class DeviceTokenService extends base_1.BaseService {
    deviceTokenModel;
    constructor(deviceTokenModel) {
        super("DeviceTokenService");
        this.deviceTokenModel = deviceTokenModel;
    }
    async registerDeviceToken(userId, dto) {
        try {
            await this.deviceTokenModel.update({ isActive: false }, {
                where: {
                    userId,
                    deviceId: dto.deviceId,
                },
            });
            const deviceToken = await this.deviceTokenModel.create({
                userId,
                deviceId: dto.deviceId,
                platform: dto.platform,
                token: dto.token,
                deviceName: dto.deviceName,
                deviceModel: dto.deviceModel,
                osVersion: dto.osVersion,
                appVersion: dto.appVersion,
                isActive: true,
                isValid: true,
                allowNotifications: true,
                allowSound: true,
                allowBadge: true,
            });
            this.logInfo(`Device token registered: ${deviceToken.id} for user ${userId}`);
            return deviceToken;
        }
        catch (error) {
            this.logError('Error registering device token', error);
            throw error;
        }
    }
    async unregisterDeviceToken(userId, tokenId) {
        const token = await this.deviceTokenModel.findOne({
            where: { id: tokenId, userId },
        });
        if (!token) {
            throw new common_1.NotFoundException('Device token not found');
        }
        await this.deviceTokenModel.update({ isActive: false }, { where: { id: tokenId } });
        this.logInfo(`Device token unregistered: ${tokenId}`);
    }
    async getUserDevices(userId) {
        return this.deviceTokenModel.findAll({
            where: {
                userId,
                isActive: true,
                isValid: true,
            },
        });
    }
    async updatePreferences(userId, tokenId, dto) {
        const token = await this.deviceTokenModel.findOne({
            where: { id: tokenId, userId },
        });
        if (!token) {
            throw new common_1.NotFoundException('Device token not found');
        }
        const updated = await token.update(dto);
        this.logInfo(`Preferences updated for token: ${tokenId}`);
        return updated;
    }
    async getActiveTokensForUsers(userIds) {
        return this.deviceTokenModel.findAll({
            where: {
                userId: {
                    [sequelize_2.Op.in]: userIds,
                },
                isActive: true,
                isValid: true,
                allowNotifications: true,
            },
        });
    }
    async markTokenAsInvalid(tokenId, reason) {
        await this.deviceTokenModel.update({
            isValid: false,
            invalidReason: reason,
        }, { where: { id: tokenId } });
        this.logInfo(`Token marked as invalid: ${tokenId} - ${reason}`);
    }
    async updateLastUsed(tokenId) {
        await this.deviceTokenModel.update({ lastUsedAt: new Date() }, { where: { id: tokenId } });
    }
    async cleanupInactiveTokens(inactiveDays = 90) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - inactiveDays);
        const deletedCount = await this.deviceTokenModel.destroy({
            where: {
                [sequelize_2.Op.or]: [
                    {
                        lastUsedAt: {
                            [sequelize_2.Op.lt]: cutoffDate,
                        },
                    },
                    {
                        lastUsedAt: null,
                        createdAt: {
                            [sequelize_2.Op.lt]: cutoffDate,
                        },
                    },
                ],
                isActive: false,
            },
        });
        this.logInfo(`Cleaned up ${deletedCount} inactive tokens (older than ${inactiveDays} days)`);
        return deletedCount;
    }
};
exports.DeviceTokenService = DeviceTokenService;
exports.DeviceTokenService = DeviceTokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(device_token_model_1.DeviceToken)),
    __metadata("design:paramtypes", [Object])
], DeviceTokenService);
//# sourceMappingURL=device-token.service.js.map