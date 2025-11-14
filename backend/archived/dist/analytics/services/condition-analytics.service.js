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
exports.ConditionAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../common/base");
let ConditionAnalyticsService = class ConditionAnalyticsService extends base_1.BaseService {
    constructor() {
        super("ConditionAnalyticsService");
    }
    normalizeCondition(diagnosis) {
        const normalized = diagnosis.toLowerCase().trim();
        if (normalized.includes('allergy') || normalized.includes('allergic'))
            return 'Seasonal Allergies';
        if (normalized.includes('asthma'))
            return 'Asthma';
        if (normalized.includes('flu') || normalized.includes('influenza'))
            return 'Influenza';
        if (normalized.includes('cold') || normalized.includes('upper respiratory'))
            return 'Common Cold';
        if (normalized.includes('headache') || normalized.includes('migraine'))
            return 'Headache';
        if (normalized.includes('stomach') || normalized.includes('gastro'))
            return 'Stomach Issues';
        if (normalized.includes('anxiety'))
            return 'Anxiety';
        if (normalized.includes('adhd') || normalized.includes('attention'))
            return 'ADHD';
        return diagnosis;
    }
    categorizeCondition(condition) {
        const lower = condition.toLowerCase();
        if (lower.includes('allergy'))
            return 'Allergy';
        if (lower.includes('asthma') || lower.includes('respiratory'))
            return 'Respiratory';
        if (lower.includes('mental') ||
            lower.includes('anxiety') ||
            lower.includes('adhd'))
            return 'Mental Health';
        if (lower.includes('injury') || lower.includes('fracture'))
            return 'Injury';
        if (lower.includes('infection'))
            return 'Infectious Disease';
        return 'General';
    }
    detectSeasonality(condition, currentMonth) {
        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        const lower = condition.toLowerCase();
        if (lower.includes('allergy')) {
            return {
                peakMonths: ['March', 'April', 'May', 'September'],
                lowMonths: ['December', 'January', 'February'],
            };
        }
        if (lower.includes('flu')) {
            return {
                peakMonths: ['December', 'January', 'February', 'March'],
                lowMonths: ['June', 'July', 'August'],
            };
        }
        return undefined;
    }
    getConditionColor(condition) {
        const colors = [
            '#3B82F6',
            '#10B981',
            '#F59E0B',
            '#EF4444',
            '#8B5CF6',
            '#06B6D4',
        ];
        const hash = condition
            .split('')
            .reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    }
    isChronicCondition(condition) {
        const lower = condition.toLowerCase();
        const chronicKeywords = [
            'asthma',
            'diabetes',
            'adhd',
            'anxiety',
            'depression',
            'epilepsy',
            'chronic',
        ];
        return chronicKeywords.some((keyword) => lower.includes(keyword));
    }
    getConditionSeverity(condition) {
        const lower = condition.toLowerCase();
        const highSeverity = ['severe', 'emergency', 'critical', 'anaphylaxis'];
        if (highSeverity.some((keyword) => lower.includes(keyword))) {
            return 'HIGH';
        }
        const mediumSeverity = ['moderate', 'injury', 'fracture', 'infection'];
        if (mediumSeverity.some((keyword) => lower.includes(keyword))) {
            return 'MEDIUM';
        }
        return 'LOW';
    }
    groupConditionsByCategory(conditions) {
        const categoryMap = new Map();
        for (const condition of conditions) {
            const category = this.categorizeCondition(condition);
            if (!categoryMap.has(category)) {
                categoryMap.set(category, []);
            }
            categoryMap.get(category).push(condition);
        }
        return categoryMap;
    }
};
exports.ConditionAnalyticsService = ConditionAnalyticsService;
exports.ConditionAnalyticsService = ConditionAnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ConditionAnalyticsService);
//# sourceMappingURL=condition-analytics.service.js.map