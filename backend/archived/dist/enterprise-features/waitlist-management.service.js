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
exports.WaitlistManagementService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const enterprise_features_interfaces_1 = require("./enterprise-features-interfaces");
const enterprise_features_constants_1 = require("./enterprise-features-constants");
const base_1 = require("../common/base");
let WaitlistManagementService = class WaitlistManagementService extends base_1.BaseService {
    eventEmitter;
    waitlist = [];
    constructor(eventEmitter) {
        super('WaitlistManagementService');
        this.eventEmitter = eventEmitter;
    }
    addToWaitlist(studentId, appointmentType, priority = enterprise_features_interfaces_1.WaitlistPriority.ROUTINE) {
        try {
            const entry = {
                id: `${enterprise_features_constants_1.ENTERPRISE_CONSTANTS.ID_PREFIXES.WAITLIST}${Date.now()}`,
                studentId,
                appointmentType,
                priority,
                addedAt: new Date(),
                status: enterprise_features_interfaces_1.WaitlistStatus.WAITING,
            };
            this.waitlist.push(entry);
            this.logInfo('Student added to waitlist', {
                studentId,
                appointmentType,
                priority,
                entryId: entry.id,
            });
            this.eventEmitter.emit('waitlist.entry.added', {
                entry,
                timestamp: new Date(),
            });
            return entry;
        }
        catch (error) {
            this.logError('Error adding to waitlist', {
                error: error instanceof Error ? error.message : String(error),
                studentId,
                appointmentType,
            });
            throw error;
        }
    }
    autoFillFromWaitlist(appointmentSlot, appointmentType) {
        try {
            const eligibleEntries = this.waitlist
                .filter((entry) => entry.appointmentType === appointmentType &&
                entry.status === enterprise_features_interfaces_1.WaitlistStatus.WAITING)
                .sort((a, b) => {
                if (a.priority !== b.priority) {
                    return a.priority === enterprise_features_interfaces_1.WaitlistPriority.URGENT ? -1 : 1;
                }
                return a.addedAt.getTime() - b.addedAt.getTime();
            });
            if (eligibleEntries.length === 0) {
                this.logInfo('No eligible waitlist entries found', { appointmentType });
                return false;
            }
            const selectedEntry = eligibleEntries[0];
            selectedEntry.status = enterprise_features_interfaces_1.WaitlistStatus.SCHEDULED;
            this.logInfo('Auto-filling appointment from waitlist', {
                appointmentSlot,
                appointmentType,
                studentId: selectedEntry.studentId,
                entryId: selectedEntry.id,
            });
            this.eventEmitter.emit('appointment.auto-filled', {
                entry: selectedEntry,
                appointmentSlot,
                timestamp: new Date(),
            });
            return true;
        }
        catch (error) {
            this.logError('Error auto-filling from waitlist', {
                error: error instanceof Error ? error.message : String(error),
                appointmentSlot,
                appointmentType,
            });
            throw error;
        }
    }
    async getWaitlistByPriority() {
        try {
            const high = this.waitlist.filter(entry => entry.priority === enterprise_features_interfaces_1.WaitlistPriority.URGENT &&
                entry.status === enterprise_features_interfaces_1.WaitlistStatus.WAITING);
            const routine = this.waitlist.filter(entry => entry.priority === enterprise_features_interfaces_1.WaitlistPriority.ROUTINE &&
                entry.status === enterprise_features_interfaces_1.WaitlistStatus.WAITING);
            const result = {
                high,
                routine,
                totalCount: high.length + routine.length,
            };
            this.logInfo('Retrieved waitlist by priority', {
                highCount: high.length,
                routineCount: routine.length,
                totalCount: result.totalCount,
            });
            return result;
        }
        catch (error) {
            this.logError('Error getting waitlist by priority', error);
            throw error;
        }
    }
    async getWaitlistStatus(studentId) {
        try {
            const studentWaitlists = this.waitlist.filter(entry => entry.studentId === studentId &&
                entry.status === enterprise_features_interfaces_1.WaitlistStatus.WAITING);
            this.logInfo('Getting waitlist status for student', {
                studentId,
                waitlistCount: studentWaitlists.length,
            });
            return { waitlists: studentWaitlists };
        }
        catch (error) {
            this.logError('Error getting waitlist status', {
                error,
                studentId,
            });
            throw error;
        }
    }
    async removeFromWaitlist(entryId, removedBy, reason) {
        try {
            const entryIndex = this.waitlist.findIndex(entry => entry.id === entryId);
            if (entryIndex === -1) {
                this.logWarning('Waitlist entry not found', { entryId });
                return false;
            }
            const entry = this.waitlist[entryIndex];
            entry.status = enterprise_features_interfaces_1.WaitlistStatus.CANCELLED;
            this.logInfo('Student removed from waitlist', {
                entryId,
                studentId: entry.studentId,
                removedBy,
                reason,
            });
            this.eventEmitter.emit('waitlist.entry.removed', {
                entry,
                removedBy,
                reason,
                timestamp: new Date(),
            });
            return true;
        }
        catch (error) {
            this.logError('Error removing from waitlist', {
                error,
                entryId,
                removedBy,
            });
            throw error;
        }
    }
    async getWaitlistStatistics() {
        try {
            const stats = {
                totalEntries: this.waitlist.length,
                waitingCount: this.waitlist.filter(e => e.status === enterprise_features_interfaces_1.WaitlistStatus.WAITING).length,
                scheduledCount: this.waitlist.filter(e => e.status === enterprise_features_interfaces_1.WaitlistStatus.SCHEDULED).length,
                cancelledCount: this.waitlist.filter(e => e.status === enterprise_features_interfaces_1.WaitlistStatus.CANCELLED).length,
                averageWaitTime: this.calculateAverageWaitTime(),
                priorityBreakdown: {
                    urgent: this.waitlist.filter(e => e.priority === enterprise_features_interfaces_1.WaitlistPriority.URGENT).length,
                    routine: this.waitlist.filter(e => e.priority === enterprise_features_interfaces_1.WaitlistPriority.ROUTINE).length,
                },
            };
            this.logInfo('Retrieved waitlist statistics', stats);
            return stats;
        }
        catch (error) {
            this.logError('Error getting waitlist statistics', error);
            throw error;
        }
    }
    async cleanupExpiredEntries() {
        try {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() - enterprise_features_constants_1.WAITLIST_CONSTANTS.WAITLIST_EXPIRY_DAYS);
            const expiredEntries = this.waitlist.filter(entry => entry.addedAt < expiryDate &&
                entry.status === enterprise_features_interfaces_1.WaitlistStatus.WAITING);
            expiredEntries.forEach(entry => {
                entry.status = enterprise_features_interfaces_1.WaitlistStatus.CANCELLED;
            });
            this.logInfo('Cleaned up expired waitlist entries', {
                expiredCount: expiredEntries.length,
                expiryDays: enterprise_features_constants_1.WAITLIST_CONSTANTS.WAITLIST_EXPIRY_DAYS,
            });
            return expiredEntries.length;
        }
        catch (error) {
            this.logError('Error cleaning up expired entries', error);
            throw error;
        }
    }
    calculateAverageWaitTime() {
        const scheduledEntries = this.waitlist.filter(entry => entry.status === enterprise_features_interfaces_1.WaitlistStatus.SCHEDULED);
        if (scheduledEntries.length === 0) {
            return 0;
        }
        const totalWaitTime = scheduledEntries.reduce((sum, entry) => {
            return sum + (24 * 60 * 60 * 1000);
        }, 0);
        return totalWaitTime / scheduledEntries.length;
    }
};
exports.WaitlistManagementService = WaitlistManagementService;
exports.WaitlistManagementService = WaitlistManagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2])
], WaitlistManagementService);
//# sourceMappingURL=waitlist-management.service.js.map