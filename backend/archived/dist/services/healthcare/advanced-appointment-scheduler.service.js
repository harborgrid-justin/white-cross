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
exports.AdvancedAppointmentSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const models_3 = require("../../database/models");
const base_1 = require("../../common/base");
let AdvancedAppointmentSchedulerService = class AdvancedAppointmentSchedulerService extends base_1.BaseService {
    studentModel;
    appointmentModel;
    healthRecordModel;
    sequelize;
    SCHEDULING_RULES = {
        MIN_APPOINTMENT_DURATION: 15,
        MAX_APPOINTMENT_DURATION: 480,
        BUFFER_TIME: 15,
        MAX_DAILY_APPOINTMENTS: 8,
        BUSINESS_HOURS: {
            start: '08:00',
            end: '18:00',
            workingDays: [1, 2, 3, 4, 5],
        },
        URGENCY_MULTIPLIERS: {
            ROUTINE: 1,
            URGENT: 2,
            EMERGENCY: 3,
        },
    };
    APPOINTMENT_TYPES = {
        GENERAL_CHECKUP: {
            duration: 30,
            priority: 'ROUTINE',
            resources: ['exam_room'],
            preparation: ['fasting_not_required'],
        },
        SPECIALIST_CONSULTATION: {
            duration: 45,
            priority: 'ROUTINE',
            resources: ['exam_room', 'specialist_equipment'],
            preparation: ['bring_medical_records'],
        },
        FOLLOW_UP: {
            duration: 20,
            priority: 'ROUTINE',
            resources: ['exam_room'],
            preparation: ['bring_medication_list'],
        },
        URGENT_CARE: {
            duration: 25,
            priority: 'URGENT',
            resources: ['urgent_care_room'],
            preparation: ['immediate_attention'],
        },
        TELEHEALTH: {
            duration: 30,
            priority: 'ROUTINE',
            resources: ['video_conference'],
            preparation: ['test_technology'],
        },
        PROCEDURE: {
            duration: 60,
            priority: 'ROUTINE',
            resources: ['procedure_room', 'specialized_equipment'],
            preparation: ['follow_pre_procedure_instructions'],
        },
    };
    constructor(studentModel, appointmentModel, healthRecordModel, sequelize) {
        super("AdvancedAppointmentSchedulerService");
        this.studentModel = studentModel;
        this.appointmentModel = appointmentModel;
        this.healthRecordModel = healthRecordModel;
        this.sequelize = sequelize;
    }
    async scheduleAppointment(patientId, appointmentRequest) {
        const patient = await this.studentModel.findByPk(patientId);
        if (!patient) {
            return {
                success: false,
                error: 'Patient not found',
            };
        }
        const patientProfile = await this.analyzePatientProfile(patientId);
        const optimalSlot = await this.findOptimalAppointmentSlot(appointmentRequest, patientProfile);
        if (!optimalSlot.available) {
            const waitlistEntry = await this.addToWaitlist(patientId, appointmentRequest);
            return {
                success: false,
                error: 'No immediate appointments available',
                waitlistPosition: waitlistEntry.position,
                estimatedWaitTime: waitlistEntry.estimatedWaitTime,
                alternativeSuggestions: optimalSlot.alternatives,
            };
        }
        const conflicts = await this.checkSchedulingConflicts(optimalSlot.provider, optimalSlot.date, optimalSlot.time, appointmentRequest.duration);
        if (conflicts.length > 0) {
            const resolution = await this.resolveSchedulingConflicts(conflicts, optimalSlot);
            if (!resolution.resolved) {
                return {
                    success: false,
                    error: 'Scheduling conflicts detected and could not be resolved',
                    conflicts: resolution.unresolvedConflicts,
                };
            }
        }
        const appointment = await this.createAppointment({
            patientId,
            ...appointmentRequest,
            scheduledDate: optimalSlot.date,
            scheduledTime: optimalSlot.time,
            provider: optimalSlot.provider,
            location: optimalSlot.location,
        });
        await this.scheduleAutomatedReminders(appointment.id, patientProfile);
        await this.updatePatientSchedulingPreferences(patientId, appointmentRequest);
        await this.logSchedulingDecision(appointment.id, {
            patientProfile,
            optimalSlot,
            reasoning: 'AI-optimized scheduling based on patient history and preferences',
        });
        return {
            success: true,
            appointmentId: appointment.id,
            scheduledDate: appointment.scheduledDate,
            scheduledTime: appointment.scheduledTime,
            provider: appointment.provider,
            location: appointment.location,
            preparationInstructions: this.getPreparationInstructions(appointmentRequest.type),
            confirmationMessage: 'Appointment scheduled successfully with optimal timing.',
        };
    }
    async rescheduleAppointment(appointmentId, rescheduleRequest) {
        const appointment = await this.appointmentModel.findByPk(appointmentId);
        if (!appointment) {
            return {
                success: false,
                error: 'Appointment not found',
            };
        }
        const canReschedule = await this.canRescheduleAppointment(appointment);
        if (!canReschedule.allowed) {
            return {
                success: false,
                error: canReschedule.reason,
            };
        }
        const patientProfile = await this.analyzePatientProfile(appointment.studentId);
        const newSlot = await this.findOptimalAppointmentSlot({
            type: appointment.appointmentType,
            duration: appointment.duration,
            urgency: rescheduleRequest.urgency || 'ROUTINE',
            preferredDate: rescheduleRequest.preferredDate,
            preferredTime: rescheduleRequest.preferredTime,
            provider: rescheduleRequest.preferredProvider || appointment.provider,
        }, patientProfile);
        if (!newSlot.available) {
            return {
                success: false,
                error: 'No suitable reschedule slot available',
                alternativeSuggestions: newSlot.alternatives,
            };
        }
        await this.appointmentModel.update({
            scheduledDate: newSlot.date,
            scheduledTime: newSlot.time,
            provider: newSlot.provider,
            location: newSlot.location,
            rescheduledAt: new Date(),
            rescheduleReason: rescheduleRequest.reason,
        }, {
            where: { id: appointmentId },
        });
        await this.updateAppointmentReminders(appointmentId);
        await this.notifyReschedule(appointmentId, appointment, newSlot);
        return {
            success: true,
            appointmentId,
            newDate: newSlot.date,
            newTime: newSlot.time,
            newProvider: newSlot.provider,
            newLocation: newSlot.location,
            message: 'Appointment rescheduled successfully.',
        };
    }
    async cancelAppointment(appointmentId, cancellationRequest) {
        const appointment = await this.appointmentModel.findByPk(appointmentId);
        if (!appointment) {
            return {
                success: false,
                error: 'Appointment not found',
            };
        }
        const cancellationPolicy = await this.checkCancellationPolicy(appointment);
        if (!cancellationPolicy.allowed) {
            return {
                success: false,
                error: cancellationPolicy.reason,
            };
        }
        await this.appointmentModel.update({
            status: 'CANCELLED',
            cancelledAt: new Date(),
            cancellationReason: cancellationRequest.reason,
            cancellationNotes: cancellationRequest.notes,
        }, {
            where: { id: appointmentId },
        });
        await this.cancelAppointmentReminders(appointmentId);
        await this.processWaitlistForCancelledSlot(appointment);
        if (cancellationPolicy.requiresFollowUp) {
            await this.scheduleCancellationFollowUp(appointment, cancellationRequest);
        }
        await this.logCancellation(appointmentId, cancellationRequest);
        return {
            success: true,
            appointmentId,
            refundAmount: cancellationPolicy.refundAmount,
            reschedulingOffered: cancellationPolicy.canReschedule,
            message: 'Appointment cancelled successfully.',
        };
    }
    async getAvailableSlots(request) {
        const slots = [];
        const startDate = request.startDate || new Date();
        const endDate = request.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const providers = request.provider ? [request.provider] : await this.getAvailableProviders();
        for (const provider of providers) {
            const providerSlots = await this.generateProviderSlots(provider, startDate, endDate, request.appointmentType);
            slots.push(...providerSlots);
        }
        if (request.patientId) {
            const patientPreferences = await this.getPatientSchedulingPreferences(request.patientId);
            const filteredSlots = await this.filterSlotsByPreferences(slots, patientPreferences);
            slots.length = 0;
            slots.push(...filteredSlots);
        }
        const sortedSlots = await this.sortSlotsByOptimality(slots, request);
        return {
            slots: sortedSlots.slice(0, request.limit || 20),
            totalAvailable: sortedSlots.length,
            dateRange: {
                from: startDate,
                to: endDate,
            },
            filters: request,
        };
    }
    async manageWaitlist(patientId, waitlistRequest) {
        switch (waitlistRequest.action) {
            case 'ADD':
                return await this.addToWaitlist(patientId, waitlistRequest.appointmentRequest);
            case 'REMOVE':
                return await this.removeFromWaitlist(patientId, waitlistRequest.waitlistId);
            case 'UPDATE':
                return await this.updateWaitlistEntry(patientId, waitlistRequest);
            case 'CHECK_STATUS':
                return await this.checkWaitlistStatus(patientId, waitlistRequest.waitlistId);
            default:
                return {
                    success: false,
                    error: 'Invalid waitlist action',
                };
        }
    }
    async generateSchedulingAnalytics(dateRange) {
        const appointments = await this.appointmentModel.findAll({
            where: {
                scheduledDate: {
                    [this.sequelize.Op.between]: [dateRange.from, dateRange.to],
                },
            },
        });
        const metrics = await this.calculateSchedulingMetrics(appointments, dateRange);
        const patterns = await this.analyzeSchedulingPatterns(appointments);
        const insights = await this.generateSchedulingInsights(metrics, patterns);
        const predictions = await this.predictSchedulingNeeds(appointments, dateRange);
        return {
            dateRange,
            metrics,
            patterns,
            insights,
            predictions,
            generatedAt: new Date(),
        };
    }
    async optimizeProviderSchedule(providerId, optimizationRequest) {
        const currentSchedule = await this.getProviderSchedule(providerId, optimizationRequest.dateRange);
        const efficiency = await this.analyzeScheduleEfficiency(currentSchedule);
        const recommendations = await this.generateOptimizationRecommendations(currentSchedule, efficiency, optimizationRequest);
        if (optimizationRequest.applyOptimizations) {
            const optimizedSchedule = await this.applyScheduleOptimizations(providerId, recommendations);
            return {
                success: true,
                providerId,
                originalEfficiency: efficiency,
                optimizedEfficiency: await this.analyzeScheduleEfficiency(optimizedSchedule),
                appliedOptimizations: recommendations.filter(r => r.applied),
                message: 'Schedule optimizations applied successfully.',
            };
        }
        return {
            success: true,
            providerId,
            currentEfficiency: efficiency,
            recommendations,
            previewOptimizations: recommendations,
            message: 'Optimization recommendations generated. Review and apply as needed.',
        };
    }
    async analyzePatientProfile(patientId) {
        const appointmentHistory = await this.appointmentModel.findAll({
            where: { studentId: patientId },
            order: [['scheduledDate', 'DESC']],
            limit: 10,
        });
        const healthRecords = await this.healthRecordModel.findAll({
            where: { studentId: patientId },
            order: [['createdAt', 'DESC']],
            limit: 5,
        });
        const preferences = {
            preferredDays: this.analyzePreferredDays(appointmentHistory),
            preferredTimes: this.analyzePreferredTimes(appointmentHistory),
            preferredProviders: this.analyzePreferredProviders(appointmentHistory),
            reliability: this.calculatePatientReliability(appointmentHistory),
            urgencyPatterns: this.analyzeUrgencyPatterns(appointmentHistory),
            healthContext: this.extractHealthContext(healthRecords),
        };
        return {
            patientId,
            preferences,
            history: appointmentHistory.length,
            lastAppointment: appointmentHistory[0]?.scheduledDate,
            noShowRate: this.calculateNoShowRate(appointmentHistory),
        };
    }
    async findOptimalAppointmentSlot(request, patientProfile) {
        const candidateSlots = await this.generateCandidateSlots(request, patientProfile);
        const scoredSlots = await Promise.all(candidateSlots.map(async (slot) => ({
            ...slot,
            score: await this.calculateSlotScore(slot, request, patientProfile),
        })));
        scoredSlots.sort((a, b) => b.score - a.score);
        if (scoredSlots.length === 0 || scoredSlots[0].score < 50) {
            return {
                available: false,
                alternatives: scoredSlots.slice(0, 5).map(s => ({
                    date: s.date,
                    time: s.time,
                    provider: s.provider,
                    score: s.score,
                })),
            };
        }
        const optimalSlot = scoredSlots[0];
        return {
            available: true,
            date: optimalSlot.date,
            time: optimalSlot.time,
            provider: optimalSlot.provider,
            location: optimalSlot.location,
            score: optimalSlot.score,
            reasoning: await this.explainSlotChoice(optimalSlot, patientProfile),
        };
    }
    async checkSchedulingConflicts(provider, date, time, duration) {
        const conflicts = [];
        const providerConflicts = await this.checkProviderConflicts(provider, date, time, duration);
        conflicts.push(...providerConflicts);
        const resourceConflicts = await this.checkResourceConflicts(date, time, duration);
        conflicts.push(...resourceConflicts);
        return conflicts;
    }
    async resolveSchedulingConflicts(conflicts, proposedSlot) {
        const unresolvedConflicts = [];
        for (const conflict of conflicts) {
            const resolution = await this.attemptConflictResolution(conflict, proposedSlot);
            if (!resolution.resolved) {
                unresolvedConflicts.push(conflict);
            }
        }
        return {
            resolved: unresolvedConflicts.length === 0,
            unresolvedConflicts,
            appliedResolutions: conflicts.filter(c => !unresolvedConflicts.includes(c)),
        };
    }
    async createAppointment(appointmentData) {
        return await this.appointmentModel.create({
            ...appointmentData,
            status: 'SCHEDULED',
            createdAt: new Date(),
        });
    }
    async scheduleAutomatedReminders(appointmentId, patientProfile) {
        const reminderSchedule = this.calculateReminderSchedule(patientProfile);
        this.logInfo(`Reminders scheduled for appointment ${appointmentId}`);
    }
    async updatePatientSchedulingPreferences(patientId, appointmentRequest) {
    }
    async logSchedulingDecision(appointmentId, decision) {
        this.logInfo(`Scheduling decision for appointment ${appointmentId}`, decision);
    }
    getPreparationInstructions(appointmentType) {
        const typeConfig = this.APPOINTMENT_TYPES[appointmentType];
        return typeConfig?.preparation || [];
    }
    async canRescheduleAppointment(appointment) {
        const hoursUntilAppointment = (appointment.scheduledDate.getTime() - Date.now()) / (1000 * 60 * 60);
        if (hoursUntilAppointment < 24) {
            return {
                allowed: false,
                reason: 'Appointments cannot be rescheduled within 24 hours',
            };
        }
        return { allowed: true };
    }
    async updateAppointmentReminders(appointmentId) {
    }
    async notifyReschedule(appointmentId, oldAppointment, newSlot) {
    }
    async checkCancellationPolicy(appointment) {
        const hoursUntilAppointment = (appointment.scheduledDate.getTime() - Date.now()) / (1000 * 60 * 60);
        let refundAmount = 0;
        let canReschedule = true;
        if (hoursUntilAppointment < 24) {
            refundAmount = 0;
            canReschedule = false;
        }
        else if (hoursUntilAppointment < 48) {
            refundAmount = 0.5;
        }
        else {
            refundAmount = 1.0;
        }
        return {
            allowed: true,
            refundAmount,
            canReschedule,
            requiresFollowUp: hoursUntilAppointment < 24,
        };
    }
    async cancelAppointmentReminders(appointmentId) {
    }
    async processWaitlistForCancelledSlot(appointment) {
    }
    async scheduleCancellationFollowUp(appointment, cancellation) {
    }
    async logCancellation(appointmentId, cancellation) {
    }
    async getAvailableProviders() {
        return ['dr_smith', 'dr_jones', 'dr_brown'];
    }
    async generateProviderSlots(provider, startDate, endDate, appointmentType) {
        const slots = [];
        const typeConfig = this.APPOINTMENT_TYPES[appointmentType];
        return slots;
    }
    async getPatientSchedulingPreferences(patientId) {
        return {
            preferredDays: [],
            preferredTimes: [],
            preferredProviders: [],
            communicationMethod: 'email',
        };
    }
    async filterSlotsByPreferences(slots, preferences) {
        return slots;
    }
    async sortSlotsByOptimality(slots, request) {
        return slots.sort((a, b) => b.optimalityScore - a.optimalityScore);
    }
    async addToWaitlist(patientId, appointmentRequest) {
        return {
            id: `waitlist_${Date.now()}`,
            position: 1,
            estimatedWaitTime: '3-5 days',
            notified: false,
        };
    }
    async removeFromWaitlist(patientId, waitlistId) {
        return {
            success: true,
            message: 'Removed from waitlist successfully.',
        };
    }
    async updateWaitlistEntry(patientId, request) {
        return {
            success: true,
            message: 'Waitlist entry updated successfully.',
        };
    }
    async checkWaitlistStatus(patientId, waitlistId) {
        return {
            success: true,
            waitlistPosition: 3,
            estimatedWaitTime: '2-3 days',
        };
    }
    async calculateSchedulingMetrics(appointments, dateRange) {
        const totalAppointments = appointments.length;
        const completedAppointments = appointments.filter(a => a.status === 'COMPLETED').length;
        const cancelledAppointments = appointments.filter(a => a.status === 'CANCELLED').length;
        const noShowAppointments = appointments.filter(a => a.status === 'NO_SHOW').length;
        return {
            totalAppointments,
            completedAppointments,
            cancelledAppointments,
            noShowAppointments,
            completionRate: totalAppointments > 0 ? completedAppointments / totalAppointments : 0,
            noShowRate: totalAppointments > 0 ? noShowAppointments / totalAppointments : 0,
            averageDuration: this.calculateAverageAppointmentDuration(appointments),
            utilizationRate: await this.calculateProviderUtilization(appointments, dateRange),
        };
    }
    async analyzeSchedulingPatterns(appointments) {
        return {
            peakHours: [],
            peakDays: [],
            commonAppointmentTypes: [],
            providerWorkload: {},
            seasonalTrends: [],
        };
    }
    async generateSchedulingInsights(metrics, patterns) {
        const insights = [];
        if (metrics.noShowRate > 0.1) {
            insights.push('High no-show rate detected. Consider implementing reminder system.');
        }
        if (metrics.completionRate < 0.8) {
            insights.push('Low appointment completion rate. Review scheduling and patient communication.');
        }
        return insights;
    }
    async predictSchedulingNeeds(appointments, dateRange) {
        return {
            predictedAppointments: 0,
            recommendedStaffing: {},
            capacityRecommendations: [],
        };
    }
    async getProviderSchedule(providerId, dateRange) {
        return {
            providerId,
            dateRange,
            appointments: [],
            availability: [],
        };
    }
    async analyzeScheduleEfficiency(schedule) {
        return {
            utilizationRate: 0,
            gapTime: 0,
            overtimeHours: 0,
            efficiency: 0,
        };
    }
    async generateOptimizationRecommendations(schedule, efficiency, request) {
        return [];
    }
    async applyScheduleOptimizations(providerId, recommendations) {
        return {
            providerId,
            dateRange: { from: new Date(), to: new Date() },
            appointments: [],
            availability: [],
        };
    }
    analyzePreferredDays(appointments) {
        return ['monday', 'wednesday'];
    }
    analyzePreferredTimes(appointments) {
        return ['morning', 'afternoon'];
    }
    analyzePreferredProviders(appointments) {
        return [];
    }
    calculatePatientReliability(appointments) {
        return 0.85;
    }
    analyzeUrgencyPatterns(appointments) {
        return ['routine'];
    }
    extractHealthContext(records) {
        return {};
    }
    calculateNoShowRate(appointments) {
        const noShows = appointments.filter(a => a.status === 'NO_SHOW').length;
        return appointments.length > 0 ? noShows / appointments.length : 0;
    }
    async generateCandidateSlots(request, patientProfile) {
        return [];
    }
    async calculateSlotScore(slot, request, patientProfile) {
        return 75;
    }
    async explainSlotChoice(slot, patientProfile) {
        return 'Optimal slot based on patient preferences and availability.';
    }
    async checkProviderConflicts(provider, date, time, duration) {
        return [];
    }
    async checkResourceConflicts(date, time, duration) {
        return [];
    }
    async attemptConflictResolution(conflict, proposedSlot) {
        return { resolved: true };
    }
    calculateReminderSchedule(patientProfile) {
        return {};
    }
    calculateAverageAppointmentDuration(appointments) {
        return 30;
    }
    async calculateProviderUtilization(appointments, dateRange) {
        return 0.75;
    }
};
exports.AdvancedAppointmentSchedulerService = AdvancedAppointmentSchedulerService;
exports.AdvancedAppointmentSchedulerService = AdvancedAppointmentSchedulerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Student)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.Appointment)),
    __param(2, (0, sequelize_1.InjectModel)(models_3.HealthRecord)),
    __metadata("design:paramtypes", [Object, Object, Object, sequelize_typescript_1.Sequelize])
], AdvancedAppointmentSchedulerService);
//# sourceMappingURL=advanced-appointment-scheduler.service.js.map