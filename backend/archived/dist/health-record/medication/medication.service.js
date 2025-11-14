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
exports.MedicationService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../database/models");
const sequelize_2 = require("sequelize");
const base_1 = require("../../common/base");
let MedicationService = class MedicationService extends base_1.BaseService {
    medicationModel;
    constructor(medicationModel) {
        super("MedicationService");
        this.medicationModel = medicationModel;
    }
    async create(createDto) {
        if (createDto.ndc) {
            const existing = await this.medicationModel.findOne({
                where: { ndc: createDto.ndc, isActive: true },
            });
            if (existing) {
                throw new common_1.ConflictException(`Medication with NDC ${createDto.ndc} already exists`);
            }
        }
        return this.medicationModel.create(createDto);
    }
    async findAll(options) {
        const where = {};
        if (options?.isActive !== undefined) {
            where.isActive = options.isActive;
        }
        if (options?.isControlled !== undefined) {
            where.isControlled = options.isControlled;
        }
        if (options?.search) {
            where[sequelize_2.Op.or] = [
                { name: { [sequelize_2.Op.iLike]: `%${options.search}%` } },
                { genericName: { [sequelize_2.Op.iLike]: `%${options.search}%` } },
                { manufacturer: { [sequelize_2.Op.iLike]: `%${options.search}%` } },
            ];
        }
        return this.medicationModel.findAll({
            where,
            order: [['name', 'ASC']],
        });
    }
    async findById(id) {
        const medication = await this.medicationModel.findByPk(id);
        if (!medication) {
            throw new common_1.NotFoundException(`Medication with ID ${id} not found`);
        }
        return medication;
    }
    async update(id, updateDto) {
        const medication = await this.findById(id);
        if (updateDto.ndc && updateDto.ndc !== medication.ndc) {
            const existing = await this.medicationModel.findOne({
                where: { ndc: updateDto.ndc, isActive: true, id: { [sequelize_2.Op.ne]: id } },
            });
            if (existing) {
                throw new common_1.ConflictException(`Medication with NDC ${updateDto.ndc} already exists`);
            }
        }
        await medication.update(updateDto);
        return medication;
    }
    async deactivate(id, deletedBy) {
        const medication = await this.findById(id);
        await medication.update({
            isActive: false,
            deletedAt: new Date(),
            deletedBy,
        });
    }
    async reactivate(id) {
        const medication = await this.findById(id);
        const updateData = {
            isActive: true,
        };
        if (medication.deletedAt) {
            updateData.deletedAt = null;
        }
        if (medication.deletedBy) {
            updateData.deletedBy = null;
        }
        await medication.update(updateData);
        return medication;
    }
    async getControlledSubstances() {
        return this.medicationModel.findAll({
            where: {
                isControlled: true,
                isActive: true,
            },
            order: [
                ['deaSchedule', 'ASC'],
                ['name', 'ASC'],
            ],
        });
    }
    async getWitnessRequiredMedications() {
        return this.medicationModel.findAll({
            where: {
                requiresWitness: true,
                isActive: true,
            },
            order: [['name', 'ASC']],
        });
    }
};
exports.MedicationService = MedicationService;
exports.MedicationService = MedicationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Medication)),
    __metadata("design:paramtypes", [Object])
], MedicationService);
//# sourceMappingURL=medication.service.js.map