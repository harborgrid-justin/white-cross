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
exports.CacheWarmingService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const schedule_1 = require("@nestjs/schedule");
const sequelize_2 = require("sequelize");
const health_data_cache_service_1 = require("./health-data-cache.service");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const models_3 = require("../../database/models");
const models_4 = require("../../database/models");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
let CacheWarmingService = class CacheWarmingService extends base_1.BaseService {
    cacheService;
    studentModel;
    vaccinationModel;
    allergyModel;
    chronicConditionModel;
    isWarming = false;
    constructor(logger, cacheService, studentModel, vaccinationModel, allergyModel, chronicConditionModel) {
        super({
            serviceName: 'CacheWarmingService',
            logger,
            enableAuditLogging: false,
        });
        this.cacheService = cacheService;
        this.studentModel = studentModel;
        this.vaccinationModel = vaccinationModel;
        this.allergyModel = allergyModel;
        this.chronicConditionModel = chronicConditionModel;
    }
    async onModuleInit() {
        const warmingEnabled = process.env.CACHE_WARMING_ENABLED === 'true';
        if (warmingEnabled) {
            this.logInfo('Cache warming enabled - initial warm starting');
            setTimeout(() => this.warmCriticalData(), 5000);
        }
        else {
            this.logInfo('Cache warming disabled');
        }
    }
    async scheduledCacheWarming() {
        const warmingEnabled = process.env.CACHE_WARMING_ENABLED === 'true';
        if (!warmingEnabled || this.isWarming) {
            return;
        }
        await this.warmCriticalData();
    }
    async warmCriticalData() {
        if (this.isWarming) {
            this.logWarning('Cache warming already in progress, skipping');
            return;
        }
        this.isWarming = true;
        const startTime = Date.now();
        try {
            this.logInfo('Starting cache warming for critical health data');
            const [activeStudentsWarmed, allergiesWarmed, chronicConditionsWarmed, vaccinationsWarmed,] = await Promise.all([
                this.warmActiveStudents(),
                this.warmCriticalAllergies(),
                this.warmActiveChronicConditions(),
                this.warmRecentVaccinations(),
            ]);
            const duration = Date.now() - startTime;
            this.logInfo(`Cache warming completed in ${duration}ms: ` +
                `${activeStudentsWarmed} students, ` +
                `${allergiesWarmed} allergies, ` +
                `${chronicConditionsWarmed} conditions, ` +
                `${vaccinationsWarmed} vaccinations`);
        }
        catch (error) {
            this.logError('Error during cache warming:', error);
        }
        finally {
            this.isWarming = false;
        }
    }
    async warmActiveStudents() {
        try {
            const students = await this.studentModel.findAll({
                where: {
                    isActive: true,
                },
                attributes: ['id'],
                limit: 500,
                order: [['updatedAt', 'DESC']],
            });
            let warmedCount = 0;
            const batchSize = 50;
            for (let i = 0; i < students.length; i += batchSize) {
                const batch = students.slice(i, i + batchSize);
                await Promise.all(batch.map(async (student) => {
                    try {
                        await this.warmStudentHealthData(student.id);
                        warmedCount++;
                    }
                    catch (error) {
                        this.logError(`Error warming cache for student ${student.id}:`, error);
                    }
                }));
            }
            return warmedCount;
        }
        catch (error) {
            this.logError('Error warming active students cache:', error);
            return 0;
        }
    }
    async warmStudentHealthData(studentId) {
        try {
            const [vaccinations, allergies, chronicConditions] = await Promise.all([
                this.vaccinationModel.findAll({
                    where: { studentId },
                    order: [['administrationDate', 'DESC']],
                    limit: 50,
                }),
                this.allergyModel.findAll({
                    where: { studentId, active: true },
                    order: [['diagnosedDate', 'DESC']],
                }),
                this.chronicConditionModel.findAll({
                    where: { studentId, status: 'ACTIVE' },
                    order: [['diagnosedDate', 'DESC']],
                }),
            ]);
            await Promise.all([
                this.cacheService.cacheVaccinations(studentId, vaccinations),
                this.cacheService.cacheAllergies(studentId, allergies),
                this.cacheService.cacheChronicConditions(studentId, chronicConditions),
            ]);
            const healthSummary = {
                studentId,
                vaccinationCount: vaccinations.length,
                allergyCount: allergies.length,
                chronicConditionCount: chronicConditions.length,
                hasLifeThreateningAllergy: allergies.some((a) => a.severity === 'LIFE_THREATENING'),
                latestVaccination: vaccinations[0]?.administrationDate,
                updatedAt: new Date(),
            };
            await this.cacheService.cacheStudentHealthSummary(studentId, healthSummary);
        }
        catch (error) {
            this.logError(`Error warming health data for student ${studentId}:`, error);
            throw error;
        }
    }
    async warmCriticalAllergies() {
        try {
            const criticalAllergies = await this.allergyModel.findAll({
                where: {
                    active: true,
                    severity: {
                        [sequelize_2.Op.in]: ['SEVERE', 'LIFE_THREATENING'],
                    },
                },
                include: [
                    {
                        model: models_1.Student,
                        as: 'student',
                        where: { isActive: true },
                        attributes: ['id'],
                        required: true,
                    },
                ],
                attributes: ['studentId', 'allergen', 'severity'],
            });
            const allergyMap = new Map();
            criticalAllergies.forEach((allergy) => {
                const studentId = allergy.studentId;
                if (!allergyMap.has(studentId)) {
                    allergyMap.set(studentId, []);
                }
                allergyMap.get(studentId)?.push(allergy);
            });
            await Promise.all(Array.from(allergyMap.entries()).map(([studentId, allergies]) => this.cacheService.cacheAllergies(studentId, allergies)));
            return allergyMap.size;
        }
        catch (error) {
            this.logError('Error warming critical allergies cache:', error);
            return 0;
        }
    }
    async warmActiveChronicConditions() {
        try {
            const activeConditions = await this.chronicConditionModel.findAll({
                where: {
                    status: 'ACTIVE',
                    isActive: true,
                },
                include: [
                    {
                        model: models_1.Student,
                        as: 'student',
                        where: { isActive: true },
                        attributes: ['id'],
                        required: true,
                    },
                ],
                attributes: ['studentId', 'condition', 'severity', 'carePlan'],
            });
            const conditionMap = new Map();
            activeConditions.forEach((condition) => {
                const studentId = condition.studentId;
                if (!conditionMap.has(studentId)) {
                    conditionMap.set(studentId, []);
                }
                conditionMap.get(studentId)?.push(condition);
            });
            await Promise.all(Array.from(conditionMap.entries()).map(([studentId, conditions]) => this.cacheService.cacheChronicConditions(studentId, conditions)));
            return conditionMap.size;
        }
        catch (error) {
            this.logError('Error warming chronic conditions cache:', error);
            return 0;
        }
    }
    async warmRecentVaccinations() {
        try {
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            const recentVaccinations = await this.vaccinationModel.findAll({
                where: {
                    administrationDate: {
                        [sequelize_2.Op.gte]: sixMonthsAgo,
                    },
                },
                include: [
                    {
                        model: models_1.Student,
                        as: 'student',
                        where: { isActive: true },
                        attributes: ['id'],
                        required: true,
                    },
                ],
                order: [['administrationDate', 'DESC']],
            });
            const vaccinationMap = new Map();
            recentVaccinations.forEach((vaccination) => {
                const studentId = vaccination.studentId;
                if (!vaccinationMap.has(studentId)) {
                    vaccinationMap.set(studentId, []);
                }
                vaccinationMap.get(studentId)?.push(vaccination);
            });
            await Promise.all(Array.from(vaccinationMap.entries()).map(([studentId, vaccinations]) => this.cacheService.cacheVaccinations(studentId, vaccinations)));
            return vaccinationMap.size;
        }
        catch (error) {
            this.logError('Error warming vaccinations cache:', error);
            return 0;
        }
    }
    async warmStudent(studentId) {
        try {
            await this.warmStudentHealthData(studentId);
            this.logInfo(`Cache warmed for student ${studentId}`);
            return true;
        }
        catch (error) {
            this.logError(`Failed to warm cache for student ${studentId}:`, error);
            return false;
        }
    }
    getWarmingStatus() {
        return {
            isWarming: this.isWarming,
            enabled: process.env.CACHE_WARMING_ENABLED === 'true',
        };
    }
};
exports.CacheWarmingService = CacheWarmingService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CacheWarmingService.prototype, "scheduledCacheWarming", null);
exports.CacheWarmingService = CacheWarmingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __param(2, (0, sequelize_1.InjectModel)(models_1.Student)),
    __param(3, (0, sequelize_1.InjectModel)(models_2.Vaccination)),
    __param(4, (0, sequelize_1.InjectModel)(models_3.Allergy)),
    __param(5, (0, sequelize_1.InjectModel)(models_4.ChronicCondition)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        health_data_cache_service_1.HealthDataCacheService, Object, Object, Object, Object])
], CacheWarmingService);
//# sourceMappingURL=cache-warming.service.js.map