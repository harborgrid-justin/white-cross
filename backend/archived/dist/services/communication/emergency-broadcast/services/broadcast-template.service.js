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
exports.BroadcastTemplateService = void 0;
const common_1 = require("@nestjs/common");
const emergency_broadcast_enums_1 = require("../emergency-broadcast.enums");
const base_1 = require("../../../../common/base");
let BroadcastTemplateService = class BroadcastTemplateService extends base_1.BaseService {
    constructor() {
        super('BroadcastTemplateService');
    }
    getTemplates() {
        return {
            [emergency_broadcast_enums_1.EmergencyType.ACTIVE_THREAT]: {
                title: '🚨 EMERGENCY: Secure All Areas',
                message: 'LOCKDOWN IN EFFECT. Secure all doors and windows. Follow established lockdown procedures. Wait for all-clear from administration.',
            },
            [emergency_broadcast_enums_1.EmergencyType.FIRE]: {
                title: '🔥 FIRE ALARM: Evacuate Immediately',
                message: 'Fire alarm activated. Evacuate building immediately using nearest safe exit. Proceed to designated assembly area. Take attendance.',
            },
            [emergency_broadcast_enums_1.EmergencyType.MEDICAL_EMERGENCY]: {
                title: '⚕️ MEDICAL EMERGENCY',
                message: 'Medical emergency in progress. Emergency services have been contacted. Clear hallways and remain calm.',
            },
            [emergency_broadcast_enums_1.EmergencyType.WEATHER_ALERT]: {
                title: '⛈️ SEVERE WEATHER ALERT',
                message: 'Severe weather warning in effect. Move to interior rooms away from windows. Shelter in place until all-clear.',
            },
            [emergency_broadcast_enums_1.EmergencyType.LOCKDOWN]: {
                title: '🔒 LOCKDOWN IN EFFECT',
                message: 'Precautionary lockdown in effect. Secure all doors. Classes continue normally. No one enters or exits building.',
            },
            [emergency_broadcast_enums_1.EmergencyType.EVACUATION]: {
                title: '⚠️ BUILDING EVACUATION',
                message: 'Evacuate building immediately. Proceed calmly to designated assembly area. Teachers take attendance.',
            },
            [emergency_broadcast_enums_1.EmergencyType.EARLY_DISMISSAL]: {
                title: 'Early Dismissal',
                message: 'School will dismiss early today. Please arrange pickup or transportation accordingly.',
            },
            [emergency_broadcast_enums_1.EmergencyType.SCHOOL_CLOSURE]: {
                title: 'School Closure',
                message: 'School will be closed. All activities cancelled. Watch for updates.',
            },
            [emergency_broadcast_enums_1.EmergencyType.NATURAL_DISASTER]: {
                title: '🌪️ NATURAL DISASTER ALERT',
                message: 'Natural disaster alert. Follow emergency procedures immediately. Seek shelter. Emergency services notified.',
            },
            [emergency_broadcast_enums_1.EmergencyType.SHELTER_IN_PLACE]: {
                title: '🏠 SHELTER IN PLACE',
                message: 'Shelter in place order in effect. Stay indoors. Seal windows and doors. Turn off ventilation. Await further instructions.',
            },
            [emergency_broadcast_enums_1.EmergencyType.TRANSPORTATION]: {
                title: '🚌 Transportation Alert',
                message: 'Transportation disruption. Delays expected. Alternative arrangements may be needed.',
            },
            [emergency_broadcast_enums_1.EmergencyType.FACILITY_ISSUE]: {
                title: '🔧 Facility Issue',
                message: 'Facility issue affecting building operations. Updates will be provided as situation develops.',
            },
            [emergency_broadcast_enums_1.EmergencyType.GENERAL_ANNOUNCEMENT]: {
                title: 'Important Announcement',
                message: 'Important school announcement. Please read carefully.',
            },
        };
    }
    getTemplate(type) {
        const templates = this.getTemplates();
        return templates[type] || templates[emergency_broadcast_enums_1.EmergencyType.GENERAL_ANNOUNCEMENT];
    }
    getEmergencyTypes() {
        return Object.values(emergency_broadcast_enums_1.EmergencyType);
    }
    isValidEmergencyType(type) {
        return Object.values(emergency_broadcast_enums_1.EmergencyType).includes(type);
    }
    customizeTemplate(type, variables = {}) {
        const template = this.getTemplate(type);
        let customTitle = template.title;
        let customMessage = template.message;
        for (const [key, value] of Object.entries(variables)) {
            const placeholder = `{{${key}}}`;
            customTitle = customTitle.replace(new RegExp(placeholder, 'g'), value);
            customMessage = customMessage.replace(new RegExp(placeholder, 'g'), value);
        }
        return {
            title: customTitle,
            message: customMessage,
        };
    }
    getTemplateVariables(type) {
        const template = this.getTemplate(type);
        const variables = [];
        const titleMatches = template.title.match(/\{\{(\w+)\}\}/g) || [];
        const messageMatches = template.message.match(/\{\{(\w+)\}\}/g) || [];
        const allMatches = [...titleMatches, ...messageMatches];
        for (const match of allMatches) {
            const variable = match.replace(/\{\{|\}\}/g, '');
            if (!variables.includes(variable)) {
                variables.push(variable);
            }
        }
        return variables;
    }
    validateTemplate(template) {
        const errors = [];
        if (!template.title || template.title.trim().length === 0) {
            errors.push('Title is required');
        }
        else if (template.title.length > 100) {
            errors.push('Title must be 100 characters or less');
        }
        if (!template.message || template.message.trim().length === 0) {
            errors.push('Message is required');
        }
        else if (template.message.length > 1000) {
            errors.push('Message must be 1000 characters or less');
        }
        const dangerousPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /<iframe/i,
            /<object/i,
            /<embed/i,
        ];
        const content = `${template.title} ${template.message}`;
        for (const pattern of dangerousPatterns) {
            if (pattern.test(content)) {
                errors.push('Template contains potentially unsafe content');
                break;
            }
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
    getRecommendedTemplates(context) {
        if (context.timeOfDay === 'morning' || context.timeOfDay === 'afternoon') {
            if (context.dayOfWeek === 'weekday') {
                return [
                    emergency_broadcast_enums_1.EmergencyType.FIRE,
                    emergency_broadcast_enums_1.EmergencyType.LOCKDOWN,
                    emergency_broadcast_enums_1.EmergencyType.EVACUATION,
                    emergency_broadcast_enums_1.EmergencyType.MEDICAL_EMERGENCY,
                    emergency_broadcast_enums_1.EmergencyType.WEATHER_ALERT,
                ];
            }
        }
        if (context.timeOfDay === 'evening' || context.timeOfDay === 'night') {
            return [
                emergency_broadcast_enums_1.EmergencyType.WEATHER_ALERT,
                emergency_broadcast_enums_1.EmergencyType.SCHOOL_CLOSURE,
                emergency_broadcast_enums_1.EmergencyType.TRANSPORTATION,
                emergency_broadcast_enums_1.EmergencyType.FACILITY_ISSUE,
            ];
        }
        if (context.season === 'winter') {
            return [
                emergency_broadcast_enums_1.EmergencyType.WEATHER_ALERT,
                emergency_broadcast_enums_1.EmergencyType.SCHOOL_CLOSURE,
                emergency_broadcast_enums_1.EmergencyType.EARLY_DISMISSAL,
                emergency_broadcast_enums_1.EmergencyType.TRANSPORTATION,
            ];
        }
        return [
            emergency_broadcast_enums_1.EmergencyType.GENERAL_ANNOUNCEMENT,
            emergency_broadcast_enums_1.EmergencyType.WEATHER_ALERT,
            emergency_broadcast_enums_1.EmergencyType.TRANSPORTATION,
            emergency_broadcast_enums_1.EmergencyType.SCHOOL_CLOSURE,
        ];
    }
};
exports.BroadcastTemplateService = BroadcastTemplateService;
exports.BroadcastTemplateService = BroadcastTemplateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], BroadcastTemplateService);
//# sourceMappingURL=broadcast-template.service.js.map