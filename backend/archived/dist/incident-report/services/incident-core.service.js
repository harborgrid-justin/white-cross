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
exports.IncidentCoreService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const database_1 = require("../../database");
const incident_notification_service_1 = require("./incident-notification.service");
const incident_validation_service_1 = require("./incident-validation.service");
const incident_severity_enum_1 = require("../enums/incident-severity.enum");
const base_1 = require("../../common/base");
let IncidentCoreService = class IncidentCoreService extends base_1.BaseService {
    incidentReportModel;
    validationService;
    notificationService;
    constructor(incidentReportModel, validationService, notificationService) {
        super('IncidentCoreService');
        this.incidentReportModel = incidentReportModel;
        this.validationService = validationService;
        this.notificationService = notificationService;
    }
    async getIncidentReports(filters) {
        const { page = 1, limit = 20, ...filterParams } = filters;
        const offset = (page - 1) * limit;
        const where = {};
        if (filterParams.studentId) {
            where.studentId = filterParams.studentId;
        }
        if (filterParams.reportedById) {
            where.reportedById = filterParams.reportedById;
        }
        if (filterParams.type) {
            where.type = filterParams.type;
        }
        if (filterParams.severity) {
            where.severity = filterParams.severity;
        }
        if (filterParams.dateFrom && filterParams.dateTo) {
            where.occurredAt = {
                [sequelize_2.Op.between]: [
                    new Date(filterParams.dateFrom),
                    new Date(filterParams.dateTo),
                ],
            };
        }
        else if (filterParams.dateFrom) {
            where.occurredAt = {
                [sequelize_2.Op.gte]: new Date(filterParams.dateFrom),
            };
        }
        else if (filterParams.dateTo) {
            where.occurredAt = {
                [sequelize_2.Op.lte]: new Date(filterParams.dateTo),
            };
        }
        if (filterParams.parentNotified !== undefined) {
            where.parentNotified = filterParams.parentNotified;
        }
        if (filterParams.followUpRequired !== undefined) {
            where.followUpRequired = filterParams.followUpRequired;
        }
        const { rows: reports, count: total } = await this.incidentReportModel.findAndCountAll({
            where,
            offset,
            limit,
            order: [['occurredAt', 'DESC']],
            include: [
                {
                    association: 'student',
                    attributes: [
                        'id',
                        'studentNumber',
                        'firstName',
                        'lastName',
                        'grade',
                    ],
                    required: false,
                },
                {
                    association: 'reporter',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
                    required: false,
                },
            ],
            distinct: true,
        });
        return {
            reports,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getIncidentReportById(id) {
        const report = await this.incidentReportModel.findByPk(id, {
            include: [
                {
                    association: 'student',
                    attributes: [
                        'id',
                        'studentNumber',
                        'firstName',
                        'lastName',
                        'grade',
                        'dateOfBirth',
                    ],
                    required: false,
                },
                {
                    association: 'reporter',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
                    required: false,
                },
            ],
        });
        if (!report) {
            throw new common_1.NotFoundException('Incident report not found');
        }
        return report;
    }
    async createIncidentReport(dto) {
        try {
            await this.validationService.validateIncidentReportData(dto);
            const savedReport = await this.incidentReportModel.create(dto);
            this.logInfo(`Incident report created: ${dto.type} (${dto.severity}) for student ${dto.studentId} by ${dto.reportedById}`);
            if ([incident_severity_enum_1.IncidentSeverity.HIGH, incident_severity_enum_1.IncidentSeverity.CRITICAL].includes(dto.severity)) {
                this.notificationService
                    .notifyEmergencyContacts(savedReport.id)
                    .catch((error) => {
                    this.logError('Failed to send emergency notifications', error);
                });
            }
            return savedReport;
        }
        catch (error) {
            this.logError('Error creating incident report:', error);
            throw error;
        }
    }
    async updateIncidentReport(id, dto) {
        try {
            const existingReport = await this.getIncidentReportById(id);
            Object.assign(existingReport, dto);
            const updatedReport = await existingReport.save();
            this.logInfo(`Incident report updated: ${id}`);
            return updatedReport;
        }
        catch (error) {
            this.logError('Error updating incident report:', error);
            throw error;
        }
    }
    async getIncidentsRequiringFollowUp() {
        try {
            return await this.incidentReportModel.findAll({
                where: { followUpRequired: true },
                order: [['occurredAt', 'DESC']],
            });
        }
        catch (error) {
            this.logError('Error fetching incidents requiring follow-up:', error);
            throw error;
        }
    }
    async getStudentRecentIncidents(studentId, limit = 5) {
        try {
            return await this.incidentReportModel.findAll({
                where: { studentId },
                order: [['occurredAt', 'DESC']],
                limit,
            });
        }
        catch (error) {
            this.logError('Error fetching student recent incidents:', error);
            throw error;
        }
    }
    async addFollowUpNotes(id, notes, completedBy) {
        try {
            const report = await this.getIncidentReportById(id);
            report.followUpNotes = notes;
            report.followUpRequired = false;
            const updatedReport = await report.save();
            this.logInfo(`Follow-up notes added for incident ${id} by ${completedBy}`);
            return updatedReport;
        }
        catch (error) {
            this.logError('Error adding follow-up notes:', error);
            throw error;
        }
    }
    async markParentNotified(id, notificationMethod, notifiedBy) {
        try {
            const report = await this.getIncidentReportById(id);
            report.parentNotified = true;
            report.parentNotificationMethod = notificationMethod || 'manual';
            report.parentNotifiedAt = new Date();
            if (notificationMethod) {
                const methodNote = notificationMethod
                    ? `Parent notified via ${notificationMethod}${notifiedBy ? ` by ${notifiedBy}` : ''}`
                    : 'Parent notified';
                report.followUpNotes = report.followUpNotes
                    ? `${report.followUpNotes}\n${methodNote}`
                    : methodNote;
            }
            const updatedReport = await report.save();
            this.logInfo(`Parent notification marked for incident ${id}`);
            return updatedReport;
        }
        catch (error) {
            this.logError('Error marking parent as notified:', error);
            throw error;
        }
    }
    async addEvidence(id, evidenceType, evidenceUrls) {
        try {
            const report = await this.getIncidentReportById(id);
            this.validationService.validateEvidenceUrls(evidenceUrls);
            if (evidenceType === 'photo') {
                report.evidencePhotos = [
                    ...(report.evidencePhotos || []),
                    ...evidenceUrls,
                ];
            }
            else if (evidenceType === 'video') {
                report.evidenceVideos = [
                    ...(report.evidenceVideos || []),
                    ...evidenceUrls,
                ];
            }
            else if (evidenceType === 'attachment') {
                report.attachments = [...(report.attachments || []), ...evidenceUrls];
            }
            const updatedReport = await report.save();
            this.logInfo(`${evidenceType} evidence added to incident ${id}: ${evidenceUrls.length} files`);
            return updatedReport;
        }
        catch (error) {
            this.logError('Error adding evidence:', error);
            throw error;
        }
    }
    async updateInsuranceClaim(id, claimNumber, status) {
        try {
            const report = await this.getIncidentReportById(id);
            report.insuranceClaimNumber = claimNumber;
            report.insuranceClaimStatus = status;
            const updatedReport = await report.save();
            this.logInfo(`Insurance claim updated for incident ${id}: ${claimNumber}`);
            return updatedReport;
        }
        catch (error) {
            this.logError('Error updating insurance claim:', error);
            throw error;
        }
    }
    async updateComplianceStatus(id, status) {
        try {
            const report = await this.getIncidentReportById(id);
            report.legalComplianceStatus = status;
            const updatedReport = await report.save();
            this.logInfo(`Compliance status updated for incident ${id}: ${status}`);
            return updatedReport;
        }
        catch (error) {
            this.logError('Error updating compliance status:', error);
            throw error;
        }
    }
    async findByIds(ids) {
        try {
            const incidents = await this.incidentReportModel.findAll({
                where: {
                    id: { [sequelize_2.Op.in]: ids },
                },
                include: [
                    {
                        association: 'student',
                        attributes: [
                            'id',
                            'studentNumber',
                            'firstName',
                            'lastName',
                            'grade',
                        ],
                        required: false,
                    },
                    {
                        association: 'reporter',
                        attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
                        required: false,
                    },
                ],
                order: [['occurredAt', 'DESC']],
            });
            const incidentMap = new Map(incidents.map((i) => [i.id, i]));
            return ids.map((id) => incidentMap.get(id) || null);
        }
        catch (error) {
            this.logError(`Failed to batch fetch incident reports: ${error.message}`, error.stack);
            return ids.map(() => null);
        }
    }
    async findByStudentIds(studentIds) {
        try {
            const incidents = await this.incidentReportModel.findAll({
                where: {
                    studentId: { [sequelize_2.Op.in]: studentIds },
                },
                include: [
                    {
                        association: 'student',
                        attributes: [
                            'id',
                            'studentNumber',
                            'firstName',
                            'lastName',
                            'grade',
                        ],
                        required: false,
                    },
                    {
                        association: 'reporter',
                        attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
                        required: false,
                    },
                ],
                order: [['occurredAt', 'DESC']],
            });
            const incidentsByStudent = new Map();
            for (const incident of incidents) {
                if (!incidentsByStudent.has(incident.studentId)) {
                    incidentsByStudent.set(incident.studentId, []);
                }
                incidentsByStudent.get(incident.studentId).push(incident);
            }
            return studentIds.map((studentId) => incidentsByStudent.get(studentId) || []);
        }
        catch (error) {
            this.logError(`Failed to batch fetch incident reports by student IDs: ${error.message}`, error.stack);
            return studentIds.map(() => []);
        }
    }
};
exports.IncidentCoreService = IncidentCoreService;
exports.IncidentCoreService = IncidentCoreService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.IncidentReport)),
    __metadata("design:paramtypes", [Object, incident_validation_service_1.IncidentValidationService,
        incident_notification_service_1.IncidentNotificationService])
], IncidentCoreService);
//# sourceMappingURL=incident-core.service.js.map