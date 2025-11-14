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
exports.ApiKeyAuthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_key_auth_service_1 = require("./api-key-auth.service");
const api_key_response_dto_1 = require("./dto/api-key-response.dto");
const create_api_key_dto_1 = require("./dto/create-api-key.dto");
const jwt_auth_guard_1 = require("../services/auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../services/auth/decorators/roles.decorator");
const roles_guard_1 = require("../services/auth/guards/roles.guard");
const models_1 = require("../database/models");
const base_1 = require("../common/base");
let ApiKeyAuthController = class ApiKeyAuthController extends base_1.BaseController {
    apiKeyAuthService;
    constructor(apiKeyAuthService) {
        super();
        this.apiKeyAuthService = apiKeyAuthService;
    }
    async generateApiKey(createDto, req) {
        return this.apiKeyAuthService.generateApiKey(createDto, req.user.id);
    }
    async listApiKeys(req) {
        return this.apiKeyAuthService.listApiKeys(req.user.id);
    }
    async rotateApiKey(id, req) {
        return this.apiKeyAuthService.rotateApiKey(id, req.user.id);
    }
    async revokeApiKey(id, req) {
        return this.apiKeyAuthService.revokeApiKey(id, req.user.id);
    }
};
exports.ApiKeyAuthController = ApiKeyAuthController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(models_1.UserRole.ADMIN, models_1.UserRole.DISTRICT_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a new API key' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'API key generated successfully',
        type: api_key_response_dto_1.ApiKeyResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: require("./dto/api-key-response.dto").ApiKeyResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_api_key_dto_1.CreateApiKeyDto, Object]),
    __metadata("design:returntype", Promise)
], ApiKeyAuthController.prototype, "generateApiKey", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(models_1.UserRole.ADMIN, models_1.UserRole.DISTRICT_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'List all API keys for current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'API keys retrieved successfully' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiKeyAuthController.prototype, "listApiKeys", null);
__decorate([
    (0, common_1.Post)(':id/rotate'),
    (0, roles_decorator_1.Roles)(models_1.UserRole.ADMIN, models_1.UserRole.DISTRICT_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Rotate an API key (create new, revoke old)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'API key rotated successfully',
        type: api_key_response_dto_1.ApiKeyResponseDto,
    }),
    openapi.ApiResponse({ status: 201, type: require("./dto/api-key-response.dto").ApiKeyResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiKeyAuthController.prototype, "rotateApiKey", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(models_1.UserRole.ADMIN, models_1.UserRole.DISTRICT_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Revoke an API key' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'API key revoked successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiKeyAuthController.prototype, "revokeApiKey", null);
exports.ApiKeyAuthController = ApiKeyAuthController = __decorate([
    (0, swagger_1.ApiTags)('API Key Management'),
    (0, common_1.Controller)('api-keys'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [api_key_auth_service_1.ApiKeyAuthService])
], ApiKeyAuthController);
//# sourceMappingURL=api-key-auth.controller.js.map