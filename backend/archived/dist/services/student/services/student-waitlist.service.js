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
exports.StudentWaitlistService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const database_1 = require("../../../database");
const request_context_service_1 = require("../../../common/context/request-context.service");
const base_1 = require("../../../common/base");
let StudentWaitlistService = class StudentWaitlistService extends base_1.BaseService {
    studentModel;
    requestContext;
    constructor(studentModel, requestContext) {
        super(requestContext ||
            {
                requestId: 'system',
                userId: undefined,
                getLogContext: () => ({ requestId: 'system' }),
                getAuditContext: () => ({
                    requestId: 'system',
                    timestamp: new Date(),
                }),
            });
        this.studentModel = studentModel;
        this.requestContext = requestContext;
    }
    async addStudentToWaitlist(addWaitlistDto) {
        try {
            this.validateUUID(addWaitlistDto.studentId, 'Student ID');
            const student = await this.studentModel.findByPk(addWaitlistDto.studentId);
            if (!student) {
                throw new common_1.NotFoundException(`Student with ID ${addWaitlistDto.studentId} not found`);
            }
            const { appointmentType, priority, notes } = addWaitlistDto;
            const waitlistEntryId = `WL-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
            const priorityPositions = {
                urgent: 1,
                high: 3,
                medium: 7,
                low: 15,
            };
            const estimatedPosition = priorityPositions[priority || 'medium'];
            const estimatedWaitMinutes = estimatedPosition * 15;
            const estimatedAvailability = new Date(Date.now() + estimatedWaitMinutes * 60000);
            this.logInfo(`Student added to waitlist: ${addWaitlistDto.studentId} (${student.firstName} ${student.lastName}) ` +
                `for ${appointmentType} with ${priority} priority - Position: ${estimatedPosition}`);
            return {
                success: true,
                message: 'Student added to waitlist successfully',
                waitlistEntry: {
                    id: waitlistEntryId,
                    studentId: addWaitlistDto.studentId,
                    studentName: `${student.firstName} ${student.lastName}`,
                    studentNumber: student.studentNumber,
                    appointmentType,
                    priority,
                    notes,
                    status: 'active',
                    estimatedPosition,
                    estimatedWaitTime: `${estimatedWaitMinutes} minutes`,
                    estimatedAvailability: estimatedAvailability.toISOString(),
                    createdAt: new Date().toISOString(),
                },
                notification: {
                    message: `Student will be notified when appointment slot becomes available`,
                    method: 'email,sms',
                },
                note: 'Waitlist module integration pending - This is a simulated response',
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleError('Failed to add student to waitlist', error);
        }
    }
    async getStudentWaitlistStatus(studentId, query) {
        try {
            this.validateUUID(studentId, 'Student ID');
            const student = await this.studentModel.findByPk(studentId);
            if (!student) {
                throw new common_1.NotFoundException(`Student with ID ${studentId} not found`);
            }
            const simulatedWaitlists = [];
            if (query.appointmentType) {
                const position = Math.floor(Math.random() * 10) + 1;
                const waitMinutes = position * 15;
                const estimatedTime = new Date(Date.now() + waitMinutes * 60000);
                simulatedWaitlists.push({
                    id: `WL-${Date.now()}-SIM1`,
                    studentId,
                    appointmentType: query.appointmentType,
                    priority: 'medium',
                    status: 'active',
                    currentPosition: position,
                    totalInQueue: position + Math.floor(Math.random() * 5),
                    estimatedWaitTime: `${waitMinutes} minutes`,
                    estimatedAvailability: estimatedTime.toISOString(),
                    createdAt: new Date(Date.now() - 3600000).toISOString(),
                });
            }
            else {
                const appointmentTypes = ['vision_screening', 'dental_checkup', 'immunization'];
                for (let i = 0; i < Math.min(2, appointmentTypes.length); i++) {
                    const position = Math.floor(Math.random() * 10) + 1;
                    const waitMinutes = position * 15;
                    const estimatedTime = new Date(Date.now() + waitMinutes * 60000);
                    simulatedWaitlists.push({
                        id: `WL-${Date.now()}-SIM${i + 1}`,
                        studentId,
                        appointmentType: appointmentTypes[i],
                        priority: i === 0 ? 'high' : 'medium',
                        status: 'active',
                        currentPosition: position,
                        totalInQueue: position + Math.floor(Math.random() * 5),
                        estimatedWaitTime: `${waitMinutes} minutes`,
                        estimatedAvailability: estimatedTime.toISOString(),
                        createdAt: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
                    });
                }
            }
            const summary = {
                totalActiveWaitlists: simulatedWaitlists.length,
                highPriorityCount: simulatedWaitlists.filter((w) => w.priority === 'high').length,
                averagePosition: simulatedWaitlists.length > 0
                    ? Math.round(simulatedWaitlists.reduce((sum, w) => sum + w.currentPosition, 0) /
                        simulatedWaitlists.length)
                    : 0,
                nextAppointmentType: simulatedWaitlists.length > 0 ? simulatedWaitlists[0].appointmentType : null,
                nextEstimatedTime: simulatedWaitlists.length > 0 ? simulatedWaitlists[0].estimatedAvailability : null,
            };
            this.logInfo(`Waitlist status retrieved for student: ${studentId} (${student.firstName} ${student.lastName}) - ` +
                `${simulatedWaitlists.length} active waitlist(s)${query.appointmentType ? ` for ${query.appointmentType}` : ''}`);
            return {
                success: true,
                studentId,
                studentName: `${student.firstName} ${student.lastName}`,
                studentNumber: student.studentNumber,
                filters: query,
                summary,
                waitlists: simulatedWaitlists,
                notifications: {
                    enabled: true,
                    methods: ['email', 'sms'],
                    message: 'Student will receive notifications when appointment slots become available',
                },
                note: 'Waitlist module integration pending - This is a simulated response with realistic data',
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleError('Failed to retrieve waitlist status', error);
        }
    }
    async updateWaitlistPriority(studentId, priorityDto) {
        try {
            this.validateUUID(studentId, 'Student ID');
            const student = await this.studentModel.findByPk(studentId);
            if (!student) {
                throw new common_1.NotFoundException(`Student with ID ${studentId} not found`);
            }
            const { priority, reason, notes } = priorityDto;
            const simulatedWaitlistEntry = {
                id: `WL-${Date.now()}-UPD`,
                studentId,
                priority: priority,
                previousPriority: 'medium',
                updatedAt: new Date().toISOString(),
                reason,
                notes,
            };
            const priorityPositions = {
                urgent: 1,
                high: 3,
                medium: 7,
                low: 15,
            };
            const newEstimatedPosition = priorityPositions[priority];
            const newEstimatedWaitMinutes = newEstimatedPosition * 15;
            const newEstimatedAvailability = new Date(Date.now() + newEstimatedWaitMinutes * 60000);
            this.logInfo(`Waitlist priority updated for student: ${studentId} (${student.firstName} ${student.lastName}) ` +
                `from medium to ${priority} - New position: ${newEstimatedPosition}`);
            return {
                success: true,
                message: 'Waitlist priority updated successfully',
                studentId,
                studentName: `${student.firstName} ${student.lastName}`,
                waitlistEntry: simulatedWaitlistEntry,
                positionChange: {
                    previousPosition: 7,
                    newPosition: newEstimatedPosition,
                    estimatedWaitTime: `${newEstimatedWaitMinutes} minutes`,
                    estimatedAvailability: newEstimatedAvailability.toISOString(),
                },
                notification: {
                    message: `Priority updated to ${priority}. Student will be notified of position changes.`,
                    method: 'email,sms',
                },
                note: 'Waitlist module integration pending - This is a simulated response',
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.handleError('Failed to update waitlist priority', error);
        }
    }
};
exports.StudentWaitlistService = StudentWaitlistService;
exports.StudentWaitlistService = StudentWaitlistService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.Student)),
    __param(1, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [Object, request_context_service_1.RequestContextService])
], StudentWaitlistService);
//# sourceMappingURL=student-waitlist.service.js.map