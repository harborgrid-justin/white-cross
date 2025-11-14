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
exports.VaccinationsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const vaccinations_service_1 = require("./vaccinations.service");
const base_1 = require("../../common/base");
let VaccinationsController = class VaccinationsController extends base_1.BaseController {
    vaccinationsService;
    constructor(vaccinationsService) {
        super();
        this.vaccinationsService = vaccinationsService;
    }
    async getDueVaccinations(query) {
        const { status = 'due', ...otherQuery } = query;
        const statusString = typeof status === 'string' ? status : 'due';
        const statuses = statusString.split(',').map((s) => s.trim().toLowerCase());
        return this.vaccinationsService.getVaccinationsByStatus(statuses, otherQuery);
    }
    async getOverdueVaccinations(query) {
        return this.vaccinationsService.getOverdueVaccinations(query);
    }
};
exports.VaccinationsController = VaccinationsController;
__decorate([
    (0, common_1.Get)('due'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get due and overdue vaccinations',
        description: 'Returns list of vaccinations based on status query parameter. Supports "due", "overdue", or "due,overdue" for combined results.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Vaccinations retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VaccinationsController.prototype, "getDueVaccinations", null);
__decorate([
    (0, common_1.Get)('overdue'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all overdue vaccinations',
        description: 'Returns list of all vaccinations that are overdue across all students.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Overdue vaccinations retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VaccinationsController.prototype, "getOverdueVaccinations", null);
exports.VaccinationsController = VaccinationsController = __decorate([
    (0, swagger_1.ApiTags)('vaccinations'),
    (0, common_1.Controller)('vaccinations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [vaccinations_service_1.VaccinationsService])
], VaccinationsController);
//# sourceMappingURL=vaccinations.controller.js.map