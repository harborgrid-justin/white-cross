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
exports.BroadcastPriorityService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../../common/base");
const emergency_broadcast_enums_1 = require("../emergency-broadcast.enums");
let BroadcastPriorityService = class BroadcastPriorityService extends base_1.BaseService {
    constructor() {
        super('BroadcastPriorityService');
    }
    determinePriority(type) {
        const criticalTypes = [
            emergency_broadcast_enums_1.EmergencyType.ACTIVE_THREAT,
            emergency_broadcast_enums_1.EmergencyType.MEDICAL_EMERGENCY,
            emergency_broadcast_enums_1.EmergencyType.FIRE,
            emergency_broadcast_enums_1.EmergencyType.NATURAL_DISASTER,
        ];
        const highTypes = [
            emergency_broadcast_enums_1.EmergencyType.LOCKDOWN,
            emergency_broadcast_enums_1.EmergencyType.EVACUATION,
            emergency_broadcast_enums_1.EmergencyType.SHELTER_IN_PLACE,
        ];
        const mediumTypes = [
            emergency_broadcast_enums_1.EmergencyType.WEATHER_ALERT,
            emergency_broadcast_enums_1.EmergencyType.TRANSPORTATION,
            emergency_broadcast_enums_1.EmergencyType.FACILITY_ISSUE,
        ];
        if (criticalTypes.includes(type))
            return emergency_broadcast_enums_1.EmergencyPriority.CRITICAL;
        if (highTypes.includes(type))
            return emergency_broadcast_enums_1.EmergencyPriority.HIGH;
        if (mediumTypes.includes(type))
            return emergency_broadcast_enums_1.EmergencyPriority.MEDIUM;
        return emergency_broadcast_enums_1.EmergencyPriority.LOW;
    }
    getDeliveryChannels(priority) {
        switch (priority) {
            case emergency_broadcast_enums_1.EmergencyPriority.CRITICAL:
                return [
                    emergency_broadcast_enums_1.CommunicationChannel.SMS,
                    emergency_broadcast_enums_1.CommunicationChannel.EMAIL,
                    emergency_broadcast_enums_1.CommunicationChannel.PUSH,
                    emergency_broadcast_enums_1.CommunicationChannel.VOICE,
                ];
            case emergency_broadcast_enums_1.EmergencyPriority.HIGH:
                return [emergency_broadcast_enums_1.CommunicationChannel.SMS, emergency_broadcast_enums_1.CommunicationChannel.EMAIL, emergency_broadcast_enums_1.CommunicationChannel.PUSH];
            case emergency_broadcast_enums_1.EmergencyPriority.MEDIUM:
                return [emergency_broadcast_enums_1.CommunicationChannel.EMAIL, emergency_broadcast_enums_1.CommunicationChannel.PUSH];
            case emergency_broadcast_enums_1.EmergencyPriority.LOW:
                return [emergency_broadcast_enums_1.CommunicationChannel.EMAIL];
        }
    }
    getDefaultExpiration(priority) {
        const hours = priority === emergency_broadcast_enums_1.EmergencyPriority.CRITICAL ? 1 : 24;
        return new Date(Date.now() + hours * 60 * 60 * 1000);
    }
    validatePriorityChannels(priority, channels) {
        const warnings = [];
        const recommendedChannels = this.getDeliveryChannels(priority);
        if (priority === emergency_broadcast_enums_1.EmergencyPriority.CRITICAL) {
            if (!channels.includes(emergency_broadcast_enums_1.CommunicationChannel.SMS)) {
                warnings.push('Critical broadcasts should include SMS for immediate delivery');
            }
            if (!channels.includes(emergency_broadcast_enums_1.CommunicationChannel.VOICE)) {
                warnings.push('Critical broadcasts should include voice calls for maximum impact');
            }
        }
        const missingRecommended = recommendedChannels.filter((channel) => !channels.includes(channel));
        if (missingRecommended.length > 0) {
            warnings.push(`Missing recommended channels for ${priority} priority: ${missingRecommended.join(', ')}`);
        }
        if (priority === emergency_broadcast_enums_1.EmergencyPriority.LOW && channels.length > 2) {
            warnings.push('Low priority broadcasts typically use only email');
        }
        return {
            isValid: warnings.length === 0,
            warnings,
        };
    }
};
exports.BroadcastPriorityService = BroadcastPriorityService;
exports.BroadcastPriorityService = BroadcastPriorityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], BroadcastPriorityService);
//# sourceMappingURL=broadcast-priority.service.js.map