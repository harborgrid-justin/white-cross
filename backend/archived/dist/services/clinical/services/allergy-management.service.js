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
exports.AllergyManagementService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const student_drug_allergy_model_1 = require("../../../database/models/student-drug-allergy.model");
const drug_catalog_service_1 = require("./drug-catalog.service");
const base_1 = require("../../../common/base");
let AllergyManagementService = class AllergyManagementService extends base_1.BaseService {
    studentDrugAllergyModel;
    drugCatalogService;
    constructor(studentDrugAllergyModel, drugCatalogService) {
        super("AllergyManagementService");
        this.studentDrugAllergyModel = studentDrugAllergyModel;
        this.drugCatalogService = drugCatalogService;
    }
    async addAllergy(data) {
        this.logInfo(`Adding allergy for student ${data.studentId}`);
        await this.drugCatalogService.getDrugById(data.drugId);
        const existing = await this.studentDrugAllergyModel.findOne({
            where: {
                studentId: data.studentId,
                drugId: data.drugId,
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Allergy already recorded for this student and drug');
        }
        return this.studentDrugAllergyModel.create(data);
    }
    async updateAllergy(id, updates) {
        const allergy = await this.studentDrugAllergyModel.findByPk(id);
        if (!allergy) {
            throw new common_1.NotFoundException('Allergy not found');
        }
        Object.assign(allergy, updates);
        await allergy.save();
        return allergy;
    }
    async deleteAllergy(id) {
        const deletedCount = await this.studentDrugAllergyModel.destroy({
            where: { id },
        });
        if (deletedCount === 0) {
            throw new common_1.NotFoundException('Allergy not found');
        }
        this.logInfo(`Deleted allergy ${id}`);
    }
    async getStudentAllergies(studentId) {
        return this.studentDrugAllergyModel.findAll({
            where: { studentId },
            include: [{ model: this.drugCatalogService['drugCatalogModel'], as: 'drug' }],
            order: [['diagnosedDate', 'DESC']],
        });
    }
    async getAllergyById(id) {
        const allergy = await this.studentDrugAllergyModel.findByPk(id, {
            include: [{ model: this.drugCatalogService['drugCatalogModel'], as: 'drug' }],
        });
        if (!allergy) {
            throw new common_1.NotFoundException('Allergy not found');
        }
        return allergy;
    }
    async getAllergiesByDrug(drugId) {
        return this.studentDrugAllergyModel.findAll({
            where: { drugId },
            include: [{ model: this.drugCatalogService['drugCatalogModel'], as: 'drug' }],
            order: [['diagnosedDate', 'DESC']],
        });
    }
    async getAllergiesBySeverity(severity) {
        return this.studentDrugAllergyModel.findAll({
            where: { severity },
            include: [{ model: this.drugCatalogService['drugCatalogModel'], as: 'drug' }],
            order: [['diagnosedDate', 'DESC']],
        });
    }
    async getCriticalAllergies() {
        return this.studentDrugAllergyModel.findAll({
            where: {
                severity: ['SEVERE', 'LIFE_THREATENING'],
            },
            include: [{ model: this.drugCatalogService['drugCatalogModel'], as: 'drug' }],
            order: [['diagnosedDate', 'DESC']],
        });
    }
    async studentHasAllergyToDrug(studentId, drugId) {
        const allergy = await this.studentDrugAllergyModel.findOne({
            where: {
                studentId,
                drugId,
            },
        });
        return !!allergy;
    }
    async getAllergyStatistics() {
        const allergies = await this.studentDrugAllergyModel.findAll({
            include: [{ model: this.drugCatalogService['drugCatalogModel'], as: 'drug' }],
        });
        const bySeverity = {};
        const drugCounts = new Map();
        const studentCounts = new Map();
        for (const allergy of allergies) {
            bySeverity[allergy.severity] = (bySeverity[allergy.severity] || 0) + 1;
            if (allergy.drug) {
                const drugKey = allergy.drugId;
                const existing = drugCounts.get(drugKey);
                if (existing) {
                    existing.count++;
                }
                else {
                    drugCounts.set(drugKey, {
                        drugId: allergy.drugId,
                        drugName: allergy.drug.genericName,
                        count: 1,
                    });
                }
            }
            const studentKey = allergy.studentId;
            studentCounts.set(studentKey, (studentCounts.get(studentKey) || 0) + 1);
        }
        const byDrug = Array.from(drugCounts.values())
            .sort((a, b) => b.count - a.count)
            .map(item => ({
            drugId: item.drugId,
            drugName: item.drugName,
            allergyCount: item.count,
        }));
        const byStudent = Array.from(studentCounts.entries())
            .sort(([, a], [, b]) => b - a)
            .map(([studentId, count]) => ({
            studentId,
            allergyCount: count,
        }));
        return {
            totalAllergies: allergies.length,
            bySeverity,
            byDrug,
            byStudent,
        };
    }
    async bulkUpdateAllergySeverity(drugId, oldSeverity, newSeverity) {
        const [affectedRows] = await this.studentDrugAllergyModel.update({ severity: newSeverity }, {
            where: {
                drugId,
                severity: oldSeverity,
            },
        });
        this.logInfo(`Updated ${affectedRows} allergies for drug ${drugId} from ${oldSeverity} to ${newSeverity}`);
        return affectedRows;
    }
    async removeAllStudentAllergies(studentId) {
        const deletedCount = await this.studentDrugAllergyModel.destroy({
            where: { studentId },
        });
        this.logInfo(`Removed ${deletedCount} allergies for student ${studentId}`);
        return deletedCount;
    }
    async getAllergiesByDateRange(startDate, endDate) {
        return this.studentDrugAllergyModel.findAll({
            where: {
                diagnosedDate: {
                    [this.studentDrugAllergyModel.sequelize.Op.between]: [startDate, endDate],
                },
            },
            include: [{ model: this.drugCatalogService['drugCatalogModel'], as: 'drug' }],
            order: [['diagnosedDate', 'DESC']],
        });
    }
};
exports.AllergyManagementService = AllergyManagementService;
exports.AllergyManagementService = AllergyManagementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(student_drug_allergy_model_1.StudentDrugAllergy)),
    __metadata("design:paramtypes", [Object, drug_catalog_service_1.DrugCatalogService])
], AllergyManagementService);
//# sourceMappingURL=allergy-management.service.js.map