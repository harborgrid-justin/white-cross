"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const common_1 = require("@nestjs/common");
const project_baseline_model_1 = require("./models/project-baseline.model");
const change_order_model_1 = require("./models/change-order.model");
const project_types_1 = require("./types/project.types");
const uuid_1 = require("uuid");
let ProjectService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ProjectService = _classThis = class {
        constructor(sequelize, projectModel, baselineModel, changeOrderModel) {
            this.sequelize = sequelize;
            this.projectModel = projectModel;
            this.baselineModel = baselineModel;
            this.changeOrderModel = changeOrderModel;
            this.logger = new common_1.Logger(ProjectService.name);
        }
        /**
         * Generates a unique, human-readable project number.
         * @param districtCode - The district code for the project.
         * @returns A project number string.
         */
        generateConstructionProjectNumber(districtCode) {
            const year = new Date().getFullYear();
            const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            return `${districtCode.toUpperCase()}-${year}-C-${sequence}`;
        }
        /**
         * Creates a new construction project.
         * @param createDto - Data for creating the project.
         * @param userId - The ID of the user creating the project.
         * @returns The created project instance.
         */
        async createProject(createDto, userId) {
            const projectNumber = this.generateConstructionProjectNumber(createDto.districtCode || 'GEN');
            const forecastedCost = createDto.totalBudget;
            const contingencyReserve = createDto.totalBudget * 0.1; // 10% default
            const managementReserve = createDto.totalBudget * 0.05; // 5% default
            this.logger.log(`Creating project ${projectNumber}: ${createDto.projectName}`);
            const project = await this.projectModel.create({
                ...createDto,
                projectNumber,
                status: project_types_1.ConstructionProjectStatus.PRE_PLANNING,
                currentPhase: project_types_1.ProjectPhase.INITIATION,
                forecastedCost,
                contingencyReserve,
                managementReserve,
                createdBy: userId,
                updatedBy: userId,
            });
            return project;
        }
        /**
         * Retrieves a single project by its ID.
         * @param id - The UUID of the project.
         * @returns The project instance.
         * @throws NotFoundException if the project does not exist.
         */
        async getProjectById(id) {
            const project = await this.projectModel.findByPk(id, {
                include: [project_baseline_model_1.ProjectBaseline, change_order_model_1.ChangeOrder],
            });
            if (!project) {
                this.logger.warn(`Project with ID ${id} not found.`);
                throw new common_1.NotFoundException(`Project with ID ${id} not found`);
            }
            return project;
        }
        /**
         * Updates a project's progress and recalculates earned value.
         * @param id - The project's ID.
         * @param updateDto - The progress data.
         * @param userId - The ID of the user updating the project.
         * @returns The updated project instance.
         */
        async updateProjectProgress(id, updateDto, userId) {
            const project = await this.getProjectById(id);
            const earnedValue = (project.totalBudget * updateDto.progressPercentage) / 100;
            // Note: A real plannedValue calculation would be more complex, likely based on schedule.
            const plannedValue = project.plannedValue;
            project.progressPercentage = updateDto.progressPercentage;
            project.actualCost = updateDto.actualCost;
            project.earnedValue = earnedValue;
            project.plannedValue = plannedValue; // Placeholder for now
            project.updatedBy = userId;
            await project.save();
            this.logger.log(`Updated progress for project ${id}. New percentage: ${project.progressPercentage}%`);
            return project;
        }
        /**
         * Creates a new baseline for a project.
         * @param createDto - Data for the new baseline.
         * @param userId - The ID of the user creating the baseline.
         * @returns The created baseline instance.
         */
        async createProjectBaseline(createDto, userId) {
            // Ensure project exists
            await this.getProjectById(createDto.projectId);
            const baselineNumber = `BL-${createDto.projectId.substring(0, 4)}-${Date.now()}`;
            const baseline = await this.baselineModel.create({
                ...createDto,
                id: (0, uuid_1.generate)(),
                baselineNumber,
                approvedBy: userId,
            });
            this.logger.log(`Created baseline ${baselineNumber} for project ${createDto.projectId}`);
            return baseline;
        }
        /**
         * Creates a new change order for a project.
         * @param createDto - Data for the new change order.
         * @param userId - The ID of the user creating the change order.
         * @returns The created change order instance.
         */
        async createChangeOrder(createDto, userId) {
            await this.getProjectById(createDto.projectId);
            const changeOrderNumber = `CO-${createDto.projectId.substring(0, 4)}-${Date.now()}`;
            const changeOrder = await this.changeOrderModel.create({
                ...createDto,
                id: (0, uuid_1.generate)(),
                changeOrderNumber,
                requestedBy: userId,
            });
            this.logger.log(`Created change order ${changeOrderNumber} for project ${createDto.projectId}`);
            return changeOrder;
        }
        /**
         * Calculates and returns key EVM metrics for a project.
         * @param projectId - The ID of the project to analyze.
         * @returns An object containing the project's performance metrics.
         */
        async calculateProjectEVM(projectId) {
            const project = await this.getProjectById(projectId);
            const { earnedValue, plannedValue, actualCost, totalBudget: budgetAtCompletion } = project;
            const scheduleVariance = earnedValue - plannedValue;
            const costVariance = earnedValue - actualCost;
            const schedulePerformanceIndex = plannedValue > 0 ? earnedValue / plannedValue : 1;
            const costPerformanceIndex = actualCost > 0 ? earnedValue / actualCost : 1;
            const estimateAtCompletion = costPerformanceIndex > 0 ? budgetAtCompletion / costPerformanceIndex : budgetAtCompletion;
            const estimateToComplete = estimateAtCompletion - actualCost;
            const varianceAtCompletion = budgetAtCompletion - estimateAtCompletion;
            const toCompletePerformanceIndex = (budgetAtCompletion - earnedValue) / (estimateAtCompletion - actualCost);
            return {
                projectId,
                schedulePerformanceIndex,
                costPerformanceIndex,
                scheduleVariance,
                costVariance,
                estimateAtCompletion,
                estimateToComplete,
                varianceAtCompletion,
                toCompletePerformanceIndex,
                earnedValue,
                plannedValue,
                actualCost,
                budgetAtCompletion,
            };
        }
        /**
         * Generates a comprehensive status report for a project.
         * @param projectId - The ID of the project.
         * @returns A detailed status report object.
         */
        async generateProjectStatusReport(projectId) {
            const project = await this.getProjectById(projectId);
            const performanceMetrics = await this.calculateProjectEVM(projectId);
            const changeOrders = await this.changeOrderModel.findAll({ where: { projectId } });
            return {
                project: project.toJSON(),
                performanceMetrics,
                changeOrderSummary: {
                    totalChangeOrders: changeOrders.length,
                    approvedChangeOrders: changeOrders.filter((co) => co.status === 'APPROVED').length,
                    totalCostImpact: changeOrders.reduce((sum, co) => sum + co.costImpact, 0),
                    totalScheduleImpact: changeOrders.reduce((sum, co) => sum + co.scheduleImpact, 0),
                },
                reportDate: new Date(),
            };
        }
    };
    __setFunctionName(_classThis, "ProjectService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProjectService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProjectService = _classThis;
})();
exports.ProjectService = ProjectService;
//# sourceMappingURL=project.service.js.map