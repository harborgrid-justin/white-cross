"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const project_model_1 = require("./models/project.model");
let ProjectController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Construction Projects'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.Controller)('construction/projects'), (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true }))];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createProject_decorators;
    let _getProjectById_decorators;
    let _updateProjectProgress_decorators;
    let _createBaseline_decorators;
    let _createChangeOrder_decorators;
    let _getProjectEVM_decorators;
    let _getStatusReport_decorators;
    var ProjectController = _classThis = class {
        constructor(projectService) {
            this.projectService = (__runInitializers(this, _instanceExtraInitializers), projectService);
            this.logger = new common_1.Logger(ProjectController.name);
        }
        async createProject(createProjectDto) {
            const userId = 'temp-user-id'; // Replace with actual user from token
            this.logger.log(`User ${userId} creating project: ${createProjectDto.projectName}`);
            return this.projectService.createProject(createProjectDto, userId);
        }
        async getProjectById(id) {
            return this.projectService.getProjectById(id);
        }
        async updateProjectProgress(id, updateDto) {
            const userId = 'temp-user-id';
            this.logger.log(`User ${userId} updating progress for project ${id}`);
            return this.projectService.updateProjectProgress(id, updateDto, userId);
        }
        async createBaseline(id, createBaselineDto) {
            const userId = 'temp-user-id';
            // Ensure the DTO's projectId matches the param for consistency
            createBaselineDto.projectId = id;
            return this.projectService.createProjectBaseline(createBaselineDto, userId);
        }
        async createChangeOrder(id, createChangeOrderDto) {
            const userId = 'temp-user-id';
            createChangeOrderDto.projectId = id;
            return this.projectService.createChangeOrder(createChangeOrderDto, userId);
        }
        async getProjectEVM(id) {
            return this.projectService.calculateProjectEVM(id);
        }
        async getStatusReport(id) {
            return this.projectService.generateProjectStatusReport(id);
        }
    };
    __setFunctionName(_classThis, "ProjectController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createProject_decorators = [(0, common_1.Post)(), (0, swagger_1.ApiOperation)({ summary: 'Create a new construction project' }), (0, swagger_1.ApiResponse)({
                status: common_1.HttpStatus.CREATED,
                description: 'The project has been successfully created.',
                type: project_model_1.ConstructionProject,
            }), (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })];
        _getProjectById_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get a construction project by ID' }), (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'The project.', type: project_model_1.ConstructionProject }), (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Project not found.' })];
        _updateProjectProgress_decorators = [(0, common_1.Patch)(':id/progress'), (0, swagger_1.ApiOperation)({ summary: 'Update project progress and calculate EVM' }), (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Progress updated.', type: project_model_1.ConstructionProject }), (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Project not found.' })];
        _createBaseline_decorators = [(0, common_1.Post)(':id/baselines'), (0, swagger_1.ApiOperation)({ summary: 'Create a new baseline for a project' }), (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Baseline created.' })];
        _createChangeOrder_decorators = [(0, common_1.Post)(':id/change-orders'), (0, swagger_1.ApiOperation)({ summary: 'Create a new change order for a project' }), (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Change order created.' })];
        _getProjectEVM_decorators = [(0, common_1.Get)(':id/evm'), (0, swagger_1.ApiOperation)({ summary: 'Calculate and retrieve EVM metrics for a project' }), (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'EVM metrics calculated.' })];
        _getStatusReport_decorators = [(0, common_1.Get)(':id/status-report'), (0, swagger_1.ApiOperation)({ summary: 'Generate a comprehensive project status report' }), (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Status report generated.' })];
        __esDecorate(_classThis, null, _createProject_decorators, { kind: "method", name: "createProject", static: false, private: false, access: { has: obj => "createProject" in obj, get: obj => obj.createProject }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getProjectById_decorators, { kind: "method", name: "getProjectById", static: false, private: false, access: { has: obj => "getProjectById" in obj, get: obj => obj.getProjectById }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateProjectProgress_decorators, { kind: "method", name: "updateProjectProgress", static: false, private: false, access: { has: obj => "updateProjectProgress" in obj, get: obj => obj.updateProjectProgress }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createBaseline_decorators, { kind: "method", name: "createBaseline", static: false, private: false, access: { has: obj => "createBaseline" in obj, get: obj => obj.createBaseline }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createChangeOrder_decorators, { kind: "method", name: "createChangeOrder", static: false, private: false, access: { has: obj => "createChangeOrder" in obj, get: obj => obj.createChangeOrder }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getProjectEVM_decorators, { kind: "method", name: "getProjectEVM", static: false, private: false, access: { has: obj => "getProjectEVM" in obj, get: obj => obj.getProjectEVM }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStatusReport_decorators, { kind: "method", name: "getStatusReport", static: false, private: false, access: { has: obj => "getStatusReport" in obj, get: obj => obj.getStatusReport }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProjectController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProjectController = _classThis;
})();
exports.ProjectController = ProjectController;
//# sourceMappingURL=project.controller.js.map