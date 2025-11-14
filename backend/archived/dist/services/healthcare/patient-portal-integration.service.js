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
exports.PatientPortalIntegrationService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const models_3 = require("../../database/models");
const models_4 = require("../../database/models");
const models_5 = require("../../database/models");
const base_1 = require("../../common/base");
let PatientPortalIntegrationService = class PatientPortalIntegrationService extends base_1.BaseService {
    studentModel;
    healthRecordModel;
    medicationModel;
    appointmentModel;
    messageModel;
    sequelize;
    constructor(studentModel, healthRecordModel, medicationModel, appointmentModel, messageModel, sequelize) {
        super("PatientPortalIntegrationService");
        this.studentModel = studentModel;
        this.healthRecordModel = healthRecordModel;
        this.medicationModel = medicationModel;
        this.appointmentModel = appointmentModel;
        this.messageModel = messageModel;
        this.sequelize = sequelize;
    }
    async authenticatePatient(credentials) {
        const patient = await this.studentModel.findOne({
            where: {
                email: credentials.email,
                portalEnabled: true,
            },
        });
        if (!patient) {
            return {
                success: false,
                error: 'Patient not found or portal access not enabled',
            };
        }
        const isValidPassword = await this.verifyPatientPassword(patient, credentials.password);
        if (!isValidPassword) {
            await this.logFailedLoginAttempt(patient.id);
            return {
                success: false,
                error: 'Invalid credentials',
            };
        }
        if (patient.portalLocked) {
            return {
                success: false,
                error: 'Account is temporarily locked. Please contact support.',
            };
        }
        const sessionToken = await this.generatePatientSessionToken(patient);
        await this.logPatientLogin(patient.id, 'portal');
        return {
            success: true,
            patientId: patient.id,
            sessionToken,
            patientProfile: {
                id: patient.id,
                firstName: patient.firstName,
                lastName: patient.lastName,
                email: patient.email,
                dateOfBirth: patient.dateOfBirth,
                portalEnabled: patient.portalEnabled,
                lastLogin: patient.lastPortalLogin,
            },
        };
    }
    async getPatientDashboard(patientId) {
        await this.verifyPatientPortalAccess(patientId);
        const [profile, recentRecords, currentMedications, upcomingAppointments, unreadMessages, alerts,] = await Promise.all([
            this.getPatientProfile(patientId),
            this.getRecentHealthRecords(patientId),
            this.getCurrentMedications(patientId),
            this.getUpcomingAppointments(patientId),
            this.getUnreadMessages(patientId),
            this.getPatientAlerts(patientId),
        ]);
        return {
            profile,
            recentHealthRecords: recentRecords,
            currentMedications,
            upcomingAppointments,
            unreadMessagesCount: unreadMessages.length,
            alerts,
            lastUpdated: new Date(),
        };
    }
    async getPatientHealthRecords(patientId, filters) {
        await this.verifyPatientPortalAccess(patientId);
        const whereClause = { studentId: patientId };
        if (filters?.recordType) {
            whereClause.recordType = filters.recordType;
        }
        if (filters?.dateFrom) {
            whereClause.createdAt = {
                ...whereClause.createdAt,
                [this.sequelize.Op.gte]: filters.dateFrom,
            };
        }
        if (filters?.dateTo) {
            whereClause.createdAt = {
                ...whereClause.createdAt,
                [this.sequelize.Op.lte]: filters.dateTo,
            };
        }
        const records = await this.healthRecordModel.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            limit: filters?.limit || 50,
            offset: filters?.offset || 0,
        });
        const accessibleRecords = await this.filterRecordsByConsent(records, patientId);
        return {
            records: accessibleRecords.map(record => ({
                id: record.id,
                recordType: record.recordType,
                title: record.title,
                description: record.description,
                details: record.details,
                createdAt: record.createdAt,
                provider: record.provider,
                attachments: record.attachments || [],
            })),
            totalCount: accessibleRecords.length,
            hasMore: accessibleRecords.length === (filters?.limit || 50),
        };
    }
    async requestMedicationRefill(patientId, refillRequest) {
        await this.verifyPatientPortalAccess(patientId);
        const medication = await this.medicationModel.findOne({
            where: {
                id: refillRequest.medicationId,
                studentId: patientId,
                isActive: true,
            },
        });
        if (!medication) {
            throw new Error('Medication not found or not accessible');
        }
        const eligibility = await this.checkRefillEligibility(medication);
        if (!eligibility.eligible) {
            return {
                success: false,
                error: eligibility.reason,
                nextEligibleDate: eligibility.nextEligibleDate,
            };
        }
        const request = await this.createRefillRequest({
            patientId,
            medicationId: refillRequest.medicationId,
            quantity: refillRequest.quantity,
            pharmacyNotes: refillRequest.pharmacyNotes,
            urgency: refillRequest.urgency,
        });
        await this.notifyProviderOfRefillRequest(request);
        return {
            success: true,
            requestId: request.id,
            estimatedProcessingTime: this.getEstimatedProcessingTime(refillRequest.urgency),
            message: 'Refill request submitted successfully. You will be notified when it\'s processed.',
        };
    }
    async scheduleAppointment(patientId, appointmentRequest) {
        await this.verifyPatientPortalAccess(patientId);
        const availability = await this.checkAppointmentAvailability(appointmentRequest);
        if (!availability.available) {
            return {
                success: false,
                error: availability.reason,
                alternativeSlots: availability.alternativeSlots,
            };
        }
        const appointment = await this.appointmentModel.create({
            studentId: patientId,
            appointmentType: appointmentRequest.appointmentType,
            scheduledDate: appointmentRequest.preferredDate,
            scheduledTime: appointmentRequest.preferredTime,
            reason: appointmentRequest.reason,
            requestedBy: 'patient_portal',
            status: 'PENDING',
            notes: appointmentRequest.notes,
        });
        await this.notifySchedulingTeam(appointment);
        return {
            success: true,
            appointmentId: appointment.id,
            scheduledDate: appointment.scheduledDate,
            scheduledTime: appointment.scheduledTime,
            confirmationMessage: 'Appointment request submitted. You will receive confirmation within 24 hours.',
        };
    }
    async sendSecureMessage(patientId, message) {
        await this.verifyPatientPortalAccess(patientId);
        const validation = await this.validateMessageContent(message.content);
        if (!validation.valid) {
            return {
                success: false,
                error: validation.error,
            };
        }
        const newMessage = await this.messageModel.create({
            senderId: patientId,
            senderType: 'patient',
            recipientId: message.providerId,
            recipientType: 'provider',
            subject: message.subject,
            content: message.content,
            messageType: 'SECURE_PATIENT_MESSAGE',
            priority: message.priority || 'NORMAL',
            status: 'SENT',
            sentAt: new Date(),
        });
        await this.notifyMessageRecipient(newMessage);
        return {
            success: true,
            messageId: newMessage.id,
            sentAt: newMessage.sentAt,
            message: 'Message sent successfully. You will receive a response within 24-48 hours.',
        };
    }
    async getPatientMessages(patientId, filters) {
        await this.verifyPatientPortalAccess(patientId);
        const whereClause = {
            [this.sequelize.Op.or]: [
                { senderId: patientId, senderType: 'patient' },
                { recipientId: patientId, recipientType: 'patient' },
            ],
        };
        if (filters?.status) {
            whereClause.status = filters.status;
        }
        if (filters?.dateFrom) {
            whereClause.sentAt = {
                ...whereClause.sentAt,
                [this.sequelize.Op.gte]: filters.dateFrom,
            };
        }
        const messages = await this.messageModel.findAll({
            where: whereClause,
            order: [['sentAt', 'DESC']],
            limit: filters?.limit || 20,
            offset: filters?.offset || 0,
        });
        return {
            messages: messages.map(msg => ({
                id: msg.id,
                subject: msg.subject,
                content: msg.content,
                senderType: msg.senderType,
                recipientType: msg.recipientType,
                priority: msg.priority,
                status: msg.status,
                sentAt: msg.sentAt,
                readAt: msg.readAt,
            })),
            totalCount: messages.length,
            unreadCount: messages.filter(m => !m.readAt).length,
        };
    }
    async exportPatientData(patientId, exportRequest) {
        await this.verifyPatientPortalAccess(patientId);
        const hasConsent = await this.checkDataExportConsent(patientId);
        if (!hasConsent) {
            return {
                success: false,
                error: 'Data export consent required. Please update your privacy settings.',
            };
        }
        const exportData = await this.generatePatientDataExport(patientId, exportRequest);
        await this.logDataExport(patientId, exportRequest);
        return {
            success: true,
            exportId: exportData.id,
            downloadUrl: exportData.downloadUrl,
            expiresAt: exportData.expiresAt,
            format: exportRequest.format,
            message: 'Data export is being prepared. You will receive a download link via email.',
        };
    }
    async updatePortalPreferences(patientId, preferences) {
        await this.verifyPatientPortalAccess(patientId);
        const validation = await this.validatePortalPreferences(preferences);
        if (!validation.valid) {
            return {
                success: false,
                error: validation.error,
            };
        }
        await this.studentModel.update({
            portalPreferences: preferences,
            portalPreferencesUpdatedAt: new Date(),
        }, {
            where: { id: patientId },
        });
        return {
            success: true,
            message: 'Portal preferences updated successfully.',
            updatedPreferences: preferences,
        };
    }
    async getPatientEducationResources(patientId, category) {
        await this.verifyPatientPortalAccess(patientId);
        const conditions = await this.getPatientConditions(patientId);
        const resources = await this.getRelevantEducationResources(conditions, category);
        await this.trackResourceAccess(patientId, resources);
        return {
            resources,
            totalCount: resources.length,
            categories: this.getResourceCategories(),
            personalizedFor: conditions.map(c => c.details?.condition).filter(Boolean),
        };
    }
    async getEmergencyContacts(patientId) {
        await this.verifyPatientPortalAccess(patientId);
        const student = await this.studentModel.findByPk(patientId);
        if (!student) {
            throw new Error('Patient not found');
        }
        const contacts = student.emergencyContacts || [];
        return {
            contacts: contacts.map(contact => ({
                id: contact.id,
                name: contact.name,
                relationship: contact.relationship,
                phoneNumbers: contact.phoneNumbers,
                email: contact.email,
                address: contact.address,
                isPrimary: contact.isPrimary,
            })),
            lastUpdated: student.emergencyContactsUpdatedAt,
            accessLogged: true,
        };
    }
    async updateEmergencyContacts(patientId, contacts) {
        await this.verifyPatientPortalAccess(patientId);
        const validation = await this.validateEmergencyContacts(contacts);
        if (!validation.valid) {
            return {
                success: false,
                error: validation.error,
            };
        }
        await this.studentModel.update({
            emergencyContacts: contacts,
            emergencyContactsUpdatedAt: new Date(),
        }, {
            where: { id: patientId },
        });
        await this.logEmergencyContactAccess(patientId, 'UPDATE');
        return {
            success: true,
            message: 'Emergency contacts updated successfully.',
            updatedContacts: contacts.length,
        };
    }
    async getTelehealthSession(patientId, sessionId) {
        await this.verifyPatientPortalAccess(patientId);
        const appointment = await this.appointmentModel.findOne({
            where: {
                id: sessionId,
                studentId: patientId,
                appointmentType: 'TELEHEALTH',
            },
        });
        if (!appointment) {
            throw new Error('Telehealth session not found');
        }
        const sessionDetails = await this.generateTelehealthSessionDetails(appointment);
        return {
            sessionId: appointment.id,
            scheduledDate: appointment.scheduledDate,
            scheduledTime: appointment.scheduledTime,
            provider: appointment.provider,
            sessionUrl: sessionDetails.url,
            accessCode: sessionDetails.accessCode,
            instructions: sessionDetails.instructions,
            status: appointment.status,
        };
    }
    async verifyPatientPortalAccess(patientId) {
        const patient = await this.studentModel.findByPk(patientId);
        if (!patient) {
            throw new Error('Patient not found');
        }
        if (!patient.portalEnabled) {
            throw new Error('Patient portal access not enabled');
        }
        if (patient.portalLocked) {
            throw new Error('Patient portal access is locked');
        }
    }
    async verifyPatientPassword(patient, password) {
        return patient.passwordHash === this.hashPassword(password);
    }
    hashPassword(password) {
        return password;
    }
    async generatePatientSessionToken(patient) {
        const token = `patient_session_${patient.id}_${Date.now()}_${Math.random()}`;
        return token;
    }
    async logPatientLogin(patientId, source) {
        this.logInfo(`Patient ${patientId} logged in via ${source}`);
    }
    async logFailedLoginAttempt(patientId) {
        this.logWarning(`Failed login attempt for patient ${patientId}`);
    }
    async getPatientProfile(patientId) {
        const patient = await this.studentModel.findByPk(patientId);
        if (!patient) {
            throw new Error('Patient not found');
        }
        return {
            id: patient.id,
            firstName: patient.firstName,
            lastName: patient.lastName,
            email: patient.email,
            phone: patient.phone,
            dateOfBirth: patient.dateOfBirth,
            address: patient.address,
            emergencyContacts: patient.emergencyContacts?.length || 0,
            portalEnabled: patient.portalEnabled,
            lastLogin: patient.lastPortalLogin,
            preferences: patient.portalPreferences,
        };
    }
    async getRecentHealthRecords(patientId) {
        const records = await this.healthRecordModel.findAll({
            where: { studentId: patientId },
            order: [['createdAt', 'DESC']],
            limit: 5,
        });
        return records.map(record => ({
            id: record.id,
            recordType: record.recordType,
            title: record.title,
            date: record.createdAt,
            provider: record.provider,
        }));
    }
    async getCurrentMedications(patientId) {
        const medications = await this.medicationModel.findAll({
            where: {
                studentId: patientId,
                isActive: true,
            },
            order: [['createdAt', 'DESC']],
        });
        return medications.map(med => ({
            id: med.id,
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            nextRefillDate: med.nextRefillDate,
            daysRemaining: med.daysRemaining,
        }));
    }
    async getUpcomingAppointments(patientId) {
        const appointments = await this.appointmentModel.findAll({
            where: {
                studentId: patientId,
                scheduledDate: {
                    [this.sequelize.Op.gte]: new Date(),
                },
                status: 'CONFIRMED',
            },
            order: [['scheduledDate', 'ASC']],
            limit: 3,
        });
        return appointments.map(appt => ({
            id: appt.id,
            appointmentType: appt.appointmentType,
            scheduledDate: appt.scheduledDate,
            scheduledTime: appt.scheduledTime,
            provider: appt.provider,
            location: appt.location,
        }));
    }
    async getUnreadMessages(patientId) {
        return await this.messageModel.findAll({
            where: {
                recipientId: patientId,
                recipientType: 'patient',
                readAt: null,
            },
        });
    }
    async getPatientAlerts(patientId) {
        const alerts = [];
        const upcomingAppts = await this.getUpcomingAppointments(patientId);
        if (upcomingAppts.length > 0) {
            const nextAppt = upcomingAppts[0];
            const daysUntil = Math.ceil((new Date(nextAppt.scheduledDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            if (daysUntil <= 1) {
                alerts.push({
                    type: 'APPOINTMENT_REMINDER',
                    priority: 'HIGH',
                    title: 'Upcoming Appointment',
                    message: `You have an appointment on ${nextAppt.scheduledDate} at ${nextAppt.scheduledTime}`,
                    actionRequired: false,
                });
            }
        }
        const medications = await this.getCurrentMedications(patientId);
        const needsRefill = medications.filter(med => med.daysRemaining <= 7);
        if (needsRefill.length > 0) {
            alerts.push({
                type: 'MEDICATION_REFILL',
                priority: 'MEDIUM',
                title: 'Medication Refill Needed',
                message: `${needsRefill.length} medication(s) need refill within 7 days`,
                actionRequired: true,
            });
        }
        return alerts;
    }
    async filterRecordsByConsent(records, patientId) {
        return records;
    }
    async checkRefillEligibility(medication) {
        const now = new Date();
        const lastRefill = medication.lastRefillDate || medication.createdAt;
        const daysSinceLastRefill = Math.floor((now.getTime() - lastRefill.getTime()) / (1000 * 60 * 60 * 24));
        const minDaysBetweenRefills = 25;
        if (daysSinceLastRefill < minDaysBetweenRefills) {
            return {
                eligible: false,
                reason: `Too soon for refill. Last refill was ${daysSinceLastRefill} days ago.`,
                nextEligibleDate: new Date(lastRefill.getTime() + (minDaysBetweenRefills * 24 * 60 * 60 * 1000)),
            };
        }
        if (medication.daysRemaining > 7) {
            return {
                eligible: false,
                reason: `Medication still has ${medication.daysRemaining} days remaining.`,
                nextEligibleDate: new Date(now.getTime() + ((medication.daysRemaining - 7) * 24 * 60 * 60 * 1000)),
            };
        }
        return { eligible: true };
    }
    async createRefillRequest(requestData) {
        return {
            id: `refill_${Date.now()}`,
            ...requestData,
            status: 'PENDING',
            requestedAt: new Date(),
        };
    }
    async notifyProviderOfRefillRequest(request) {
        this.logInfo(`Refill request ${request.id} sent to provider`);
    }
    getEstimatedProcessingTime(urgency) {
        switch (urgency) {
            case 'URGENT': return '2-4 hours';
            case 'HIGH': return '4-8 hours';
            default: return '24-48 hours';
        }
    }
    async checkAppointmentAvailability(request) {
        const available = Math.random() > 0.3;
        if (!available) {
            return {
                available: false,
                reason: 'Requested time slot not available',
                alternativeSlots: [
                    {
                        date: request.preferredDate,
                        time: '10:00',
                        provider: 'Dr. Smith',
                    },
                    {
                        date: request.preferredDate,
                        time: '14:00',
                        provider: 'Dr. Johnson',
                    },
                ],
            };
        }
        return { available: true };
    }
    async notifySchedulingTeam(appointment) {
        this.logInfo(`Appointment request ${appointment.id} sent to scheduling team`);
    }
    async validateMessageContent(content) {
        const phiPatterns = [
            /\b\d{3}-\d{2}-\d{4}\b/,
            /\b\d{10}\b/,
            /\b[A-Z]{2}\d{6}\b/,
        ];
        for (const pattern of phiPatterns) {
            if (pattern.test(content)) {
                return {
                    valid: false,
                    error: 'Message contains protected health information. Please use secure channels for PHI.',
                };
            }
        }
        return { valid: true };
    }
    async notifyMessageRecipient(message) {
        this.logInfo(`Message ${message.id} notification sent to recipient`);
    }
    async checkDataExportConsent(patientId) {
        const patient = await this.studentModel.findByPk(patientId);
        return patient?.portalPreferences?.dataExportConsent || false;
    }
    async generatePatientDataExport(patientId, request) {
        return {
            id: `export_${Date.now()}`,
            downloadUrl: `https://portal.example.com/download/${patientId}/export_${Date.now()}`,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        };
    }
    async logDataExport(patientId, request) {
        this.logInfo(`Data export requested for patient ${patientId}`);
    }
    async validatePortalPreferences(preferences) {
        if (preferences.emailNotifications && !preferences.email) {
            return {
                valid: false,
                error: 'Email address required for email notifications',
            };
        }
        return { valid: true };
    }
    async getPatientConditions(patientId) {
        return await this.healthRecordModel.findAll({
            where: {
                studentId: patientId,
                recordType: 'CONDITION',
            },
        });
    }
    async getRelevantEducationResources(conditions, category) {
        const resources = [
            {
                id: 'asthma_101',
                title: 'Asthma Management Basics',
                category: 'RESPIRATORY',
                contentType: 'ARTICLE',
                url: '/education/asthma-basics',
                description: 'Learn the fundamentals of asthma management',
                readTime: 5,
                tags: ['asthma', 'respiratory', 'management'],
            },
            {
                id: 'diabetes_nutrition',
                title: 'Nutrition for Diabetes',
                category: 'ENDOCRINE',
                contentType: 'VIDEO',
                url: '/education/diabetes-nutrition',
                description: 'Dietary guidelines for diabetes management',
                readTime: 10,
                tags: ['diabetes', 'nutrition', 'diet'],
            },
        ];
        if (category) {
            return resources.filter(r => r.category === category);
        }
        return resources;
    }
    getResourceCategories() {
        return [
            'GENERAL',
            'CARDIOVASCULAR',
            'RESPIRATORY',
            'ENDOCRINE',
            'MENTAL_HEALTH',
            'PREVENTION',
            'NUTRITION',
        ];
    }
    async trackResourceAccess(patientId, resources) {
        this.logInfo(`Patient ${patientId} accessed ${resources.length} education resources`);
    }
    async logEmergencyContactAccess(patientId, action) {
        this.logInfo(`Emergency contact ${action} by patient ${patientId}`);
    }
    async validateEmergencyContacts(contacts) {
        if (contacts.length === 0) {
            return {
                valid: false,
                error: 'At least one emergency contact is required',
            };
        }
        const primaryContacts = contacts.filter(c => c.isPrimary);
        if (primaryContacts.length !== 1) {
            return {
                valid: false,
                error: 'Exactly one primary emergency contact is required',
            };
        }
        return { valid: true };
    }
    async generateTelehealthSessionDetails(appointment) {
        return {
            url: `https://telehealth.example.com/session/${appointment.id}`,
            accessCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
            instructions: 'Click the link above at your appointment time. Make sure your camera and microphone are working.',
        };
    }
};
exports.PatientPortalIntegrationService = PatientPortalIntegrationService;
exports.PatientPortalIntegrationService = PatientPortalIntegrationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Student)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.HealthRecord)),
    __param(2, (0, sequelize_1.InjectModel)(models_3.Medication)),
    __param(3, (0, sequelize_1.InjectModel)(models_4.Appointment)),
    __param(4, (0, sequelize_1.InjectModel)(models_5.Message)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, sequelize_typescript_1.Sequelize])
], PatientPortalIntegrationService);
//# sourceMappingURL=patient-portal-integration.service.js.map