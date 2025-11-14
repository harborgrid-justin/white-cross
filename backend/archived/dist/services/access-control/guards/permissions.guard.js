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
var PermissionsGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
const public_decorator_1 = require("../decorators/public.decorator");
const access_control_service_1 = require("../access-control.service");
let PermissionsGuard = PermissionsGuard_1 = class PermissionsGuard {
    reflector;
    accessControlService;
    logger = new common_1.Logger(PermissionsGuard_1.name);
    constructor(reflector, accessControlService) {
        this.reflector = reflector;
        this.accessControlService = accessControlService;
    }
    async canActivate(context) {
        const startTime = Date.now();
        const handler = context.getHandler().name;
        const controller = context.getClass().name;
        try {
            const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
            if (isPublic) {
                this.logger.debug('Public route - skipping permission check', {
                    handler,
                    controller,
                });
                return true;
            }
            const requiredPermission = this.reflector.getAllAndOverride(permissions_decorator_1.PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
            if (!requiredPermission) {
                this.logger.debug('No permissions required - allowing access', {
                    handler,
                    controller,
                });
                return true;
            }
            const request = context.switchToHttp().getRequest();
            const user = request.user;
            if (!user || !user.id) {
                this.logger.warn('Authorization failed: No authenticated user', {
                    handler,
                    controller,
                    requiredPermission,
                });
                throw new common_1.ForbiddenException({
                    message: 'Access denied',
                    reason: 'no_authenticated_user',
                    resource: handler,
                });
            }
            const hasPermission = await this.accessControlService.checkPermission(user.id, requiredPermission.resource, requiredPermission.action);
            const duration = Date.now() - startTime;
            if (!hasPermission) {
                this.logger.warn('Authorization failed: Insufficient permissions', {
                    userId: user.id,
                    requiredPermission,
                    handler,
                    controller,
                    duration,
                });
                throw new common_1.ForbiddenException({
                    message: 'Access denied: Insufficient permissions',
                    reason: 'insufficient_permissions',
                    required: `${requiredPermission.resource}:${requiredPermission.action}`,
                    resource: handler,
                });
            }
            this.logger.debug('Authorization successful', {
                userId: user.id,
                permission: `${requiredPermission.resource}:${requiredPermission.action}`,
                handler,
                controller,
                duration,
            });
            if (duration > 100) {
                this.logger.warn('Slow permissions guard execution', {
                    duration,
                    handler,
                    controller,
                });
            }
            return true;
        }
        catch (error) {
            const duration = Date.now() - startTime;
            if (error instanceof common_1.ForbiddenException) {
                throw error;
            }
            this.logger.error('Permissions guard execution failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                handler,
                controller,
                duration,
            });
            throw new common_1.ForbiddenException('Authorization service unavailable');
        }
    }
};
exports.PermissionsGuard = PermissionsGuard;
exports.PermissionsGuard = PermissionsGuard = PermissionsGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        access_control_service_1.AccessControlService])
], PermissionsGuard);
//# sourceMappingURL=permissions.guard.js.map