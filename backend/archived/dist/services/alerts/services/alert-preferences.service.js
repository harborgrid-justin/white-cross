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
exports.AlertPreferencesService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const database_1 = require("../../../database");
const base_1 = require("../../../common/base");
let AlertPreferencesService = class AlertPreferencesService extends base_1.BaseService {
    alertPreferencesModel;
    constructor(alertPreferencesModel) {
        super("AlertPreferencesService");
        this.alertPreferencesModel = alertPreferencesModel;
    }
    async getUserAlertPreferences(userId) {
        let prefs = await this.alertPreferencesModel.findOne({
            where: { userId },
        });
        if (!prefs) {
            prefs = await this.alertPreferencesModel.create({
                userId,
                channels: [database_1.DeliveryChannel.WEBSOCKET, database_1.DeliveryChannel.EMAIL],
                severityFilter: ['INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'EMERGENCY'],
                categoryFilter: ['SYSTEM', 'HEALTH', 'ACADEMIC', 'SECURITY', 'MAINTENANCE'],
                isActive: true,
            });
        }
        return prefs;
    }
    async updateUserAlertPreferences(userId, preferences) {
        const existing = await this.getUserAlertPreferences(userId);
        await existing.update(preferences);
        this.logInfo(`Updated alert preferences for user ${userId}`);
        return existing;
    }
    async getPreferences(userId) {
        return this.getUserAlertPreferences(userId);
    }
    async updatePreferences(userId, updateDto) {
        return this.updateUserAlertPreferences(userId, updateDto);
    }
    async getSubscribersForAlert(alertSeverity, alertCategory) {
        const allPrefs = await this.alertPreferencesModel.findAll({
            where: {
                isActive: true,
            },
        });
        const matchingPrefs = allPrefs.filter((prefs) => {
            const severityMatch = prefs.severityFilter.includes(alertSeverity);
            const categoryMatch = prefs.categoryFilter.includes(alertCategory);
            return severityMatch && categoryMatch;
        });
        return matchingPrefs.filter((prefs) => !prefs.isQuietHours());
    }
    async hasChannelEnabled(userId, channel) {
        const prefs = await this.getUserAlertPreferences(userId);
        return prefs.channels.includes(channel);
    }
    async toggleChannel(userId, channel, enabled) {
        const prefs = await this.getUserAlertPreferences(userId);
        if (enabled) {
            if (!prefs.channels.includes(channel)) {
                prefs.channels = [...prefs.channels, channel];
            }
        }
        else {
            prefs.channels = prefs.channels.filter((c) => c !== channel);
        }
        await prefs.save();
        this.logInfo(`${enabled ? 'Enabled' : 'Disabled'} ${channel} for user ${userId}`);
        return prefs;
    }
    async setQuietHours(userId, startTime, endTime, timezone) {
        const prefs = await this.getUserAlertPreferences(userId);
        prefs.quietHours = {
            enabled: true,
            startTime,
            endTime,
            timezone: timezone || 'UTC',
        };
        await prefs.save();
        this.logInfo(`Set quiet hours for user ${userId}: ${startTime} - ${endTime}`);
        return prefs;
    }
    async disableQuietHours(userId) {
        const prefs = await this.getUserAlertPreferences(userId);
        prefs.quietHours = {
            ...prefs.quietHours,
            enabled: false,
        };
        await prefs.save();
        this.logInfo(`Disabled quiet hours for user ${userId}`);
        return prefs;
    }
};
exports.AlertPreferencesService = AlertPreferencesService;
exports.AlertPreferencesService = AlertPreferencesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.AlertPreferences)),
    __metadata("design:paramtypes", [Object])
], AlertPreferencesService);
//# sourceMappingURL=alert-preferences.service.js.map