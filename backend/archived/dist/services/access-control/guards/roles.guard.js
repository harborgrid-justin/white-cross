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
var RolesGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const roles_decorator_1 = require("../decorators/roles.decorator");
const public_decorator_1 = require("../decorators/public.decorator");
const access_control_service_1 = require("../access-control.service");
let RolesGuard = RolesGuard_1 = class RolesGuard {
    reflector;
    accessControlService;
    logger = new common_1.Logger(RolesGuard_1.name);
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
                this.logger.debug('Public route - skipping role check', {
                    handler,
                    controller,
                });
                return true;
            }
            const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [context.getHandler(), context.getClass()]);
            if (!requiredRoles || requiredRoles.length === 0) {
                this.logger.debug('No roles required - allowing access', {
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
                    requiredRoles,
                });
                throw new common_1.ForbiddenException({
                    message: 'Access denied',
                    reason: 'no_authenticated_user',
                    resource: handler,
                });
            }
            const userPermissions = await this.accessControlService.getUserPermissions(user.id);
            const userRoles = userPermissions.roles;
            const userRoleNames = userRoles.map((role) => role.name);
            const hasRequiredRole = requiredRoles.some((requiredRole) => userRoles.some((role) => role.name === requiredRole));
            const duration = Date.now() - startTime;
            if (!hasRequiredRole) {
                this.logger.warn('Authorization failed: Insufficient roles', {
                    userId: user.id,
                    userRoles: userRoleNames,
                    requiredRoles,
                    handler,
                    controller,
                    duration,
                });
                throw new common_1.ForbiddenException({
                    message: 'Access denied: Insufficient permissions',
                    reason: 'insufficient_roles',
                    required: requiredRoles,
                    actual: userRoleNames,
                    resource: handler,
                });
            }
            this.logger.debug('Authorization successful', {
                userId: user.id,
                userRoles: userRoleNames,
                requiredRoles,
                handler,
                controller,
                duration,
            });
            if (duration > 100) {
                this.logger.warn('Slow roles guard execution', {
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
            this.logger.error('Roles guard execution failed', {
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
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = RolesGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        access_control_service_1.AccessControlService])
], RolesGuard);
//# sourceMappingURL=roles.guard.js.map