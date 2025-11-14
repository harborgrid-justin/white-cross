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
exports.TelemedicineSessionManagerService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const models_3 = require("../../database/models");
const models_4 = require("../../database/models");
const base_1 = require("../../common/base");
let TelemedicineSessionManagerService = class TelemedicineSessionManagerService extends base_1.BaseService {
    studentModel;
    appointmentModel;
    messageModel;
    healthRecordModel;
    sequelize;
    SESSION_STATES = {
        SCHEDULED: 'scheduled',
        WAITING_ROOM: 'waiting_room',
        IN_PROGRESS: 'in_progress',
        COMPLETED: 'completed',
        CANCELLED: 'cancelled',
        NO_SHOW: 'no_show',
        TECHNICAL_ISSUE: 'technical_issue',
    };
    CONSULTATION_TYPES = {
        GENERAL: 'general',
        SPECIALIST: 'specialist',
        FOLLOW_UP: 'follow_up',
        URGENT: 'urgent',
        MENTAL_HEALTH: 'mental_health',
        CHRONIC_CARE: 'chronic_care',
        PEDIATRIC: 'pediatric',
    };
    QUALITY_THRESHOLDS = {
        MIN_BANDWIDTH: 500000,
        MIN_LATENCY: 150,
        MIN_FRAME_RATE: 15,
        MAX_PACKET_LOSS: 0.05,
    };
    constructor(studentModel, appointmentModel, messageModel, healthRecordModel, sequelize) {
        super("TelemedicineSessionManagerService");
        this.studentModel = studentModel;
        this.appointmentModel = appointmentModel;
        this.messageModel = messageModel;
        this.healthRecordModel = healthRecordModel;
        this.sequelize = sequelize;
    }
    async scheduleTelemedicineConsultation(patientId, consultationRequest) {
        const patient = await this.studentModel.findByPk(patientId);
        if (!patient) {
            return {
                success: false,
                error: 'Patient not found',
            };
        }
        if (!patient.telehealthEnabled) {
            return {
                success: false,
                error: 'Patient does not have telehealth access enabled',
            };
        }
        const availability = await this.checkProviderAvailability(consultationRequest.providerId, consultationRequest.scheduledDate, consultationRequest.duration);
        if (!availability.available) {
            return {
                success: false,
                error: availability.reason,
                alternativeSlots: availability.alternativeSlots,
            };
        }
        const appointment = await this.appointmentModel.create({
            studentId: patientId,
            appointmentType: 'TELEHEALTH',
            scheduledDate: consultationRequest.scheduledDate,
            scheduledTime: consultationRequest.scheduledTime,
            duration: consultationRequest.duration,
            reason: consultationRequest.reason,
            provider: consultationRequest.providerId,
            status: 'SCHEDULED',
            notes: consultationRequest.notes,
            telehealthDetails: {
                consultationType: consultationRequest.consultationType,
                urgency: consultationRequest.urgency,
                preferredLanguage: consultationRequest.preferredLanguage,
                accessibilityNeeds: consultationRequest.accessibilityNeeds,
            },
        });
        const sessionDetails = await this.generateSessionDetails(appointment.id);
        await this.sendConsultationConfirmation(appointment, sessionDetails);
        return {
            success: true,
            appointmentId: appointment.id,
            sessionId: sessionDetails.sessionId,
            scheduledDate: appointment.scheduledDate,
            scheduledTime: appointment.scheduledTime,
            sessionUrl: sessionDetails.sessionUrl,
            accessCode: sessionDetails.accessCode,
            instructions: sessionDetails.instructions,
            confirmationMessage: 'Telemedicine consultation scheduled successfully. Check your email for session details.',
        };
    }
    async startTelemedicineSession(sessionId, participantId) {
        const appointment = await this.appointmentModel.findByPk(sessionId);
        if (!appointment) {
            return {
                success: false,
                error: 'Session not found',
            };
        }
        const hasAccess = await this.verifySessionAccess(appointment, participantId);
        if (!hasAccess) {
            return {
                success: false,
                error: 'Access denied to this session',
            };
        }
        const canStart = await this.canStartSession(appointment);
        if (!canStart.canStart) {
            return {
                success: false,
                error: canStart.reason,
            };
        }
        await this.appointmentModel.update({
            status: 'IN_PROGRESS',
            actualStartTime: new Date(),
        }, {
            where: { id: sessionId },
        });
        const monitoringSession = await this.initializeSessionMonitoring(sessionId);
        await this.logSessionEvent(sessionId, 'STARTED', {
            participantId,
            appointmentType: appointment.appointmentType,
        });
        return {
            success: true,
            sessionId,
            status: 'IN_PROGRESS',
            participants: await this.getSessionParticipants(sessionId),
            sessionUrl: await this.getActiveSessionUrl(sessionId),
            monitoringSessionId: monitoringSession.id,
            startedAt: new Date(),
        };
    }
    async joinTelemedicineSession(sessionId, participantId, deviceInfo) {
        const appointment = await this.appointmentModel.findByPk(sessionId);
        if (!appointment || appointment.status !== 'IN_PROGRESS') {
            return {
                success: false,
                error: 'Session not found or not active',
            };
        }
        const hasAccess = await this.verifySessionAccess(appointment, participantId);
        if (!hasAccess) {
            return {
                success: false,
                error: 'Access denied to this session',
            };
        }
        const compatibility = await this.checkDeviceCompatibility(deviceInfo);
        if (!compatibility.compatible) {
            return {
                success: false,
                error: compatibility.error,
                recommendations: compatibility.recommendations,
            };
        }
        const participantToken = await this.generateParticipantToken(sessionId, participantId);
        await this.addParticipantToSession(sessionId, participantId, deviceInfo);
        await this.logSessionEvent(sessionId, 'PARTICIPANT_JOINED', {
            participantId,
            deviceType: deviceInfo.deviceType,
            browser: deviceInfo.browser,
        });
        return {
            success: true,
            sessionId,
            participantToken,
            sessionUrl: await this.getActiveSessionUrl(sessionId),
            sessionDetails: await this.getSessionDetails(sessionId),
            qualityRequirements: this.QUALITY_THRESHOLDS,
            joinedAt: new Date(),
        };
    }
    async monitorSessionQuality(sessionId, qualityMetrics) {
        const appointment = await this.appointmentModel.findByPk(sessionId);
        if (!appointment || appointment.status !== 'IN_PROGRESS') {
            return {
                success: false,
                error: 'Session not found or not active',
            };
        }
        const analysis = await this.analyzeQualityMetrics(qualityMetrics);
        await this.updateSessionQuality(sessionId, analysis);
        const alerts = await this.generateQualityAlerts(sessionId, analysis);
        if (analysis.overallQuality !== 'GOOD') {
            await this.logSessionEvent(sessionId, 'QUALITY_ISSUE', {
                overallQuality: analysis.overallQuality,
                issues: analysis.issues,
            });
        }
        return {
            success: true,
            sessionId,
            overallQuality: analysis.overallQuality,
            metrics: analysis.metrics,
            alerts,
            recommendations: analysis.recommendations,
            timestamp: new Date(),
        };
    }
    async recordSession(sessionId, recordingOptions) {
        const appointment = await this.appointmentModel.findByPk(sessionId);
        if (!appointment) {
            return {
                success: false,
                error: 'Session not found',
            };
        }
        const hasConsent = await this.checkRecordingConsent(appointment.studentId);
        if (!hasConsent) {
            return {
                success: false,
                error: 'Recording consent not obtained',
            };
        }
        const recording = await this.startSessionRecording(sessionId, recordingOptions);
        await this.logSessionEvent(sessionId, 'RECORDING_STARTED', {
            recordingId: recording.id,
            options: recordingOptions,
        });
        return {
            success: true,
            recordingId: recording.id,
            status: 'RECORDING',
            startedAt: recording.startedAt,
            estimatedDuration: appointment.duration,
            message: 'Session recording started',
        };
    }
    async endTelemedicineSession(sessionId, endedBy, sessionSummary) {
        const appointment = await this.appointmentModel.findByPk(sessionId);
        if (!appointment) {
            return {
                success: false,
                error: 'Session not found',
            };
        }
        const actualEndTime = new Date();
        const actualDuration = appointment.actualStartTime ?
            Math.floor((actualEndTime.getTime() - appointment.actualStartTime.getTime()) / (1000 * 60)) : 0;
        await this.appointmentModel.update({
            status: 'COMPLETED',
            actualEndTime,
            actualDuration,
            sessionSummary,
        }, {
            where: { id: sessionId },
        });
        await this.stopSessionRecording(sessionId);
        const sessionReport = await this.generateSessionReport(sessionId, sessionSummary);
        await this.createFollowUpTasks(sessionId, sessionSummary);
        await this.logSessionEvent(sessionId, 'ENDED', {
            endedBy,
            duration: actualDuration,
            summary: sessionSummary,
        });
        return {
            success: true,
            sessionId,
            endedAt: actualEndTime,
            duration: actualDuration,
            sessionReport,
            followUpTasks: sessionReport.followUpTasks,
            message: 'Session ended successfully',
        };
    }
    async getTelemedicineHistory(patientId, filters) {
        const whereClause = {
            studentId: patientId,
            appointmentType: 'TELEHEALTH',
        };
        if (filters?.status) {
            whereClause.status = filters.status;
        }
        if (filters?.dateFrom) {
            whereClause.scheduledDate = {
                ...whereClause.scheduledDate,
                [this.sequelize.Op.gte]: filters.dateFrom,
            };
        }
        if (filters?.dateTo) {
            whereClause.scheduledDate = {
                ...whereClause.scheduledDate,
                [this.sequelize.Op.lte]: filters.dateTo,
            };
        }
        const sessions = await this.appointmentModel.findAll({
            where: whereClause,
            order: [['scheduledDate', 'DESC']],
            limit: filters?.limit || 20,
            offset: filters?.offset || 0,
        });
        const sessionSummaries = await Promise.all(sessions.map(async (session) => {
            const recording = await this.getSessionRecording(session.id);
            const qualityMetrics = await this.getSessionQualityMetrics(session.id);
            return {
                sessionId: session.id,
                scheduledDate: session.scheduledDate,
                scheduledTime: session.scheduledTime,
                status: session.status,
                provider: session.provider,
                duration: session.actualDuration || session.duration,
                consultationType: session.telehealthDetails?.consultationType,
                reason: session.reason,
                recordingAvailable: !!recording,
                qualityScore: qualityMetrics?.overallScore,
                notes: session.sessionSummary?.notes,
            };
        }));
        return {
            patientId,
            sessions: sessionSummaries,
            totalCount: sessionSummaries.length,
            hasMore: sessionSummaries.length === (filters?.limit || 20),
            summary: {
                totalSessions: sessionSummaries.length,
                completedSessions: sessionSummaries.filter(s => s.status === 'COMPLETED').length,
                averageDuration: this.calculateAverageDuration(sessionSummaries),
                averageQualityScore: this.calculateAverageQualityScore(sessionSummaries),
            },
        };
    }
    async generateTelemedicineAnalytics(patientId, dateRange) {
        const sessions = await this.appointmentModel.findAll({
            where: {
                studentId: patientId,
                appointmentType: 'TELEHEALTH',
                scheduledDate: {
                    [this.sequelize.Op.between]: [dateRange.from, dateRange.to],
                },
            },
        });
        const sessionPatterns = await this.analyzeSessionPatterns(sessions);
        const engagementMetrics = await this.calculateEngagementMetrics(sessions);
        const qualityTrends = await this.analyzeQualityTrends(sessions);
        const insights = await this.generateTelemedicineInsights(sessionPatterns, engagementMetrics, qualityTrends);
        return {
            patientId,
            dateRange,
            sessionCount: sessions.length,
            sessionPatterns,
            engagementMetrics,
            qualityTrends,
            insights,
            generatedAt: new Date(),
        };
    }
    async handleTelemedicineEmergency(sessionId, emergencyDetails) {
        const appointment = await this.appointmentModel.findByPk(sessionId);
        if (!appointment) {
            return {
                success: false,
                error: 'Session not found',
            };
        }
        const severity = await this.assessEmergencySeverity(emergencyDetails);
        await this.activateEmergencyProtocols(sessionId, severity, emergencyDetails);
        if (severity.level === 'CRITICAL') {
            await this.notifyEmergencyServices(appointment.studentId, emergencyDetails);
        }
        await this.createEmergencyRecord(sessionId, emergencyDetails, severity);
        await this.logSessionEvent(sessionId, 'EMERGENCY', {
            severity: severity.level,
            type: emergencyDetails.type,
            response: severity.response,
        });
        return {
            success: true,
            sessionId,
            emergencyId: `emergency_${Date.now()}`,
            severity: severity.level,
            response: severity.response,
            actions: severity.actions,
            notifiedParties: severity.notifiedParties,
            timestamp: new Date(),
        };
    }
    async checkProviderAvailability(providerId, date, duration) {
        const conflictingAppointments = await this.appointmentModel.findAll({
            where: {
                provider: providerId,
                scheduledDate: date,
                status: {
                    [this.sequelize.Op.in]: ['SCHEDULED', 'IN_PROGRESS'],
                },
            },
        });
        const requestedStart = new Date(date);
        const requestedEnd = new Date(requestedStart.getTime() + duration * 60 * 1000);
        for (const appointment of conflictingAppointments) {
            const existingStart = new Date(appointment.scheduledDate);
            const existingEnd = new Date(existingStart.getTime() + appointment.duration * 60 * 1000);
            if (requestedStart < existingEnd && requestedEnd > existingStart) {
                return {
                    available: false,
                    reason: 'Provider has conflicting appointment',
                    alternativeSlots: await this.findAlternativeSlots(providerId, date),
                };
            }
        }
        return { available: true };
    }
    async generateSessionDetails(appointmentId) {
        const sessionId = `session_${appointmentId}`;
        const accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        return {
            sessionId,
            sessionUrl: `https://telehealth.whitecross.com/session/${sessionId}`,
            accessCode,
            instructions: 'Click the session link at your appointment time. Make sure your camera and microphone are enabled.',
        };
    }
    async sendConsultationConfirmation(appointment, sessionDetails) {
        this.logInfo(`Confirmation sent for appointment ${appointment.id}`);
    }
    async verifySessionAccess(appointment, participantId) {
        return appointment.studentId === participantId || appointment.provider === participantId;
    }
    async canStartSession(appointment) {
        const now = new Date();
        const scheduledTime = new Date(appointment.scheduledDate);
        const earliestStart = new Date(scheduledTime.getTime() - 15 * 60 * 1000);
        if (now < earliestStart) {
            return {
                canStart: false,
                reason: 'Session cannot start yet. Please wait until closer to your scheduled time.',
            };
        }
        const latestStart = new Date(scheduledTime.getTime() + 60 * 60 * 1000);
        if (now > latestStart) {
            return {
                canStart: false,
                reason: 'Session start time has passed. Please reschedule.',
            };
        }
        return { canStart: true };
    }
    async initializeSessionMonitoring(sessionId) {
        return { id: `monitor_${sessionId}` };
    }
    async logSessionEvent(sessionId, event, details) {
        this.logInfo(`Session ${sessionId}: ${event}`, details);
    }
    async getSessionParticipants(sessionId) {
        return [];
    }
    async getActiveSessionUrl(sessionId) {
        return `https://telehealth.whitecross.com/session/${sessionId}`;
    }
    async checkDeviceCompatibility(deviceInfo) {
        const compatibleBrowsers = ['chrome', 'firefox', 'safari', 'edge'];
        const compatibleDevices = ['desktop', 'mobile', 'tablet'];
        if (!compatibleBrowsers.includes(deviceInfo.browser?.toLowerCase())) {
            return {
                compatible: false,
                error: 'Browser not supported for telehealth sessions',
                recommendations: ['Please use Chrome, Firefox, Safari, or Edge'],
            };
        }
        if (!compatibleDevices.includes(deviceInfo.deviceType?.toLowerCase())) {
            return {
                compatible: false,
                error: 'Device type not supported',
                recommendations: ['Please use a desktop, mobile, or tablet device'],
            };
        }
        return { compatible: true };
    }
    async generateParticipantToken(sessionId, participantId) {
        return `token_${sessionId}_${participantId}_${Date.now()}`;
    }
    async addParticipantToSession(sessionId, participantId, deviceInfo) {
    }
    async getSessionDetails(sessionId) {
        return {
            sessionId,
            sessionUrl: `https://telehealth.whitecross.com/session/${sessionId}`,
            accessCode: 'ABC123',
            instructions: 'Session details',
        };
    }
    async analyzeQualityMetrics(metrics) {
        const issues = [];
        const recommendations = [];
        if (metrics.bandwidth < this.QUALITY_THRESHOLDS.MIN_BANDWIDTH) {
            issues.push('Low bandwidth detected');
            recommendations.push('Close other applications using internet');
        }
        if (metrics.latency > this.QUALITY_THRESHOLDS.MIN_LATENCY) {
            issues.push('High latency detected');
            recommendations.push('Move closer to Wi-Fi router or use wired connection');
        }
        if (metrics.frameRate < this.QUALITY_THRESHOLDS.MIN_FRAME_RATE) {
            issues.push('Low frame rate detected');
            recommendations.push('Check camera settings and lighting');
        }
        if (metrics.packetLoss > this.QUALITY_THRESHOLDS.MAX_PACKET_LOSS) {
            issues.push('High packet loss detected');
            recommendations.push('Check network connection stability');
        }
        let overallQuality = 'EXCELLENT';
        if (issues.length > 2)
            overallQuality = 'POOR';
        else if (issues.length > 1)
            overallQuality = 'FAIR';
        else if (issues.length > 0)
            overallQuality = 'GOOD';
        return {
            overallQuality,
            metrics,
            issues,
            recommendations,
        };
    }
    async updateSessionQuality(sessionId, analysis) {
    }
    async generateQualityAlerts(sessionId, analysis) {
        const alerts = [];
        if (analysis.overallQuality === 'POOR') {
            alerts.push({
                level: 'HIGH',
                type: 'QUALITY_DEGRADED',
                message: 'Session quality is poor. Multiple issues detected.',
                recommendations: analysis.recommendations,
            });
        }
        return alerts;
    }
    async checkRecordingConsent(patientId) {
        const patient = await this.studentModel.findByPk(patientId);
        return patient?.telehealthConsent?.recording || false;
    }
    async startSessionRecording(sessionId, options) {
        return {
            id: `recording_${sessionId}`,
            startedAt: new Date(),
        };
    }
    async stopSessionRecording(sessionId) {
    }
    async generateSessionReport(sessionId, summary) {
        return {
            sessionId,
            summary,
            followUpTasks: [],
            recommendations: [],
        };
    }
    async createFollowUpTasks(sessionId, summary) {
    }
    async getSessionRecording(sessionId) {
        return null;
    }
    async getSessionQualityMetrics(sessionId) {
        return { overallScore: 85 };
    }
    calculateAverageDuration(sessions) {
        const completedSessions = sessions.filter(s => s.status === 'COMPLETED' && s.duration);
        if (completedSessions.length === 0)
            return 0;
        const totalDuration = completedSessions.reduce((sum, s) => sum + s.duration, 0);
        return Math.round(totalDuration / completedSessions.length);
    }
    calculateAverageQualityScore(sessions) {
        const sessionsWithScore = sessions.filter(s => s.qualityScore);
        if (sessionsWithScore.length === 0)
            return 0;
        const totalScore = sessionsWithScore.reduce((sum, s) => sum + s.qualityScore, 0);
        return Math.round(totalScore / sessionsWithScore.length);
    }
    async analyzeSessionPatterns(sessions) {
        return {
            mostCommonDay: 'Monday',
            mostCommonTime: '10:00',
            averageSessionLength: 30,
            consultationTypeDistribution: {},
            providerDistribution: {},
        };
    }
    async calculateEngagementMetrics(sessions) {
        return {
            totalSessions: sessions.length,
            completedSessions: sessions.filter(s => s.status === 'COMPLETED').length,
            noShowRate: sessions.filter(s => s.status === 'NO_SHOW').length / sessions.length,
            averagePreparationTime: 15,
            followUpCompliance: 80,
        };
    }
    async analyzeQualityTrends(sessions) {
        return {
            averageQualityScore: 85,
            qualityTrend: 'STABLE',
            commonIssues: ['latency', 'bandwidth'],
            improvementAreas: ['network_stability'],
        };
    }
    async generateTelemedicineInsights(patterns, engagement, quality) {
        return {
            insights: [],
            recommendations: [],
            predictedNeeds: [],
        };
    }
    async assessEmergencySeverity(emergency) {
        let level = 'MODERATE';
        const actions = [];
        const notifiedParties = [];
        switch (emergency.type) {
            case 'CARDIAC_ARREST':
            case 'SEVERE_ALLERGIC_REACTION':
                level = 'CRITICAL';
                actions.push('Activate emergency response', 'Call 911', 'Prepare defibrillator');
                notifiedParties.push('emergency_services', 'cardiac_team');
                break;
            case 'SEVERE_PAIN':
            case 'DIFFICULTY_BREATHING':
                level = 'HIGH';
                actions.push('Assess ABCs', 'Administer oxygen', 'Prepare emergency medications');
                notifiedParties.push('primary_provider', 'emergency_team');
                break;
            default:
                level = 'MODERATE';
                actions.push('Continue assessment', 'Monitor vital signs');
                notifiedParties.push('primary_provider');
        }
        return {
            level,
            response: `Emergency protocol activated: ${level} severity`,
            actions,
            notifiedParties,
        };
    }
    async activateEmergencyProtocols(sessionId, severity, emergency) {
    }
    async notifyEmergencyServices(patientId, emergency) {
    }
    async createEmergencyRecord(sessionId, emergency, severity) {
    }
    async findAlternativeSlots(providerId, date) {
        return [
            {
                date: new Date(date.getTime() + 24 * 60 * 60 * 1000),
                time: '09:00',
                provider: providerId,
            },
            {
                date: new Date(date.getTime() + 24 * 60 * 60 * 1000),
                time: '14:00',
                provider: providerId,
            },
        ];
    }
};
exports.TelemedicineSessionManagerService = TelemedicineSessionManagerService;
exports.TelemedicineSessionManagerService = TelemedicineSessionManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Student)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.Appointment)),
    __param(2, (0, sequelize_1.InjectModel)(models_3.Message)),
    __param(3, (0, sequelize_1.InjectModel)(models_4.HealthRecord)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, sequelize_typescript_1.Sequelize])
], TelemedicineSessionManagerService);
//# sourceMappingURL=telemedicine-session-manager.service.js.map