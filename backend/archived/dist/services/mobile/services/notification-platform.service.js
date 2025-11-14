"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationPlatformService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const base_1 = require("../../../common/base");
const logger_service_1 = require("../../../common/logging/logger.service");
const enums_1 = require("../enums");
let NotificationPlatformService = class NotificationPlatformService extends base_1.BaseService {
    configService;
    firebaseMessaging = null;
    apnsProvider = null;
    constructor(logger, configService) {
        super({
            serviceName: 'NotificationPlatformService',
            logger,
            enableAuditLogging: true,
        });
        this.configService = configService;
    }
    async onModuleInit() {
        try {
            await this.initializeFirebase();
            await this.initializeAPNs();
            this.logInfo('NotificationPlatformService initialized successfully');
        }
        catch (error) {
            this.logError('Failed to initialize NotificationPlatformService', error);
        }
    }
    async initializeFirebase() {
        try {
            const admin = await Promise.resolve().then(() => __importStar(require('firebase-admin'))).catch(() => null);
            if (!admin) {
                this.logWarning('firebase-admin not installed. FCM notifications will not be available. ' +
                    'Install with: npm install firebase-admin');
                return;
            }
            const projectId = this.configService.get('FIREBASE_PROJECT_ID');
            const clientEmail = this.configService.get('FIREBASE_CLIENT_EMAIL');
            const privateKey = this.configService
                .get('FIREBASE_PRIVATE_KEY')
                ?.replace(/\\n/g, '\n');
            if (!projectId || !clientEmail || !privateKey) {
                this.logWarning('Firebase credentials not configured. FCM disabled.');
                return;
            }
            admin.default.initializeApp({
                credential: admin.default.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
            });
            this.firebaseMessaging = admin.default.messaging();
            this.logInfo('Firebase Cloud Messaging initialized');
        }
        catch (error) {
            this.logError('Failed to initialize Firebase', error);
        }
    }
    async initializeAPNs() {
        try {
            const apn = await Promise.resolve().then(() => __importStar(require('apn'))).catch(() => null);
            if (!apn) {
                this.logWarning('apn not installed. APNs notifications will not be available. ' +
                    'Install with: npm install apn');
                return;
            }
            const keyId = this.configService.get('APNS_KEY_ID');
            const teamId = this.configService.get('APNS_TEAM_ID');
            const token = this.configService.get('APNS_TOKEN');
            const production = this.configService.get('APNS_PRODUCTION', false);
            if (!keyId || !teamId || !token) {
                this.logWarning('APNs credentials not configured. APNs disabled.');
                return;
            }
            this.apnsProvider = new apn.default.Provider({
                token: {
                    key: token,
                    keyId: keyId,
                    teamId: teamId,
                },
                production: production,
            });
            this.logInfo(`APNs initialized (${production ? 'production' : 'development'})`);
        }
        catch (error) {
            this.logError('Failed to initialize APNs', error);
        }
    }
    async sendToPlatform(platform, token, notification) {
        try {
            this.logInfo(`Sending to ${platform}: ${token.token.substring(0, 10)}...`);
            switch (platform) {
                case enums_1.NotificationPlatform.FCM:
                    return await this.sendToFCM(token, notification);
                case enums_1.NotificationPlatform.APNS:
                    return await this.sendToAPNs(token, notification);
                case enums_1.NotificationPlatform.WEB_PUSH:
                    return await this.sendToWebPush(token, notification);
                default:
                    this.logWarning(`Unsupported platform: ${platform}`);
                    return {
                        success: false,
                        error: `Unsupported platform: ${platform}`,
                    };
            }
        }
        catch (error) {
            this.logError(`Failed to send to ${platform}`, error);
            return {
                success: false,
                error: String(error),
                invalidToken: false,
            };
        }
    }
    async sendToFCM(token, notification) {
        if (!this.firebaseMessaging) {
            this.logWarning('Firebase not initialized, skipping FCM delivery');
            return {
                success: false,
                error: 'Firebase not initialized',
            };
        }
        try {
            const message = {
                token: token.token,
                notification: {
                    title: notification.title,
                    body: notification.body,
                    imageUrl: notification.imageUrl,
                },
                data: notification.data,
                android: {
                    priority: this.mapPriorityToFCM(notification.priority),
                    ttl: notification.ttl ? notification.ttl * 1000 : undefined,
                    collapseKey: notification.collapseKey,
                    notification: {
                        sound: notification.sound || (token.allowSound ? 'default' : undefined),
                        channelId: this.getNotificationChannel(notification.category),
                    },
                },
            };
            const response = await this.firebaseMessaging.send(message);
            this.logInfo(`FCM delivery successful: ${response}`);
            return {
                success: true,
                response: { messageId: response },
            };
        }
        catch (error) {
            this.logError('FCM delivery failed', error);
            const invalidTokenErrors = [
                'messaging/invalid-registration-token',
                'messaging/registration-token-not-registered',
            ];
            const isInvalidToken = invalidTokenErrors.some((code) => error.code === code);
            return {
                success: false,
                error: error.message || String(error),
                invalidToken: isInvalidToken,
            };
        }
    }
    async sendToAPNs(token, notification) {
        if (!this.apnsProvider) {
            this.logWarning('APNs not initialized, skipping APNs delivery');
            return {
                success: false,
                error: 'APNs not initialized',
            };
        }
        try {
            const apn = await Promise.resolve().then(() => __importStar(require('apn'))).catch(() => null);
            if (!apn) {
                return {
                    success: false,
                    error: 'apn module not available',
                };
            }
            const apnsNotification = new apn.default.Notification();
            apnsNotification.topic = this.configService.get('APNS_BUNDLE_ID', 'com.whitecross.app');
            apnsNotification.alert = {
                title: notification.title,
                body: notification.body,
            };
            if (token.allowBadge && notification.badge !== undefined) {
                apnsNotification.badge = notification.badge;
            }
            if (token.allowSound) {
                apnsNotification.sound = notification.sound || 'default';
            }
            apnsNotification.payload = notification.data;
            if (notification.silent) {
                apnsNotification.contentAvailable = true;
            }
            apnsNotification.priority = this.mapPriorityToAPNs(notification.priority);
            if (notification.ttl) {
                apnsNotification.expiry =
                    Math.floor(Date.now() / 1000) + notification.ttl;
            }
            const result = await this.apnsProvider.send(apnsNotification, token.token);
            if (result.failed && result.failed.length > 0) {
                const failure = result.failed[0];
                const isInvalidToken = ['BadDeviceToken', 'Unregistered'].includes(failure.status);
                return {
                    success: false,
                    error: failure.response?.reason || 'APNs delivery failed',
                    invalidToken: isInvalidToken,
                };
            }
            this.logInfo('APNs delivery successful');
            return {
                success: true,
                response: result.sent,
            };
        }
        catch (error) {
            this.logError('APNs delivery failed', error);
            return {
                success: false,
                error: String(error),
                invalidToken: false,
            };
        }
    }
    async sendToWebPush(token, notification) {
        try {
            const webPush = await Promise.resolve().then(() => __importStar(require('web-push'))).catch(() => null);
            if (!webPush) {
                this.logWarning('web-push not installed');
                return {
                    success: false,
                    error: 'web-push not installed',
                };
            }
            const vapidPublicKey = this.configService.get('VAPID_PUBLIC_KEY');
            const vapidPrivateKey = this.configService.get('VAPID_PRIVATE_KEY');
            const vapidSubject = this.configService.get('VAPID_SUBJECT', 'mailto:admin@whitecross.com');
            if (!vapidPublicKey || !vapidPrivateKey) {
                this.logWarning('VAPID keys not configured');
                return {
                    success: false,
                    error: 'VAPID keys not configured',
                };
            }
            webPush.default.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
            const payload = JSON.stringify({
                title: notification.title,
                body: notification.body,
                icon: notification.iconUrl,
                image: notification.imageUrl,
                badge: notification.badge,
                data: notification.data,
                actions: notification.actions,
            });
            const response = await webPush.default.sendNotification(JSON.parse(token.token), payload);
            this.logInfo('Web Push delivery successful');
            return {
                success: true,
                response,
            };
        }
        catch (error) {
            this.logError('Web Push delivery failed', error);
            const isInvalidToken = error.statusCode === 410;
            return {
                success: false,
                error: error.message || String(error),
                invalidToken: isInvalidToken,
            };
        }
    }
    mapPriorityToFCM(priority) {
        return priority === enums_1.NotificationPriority.CRITICAL ||
            priority === enums_1.NotificationPriority.HIGH
            ? 'high'
            : 'normal';
    }
    mapPriorityToAPNs(priority) {
        switch (priority) {
            case enums_1.NotificationPriority.CRITICAL:
                return 10;
            case enums_1.NotificationPriority.HIGH:
                return 10;
            case enums_1.NotificationPriority.NORMAL:
                return 5;
            case enums_1.NotificationPriority.LOW:
                return 1;
            default:
                return 5;
        }
    }
    getNotificationChannel(category) {
        const channelMap = {
            [enums_1.NotificationCategory.MEDICATION]: 'medication_reminders',
            [enums_1.NotificationCategory.APPOINTMENT]: 'appointments',
            [enums_1.NotificationCategory.INCIDENT]: 'incidents',
            [enums_1.NotificationCategory.SCREENING]: 'screenings',
            [enums_1.NotificationCategory.IMMUNIZATION]: 'immunizations',
            [enums_1.NotificationCategory.MESSAGE]: 'messages',
            [enums_1.NotificationCategory.EMERGENCY]: 'emergency_alerts',
            [enums_1.NotificationCategory.REMINDER]: 'reminders',
            [enums_1.NotificationCategory.ALERT]: 'alerts',
            [enums_1.NotificationCategory.SYSTEM]: 'system',
        };
        return channelMap[category] || 'default';
    }
};
exports.NotificationPlatformService = NotificationPlatformService;
exports.NotificationPlatformService = NotificationPlatformService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        config_1.ConfigService])
], NotificationPlatformService);
//# sourceMappingURL=notification-platform.service.js.map