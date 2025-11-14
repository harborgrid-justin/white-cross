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
exports.BroadcastRecipientService = void 0;
const common_1 = require("@nestjs/common");
const student_repository_1 = require("../../../../database/repositories/impl/student.repository");
const emergency_broadcast_repository_1 = require("../../../../database/repositories/impl/emergency-broadcast.repository");
const base_1 = require("../../../../common/base");
let BroadcastRecipientService = class BroadcastRecipientService extends base_1.BaseService {
    studentRepository;
    broadcastRepository;
    constructor(studentRepository, broadcastRepository) {
        super('BroadcastRecipientService');
        this.studentRepository = studentRepository;
        this.broadcastRepository = broadcastRepository;
    }
    async getRecipients(broadcastId) {
        try {
            this.logInfo('Retrieving recipients for broadcast', { broadcastId });
            const broadcast = await this.broadcastRepository.findById(broadcastId);
            if (!broadcast) {
                throw new common_1.NotFoundException(`Broadcast ${broadcastId} not found`);
            }
            const recipients = [];
            const students = await this.getStudentRecipients(broadcast);
            recipients.push(...students);
            this.logInfo(`Found ${recipients.length} recipients for broadcast ${broadcastId}`);
            return recipients;
        }
        catch (error) {
            this.logError('Error retrieving recipients:', error);
            return [];
        }
    }
    async getStudentRecipients(broadcast) {
        const whereClause = {};
        if (broadcast.schoolId) {
            whereClause.schoolId = broadcast.schoolId;
        }
        if (broadcast.gradeLevel) {
            whereClause.gradeLevel = broadcast.gradeLevel;
        }
        if (broadcast.classId) {
            whereClause.classId = broadcast.classId;
        }
        const students = await this.studentRepository.findMany({
            where: whereClause,
            pagination: { page: 1, limit: 10000 },
        });
        return students.data.map((student) => ({
            id: student.id,
            type: 'STUDENT',
            name: `${student.firstName} ${student.lastName}`,
            phone: student.phone,
            email: student.email,
        }));
    }
    getParentRecipients() {
        return Promise.resolve([]);
    }
    getStaffRecipients() {
        return Promise.resolve([]);
    }
    validateRecipientForChannels(recipient, channels) {
        const missingChannels = [];
        for (const channel of channels) {
            switch (channel.toLowerCase()) {
                case 'sms':
                case 'voice':
                    if (!recipient.phone) {
                        missingChannels.push(channel);
                    }
                    break;
                case 'email':
                    if (!recipient.email) {
                        missingChannels.push(channel);
                    }
                    break;
                case 'push':
                    break;
            }
        }
        return {
            isValid: missingChannels.length === 0,
            missingChannels,
        };
    }
    filterValidRecipients(recipients, channels) {
        const valid = [];
        const invalid = [];
        for (const recipient of recipients) {
            const validation = this.validateRecipientForChannels(recipient, channels);
            if (validation.isValid || validation.missingChannels.length < channels.length) {
                valid.push(recipient);
            }
            else {
                invalid.push({
                    recipient,
                    missingChannels: validation.missingChannels,
                });
            }
        }
        if (invalid.length > 0) {
            this.logWarning(`${invalid.length} recipients excluded due to missing contact information`);
        }
        return { valid, invalid };
    }
    getRecipientStats(recipients) {
        const stats = {
            total: recipients.length,
            byType: {},
            withPhone: 0,
            withEmail: 0,
            withBoth: 0,
        };
        for (const recipient of recipients) {
            stats.byType[recipient.type] = (stats.byType[recipient.type] || 0) + 1;
            const hasPhone = !!recipient.phone;
            const hasEmail = !!recipient.email;
            if (hasPhone)
                stats.withPhone++;
            if (hasEmail)
                stats.withEmail++;
            if (hasPhone && hasEmail)
                stats.withBoth++;
        }
        return stats;
    }
};
exports.BroadcastRecipientService = BroadcastRecipientService;
exports.BroadcastRecipientService = BroadcastRecipientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [student_repository_1.StudentRepository,
        emergency_broadcast_repository_1.EmergencyBroadcastRepository])
], BroadcastRecipientService);
//# sourceMappingURL=broadcast-recipient.service.js.map