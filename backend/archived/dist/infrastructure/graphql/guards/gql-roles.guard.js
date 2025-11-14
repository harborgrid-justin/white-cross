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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GqlRolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const graphql_1 = require("@nestjs/graphql");
const decorators_1 = require("../../../services/auth/decorators");
let GqlRolesGuard = class GqlRolesGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(decorators_1.ROLES_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        const ctx = graphql_1.GqlExecutionContext.create(context);
        const { user } = ctx.getContext().req;
        if (!user) {
            throw new common_1.ForbiddenException('User not authenticated');
        }
        const hasRole = requiredRoles.some((role) => user.role === role);
        if (!hasRole) {
            console.warn(`Authorization failed: User ${user.id} (role: ${user.role}) ` +
                `attempted to access resource requiring roles: ${requiredRoles.join(', ')}`);
            throw new common_1.ForbiddenException(`Insufficient permissions. Required roles: ${requiredRoles.join(', ')}`);
        }
        return true;
    }
};
exports.GqlRolesGuard = GqlRolesGuard;
exports.GqlRolesGuard = GqlRolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], GqlRolesGuard);
//# sourceMappingURL=gql-roles.guard.js.map