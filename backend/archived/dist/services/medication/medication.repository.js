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
var MedicationRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicationRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const models_3 = require("../../database/models");
const query_cache_service_1 = require("../../database/services/query-cache.service");
let MedicationRepository = MedicationRepository_1 = class MedicationRepository {
    studentMedicationModel;
    medicationModel;
    queryCacheService;
    logger = new common_1.Logger(MedicationRepository_1.name);
    constructor(studentMedicationModel, medicationModel, queryCacheService) {
        this.studentMedicationModel = studentMedicationModel;
        this.medicationModel = medicationModel;
        this.queryCacheService = queryCacheService;
    }
    async findAll(query) {
        const where = {};
        if (query.studentId) {
            where.studentId = query.studentId;
        }
        if (query.isActive !== undefined) {
            where.isActive = query.isActive;
        }
        const include = [
            {
                model: models_3.Medication,
                as: 'medication',
                required: false,
                attributes: [
                    'id',
                    'name',
                    'genericName',
                    'manufacturer',
                    'dosageForm',
                    'strength',
                ],
                where: query.search
                    ? {
                        [sequelize_2.Op.or]: [
                            { name: { [sequelize_2.Op.iLike]: `%${query.search}%` } },
                            { genericName: { [sequelize_2.Op.iLike]: `%${query.search}%` } },
                            { manufacturer: { [sequelize_2.Op.iLike]: `%${query.search}%` } },
                        ],
                    }
                    : undefined,
            },
            {
                model: models_2.Student,
                as: 'student',
                required: false,
                attributes: ['id', 'studentNumber', 'firstName', 'lastName'],
                where: query.search
                    ? {
                        [sequelize_2.Op.or]: [
                            { firstName: { [sequelize_2.Op.iLike]: `%${query.search}%` } },
                            { lastName: { [sequelize_2.Op.iLike]: `%${query.search}%` } },
                            { studentNumber: { [sequelize_2.Op.iLike]: `%${query.search}%` } },
                        ],
                    }
                    : undefined,
            },
        ];
        const { rows: medications, count: total } = await this.studentMedicationModel.findAndCountAll({
            where,
            offset: ((query.page || 1) - 1) * (query.limit || 20),
            limit: query.limit || 20,
            order: [['createdAt', 'DESC']],
            include,
            distinct: true,
            subQuery: false,
        });
        return { medications, total };
    }
    async findById(id) {
        const medications = await this.queryCacheService.findWithCache(this.studentMedicationModel, {
            where: { id },
            include: [
                { model: models_3.Medication, as: 'medication' },
                { model: models_2.Student, as: 'student' },
            ],
        }, {
            ttl: 1800,
            keyPrefix: 'medication_id',
            invalidateOn: ['update', 'destroy'],
        });
        return medications.length > 0 ? medications[0] : null;
    }
    async findByStudent(studentId, page = 1, limit = 20) {
        const { rows: medications, count: total } = await this.studentMedicationModel.findAndCountAll({
            where: { studentId },
            offset: (page - 1) * limit,
            limit,
            order: [['createdAt', 'DESC']],
            include: [{ model: models_3.Medication, as: 'medication' }],
        });
        return { medications, total };
    }
    async create(data) {
        const medicationData = {
            studentId: data.studentId,
            medicationId: data.medicationId,
            dosage: data.dosage,
            frequency: data.frequency,
            route: data.route,
            instructions: data.instructions,
            startDate: data.startDate,
            endDate: data.endDate,
            prescribedBy: data.prescribedBy,
            prescriptionNumber: data.prescriptionNumber,
            refillsRemaining: data.refillsRemaining || 0,
            createdBy: data.createdBy,
            isActive: true,
        };
        return this.studentMedicationModel.create(medicationData);
    }
    async update(id, data) {
        const medication = await this.studentMedicationModel.findByPk(id);
        if (!medication) {
            throw new Error('Medication not found');
        }
        await medication.update(data);
        return medication.reload({
            include: [
                { model: models_3.Medication, as: 'medication' },
                { model: models_2.Student, as: 'student' },
            ],
        });
    }
    async deactivate(id, _reason, _deactivationType) {
        const medication = await this.studentMedicationModel.findByPk(id);
        if (!medication) {
            throw new Error('Medication not found');
        }
        medication.isActive = false;
        medication.endDate = new Date();
        await medication.save();
        return medication.reload({
            include: [
                { model: models_3.Medication, as: 'medication' },
                { model: models_2.Student, as: 'student' },
            ],
        });
    }
    async activate(id) {
        const medication = await this.studentMedicationModel.findByPk(id);
        if (!medication) {
            throw new Error('Medication not found');
        }
        medication.isActive = true;
        medication.endDate = undefined;
        await medication.save();
        return medication.reload({
            include: [
                { model: models_3.Medication, as: 'medication' },
                { model: models_2.Student, as: 'student' },
            ],
        });
    }
    async exists(id) {
        const count = await this.studentMedicationModel.count({
            where: { id },
        });
        return count > 0;
    }
    async getMedicationCatalog() {
        return await this.queryCacheService.findWithCache(this.medicationModel, {
            where: { isActive: true },
            order: [['name', 'ASC']],
            attributes: [
                'id',
                'name',
                'genericName',
                'type',
                'manufacturer',
                'dosageForm',
                'strength',
            ],
        }, {
            ttl: 3600,
            keyPrefix: 'medication_catalog',
            invalidateOn: ['create', 'update', 'destroy'],
        });
    }
    async findByIds(ids) {
        try {
            const medications = await this.studentMedicationModel.findAll({
                where: {
                    id: { [sequelize_2.Op.in]: ids },
                },
                include: [
                    { model: models_3.Medication, as: 'medication' },
                    { model: models_2.Student, as: 'student' },
                ],
            });
            const medicationMap = new Map(medications.map((m) => [m.id, m]));
            return ids.map((id) => medicationMap.get(id) || null);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to batch fetch medications: ${message}`);
            throw new Error('Failed to batch fetch medications');
        }
    }
    async findByStudentIds(studentIds) {
        try {
            const medications = await this.studentMedicationModel.findAll({
                where: {
                    studentId: { [sequelize_2.Op.in]: studentIds },
                    isActive: true,
                },
                include: [{ model: models_3.Medication, as: 'medication' }],
                order: [['createdAt', 'DESC']],
            });
            const medicationsByStudent = new Map();
            medications.forEach((medication) => {
                const studentId = medication.studentId;
                if (studentId) {
                    if (!medicationsByStudent.has(studentId)) {
                        medicationsByStudent.set(studentId, []);
                    }
                    medicationsByStudent.get(studentId).push(medication);
                }
            });
            return studentIds.map((id) => medicationsByStudent.get(id) || []);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to batch fetch medications by student IDs: ${message}`);
            throw new Error('Failed to batch fetch medications by student IDs');
        }
    }
};
exports.MedicationRepository = MedicationRepository;
exports.MedicationRepository = MedicationRepository = MedicationRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.StudentMedication)),
    __param(1, (0, sequelize_1.InjectModel)(models_3.Medication)),
    __metadata("design:paramtypes", [Object, Object, query_cache_service_1.QueryCacheService])
], MedicationRepository);
//# sourceMappingURL=medication.repository.js.map