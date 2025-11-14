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
exports.PrescriptionService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const prescription_model_1 = require("../../../database/models/prescription.model");
const prescription_status_enum_1 = require("../enums/prescription-status.enum");
const base_1 = require("../../../common/base");
let PrescriptionService = class PrescriptionService extends base_1.BaseService {
    prescriptionModel;
    constructor(prescriptionModel) {
        super("PrescriptionService");
        this.prescriptionModel = prescriptionModel;
    }
    async create(createDto) {
        this.logInfo(`Creating prescription for student ${createDto.studentId}: ${createDto.drugName}`);
        try {
            const prescription = await this.prescriptionModel.create({
                studentId: createDto.studentId,
                visitId: createDto.visitId,
                treatmentPlanId: createDto.treatmentPlanId,
                prescribedBy: createDto.prescribedBy,
                drugName: createDto.drugName,
                drugCode: createDto.drugCode,
                dosage: createDto.dosage,
                frequency: createDto.frequency,
                route: createDto.route,
                quantity: createDto.quantity,
                quantityFilled: createDto.quantityFilled || 0,
                refillsAuthorized: createDto.refillsAuthorized || 0,
                refillsUsed: 0,
                startDate: createDto.startDate,
                endDate: createDto.endDate,
                instructions: createDto.instructions,
                status: createDto.status || prescription_status_enum_1.PrescriptionStatus.PENDING,
                pharmacyName: createDto.pharmacyName,
                notes: createDto.notes,
            });
            this.logInfo(`Prescription created successfully: ${prescription.id}`);
            return prescription;
        }
        catch (error) {
            this.logError(`Failed to create prescription: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
    }
    async findOne(id) {
        const prescription = await this.prescriptionModel.findByPk(id, {
            include: ['visit', 'treatmentPlan'],
        });
        if (!prescription) {
            throw new common_1.NotFoundException(`Prescription ${id} not found`);
        }
        return prescription;
    }
    async findAll(filters) {
        const whereClause = {};
        if (filters.studentId) {
            whereClause.studentId = filters.studentId;
        }
        if (filters.visitId) {
            whereClause.visitId = filters.visitId;
        }
        if (filters.treatmentPlanId) {
            whereClause.treatmentPlanId = filters.treatmentPlanId;
        }
        if (filters.prescribedBy) {
            whereClause.prescribedBy = filters.prescribedBy;
        }
        if (filters.status) {
            whereClause.status = filters.status;
        }
        if (filters.drugName) {
            whereClause.drugName = { [sequelize_2.Op.iLike]: `%${filters.drugName}%` };
        }
        if (filters.activeOnly) {
            whereClause.status = {
                [sequelize_2.Op.in]: [prescription_status_enum_1.PrescriptionStatus.FILLED, prescription_status_enum_1.PrescriptionStatus.PICKED_UP],
            };
        }
        const { rows: prescriptions, count: total } = await this.prescriptionModel.findAndCountAll({
            where: whereClause,
            offset: filters.offset || 0,
            limit: filters.limit || 20,
            order: [['createdAt', 'DESC']],
        });
        return { prescriptions, total };
    }
    async findByStudent(studentId, limit = 10) {
        return this.prescriptionModel.findAll({
            where: { studentId },
            order: [['createdAt', 'DESC']],
            limit,
        });
    }
    async findActiveByStudent(studentId) {
        return this.prescriptionModel.findAll({
            where: {
                studentId,
                status: {
                    [sequelize_2.Op.in]: [prescription_status_enum_1.PrescriptionStatus.FILLED, prescription_status_enum_1.PrescriptionStatus.PICKED_UP],
                },
            },
            order: [['startDate', 'DESC']],
        });
    }
    async update(id, updateDto) {
        const prescription = await this.findOne(id);
        Object.assign(prescription, updateDto);
        await prescription.save();
        return prescription;
    }
    async fill(id, fillDto) {
        const prescription = await this.findOne(id);
        if (prescription.status !== prescription_status_enum_1.PrescriptionStatus.PENDING &&
            prescription.status !== prescription_status_enum_1.PrescriptionStatus.SENT) {
            throw new common_1.BadRequestException(`Cannot fill prescription with status: ${prescription.status}`);
        }
        if (fillDto.refillNumber && fillDto.refillNumber > 0) {
            if (!prescription.hasRefillsRemaining()) {
                throw new common_1.BadRequestException('No refills remaining for this prescription');
            }
            prescription.refillsUsed = fillDto.refillNumber;
        }
        prescription.pharmacyName = fillDto.pharmacyName;
        prescription.quantityFilled += fillDto.quantityFilled;
        prescription.filledDate = fillDto.filledDate;
        prescription.status =
            prescription.quantityFilled >= prescription.quantity
                ? prescription_status_enum_1.PrescriptionStatus.FILLED
                : prescription_status_enum_1.PrescriptionStatus.PARTIALLY_FILLED;
        if (fillDto.notes) {
            prescription.notes = prescription.notes
                ? `${prescription.notes}\n${fillDto.notes}`
                : fillDto.notes;
        }
        this.logInfo(`Filled prescription ${id} at ${fillDto.pharmacyName}`);
        await prescription.save();
        return prescription;
    }
    async markPickedUp(id) {
        const prescription = await this.findOne(id);
        if (prescription.status !== prescription_status_enum_1.PrescriptionStatus.FILLED) {
            throw new common_1.BadRequestException('Can only mark filled prescriptions as picked up');
        }
        prescription.status = prescription_status_enum_1.PrescriptionStatus.PICKED_UP;
        prescription.pickedUpDate = new Date();
        await prescription.save();
        return prescription;
    }
    async cancel(id) {
        const prescription = await this.findOne(id);
        if (prescription.status === prescription_status_enum_1.PrescriptionStatus.FILLED ||
            prescription.status === prescription_status_enum_1.PrescriptionStatus.PICKED_UP) {
            throw new common_1.BadRequestException('Cannot cancel a filled or picked up prescription');
        }
        prescription.status = prescription_status_enum_1.PrescriptionStatus.CANCELLED;
        await prescription.save();
        return prescription;
    }
    async remove(id) {
        const deletedCount = await this.prescriptionModel.destroy({
            where: { id },
        });
        if (deletedCount === 0) {
            throw new common_1.NotFoundException(`Prescription ${id} not found`);
        }
        this.logInfo(`Deleted prescription ${id}`);
    }
    async findNeedingRefills() {
        return this.prescriptionModel.findAll({
            where: {
                status: {
                    [sequelize_2.Op.in]: [prescription_status_enum_1.PrescriptionStatus.FILLED, prescription_status_enum_1.PrescriptionStatus.PICKED_UP],
                },
                [sequelize_2.Op.and]: [
                    { refillsAuthorized: { [sequelize_2.Op.gt]: { [sequelize_2.Op.col]: 'refillsUsed' } } },
                    (0, sequelize_2.literal)('refillsAuthorized - refillsUsed <= 1'),
                ],
            },
            order: [['endDate', 'ASC']],
        });
    }
};
exports.PrescriptionService = PrescriptionService;
exports.PrescriptionService = PrescriptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(prescription_model_1.Prescription)),
    __metadata("design:paramtypes", [Object])
], PrescriptionService);
//# sourceMappingURL=prescription.service.js.map