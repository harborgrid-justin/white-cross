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
exports.IncidentValidationService = void 0;
const common_1 = require("@nestjs/common");
const action_priority_enum_1 = require("../enums/action-priority.enum");
const action_status_enum_1 = require("../enums/action-status.enum");
const incident_type_enum_1 = require("../enums/incident-type.enum");
const base_1 = require("../../common/base");
let IncidentValidationService = class IncidentValidationService extends base_1.BaseService {
    constructor() {
        super('IncidentValidationService');
    }
    async validateIncidentReportData(data) {
        const occurredAt = new Date(data.occurredAt);
        if (occurredAt > new Date()) {
            throw new common_1.BadRequestException('Incident time cannot be in the future');
        }
        if (data.description.length < 20) {
            throw new common_1.BadRequestException('Description must be at least 20 characters for proper documentation');
        }
        if (!data.location || data.location.trim().length < 3) {
            throw new common_1.BadRequestException('Location is required for safety documentation (minimum 3 characters)');
        }
        if (!data.actionsTaken || data.actionsTaken.trim().length < 10) {
            throw new common_1.BadRequestException('Actions taken must be documented for all incidents (minimum 10 characters)');
        }
        if (data.type === incident_type_enum_1.IncidentType.INJURY && !data.followUpRequired) {
            data.followUpRequired = true;
            this.logInfo('Auto-setting followUpRequired=true for INJURY incident');
        }
        if (data.type === incident_type_enum_1.IncidentType.MEDICATION_ERROR &&
            data.description.length < 50) {
            throw new common_1.BadRequestException('Medication error incidents require detailed description (minimum 50 characters)');
        }
        this.logInfo('Incident report validation passed');
    }
    validateWitnessStatementData(data) {
        if (!data.statement || data.statement.trim().length < 20) {
            throw new common_1.BadRequestException('Witness statement must be at least 20 characters for proper documentation');
        }
        if (!data.witnessName || data.witnessName.trim().length < 2) {
            throw new common_1.BadRequestException('Witness name must be at least 2 characters');
        }
        this.logInfo('Witness statement validation passed');
    }
    validateFollowUpActionData(data) {
        if (!data.action || data.action.trim().length < 5) {
            throw new common_1.BadRequestException('Follow-up action must be at least 5 characters');
        }
        const dueDate = new Date(data.dueDate);
        if (dueDate <= new Date()) {
            throw new common_1.BadRequestException('Due date must be in the future');
        }
        if (!data.priority) {
            throw new common_1.BadRequestException('Priority is required for follow-up actions');
        }
        if (data.priority === action_priority_enum_1.ActionPriority.URGENT) {
            const now = new Date();
            const hoursDiff = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
            if (hoursDiff > 24) {
                this.logWarning(`URGENT priority action with due date more than 24 hours away`);
            }
        }
        this.logInfo('Follow-up action validation passed');
    }
    validateFollowUpActionStatusUpdate(status, completedBy, notes) {
        if (status === action_status_enum_1.ActionStatus.COMPLETED) {
            if (!completedBy) {
                throw new common_1.BadRequestException('Completed actions must have a completedBy user');
            }
            if (!notes || notes.trim().length === 0) {
                this.logWarning('Follow-up action completed without notes');
            }
        }
        this.logInfo('Follow-up action status update validation passed');
    }
    validateEvidenceUrls(urls) {
        if (!urls || urls.length === 0) {
            throw new common_1.BadRequestException('Evidence URLs are required');
        }
        const invalidUrls = urls.filter((url) => !this.isValidUrl(url));
        if (invalidUrls.length > 0) {
            throw new common_1.BadRequestException(`Invalid URLs detected: ${invalidUrls.join(', ')}`);
        }
        this.logInfo('Evidence URL validation passed');
    }
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        }
        catch {
            return Boolean(url && url.length > 0 && !url.includes('..') && !url.startsWith('/'));
        }
    }
};
exports.IncidentValidationService = IncidentValidationService;
exports.IncidentValidationService = IncidentValidationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], IncidentValidationService);
//# sourceMappingURL=incident-validation.service.js.map