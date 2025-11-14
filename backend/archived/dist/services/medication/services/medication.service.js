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
exports.MedicationService = exports.MedicationDeactivatedEvent = exports.MedicationUpdatedEvent = exports.MedicationCreatedEvent = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const request_context_service_1 = require("../../../common/context/request-context.service");
const base_1 = require("../../../common/base");
const medication_repository_1 = require("../medication.repository");
class MedicationCreatedEvent {
    medication;
    timestamp;
    constructor(medication, timestamp = new Date()) {
        this.medication = medication;
        this.timestamp = timestamp;
    }
}
exports.MedicationCreatedEvent = MedicationCreatedEvent;
class MedicationUpdatedEvent {
    medication;
    timestamp;
    constructor(medication, timestamp = new Date()) {
        this.medication = medication;
        this.timestamp = timestamp;
    }
}
exports.MedicationUpdatedEvent = MedicationUpdatedEvent;
class MedicationDeactivatedEvent {
    medication;
    timestamp;
    constructor(medication, timestamp = new Date()) {
        this.medication = medication;
        this.timestamp = timestamp;
    }
}
exports.MedicationDeactivatedEvent = MedicationDeactivatedEvent;
let MedicationService = class MedicationService extends base_1.BaseService {
    requestContext;
    medicationRepository;
    eventEmitter;
    constructor(requestContext, medicationRepository, eventEmitter) {
        super(requestContext);
        this.requestContext = requestContext;
        this.medicationRepository = medicationRepository;
        this.eventEmitter = eventEmitter;
    }
    async getMedications(query) {
        this.logger.log(`Getting medications: page=${query.page}, limit=${query.limit}, search=${query.search}`);
        const { medications, total } = await this.medicationRepository.findAll(query);
        const pages = Math.ceil(total / (query.limit || 20));
        return {
            medications,
            pagination: {
                page: query.page || 1,
                limit: query.limit || 20,
                total,
                pages,
            },
        };
    }
    async createMedication(createDto) {
        this.logger.log(`Creating medication: ${createDto.medicationName} for student ${createDto.studentId}`);
        if (!createDto.medicationName) {
            throw new common_1.BadRequestException('Medication name is required');
        }
        if (!createDto.dosage) {
            throw new common_1.BadRequestException('Dosage is required');
        }
        if (!createDto.frequency) {
            throw new common_1.BadRequestException('Frequency is required');
        }
        if (!createDto.route) {
            throw new common_1.BadRequestException('Route is required');
        }
        if (!createDto.prescribedBy) {
            throw new common_1.BadRequestException('Prescribed by is required');
        }
        if (!createDto.startDate) {
            throw new common_1.BadRequestException('Start date is required');
        }
        if (!createDto.studentId) {
            throw new common_1.BadRequestException('Student ID is required');
        }
        const medication = await this.medicationRepository.create(createDto);
        this.logger.log(`Created medication: ${medication.id}`);
        if (this.eventEmitter) {
            this.eventEmitter.emit('medication.created', new MedicationCreatedEvent(medication));
        }
        return medication;
    }
    async getMedicationById(id) {
        this.logger.log(`Getting medication by ID: ${id}`);
        const medication = await this.medicationRepository.findById(id);
        if (!medication) {
            this.logger.warn(`Medication not found: ${id}`);
            throw new common_1.NotFoundException(`Medication with ID ${id} not found`);
        }
        return medication;
    }
    async getMedicationsByStudent(studentId, page = 1, limit = 20) {
        this.logger.log(`Getting medications for student: ${studentId} (page=${page}, limit=${limit})`);
        const { medications, total } = await this.medicationRepository.findByStudent(studentId, page, limit);
        const pages = Math.ceil(total / limit);
        return {
            medications,
            pagination: {
                page,
                limit,
                total,
                pages,
            },
        };
    }
    async updateMedication(id, updateDto) {
        this.logger.log(`Updating medication: ${id}`);
        const exists = await this.medicationRepository.exists(id);
        if (!exists) {
            throw new common_1.NotFoundException(`Medication with ID ${id} not found`);
        }
        const hasFields = Object.keys(updateDto).length > 0;
        if (!hasFields) {
            throw new common_1.BadRequestException('At least one field must be provided for update');
        }
        const medication = await this.medicationRepository.update(id, updateDto);
        this.logger.log(`Updated medication: ${id}`);
        if (this.eventEmitter) {
            this.eventEmitter.emit('medication.updated', new MedicationUpdatedEvent(medication));
        }
        return medication;
    }
    async deactivateMedication(id, deactivateDto) {
        this.logger.log(`Deactivating medication: ${id} - Reason: ${deactivateDto.reason} (${deactivateDto.deactivationType})`);
        const exists = await this.medicationRepository.exists(id);
        if (!exists) {
            throw new common_1.NotFoundException(`Medication with ID ${id} not found`);
        }
        const medication = await this.medicationRepository.deactivate(id, deactivateDto.reason, deactivateDto.deactivationType);
        this.logger.log(`Deactivated medication: ${id}`);
        if (this.eventEmitter) {
            this.eventEmitter.emit('medication.deactivated', new MedicationDeactivatedEvent(medication));
        }
        return medication;
    }
    async activateMedication(id) {
        this.logger.log(`Activating medication: ${id}`);
        const exists = await this.medicationRepository.exists(id);
        if (!exists) {
            throw new common_1.NotFoundException(`Medication with ID ${id} not found`);
        }
        const medication = await this.medicationRepository.activate(id);
        this.logger.log(`Activated medication: ${id}`);
        return medication;
    }
    async getMedicationStats() {
        this.logger.log('Getting medication statistics');
        const { medications, total } = await this.medicationRepository.findAll({
            page: 1,
            limit: 999999,
        });
        const activeMedications = medications.filter((med) => med.isActive === true).length;
        const inactiveMedications = medications.filter((med) => med.isActive === false).length;
        const routeCounts = medications.reduce((acc, med) => {
            acc[med.route] = (acc[med.route] || 0) + 1;
            return acc;
        }, {});
        const withEndDate = medications.filter((med) => med.endDate).length;
        const withoutEndDate = total - withEndDate;
        const stats = {
            total,
            active: activeMedications,
            inactive: inactiveMedications,
            byRoute: routeCounts,
            withEndDate,
            withoutEndDate,
        };
        this.logger.log(`Medication statistics: ${JSON.stringify(stats)}`);
        return stats;
    }
    async findByIds(ids) {
        this.logger.log(`Batch fetching ${ids.length} medications by IDs`);
        return this.medicationRepository.findByIds(ids);
    }
    async findByStudentIds(studentIds) {
        this.logger.log(`Batch fetching medications for ${studentIds.length} students`);
        return this.medicationRepository.findByStudentIds(studentIds);
    }
};
exports.MedicationService = MedicationService;
exports.MedicationService = MedicationService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService,
        medication_repository_1.MedicationRepository,
        event_emitter_1.EventEmitter2])
], MedicationService);
//# sourceMappingURL=medication.service.js.map