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
exports.CostTrackerService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../common/base");
let CostTrackerService = class CostTrackerService extends base_1.BaseService {
    costEntries = [];
    totalCost = 0;
    totalMessages = 0;
    constructor() {
        super('CostTrackerService');
        this.logInfo('Cost tracker service initialized');
    }
    async recordCost(entry) {
        const costEntry = {
            ...entry,
            id: this.generateId(),
            date: new Date(entry.timestamp),
        };
        this.costEntries.push(costEntry);
        this.totalCost += entry.totalCost;
        this.totalMessages += 1;
        this.logDebug(`Recorded SMS cost: ${entry.to} (${entry.countryCode}) - $${entry.totalCost.toFixed(4)}`);
        return costEntry;
    }
    async getAnalytics(query) {
        const startDate = new Date(query.startDate);
        const endDate = new Date(query.endDate);
        let filteredEntries = this.costEntries.filter((entry) => {
            const entryDate = entry.date;
            return entryDate >= startDate && entryDate <= endDate;
        });
        if (query.countryCode) {
            filteredEntries = filteredEntries.filter((entry) => entry.countryCode === query.countryCode);
        }
        const totalMessages = filteredEntries.length;
        const totalCost = filteredEntries.reduce((sum, entry) => sum + entry.totalCost, 0);
        const averageCostPerMessage = totalMessages > 0 ? totalCost / totalMessages : 0;
        const costByCountry = {};
        filteredEntries.forEach((entry) => {
            if (!costByCountry[entry.countryCode]) {
                costByCountry[entry.countryCode] = { messages: 0, cost: 0 };
            }
            costByCountry[entry.countryCode].messages += 1;
            costByCountry[entry.countryCode].cost += entry.totalCost;
        });
        Object.keys(costByCountry).forEach((country) => {
            costByCountry[country].cost = parseFloat(costByCountry[country].cost.toFixed(4));
        });
        return {
            totalMessages,
            totalCost: parseFloat(totalCost.toFixed(4)),
            averageCostPerMessage: parseFloat(averageCostPerMessage.toFixed(6)),
            costByCountry,
            startDate: query.startDate,
            endDate: query.endDate,
        };
    }
    async getTotalCosts() {
        return {
            totalCost: parseFloat(this.totalCost.toFixed(4)),
            totalMessages: this.totalMessages,
        };
    }
    async getCostsByPhoneNumber(phoneNumber, limit = 100) {
        return this.costEntries
            .filter((entry) => entry.to === phoneNumber)
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, limit);
    }
    async getRecentCosts(limit = 100) {
        return this.costEntries
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, limit);
    }
    async getDailyCosts(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const filteredEntries = this.costEntries.filter((entry) => {
            return entry.date >= start && entry.date <= end;
        });
        const dailyCosts = {};
        filteredEntries.forEach((entry) => {
            const dateKey = entry.date.toISOString().split('T')[0];
            if (!dailyCosts[dateKey]) {
                dailyCosts[dateKey] = { messages: 0, cost: 0 };
            }
            dailyCosts[dateKey].messages += 1;
            dailyCosts[dateKey].cost += entry.totalCost;
        });
        return Object.entries(dailyCosts)
            .map(([date, data]) => ({
            date,
            messages: data.messages,
            cost: parseFloat(data.cost.toFixed(4)),
        }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }
    async checkBudget(budgetAmount, periodStart, periodEnd) {
        const analytics = await this.getAnalytics({
            startDate: periodStart,
            endDate: periodEnd,
        });
        const totalCost = analytics.totalCost;
        const remainingBudget = Math.max(0, budgetAmount - totalCost);
        const percentUsed = budgetAmount > 0 ? (totalCost / budgetAmount) * 100 : 0;
        return {
            isExceeded: totalCost > budgetAmount,
            totalCost,
            budgetAmount,
            remainingBudget: parseFloat(remainingBudget.toFixed(4)),
            percentUsed: parseFloat(percentUsed.toFixed(2)),
        };
    }
    async clearAllCosts() {
        const count = this.costEntries.length;
        this.costEntries.length = 0;
        this.totalCost = 0;
        this.totalMessages = 0;
        this.logWarning(`Cleared ${count} cost entries`);
    }
    generateId() {
        return `cost_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
};
exports.CostTrackerService = CostTrackerService;
exports.CostTrackerService = CostTrackerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CostTrackerService);
//# sourceMappingURL=cost-tracker.service.js.map