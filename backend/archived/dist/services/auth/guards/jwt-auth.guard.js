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
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const core_1 = require("@nestjs/core");
const public_decorator_1 = require("../decorators/public.decorator");
const token_blacklist_service_1 = require("../services/token-blacklist.service");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    reflector;
    tokenBlacklistService;
    constructor(reflector, tokenBlacklistService) {
        super();
        this.reflector = reflector;
        this.tokenBlacklistService = tokenBlacklistService;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        const result = await super.canActivate(context);
        if (!result) {
            return false;
        }
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (token && this.tokenBlacklistService) {
            const isBlacklisted = await this.tokenBlacklistService.isTokenBlacklisted(token);
            if (isBlacklisted) {
                throw new common_1.UnauthorizedException('Token has been revoked');
            }
            const user = request.user;
            if (user && user.id) {
                const tokenPayload = this.decodeToken(token);
                if (tokenPayload && tokenPayload.iat) {
                    const userTokensBlacklisted = await this.tokenBlacklistService.areUserTokensBlacklisted(user.id, tokenPayload.iat);
                    if (userTokensBlacklisted) {
                        throw new common_1.UnauthorizedException('Session invalidated. Please login again.');
                    }
                }
            }
        }
        return true;
    }
    handleRequest(err, user, info, context, status) {
        if (err || !user) {
            throw err || new common_1.UnauthorizedException('Authentication required');
        }
        return user;
    }
    extractTokenFromHeader(request) {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.substring(7);
    }
    decodeToken(token) {
        try {
            const base64Payload = token.split('.')[1];
            const payload = Buffer.from(base64Payload, 'base64').toString();
            return JSON.parse(payload);
        }
        catch {
            return null;
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [core_1.Reflector,
        token_blacklist_service_1.TokenBlacklistService])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map